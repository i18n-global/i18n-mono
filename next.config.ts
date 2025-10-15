import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
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
