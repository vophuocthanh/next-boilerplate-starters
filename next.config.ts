import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/app/i18n/request.ts");

const isProduction = process.env.NODE_ENV === "production";

const API_ORIGIN = process.env.NEXT_PUBLIC_API_URL
  ? new URL(process.env.NEXT_PUBLIC_API_URL).origin
  : "'self'";

const securityHeaders = [
  // ---------- Anti-clickjacking ----------
  { key: "X-Frame-Options", value: "DENY" },
  // ---------- Prevent MIME-type sniffing ----------
  { key: "X-Content-Type-Options", value: "nosniff" },
  // ---------- Referrer policy ----------
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // ---------- Feature / permission restrictions ----------
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  // ---------- Force HTTPS (HSTS) ----------
  ...(isProduction
    ? [
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
      ]
    : []),
  // ---------- Content-Security-Policy (primary XSS defence) ----------
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      `connect-src 'self' ${API_ORIGIN}`,
      `script-src 'self' 'unsafe-inline'${isProduction ? "" : " 'unsafe-eval'"}`,
      // style-src needs unsafe-inline for CSS-in-JS / Tailwind
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

/** Headers applied to every route (security baseline). */
const globalHeaders = securityHeaders;

/** Extra headers for auth & admin pages (prevent caching). */
const sensitivePageHeaders = [
  {
    key: "Cache-Control",
    value: "no-store, max-age=0, must-revalidate",
  },
];

const nextConfig: NextConfig = {
  // Emits .next/standalone with only the modules the server actually reaches,
  // which is what the Docker runner stage copies.
  output: "standalone",
  poweredByHeader: false,
  experimental: {
    // Tree-shake barrel imports from large icon / UI packages.
    optimizePackageImports: ["lucide-react"],
  },
  async headers() {
    return [
      // Security headers on every route.
      {
        source: "/:path*",
        headers: globalHeaders,
      },
      // Prevent caching on auth & admin pages.
      {
        source: "/(auth|admin)/:path*",
        headers: sensitivePageHeaders,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
