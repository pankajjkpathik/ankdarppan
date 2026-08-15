/* Standardized Date Formats & Visual Visibility Edits applied */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Star, ShieldCheck, Zap, ArrowRight, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { DobInput } from "./DobInput";
import { StickyPriceBar } from "./StickyPriceBar";
import { BenefitCard } from "./BenefitCard";
import { supabase } from "@/integrations/supabase/client";
import { useServicePrice } from "@/hooks/useServicePrice";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { testimonials } from "@/data/testimonials";
import { fbTrack } from "@/lib/fbpixel";
import samplePlaceholder from "@/assets/sample-coming-soon.jpg.asset.json";


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
  extraHeroFields?: React.ReactNode;
}

const ServiceLandingPage = ({ 
  serviceTitle, 
  price: fallbackPrice, 
  oldPrice: fallbackOldPrice, 
  matchTitles,
  description, 
  benefits,
  heroImage = "/logo.png",
  sampleReportImage,
  extraHeroFields
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
  const [activeTestimonial, setActiveTestimonial] = useState(0);

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

  const scrollToHero = () => {
    const el = document.getElementById("hero-name");
    el?.scrollIntoView({ behavior: "smooth" });
    el?.focus();
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

    fbTrack("InitiateCheckout", {
      value: price,
      currency: "INR",
      content_name: serviceTitle,
      content_category: "Numerology Service",
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
                {serviceTitle} <br />
                <span className="text-primary">Unlock Your Potential</span>
              </h1>
              <p className="max-w-2xl mx-auto mb-10 text-lg text-stone-700 font-medium leading-relaxed text-left md:text-center">
                {description}
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
                    onBlur={validateDob}
                    error={dobError}
                  />
                  {extraHeroFields}
                </div>

                <div className="mb-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <span className="text-2xl font-bold text-stone-900">₹{price.toLocaleString("en-IN")}</span>
                    {oldPrice && <span className="text-lg text-stone-400 line-through">₹{oldPrice.toLocaleString("en-IN")}</span>}
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

        {/* Benefits Section */}
        <section className="py-12 md:py-20">
          <div className="container px-4 mx-auto">
            <div className="text-center mb-10 md:mb-16">
              <h2 className="text-3xl font-heading md:text-4xl text-stone-900 mb-4">Why Choose This Report?</h2>
              <div className="w-20 h-1 bg-primary mx-auto opacity-50"></div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              {[
                {
                  title: "Expert Analysis",
                  desc: "Authentic numerology principles applied to your unique chart.",
                  icon: <Zap className="w-6 h-6 md:w-8 md:h-8 text-primary" />,
                },
                {
                  title: "Practical Insights",
                  desc: "Get actionable advice and remedies that you can implement immediately.",
                  icon: <ShieldCheck className="w-6 h-6 md:w-8 md:h-8 text-primary" />,
                },
                {
                  title: "Life-Changing Results",
                  desc: "Reports based on classical Lo Shu and Vedic numerology principles, prepared personally for your birth chart.",
                  icon: <Star className="w-6 h-6 md:w-8 md:h-8 text-primary" />,
                },
              ].map((item, i) => (
                <BenefitCard key={i} title={item.title} desc={item.desc} icon={item.icon} />
              ))}
            </div>
          </div>
        </section>

        {/* What's Included */}
        <section className="py-12 md:py-20 bg-[#f9f6f0]">
          <div className="container px-4 mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              <div className="flex-1 order-last md:order-first">
                <h2 className="text-3xl font-heading text-stone-900 mb-6 text-center md:text-left">What's Included</h2>
                <ul className="space-y-4 mb-8">
                  {benefits.map((text, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-stone-900 font-medium text-left">{text}</span>
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
                    <span className="text-primary font-bold">Sawan Offer</span>
                  </div>
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
                <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white aspect-[3/4] flex flex-col relative group">
                  {sampleReportImage ? (
                    <div className="relative w-full h-full overflow-hidden">
                      <img 
                        src={sampleReportImage} 
                        alt="Sample Report Excerpt" 
                        width="400"
                        height="533"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                        className="w-full h-full object-cover"
                      />
                      <img 
                        src={samplePlaceholder.url}
                        alt="Sample report preview — coming soon"
                        className="hidden w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/5 pointer-events-none"></div>
                      <div className="absolute top-4 left-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-xl border border-primary/20 shadow-lg">
                        <p className="text-[10px] uppercase tracking-widest text-primary font-bold mb-1">Sample Report Preview</p>
                        <p className="text-xs text-stone-900 font-medium">Personalized Numerology Analysis</p>
                      </div>
                    </div>
                  ) : (
                    <div className="relative w-full h-full overflow-hidden">
                      <img 
                        src={samplePlaceholder.url}
                        alt="Sample report preview — coming soon"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-12 md:py-20">
          <div className="container px-4 mx-auto">
            <div className="text-center mb-10 md:mb-16">
              <h2 className="text-3xl font-heading md:text-4xl text-stone-900 mb-4">What Our Clients Say</h2>
              <div className="w-20 h-1 bg-primary mx-auto opacity-50"></div>
            </div>

            {/* Desktop View */}
            <div className="hidden md:grid grid-cols-3 gap-8">
              {testimonials.map((t, i) => (
                <div key={i} className="p-8 bg-white border border-primary/20 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-primary text-primary" />)}
                  </div>
                  <p className="text-stone-700 italic mb-6 leading-relaxed">"{t.quote}"</p>
                  <div>
                    <p className="font-bold text-stone-900">{t.name}</p>
                    <p className="text-sm text-stone-500">{t.city}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Swipe View */}
            <div className="md:hidden relative overflow-hidden">
              <div 
                className="flex transition-transform duration-300 ease-out" 
                style={{ transform: `translateX(-${activeTestimonial * 100}%)` }}
              >
                {testimonials.map((t, i) => (
                  <div key={i} className="w-full shrink-0 px-2">
                    <div className="p-6 bg-white border border-primary/20 rounded-3xl shadow-sm min-h-[250px] flex flex-col justify-between">
                      <div>
                        <div className="flex gap-1 mb-4">
                          {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-primary text-primary" />)}
                        </div>
                        <p className="text-stone-700 italic mb-6 leading-relaxed text-sm">"{t.quote}"</p>
                      </div>
                      <div>
                        <p className="font-bold text-stone-900">{t.name}</p>
                        <p className="text-sm text-stone-500">{t.city}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-center gap-2 mt-6">
                {testimonials.map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => setActiveTestimonial(i)}
                    className={`w-2 h-2 rounded-full transition-all ${activeTestimonial === i ? 'bg-primary w-4' : 'bg-primary/20'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 md:py-20 bg-[#f9f6f0]">
          <div className="container px-4 mx-auto max-w-3xl">
            <div className="text-center mb-10 md:mb-16">
              <h2 className="text-3xl font-heading md:text-4xl text-stone-900 mb-4">Frequently Asked Questions</h2>
              <div className="w-20 h-1 bg-primary mx-auto opacity-50"></div>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-4">
              <AccordionItem value="item-1" className="bg-white border border-primary/10 rounded-2xl px-6">
                <AccordionTrigger className="text-left font-bold text-stone-900 hover:text-primary transition-colors">
                  Report कितनी देर में मिलेगी?
                </AccordionTrigger>
                <AccordionContent className="text-stone-700 leading-relaxed">
                  WhatsApp पर 24 घंटे के अंदर, PDF format में।
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="bg-white border border-primary/10 rounded-2xl px-6">
                <AccordionTrigger className="text-left font-bold text-stone-900 hover:text-primary transition-colors">
                  Report Hindi में होगी या English में?
                </AccordionTrigger>
                <AccordionContent className="text-stone-700 leading-relaxed">
                  Report Hinglish में होती है, ताकि पढ़ने और समझने में आसान रहे।
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="bg-white border border-primary/10 rounded-2xl px-6">
                <AccordionTrigger className="text-left font-bold text-stone-900 hover:text-primary transition-colors">
                  मुझे अपना birth time नहीं पता, क्या फिर भी report बन सकती है?
                </AccordionTrigger>
                <AccordionContent className="text-stone-700 leading-relaxed">
                  हाँ। Lo Shu Grid सिर्फ जन्मतिथि पर आधारित है, birth time की ज़रूरत नहीं।
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="bg-white border border-primary/10 rounded-2xl px-6">
                <AccordionTrigger className="text-left font-bold text-stone-900 hover:text-primary transition-colors">
                  Payment कैसे करें?
                </AccordionTrigger>
                <AccordionContent className="text-stone-700 leading-relaxed">
                  UPI, card या net banking — checkout पर सभी options मिलेंगे।
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="bg-white border border-primary/10 rounded-2xl px-6">
                <AccordionTrigger className="text-left font-bold text-stone-900 hover:text-primary transition-colors">
                  क्या report refundable है?
                </AccordionTrigger>
                <AccordionContent className="text-stone-700 leading-relaxed">
                  Report personally तैयार होती है, इसलिए delivery के बाद refund नहीं मिलता। कोई भी सवाल हो तो WhatsApp पर पूछ सकते हैं।
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-12 md:py-20 bg-primary text-primary-foreground">
          <div className="container px-4 mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-heading mb-6">Ready to Transform Your Life?</h2>
            <p className="max-w-xl mx-auto mb-10 text-primary-foreground/90 font-medium text-left md:text-center px-4">
              Get your personalized {serviceTitle} today and step into your destiny.
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

export default ServiceLandingPage;