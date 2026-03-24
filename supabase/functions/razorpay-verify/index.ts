import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    const secret = Deno.env.get("RAZORPAY_KEY_SECRET")!;

    // Verify signature using HMAC SHA256
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const data = `${razorpay_order_id}|${razorpay_payment_id}`;
    const signatureBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
    const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    if (expectedSignature !== razorpay_signature) {
      return new Response(JSON.stringify({ error: "Invalid signature", verified: false }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Update order status
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    await supabase
      .from("orders")
      .update({ razorpay_payment_id, status: "paid" })
      .eq("razorpay_order_id", razorpay_order_id);

    return new Response(
      JSON.stringify({ verified: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: e.message, verified: false }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
