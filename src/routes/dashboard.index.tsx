import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Eye,
  Store,
  Heart,
  MessageSquare,
  TrendingUp,
  Plus,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { mockListings, mockMessages, mockFavorites } from "@/lib/mockData";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardOverview,
});

function DashboardOverview() {
  const { user } = useAuth();
  const my = mockListings.slice(0, 3);

  const stats = [
    { label: "My Listings", value: my.length, icon: Store, color: "text-blue-600" },
    { label: "Total Views", value: 1284, icon: Eye, color: "text-emerald-600" },
    { label: "Saved", value: mockFavorites.length, icon: Heart, color: "text-rose-600" },
    { label: "Messages", value: mockMessages.length, icon: MessageSquare, color: "text-violet-600" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">
            Welcome back, {user?.full_name?.split(" ")[0] ?? "there"} 👋
          </h2>
          <p className="text-sm text-muted-foreground">
            Here's what's happening with your campus business today.
          </p>
        </div>
        <Button asChild>
          <Link to="/dashboard/listings">
            <Plus className="mr-1 h-4 w-4" /> Add listing
          </Link>
        </Button>
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

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">Recent activity</h3>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
            <ul className="space-y-3 text-sm">
              {my.map((l) => (
                <li
                  key={l.id}
                  className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium">{l.business_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {l.category}
                    </p>
                  </div>
                  <Badge variant={l.status === "approved" ? "default" : "secondary"}>
                    {l.status}
                  </Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">Latest messages</h3>
              <Link to="/dashboard/messages" className="text-xs text-primary hover:underline">
                View all
              </Link>
            </div>
            <ul className="space-y-3 text-sm">
              {mockMessages.slice(0, 3).map((m) => (
                <li key={m.id} className="border-b pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{m.from_name}</p>
                    {m.unread && <Badge>New</Badge>}
                  </div>
                  <p className="line-clamp-1 text-xs text-muted-foreground">
                    {m.preview}
                  </p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}