import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/contexts/CartContext";
import { Minus, Plus, Trash2, ShoppingCart, Loader2, CreditCard } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const CartDrawer = () => {
  const { items, isOpen, setIsOpen, removeItem, updateQty, total, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

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
      toast({ title: "Please enter your name and phone number", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error("Failed to load Razorpay");

      const { data, error } = await supabase.functions.invoke("razorpay-order", {
        body: {
          items: items.map((i) => ({ name: i.name, qty: i.qty, price: i.priceNum })),
          total,
          customer_name: customerName,
          customer_phone: customerPhone,
          customer_email: customerEmail,
        },
      });

      if (error) throw error;

      const options = {
        key: data.key_id,
        amount: total * 100,
        currency: "INR",
        name: "Ank Darppan",
        description: `Order of ${items.length} item(s)`,
        order_id: data.order_id,
        handler: async (response: any) => {
          // Verify payment
          const { data: verifyData, error: verifyError } = await supabase.functions.invoke(
            "razorpay-verify",
            {
              body: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
            }
          );

          if (verifyError || !verifyData?.verified) {
            toast({ title: "Payment verification failed", variant: "destructive" });
            return;
          }

          toast({ title: "Payment Successful! 🎉", description: "Your order has been placed." });
          clearCart();
          setIsOpen(false);
          setCustomerName("");
          setCustomerPhone("");
          setCustomerEmail("");
        },
        prefill: {
          name: customerName,
          contact: customerPhone,
          email: customerEmail,
        },
        theme: { color: "#D4A843" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (e: any) {
      console.error(e);
      toast({ title: "Checkout failed", description: e.message, variant: "destructive" });
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
                      <button onClick={() => updateQty(item.name, item.qty - 1)} className="w-6 h-6 rounded bg-secondary flex items-center justify-center text-foreground hover:bg-primary/20">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm text-foreground w-5 text-center">{item.qty}</span>
                      <button onClick={() => updateQty(item.name, item.qty + 1)} className="w-6 h-6 rounded bg-secondary flex items-center justify-center text-foreground hover:bg-primary/20">
                        <Plus className="w-3 h-3" />
                      </button>
                      <button onClick={() => removeItem(item.name)} className="ml-auto text-destructive hover:text-destructive/80">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Customer details */}
              <div className="space-y-3 pt-2">
                <h4 className="text-sm font-heading font-semibold text-foreground">Your Details</h4>
                <div className="space-y-1.5">
                  <Label htmlFor="cart-name" className="text-xs">Name *</Label>
                  <Input id="cart-name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Your name" className="h-8 text-sm bg-secondary/50 border-border" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="cart-phone" className="text-xs">Phone *</Label>
                  <Input id="cart-phone" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="+91 XXXXX XXXXX" className="h-8 text-sm bg-secondary/50 border-border" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="cart-email" className="text-xs">Email</Label>
                  <Input id="cart-email" type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} placeholder="your@email.com" className="h-8 text-sm bg-secondary/50 border-border" />
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-4 mt-4 space-y-3">
              <div className="flex justify-between text-foreground font-heading font-bold text-lg">
                <span>Total</span>
                <span className="text-primary">₹{total.toLocaleString("en-IN")}</span>
              </div>
              <Button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-primary text-primary-foreground font-semibold"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CreditCard className="w-4 h-4 mr-2" />}
                {loading ? "Processing..." : "Pay with Razorpay"}
              </Button>
              <Button variant="outline" className="w-full" onClick={clearCart}>
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
