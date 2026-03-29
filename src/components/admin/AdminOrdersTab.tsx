import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Loader2, Package, Eye, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400",
  paid: "bg-green-500/20 text-green-400",
  shipped: "bg-blue-500/20 text-blue-400",
  delivered: "bg-emerald-500/20 text-emerald-400",
  cancelled: "bg-destructive/20 text-destructive",
};

const AdminOrdersTab = () => {
  const queryClient = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const { data: orders, isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const updateStatus = async (orderId: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
    if (error) {
      toast({ title: "Error updating status", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: `Order marked as ${status}` });
    queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
  };

  if (isLoading) {
    return <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }

  return (
    <div>
      <h2 className="font-heading font-semibold text-lg text-foreground mb-4">All Orders ({orders?.length || 0})</h2>

      {!orders?.length ? (
        <p className="text-muted-foreground text-center py-10">No orders yet.</p>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const items = Array.isArray(order.items) ? order.items : [];
            return (
              <div key={order.id} className="glass-card p-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs text-muted-foreground">#{order.id.slice(0, 8)}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status] || statusColors.pending}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-foreground mt-1 font-medium">{order.customer_name || "Guest"} · ₹{order.total}</p>
                    <p className="text-xs text-muted-foreground">{format(new Date(order.created_at), "dd MMM yyyy, hh:mm a")}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={order.status} onValueChange={(val) => updateStatus(order.id, val)}>
                      <SelectTrigger className="w-32 h-8 text-xs bg-secondary/50 border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button size="icon" variant="ghost" onClick={() => setSelectedOrder(order)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div><span className="text-muted-foreground">ID:</span> <span className="font-mono text-xs">{selectedOrder.id.slice(0, 8)}</span></div>
                <div><span className="text-muted-foreground">Status:</span> {selectedOrder.status}</div>
                <div><span className="text-muted-foreground">Name:</span> {selectedOrder.customer_name || "-"}</div>
                <div><span className="text-muted-foreground">Phone:</span> {selectedOrder.customer_phone || "-"}</div>
                <div className="col-span-2"><span className="text-muted-foreground">Email:</span> {selectedOrder.customer_email || "-"}</div>
                <div><span className="text-muted-foreground">Total:</span> ₹{selectedOrder.total}</div>
                <div><span className="text-muted-foreground">Date:</span> {format(new Date(selectedOrder.created_at), "dd MMM yyyy, hh:mm a")}</div>
              </div>
              {selectedOrder.razorpay_payment_id && (
                <div><span className="text-muted-foreground">Payment ID:</span> <span className="font-mono text-xs">{selectedOrder.razorpay_payment_id}</span></div>
              )}
              <div>
                <h4 className="font-medium mb-2">Items</h4>
                <div className="space-y-2">
                  {(Array.isArray(selectedOrder.items) ? selectedOrder.items : []).map((item: any, i: number) => (
                    <div key={i} className="flex justify-between bg-secondary/50 p-2 rounded">
                      <span>{item.name} × {item.qty}</span>
                      <span>₹{item.price * item.qty}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrdersTab;
