import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Copy, Sparkles, ShieldCheck, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/hooks/use-toast";
import { fbTrack } from "@/lib/fbpixel";

type Offer = {
  slug: string;
  name: string;
  regular: number;
  ashtami: number;
  off: number;
  includes: string[];
  highlight?: boolean;
};

const OFFERS: Offer[] = [
  {
    slug: "mobile",
    name: "Mobile Number Report (Janmashtami Offer)",
    regular: 581,
    ashtami: 388,
    off: 33,
    includes: [
      "Aapke mobile number ki full vibration analysis",
      "Number aapke Loshu Grid se match karta hai ya nahi",
      "Suggested corrections & lucky number combinations",
    ],
  },
  {
    slug: "loshu",
    name: "Loshu Grid Report (Janmashtami Offer)",
    regular: 941,
    ashtami: 618,
    off: 34,
    includes: [
      "Poore 8 planes of life ka detailed analysis",
      "Missing numbers aur unka असर + remedies",
      "Career, money, health aur relationship insights",
    ],
  },
  {
    slug: "combo",
    name: "Krishna Kripa Combo (Janmashtami Offer)",
    regular: 1522,
    ashtami: 888,
    off: 42,
    highlight: true,
    includes: [
      "Mobile Number Report + Loshu Grid Report — dono",
      "Combined guidance: number correction + remedies",
      "Priority delivery on WhatsApp",
    ],
  },
];

const JanmashtamiOffer = () => {
  const { addItem, setIsOpen } = useCart();
  const [params, setParams] = useSearchParams();

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
    const slug = params.get("buy");
    if (!slug) return;
    const offer = OFFERS.find((o) => o.slug === slug);
    if (offer) {
      buy(offer);
      params.delete("buy");
      setParams(params, { replace: true });
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

        <main>
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
                  Krishna Kripa Combo, 42% tak की छूट par.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Offer table */}
          <section className="py-10 md:py-16">
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
            </div>
          </section>

          {/* Offer cards */}
          <section className="pb-12 md:pb-20">
            <div className="container px-4 mx-auto">
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
                    <ul className="flex-1 mb-6 space-y-3">
                      {o.includes.map((t, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-stone-700">
                          <Check className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                    <Button onClick={() => buy(o)} size="lg" className="w-full font-bold rounded-full py-6">
                      Pay ₹{o.ashtami.toLocaleString("en-IN")} Now
                    </Button>
                    <button
                      onClick={() => copyLink(o.slug)}
                      className="inline-flex items-center justify-center gap-1.5 mt-3 text-xs font-semibold text-stone-500 hover:text-primary transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" /> Copy direct payment link
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-sm text-stone-600">
                <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-primary" /> Secure UPI / Card payment</span>
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-primary" /> PDF report on WhatsApp within 24 hours</span>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default JanmashtamiOffer;
