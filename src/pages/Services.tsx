import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Grid3X3, BookOpen, Heart, Smartphone, Gem, FileText, Star, Sparkles, Eye, Moon, Loader2, LucideIcon } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const iconMap: Record<string, LucideIcon> = {
  Grid3X3, BookOpen, Heart, Smartphone, Gem, FileText, Star, Sparkles, Eye, Moon,
};

const Services = () => {
  const { data: services, isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data, error } = await supabase.from("services").select("*").eq("is_active", true).order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const getServiceLink = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('mobile number consultation') || t.includes('mobile compatibility')) return "/mobile-compatibility-report";
    if (t.includes('loshu grid')) return "/loshu-grid-report";
    if (t.includes('marriage compatibility')) return "/marriage-compatibility";
    if (t.includes('name compatibility')) return "/name-compatibility-report";
    return `/book?service=${encodeURIComponent(title)}`;
  };

  const primeServiceTitles = [
    "loshu grid report",
    "mobile number consultation",
    "marriage compatibility",
    "name compatibility report",
    "mobile compatibility report"
  ];

  const primeServices = services?.filter(s => primeServiceTitles.some(title => s.title.toLowerCase().includes(title))) || [];
  const secondaryServices = services?.filter(s => !primeServiceTitles.some(title => s.title.toLowerCase().includes(title))) || [];

  const renderServiceCard = (service: any, i: number) => {
    const Icon = iconMap[service.icon || "FileText"] || FileText;
    const link = getServiceLink(service.title);
    const isSpecial = link !== `/book?service=${encodeURIComponent(service.title)}`;

    return (
      <motion.div
        key={service.id}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: i * 0.1 }}
        className="glass-card p-6 group hover:border-primary/40 transition-all duration-300 flex flex-col"
      >
        <Icon className="w-10 h-10 text-primary mb-4 group-hover:scale-110 transition-transform" />
        <h3 className="text-lg font-heading font-semibold mb-2 text-foreground">{service.title}</h3>
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed flex-1">{service.description}</p>
        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            <span className="text-2xl font-heading font-bold text-primary">₹{service.price.toLocaleString("en-IN")}</span>
            {service.old_price && <span className="text-muted-foreground line-through text-xs">₹{service.old_price.toLocaleString("en-IN")}</span>}
          </div>
          <a
            href={link}
            className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:brightness-110 transition-all"
          >
            {isSpecial ? "View Offer" : "Order Now"}
          </a>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="section-padding cosmic-bg">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Our <span className="gold-text">Services</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover the perfect numerological service to illuminate your path and transform your journey.
            </p>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
          ) : (
            <div className="space-y-16">
              {/* Prime Services */}
              {primeServices.length > 0 && (
                <div>
                  <h2 className="text-2xl font-heading font-bold mb-8 flex items-center gap-2">
                    <Star className="w-6 h-6 text-primary" />
                    Prime Services
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {primeServices.map((service, i) => renderServiceCard(service, i))}
                  </div>
                </div>
              )}

              {/* Secondary Services */}
              {secondaryServices.length > 0 && (
                <div>
                  <h2 className="text-2xl font-heading font-bold mb-8 opacity-80">Secondary Services</h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {secondaryServices.map((service, i) => renderServiceCard(service, i))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Services;
