import type { Metadata } from "next";

export const metadata: Metadata = { title: "Profile – AIRA Employee" };

export default function ProfilePage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold" style={{ color: "var(--aira-dark)" }}>
          My Profile
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--aira-text)", opacity: 0.55 }}>
          Manage your account details.
        </p>
      </div>
      <div
        className="rounded-2xl p-12 text-center"
        style={{ background: "#fff", border: "1px solid hsl(var(--border))" }}
      >
        <p style={{ color: "var(--aira-text)", opacity: 0.4 }} className="text-sm">
          Profile settings — coming soon.
        </p>
      </div>
    </div>
  );
}
