
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sprout, Menu, User, Bell, LogOut, Repeat, Languages, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useAuth, useUser } from "@/firebase";
import { signOut } from "firebase/auth";
import { useLanguage } from "@/components/language-provider";
import { Language } from "@/lib/translations";

export function AppHeader({ role }: { role?: "farmer" | "buyer" }) {
  const auth = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const languages: { name: string; code: Language }[] = [
    { name: "English", code: "en" },
    { name: "தமிழ் (Tamil)", code: "ta" },
    { name: "हिन्दी (Hindi)", code: "hi" },
    { name: "ਪੰਜਾਬੀ (Punjabi)", code: "pa" },
    { name: "मराठी (Marathi)", code: "mr" },
  ];

  const currentLangName = languages.find(l => l.code === language)?.name || "English";
  const profilePath = role === "farmer" ? "/farmer/profile" : "/buyer/profile";

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href={role ? `/${role}` : "/"} className="flex items-center gap-2">
          <div className="bg-primary p-1.5 rounded-lg text-primary-foreground">
            <Sprout className="w-6 h-6" />
          </div>
          <span className="font-headline font-bold text-xl tracking-tight hidden sm:inline-block">
            FarmersBuddy
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {role === "farmer" && (
            <>
              <Link href="/farmer/climate" className="text-sm font-medium hover:text-primary transition-colors">{t('climate')}</Link>
              <Link href="/farmer/disease" className="text-sm font-medium hover:text-primary transition-colors">{t('disease')}</Link>
              <Link href="/farmer/soil" className="text-sm font-medium hover:text-primary transition-colors">{t('soil')}</Link>
              <Link href="/farmer/market" className="text-sm font-medium hover:text-primary transition-colors">{t('market')}</Link>
            </>
          )}
          {role === "buyer" && (
            <>
              <Link href="/buyer" className="text-sm font-medium hover:text-primary transition-colors">{t('marketplace')}</Link>
              <Link href="/buyer/trends" className="text-sm font-medium hover:text-primary transition-colors">{t('priceTrends')}</Link>
              <Link href="/buyer/nearby" className="text-sm font-medium hover:text-primary transition-colors">{t('nearbyHubs')}</Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2 rounded-full px-3">
                <Languages className="w-4 h-4" />
                <span className="hidden sm:inline">{currentLangName}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Select Language</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {languages.map((lang) => (
                <DropdownMenuItem 
                  key={lang.code} 
                  onClick={() => setLanguage(lang.code)}
                  className={language === lang.code ? "bg-primary/10 text-primary font-bold" : ""}
                >
                  {lang.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {user && (
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-background" />
            </Button>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {user ? (
                <>
                  <div className="px-2 py-1.5 text-sm font-medium truncate opacity-70">
                    {user.email}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/" className="flex items-center gap-2">
                      <Repeat className="w-4 h-4" /> {t('switchRole')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={profilePath} className="flex items-center gap-2">
                      <Settings className="w-4 h-4" /> {t('settings')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive flex items-center gap-2 font-bold">
                    <LogOut className="w-4 h-4" /> {t('logout')}
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem asChild>
                  <Link href="/auth">Sign In</Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
