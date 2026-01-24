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
  const { user, isAdmin, loading, signOut } = useAuth();
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

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Serviços', path: '/todos-os-servicos' },
    { name: 'Guias', path: '/guias' },
    { name: 'Dúvidas', path: '/faq' },
    { name: 'Contato', path: '/contato' },
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
            <div className="relative w-8 h-8 md:w-9 md:h-9">
              <Image src="/logo.png" alt="Voltris" fill className="object-contain transition-transform duration-500 group-hover:rotate-180" priority />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-transparent bg-clip-text tracking-tight hidden sm:block">
              VOLTRIS
            </span>
          </Link>

          {/* Desktop Nav - Centralizado */}
          <nav className="hidden md:flex items-center gap-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {navLinks.map((link) => {
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
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4 z-20 relative">
            {loading ? (
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
                {navLinks.map(link => (
                  <Link
                    key={link.path}
                    href={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-2xl font-bold py-4 border-b border-white/5 flex items-center justify-between group ${pathname === link.path ? 'text-white' : 'text-slate-500 hover:text-white'
                      }`}
                  >
                    <span className="group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#31A8FF] group-hover:via-[#8B31FF] group-hover:to-[#FF4B6B] transition-all">
                      {link.name}
                    </span>
                    <span className="text-white/20 group-hover:text-[#8B31FF] transition-colors">→</span>
                  </Link>
                ))}
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
                      className="block w-full py-4 text-center text-white font-bold border border-white/10 rounded-2xl bg-white/5"
                    >
                      Fazer Login
                    </Link>
                    <Link
                      href="/login?signup=true"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full py-4 text-center bg-gradient-to-r from-[#FF4B6B] to-[#8B31FF] text-white font-bold rounded-2xl shadow-lg"
                    >
                      Criar Conta Grátis
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