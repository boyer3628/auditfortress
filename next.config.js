/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Needed for static site generation
  images: {
    unoptimized: true, // Required for static export
  },
  basePath: process.env.NODE_ENV === 'production' ? '/auditfortress' : '', // Adjust this to your repo name
  // Temporarily disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
