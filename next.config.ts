import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "nyc3.digitaloceanspaces.com",
      "raw.githubusercontent.com", // if using GitHub images
      "example.com", // add any other external host
    ],
  },
};

export default nextConfig;
