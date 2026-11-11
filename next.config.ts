import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Tudo aqui depende do usuário logado (dados dinâmicos), então usamos o
  // modelo de renderização clássico, sem Cache Components.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.ufs.sh" },
      { protocol: "https", hostname: "utfs.io" },
    ],
  },
};

export default nextConfig;
