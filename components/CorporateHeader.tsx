"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, MessageSquare, Briefcase, Shield, Zap } from 'lucide-react';

export default function CorporateHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Site Principal', href: '/' },
    { name: 'Soluções', href: '/corporativo#servicos' },
    { name: 'Segmentos', href: '/corporativo#segmentos' },
    { name: 'Planos', href: '/corporativo/planos' },
    { name: 'Cases', href: '/corporativo/cases' },
    { name: 'Contato', href: '/contato' },
  ];

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-[100] h-20 transition-all duration-500 ${
          scrolled ? 'bg-[#020205]/80 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center gap-4">
          {/* Logo - shrink-0 to prevent compression */}
          <Link href="/corporativo" className="flex items-center gap-2 group z-20 relative shrink-0">
            <Image 
              src="/logo.png" 
              alt="Voltris" 
              width={50} 
              height={50} 
              className="w-10 h-10 lg:w-11 lg:h-11 object-contain"
            />
            <div className="flex flex-col">
              <span className="text-lg lg:text-xl font-bold text-white tracking-tight">VOLTRIS</span>
              <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-blue-500/80 leading-none">Infrastructure</span>
            </div>
          </Link>

          {/* Navigation - flex-1 and justify-center for perfect centering */}
          <nav className="hidden lg:flex items-center justify-center gap-10 h-full flex-1 relative z-20">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-all relative group py-2"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 h-[1px] bg-blue-500/50 transition-all duration-500 rounded-full w-0 opacity-0 group-hover:w-full group-hover:opacity-100" />
              </Link>
            ))}
          </nav>

          {/* Actions - shrink-0 to prevent compression */}
          <div className="hidden lg:flex items-center justify-end shrink-0 z-20 relative">
             <a 
               href="https://wa.me/5511996716235?text=Olá! Gostaria de falar sobre suporte técnico para minha empresa."
               className="px-6 py-2.5 rounded-xl bg-white text-slate-900 text-[11px] font-bold transition-all hover:bg-slate-100 shadow-xl uppercase tracking-[0.15em]"
             >
               Suporte Imediato
             </a>
          </div>

          {/* Mobile Toggle */}
          <button 
            className="lg:hidden p-2 text-white ml-auto"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 z-[110] bg-[#0A0F1C] p-8 lg:hidden"
          >
            <div className="flex items-center justify-between mb-12">
              <Link href="/corporativo" className="flex items-center gap-2">
                <Image src="/logo.png" alt="Voltris" width={40} height={40} />
                <span className="text-xl font-bold text-white">VOLTRIS</span>
              </Link>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-white">
                <X />
              </button>
            </div>
            <nav className="flex flex-col gap-6 mb-12">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-2xl font-bold text-white"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            <div className="space-y-4 mt-auto">
              <a 
                href="https://wa.me/5511996716235"
                className="w-full py-4 rounded-2xl bg-blue-600 text-white font-bold flex items-center justify-center gap-3"
              >
                <MessageSquare /> WhatsApp Consultoria
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
