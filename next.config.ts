import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root so Turbopack ignores the parent-folder lockfile.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
