import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Upload, Loader2 } from "lucide-react";

interface ProductForm {
  name: string;
  description: string;
  price: string;
  old_price: string;
  badge: string;
  sort_order: string;
  is_active: boolean;
}

const emptyForm: ProductForm = { name: "", description: "", price: "", old_price: "", badge: "", sort_order: "0", is_active: true };

const AdminProductsTab = () => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const { data: products, isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const uploadImage = async (file: File): Promise<string> => {
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file);
    if (error) throw error;
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price) {
      toast({ title: "Name and price are required", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      let image_url: string | undefined;
      if (imageFile) image_url = await uploadImage(imageFile);

      const payload = {
        name: form.name,
        description: form.description || null,
        price: parseInt(form.price),
        old_price: form.old_price ? parseInt(form.old_price) : null,
        badge: form.badge || null,
        sort_order: parseInt(form.sort_order) || 0,
        is_active: form.is_active,
        ...(image_url ? { image_url } : {}),
      };

      if (editingId) {
        const { error } = await supabase.from("products").update(payload).eq("id", editingId);
        if (error) throw error;
        toast({ title: "Product updated!" });
      } else {
        const { error } = await supabase.from("products").insert(payload);
        if (error) throw error;
        toast({ title: "Product added!" });
      }

      setForm(emptyForm);
      setEditingId(null);
      setImageFile(null);
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (p: any) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      description: p.description || "",
      price: String(p.price),
      old_price: p.old_price ? String(p.old_price) : "",
      badge: p.badge || "",
      sort_order: String(p.sort_order),
      is_active: p.is_active,
    });
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Product deleted" });
    queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    queryClient.invalidateQueries({ queryKey: ["products"] });
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4 mb-10">
        <h2 className="font-heading font-semibold text-lg text-foreground">
          {editingId ? "Edit Product" : "Add New Product"}
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Product Name *</Label>
            <Input name="name" value={form.name} onChange={handleChange} placeholder="Product name" className="bg-secondary/50 border-border" required />
          </div>
          <div className="space-y-1.5">
            <Label>Badge</Label>
            <Input name="badge" value={form.badge} onChange={handleChange} placeholder="e.g. Bestseller" className="bg-secondary/50 border-border" />
          </div>
          <div className="space-y-1.5">
            <Label>Price (₹) *</Label>
            <Input name="price" type="number" value={form.price} onChange={handleChange} placeholder="2500" className="bg-secondary/50 border-border" required />
          </div>
          <div className="space-y-1.5">
            <Label>Old Price (₹)</Label>
            <Input name="old_price" type="number" value={form.old_price} onChange={handleChange} placeholder="4500" className="bg-secondary/50 border-border" />
          </div>
          <div className="space-y-1.5">
            <Label>Sort Order</Label>
            <Input name="sort_order" type="number" value={form.sort_order} onChange={handleChange} className="bg-secondary/50 border-border" />
          </div>
          <div className="space-y-1.5">
            <Label>Product Image</Label>
            <label className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-secondary/50 cursor-pointer hover:border-primary/40 transition-colors text-sm text-muted-foreground">
              <Upload className="w-4 h-4" />
              {imageFile ? imageFile.name : "Choose file"}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
            </label>
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Description</Label>
          <Textarea name="description" value={form.description} onChange={handleChange} placeholder="Product description" className="bg-secondary/50 border-border" rows={2} />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="prod_active" checked={form.is_active} onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.checked }))} className="rounded border-border" />
          <Label htmlFor="prod_active">Active (visible on website)</Label>
        </div>
        <div className="flex gap-3">
          <Button type="submit" disabled={saving} className="bg-primary text-primary-foreground">
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
            {editingId ? "Update Product" : "Add Product"}
          </Button>
          {editingId && (
            <Button type="button" variant="outline" onClick={() => { setEditingId(null); setForm(emptyForm); }}>Cancel</Button>
          )}
        </div>
      </form>

      <h2 className="font-heading font-semibold text-lg text-foreground mb-4">Existing Products</h2>
      {isLoading ? (
        <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : (
        <div className="space-y-3">
          {products?.map((p) => (
            <div key={p.id} className="glass-card p-4 flex items-center gap-4">
              {p.image_url ? (
                <img src={p.image_url} alt={p.name} className="w-16 h-16 rounded-lg object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground text-xs">No img</div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate">{p.name}</h3>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-primary font-bold">₹{p.price.toLocaleString("en-IN")}</span>
                  {p.badge && <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs">{p.badge}</span>}
                  {!p.is_active && <span className="px-2 py-0.5 rounded-full bg-destructive/20 text-destructive text-xs">Inactive</span>}
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="icon" variant="ghost" onClick={() => startEdit(p)}><Pencil className="w-4 h-4" /></Button>
                <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDelete(p.id)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminProductsTab;
