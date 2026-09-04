import { useEffect, useState } from "react";
import { Lock, X, ChevronLeft, ChevronRight } from "lucide-react";

interface SampleReportPagesProps {
  pages: string[];
  totalPages: number;
  title?: string;
}

/**
 * Shows the first N pages of a sample report as a preview grid.
 * Remaining pages are represented by a locked card (not loaded / not visible).
 */
export const SampleReportPages = ({ pages, totalPages, title = "Sample Report Preview" }: SampleReportPagesProps) => {
  const [active, setActive] = useState<number | null>(null);
  const locked = Math.max(totalPages - pages.length, 0);

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
      if (e.key === "ArrowRight") setActive((i) => (i === null ? i : Math.min(i + 1, pages.length - 1)));
      if (e.key === "ArrowLeft") setActive((i) => (i === null ? i : Math.max(i - 1, 0)));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, pages.length]);

  return (
    <section className="py-10 md:py-16">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-4xl font-heading text-stone-900 mb-3">{title}</h2>
          <div className="w-20 h-1 bg-primary mx-auto opacity-50 mb-4" />
          <p className="text-sm md:text-base text-stone-600 max-w-xl mx-auto">
            Pehle {pages.length} pages yahan dekhein — poori {totalPages}-page report aapko order ke baad WhatsApp par PDF me milegi.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-5">
          {pages.map((src, i) => (
            <button
              key={src}
              onClick={() => setActive(i)}
              className="group relative rounded-xl overflow-hidden border border-primary/25 bg-white shadow-sm hover:shadow-lg transition-all"
              aria-label={`View sample page ${i + 1}`}
            >
              <img
                src={src}
                alt={`${title} page ${i + 1}`}
                loading="lazy"
                width={400}
                height={566}
                className="w-full aspect-[3/4] object-cover object-top group-hover:scale-[1.03] transition-transform duration-300"
              />
              <span className="absolute bottom-0 inset-x-0 bg-white/90 text-[10px] md:text-xs font-semibold text-stone-700 py-1 text-center">
                Page {i + 1}
              </span>
            </button>
          ))}

          {locked > 0 && (
            <div className="relative rounded-xl overflow-hidden border border-primary/30 bg-stone-100 aspect-[3/4] flex flex-col items-center justify-center text-center px-3">
              <Lock className="w-7 h-7 text-primary mb-2" aria-hidden="true" />
              <p className="text-sm font-bold text-stone-900">+{locked} more pages</p>
              <p className="text-[11px] text-stone-600 mt-1">Order ke baad unlock</p>
            </div>
          )}
        </div>
      </div>

      {active !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/85 flex items-center justify-center p-4"
          onClick={() => setActive(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            className="absolute top-4 right-4 text-white/90 hover:text-white"
            onClick={() => setActive(null)}
            aria-label="Close preview"
          >
            <X className="w-7 h-7" />
          </button>
          <button
            className="absolute left-2 md:left-6 text-white/80 hover:text-white disabled:opacity-30"
            onClick={(e) => { e.stopPropagation(); setActive(Math.max(active - 1, 0)); }}
            disabled={active === 0}
            aria-label="Previous page"
          >
            <ChevronLeft className="w-9 h-9" />
          </button>
          <img
            src={pages[active]}
            alt={`${title} page ${active + 1}`}
            className="max-h-[88vh] max-w-full rounded-lg shadow-2xl bg-white"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute right-2 md:right-6 text-white/80 hover:text-white disabled:opacity-30"
            onClick={(e) => { e.stopPropagation(); setActive(Math.min(active + 1, pages.length - 1)); }}
            disabled={active === pages.length - 1}
            aria-label="Next page"
          >
            <ChevronRight className="w-9 h-9" />
          </button>
          <span className="absolute bottom-5 text-white/80 text-sm">Page {active + 1} / {pages.length}</span>
        </div>
      )}
    </section>
  );
};

export default SampleReportPages;
