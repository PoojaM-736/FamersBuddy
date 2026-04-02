
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TrendingUp, ArrowUpRight, Info, Calendar, Download, Loader2, MapPin } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  type ChartConfig
} from "@/components/ui/chart";
import { XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area } from "recharts";
import { useUser } from "@/firebase";
import { useLanguage } from "@/components/language-provider";

const REGIONAL_MARKET_TRENDS = [
  { month: "Sep", rice: 110, mango: 450, turmeric: 140 },
  { month: "Oct", rice: 112, mango: 500, turmeric: 145 },
  { month: "Nov", rice: 115, mango: 650, turmeric: 155 },
  { month: "Dec", rice: 118, mango: 800, turmeric: 150 },
  { month: "Jan", rice: 120, mango: 750, turmeric: 160 },
  { month: "Feb", rice: 125, mango: 600, turmeric: 165 },
];

const chartConfig = {
  rice: {
    label: "Rice",
    color: "hsl(var(--primary))",
  },
  mango: {
    label: "Mango",
    color: "hsl(var(--secondary))",
  },
  turmeric: {
    label: "Turmeric",
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig;

export default function PriceTrends() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const { t } = useLanguage();
  const [activeCrop, setActiveCrop] = useState<"rice" | "mango" | "turmeric">("rice");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    if (!isUserLoading && !user) {
      router.push("/auth");
    }
  }, [user, isUserLoading, router]);

  if (!isHydrated || isUserLoading || !user) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader role="buyer" />
        <main className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="animate-spin text-primary w-10 h-10" />
        </main>
      </div>
    );
  }

  const cropLabels = {
    rice: "Basmati Rice (Amritsar)",
    mango: "Alphonso (Ratnagiri)",
    turmeric: "Turmeric (Erode)"
  };

  const marketLocations = {
    rice: "Amritsar Mandi, Punjab",
    mango: "Pawas Mandi, Maharashtra",
    turmeric: "Erode Market, Tamil Nadu"
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader role="buyer" />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-headline font-bold mb-2">{t('priceTrends')}</h1>
            <p className="text-muted-foreground">Historical and real-time data from APMC Mandis across India.</p>
          </div>
          <Button variant="outline" className="rounded-full h-11 px-6 shadow-sm">
            <Download className="w-4 h-4 mr-2" />
            Download Regional Report
          </Button>
        </header>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card 
            className={`cursor-pointer transition-all hover:border-primary/50 shadow-md ${activeCrop === 'rice' ? 'ring-2 ring-primary bg-primary/5' : ''}`}
            onClick={() => setActiveCrop('rice')}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Basmati (PB)</CardTitle>
              <div className="flex items-center justify-between mt-2">
                <span className="text-2xl font-bold">₹125</span>
                <Badge className="bg-green-100 text-green-700 border-none font-bold">+8.4%</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1 text-xs text-green-600 font-bold">
                <ArrowUpRight className="w-3 h-3" />
                Punjab Godown arrivals low
              </div>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer transition-all hover:border-primary/50 shadow-md ${activeCrop === 'mango' ? 'ring-2 ring-primary bg-primary/5' : ''}`}
            onClick={() => setActiveCrop('mango')}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Alphonso (MH)</CardTitle>
              <div className="flex items-center justify-between mt-2">
                <span className="text-2xl font-bold">₹850</span>
                <Badge className="bg-amber-100 text-amber-700 border-none font-bold">Seasonal Peak</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1 text-xs text-amber-600 font-bold">
                <TrendingUp className="w-3 h-3" />
                Export demand surging
              </div>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer transition-all hover:border-primary/50 shadow-md ${activeCrop === 'turmeric' ? 'ring-2 ring-primary bg-primary/5' : ''}`}
            onClick={() => setActiveCrop('turmeric')}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Turmeric (TN)</CardTitle>
              <div className="flex items-center justify-between mt-2">
                <span className="text-2xl font-bold">₹160</span>
                <Badge className="bg-blue-100 text-blue-700 border-none font-bold">Stable</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1 text-xs text-blue-600 font-bold">
                <Info className="w-3 h-3" />
                Steady arrivals in Erode
              </div>
            </CardContent>
          </Card>
        </div>

        <ChartContainer config={chartConfig} className="mb-8 border-primary/10 shadow-xl overflow-hidden rounded-xl bg-card">
          <div className="w-full">
          <CardHeader className="bg-muted/30 p-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <CardTitle className="text-2xl font-headline flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-primary" />
                  Price History: {cropLabels[activeCrop]}
                </CardTitle>
                <CardDescription className="flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3" />
                  Current Lead Market: {marketLocations[activeCrop]}
                </CardDescription>
              </div>
              <div className="flex bg-background p-1 rounded-lg border shadow-sm">
                <Button variant="ghost" size="sm" className="h-8 rounded-md">1M</Button>
                <Button variant="secondary" size="sm" className="h-8 rounded-md">6M</Button>
                <Button variant="ghost" size="sm" className="h-8 rounded-md">1Y</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[400px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={REGIONAL_MARKET_TRENDS}>
                  <defs>
                    <linearGradient id="colorCropTrend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 12, fontWeight: 'bold'}} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 12, fontWeight: 'bold'}}
                    dx={-10}
                    tickFormatter={(value) => `₹${value}`}
                  />
                  <ChartTooltip 
                    content={<ChartTooltipContent />} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey={activeCrop} 
                    stroke="hsl(var(--primary))" 
                    fillOpacity={1} 
                    fill="url(#colorCropTrend)" 
                    strokeWidth={4}
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
          </div>
        </ChartContainer>

        <div className="grid gap-8 lg:grid-cols-2">
          <Card className="bg-secondary/10 border-none shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-headline">
                <Info className="w-5 h-5 text-secondary" />
                Regional Market Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                <p>
                  <strong>North (Punjab/Haryana):</strong> Basmati Rice godown stocks are 15% lower than previous year due to high export commitments. Expect wholesale rates to remain firm.
                </p>
                <p>
                  <strong>South (Tamil Nadu/Kerala):</strong> Turmeric arrivals in Erode and Salem are steady. High humidity forecast in the Nilgiris might affect spice drying processes next month.
                </p>
                <p>
                  <strong>West (Maharashtra):</strong> Alphonso arrivals in Vashi and Pawas Mandis have hit their seasonal peak. Price stabilization expected in late April.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-none shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-headline">
                <Calendar className="w-5 h-5 text-primary" />
                Godown & Mandi Arrivals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center text-sm p-4 bg-background rounded-xl border shadow-sm group hover:border-primary transition-colors">
                <div className="space-y-1">
                  <p className="font-bold">Erode Market (TN)</p>
                  <p className="text-xs text-muted-foreground">Turmeric & Manjal</p>
                </div>
                <Badge variant="outline" className="text-green-600 font-bold bg-green-50 border-green-200">High Volume</Badge>
              </div>
              <div className="flex justify-between items-center text-sm p-4 bg-background rounded-xl border shadow-sm group hover:border-primary transition-colors">
                <div className="space-y-1">
                  <p className="font-bold">Amritsar Godowns (PB)</p>
                  <p className="text-xs text-muted-foreground">Basmati Sella & Steam</p>
                </div>
                <Badge variant="outline" className="text-amber-600 font-bold bg-amber-50 border-amber-200">Limited Stocks</Badge>
              </div>
              <div className="flex justify-between items-center text-sm p-4 bg-background rounded-xl border shadow-sm group hover:border-primary transition-colors">
                <div className="space-y-1">
                  <p className="font-bold">Lasalgaon APMC (MH)</p>
                  <p className="text-xs text-muted-foreground">Red Onions (Grade A)</p>
                </div>
                <Badge variant="outline" className="text-blue-600 font-bold bg-blue-50 border-blue-200">Price Surge</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
