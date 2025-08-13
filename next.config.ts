import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "res.cloudinary.com",
      pathname: "**", // Tüm path'leri kabul et
    },
  ],
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
