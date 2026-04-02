
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Filter, ShoppingCart, Star, MapPin, MessageSquare, ArrowRight, TrendingUp, Warehouse, Loader2 } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/firebase";
import { useLanguage } from "@/components/language-provider";
import Image from "next/image";

const PAN_INDIA_LISTINGS = [
  {
    id: 1,
    name: "Alphonso Mangoes",
    farm: "Ratnagiri Orchards",
    location: "Maharashtra",
    price: "₹850 / dozen",
    quality: "A+ Export Grade",
    rating: 4.9,
    img: "https://picsum.photos/seed/mango/600/400"
  },
  {
    id: 2,
    name: "Premium Basmati Rice",
    farm: "Amritsar Rice Godown",
    location: "Punjab",
    price: "₹125 / kg",
    quality: "Long Grain (Aged)",
    rating: 4.8,
    img: "https://picsum.photos/seed/rice/600/400"
  },
  {
    id: 3,
    name: "Erode Turmeric (Manjal)",
    farm: "Kongu Agri Exports",
    location: "Tamil Nadu",
    price: "₹160 / kg",
    quality: "High Curcumin",
    rating: 4.7,
    img: "https://picsum.photos/seed/turmeric/600/400"
  },
  {
    id: 4,
    name: "Coorg Arabica Coffee",
    farm: "Blue Mountain Estates",
    location: "Karnataka",
    price: "₹450 / kg",
    quality: "Organic Roasted",
    rating: 4.9,
    img: "https://picsum.photos/seed/coffee/600/400"
  },
  {
    id: 5,
    name: "Nashik Red Onions",
    farm: "Sahyadri Farmers Group",
    location: "Maharashtra",
    price: "₹38 / kg",
    quality: "Medium Size",
    rating: 4.5,
    img: "https://picsum.photos/seed/onion/600/400"
  },
  {
    id: 6,
    name: "Assam CTC Tea",
    farm: "Dibrugarh Tea Gardens",
    location: "Assam",
    price: "₹320 / kg",
    quality: "First Flush",
    rating: 4.6,
    img: "https://picsum.photos/seed/tea/600/400"
  }
];

export default function BuyerMarketplace() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    if (!isUserLoading && !user) {
      router.push("/auth");
    }
  }, [user, isUserLoading, router]);

  if (!isHydrated || isUserLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader role="buyer" />
      
      <main className="container mx-auto px-4 py-8">
        <section className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <h1 className="text-4xl font-headline font-bold mb-2">{t('marketplace')}</h1>
              <p className="text-muted-foreground">Directly source from Farmers, FPOs, and Regional Godowns across India.</p>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder={t('searchPlaceholder')} 
                  className="pl-9 h-11"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon" className="h-11 w-11">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {PAN_INDIA_LISTINGS.filter(l => 
              l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
              l.location.toLowerCase().includes(searchTerm.toLowerCase())
            ).map((listing) => (
              <Card key={listing.id} className="group hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col border-primary/10">
                <div className="aspect-[16/10] overflow-hidden relative">
                  <Image 
                    src={listing.img} 
                    alt={listing.name} 
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500" 
                    data-ai-hint="indian agriculture produce"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-white/95 text-primary hover:bg-white backdrop-blur shadow-sm border-none font-bold">
                      {listing.quality}
                    </Badge>
                  </div>
                </div>
                <CardHeader className="p-5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{listing.farm}</span>
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                      <Star className="w-3 h-3 fill-current" />
                      {listing.rating}
                    </div>
                  </div>
                  <CardTitle className="text-xl font-headline">{listing.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1 text-sm">
                    <MapPin className="w-3 h-3 text-primary" />
                    {listing.location}
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-5 pb-5">
                  <div className="text-2xl font-bold text-primary">{listing.price}</div>
                </CardContent>
                <CardFooter className="p-5 pt-0 mt-auto flex gap-3 border-t bg-muted/5">
                  <Button className="flex-1 rounded-full shadow-lg h-11">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Connect
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full h-11 w-11">
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        <section className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-primary text-primary-foreground overflow-hidden relative shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-headline">APMC Mandi Tracker</CardTitle>
              <CardDescription className="text-primary-foreground/80">Real-time daily rates from 500+ APMCs.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" className="rounded-full">Check Rates <TrendingUp className="w-4 h-4 ml-2" /></Button>
            </CardContent>
            <div className="absolute -bottom-10 -right-10 opacity-20 pointer-events-none">
              <TrendingUp className="w-48 h-48" />
            </div>
          </Card>
          
          <Card className="bg-secondary text-secondary-foreground overflow-hidden relative shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-headline">{t('nearbyHubs')}</CardTitle>
              <CardDescription className="text-secondary-foreground/80">Find certified warehouse space in TN, PB & MH.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="bg-transparent border-current rounded-full" onClick={() => router.push('/buyer/nearby')}>Explore Storage <Warehouse className="w-4 h-4 ml-2" /></Button>
            </CardContent>
            <div className="absolute -bottom-10 -right-10 opacity-20 pointer-events-none">
              <Warehouse className="w-48 h-48" />
            </div>
          </Card>

          <Card className="bg-amber-100 text-amber-900 border-amber-200 overflow-hidden relative shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-headline">Bulk Sourcing</CardTitle>
              <CardDescription className="text-amber-800/80">Connect with large-scale FPOs and Exporters.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="bg-amber-900 text-white hover:bg-amber-950 rounded-full">Request Quote <ArrowRight className="w-4 h-4 ml-2" /></Button>
            </CardContent>
            <div className="absolute -bottom-10 -right-10 opacity-10 pointer-events-none">
              <ShoppingCart className="w-48 h-48" />
            </div>
          </Card>
        </section>
      </main>
    </div>
  );
}
