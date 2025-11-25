"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, AlertCircle, Shield, Hospital, Building2, HeartHandshake, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface DangerZone {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
  riskLevel: string;
  crimeRate: number;
  description: string;
  distance?: number;
}

interface SafetyResource {
  id: number;
  type: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  phone: string;
  available247: boolean;
  distance?: number;
}

interface AreaSafetyScore {
  id: number;
  areaName: string;
  latitude: number;
  longitude: number;
  safetyScore: number;
  crimeRate: number;
  crowdDensity: string;
  recentIncidents: number;
  distance?: number;
}

export default function SafetyMapPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [dangerZones, setDangerZones] = useState<DangerZone[]>([]);
  const [safetyResources, setSafetyResources] = useState<SafetyResource[]>([]);
  const [safetyScores, setSafetyScores] = useState<AreaSafetyScore[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login?redirect=/safety-map");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (session?.user) {
      getUserLocation();
      loadSafetyData();
    }
  }, [session]);

  const getUserLocation = () => {
    setIsLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(location);
          trackLocation(location);
          loadNearbyData(location);
          setIsLoadingLocation(false);
        },
        (error) => {
          console.error("Location error:", error);
          toast.error("Unable to get your location. Using default view.");
          setIsLoadingLocation(false);
        }
      );
    } else {
      toast.error("Geolocation not supported");
      setIsLoadingLocation(false);
    }
  };

  const trackLocation = async (location: { lat: number; lng: number }) => {
    try {
      const token = localStorage.getItem("bearer_token");
      await fetch("/api/locations/track", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          latitude: location.lat,
          longitude: location.lng,
          accuracy: 10,
        }),
      });
    } catch (error) {
      console.error("Failed to track location:", error);
    }
  };

  const loadSafetyData = async () => {
    try {
      const token = localStorage.getItem("bearer_token");
      
      const [zonesRes, scoresRes] = await Promise.all([
        fetch("/api/danger-zones", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/safety-scores", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (zonesRes.ok) {
        const zones = await zonesRes.json();
        setDangerZones(zones);
      }

      if (scoresRes.ok) {
        const scores = await scoresRes.json();
        setSafetyScores(scores);
      }

      setIsLoadingData(false);
    } catch (error) {
      console.error("Failed to load safety data:", error);
      toast.error("Failed to load safety data");
      setIsLoadingData(false);
    }
  };

  const loadNearbyData = async (location: { lat: number; lng: number }) => {
    try {
      const token = localStorage.getItem("bearer_token");
      
      const [nearbyZonesRes, nearbyResourcesRes] = await Promise.all([
        fetch(`/api/danger-zones/nearby?lat=${location.lat}&lng=${location.lng}&radius=5000`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`/api/safety-resources/nearby?lat=${location.lat}&lng=${location.lng}&radius=5000`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (nearbyZonesRes.ok) {
        const zones = await nearbyZonesRes.json();
        setDangerZones(zones);
      }

      if (nearbyResourcesRes.ok) {
        const resources = await nearbyResourcesRes.json();
        setSafetyResources(resources);
      }
    } catch (error) {
      console.error("Failed to load nearby data:", error);
    }
  };

  const getRiskColor = (level: string) => {
    const colors = {
      low: "bg-green-100 text-green-800 border-green-300",
      medium: "bg-yellow-100 text-yellow-800 border-yellow-300",
      high: "bg-orange-100 text-orange-800 border-orange-300",
      critical: "bg-red-100 text-red-800 border-red-300",
    };
    return colors[level as keyof typeof colors] || colors.low;
  };

  const getResourceIcon = (type: string) => {
    const icons = {
      police: Shield,
      hospital: Hospital,
      embassy: Building2,
      help_center: HeartHandshake,
    };
    return icons[type as keyof typeof icons] || MapPin;
  };

  if (isPending || isLoadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session?.user) return null;

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Safety Map</h1>
            <p className="text-muted-foreground">
              Real-time danger zones and safety resources
            </p>
          </div>
          <Button onClick={getUserLocation} disabled={isLoadingLocation}>
            {isLoadingLocation ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <MapPin className="h-4 w-4 mr-2" />
            )}
            Update Location
          </Button>
        </div>

        {/* Current Location Info */}
        {userLocation && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Your Current Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Lat: {userLocation.lat.toFixed(4)}, Lng: {userLocation.lng.toFixed(4)}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Danger Zones */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Danger Zones</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dangerZones.length === 0 ? (
              <p className="text-muted-foreground col-span-full">No danger zones found nearby</p>
            ) : (
              dangerZones.map((zone) => (
                <Card key={zone.id} className="border-l-4" style={{ borderLeftColor: zone.riskLevel === "critical" ? "#ef4444" : zone.riskLevel === "high" ? "#f97316" : zone.riskLevel === "medium" ? "#eab308" : "#22c55e" }}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{zone.name}</CardTitle>
                      <Badge className={getRiskColor(zone.riskLevel)}>
                        {zone.riskLevel}
                      </Badge>
                    </div>
                    <CardDescription>{zone.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Crime Rate:</span>
                      <span className="font-medium">{zone.crimeRate}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Radius:</span>
                      <span className="font-medium">{zone.radius}m</span>
                    </div>
                    {zone.distance !== undefined && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Distance:</span>
                        <span className="font-medium">{(zone.distance / 1000).toFixed(2)} km</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Safety Resources */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Nearby Safety Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {safetyResources.length === 0 ? (
              <p className="text-muted-foreground col-span-full">No safety resources found nearby</p>
            ) : (
              safetyResources.map((resource) => {
                const Icon = getResourceIcon(resource.type);
                return (
                  <Card key={resource.id}>
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg">{resource.name}</CardTitle>
                          <CardDescription className="capitalize">{resource.type.replace("_", " ")}</CardDescription>
                        </div>
                        {resource.available247 && (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                            24/7
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm text-muted-foreground">{resource.address}</p>
                      <p className="text-sm font-medium">{resource.phone}</p>
                      {resource.distance !== undefined && (
                        <p className="text-sm text-muted-foreground">
                          Distance: {(resource.distance / 1000).toFixed(2)} km
                        </p>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>

        {/* Area Safety Scores */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Area Safety Scores</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {safetyScores.map((score) => (
              <Card key={score.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{score.areaName}</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          score.safetyScore >= 70
                            ? "bg-green-500"
                            : score.safetyScore >= 40
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${score.safetyScore}%` }}
                      />
                    </div>
                    <span className="text-lg font-bold">{score.safetyScore}/100</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Crime Rate:</span>
                    <span className="font-medium">{score.crimeRate.toFixed(1)}/1000</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Crowd Density:</span>
                    <Badge variant="outline" className="capitalize">{score.crowdDensity}</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Recent Incidents:</span>
                    <span className="font-medium">{score.recentIncidents}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
