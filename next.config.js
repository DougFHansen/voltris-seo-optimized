/** @type {import('next').Config} */
const nextConfig = {
  // Prevenir redirects 307 em webhooks
  skipTrailingSlashRedirect: true,
  experimental: {
    optimizePackageImports: [
      '@heroicons/react',
      'lucide-react',
      'react-icons',
      'framer-motion',
    ],
  },
  swcMinify: true,
  serverExternalPackages: ['sharp'],
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [320, 480, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      {
        source: '/criacao-de-sites',
        destination: '/criacao-sites',
        permanent: true,
      },
      {
        source: '/todos-os-servicos/criacao-de-sites',
        destination: '/todos-os-servicos/criacao-sites',
        permanent: true,
      },
      {
        source: '/about',
        destination: '/sobre',
        permanent: true,
      },
      {
        source: '/contact',
        destination: '/contato',
        permanent: true,
      },
      {
        source: '/services',
        destination: '/todos-os-servicos',
        permanent: true,
      },
      {
        source: '/gamers',
        destination: '/voltrisoptimizer',
        permanent: true,
      },
      {
        source: '/profile',
        destination: '/perfil',
        permanent: true,
      },
      {
        source: '/admin/:path*',
        destination: '/restricted-area-admin/:path*',
        permanent: true,
      },
      {
        source: '/blog/:slug*',
        destination: '/guias',
        permanent: true,
      },
      {
        source: '/blog',
        destination: '/guias',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/xml',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=3600',
          },
        ],
      },
      {
        source: '/robots.txt',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/plain',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=3600',
          },
        ],
      },
      {
        source: '/ads.txt',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/plain',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=3600',
          },
        ],
      },
    ];
  },

};

module.exports = nextConfig;
