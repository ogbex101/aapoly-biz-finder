import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ADMIN_EMAIL, isSupabaseConfigured, supabase } from "./supabaseClient";

export type AuthRole = "admin" | "user";

export type SessionUser = {
  id: string;
  email: string;
  full_name: string;
  role: AuthRole;
  is_verified: boolean;
};

type AuthContextValue = {
  user: SessionUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<SessionUser>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    // Listen for Supabase auth state changes
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      if (!session?.user) {
        setUser(null);
        return;
      }
      const su = session.user;
      const sessionUser: SessionUser = {
        id: su.id,
        email: su.email ?? "",
        full_name: (su.user_metadata?.full_name as string) ?? su.email?.split("@")[0] ?? "",
        role: su.email === ADMIN_EMAIL ? "admin" : "user",
        is_verified: Boolean(su.email_confirmed_at),
      };
      setUser(sessionUser);
    });

    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        const su = data.session.user;
        setUser({
          id: su.id,
          email: su.email ?? "",
          full_name: (su.user_metadata?.full_name as string) ?? su.email?.split("@")[0] ?? "",
          role: su.email === ADMIN_EMAIL ? "admin" : "user",
          is_verified: Boolean(su.email_confirmed_at),
        });
      }
      setLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      async signIn(email, password) {
        if (!isSupabaseConfigured) {
          throw new Error("Supabase is not configured. Check your environment variables.");
        }

        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;

        // Admin bypasses email verification requirement
        const isAdmin = data.user?.email === ADMIN_EMAIL;
        if (!isAdmin && !data.user?.email_confirmed_at) {
          await supabase.auth.signOut();
          throw new Error("Please confirm your email address before logging in.");
        }

        const sessionUser: SessionUser = {
          id: data.user!.id,
          email: data.user!.email ?? "",
          full_name:
            (data.user!.user_metadata?.full_name as string) ??
            email.split("@")[0],
          role: isAdmin ? "admin" : "user",
          is_verified: true,
        };
        setUser(sessionUser);
        return sessionUser;
      },
      async signUp(email, password, fullName) {
        if (!isSupabaseConfigured) {
          throw new Error("Supabase is not configured. Check your environment variables.");
        }
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo:
              typeof window !== "undefined" ? window.location.origin : undefined,
          },
        });
        if (error) throw error;
      },
      async signOut() {
        setUser(null);
        if (isSupabaseConfigured) await supabase.auth.signOut();
      },
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
