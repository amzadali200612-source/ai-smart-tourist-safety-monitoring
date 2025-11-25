"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Phone, Shield, Hospital, Building2, Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface SafetyResource {
  id: number;
  type: string;
  name: string;
  address: string;
  phone: string;
  available247: boolean;
}

export default function EmergencyPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [isTriggering, setIsTriggering] = useState(false);
  const [sosMessage, setSosMessage] = useState("");
  const [activeAlerts, setActiveAlerts] = useState<any[]>([]);
  const [emergencyContacts, setEmergencyContacts] = useState<SafetyResource[]>([]);
  const [isLoadingContacts, setIsLoadingContacts] = useState(true);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login?redirect=/emergency");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (session?.user) {
      loadEmergencyContacts();
      loadActiveAlerts();
    }
  }, [session]);

  const loadEmergencyContacts = async () => {
    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch("/api/safety-resources?type=police&available247=true", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setEmergencyContacts(data.slice(0, 5));
      }
    } catch (error) {
      console.error("Failed to load emergency contacts:", error);
    } finally {
      setIsLoadingContacts(false);
    }
  };

  const loadActiveAlerts = async () => {
    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch("/api/sos?status=active", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setActiveAlerts(data);
      }
    } catch (error) {
      console.error("Failed to load active alerts:", error);
    }
  };

  const triggerSOS = async () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported");
      return;
    }

    setIsTriggering(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const token = localStorage.getItem("bearer_token");
          const response = await fetch("/api/sos", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              message: sosMessage || "Emergency SOS triggered",
              notifiedContacts: ["police", "emergency_services"],
            }),
          });

          if (response.ok) {
            toast.success("SOS alert sent! Emergency services have been notified.");
            setSosMessage("");
            loadActiveAlerts();
          } else {
            const error = await response.json();
            toast.error(error.error || "Failed to send SOS alert");
          }
        } catch (error) {
          toast.error("Failed to send SOS alert");
        } finally {
          setIsTriggering(false);
        }
      },
      (error) => {
        console.error("Location error:", error);
        toast.error("Unable to get your location");
        setIsTriggering(false);
      }
    );
  };

  const resolveAlert = async (alertId: number) => {
    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch(`/api/sos/${alertId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "resolved" }),
      });

      if (response.ok) {
        toast.success("Alert marked as resolved");
        loadActiveAlerts();
      } else {
        toast.error("Failed to resolve alert");
      }
    } catch (error) {
      toast.error("Failed to resolve alert");
    }
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session?.user) return null;

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-red-600 flex items-center gap-2">
            <AlertTriangle className="h-8 w-8" />
            Emergency Assistance
          </h1>
          <p className="text-muted-foreground mt-2">
            Trigger SOS alert to notify emergency services and your contacts
          </p>
        </div>

        {/* SOS Button Card */}
        <Card className="border-red-200 bg-red-50/50 dark:bg-red-900/10">
          <CardHeader>
            <CardTitle className="text-2xl text-red-600">Emergency SOS</CardTitle>
            <CardDescription>
              Press the button below to immediately alert emergency services with your location
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Optional: Describe your emergency..."
              value={sosMessage}
              onChange={(e) => setSosMessage(e.target.value)}
              rows={3}
              disabled={isTriggering}
            />
            <Button
              size="lg"
              onClick={triggerSOS}
              disabled={isTriggering}
              className="w-full bg-red-600 hover:bg-red-700 text-white text-lg h-16"
            >
              {isTriggering ? (
                <>
                  <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                  Sending Alert...
                </>
              ) : (
                <>
                  <AlertTriangle className="mr-2 h-6 w-6" />
                  TRIGGER SOS ALERT
                </>
              )}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Your location will be shared with emergency services and your emergency contacts
            </p>
          </CardContent>
        </Card>

        {/* Active Alerts */}
        {activeAlerts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Active SOS Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {activeAlerts.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">Alert #{alert.id}</p>
                    <p className="text-sm text-muted-foreground">
                      {alert.message || "Emergency alert"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(alert.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => resolveAlert(alert.id)}
                    className="gap-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Resolve
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Emergency Contacts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Emergency Contacts (24/7)
            </CardTitle>
            <CardDescription>
              Quick access to emergency services in your area
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingContacts ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : emergencyContacts.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No emergency contacts available</p>
            ) : (
              <div className="space-y-3">
                {emergencyContacts.map((contact) => (
                  <div key={contact.id} className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        {contact.type === "police" ? (
                          <Shield className="h-5 w-5 text-primary" />
                        ) : contact.type === "hospital" ? (
                          <Hospital className="h-5 w-5 text-primary" />
                        ) : (
                          <Building2 className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold">{contact.name}</h3>
                        <p className="text-sm text-muted-foreground">{contact.address}</p>
                        <p className="text-sm font-medium mt-1">{contact.phone}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                      24/7
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Important Numbers */}
        <Card className="bg-primary/5">
          <CardHeader>
            <CardTitle>Important Emergency Numbers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                <span className="font-medium">Emergency Services</span>
                <span className="text-lg font-bold">911</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                <span className="font-medium">Police</span>
                <span className="text-lg font-bold">911</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                <span className="font-medium">Ambulance</span>
                <span className="text-lg font-bold">911</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                <span className="font-medium">Fire Department</span>
                <span className="text-lg font-bold">911</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
