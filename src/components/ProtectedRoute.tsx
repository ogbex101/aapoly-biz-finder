/**
 * Client-side route guard.
 *
 * Rules (from project spec):
 *  - Not logged in            → redirect to /login
 *  - requireAdmin && !admin   → redirect to /dashboard
 *  - Admin email visiting /dashboard → bounce to /admin
 *  - Non-verified user        → redirect to /login (with a message)
 */
import { useEffect, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { ADMIN_EMAIL } from "@/lib/supabaseClient";

export function ProtectedRoute({
  children,
  requireAdmin = false,
}: {
  children: ReactNode;
  requireAdmin?: boolean;
}) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate({ to: "/login" });
      return;
    }
    if (!user.is_verified) {
      navigate({ to: "/login" });
      return;
    }
    if (requireAdmin && user.role !== "admin") {
      navigate({ to: "/dashboard" });
      return;
    }
    if (!requireAdmin && user.email === ADMIN_EMAIL) {
      navigate({ to: "/admin" });
    }
  }, [user, loading, requireAdmin, navigate]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        Loading…
      </div>
    );
  }
  return <>{children}</>;
}