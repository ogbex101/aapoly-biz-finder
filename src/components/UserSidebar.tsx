import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Store,
  Heart,
  MessageSquare,
  UserCircle,
  Settings,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links: Array<{
  to:
    | "/dashboard"
    | "/dashboard/listings"
    | "/dashboard/favorites"
    | "/dashboard/messages"
    | "/dashboard/profile"
    | "/dashboard/settings";
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
}> = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/dashboard/listings", label: "My Listings", icon: Store },
  { to: "/dashboard/favorites", label: "Saved", icon: Heart },
  { to: "/dashboard/messages", label: "Messages", icon: MessageSquare },
  { to: "/dashboard/profile", label: "Profile", icon: UserCircle },
  { to: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function UserSidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r bg-sidebar text-sidebar-foreground md:flex">
      <div className="flex h-16 items-center gap-2 border-b px-6 font-semibold">
        <span className="grid h-8 w-8 place-items-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
          AA
        </span>
        My Workspace
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
      <div className="border-t p-4">
        <Link
          to="/"
          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-sidebar-accent/50"
        >
          <Home className="h-4 w-4" /> Back to site
        </Link>
      </div>
    </aside>
  );
}