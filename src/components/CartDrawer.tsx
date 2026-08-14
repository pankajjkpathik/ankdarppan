/* Standardized Date Formats & Visual Visibility Edits applied */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart } from "@/contexts/CartContext";
import { Minus, Plus, Trash2, ShoppingCart, Loader2, CreditCard, Truck, Ticket } from "lucide-react";
import { cn } from "@/lib/utils";
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
  const [dob, setDob] = useState("");
  const [tob, setTob] = useState("");
  const [pob, setPob] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [prefilled, setPrefilled] = useState(false);
  const [shippingCountry, setShippingCountry] = useState("India");
  const [shippingType, setShippingType] = useState<"india" | "foreign">("india");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponLoading, setCouponLoading] = useState(false);

  // Partner Details for Marriage Compatibility
  const [partnerName, setPartnerName] = useState("");
  const [partnerDob, setPartnerDob] = useState("");
  const [partnerTob, setPartnerTob] = useState("");
  const [partnerPob, setPartnerPob] = useState("");

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

  const hasPhysicalProducts = items.length > 0 && items.some(i => {
    const name = i.name.toLowerCase();
    const isDigital = name.includes('report') || 
                      name.includes('consultation') || 
                      name.includes('grid') || 
                      name.includes('compatibility') ||
                      name.includes('question') ||
                      name.includes('numerology');
    return !isDigital;
  });

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
        setShippingAddress(profile.shipping_address_line1 || "");
        setDob((profile as any).dob || "");
        setTob((profile as any).tob || "");
        setPob((profile as any).pob || "");
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
    const isMarriageCompatibility = items.some(i => 
      (i.name.toLowerCase().includes('marriage') || i.name.toLowerCase().includes('compatibility')) && 
      !i.name.toLowerCase().includes('mobile')
    );


    const errors: string[] = [];
    if (!customerName.trim()) errors.push("Full Name");
    if (!customerPhone.trim()) errors.push("Phone Number");
    if (!dob) errors.push("Date of Birth");
    if (hasPhysicalProducts && !shippingAddress.trim()) errors.push("Shipping Address");

    if (isMarriageCompatibility) {
      if (!partnerName.trim()) errors.push("Partner's Name");
      if (!partnerDob) errors.push("Partner's Date of Birth");
    }

    if (errors.length > 0) {
      toast({ 
        title: "Missing Required Fields", 
        description: `Please provide: ${errors.join(", ")}`, 
        variant: "destructive" 
      });
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
          coupon_code: appliedCoupon?.code || null,
          discount,
          booking_details: {
            dob,
            tob,
            pob,
            address: shippingAddress,
            partner_details: isMarriageCompatibility ? {
              name: partnerName,
              dob: partnerDob,
              tob: partnerTob,
              pob: partnerPob,
            } : null,
          },
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
          // Redirect to order tracking to show confirmation summary
          navigate(`/order-tracking?id=${response.razorpay_order_id}&confirmed=true`);
          
          setCustomerName("");
          setCustomerPhone("");
          setCustomerEmail("");
          setDob("");
          setTob("");
          setPob("");
          setPartnerName("");
          setPartnerDob("");
          setPartnerTob("");
          setPartnerPob("");
          setShippingAddress("");
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
      <SheetContent className="bg-[#fdfbf7] text-[#1e1e24] border-stone-200 w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="font-heading text-[#b48a2d] text-xl flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-[#b48a2d]" /> Your Cart
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-[#1e1e24]/60">
            Your cart is empty
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto space-y-4 mt-4 pr-1">
              {items.map((item) => (
                <div key={item.name} className="flex gap-3 bg-white border border-[#b48a2d]/20 rounded-2xl p-3 shadow-sm">
                  <img src={item.img} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-[#1e1e24] truncate">{item.name}</h4>
                    <p className="text-[#b48a2d] font-bold text-sm">{item.price}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <button onClick={() => updateQty(item.name, item.qty - 1)} className="w-6 h-6 rounded bg-stone-100 flex items-center justify-center text-[#1e1e24]">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm w-5 text-center">{item.qty}</span>
                      <button onClick={() => updateQty(item.name, item.qty + 1)} className="w-6 h-6 rounded bg-stone-100 flex items-center justify-center text-[#1e1e24]">
                        <Plus className="w-3 h-3" />
                      </button>
                      <button onClick={() => removeItem(item.name)} className="ml-auto text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Customer & Birth Details */}
              <div className="space-y-3 pt-2">
                <h4 className="text-sm font-heading font-semibold text-stone-950">
                  {hasPhysicalProducts ? "Order Details" : "Numerology Report Details"}
                </h4>
                <div className="grid grid-cols-1 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-stone-900 font-semibold">Full Name *</Label>
                    <Input 
                      placeholder="e.g. John Doe" 
                      value={customerName} 
                      onChange={(e) => setCustomerName(e.target.value)} 
                      className={cn("bg-stone-50 border-stone-200 text-[#1e1e24] font-medium", !customerName && loading ? "border-destructive" : "")}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-stone-900 font-semibold">Phone Number *</Label>
                    <Input 
                      placeholder="e.g. +91 98765 43210" 
                      value={customerPhone} 
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className={cn("bg-stone-50 border-stone-200 text-[#1e1e24] font-medium", !customerPhone && loading ? "border-destructive" : "")}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-stone-900 font-semibold">Email Address</Label>
                    <Input 
                      placeholder="e.g. john@example.com" 
                      value={customerEmail} 
                      onChange={(e) => setCustomerEmail(e.target.value)} 
                      className="bg-stone-50 border-stone-200 text-[#1e1e24] font-medium"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                    <Label className="text-[10px] uppercase text-stone-900 font-bold">DOB (DD/MM/YYYY) *</Label>
                    <Input 
                      placeholder="DD/MM/YYYY"
                      value={dob} 
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, "");
                        if (value.length > 8) value = value.slice(0, 8);
                        if (value.length > 4) value = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4)}`;
                        else if (value.length > 2) value = `${value.slice(0, 2)}/${value.slice(2)}`;
                        setDob(value);
                      }} 
                      className={cn("text-xs bg-stone-50 border-stone-200 text-[#1e1e24] font-medium", !dob && loading ? "border-destructive" : "")} 
                    />
                  </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase text-stone-900 font-bold">Time of Birth</Label>
                      <Input placeholder="HH:MM AM/PM" value={tob} onChange={(e) => setTob(e.target.value)} className="text-xs bg-stone-50 border-stone-200 text-[#1e1e24] font-medium" />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <Label className="text-xs text-stone-900 font-semibold">Place of Birth</Label>
                    <Input placeholder="e.g. New Delhi, India" value={pob} onChange={(e) => setPob(e.target.value)} className="bg-stone-50 border-stone-200 text-[#1e1e24] font-medium" />
                  </div>
                  
                  {/* Address & Shipping only for products */}
                  {hasPhysicalProducts && (
                    <div className="space-y-1 animate-in fade-in slide-in-from-top-1 duration-200">
                      <Label className="text-xs text-stone-900 font-semibold">Shipping Address (for Products) *</Label>
                      <Textarea 
                        placeholder="House No, Street, Landmark, City, State, ZIP *" 
                        value={shippingAddress} 
                        onChange={(e) => setShippingAddress(e.target.value)} 
                        className={cn("min-h-[80px] text-xs bg-stone-50 border-stone-200 text-[#1e1e24] font-medium", !shippingAddress && loading ? "border-destructive" : "")}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Partner Details for Marriage Compatibility */}
              {items.some(i => i.name.toLowerCase().includes('marriage') || i.name.toLowerCase().includes('compatibility')) && (
                <div className="space-y-3 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <h4 className="text-sm font-heading font-semibold text-[#b48a2d]">Partner's Details (for Compatibility)</h4>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Partner's Full Name *</Label>
                      <Input 
                        placeholder="e.g. Jane Doe" 
                        value={partnerName} 
                        onChange={(e) => setPartnerName(e.target.value)} 
                        className={cn("bg-stone-50 border-stone-200 text-[#1e1e24]", !partnerName && loading ? "border-destructive" : "")}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label className="text-[10px] uppercase text-[#1e1e24]/60">Partner's DOB (DD/MM/YYYY) *</Label>
                        <Input 
                          placeholder="DD/MM/YYYY"
                          value={partnerDob} 
                          onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, "");
                            if (value.length > 8) value = value.slice(0, 8);
                            if (value.length > 4) value = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4)}`;
                            else if (value.length > 2) value = `${value.slice(0, 2)}/${value.slice(2)}`;
                            setPartnerDob(value);
                          }} 
                          className={cn("text-xs bg-stone-50 border-stone-200 text-[#1e1e24]", !partnerDob && loading ? "border-destructive" : "")} 
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] uppercase text-[#1e1e24]/60">Partner's TOB</Label>
                        <Input placeholder="HH:MM AM/PM" value={partnerTob} onChange={(e) => setPartnerTob(e.target.value)} className="text-xs bg-stone-50 border-stone-200 text-[#1e1e24]" />
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <Label className="text-xs">Partner's Place of Birth</Label>
                      <Input placeholder="e.g. Mumbai, India" value={partnerPob} onChange={(e) => setPartnerPob(e.target.value)} className="bg-stone-50 border-stone-200 text-[#1e1e24]" />
                    </div>
                  </div>
                </div>
              )}

              {/* Shipping */}
              {hasPhysicalProducts && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-sm font-heading font-semibold flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#b48a2d]" /> Shipping
                  </h4>
                  <RadioGroup
                    value={shippingType}
                    onValueChange={(v) => setShippingType(v as "india" | "foreign")}
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-2 bg-white border border-[#b48a2d]/20 p-3 rounded-lg shadow-sm">
                      <RadioGroupItem value="india" id="ship-india" />
                      <Label htmlFor="ship-india" className="flex-1 cursor-pointer">
                        <span className="text-sm font-medium text-[#1e1e24]">India</span>
                        <span className="text-xs text-[#1e1e24]/60 block">Free Shipping</span>
                      </Label>
                      <span className="text-green-600 font-bold text-sm">FREE</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-white border border-[#b48a2d]/20 p-3 rounded-lg shadow-sm">
                      <RadioGroupItem value="foreign" id="ship-foreign" />
                      <Label htmlFor="ship-foreign" className="flex-1 cursor-pointer">
                        <span className="text-sm font-medium text-[#1e1e24]">International</span>
                        <span className="text-xs text-[#1e1e24]/60 block">Shipping on actuals — we'll contact you</span>
                      </Label>
                      <span className="text-[#1e1e24]/60 text-xs font-medium">On Actual</span>
                    </div>
                  </RadioGroup>
                </div>
              )}
            </div>

            <div className="border-t border-stone-200 pt-4 mt-4 space-y-3">
              {/* Coupon */}
              <div className="space-y-2">
                <h4 className="text-sm font-heading font-semibold flex items-center gap-2">
                  <Ticket className="w-4 h-4 text-[#b48a2d]" /> Coupon Code
                </h4>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-white border border-[#b48a2d]/20 p-3 rounded-lg shadow-sm">
                    <div>
                      <p className="text-sm font-semibold text-[#b48a2d] tracking-wide">{appliedCoupon.code}</p>
                      <p className="text-xs text-[#1e1e24]/60">
                        {appliedCoupon.discount_type === "percent" ? `${appliedCoupon.discount_value}% off` : `₹${appliedCoupon.discount_value} off`}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={removeCoupon} className="text-[#1e1e24]/60 hover:text-destructive">Remove</Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="uppercase bg-stone-50 border-stone-200 text-[#1e1e24]"
                    />
                    <Button variant="outline" onClick={applyCoupon} disabled={couponLoading || !couponCode.trim()} className="border-[#b48a2d] text-[#b48a2d] hover:bg-[#b48a2d]/10">
                      {couponLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex justify-between text-sm text-[#1e1e24]/60">
                <span>Subtotal</span>
                <span>₹{total.toLocaleString("en-IN")}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-[#1e1e24]/60">Discount</span>
                  <span className="text-green-600 font-semibold">-₹{discount.toLocaleString("en-IN")}</span>
                </div>
              )}
              {hasPhysicalProducts && (
                <div className="flex justify-between text-sm text-[#1e1e24]/60">
                  <span>Shipping</span>
                  <span className={shippingType === "india" ? "text-green-600 font-semibold" : ""}>{shippingType === "india" ? "FREE" : "On Actual"}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg border-t border-stone-200 pt-2 text-[#1e1e24]">
                <span>Total</span>
                <span className="text-[#b48a2d]">
                  {hasPhysicalProducts && shippingType === "foreign" ? `₹${(Math.max(total - discount, 0)).toLocaleString("en-IN")} + Shipping` : `₹${grandTotal.toLocaleString("en-IN")}`}
                </span>
              </div>


              <Button onClick={handleCheckout} disabled={loading} className="w-full bg-[#b48a2d] text-white hover:bg-[#b48a2d]/90 py-6 rounded-xl font-heading text-lg shadow-[0_4px_12px_rgba(180,138,45,0.25)]">
                {loading ? <Loader2 className="animate-spin mr-2" /> : <CreditCard className="mr-2" />}
                {loading ? "Processing..." : "Pay with Razorpay"}
              </Button>

              <Button variant="ghost" onClick={clearCart} className="w-full text-[#1e1e24]/40 hover:text-destructive">
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
