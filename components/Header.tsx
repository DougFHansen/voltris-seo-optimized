'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import NotificationDropdown from './notifications/NotificationDropdown';
import { useAuth } from '@/app/hooks/useAuth';
import { FiMenu, FiX, FiLogOut, FiLayout, FiLoader, FiUser, FiUserPlus } from 'react-icons/fi';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { notifyDownload } from '@/utils/notifications';

const MobileMenu = dynamic(() => import('./MobileMenu'), { ssr: false });

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const { user, isAdmin, loading, signOut } = useAuth();

  const [forceLoaded, setForceLoaded] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setForceLoaded(true), 500);
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
    let lastKnownScrollPosition = 0;
    let ticking = false;

    const handleScroll = () => {
      lastKnownScrollPosition = window.scrollY;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(lastKnownScrollPosition > 20);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
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
    { name: 'Dúvidas', path: '/duvidas' },
    { name: 'Contato', path: '/contato' },
  ];

  const serviceLinks = [
    { name: 'Otimização de PC', path: '/otimizacao-pc', desc: 'Performance extrema para games e trabalho.' },
    { name: 'Suporte Windows', path: '/suporte-ao-windows', desc: 'Resolução de erros e telas azuis.' },
    { name: 'Formatação Remota', path: '/formatacao', desc: 'Sua máquina nova de novo, à distância.' },
    { name: 'Soluções Web', path: '/soluções-web', desc: 'Sites de alta performance.' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ease-in-out ${
        scrolled 
          ? 'h-16 lg:h-20 bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm' 
          : 'h-20 lg:h-28 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center gap-4">
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
          <span className={`text-lg lg:text-xl font-bold bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-transparent bg-clip-text tracking-tight hidden sm:block transition-opacity duration-500 ${!scrolled && isHome ? 'opacity-90' : 'opacity-100'}`}>
            VOLTRIS
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-5 xl:gap-7 h-full flex-1 justify-center relative z-20">
          {mainNavLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`text-sm font-medium transition-all duration-300 relative group py-2 whitespace-nowrap shrink-0 ${
                scrolled ? 'text-gray-700 hover:text-blue-600' : 'text-gray-200 hover:text-white'
              }`}
            >
              {link.name}
              <span className={`absolute bottom-0 left-0 h-[2px] bg-blue-600 transition-all duration-300 rounded-full w-0 opacity-0 group-hover:w-full group-hover:opacity-100`} />
            </Link>
          ))}

          <div
            className="relative h-full flex items-center shrink-0"
            onMouseEnter={() => setIsServicesDropdownOpen(true)}
            onMouseLeave={() => setIsServicesDropdownOpen(false)}
          >
            <button
              className={`text-sm font-medium transition-all duration-300 relative group py-2 whitespace-nowrap ${
                scrolled ? 'text-gray-700 hover:text-blue-600' : 'text-gray-200 hover:text-white'
              }`}
              aria-haspopup="true"
              aria-expanded={isServicesDropdownOpen}
            >
              Soluções
              <span className={`absolute bottom-0 left-0 h-[2px] bg-blue-600 transition-all duration-300 rounded-full ${isServicesDropdownOpen ? 'w-full opacity-100' : 'w-0 opacity-0'}`} />
            </button>

            <AnimatePresence>
              {isServicesDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-4 mt-0 z-50"
                >
                  {serviceLinks.map((service) => (
                    <Link
                      key={service.path}
                      href={service.path}
                      className="block px-6 py-3 hover:bg-gray-50 transition-colors group"
                    >
                      <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {service.name}
                      </div>
                      <div className="text-[10px] text-gray-500 line-clamp-1">
                        {service.desc}
                      </div>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        <div className="flex items-center gap-3 relative z-20 shrink-0">
          {!loading || forceLoaded ? (
            user ? (
              <>
                <NotificationDropdown />
                <button
                  onClick={() => router.push('/dashboard')}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:shadow-lg transition-all duration-300 uppercase tracking-wider"
                >
                  <FiLayout className="text-sm" />
                  Painel
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Sair"
                >
                  <FiLogOut className="text-lg" />
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`text-xs font-bold px-4 py-2 transition-all duration-300 uppercase tracking-wider ${
                    scrolled ? 'text-gray-700 hover:text-blue-600' : 'text-gray-200 hover:text-white'
                  }`}
                >
                  Login
                </Link>
                <Link
                  href="/contato"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:scale-105 shadow-md transition-all duration-300 uppercase tracking-wider whitespace-nowrap"
                >
                  Contratar
                </Link>
              </>
            )
          ) : (
            <div className="w-24 h-8 bg-gray-200/20 animate-pulse rounded-xl" />
          )}

          <button
            className={`lg:hidden p-2 rounded-xl transition-colors ${
              scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
            }`}
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Menu"
          >
            <FiMenu className="text-2xl" />
          </button>
        </div>
      </div>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        user={user}
        isAdmin={isAdmin}
        signOut={signOut}
        mainLinks={mainNavLinks}
        serviceLinks={serviceLinks}
      />
    </header>
  );
}