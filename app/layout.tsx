import type { Metadata } from "next";
import Script from "next/script";
import ReactQueryProvider from "./ReactQueryProvider";
import PWAInstall from "@/components/PWAInstall";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import CookieBanner from "@/components/CookieBanner";
import { Inter } from 'next/font/google';
import "./globals.css";
import ClientNotificationProvider from './components/ClientNotificationProvider';
import ClientPWAInstall from "./components/ClientPWAInstall";
import { AuthProvider } from '@/app/context/AuthContext';
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: {
    default: "VOLTRIS - Otimização de PC, Performance Gamer e Suporte Técnico",
    template: "%s | VOLTRIS"
  },
  description: "A maior autoridade em performance gamer e otimização de Windows do Brasil. Baixe o Voltris Optimizer, confira nossos 300+ guias de FPS e solicite suporte técnico especializado.",
  keywords: [
    "otimização de pc",
    "aumentar fps",
    "performance gamer",
    "voltris optimizer",
    "suporte técnico remoto",
    "otimização windows",
    "redutor de lag",
    "melhores configurações windows",
    "especialista em performance pc",
    "otimização pc brasil",
    "guias técnicos informática",
    "como aumentar fps windows 11",
    "limpeza de arquivos temporarios",
    "suporte informatica online"
  ],
  authors: [{ name: "VOLTRIS - Especialista em Performance" }],
  creator: "VOLTRIS",
  publisher: "VOLTRIS",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://voltris.com.br'),
  alternates: {
    canonical: './',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://voltris.com.br',
    siteName: 'VOLTRIS',
    title: 'VOLTRIS - Otimização de PC e Suporte Técnico Especializado',
    description: 'Suporte técnico remoto especializado em Windows, otimização de computadores e manutenção de sistemas de alta performance.',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'VOLTRIS - Otimização de PC e Suporte Técnico',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VOLTRIS - Otimização de PC e Suporte Técnico Especializado',
    description: 'Suporte técnico remoto especializado em Windows e otimização de computadores.',
    images: ['/logo.png'],
    creator: '@voltris',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'googlee3ce0f951f1010fe',
    other: {
      'msvalidate.01': 'B3EA85422343FBF303FC4E7243937093',
    },
  },
  category: 'technology',
};

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.google-analytics.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://grainy-gradients.vercel.app" crossOrigin="anonymous" />

        <link rel="icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#8B31FF" />
        <meta name="msapplication-TileColor" content="#8B31FF" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="language" content="Portuguese" />

        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XY0CKLVY2B"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XY0CKLVY2B', {
              page_path: window.location.pathname,
            });
          `}
        </Script>

        {/* Schema.org Organization */}
        <JsonLd
          type="Organization"
          data={{
            name: "VOLTRIS - Otimização de PC e Suporte Técnico Especializado",
            description: "Especialistas em suporte técnico remoto e otimização de computadores para máxima performance em todo o Brasil.",
            url: "https://voltris.com.br",
            logo: "https://voltris.com.br/logo.png",
            contactPoint: [{
              "@type": "ContactPoint",
              "telephone": "+55-11-99671-6235",
              "contactType": "customer service",
              "areaServed": "BR",
              "availableLanguage": "Portuguese"
            }],
            sameAs: [
              "https://www.instagram.com/voltris.com.br"
            ]
          }}
        />

        {/* Schema.org Software Application - Huge SEO boost for Voltris Optimizer */}
        <JsonLd
          type="SoftwareApplication"
          data={{
            name: "Voltris Optimizer",
            operatingSystem: "Windows 10, Windows 11",
            applicationCategory: "UtilitiesApplication",
            offers: {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "BRL"
            },
            aggregateRating: {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "ratingCount": "1250"
            }
          }}
        />

      </head>
      <body className={`antialiased ${inter.className} ${inter.variable} font-sans`} role="document" aria-label="VOLTRIS - Otimização de PC e Suporte Técnico Especializado">
        <AuthProvider>
          <ClientNotificationProvider>
            <ReactQueryProvider>
              <CookieBanner />
              {children}
              <ClientPWAInstall />
              <GoogleAnalytics />
            </ReactQueryProvider>
          </ClientNotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}