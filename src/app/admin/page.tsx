"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, AlertTriangle, MapPin, FileText, Loader2, TrendingUp } from "lucide-react";
import { toast } from "sonner";

interface Stats {
  totalAlerts: number;
  activeAlerts: number;
  totalIncidents: number;
  pendingIncidents: number;
}

export default function AdminPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [stats, setStats] = useState<Stats>({
    totalAlerts: 0,
    activeAlerts: 0,
    totalIncidents: 0,
    pendingIncidents: 0,
  });
  const [activeAlerts, setActiveAlerts] = useState<any[]>([]);
  const [recentIncidents, setRecentIncidents] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login?redirect=/admin");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (session?.user) {
      loadAdminData();
    }
  }, [session]);

  const loadAdminData = async () => {
    try {
      const token = localStorage.getItem("bearer_token");

      const [alertsRes, incidentsRes] = await Promise.all([
        fetch("/api/sos?status=active&limit=10", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/incidents?limit=10", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (alertsRes.ok) {
        const alerts = await alertsRes.json();
        setActiveAlerts(alerts);
        setStats((prev) => ({ ...prev, activeAlerts: alerts.length }));
      }

      if (incidentsRes.ok) {
        const incidents = await incidentsRes.json();
        setRecentIncidents(incidents);
        const pending = incidents.filter((i: any) => i.status === "pending").length;
        setStats((prev) => ({
          ...prev,
          totalIncidents: incidents.length,
          pendingIncidents: pending,
        }));
      }
    } catch (error) {
      console.error("Failed to load admin data:", error);
      toast.error("Failed to load admin data");
    } finally {
      setIsLoadingData(false);
    }
  };

  const updateIncidentStatus = async (incidentId: number, status: string, threatLevel?: string) => {
    try {
      const token = localStorage.getItem("bearer_token");
      const body: any = { status };
      if (threatLevel) body.threatLevel = threatLevel;

      const response = await fetch(`/api/incidents/${incidentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        toast.success("Incident updated successfully");
        loadAdminData();
      } else {
        toast.error("Failed to update incident");
      }
    } catch (error) {
      toast.error("Failed to update incident");
    }
  };

  const getThreatColor = (level: string) => {
    const colors = {
      low: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-red-100 text-red-800",
    };
    return colors[level as keyof typeof colors] || colors.low;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      verified: "bg-blue-100 text-blue-800",
      resolved: "bg-green-100 text-green-800",
      active: "bg-red-100 text-red-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
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
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Monitor alerts, incidents, and system status
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active SOS Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.activeAlerts}</div>
              <p className="text-xs text-muted-foreground">Require immediate attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Incidents</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalIncidents}</div>
              <p className="text-xs text-muted-foreground">Reported incidents</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <TrendingUp className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pendingIncidents}</div>
              <p className="text-xs text-muted-foreground">Awaiting verification</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Status</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Online</div>
              <p className="text-xs text-muted-foreground">All systems operational</p>
            </CardContent>
          </Card>
        </div>

        {/* Active SOS Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Active SOS Alerts
            </CardTitle>
            <CardDescription>
              Emergency alerts requiring immediate response
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activeAlerts.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No active alerts</p>
            ) : (
              <div className="space-y-3">
                {activeAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-start justify-between p-4 border border-red-200 rounded-lg bg-red-50/50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getStatusColor(alert.status)}>
                          {alert.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          Alert #{alert.id}
                        </span>
                      </div>
                      <p className="text-sm font-medium mb-1">
                        {alert.message || "Emergency SOS triggered"}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {alert.latitude.toFixed(4)}, {alert.longitude.toFixed(4)}
                        </span>
                        <span>{new Date(alert.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Incidents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Recent Incident Reports
            </CardTitle>
            <CardDescription>
              Community-reported incidents and suspicious activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentIncidents.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No incidents reported</p>
            ) : (
              <div className="space-y-3">
                {recentIncidents.map((incident) => (
                  <div key={incident.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getStatusColor(incident.status)}>
                            {incident.status}
                          </Badge>
                          <Badge className={getThreatColor(incident.threatLevel)}>
                            {incident.threatLevel} threat
                          </Badge>
                          <span className="text-sm text-muted-foreground capitalize">
                            {incident.incidentType.replace("_", " ")}
                          </span>
                        </div>
                        <p className="text-sm mb-2">{incident.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {incident.latitude.toFixed(4)}, {incident.longitude.toFixed(4)}
                          </span>
                          <span>{new Date(incident.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    {incident.status === "pending" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateIncidentStatus(incident.id, "verified")}
                        >
                          Verify
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateIncidentStatus(incident.id, "resolved")}
                        >
                          Resolve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateIncidentStatus(incident.id, incident.status, "high")}
                        >
                          Mark as High Threat
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
