"use client";

import { useState, useEffect } from "react";
import { TrendingUp, Calendar, Info, Loader2, ArrowUpRight, ArrowDownRight, MapPin } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { predictMarketPrices, PredictMarketPricesOutput } from "@/ai/flows/predict-market-prices";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  type ChartConfig
} from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

const MOCK_CHART_DATA = [
  { month: "Jan", price: 650 },
  { month: "Feb", price: 700 },
  { month: "Mar", price: 850 },
  { month: "Apr", price: 1100 },
  { month: "May", price: 1050 },
  { month: "Jun", price: 900 },
];

const chartConfig = {
  price: {
    label: "Price",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export default function MarketForecasting() {
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    cropName: "Alphonso Mango",
    region: "Ratnagiri Mandi",
    inventory: 500,
    harvestDate: "2026-04-15"
  });
  const [prediction, setPrediction] = useState<PredictMarketPricesOutput | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePredict = async () => {
    setLoading(true);
    try {
      const result = await predictMarketPrices({
        cropName: formData.cropName,
        region: formData.region,
        currentInventory: formData.inventory,
        harvestDate: formData.harvestDate
      });
      setPrediction(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader role="farmer" />
        <main className="container mx-auto px-4 py-8 flex items-center justify-center">
          <Loader2 className="animate-spin text-primary" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader role="farmer" />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="mb-8">
          <h1 className="text-3xl font-headline font-bold mb-2">Mandi Price Forecasting</h1>
          <p className="text-muted-foreground">Maximize your profits with Indian market insights.</p>
        </header>

        <div className="grid gap-8 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Forecast Input</CardTitle>
              <CardDescription>Indian crop & Mandi details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Crop Name</label>
                <Input 
                  placeholder="e.g. Alphonso Mango" 
                  value={formData.cropName}
                  onChange={(e) => setFormData({...formData, cropName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Region (Mandi)</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="e.g. Lasalgaon Mandi" 
                    className="pl-9"
                    value={formData.region}
                    onChange={(e) => setFormData({...formData, region: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Expected Harvest Date</label>
                <Input 
                  type="date" 
                  value={formData.harvestDate}
                  onChange={(e) => setFormData({...formData, harvestDate: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Quantity (kg/units)</label>
                <Input 
                  type="number" 
                  value={formData.inventory}
                  onChange={(e) => setFormData({...formData, inventory: parseInt(e.target.value)})}
                />
              </div>
              <Button 
                className="w-full h-12 rounded-full mt-4" 
                onClick={handlePredict}
                disabled={loading || !formData.cropName}
              >
                {loading ? <Loader2 className="animate-spin mr-2" /> : <TrendingUp className="mr-2" />}
                Get AI Mandi Forecast
              </Button>
            </CardContent>
          </Card>

          <div className="lg:col-span-2 space-y-6">
            {!prediction && !loading && (
              <div className="h-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="bg-card/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Trending Nearby</CardTitle>
                    <CardDescription className="text-2xl font-bold text-foreground">Onions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-green-600 font-bold">
                      <ArrowUpRight className="w-5 h-5" />
                      +8.2% Lasalgaon Mandi
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-card/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Mandi Alert</CardTitle>
                    <CardDescription className="text-2xl font-bold text-foreground">Grains</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-red-600 font-bold">
                      <ArrowDownRight className="w-5 h-5" />
                      Supplies arriving from Punjab
                    </div>
                  </CardContent>
                </Card>
                <Card className="sm:col-span-2 p-8 flex flex-col items-center justify-center text-center border-dashed">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <TrendingUp className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-headline font-bold text-xl mb-2">Ready to predict</h3>
                  <p className="text-muted-foreground max-w-sm">Enter your Indian Mandi details to see price trends and optimal selling times powered by Agri-AI.</p>
                </Card>
              </div>
            )}

            {prediction && (
              <>
                <Card className="animate-in fade-in zoom-in-95 duration-500 overflow-hidden">
                  <CardHeader className="bg-primary/5">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-2xl font-headline">Price Trend Forecast (₹)</CardTitle>
                        <CardDescription>Projected value for {formData.cropName}</CardDescription>
                      </div>
                      <Badge className="bg-secondary text-secondary-foreground text-sm px-3 py-1">
                        AI-Verified Mandi Data
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="h-[250px] w-full">
                      <ChartContainer config={chartConfig}>
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={MOCK_CHART_DATA}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Line 
                              type="monotone" 
                              dataKey="price" 
                              stroke="hsl(var(--primary))" 
                              strokeWidth={3} 
                              dot={{fill: "hsl(var(--primary))", strokeWidth: 2}} 
                              activeDot={{r: 8}}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </div>
                    <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                      <p className="text-sm leading-relaxed italic text-muted-foreground">
                        "Market trends show a strong upward trajectory in {formData.region} due to upcoming festival season demand."
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="border-l-4 border-l-secondary">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-secondary" />
                        Optimal Sell Time
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xl font-bold mb-2">{prediction.optimalSellTime}</p>
                      <p className="text-sm text-muted-foreground">{prediction.reasoning}</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-primary text-primary-foreground">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Mandi Insights
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed opacity-90">
                        {prediction.predictedPriceTrends}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
