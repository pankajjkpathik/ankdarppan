import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Package, IndianRupee, CreditCard } from "lucide-react";

export default function AdminDashboardTab() {
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    pendingOrders: 0,
    avgOrderValue: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    const { data } = await supabase.from("orders").select("*");
    if (!data) return;

    const paidOrders = data.filter(o => o.status === "paid");
    const revenue = paidOrders.reduce((sum, o) => sum + o.total, 0);
    const pending = data.filter(o => o.status === "pending").length;

    setStats({
      revenue,
      orders: data.length,
      pendingOrders: pending,
      avgOrderValue: data.length > 0 ? Math.round(revenue / data.length) : 0
    });
  }

  const statCards = [
    { title: "Total Revenue", value: `₹${stats.revenue.toLocaleString('en-IN')}`, icon: IndianRupee, color: "text-emerald-500" },
    { title: "Total Orders", value: stats.orders, icon: Package, color: "text-blue-500" },
    { title: "Pending Actions", value: stats.pendingOrders, icon: TrendingUp, color: "text-orange-500" },
    { title: "Avg. Order Value", value: `₹${stats.avgOrderValue}`, icon: CreditCard, color: "text-purple-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => (
          <Card key={i} className="glass-card overflow-hidden border-none shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Placeholder for a Chart - Use Recharts here for maximum "glamour" */}
      <Card className="glass-card border-none shadow-lg p-6">
        <h3 className="font-heading font-semibold mb-4">Sales Performance</h3>
        <div className="h-[200px] w-full bg-secondary/20 rounded-lg flex items-center justify-center border border-dashed border-border">
          <p className="text-muted-foreground italic text-sm">Revenue graph visualization goes here</p>
        </div>
      </Card>
    </div>
  );
}
