/**
 * Auth context for the campus listings app.
 *
 * Implements the project spec's "admin bypass" rule:
 *   - The hardcoded admin email (`ADMIN_EMAIL`) can log in with the
 *     hardcoded password (`ADMIN_PASSWORD`) regardless of Supabase email
 *     verification status, and is routed to /admin.
 *   - All other users log in via Supabase Auth and must have a confirmed
 *     email before reaching protected routes.
 *
 * NOTE: hardcoding a password in client code is insecure — done here only
 * because the spec explicitly required it. Swap for a DB role check before
 * production.
 */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  isSupabaseConfigured,
  supabase,
} from "./supabaseClient";

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

const STORAGE_KEY = "aapoly-mock-user";

function readStored(): SessionUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SessionUser) : null;
  } catch {
    return null;
  }
}

function writeStored(u: SessionUser | null) {
  if (typeof window === "undefined") return;
  if (u) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
  else window.localStorage.removeItem(STORAGE_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hydrate from localStorage (covers both mock mode and admin-bypass mode).
    setUser(readStored());

    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    // When real keys are present, listen for Supabase session changes too.
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      if (!session?.user) {
        // If we previously logged in via admin bypass, keep that user.
        const stored = readStored();
        if (!stored) setUser(null);
        return;
      }
      const su = session.user;
      const sessionUser: SessionUser = {
        id: su.id,
        email: su.email ?? "",
        full_name: (su.user_metadata?.full_name as string) ?? "",
        role: su.email === ADMIN_EMAIL ? "admin" : "user",
        is_verified:
          su.email === ADMIN_EMAIL ? true : Boolean(su.email_confirmed_at),
      };
      writeStored(sessionUser);
      setUser(sessionUser);
    });

    supabase.auth.getSession().finally(() => setLoading(false));
    return () => sub.subscription.unsubscribe();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      async signIn(email, password) {
        // === ADMIN BYPASS ===
        // Hardcoded credentials skip Supabase entirely and skip email
        // verification. Result: instant access to /admin.
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
          const adminUser: SessionUser = {
            id: "admin-local",
            email: ADMIN_EMAIL,
            full_name: "Daniel Ogbeifun",
            role: "admin",
            is_verified: true,
          };
          writeStored(adminUser);
          setUser(adminUser);
          return adminUser;
        }

        if (!isSupabaseConfigured) {
          // Mock mode: accept any email/password as a regular verified user.
          const mock: SessionUser = {
            id: "mock-" + email,
            email,
            full_name: email.split("@")[0],
            role: "user",
            is_verified: true,
          };
          writeStored(mock);
          setUser(mock);
          return mock;
        }

        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        if (!data.user?.email_confirmed_at) {
          throw new Error(
            "Please confirm your email address before logging in.",
          );
        }
        const sessionUser: SessionUser = {
          id: data.user.id,
          email: data.user.email ?? "",
          full_name:
            (data.user.user_metadata?.full_name as string) ??
            email.split("@")[0],
          role: "user",
          is_verified: true,
        };
        writeStored(sessionUser);
        setUser(sessionUser);
        return sessionUser;
      },
      async signUp(email, password, fullName) {
        if (!isSupabaseConfigured) {
          // Mock signup — pretend an email was sent.
          return;
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
        writeStored(null);
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