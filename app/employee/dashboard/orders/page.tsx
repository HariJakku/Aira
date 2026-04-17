import type { Metadata } from "next";

export const metadata: Metadata = { title: "Orders List – AIRA Employee" };

export default function OrdersListPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold" style={{ color: "var(--aira-dark)" }}>
          Orders List
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--aira-text)", opacity: 0.55 }}>
          All submitted orders will appear here.
        </p>
      </div>
      <div
        className="rounded-2xl p-12 text-center"
        style={{ background: "#fff", border: "1px solid hsl(var(--border))" }}
      >
        <p style={{ color: "var(--aira-text)", opacity: 0.4 }} className="text-sm">
          Orders table — coming soon.
        </p>
      </div>
    </div>
  );
}
