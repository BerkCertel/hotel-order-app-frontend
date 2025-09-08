import type { Metadata } from "next";

import ProvidersWrapper from "@/components/Providers/ProvidersWrapper";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hotel Order App",
  description: "Manage your hotel bookings efficiently",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={"en"} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className={`antialiased`}>
        <ProvidersWrapper>{children}</ProvidersWrapper>
      </body>
    </html>
  );
}
