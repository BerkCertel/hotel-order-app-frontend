import type { Metadata } from "next";

import ProvidersWrapper from "@/components/Providers/ProvidersWrapper";
import "./globals.css";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

export const metadata: Metadata = {
  title: "Hotel Order App",
  description: "Manage your hotel bookings efficiently",
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className={`antialiased`}>
        <NextIntlClientProvider>
          <ProvidersWrapper>{children}</ProvidersWrapper>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
