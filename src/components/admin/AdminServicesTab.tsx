import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";

interface ServiceForm {
  title: string;
  description: string;
  price: string;
  icon: string;
  link: string;
  sort_order: string;
  is_active: boolean;
}

const emptyForm: ServiceForm = { title: "", description: "", price: "", icon: "FileText", link: "", sort_order: "0", is_active: true };

const iconOptions = ["Grid3X3", "BookOpen", "Heart", "Smartphone", "Gem", "FileText", "Star", "Sparkles", "Eye", "Moon"];

const AdminServicesTab = () => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<ServiceForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const { data: services, isLoading } = useQuery({
    queryKey: ["admin-services"],
    queryFn: async () => {
      const { data, error } = await supabase.from("services").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.price) {
      toast({ title: "Title and price are required", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        description: form.description || null,
        price: parseInt(form.price),
        icon: form.icon || "FileText",
        link: form.link || null,
        sort_order: parseInt(form.sort_order) || 0,
        is_active: form.is_active,
      };

      if (editingId) {
        const { error } = await supabase.from("services").update(payload).eq("id", editingId);
        if (error) throw error;
        toast({ title: "Service updated!" });
      } else {
        const { error } = await supabase.from("services").insert(payload);
        if (error) throw error;
        toast({ title: "Service added!" });
      }

      setForm(emptyForm);
      setEditingId(null);
      queryClient.invalidateQueries({ queryKey: ["admin-services"] });
      queryClient.invalidateQueries({ queryKey: ["services"] });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (s: any) => {
    setEditingId(s.id);
    setForm({
      title: s.title,
      description: s.description || "",
      price: String(s.price),
      icon: s.icon || "FileText",
      link: s.link || "",
      sort_order: String(s.sort_order),
      is_active: s.is_active,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this service?")) return;
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Service deleted" });
    queryClient.invalidateQueries({ queryKey: ["admin-services"] });
    queryClient.invalidateQueries({ queryKey: ["services"] });
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4 mb-10">
        <h2 className="font-heading font-semibold text-lg text-foreground">
          {editingId ? "Edit Service" : "Add New Service"}
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Service Title *</Label>
            <Input name="title" value={form.title} onChange={handleChange} placeholder="Service name" className="bg-secondary/50 border-border" required />
          </div>
          <div className="space-y-1.5">
            <Label>Price (₹) *</Label>
            <Input name="price" type="number" value={form.price} onChange={handleChange} placeholder="671" className="bg-secondary/50 border-border" required />
          </div>
          <div className="space-y-1.5">
            <Label>Icon</Label>
            <select name="icon" value={form.icon} onChange={handleChange} className="flex h-10 w-full rounded-md border border-border bg-secondary/50 px-3 py-2 text-sm text-foreground">
              {iconOptions.map((ic) => (
                <option key={ic} value={ic}>{ic}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label>Razorpay Link (optional)</Label>
            <Input name="link" value={form.link} onChange={handleChange} placeholder="https://rzp.io/..." className="bg-secondary/50 border-border" />
          </div>
          <div className="space-y-1.5">
            <Label>Sort Order</Label>
            <Input name="sort_order" type="number" value={form.sort_order} onChange={handleChange} className="bg-secondary/50 border-border" />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Description</Label>
          <Textarea name="description" value={form.description} onChange={handleChange} placeholder="Service description" className="bg-secondary/50 border-border" rows={2} />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="svc_active" checked={form.is_active} onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.checked }))} className="rounded border-border" />
          <Label htmlFor="svc_active">Active (visible on website)</Label>
        </div>
        <div className="flex gap-3">
          <Button type="submit" disabled={saving} className="bg-primary text-primary-foreground">
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
            {editingId ? "Update Service" : "Add Service"}
          </Button>
          {editingId && (
            <Button type="button" variant="outline" onClick={() => { setEditingId(null); setForm(emptyForm); }}>Cancel</Button>
          )}
        </div>
      </form>

      <h2 className="font-heading font-semibold text-lg text-foreground mb-4">Existing Services</h2>
      {isLoading ? (
        <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : (
        <div className="space-y-3">
          {services?.map((s) => (
            <div key={s.id} className="glass-card p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-lg font-bold">
                {s.icon?.[0] || "S"}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate">{s.title}</h3>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-primary font-bold">₹{s.price.toLocaleString("en-IN")}</span>
                  {!s.is_active && <span className="px-2 py-0.5 rounded-full bg-destructive/20 text-destructive text-xs">Inactive</span>}
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="icon" variant="ghost" onClick={() => startEdit(s)}><Pencil className="w-4 h-4" /></Button>
                <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDelete(s.id)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminServicesTab;
