/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // appDir is no longer needed in Next.js 14
  },
  images: {
    domains: ['localhost'],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      use: {
        loader: 'file-loader',
        options: {
          publicPath: '/_next/static/files/',
          outputPath: 'static/files/',
        },
      },
    })
    return config
  },
}

module.exports = nextConfig
