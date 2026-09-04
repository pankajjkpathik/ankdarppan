import { useEffect, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Copy, Sparkles, ShieldCheck, Clock, Mic, Timer, Quote, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/hooks/use-toast";
import { fbTrack } from "@/lib/fbpixel";
import { useOffer } from "@/hooks/useOffer";
import { OFFER_PRICES, OfferSlug } from "@/config/offer";

type Offer = {
  slug: OfferSlug;
  name: string;
  regular: number;
  ashtami: number;
  off: number;
  includes: string[];
  highlight?: boolean;
};

const BONUSES = [
  "Shubh Number Shortlist — aapke Mulank se milte 5 mobile number combinations",
  "Personal Year 2026-27 — agle 12 mahine ka ank",
  "Janmashtami Upay Card — aapke Mulank ke liye ek upay, ek mantra, ek rang",
];

const OFFERS: Offer[] = [
  {
    slug: "mobile",
    name: "Mobile Number Report (Janmashtami Offer)",
    ...OFFER_PRICES.mobile,
    includes: [
      "Aapke mobile number ki full vibration analysis",
      "Number aapke Loshu Grid se match karta hai ya nahi",
      "Suggested corrections & lucky number combinations",
    ],
  },
  {
    slug: "loshu",
    name: "Loshu Grid Report (Janmashtami Offer)",
    ...OFFER_PRICES.loshu,
    includes: [
      "Poore 8 planes of life ka detailed analysis",
      "Missing numbers aur unka asar + remedies",
      "Career, money, health aur relationship insights",
    ],
  },
  {
    slug: "combo",
    name: "Krishna Kripa Combo (Janmashtami Offer)",
    ...OFFER_PRICES.combo,
    highlight: true,
    includes: [
      "Mobile Number Report + Loshu Grid Report — dono",
      "Combined guidance: number correction + remedies",
      "Priority delivery on WhatsApp",
    ],
  },
];

const PAGE_TESTIMONIALS = [
  {
    quote:
      "Loshu Grid report padhkar samajh aaya ki mere missing numbers kyun problem kar rahe the. Remedies simple the aur 3 hafte mein farq dikha.",
    name: "Anamika Sharma",
    city: "Loshu Grid Report",
  },
  {
    quote:
      "Mobile Number Report ke baad number change kiya. Business calls ka response pehle se kaafi behtar hai. Guidance bilkul clear thi.",
    name: "Rakesh Gupta",
    city: "Mobile Number Report",
  },
  {
    quote:
      "The report was very well detailed and comprehensive. It was highly informative and covered all the aspects of the mobile number. True value for money!!",
    name: "Saiff M Wahid",
    city: "Mobile Number Report · via WhatsApp",
  },
  {
    quote:
      "Krishna Kripa Combo lene ka decision bilkul sahi tha. Dono reports detail mein thi aur upay bhi practical hain. Website se order karna bahut easy tha.",
    name: "G.D. Charan",
    city: "Krishna Kripa Combo · Jodhpur · via Website",
  },
];

const SAMPLES = ["/loshu-report-v2.png", "/mobile-report-v2.png", "/marriage-report-v2.png"];

const JanmashtamiOffer = () => {
  const { addItem, setIsOpen } = useCart();
  const [params, setParams] = useSearchParams();
  const { slug: routeSlug } = useParams();
  const { phase, isLive, countdown } = useOffer();
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowSticky(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const buy = (offer: Offer) => {
    addItem({
      name: offer.name,
      price: `₹${offer.ashtami}`,
      priceNum: offer.ashtami,
      img: "/logo.png",
    });
    fbTrack("InitiateCheckout", {
      value: offer.ashtami,
      currency: "INR",
      content_name: offer.name,
      content_category: "Janmashtami Offer",
    });
    setIsOpen(true);
  };

  // Direct payment link support: /janmashtami?buy=mobile | loshu | combo
  useEffect(() => {
    if (!isLive) return;
    const slug = routeSlug || params.get("buy");
    if (!slug) return;
    const offer = OFFERS.find((o) => o.slug === slug);
    if (offer) {
      buy(offer);
      if (params.get("buy")) {
        params.delete("buy");
        setParams(params, { replace: true });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const copyLink = (slug: string) => {
    const url = `${window.location.origin}/janmashtami?buy=${slug}`;
    navigator.clipboard.writeText(url);
    toast({ title: "Payment link copied", description: url });
  };

  return (
    <>
      <SEO
        title="Krishna Janmashtami Offer | Loshu & Mobile Report se ₹888 tak"
        description="Janmashtami special: Mobile Number Report ₹388, Loshu Grid Report ₹618, Krishna Kripa Combo ₹888. Limited period par 42% tak off."
        canonical="https://www.ankdarppan.com/janmashtami"
      />
      <div className="min-h-screen bg-[#fdfbf7] font-body text-stone-900">
        <Navbar />

        <main className={isLive ? "pb-20 md:pb-0" : ""}>
          <section className="relative py-14 md:py-20 bg-[#f9f6f0] overflow-hidden">
            <div className="container px-4 mx-auto text-center">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-xs font-semibold tracking-wider uppercase rounded-full bg-primary/10 text-primary">
                  <Sparkles className="w-3.5 h-3.5" /> Krishna Janmashtami Special
                </span>
                <h1 className="mb-5 text-3xl md:text-5xl font-heading leading-tight">
                  Kanha ke janam par, <br />
                  <span className="text-primary">aapke numbers ka darshan</span>
                </h1>
                <p className="max-w-2xl mx-auto text-base md:text-lg text-stone-700 font-medium">
                  Sirf Janmashtami ke liye — Mobile Number Report, Loshu Grid Report aur dono ka
                  Krishna Kripa Combo, 42% tak ki chhoot par.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Offer table */}
          <section className="py-10 md:py-12">
            <div className="container px-4 mx-auto max-w-3xl">
              <div className="overflow-hidden border rounded-2xl border-primary/20 bg-white shadow-sm">
                <table className="w-full text-sm md:text-base">
                  <thead>
                    <tr className="bg-[#f9f6f0] text-stone-900">
                      <th className="p-3 md:p-4 text-left font-heading font-semibold">Report</th>
                      <th className="p-3 md:p-4 text-right font-heading font-semibold">Regular</th>
                      <th className="p-3 md:p-4 text-right font-heading font-semibold">Ashtami</th>
                    </tr>
                  </thead>
                  <tbody>
                    {OFFERS.map((o) => (
                      <tr key={o.slug} className="border-t border-primary/10">
                        <td className="p-3 md:p-4 font-medium text-stone-900">
                          {o.name.replace(" (Janmashtami Offer)", "")}
                        </td>
                        <td className="p-3 md:p-4 text-right text-stone-400 line-through">
                          ₹{o.regular.toLocaleString("en-IN")}
                        </td>
                        <td className="p-3 md:p-4 text-right font-bold text-primary whitespace-nowrap">
                          ₹{o.ashtami.toLocaleString("en-IN")}{" "}
                          <span className="block text-[11px] font-semibold text-stone-600">({o.off}% off)</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Deadline strip */}
              {isLive && (
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-4 mt-5 border rounded-2xl border-primary/40 bg-primary/5">
                  <span className="inline-flex items-center gap-2 font-bold text-primary whitespace-nowrap">
                    <Timer className="w-4 h-4" /> <span className="tabular-nums">{countdown}</span>
                  </span>
                  <span className="text-sm text-stone-700">
                    Ye daam 6 September, raat 11:59 baje tak. Uske baad wapas ₹581 aur ₹941.
                  </span>
                </div>
              )}

              {phase === "before" && (
                <div className="p-4 mt-5 text-sm font-semibold text-center border rounded-2xl border-primary/40 bg-primary/5 text-stone-800">
                  Offer 4 September, raat 12 baje se live hoga. Abhi Mobile Number Report ₹581 aur Loshu Grid Report ₹941 par uplabdh hai.
                </div>
              )}
            </div>
          </section>

          {/* Offer cards / closed state */}
          <section className="pb-12 md:pb-16">
            <div className="container px-4 mx-auto">
              {phase === "after" ? (
                <div className="max-w-2xl p-8 mx-auto text-center bg-white border rounded-3xl border-primary/20">
                  <h2 className="mb-3 text-2xl font-heading text-stone-900">Janmashtami offer band ho gaya</h2>
                  <p className="mb-6 text-stone-700">
                    Ye daam 6 September, raat 11:59 baje tak the. Ab Mobile Number Report ₹581 aur Loshu Grid Report ₹941 par uplabdh hai.
                  </p>
                  <Link
                    to="/services"
                    className="inline-flex px-6 py-3 font-bold rounded-full bg-primary text-primary-foreground hover:brightness-110 transition-all"
                  >
                    Services Dekhein
                  </Link>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-3">
                  {OFFERS.map((o) => (
                    <div
                      key={o.slug}
                      className={`flex flex-col p-6 bg-white border rounded-3xl shadow-sm ${
                        o.highlight ? "border-primary shadow-lg ring-1 ring-primary/30" : "border-primary/20"
                      }`}
                    >
                      {o.highlight && (
                        <span className="self-start px-3 py-1 mb-3 text-[10px] font-bold uppercase tracking-wider rounded-full bg-primary text-primary-foreground">
                          Best Value
                        </span>
                      )}
                      <h2 className="mb-2 text-xl font-heading text-stone-900">
                        {o.name.replace(" (Janmashtami Offer)", "")}
                      </h2>
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-3xl font-bold text-stone-900">₹{o.ashtami.toLocaleString("en-IN")}</span>
                        <span className="text-base text-stone-400 line-through">₹{o.regular.toLocaleString("en-IN")}</span>
                        <span className="text-sm font-bold text-primary">{o.off}% off</span>
                      </div>
                      <ul className="mb-5 space-y-3">
                        {o.includes.map((t, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-stone-700">
                            <Check className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="flex-1 pt-4 mb-6 border-t border-primary/15">
                        <p className="mb-3 text-xs font-bold tracking-wider uppercase text-primary">Saath mein free:</p>
                        <ul className="space-y-2.5">
                          {BONUSES.map((b, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-stone-700">
                              <Sparkles className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                              <span>{b}</span>
                            </li>
                          ))}
                          {o.slug === "combo" && (
                            <li className="flex items-start gap-2 p-2.5 text-sm font-semibold rounded-xl bg-primary/10 text-stone-900">
                              <Mic className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                              <span>Mera 5 minute ka personal voice note — WhatsApp par, aapki report padhkar</span>
                            </li>
                          )}
                        </ul>
                      </div>

                      {isLive ? (
                        <>
                          <Button onClick={() => buy(o)} size="lg" className="w-full font-bold rounded-full py-6">
                            Pay ₹{o.ashtami.toLocaleString("en-IN")} Now
                          </Button>
                          <button
                            onClick={() => copyLink(o.slug)}
                            className="inline-flex items-center justify-center gap-1.5 mt-3 text-xs font-semibold text-stone-500 hover:text-primary transition-colors"
                          >
                            <Copy className="w-3.5 h-3.5" /> Copy direct payment link
                          </button>
                        </>
                      ) : (
                        <p className="text-sm font-semibold text-center text-stone-500">
                          4 September, 11:59 PM se available
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-sm text-stone-600">
                <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-primary" /> Secure UPI / Card payment</span>
                <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-primary" /> Report email aur WhatsApp dono par</span>
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-primary" /> Delivery 24–36 hours mein</span>
              </div>
            </div>
          </section>

          {/* Testimonials */}
          <section className="py-12 bg-[#f9f6f0]">
            <div className="container px-4 mx-auto">
              <h2 className="mb-8 text-2xl md:text-3xl font-heading text-center text-stone-900">
                Log kya kehte hain
              </h2>
              <div className="grid gap-6 md:grid-cols-3">
                {PAGE_TESTIMONIALS.map((t) => (
                  <div key={t.name} className="p-6 bg-white border rounded-3xl border-primary/20 shadow-sm">
                    <Quote className="w-6 h-6 mb-3 text-primary" />
                    <p className="mb-4 text-sm leading-relaxed text-stone-700">{t.quote}</p>
                    <p className="text-sm font-bold text-stone-900">{t.name}</p>
                    <p className="text-xs text-stone-500">{t.city}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Sample report gallery */}
          <section className="py-12 md:py-16">
            <div className="container px-4 mx-auto max-w-4xl">
              <h2 className="mb-4 text-2xl md:text-3xl font-heading text-center text-stone-900">
                Report andar se kaisi dikhti hai
              </h2>
              <p className="max-w-2xl mx-auto mb-8 text-center text-stone-700">
                Ye ek digital report hai, isliye order ke baad refund nahi ho sakta. Isiliye maine report ka namuna
                neeche rakh diya hai — pehle dekh lijiye, phir tay kijiye.
              </p>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {SAMPLES.map((src, i) => (
                  <button
                    key={src}
                    onClick={() => setLightbox(src)}
                    className="overflow-hidden bg-white border rounded-2xl border-primary/20 hover:border-primary transition-colors"
                  >
                    <img
                      src={src}
                      alt={`Sample report page ${i + 1}`}
                      loading="lazy"
                      className="w-full h-auto"
                    />
                  </button>
                ))}
              </div>
            </div>
          </section>
        </main>

        {lightbox && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80"
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute p-2 text-white top-4 right-4"
              aria-label="Close preview"
              onClick={() => setLightbox(null)}
            >
              <X className="w-6 h-6" />
            </button>
            <img src={lightbox} alt="Sample report preview" className="max-h-[90vh] max-w-full rounded-xl" />
          </div>
        )}

        {/* Sticky mobile CTA */}
        {isLive && showSticky && (
          <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between gap-3 px-4 py-3 bg-white border-t md:hidden border-primary/25 shadow-[0_-4px_16px_-8px_rgba(0,0,0,0.25)]">
            <div className="leading-tight">
              <p className="text-[11px] text-stone-500">Krishna Kripa Combo</p>
              <p className="text-lg font-bold text-stone-900">₹{OFFER_PRICES.combo.ashtami}</p>
            </div>
            <Button
              onClick={() => buy(OFFERS.find((o) => o.slug === "combo")!)}
              className="font-bold rounded-full px-7 py-5"
            >
              Pay Now
            </Button>
          </div>
        )}

        <Footer />
      </div>
    </>
  );
};

export default JanmashtamiOffer;
