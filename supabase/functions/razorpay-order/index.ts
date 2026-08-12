import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  // ✅ Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const {
      items,
      total,
      customer_name,
      customer_phone,
      customer_email,
      user_id,
      shipping_cost,
      shipping_type,
      coupon_code,
      discount,
      booking_details
    } = await req.json();

    const RAZORPAY_KEY_ID = Deno.env.get("RAZORPAY_KEY_ID");
    const RAZORPAY_KEY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET");

    // ✅ Create Razorpay order
    const rpRes = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`),
      },
      body: JSON.stringify({
        amount: total * 100,
        currency: "INR",
        receipt: `order_${Date.now()}`,
      }),
    });

    if (!rpRes.ok) {
      const err = await rpRes.text();
      console.error("Razorpay error:", err);

      return new Response(
        JSON.stringify({ error: "Failed to create order" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const rpOrder = await rpRes.json();

    // ✅ Save in Supabase
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL"),
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
    );

    const { error: insertError } = await supabase.from("orders").insert({
      razorpay_order_id: rpOrder.id,
      total,
      items,
      customer_name,
      customer_phone,
      customer_email,
      user_id,
      shipping_cost,
      shipping_type,
      coupon_code,
      discount,
      booking_details,
      status: "created",
      created_at: new Date().toISOString(),
    });

    if (insertError) {
      console.error("Supabase insert error:", insertError);
      // We still return the order_id so the user can pay, but we should probably know why it failed
    }

    return new Response(
      JSON.stringify({
        order_id: rpOrder.id,
        key_id: RAZORPAY_KEY_ID,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (e) {
    console.error("ORDER ERROR:", e);

    return new Response(
      JSON.stringify({ error: e.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
