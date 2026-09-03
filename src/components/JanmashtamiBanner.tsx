import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles, Clock, ArrowRight } from "lucide-react";
import { useOffer } from "@/hooks/useOffer";
import { OFFER_PRICES } from "@/config/offer";

const JanmashtamiBanner = () => {
  const { isLive, countdown } = useOffer();
  if (!isLive) return null;

  const combo = OFFER_PRICES.combo;

  return (
    <section className="sticky top-0 z-40 relative overflow-hidden border-b border-[rgba(200,154,62,0.4)] bg-[#061229]">
      <div className="absolute inset-0 cosmic-bg opacity-30" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#C89A3E]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

      <div className="relative container mx-auto px-4 py-3 md:py-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#F4C542] shrink-0" />
              <span className="text-xs md:text-sm font-semibold tracking-wider uppercase text-[#F4C542]">
                Krishna Janmashtami Special
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm md:text-base">
              <span className="font-heading font-bold gold-text">
                Krishna Kripa Combo ₹{combo.ashtami}
              </span>
              <span className="text-[#E8DFC8]/60 text-xs md:text-sm line-through">
                ₹{combo.regular.toLocaleString("en-IN")}
              </span>
              <span className="px-2 py-0.5 text-[10px] md:text-xs font-bold rounded-full bg-[#E8792C]/20 text-[#E8792C] border border-[#E8792C]/30">
                {combo.off}% OFF
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-5">
            <div className="flex items-center gap-2 text-xs md:text-sm text-[#E8DFC8]">
              <Clock className="w-3.5 h-3.5 text-[#C89A3E] shrink-0" />
              <span>
                Offer band hone mein:{" "}
                <span className="font-bold tabular-nums text-[#F4C542]">{countdown}</span>
              </span>
            </div>

            <Link
              to="/janmashtami"
              className="inline-flex items-center justify-center gap-2 px-5 py-2 text-sm font-bold rounded-full bg-gradient-to-r from-[#C89A3E] via-[#F4C542] to-[#B8763B] text-[#061229] hover:brightness-110 transition-all shadow-[0_4px_16px_-4px_rgba(244,197,66,0.35)] w-fit"
            >
              Grab Offer <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default JanmashtamiBanner;
