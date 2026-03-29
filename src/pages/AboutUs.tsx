import { motion } from "framer-motion";
import { Phone } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import logoImg from "/logo.png";
import loshuImg from "@/assets/loshu-grid.jpg";

const AboutUs = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <section className="section-padding stars-bg">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-3xl md:text-5xl font-heading font-bold mb-4">
            About <span className="gold-text">Ank Darppan</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            The most accurate numerology predictions prepared for you
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <img src={logoImg} alt="Ank Darppan Logo" className="rounded-2xl w-full max-w-sm mx-auto" loading="lazy" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl md:text-3xl font-heading font-bold mb-6">
              Know About <span className="gold-text">ANK DARPPAN</span>
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Welcome to www.ankdarppan.com, your trusted destination for personalized numerology insights and spiritual guidance. Founded by a certified numerologist, we specialize in decoding the powerful influence of numbers to bring clarity, balance, and positivity into your life.
              </p>
              <p>
                Our services include expert Numerology Predictions, helping you unlock the secrets of your mobile number, vehicle number, house number, and even your personal year cycles. Whether you're planning a significant event or seeking harmony in your daily life, our Event Prediction services ensure you choose the most auspicious timings.
              </p>
            </div>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1"
          >
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                We also offer tailored recommendations for Rudraksha beads, crystals, and gemstones, designed to enhance your energy, well-being, and success. At Ank Darpan, we combine ancient wisdom with modern insights to guide you on a path of growth, happiness, and fulfillment.
              </p>
              <p>
                Let us be your partner in aligning your life's numbers and energies for a brighter, more prosperous future!
              </p>
              <p className="text-lg font-heading font-semibold text-foreground">
                Unlock your potential with astrology and numerology.
              </p>
              <div className="flex items-center gap-3 mt-6">
                <Phone className="w-5 h-5 text-primary" />
                <span className="text-foreground font-semibold">Contact Ank Darppan @ +(91) 93173-65025</span>
              </div>
              <a
                href="/book"
                className="inline-block mt-4 px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold hover:brightness-110 transition-all"
              >
                Book Consultation
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-1 lg:order-2"
          >
            <img src={loshuImg} alt="Lo Shu Grid Numerology" className="rounded-2xl w-full max-w-md mx-auto shadow-2xl shadow-primary/10" loading="lazy" />
          </motion.div>
        </div>
      </div>
    </section>
    <Footer />
    <WhatsAppButton />
  </div>
);

export default AboutUs;
