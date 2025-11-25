"use client"

import { Brain, Eye, TrendingUp, Zap, Shield, Network, Cpu, Database, BarChart } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navigation } from "@/components/navigation"
import Footer from "@/components/Footer"

export default function AIFeatures() {
  const mlModels = [
    {
      name: "Threat Detection Model",
      icon: Shield,
      accuracy: "99.8%",
      description: "Deep learning CNN for real-time threat and anomaly detection in tourist areas",
      features: ["Object detection", "Behavior analysis", "Anomaly detection", "Pattern recognition"]
    },
    {
      name: "Crowd Analysis Model",
      icon: Network,
      accuracy: "98.5%",
      description: "Advanced crowd density estimation using computer vision and sensor fusion",
      features: ["Density heatmaps", "Flow analysis", "Bottleneck detection", "Capacity prediction"]
    },
    {
      name: "Predictive Analytics Engine",
      icon: TrendingUp,
      accuracy: "96.2%",
      description: "Time-series forecasting for incident prediction and risk assessment",
      features: ["Risk scoring", "Trend analysis", "Incident forecasting", "Resource optimization"]
    },
    {
      name: "NLP Sentiment Analyzer",
      icon: Brain,
      accuracy: "97.3%",
      description: "Natural language processing for social media and review sentiment analysis",
      features: ["Real-time monitoring", "Threat keywords", "Sentiment scoring", "Alert generation"]
    }
  ]

  const aiCapabilities = [
    {
      icon: Eye,
      title: "Computer Vision",
      description: "Advanced image and video analysis using state-of-the-art deep learning models",
      technologies: ["YOLOv8", "ResNet", "EfficientNet", "OpenCV"]
    },
    {
      icon: Brain,
      title: "Machine Learning",
      description: "Supervised and unsupervised learning for pattern recognition and classification",
      technologies: ["Random Forest", "XGBoost", "SVM", "K-Means"]
    },
    {
      icon: Cpu,
      title: "Deep Learning",
      description: "Neural networks for complex pattern recognition and predictive modeling",
      technologies: ["TensorFlow", "PyTorch", "Keras", "LSTM"]
    },
    {
      icon: Database,
      title: "Big Data Analytics",
      description: "Processing and analyzing large-scale datasets for actionable insights",
      technologies: ["Apache Spark", "Hadoop", "Pandas", "NumPy"]
    },
    {
      icon: BarChart,
      title: "Statistical Analysis",
      description: "Advanced statistical methods for data validation and hypothesis testing",
      technologies: ["SciPy", "Statsmodels", "R", "MATLAB"]
    },
    {
      icon: Zap,
      title: "Real-Time Processing",
      description: "Low-latency data processing and instant alert generation",
      technologies: ["Apache Kafka", "Redis", "WebSockets", "gRPC"]
    }
  ]

  const dataScience = [
    {
      title: "Data Collection",
      description: "Multi-source data aggregation from sensors, cameras, social media, and IoT devices",
      metrics: ["1M+ data points/hour", "50+ data sources", "99.9% uptime"]
    },
    {
      title: "Data Processing",
      description: "Real-time ETL pipeline with data cleaning, normalization, and feature engineering",
      metrics: ["<100ms latency", "10TB+ processed daily", "Distributed processing"]
    },
    {
      title: "Feature Engineering",
      description: "Automated feature extraction and selection for optimal model performance",
      metrics: ["500+ features", "Auto-scaling", "Dimensionality reduction"]
    },
    {
      title: "Model Training",
      description: "Continuous learning with automated retraining and hyperparameter optimization",
      metrics: ["Daily retraining", "A/B testing", "Auto-tuning"]
    },
    {
      title: "Model Deployment",
      description: "Containerized microservices architecture for scalable AI inference",
      metrics: ["Auto-scaling", "Load balancing", "Zero-downtime updates"]
    },
    {
      title: "Monitoring & Validation",
      description: "Continuous model performance monitoring with drift detection and alerting",
      metrics: ["Real-time metrics", "Automated alerts", "Performance tracking"]
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-12 text-center space-y-4">
            <Badge variant="secondary" className="px-4 py-1.5">
              <Brain className="h-3 w-3 mr-2 inline" />
              Powered by Advanced AI & Machine Learning
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI-Powered
              </span>{" "}
              Safety Features
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Leveraging cutting-edge artificial intelligence and data science to deliver unparalleled tourist safety monitoring and predictive analytics
            </p>
          </div>

          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6">Machine Learning Models</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {mlModels.map((model, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <model.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{model.name}</CardTitle>
                          <Badge variant="secondary" className="mt-1">
                            {model.accuracy} Accuracy
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription>{model.description}</CardDescription>
                    <div>
                      <p className="text-sm font-medium mb-2">Key Features:</p>
                      <div className="flex flex-wrap gap-2">
                        {model.features.map((feature, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6">AI Capabilities</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {aiCapabilities.map((capability, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4">
                      <capability.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{capability.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription>{capability.description}</CardDescription>
                    <div>
                      <p className="text-xs font-medium mb-2 text-muted-foreground">Technologies:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {capability.technologies.map((tech, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6">Data Science Pipeline</h2>
            <Card>
              <CardContent className="p-6">
                <Tabs defaultValue="overview" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-3 lg:w-[600px]">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="workflow">Workflow</TabsTrigger>
                    <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {dataScience.map((stage, index) => (
                        <div key={index} className="space-y-3 p-4 border rounded-lg">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                              {index + 1}
                            </div>
                            <h3 className="font-semibold">{stage.title}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground">{stage.description}</p>
                          <div className="flex flex-wrap gap-2 pt-2">
                            {stage.metrics.map((metric, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {metric}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="workflow" className="space-y-4">
                    <div className="space-y-6">
                      <div className="p-6 border rounded-lg bg-muted/50">
                        <h3 className="font-semibold mb-4">End-to-End ML Workflow</h3>
                        <div className="space-y-4">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">1</div>
                            <div>
                              <p className="font-medium">Data Ingestion</p>
                              <p className="text-sm text-muted-foreground">Real-time data collection from multiple sources</p>
                            </div>
                          </div>
                          <div className="ml-5 border-l-2 border-dashed h-6"></div>
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold">2</div>
                            <div>
                              <p className="font-medium">Preprocessing</p>
                              <p className="text-sm text-muted-foreground">Data cleaning, normalization, and transformation</p>
                            </div>
                          </div>
                          <div className="ml-5 border-l-2 border-dashed h-6"></div>
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold">3</div>
                            <div>
                              <p className="font-medium">Model Inference</p>
                              <p className="text-sm text-muted-foreground">AI/ML models process data and generate predictions</p>
                            </div>
                          </div>
                          <div className="ml-5 border-l-2 border-dashed h-6"></div>
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">4</div>
                            <div>
                              <p className="font-medium">Action & Alerts</p>
                              <p className="text-sm text-muted-foreground">Automated responses and real-time notifications</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="infrastructure" className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="p-6 border rounded-lg">
                        <h3 className="font-semibold mb-4">Cloud Infrastructure</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li>• Kubernetes cluster for container orchestration</li>
                          <li>• Auto-scaling for handling variable loads</li>
                          <li>• Multi-region deployment for redundancy</li>
                          <li>• CDN for low-latency data delivery</li>
                          <li>• 99.99% uptime SLA guarantee</li>
                        </ul>
                      </div>
                      <div className="p-6 border rounded-lg">
                        <h3 className="font-semibold mb-4">Data Storage</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li>• Distributed database for high availability</li>
                          <li>• Real-time data streaming pipelines</li>
                          <li>• Data lake for long-term analytics</li>
                          <li>• Encrypted storage with backup redundancy</li>
                          <li>• Petabyte-scale data processing</li>
                        </ul>
                      </div>
                      <div className="p-6 border rounded-lg">
                        <h3 className="font-semibold mb-4">Model Serving</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li>• TensorFlow Serving for inference</li>
                          <li>• GPU acceleration for deep learning</li>
                          <li>• Model versioning and A/B testing</li>
                          <li>• Canary deployments for safety</li>
                          <li>• Less than 100ms prediction latency</li>
                        </ul>
                      </div>
                      <div className="p-6 border rounded-lg">
                        <h3 className="font-semibold mb-4">Monitoring & Observability</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li>• Real-time performance dashboards</li>
                          <li>• Automated anomaly detection</li>
                          <li>• Model drift monitoring</li>
                          <li>• Distributed tracing for debugging</li>
                          <li>• Custom alerting and notifications</li>
                        </ul>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </section>

          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 text-white">
            <CardContent className="p-8 text-center space-y-4">
              <Brain className="h-12 w-12 mx-auto opacity-90" />
              <h2 className="text-2xl md:text-3xl font-bold">Experience AI-Powered Safety</h2>
              <p className="text-white/90 max-w-2xl mx-auto">
                Our advanced machine learning models and data science pipeline deliver unmatched accuracy and speed in tourist safety monitoring
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}