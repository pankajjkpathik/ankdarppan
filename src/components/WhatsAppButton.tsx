import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => (
  <a
    href="https://wa.me/919317365025?text=Hi%2C%20I%27d%20like%20to%20know%20more%20about%20your%20services."
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Chat on WhatsApp"
    className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform animate-bounce-slow"
  >
    <MessageCircle className="w-7 h-7" />
  </a>
);

export default WhatsAppButton;
