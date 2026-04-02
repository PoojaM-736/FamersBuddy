"use client";

import { useState } from "react";
import { Camera, Upload, Loader2, Leaf, AlertCircle, ShieldCheck, Languages, Info } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { diagnoseCropDisease, DiagnoseCropDiseaseOutput } from "@/ai/flows/diagnose-crop-disease";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function DiseaseDiagnosis() {
  const [image, setImage] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnoseCropDiseaseOutput | null>(null);
  const [showTamil, setShowTamil] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDiagnose = async () => {
    if (!image) return;
    setLoading(true);
    setResult(null);
    try {
      const diagnosis = await diagnoseCropDisease({
        photoDataUri: image,
        description: description,
      });
      setResult(diagnosis);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader role="farmer" />
      
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-headline font-bold mb-2">Crop Doctor</h1>
            <p className="text-muted-foreground">High-precision AI detection for Indian crops.</p>
          </div>
          <Badge variant="outline" className="h-8 border-primary text-primary font-bold">
            92% Model Accuracy
          </Badge>
        </header>

        <div className="grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-lg border-primary/10">
              <CardHeader>
                <CardTitle>Scan Leaf</CardTitle>
                <CardDescription>Upload photo for disease analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div 
                  className={`relative aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-all duration-300 ${
                    image ? 'border-primary/50 bg-primary/5 shadow-inner' : 'border-muted-foreground/20 hover:border-primary/50'
                  }`}
                >
                  {image ? (
                    <>
                      <img src={image} alt="Crop scan" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        className="absolute bottom-3 right-3 rounded-full shadow-lg"
                        onClick={() => setImage(null)}
                      >
                        Change Photo
                      </Button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-2 p-8 text-center group cursor-pointer">
                      <div className="p-4 rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform shadow-sm">
                        <Camera className="w-10 h-10" />
                      </div>
                      <p className="text-sm font-bold mt-2">Click or Drag Image</p>
                      <p className="text-xs text-muted-foreground">Supports JPG, PNG (Max 10MB)</p>
                      <input 
                        type="file" 
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold flex items-center gap-2">
                    <Info className="w-4 h-4 text-primary" />
                    Additional Symptoms
                  </label>
                  <Textarea 
                    placeholder="e.g. noticing yellow spots on stems..." 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-[100px] rounded-xl"
                  />
                </div>

                <Button 
                  className="w-full h-14 text-lg rounded-full font-bold shadow-lg shadow-primary/20" 
                  disabled={!image || loading}
                  onClick={handleDiagnose}
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin mr-2" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="mr-2" />
                      Analyze Disease
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            {!result && !loading && (
              <Card className="h-full flex flex-col items-center justify-center p-12 text-center bg-muted/20 border-dashed border-2">
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
                  <Leaf className="w-12 h-12 text-muted-foreground opacity-50" />
                </div>
                <h3 className="font-headline font-bold text-2xl mb-2">Ready for Scan</h3>
                <p className="text-muted-foreground max-w-xs mx-auto leading-relaxed">
                  Upload a leaf photo and click "Analyze" to see detailed diagnosis and treatment metrics.
                </p>
              </Card>
            )}

            {loading && (
              <Card className="h-full flex flex-col items-center justify-center p-12 space-y-8 animate-pulse">
                <div className="relative">
                  <Loader2 className="w-24 h-24 text-primary animate-spin" />
                  <Leaf className="w-12 h-12 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="font-headline font-bold text-2xl">Consulting AI Doctor</h3>
                  <p className="text-muted-foreground">Detecting early/late blight and pest markers...</p>
                </div>
              </Card>
            )}

            {result && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <Card className="overflow-hidden border-2 shadow-xl">
                  <CardHeader className={`${result.diagnosis.diseaseDetected ? "bg-red-50" : "bg-green-50"} border-b`}>
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <CardTitle className="text-3xl font-headline font-bold">
                          {result.diagnosis.diseaseDetected ? "DETECTED: " : ""}
                          {result.diagnosis.diseaseName}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 font-medium">
                          Target Crop: <span className="text-foreground">{result.identification.commonName}</span>
                          <span className="opacity-50">|</span>
                          <span className="italic">{result.identification.latinName}</span>
                        </CardDescription>
                      </div>
                      <Badge 
                        variant={result.diagnosis.diseaseDetected ? "destructive" : "default"} 
                        className="text-lg px-4 py-1.5 rounded-full shadow-sm"
                      >
                        {result.diagnosis.confidence}% Confidence
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8 space-y-8">
                    <div className="space-y-4">
                      <div className="flex justify-between items-end mb-2">
                        <h4 className="font-bold text-lg flex items-center gap-2">
                          <AlertCircle className={`w-5 h-5 ${result.diagnosis.diseaseDetected ? "text-red-500" : "text-green-500"}`} />
                          Disease Confidence Score
                        </h4>
                        <span className="text-2xl font-black">{result.diagnosis.confidence}%</span>
                      </div>
                      <Progress value={result.diagnosis.confidence} className="h-3 bg-muted" />
                    </div>

                    <div className="grid gap-6">
                      <Card className="bg-primary/5 border-none">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-xl font-bold flex items-center gap-2">
                              <ShieldCheck className="w-6 h-6 text-primary" />
                              Expert Recommendation
                            </CardTitle>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="rounded-full bg-background font-bold text-xs h-8"
                              onClick={() => setShowTamil(!showTamil)}
                            >
                              <Languages className="w-3.5 h-3.5 mr-2" />
                              {showTamil ? "English Version" : "Translate to Tamil"}
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-2">
                          <div className="p-6 bg-background rounded-2xl border shadow-sm">
                            <p className="text-lg leading-relaxed font-medium whitespace-pre-wrap">
                              {showTamil ? result.diagnosis.treatmentTamil : result.diagnosis.treatment}
                            </p>
                            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                              <Info className="w-3 h-3" />
                              Metric-Based Treatment Provided
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button variant="outline" className="flex-1 h-12 rounded-full font-bold">
                        Print Diagnosis
                      </Button>
                      <Button className="flex-1 h-12 rounded-full font-bold bg-secondary text-secondary-foreground hover:bg-secondary/90">
                        Connect to Agri-Expert
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
