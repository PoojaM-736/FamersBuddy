
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Sprout, Loader2, Mail, Lock, Building2, Tractor, Phone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth, useFirestore, useUser } from "@/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("role") || "farmer";
  const mode = searchParams.get("mode");
  const auth = useAuth();
  const db = useFirestore();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();

  const [isLogin, setIsLogin] = useState(mode !== "signup");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState(initialRole);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
  });

  // Effect to handle redirection after login/signup
  useEffect(() => {
    const handleRedirection = async () => {
      if (!isUserLoading && user && db) {
        setLoading(true);
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            router.push(userData.role === "farmer" ? "/farmer" : "/buyer");
          } else {
            // Fallback if doc doesn't exist yet (e.g., race condition)
            router.push(role === "farmer" ? "/farmer" : "/buyer");
          }
        } catch (error) {
          console.error("Redirection error:", error);
          router.push(role === "farmer" ? "/farmer" : "/buyer");
        } finally {
          setLoading(false);
        }
      }
    };
    handleRedirection();
  }, [user, isUserLoading, db, router, role]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
        toast({ title: "Welcome back!", description: "Signed in successfully." });
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const uid = userCredential.user.uid;

        // Create user document
        await setDoc(doc(db, "users", uid), {
          id: uid,
          email: formData.email,
          role: role,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        // Create specific profile
        if (role === "farmer") {
          await setDoc(doc(db, "users", uid, "farmerProfile", "profile"), {
            id: "profile",
            userId: uid,
            farmName: formData.name,
            contactNumber: formData.phone,
            address: "Pending Location",
            latitude: 0,
            longitude: 0,
          });
        } else {
          await setDoc(doc(db, "users", uid, "buyerProfile", "profile"), {
            id: "profile",
            userId: uid,
            contactPerson: formData.name,
            contactNumber: formData.phone,
            address: "Pending Location",
            latitude: 0,
            longitude: 0,
          });
        }

        toast({ title: "Account created!", description: `Successfully registered as a ${role}.` });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: error.message || "Invalid credentials. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 sm:p-8">
      <Card className="w-full max-w-md shadow-2xl border-primary/10 overflow-hidden">
        <CardHeader className="text-center bg-primary/5 pb-8 pt-10">
          <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary/20 animate-in zoom-in-50 duration-500">
            <Sprout className="w-10 h-10 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl font-headline font-bold text-foreground">
            {isLogin ? "Sign In" : "Get Started"}
          </CardTitle>
          <CardDescription className="text-muted-foreground mt-2">
            {isLogin ? "Enter your credentials to continue." : `Joining as a ${role.charAt(0).toUpperCase() + role.slice(1)}`}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleAuth}>
          <CardContent className="space-y-5 p-8">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="pl-10 h-11 rounded-xl"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 h-11 rounded-xl"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            {!isLogin && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name">{role === "farmer" ? "Farm Name" : "Contact Person"}</Label>
                  <div className="relative">
                    {role === "farmer" ? (
                      <Tractor className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    ) : (
                      <Building2 className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    )}
                    <Input
                      id="name"
                      placeholder={role === "farmer" ? "Green Valleys Farm" : "Your Name / Company"}
                      className="pl-10 h-11 rounded-xl"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      className="pl-10 h-11 rounded-xl"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-4 p-8 pt-0">
            <Button className="w-full rounded-full h-12 text-lg font-bold shadow-xl shadow-primary/20 transition-all hover:scale-[1.02]" type="submit" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : isLogin ? "Sign In" : "Create Account"}
              {!loading && <ArrowRight className="ml-2 w-5 h-5" />}
            </Button>
            
            <div className="text-sm text-center text-muted-foreground">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                type="button"
                className="text-primary font-bold hover:underline"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? "Create one" : "Sign In instead"}
              </button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
