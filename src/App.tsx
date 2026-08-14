import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/contexts/CartContext";
import { Helmet } from "react-helmet-async";
import CartDrawer from "@/components/CartDrawer";
import ProtectedRoute from "@/components/ProtectedRoute";

// Public Pages
import Index from "./pages/Index.tsx";
import BookNow from "./pages/BookNow.tsx";
import OrderTracking from "./pages/OrderTracking.tsx";
import ProductDetail from "./pages/ProductDetail.tsx";
import Shop from "./pages/Shop.tsx";
import Blog from "./pages/Blog.tsx";
import BlogPost from "./pages/BlogPost.tsx";
import AboutUs from "./pages/AboutUs.tsx";
import Services from "./pages/Services.tsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.tsx";
import RefundPolicy from "./pages/RefundPolicy.tsx";
import TermsAndConditions from "./pages/TermsAndConditions.tsx";
import NotFound from "./pages/NotFound.tsx";
import MobileCompatibilityReport from "./pages/MobileCompatibilityReport.tsx";
import LoshuGridReport from "./pages/LoshuGridReport.tsx";
import MarriageCompatibility from "./pages/MarriageCompatibility.tsx";
import NameCompatibilityReport from "./pages/NameCompatibilityReport.tsx";

// Auth Pages
import Auth from "./pages/Auth.tsx";
import MyAccount from "./pages/MyAccount.tsx";
import ResetPassword from "./pages/ResetPassword.tsx";
import AdminLogin from "./pages/AdminLogin.tsx";
import AdminSignup from "./pages/AdminSignup.tsx";

// Admin Layout Shell
// Note: Assuming AdminLayout is in the same folder as your other admin tabs
import AdminLayout from "./pages/AdminDashboard.tsx"; 

const queryClient = new QueryClient();

const PageSEO = ({ title, description }: { title: string; description: string }) => (
  <Helmet>
    <title>{title}</title>
    <meta name="description" content={description} />
  </Helmet>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <CartDrawer />
          <Routes>
            {/* --- Public Routes --- */}
            <Route path="/" element={<><PageSEO title="Ank Darppan - Expert Numerology Consultant | Unlock Your Destiny" description="India's trusted numerology consultant. Loshu Grid reports, Vedic numerology, marriage compatibility, mobile number consultations & more." /><Index /></>} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/services" element={<Services />} />
            <Route path="/book" element={<BookNow />} />
            <Route path="/shop" element={<><PageSEO title="Shop Spiritual Products | Ank Darppan" description="Explore our handpicked collection of spiritual products, crystals, and numerology reports." /><Shop /></>} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/order-tracking" element={<OrderTracking />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
            <Route path="/mobile-compatibility-report" element={<MobileCompatibilityReport />} />
            <Route path="/loshu-grid-report" element={<LoshuGridReport />} />
            <Route path="/marriage-compatibility" element={<MarriageCompatibility />} />
            <Route path="/name-compatibility" element={<NameCompatibilityReport />} />

            {/* --- Customer Auth --- */}
            <Route path="/auth" element={<Auth />} />
            <Route path="/my-account" element={<MyAccount />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* --- Admin Auth --- */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/signup" element={<AdminSignup />} />

            {/* --- Protected Admin Routes --- */}
            {/* This now uses AdminLayout to manage all sub-tabs (Orders, Blogs, etc.) */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              } 
            />

            {/* Redirect legacy specific routes back to the main layout shell */}
            <Route path="/admin/products" element={<Navigate to="/admin" replace />} />
            <Route path="/admin/orders" element={<Navigate to="/admin" replace />} />

            {/* Catch-all 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </CartProvider>
  </QueryClientProvider>
);

export default App;
