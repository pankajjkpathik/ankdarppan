import { motion } from "framer-motion";
import loshuImg from "@/assets/loshu-grid.jpg";

const points = [
  "Numbers hold energetic frequencies that shape your emotions, behavior, and life experiences.",
  "Your core numerology numbers—Life Path, Destiny, and Soul Urge—reveal your true nature.",
  "Each number from 1–9 and master numbers (11, 22, 33) have distinct meanings and symbolic power.",
  "Numerology connects name and birthdate vibrations to uncover hidden potentials and life lessons.",
  "Acts as a spiritual guide, helping you understand yourself, your relationships, and your life direction.",
];

const AboutSection = () => (
  <section id="about" className="section-padding stars-bg">
    <div className="container mx-auto">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative">
            <img src={loshuImg} alt="Lo Shu Grid Numerology" className="rounded-2xl w-full max-w-md mx-auto shadow-2xl shadow-primary/10" loading="lazy" width={512} height={512} />
            <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-2xl bg-primary/10 border border-primary/20 floating" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
            What is <span className="gold-text">Numerology</span>?
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Numerology is the ancient study of how numbers influence your personality, destiny, and life journey. Each number carries a unique vibration that reveals hidden truths about your strengths, challenges, and purpose.
          </p>
          <ul className="space-y-3">
            {points.map((point, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                <span className="text-sm text-muted-foreground leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
          <a href="#calculators" className="inline-block mt-8 px-6 py-3 rounded-full border border-primary/40 text-primary font-semibold text-sm hover:bg-primary/10 transition-all">
            Explore Calculators →
          </a>
        </motion.div>
      </div>
    </div>
  </section>
);

export default AboutSection;
