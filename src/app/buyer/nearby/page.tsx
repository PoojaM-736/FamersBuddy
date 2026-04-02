
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Search, Filter, Phone, Navigation, Star, Warehouse, Loader2 } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/firebase";
import { useLanguage } from "@/components/language-provider";
import Image from "next/image";

const REGIONAL_PRODUCERS = [
  {
    id: 1,
    name: "Ratnagiri Mango Orchards",
    owner: "Sanjay Patil",
    distance: "2.4 km",
    specialty: "Alphonso Mangoes",
    state: "Maharashtra",
    rating: 4.9,
    address: "Pawas Road, Ratnagiri Mandi Sector",
    img: "https://picsum.photos/seed/mango/600/400"
  },
  {
    id: 2,
    name: "Amritsar Rice Godown & Sorters",
    owner: "Gurmeet Singh",
    distance: "5.1 km",
    specialty: "Basmati Rice & Wheat",
    state: "Punjab",
    rating: 4.8,
    address: "Barnala Highway, Sangrur Mandi",
    img: "https://picsum.photos/seed/rice/600/400"
  },
  {
    id: 3,
    name: "Kongu Turmeric Hub",
    owner: "K. Palanisamy",
    distance: "3.2 km",
    specialty: "Turmeric & Small Onions",
    state: "Tamil Nadu",
    rating: 4.7,
    address: "Perundurai Road, Erode Market",
    img: "https://picsum.photos/seed/turmeric/600/400"
  },
  {
    id: 4,
    name: "Nashik APMC Onion Godown",
    owner: "Vikram Deshmukh",
    distance: "8.7 km",
    specialty: "Red Onions & Export Grapes",
    state: "Maharashtra",
    rating: 4.6,
    address: "Lasalgaon APMC Road",
    img: "https://picsum.photos/seed/onion/600/400"
  },
  {
    id: 5,
    name: "Cauvery Delta Paddy Hub",
    owner: "M. Kumaran",
    distance: "12.3 km",
    specialty: "Ponni Rice & Pulses",
    state: "Tamil Nadu",
    rating: 4.5,
    address: "Thanjavur-Trichy Highway",
    img: "https://picsum.photos/seed/paddy/600/400"
  },
  {
    id: 6,
    name: "Ludhiana Wheat Silos",
    owner: "Harpreet Brar",
    distance: "15.0 km",
    specialty: "Sharbati Wheat",
    state: "Punjab",
    rating: 4.8,
    address: "Moga Road, Ludhiana Outer",
    img: "https://picsum.photos/seed/wheat/600/400"
  }
];

export default function NearbyFarms() {
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
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl font-headline font-bold mb-2">{t('nearbyHubs')}</h1>
              <p className="text-muted-foreground">Find certified storage godowns and APMC Mandis in TN, PB, and MH.</p>
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
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {REGIONAL_PRODUCERS.filter(f => 
            f.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            f.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
            f.specialty.toLowerCase().includes(searchTerm.toLowerCase())
          ).map((farm) => (
            <Card key={farm.id} className="group hover:shadow-2xl transition-all duration-300 overflow-hidden border-primary/10">
              <div className="flex flex-col sm:flex-row h-full">
                <div className="sm:w-2/5 aspect-square sm:aspect-auto overflow-hidden relative min-h-[200px]">
                  <Image 
                    src={farm.img} 
                    alt={farm.name} 
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500" 
                    data-ai-hint="indian agriculture godown"
                  />
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    <Badge className="bg-primary/90 text-primary-foreground border-none font-bold">
                      {farm.distance}
                    </Badge>
                    <Badge variant="secondary" className="bg-white/90 text-primary font-bold">
                      {farm.state}
                    </Badge>
                  </div>
                </div>
                <div className="flex-1 p-6 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <div className="space-y-1">
                      <h3 className="text-xl font-headline font-bold group-hover:text-primary transition-colors">{farm.name}</h3>
                      <p className="text-sm text-muted-foreground font-medium flex items-center gap-1">
                        <Navigation className="w-3 h-3" /> Agent: {farm.owner}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                      <Star className="w-4 h-4 fill-current" />
                      {farm.rating}
                    </div>
                  </div>
                  
                  <div className="space-y-3 my-4 flex-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 text-primary shrink-0" />
                      <span className="line-clamp-1">{farm.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm p-2 bg-muted/30 rounded-lg">
                      <Warehouse className="w-4 h-4 text-primary shrink-0" />
                      <span className="font-bold">Focus: {farm.specialty}</span>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t">
                    <Button variant="outline" size="sm" className="rounded-full flex-1 h-9 font-bold">
                      <Phone className="w-3.5 h-3.5 mr-2" />
                      Call Hub
                    </Button>
                    <Button size="sm" className="rounded-full flex-1 h-9 shadow-md font-bold">
                      View Stock
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
