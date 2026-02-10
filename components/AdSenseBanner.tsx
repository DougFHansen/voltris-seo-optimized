'use client';

import { useEffect, useRef } from 'react';
import { ADSENSE_CONFIG } from '@/app/adsense-config';

const AD_CLIENT = ADSENSE_CONFIG.PUBLISHER_ID;
const AD_SLOT = ADSENSE_CONFIG.AD_SLOTS.BANNER;

/**
 * Componente profissional para exibição de anúncios do Google AdSense.
 * Corrigido para evitar erros de 'All ins elements already have ads in them' 
 * e otimizado para não utilizar APIs obsoletas.
 */
export default function AdSenseBanner() {
  const adRef = useRef<HTMLModElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    // Função para inicializar o anúncio com segurança
    const initAd = () => {
      if (typeof window === 'undefined') return;

      try {
        // Verifica se o objeto adsbygoogle existe
        if (!window.adsbygoogle) {
          // Se não existir, aguarda um pouco e tenta novamente (pode estar carregando)
          setTimeout(initAd, 500);
          return;
        }

        // Verifica se o elemento existe no DOM e não foi inicializado ainda
        if (adRef.current && !initialized.current) {
          // Verifica atributos internos que o AdSense adiciona para saber se já processou este elemento
          const isProcessed = adRef.current.getAttribute('data-adsbygoogle-status') === 'done';

          if (!isProcessed) {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            initialized.current = true;
          }
        }
      } catch (err) {
        // Silencia erros de push para não poluir o console do usuário em produção
        if (process.env.NODE_ENV !== 'production') {
          console.error('AdSense push error:', err);
        }
      }
    };

    // Pequeno delay para garantir que o DOM está pronto e o script carregado
    const timer = setTimeout(initAd, 200);

    return () => {
      clearTimeout(timer);
      initialized.current = false;
    };
  }, []);

  return (
    <div
      className="max-w-4xl mx-auto py-8 px-4 min-h-[280px] overflow-hidden flex justify-center items-center"
      role="complementary"
      aria-label="Publicidade"
    >
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', minHeight: '280px' }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={AD_SLOT}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}