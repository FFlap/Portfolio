import type { NextConfig } from "next";

function computeBasePath() {
  const raw = process.env.NEXT_PUBLIC_BASE_PATH;
  if (raw) {
    return raw === "/" ? "" : raw.replace(/\/+$/, "");
  }

  const repo = process.env.GITHUB_REPOSITORY; // e.g. "owner/repo"
  if (!repo) return "";

  const [owner, name] = repo.split("/");
  if (!owner || !name) return "";

  // For user/org pages (owner.github.io), basePath is the domain root.
  if (name.toLowerCase() === `${owner.toLowerCase()}.github.io`) return "";

  return `/${name}`;
}

const basePath = computeBasePath();

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  assetPrefix: basePath,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
