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
        hostname: "i.scdn.co",
      },
      {
        hostname: "image-cdn-fa.spotifycdn.com",
      },
    ],
  },
};

export default nextConfig;
