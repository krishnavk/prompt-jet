/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  },

  images: {
    unoptimized: true
  },
  // Ensure static export works correctly with Tauri
  distDir: 'out'
};

module.exports = nextConfig;
