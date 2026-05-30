import { Link, useNavigate } from "@tanstack/react-router";
import { Search, Plus, LogOut, LayoutDashboard, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/lib/auth";
import { defaultCategories } from "@/lib/mockData";

export function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center gap-4 px-4">
        <Link to="/" className="flex items-center gap-2 font-bold">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground">
            AA
          </span>
          <span className="hidden sm:inline">CampusBiz</span>
        </Link>

        <div className="relative ml-4 hidden flex-1 max-w-md md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter")
                navigate({ to: "/", search: { q } as never });
            }}
            placeholder="Search businesses…"
            className="pl-9"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="hidden md:inline-flex">
              Categories
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {defaultCategories.map((c) => (
              <DropdownMenuItem key={c.id}>{c.name}</DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          onClick={() => navigate({ to: user ? "/dashboard" : "/login" })}
          className="gap-2"
        >
          <Plus className="h-4 w-4" /> <span className="hidden sm:inline">Add Listing</span>
        </Button>

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-full outline-none ring-ring focus-visible:ring-2">
                <Avatar className="h-9 w-9">
                  <AvatarFallback>
                    {user.full_name?.slice(0, 2).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="truncate">
                {user.full_name}
                <div className="text-xs font-normal text-muted-foreground">
                  {user.email}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {user.role === "admin" && (
                <DropdownMenuItem onClick={() => navigate({ to: "/admin" })}>
                  <ShieldCheck className="mr-2 h-4 w-4" /> Admin Panel
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => navigate({ to: "/dashboard" })}>
                <LayoutDashboard className="mr-2 h-4 w-4" /> My Dashboard
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={async () => {
                  await signOut();
                  navigate({ to: "/" });
                }}
              >
                <LogOut className="mr-2 h-4 w-4" /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button variant="outline" onClick={() => navigate({ to: "/login" })}>
            Login
          </Button>
        )}
      </div>
    </header>
  );
}