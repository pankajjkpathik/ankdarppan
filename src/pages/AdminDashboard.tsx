import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  FileText, 
  Wrench, 
  LogOut,
  Menu,
  X,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// --- Imports matching your file list ---
import AdminDashboardTab from "@/components/admin/AdminDashboardTab.tsx"; // Added .tsx
import AdminOrdersTab from "@/components/admin/AdminOrdersTab.tsx";
import AdminProductsTab from "@/components/admin/AdminProductsTab.tsx";
import AdminBlogsTab from "@/components/admin/AdminBlogsTab.tsx";
import AdminServicesTab from "@/components/admin/AdminServicesTab.tsx";

const navigation = [
  { name: "Dashboard", icon: LayoutDashboard, id: "dashboard" },
  { name: "Orders", icon: ShoppingBag, id: "orders" },
  { name: "Products", icon: Package, id: "products" },
  { name: "Services", icon: Wrench, id: "services" },
  { name: "Blog", icon: FileText, id: "blogs" },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard": return <AdminDashboardTab />;
      case "orders": return <AdminOrdersTab />;
      case "products": return <AdminProductsTab />;
      case "services": return <AdminServicesTab />;
      case "blogs": return <AdminBlogsTab />;
      default: return <AdminDashboardTab />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#030303] text-slate-200">
      
      {/* 1. SIDEBAR */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-[#0A0A0A]/80 backdrop-blur-2xl border-r border-white/5 transition-transform duration-300 lg:translate-x-0 lg:static",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full p-8">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20">
              <Package className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="font-heading font-bold text-lg leading-tight text-white">Ankdarppan</h1>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Admin Console</p>
            </div>
          </div>

          <nav className="flex-1 space-y-2">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
                className={cn(
                  "flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl text-sm font-medium transition-all duration-300 group",
                  activeTab === item.id 
                    ? "bg-white/10 text-white border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)]" 
                    : "text-muted-foreground hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon className={cn(
                  "w-5 h-5 transition-colors",
                  activeTab === item.id ? "text-primary" : "group-hover:text-primary"
                )} />
                {item.name}
              </button>
            ))}
          </nav>

          <div className="pt-6 border-t border-white/5 mt-auto">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 w-full text-sm font-medium text-destructive/80 hover:bg-destructive/10 rounded-2xl transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />

        <header className="lg:hidden flex items-center justify-between p-6 border-b border-white/5 bg-black/40 backdrop-blur-md">
          <span className="font-bold tracking-tight">ADMIN</span>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-lg bg-white/5">
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 lg:p-12">
          <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            <div className="mb-10 flex justify-between items-end">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-white capitalize">
                  {activeTab}
                </h2>
                <p className="text-muted-foreground mt-1">Management Overview</p>
              </div>
            </div>

            <div className="relative">
              {renderContent()}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
