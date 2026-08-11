import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Loader2, Ticket } from "lucide-react";

interface CouponForm {
  code: string;
  discount_type: "percent" | "flat";
  discount_value: string;
  min_order_amount: string;
  max_discount: string;
  expires_at: string;
  usage_limit: string;
  is_active: boolean;
}

const emptyForm: CouponForm = {
  code: "",
  discount_type: "percent",
  discount_value: "",
  min_order_amount: "0",
  max_discount: "",
  expires_at: "",
  usage_limit: "",
  is_active: true,
};

const AdminCouponsTab = () => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<CouponForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const { data: coupons, isLoading } = useQuery({
    queryKey: ["admin-coupons"],
    queryFn: async () => {
      const { data, error } = await supabase.from("coupons").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = form.code.trim().toUpperCase();
    const value = parseInt(form.discount_value);
    if (!code || !value || value <= 0) {
      toast({ title: "Code and a positive discount value are required", variant: "destructive" });
      return;
    }
    if (form.discount_type === "percent" && value > 100) {
      toast({ title: "Percentage discount cannot exceed 100", variant: "destructive" });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        code,
        discount_type: form.discount_type,
        discount_value: value,
        min_order_amount: parseInt(form.min_order_amount) || 0,
        max_discount: form.max_discount ? parseInt(form.max_discount) : null,
        expires_at: form.expires_at ? new Date(form.expires_at).toISOString() : null,
        usage_limit: form.usage_limit ? parseInt(form.usage_limit) : null,
        is_active: form.is_active,
      };

      if (editingId) {
        const { error } = await supabase.from("coupons").update(payload).eq("id", editingId);
        if (error) throw error;
        toast({ title: "Coupon updated!" });
      } else {
        const { error } = await supabase.from("coupons").insert(payload);
        if (error) throw error;
        toast({ title: "Coupon created!" });
      }

      setForm(emptyForm);
      setEditingId(null);
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (c: any) => {
    setEditingId(c.id);
    setForm({
      code: c.code,
      discount_type: c.discount_type === "flat" ? "flat" : "percent",
      discount_value: String(c.discount_value),
      min_order_amount: String(c.min_order_amount ?? 0),
      max_discount: c.max_discount != null ? String(c.max_discount) : "",
      expires_at: c.expires_at ? new Date(c.expires_at).toISOString().slice(0, 10) : "",
      usage_limit: c.usage_limit != null ? String(c.usage_limit) : "",
      is_active: c.is_active,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this coupon?")) return;
    const { error } = await supabase.from("coupons").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Coupon deleted" });
    queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4 mb-10">
        <h2 className="font-heading font-semibold text-lg text-foreground">
          {editingId ? "Edit Coupon" : "Create New Coupon"}
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Coupon Code *</Label>
            <Input name="code" value={form.code} onChange={handleChange} placeholder="ANK10" className="bg-secondary/50 border-border uppercase" required />
          </div>
          <div className="space-y-1.5">
            <Label>Discount Type</Label>
            <select name="discount_type" value={form.discount_type} onChange={handleChange} className="flex h-10 w-full rounded-md border border-border bg-secondary/50 px-3 py-2 text-sm text-foreground">
              <option value="percent">Percentage (%)</option>
              <option value="flat">Flat Amount (₹)</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <Label>Discount Value * {form.discount_type === "percent" ? "(%)" : "(₹)"}</Label>
            <Input name="discount_value" type="number" value={form.discount_value} onChange={handleChange} placeholder={form.discount_type === "percent" ? "10" : "200"} className="bg-secondary/50 border-border" required />
          </div>
          <div className="space-y-1.5">
            <Label>Minimum Order (₹)</Label>
            <Input name="min_order_amount" type="number" value={form.min_order_amount} onChange={handleChange} className="bg-secondary/50 border-border" />
          </div>
          {form.discount_type === "percent" && (
            <div className="space-y-1.5">
              <Label>Max Discount Cap (₹, optional)</Label>
              <Input name="max_discount" type="number" value={form.max_discount} onChange={handleChange} placeholder="500" className="bg-secondary/50 border-border" />
            </div>
          )}
          <div className="space-y-1.5">
            <Label>Expiry Date (optional)</Label>
            <Input name="expires_at" type="date" value={form.expires_at} onChange={handleChange} className="bg-secondary/50 border-border" />
          </div>
          <div className="space-y-1.5">
            <Label>Usage Limit (optional)</Label>
            <Input name="usage_limit" type="number" value={form.usage_limit} onChange={handleChange} placeholder="100" className="bg-secondary/50 border-border" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="cpn_active" checked={form.is_active} onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.checked }))} className="rounded border-border" />
          <Label htmlFor="cpn_active">Active (customers can use this code)</Label>
        </div>
        <div className="flex gap-3">
          <Button type="submit" disabled={saving} className="bg-primary text-primary-foreground">
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
            {editingId ? "Update Coupon" : "Add Coupon"}
          </Button>
          {editingId && (
            <Button type="button" variant="outline" onClick={() => { setEditingId(null); setForm(emptyForm); }}>Cancel</Button>
          )}
        </div>
      </form>

      <h2 className="font-heading font-semibold text-lg text-foreground mb-4">Existing Coupons</h2>
      {isLoading ? (
        <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : !coupons?.length ? (
        <p className="text-muted-foreground text-sm">No coupons yet.</p>
      ) : (
        <div className="space-y-3">
          {coupons.map((c: any) => (
            <div key={c.id} className="glass-card p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Ticket className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate tracking-wide">{c.code}</h3>
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="text-primary font-bold">
                    {c.discount_type === "percent" ? `${c.discount_value}% off` : `₹${c.discount_value} off`}
                  </span>
                  {c.min_order_amount > 0 && <span className="text-muted-foreground text-xs">Min ₹{c.min_order_amount}</span>}
                  {c.max_discount && <span className="text-muted-foreground text-xs">Cap ₹{c.max_discount}</span>}
                  {c.expires_at && <span className="text-muted-foreground text-xs">Till {new Date(c.expires_at).toLocaleDateString("en-IN")}</span>}
                  <span className="text-muted-foreground text-xs">Used {c.times_used}{c.usage_limit ? `/${c.usage_limit}` : ""}</span>
                  {!c.is_active && <span className="px-2 py-0.5 rounded-full bg-destructive/20 text-destructive text-xs">Inactive</span>}
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="icon" variant="ghost" onClick={() => startEdit(c)}><Pencil className="w-4 h-4" /></Button>
                <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDelete(c.id)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCouponsTab;
