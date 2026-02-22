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
import JsonLd from "@/components/JsonLd";
import AdSense from "@/components/AdSense";
import { ADSENSE_CONFIG } from "@/app/adsense-config";

export const metadata: Metadata = {
  title: {
    default: "VOLTRIS - Suporte Técnico Remoto e Criação de Sites Profissionais",
    template: "%s | VOLTRIS"
  },
  description: "Suporte técnico remoto especializado em Windows, criação de sites profissionais, otimização de computadores e manutenção de sistemas. Atendimento em todo Brasil.",
  keywords: [
    "suporte técnico remoto",
    "manutenção de computador",
    "criação de sites",
    "otimização de Windows",
    "consultoria TI"
  ],
  authors: [{ name: "VOLTRIS" }],
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
    title: 'VOLTRIS - Suporte Técnico Remoto e Criação de Sites Profissionais',
    description: 'Suporte técnico remoto especializado em Windows, criação de sites profissionais, otimização de computadores e manutenção de sistemas.',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'VOLTRIS - Suporte Técnico Remoto e Criação de Sites',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VOLTRIS - Suporte Técnico Remoto e Criação de Sites Profissionais',
    description: 'Suporte técnico remoto especializado em Windows, criação de sites profissionais.',
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
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />

        <link rel="icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#8B31FF" />
        <meta name="msapplication-TileColor" content="#8B31FF" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="language" content="Portuguese" />

        {/* Google AdSense */}
        <AdSense pId={ADSENSE_CONFIG.PUBLISHER_ID} />

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
            name: "VOLTRIS - Suporte Técnico Remoto e Criação de Sites Profissionais",
            description: "Especialistas em suporte técnico remoto, criação de sites e soluções digitais para todo o Brasil.",
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

      </head>
      <body className={`antialiased ${inter.className} ${inter.variable} font-sans`} role="document" aria-label="VOLTRIS - Suporte Técnico Remoto e Criação de Sites Profissionais">
        <ClientNotificationProvider>
          <ReactQueryProvider>
            <CookieBanner />
            {children}
            <ClientPWAInstall />
            <GoogleAnalytics />
          </ReactQueryProvider>
        </ClientNotificationProvider>
      </body>
    </html>
  );
}