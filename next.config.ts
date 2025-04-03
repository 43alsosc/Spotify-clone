import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "placeholder.pics",
      },
      {
        hostname: "mosaic.scdn.co",
      },
      {
        hostname: "image-cdn-ak.spotifycdn.com",
      },
      {
        hostname: "*.scdn.co",
      },
    ],
  },
};

export default nextConfig;
