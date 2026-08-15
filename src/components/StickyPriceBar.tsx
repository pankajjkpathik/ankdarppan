import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface StickyPriceBarProps {
  show: boolean;
  price: number;
  oldPrice?: number;
  onScrollTo: () => void;
}

export const StickyPriceBar = ({ show, price, oldPrice, onScrollTo }: StickyPriceBarProps) => (
  <AnimatePresence>
    {show && (
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-stone-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] md:hidden safe-area-bottom"
      >
        <div className="flex items-center justify-between p-4 gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-stone-500 font-bold uppercase tracking-wider">Sawan Offer</span>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-stone-900">₹{price}</span>
              {oldPrice && <span className="text-sm text-stone-400 line-through">₹{oldPrice}</span>}
            </div>
          </div>
          <Button 
            onClick={onScrollTo}
            className="flex-1 py-6 rounded-full font-bold shadow-lg shadow-primary/20"
          >
            GET MY REPORT
          </Button>
        </div>
        <div className="h-[env(safe-area-inset-bottom)] w-full"></div>
      </motion.div>
    )}
  </AnimatePresence>
);
