import { NextResponse } from "next/server";
import { supplierService } from "@/lib/services/supplierService";
import { z } from "zod";

const paramsSchema = z.object({
  q: z.string().max(80).default(""),
  verifiedOnly: z.enum(["true", "false"]).default("false"),
  page: z.coerce.number().int().min(1).max(10000).default(1),
  pageSize: z.coerce.number().int().min(1).max(48).default(12),
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = paramsSchema.safeParse(Object.fromEntries(url.searchParams.entries()));
  if (!parsed.success) return NextResponse.json({ error: "Invalid supplier query parameters." }, { status: 400 });
  const params = parsed.data;
  const result = await supplierService.search({
    query: params.q,
    verifiedOnly: params.verifiedOnly === "true",
    page: params.page,
    pageSize: params.pageSize,
  });
  if (result.error) return NextResponse.json({ error: result.error.message }, { status: 500 });
  return NextResponse.json({ suppliers: result.data.items, ...result.data });
}
