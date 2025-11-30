import type { NextConfig } from "next";
import * as path from "path";

const nextConfig: NextConfig = {
  // Next.js workspace root 경고 해결
  // Turborepo 모노레포에서 올바른 root 디렉토리 지정
  outputFileTracingRoot: path.join(__dirname, "../../"),

  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // TODO: Fix type errors and re-enable type checking
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer }) => {
    // 동적 import 경고 억제 (server.ts의 런타임 경로 결정)
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      {
        module: /packages\/core\/dist\/utils\/server\.js/,
        message:
          /Critical dependency: the request of a dependency is an expression/,
      },
    ];

    if (!isServer) {
      // Ignore Node.js modules when building for the browser
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
        tls: false,
        fs: false,
        child_process: false,
        path: false,
        os: false,
        crypto: false,
        stream: false,
        assert: false,
        http: false,
        https: false,
        http2: false,
        url: false,
        zlib: false,
        events: false,
        util: false,
        buffer: false,
        querystring: false,
      };

      // Completely ignore server-only modules from i18nexus
      config.resolve.alias = {
        ...config.resolve.alias,
        "node:events": false,
        "node:stream": false,
        "node:path": false,
        "node:fs": false,
        "node:fs/promises": false,
        "node:util": false,
        "node:buffer": false,
        "node:querystring": false,
      };

      // Ignore specific server-only files from i18nexus
      config.module = config.module || {};
      config.module.rules = config.module.rules || [];
      config.module.rules.push({
        test: /node_modules\/i18nexus\/dist\/scripts\//,
        use: "null-loader",
      });
    }
    return config;
  },
  // Transpile the i18nexus package
  transpilePackages: ["i18nexus"],
};

export default nextConfig;
