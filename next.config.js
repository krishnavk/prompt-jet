const isGithubPages = process.env.GITHUB_PAGES === 'true';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: isGithubPages ? '/prompt-jet' : '',
  assetPrefix: isGithubPages ? '/prompt-jet/' : '',
};

module.exports = nextConfig;
