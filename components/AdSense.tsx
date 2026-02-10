"use client";
import { useEffect, useState } from "react";
import Script from "next/script";

/**
 * Componente para carregar o script base do Google AdSense com Smart Delay.
 * O script só é carregado após a primeira interação do usuário ou um timeout seguro.
 */
export default function AdSense({ pId }: { pId: string }) {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // Lista de eventos que disparam o carregamento imediato
    const activityEvents = ["mousedown", "mousemove", "keydown", "scroll", "touchstart"];

    const onActivity = () => {
      setShouldLoad(true);
      activityEvents.forEach((e) => window.removeEventListener(e, onActivity));
    };

    // Timeout de segurança após 5 segundos se não houver interação
    const idleTimer = setTimeout(() => {
      setShouldLoad(true);
      activityEvents.forEach((e) => window.removeEventListener(e, onActivity));
    }, 5000);

    activityEvents.forEach((e) => window.addEventListener(e, onActivity, { passive: true }));

    return () => {
      clearTimeout(idleTimer);
      activityEvents.forEach((e) => window.removeEventListener(e, onActivity));
    };
  }, []);

  if (!shouldLoad) return null;

  return (
    <Script
      id="adsense-init"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${pId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
