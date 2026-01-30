'use client';

import { useId } from 'react';
import Script from 'next/script';
import { ADSENSE_CONFIG } from '@/app/adsense-config';

const AD_CLIENT = ADSENSE_CONFIG.PUBLISHER_ID;
const AD_SLOT = ADSENSE_CONFIG.AD_SLOTS.BANNER;

export default function AdSenseBanner() {
  const pushId = useId();
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 min-h-[280px]" role="complementary" aria-label="Anúncios">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={AD_SLOT}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      <Script id={`adsense-push-${pushId}`} strategy="afterInteractive">
        {`(adsbygoogle = window.adsbygoogle || []).push({});`}
      </Script>
    </div>
  );
}