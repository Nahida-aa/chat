import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  outputFileTracingExcludes: {
    '/**/*': [
      './scripts/**',
      './scripts/**/*'
    ]
  }
};

export default nextConfig;
