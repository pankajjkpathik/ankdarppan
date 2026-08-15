/* Standardized Date Formats & Visual Visibility Edits applied */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Star, ShieldCheck, Zap, ArrowRight, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useServicePrice } from "@/hooks/useServicePrice";


interface LandingPageProps {
  serviceTitle: string;
  price: number;
  oldPrice?: number;
  /** Extra title fragments used to match this service in the Admin-managed services table */
  matchTitles?: string[];

  description: string;
  benefits: string[];
  heroImage?: string;
  sampleReportImage?: string;
}

const ServiceLandingPage = ({ 
  serviceTitle, 
  price: fallbackPrice, 
  oldPrice: fallbackOldPrice, 
  matchTitles,
  description, 
  benefits,
  heroImage = "/logo.png",
  sampleReportImage
}: LandingPageProps) => {
  const { price, oldPrice, coupons } = useServicePrice(
    matchTitles && matchTitles.length ? matchTitles : [serviceTitle],
    fallbackPrice,
    fallbackOldPrice
  );
  const { addItem, setIsOpen: openCart } = useCart();

  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    additionalInfo: ""
  });
  const [dobError, setDobError] = useState("");
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById("hero-section");
      if (heroSection) {
        const rect = heroSection.getBoundingClientRect();
        setShowSticky(rect.bottom < 0);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const validateDob = () => {
    if (!formData.dob) return;
    const parts = formData.dob.split("/");
    if (parts.length !== 3 || parts[2].length !== 4) {
      setDobError("Please enter date as DD/MM/YYYY");
      return;
    }
    const d = parseInt(parts[0]);
    const m = parseInt(parts[1]);
    const y = parseInt(parts[2]);
    const date = new Date(y, m - 1, d);
    if (date.getFullYear() !== y || date.getMonth() + 1 !== m || date.getDate() !== d) {
      setDobError("Invalid date");
    } else {
      setDobError("");
    }
  };

  const handleBuyNow = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!formData.name || !formData.dob) {
      toast({
        title: "Missing Information",
        description: "Please provide your name and date of birth.",
        variant: "destructive"
      });
      return;
    }

    if (dobError) {
      toast({
        title: "Invalid Date",
        description: "Please fix the date of birth field.",
        variant: "destructive"
      });
      return;
    }

    addItem({
      name: serviceTitle,
      price: `₹${price}`,
      priceNum: price,
      img: heroImage,
    });

    toast({
      title: "Added to Cart",
      description: "Redirecting to secure checkout...",
    });
    
    openCart(true);
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] font-body text-stone-900 selection:bg-primary/20">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden bg-[#f9f6f0]">
          <div className="container px-4 mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-1.5 mb-6 text-xs font-semibold tracking-wider text-primary uppercase bg-primary/10 rounded-full">
                Premium Numerology Service
              </span>
              <h1 className="mb-6 text-4xl font-heading md:text-6xl text-stone-900">
                {serviceTitle} <br />
                <span className="text-primary">Unlock Your Potential</span>
              </h1>
              <p className="max-w-2xl mx-auto mb-10 text-lg text-stone-700 font-medium leading-relaxed">
                {description}
              </p>
              
              <form onSubmit={handleBuyNow} className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-primary/20 shadow-xl">
                <div className="space-y-4 mb-6">
                  <div className="text-left">
                    <Label htmlFor="hero-name" className="text-sm font-semibold ml-1 text-stone-900">Full Name</Label>
                    <Input 
                      id="hero-name"
                      placeholder="Enter your name" 
                      className="bg-[#fdfbf7] border-stone-300 text-stone-900 placeholder:text-stone-400 focus:border-primary"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="text-left">
                    <Label htmlFor="hero-dob" className="text-sm font-semibold ml-1 text-stone-900">Date of Birth (DD/MM/YYYY)</Label>
                    <Input 
                      id="hero-dob"
                      placeholder="DD/MM/YYYY"
                      className="bg-[#fdfbf7] border-stone-300 text-stone-900 focus:border-primary"
                      value={formData.dob}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, "");
                        if (value.length > 8) value = value.slice(0, 8);
                        if (value.length > 4) value = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4)}`;
                        else if (value.length > 2) value = `${value.slice(0, 2)}/${value.slice(2)}`;
                        setFormData(prev => ({ ...prev, dob: value }));
                      }}
                      required
                    />
                  </div>
                </div>
                <Button 
                  type="submit"
                  size="lg" 
                  className="w-full py-7 text-lg font-bold rounded-full shadow-lg shadow-primary/20"
                >
                  GET MY REPORT
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </form>
            </motion.div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20">
          <div className="container px-4 mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-heading md:text-4xl text-stone-900 mb-4">Why Choose This Report?</h2>
              <div className="w-20 h-1 bg-primary mx-auto opacity-50"></div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Expert Analysis",
                  desc: "Every report is meticulously prepared based on authentic numerology principles.",
                  icon: <Zap className="w-8 h-8 text-primary" />,
                },
                {
                  title: "Practical Insights",
                  desc: "Get actionable advice and remedies that you can implement immediately.",
                  icon: <ShieldCheck className="w-8 h-8 text-primary" />,
                },
                {
                  title: "Life-Changing Results",
                  desc: "Join thousands who have transformed their lives through our guidance.",
                  icon: <Star className="w-8 h-8 text-primary" />,
                },
              ].map((item, i) => (
                <Card key={i} className="border-stone-200 bg-white hover:border-primary/50 transition-colors shadow-sm">
                  <CardContent className="pt-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-2xl bg-primary/10">
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-heading mb-3 text-stone-900 font-bold">{item.title}</h3>
                    <p className="text-stone-950 font-semibold">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* What's Included */}
        <section className="py-20 bg-[#f9f6f0]">
          <div className="container px-4 mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1">
                <h2 className="text-3xl font-heading text-stone-900 mb-6">What's Included</h2>
                <ul className="space-y-4 mb-8">
                  {benefits.map((text, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-stone-900 font-medium">{text}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="p-6 border border-primary/30 rounded-2xl bg-white mb-8 shadow-md">
                  {coupons && coupons.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {coupons.map((c: any) => (
                        <div key={c.id} className="flex items-center gap-2">
                          <div className="px-3 py-1 bg-primary text-primary-foreground text-[10px] font-bold rounded uppercase tracking-wider">
                            COUPON: {c.code}
                          </div>
                          <span className="text-xs font-semibold text-stone-800">
                            {c.discount_type === 'percent' ? `${c.discount_value}%` : `₹${c.discount_value}`} OFF
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-stone-900">₹{price.toLocaleString("en-IN")}</span>
                    {oldPrice && <span className="text-lg text-stone-400 line-through">₹{oldPrice.toLocaleString("en-IN")}</span>}
                    <span className="text-primary font-bold">Limited Time Offer</span>
                  </div>
                </div>

                <Button 
                  onClick={() => {
                    const el = document.getElementById("hero-name");
                    el?.scrollIntoView({ behavior: "smooth" });
                    el?.focus();
                  }} 
                  className="w-full md:w-auto px-10 py-6 text-lg font-bold"
                >
                  GET MY REPORT
                </Button>
              </div>
              
              <div className="flex-1 relative order-first md:order-last mb-12 md:mb-0">
                <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white aspect-[3/4] flex flex-col relative group">
                  {sampleReportImage ? (
                    <div className="relative w-full h-full overflow-hidden">
                      <img 
                        src={sampleReportImage} 
                        alt="Sample Report Excerpt" 
                        width="400"
                        height="533"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                        className="w-full h-full object-cover"
                      />
                      <div className="hidden absolute inset-0 flex items-center justify-center bg-stone-100 p-8 text-center text-stone-500 font-medium">
                        Sample report preview — coming soon
                      </div>
                      <div className="absolute inset-0 bg-black/5 pointer-events-none"></div>
                      <div className="absolute top-4 left-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-xl border border-primary/20 shadow-lg">
                        <p className="text-[10px] uppercase tracking-widest text-primary font-bold mb-1">Preview Excerpt</p>
                        <p className="text-xs text-stone-900 font-medium">Visualization of typical report section</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-stone-400 font-medium border-2 border-dashed border-stone-200">
                      Sample report preview — coming soon
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container px-4 mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-heading mb-6">Ready to Transform Your Life?</h2>
            <p className="max-w-xl mx-auto mb-10 text-primary-foreground/90 font-medium">
              Get your personalized {serviceTitle} today and step into your destiny.
            </p>
            <Button 
              onClick={() => {
                const el = document.getElementById("hero-name");
                el?.scrollIntoView({ behavior: "smooth" });
                el?.focus();
              }}
              variant="secondary" 
              size="lg" 
              className="px-12 py-8 text-xl font-bold rounded-full"
            >
              GET MY REPORT
            </Button>
            <div className="mt-8 flex items-center justify-center gap-6 opacity-80">
              <span className="flex items-center gap-1 text-sm"><ShieldCheck className="w-4 h-4" /> Secure Payment</span>
              <span className="flex items-center gap-1 text-sm"><Clock className="w-4 h-4" /> 24-48h Delivery</span>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ServiceLandingPage;