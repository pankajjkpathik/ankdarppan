import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Loader2, CreditCard } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const servicesList = [
  { name: "Loshu Grid Report", price: 671 },
  { name: "Vedic Numerology Report", price: 671 },
  { name: "Marriage Compatibility", price: 941 },
  { name: "Mobile Number Consultation", price: 581 },
  { name: "Crystal & Rudraksh Consultation", price: 941 },
  { name: "Name Analysis & Correction", price: 671 },
];

const BookNow = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselected = searchParams.get("service");

  const [selected, setSelected] = useState<string[]>(
    preselected && servicesList.some((s) => s.name === preselected) ? [preselected] : []
  );
  const [form, setForm] = useState({
    name: "", dob: "", tob: "", pob: "", address: "", phone: "", email: "", notes: "",
  });
  const [loading, setLoading] = useState(false);

  const totalPrice = servicesList.filter((s) => selected.includes(s.name)).reduce((a, s) => a + s.price, 0);

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
    if (!form.name || !form.phone || selected.length === 0) {
      toast({ title: "Please fill required fields and select at least one service", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error("Failed to load payment gateway");

      const items = selected.map((name) => {
        const s = servicesList.find((sv) => sv.name === name)!;
        return { name: s.name, qty: 1, price: s.price };
      });

      const { data, error } = await supabase.functions.invoke("razorpay-order", {
        body: {
          items,
          total: totalPrice,
          customer_name: form.name,
          customer_phone: form.phone,
          customer_email: form.email,
          booking_details: {
            dob: form.dob,
            tob: form.tob,
            pob: form.pob,
            address: form.address,
            notes: form.notes,
          },
        },
      });

      if (error) throw error;

      const options = {
        key: data.key_id,
        amount: totalPrice * 100,
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
          toast({ title: "Booking Confirmed! 🎉", description: "Your consultation has been booked successfully." });
          navigate(`/order-tracking?id=${response.razorpay_order_id}`);
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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">
            Book Your <span className="gold-text">Consultation</span>
          </h1>
          <p className="text-muted-foreground mb-8">Fill in your details, select services, and pay securely via Razorpay.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Details */}
            <div className="glass-card p-6 space-y-4">
              <h2 className="font-heading font-semibold text-lg text-foreground">Personal Details</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input name="name" id="name" required value={form.name} onChange={handleChange} placeholder="Your full name" className="bg-secondary/50 border-border" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input name="phone" id="phone" type="tel" required value={form.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" className="bg-secondary/50 border-border" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input name="email" id="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" className="bg-secondary/50 border-border" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="dob">Date of Birth *</Label>
                  <Input name="dob" id="dob" type="date" required value={form.dob} onChange={handleChange} className="bg-secondary/50 border-border" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="tob">Time of Birth</Label>
                  <Input name="tob" id="tob" type="time" value={form.tob} onChange={handleChange} className="bg-secondary/50 border-border" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pob">Place of Birth</Label>
                  <Input name="pob" id="pob" value={form.pob} onChange={handleChange} placeholder="City, State" className="bg-secondary/50 border-border" />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea name="address" id="address" value={form.address} onChange={handleChange} placeholder="Your full address" className="bg-secondary/50 border-border" rows={2} />
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="glass-card p-6 space-y-4">
              <h2 className="font-heading font-semibold text-lg text-foreground">Select Services *</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {servicesList.map((s) => (
                  <button
                    type="button"
                    key={s.name}
                    onClick={() => toggleService(s.name)}
                    className={`text-left p-4 rounded-xl border transition-all ${
                      selected.includes(s.name)
                        ? "border-primary bg-primary/10 shadow-[0_0_15px_-3px_hsl(var(--primary)/0.3)]"
                        : "border-border bg-secondary/30 hover:border-primary/40"
                    }`}
                  >
                    <span className="text-sm font-semibold text-foreground">{s.name}</span>
                    <span className="block text-primary font-bold mt-1">₹{s.price}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="glass-card p-6 space-y-4">
              <h2 className="font-heading font-semibold text-lg text-foreground">Additional Notes</h2>
              <Textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Any specific questions or concerns..." className="bg-secondary/50 border-border" rows={3} />
            </div>

            {/* Total & Submit */}
            {selected.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{selected.length} service(s) selected</p>
                  <p className="text-2xl font-heading font-bold text-primary">₹{totalPrice.toLocaleString("en-IN")}</p>
                </div>
                <Button type="submit" size="lg" disabled={loading} className="bg-primary text-primary-foreground font-semibold px-8 animate-pulse-glow">
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
