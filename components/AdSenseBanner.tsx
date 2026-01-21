'use client';

import Script from 'next/script';

export default function AdSenseBanner() {
  return (
    <>
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9217408182316735"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      <div className="max-w-4xl mx-auto py-8 px-4 min-h-[280px]">
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-9217408182316735"
          data-ad-slot="1234567890"
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
        <Script id="adsense-init">{`(adsbygoogle = window.adsbygoogle || []).push({});`}</Script>
      </div>
    </>
  );
}