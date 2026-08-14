import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Loader2, CreditCard, Ticket } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { fbTrack } from "@/lib/fbpixel";
import { Helmet } from "react-helmet-async";

import { cn } from "@/lib/utils";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const BookNow = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselected = searchParams.get("service");

  const [servicesList, setServicesList] = useState<any[]>([]);
  const [dbLoading, setDbLoading] = useState(true);

  const [selected, setSelected] = useState<string[]>([]);
  const [form, setForm] = useState({
    name: "", dob: "", tob: "", pob: "", address: "", phone: "", email: "", notes: "",
    partnerName: "", partnerDob: "", partnerTob: "", partnerPob: "",
  });
  const [loading, setLoading] = useState(false);

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponLoading, setCouponLoading] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase.from("services").select("*").eq("is_active", true).order("sort_order");
      if (!error && data) {
        setServicesList(data);
        if (preselected && data.some((s) => s.title === preselected)) {
          setSelected([preselected]);
        }
      }
      setDbLoading(false);
    };
    fetchServices();
  }, [preselected]);

  // Prefill user details
  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle();
      if (profile) {
        setForm(prev => ({
          ...prev,
          name: profile.full_name || prev.name,
          phone: profile.phone || prev.phone,
          email: profile.email || user.email || prev.email,
          address: profile.shipping_address_line1 ? `${profile.shipping_address_line1}, ${profile.shipping_city || ''}` : prev.address
        }));
      } else {
        setForm(prev => ({ ...prev, name: user.user_metadata?.full_name || prev.name, email: user.email || prev.email }));
      }
    };
    fetchProfile();
  }, []);

  const subtotal = servicesList.filter((s) => selected.includes(s.title)).reduce((a, s) => a + s.price, 0);

  const computeDiscount = (coupon: any, amount: number) => {
    if (!coupon) return 0;
    let d = coupon.discount_type === "percent"
      ? Math.floor((amount * coupon.discount_value) / 100)
      : coupon.discount_value;
    if (coupon.max_discount) d = Math.min(d, coupon.max_discount);
    return Math.min(d, amount);
  };

  const discount = computeDiscount(appliedCoupon, subtotal);
  const grandTotal = Math.max(subtotal - discount, 0);

  const applyCoupon = async () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) return;
    setCouponLoading(true);
    try {
      const { data, error } = await supabase.from("coupons").select("*").eq("code", code).eq("is_active", true).maybeSingle();
      if (error) throw error;
      if (!data) {
        toast({ title: "Invalid coupon", variant: "destructive" });
        return;
      }
      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        toast({ title: "Coupon expired", variant: "destructive" });
        return;
      }
      if (subtotal < (data.min_order_amount || 0)) {
        toast({ title: "Min order not met", description: `Minimum ₹${data.min_order_amount} required`, variant: "destructive" });
        return;
      }
      setAppliedCoupon(data);
      toast({ title: "Coupon applied 🎉" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setCouponLoading(false);
    }
  };

  const toggleService = (name: string) =>
    setSelected((prev) => prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isMarriageCompatibility = selected.some(name => 
      name.toLowerCase().includes('marriage') || 
      name.toLowerCase().includes('compatibility')
    ) && !selected.some(name => name.toLowerCase().includes('mobile'));
    
    const isMobileCompatibility = selected.some(name => name.toLowerCase().includes('mobile'));
    
    const errors: string[] = [];
    if (!form.name.trim()) errors.push("Full Name");
    if (!form.phone.trim()) errors.push("Phone Number");
    if (!form.dob) errors.push("Date of Birth");
    if (!form.address.trim() && !isMobileCompatibility) errors.push("Address");
    if (selected.length === 0) errors.push("At least one service");

    if (isMarriageCompatibility) {
      if (!form.partnerName.trim()) errors.push("Partner's Name");
      if (!form.partnerDob) errors.push("Partner's Date of Birth");
    }

    if (errors.length > 0) {
      toast({ 
        title: "Incomplete Booking Details", 
        description: `Please provide: ${errors.join(", ")}`, 
        variant: "destructive" 
      });
      return;
    }

    setLoading(true);
    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error("Failed to load payment gateway");

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth", { state: { from: "/book-now" } });
        toast({ title: "Login Required", description: "Please login to book a consultation" });
        setLoading(false);
        return;
      }

      fbTrack("InitiateCheckout", {
        value: grandTotal,
        currency: "INR",
        content_ids: selected,
        num_items: selected.length,
      });

      const items = selected.map((name) => {
        const s = servicesList.find((sv) => sv.title === name)!;
        return { name: s.title, qty: 1, price: s.price };
      });

      const { data, error } = await supabase.functions.invoke("razorpay-order", {
        body: {
          items,
          total: grandTotal,
          customer_name: form.name,
          customer_phone: form.phone,
          customer_email: form.email,
          user_id: user.id,
          coupon_code: appliedCoupon?.code || null,
          discount: discount,
          booking_details: {
            dob: form.dob,
            tob: form.tob,
            pob: form.pob,
            address: form.address,
            notes: form.notes,
            partner_details: isMarriageCompatibility ? {
              name: form.partnerName,
              dob: form.partnerDob,
              tob: form.partnerTob,
              pob: form.partnerPob,
            } : null,
          },
        },
      });

      if (error) throw error;

      const options = {
        key: data.key_id,
        amount: grandTotal * 100,
        currency: "INR",
        name: "Ank Darppan",
        description: `Booking: ${selected.join(", ")}`,
        order_id: data.order_id,
        handler: async (response: any) => {
          const { data: verifyData, error: verifyError } = await supabase.functions.invoke("razorpay-verify", {
            body: {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            },
          });
          if (verifyError || !verifyData?.verified) {
            toast({ title: "Payment verification failed", variant: "destructive" });
            return;
          }
          fbTrack("Purchase", {
            value: grandTotal,
            currency: "INR",
            content_ids: selected,
            num_items: selected.length,
            order_id: response.razorpay_order_id,
          });
          toast({ title: "Booking Confirmed! 🎉", description: "Your consultation has been booked successfully." });
          navigate(`/order-tracking?id=${response.razorpay_order_id}&confirmed=true`);
        },
        prefill: { name: form.name, contact: form.phone, email: form.email },
        theme: { color: "#D4A843" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error(err);
      toast({ title: "Payment failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-[#1e1e24]">
      <Helmet>
        <title>Book Consultation | Ank Darppan</title>
        <meta name="description" content="Book your personal numerology consultation with Ank Darppan. Secure payments and detailed reports." />
      </Helmet>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">
            Book Your <span className="text-[#b48a2d]">Consultation</span>
          </h1>
          <p className="opacity-70 mb-8">Fill in your details, select services, and pay securely via Razorpay.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white border border-[#b48a2d]/20 rounded-2xl shadow-sm p-6 space-y-4">
              <h2 className="font-heading font-semibold text-lg text-[#1e1e24]">Personal Details</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input name="name" id="name" required value={form.name} onChange={handleChange} placeholder="Your full name" className={cn("bg-stone-50 border-stone-200 text-[#1e1e24]", !form.name && loading ? "border-destructive" : "")} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input name="phone" id="phone" type="tel" required value={form.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" className={cn("bg-stone-50 border-stone-200 text-[#1e1e24]", !form.phone && loading ? "border-destructive" : "")} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input name="email" id="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" className="bg-stone-50 border-stone-200 text-[#1e1e24]" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="dob">Date of Birth *</Label>
                  <Input name="dob" id="dob" type="date" required value={form.dob} onChange={handleChange} className={cn("bg-stone-50 border-stone-200 text-[#1e1e24]", !form.dob && loading ? "border-destructive" : "")} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="tob">Time of Birth</Label>
                  <Input name="tob" id="tob" type="time" value={form.tob} onChange={handleChange} className="bg-stone-50 border-stone-200 text-[#1e1e24]" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pob">Place of Birth</Label>
                  <Input name="pob" id="pob" value={form.pob} onChange={handleChange} placeholder="City, State" className="bg-stone-50 border-stone-200 text-[#1e1e24]" />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="address">Address {selected.some(name => name.toLowerCase().includes('mobile')) ? "(Optional for Mobile Report)" : "*"}</Label>
                  <Textarea name="address" id="address" required value={form.address} onChange={handleChange} placeholder="Your full address" className={cn("bg-stone-50 border-stone-200 text-[#1e1e24]", !form.address && loading ? "border-destructive" : "")} rows={2} />
                </div>
              </div>
            </div>

            {selected.some(name => name.toLowerCase().includes('marriage') || name.toLowerCase().includes('compatibility')) && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="bg-white border border-[#b48a2d]/20 rounded-2xl shadow-sm p-6 space-y-4">
                <h2 className="font-heading font-semibold text-lg text-[#b48a2d]">Partner's Details</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="partnerName">Partner's Full Name *</Label>
                    <Input name="partnerName" id="partnerName" value={form.partnerName} onChange={handleChange} placeholder="Partner's name" className={cn("bg-stone-50 border-stone-200 text-[#1e1e24]", !form.partnerName && loading ? "border-destructive" : "")} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="partnerDob">Partner's Date of Birth *</Label>
                    <Input name="partnerDob" id="partnerDob" type="date" value={form.partnerDob} onChange={handleChange} className={cn("bg-stone-50 border-stone-200 text-[#1e1e24]", !form.partnerDob && loading ? "border-destructive" : "")} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="partnerTob">Partner's Time of Birth</Label>
                    <Input name="partnerTob" id="partnerTob" type="time" value={form.partnerTob} onChange={handleChange} className="bg-stone-50 border-stone-200 text-[#1e1e24]" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="partnerPob">Partner's Place of Birth</Label>
                    <Input name="partnerPob" id="partnerPob" value={form.partnerPob} onChange={handleChange} placeholder="City, State" className="bg-stone-50 border-stone-200 text-[#1e1e24]" />
                  </div>
                </div>
              </motion.div>
            )}

            <div className="bg-white border border-[#b48a2d]/20 rounded-2xl shadow-sm p-6 space-y-4">
              <h2 className="font-heading font-semibold text-lg text-[#1e1e24]">Select Services *</h2>
              {dbLoading ? (
                <div className="flex justify-center py-4"><Loader2 className="animate-spin text-primary" /></div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-3">
                  {servicesList.map((s) => (
                    <button
                      type="button"
                      key={s.title}
                      onClick={() => toggleService(s.title)}
                      className={`text-left p-4 rounded-xl border transition-all ${
                        selected.includes(s.title)
                          ? "border-[#b48a2d] bg-[#b48a2d]/10 shadow-[0_4px_12px_rgba(180,138,45,0.15)]"
                          : "border-stone-200 bg-stone-50 hover:border-[#b48a2d]/40"
                      }`}
                    >
                      <span className={`text-sm font-semibold transition-colors ${selected.includes(s.title) ? "text-[#b48a2d]" : "text-[#1e1e24]"}`}>{s.title}</span>
                      <div className="mt-1 flex items-center gap-2">
                        <span className={`font-bold ${selected.includes(s.title) ? "text-[#b48a2d]" : "text-[#b48a2d]/80"}`}>₹{s.price}</span>
                        {s.old_price && <span className="text-muted-foreground line-through text-xs">₹{s.old_price}</span>}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="glass-card p-6 space-y-4">
              <h2 className="font-heading font-semibold text-lg text-foreground flex items-center gap-2">
                <Ticket className="w-4 h-4 text-primary" /> Coupon Code
              </h2>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="uppercase bg-secondary/50 border-border"
                  disabled={!!appliedCoupon}
                />
                {appliedCoupon ? (
                  <Button type="button" variant="ghost" onClick={() => { setAppliedCoupon(null); setCouponCode(""); }}>Remove</Button>
                ) : (
                  <Button type="button" variant="outline" onClick={applyCoupon} disabled={couponLoading || !couponCode.trim()}>
                    {couponLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}
                  </Button>
                )}
              </div>
              {appliedCoupon && (
                <p className="text-xs text-green-600 font-semibold">Applied: {appliedCoupon.code} (-₹{discount})</p>
              )}
            </div>

            <div className="glass-card p-6 space-y-4">
              <h2 className="font-heading font-semibold text-lg text-foreground">Additional Notes</h2>
              <Textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Any specific questions..." className="bg-secondary/50 border-border" rows={3} />
            </div>

            {selected.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{selected.length} service(s)</p>
                  <p className="text-2xl font-heading font-bold text-primary">₹{grandTotal.toLocaleString("en-IN")}</p>
                </div>
                <Button type="submit" size="lg" disabled={loading} className="bg-primary text-primary-foreground font-semibold px-8">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CreditCard className="w-4 h-4 mr-2" />}
                  {loading ? "Processing..." : "Pay with Razorpay"}
                </Button>
              </motion.div>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default BookNow;