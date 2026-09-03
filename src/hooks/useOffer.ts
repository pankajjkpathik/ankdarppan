import { useEffect, useState } from "react";
import { formatCountdown, msUntilOfferEnd, nowIST, offerPhase } from "@/config/offer";

export const useOffer = () => {
  const [now, setNow] = useState(() => nowIST());

  useEffect(() => {
    const id = setInterval(() => setNow(nowIST()), 1000);
    return () => clearInterval(id);
  }, []);

  const phase = offerPhase(now);
  return {
    now,
    phase,
    isLive: phase === "live",
    countdown: formatCountdown(msUntilOfferEnd(now)),
  };
};
