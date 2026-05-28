/**
 * Supabase client.
 *
 * Paste your project URL + anon key into the two constants below (or set the
 * matching VITE_ env vars). Until then the app falls back to mock data so the
 * UI still renders and is fully navigable.
 *
 * Get these from: https://supabase.com/dashboard/project/_/settings/api
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) ?? "";
const SUPABASE_ANON_KEY =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ?? "";

export const isSupabaseConfigured =
  Boolean(SUPABASE_URL) && Boolean(SUPABASE_ANON_KEY);

// When not configured, we still export a client pointed at a dummy URL so
// imports never crash. Guard real calls with `isSupabaseConfigured`.
export const supabase: SupabaseClient = createClient(
  SUPABASE_URL || "https://placeholder.supabase.co",
  SUPABASE_ANON_KEY || "placeholder-anon-key",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storageKey: "aapoly-campus-auth",
    },
  },
);

/** Hardcoded admin per project spec. Used for the admin-bypass login path. */
export const ADMIN_EMAIL = "ogbeifundaniel0@gmail.com";
export const ADMIN_PASSWORD = "Ogbeifun@2005";