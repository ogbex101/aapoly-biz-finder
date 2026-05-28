import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Eye, Users, Store } from "lucide-react";
import { mockListings, mockUsers, mockCategories } from "@/lib/mockData";

export const Route = createFileRoute("/admin/analytics")({
  component: Analytics,
});

function Analytics() {
  const stats = [
    { label: "Total Views (30d)", value: "12.4K", icon: Eye, trend: "+18%" },
    { label: "New Signups (30d)", value: mockUsers.length, icon: Users, trend: "+5%" },
    { label: "Active Listings", value: mockListings.filter((l) => l.status === "approved").length, icon: Store, trend: "+12%" },
    { label: "Engagement", value: "67%", icon: TrendingUp, trend: "+4%" },
  ];

  // Simple bars per category (count of listings).
  const byCategory = mockCategories.map((c) => ({
    name: c.name,
    count: mockListings.filter((l) => l.category === c.name).length,
  }));
  const max = Math.max(1, ...byCategory.map((b) => b.count));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Analytics</h2>
        <p className="text-sm text-muted-foreground">
          Platform performance and engagement insights.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <s.icon className="h-5 w-5 text-muted-foreground" />
                <span className="text-xs font-medium text-emerald-600">
                  {s.trend}
                </span>
              </div>
              <p className="mt-3 text-2xl font-bold">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-6">
          <h3 className="mb-4 font-semibold">Listings by category</h3>
          <div className="space-y-3">
            {byCategory.map((b) => (
              <div key={b.name} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{b.name}</span>
                  <span className="text-muted-foreground">{b.count}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${(b.count / max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}