import { useState } from "react";
import { Menu, X, Phone, Mail, Clock, ShoppingCart, Facebook, Instagram, Youtube } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";

const navLinks = [
  { label: "Home", href: "/", isRoute: true },
  { label: "About", href: "/about", isRoute: true },
  { label: "Services", href: "/services", isRoute: true },
  { label: "Shop", href: "/shop", isRoute: true },
  { label: "Blog", href: "/blog", isRoute: true },
  { label: "Contact", href: "/#contact", isHash: true },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { setIsOpen: openCart, count } = useCart();
  const location = useLocation();

  const handleNavClick = (link: typeof navLinks[0]) => {
    setOpen(false);
    if (link.isHash) {
      if (location.pathname === "/") {
        const el = document.getElementById("contact");
        el?.scrollIntoView({ behavior: "smooth" });
      }
      // If not on home, the Link to="/#contact" will navigate home, then we scroll
    }
  };

  return (
    <>
      {/* Top bar */}
      <div className="bg-secondary/80 backdrop-blur border-b border-border/30 text-sm hidden md:block">
        <div className="container mx-auto flex items-center justify-between py-2 px-4">
          <div className="flex items-center gap-6 text-muted-foreground">
            <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-primary" /> contactus@ankdarppan.com</span>
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-primary" /> 11:30 AM to 8:30 PM</span>
            <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-primary" /> +(91) 93173-65025</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="https://www.facebook.com/profile.php?id=61572864015133" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors"><Facebook className="w-4 h-4" /></a>
            <a href="https://www.instagram.com/ankdarppan/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors"><Instagram className="w-4 h-4" /></a>
            <a href="https://www.youtube.com/channel/UC8zAQ2jW03afza46M56UjcA" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors"><Youtube className="w-4 h-4" /></a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/30">
        <div className="container mx-auto flex items-center justify-between py-4 px-4">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Ank Darppan" className="w-10 h-10 rounded-full" />
            <span className="text-xl font-heading font-semibold gold-text">Ank Darppan</span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => handleNavClick(link)}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors tracking-wide uppercase"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <button onClick={() => openCart(true)} className="relative p-2 text-foreground hover:text-primary transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {count > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">{count}</span>}
            </button>
            <Link to="/book" className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:brightness-110 transition-all animate-pulse-glow">
              Book Now
            </Link>
          </div>

          <button onClick={() => setOpen(!open)} className="lg:hidden text-foreground">
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden border-t border-border/30 overflow-hidden"
            >
              <div className="flex flex-col p-4 gap-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => handleNavClick(link)}
                    className="text-sm py-2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link to="/book" onClick={() => setOpen(false)} className="mt-2 text-center px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                  Book Now
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default Navbar;
