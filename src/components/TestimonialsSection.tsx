import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Anamika Sharma",
    location: "Solan",
    text: "The Loshu Grid Report from Ank Darppan was an eye-opener! It helped me understand my strengths and weaknesses in a way I never imagined. Thanks to the detailed guidance, I've been able to focus on my goals with renewed clarity. Highly recommend!",
  },
  {
    name: "Kusum Sharma",
    location: "Panchkula",
    text: "I was skeptical about numerology, but the Vedic Numerology Report changed my perspective. Ank Darppan provided me with actionable insights that helped me make better career decisions. This is a must-try for anyone looking to unlock their potential.",
  },
  {
    name: "Amit Goel",
    location: "Ghaziabad, UP",
    text: "Ankdarppan is my go-to website for numerological advice! The predictions are always spot on, and I've learned a lot about how numbers influence different aspects of my life.",
  },
  {
    name: "Richa Kumari",
    location: "Jaipur",
    text: "The crystals and Rudraksh recommendations from Ank Darppan have transformed my life. I feel more focused and balanced than ever before. I'm so grateful for their guidance!",
  },
  {
    name: "Rakesh Gupta",
    location: "Chandigarh",
    text: "I had no idea how much my mobile number was affecting my energy. Ank Darppan's Mobile Number Consultation helped me choose a number that aligns with my goals. The results have been amazing!",
  },
  {
    name: "Roheika Verma",
    location: "Delhi",
    text: "The personalized approach and deep insights from Ank Darppan set them apart. The accuracy of the reading and practical remedies have truly improved my personal and professional life.",
  },
];

const TestimonialsSection = () => (
  <section id="testimonials" className="section-padding">
    <div className="container mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
          What Our <span className="gold-text">Clients Say</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Real stories from real people whose lives have been transformed through our guidance.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 flex flex-col"
          >
            <Quote className="w-8 h-8 text-primary/40 mb-3" />
            <p className="text-sm text-muted-foreground leading-relaxed flex-1">{t.text}</p>
            <div className="flex items-center gap-1 my-3">
              {[1,2,3,4,5].map((s) => (
                <Star key={s} className="w-4 h-4 fill-primary text-primary" />
              ))}
            </div>
            <div>
              <p className="font-heading font-semibold text-foreground">{t.name}</p>
              <p className="text-xs text-muted-foreground">{t.location}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
