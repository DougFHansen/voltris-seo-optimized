'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import NotificationDropdown from './notifications/NotificationDropdown';
import { useAuth } from '@/app/hooks/useAuth';
import { useNotificationContext } from './notifications/NotificationContext';
import { FiVolume2, FiVolumeX } from 'react-icons/fi';
const MotionDiv = dynamic(() => import('./MotionDiv'), { ssr: false });
const AnimatePresence = dynamic(() => import('framer-motion').then(mod => mod.AnimatePresence), { ssr: false });
const FiLoader = dynamic(() => import('react-icons/fi').then(mod => mod.FiLoader), { ssr: false });
const FiX = dynamic(() => import('react-icons/fi').then(mod => mod.FiX), { ssr: false });
import Image from 'next/image';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAdmin, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === '/';
  const isProfilePage = pathname === '/profile';

  // Estados de loading locais
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  const { settings, updateSettings } = useNotificationContext();
  const [soundAnim, setSoundAnim] = useState(false);
  useEffect(() => {
    function onSoundPlayed() {
      setSoundAnim(true);
      setTimeout(() => setSoundAnim(false), 600);
    }
    window.addEventListener('notification-sound-played', onSoundPlayed);
    return () => window.removeEventListener('notification-sound-played', onSoundPlayed);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = async () => {
    setLogoutLoading(true);
    let timeout: NodeJS.Timeout | null = null;
    try {
      const result = await signOut();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('auth-changed'));
      }
      window.location.href = '/login';
      setIsMobileMenuOpen(false);
      // Fallback: se não redirecionar, reseta o loading após 2s
      timeout = setTimeout(() => setLogoutLoading(false), 2000);
    } catch (error) {
      console.error('[Header] Erro ao fazer logout:', error);
      setLogoutLoading(false);
    } finally {
      if (timeout) clearTimeout(timeout);
    }
  };

  const handleAdminClick = () => {
    console.log('[Header] Clicou no botão Admin, isAdmin:', isAdmin);
    setAdminLoading(true);
    if (isAdmin) {
      console.log('[Header] Redirecionando para /restricted-area-admin');
      window.location.href = '/restricted-area-admin';
    } else {
      console.log('[Header] Usuário não é admin, redirecionando para /dashboard');
      window.location.href = '/dashboard';
    }
  };

  const handleDashboardClick = () => {
    setDashboardLoading(true);
    window.location.href = '/dashboard';
  };

  const handleLoginClick = () => {
    setLoginLoading(true);
    router.push('/login');
  };

  const getFullPath = (anchor: string) => {
    return isHome ? anchor : `/${anchor}`;
  };

  const AuthButtons = () => {
    if (loading) {
      return (
        <div className="flex items-center gap-2 px-4 py-2">
          <FiLoader className="w-4 h-4 animate-spin text-white" />
        </div>
      );
    }

    if (!user) {
      return (
        <>
          <button
            onClick={handleLoginClick}
            disabled={loginLoading}
            className={`flex justify-center items-center gap-2 px-3 py-2 sm:px-4 rounded-lg border border-[#8B31FF]/30 bg-white/5 transition-all duration-300 ease-out hover:scale-105 hover:shadow-[0_0_20px_rgba(49,168,255,0.2)] ${loginLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
            aria-label="Login - Entrar na conta"
            title="Login - Entrar na conta"
          >
            {loginLoading ? (
              <FiLoader className="w-4 h-4 animate-spin" />
            ) : (
              <i
                className={`fas fa-user text-lg sm:text-xl ${typeof window !== 'undefined' && window.innerWidth < 640 ? 'mobile-login-gradient' : 'text-white'}`}
              ></i>
            )}
            <span className="hidden sm:inline font-extrabold tracking-tight bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-transparent bg-clip-text drop-shadow-lg select-none" style={{ letterSpacing: '0.04em' }}>Login</span>
          </button>
          <Link
            href="/login?cadastro=1"
            className="flex items-center gap-2 px-3 py-2 sm:px-4 bg-[#23232b] border border-[#FF4B6B]/10 text-white rounded-lg hover:shadow-[0_0_20px_rgba(42,42,46,0.3)] transition-all duration-300 ease-out hover:scale-105"
            aria-label="Cadastro - Criar nova conta"
            title="Cadastro - Criar nova conta"
          >
            <i className="fas fa-user-plus text-lg sm:text-xl"></i>
            <span className="hidden sm:inline">Cadastro</span>
          </Link>
        </>
      );
    }

    return (
      <>
        {isAdmin ? (
          <button
            onClick={handleAdminClick}
            disabled={adminLoading}
            className={`flex items-center gap-1 xs:gap-2 px-2 xs:px-3 py-2 sm:px-4 text-white hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] transition-all duration-300 min-h-[44px] ${adminLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            {adminLoading ? <FiLoader className="w-3 h-3 xs:w-4 xs:h-4 animate-spin" /> : <i className="fas fa-crown text-sm xs:text-lg sm:text-xl"></i>}
            <span className="hidden xs:inline text-xs xs:text-sm sm:text-base">Admin</span>
          </button>
        ) : (
          <button
            onClick={handleDashboardClick}
            disabled={dashboardLoading}
            className={`flex items-center gap-1 xs:gap-2 px-2 xs:px-3 py-2 sm:px-4 text-white hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] transition-all duration-300 min-h-[44px] ${dashboardLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            {dashboardLoading ? <FiLoader className="w-3 h-3 xs:w-4 xs:h-4 animate-spin" /> : <i className="fas fa-chart-line text-sm xs:text-lg sm:text-xl"></i>}
            <span className="hidden xs:inline text-xs xs:text-sm sm:text-base">Painel</span>
          </button>
        )}
        <button
          onClick={handleLogout}
          disabled={logoutLoading}
          className={`flex justify-center items-center gap-1 xs:gap-2 px-2 xs:px-3 py-2 sm:px-4 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-white rounded-lg hover:shadow-[0_0_20px_rgba(139,49,255,0.3)] transition-all duration-300 ease-out hover:scale-105 min-h-[44px] ${logoutLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          {logoutLoading ? <FiLoader className="w-3 h-3 xs:w-4 xs:h-4 animate-spin" /> : <i className="fas fa-sign-out-alt text-sm xs:text-lg sm:text-xl"></i>}
          <span className="hidden xs:inline text-xs xs:text-sm sm:text-base">Logout</span>
        </button>
      </>
    );
  };

  return (
    <>
      {/* Definição de variável CSS para altura do header */}
      <style jsx global>{`
        :root {
          --header-height: 80px;
        }
        @media (max-width: 1023px) {
          :root {
            --header-height: 72px;
          }
        }
        @media (max-width: 639px) {
          :root {
            --header-height: 64px;
          }
        }
        @media (max-width: 479px) {
          :root {
            --header-height: 56px;
          }
        }
      `}</style>      <MotionDiv
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-br from-[#1c1c1e]/60 to-[#2a2a2e]/60 backdrop-blur-md border-b border-[#8B31FF]/10 w-full max-w-full overflow-hidden"
      >
        <nav className="max-w-7xl mx-auto px-2 xs:px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex items-center justify-between h-14 xs:h-16 sm:h-18 lg:h-20 w-full">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center group">
                <div className="relative">
                  <Image
                    src="/logo-v2.webp"
                    alt="VOLTRIS - Suporte Técnico Remoto e Criação de Sites Profissionais"
                    width={90}
                    height={90}
                    className="h-12 sm:h-15 w-auto block logo-rotate"
                    style={{ maxWidth: '100%' }}
                    priority
                    sizes="90px"
                  />
                </div>
                <span className="ml-2 sm:ml-4 text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-transparent bg-clip-text drop-shadow-lg select-none" style={{ letterSpacing: '0.04em' }}>VOLTRIS</span>
              </Link>
            </div>

            {/* Navigation Links - Desktop */}
            <div className="hidden lg:flex items-center justify-center space-x-6 xl:space-x-8">
              <Link href="/" className="text-white hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] transition-all duration-300 relative group">
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link href={getFullPath('#about')} className="text-white hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] transition-all duration-300 relative group">
                Sobre
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                href="/servicos"
                className="text-white hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] transition-all duration-300 relative group"
              >
                Serviços
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link href="/gamers" className="text-white hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] transition-all duration-300 relative group">
                Gamers
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link href="/faq" className="text-white hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] transition-all duration-300 relative group">
                Dúvidas
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link href="/guias" className="text-white hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] transition-all duration-300 relative group">
                Guias
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link href="/contato" className="text-white hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] transition-all duration-300 relative group">
                Contato
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>

            {/* Right Side - Auth Buttons & Mobile Menu */}
            <div className="flex items-center gap-1 xs:gap-2 sm:gap-4">
              {/* Auth Buttons - Desktop */}
              <div className="hidden lg:flex items-center gap-4">
                <AuthButtons />
              </div>
              {/* Auth Buttons - Mobile (direto no header) */}
              <div className="flex lg:hidden items-center gap-1 xs:gap-2">
                <AuthButtons />
              </div>
              {/* Mobile Menu Button */}
              <button
                className="lg:hidden text-white focus:outline-none p-1 xs:p-2 rounded-lg hover:bg-white/10 transition-colors min-w-[44px] min-h-[44px]"
                onClick={toggleMobileMenu}
                aria-label="Toggle mobile menu"
              >
                <svg className="w-5 h-5 xs:w-6 xs:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              {user && <NotificationDropdown />}
              {user && settings && (
                <button
                  onClick={() => updateSettings({ sound_enabled: !settings.sound_enabled })}
                  className={`ml-2 p-2 rounded-full border border-zinc-700 bg-zinc-900/60 hover:bg-zinc-800 transition relative ${settings.sound_enabled ? 'text-blue-400' : 'text-zinc-400'} ${soundAnim ? 'animate-ping-sound' : ''}`}
                  title={settings.sound_enabled ? 'Desativar som de notificações' : 'Ativar som de notificações'}
                  aria-label="Toggle som notificações"
                  style={{ outline: soundAnim ? '2px solid #8B31FF' : undefined }}
                >
                  {settings.sound_enabled ? <FiVolume2 size={22} /> : <FiVolumeX size={22} />}
                  {soundAnim && <span className="absolute inset-0 rounded-full border-2 border-blue-400 animate-pulse pointer-events-none" style={{ zIndex: 1 }}></span>}
                </button>
              )}
            </div>
          </div>
        </nav>
      </MotionDiv>

      {/* Mobile Menu Modal - Centralizado */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden flex items-center justify-center p-2 xs:p-4"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <MotionDiv
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] rounded-2xl border border-[#8B31FF]/20 shadow-2xl w-full max-w-xs xs:max-w-sm max-h-[85vh] xs:max-h-[80vh] overflow-y-auto"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              {/* Header do Modal */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h2 className="text-xl font-bold bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-transparent bg-clip-text">
                  Menu
                </h2>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors duration-300 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-white/10"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              {/* Conteúdo do Modal */}
              <div className="p-6 h-full flex flex-col items-center justify-center space-y-10">
                {/* Navigation Links */}
                <div className="flex flex-col items-center space-y-2 w-full">
                  <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4 text-center">
                    Navegação
                  </h3>
                  <Link
                    href={getFullPath('/')}
                    className="flex flex-col items-center justify-center px-4 py-3 text-white hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] transition-all duration-300 rounded-xl hover:bg-white/5 w-full text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <i className="fas fa-home w-6 h-6 mb-1"></i>
                    <span>Home</span>
                  </Link>
                  <Link
                    href={getFullPath('#about')}
                    className="flex flex-col items-center justify-center px-4 py-3 text-white hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] transition-all duration-300 rounded-xl hover:bg-white/5 w-full text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <i className="fas fa-info-circle w-6 h-6 mb-1"></i>
                    <span>Sobre</span>
                  </Link>
                  <Link
                    href="/servicos"
                    className="flex flex-col items-center justify-center px-4 py-3 text-white hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] transition-all duration-300 rounded-xl hover:bg-white/5 w-full text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <i className="fas fa-cogs w-6 h-6 mb-1"></i>
                    <span>Serviços</span>
                  </Link>
                  <Link
                    href="/gamers"
                    className="flex flex-col items-center justify-center px-4 py-3 text-white hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] transition-all duration-300 rounded-xl hover:bg-white/5 w-full text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <i className="fas fa-gamepad w-6 h-6 mb-1"></i>
                    <span>Gamers</span>
                  </Link>
                  <Link
                    href="/faq"
                    className="flex flex-col items-center justify-center px-4 py-3 text-white hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] transition-all duration-300 rounded-xl hover:bg-white/5 w-full text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <i className="fas fa-question-circle w-6 h-6 mb-1"></i>
                    <span>Dúvidas</span>
                  </Link>
                  <Link
                    href="/blog"
                    className="flex flex-col items-center justify-center px-4 py-3 text-white hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] transition-all duration-300 rounded-xl hover:bg-white/5 w-full text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <i className="fas fa-blog w-6 h-6 mb-1"></i>
                    <span>Blog</span>
                  </Link>
                  <Link
                    href="/guias"
                    className="flex flex-col items-center justify-center px-4 py-3 text-white hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] transition-all duration-300 rounded-xl hover:bg-white/5 w-full text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <i className="fas fa-book w-6 h-6 mb-1"></i>
                    <span>Guias</span>
                  </Link>
                  <Link
                    href="/contato"
                    className="flex flex-col items-center justify-center px-4 py-3 text-white hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] transition-all duration-300 rounded-xl hover:bg-white/5 w-full text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <i className="fas fa-envelope w-6 h-6 mb-1"></i>
                    <span>Contato</span>
                  </Link>
                </div>

                {/* Auth Section */}
                <div className="pt-4 border-t border-white/10 w-full flex flex-col items-center">
                  <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4 text-center">
                    Conta
                  </h3>
                  <div className="space-y-3 w-full flex flex-col items-center">
                    <AuthButtons />
                  </div>
                </div>
              </div>
            </MotionDiv>
          </MotionDiv>
        )}
      </AnimatePresence>
      <style jsx global>{`
@keyframes ping-sound {
  0% { box-shadow: 0 0 0 0 #8B31FF44; }
  70% { box-shadow: 0 0 0 8px #8B31FF22; }
  100% { box-shadow: 0 0 0 0 #8B31FF00; }
}
.animate-ping-sound {
  animation: ping-sound 0.6s cubic-bezier(0.4,0,0.2,1);
}
`}</style>
    </>
  );
} 