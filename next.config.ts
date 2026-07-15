import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/app/i18n/request.ts");

const nextConfig: NextConfig = {
  // Emits .next/standalone with only the modules the server actually reaches,
  // which is what the Docker runner stage copies.
  output: "standalone",
  poweredByHeader: false,
};

export default withNextIntl(nextConfig);
