import { NextResponse } from "next/server";
import { profileService } from "@/lib/services/profileService";

export async function GET() {
  const result = await profileService.getCurrent();
  if (result.error) {
    const status = result.error.code === "UNAUTHORIZED" ? 401 : result.error.code === "NOT_FOUND" ? 404 : 500;
    return NextResponse.json({ error: result.error.message }, { status });
  }
  return NextResponse.json({ profile: result.data });
}

export async function PATCH(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  const result = await profileService.updateCurrent(body);
  if (result.error) {
    const status = result.error.code === "UNAUTHORIZED" ? 401 : result.error.code === "VALIDATION" ? 400 : 500;
    return NextResponse.json({ error: result.error.message }, { status });
  }
  return NextResponse.json({ profile: result.data });
}
