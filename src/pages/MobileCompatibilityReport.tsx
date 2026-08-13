import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Phone, Star, ShieldCheck, Zap, ArrowRight, ShoppingCart, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const MobileCompatibilityReport = () => {
  const { addItem, setIsOpen: openCart } = useCart();
  const [formData, setFormData] = useState({
    name: "",
    mobile: ""
  });

  const handleBuyNow = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!formData.name || !formData.mobile) {
      toast({
        title: "Missing Information",
        description: "Please provide your name and mobile number to generate the report.",
        variant: "destructive"
      });
      return;
    }

    addItem({
      name: "Mobile Number Compatibility Report",
      price: "₹599",
      priceNum: 599,
      img: "/logo.png",
      // We can pass the captured data via custom properties if needed, 
      // but for now we'll just add to cart and let checkout handle details
    });

    toast({
      title: "Added to Cart",
      description: "Redirecting to secure checkout...",
    });
    
    openCart(true);
  };

  const testimonials = [
    {
      name: "Rajesh Kumar",
      text: "I changed my mobile number based on this report, and within a month, my business inquiries doubled! Highly recommended.",
      rating: 5,
    },
    {
      name: "Priya Sharma",
      text: "Simple, easy to understand, and very accurate. The report arrived quickly and explained everything clearly.",
      rating: 5,
    },
    {
      name: "Amit Patel",
      text: "The Sawan special price was a steal. The insights about my number's frequency were eye-opening.",
      rating: 4,
    },
  ];

  return (
    <div className="min-h-screen bg-background font-body">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden bg-secondary/30">
          <div className="container px-4 mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-1.5 mb-6 text-xs font-semibold tracking-wider text-primary uppercase bg-primary/10 rounded-full">
                Sawan Special Offer
              </span>
              <h1 className="mb-6 text-4xl font-heading md:text-6xl gold-text">
                Is Your Mobile Number Bringing You <br />
                <span className="text-foreground">Luck or Obstacles?</span>
              </h1>
              <p className="max-w-2xl mx-auto mb-10 text-lg text-muted-foreground leading-relaxed">
                Unlock the hidden vibration of your mobile number. Discover if your number aligns with your success, health, and prosperity.
              </p>
              <form onSubmit={handleBuyNow} className="max-w-md mx-auto bg-background/50 backdrop-blur-sm p-8 rounded-3xl border border-primary/20 shadow-xl">
                <div className="space-y-4 mb-6">
                  <div className="text-left">
                    <Label htmlFor="hero-name" className="text-sm font-medium ml-1">Full Name</Label>
                    <Input 
                      id="hero-name"
                      placeholder="Enter your name" 
                      className="bg-background/80"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="text-left">
                    <Label htmlFor="hero-mobile" className="text-sm font-medium ml-1">Mobile Number to Analyze</Label>
                    <Input 
                      id="hero-mobile"
                      type="tel"
                      placeholder="Enter mobile number" 
                      className="bg-background/80"
                      value={formData.mobile}
                      onChange={(e) => setFormData(prev => ({ ...prev, mobile: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <Button 
                  type="submit"
                  size="lg" 
                  className="w-full py-7 text-lg font-bold rounded-full animate-pulse-glow"
                >
                  GET MY MOBILE COMPATIBILITY REPORT
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </form>
            </motion.div>
          </div>
        </section>

        {/* What the report tells you */}
        <section className="py-20">
          <div className="container px-4 mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-heading md:text-4xl gold-text mb-4">What The Report Tells You</h2>
              <div className="w-20 h-1 bg-primary mx-auto"></div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Vibrational Analysis",
                  desc: "Understand the core energy and frequency your number emits to the universe.",
                  icon: <Zap className="w-8 h-8 text-primary" />,
                },
                {
                  title: "Success Index",
                  desc: "Learn how well your number supports your career growth and financial stability.",
                  icon: <ShieldCheck className="w-8 h-8 text-primary" />,
                },
                {
                  title: "Relationship Harmony",
                  desc: "Discover if your number attracts positive connections or causes misunderstandings.",
                  icon: <Star className="w-8 h-8 text-primary" />,
                },
              ].map((item, i) => (
                <Card key={i} className="border-border/30 bg-secondary/20 hover:border-primary/50 transition-colors">
                  <CardContent className="pt-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-2xl bg-primary/10">
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-heading mb-3">{item.title}</h3>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* What's Included & Sample */}
        <section className="py-20 bg-secondary/10">
          <div className="container px-4 mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1">
                <h2 className="text-3xl font-heading gold-text mb-6">What's Included in Your Report</h2>
                <ul className="space-y-4 mb-8">
                  {[
                    "Detailed numerological breakdown of your current number",
                    "Compatibility score with your Date of Birth",
                    "Identification of 'Anti' or 'Lucky' combinations",
                    "Practical remedies for number correction",
                    "Personalized suggestions for new number combinations",
                  ].map((text, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{text}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="p-6 border border-primary/30 rounded-2xl bg-primary/5 mb-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded">COUPON: SAWAN15</div>
                    <span className="text-sm font-semibold">15% Follower Discount</span>
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold">₹599</span>
                    <span className="text-lg text-muted-foreground line-through">₹1,199</span>
                    <span className="text-primary font-semibold">50% OFF</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">*Additional 15% discount applied at checkout with coupon.</p>
                </div>

                <Button 
                  onClick={() => {
                    const el = document.getElementById("hero-name");
                    el?.scrollIntoView({ behavior: "smooth" });
                    el?.focus();
                  }} 
                  className="w-full md:w-auto px-10 py-6 text-lg font-bold"
                >
                  GET MY REPORT NOW
                </Button>
              </div>
              
              <div className="flex-1 relative">
                <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-primary/20">
                  {/* Sample Report Placeholder - in a real app, this would be an actual image */}
                  <div className="bg-secondary/40 aspect-[3/4] flex items-center justify-center p-8">
                    <div className="text-center">
                      <img src="/logo.png" alt="Ank Darppan" className="w-20 h-20 mx-auto mb-4 opacity-50" />
                      <p className="font-heading text-xl opacity-40">SAMPLE REPORT PREVIEW</p>
                      <div className="mt-8 space-y-4">
                        <div className="h-4 w-48 bg-muted-foreground/20 rounded mx-auto"></div>
                        <div className="h-4 w-64 bg-muted-foreground/20 rounded mx-auto"></div>
                        <div className="h-4 w-40 bg-muted-foreground/20 rounded mx-auto"></div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20">
          <div className="container px-4 mx-auto">
            <h2 className="text-3xl font-heading text-center mb-16 gold-text">What Our Clients Say</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((t, i) => (
                <Card key={i} className="border-border/30 bg-background">
                  <CardContent className="pt-8">
                    <div className="flex mb-4">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <p className="italic mb-6 text-muted-foreground">"{t.text}"</p>
                    <p className="font-bold text-sm">— {t.name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container px-4 mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-heading mb-6">Ready to Align Your Mobile Vibration?</h2>
            <p className="max-w-xl mx-auto mb-10 opacity-90">
              Join thousands who have optimized their lives through the power of mobile numerology.
            </p>
            <Button 
              onClick={() => {
                const el = document.getElementById("hero-name");
                el?.scrollIntoView({ behavior: "smooth" });
                el?.focus();
              }}
              variant="secondary" 
              size="lg" 
              className="px-12 py-8 text-xl font-bold rounded-full hover:scale-105 transition-transform"
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

export default MobileCompatibilityReport;
