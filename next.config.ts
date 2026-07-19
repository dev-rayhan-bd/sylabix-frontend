import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://192.168.0.114:5001/api/:path*",
      },
    ];
  },
};

export default nextConfig;
