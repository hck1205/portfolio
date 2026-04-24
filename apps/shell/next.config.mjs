import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const NextFederationPlugin = require("@module-federation/nextjs-mf");
const currentDir = path.dirname(fileURLToPath(import.meta.url));

process.env.NEXT_PRIVATE_LOCAL_WEBPACK = "true";

const remoteDesignSystemUrl =
  process.env.NEXT_PUBLIC_DESIGN_SYSTEM_REMOTE_URL ?? "http://localhost:3003";

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@portfolio/ui"],
  webpack(config, options) {
    if (options.isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        "designSystem/DesignSystemShowcase": path.resolve(
          currentDir,
          "components/RemoteDesignSystemFallback.tsx"
        )
      };
    } else {
      config.plugins.push(
        new NextFederationPlugin({
          name: "shell",
          filename: "static/chunks/remoteEntry.js",
          remotes: {
            designSystem: `designSystem@${remoteDesignSystemUrl}/_next/static/chunks/remoteEntry.js`
          },
          extraOptions: {
            exposePages: false
          }
        })
      );
    }

    return config;
  }
};

export default nextConfig;
