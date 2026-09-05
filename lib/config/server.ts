import "server-only";
import { config } from "@/lib/config";

export function getServerConfig() {
  return {
    ...config,
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  } as const;
}