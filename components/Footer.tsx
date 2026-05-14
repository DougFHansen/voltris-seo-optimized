'use client';

import React, { useState, useEffect } from "react";
import Link from 'next/link';
import Image from 'next/image';
import NewsletterForm from './NewsletterForm';
import { FiInstagram, FiLinkedin, FiMail, FiMapPin, FiPhone, FiClock } from 'react-icons/fi';
import { notifyDownload } from '@/utils/notifications';

export default function Footer() {
  const [year, setYear] = useState<number | null>(null);
  useEffect(() => setYear(new Date().getFullYear()), []);

  const links = {
    quick: [
      { name: 'Home', path: '/' },
      { name: 'Serviços', path: '/todos-os-servicos' },
      { name: 'Guias', path: '/guias' },
      { name: 'Gamers', path: '/voltrisoptimizer' },
      { name: 'Contato', path: '/contato' },
    ],
    services: [
      { name: 'Hub Gamer', path: '/gamer' },
      { name: 'Hub Corporativo (B2B)', path: '/corporativo' },
      { name: 'Hub Residencial (Home)', path: '/home' },
      { name: 'Voltris Optimizer', path: '/voltrisoptimizer' },
      { name: 'Criação de Sites', path: '/criar-site' },
    ],
    cities: [
      { name: 'São Paulo', path: '/tecnico-informatica-em/sao-paulo' },
      { name: 'Rio de Janeiro', path: '/tecnico-informatica-em/rio-de-janeiro' },
      { name: 'Belo Horizonte', path: '/tecnico-informatica-em/belo-horizonte' },
      { name: 'Curitiba', path: '/tecnico-informatica-em/curitiba' },
    ],
    legal: [
      { name: 'Privacidade', path: '/politica-privacidade' },
      { name: 'Termos de Uso', path: '/termos-uso' },
      { name: 'LGPD', path: '/lgpd' },
      { name: 'Reembolso e Cancelamento', path: '/reembolso-cancelamento' },
    ]
  };

  return (
    <footer className="bg-[#020205] border-t border-white/5 relative overflow-hidden font-sans">
      {/* Background Ambience */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-[128px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[128px] pointer-events-none"></div>
      <div className="absolute inset-0 noise-bg z-[1]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 items-start">

          {/* Col 1: Info & Brand */}
          <div className="space-y-6 flex flex-col items-center md:items-start text-center md:text-left">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative">
                <Image
                  src="/logo.png"
                  alt="Voltris"
                  width={48}
                  height={48}
                  className="w-12 h-12 object-contain logo-rotate group-hover:scale-110 transition-transform"
                />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-transparent bg-clip-text tracking-tight">VOLTRIS</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Soluções em informática remota para todo o Brasil. Tecnologia de ponta e segurança.
            </p>
            <div className="flex gap-3 justify-center md:justify-start">
              <a href="https://instagram.com/voltristech" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 hover:text-pink-400 text-slate-400 transition-all border border-white/10 hover:border-pink-500/50" aria-label="Siga-nos no Instagram">
                <FiInstagram className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com/company/voltris" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 hover:text-blue-400 text-slate-400 transition-all border border-white/10 hover:border-blue-500/50" aria-label="Siga-nos no LinkedIn">
                <FiLinkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Col 2: Newsletter */}
          <div className="space-y-6 text-center md:text-left">
            <h3 className="font-bold text-white text-base">Receba Novidades</h3>
            <div className="space-y-3">
              <NewsletterForm source="site" />
              <p className="text-xs text-slate-500 leading-relaxed">
                Receba dicas e promoções exclusivas da Voltris diretamente no seu e-mail.
              </p>
            </div>
          </div>

          {/* Col 3: Links */}
          <div className="space-y-6 pl-0 lg:pl-4 text-center md:text-left">
            <h3 className="font-bold text-white text-base">Links Rápidos</h3>
            <ul className="space-y-3 flex flex-col items-center md:items-start">
              {links.quick.map(l => (
                <li key={l.path}>
                  <Link
                    href={l.path}
                    onClick={() => l.path === '/voltrisoptimizer' && notifyDownload('Footer Quick Link Click')}
                    className="text-slate-400 hover:text-blue-400 text-sm transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-blue-500 transition-all duration-300"></span>
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Services */}
          <div className="space-y-6 text-center md:text-left">
            <h3 className="font-bold text-white text-base">Nossos Serviços</h3>
            <ul className="space-y-3 flex flex-col items-center md:items-start">
              {links.services.map(l => (
                <li key={l.path}>
                  <Link href={l.path} className="text-slate-400 hover:text-purple-400 text-sm transition-colors flex items-center gap-2 group">
                    <span className="w-0 group-hover:w-2 h-0.5 bg-purple-500 transition-all duration-300"></span>
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 5: Regional SEO */}
          <div className="space-y-6 text-center md:text-left">
            <h3 className="font-bold text-white text-base">Atendimento Local</h3>
            <ul className="space-y-3 flex flex-col items-center md:items-start">
              {links.cities.map(l => (
                <li key={l.path}>
                  <Link href={l.path} className="text-slate-400 hover:text-emerald-400 text-sm transition-colors flex items-center gap-2 group">
                    <span className="w-0 group-hover:w-2 h-0.5 bg-emerald-500 transition-all duration-300"></span>
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 6: Contact */}
          <div className="space-y-6 text-center md:text-left">
            <h3 className="font-bold text-white text-base">Contato</h3>
            <ul className="space-y-4 flex flex-col items-center md:items-start">
              <li className="group flex items-center md:items-start gap-3 text-sm text-slate-400 hover:text-white transition-colors">
                <FiPhone className="w-5 h-5 text-blue-500 shrink-0 group-hover:scale-110 transition-transform" />
                <span>(11) 99671-6235</span>
              </li>
              <li className="group flex items-center md:items-start gap-3 text-sm text-slate-400 hover:text-white transition-colors text-center md:text-left">
                <FiMail className="w-5 h-5 text-purple-500 shrink-0 group-hover:scale-110 transition-transform" />
                <span className="break-all whitespace-normal">contato@voltristech.com.br</span>
              </li>
              <li className="group flex items-center md:items-start gap-3 text-sm text-slate-400 hover:text-white transition-colors">
                <FiMapPin className="w-5 h-5 text-blue-500 shrink-0 group-hover:scale-110 transition-transform" />
                <span>São Paulo, SP</span>
              </li>
              <li className="group flex items-center md:items-start gap-3 text-sm text-slate-400 hover:text-white transition-colors">
                <FiClock className="w-5 h-5 text-pink-500 shrink-0 group-hover:scale-110 transition-transform" />
                <span>Seg-Sex 7h-19h30<br />Sáb 8h30-19h30</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left space-y-1">
            <p className="text-xs font-semibold text-slate-400">CNPJ: 47.241.737/0001-60</p>
            <p className="text-xs text-slate-500">© {year} VOLTRIS. Todos os direitos reservados.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {links.legal.map(l => (
              <Link key={l.path} href={l.path} className="text-xs text-slate-500 hover:text-white transition-colors relative group">
                {l.name}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
