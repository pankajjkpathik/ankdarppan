import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Star, ShieldCheck, Zap, ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import sampleReport from "@/assets/mobile-sample.jpg.asset.json";
import { useServicePrice } from "@/hooks/useServicePrice";
import { DobInput } from "@/components/DobInput";
import { StickyPriceBar } from "@/components/StickyPriceBar";
import { BenefitCard } from "@/components/BenefitCard";

const MobileCompatibilityReport = () => {
  const { price, oldPrice, coupons } = useServicePrice(
    ["Mobile Number Consultation", "Mobile Compatibility"],
    581,
    1500
  );
  const { addItem, setIsOpen: openCart } = useCart();

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    dob: ""
  });
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

  const scrollToHero = () => {
    const el = document.getElementById("hero-name");
    el?.scrollIntoView({ behavior: "smooth" });
    el?.focus();
  };

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
      price: `₹${price}`,
      priceNum: price,
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
      <SEO 
        title="Mobile Number Numerology Report ₹581 | Ank Darppan"
        description="आपका Mobile Number आपके लिए lucky है या नहीं? पूरी report + voice note, 24 घंटे में। Sawan offer ₹581."
        canonical="https://www.ankdarppan.com/mobile-compatibility-report"
      />
      <Navbar />
...
      
      <main>
        {/* Hero Section */}
        <section id="hero-section" className="relative py-12 md:py-20 overflow-hidden bg-[#f9f6f0]">
          <div className="container px-4 mx-auto text-center md:text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-1.5 mb-6 text-xs font-semibold tracking-wider text-primary uppercase bg-primary/10 rounded-full">
                Sawan Offer
              </span>
              <h1 className="mb-6 text-4xl font-heading md:text-6xl text-stone-900 leading-tight">
                Mobile Number Consultation <br />
                <span className="text-primary">Luck or Obstacles?</span>
              </h1>
              <p className="max-w-2xl mx-auto mb-10 text-lg text-stone-700 font-medium leading-relaxed text-left md:text-center">
                Unlock the hidden vibration of your mobile number. Discover if your number aligns with your success, health, and prosperity.
              </p>
              <form onSubmit={handleBuyNow} className="max-w-md mx-auto bg-white p-6 md:p-8 rounded-3xl border border-primary/20 shadow-xl">
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
                  <DobInput 
                    value={formData.dob}
                    onChange={(val) => setFormData(prev => ({ ...prev, dob: val }))}
                  />
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

                <div className="mb-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <span className="text-2xl font-bold text-stone-900">₹{price}</span>
                    {oldPrice && <span className="text-lg text-stone-400 line-through">₹{oldPrice}</span>}
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
                <p className="mt-3 text-[10px] md:text-xs text-stone-500 text-center font-medium">
                  PDF report delivered on WhatsApp within 24 hours.
                </p>
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
            
            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              {[
                {
                  title: "Vibrational Analysis",
                  desc: "Understand the core energy and frequency your number emits.",
                  icon: <Zap className="w-6 h-6 md:w-8 md:h-8 text-primary" />,
                },
                {
                  title: "Success Index",
                  desc: "Learn how well your number supports your career growth.",
                  icon: <ShieldCheck className="w-6 h-6 md:w-8 md:h-8 text-primary" />,
                },
                {
                  title: "Relationship Harmony",
                  desc: "Discover if your number attracts positive connections.",
                  icon: <Star className="w-6 h-6 md:w-8 md:h-8 text-primary" />,
                },
              ].map((item, i) => (
                <BenefitCard key={i} title={item.title} desc={item.desc} icon={item.icon} />
              ))}
            </div>
          </div>
        </section>

        {/* What's Included & Sample */}
        <section className="py-12 md:py-20 bg-[#f9f6f0]">
          <div className="container px-4 mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1">
                <h2 className="text-3xl font-heading text-stone-900 mb-6 text-center md:text-left">What's Included</h2>
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
                      <span className="text-stone-900 font-medium text-left">{text}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="p-6 border border-primary/30 rounded-2xl bg-white mb-8 shadow-md">
                  {coupons && coupons.length > 0 ? (
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
                  ) : (
                    <div className="flex items-center gap-4 mb-4">
                      <div className="px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded">COUPON: FOLLOWER</div>
                      <span className="text-sm font-semibold text-stone-800">15% Follower Discount</span>
                    </div>
                  )}
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-stone-900">₹{price.toLocaleString("en-IN")}</span>
                    {oldPrice ? <span className="text-lg text-stone-400 line-through">₹{oldPrice.toLocaleString("en-IN")}</span> : null}
                    <span className="text-primary font-bold">Sawan Offer</span>
                  </div>
                  <p className="text-xs text-stone-500 mt-2">
                    {coupons && coupons.length > 0 
                      ? `*Apply coupon ${coupons[0].code} at checkout for additional savings.`
                      : "*Apply coupon FOLLOWER at checkout for extra 15% discount."}
                  </p>
                </div>

                <Button 
                  onClick={scrollToHero} 
                  className="w-full md:w-auto px-10 py-6 text-lg font-bold"
                >
                  GET MY REPORT
                </Button>
                <p className="mt-3 text-[10px] md:text-xs text-stone-500 text-center md:text-left font-medium">
                  PDF report delivered on WhatsApp within 24 hours.
                </p>
              </div>
              
              <div className="flex-1 relative order-first md:order-last mb-12 md:mb-0">
                <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white group relative">
                  <div className="bg-white aspect-[3/4] flex flex-col relative overflow-hidden">
                    <img 
                      src={sampleReport.url} 
                      alt="Sample Mobile Report Excerpt" 
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
        <section className="py-12 md:py-20 bg-primary text-primary-foreground">
          <div className="container px-4 mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-heading mb-6 leading-tight">Ready to Align Your Mobile Vibration?</h2>
            <p className="max-w-xl mx-auto mb-10 text-primary-foreground/90 font-medium text-left md:text-center px-4">
              Join thousands who have optimized their lives through the power of mobile numerology.
            </p>
            <Button 
              onClick={scrollToHero}
              variant="secondary" 
              size="lg" 
              className="px-12 py-8 text-xl font-bold rounded-full w-full md:w-auto"
            >
              GET MY REPORT
            </Button>
            <p className="mt-4 text-xs text-primary-foreground/80 font-medium">
              PDF report delivered on WhatsApp within 24 hours.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 opacity-80">
              <span className="flex items-center gap-1 text-sm"><ShieldCheck className="w-4 h-4" /> Secure Payment</span>
              <span className="flex items-center gap-1 text-sm"><Clock className="w-4 h-4" /> 24-48h Delivery</span>
            </div>
          </div>
        </section>
      </main>

      <StickyPriceBar 
        show={showSticky} 
        price={price} 
        oldPrice={oldPrice} 
        onScrollTo={scrollToHero} 
      />

      <Footer />
    </div>
  );
};

export default MobileCompatibilityReport;
