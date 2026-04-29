import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";
import createNectIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Ensure Prisma native query engine binaries are included in the standalone output.
  // Next.js file tracing misses .so.node files loaded via dynamic require.
  outputFileTracingIncludes: {
    "/**": ["./src/modules/server/prisma/generated/**/*.node"],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
    },
    middlewareClientMaxBodySize: "1024mb",
  },
  webpack: (config, { isServer }) => {
    if (process.env.DOCKER_BUILD === "true") {
      config.cache = false;
    }
    return config;
  },
};

const withNextIntl = createNectIntlPlugin();

export default withSentryConfig(withNextIntl(nextConfig), {
  org: "naveen-raj-oy",
  project: "javascript-nextjs",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  tunnelRoute: "/monitoring",
  disableLogger: true,
  automaticVercelMonitors: true,
  sourcemaps: {
    disable: true,
  },
});
