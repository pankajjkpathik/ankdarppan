import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Package, IndianRupee, CreditCard, Calendar } from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { format, subDays, startOfDay, endOfDay, isWithinInterval, eachDayOfInterval, parseISO } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminDashboardTab() {
  const [range, setRange] = useState("7");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    pendingActions: 0,
    avgOrderValue: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const { data } = await supabase.from("orders").select("*");
    if (data) {
      setOrders(data);
      calculateStats(data);
    }
    setLoading(false);
  }

  function calculateStats(allOrders: any[]) {
    const paidOrders = allOrders.filter(o => 
      ["paid", "captured", "delivered", "shipped"].includes(o.status)
    );
    const revenue = paidOrders.reduce((sum, o) => sum + o.total, 0);
    const pending = allOrders.filter(o => ["pending", "created"].includes(o.status)).length;

    setStats({
      revenue,
      orders: allOrders.length,
      pendingActions: pending,
      avgOrderValue: allOrders.length > 0 ? Math.round(revenue / allOrders.length) : 0
    });
  }

  const chartData = useMemo(() => {
    const days = parseInt(range);
    const end = endOfDay(new Date());
    const start = startOfDay(subDays(end, days - 1));
    
    const interval = eachDayOfInterval({ start, end });
    
    return interval.map(day => {
      const dayStart = startOfDay(day);
      const dayEnd = endOfDay(day);
      
      const dayOrders = orders.filter(o => {
        const d = parseISO(o.created_at);
        return isWithinInterval(d, { start: dayStart, end: dayEnd });
      });

      const captured = dayOrders
        .filter(o => ["paid", "captured", "delivered", "shipped"].includes(o.status))
        .reduce((sum, o) => sum + o.total, 0);
        
      const failed = dayOrders
        .filter(o => ["failed", "cancelled"].includes(o.status))
        .reduce((sum, o) => sum + o.total, 0);

      return {
        date: format(day, 'dd MMM'),
        revenue: captured,
        failed: failed,
        count: dayOrders.length
      };
    });
  }, [orders, range]);

  const statCards = [
    { title: "Total Revenue", value: `₹${stats.revenue.toLocaleString('en-IN')}`, icon: IndianRupee, color: "text-emerald-500" },
    { title: "Total Orders", value: stats.orders, icon: Package, color: "text-blue-500" },
    { title: "Pending Actions", value: stats.pendingActions, icon: TrendingUp, color: "text-orange-500" },
    { title: "Avg. Order Value", value: `₹${stats.avgOrderValue.toLocaleString('en-IN')}`, icon: CreditCard, color: "text-purple-500" },
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h3 className="font-heading font-semibold text-lg">Sales Performance</h3>
            <p className="text-sm text-muted-foreground">Captured vs Failed revenue analysis</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-primary" />
            <Select value={range} onValueChange={setRange}>
              <SelectTrigger className="w-[180px] bg-secondary/30 border-white/5">
                <SelectValue placeholder="Select Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 Days</SelectItem>
                <SelectItem value="15">Last 15 Days</SelectItem>
                <SelectItem value="30">Last 30 Days</SelectItem>
                <SelectItem value="90">Last 3 months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="h-[400px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4A843" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#D4A843" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorFailed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                tickFormatter={(value) => `₹${value > 1000 ? (value/1000).toFixed(1) + 'k' : value}`}
              />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-[#0f172a] border border-white/10 p-4 rounded-xl shadow-2xl backdrop-blur-md">
                        <p className="text-xs font-bold text-muted-foreground mb-3 uppercase tracking-wider">{label}</p>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-8">
                            <span className="text-xs flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-primary" />
                              Captured
                            </span>
                            <span className="text-sm font-bold text-primary">₹{Number(payload[0].value).toLocaleString('en-IN')}</span>
                          </div>
                          <div className="flex items-center justify-between gap-8 border-t border-white/5 pt-2">
                            <span className="text-xs flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-red-500" />
                              Failed
                            </span>
                            <span className="text-sm font-bold text-red-400">₹{Number(payload[1].value).toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend verticalAlign="top" height={36}/>
              <Area 
                type="monotone" 
                name="Captured Revenue"
                dataKey="revenue" 
                stroke="#D4A843" 
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
                strokeWidth={3}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
              <Area 
                type="monotone" 
                name="Failed Revenue"
                dataKey="failed" 
                stroke="#ef4444" 
                fillOpacity={1} 
                fill="url(#colorFailed)" 
                strokeWidth={2}
                strokeDasharray="5 5"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
