"use client"

import { useState } from "react"
import { Activity, AlertTriangle, MapPin, Users, TrendingUp, Eye, Clock, CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navigation } from "@/components/navigation"
import Footer from "@/components/Footer"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  const alerts = [
    { id: 1, type: "warning", location: "Times Square", message: "High crowd density detected", time: "2 mins ago", severity: "medium" },
    { id: 2, type: "info", location: "Central Park", message: "Weather alert: Heavy rain expected", time: "15 mins ago", severity: "low" },
    { id: 3, type: "alert", location: "Museum District", message: "Suspicious activity reported", time: "23 mins ago", severity: "high" },
    { id: 4, type: "success", location: "Harbor Area", message: "All clear - Safety check completed", time: "1 hour ago", severity: "low" }
  ]

  const zones = [
    { name: "Times Square", status: "warning", crowdLevel: 85, incidents: 1, aiScore: 72 },
    { name: "Central Park", status: "safe", crowdLevel: 45, incidents: 0, aiScore: 95 },
    { name: "Museum District", status: "alert", crowdLevel: 68, incidents: 2, aiScore: 65 },
    { name: "Harbor Area", status: "safe", crowdLevel: 32, incidents: 0, aiScore: 98 },
    { name: "Shopping District", status: "safe", crowdLevel: 55, incidents: 0, aiScore: 88 },
    { name: "Historic Quarter", status: "warning", crowdLevel: 72, incidents: 1, aiScore: 78 }
  ]

  const incidents = [
    { id: 1, type: "Medical Emergency", location: "Times Square", status: "resolved", time: "1 hour ago", responders: 3 },
    { id: 2, type: "Lost Tourist", location: "Central Park", status: "active", time: "30 mins ago", responders: 2 },
    { id: 3, type: "Theft Report", location: "Museum District", status: "investigating", time: "2 hours ago", responders: 4 },
    { id: 4, type: "Traffic Incident", location: "Harbor Area", status: "resolved", time: "3 hours ago", responders: 2 }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "safe": return "bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/50"
      case "warning": return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/50"
      case "alert": return "bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/50"
      default: return "bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/50"
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high": return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "medium": return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "low": return <CheckCircle className="h-4 w-4 text-blue-500" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Safety Monitoring Dashboard</h1>
            <p className="text-muted-foreground">Real-time tourist safety analytics and threat detection</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Zones</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">+3</span> from yesterday
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tourists Monitored</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12,458</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">+12%</span> from last hour
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-red-500">1 high priority</span>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">AI Detection Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">99.8%</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">+0.2%</span> accuracy improvement
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="alerts">Alerts</TabsTrigger>
              <TabsTrigger value="zones">Zones</TabsTrigger>
              <TabsTrigger value="incidents">Incidents</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Live Monitoring Map</CardTitle>
                    <CardDescription>Real-time tourist location tracking and zone monitoring</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-lg flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80')] opacity-20 bg-cover bg-center"></div>
                      <div className="relative z-10 text-center space-y-4">
                        <MapPin className="h-12 w-12 mx-auto text-primary" />
                        <p className="text-sm text-muted-foreground">Interactive map visualization</p>
                        <div className="flex gap-2 justify-center flex-wrap">
                          <Badge className="bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/50">32 Safe</Badge>
                          <Badge className="bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/50">11 Moderate</Badge>
                          <Badge className="bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/50">2 High Risk</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Crowd Density Analysis</CardTitle>
                    <CardDescription>AI-powered crowd monitoring across tourist zones</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {zones.slice(0, 4).map((zone) => (
                      <div key={zone.name} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{zone.name}</span>
                          <span className="text-muted-foreground">{zone.crowdLevel}%</span>
                        </div>
                        <Progress value={zone.crowdLevel} className="h-2" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest alerts and system notifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {alerts.map((alert) => (
                      <div key={alert.id} className="flex items-start gap-4 pb-4 border-b last:border-0">
                        <div className="mt-1">
                          {getSeverityIcon(alert.severity)}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">{alert.location}</p>
                            <span className="text-xs text-muted-foreground">{alert.time}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{alert.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="alerts" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Active Safety Alerts</CardTitle>
                  <CardDescription>Real-time notifications from AI monitoring system</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {alerts.map((alert) => (
                      <div key={alert.id} className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            {getSeverityIcon(alert.severity)}
                            <div>
                              <p className="font-medium">{alert.location}</p>
                              <p className="text-sm text-muted-foreground">{alert.message}</p>
                            </div>
                          </div>
                          <Badge className={getStatusColor(alert.type)}>
                            {alert.severity.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {alert.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            AI Detected
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="zones" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {zones.map((zone) => (
                  <Card key={zone.name}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{zone.name}</CardTitle>
                        <Badge className={getStatusColor(zone.status)}>
                          {zone.status.toUpperCase()}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Crowd Level</span>
                          <span className="font-medium">{zone.crowdLevel}%</span>
                        </div>
                        <Progress value={zone.crowdLevel} className="h-2" />
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div>
                          <p className="text-xs text-muted-foreground">Incidents</p>
                          <p className="text-2xl font-bold">{zone.incidents}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">AI Score</p>
                          <p className="text-2xl font-bold">{zone.aiScore}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="incidents" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Emergency Incident Tracking</CardTitle>
                  <CardDescription>Real-time incident monitoring and response coordination</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {incidents.map((incident) => (
                      <div key={incident.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-medium">{incident.type}</p>
                            <p className="text-sm text-muted-foreground">{incident.location}</p>
                          </div>
                          <Badge variant={incident.status === "resolved" ? "default" : incident.status === "active" ? "destructive" : "secondary"}>
                            {incident.status === "resolved" && <CheckCircle className="h-3 w-3 mr-1" />}
                            {incident.status === "active" && <Activity className="h-3 w-3 mr-1" />}
                            {incident.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {incident.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {incident.responders} responders
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  )
}