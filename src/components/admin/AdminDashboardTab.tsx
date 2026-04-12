import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AdminDashboardTab() {
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    const { data } = await supabase.from("orders").select("*");

    const revenue = data
      ?.filter(o => o.status === "paid")
      .reduce((sum, o) => sum + o.total, 0);

    setStats({
      revenue,
      orders: data.length
    });
  }

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      <div>Revenue: ₹{stats.revenue}</div>
      <div>Total Orders: {stats.orders}</div>
    </div>
  );
}
