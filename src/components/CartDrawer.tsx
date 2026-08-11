import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart } from "@/contexts/CartContext";
import { Minus, Plus, Trash2, ShoppingCart, Loader2, CreditCard, Truck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { fbTrack } from "@/lib/fbpixel";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const SHIPPING_INDIA = 0;

const CartDrawer = () => {
  const { items, isOpen, setIsOpen, removeItem, updateQty, total, clearCart } = useCart();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [prefilled, setPrefilled] = useState(false);
  const [shippingCountry, setShippingCountry] = useState("India");
  const [shippingType, setShippingType] = useState<"india" | "foreign">("india");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponLoading, setCouponLoading] = useState(false);

  const shippingCost = shippingType === "india" ? SHIPPING_INDIA : 0; // foreign = on actual (entered manually or TBD)

  const computeDiscount = (coupon: any, subtotal: number) => {
    if (!coupon) return 0;
    let d = coupon.discount_type === "percent"
      ? Math.floor((subtotal * coupon.discount_value) / 100)
      : coupon.discount_value;
    if (coupon.max_discount) d = Math.min(d, coupon.max_discount);
    return Math.min(d, subtotal);
  };

  const discount = computeDiscount(appliedCoupon, total);
  const grandTotal = Math.max(total - discount, 0) + shippingCost;

  const applyCoupon = async () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) return;
    setCouponLoading(true);
    try {
      const { data, error } = await supabase
        .from("coupons")
        .select("*")
        .eq("code", code)
        .eq("is_active", true)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        toast({ title: "Invalid coupon", description: "This code doesn't exist or is no longer active", variant: "destructive" });
        return;
      }
      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        toast({ title: "Coupon expired", variant: "destructive" });
        return;
      }
      if (data.usage_limit != null && data.times_used >= data.usage_limit) {
        toast({ title: "Coupon limit reached", variant: "destructive" });
        return;
      }
      if (total < (data.min_order_amount || 0)) {
        toast({ title: "Minimum order not met", description: `This coupon needs a subtotal of ₹${data.min_order_amount}`, variant: "destructive" });
        return;
      }

      setAppliedCoupon(data);
      toast({ title: "Coupon applied 🎉", description: `You saved ₹${computeDiscount(data, total)}` });
    } catch (e: any) {
      toast({ title: "Could not apply coupon", description: e.message, variant: "destructive" });
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
  };


  // Auto-fill user details when cart opens
  useEffect(() => {
    if (!isOpen || prefilled) return;

    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      if (profile) {
        setCustomerName(profile.full_name || session.user.user_metadata?.full_name || "");
        setCustomerPhone(profile.phone || "");
        setCustomerEmail(profile.email || session.user.email || "");
        const country = (profile as any).shipping_country || "India";
        setShippingCountry(country);
        setShippingType(country.toLowerCase() === "india" ? "india" : "foreign");
        setPrefilled(true);
      } else {
        setCustomerName(session.user.user_metadata?.full_name || "");
        setCustomerEmail(session.user.email || "");
        setPrefilled(true);
      }
    };

    fetchProfile();
  }, [isOpen, prefilled]);

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCheckout = async () => {
    if (!customerName || !customerPhone) {
      toast({ title: "Missing Details", description: "Please enter your name and phone number", variant: "destructive" });
      return;
    }

    if (shippingType === "foreign") {
      toast({ title: "Foreign Shipping", description: "For international orders, shipping cost will be calculated and communicated separately. We will contact you.", variant: "default" });
    }

    setLoading(true);

    fbTrack("InitiateCheckout", {
      value: grandTotal,
      currency: "INR",
      num_items: items.reduce((s, i) => s + i.qty, 0),
      content_ids: items.map((i) => i.name),
    });

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setIsOpen(false);
        navigate("/auth", { state: { from: "/shop" } });
        toast({ title: "Login Required", description: "Please login or create an account to checkout" });
        setLoading(false);
        return;
      }

      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error("Failed to load Razorpay");

      const { data, error } = await supabase.functions.invoke("razorpay-order", {
        body: {
          items: items.map((i) => ({ name: i.name, qty: i.qty, price: i.priceNum })),
          total: grandTotal,
          customer_name: customerName,
          customer_phone: customerPhone,
          customer_email: customerEmail,
          user_id: user.id,
          shipping_cost: shippingCost,
          shipping_type: shippingType,
        },
      });

      if (error || !data) throw new Error(error?.message || "Failed to create order");

      const options = {
        key: data.key_id,
        amount: data.amount,
        currency: "INR",
        name: "Ank Darppan",
        description: `Order of ${items.length} item(s)`,
        order_id: data.order_id,
        handler: async (response: any) => {
          const { data: verifyData, error: verifyError } = await supabase.functions.invoke("razorpay-verify", {
            body: {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            },
          });

          if (verifyError || !verifyData?.verified) {
            toast({ title: "Payment verification failed", variant: "destructive" });
            return;
          }

          fbTrack("Purchase", {
            value: grandTotal,
            currency: "INR",
            content_ids: items.map((i) => i.name),
            num_items: items.reduce((s, i) => s + i.qty, 0),
            order_id: response.razorpay_order_id,
          });

          toast({ title: "Payment Successful 🎉", description: "Your order has been placed successfully!" });
          clearCart();
          setIsOpen(false);
          setCustomerName("");
          setCustomerPhone("");
          setCustomerEmail("");
        },
        prefill: { name: customerName, contact: customerPhone, email: customerEmail },
        theme: { color: "#D4A843" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (e: any) {
      console.error("CHECKOUT ERROR:", e);
      toast({ title: "Checkout failed", description: e.message || "Something went wrong", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="bg-card border-border w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="font-heading gold-text text-xl flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-primary" /> Your Cart
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Your cart is empty
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto space-y-4 mt-4 pr-1">
              {items.map((item) => (
                <div key={item.name} className="flex gap-3 glass-card p-3">
                  <img src={item.img} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-foreground truncate">{item.name}</h4>
                    <p className="text-primary font-bold text-sm">{item.price}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <button onClick={() => updateQty(item.name, item.qty - 1)} className="w-6 h-6 rounded bg-secondary flex items-center justify-center">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm w-5 text-center">{item.qty}</span>
                      <button onClick={() => updateQty(item.name, item.qty + 1)} className="w-6 h-6 rounded bg-secondary flex items-center justify-center">
                        <Plus className="w-3 h-3" />
                      </button>
                      <button onClick={() => removeItem(item.name)} className="ml-auto text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Customer Details */}
              <div className="space-y-3 pt-2">
                <h4 className="text-sm font-heading font-semibold">Your Details</h4>
                <Input placeholder="Name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
                <Input placeholder="Phone" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />
                <Input placeholder="Email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} />
              </div>

              {/* Shipping */}
              <div className="space-y-3 pt-2">
                <h4 className="text-sm font-heading font-semibold flex items-center gap-2">
                  <Truck className="w-4 h-4 text-primary" /> Shipping
                </h4>
                <RadioGroup
                  value={shippingType}
                  onValueChange={(v) => setShippingType(v as "india" | "foreign")}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2 glass-card p-3 rounded-lg">
                    <RadioGroupItem value="india" id="ship-india" />
                    <Label htmlFor="ship-india" className="flex-1 cursor-pointer">
                      <span className="text-sm font-medium">India</span>
                      <span className="text-xs text-muted-foreground block">Free Shipping</span>
                    </Label>
                    <span className="text-green-600 font-bold text-sm">FREE</span>
                  </div>
                  <div className="flex items-center space-x-2 glass-card p-3 rounded-lg">
                    <RadioGroupItem value="foreign" id="ship-foreign" />
                    <Label htmlFor="ship-foreign" className="flex-1 cursor-pointer">
                      <span className="text-sm font-medium">International</span>
                      <span className="text-xs text-muted-foreground block">Shipping on actuals — we'll contact you</span>
                    </Label>
                    <span className="text-muted-foreground text-xs font-medium">On Actual</span>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="border-t pt-4 mt-4 space-y-3">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Subtotal</span>
                <span>₹{total}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Shipping</span>
                <span className={shippingType === "india" ? "text-green-600 font-semibold" : ""}>{shippingType === "india" ? "FREE" : "On Actual"}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total</span>
                <span className="text-primary">
                  {shippingType === "india" ? `₹${grandTotal}` : `₹${total} + Shipping`}
                </span>
              </div>

              <Button onClick={handleCheckout} disabled={loading} className="w-full">
                {loading ? <Loader2 className="animate-spin mr-2" /> : <CreditCard className="mr-2" />}
                {loading ? "Processing..." : "Pay with Razorpay"}
              </Button>

              <Button variant="outline" onClick={clearCart}>
                Clear Cart
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
