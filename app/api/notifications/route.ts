import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  const client = await getSupabaseServerClient();
  if (!client) {
    return NextResponse.json({ error: "Notifications are temporarily unavailable." }, { status: 503 });
  }

  const { data: { user }, error: authError } = await client.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Sign in to view notifications." }, { status: 401 });
  }

  const { data, error } = await client
    .from("notifications")
    .select("id,title,body,read_at,created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return NextResponse.json({ error: "Notifications are temporarily unavailable." }, { status: 500 });
  }

  return NextResponse.json({ notifications: data ?? [] });
}
