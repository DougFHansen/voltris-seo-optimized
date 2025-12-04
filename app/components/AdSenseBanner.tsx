"use client";
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function AdSenseBanner() {
  const [adLoaded, setAdLoaded] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const loadAd = () => {
      try {
        // Verificar se o AdSense está disponível
        if (typeof window !== 'undefined' && window.adsbygoogle) {
          // Aguardar um pouco para garantir que o DOM está pronto
          setTimeout(() => {
            try {
              // Forçar o carregamento do anúncio
              if (Array.isArray(window.adsbygoogle)) {
                window.adsbygoogle.push({});
                setAdLoaded(true);
              } else {
                // Se não for array, tentar novamente
                setTimeout(loadAd, 2000);
              }
            } catch (error) {
              // Silenciosamente tentar novamente
              setTimeout(loadAd, 3000);
            }
          }, 1000);
        } else {
          // Se o AdSense não estiver disponível, tentar novamente
          setTimeout(loadAd, 2000);
        }
      } catch (error) {
        // Silenciosamente tentar novamente
        setTimeout(loadAd, 3000);
      }
    };

    loadAd();
  }, []);

  // NÃO mostrar na página inicial (home) para clientes
  if (pathname === '/') {
    return null;
  }

  return (
    <div className="w-full flex justify-center my-4">
      <div className="w-full max-w-4xl">
        {!adLoaded && (
          <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-600 text-sm">Carregando...</p>
            </div>
          </div>
        )}
        
        <ins
          className="adsbygoogle"
          style={{ 
            display: adLoaded ? 'block' : 'none',
            minHeight: '100px',
            width: '100%'
          }}
          data-ad-client="ca-pub-9217408182316735"
          data-ad-slot="3007424757"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
} 