import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { createClient } from "@/lib/supabase/server";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  if (!supabase) redirect("/admin/access-pending");

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const [{ data: profile }, { data: assignments }] = await Promise.all([
    supabase.from("cms_admin_profiles").select("display_name").eq("user_id", user.id).maybeSingle(),
    supabase.from("cms_role_assignments").select("role").eq("user_id", user.id).is("revoked_at", null),
  ]);

  if (!profile || !assignments || assignments.length === 0) redirect("/admin/access-pending");

  return <AdminShell email={user.email ?? profile.display_name}>{children}</AdminShell>;
}
