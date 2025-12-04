"use client";
import { useEffect, useState } from "react";

export default function AdSenseChecker() {
  const [status, setStatus] = useState<'checking' | 'working' | 'error' | 'not-loaded'>('checking');
  const [details, setDetails] = useState<string>('');

  useEffect(() => {
    const checkAdSense = async () => {
      try {
        // Verificar se o script do AdSense foi carregado
        if (typeof window === 'undefined') {
          setStatus('error');
          setDetails('Não está rodando no cliente');
          return;
        }

        // Verificar se o objeto adsbygoogle existe
        if (!window.adsbygoogle) {
          setStatus('error');
          setDetails('Script do AdSense não foi carregado');
          return;
        }

        // Verificar se é um array
        if (!Array.isArray(window.adsbygoogle)) {
          setStatus('error');
          setDetails('Objeto adsbygoogle não é um array válido');
          return;
        }

        // Verificar se o domínio está na lista de domínios aprovados
        const currentDomain = window.location.hostname;
        const isLocalhost = currentDomain === 'localhost' || currentDomain === '127.0.0.1';
        
        if (isLocalhost) {
          setStatus('error');
          setDetails('AdSense não funciona em localhost - teste em produção');
          return;
        }

        // Verificar se há elementos de anúncio no DOM
        const adElements = document.querySelectorAll('.adsbygoogle');
        if (adElements.length === 0) {
          setStatus('error');
          setDetails('Nenhum elemento de anúncio encontrado no DOM');
          return;
        }

        // Verificar se o CSP está permitindo o AdSense
        const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
        if (cspMeta) {
          const cspContent = cspMeta.getAttribute('content') || '';
          const requiredDomains = [
            'pagead2.googlesyndication.com',
            'googleads.g.doubleclick.net',
            'tpc.googlesyndication.com',
            'securepubads.g.doubleclick.net'
          ];
          
          const missingDomains = requiredDomains.filter(domain => 
            !cspContent.includes(domain)
          );
          
          if (missingDomains.length > 0) {
            setStatus('error');
            setDetails(`CSP está bloqueando domínios: ${missingDomains.join(', ')}`);
            return;
          }
        }

        setStatus('working');
        setDetails('AdSense está funcionando corretamente');
        
      } catch (error) {
        setStatus('error');
        setDetails(`Erro durante verificação: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      }
    };

    // Aguardar um pouco para o AdSense carregar
    const timer = setTimeout(checkAdSense, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Só mostrar em desenvolvimento ou quando houver erro
  if (process.env.NODE_ENV === 'production' && status === 'working') {
    return null;
  }

  const getStatusColor = () => {
    switch (status) {
      case 'working': return 'text-green-600 bg-green-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'checking': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'working': return '✅';
      case 'error': return '❌';
      case 'checking': return '⏳';
      default: return '❓';
    }
  };

  return (
    <div className={`p-4 rounded-lg border ${getStatusColor()} mb-4`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{getStatusIcon()}</span>
        <strong>Status do AdSense:</strong>
        <span className="capitalize">{status}</span>
      </div>
      {details && (
        <p className="text-sm mt-2">{details}</p>
      )}
      {status === 'error' && (
        <div className="mt-3 text-sm">
          <strong>Soluções recomendadas:</strong>
          <ul className="list-disc list-inside mt-1 ml-4">
            <li>Verifique se o domínio está aprovado no AdSense</li>
            <li>Confirme se o CSP não está bloqueando o AdSense</li>
            <li>Teste em produção (não em localhost)</li>
            <li>Verifique se não há bloqueadores de anúncios ativos</li>
            <li>Aguarde 24-48h após a aprovação inicial</li>
          </ul>
        </div>
      )}
    </div>
  );
}
