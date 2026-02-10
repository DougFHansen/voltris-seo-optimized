"use client";

import Script from "next/script";

/**
 * Componente para carregar o script base do Google AdSense.
 * Utiliza strategy="afterInteractive" para melhor performance e compatibilidade SEO.
 */
export default function AdSense({ pId }: { pId: string }) {
  return (
    <Script
      id="adsense-init"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${pId}`}
      crossOrigin="anonymous"
      strategy="lazyOnload" // Adiado para não impactar LCP/FCP
    />
  );
}
