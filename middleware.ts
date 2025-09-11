import { jwtDecode } from "jwt-decode";
import { NextRequest, NextResponse } from "next/server";

type JwtPayload = {
  exp: number;
  role: string;
  [key: string]: any;
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies?.get("token")?.value;

  const isProtectedRoute =
    pathname === "/" ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/user");

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  if (!token) {
    if (pathname.startsWith("/admin") || pathname.startsWith("/user")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  let decoded: JwtPayload;
  try {
    decoded = jwtDecode<JwtPayload>(token);
  } catch {
    console.log("Invalid token");
    if (pathname.startsWith("/admin") || pathname.startsWith("/user")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  console.log(pathname, decoded.role);

  if (
    pathname.startsWith("/admin") &&
    decoded.role !== "ADMIN" &&
    decoded.role !== "SUPERADMIN"
  ) {
    if (decoded.role === "USER") {
      return NextResponse.redirect(new URL("/user", request.url));
    }
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (pathname.startsWith("/user") && decoded.role !== "USER") {
    if (decoded.role === "ADMIN" || decoded.role === "SUPERADMIN") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (pathname === "/") {
    if (decoded.role === "ADMIN" || decoded.role === "SUPERADMIN") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    if (decoded.role === "USER") {
      return NextResponse.redirect(new URL("/user", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/admin/:path*", "/user/:path*"],
};
