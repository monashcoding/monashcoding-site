import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

const nextConfig: NextConfig = {
  // Emit a self-contained server bundle (.next/standalone/server.js) so the
  // Docker runtime image doesn't need node_modules or the package manager.
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/membership',
        destination: 'https://clubs.msa.monash.edu/organisation/7489/',
        permanent: false,
      },
    ];
  },
};

export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})(nextConfig);
