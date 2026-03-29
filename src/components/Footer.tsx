import { Phone, Mail, Facebook, Instagram, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border/30 bg-secondary/30">
    <div className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-3 gap-8">
        <div>
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Ank Darppan" className="w-8 h-8 rounded-full" />
            <span className="text-xl font-heading font-bold gold-text">Ank Darppan</span>
          </Link>
          <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
            Your trusted numerology consultant. Unlock the power of numbers to transform your life, career, and relationships.
          </p>
        </div>
        <div>
          <h4 className="font-heading font-semibold text-foreground mb-4">Quick Links</h4>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Home", to: "/" },
              { label: "About", to: "/about" },
              { label: "Services", to: "/services" },
              { label: "Shop", to: "/shop" },
              { label: "Blog", to: "/blog" },
              { label: "Contact", to: "/#contact" },
            ].map((l) => (
              <Link key={l.label} to={l.to} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
          <div className="mt-4 space-y-1">
            <Link to="/privacy-policy" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="/refund-policy" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Refund & Returns Policy</Link>
            <Link to="/terms-and-conditions" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Terms & Conditions</Link>
          </div>
        </div>
        <div>
          <h4 className="font-heading font-semibold text-foreground mb-4">Contact</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary" /> +(91) 93173-65025</p>
            <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /> contactus@ankdarppan.com</p>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <a href="https://www.facebook.com/profile.php?id=61572864015133" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors"><Facebook className="w-5 h-5" /></a>
            <a href="https://www.instagram.com/ankdarppan/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors"><Instagram className="w-5 h-5" /></a>
            <a href="https://www.youtube.com/channel/UC8zAQ2jW03afza46M56UjcA" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors"><Youtube className="w-5 h-5" /></a>
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
