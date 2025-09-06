import type { Metadata } from "next";
import "./globals.css";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { routing } from "@/i18n/routing";
import ProvidersWrapper from "@/components/Providers/ProvidersWrapper";

export const metadata: Metadata = {
  title: "Hotel Order App",
  description: "Manage your hotel bookings efficiently",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!hasLocale(routing?.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale} data-scroll-behavior="smooth">
      <body className={`antialiased`}>
        <NextIntlClientProvider>
          <ProvidersWrapper>{children}</ProvidersWrapper>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
