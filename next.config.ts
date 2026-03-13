import type { NextConfig } from "next";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_BASE?.replace("/api/1", "") || "http://127.0.0.1:7000";

const nextConfig: NextConfig = {
  // Prevent Next.js from stripping trailing slashes on proxied routes,
  // which causes redirect loops with Flask (Flask adds trailing slash,
  // Next.js removes it → 308 loop).
  skipTrailingSlashRedirect: true,
  compress: true,
  productionBrowserSourceMaps: false,
  images: {
    deviceSizes: [320, 576, 768, 992, 1248],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost:7000",
      },
      {
        protocol: "http",
        hostname: "localhost:7000/static",
      },
    ],
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/logout/",
          destination: `${BACKEND_URL}/logout/`,
        },
        {
          source: "/get-csrf",
          destination: `${BACKEND_URL}/get-csrf`,
        },
        {
          source: "/reset/",
          destination: `${BACKEND_URL}/reset/`,
        },
        {
          source: "/reset/:token",
          destination: `${BACKEND_URL}/reset/:token`,
        },
        // SAML / Autenticação.gov routes
        {
          source: "/saml/login",
          destination: `${BACKEND_URL}/saml/login`,
        },
        {
          source: "/saml/sso",
          destination: `${BACKEND_URL}/saml/sso`,
        },
        {
          source: "/saml/logout",
          destination: `${BACKEND_URL}/saml/logout`,
        },
        {
          source: "/saml/sso_logout",
          destination: `${BACKEND_URL}/saml/sso_logout`,
        },
        // eIDAS routes
        {
          source: "/saml/eidas/login",
          destination: `${BACKEND_URL}/saml/eidas/login`,
        },
        {
          source: "/saml/eidas/sso",
          destination: `${BACKEND_URL}/saml/eidas/sso`,
        },
        {
          source: "/saml/eidas/logout",
          destination: `${BACKEND_URL}/saml/eidas/logout`,
        },
        {
          source: "/saml/eidas/sso_logout",
          destination: `${BACKEND_URL}/saml/eidas/sso_logout`,
        },
        // API routes — must be in beforeFiles to avoid redirect loops
        // when Flask returns 308 trailing-slash redirects
        {
          source: "/api/:path*",
          destination: `${BACKEND_URL}/api/:path*`,
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
  // TODO: Install @sentry/nextjs and configure
  // TODO: Implement sitemap via app/sitemap.ts or next-sitemap
};

export default nextConfig;
