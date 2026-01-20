'use client';

import React from "react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import NewsletterForm from './NewsletterForm';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Footer() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [year, setYear] = useState<number | null>(null);
  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-[#171313] relative overflow-hidden w-full max-w-full">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 pointer-events-none"></div>
      
      {/* Reflexos coloridos */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FF4B6B] opacity-20 rounded-full filter blur-[100px] pointer-events-none" style={{ maxWidth: '100%' }}></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#8B31FF] opacity-20 rounded-full filter blur-[100px] pointer-events-none" style={{ maxWidth: '100%' }}></div>
      <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-[#31A8FF] opacity-20 rounded-full filter blur-[100px] pointer-events-none" style={{ maxWidth: '100%' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8 text-center sm:text-left items-start w-full">
          {/* Company Info */}
          <div className="space-y-4 flex flex-col items-center justify-center lg:items-start lg:justify-start lg:!items-start lg:!justify-start lg:text-left lg:mx-0 lg:pl-0 lg:pr-8">
            <Link href="/" className="flex items-center group w-full max-w-[120px] mx-auto lg:mx-0">
              <div className="relative">
                <Image 
                  src="/logo.png" 
                  alt="VOLTRIS - Suporte Técnico Remoto e Criação de Sites Profissionais" 
                  width={60} 
                  height={60} 
                  className="h-8 w-auto block object-contain logo-rotate" 
                  style={{
                    color: 'transparent', 
                    maxWidth: '100%', 
                    height: 'auto'
                  }} 
                  priority
                />
              </div>
              <span className="ml-2 sm:ml-4 text-lg sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-transparent bg-clip-text drop-shadow-lg select-none" style={{letterSpacing: '0.04em'}}>VOLTRIS</span>
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed text-center lg:text-left mt-2">
              Soluções em informática remota para todo o Brasil. Atendimento especializado e suporte técnico de qualidade.
            </p>
            <div className="flex space-x-4 mt-2 justify-center lg:justify-start">
              <a 
                href="https://www.instagram.com/voltristech/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#8B31FF] transition-colors duration-300 group relative"
                aria-label="Instagram da Voltris"
                title="Instagram da Voltris"
              >
                <i className="fab fa-instagram text-xl"></i>
              </a>
              <a 
                href="https://www.linkedin.com/company/voltris/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#FF4B6B] transition-colors duration-300 group relative"
                aria-label="LinkedIn da Voltris"
                title="LinkedIn da Voltris"
              >
                <i className="fab fa-linkedin text-xl"></i>
              </a>
            </div>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col items-center justify-center w-full sm:w-auto col-span-1 sm:col-span-2 lg:col-span-1 order-1 sm:order-none mb-8 sm:mb-0 lg:items-start lg:justify-start">
            <h3 className="text-white font-semibold mb-4 text-lg text-center sm:text-left">Receba Novidades</h3>
            <NewsletterForm source="site" />
            <p className="text-xs text-gray-400 mt-2 text-center max-w-xs">Receba dicas, novidades e promoções exclusivas da Voltris diretamente no seu e-mail.</p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center justify-center lg:items-start lg:justify-start">
            <h3 className="text-white font-semibold mb-4 text-lg text-center sm:text-left">Links Rápidos</h3>
            <ul className="space-y-2">
              {[
                { name: 'Home', path: '/' },
                { name: 'Sobre', path: '/about' },
                { name: 'Serviços', path: '/todos-os-servicos' },
                { name: 'Guias', path: '/guias' },
                { name: 'Gamers', path: '/gamers' },
                { name: 'Contato', path: '/contato' }
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.path}
                    className="text-gray-400 hover:text-white transition-colors duration-300 group relative inline-block"
                  >
                    <span className="relative z-10">{link.name}</span>
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="flex flex-col items-center justify-center lg:items-start lg:justify-start">
            <h3 className="text-white font-semibold mb-4 text-lg text-center sm:text-left">Nossos Serviços</h3>
            <ul className="space-y-2">
              {[
                { name: 'Formatação', id: 'formatacao' },
                { name: 'Otimização', id: 'otimizacao' },
                { name: 'Recuperação de Dados', id: 'recuperacao' },
                { name: 'Instalação de Programas', id: 'instalacao_programas' },
                { name: 'Remoção de Vírus', id: 'remocao_virus' }
              ].map((service) => (
                <li key={service.name}>
                  <Link 
                    href={`/servicos?abrir=${service.id}`}
                    className="text-gray-400 hover:text-white transition-colors duration-300 group relative inline-block"
                  >
                    <span className="relative z-10">{service.name}</span>
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col items-center justify-center">
            <h3 className="text-white font-semibold mb-4 text-lg text-center sm:text-left">Contato</h3>
            <ul className="space-y-3 text-center sm:text-left">
              <li className="flex flex-col items-center justify-center sm:flex-row sm:items-center sm:justify-start space-y-1 sm:space-y-0 sm:space-x-3 text-gray-400 group">
                <i className="fas fa-phone text-[#FF4B6B] group-hover:scale-110 transition-transform duration-300"></i>
                <span className="group-hover:text-white transition-colors duration-300">(11)99671-6235</span>
              </li>
              <li className="flex flex-col items-center justify-center sm:flex-row sm:items-center sm:justify-start space-y-1 sm:space-y-0 sm:space-x-3 text-gray-400 group">
                <i className="fas fa-envelope text-[#8B31FF] group-hover:scale-110 transition-transform duration-300"></i>
                <span className="group-hover:text-white transition-colors duration-300">contato@voltris.com.br</span>
              </li>
              <li className="flex flex-col items-center justify-center sm:flex-row sm:items-center sm:justify-start space-y-1 sm:space-y-0 sm:space-x-3 text-gray-400 group">
                <i className="fas fa-map-marker-alt text-[#31A8FF] group-hover:scale-110 transition-transform duration-300"></i>
                <span className="group-hover:text-white transition-colors duration-300">São Paulo, SP</span>
              </li>
              <li className="flex flex-col items-center justify-center sm:flex-row sm:items-center sm:justify-start space-y-1 sm:space-y-0 sm:space-x-3 text-gray-400 group">
                <i className="fas fa-clock text-[#FF4B6B] group-hover:scale-110 transition-transform duration-300"></i>
                <span className="group-hover:text-white transition-colors duration-300">Atendimento: Seg–Sex 7h–19h30 | Sáb 8h30–19h30 | Dom: Fechado</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-center gap-4 mt-8 sm:mt-12">
          <p className="text-gray-400 text-sm text-center font-semibold">CNPJ: 47.241.737/0001-60</p>
          <p className="text-gray-400 text-sm text-center">
            © {year ?? ''} VOLTRIS. Todos os direitos reservados.
          </p>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6 mt-4 sm:mt-0 justify-center items-center">
            <Link 
              href="/politica-privacidade"
              className="text-gray-400 text-sm hover:text-white transition-colors duration-300 group relative"
            >
              <span className="relative z-10">Política de Privacidade</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#FF4B6B] to-[#8B31FF] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link 
              href="/lgpd"
              className="text-gray-400 text-sm hover:text-white transition-colors duration-300 group relative"
            >
              <span className="relative z-10">Lei De Proteção Geral de Dados</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#31A8FF] to-[#FF4B6B] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link 
              href="/termos-uso"
              className="text-gray-400 text-sm hover:text-white transition-colors duration-300 group relative"
            >
              <span className="relative z-10">Termos de Uso</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#8B31FF] to-[#31A8FF] transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </div>
        </div>
      </div>
      {/* Links internos contextuais para SEO (invisível para usuários, visível para bots) */}
      <div style={{display:'none'}} aria-hidden={true}>
        <a href="/tecnico-informatica">Técnico de Informática Online</a>
        <a href="/tecnico-informatica-minha-regiao">Técnico de Informática na Minha Região</a>
        <a href="/tecnico-informatica-atende-casa">Técnico de Informática em Casa</a>
        <a href="/criar-site">Criar Site Profissional</a>
        <a href="/criadores-de-site">Criadores de Site</a>
        <a href="/servicos">Serviços de Informática</a>
        <a href="/todos-os-servicos">Todos os Serviços</a>
        <a href="/formatacao">Formatação de Computador</a>
        <a href="/otimizacao-pc">Otimização de PC</a>
        <a href="/instalacao-office">Instalação de Office</a>
        <a href="/erros-jogos">Erros em Jogos</a>
        <a href="/optimizer">Optimizer</a>
        <a href="/gamers">Gamers</a>
        <a href="/todos-os-servicos/criacao-de-sites">Criação de Sites</a>
        <a href="/todos-os-servicos/suporte-windows">Suporte Windows</a>
        <a href="/todos-os-servicos/instalacao-de-programas">Instalação de Programas</a>
        <a href="/todos-os-servicos/criacao-de-sites/plano-basico">Plano Básico de Sites</a>
        <a href="/todos-os-servicos/criacao-de-sites/plano-profissional">Plano Profissional de Sites</a>
        <a href="/todos-os-servicos/criacao-de-sites/plano-empresarial">Plano Empresarial de Sites</a>
        <a href="/blog">Blog</a>
        <a href="/about">Sobre a Voltris</a>
        <a href="/faq">FAQ</a>
        <a href="/reviews">Reviews</a>
        <a href="/lgpd">LGPD</a>
        <a href="/politica-privacidade">Política de Privacidade</a>
        <a href="/termos-uso">Termos de Uso</a>
      </div>
    </footer>
  );
} 