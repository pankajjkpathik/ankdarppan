import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    q: "How accurate are numerological predictions?",
    a: "Numerological predictions are based on the analysis of numbers derived from your birth date and name. While we maintain a very high accuracy rate, numerology reveals potentials and tendencies rather than fixed outcomes. Free will always plays a role.",
  },
  {
    q: "What information do you need for a consultation?",
    a: "For most consultations, we require your exact date of birth and full name as per birth certificate. For mobile number consultations, we need your current mobile number. The more accurate the information, the more precise the analysis.",
  },
  {
    q: "How are consultations conducted?",
    a: "Consultations are available via phone call, video call (Zoom/Google Meet), or in-person. You'll receive a detailed written report along with a personal discussion session to explain the findings and remedies.",
  },
  {
    q: "How long does it take to receive my report?",
    a: "Standard reports are delivered within 3-5 business days. For urgent requirements, we offer express delivery within 24-48 hours at an additional charge.",
  },
  {
    q: "What if I'm skeptical about numerology?",
    a: "Many of our clients initially approach us with healthy skepticism. We encourage you to keep an open mind and evaluate the insights provided. Our approach focuses on practical guidance, and the accuracy speaks for itself.",
  },
];

const FAQSection = () => (
  <section className="section-padding cosmic-bg">
    <div className="container mx-auto max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
          Common <span className="gold-text">Questions</span>
        </h2>
      </motion.div>

      <Accordion type="single" collapsible className="space-y-3">
        {faqs.map((faq, i) => (
          <AccordionItem key={i} value={`faq-${i}`} className="glass-card px-6 border-none">
            <AccordionTrigger className="text-left font-heading font-medium text-foreground hover:text-primary">
              {faq.q}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">
              {faq.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
);

export default FAQSection;
