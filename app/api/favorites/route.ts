import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";

const favoriteSchema = z.object({ productId: z.string().uuid() }).strict();

async function getAuthenticatedClient() {
  const client = await getSupabaseServerClient();
  if (!client) return { client: null, user: null };
  const { data: { user }, error } = await client.auth.getUser();
  return { client: error ? null : client, user: error ? null : user };
}

export async function GET() {
  const { client, user } = await getAuthenticatedClient();
  if (!client || !user) return NextResponse.json({ error: "Sign in to view favorites." }, { status: 401 });
  const { data, error } = await client.from("favorites")
    .select("created_at,product:products(id,name,slug,description,price,currency,minimum_order_quantity,stock,unit,supplier:supplier_companies(id,company_name,slug,country,verification_status),category:categories(name,slug))")
    .eq("user_id", user.id).order("created_at", { ascending: false }).limit(100);
  if (error) return NextResponse.json({ error: "Favorites are temporarily unavailable." }, { status: 500 });
  return NextResponse.json({ favorites: data ?? [] });
}

export async function POST(request: Request) {
  const { client, user } = await getAuthenticatedClient();
  if (!client || !user) return NextResponse.json({ error: "Sign in to save favorites." }, { status: 401 });
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request body." }, { status: 400 }); }
  const parsed = favoriteSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "A valid product ID is required." }, { status: 400 });
  const { error } = await client.from("favorites").upsert({ user_id: user.id, product_id: parsed.data.productId }, { onConflict: "user_id,product_id", ignoreDuplicates: true });
  if (error) return NextResponse.json({ error: "Favorite could not be saved." }, { status: 500 });
  return NextResponse.json({ ok: true }, { status: 201 });
}

export async function DELETE(request: Request) {
  const { client, user } = await getAuthenticatedClient();
  if (!client || !user) return NextResponse.json({ error: "Sign in to update favorites." }, { status: 401 });
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request body." }, { status: 400 }); }
  const parsed = favoriteSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "A valid product ID is required." }, { status: 400 });
  const { error } = await client.from("favorites").delete().eq("user_id", user.id).eq("product_id", parsed.data.productId);
  if (error) return NextResponse.json({ error: "Favorite could not be removed." }, { status: 500 });
  return NextResponse.json({ ok: true });
}
