/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        // FLYH DESIGN SYSTEM SOURCE
        // source checkout: feature/demo-onboarding-intelligence-preview @ dc9dd71
        // Portable export generated from actual FlyH source.
        // Served as its own HTML document so portfolio CSS never shares the page.
        {
          source: '/work/flyh/design-system',
          destination: '/flyh-design-system/index.html',
        },
        {
          source: '/work/flyh/design-system/',
          destination: '/flyh-design-system/index.html',
        },
      ],
    }
  },
  experimental: {
    // appDir is no longer needed in Next.js 14
  },
  images: {
    domains: ['localhost'],
  },
  // Headers for Unity WebGL build files
  async headers() {
    return [
      {
        // Only set br encoding for .br compressed files
        source: '/webgl_spookie_pookie/Build/:path*.br',
        headers: [
          {
            key: 'Content-Encoding',
            value: 'br',
          },
          {
            key: 'Content-Type',
            value: 'application/octet-stream',
          },
        ],
      },
      {
        // Regular files without compression
        source: '/webgl_spookie_pookie/Build/:path((?!.*\\.br$).*)',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/octet-stream',
          },
        ],
      },
    ]
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
