import React, { useState } from "react";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  FileText, 
  Wrench, 
  LogOut,
  Menu,
  X 
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Manual Imports from your folder ---
import AdminDashboardTab from "./AdminDashboardTab";
import AdminOrdersTab from "./AdminOrdersTab";
import AdminProductsTab from "./AdminProductsTab";
import AdminBlogsTab from "./AdminBlogsTab";
import AdminServicesTab from "./AdminServicesTab";

const navigation = [
  { name: "Overview", icon: LayoutDashboard, id: "overview" },
  { name: "Orders", icon: ShoppingBag, id: "orders" },
  { name: "Products", icon: Package, id: "products" },
  { name: "Services", icon: Wrench, id: "services" },
  { name: "Blog Posts", icon: FileText, id: "blogs" },
];

export default function AdminLayout() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#050505] text-slate-200">
      {/* SIDEBAR */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-[#0A0A0A] border-r border-white/5 transition-transform duration-300 lg:translate-x-0 lg:static",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center gap-3 mb-10 px-2 font-bold text-xl text-white">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
               R
            </div>
            RugAdmin
          </div>

          <nav className="flex-1 space-y-1">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
                className={cn(
                  "flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all",
                  activeTab === item.id 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </button>
            ))}
          </nav>
          
          <button className="flex items-center gap-3 px-4 py-3 mt-auto text-sm text-destructive hover:bg-destructive/10 rounded-xl">
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT Area */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden p-4 border-b border-white/5 flex justify-between items-center">
          <span className="font-bold">RugAdmin</span>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </header>

        <div className="p-6 lg:p-10 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {/* Logic to swap files based on click */}
            {activeTab === "overview" && <AdminDashboardTab />}
            {activeTab === "orders" && <AdminOrdersTab />}
            {activeTab === "products" && <AdminProductsTab />}
            {activeTab === "services" && <AdminServicesTab />}
            {activeTab === "blogs" && <AdminBlogsTab />}
          </div>
        </div>
      </main>
    </div>
  );
}
