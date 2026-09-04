// Cover + first pages of the actual sample reports. Remaining pages stay locked.
import lc from "@/assets/samples/loshu-cover.jpg.asset.json";
import l1 from "@/assets/samples/loshu-01.jpg.asset.json";
import l2 from "@/assets/samples/loshu-02.jpg.asset.json";
import l3 from "@/assets/samples/loshu-03.jpg.asset.json";
import l4 from "@/assets/samples/loshu-04.jpg.asset.json";
import l5 from "@/assets/samples/loshu-05.jpg.asset.json";
import l6 from "@/assets/samples/loshu-06.jpg.asset.json";
import l7 from "@/assets/samples/loshu-07.jpg.asset.json";
import l8 from "@/assets/samples/loshu-08.jpg.asset.json";
import l9 from "@/assets/samples/loshu-09.jpg.asset.json";

import mc from "@/assets/samples/mobile-cover.jpg.asset.json";
import m1 from "@/assets/samples/mobile-01.jpg.asset.json";
import m2 from "@/assets/samples/mobile-02.jpg.asset.json";
import m3 from "@/assets/samples/mobile-03.jpg.asset.json";
import m4 from "@/assets/samples/mobile-04.jpg.asset.json";
import m5 from "@/assets/samples/mobile-05.jpg.asset.json";
import m6 from "@/assets/samples/mobile-06.jpg.asset.json";
import m7 from "@/assets/samples/mobile-07.jpg.asset.json";
import m8 from "@/assets/samples/mobile-08.jpg.asset.json";
import m9 from "@/assets/samples/mobile-09.jpg.asset.json";

/**
 * Always use the published Lovable origin for CDN assets. Relative /__l5e URLs
 * are not handled by localhost or external hosts and return the app HTML.
 */
const CDN_ORIGIN = "https://ankdarppan.lovable.app";

const assetUrl = (url: string): string => {
  if (/^https?:\/\//.test(url)) return url;
  return `${CDN_ORIGIN}${url.startsWith("/") ? url : `/${url}`}`;
};

export const loshuSamplePages: string[] = [lc, l1, l2, l3, l4, l5, l6, l7, l8, l9].map((a) =>
  assetUrl(a.url)
);
export const mobileSamplePages: string[] = [mc, m1, m2, m3, m4, m5, m6, m7, m8, m9].map((a) =>
  assetUrl(a.url)
);

/** Total page count of the full report (only the first 10 are shown publicly) */
export const LOSHU_TOTAL_PAGES = 45;
export const MOBILE_TOTAL_PAGES = 37;
