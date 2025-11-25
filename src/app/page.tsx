"use client";

import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, MapPin, AlertTriangle, MessageCircle, Eye, Bell, Users } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const features = [
    {
      icon: MapPin,
      title: "Real-Time Safety Map",
      description: "Interactive map with danger zones, safe areas, and nearby safety resources",
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      icon: AlertTriangle,
      title: "Emergency SOS",
      description: "One-tap emergency alert to notify police, hospitals, and family members",
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-900/20",
    },
    {
      icon: MessageCircle,
      title: "AI Safety Guide",
      description: "Chat with AI for safe routes, travel tips, and emergency guidance",
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      icon: Eye,
      title: "Threat Detection",
      description: "AI-powered analysis of danger zones and risk prediction",
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      icon: Bell,
      title: "Real-Time Alerts",
      description: "Instant notifications about nearby incidents and safety updates",
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
    },
    {
      icon: Users,
      title: "Community Reports",
      description: "Report suspicious activity and help keep other tourists safe",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-sm font-medium text-primary">
              <Shield className="h-4 w-4" />
              AI-Powered Safety Monitoring
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              Travel Safe with{" "}
              <span className="text-primary">AI Protection</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-muted-foreground">
              Real-time danger zone detection, emergency assistance, and intelligent safety recommendations powered by advanced AI technology
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              {isPending ? (
                <div className="h-12 w-40 bg-muted animate-pulse rounded-md" />
              ) : session?.user ? (
                <Button size="lg" onClick={() => router.push("/safety-map")} className="text-lg px-8">
                  Open Safety Map
                </Button>
              ) : (
                <>
                  <Button size="lg" onClick={() => router.push("/register")} className="text-lg px-8">
                    Get Started Free
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => router.push("/login")} className="text-lg px-8">
                    Sign In
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Complete Safety Suite
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to stay safe while exploring new destinations
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className={`inline-flex w-12 h-12 items-center justify-center rounded-lg ${feature.bgColor} mb-4`}>
                      <Icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-primary mb-2">24/7</div>
                <p className="text-muted-foreground">Real-Time Monitoring</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-primary mb-2">AI</div>
                <p className="text-muted-foreground">Powered Risk Detection</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-primary mb-2">Global</div>
                <p className="text-muted-foreground">Safety Coverage</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Ready to Travel Safely?
          </h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of tourists who trust SafeTourGuard for their safety
          </p>
          {!session?.user && (
            <Button size="lg" onClick={() => router.push("/register")} className="text-lg px-8">
              Create Free Account
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}