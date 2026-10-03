import type { User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { UserRole } from "@/lib/mock-auth";
import { loginSchema, registrationSchema } from "@/lib/validation";

export interface SupabaseProfile {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  country: string | null;
  company: string | null;
  role: Exclude<UserRole, "guest">;
  status: string;
  verification_status: string;
}

export const authService = {
  isConfigured: () => Boolean(getSupabaseBrowserClient()),
  async getCurrentUser() {
    const client = getSupabaseBrowserClient();
    if (!client) return { user: null, profile: null, error: null };
    const { data: { user }, error } = await client.auth.getUser();
    if (error || !user) return { user: null, profile: null, error };
    const { data: profile, error: profileError } = await client.from("profiles").select("id,full_name,email,phone,country,company,role,status,verification_status").eq("id", user.id).maybeSingle<SupabaseProfile>();
    return { user, profile, error: profileError ?? (!profile ? new Error("Account profile is unavailable.") : null) };
  },
  async signIn(email: string, password: string) {
    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) return { user: null, profile: null, error: new Error("Enter a valid email and password.") };
    const client = getSupabaseBrowserClient();
    if (!client) return { user: null, profile: null, error: new Error("Supabase is not configured.") };
    const { data, error } = await client.auth.signInWithPassword(parsed.data);
    if (error || !data.user) return { user: null, profile: null, error: error ?? new Error("Unable to sign in.") };
    const current = await this.getCurrentUser();
    return { user: data.user, profile: current.profile, error: current.error };
  },
  async signUp(input: { email: string; password: string; name: string; company: string; country: string; phone?: string; role: "buyer" | "supplier" }) {
    const parsed = registrationSchema.safeParse({ email: input.email, password: input.password, name: input.name, company: input.company, country: input.country });
    if (!parsed.success) return { user: null, profile: null, error: new Error("Check the registration details and try again."), emailConfirmationRequired: false };
    const client = getSupabaseBrowserClient();
    if (!client) return { user: null, profile: null, error: new Error("Supabase is not configured."), emailConfirmationRequired: false };
    const origin = typeof window === "undefined" ? undefined : window.location.origin;
    const { data, error } = await client.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: origin ? `${origin}/verify-account` : undefined,
        data: { full_name: input.name.trim(), company: input.company.trim(), country: input.country.trim(), phone: input.phone?.trim() ?? null, role: input.role },
      },
    });
    if (error || !data.user) return { user: null, profile: null, error: error ?? new Error("Unable to register."), emailConfirmationRequired: false };
    const current = data.session ? await this.getCurrentUser() : { profile: null, error: null };
    return { user: data.user, profile: current.profile, error: current.error, emailConfirmationRequired: !data.session };
  },
  async signOut() {
    const client = getSupabaseBrowserClient();
    return client ? client.auth.signOut() : { error: null };
  },
  async requestPasswordReset(email: string) {
    const client = getSupabaseBrowserClient();
    if (!client) return { error: new Error("Supabase is not configured.") };
    const origin = typeof window === "undefined" ? undefined : window.location.origin;
    return client.auth.resetPasswordForEmail(email, { redirectTo: origin ? `${origin}/reset-password` : undefined });
  },
  async resendSignupVerification(email: string) {
    const client = getSupabaseBrowserClient();
    if (!client) return { error: new Error("Supabase is not configured.") };
    return client.auth.resend({ type: "signup", email });
  },
  async updatePassword(password: string) {
    const client = getSupabaseBrowserClient();
    if (!client) return { error: new Error("Supabase is not configured.") };
    return client.auth.updateUser({ password });
  },
  onAuthStateChange(callback: (user: User | null) => void) {
    const client = getSupabaseBrowserClient();
    if (!client) return { unsubscribe: () => undefined };
    const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => callback(session?.user ?? null));
    return { unsubscribe: () => subscription.unsubscribe() };
  },
};
