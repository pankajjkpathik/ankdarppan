import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Search, Loader2, Package, CheckCircle, Clock, XCircle } from "lucide-react";

const statusConfig: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  paid: { icon: CheckCircle, color: "text-green-500", label: "Payment Successful" },
  pending: { icon: Clock, color: "text-yellow-500", label: "Pending" },
  failed: { icon: XCircle, color: "text-destructive", label: "Failed" },
};

const OrderTracking = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setOrder(null);
    setNotFound(false);

    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .or(`razorpay_order_id.eq.${query.trim()},razorpay_payment_id.eq.${query.trim()}`)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        setNotFound(true);
      } else {
        setOrder(data);
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const status = order ? statusConfig[order.status] || statusConfig.pending : null;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-xl">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        <div className="text-center mb-8">
          <Package className="w-12 h-12 text-primary mx-auto mb-3" />
          <h1 className="text-3xl font-heading font-bold">
            Track Your <span className="gold-text">Order</span>
          </h1>
          <p className="text-muted-foreground mt-2">Enter your Razorpay Order ID or Payment ID to check status.</p>
        </div>

        <form onSubmit={handleSearch} className="glass-card p-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="order-id">Order ID or Payment ID</Label>
            <Input id="order-id" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="order_xxxxx or pay_xxxxx" className="bg-secondary/50 border-border" required />
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground font-semibold">
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Search className="w-4 h-4 mr-2" />}
            {loading ? "Searching..." : "Track Order"}
          </Button>
        </form>

        {notFound && (
          <div className="glass-card p-6 mt-6 text-center text-muted-foreground">
            No order found with that ID. Please check and try again.
          </div>
        )}

        {order && status && (
          <div className="glass-card p-6 mt-6 space-y-4">
            <div className="flex items-center gap-3">
              <status.icon className={`w-8 h-8 ${status.color}`} />
              <div>
                <h3 className="font-heading font-bold text-foreground text-lg">{status.label}</h3>
                <p className="text-xs text-muted-foreground">
                  {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>

            <div className="border-t border-border pt-4 space-y-2 text-sm">
              {order.customer_name && <div className="flex justify-between"><span className="text-muted-foreground">Name</span><span className="text-foreground">{order.customer_name}</span></div>}
              {order.razorpay_order_id && <div className="flex justify-between"><span className="text-muted-foreground">Order ID</span><span className="text-foreground font-mono text-xs">{order.razorpay_order_id}</span></div>}
              {order.razorpay_payment_id && <div className="flex justify-between"><span className="text-muted-foreground">Payment ID</span><span className="text-foreground font-mono text-xs">{order.razorpay_payment_id}</span></div>}
              <div className="flex justify-between"><span className="text-muted-foreground">Total</span><span className="text-primary font-bold">₹{order.total.toLocaleString("en-IN")}</span></div>
            </div>

            {Array.isArray(order.items) && order.items.length > 0 && (
              <div className="border-t border-border pt-4">
                <h4 className="text-sm font-semibold text-foreground mb-2">Items</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {(order.items as any[]).map((item: any, i: number) => (
                    <li key={i} className="flex justify-between">
                      <span>{item.name} × {item.qty}</span>
                      <span>₹{(item.price * item.qty).toLocaleString("en-IN")}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;
