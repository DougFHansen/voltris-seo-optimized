/** @type {import('next').Config} */
// Vercel Deploy Trigger - AdSense Fixes - $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
const nextConfig = {
  experimental: {
    optimizePackageImports: [
      '@heroicons/react',
      'lucide-react',
      'react-icons',
      'framer-motion',
    ],
    optimizeServerReact: true,
    // Removido: instrumentationHook, serverComponentsExternalPackages, turbo
  },
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  serverExternalPackages: ['sharp'],
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 ano
    dangerouslyAllowSVG: true,
    // Removido: contentSecurityPolicy (duplicidade/confusão de CSP)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: false,
    loader: 'default',
    path: '/_next/image',
    contentDispositionType: 'attachment',
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  reactStrictMode: true,
  productionBrowserSourceMaps: true, // Ativa source maps de produção
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  webpack: (config, { dev, isServer }) => {
    // Otimização para produção
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
            enforce: true,
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            enforce: true,
            priority: 5,
          },
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react',
            chunks: 'all',
            priority: 20,
          },
          ui: {
            test: /[\\/]node_modules[\/](@heroicons|react-icons|lucide-react|framer-motion)[\\/]/,
            name: 'ui',
            chunks: 'all',
            priority: 15,
          },
        },
      };
      config.optimization.minimize = true;
      config.optimization.minimizer.push(
        new (require('terser-webpack-plugin'))({
          terserOptions: {
            compress: {
              drop_console: true,
              drop_debugger: true,
              pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
            },
            mangle: true,
          },
        })
      );
    }
    

    
    // Otimização de SVG
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    
    // Otimização de fontes
    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf)$/,
      type: 'asset/resource',
      generator: {
        filename: 'static/fonts/[name].[hash][ext]',
      },
    });
    
    return config;
  },
  headers: async () => {
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
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://pagead2.googlesyndication.com https://fundingchoicesmessages.google.com https://www.google-analytics.com https://ep1.adtrafficquality.google https://ep2.adtrafficquality.google https://www.google.com https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://securepubads.g.doubleclick.net;
              script-src-elem 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://pagead2.googlesyndication.com https://fundingchoicesmessages.google.com https://www.google-analytics.com https://ep1.adtrafficquality.google https://ep2.adtrafficquality.google https://www.google.com https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://securepubads.g.doubleclick.net;
              style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com 'unsafe-hashes' blob: data:;
              font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com data:;
              img-src 'self' data: https: blob: https://www.google-analytics.com https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://securepubads.g.doubleclick.net;
              connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://pagead2.googlesyndication.com https://fundingchoicesmessages.google.com https://ep1.adtrafficquality.google https://ep2.adtrafficquality.google https://zamjyyzockbbugjepkhk.supabase.co wss://zamjyyzockbbugjepkhk.supabase.co https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://securepubads.g.doubleclick.net;
              frame-src 'self' https://fundingchoicesmessages.google.com https://googleads.g.doubleclick.net https://ep1.adtrafficquality.google https://ep2.adtrafficquality.google https://www.google.com https://www.youtube.com https://www.googletagmanager.com https://pagead2.googlesyndication.com https://tpc.googlesyndication.com https://securepubads.g.doubleclick.net;
              object-src 'none';
              base-uri 'self';
              form-action 'self';
            `.replace(/\n/g, '').replace(/\s{2,}/g, ' '),
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=600, s-maxage=600, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/:all*(svg|jpg|jpeg|png|webp|avif|ico|woff2|woff|ttf|js|css)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Accept-Encoding',
            value: 'gzip, deflate, br',
          },
          {
            key: 'Vary',
            value: 'Accept-Encoding',
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
        source: '/manifest.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/manifest+json',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400',
          },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
          {
            key: 'Content-Type',
            value: 'application/javascript',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, s-maxage=300',
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap',
      },
    ];
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  trailingSlash: false,
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
};

module.exports = nextConfig; 