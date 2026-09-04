// Single source of truth for the Krishna Janmashtami offer.
// Window: 4 Sep 2026 11:59 PM IST -> 6 Sep 2026 11:59 PM IST

export const OFFER_START = new Date("2026-09-04T23:59:00+05:30");
export const OFFER_END = new Date("2026-09-06T23:59:00+05:30");

export type OfferSlug = "mobile" | "loshu" | "combo";

export const OFFER_PRICES: Record<OfferSlug, { regular: number; ashtami: number; off: number }> = {
  mobile: { regular: 581, ashtami: 388, off: 33 },
  loshu: { regular: 941, ashtami: 618, off: 34 },
  combo: { regular: 1522, ashtami: 888, off: 42 },
};

// Allows manual testing of before/during/after states: ?offerTime=2026-09-05T13:00:00%2B05:30
const overrideNow = (): Date | null => {
  if (typeof window === "undefined") return null;
  const v = new URLSearchParams(window.location.search).get("offerTime");
  if (!v) return null;
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
};

export const nowIST = (): Date => overrideNow() ?? new Date();

export const offerPhase = (now: Date = nowIST()): "before" | "live" | "after" => {
  if (now < OFFER_START) return "before";
  if (now > OFFER_END) return "after";
  return "live";
};

export const isOfferLive = (now: Date = nowIST()) => offerPhase(now) === "live";

export const msUntilOfferEnd = (now: Date = nowIST()) => OFFER_END.getTime() - now.getTime();

export const formatCountdown = (ms: number) => {
  if (ms <= 0) return "00h 00m 00s";
  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(h)}h ${p(m)}m ${p(s)}s`;
};
