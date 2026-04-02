
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Building2, Phone, MapPin, Save, Loader2, Camera } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFirestore, useUser, useDoc, useMemoFirebase } from "@/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

export default function BuyerProfilePage() {
  const router = useRouter();
  const db = useFirestore();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();

  const profileRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, "users", user.uid, "buyerProfile", "profile");
  }, [db, user]);

  const { data: profileData, isLoading: isProfileLoading } = useDoc(profileRef);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    contactPerson: "",
    contactNumber: "",
    address: "",
    companyName: "",
  });

  useEffect(() => {
    if (profileData) {
      setFormData({
        contactPerson: profileData.contactPerson || "",
        contactNumber: profileData.contactNumber || "",
        address: profileData.address || "",
        companyName: profileData.companyName || "",
      });
    }
  }, [profileData]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileRef) return;

    setLoading(true);
    try {
      await setDoc(profileRef, {
        ...formData,
        updatedAt: serverTimestamp(),
      }, { merge: true });

      toast({
        title: "Profile Updated",
        description: "Your buyer profile has been saved successfully.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.message || "Could not update profile.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (isUserLoading || isProfileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader role="buyer" />
      
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <header className="mb-8">
          <h1 className="text-3xl font-headline font-bold mb-2">Buyer Profile</h1>
          <p className="text-muted-foreground">Manage your sourcing identity and business information.</p>
        </header>

        <form onSubmit={handleUpdateProfile}>
          <Card className="shadow-xl border-primary/10 overflow-hidden">
            <CardHeader className="bg-secondary/5 text-center pb-8">
              <div className="relative mx-auto w-24 h-24 mb-4">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center border-4 border-background shadow-inner">
                  <User className="w-12 h-12 text-muted-foreground" />
                </div>
                <Button 
                  size="icon" 
                  variant="secondary" 
                  className="absolute bottom-0 right-0 rounded-full h-8 w-8 shadow-md"
                  type="button"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>
              <CardTitle className="text-xl">{formData.contactPerson || "Unnamed Buyer"}</CardTitle>
              <CardDescription>{user?.email}</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="contactPerson">Full Name / Contact Person</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="contactPerson"
                    placeholder="Enter your name"
                    className="pl-10 h-11"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name (Optional)</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="companyName"
                    placeholder="Enter your company name"
                    className="pl-10 h-11"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Contact Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 00000 00000"
                    className="pl-10 h-11"
                    value={formData.contactNumber}
                    onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="address"
                    placeholder="Locality, City, State"
                    className="pl-10 h-11"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-8 pt-0 flex justify-end gap-3">
              <Button variant="outline" type="button" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="rounded-full px-8 bg-secondary text-secondary-foreground">
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save Profile
              </Button>
            </CardFooter>
          </Card>
        </form>
      </main>
    </div>
  );
}
