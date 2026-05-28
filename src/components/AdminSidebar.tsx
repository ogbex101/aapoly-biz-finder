import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  ListChecks,
  Users,
  Tags,
  LogOut,
  Home,
  BarChart3,
  Flag,
  Settings,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

const links: Array<{
  to:
    | "/admin"
    | "/admin/listings"
    | "/admin/users"
    | "/admin/categories"
    | "/admin/analytics"
    | "/admin/reports"
    | "/admin/settings";
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
}> = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/listings", label: "Manage Listings", icon: ListChecks },
  { to: "/admin/users", label: "Manage Users", icon: Users },
  { to: "/admin/categories", label: "Categories", icon: Tags },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/reports", label: "Reports", icon: Flag },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r bg-sidebar text-sidebar-foreground md:flex">
      <div className="flex h-16 items-center gap-2 border-b px-6 font-semibold">
        <span className="grid h-8 w-8 place-items-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
          AA
        </span>
        Admin Console
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {links.map((l) => {
          const active = l.exact ? path === l.to : path.startsWith(l.to);
          return (
            <Link
              key={l.to}
              to={l.to}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "hover:bg-sidebar-accent/50",
              )}
            >
              <l.icon className="h-4 w-4" />
              {l.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-4 text-xs text-muted-foreground">
        <div className="mb-3 truncate">Signed in as {user?.email}</div>
        <div className="flex flex-col gap-1">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-sidebar-accent/50"
          >
            <Home className="h-4 w-4" /> Back to site
          </Link>
          <button
            onClick={async () => {
              await signOut();
              navigate({ to: "/" });
            }}
            className="flex items-center gap-2 rounded-md px-2 py-1.5 text-left hover:bg-sidebar-accent/50"
          >
            <LogOut className="h-4 w-4" /> Log out
          </button>
        </div>
      </div>
    </aside>
  );
}