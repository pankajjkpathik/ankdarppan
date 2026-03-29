import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

const BlogSection = () => {
  const { data: blogs, isLoading } = useQuery({
    queryKey: ["blogs-home"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .limit(3);
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <section className="section-padding">
        <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      </section>
    );
  }

  if (!blogs || blogs.length === 0) return null;

  return (
    <section className="section-padding stars-bg">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Latest <span className="gold-text">Articles</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our latest insights on numerology, spirituality, and cosmic wisdom.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {blogs.map((blog, i) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card overflow-hidden group"
            >
              {blog.image_url && (
                <Link to={`/blog/${blog.slug}`}>
                  <img src={blog.image_url} alt={blog.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                </Link>
              )}
              <div className="p-5">
                <p className="text-xs text-muted-foreground mb-2">
                  {new Date(blog.created_at).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
                </p>
                <Link to={`/blog/${blog.slug}`}>
                  <h3 className="font-heading font-semibold text-foreground mb-2 hover:text-primary transition-colors line-clamp-2">{blog.title}</h3>
                </Link>
                {blog.excerpt && <p className="text-sm text-muted-foreground line-clamp-2">{blog.excerpt}</p>}
                <Link to={`/blog/${blog.slug}`} className="inline-block mt-3 text-primary text-sm font-semibold hover:brightness-110">
                  Read More →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/blog"
            className="inline-block px-8 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:brightness-110 transition-all"
          >
            View All Articles →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
