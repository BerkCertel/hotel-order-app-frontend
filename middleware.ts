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

  if (token) {
    let decoded: JwtPayload;
    try {
      decoded = jwtDecode<JwtPayload>(token);
    } catch {
      // Token bozuksa login'e at
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Token süresi dolmuşsa login'e at
    if (decoded.exp && Date.now() / 1000 > decoded.exp) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // ROLE GÖRE OTO YÖNLENDİRME!
    if (decoded.role === "ADMIN" || decoded.role === "SUPERADMIN") {
      // Eğer zaten admin panelindeyse, izin ver
      if (!pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    } else if (decoded.role === "USER") {
      // Eğer zaten user panelindeyse, izin ver
      if (!pathname.startsWith("/user")) {
        return NextResponse.redirect(new URL("/user", request.url));
      }
    } else {
      // Yetkisiz rol varsa login'e at
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Her şey yolundaysa route'a izin ver
  return NextResponse.next();
}

// Bütün route'larda çalışsın istiyorsan matcher'ı şöyle bırak:
export const config = {
  matcher: [
    // YÖNLENDİRME YAPILMASINI İSTEDİĞİN PATHLER
    "/admin/:path*",
    "/user/:path*",
    // VEYA HER SAYFADA (login sayfası hariç) kontrol için:
    "/((?!api|trpc|_next|_vercel|.*\\..*|/).*)",
  ],
};
