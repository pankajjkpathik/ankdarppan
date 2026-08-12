import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "@/hooks/use-toast";
import { Loader2, Package, Eye, X, Download, FileSpreadsheet, FileText as FilePdf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import jsPDF from "jspdf";
import "jspdf-autotable";

declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

const statusColors: Record<string, string> = {
  created: "bg-slate-500/20 text-slate-400 border border-slate-500/30",
  pending: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
  paid: "bg-green-500/20 text-green-400 border border-green-500/30",
  shipped: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
  delivered: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
  cancelled: "bg-destructive/20 text-destructive border border-destructive/30",
  captured: "bg-green-500/20 text-green-400 border border-green-500/30",
  failed: "bg-destructive/20 text-destructive border border-destructive/30",
};

const AdminOrdersTab = () => {
  const queryClient = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const { data: orders, isLoading, error } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      console.log("Fetching admin orders...");
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          profiles:user_id (*)
        `)
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error("Supabase error fetching orders:", error);
        throw error;
      }
      console.log("Fetched orders:", data?.length);
      return data;
    },
  });

  const updateStatus = async (orderId: string, status: string) => {
    try {
      const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
      if (error) {
        toast({ title: "Error updating status", description: error.message, variant: "destructive" });
        return;
      }
      toast({ title: `Order marked as ${status}` });
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const updateReportStatus = async (orderId: string, reportStatus: string) => {
    try {
      // We use booking_details JSON to store report delivery status
      const { data: order } = await supabase.from("orders").select("booking_details").eq("id", orderId).single();
      const updatedDetails = {
        ...(order?.booking_details || {}),
        report_delivery_status: reportStatus,
        report_delivery_updated_at: new Date().toISOString()
      };

      const { error } = await supabase.from("orders").update({ 
        booking_details: updatedDetails 
      }).eq("id", orderId);

      if (error) {
        toast({ title: "Error updating report status", description: error.message, variant: "destructive" });
        return;
      }
      toast({ title: `Report marked as ${reportStatus}` });
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const exportToCSV = () => {
    if (!orders?.length) return;
    
    const headers = ["Order ID", "Date", "Customer Name", "Email", "Phone", "Status", "Total", "Items"];
    const rows = orders.map(order => [
      order.id.slice(0, 8),
      format(new Date(order.created_at), "yyyy-MM-dd HH:mm"),
      order.profiles?.full_name || order.customer_name || "Guest",
      order.profiles?.email || order.customer_email || "-",
      order.profiles?.phone || order.customer_phone || "-",
      order.status,
      order.total,
      (Array.isArray(order.items) ? order.items : []).map((i: any) => `${i.name} (${i.qty})`).join("; ")
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `orders_${format(new Date(), "yyyy-MM-dd")}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "CSV Export Started", description: "Your order list is being downloaded." });
  };

  const exportToPDF = () => {
    if (!orders?.length) return;

    const doc = new jsPDF();
    doc.text("Ank Darppan - Order List", 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated on: ${format(new Date(), "dd MMM yyyy, hh:mm a")}`, 14, 22);

    const tableColumn = ["ID", "Customer", "Date", "Status", "Total"];
    const tableRows = orders.map(order => [
      order.id.slice(0, 8),
      order.profiles?.full_name || order.customer_name || "Guest",
      format(new Date(order.created_at), "dd MMM yy"),
      order.status.toUpperCase(),
      `INR ${order.total}`
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      theme: 'grid',
      headStyles: { fillColor: [212, 168, 67] }, // primary gold
      styles: { fontSize: 8 }
    });

    doc.save(`orders_${format(new Date(), "yyyy-MM-dd")}.pdf`);
    toast({ title: "PDF Export Started", description: "Your order list is being downloaded." });
  };

  if (error) {
    return (
      <div className="glass-card p-8 text-center border-destructive/20">
        <X className="w-12 h-12 text-destructive mx-auto mb-4 opacity-50" />
        <p className="text-destructive font-medium">Error loading orders</p>
        <p className="text-sm text-muted-foreground mt-1">{(error as any).message}</p>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-4"
          onClick={() => queryClient.invalidateQueries({ queryKey: ["admin-orders"] })}
        >
          Retry
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-heading font-semibold text-lg text-white">All Orders ({orders?.length || 0})</h2>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 bg-white/5 border-white/10 hover:bg-white/10 transition-all">
              <Download className="w-4 h-4" /> Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[#0f172a] border-white/10">
            <DropdownMenuItem onClick={exportToCSV} className="gap-2 cursor-pointer hover:bg-white/5 text-white focus:bg-white/10">
              <FileSpreadsheet className="w-4 h-4 text-emerald-500" /> Export as CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={exportToPDF} className="gap-2 cursor-pointer hover:bg-white/5 text-white focus:bg-white/10">
              <FilePdf className="w-4 h-4 text-red-500" /> Export as PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {!orders?.length ? (
        <div className="glass-card p-12 text-center">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
          <p className="text-muted-foreground text-lg">No orders yet.</p>
          <p className="text-sm text-muted-foreground/60 mt-1">When customers place orders, they will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const items = Array.isArray(order.items) ? order.items : [];
            return (
              <div key={order.id} className="glass-card p-5 border-white/5 hover:border-white/10 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-2">
                      <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 bg-white/5 rounded text-muted-foreground">
                        #{order.id.slice(0, 8)}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider ${statusColors[order.status] || statusColors.pending}`}>
                        {order.status}
                      </span>
                      {order.booking_details?.report_delivery_status && (
                        <span className={cn(
                          "px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider",
                          order.booking_details.report_delivery_status === "Sent" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" :
                          order.booking_details.report_delivery_status === "Failed" ? "bg-red-500/20 text-red-400 border border-red-500/30" :
                          "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                        )}>
                          Report: {order.booking_details.report_delivery_status}
                        </span>
                      )}
                    </div>
                    <p className="text-base text-white font-medium">
                      {order.profiles?.full_name || order.customer_name || "Guest User"}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                      <span className="text-primary font-semibold">₹{order.total}</span>
                      <span>•</span>
                      <span title={order.created_at}>{format(new Date(order.created_at), "dd MMM yyyy, hh:mm a")}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col gap-1">
                      <Label className="text-[10px] text-muted-foreground uppercase px-1">Order Status</Label>
                      <Select value={order.status} onValueChange={(val) => updateStatus(order.id, val)}>
                        <SelectTrigger className="w-32 h-8 text-xs bg-secondary/50 border-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="created">Order Initiated</SelectItem>
                          <SelectItem value="captured">Payment Captured</SelectItem>
                          <SelectItem value="pending">Pending Review</SelectItem>
                          <SelectItem value="paid">Payment Received</SelectItem>
                          <SelectItem value="shipped">Order Shipped</SelectItem>
                          <SelectItem value="delivered">Order Fulfilled</SelectItem>
                          <SelectItem value="cancelled">Order Cancelled</SelectItem>
                          <SelectItem value="failed">Payment Failed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      <Label className="text-[10px] text-muted-foreground uppercase px-1">Report Status</Label>
                      <Select 
                        value={order.booking_details?.report_delivery_status || "Pending"} 
                        onValueChange={(val) => updateReportStatus(order.id, val)}
                      >
                        <SelectTrigger className="w-32 h-8 text-xs bg-secondary/50 border-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Sent">Sent</SelectItem>
                          <SelectItem value="Failed">Failed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button size="icon" variant="ghost" className="mt-4" onClick={() => setSelectedOrder(order)}>
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
                <div><span className="text-muted-foreground">Name:</span> {selectedOrder.profiles?.full_name || selectedOrder.customer_name || "-"}</div>
                <div><span className="text-muted-foreground">Phone:</span> {selectedOrder.profiles?.phone || selectedOrder.customer_phone || "-"}</div>
                <div className="col-span-2"><span className="text-muted-foreground">Email:</span> {selectedOrder.profiles?.email || selectedOrder.customer_email || "-"}</div>
                <div><span className="text-muted-foreground">Total:</span> ₹{selectedOrder.total}</div>
                <div><span className="text-muted-foreground">Date:</span> {format(new Date(selectedOrder.created_at), "dd MMM yyyy, hh:mm a")}</div>
                {selectedOrder.coupon_code && (
                  <div className="col-span-2 text-primary font-medium">
                    Coupon: {selectedOrder.coupon_code} (-₹{selectedOrder.discount})
                  </div>
                )}
                {selectedOrder.shipping_cost > 0 && (
                  <div className="col-span-2 text-muted-foreground">
                    Shipping: ₹{selectedOrder.shipping_cost} ({selectedOrder.shipping_type})
                  </div>
                )}
              </div>
              {selectedOrder.booking_details && (
                <div className="space-y-2 p-3 bg-secondary/30 rounded-lg">
                  <h4 className="font-heading text-xs uppercase tracking-wider text-primary">Consultation Details</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {selectedOrder.booking_details.dob && <div><span className="text-muted-foreground">DOB:</span> {selectedOrder.booking_details.dob}</div>}
                    {selectedOrder.booking_details.tob && <div><span className="text-muted-foreground">TOB:</span> {selectedOrder.booking_details.tob}</div>}
                    {selectedOrder.booking_details.pob && <div className="col-span-2"><span className="text-muted-foreground">POB:</span> {selectedOrder.booking_details.pob}</div>}
                    {selectedOrder.booking_details.address && <div className="col-span-2"><span className="text-muted-foreground">Address:</span> {selectedOrder.booking_details.address}</div>}
                    {selectedOrder.booking_details.notes && <div className="col-span-2 italic mt-1">"{selectedOrder.booking_details.notes}"</div>}
                  </div>
                </div>
              )}
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
