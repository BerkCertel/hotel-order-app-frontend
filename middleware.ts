import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest } from "next/server";

const nextIntlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  // Burada ek yönlendirme/başlık/vb. kontrol eklemek isterseniz yapabilirsiniz.
  // Sonra next-intl middleware'ine delegasyon yapıyoruz:
  return nextIntlMiddleware(request);
}

export const config = {
  // Aşağıdaki matcher, API, trpc, _next, _vercel yollarını ve dosya uzantısı içeren yolları dışlar
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
