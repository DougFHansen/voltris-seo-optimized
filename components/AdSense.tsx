"use client";

import Script from "next/script";

export default function AdSense({ pId }: { pId: string }) {
  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${pId}`}
      crossOrigin="anonymous"
      strategy="lazyOnload"
    />
  );
}
