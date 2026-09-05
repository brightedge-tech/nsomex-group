import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { config } from "@/lib/config";

let browserClient: SupabaseClient | null = null;

export function getSupabaseBrowserClient() {
  if (!config.supabaseConfigured) return null;
  if (!browserClient) {
    browserClient = createBrowserClient(config.supabaseUrl, config.supabaseAnonKey);
  }
  return browserClient;
}
