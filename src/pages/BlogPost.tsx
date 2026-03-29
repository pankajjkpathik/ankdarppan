import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ArrowLeft, Calendar } from "lucide-react";
import { format } from "date-fns";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: blog, isLoading } = useQuery({
    queryKey: ["blog", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .single();
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="section-padding cosmic-bg">
        <div className="container mx-auto max-w-3xl">
          <Link to="/blog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>

          {isLoading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : !blog ? (
            <p className="text-center text-muted-foreground py-20">Article not found.</p>
          ) : (
            <article>
              {blog.image_url && (
                <img src={blog.image_url} alt={blog.title} className="w-full h-64 md:h-96 object-cover rounded-xl mb-8" />
              )}
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Calendar className="w-4 h-4" />
                {format(new Date(blog.created_at), "MMMM d, yyyy")}
              </div>
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-8">{blog.title}</h1>
              <div className="prose prose-invert prose-primary max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {blog.content}
              </div>
            </article>
          )}
        </div>
      </section>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default BlogPost;
