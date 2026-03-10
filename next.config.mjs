/** @type {import("next").NextConfig} */
const deployTarget = process.env.DEPLOY_TARGET;
const isPages = deployTarget === "pages";
const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1];
const basePath = isPages && repoName ? `/${repoName}` : "";

const nextConfig = {
  reactStrictMode: true,
  output: isPages ? "export" : "standalone",
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath
  },
  ...(isPages
    ? {
        images: { unoptimized: true },
        trailingSlash: true,
        basePath,
        assetPrefix: basePath
      }
    : {})
};

export default nextConfig;
