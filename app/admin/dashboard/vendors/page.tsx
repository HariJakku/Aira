"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Search, CheckCircle2, XCircle, Filter } from "lucide-react";

const ALL_CATEGORIES = ["All","Lifestyle","Eatable","Accessories","Artifact","Toy","Combo","Others"];

type Vendor = {
  id: string; business_name: string; categories: string[];
  city: string | null; is_verified: boolean; total_orders: number;
  profiles: { full_name: string; phone: string | null; };
};

export default function AdminVendorsPage() {
  const [vendors,    setVendors]    = useState<Vendor[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState("");
  const [catFilter,  setCatFilter]  = useState("All");

  async function load() {
    const supabase = createClient();
    const { data } = await supabase
      .from("vendors")
      .select("id,business_name,categories,city,is_verified,total_orders,profiles(full_name,phone)")
      .order("is_verified", { ascending: true });
    setVendors((data as unknown as Vendor[]) ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function toggleVerify(id: string, current: boolean) {
    const supabase = createClient();
    await supabase.from("vendors").update({ is_verified: !current }).eq("id", id);
    setVendors((v) => v.map((vendor) => vendor.id === id ? { ...vendor, is_verified: !current } : vendor));
  }

  const filtered = vendors.filter((v) => {
    const matchSearch = v.business_name.toLowerCase().includes(search.toLowerCase()) ||
      v.profiles?.full_name?.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === "All" || v.categories.includes(catFilter);
    return matchSearch && matchCat;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold" style={{ color: "var(--aira-dark)" }}>Vendors</h1>
        <p className="text-sm mt-1" style={{ color: "var(--aira-text)", opacity: 0.55 }}>Manage vendor accounts, categories and verification.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40" />
          <input type="text" placeholder="Search vendors..." className="input-premium pl-10"
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={14} style={{ color: "var(--aira-gold)" }} />
          {ALL_CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setCatFilter(cat)}
              className="px-3 py-1.5 rounded-full text-xs font-medium border transition-all"
              style={{
                background: catFilter === cat ? "var(--aira-gold)" : "white",
                borderColor: catFilter === cat ? "var(--aira-gold)" : "hsl(var(--border))",
                color: catFilter === cat ? "#fff" : "var(--aira-text)",
              }}>
              {cat}
            </button>
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
                  {["Business","Owner","City","Categories","Orders","Verified","Action"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--aira-gold)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-10 text-sm" style={{ color: "var(--aira-text)", opacity: 0.4 }}>No vendors found</td></tr>
                ) : filtered.map((v, i) => (
                  <tr key={v.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid hsl(var(--border))" : "none" }}
                    className="hover:bg-amber-50/30 transition-colors">
                    <td className="px-4 py-3 font-medium" style={{ color: "var(--aira-dark)" }}>{v.business_name}</td>
                    <td className="px-4 py-3" style={{ color: "var(--aira-text)", opacity: 0.7 }}>{v.profiles?.full_name}</td>
                    <td className="px-4 py-3" style={{ color: "var(--aira-text)", opacity: 0.6 }}>{v.city ?? "—"}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {v.categories.map((c) => (
                          <span key={c} className="px-2 py-0.5 rounded-full text-xs font-medium"
                            style={{ background: "var(--aira-gold-pale)", color: "var(--aira-gold)" }}>{c}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold" style={{ color: "var(--aira-dark)" }}>{v.total_orders}</td>
                    <td className="px-4 py-3">
                      {v.is_verified
                        ? <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: "#3d7a5e" }}><CheckCircle2 size={13} /> Verified</span>
                        : <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: "#c0706a" }}><XCircle size={13} /> Pending</span>}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleVerify(v.id, v.is_verified)}
                        className="px-3 py-1 rounded-lg text-xs font-semibold text-white transition-all hover:scale-105"
                        style={{ background: v.is_verified ? "#c0706a" : "#3d7a5e" }}>
                        {v.is_verified ? "Revoke" : "Verify"}
                      </button>
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