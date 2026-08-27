import type { NextConfig } from "next";

// The Tayyo backend (tayyo-be) runs as a separate Next.js app. Proxying /api/*
// through this app keeps the session cookie first-party — no CORS involved.
const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:3001";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${BACKEND_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
