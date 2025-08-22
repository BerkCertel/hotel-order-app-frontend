import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    // İsterseniz basit senaryoda sadece domains de kullanabilirsiniz:
    // domains: ['res.cloudinary.com'],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        // port eklemezseniz '' bırakmaya gerek yok, hiç yazmamak da yeterli
        // port: '',
        // pathname mutlaka / ile başlamalı. Tüm path'ler için /** desenini kullanın.
        pathname: "/**",
      },
    ],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
