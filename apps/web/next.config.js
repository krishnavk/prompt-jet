/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  },
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Ensure static export works correctly with Tauri
  distDir: 'out'
};

module.exports = nextConfig;
