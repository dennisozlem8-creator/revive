import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  transpilePackages: ["@mediapipe/tasks-vision"],
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Permissions-Policy",
            value: "serial=(self), bluetooth=(self), usb=(self)",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
