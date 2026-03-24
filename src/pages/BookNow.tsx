import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";

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
  const [selected, setSelected] = useState<string[]>([]);
  const [form, setForm] = useState({
    name: "", dob: "", tob: "", pob: "", address: "", phone: "", notes: "",
  });

  const totalPrice = servicesList.filter((s) => selected.includes(s.name)).reduce((a, s) => a + s.price, 0);

  const toggleService = (name: string) =>
    setSelected((prev) => prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `*New Booking Request*\n\n👤 Name: ${form.name}\n📅 DOB: ${form.dob}\n🕐 Time of Birth: ${form.tob}\n📍 Place of Birth: ${form.pob}\n🏠 Address: ${form.address}\n📞 Phone: ${form.phone}\n\n📋 Services:\n${selected.map((s) => `• ${s}`).join("\n")}\n\n💰 Total: ₹${totalPrice.toLocaleString("en-IN")}\n\n📝 Notes: ${form.notes || "None"}`;
    window.open(`https://wa.me/919317365025?text=${encodeURIComponent(msg)}`, "_blank");
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
          <p className="text-muted-foreground mb-8">Fill in your details and select the services you need.</p>

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
                  <Label htmlFor="dob">Date of Birth *</Label>
                  <Input name="dob" id="dob" type="date" required value={form.dob} onChange={handleChange} className="bg-secondary/50 border-border" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="tob">Time of Birth</Label>
                  <Input name="tob" id="tob" type="time" value={form.tob} onChange={handleChange} className="bg-secondary/50 border-border" />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
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
                <Button type="submit" size="lg" className="bg-primary text-primary-foreground font-semibold px-8 animate-pulse-glow">
                  Book via WhatsApp
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
