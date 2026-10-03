import { NextResponse } from "next/server";
import { searchProducts } from "@/lib/services/searchService";
import { z } from "zod";

const searchParamsSchema = z.object({
  q: z.string().max(120).default(""),
  category: z.string().regex(/^(all|[a-z0-9]+(?:-[a-z0-9]+)*)$/).default("all"),
  supplier: z.string().regex(/^(all|[a-z0-9]+(?:-[a-z0-9]+)*)$/).default("all"),
  verifiedOnly: z.enum(["true", "false"]).default("false"),
  inStock: z.enum(["true", "false"]).default("false"),
  location: z.string().max(80).default(""),
  sort: z.enum(["relevance", "price-low", "price-high", "newest"]).default("relevance"),
  page: z.coerce.number().int().min(1).max(10000).default(1),
  pageSize: z.coerce.number().int().min(1).max(48).default(12),
  priceMax: z.coerce.number().finite().nonnegative().optional(),
  minMoq: z.coerce.number().finite().positive().optional(),
  maxMoq: z.coerce.number().finite().positive().optional(),
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = searchParamsSchema.safeParse(Object.fromEntries(url.searchParams.entries()));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid search parameters." }, { status: 400 });
  }

  const { q, category, supplier, verifiedOnly, inStock, location, sort, page, pageSize, priceMax, minMoq, maxMoq } = parsed.data;
  if (minMoq !== undefined && maxMoq !== undefined && minMoq > maxMoq) {
    return NextResponse.json({ error: "Invalid MOQ range." }, { status: 400 });
  }
  const result = await searchProducts({
    query: q,
    category,
    supplier,
    verifiedOnly: verifiedOnly === "true",
    inStock: inStock === "true",
    location,
    page,
    pageSize,
    sort,
    priceMax,
    minMoq,
    maxMoq,
  });

  if (result.error) return NextResponse.json({ error: result.error.message }, { status: 500 });
  return NextResponse.json(result.data);
}
