// First 10 pages of the actual sample reports. Remaining pages stay locked.
import l1 from "@/assets/samples/loshu-01.jpg.asset.json";
import l2 from "@/assets/samples/loshu-02.jpg.asset.json";
import l3 from "@/assets/samples/loshu-03.jpg.asset.json";
import l4 from "@/assets/samples/loshu-04.jpg.asset.json";
import l5 from "@/assets/samples/loshu-05.jpg.asset.json";
import l6 from "@/assets/samples/loshu-06.jpg.asset.json";
import l7 from "@/assets/samples/loshu-07.jpg.asset.json";
import l8 from "@/assets/samples/loshu-08.jpg.asset.json";
import l9 from "@/assets/samples/loshu-09.jpg.asset.json";
import l10 from "@/assets/samples/loshu-10.jpg.asset.json";

import m1 from "@/assets/samples/mobile-01.jpg.asset.json";
import m2 from "@/assets/samples/mobile-02.jpg.asset.json";
import m3 from "@/assets/samples/mobile-03.jpg.asset.json";
import m4 from "@/assets/samples/mobile-04.jpg.asset.json";
import m5 from "@/assets/samples/mobile-05.jpg.asset.json";
import m6 from "@/assets/samples/mobile-06.jpg.asset.json";
import m7 from "@/assets/samples/mobile-07.jpg.asset.json";
import m8 from "@/assets/samples/mobile-08.jpg.asset.json";
import m9 from "@/assets/samples/mobile-09.jpg.asset.json";
import m10 from "@/assets/samples/mobile-10.jpg.asset.json";

export const loshuSamplePages: string[] = [l1, l2, l3, l4, l5, l6, l7, l8, l9, l10].map((a) => a.url);
export const mobileSamplePages: string[] = [m1, m2, m3, m4, m5, m6, m7, m8, m9, m10].map((a) => a.url);

/** Total page count of the full report (only the first 10 are shown publicly) */
export const LOSHU_TOTAL_PAGES = 45;
export const MOBILE_TOTAL_PAGES = 37;
