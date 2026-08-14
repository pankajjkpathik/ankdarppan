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
import sampleReport from "@/assets/mobile_compatibility_report_sample.png.asset.json";

const MobileCompatibilityReport = () => {
  const { addItem, setIsOpen: openCart } = useCart();
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    dob: ""
  });

  const handleBuyNow = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!formData.name || !formData.mobile || !formData.dob) {
      toast({
        title: "Missing Information",
        description: "Please provide your name, DOB, and mobile number.",
        variant: "destructive"
      });
      return;
    }

    addItem({
      name: "Mobile Number Consultation",
      price: "₹581",
      priceNum: 581,
      img: "/logo.png",
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
                Sawan Special Offer
              </span>
              <h1 className="mb-6 text-4xl font-heading md:text-6xl text-stone-900">
                Mobile Number Consultation <br />
                <span className="text-primary">Luck or Obstacles?</span>
              </h1>
              <p className="max-w-2xl mx-auto mb-10 text-lg text-stone-700 font-medium leading-relaxed">
                Unlock the hidden vibration of your mobile number. Discover if your number aligns with your success, health, and prosperity.
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
                  <div className="text-left">
                    <Label htmlFor="hero-mobile" className="text-sm font-semibold ml-1 text-stone-900">Mobile Number to Analyze</Label>
                    <Input 
                      id="hero-mobile"
                      type="tel"
                      placeholder="Enter mobile number" 
                      className="bg-[#fdfbf7] border-stone-300 text-stone-900 placeholder:text-stone-400 focus:border-primary"
                      value={formData.mobile}
                      onChange={(e) => setFormData(prev => ({ ...prev, mobile: e.target.value }))}
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

        {/* What the report tells you */}
        <section className="py-20">
          <div className="container px-4 mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-heading md:text-4xl text-stone-900 mb-4">What The Report Tells You</h2>
              <div className="w-20 h-1 bg-primary mx-auto opacity-50"></div>
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
                <Card key={i} className="border-stone-200 bg-white hover:border-primary/50 transition-colors shadow-sm">
                  <CardContent className="pt-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-2xl bg-primary/10">
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-heading mb-3">{item.title}</h3>
                    <p className="text-stone-900 font-medium">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* What's Included & Sample */}
        <section className="py-20 bg-[#f9f6f0]">
          <div className="container px-4 mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1">
                <h2 className="text-3xl font-heading text-stone-900 mb-6">What's Included in Your Report</h2>
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
                      <span className="text-stone-900 font-medium">{text}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="p-6 border border-primary/30 rounded-2xl bg-white mb-8 shadow-md">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded">COUPON: FOLLOWER</div>
                    <span className="text-sm font-semibold text-stone-800">15% Follower Discount</span>
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-stone-900">₹581</span>
                    <span className="text-lg text-stone-400 line-through">₹1,500</span>
                    <span className="text-primary font-bold">Limited Time Offer</span>
                  </div>
                  <p className="text-xs text-stone-500 mt-2">*Apply coupon FOLLOWER at checkout for extra 15% discount.</p>
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
              
              <div className="flex-1 relative">
                <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white group relative">
                  <div className="bg-white aspect-[3/4] flex flex-col relative overflow-hidden">
                    <img 
                      src={sampleReport.url} 
                      alt="Sample Mobile Compatibility Report" 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white/90 px-4 py-2 rounded-full text-xs font-bold text-stone-900 shadow-lg">
                        Sample Preview
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
            <h2 className="text-3xl font-heading text-center mb-16 text-stone-900">What Our Clients Say</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((t, i) => (
                <Card key={i} className="border-stone-200 bg-white shadow-sm">
                  <CardContent className="pt-8">
                    <div className="flex mb-4">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <p className="italic mb-6 text-stone-900 font-medium">"{t.text}"</p>
                    <p className="font-bold text-sm text-stone-950">— {t.name}</p>
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
            <p className="max-w-xl mx-auto mb-10 text-primary-foreground/90 font-medium">
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
