import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetches the live price of a service from the admin-managed `services` table.
 * Falls back to the provided defaults while loading or if no match is found,
 * so landing pages always stay in sync with the Admin Area pricing.
 */
export const useServicePrice = (
  matchTitles: string[],
  fallbackPrice: number,
  fallbackOldPrice?: number
) => {
  const { data, isLoading } = useQuery({
    queryKey: ["service-price", matchTitles.join("|")],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("id, title, price, old_price, coupon_codes")
        .eq("is_active", true);
      if (error) throw error;
      
      const needles = matchTitles.map((t) => t.toLowerCase());
      const service = data?.find((s) =>
        needles.some((n) => s.title.toLowerCase().includes(n))
      );

      if (!service) return null;

      // Validate associated coupon codes server-side (coupons table is not publicly readable)
      let coupons: any[] = [];
      if (service.coupon_codes && service.coupon_codes.length > 0) {
        const results = await Promise.all(
          service.coupon_codes.map((code: string) =>
            supabase.functions.invoke("validate-coupon", { body: { code } })
          )
        );
        coupons = results
          .map((r, i) =>
            r.data?.valid
              ? { id: r.data.coupon.code, ...r.data.coupon }
              : null
          )
          .filter(Boolean) as any[];
      }

      return { ...service, coupons };
    },
    staleTime: 60_000,
  });

  return {
    price: data?.price ?? fallbackPrice,
    oldPrice: data?.old_price ? Number(data.old_price) : fallbackOldPrice,
    coupons: data?.coupons || [],
    isLoading,
  };
};
