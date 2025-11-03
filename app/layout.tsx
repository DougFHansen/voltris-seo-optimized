import type { Metadata } from "next";
import Script from "next/script";
import ReactQueryProvider from "./ReactQueryProvider";
import PWAInstall from "@/components/PWAInstall";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import CookieBanner from "@/components/CookieBanner";
import { Roboto } from 'next/font/google';
import "./globals.css";
import ClientNotificationProvider from './components/ClientNotificationProvider';
import ClientPWAInstall from "./components/ClientPWAInstall";

export const metadata: Metadata = {
  title: {
    default: "VOLTRIS - Suporte Técnico Remoto e Criação de Sites Profissionais",
    template: "%s | VOLTRIS"
  },
  description: "Suporte técnico remoto especializado em Windows, criação de sites profissionais, otimização de computadores e manutenção de sistemas. Atendimento em todo Brasil, 100% online e seguro.",
  keywords: [
    "suporte técnico remoto",
    "manutenção de computador",
    "criação de sites",
    "otimização de Windows",
    "formatação de computador",
    "remoção de vírus",
    "instalação de programas",
    "suporte Windows",
    "manutenção remota",
    "tecnologia",
    "informática",
    "desenvolvimento web",
    "design de sites",
    "SEO",
    "marketing digital",
    "formatação remota",
    "erros GTA",
    "erros CS2",
    "erros Cyberpunk",
    "erros jogos",
    "instalação Office",
    "otimização PC",
    "correção erros Windows",
    "suporte técnico online",
    "manutenção computador remota",
    "formatação Windows",
    "instalação programas remota",
    "remoção malware",
    "otimização sistema",
    "recuperação dados",
    "instalação impressora",
    "configuração rede",
    "backup dados",
    "atualização Windows",
    "driver impressora",
    "antivírus",
    "firewall",
    "limpeza computador",
    "aceleração PC",
    "correção tela azul",
    "erro sistema",
    "problemas internet",
    "configuração email",
    "instalação software",
    "manutenção preventiva",
    "diagnóstico computador",
    "reparo remoto",
    "suporte 24h",
    "técnico informática",
    "assistência técnica",
    "serviços informática",
    "soluções tecnológicas",
    "consultoria TI",
    "manutenção notebook",
    "formatação notebook",
    "otimização notebook",
    "instalação Windows",
    "configuração sistema",
    "migração dados",
    "virtualização",
    "cloud computing",
    "backup cloud",
    "segurança digital",
    "proteção dados",
    "criptografia",
    "VPN",
    "rede doméstica",
    "WiFi",
    "bluetooth",
    "periféricos",
    "mouse",
    "teclado",
    "webcam",
    "microfone",
    "alto-falantes",
    "headset",
    "gamepad",
    "joystick",
    "controle Xbox",
    "controle PlayStation",
    "steering wheel",
    "flight stick",
    "VR headset",
    "AR glasses",
    "smartphone",
    "tablet",
    "smartwatch",
    "smart TV",
    "Chromecast",
    "Fire Stick",
    "Apple TV",
    "Roku",
    "consoles",
    "Xbox",
    "PlayStation",
    "Nintendo",
    "PC gaming",
    "gaming laptop",
    "gaming desktop",
    "overclock",
    "water cooling",
    "air cooling",
    "thermal paste",
    "GPU",
    "CPU",
    "RAM",
    "SSD",
    "HDD",
    "NVMe",
    "motherboard",
    "power supply",
    "case",
    "fans",
    "RGB",
    "LED",
    "streaming",
    "OBS",
    "Streamlabs",
    "Twitch",
    "YouTube Gaming",
    "Facebook Gaming",
    "Discord",
    "TeamSpeak",
    "Mumble",
    "Steam",
    "Epic Games",
    "Origin",
    "Uplay",
    "Battle.net",
    "GOG",
    "itch.io",
    "Humble Bundle",
    "Green Man Gaming",
    "Fanatical",
    "G2A",
    "Kinguin",
    "CDKeys",
    "Nuuvem",
    "GamersGate",
    "IndieGala",
    "Bundle Stars",
    "Mac Games Store",
    "App Store",
    "Google Play",
    "Microsoft Store",
    "Sony PlayStation Store",
    "Nintendo eShop",
    "Xbox Store",
    "Amazon Games",
    "GameStop",
    "Best Buy",
    "Walmart",
    "Target",
    "Carrefour",
    "Extra",
    "Casas Bahia",
    "Magazine Luiza",
    "Americanas",
    "Submarino",
    "Netshoes",
    "Kabum",
    "Terabyte",
    "Pichau",
    "Amazon Brasil",
    "Mercado Livre",
    "OLX",
    "Enjoei",
    "B2W Digital",
    "Via Varejo",
    "Lojas Americanas",
    "Ricardo Eletro",
    "Fast Shop",
    "Saraiva",
    "Livraria Cultura",
    "Fnac",
    "Kalunga",
    "Staples",
    "Office Depot",
    "Staples Brasil",
    "Kalunga",
    "Saraiva",
    "Livraria Cultura",
    "Fnac",
    "Americanas",
    "Submarino",
    "Netshoes",
    "Kabum",
    "Terabyte",
    "Pichau",
    "Amazon Brasil",
    "Mercado Livre",
    "OLX",
    "Enjoei",
    "B2W Digital",
    "Via Varejo",
    "Lojas Americanas",
    "Ricardo Eletro",
    "Fast Shop",
    "Saraiva",
    "Livraria Cultura",
    "Fnac",
    "Kalunga",
    "Staples",
    "Office Depot",
    "Staples Brasil",
    "Kalunga",
    "Saraiva",
    "Livraria Cultura",
    "Fnac"
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
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://voltris.com.br',
    siteName: 'VOLTRIS',
    title: 'VOLTRIS - Suporte Técnico Remoto e Criação de Sites Profissionais',
    description: 'Suporte técnico remoto especializado em Windows, criação de sites profissionais, otimização de computadores e manutenção de sistemas. Atendimento em todo Brasil, 100% online e seguro.',
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
    description: 'Suporte técnico remoto especializado em Windows, criação de sites profissionais, otimização de computadores e manutenção de sistemas.',
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

const roboto = Roboto({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const canonicalUrl = `https://voltris.com.br${pathname}`;
  return (
    <html lang="pt-br">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fundingchoicesmessages.google.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://googleads.g.doubleclick.net" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://tpc.googlesyndication.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://securepubads.g.doubleclick.net" crossOrigin="anonymous" />
        <meta name="google-adsense-account" content="ca-pub-9217408182316735" />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link rel="preload" as="font" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/webfonts/fa-solid-900.woff2" type="font/woff2" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
          integrity="sha512-Fo3rlrZj/k7ujTnHg4CGR2D7kSs0v4LLanw2qksYuRlEzO+tcaEPQogQ0KaoGN26/zrn20ImR1DfuLWnOo7aBA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#8B31FF" />
        <meta name="msapplication-TileColor" content="#8B31FF" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="VOLTRIS" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="VOLTRIS" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="language" content="Portuguese" />
        <meta name="geo.region" content="BR" />
        <meta name="geo.country" content="Brasil" />
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />
        <meta name="revisit-after" content="7 days" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="VOLTRIS" />
        <meta property="og:title" content="VOLTRIS - Suporte Técnico Remoto e Criação de Sites Profissionais" />
        <meta property="og:description" content="Suporte técnico remoto especializado em Windows, criação de sites profissionais, otimização de computadores e manutenção de sistemas." />
        <meta property="og:url" content="https://voltris.com.br" />
        <meta property="og:image" content="/logo.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="VOLTRIS - Suporte Técnico Remoto e Criação de Sites Profissionais" />
        <meta name="twitter:description" content="Suporte técnico remoto especializado em Windows, criação de sites profissionais, otimização de computadores e manutenção de sistemas." />
        <meta name="twitter:image" content="/logo.png" />
        <link rel="canonical" href={canonicalUrl} />
        <meta name="bingbot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="msvalidate.01" content="92524862D63347408E773A7CD62B94DD" />
        
        {/* Google tag (gtag.js) - Ads */}
        <script defer src="https://www.googletagmanager.com/gtag/js?id=G-XY0CKLVY2B"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XY0CKLVY2B');
            `
          }}
        />
        
        {/* Schema.org structured data - Organization (já existe) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "VOLTRIS - Suporte Técnico Remoto e Criação de Sites Profissionais",
              "description": "Especialistas em suporte técnico remoto, criação de sites e soluções digitais para todo o Brasil.",
              "image": "https://voltris.com.br/logo.png",
              "logo": "https://voltris.com.br/logo.png",
              "@id": "https://voltris.com.br",
              "url": "https://voltris.com.br",
              "telephone": "+55-11-99671-6235",
              "email": "contato@voltris.com.br",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "BR",
                "addressRegion": "São Paulo",
                "addressLocality": "São Paulo"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "-23.5505",
                "longitude": "-46.6333"
              },
              "openingHours": "Mo-Su 08:00-22:00",
              "priceRange": "R$ 29,90 - R$ 997,90",
              "paymentAccepted": ["Credit Card", "Debit Card", "PIX", "Bank Transfer"],
              "currenciesAccepted": "BRL",
              "serviceArea": {
                "@type": "Country",
                "name": "Brasil"
              },
              "areaServed": [
                "São Paulo", "Rio de Janeiro", "Minas Gerais", "Paraná", "Bahia", "Brasil"
              ],
              "hasMap": "https://goo.gl/maps/2Qw6Qw6Qw6Qw6Qw6A",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+55-11-99671-6235",
                "email": "contato@voltris.com.br",
                "contactType": "customer service",
                "areaServed": "BR"
              },
              "sameAs": [
                "https://www.instagram.com/voltris.com.br"
              ],
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "reviewCount": "120"
              },
              "review": [
                {
                  "@type": "Review",
                  "author": { "@type": "Person", "name": "Ana Silva" },
                  "datePublished": "2024-06-01",
                  "reviewBody": "Ótimo atendimento, resolveu meu problema rapidamente!",
                  "reviewRating": {
                    "@type": "Rating",
                    "ratingValue": "5"
                  }
                }
              ],
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Serviços de Suporte Técnico",
                "itemListElement": [
                  {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Criação de Site", "description": "Desenvolvimento de sites profissionais e responsivos para sua empresa ou projeto pessoal."}},
                  {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Suporte ao Windows", "description": "Suporte remoto completo para seu sistema Windows, incluindo instalação, atualização e otimização."}},
                  {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Formatação", "description": "Formatação remota completa do seu computador com instalação de programas essenciais."}},
                  {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Otimização de PC", "description": "Otimização remota completa do seu computador para melhor desempenho."}},
                  {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Recuperação de Dados", "description": "Recuperação remota de dados e arquivos importantes do seu computador."}},
                  {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Instalação de Programas", "description": "Instalação e configuração remota de programas essenciais para seu computador."}},
                  {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Instalação de Impressora", "description": "Instalação remota de drivers e configuração de impressoras no seu computador."}},
                  {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Remoção de Vírus", "description": "Remoção remota de vírus e proteção do seu computador."}}
                ]
              }
            })
          }}
        />
        {/* Schema.org BreadcrumbList (estrutura base) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://voltris.com.br"},
                {"@type": "ListItem", "position": 2, "name": "Serviços", "item": "https://voltris.com.br/servicos"}
              ]
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "VOLTRIS",
              "url": "https://voltris.com.br",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://voltris.com.br/?s={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SiteNavigationElement",
              "name": [
                "Início",
                "Sobre",
                "Serviços",
                "FAQ",
                "Blog",
                "Guias",
                "Contato",
                "Dashboard",
                "Política de Privacidade",
                "Termos de Uso"
              ],
              "url": [
                "https://voltris.com.br/",
                "https://voltris.com.br/about",
                "https://voltris.com.br/servicos",
                "https://voltris.com.br/faq",
                "https://voltris.com.br/blog",
                "https://voltris.com.br/guias",
                "https://voltris.com.br/contato",
                "https://voltris.com.br/dashboard",
                "https://voltris.com.br/politica-privacidade",
                "https://voltris.com.br/termos-uso"
              ]
            })
          }}
        />
        <Script
          id="adsbygoogle-init"
          strategy="afterInteractive"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9217408182316735"
          crossOrigin="anonymous"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (window.adsbygoogle = window.adsbygoogle || []);
            `
          }}
        />
      </head>
      <body className={`antialiased ${roboto.className}`} role="document" aria-label="VOLTRIS - Suporte Técnico Remoto e Criação de Sites Profissionais">
        <ClientNotificationProvider>
          <ReactQueryProvider>
            <CookieBanner />
            {children}
            <ClientPWAInstall />
            <GoogleAnalytics />
            {/* Bloco de keywords long-tail para bots (display:none, não afeta visual) */}
            <div style={{display:'none'}} aria-hidden="true">
              suporte técnico remoto, manutenção de computador, criação de sites profissionais, otimização de Windows, formatação de computador, remoção de vírus, instalação de programas, suporte Windows, manutenção remota, tecnologia, informática, desenvolvimento web, design de sites, SEO, marketing digital, formatação remota, erros GTA, erros CS2, erros Cyberpunk, erros jogos, instalação Office, otimização PC, correção erros Windows, suporte técnico online, manutenção computador remota, formatação Windows, instalação programas remota, remoção malware, otimização sistema, recuperação dados, instalação impressora, configuração rede, backup dados, atualização Windows, driver impressora, antivírus, firewall, limpeza computador, aceleração PC, correção tela azul, erro sistema, problemas internet, configuração email, instalação software, manutenção preventiva, diagnóstico computador, reparo remoto, suporte 24h, técnico informática, assistência técnica, serviços informática, soluções tecnológicas, consultoria TI, manutenção notebook, formatação notebook, otimização notebook, instalação Windows, configuração sistema, migração dados, virtualização, cloud computing, backup cloud, segurança digital, proteção dados, criptografia, VPN, rede doméstica, WiFi, bluetooth, periféricos, mouse, teclado, webcam, microfone, alto-falantes, headset, gamepad, joystick, controle Xbox, controle PlayStation, steering wheel, flight stick, VR headset, AR glasses, smartphone, tablet, smartwatch, smart TV, Chromecast, Fire Stick, Apple TV, Roku, consoles, Xbox, PlayStation, Nintendo, PC gaming, gaming laptop, gaming desktop, overclock, water cooling, air cooling, thermal paste, GPU, CPU, RAM, SSD, HDD, NVMe, motherboard, power supply, case, fans, RGB, LED, streaming, OBS, Streamlabs, Twitch, YouTube Gaming, Facebook Gaming, Discord, TeamSpeak, Mumble, Steam, Epic Games, Origin, Uplay, Battle.net, GOG, itch.io, Humble Bundle, Green Man Gaming, Fanatical, G2A, Kinguin, CDKeys, Nuuvem, GamersGate, IndieGala, Bundle Stars, Mac Games Store, App Store, Google Play, Microsoft Store, Sony PlayStation Store, Nintendo eShop, Xbox Store, Amazon Games, GameStop, Best Buy, Walmart, Target, Carrefour, Extra, Casas Bahia, Magazine Luiza, Americanas, Submarino, Netshoes, Kabum, Terabyte, Pichau, Amazon Brasil, Mercado Livre, OLX, Enjoei, B2W Digital, Via Varejo, Lojas Americanas, Ricardo Eletro, Fast Shop, Saraiva, Livraria Cultura, Fnac, Kalunga, Staples, Office Depot, Staples Brasil, Kalunga, Saraiva, Livraria Cultura, Fnac
            </div>
          </ReactQueryProvider>
        </ClientNotificationProvider>
      </body>
    </html>
  );
}
