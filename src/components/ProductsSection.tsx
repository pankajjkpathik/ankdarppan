import { motion } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import zodiacImg from "@/assets/zodiac-charm.jpg";
import pendantImg from "@/assets/astro-pendant.jpg";
import braceletImg from "@/assets/planetary-bracelet.jpg";
import crystalsImg from "@/assets/crystals-product.jpg";

const products = [
  { img: zodiacImg, name: "Zodiac Charms", price: "₹2,500", oldPrice: "₹4,500", badge: "Bestseller" },
  { img: pendantImg, name: "Astrologic Pendant", price: "₹3,200", oldPrice: "₹5,900", badge: "New" },
  { img: crystalsImg, name: "Celestial Gemstone Set", price: "₹1,800", oldPrice: "₹3,500", badge: "Popular" },
  { img: braceletImg, name: "Planetary Bracelet", price: "₹2,100", oldPrice: "₹4,000", badge: "Trending" },
];

const ProductsSection = () => {
  const { addItem } = useCart();
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

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product, i) => (
          <motion.div
            key={product.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass-card overflow-hidden group"
          >
            <div className="relative overflow-hidden">
              <img
                src={product.img}
                alt={product.name}
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
                width={512}
                height={512}
              />
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                {product.badge}
              </span>
            </div>
            <div className="p-4">
              <h3 className="font-heading font-semibold text-foreground mb-2">{product.name}</h3>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-primary">{product.price}</span>
                <span className="text-sm text-muted-foreground line-through">{product.oldPrice}</span>
              </div>
              <a href="#contact" className="mt-3 block text-center py-2 rounded-lg border border-primary/40 text-primary text-sm font-semibold hover:bg-primary/10 transition-all">
                Buy Now
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ProductsSection;
