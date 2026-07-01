// Meta Pixel helper — the base pixel + PageView is loaded in index.html.
declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

export const fbTrack = (event: string, params?: Record<string, any>) => {
  try {
    if (typeof window !== "undefined" && typeof window.fbq === "function") {
      if (params) window.fbq("track", event, params);
      else window.fbq("track", event);
    }
  } catch (e) {
    // Never let pixel errors break the app
    console.warn("fbq track failed", e);
  }
};
