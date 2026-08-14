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

interface LandingPageProps {
  serviceTitle: string;
  price: number;
  oldPrice?: number;
  description: string;
  benefits: string[];
  heroImage?: string;
  sampleReportImage?: string;
}

const ServiceLandingPage = ({ 
  serviceTitle, 
  price, 
  oldPrice, 
  description, 
  benefits,
  heroImage = "/logo.png",
  sampleReportImage
}: LandingPageProps) => {
  const { addItem, setIsOpen: openCart } = useCart();
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    additionalInfo: ""
  });

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
    <div className="min-h-screen bg-[#fdfbf7] font-body text-stone-900">
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
              <p className="max-w-2xl mx-auto mb-10 text-lg text-stone-600 leading-relaxed">
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
                      type="date"
                      className="bg-[#fdfbf7] border-stone-300 text-stone-900 focus:border-primary"
                      value={formData.dob}
                      onChange={(e) => setFormData(prev => ({ ...prev, dob: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <Button 
                  type="submit"
                  size="lg" 
                  className="w-full py-7 text-lg font-bold rounded-full shadow-lg shadow-primary/20"
                >
                  GET MY {serviceTitle.toUpperCase()}
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
                    <h3 className="text-xl font-heading mb-3">{item.title}</h3>
                    <p className="text-stone-600">{item.desc}</p>
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
                      <span className="text-stone-700">{text}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="p-6 border border-primary/30 rounded-2xl bg-white mb-8 shadow-md">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-stone-900">₹{price.toLocaleString("en-IN")}</span>
                    {oldPrice && <span className="text-lg text-stone-400 line-through">₹{oldPrice.toLocaleString("en-IN")}</span>}
                    <span className="text-primary font-semibold">Limited Time Offer</span>
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
                  ORDER NOW
                </Button>
              </div>
              
              <div className="flex-1 relative">
                <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white aspect-[3/4] flex flex-col relative group">
                  {sampleReportImage ? (
                    <div className="relative w-full h-full overflow-hidden">
                      <img 
                        src={sampleReportImage} 
                        alt="Sample Report" 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-white/90 px-4 py-2 rounded-full text-xs font-bold text-stone-900 shadow-lg">
                          Sample Preview
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-start p-8 mb-8 border-b pb-4">
                        <img src="/logo.png" alt="Ank Darppan" className="w-16 h-16 grayscale opacity-80" />
                        <div className="text-right">
                          <p className="text-[10px] text-stone-400 uppercase tracking-widest">Premium Service</p>
                          <p className="font-heading text-stone-800">{serviceTitle}</p>
                        </div>
                      </div>
                      <div className="space-y-6 flex-1 px-8">
                        <div className="h-4 bg-stone-100 rounded w-3/4"></div>
                        <div className="h-4 bg-stone-50 rounded w-full"></div>
                        <div className="h-4 bg-stone-50 rounded w-full"></div>
                        <div className="mt-8 space-y-4">
                          {[1, 2, 3].map(i => (
                            <div key={i} className="flex items-center gap-3">
                              <div className="w-4 h-4 rounded-full bg-primary/20"></div>
                              <div className="h-3 bg-stone-50 rounded flex-1"></div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
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
            <p className="max-w-xl mx-auto mb-10 opacity-90">
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
              GET STARTED
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