import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { fail, ok } from "@/lib/types/api";

export const profileUpdateSchema = z.object({
  full_name: z.string().trim().min(2).max(120).optional(),
  phone: z.string().trim().max(40).optional().nullable(),
  country: z.string().trim().min(2).max(100).optional().nullable(),
  preferred_language: z.string().trim().min(2).max(12).optional(),
  company: z.string().trim().max(160).optional().nullable(),
}).strict();

export const profileService = {
  async getCurrent() {
    const client = await getSupabaseServerClient();
    if (!client) return fail({ code: "UNAUTHORIZED" as const, message: "Sign in to view your profile." });
    const { data: { user }, error: authError } = await client.auth.getUser();
    if (authError || !user) return fail({ code: "UNAUTHORIZED" as const, message: "Sign in to view your profile." });
    const { data, error } = await client.from("profiles")
      .select("id,full_name,email,phone,country,preferred_language,company,avatar_url,role,status,verification_status,created_at,updated_at")
      .eq("id", user.id).maybeSingle();
    if (error) return fail({ code: "SERVER" as const, message: "Profile information is temporarily unavailable." });
    if (!data) return fail({ code: "NOT_FOUND" as const, message: "Your profile could not be found." });
    return ok(data);
  },

  async updateCurrent(input: unknown) {
    const parsed = profileUpdateSchema.safeParse(input);
    if (!parsed.success) return fail({ code: "VALIDATION" as const, message: "Check the profile fields and try again." });
    const client = await getSupabaseServerClient();
    if (!client) return fail({ code: "UNAUTHORIZED" as const, message: "Sign in to update your profile." });
    const { data: { user }, error: authError } = await client.auth.getUser();
    if (authError || !user) return fail({ code: "UNAUTHORIZED" as const, message: "Sign in to update your profile." });
    const { data, error } = await client.from("profiles")
      .update(parsed.data)
      .eq("id", user.id)
      .select("id,full_name,email,phone,country,preferred_language,company,avatar_url,role,status,verification_status,created_at,updated_at")
      .maybeSingle();
    if (error || !data) return fail({ code: "SERVER" as const, message: "Profile could not be updated." });
    return ok(data);
  },
};
