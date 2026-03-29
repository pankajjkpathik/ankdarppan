import { motion } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

import zodiacImg from "@/assets/zodiac-charm.jpg";
import pendantImg from "@/assets/astro-pendant.jpg";
import braceletImg from "@/assets/planetary-bracelet.jpg";
import crystalsImg from "@/assets/crystals-product.jpg";

const fallbackImages = [zodiacImg, pendantImg, crystalsImg, braceletImg];

const ProductsSection = () => {
  const { addItem } = useCart();

  const { data: products, isLoading } = useQuery({
    queryKey: ["products-home"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("sort_order")
        .limit(4);
      if (error) throw error;
      return data;
    },
  });

  return (
    <section id="shop" className="section-padding cosmic-bg">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Our Top <span className="gold-text">Products</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Handpicked spiritual products to enhance your energy and align with your cosmic vibrations.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products?.map((product, i) => {
              const imgSrc = product.image_url || fallbackImages[i % fallbackImages.length];
              const priceFormatted = `₹${product.price.toLocaleString("en-IN")}`;
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card overflow-hidden group"
                >
                  <Link to={`/product/${product.id}`}>
                    <div className="relative overflow-hidden cursor-pointer">
                      <img src={imgSrc} alt={product.name} className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" width={512} height={512} />
                      {product.badge && (
                        <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">{product.badge}</span>
                      )}
                    </div>
                  </Link>
                  <div className="p-4">
                    <Link to={`/product/${product.id}`}>
                      <h3 className="font-heading font-semibold text-foreground mb-1 hover:text-primary transition-colors">{product.name}</h3>
                    </Link>
                    {product.description && <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{product.description}</p>}
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-primary">{priceFormatted}</span>
                      {product.old_price && <span className="text-sm text-muted-foreground line-through">₹{product.old_price.toLocaleString("en-IN")}</span>}
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); addItem({ name: product.name, price: priceFormatted, priceNum: product.price, img: imgSrc }); }}
                      className="mt-3 w-full text-center py-2 rounded-lg border border-primary/40 text-primary text-sm font-semibold hover:bg-primary/10 transition-all"
                    >
                      Add to Cart
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        <div className="text-center mt-12">
          <Link to="/shop" className="inline-block px-8 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:brightness-110 transition-all">
            View All Products →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
