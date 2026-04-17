"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  ClipboardList, Users, Package, TrendingUp,
  Clock, CheckCircle2, XCircle, AlertCircle, IndianRupee,
} from "lucide-react";

type Stats = {
  total_orders: number; pending: number; processing: number;
  completed: number; cancelled: number; total_advance: number; total_budget_value: number;
  total_customers: number; total_vendors: number; total_employees: number;
};

type RecentOrder = {
  id: string; order_no: string; customer_name: string; event_type: string;
  status: string; created_at: string; budget_max: number; item_category: string;
};

const STATUS_COLORS: Record<string, string> = {
  pending:    "#d97706",
  processing: "#3b5f8a",
  completed:  "#3d7a5e",
  cancelled:  "#c0706a",
};

const STATUS_BG: Record<string, string> = {
  pending:    "#fef3c7",
  processing: "#dbeafe",
  completed:  "#d1fae5",
  cancelled:  "#fee2e2",
};

export default function AdminDashboardPage() {
  const [stats,   setStats]   = useState<Stats | null>(null);
  const [orders,  setOrders]  = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const [statsRes, ordersRes, profilesRes] = await Promise.all([
        supabase.from("order_stats").select("*").single(),
        supabase.from("orders").select("id,order_no,customer_name,event_type,status,created_at,budget_max,item_category").order("created_at", { ascending: false }).limit(8),
        supabase.from("profiles").select("role"),
      ]);

      const profiles = profilesRes.data ?? [];
      setStats({
        ...(statsRes.data ?? { total_orders:0,pending:0,processing:0,completed:0,cancelled:0,total_advance:0,total_budget_value:0 }),
        total_customers: profiles.filter((p: {role:string}) => p.role === "customer").length,
        total_vendors:   profiles.filter((p: {role:string}) => p.role === "vendor").length,
        total_employees: profiles.filter((p: {role:string}) => p.role === "employee").length,
      });
      setOrders(ordersRes.data ?? []);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: "var(--aira-gold)", borderTopColor: "transparent" }} />
      </div>
    );
  }

  const statCards = [
    { label: "Total Orders",    value: stats?.total_orders ?? 0,    icon: ClipboardList, color: "#3b5f8a" },
    { label: "Pending",         value: stats?.pending ?? 0,         icon: Clock,         color: "#d97706" },
    { label: "Processing",      value: stats?.processing ?? 0,      icon: TrendingUp,    color: "#7c3aed" },
    { label: "Completed",       value: stats?.completed ?? 0,       icon: CheckCircle2,  color: "#3d7a5e" },
    { label: "Cancelled",       value: stats?.cancelled ?? 0,       icon: XCircle,       color: "#c0706a" },
    { label: "Customers",       value: stats?.total_customers ?? 0, icon: Users,         color: "#c0706a" },
    { label: "Vendors",         value: stats?.total_vendors ?? 0,   icon: Package,       color: "#3d7a5e" },
    { label: "Total Advance",   value: `₹${((stats?.total_advance ?? 0)/1000).toFixed(1)}k`, icon: IndianRupee, color: "#8B7355" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold" style={{ color: "var(--aira-dark)" }}>Admin Overview</h1>
        <p className="text-sm mt-1" style={{ color: "var(--aira-text)", opacity: 0.55 }}>Platform-wide statistics and recent activity.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <div key={s.label} className="card-premium p-5">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ background: `${s.color}15` }}>
              <s.icon size={17} style={{ color: s.color }} />
            </div>
            <div className="text-2xl font-semibold font-display" style={{ color: "var(--aira-dark)" }}>{s.value}</div>
            <div className="text-xs mt-0.5" style={{ color: "var(--aira-text)", opacity: 0.55 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Alert for unverified vendors */}
      <div className="flex items-center gap-3 p-4 rounded-xl"
        style={{ background: "#fef3c7", border: "1px solid #fcd34d" }}>
        <AlertCircle size={16} style={{ color: "#d97706" }} />
        <p className="text-sm" style={{ color: "#92400e" }}>
          Review pending vendor verifications in the{" "}
          <a href="/admin/dashboard/vendors" className="font-semibold underline">Vendors tab</a>.
        </p>
      </div>

      {/* Recent orders */}
      <div className="card-premium overflow-hidden">
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: "hsl(var(--border))" }}>
          <h2 className="font-semibold text-base" style={{ color: "var(--aira-dark)" }}>Recent Orders</h2>
          <a href="/admin/dashboard/orders" className="text-xs font-medium link-underline" style={{ color: "var(--aira-gold)" }}>View all →</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid hsl(var(--border))", background: "hsl(var(--muted))" }}>
                {["Order No","Customer","Event","Category","Budget","Status","Date"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--aira-gold)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-10 text-sm" style={{ color: "var(--aira-text)", opacity: 0.4 }}>No orders yet</td></tr>
              ) : orders.map((o, i) => (
                <tr key={o.id} style={{ borderBottom: i < orders.length - 1 ? "1px solid hsl(var(--border))" : "none" }}
                  className="hover:bg-amber-50/40 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--aira-gold)" }}>{o.order_no}</td>
                  <td className="px-4 py-3 font-medium" style={{ color: "var(--aira-dark)" }}>{o.customer_name}</td>
                  <td className="px-4 py-3" style={{ color: "var(--aira-text)", opacity: 0.7 }}>{o.event_type}</td>
                  <td className="px-4 py-3" style={{ color: "var(--aira-text)", opacity: 0.7 }}>{o.item_category}</td>
                  <td className="px-4 py-3 font-medium" style={{ color: "var(--aira-dark)" }}>₹{o.budget_max.toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold"
                      style={{ background: STATUS_BG[o.status] ?? "#f3f4f6", color: STATUS_COLORS[o.status] ?? "#374151" }}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: "var(--aira-text)", opacity: 0.5 }}>
                    {new Date(o.created_at).toLocaleDateString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}