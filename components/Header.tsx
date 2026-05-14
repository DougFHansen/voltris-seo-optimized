'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import NotificationDropdown from './notifications/NotificationDropdown';
import { useAuth } from '@/app/hooks/useAuth';
import { FiMenu, FiX, FiLogOut, FiLayout, FiLoader, FiUser, FiUserPlus } from 'react-icons/fi';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { notifyDownload } from '@/utils/notifications';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const { user, isAdmin, loading, signOut } = useAuth();

  // FAIL-SAFE: Trava de segurança para evitar o spinner infinito.
  // Se demorar mais de 1.8s, forçamos o carregamento visual dos botões.
  const [forceLoaded, setForceLoaded] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setForceLoaded(true), 1800);
    return () => clearTimeout(timer);
  }, []);

  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === '/';

  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setScrolled(window.scrollY > 20), 100); // DEBOUNCE DE 100MS PARA REDUZIR RERENDERS
    };
    window.addEventListener('scroll', handleScroll, { passive: true }); // PASSIVE PARA PERFORMANCE
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = async () => {
    await signOut();
    window.location.href = '/login';
  };

  const mainNavLinks = [
    { name: 'Home', path: '/' },
    { name: 'Serviços', path: '/servicos' },
    { name: 'Guias', path: '/guias' },
    { name: 'Sobre', path: '/sobre' },
    { name: 'Dúvidas', path: '/faq' },
    { name: 'Contato', path: '/contato' },
  ];

  const servicesNavLinks = [
    {
      category: 'Vertical Gamer',
      items: [
        { name: 'Hub Gamer', path: '/gamer', desc: 'Performance & FPS' },
        { name: 'Voltris Optimizer', path: '/voltrisoptimizer', desc: 'Software de Elite' },
        { name: 'Otimização Remota', path: '/otimizacao-pc', desc: 'Tuning de Especialista' },
      ]
    },
    {
      category: 'Vertical B2B',
      items: [
        { name: 'Hub Corporativo', path: '/corporativo', desc: 'Suporte Empresarial' },
        { name: 'Serviços B2B', path: '/corporativo/servicos', desc: 'Gestão & Infra' },
        { name: 'Cidades Atendidas', path: '/corporativo#local', desc: 'Atendimento Regional' },
      ]
    },
    {
      category: 'Vertical Home',
      items: [
        { name: 'Hub Residencial', path: '/home', desc: 'Suporte para Casa' },
        { name: 'Formatação', path: '/home#servicos', desc: 'Windows Novo' },
        { name: 'Limpeza Técnica', path: '/home#servicos', desc: 'Fim da Lentidão' },
      ]
    },
    {
      category: 'Outros',
      items: [
        { name: 'Criação de Sites', path: '/criar-site', desc: 'Presença Digital' },
        { name: 'Área do Cliente', path: '/dashboard', desc: 'Gestão de Chamados' },
      ]
    },
  ];

  return (
    <>
      <header
        className={`mobile-menu-optimized fixed top-0 left-0 right-0 z-[100] h-16 transition-all duration-500 bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-sm`}
      >
        {/* Linha Neon Fina – ativa no scroll */}
        <div
          className={`absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-blue-600/0 via-purple-600/50 to-pink-600/0 transition-opacity duration-500 ${
            scrolled ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/*
          Layout: flex row com três zonas (logo | nav | actions).
          Usamos flex-1 na nav para ela ocupar o espaço restante e
          shrink-0 no logo e nas actions para nunca serem comprimidos.
          O menu desktop só aparece em lg+ (≥1024px).
        */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center gap-4">

          {/* ── Logo ─────────────────────────────────── */}
          <Link href="/" className="flex items-center gap-2 group z-20 relative shrink-0">
            <Image
              src="/logo.png"
              alt="Voltris"
              width={70}
              height={70}
              className="w-9 h-9 lg:w-11 lg:h-11 object-contain transition-transform duration-500 group-hover:rotate-180"
              priority
              fetchPriority="high"
            />
            {/* Desktop: inline com o logo */}
            <span className="text-lg lg:text-xl font-bold bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-transparent bg-clip-text tracking-tight hidden sm:block">
              VOLTRIS
            </span>
          </Link>

          {/* Mobile only: VOLTRIS centralizado via posição absoluta */}
          <span className="sm:hidden absolute left-1/2 -translate-x-1/2 text-lg font-bold bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-transparent bg-clip-text tracking-tight pointer-events-none select-none z-10">
            VOLTRIS
          </span>

          {/* ── Nav Desktop (lg+) ─────────────────────── */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7 h-full flex-1 justify-center relative z-20">
            {mainNavLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`text-sm font-medium transition-all duration-300 relative group py-2 whitespace-nowrap shrink-0 text-gray-700 hover:text-blue-600`}
              >
                {link.name}
                <span className="absolute bottom-0 left-0 h-[2px] bg-blue-600 transition-all duration-300 rounded-full w-0 opacity-0 group-hover:w-full group-hover:opacity-100" />
              </Link>
            ))}

            {/* Dropdown Soluções */}
            <div
              className="relative h-full flex items-center shrink-0"
              onMouseEnter={() => setIsServicesDropdownOpen(true)}
              onMouseLeave={() => setIsServicesDropdownOpen(false)}
            >
              <button
                className={`text-sm font-medium transition-all duration-300 relative group py-2 whitespace-nowrap text-gray-700 hover:text-blue-600`}
                aria-haspopup="true"
                aria-expanded={isServicesDropdownOpen}
              >
                Soluções
                <span className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 transition-all duration-300 rounded-full w-0 opacity-0 group-hover:w-full group-hover:opacity-100" />
              </button>

              {/* Dropdown Panel */}
              <div
                className={`absolute left-1/2 -translate-x-1/2 top-full w-[550px] bg-white/95 backdrop-blur-2xl rounded-b-2xl rounded-t-none shadow-xl py-8 px-8 transition-all duration-300 z-50 border border-gray-200 border-t-0 ${
                  isServicesDropdownOpen
                    ? 'opacity-100 visible translate-y-0'
                    : 'opacity-0 invisible -translate-y-2'
                }`}
              >
                <div className="grid grid-cols-2 gap-x-10 gap-y-8">
                  {servicesNavLinks.map((cat) => (
                    <div key={cat.category} className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] border-b border-gray-200 pb-2">
                        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text">
                          {cat.category}
                        </span>
                      </h4>
                      <div className="space-y-2">
                        {cat.items.map((item) => {
                          const isActive = pathname === item.path;
                          return (
                            <Link
                              key={item.path}
                              href={item.path}
                              onClick={() =>
                                item.path === '/voltrisoptimizer' && notifyDownload('Header Menu Click')
                              }
                              className={`group/item block p-2 rounded-xl transition-all duration-300 border ${
                                isActive
                                  ? 'bg-blue-50 border-blue-200'
                                  : 'hover:bg-gray-50 border-transparent'
                              }`}
                            >
                              <div className="flex flex-col">
                                <span
                                  className={`text-sm font-bold transition-colors ${
                                    isActive ? 'text-blue-600' : 'text-gray-700 group-hover/item:text-blue-600'
                                  }`}
                                >
                                  {item.name}
                                </span>
                                <span className="text-[10px] text-gray-500 font-medium tracking-tight">
                                  {item.desc}
                                </span>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <Link
                    href="/servicos"
                    className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700 text-xs font-bold transition-all uppercase tracking-widest"
                  >
                    Ver Todos os Serviços <span className="text-blue-600">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          {/* ── Actions Desktop (lg+) ─────────────────── */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3 z-20 relative shrink-0">
            {loading && !user && !forceLoaded ? (
              <FiLoader className="w-5 h-5 animate-spin text-slate-500" />
            ) : user ? (
              <>
                <NotificationDropdown />
                <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
                  <Link
                    href={isAdmin ? '/restricted-area-admin' : '/dashboard'}
                    className="relative flex items-center gap-1.5 px-4 xl:px-5 py-2 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 group overflow-hidden whitespace-nowrap shadow-sm"
                  >
                    <svg className="w-4 h-4 relative z-10 group-hover:scale-110 transition-transform duration-300 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <linearGradient id="vg-dashboard" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#31A8FF" />
                          <stop offset="50%" stopColor="#8B31FF" />
                          <stop offset="100%" stopColor="#FF4B6B" />
                        </linearGradient>
                      </defs>
                      <rect x="3" y="3" width="7" height="7" rx="1" stroke="url(#vg-dashboard)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <rect x="14" y="3" width="7" height="7" rx="1" stroke="url(#vg-dashboard)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <rect x="14" y="14" width="7" height="7" rx="1" stroke="url(#vg-dashboard)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <rect x="3" y="14" width="7" height="7" rx="1" stroke="url(#vg-dashboard)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="font-bold text-gray-900 relative z-10 text-sm">
                      Dashboard
                    </span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-full hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors"
                    title="Sair"
                  >
                    <FiLogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="relative flex items-center gap-1.5 px-4 xl:px-5 py-2 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 group overflow-hidden whitespace-nowrap shadow-sm"
                >
                  <svg className="w-4 h-4 relative z-10 group-hover:scale-110 transition-transform duration-300 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="vg-desktop" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#31A8FF" />
                        <stop offset="50%" stopColor="#8B31FF" />
                        <stop offset="100%" stopColor="#FF4B6B" />
                      </linearGradient>
                    </defs>
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="url(#vg-desktop)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="7" r="4" stroke="url(#vg-desktop)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="font-bold text-gray-900 relative z-10 text-sm">
                    Login
                  </span>
                </Link>
                <Link
                  href="/login?signup=true"
                  className="relative flex items-center gap-1.5 px-4 xl:px-5 py-2 rounded-2xl bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] hover:from-white hover:via-white hover:to-white transition-all duration-300 group overflow-hidden whitespace-nowrap shadow-sm hover:shadow-md"
                >
                  <FiUserPlus className="w-4 h-4 text-white group-hover:text-gray-900 relative z-10 group-hover:scale-110 transition-transform duration-300 shrink-0" />
                  <span className="font-bold text-white group-hover:text-gray-900 relative z-10 text-sm">Cadastro</span>
                </Link>
              </div>
            )}
          </div>

          {/* ── Hamburger (abaixo de lg / <1024px) ──── */}
          <div className="lg:hidden z-[101] ml-auto shrink-0">
            <button
              className="hamburger-button hamburger-icon mobile-menu-optimized p-2 text-gray-900 hover:scale-110 active:scale-95"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            >
              <div className="relative w-6 h-6 hamburger-icon">
                <FiMenu 
                  className={`absolute inset-0 hamburger-icon transition-opacity duration-150 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`} 
                />
                <FiX 
                  className={`absolute inset-0 hamburger-icon transition-opacity duration-150 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`} 
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile / Tablet Drawer ───────────────────── */}
      <AnimatePresence mode="wait">
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="mobile-menu-drawer mobile-menu-optimized fixed inset-0 z-[95] bg-white/98 backdrop-blur-lg lg:hidden pt-16"
          >
            <div className="flex flex-col h-full overflow-y-auto">
              <nav className="flex flex-col gap-1 px-6 pt-4">
                {mainNavLinks.map((link) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-2xl font-bold py-4 border-b border-gray-200 flex items-center justify-between group ${
                      pathname === link.path ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                    }`}
                  >
                    <span>{link.name}</span>
                    <span className="text-gray-300 group-hover:text-blue-600 transition-colors">→</span>
                  </Link>
                ))}

                {/* Soluções Accordion Mobile */}
                <details className="group border-b border-gray-200">
                  <summary className="text-2xl font-bold py-4 flex items-center justify-between cursor-pointer text-gray-700 hover:text-blue-600 list-none">
                    <span>Soluções</span>
                    <span className="text-gray-300 group-hover:text-blue-600 transition-colors group-open:rotate-180 inline-block transition-transform">▼</span>
                  </summary>
                  <div className="ml-4 pb-4 space-y-6">
                    {servicesNavLinks.map((cat) => (
                      <div key={cat.category} className="space-y-2">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text">
                            {cat.category}
                          </span>
                        </h4>
                        <div className="flex flex-col gap-1">
                          {cat.items.map((item) => (
                            <Link
                              key={item.path}
                              href={item.path}
                              onClick={() => {
                                setIsMobileMenuOpen(false);
                                if (item.path === '/voltrisoptimizer') notifyDownload('Mobile Header Menu Click');
                              }}
                              className={`block text-lg font-bold py-2 ${
                                pathname === item.path ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                              }`}
                            >
                              <div className="flex flex-col">
                                <span>{item.name}</span>
                                <span className="text-[10px] text-slate-500 font-medium -mt-1">{item.desc}</span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </details>
              </nav>

              <div className="mt-auto px-6 pb-8 pt-6 space-y-3">
                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/20"
                    >
                      <FiLayout /> Acessar Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-gray-100 text-red-600 font-bold"
                    >
                      <FiLogOut /> Sair
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-900 font-bold transition-all"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <linearGradient id="vg-mobile" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#31A8FF" />
                            <stop offset="50%" stopColor="#8B31FF" />
                            <stop offset="100%" stopColor="#FF4B6B" />
                          </linearGradient>
                        </defs>
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="url(#vg-mobile)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="12" cy="7" r="4" stroke="url(#vg-mobile)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span>Login</span>
                    </Link>
                    <Link
                      href="/login?signup=true"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] hover:from-white hover:via-white hover:to-white text-white hover:text-gray-900 font-bold transition-all group"
                    >
                      <FiUserPlus className="w-5 h-5 text-white group-hover:text-gray-900" />
                      <span className="text-white group-hover:text-gray-900">Cadastro</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
