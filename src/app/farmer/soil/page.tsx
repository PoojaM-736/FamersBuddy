"use client";

import { useState } from "react";
import { 
  FlaskConical, 
  Loader2, 
  Sparkles, 
  CheckCircle2, 
  Sprout, 
  Beaker, 
  Search, 
  Info,
  ChevronRight,
  ChevronLeft,
  Tractor,
  Droplets
} from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { recommendSoilManagement, SoilAnalysisOutput } from "@/ai/flows/recommend-soil-management";
import { useToast } from "@/hooks/use-toast";

const QUESTIONS = [
  { id: "color", label: "1. Soil Color", options: ["Red", "Dark Black", "Brown", "Yellow/Grey"], description: "What color is the top 6 inches of your soil?" },
  { id: "texture", label: "2. Soil Texture", options: ["Sticky Clay", "Gritty Sand", "Smooth Loam", "Crumbly Silt"], description: "Rub wet soil between your fingers. How does it feel?" },
  { id: "digTest", label: "3. Digging Test", options: ["Rock Hard", "Easy/Loose", "Medium/Firm"], description: "How hard is it to dig a 1-foot hole with a spade?" },
  { id: "waterTest", label: "4. Water Test", options: ["Drains Instantly", "Stays Puddled", "Soaks in Slowly"], description: "Pour a bucket of water. How does it drain?" },
  { id: "cropHistory", label: "5. Last Crop", options: ["Paddy", "Maize", "Cotton", "Vegetables", "Sugarcane"], description: "What did you grow in this field last season?" },
  { id: "plannedCrop", label: "6. Planned Crop", options: ["Tomato", "Chilli", "Onion", "Banana", "Turmeric"], description: "What do you want to grow now?" },
  { id: "plantSymptoms", label: "7. Plant Symptoms", options: ["Yellow Leaves", "Purple Stems", "Stunted Growth", "Normal"], description: "Did your last crops show any of these signs?" },
  { id: "organicMatter", label: "8. Earthworms/Life", options: ["None Seen", "A Few", "Plenty of Worms"], description: "How many earthworms or roots do you see in the soil?" }
];

