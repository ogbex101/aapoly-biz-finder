import { createFileRoute } from "@tanstack/react-router";
import { ListChecks, Clock, Users, Tags } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { mockListings, mockUsers, mockCategories } from "@/lib/mockData";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

function AdminOverview() {
  const total = mockListings.length;
  const pending = mockListings.filter((l) => l.status === "pending").length;
  const users = mockUsers.length;
  const cats = mockCategories.length;

  const stats = [
    { label: "Total Listings", value: total, icon: ListChecks, color: "text-blue-600" },
    { label: "Pending Approvals", value: pending, icon: Clock, color: "text-amber-600" },
    { label: "Total Users", value: users, icon: Users, color: "text-emerald-600" },
    { label: "Categories", value: cats, icon: Tags, color: "text-violet-600" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Dashboard Overview</h2>
        <p className="text-sm text-muted-foreground">
          High-level summary of the campus directory.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
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
          <ul className="space-y-2 text-sm">
            {mockListings.slice(0, 5).map((l) => (
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
        </CardContent>
      </Card>
    </div>
  );
}