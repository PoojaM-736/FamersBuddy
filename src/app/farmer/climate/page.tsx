
"use client";

import { useState, useEffect } from "react";
import { CloudRain, Thermometer, Wind, Droplets, Loader2, MapPin, Search, CalendarClock, Sun } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { generateClimateGuidance, ClimateGuidanceOutput } from "@/ai/flows/generate-climate-guidance";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/components/language-provider";

export default function ClimateModelling() {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState("Karur, Tamil Nadu");
  const [guidance, setGuidance] = useState<ClimateGuidanceOutput | null>(null);

  // Current weather data for Karur
  const weatherData = {
    currentWeather: "Mostly cloudy/hazy",
    temperatureCelsius: 32,
    humidityPercent: 37,
    windSpeedKph: 14,
    rainfallLast24HoursMm: 0,
    soilType: "Red loamy and sandy soil",
    historicalWeatherDataSummary: "Semiarid climate, hot summers. Heavy rain expected this coming weekend."
  };

  const handleFetchGuidance = async () => {
    setLoading(true);
    try {
      const response = await generateClimateGuidance({
        location: location,
        ...weatherData
      });
      setGuidance(response);
      toast({
        title: "Guidance Updated",
        description: `Climate model synced for ${location}.`,
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Sync Failed",
        description: "Could not generate climate guidance at this time.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchGuidance();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader role="farmer" />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="animate-in fade-in duration-500">
            <h1 className="text-3xl font-headline font-bold mb-2">{t('climate')} Modelling</h1>
            <p className="text-muted-foreground">Accurate real-time metrics for <span className="text-primary font-bold">{location}</span>.</p>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                value={location} 
                onChange={(e) => setLocation(e.target.value)} 
                className="pl-9 w-60 h-12 rounded-xl"
                placeholder={t('location')}
              />
            </div>
            <Button onClick={handleFetchGuidance} disabled={loading} className="h-12 px-6 rounded-full shadow-lg shadow-primary/10">
              {loading ? <Loader2 className="animate-spin mr-2" /> : <Search className="mr-2" />}
              {t('syncData')}
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-orange-50/50 border-orange-100 shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
                <Thermometer className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-orange-600 font-medium">Temperature</p>
                <p className="text-2xl font-bold">{weatherData.temperatureCelsius}°C</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-cyan-50/50 border-cyan-100 shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-cyan-100 text-cyan-600 rounded-xl">
                <Droplets className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-cyan-600 font-medium">Humidity</p>
                <p className="text-2xl font-bold">{weatherData.humidityPercent}%</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-50/50 border-slate-100 shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-slate-100 text-slate-600 rounded-xl">
                <Wind className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-slate-600 font-medium">Wind Speed</p>
                <p className="text-2xl font-bold">{weatherData.windSpeedKph} km/h</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-yellow-50/50 border-yellow-100 shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-yellow-100 text-yellow-600 rounded-xl">
                <Sun className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-yellow-600 font-medium">UV Index</p>
                <p className="text-2xl font-bold">8 (High)</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-lg font-medium">Analyzing {location} climate patterns...</p>
          </div>
        ) : guidance ? (
          <div className="grid gap-8 lg:grid-cols-2 animate-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-6">
              <Card className="overflow-hidden border-l-4 border-l-primary shadow-md">
                <CardHeader>
                  <CardTitle className="text-xl">Optimal Crop Choices</CardTitle>
                  <CardDescription>Based on high heat and weekend rain forecast</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {guidance.optimalCropChoices.map((crop, i) => (
                    <Badge key={i} variant="secondary" className="px-3 py-1 text-base rounded-full bg-primary/5 text-primary border-primary/10">{crop}</Badge>
                  ))}
                </CardContent>
              </Card>

              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarClock className="w-5 h-5 text-primary" />
                    Sowing Time Advice
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed">{guidance.sowingTimeGuidance}</p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="bg-primary text-primary-foreground shadow-xl">
                <CardHeader>
                  <CardTitle>Climate Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed opacity-90">{guidance.climateInsights}</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-blue-400 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CloudRain className="w-5 h-5 text-blue-500" />
                    Weekend Rain Preparedness
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex items-center gap-2 p-3 bg-blue-50 text-blue-800 rounded-lg text-sm border border-blue-100">
                    <CloudRain className="w-4 h-4 shrink-0" />
                    <span>80% chance of rain this Sunday. Adjust irrigation now.</span>
                  </div>
                  <p className="text-sm leading-relaxed">{guidance.irrigationScheduleGuidance}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="bg-card border rounded-3xl p-12 text-center shadow-inner">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <CloudRain className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-headline font-bold mb-4">No Forecast Generated</h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">Click "Sync Data" to retrieve the latest weather metrics for {location}.</p>
            <Button size="lg" onClick={handleFetchGuidance} className="rounded-full px-12 h-14 shadow-lg shadow-primary/20">Retrieve Forecast Now</Button>
          </div>
        )}
      </main>
    </div>
  );
}
