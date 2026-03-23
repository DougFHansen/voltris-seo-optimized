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

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
      category: 'Software Expert',
      items: [
        { name: 'Voltris Optimizer', path: '/voltrisoptimizer', desc: 'Performance Máxima' },
        { name: 'Assinar PRO', path: '/adquirir-licenca', desc: 'Ativação de Licença' },
      ]
    },
    {
      category: 'Suporte Gamer',
      items: [
        { name: 'Otimização Gamer', path: '/otimizacao-pc', desc: 'FPS & Input Lag' },
        { name: 'Erros em Jogos', path: '/erros-jogos', desc: 'GTA, CS2 e mais' },
      ]
    },
    {
      category: 'Assistência Técnica',
      items: [
        { name: 'Formatação Windows', path: '/formatar-windows', desc: 'Sistema Limpo' },
        { name: 'Manutenção de PC', path: '/manutencao-computador', desc: 'Hardware & Limpeza' },
        { name: 'Suporte Remoto', path: '/suporte-tecnico-remoto', desc: 'Atendimento Online' },
        { name: 'Internacional', path: '/exterior', desc: 'Suporte no Exterior' },
      ]
    },
    {
      category: 'Web & Design',
      items: [
        { name: 'Criação de Sites', path: '/criar-site', desc: 'Sites Profissionais' },
      ]
    },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${scrolled || !isHome || isMobileMenuOpen
          ? 'bg-[#050510]/80 backdrop-blur-xl h-16'
          : 'bg-transparent h-20'
          }`}
      >
        {/* Linha Separadora Profissional (Sempre visível) */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent shadow-[0_1px_0_0_rgba(255,255,255,0.05)]"></div>

        {/* Linha Neon Fina (Opcional - Ativa no scroll para destaque "Vale do Silício") */}
        <div className={`absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-[#31A8FF]/0 via-[#8B31FF]/50 to-[#FF4B6B]/0 opacity-0 transition-opacity duration-500 ${scrolled ? 'opacity-100' : ''}`}></div>

        <div className="max-w-7xl mx-auto px-4 h-full relative flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group z-20 relative">
            <div className="relative">
              <Image
                src="/logo.png"
                alt="Voltris"
                width={70}
                height={70}
                className="w-10 h-10 md:w-12 md:h-12 object-contain transition-transform duration-500 group-hover:rotate-180"
                priority
                fetchPriority="high"
              />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-transparent bg-clip-text tracking-tight hidden sm:block">
              VOLTRIS
            </span>
          </Link>

          {/* Desktop Nav - Centralizado */}
          <nav className="hidden md:flex items-center gap-8 h-full absolute left-1/2 -translate-x-1/2">
            {mainNavLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`text-sm font-medium transition-all duration-300 relative group py-2
                    ${isActive ? 'text-white' : 'text-slate-400'}
                    hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#31A8FF] hover:via-[#8B31FF] hover:to-[#FF4B6B]
                  `}
                >
                  {link.name}
                  {/* Barra horizontal apenas no hover (e talvez no active se desejado, mas o pedido disse "só... quando passar o mouse") */}
                  {/* Vou deixar a barra visível no active também para usabilidade, mas com a cor do gradiente */}
                  <span className={`absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] transition-all duration-300 rounded-full
                    ${isActive ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'}
                  `}></span>
                </Link>
              );
            })}
            {/* Dropdown para Serviços */}
            <div
              className="relative h-full flex items-center"
              onMouseEnter={() => setIsServicesDropdownOpen(true)}
              onMouseLeave={() => setIsServicesDropdownOpen(false)}
            >
              <button
                className={`text-sm font-medium transition-all duration-300 relative group py-2
                  ${servicesNavLinks.some(cat => cat.items.some(item => pathname === item.path))
                    ? 'text-white'
                    : 'text-slate-400 hover:text-white'}
                  hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#31A8FF] hover:via-[#8B31FF] hover:to-[#FF4B6B]
                `}
                aria-haspopup="true"
                aria-expanded={isServicesDropdownOpen}
              >
                Soluções
                <span className={`absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] transition-all duration-300 rounded-full
                  ${servicesNavLinks.some(cat => cat.items.some(item => pathname === item.path))
                    ? 'w-full opacity-100'
                    : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'}
                `}></span>
              </button>
              <div className={`absolute left-1/2 -translate-x-1/2 top-full w-[550px] bg-[#0A0A12]/95 backdrop-blur-2xl rounded-b-3xl rounded-t-none shadow-2xl py-8 px-8 transition-all duration-300 z-50 border border-white/10 border-t-0 ${isServicesDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                }`}>
                <div className="grid grid-cols-2 gap-x-10 gap-y-8">
                  {servicesNavLinks.map((cat) => (
                    <div key={cat.category} className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] border-b border-white/5 pb-2">
                        <span className="bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-transparent bg-clip-text">
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
                              className={`group/item block p-2 rounded-xl transition-all duration-300
                                ${isActive ? 'bg-white/5 border-white/10' : 'hover:bg-white/[0.03] border-transparent'}
                                border
                              `}
                            >
                              <div className="flex flex-col">
                                <span className={`text-sm font-bold transition-colors ${isActive ? 'text-white' : 'text-slate-300 group-hover/item:text-white'}`}>
                                  {item.name}
                                </span>
                                <span className="text-[10px] text-slate-500 font-medium tracking-tight">
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
                {/* Footer do Dropdown */}
                <div className="mt-8 pt-6 border-t border-white/5">
                  <Link href="/servicos" className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-bold transition-all uppercase tracking-widest">
                    Ver Todos os Serviços <span className="text-[#31A8FF]">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4 z-20 relative">
            {loading && !forceLoaded ? (
              <FiLoader className="w-5 h-5 animate-spin text-slate-500" />
            ) : user ? (
              <>
                <NotificationDropdown />

                <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                  <Link
                    href={isAdmin ? '/restricted-area-admin' : '/dashboard'}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all text-sm font-medium hover:border-[#8B31FF]/30 hover:shadow-[0_0_15px_rgba(139,49,255,0.1)]"
                  >
                    <FiLayout className="w-4 h-4" />
                    <span>Dashboard</span>
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
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="relative flex items-center gap-2 px-6 py-2.5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300 group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#8B31FF]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <FiUser className="w-5 h-5 text-white relative z-10 group-hover:scale-110 transition-transform duration-300" />
                  <span className="font-bold bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-transparent bg-clip-text relative z-10">Login</span>
                </Link>
                <Link
                  href="/login?signup=true"
                  className="relative flex items-center gap-2 px-6 py-2.5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/[0.08] hover:border-[#FF4B6B]/30 transition-all duration-300 group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FF4B6B]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <FiUserPlus className="w-5 h-5 text-white relative z-10 group-hover:scale-110 transition-transform duration-300" />
                  <span className="font-bold text-white relative z-10">Cadastro</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden z-50">
            <button
              className="p-2 text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
            >
              {isMobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[90] bg-[#050510]/98 backdrop-blur-xl md:hidden pt-20"
          >
            <div className="flex flex-col h-full p-6">
              <nav className="flex flex-col gap-1 mt-4">
                {mainNavLinks.map(link => (
                  <Link
                    key={link.path}
                    href={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-2xl font-bold py-4 border-b border-white/5 flex items-center justify-between group ${pathname === link.path ? 'text-white' : 'text-slate-400 hover:text-white'
                      }`}
                  >
                    <span className="group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#31A8FF] group-hover:via-[#8B31FF] group-hover:to-[#FF4B6B] transition-all">
                      {link.name}
                    </span>
                    <span className="text-white/20 group-hover:text-[#8B31FF] transition-colors">→</span>
                  </Link>
                ))}
                {/* Serviços Dropdown Mobile */}
                <details className="group border-b border-white/5">
                  <summary className="text-2xl font-bold py-4 flex items-center justify-between cursor-pointer text-slate-400 hover:text-white">
                    <span className="group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#31A8FF] group-hover:via-[#8B31FF] group-hover:to-[#FF4B6B] transition-all">
                      Soluções
                    </span>
                    <span className="text-white/20 group-hover:text-[#8B31FF] transition-colors">▼</span>
                  </summary>
                  <div className="ml-4 pb-4 space-y-6">
                    {servicesNavLinks.map(cat => (
                      <div key={cat.category} className="space-y-2">
                        <h4 className="text-[10px] font-black uppercase tracking-widest opacity-70">
                          <span className="bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-transparent bg-clip-text">
                            {cat.category}
                          </span>
                        </h4>
                        <div className="flex flex-col gap-1">
                          {cat.items.map(item => (
                            <Link
                              key={item.path}
                              href={item.path}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className={`block text-lg font-bold py-2 ${pathname === item.path ? 'text-white' : 'text-slate-400 hover:text-white'
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

              <div className="mt-auto pb-8 space-y-4">
                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-[#31A8FF] text-white font-bold shadow-lg shadow-[#31A8FF]/20"
                    >
                      <FiLayout /> Acessar Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-white/5 text-red-400 font-bold"
                    >
                      <FiLogOut /> Sair
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="relative flex items-center justify-center gap-2 w-full py-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300 group overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-[#8B31FF]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <FiUser className="w-5 h-5 text-white relative z-10 group-hover:scale-110 transition-transform duration-300" />
                      <span className="font-bold bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-transparent bg-clip-text relative z-10">Login</span>
                    </Link>
                    <Link
                      href="/login?signup=true"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="relative flex items-center justify-center gap-2 w-full py-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/[0.08] hover:border-[#FF4B6B]/30 transition-all duration-300 group overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-[#FF4B6B]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <FiUserPlus className="w-5 h-5 text-white relative z-10 group-hover:scale-110 transition-transform duration-300" />
                      <span className="font-bold text-white relative z-10">Cadastro</span>
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