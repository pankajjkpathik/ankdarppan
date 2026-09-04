import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

// Server-side coupon validation so the coupons table is never publicly readable.
// Returns only the fields needed to compute a discount — never usage internals.
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { code } = await req.json();

    if (!code || typeof code !== "string" || code.trim().length === 0 || code.length > 50) {
      return json({ valid: false, reason: "Invalid coupon code" });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data, error } = await supabase
      .from("coupons")
      .select("code, discount_type, discount_value, max_discount, min_order_amount, expires_at, usage_limit, times_used")
      .eq("code", code.trim().toUpperCase())
      .eq("is_active", true)
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      return json({ valid: false, reason: "This code doesn't exist or is no longer active" });
    }
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      return json({ valid: false, reason: "This coupon has expired" });
    }
    if (data.usage_limit != null && data.times_used >= data.usage_limit) {
      return json({ valid: false, reason: "This coupon has reached its usage limit" });
    }

    return json({
      valid: true,
      coupon: {
        code: data.code,
        discount_type: data.discount_type,
        discount_value: data.discount_value,
        max_discount: data.max_discount,
        min_order_amount: data.min_order_amount,
      },
    });
  } catch (e) {
    console.error("VALIDATE COUPON ERROR:", e);
    return json({ valid: false, reason: "Could not validate coupon" }, 500);
  }
});
