import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Pin Turbopack root to this app directory so module resolution starts here,
  // not from the Anchor workspace parent (which has no node_modules).
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
