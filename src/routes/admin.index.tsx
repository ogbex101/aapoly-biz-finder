import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ListChecks, Clock, Users, Tags, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabaseClient";
import type { Listing } from "@/lib/mockData";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

function AdminOverview() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    users: 0,
    categories: 0,
  });
  const [recent, setRecent] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from("listings").select("id", { count: "exact", head: true }),
      supabase.from("listings").select("id", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("categories").select("id", { count: "exact", head: true }),
      supabase.from("listings").select("*").order("created_at", { ascending: false }).limit(5),
    ]).then(([total, pending, users, cats, recentRes]) => {
      setStats({
        total: total.count ?? 0,
        pending: pending.count ?? 0,
        users: users.count ?? 0,
        categories: cats.count ?? 0,
      });
      setRecent((recentRes.data ?? []) as Listing[]);
      setLoading(false);
    });
  }, []);

  const statCards = [
    { label: "Total Listings", value: stats.total, icon: ListChecks, color: "text-blue-600" },
    { label: "Pending Approvals", value: stats.pending, icon: Clock, color: "text-amber-600" },
    { label: "Total Users", value: stats.users, icon: Users, color: "text-emerald-600" },
    { label: "Categories", value: stats.categories, icon: Tags, color: "text-violet-600" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Dashboard Overview</h2>
        <p className="text-sm text-muted-foreground">
          High-level summary of the campus directory.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map((s) => (
              <Card key={s.label}>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{s.label}</p>
                      <p className="mt-1 text-3xl font-bold">{s.value}</p>
                    </div>
                    <s.icon className={`h-8 w-8 ${s.color}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardContent className="p-6">
              <h3 className="mb-3 font-semibold">Recent activity</h3>
              {recent.length === 0 ? (
                <p className="text-sm text-muted-foreground">No listings yet.</p>
              ) : (
                <ul className="space-y-2 text-sm">
                  {recent.map((l) => (
                    <li
                      key={l.id}
                      className="flex items-center justify-between border-b py-2 last:border-0"
                    >
                      <span>
                        <span className="font-medium">{l.business_name}</span> ·{" "}
                        <span className="text-muted-foreground">{l.category}</span>
                      </span>
                      <span className="text-xs capitalize text-muted-foreground">
                        {l.status}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
