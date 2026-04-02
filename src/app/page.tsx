
import Link from "next/link";
import Image from "next/image";
import { 
  Tractor, 
  ShoppingBag, 
  Sprout, 
  ArrowRight, 
  CloudSun, 
  Leaf, 
  TrendingUp, 
  FlaskConical,
  Mic,
  ShieldCheck,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === "hero-farm");
  const farmerWorking = PlaceHolderImages.find(img => img.id === "farmer-working");

  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-primary selection:text-primary-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-primary/10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg text-primary-foreground shadow-lg shadow-primary/20">
              <Sprout className="w-6 h-6" />
            </div>
            <span className="font-headline font-bold text-xl tracking-tight">
              FarmersBuddy
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth?mode=login" className="text-sm font-medium hover:text-primary transition-colors hidden sm:block">
              Login
            </Link>
            <Button asChild className="rounded-full px-6 shadow-md shadow-primary/10">
              <Link href="/auth?mode=signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative w-full py-20 lg:py-32 overflow-hidden border-b border-primary/5">
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
                <div className="space-y-4">
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider animate-pulse">
                    🇮🇳 Proudly Serving Indian Agriculture
                  </Badge>
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-headline font-bold leading-[1.1] tracking-tight text-foreground">
                    Modern AI for <br />
                    <span className="text-primary italic">Indian Farmers.</span>
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground text-lg md:text-xl font-body leading-relaxed">
                    Bridging the gap between the soil and the cloud. Empowering farmers with AI-driven weather insights, disease detection, and direct marketplace access.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button asChild size="lg" className="rounded-full h-14 px-8 text-lg font-bold shadow-xl shadow-primary/20 group">
                    <Link href="/auth?role=farmer&mode=signup" className="flex items-center">
                      Join as a Farmer
                      <Tractor className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="rounded-full h-14 px-8 text-lg font-bold border-2 hover:bg-secondary/5 group">
                    <Link href="/auth?role=buyer&mode=signup" className="flex items-center">
                      Join as a Buyer
                      <ShoppingBag className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                    </Link>
                  </Button>
                </div>

                <div className="flex items-center gap-6 pt-4 border-t border-primary/10">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-muted overflow-hidden">
                        <Image src={`https://picsum.photos/seed/user${i}/100/100`} alt="User" width={40} height={40} />
                      </div>
                    ))}
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">
                    <span className="text-primary font-bold">10,000+</span> farmers joined this month
                  </p>
                </div>
              </div>

              <div className="relative aspect-square lg:aspect-auto lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-right-8 duration-700 delay-150">
                {heroImage && (
                  <Image 
                    src={heroImage.imageUrl} 
                    alt="Indian Farmland" 
                    fill 
                    className="object-cover" 
                    priority
                    data-ai-hint="indian agriculture"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />
                
                {/* Floating UI Elements */}
                <div className="absolute top-8 left-8 bg-white/95 backdrop-blur p-4 rounded-2xl shadow-xl border border-primary/10 max-w-[200px] hidden sm:block">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <span className="text-xs font-bold uppercase text-muted-foreground">Price Alert</span>
                  </div>
                  <p className="text-sm font-bold">Basmati Rice up by ₹120 in Amritsar Mandi</p>
                </div>

                <div className="absolute bottom-8 right-8 bg-primary/95 backdrop-blur text-primary-foreground p-4 rounded-2xl shadow-xl max-w-[200px]">
                  <div className="flex items-center gap-2 mb-2">
                    <CloudSun className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase opacity-80">Karur Forecast</span>
                  </div>
                  <p className="text-sm font-bold">Rain Expected on Sunday. Secure your harvest.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Showcase */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <h2 className="text-sm font-bold text-primary uppercase tracking-[0.2em]">Our Solutions</h2>
              <p className="text-4xl font-headline font-bold text-foreground">AI Built for the Soil</p>
              <p className="text-muted-foreground text-lg">
                We've spent thousands of hours analyzing regional crop patterns across India to bring you accurate, scientific guidance.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: "Climate AI",
                  desc: "Hyper-local weather forecasts and precise irrigation timing for your specific Mandi zone.",
                  icon: CloudSun,
                  color: "bg-blue-500",
                },
                {
                  title: "Crop Doctor",
                  desc: "Instant disease identification using just your phone camera. 98% accuracy on local Indian crops.",
                  icon: Leaf,
                  color: "bg-green-500",
                },
                {
                  title: "Soil Analyst",
                  desc: "Scientific nutrient reports and organic alternatives to help you save on fertilizer costs.",
                  icon: FlaskConical,
                  color: "bg-amber-500",
                },
                {
                  title: "Mandi Predictor",
                  desc: "Historical trend analysis to tell you exactly when to sell to maximize your ₹ profits.",
                  icon: TrendingUp,
                  color: "bg-purple-500",
                }
              ].map((feature, idx) => (
                <div key={idx} className="bg-background p-8 rounded-3xl border border-primary/5 hover:border-primary/20 shadow-sm hover:shadow-xl transition-all duration-300 group">
                  <div className={`${feature.color} w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                    <feature.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-headline font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AI Voice Assistant Highlight */}
        <section className="py-24 overflow-hidden relative">
          <div className="container mx-auto px-4">
            <div className="bg-primary rounded-[3rem] p-12 lg:p-20 text-primary-foreground relative overflow-hidden flex flex-col lg:flex-row items-center gap-12 shadow-2xl shadow-primary/30">
              <div className="space-y-6 lg:w-1/2 relative z-10">
                <Badge variant="outline" className="border-primary-foreground/30 text-primary-foreground bg-primary-foreground/10 px-4 py-1.5 rounded-full font-bold">
                  Voice First Technology
                </Badge>
                <h2 className="text-4xl md:text-5xl font-headline font-bold leading-tight">
                  Speak in your own <br className="hidden md:block" /> Language.
                </h2>
                <p className="text-lg opacity-90 font-body max-w-md">
                  No typing required. Simply ask "Buddy" about your crops in Tamil, Hindi, Punjabi, or Marathi, and get voice guidance instantly.
                </p>
                <div className="flex items-center gap-4 pt-4">
                  <div className="flex gap-2">
                    <span className="w-1 h-8 bg-white/40 animate-[bounce_1s_infinite_100ms]" />
                    <span className="w-1 h-12 bg-white/60 animate-[bounce_1s_infinite_200ms]" />
                    <span className="w-1 h-10 bg-white/40 animate-[bounce_1s_infinite_300ms]" />
                  </div>
                  <p className="font-bold">"Buddy, Karur-la inaiku mazhai varuma?"</p>
                </div>
              </div>
              <div className="lg:w-1/2 relative flex justify-center">
                <div className="w-64 h-64 bg-white/10 rounded-full flex items-center justify-center border border-white/20 relative animate-pulse">
                  <Mic className="w-24 h-24" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-80 h-80 rounded-full border-2 border-white/5 animate-[ping_3s_infinite]" />
                </div>
              </div>
              
              {/* Background abstract decoration */}
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary-foreground/10 rounded-full blur-3xl" />
            </div>
          </div>
        </section>

        {/* Secondary CTA Section */}
        <section className="py-24 border-t border-primary/5">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative aspect-video rounded-3xl overflow-hidden shadow-xl border border-primary/10">
                {farmerWorking && (
                  <Image 
                    src={farmerWorking.imageUrl} 
                    alt="Farmer using app" 
                    fill 
                    className="object-cover"
                    data-ai-hint="indian farmer"
                  />
                )}
              </div>
              <div className="space-y-8">
                <div className="space-y-4">
                  <h2 className="text-4xl font-headline font-bold">Ready to digitize your Farm?</h2>
                  <p className="text-muted-foreground text-lg">
                    Join the thousands of Indian farmers using FarmersBuddy to secure their future and increase their yearly profit.
                  </p>
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-full bg-primary/10 text-primary">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold">Safe & Secure</h4>
                      <p className="text-sm text-muted-foreground">Your farm data is encrypted and private.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-full bg-secondary/10 text-secondary">
                      <Zap className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold">Instant Sync</h4>
                      <p className="text-sm text-muted-foreground">Real-time alerts directly to your phone.</p>
                    </div>
                  </div>
                </div>
                <Button asChild size="lg" className="rounded-full w-full sm:w-auto px-12 h-14">
                  <Link href="/auth?mode=signup">Start Your Journey <ArrowRight className="ml-2 w-5 h-5" /></Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-card py-16 border-t border-primary/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="bg-primary p-1 rounded-lg text-primary-foreground">
                  <Sprout className="w-5 h-5" />
                </div>
                <span className="font-headline font-bold text-lg">FarmersBuddy</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Empowering the backbone of India with the world's most advanced agricultural AI.
              </p>
            </div>
            <div>
              <h5 className="font-bold mb-4">Farmer Tools</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/farmer/climate" className="hover:text-primary transition-colors">Climate Modelling</Link></li>
                <li><Link href="/farmer/disease" className="hover:text-primary transition-colors">Disease Management</Link></li>
                <li><Link href="/farmer/soil" className="hover:text-primary transition-colors">Soil Testing</Link></li>
                <li><Link href="/farmer/market" className="hover:text-primary transition-colors">Market Forecasts</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4">Buyer Tools</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/buyer" className="hover:text-primary transition-colors">Direct Marketplace</Link></li>
                <li><Link href="/buyer/trends" className="hover:text-primary transition-colors">Regional Trends</Link></li>
                <li><Link href="/buyer/nearby" className="hover:text-primary transition-colors">Regional Godowns</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4">Support</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Help Center</li>
                <li>Mandi Listings</li>
                <li>Privacy Policy</li>
                <li>Contact Us</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-primary/5 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} FarmersBuddy AI. All Rights Reserved. Made for India.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
