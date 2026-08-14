import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";

const stats = [
  { value: "5+", label: "Years Experience" },
  { value: "1000+", label: "Reports Delivered" },
  { value: "48 hr", label: "Report Delivery" },
];

const HeroSection = () => (
  <section id="home" className="relative min-h-[90vh] flex items-center overflow-hidden">
    <div className="absolute inset-0">
      <img
        src={heroBg}
        alt="Mystical numerology golden background"
        className="w-full h-full object-cover"
        width={1920}
        height={1080}
      />
      <div className="absolute inset-0 bg-background/70" />
      <div className="absolute inset-0 cosmic-bg opacity-40" />
    </div>

    <div className="relative container mx-auto px-4 py-20 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl"
      >
        <p className="text-primary font-display text-xl md:text-2xl italic mb-4">India's Trusted Numerology Consultant</p>
        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-heading font-bold leading-tight mb-6">
          Take Control of Your <span className="gold-text animate-shimmer">Destiny</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-xl mb-8 font-light leading-relaxed" style={{ lineHeight: 1.7 }}>
          Discover your true path with expert numerological guidance. Our personalized consultations reveal hidden
          opportunities and guide you through life's challenges.
        </p>

        <div className="flex flex-col gap-4 mb-12">
          <Link
            to="/book"
            className="px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold text-base hover:brightness-110 transition-all shadow-[0_4px_20px_-5px_hsl(var(--primary)/0.4)] w-fit"
          >
            Book Consultation
          </Link>
          <div className="flex items-center gap-2 text-xs text-muted-foreground opacity-80">
            <span>🔒 Secure Razorpay Payments</span>
            <span>·</span>
            <span>WhatsApp Support</span>
            <span>·</span>
            <span>Reports within 48 hours</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 w-full"
      >
        {stats.map((stat) => (
          <div key={stat.label} className="glass-card p-4 text-center">
            <p className="text-2xl md:text-3xl font-heading font-bold text-primary">{stat.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default HeroSection;
