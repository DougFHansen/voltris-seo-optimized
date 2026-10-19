'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef, Suspense } from 'react';

/**
 * NAVEGAÇÃO NO APP (SPA) — envia UM `page_view` por rota.
 *
 * O `gtag.js` já é inicializado uma única vez em `app/layout.tsx`
 * (`gtag('js')` + `gtag('config')`), e o `config` inicial JÁ envia a
 * primeira `page_view`.
 *
 * Antes, este componente rodava `gtag('config', ...)` de novo no mount e em
 * CADA navegação. Como `config` reenvia uma `page_view`, a primeira tela
 * gerava DUAS page_view e cada rota no App Router gerava uma duplicata.
 *
 * Agora: a primeira passagem não envia nada (o `config` do layout já
 * counted) e as navegações seguintes enviam um EVENTO `page_view`, que é o
 * padrão documentado do GA4 para SPA.
 */
function AnalyticsContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const jaInicializou = useRef(false);

  useEffect(() => {
    if (!pathname || !(window as any).gtag) return;
    if (!jaInicializou.current) {
      // A `page_view` inicial já foi enviada pelo `gtag('config')` do layout.
      jaInicializou.current = true;
      return;
    }
    (window as any).gtag('event', 'page_view', {
      page_path: pathname,
      page_location: `${window.location.origin}${pathname}${searchParams?.toString() ? `?${searchParams}` : ''}`,
      page_title: document.title,
      send_to: 'G-XY0CKLVY2B',
    });
  }, [pathname, searchParams]);

  return null;
}

export default function GoogleAnalytics() {
  return (
    <Suspense fallback={null}>
      <AnalyticsContent />
    </Suspense>
  );
}
