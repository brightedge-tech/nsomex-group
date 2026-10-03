import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { config as appConfig } from "@/lib/config";

const protectedPrefixes = ["/account", "/rfq", "/orders", "/procurement", "/messages", "/notifications", "/admin", "/checkout", "/disputes"];
const supplierWorkspaceRoutes = ["/supplier/dashboard", "/supplier/company", "/supplier/inquiries", "/supplier/messages", "/supplier/orders", "/supplier/products", "/supplier/profile", "/supplier/quotations", "/supplier/settings", "/supplier/verification"];

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isProtected = protectedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))
    || supplierWorkspaceRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
  if (!appConfig.supabaseConfigured) {
    if (isProtected && process.env.NODE_ENV === "production") {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.searchParams.set("auth", "unavailable");
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(appConfig.supabaseUrl, appConfig.supabaseAnonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (!isProtected) return response;

  if (authError || !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const { data: profile, error: profileError } = await supabase.from("profiles").select("role,status").eq("id", user.id).maybeSingle();
  if (profileError || !profile || profile.status === "suspended" || profile.status === "disabled") return NextResponse.redirect(new URL("/unauthorized", request.url));

  const isAdminRoute = pathname.startsWith("/admin");
  const isSupplierRoute = supplierWorkspaceRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
  const buyerRoutes = ["/account", "/rfq", "/orders", "/procurement", "/checkout", "/disputes"];
  const isBuyerRoute = buyerRoutes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
  const roleAllowed = isAdminRoute
    ? profile.role === "admin" && profile.status === "active"
    : isSupplierRoute
      ? profile.role === "supplier" || profile.role === "admin"
      : isBuyerRoute
        ? profile.role === "buyer" || profile.role === "admin"
        : true;
  if (!roleAllowed) return NextResponse.redirect(new URL("/unauthorized", request.url));

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
