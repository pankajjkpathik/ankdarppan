import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, Clock, MapPin } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const ContactSection = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    const subject = encodeURIComponent(`Inquiry from ${form.name}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\n\nMessage:\n${form.message}`
    );
    window.location.href = `mailto:contactus@ankdarppan.com?subject=${subject}&body=${body}`;
    toast({ title: "Opening your email client..." });
    setForm({ name: "", email: "", phone: "", message: "" });
  };

  return (
  <section id="contact" className="section-padding">
    <div className="container mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
          Get in <span className="gold-text">Touch</span>
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Ready to unlock your cosmic potential? Reach out to us for a personalized consultation.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div className="space-y-6">
          {[
            { icon: Phone, label: "Phone", value: "+(91) 93173-65025", href: "tel:+919317365025" },
            { icon: Mail, label: "Email", value: "contactus@ankdarppan.com", href: "mailto:contactus@ankdarppan.com" },
            { icon: Clock, label: "Working Hours", value: "11:30 AM to 8:30 PM", href: null },
            { icon: MapPin, label: "Visit Us", value: "India", href: null },
          ].map((item) => (
            <div key={item.label} className="glass-card p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{item.label}</p>
                {item.href ? (
                  <a href={item.href} className="text-foreground font-medium hover:text-primary transition-colors">{item.value}</a>
                ) : (
                  <p className="text-foreground font-medium">{item.value}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="glass-card p-6">
          <h3 className="font-heading font-semibold text-lg mb-4 text-foreground">Send a Message</h3>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <input type="text" placeholder="Your Name" className="w-full p-3 rounded-lg bg-secondary border border-border text-foreground" />
            <input type="email" placeholder="Your Email" className="w-full p-3 rounded-lg bg-secondary border border-border text-foreground" />
            <input type="tel" placeholder="Your Phone" className="w-full p-3 rounded-lg bg-secondary border border-border text-foreground" />
            <textarea placeholder="Your Message" rows={4} className="w-full p-3 rounded-lg bg-secondary border border-border text-foreground resize-none" />
            <button type="submit" className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:brightness-110 transition-all">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
);

export default ContactSection;
