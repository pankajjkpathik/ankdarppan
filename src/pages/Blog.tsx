import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const Blog = () => {
  const { data: blogs, isLoading } = useQuery({
    queryKey: ["blogs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="section-padding cosmic-bg">
        <div className="container mx-auto max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Our <span className="gold-text">Blog</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">Insights, tips, and wisdom from the world of numerology.</p>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : blogs?.length === 0 ? (
            <p className="text-center text-muted-foreground py-20">No articles yet. Stay tuned!</p>
          ) : (
            <div className="space-y-8">
              {blogs?.map((blog, i) => (
                <motion.div key={blog.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <Link to={`/blog/${blog.slug}`} className="glass-card overflow-hidden flex flex-col md:flex-row group">
                    {blog.image_url && (
                      <img src={blog.image_url} alt={blog.title} className="w-full md:w-64 h-48 md:h-auto object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    )}
                    <div className="p-6 flex-1">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        <Calendar className="w-3.5 h-3.5" />
                        {format(new Date(blog.created_at), "MMM d, yyyy")}
                      </div>
                      <h2 className="text-xl font-heading font-semibold text-foreground group-hover:text-primary transition-colors mb-2">{blog.title}</h2>
                      {blog.excerpt && <p className="text-sm text-muted-foreground line-clamp-2">{blog.excerpt}</p>}
                      <span className="inline-block mt-3 text-sm text-primary font-semibold">Read More →</span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Blog;
