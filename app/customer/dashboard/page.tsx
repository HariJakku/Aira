"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { PlusCircle, Clock, CheckCircle2, Package } from "lucide-react";

const STATUS_COLORS: Record<string,string> = { pending:"#d97706", processing:"#3b5f8a", completed:"#3d7a5e", cancelled:"#c0706a" };
const STATUS_BG:     Record<string,string> = { pending:"#fef3c7", processing:"#dbeafe", completed:"#d1fae5", cancelled:"#fee2e2" };

type Order = { id:string; order_no:string; event_type:string; event_date:string; status:string; budget_max:number; item_category:string; created_at:string; };

export default function CustomerDashboardPage() {
  const [orders,  setOrders]  = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("there");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user.id).single();
        if (profile?.full_name) setUserName(profile.full_name.split(" ")[0]);
        const { data: myOrders } = await supabase
          .from("orders").select("id,order_no,event_type,event_date,status,budget_max,item_category,created_at")
          .eq("customer_id", user.id).order("created_at", { ascending: false }).limit(10);
        setOrders((myOrders as Order[]) ?? []);
      }
      setLoading(false);
    }
    load();
  }, []);

  const stats = [
    { label: "Total Orders",  value: orders.length,                                  icon: Package,      color: "#c0706a" },
    { label: "Pending",       value: orders.filter((o) => o.status==="pending").length,    icon: Clock,        color: "#d97706" },
    { label: "Completed",     value: orders.filter((o) => o.status==="completed").length,  icon: CheckCircle2, color: "#3d7a5e" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold" style={{ color: "var(--aira-dark)" }}>Hello, {userName} 👋</h1>
          <p className="text-sm mt-1" style={{ color: "var(--aira-text)", opacity: 0.55 }}>Here are your gift orders.</p>
        </div>
        <Link href="/customer/dashboard/new-order"
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium text-white hover:scale-105 transition-all"
          style={{ background: "#c0706a", boxShadow: "0 4px 16px rgba(192,112,106,0.3)" }}>
          <PlusCircle size={15} /> New Request
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="card-premium p-5">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ background: `${s.color}15` }}>
              <s.icon size={17} style={{ color: s.color }} />
            </div>
            <div className="text-2xl font-semibold font-display" style={{ color: "var(--aira-dark)" }}>{s.value}</div>
            <div className="text-xs mt-0.5" style={{ color: "var(--aira-text)", opacity: 0.55 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Orders */}
      <div className="card-premium overflow-hidden">
        <div className="px-6 py-4 border-b" style={{ borderColor: "hsl(var(--border))" }}>
          <h2 className="font-semibold text-base" style={{ color: "var(--aira-dark)" }}>My Orders</h2>
        </div>
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-6 h-6 border-2 rounded-full animate-spin" style={{ borderColor: "#c0706a", borderTopColor: "transparent" }} />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16">
            <Package size={36} className="mx-auto mb-3 opacity-20" />
            <p className="text-sm mb-4" style={{ color: "var(--aira-text)", opacity: 0.4 }}>No orders yet</p>
            <Link href="/customer/dashboard/new-order"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium text-white"
              style={{ background: "#c0706a" }}>
              <PlusCircle size={14} /> Place Your First Request
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid hsl(var(--border))", background: "hsl(var(--muted))" }}>
                  {["Order No","Event","Category","Budget","Event Date","Status"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest" style={{ color: "#c0706a" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((o, i) => (
                  <tr key={o.id} style={{ borderBottom: i < orders.length-1 ? "1px solid hsl(var(--border))" : "none" }}
                    className="hover:bg-rose-50/40 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs" style={{ color: "#c0706a" }}>{o.order_no}</td>
                    <td className="px-4 py-3" style={{ color: "var(--aira-text)", opacity: 0.7 }}>{o.event_type}</td>
                    <td className="px-4 py-3" style={{ color: "var(--aira-text)", opacity: 0.7 }}>{o.item_category}</td>
                    <td className="px-4 py-3 font-medium" style={{ color: "var(--aira-dark)" }}>₹{o.budget_max.toLocaleString("en-IN")}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: "var(--aira-text)", opacity: 0.6 }}>
                      {new Date(o.event_date).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold capitalize"
                        style={{ background: STATUS_BG[o.status]??"#f3f4f6", color: STATUS_COLORS[o.status]??"#374151" }}>
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}