import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";

const createInquirySchema = z.object({
  productId: z.string().uuid(),
  subject: z.string().trim().min(3).max(120),
  message: z.string().trim().min(10).max(2000),
  quantity: z.number().finite().positive().max(999999999999),
}).strict();

const updateInquirySchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["viewed", "responded", "closed"]),
  response: z.string().trim().max(4000).optional(),
}).strict();

async function getUserContext() {
  const client = await getSupabaseServerClient();
  if (!client) return { client: null, user: null, role: null };

  const { data: { user }, error: authError } = await client.auth.getUser();
  if (authError || !user) return { client: null, user: null, role: null };

  const { data: profile, error: profileError } = await client
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (profileError || !profile) return { client: null, user: null, role: null };

  return { client, user, role: profile.role as string };
}

export async function GET(request: Request) {
  const { client, user, role } = await getUserContext();
  if (!client) return NextResponse.json({ error: "Sign in to view inquiries." }, { status: 401 });
  if (role !== "buyer" && role !== "supplier") {
    return NextResponse.json({ error: "This account cannot view inquiries." }, { status: 403 });
  }
  const pageValue = new URL(request.url).searchParams.get("page") ?? "1";
  const page = Number(pageValue);
  if (!Number.isSafeInteger(page) || page < 1 || page > 10000) {
    return NextResponse.json({ error: "Invalid page number." }, { status: 400 });
  }

  let query = client.from("product_inquiries")
    .select(
      "id,subject,message,quantity,status,response_text,created_at,product:products!product_inquiries_product_id_fkey(id,name,slug),supplier:supplier_companies!product_inquiries_supplier_company_id_fkey(id,company_name,slug)",
      { count: "exact" },
    )
    .order("created_at", { ascending: false })
    .range((page - 1) * 20, page * 20 - 1);
  if (role === "buyer") query = query.eq("buyer_id", user!.id);

  const { data, error, count } = await query;
  if (error) return NextResponse.json({ error: "Inquiries are temporarily unavailable." }, { status: 500 });

  const total = count ?? 0;
  return NextResponse.json({
    inquiries: data ?? [],
    page,
    total,
    totalPages: Math.ceil(total / 20),
  });
}

export async function POST(request: Request) {
  const { client, user, role } = await getUserContext();
  if (!client || !user) return NextResponse.json({ error: "Sign in to contact a supplier." }, { status: 401 });
  if (role !== "buyer") return NextResponse.json({ error: "Only buyer accounts can send product inquiries." }, { status: 403 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  const parsed = createInquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Check the subject, message, quantity, and product, then try again." }, { status: 400 });
  }

  const { data, error } = await client.from("product_inquiries").insert({
    buyer_id: user.id,
    product_id: parsed.data.productId,
    subject: parsed.data.subject,
    message: parsed.data.message,
    quantity: parsed.data.quantity,
  }).select("id,status,created_at").single();
  if (error) {
    const message = error.message.includes("Duplicate inquiry")
      ? "You recently sent an identical inquiry for this product."
      : error.message.includes("rate limit")
        ? "You have sent several inquiries recently. Please try again in a few minutes."
        : error.message.includes("Product is unavailable")
          ? "This product is currently unavailable for inquiries."
          : "Your inquiry could not be sent. Please try again.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
  return NextResponse.json({ inquiry: data }, { status: 201 });
}

export async function PATCH(request: Request) {
  const { client, user, role } = await getUserContext();
  if (!client || !user) return NextResponse.json({ error: "Sign in to update inquiries." }, { status: 401 });
  if (role !== "buyer" && role !== "supplier") {
    return NextResponse.json({ error: "This account cannot update inquiries." }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  const parsed = updateInquirySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid inquiry update." }, { status: 400 });
  if ((role === "buyer" && parsed.data.status !== "closed") || (parsed.data.status === "responded" && !parsed.data.response?.trim())) {
    return NextResponse.json({ error: "Invalid inquiry update." }, { status: 400 });
  }

  const update = role === "buyer"
    ? { status: "closed" }
    : {
        status: parsed.data.status,
        ...(parsed.data.status === "responded" ? { response_text: parsed.data.response!.trim() } : {}),
      };
  let query = client.from("product_inquiries").update(update).eq("id", parsed.data.id);
  if (role === "buyer") query = query.eq("buyer_id", user.id);

  const { data, error } = await query.select("id,status,response_text,updated_at").maybeSingle();
  if (error) return NextResponse.json({ error: "Inquiry could not be updated." }, { status: 400 });
  if (!data) return NextResponse.json({ error: "Inquiry was not found or you do not have access." }, { status: 404 });
  return NextResponse.json({ inquiry: data });
}
