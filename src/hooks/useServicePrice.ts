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

      // Fetch coupons if there are coupon codes associated
      let coupons = [];
      if (service.coupon_codes && service.coupon_codes.length > 0) {
        const { data: couponData } = await supabase
          .from("coupons")
          .select("*")
          .in("code", service.coupon_codes)
          .eq("is_active", true);
        coupons = couponData || [];
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
