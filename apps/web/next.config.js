/** @type {import('next').NextConfig} */
const isGithubPages = process.env.GITHUB_PAGES === 'true';

const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  },
  images: {
    unoptimized: true
  },
  // Ensure static export works correctly with GitHub Pages
  output: 'export',
  distDir: 'out',
  // Add basePath for GitHub Pages
  basePath: isGithubPages ? '/prompt-jet' : '',
  assetPrefix: isGithubPages ? '/prompt-jet/' : '',
  // Optional: Enable React Strict Mode
  reactStrictMode: true,
};

module.exports = nextConfig;
