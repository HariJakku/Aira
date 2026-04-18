"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Search, Filter } from "lucide-react";

const STATUS_LIST = ["All","pending","processing","completed","cancelled"];
const CAT_LIST    = ["All","Lifestyle","Eatable","Accessories","Artifact","Toy","Combo","Others"];
const EVENT_LIST  = ["All","Birthday","Marriage","Housewarming","Others"];

const STATUS_COLORS: Record<string,string> = { pending:"#d97706", processing:"#3b5f8a", completed:"#3d7a5e", cancelled:"#c0706a" };
const STATUS_BG:     Record<string,string> = { pending:"#fef3c7", processing:"#dbeafe", completed:"#d1fae5", cancelled:"#fee2e2" };

type Order = {
  id: string; order_no: string; customer_name: string; event_type: string;
  item_category: string; budget_min: number; budget_max: number; status: string;
  created_at: string; city: string; payment_mode: string; advance_payment: number;
};

export default function AdminOrdersPage() {
  const [orders,  setOrders]  = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState("");
  const [status,  setStatus]  = useState("All");
  const [cat,     setCat]     = useState("All");
  const [event,   setEvent]   = useState("All");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      setOrders((data as Order[]) ?? []);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = orders.filter((o) => {
    const matchSearch = o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      o.order_no.toLowerCase().includes(search.toLowerCase());
    const matchStatus = status === "All" || o.status === status;
    const matchCat    = cat    === "All" || o.item_category === cat;
    const matchEvent  = event  === "All" || o.event_type    === event;
    return matchSearch && matchStatus && matchCat && matchEvent;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold" style={{ color: "var(--aira-dark)" }}>All Orders</h1>
        <p className="text-sm mt-1" style={{ color: "var(--aira-text)", opacity: 0.55 }}>
          {orders.length} total orders · {filtered.length} showing
        </p>
      </div>

      {/* Filters */}
      <div className="card-premium p-4 space-y-3">
        <div className="relative">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40" />
          <input type="text" placeholder="Search by order no or customer..." className="input-premium pl-10"
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1 mr-2">
            <Filter size={12} style={{ color: "var(--aira-gold)" }} />
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--aira-gold)" }}>Status</span>
          </div>
          {STATUS_LIST.map((s) => (
            <button key={s} onClick={() => setStatus(s)}
              className="px-3 py-1 rounded-full text-xs font-medium border capitalize transition-all"
              style={{
                background: status === s ? (STATUS_BG[s] ?? "var(--aira-gold)") : "white",
                borderColor: status === s ? (STATUS_COLORS[s] ?? "var(--aira-gold)") : "hsl(var(--border))",
                color: status === s ? (STATUS_COLORS[s] ?? "#fff") : "var(--aira-text)",
              }}>{s}</button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1 mr-2">
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--aira-gold)" }}>Category</span>
          </div>
          {CAT_LIST.map((c) => (
            <button key={c} onClick={() => setCat(c)}
              className="px-3 py-1 rounded-full text-xs font-medium border transition-all"
              style={{
                background: cat === c ? "var(--aira-gold)" : "white",
                borderColor: cat === c ? "var(--aira-gold)" : "hsl(var(--border))",
                color: cat === c ? "#fff" : "var(--aira-text)",
              }}>{c}</button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1 mr-2">
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--aira-gold)" }}>Event</span>
          </div>
          {EVENT_LIST.map((e) => (
            <button key={e} onClick={() => setEvent(e)}
              className="px-3 py-1 rounded-full text-xs font-medium border transition-all"
              style={{
                background: event === e ? "var(--aira-gold)" : "white",
                borderColor: event === e ? "var(--aira-gold)" : "hsl(var(--border))",
                color: event === e ? "#fff" : "var(--aira-text)",
              }}>{e}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card-premium overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="w-6 h-6 border-2 rounded-full animate-spin" style={{ borderColor: "var(--aira-gold)", borderTopColor: "transparent" }} />
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid hsl(var(--border))", background: "hsl(var(--muted))" }}>
                  {["Order","Customer","Event","Category","Budget","Advance","City","Status","Date","Action"].map((h) => (
                    <th key={h} className="text-left px-3 py-3 text-xs font-semibold uppercase tracking-widest whitespace-nowrap" style={{ color: "var(--aira-gold)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={10} className="text-center py-10 text-sm" style={{ color: "var(--aira-text)", opacity: 0.4 }}>No orders match filters</td></tr>
                ) : filtered.map((o, i) => (
                  <tr key={o.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid hsl(var(--border))" : "none" }}
                    className="hover:bg-amber-50/30 transition-colors">
                    <td className="px-3 py-3 font-mono text-xs" style={{ color: "var(--aira-gold)" }}>{o.order_no}</td>
                    <td className="px-3 py-3 font-medium whitespace-nowrap" style={{ color: "var(--aira-dark)" }}>{o.customer_name}</td>
                    <td className="px-3 py-3 whitespace-nowrap" style={{ color: "var(--aira-text)", opacity: 0.7 }}>{o.event_type}</td>
                    <td className="px-3 py-3" style={{ color: "var(--aira-text)", opacity: 0.7 }}>{o.item_category}</td>
                    <td className="px-3 py-3 whitespace-nowrap font-medium" style={{ color: "var(--aira-dark)" }}>
                      ₹{o.budget_min.toLocaleString("en-IN")}–{o.budget_max.toLocaleString("en-IN")}
                    </td>
                    <td className="px-3 py-3 font-medium" style={{ color: "var(--aira-dark)" }}>₹{o.advance_payment.toLocaleString("en-IN")}</td>
                    <td className="px-3 py-3" style={{ color: "var(--aira-text)", opacity: 0.6 }}>{o.city}</td>
                    <td className="px-3 py-3">
                      <span className="px-2 py-1 rounded-full text-xs font-semibold capitalize whitespace-nowrap"
                        style={{ background: STATUS_BG[o.status]??"#f3f4f6", color: STATUS_COLORS[o.status]??"#374151" }}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-xs whitespace-nowrap" style={{ color: "var(--aira-text)", opacity: 0.5 }}>
                      {new Date(o.created_at).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-3 py-3">
                      <select
                        onChange={async (e) => {
                          const newStatus = e.target.value;
                          const supabase = createClient();
                          await supabase.from("orders").update({ status: newStatus }).eq("id", o.id);
                          setOrders((prev) =>
                            prev.map((ord) => ord.id === o.id ? { ...ord, status: newStatus } : ord)
                          );
                        }}
                        className="text-xs px-2 py-1 rounded-lg border cursor-pointer"
                        style={{ borderColor: "hsl(var(--border))", background: "white", color: "var(--aira-dark)" }}>
                        {["pending","processing","completed","cancelled"].map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}