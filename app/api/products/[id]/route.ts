import { NextResponse } from "next/server";
import { productService } from "@/lib/services/productService";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await productService.getBySlug(id);

  if (result.error) {
    return NextResponse.json({ error: result.error.message }, { status: 404 });
  }

  return NextResponse.json(result.data);
}
