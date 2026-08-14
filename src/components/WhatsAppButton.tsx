import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  const [showLabel, setShowLabel] = (window as any).React ? (window as any).React.useState(false) : [false, () => {}];

  (window as any).React?.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) setShowLabel(true);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <a
      href="https://wa.me/919317365025?text=Hi%2C%20I%27d%20like%20to%20know%20more%20about%20your%20services."
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 group"
    >
      <div className={`bg-white text-[#25D366] px-4 py-2 rounded-full shadow-lg font-semibold text-sm transition-all duration-500 transform ${showLabel ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'}`}>
        Chat with us
      </div>
      <div className="w-16 h-16 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
        <MessageCircle className="w-8 h-8" />
      </div>
    </a>
  );
};

export default WhatsAppButton;
