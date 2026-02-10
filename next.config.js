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
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  serverExternalPackages: ['sharp'],
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [320, 480, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
      {
        protocol: 'https',
        hostname: 'vjscxpxvdfhryixksrno.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'www.gravatar.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/todos-os-servicos/criacao-de-sites/plano-profissional',
        destination: '/criar-site',
        permanent: true,
      },
      {
        source: '/todos-os-servicos/criacao-de-sites/plano-empresarial',
        destination: '/criar-site',
        permanent: true,
      },
      {
        source: '/todos-os-servicos/otimizacao-de-windows/otimizacao-para-jogos',
        destination: '/gamers',
        permanent: true,
      },
      {
        source: '/todos-os-servicos/otimizacao-de-windows/otimizacao-para-trabalho',
        destination: '/otimizacao-pc',
        permanent: true,
      },
      {
        source: '/todos-os-servicos/manutencao-preventiva/check-up-completo',
        destination: '/tecnico-informatica',
        permanent: true,
      },
      {
        source: '/servicos/otimizacao-pc',
        destination: '/otimizacao-pc',
        permanent: true,
      },
      {
        source: '/servicos/gamers',
        destination: '/gamers',
        permanent: true,
      },
      {
        source: '/servicos/tecnico-informatica',
        destination: '/tecnico-informatica',
        permanent: true,
      },
      {
        source: '/servicos/criar-site',
        destination: '/criar-site',
        permanent: true,
      },
      {
        source: '/vendas',
        destination: '/restricted-area-admin',
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
  headers: async () => [
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
      ],
    },
  ],
};

module.exports = nextConfig;
