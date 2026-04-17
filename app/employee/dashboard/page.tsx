import Link from "next/link";
import { ClipboardList, ListOrdered, TrendingUp, Clock } from "lucide-react";

const stats = [
  { label: "Orders Today", value: "12", icon: ClipboardList, color: "#8B7355" },
  { label: "Pending", value: "5", icon: Clock, color: "#c0706a" },
  { label: "Completed", value: "7", icon: TrendingUp, color: "#3d7a5e" },
  { label: "Total Orders", value: "284", icon: ListOrdered, color: "#3b5f8a" },
];

export default function EmployeeDashboardPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold" style={{ color: "var(--aira-dark)" }}>
          Good morning 👋
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--aira-text)", opacity: 0.6 }}>
          Here&apos;s what&apos;s happening with your orders today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="card-premium p-5">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
              style={{ background: `${s.color}15` }}
            >
              <s.icon size={17} style={{ color: s.color }} />
            </div>
            <div className="text-2xl font-semibold font-display" style={{ color: "var(--aira-dark)" }}>
              {s.value}
            </div>
            <div className="text-xs mt-0.5" style={{ color: "var(--aira-text)", opacity: 0.55 }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Quick action */}
      <Link
        href="/employee/dashboard/take-order"
        className="flex items-center gap-4 p-6 rounded-2xl transition-all duration-200 hover:scale-[1.01] hover:shadow-lg"
        style={{
          background: "linear-gradient(135deg, var(--aira-dark) 0%, #2d2218 100%)",
          boxShadow: "0 4px 24px rgba(28,23,19,0.15)",
        }}
      >
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(139,115,85,0.3)" }}
        >
          <ClipboardList size={22} style={{ color: "var(--aira-gold-light)" }} />
        </div>
        <div className="flex-1">
          <div className="font-semibold text-white">Take a New Order</div>
          <div className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>
            Start the 7-step order form
          </div>
        </div>
        <div style={{ color: "var(--aira-gold-muted)" }}>→</div>
      </Link>
    </div>
  );
}
