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
    supabase.from("cms_role_assignments").select("role, division_id, revoked_at").eq("user_id", user.id).is("revoked_at", null),
  ]);

  if (!profile || !assignments || assignments.length === 0) redirect("/admin/access-pending");

  const divisionIds = [...new Set(assignments.map(item => item.division_id).filter((id): id is string => Boolean(id)))];
  const { data: divisions } = divisionIds.length
    ? await supabase.from("divisions").select("id, name").in("id", divisionIds)
    : { data: [] as {id:string;name:string}[] };

  const divisionNames = new Map((divisions ?? []).map(item => [item.id, item.name]));
  const roles = assignments.map(item => ({
    role: item.role,
    division: item.division_id ? divisionNames.get(item.division_id) ?? "Assigned division" : "Group-wide",
  }));

  return <AdminShell email={user.email ?? profile.display_name}>{children}</AdminShell>;
}
