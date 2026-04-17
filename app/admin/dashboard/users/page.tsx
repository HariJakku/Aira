"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Search, Users } from "lucide-react";

const ROLES = ["All", "customer", "employee", "vendor", "admin"];

const ROLE_COLORS: Record<string, string> = {
  admin: "#3b5f8a",
  employee: "#8B7355",
  vendor: "#3d7a5e",
  customer: "#c0706a",
};

type Profile = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  created_at: string;
};

export default function AdminUsersPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  useEffect(() => {
    async function load() {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, email, phone, role, created_at");

      console.log("DATA:", data);
      console.log("ERROR:", error);

      setProfiles((data as Profile[]) ?? []);
      setLoading(false);
    }

    load();
  }, []);

  const filtered = profiles.filter((p) => {
    const matchSearch =
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.email?.toLowerCase().includes(search.toLowerCase());

    const matchRole =
      roleFilter === "All" || p.role === roleFilter;

    return matchSearch && matchRole;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold">Users</h1>
        <p className="text-sm text-gray-500 mt-1">
          All registered platform users.
        </p>
      </div>

      {/* Empty State */}
      {profiles.length === 0 && !loading && (
        <div className="p-4 rounded-lg bg-blue-100 text-blue-800 text-sm">
          No users yet. Ask users to register from the portal.
        </div>
      )}

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full border rounded-lg pl-9 pr-3 py-2 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {ROLES.map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className="px-3 py-1.5 rounded-full text-xs font-medium border capitalize"
              style={{
                background:
                  roleFilter === r
                    ? ROLE_COLORS[r] ?? "#d4a373"
                    : "white",
                color: roleFilter === r ? "#fff" : "#333",
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <table className="w-full text-sm">
            
            {/* Table Head */}
            <thead className="bg-gray-100 text-xs uppercase">
              <tr>
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3">Email</th>
                <th className="text-left px-4 py-3">Phone</th>
                <th className="text-left px-4 py-3">Role</th>
                <th className="text-left px-4 py-3">Joined</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10">
                    <Users size={28} className="mx-auto mb-2 opacity-20" />
                    <p className="text-gray-400 text-sm">
                      No users found
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((p, i) => (
                  <tr
                    key={p.id}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 font-medium">
                      {p.name || "—"}
                    </td>

                    <td className="px-4 py-3 text-gray-600">
                      {p.email || "—"}
                    </td>

                    <td className="px-4 py-3 text-gray-600">
                      {p.phone || "—"}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className="px-2 py-1 rounded text-xs font-semibold capitalize"
                        style={{
                          background: `${ROLE_COLORS[p.role]}20`,
                          color: ROLE_COLORS[p.role] || "#555",
                        }}
                      >
                        {p.role}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-xs text-gray-500">
                      {new Date(p.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>

          </table>
        )}
      </div>
    </div>
  );
}