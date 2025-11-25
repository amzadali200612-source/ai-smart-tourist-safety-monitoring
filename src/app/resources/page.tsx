"use client"

import { Phone, MapPin, Shield, Cloud, Navigation as NavigationIcon, AlertCircle, Info, CheckCircle2, Heart } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Navigation } from "@/components/navigation"
import Footer from "@/components/Footer"

export default function Resources() {
  const emergencyContacts = [
    { type: "Emergency Services", number: "911", description: "Police, Fire, Medical emergencies" },
    { type: "Tourist Police", number: "+1 (555) 123-4567", description: "24/7 tourist assistance and support" },
    { type: "Medical Hotline", number: "+1 (555) 234-5678", description: "Non-emergency medical consultation" },
    { type: "Embassy Services", number: "+1 (555) 345-6789", description: "International visitor assistance" }
  ]

  const safetyTips = [
    {
      category: "Personal Safety",
      icon: Shield,
      tips: [
        "Always keep your belongings secure and within sight",
        "Stay in well-lit, populated areas especially at night",
        "Keep copies of important documents in a separate location",
        "Share your itinerary with trusted contacts",
        "Use official transportation services and licensed guides"
      ]
    },
    {
      category: "Health & Wellness",
      icon: Heart,
      tips: [
        "Stay hydrated and carry water, especially in hot weather",
        "Apply sunscreen regularly and wear protective clothing",
        "Keep a basic first-aid kit with essential medications",
        "Know the location of nearby hospitals and pharmacies",
        "Purchase comprehensive travel insurance before your trip"
      ]
    },
    {
      category: "Digital Safety",
      icon: AlertCircle,
      tips: [
        "Use VPN when connecting to public WiFi networks",
        "Enable two-factor authentication on all accounts",
        "Be cautious of phishing attempts and suspicious links",
        "Keep your devices charged and carry a portable battery",
        "Back up important photos and documents to cloud storage"
      ]
    },
    {
      category: "Emergency Preparedness",
      icon: Phone,
      tips: [
        "Save emergency contacts in your phone before traveling",
        "Learn basic phrases in the local language",
        "Know the location of your country's embassy or consulate",
        "Register with your embassy's travel registration program",
        "Keep emergency cash in a secure location"
      ]
    }
  ]

  const safeZones = [
    { name: "Central Station", address: "123 Main St", status: "Active", facilities: ["Police", "Medical", "Information"] },
    { name: "Tourist Information Center", address: "456 Park Ave", status: "Active", facilities: ["Information", "WiFi", "Restrooms"] },
    { name: "City Hall Plaza", address: "789 Government Rd", status: "Active", facilities: ["Police", "Emergency Shelter"] },
    { name: "International Airport", address: "101 Airport Blvd", status: "Active", facilities: ["Medical", "Police", "Information"] }
  ]

  const currentConditions = {
    weather: {
      temperature: "72°F (22°C)",
      condition: "Partly Cloudy",
      humidity: "65%",
      windSpeed: "8 mph"
    },
    traffic: {
      overall: "Moderate",
      incidents: 2,
      avgDelay: "5-10 minutes",
      publicTransit: "Normal service"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-12 text-center space-y-4">
            <Badge variant="secondary" className="px-4 py-1.5">
              <Info className="h-3 w-3 mr-2 inline" />
              Essential Tourist Resources
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold">
              Safety Resources & Information
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Everything you need to stay safe and informed during your visit
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-12">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Safe Zones Map
                </CardTitle>
                <CardDescription>Designated safe areas with emergency services and facilities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gradient-to-br from-green-500/10 via-blue-500/10 to-purple-500/10 rounded-lg flex items-center justify-center relative overflow-hidden mb-6">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=800&q=80')] opacity-20 bg-cover bg-center"></div>
                  <div className="relative z-10 text-center space-y-4">
                    <MapPin className="h-16 w-16 mx-auto text-green-600" />
                    <p className="text-sm text-muted-foreground">Interactive safe zones map</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {safeZones.map((zone, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold">{zone.name}</h4>
                          <p className="text-sm text-muted-foreground">{zone.address}</p>
                        </div>
                        <Badge className="bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/50">
                          {zone.status}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {zone.facilities.map((facility, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {facility}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cloud className="h-5 w-5" />
                    Weather Conditions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Temperature</span>
                    <span className="font-medium">{currentConditions.weather.temperature}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Condition</span>
                    <span className="font-medium">{currentConditions.weather.condition}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Humidity</span>
                    <span className="font-medium">{currentConditions.weather.humidity}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Wind Speed</span>
                    <span className="font-medium">{currentConditions.weather.windSpeed}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <NavigationIcon className="h-5 w-5" />
                    Traffic Conditions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Overall Status</span>
                    <Badge variant="secondary">{currentConditions.traffic.overall}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Active Incidents</span>
                    <span className="font-medium">{currentConditions.traffic.incidents}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Avg Delay</span>
                    <span className="font-medium">{currentConditions.traffic.avgDelay}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Public Transit</span>
                    <span className="font-medium flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      {currentConditions.traffic.publicTransit}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Emergency Contacts</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {emergencyContacts.map((contact, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{contact.type}</CardTitle>
                        <CardDescription>{contact.description}</CardDescription>
                      </div>
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <a href={`tel:${contact.number}`} className="text-2xl font-bold text-primary hover:underline">
                      {contact.number}
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Safety Tips</h2>
            <Accordion type="single" collapsible className="space-y-4">
              {safetyTips.map((section, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-6">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <section.icon className="h-5 w-5 text-primary" />
                      </div>
                      <span className="font-semibold text-lg">{section.category}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4">
                    <ul className="space-y-3">
                      {section.tips.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 text-white">
            <CardContent className="p-8 text-center space-y-4">
              <Shield className="h-12 w-12 mx-auto opacity-90" />
              <h2 className="text-2xl md:text-3xl font-bold">Stay Safe During Your Visit</h2>
              <p className="text-white/90 max-w-2xl mx-auto">
                Download our mobile app for instant access to safety alerts, emergency contacts, and real-time assistance
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}