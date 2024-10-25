/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    path: process.env.NODE_ENV === 'production' ? '/auditfortress' : '',
  },
  basePath: process.env.NODE_ENV === 'production' ? '/auditfortress' : '',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig