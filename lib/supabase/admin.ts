import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getServerConfig } from "@/lib/config/server";

export function getSupabaseAdminClient(): SupabaseClient {
  const serverConfig = getServerConfig();
  if (!serverConfig.supabaseUrl || !serverConfig.supabaseServiceRoleKey) {
    throw new Error("Supabase admin access requires server-only Supabase URL and service-role key.");
  }

  return createClient(serverConfig.supabaseUrl, serverConfig.supabaseServiceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
