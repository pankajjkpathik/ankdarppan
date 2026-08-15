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
        .select("id, title, price, old_price")
        .eq("is_active", true);
      if (error) throw error;
      const needles = matchTitles.map((t) => t.toLowerCase());
      return (
        data?.find((s) =>
          needles.some((n) => s.title.toLowerCase().includes(n))
        ) || null
      );
    },
    staleTime: 60_000,
  });

  return {
    price: data?.price ?? fallbackPrice,
    oldPrice: data?.old_price ? Number(data.old_price) : fallbackOldPrice,
    isLoading,
  };
};
