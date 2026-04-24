import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const NextFederationPlugin = require("@module-federation/nextjs-mf");

process.env.NEXT_PRIVATE_LOCAL_WEBPACK = "true";

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@portfolio/ui"],
  webpack(config) {
    config.plugins.push(
      new NextFederationPlugin({
        name: "designSystem",
        filename: "static/chunks/remoteEntry.js",
        exposes: {
          "./DesignSystemShowcase": "./components/DesignSystemShowcase.tsx"
        },
        extraOptions: {
          exposePages: false
        }
      })
    );

    return config;
  }
};

export default nextConfig;
