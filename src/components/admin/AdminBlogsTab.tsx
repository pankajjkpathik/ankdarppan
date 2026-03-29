import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Upload, Loader2 } from "lucide-react";

interface BlogForm {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  sort_order: string;
  is_published: boolean;
}

const emptyForm: BlogForm = { title: "", slug: "", excerpt: "", content: "", sort_order: "0", is_published: false };

const AdminBlogsTab = () => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<BlogForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const { data: blogs, isLoading } = useQuery({
    queryKey: ["admin-blogs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("blogs").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const generateSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setForm((p) => ({ ...p, title, slug: editingId ? p.slug : generateSlug(title) }));
  };

  const uploadImage = async (file: File): Promise<string> => {
    const ext = file.name.split(".").pop();
    const path = `blog-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file);
    if (error) throw error;
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.slug) {
      toast({ title: "Title is required", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      let image_url: string | undefined;
      if (imageFile) image_url = await uploadImage(imageFile);

      const payload = {
        title: form.title,
        slug: form.slug,
        excerpt: form.excerpt || null,
        content: form.content || null,
        sort_order: parseInt(form.sort_order) || 0,
        is_published: form.is_published,
        ...(image_url ? { image_url } : {}),
      };

      if (editingId) {
        const { error } = await supabase.from("blogs").update(payload).eq("id", editingId);
        if (error) throw error;
        toast({ title: "Blog updated!" });
      } else {
        const { error } = await supabase.from("blogs").insert(payload);
        if (error) throw error;
        toast({ title: "Blog added!" });
      }

      setForm(emptyForm);
      setEditingId(null);
      setImageFile(null);
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (b: any) => {
    setEditingId(b.id);
    setForm({
      title: b.title,
      slug: b.slug,
      excerpt: b.excerpt || "",
      content: b.content || "",
      sort_order: String(b.sort_order),
      is_published: b.is_published,
    });
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this blog post?")) return;
    const { error } = await supabase.from("blogs").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Blog deleted" });
    queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
    queryClient.invalidateQueries({ queryKey: ["blogs"] });
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4 mb-10">
        <h2 className="font-heading font-semibold text-lg text-foreground">
          {editingId ? "Edit Blog Post" : "Add New Blog Post"}
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Title *</Label>
            <Input name="title" value={form.title} onChange={handleTitleChange} placeholder="Blog title" className="bg-secondary/50 border-border" required />
          </div>
          <div className="space-y-1.5">
            <Label>Slug *</Label>
            <Input name="slug" value={form.slug} onChange={handleChange} placeholder="blog-url-slug" className="bg-secondary/50 border-border" required />
          </div>
          <div className="space-y-1.5">
            <Label>Sort Order</Label>
            <Input name="sort_order" type="number" value={form.sort_order} onChange={handleChange} className="bg-secondary/50 border-border" />
          </div>
          <div className="space-y-1.5">
            <Label>Cover Image</Label>
            <label className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-secondary/50 cursor-pointer hover:border-primary/40 transition-colors text-sm text-muted-foreground">
              <Upload className="w-4 h-4" />
              {imageFile ? imageFile.name : "Choose file"}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
            </label>
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Excerpt</Label>
          <Textarea name="excerpt" value={form.excerpt} onChange={handleChange} placeholder="Short summary for listing page" className="bg-secondary/50 border-border" rows={2} />
        </div>
        <div className="space-y-1.5">
          <Label>Content</Label>
          <Textarea name="content" value={form.content} onChange={handleChange} placeholder="Full blog content..." className="bg-secondary/50 border-border" rows={10} />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="blog_published" checked={form.is_published} onChange={(e) => setForm((p) => ({ ...p, is_published: e.target.checked }))} className="rounded border-border" />
          <Label htmlFor="blog_published">Published (visible on website)</Label>
        </div>
        <div className="flex gap-3">
          <Button type="submit" disabled={saving} className="bg-primary text-primary-foreground">
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
            {editingId ? "Update Post" : "Add Post"}
          </Button>
          {editingId && (
            <Button type="button" variant="outline" onClick={() => { setEditingId(null); setForm(emptyForm); }}>Cancel</Button>
          )}
        </div>
      </form>

      <h2 className="font-heading font-semibold text-lg text-foreground mb-4">Existing Blog Posts</h2>
      {isLoading ? (
        <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : (
        <div className="space-y-3">
          {blogs?.map((b) => (
            <div key={b.id} className="glass-card p-4 flex items-center gap-4">
              {b.image_url ? (
                <img src={b.image_url} alt={b.title} className="w-16 h-16 rounded-lg object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground text-xs">No img</div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate">{b.title}</h3>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground text-xs">/{b.slug}</span>
                  {b.is_published ? (
                    <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs">Published</span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-destructive/20 text-destructive text-xs">Draft</span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="icon" variant="ghost" onClick={() => startEdit(b)}><Pencil className="w-4 h-4" /></Button>
                <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDelete(b.id)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminBlogsTab;
