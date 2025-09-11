import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

type JwtPayload = {
  exp: number;
  role: string;
  [key: string]: any;
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies?.get("token")?.value;

  if (!token) {
    // Token yoksa login'e at (sadece korumalı route'larda!)
    if (pathname.startsWith("/admin") || pathname.startsWith("/user")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    // Public route ise izin ver
    return NextResponse.next();
  }

  if (token) {
    let decoded: JwtPayload;
    try {
      decoded = jwtDecode<JwtPayload>(token);
    } catch {
      // Token bozuksa login'e at (sadece korumalı route'larda!)
      if (pathname.startsWith("/admin") || pathname.startsWith("/user")) {
        return NextResponse.redirect(new URL("/", request.url));
      }
      return NextResponse.next();
    }

    if (decoded.exp && Date.now() / 1000 > decoded.exp) {
      // Token süresi dolmuşsa login'e at (sadece korumalı route'larda!)
      if (pathname.startsWith("/admin") || pathname.startsWith("/user")) {
        return NextResponse.redirect(new URL("/", request.url));
      }
      return NextResponse.next();
    }

    // Admin/user route'larında rol kontrolü
    if (
      pathname.startsWith("/admin") &&
      !(decoded.role === "ADMIN" || decoded.role === "SUPERADMIN")
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    if (pathname.startsWith("/user") && decoded.role !== "USER") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Public route ve login sayfasındaysa otomatik role paneline yönlendir:
    if (pathname === "/") {
      if (decoded.role === "ADMIN" || decoded.role === "SUPERADMIN") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      if (decoded.role === "USER") {
        return NextResponse.redirect(new URL("/user", request.url));
      }
    }
  }
  // Erişim uygunsa izin ver
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/admin/:path*", "/user/:path*"],
};
