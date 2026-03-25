import { motion } from "framer-motion";
import { Grid3X3, BookOpen, Heart, Smartphone, Gem, FileText } from "lucide-react";

const services = [
  {
    icon: Grid3X3,
    title: "Loshu Grid Report",
    desc: "Know your Grid, Birth Number, Destiny Number and more in your ANK DARPPAN REPORT",
    price: "₹671",
    link: "https://rzp.io/rzp/UIzji7Qc",
  },
  {
    icon: BookOpen,
    title: "Vedic Numerology Report",
    desc: "Get your Vedic Numerology Report along with Remedies",
    price: "₹671",
    link: "https://rzp.io/rzp/hXZcp6f",
  },
  {
    icon: Heart,
    title: "Marriage Compatibility",
    desc: "Get an authentic Marriage Compatibility Report for your relationship.",
    price: "₹941",
    link: "https://rzp.io/rzp/6AxWUPN",
  },
  {
    icon: Smartphone,
    title: "Mobile Number Consultation",
    desc: "Is your Mobile Number Lucky for you or not? Find out now!",
    price: "₹581",
    link: "https://rzp.io/rzp/dpnepvMq",
  },
  {
    icon: Gem,
    title: "Crystal & Rudraksh Consultation",
    desc: "Get personalized crystal and Rudraksh recommendations for healing and balance.",
    price: "₹941",
    link: "#contact",
  },
  {
    icon: FileText,
    title: "Name Analysis & Correction",
    desc: "Discover the numerological power of your name and get correction suggestions.",
    price: "₹671",
    link: "#contact",
  },
];

const ServicesSection = () => (
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

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, i) => (
          <motion.div
            key={service.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 group hover:border-primary/40 transition-all duration-300"
          >
            <service.icon className="w-10 h-10 text-primary mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-heading font-semibold mb-2 text-foreground">{service.title}</h3>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{service.desc}</p>
            <div className="flex items-center justify-between mt-auto">
              <span className="text-2xl font-heading font-bold text-primary">{service.price}</span>
              <a
                href={`/book?service=${encodeURIComponent(service.title)}`}
                className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:brightness-110 transition-all"
              >
                Order Now
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ServicesSection;
