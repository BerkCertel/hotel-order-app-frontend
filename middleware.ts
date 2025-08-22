import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// next-intl middleware'i oluştur
const handleI18nRouting = createMiddleware(routing);

// JWT'den role okuma fonksiyonu
function getUserRoleFromToken(token: string | undefined): string | undefined {
  if (!token) return undefined;
  try {
    const decoded = jwt.decode(token) as { role?: string } | null;
    return decoded?.role;
  } catch {
    return undefined;
  }
}

export default function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const role = getUserRoleFromToken(token);

  const pathname = request.nextUrl.pathname;
  // locale prefix'ini bul
  const match = pathname.match(/^\/(tr|en)(\/.*)?$/);
  const locale = match ? match[1] : "tr"; // default: tr

  // Ana sayfa ise ve role varsa otomatik ilgili role sayfasına yönlendir
  if ((pathname === `/${locale}` || pathname === `/${locale}/`) && role) {
    if (role === "ADMIN" || role === "SUPERADMIN") {
      return NextResponse.redirect(new URL(`/${locale}/admin`, request.url));
    }
    if (role === "USER") {
      return NextResponse.redirect(new URL(`/${locale}/user`, request.url));
    }
    // role başka bir şeyse, ana sayfada kalır
  }

  // /admin route: sadece ADMIN veya SUPERADMIN girebilir
  if (pathname.startsWith(`/${locale}/admin`)) {
    if (!role) {
      return NextResponse.redirect(new URL(`/${locale}/`, request.url));
    }
    if (role === "ADMIN" || role === "SUPERADMIN") {
      // Giriş izni
    } else if (role === "USER") {
      return NextResponse.redirect(new URL(`/${locale}/user`, request.url));
    } else {
      return NextResponse.redirect(new URL(`/${locale}/`, request.url));
    }
  }

  // /user route: sadece USER girebilir
  if (pathname.startsWith(`/${locale}/user`)) {
    if (!role) {
      return NextResponse.redirect(new URL(`/${locale}/`, request.url));
    }
    if (role === "USER") {
      // Giriş izni
    } else if (role === "ADMIN" || role === "SUPERADMIN") {
      return NextResponse.redirect(new URL(`/${locale}/admin`, request.url));
    } else {
      return NextResponse.redirect(new URL(`/${locale}/`, request.url));
    }
  }

  // En sonda next-intl'ın routing middleware'ini çalıştır!
  return handleI18nRouting(request);
}

export const config = {
  matcher: [
    "/((?!api|_next|_vercel|.*\\..*).*)",
    "/([\\w-]+)?/admin/:path*",
    "/([\\w-]+)?/user/:path*",
  ],
};
