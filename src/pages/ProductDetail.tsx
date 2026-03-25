import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, ShoppingCart, Star, Truck, Shield, RotateCcw } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

import zodiacImg from "@/assets/zodiac-charm.jpg";
import pendantImg from "@/assets/astro-pendant.jpg";
import braceletImg from "@/assets/planetary-bracelet.jpg";
import crystalsImg from "@/assets/crystals-product.jpg";

const fallbackImages = [zodiacImg, pendantImg, crystalsImg, braceletImg];

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  // Fetch related products
  const { data: relatedProducts } = useQuery({
    queryKey: ["related-products", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .neq("id", id!)
        .order("sort_order")
        .limit(4);
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-xl text-muted-foreground">Product not found</p>
        <Link to="/#shop"><Button variant="outline">Back to Shop</Button></Link>
      </div>
    );
  }

  const imgSrc = product.image_url || fallbackImages[0];
  const price = product.price;
  const oldPrice = product.old_price;
  const discount = oldPrice ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) {
      addItem({
        name: product.name,
        price: `₹${price.toLocaleString("en-IN")}`,
        priceNum: price,
        img: imgSrc,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="border-b border-border/40 bg-secondary/30">
        <div className="container mx-auto px-4 py-3 flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link to="/#shop" className="hover:text-primary transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-foreground font-medium truncate">{product.name}</span>
        </div>
      </div>

      {/* Main product section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="relative rounded-2xl overflow-hidden border border-border/40 bg-secondary/20">
              {product.badge && (
                <Badge className="absolute top-4 left-4 z-10 bg-primary text-primary-foreground text-sm px-3 py-1">
                  {product.badge}
                </Badge>
              )}
              <img
                src={imgSrc}
                alt={product.name}
                className="w-full aspect-square object-cover"
              />
            </div>
          </motion.div>

          {/* Details section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-2">
              {product.name}
            </h1>

            {/* Rating placeholder */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">(Trusted by 100+ customers)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl md:text-4xl font-bold text-primary">
                ₹{price.toLocaleString("en-IN")}
              </span>
              {oldPrice && (
                <>
                  <span className="text-lg text-muted-foreground line-through">
                    ₹{oldPrice.toLocaleString("en-IN")}
                  </span>
                  <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                    {discount}% OFF
                  </Badge>
                </>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-foreground mb-2 uppercase tracking-wider">Description</h3>
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-4 py-2 text-lg font-bold hover:bg-secondary/60 transition-colors text-foreground"
                >−</button>
                <span className="px-5 py-2 text-lg font-semibold text-foreground border-x border-border bg-secondary/20">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="px-4 py-2 text-lg font-bold hover:bg-secondary/60 transition-colors text-foreground"
                >+</button>
              </div>
              <Button
                onClick={handleAddToCart}
                size="lg"
                className="flex-1 bg-primary text-primary-foreground font-semibold text-base gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </Button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-border/40">
              <div className="flex flex-col items-center gap-1.5 text-center">
                <Truck className="w-5 h-5 text-primary" />
                <span className="text-xs text-muted-foreground">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 text-center">
                <Shield className="w-5 h-5 text-primary" />
                <span className="text-xs text-muted-foreground">Secure Payment</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 text-center">
                <RotateCcw className="w-5 h-5 text-primary" />
                <span className="text-xs text-muted-foreground">Easy Returns</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-heading font-bold text-foreground mb-8">
              Similar <span className="gold-text">Products</span>
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rp, i) => {
                const rpImg = rp.image_url || fallbackImages[i % fallbackImages.length];
                return (
                  <Link to={`/product/${rp.id}`} key={rp.id}>
                    <div className="glass-card overflow-hidden group cursor-pointer">
                      <div className="relative overflow-hidden">
                        <img
                          src={rpImg}
                          alt={rp.name}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                          loading="lazy"
                        />
                        {rp.badge && (
                          <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                            {rp.badge}
                          </span>
                        )}
                      </div>
                      <div className="p-3">
                        <h3 className="font-heading font-semibold text-foreground text-sm mb-1 truncate">{rp.name}</h3>
                        <span className="text-lg font-bold text-primary">₹{rp.price.toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Back to shop */}
      <div className="container mx-auto px-4 pb-12">
        <Link to="/#shop">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Shop
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ProductDetail;
