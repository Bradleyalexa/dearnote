import type { NextConfig } from "next";

const appUrl = process.env.APP_URL;
let devOrigins: string[] = [];
if (appUrl) {
  try {
    devOrigins.push(new URL(appUrl).host);
  } catch (e) {
    // Ignore invalid URLs
  }
}

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: devOrigins,
};

export default nextConfig;
