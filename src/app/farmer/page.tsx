
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  CloudSun, 
  Leaf, 
  FlaskConical, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  Info,
  Calendar,
  CloudRain,
  Loader2
} from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { VoiceAssistant } from "@/components/voice-assistant";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/components/language-provider";
import { useUser } from "@/firebase";

export default function FarmerDashboard() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const { t } = useLanguage();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/auth");
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  const FARMER_TOOLS = [
    {
      title: t('climate'),
      desc: "Weather insights and irrigation schedules.",
      icon: CloudSun,
      link: "/farmer/climate",
      color: "bg-blue-100 text-blue-700",
      alert: "80% Rain Sunday in Karur",
      alertType: "info"
    },
    {
      title: t('disease'),
      desc: "Scan crop leaves for instant diagnosis.",
      icon: Leaf,
      link: "/farmer/disease",
      color: "bg-red-100 text-red-700",
      alert: "Pest outbreak nearby",
      alertType: "problem"
    },
    {
      title: t('soil'),
      desc: "Analyze pH and nutrients for recommendations.",
      icon: FlaskConical,
      link: "/farmer/soil",
      color: "bg-amber-100 text-amber-700",
      alert: "Last test: 3 months ago",
      alertType: "info"
    },
    {
      title: t('market'),
      desc: "Predict future prices and best selling times.",
      icon: TrendingUp,
      link: "/farmer/market",
      color: "bg-green-100 text-green-700",
      alert: "Price spike: Corn +15%",
      alertType: "good"
    }
  ];

  return (
    <div className="min-h-screen bg-background font-body">
      <AppHeader role="farmer" />
      
      <main className="container mx-auto px-4 py-8">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-headline font-bold mb-2">{t('dashboard')}</h1>
            <p className="text-muted-foreground">{t('welcome')} Karur, TN.</p>
          </div>
          <div className="flex items-center gap-3 p-3 bg-orange-50 text-orange-800 rounded-xl border border-orange-100 shadow-sm">
            <CloudSun className="w-5 h-5" />
            <div className="text-sm">
              <p className="font-bold">32°C - Hazy</p>
              <p className="text-xs">Humidity 37%</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="md:col-span-2 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-xl font-headline">Crop Health Score</CardTitle>
                <CardDescription>Overall health across all sectors</CardDescription>
              </div>
              <Badge variant="outline" className="text-primary border-primary rounded-full px-4">Healthy</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 py-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Current Yield Potential</span>
                  <span className="font-bold">85%</span>
                </div>
                <Progress value={85} className="h-3 bg-muted" />
                <div className="grid grid-cols-3 gap-4 text-center text-xs pt-4">
                  <div className="space-y-1">
                    <p className="text-muted-foreground uppercase tracking-widest text-[10px]">Watering</p>
                    <p className="font-bold text-blue-600">Optimal</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground uppercase tracking-widest text-[10px]">Nutrients</p>
                    <p className="font-bold text-amber-600">Moderate</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground uppercase tracking-widest text-[10px]">Pests</p>
                    <p className="font-bold text-green-600">None</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-xl font-headline flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Next Tasks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-blue-50 border border-blue-100 hover:bg-blue-100/50 transition-colors cursor-pointer">
                <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                  <CloudRain className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold">Rain Preparation</p>
                  <p className="text-xs text-muted-foreground">Secure crops before Sunday rain</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-card border hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="p-2 rounded-full bg-amber-100 text-amber-600">
                  <FlaskConical className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold">Soil Sample Collection</p>
                  <p className="text-xs text-muted-foreground">Tomorrow morning</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FARMER_TOOLS.map((tool) => (
            <Link key={tool.title} href={tool.link}>
              <Card className="h-full hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-primary/5 group rounded-3xl">
                <CardHeader>
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${tool.color} shadow-lg group-hover:scale-110 transition-transform`}>
                    <tool.icon className="w-7 h-7" />
                  </div>
                  <CardTitle className="text-xl font-headline group-hover:text-primary transition-colors">{tool.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{tool.desc}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className={`mt-2 flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-full ${
                    tool.alertType === 'good' ? 'bg-green-50 text-green-700' : 
                    tool.alertType === 'problem' ? 'bg-red-50 text-red-700' : 
                    'bg-blue-50 text-blue-700'
                  }`}>
                    {tool.alertType === 'good' && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {tool.alertType === 'problem' && <AlertCircle className="w-3.5 h-3.5" />}
                    {tool.alertType === 'info' && <Info className="w-3.5 h-3.5" />}
                    {tool.alert}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>

      <VoiceAssistant />
    </div>
  );
}
