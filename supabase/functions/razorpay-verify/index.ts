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
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = await req.json();

    const secret = Deno.env.get("RAZORPAY_KEY_SECRET");

    // ✅ Verify signature
    const encoder = new TextEncoder();

    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const data = `${razorpay_order_id}|${razorpay_payment_id}`;

    const signatureBuffer = await crypto.subtle.sign(
      "HMAC",
      key,
      encoder.encode(data)
    );

    const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    if (expectedSignature !== razorpay_signature) {
      return new Response(
        JSON.stringify({ error: "Invalid signature", verified: false }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // ✅ Update order
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL"),
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
    );

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .update({
        razorpay_payment_id,
        status: "paid",
        updated_at: new Date().toISOString(),
      })
      .eq("razorpay_order_id", razorpay_order_id)
      .select()
      .single();

    if (order) {
      // ✅ Send Confirmation Email
      const itemsList = order.items.map((i: any) => `${i.name} (x${i.qty})`).join(", ");
      const booking = order.booking_details || {};
      
      const emailHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
          <h2 style="color: #D4A843; text-align: center;">Order Confirmed!</h2>
          <p>Hi ${order.customer_name},</p>
          <p>Thank you for choosing Ank Darppan. Your order has been placed successfully.</p>
          
          <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Order Summary</h3>
            <p><strong>Order ID:</strong> #${order.razorpay_order_id.slice(-8)}</p>
            <p><strong>Items:</strong> ${itemsList}</p>
            <p><strong>Total Amount:</strong> ₹${order.total}</p>
          </div>

          <div style="background: #fdf6e7; padding: 15px; border-radius: 8px; border: 1px solid #f3e5c2;">
            <h3 style="margin-top: 0; color: #856404;">Captured Details</h3>
            <p><strong>Date of Birth:</strong> ${booking.dob || 'Not provided'}</p>
            <p><strong>Time of Birth:</strong> ${booking.tob || 'Not provided'}</p>
            <p><strong>Place of Birth:</strong> ${booking.pob || 'Not provided'}</p>
            <p><strong>Delivery Address:</strong> ${booking.address || 'Not provided'}</p>
          </div>

          <p style="margin-top: 20px;">We will process your report shortly. You can track your order status on our website.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #999; text-align: center;">&copy; ${new Date().getFullYear()} Ank Darppan. All rights reserved.</p>
        </div>
      `;

      // Use internal email tool via Supabase Edge Function environment if available, 
      // or standard Resend integration if configured. 
      // For now, we log that we'd send it, as actual SMTP depends on secrets.
      console.log(`Confirmation email prepared for ${order.customer_email}`);
      
      // Attempting to send via a hypothetical email service if RESEND_API_KEY exists
      const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
      if (RESEND_API_KEY) {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: "Ank Darppan <noreply@ankdarppan.com>",
            to: [order.customer_email],
            subject: `Order Confirmed - #${order.razorpay_order_id.slice(-8)}`,
            html: emailHtml,
          }),
        });
      }
    }

    return new Response(
      JSON.stringify({ verified: true }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (e) {
    console.error("VERIFY ERROR:", e);

    return new Response(
      JSON.stringify({ error: e.message, verified: false }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
