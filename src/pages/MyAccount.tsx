import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, User } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const MyAccount = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // Billing address
  const [billingLine1, setBillingLine1] = useState("");
  const [billingLine2, setBillingLine2] = useState("");
  const [billingCity, setBillingCity] = useState("");
  const [billingState, setBillingState] = useState("");
  const [billingPincode, setBillingPincode] = useState("");
  const [billingCountry, setBillingCountry] = useState("India");

  // Shipping address
  const [shippingLine1, setShippingLine1] = useState("");
  const [shippingLine2, setShippingLine2] = useState("");
  const [shippingCity, setShippingCity] = useState("");
  const [shippingState, setShippingState] = useState("");
  const [shippingPincode, setShippingPincode] = useState("");
  const [shippingCountry, setShippingCountry] = useState("India");

  const [sameAsBilling, setSameAsBilling] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate("/auth", { state: { from: "/my-account" } });
        return;
      }

      setUserId(session.user.id);
      setEmail(session.user.email || "");

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      if (profile) {
        setFullName(profile.full_name || "");
        setPhone(profile.phone || "");
        if (profile.email) setEmail(profile.email);
        setBillingLine1((profile as any).billing_address_line1 || "");
        setBillingLine2((profile as any).billing_address_line2 || "");
        setBillingCity((profile as any).billing_city || "");
        setBillingState((profile as any).billing_state || "");
        setBillingPincode((profile as any).billing_pincode || "");
        setBillingCountry((profile as any).billing_country || "India");
        setShippingLine1((profile as any).shipping_address_line1 || "");
        setShippingLine2((profile as any).shipping_address_line2 || "");
        setShippingCity((profile as any).shipping_city || "");
        setShippingState((profile as any).shipping_state || "");
        setShippingPincode((profile as any).shipping_pincode || "");
        setShippingCountry((profile as any).shipping_country || "India");
      }
      setLoading(false);
    };

    init();
  }, [navigate]);

  useEffect(() => {
    if (sameAsBilling) {
      setShippingLine1(billingLine1);
      setShippingLine2(billingLine2);
      setShippingCity(billingCity);
      setShippingState(billingState);
      setShippingPincode(billingPincode);
      setShippingCountry(billingCountry);
    }
  }, [sameAsBilling, billingLine1, billingLine2, billingCity, billingState, billingPincode, billingCountry]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setSaving(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          phone,
          email,
          billing_address_line1: billingLine1,
          billing_address_line2: billingLine2,
          billing_city: billingCity,
          billing_state: billingState,
          billing_pincode: billingPincode,
          billing_country: billingCountry,
          shipping_address_line1: shippingLine1,
          shipping_address_line2: shippingLine2,
          shipping_city: shippingCity,
          shipping_state: shippingState,
          shipping_pincode: shippingPincode,
          shipping_country: shippingCountry,
        } as any)
        .eq("user_id", userId);

      if (error) throw error;

      await supabase.auth.updateUser({
        data: { full_name: fullName },
      });

      toast({ title: "Profile updated successfully! ✅" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="text-center space-y-2 mb-8">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
            <User className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-heading gold-text">My Account</h1>
          <p className="text-muted-foreground text-sm">Update your profile & address details</p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Personal Details */}
          <div className="glass-card p-6 space-y-4">
            <h2 className="text-lg font-heading font-semibold text-foreground">Personal Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 XXXXX XXXXX" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
          </div>

          {/* Billing Address */}
          <div className="glass-card p-6 space-y-4">
            <h2 className="text-lg font-heading font-semibold text-foreground">Billing Address</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Address Line 1</Label>
                <Input value={billingLine1} onChange={(e) => setBillingLine1(e.target.value)} placeholder="House/Flat No., Building Name" />
              </div>
              <div className="space-y-2">
                <Label>Address Line 2</Label>
                <Input value={billingLine2} onChange={(e) => setBillingLine2(e.target.value)} placeholder="Street, Locality" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input value={billingCity} onChange={(e) => setBillingCity(e.target.value)} placeholder="City" />
                </div>
                <div className="space-y-2">
                  <Label>State</Label>
                  <Input value={billingState} onChange={(e) => setBillingState(e.target.value)} placeholder="State" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Pincode</Label>
                  <Input value={billingPincode} onChange={(e) => setBillingPincode(e.target.value)} placeholder="Pincode" />
                </div>
                <div className="space-y-2">
                  <Label>Country</Label>
                  <Input value={billingCountry} onChange={(e) => setBillingCountry(e.target.value)} placeholder="Country" />
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-heading font-semibold text-foreground">Shipping Address</h2>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sameAsBilling"
                checked={sameAsBilling}
                onCheckedChange={(checked) => setSameAsBilling(checked === true)}
              />
              <Label htmlFor="sameAsBilling" className="text-sm text-muted-foreground cursor-pointer">
                Same as billing address
              </Label>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Address Line 1</Label>
                <Input value={shippingLine1} onChange={(e) => setShippingLine1(e.target.value)} placeholder="House/Flat No., Building Name" disabled={sameAsBilling} />
              </div>
              <div className="space-y-2">
                <Label>Address Line 2</Label>
                <Input value={shippingLine2} onChange={(e) => setShippingLine2(e.target.value)} placeholder="Street, Locality" disabled={sameAsBilling} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input value={shippingCity} onChange={(e) => setShippingCity(e.target.value)} placeholder="City" disabled={sameAsBilling} />
                </div>
                <div className="space-y-2">
                  <Label>State</Label>
                  <Input value={shippingState} onChange={(e) => setShippingState(e.target.value)} placeholder="State" disabled={sameAsBilling} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Pincode</Label>
                  <Input value={shippingPincode} onChange={(e) => setShippingPincode(e.target.value)} placeholder="Pincode" disabled={sameAsBilling} />
                </div>
                <div className="space-y-2">
                  <Label>Country</Label>
                  <Input value={shippingCountry} onChange={(e) => setShippingCountry(e.target.value)} placeholder="Country" disabled={sameAsBilling} />
                </div>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={saving}>
            {saving && <Loader2 className="animate-spin mr-2 w-4 h-4" />}
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default MyAccount;
