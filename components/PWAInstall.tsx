'use client';

import { useState, useEffect } from 'react';

export default function PWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detecta se é mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Registrar service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    }

    // Verificar se já está instalado
    if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Capturar o evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    // Capturar o evento appinstalled
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
  };

  // Banner PWA só aparece em mobile
  if (isInstalled || !showInstallPrompt) {
    return null;
  }

  return (
    <div
      className={
        `z-50 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] shadow-2xl border-b border-white/20 backdrop-blur-sm transition-transform duration-500
        ${isMobile
          ? 'fixed top-0 left-0 right-0 p-4 rounded-b-xl mt-[56px] md:mt-0'
          : 'fixed top-[96px] left-6 max-w-xs w-full p-3 rounded-xl border border-white/20'}
        `
      }
      style={{ transform: showInstallPrompt ? 'translateY(0)' : (isMobile ? 'translateY(-120%)' : 'translateY(-40px)'), boxShadow: '0 8px 32px 0 rgba(49,168,255,0.15)' }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            {/* SVG corrigido para evitar erro de linter */}
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-white font-bold text-sm">Instalar VOLTRIS</h3>
            <p className="text-white/90 text-xs">Acesse mais rápido e offline</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleDismiss}
            className="px-2 py-1 text-white/80 text-xs hover:text-white transition-colors"
          >
            Agora não
          </button>
          <button
            onClick={handleInstallClick}
            className="px-3 py-1 bg-white text-[#8B31FF] font-semibold rounded-lg text-xs hover:bg-white/90 transition-colors"
          >
            Instalar
          </button>
        </div>
      </div>
    </div>
  );
} 