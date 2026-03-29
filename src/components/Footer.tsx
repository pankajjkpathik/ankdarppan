import { Phone, Mail, Facebook, Instagram, Youtube } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border/30 bg-secondary/30">
    <div className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-3 gap-8">
        <div>
          <span className="text-xl font-heading font-bold gold-text">ॐ Ank Darppan</span>
          <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
            Your trusted numerology consultant. Unlock the power of numbers to transform your life, career, and relationships.
          </p>
        </div>
        <div>
          <h4 className="font-heading font-semibold text-foreground mb-4">Quick Links</h4>
          <div className="grid grid-cols-2 gap-2">
            {["Home", "About", "Services", "Calculators", "Shop", "Contact"].map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                {l}
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-heading font-semibold text-foreground mb-4">Contact</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary" /> +(91) 93173-65025</p>
            <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /> contactus@ankdarppan.com</p>
          </div>
        </div>
      </div>
      <div className="border-t border-border/30 mt-8 pt-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Ank Darppan. All Rights Reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
