import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Grid3X3, BookOpen, Heart, Smartphone, Gem, FileText, Star, Sparkles, Eye, Moon, Loader2, LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

const iconMap: Record<string, LucideIcon> = {
  Grid3X3, BookOpen, Heart, Smartphone, Gem, FileText, Star, Sparkles, Eye, Moon,
};

const ServicesSection = () => {
  const { data: services, isLoading } = useQuery({
    queryKey: ["services-home"],
    queryFn: async () => {
      const { data, error } = await supabase.from("services").select("*").eq("is_active", true).order("sort_order").limit(3);
      if (error) throw error;
      return data;
    },
  });

  return (
    <section id="services" className="section-padding cosmic-bg">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Our <span className="gold-text">Services</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover the perfect numerological service to illuminate your path and transform your journey.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services?.map((service, i) => {
              const Icon = iconMap[service.icon || "FileText"] || FileText;
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card p-6 group hover:border-primary/40 transition-all duration-300"
                >
                  <Icon className="w-10 h-10 text-primary mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-lg font-heading font-semibold mb-2 text-foreground">{service.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{service.description}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-2xl font-heading font-bold text-primary">₹{service.price.toLocaleString("en-IN")}</span>
                    <a
                      href={`/book?service=${encodeURIComponent(service.title)}`}
                      className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:brightness-110 transition-all"
                    >
                      Order Now
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            to="/services"
            className="inline-block px-8 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:brightness-110 transition-all"
          >
            View All Services →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
