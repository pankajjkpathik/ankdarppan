import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Package, IndianRupee, CreditCard } from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { format, subDays, startOfDay, endOfDay, isWithinInterval } from 'date-fns';

export default function AdminDashboardTab() {
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    pendingOrders: 0,
    avgOrderValue: 0
  });
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    const { data } = await supabase.from("orders").select("*");
    if (!data) return;

    const paidOrders = data.filter(o => o.status === "paid" || o.status === "captured" || o.status === "delivered" || o.status === "shipped");
    const revenue = paidOrders.reduce((sum, o) => sum + o.total, 0);
    const pending = data.filter(o => o.status === "pending" || o.status === "created").length;

    setStats({
      revenue,
      orders: data.length,
      pendingOrders: pending,
      avgOrderValue: data.length > 0 ? Math.round(revenue / data.length) : 0
    });

    // Prepare chart data for last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i);
      const dayStart = startOfDay(date);
      const dayEnd = endOfDay(date);
      
      const dayRevenue = paidOrders
        .filter(o => {
          const orderDate = new Date(o.created_at);
          return isWithinInterval(orderDate, { start: dayStart, end: dayEnd });
        })
        .reduce((sum, o) => sum + o.total, 0);

      return {
        date: format(date, 'dd MMM'),
        revenue: dayRevenue
      };
    });
    setChartData(last7Days);
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
              <p className="text-xs text-muted-foreground mt-1">Overall performance</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card className="glass-card border-none shadow-lg p-6">
        <h3 className="font-heading font-semibold mb-6">Sales Performance (Last 7 Days)</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4A843" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#D4A843" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                tickFormatter={(value) => `₹${value}`}
              />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-[#0f172a] border border-white/10 p-3 rounded-xl shadow-xl">
                        <p className="text-xs text-muted-foreground mb-1">{label}</p>
                        <p className="text-sm font-bold text-primary">₹{Number(payload[0].value).toLocaleString('en-IN')}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#D4A843" 
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
