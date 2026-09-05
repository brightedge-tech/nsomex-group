const isServer = typeof window === "undefined";

export const config = {
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? "NSOMEX Marketplace",
  appDescription: process.env.NEXT_PUBLIC_APP_DESCRIPTION ?? "B2B sourcing and procurement marketplace.",
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "",
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  supabaseConfigured: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  isDevelopment: process.env.NODE_ENV !== "production",
} as const;

if (isServer && config.isDevelopment && !config.apiUrl) {
  console.warn("[NSOMEX] NEXT_PUBLIC_API_URL is not configured; mock services are active.");
}

export function assertServerOnlySecret(name: string, value: string | undefined) {
  if (!isServer) throw new Error(`${name} is server-only and cannot be read in a client component.`);
  return value;
}

