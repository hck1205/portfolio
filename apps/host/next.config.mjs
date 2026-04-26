import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const NextFederationPlugin = require("@module-federation/nextjs-mf");
const currentDir = path.dirname(fileURLToPath(import.meta.url));

process.env.NEXT_PRIVATE_LOCAL_WEBPACK = "true";

const axRemoteUrl = process.env.NEXT_PUBLIC_AX_REMOTE_URL ?? "http://localhost:3004";

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@portfolio/ui"],
  webpack(config, options) {
    if (options.isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        "ax/AXApp": path.resolve(currentDir, "components/AXRemoteFallback.tsx")
      };
    } else {
      config.plugins.push(
        new NextFederationPlugin({
          name: "host",
          filename: "static/chunks/remoteEntry.js",
          remotes: {
            ax: `ax@${axRemoteUrl}/_next/static/chunks/remoteEntry.js`
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
