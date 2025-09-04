// import createMiddleware from "next-intl/middleware";
// import { NextResponse, NextRequest } from "next/server";
// import { routing } from "./i18n/routing";
// import { jwtDecode, JwtPayload } from "jwt-decode";

// // Extend JWT payload type for role
// interface MyJwtPayload extends JwtPayload {
//   role?: "USER" | "ADMIN" | "SUPERADMIN";
//   id?: string;
// }

// export default async function middleware(req: NextRequest) {
//   const intlMiddleware = createMiddleware(routing);
//   const res = await intlMiddleware(req);

//   // Token cookie'sini console'a yaz
//   const token = req.cookies.get("token")?.value;

//   let decodedToken: MyJwtPayload | undefined;
//   if (token) {
//     try {
//       decodedToken = jwtDecode<MyJwtPayload>(token);
//     } catch (err) {
//       console.error("JWT decode hatası:", err);
//       return NextResponse.redirect(new URL("/", req.url));
//     }
//   }

//   const locale = req.cookies.get("NEXT_LOCALE")?.value || "tr";
//   const pathname = req.nextUrl.pathname;

//   // /admin veya /user route'una giriş yapmamışsa giremesin
//   if (
//     (pathname.startsWith(`/${locale}/admin`) ||
//       pathname.startsWith(`/${locale}/user`)) &&
//     !decodedToken
//   ) {
//     console.log("Yetkisiz giriş denemesi:", pathname);
//     return NextResponse.redirect(new URL("/", req.url));
//   }

//   // /admin route'una sadece ADMIN veya SUPERADMIN girebilir
//   if (pathname.startsWith(`/${locale}/admin`)) {
//     if (
//       decodedToken &&
//       !["ADMIN", "SUPERADMIN"].includes(decodedToken.role ?? "")
//     ) {
//       console.log("Yetkisiz admin paneli denemesi:", decodedToken?.role);
//       return NextResponse.redirect(new URL("/", req.url));
//     }
//   }

//   // /user route'una sadece USER girebilir
//   if (pathname.startsWith(`/${locale}/user`)) {
//     if (decodedToken && decodedToken.role !== "USER") {
//       console.log("Yetkisiz user paneli denemesi:", decodedToken?.role);
//       return NextResponse.redirect(new URL("/", req.url));
//     }
//   }

//   // / ana ekrana giriş yaptıysa ve token varsa, rolüne göre yönlendir
//   if (pathname === "/") {
//     if (decodedToken?.role === "USER") {
//       return NextResponse.redirect(new URL(`/${locale}/user`, req.url));
//     }
//     if (decodedToken?.role === "ADMIN" || decodedToken?.role === "SUPERADMIN") {
//       return NextResponse.redirect(new URL(`/${locale}/admin`, req.url));
//     }
//     // Eğer decodedToken yoksa burada kalabilir (login sayfası)
//   }

//   return res;
// }

// export const config = {
//   matcher: [
//     "/",
//     "/(tr|en)/:path*",
//     "/(tr|en)/admin/:path*",
//     "/(tr|en)/user/:path*",
//   ],
// };

import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