export default function SoilAnalysis() {
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [result, setResult] = useState<SoilAnalysisOutput | null>(null);

  const handleSelect = (value: string) => {
    setFormData({ ...formData, [QUESTIONS[step].id]: value });
  };

  const handleNext = () => {
    if (step < QUESTIONS.length - 1) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleAnalyze = async () => {
    // Check if all questions are answered
    const missingKeys = QUESTIONS.filter(q => !formData[q.id]);
    if (missingKeys.length > 0) {
      toast({
        variant: "destructive",
        title: "Incomplete Analysis",
        description: "Please answer all 8 questions to get an accurate scientific analysis.",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await recommendSoilManagement({
        color: formData.color,
        texture: formData.texture,
        digTest: formData.digTest,
        waterTest: formData.waterTest,
        cropHistory: formData.cropHistory,
        plannedCrop: formData.plannedCrop,
        plantSymptoms: formData.plantSymptoms,
        organicMatter: formData.organicMatter,
        region: "Tamil Nadu (Red Loam Zone)"
      });
      setResult(response);
      toast({ title: "Analysis Complete", description: "Scientific recommendations generated." });
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Analysis Failed", description: "Buddy couldn't process the soil data. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-body">
      <AppHeader role="farmer" />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="mb-12 text-center">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 px-4 py-1">₹500 Lab Fee Saved</Badge>
          <h1 className="text-4xl font-headline font-bold mb-3">No-Lab Soil Analysis</h1>
          <p className="text-muted-foreground text-lg">AI-driven scientific results based on field observations.</p>
        </header>

        {!result ? (
          <Card className="shadow-2xl border-primary/10 overflow-hidden">
            <div className="bg-primary/5 p-4 border-b">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-primary uppercase tracking-widest">Question {step + 1} of 8</span>
                <span className="text-sm font-bold">{Math.round(((step + 1) / 8) * 100)}% Complete</span>
              </div>
              <Progress value={((step + 1) / 8) * 100} className="h-2" />
            </div>

            <CardContent className="p-8 space-y-8">
              <div className="space-y-2">
                <h2 className="text-2xl font-headline font-bold">{QUESTIONS[step].label}</h2>
                <p className="text-muted-foreground">{QUESTIONS[step].description}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {QUESTIONS[step].options.map((option) => (
                  <Button
                    key={option}
                    variant={formData[QUESTIONS[step].id] === option ? "default" : "outline"}
                    className={`h-16 text-lg rounded-2xl border-2 transition-all ${
                      formData[QUESTIONS[step].id] === option ? "border-primary shadow-lg" : "hover:border-primary/50"
                    }`}
                    onClick={() => handleSelect(option)}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </CardContent>

            <CardFooter className="p-8 bg-muted/30 border-t flex justify-between gap-4">
              <Button 
                variant="ghost" 
                onClick={handleBack} 
                disabled={step === 0}
                className="rounded-full h-12 px-6"
              >
                <ChevronLeft className="mr-2 w-5 h-5" /> Back
              </Button>

              {step < QUESTIONS.length - 1 ? (
                <Button 
                  onClick={handleNext} 
                  disabled={!formData[QUESTIONS[step].id]}
                  className="rounded-full h-12 px-8 font-bold"
                >
                  Next Question <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              ) : (
                <Button 
                  onClick={handleAnalyze} 
                  disabled={loading || !formData[QUESTIONS[step].id]}
                  className="rounded-full h-12 px-8 font-bold bg-primary shadow-xl shadow-primary/20"
                >
                  {loading ? <Loader2 className="animate-spin mr-2" /> : <Sparkles className="mr-2" />}
                  Generate AI Analysis
                </Button>
              )}
            </CardFooter>
          </Card>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-primary text-primary-foreground">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm uppercase tracking-tighter opacity-80">Health Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-5xl font-bold">{result.soilHealthScore}%</div>
                  <p className="text-xs mt-2 opacity-90">Based on Tamil Nadu regional standards</p>
                </CardContent>
              </Card>

              <Card className="bg-secondary text-secondary-foreground">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm uppercase tracking-tighter opacity-80">Estimated pH</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">{result.estimatedPh}</div>
                  <p className="text-xs mt-2 opacity-90 italic">Observation-based estimate</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm uppercase tracking-tighter text-muted-foreground">Deficiencies</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-1">
                  {result.nutrientDeficiency.map((d, i) => (
                    <Badge key={i} variant="destructive" className="text-[10px]">{d}</Badge>
                  ))}
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-xl overflow-hidden border-2 border-primary/10">
              <CardHeader className="bg-primary/5 p-6 border-b">
                <CardTitle className="text-2xl font-headline flex items-center gap-2">
                  <FlaskConical className="w-6 h-6 text-primary" />
                  Scientific Fertilizer Dose (NPK)
                </CardTitle>
                <CardDescription>Exact calculation for your {formData.plannedCrop} crop</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                  <div className="text-center space-y-3 p-6 bg-muted/30 rounded-3xl border border-dashed">
                    <p className="text-xs font-bold text-muted-foreground uppercase">Nitrogen (Urea)</p>
                    <div className="text-3xl font-bold text-primary">{result.npkRecommendation.urea}</div>
                    <Badge className="bg-primary/10 text-primary border-none">Grams/Plant</Badge>
                  </div>
                  <div className="text-center space-y-3 p-6 bg-muted/30 rounded-3xl border border-dashed">
                    <p className="text-xs font-bold text-muted-foreground uppercase">Phosphorus (DAP)</p>
                    <div className="text-3xl font-bold text-secondary">{result.npkRecommendation.dap}</div>
                    <Badge className="bg-secondary/10 text-secondary border-none">Grams/Plant</Badge>
                  </div>
                  <div className="text-center space-y-3 p-6 bg-muted/30 rounded-3xl border border-dashed">
                    <p className="text-xs font-bold text-muted-foreground uppercase">Potassium (MOP)</p>
                    <div className="text-3xl font-bold text-amber-600">{result.npkRecommendation.mop}</div>
                    <Badge className="bg-amber-100 text-amber-700 border-none">Grams/Plant</Badge>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-4">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <Info className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-blue-900">Application Timing</h4>
                    <p className="text-sm text-blue-800 leading-relaxed">{result.npkRecommendation.timing}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="border-l-4 border-l-green-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sprout className="w-5 h-5 text-green-600" />
                    Recommended Crops
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {result.recommendedCrops.map((c, i) => (
                    <Badge key={i} variant="outline" className="text-lg px-4 py-1.5 rounded-full border-green-200 bg-green-50 text-green-700">{c}</Badge>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-amber-500 bg-amber-50/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-amber-600" />
                    Organic Remedy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-amber-900 font-medium">
                    {result.organicAction}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Button 
              variant="outline" 
              className="w-full h-14 rounded-full text-lg font-bold border-primary text-primary hover:bg-primary/5"
              onClick={() => { setResult(null); setStep(0); setFormData({}); }}
            >
              Start New Analysis
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
