import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/contexts/CartContext";
import CartDrawer from "@/components/CartDrawer";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index.tsx";
import BookNow from "./pages/BookNow.tsx";
import AdminLogin from "./pages/AdminLogin.tsx";
import AdminProducts from "./pages/AdminProducts.tsx";
import OrderTracking from "./pages/OrderTracking.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <CartDrawer />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/book" element={<BookNow />} />
            <Route path="/order-tracking" element={<OrderTracking />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/products" element={<ProtectedRoute><AdminProducts /></ProtectedRoute>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </CartProvider>
  </QueryClientProvider>
);

export default App;
