import { NextResponse } from "next/server";
import { categoryService } from "@/lib/services/categoryService";

export async function GET() {
  const result = await categoryService.list();
  if (result.error) {
    return NextResponse.json({ error: result.error.message }, { status: 500 });
  }

  return NextResponse.json({ categories: result.data, total: result.data.length });
}
