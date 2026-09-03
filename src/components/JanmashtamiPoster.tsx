import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles, CalendarClock, Timer, ArrowRight, Check } from "lucide-react";
import { useOffer } from "@/hooks/useOffer";
import { OFFER_PRICES } from "@/config/offer";

const ROWS: { label: string; regular: number; ashtami: number; off: number; best?: boolean }[] = [
  { label: "Mobile Number Report", ...OFFER_PRICES.mobile },
  { label: "Loshu Grid Report", ...OFFER_PRICES.loshu },
  { label: "Krishna Kripa Combo", ...OFFER_PRICES.combo, best: true },
];

const JanmashtamiPoster = () => {
  const { phase, isLive, countdown } = useOffer();
  if (phase === "after") return null;

  return (
    <section className="section-padding bg-[#061229] relative overflow-hidden">
      <div className="absolute inset-0 cosmic-bg opacity-30" />
      <div className="absolute -top-24 right-0 w-96 h-96 rounded-full bg-[#C89A3E]/10 blur-3xl" />
      <div className="absolute -bottom-24 left-0 w-80 h-80 rounded-full bg-[#E8792C]/10 blur-3xl" />

      <div className="container relative mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto rounded-3xl border border-[rgba(200,154,62,0.4)] bg-[#0F2547]/80 backdrop-blur-sm p-6 md:p-10 shadow-[0_20px_60px_-30px_rgba(244,197,66,0.45)]"
        >
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            {/* Left: message */}
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 mb-5 text-[11px] md:text-xs font-bold tracking-[0.18em] uppercase rounded-full border border-[rgba(200,154,62,0.5)] text-[#F4C542]">
                <Sparkles className="w-3.5 h-3.5" /> Krishna Janmashtami Special
              </span>

              <h2 className="text-3xl md:text-4xl font-heading font-bold leading-tight mb-4 text-[#FAFAF7]">
                Kanha ke janam par, <span className="gold-text">42% tak ki chhoot</span>
              </h2>

              <p className="text-[#E8DFC8]/85 leading-relaxed mb-6">
                Sirf 48 ghante — Mobile Number Report, Loshu Grid Report aur dono ka Krishna Kripa Combo
                Janmashtami daam par.
              </p>

              {/* Timeline */}
              <div className="space-y-3 mb-7">
                <div className="flex items-start gap-3 text-sm text-[#E8DFC8]">
                  <CalendarClock className="w-4 h-4 mt-0.5 text-[#C89A3E] shrink-0" />
                  <div>
                    <p className="font-semibold text-[#FAFAF7]">Offer window</p>
                    <p>04-09-2026 (12 PM) se 06-09-2026 (12 PM) tak — 48 ghante</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm text-[#E8DFC8]">
                  <Timer className="w-4 h-4 mt-0.5 text-[#C89A3E] shrink-0" />
                  <div>
                    <p className="font-semibold text-[#FAFAF7]">
                      {isLive ? "Offer band hone mein" : "Offer live hone mein"}
                    </p>
                    <p className="tabular-nums font-bold text-[#F4C542]">
                      {isLive ? countdown : "4 September, 12 PM"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm text-[#E8DFC8]">
                  <Check className="w-4 h-4 mt-0.5 text-[#C89A3E] shrink-0" />
                  <div>
                    <p className="font-semibold text-[#FAFAF7]">Delivery</p>
                    <p>PDF report email aur WhatsApp par, 24–36 hours mein</p>
                  </div>
                </div>
              </div>

              <Link
                to="/janmashtami"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-bold text-[#061229] bg-gradient-to-r from-[#C89A3E] via-[#F4C542] to-[#B8763B] hover:brightness-110 transition-all shadow-[0_8px_24px_-8px_rgba(244,197,66,0.6)]"
              >
                {isLive ? "Grab Offer" : "Offer Dekhein"} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Right: price card */}
            <div className="rounded-2xl border border-[rgba(200,154,62,0.35)] bg-[#0A1E3D]/70 p-5 md:p-6">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[rgba(200,154,62,0.25)] text-[11px] font-bold uppercase tracking-wider text-[#E8DFC8]/70">
                <span>Report</span>
                <span>Regular / Ashtami</span>
              </div>

              <ul className="space-y-4">
                {ROWS.map((r) => (
                  <li key={r.label} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm md:text-base text-[#FAFAF7]">{r.label}</span>
                      {r.best && (
                        <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full bg-[#E8792C]/20 text-[#E8792C] border border-[#E8792C]/30">
                          Best
                        </span>
                      )}
                    </div>
                    <div className="text-right whitespace-nowrap">
                      <span className="text-xs text-[#E8DFC8]/50 line-through mr-2">
                        ₹{r.regular.toLocaleString("en-IN")}
                      </span>
                      <span className="text-lg md:text-xl font-heading font-bold gold-text">
                        ₹{r.ashtami.toLocaleString("en-IN")}
                      </span>
                      <span className="block text-[10px] font-semibold text-[#E8DFC8]/70">{r.off}% off</span>
                    </div>
                  </li>
                ))}
              </ul>

              <p className="mt-5 pt-4 border-t border-[rgba(200,154,62,0.25)] text-[11px] text-[#E8DFC8]/70">
                Saath mein free: Shubh Number Shortlist · Personal Year 2026-27 · Janmashtami Upay Card
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default JanmashtamiPoster;
