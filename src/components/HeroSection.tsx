import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";

const stats = [
  { value: "25+", label: "Years Experience" },
  { value: "5000+", label: "Satisfied Clients" },
  { value: "98%", label: "Accuracy Rate" },
  { value: "15+", label: "Countries Served" },
];

const HeroSection = () => (
  <section id="home" className="relative min-h-[90vh] flex items-center overflow-hidden">
    <div className="absolute inset-0">
      <img src={heroBg} alt="Mystical numerology background" className="w-full h-full object-cover" width={1920} height={1080} />
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
        <p className="text-primary font-display text-xl md:text-2xl italic mb-4">Trust our Experience</p>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold leading-tight mb-6">
          Start Control of Your{" "}
          <span className="gold-text">Professional Destiny</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-xl mb-8 font-light leading-relaxed">
          Discover your true path with expert numerological guidance. Our personalized consultations reveal hidden opportunities and guide you through life's challenges.
        </p>

        <div className="flex flex-wrap gap-4 mb-12">
          <a href="#services" className="px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold text-base hover:brightness-110 transition-all shadow-lg shadow-primary/25">
            Book Consultation
          </a>
          <a href="#about" className="px-8 py-3.5 rounded-full border border-foreground/20 text-foreground font-semibold text-base hover:border-primary hover:text-primary transition-all">
            Explore More
          </a>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
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
