import { useState, useEffect } from "react";
import { Menu, X, Phone, Mail, Clock, ShoppingCart, Facebook, Instagram, Youtube, User, LogOut, LogIn, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";

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
  const navigate = useNavigate();

  const [user, setUser] = useState<{ email?: string; name?: string } | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          email: session.user.email,
          name: session.user.user_metadata?.full_name || session.user.email?.split("@")[0],
        });
      } else {
        setUser(null);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          email: session.user.email,
          name: session.user.user_metadata?.full_name || session.user.email?.split("@")[0],
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    toast({ title: "Logged out successfully" });
    navigate("/");
  };

  const handleNavClick = (link: typeof navLinks[0]) => {
    setOpen(false);
    if (link.isHash) {
      if (location.pathname === "/") {
        const el = document.getElementById("contact");
        el?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <>
      {/* Top bar */}
      <div className="bg-secondary/80 backdrop-blur border-b border-border/30 text-xs sm:text-sm hidden md:block">
        <div className="container mx-auto flex items-center justify-between py-2 px-4">
          <div className="flex items-center gap-4 lg:gap-6 text-primary font-medium">
            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {format(new Date(), "do MMMM, yyyy")}</span>
            <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> contactus@ankdarppan.com</span>
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> 11:30 AM to 8:30 PM</span>
            <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> +(91) 93173-65025</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="https://www.facebook.com/profile.php?id=61572864015133" target="_blank" rel="noopener noreferrer" className="text-primary hover:brightness-110 transition-colors"><Facebook className="w-4 h-4" /></a>
            <a href="https://www.instagram.com/ankdarppan/" target="_blank" rel="noopener noreferrer" className="text-primary hover:brightness-110 transition-colors"><Instagram className="w-4 h-4" /></a>
            <a href="https://www.youtube.com/channel/UC8zAQ2jW03afza46M56UjcA" target="_blank" rel="noopener noreferrer" className="text-primary hover:brightness-110 transition-colors"><Youtube className="w-4 h-4" /></a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/30">
        <div className="container mx-auto flex items-center justify-between py-4 px-4">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Ank Darppan" className="w-12 h-12 rounded-full object-cover border border-primary/20" />
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
            {/* Cart */}
            <button onClick={() => openCart(true)} className="relative p-2 text-foreground hover:text-primary transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {count > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">{count}</span>}
            </button>

            {/* User menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-3 py-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors text-sm">
                    <User className="w-4 h-4 text-primary" />
                    <span className="text-foreground max-w-[120px] truncate">{user.name}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/my-account" className="cursor-pointer">
                      My Account
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/order-tracking" className="cursor-pointer">
                      My Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
                    <LogOut className="w-4 h-4 mr-2" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                to="/auth"
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors text-sm text-foreground"
              >
                <LogIn className="w-4 h-4 text-primary" /> Login
              </Link>
            )}

            {/* Book Now removed as per user request */}
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <button onClick={() => openCart(true)} className="relative p-2 text-foreground hover:text-primary transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {count > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">{count}</span>}
            </button>
            <button onClick={() => setOpen(!open)} className="text-foreground">
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
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

                {/* Mobile user section */}
                {user ? (
                  <div className="border-t border-border/30 pt-3 mt-1 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-foreground">
                      <User className="w-4 h-4 text-primary" />
                      <span className="truncate">{user.name}</span>
                    </div>
                    <Link to="/my-account" onClick={() => setOpen(false)} className="block text-sm py-2 text-muted-foreground hover:text-primary transition-colors">
                      My Account
                    </Link>
                    <Link to="/order-tracking" onClick={() => setOpen(false)} className="block text-sm py-2 text-muted-foreground hover:text-primary transition-colors">
                      My Orders
                    </Link>
                    <button onClick={() => { handleLogout(); setOpen(false); }} className="flex items-center gap-2 text-sm py-2 text-destructive">
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                ) : (
                  <Link to="/auth" onClick={() => setOpen(false)} className="flex items-center gap-2 text-sm py-2 text-muted-foreground hover:text-primary transition-colors">
                    <LogIn className="w-4 h-4" /> Login / Sign Up
                  </Link>
                )}

                {/* Book Now removed */}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default Navbar;
