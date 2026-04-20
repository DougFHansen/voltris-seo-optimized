'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import { FAQSchema } from '@/components/SEOStructuredData';
import { motion, useScroll, useSpring } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { Clock, ArrowRight, BookOpen, User, Calendar, Award, CheckCircle, AlertTriangle, Star, ExternalLink, ChevronRight, Lightbulb, Target } from 'lucide-react';

import { notifyDownload } from '@/utils/notifications';
import DOMPurify from 'isomorphic-dompurify';
import OptimizerMockup from '@/components/OptimizerMockup';
import { Download, Zap } from 'lucide-react';

export interface SummaryTableItem {
    label: string;
    value: string;
}

export interface ContentSection {
    title: string;
    content: string;
    subsections?: Subsection[];
}

export interface Subsection {
    subtitle: string;
    content: string;
}

export interface RelatedGuide {
    href: string;
    title: string;
    description: string;
}

export interface ExternalReference {
    name: string;
    url: string;
}

export interface GuideTemplateProps {
    title: string;
    description: string;
    keywords: string[];
    estimatedTime: string;
    difficultyLevel: string;
    contentSections: ContentSection[];
    relatedGuides?: RelatedGuide[];
    author?: string;
    authorBio?: string;
    authorCredentials?: string[];
    lastUpdated?: string;
    summaryTable?: SummaryTableItem[];
    faqItems?: Array<{ question: string; answer: string }>;
    /** Links externos para fontes oficiais — melhora E-E-A-T */
    externalReferences?: ExternalReference[];
    /** Seções avançadas de conteúdo para guias técnicos */
    advancedContentSections?: ContentSection[];
    /** Seções adicionais de conteúdo */
    additionalContentSections?: ContentSection[];
    /** Exibir CTA do Voltris Optimizer */
    showVoltrisOptimizerCTA?: boolean;
    /** Pontos-chave do guia para o TL;DR no topo */
    keyPoints?: string[];
    /** Avisos importantes como alertas */
    warningNote?: string;
    children?: React.ReactNode;
}

// Calcula o tempo de leitura estimado baseado no conteúdo
function calcReadingTime(sections: ContentSection[]): number {
    const totalText = sections.map(s => (s.content || '') + (s.subsections?.map(sub => sub.content || '').join(' ') || '')).join(' ');
    const wordCount = (totalText || '').replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length;
    return Math.max(3, Math.ceil(wordCount / 200));
}

export function GuideTemplateClient({
    title,
    description,
    keywords,
    estimatedTime,
    difficultyLevel,
    contentSections,
    relatedGuides = [],
    author = "Douglas F. Hansen",
    authorBio = "Especialista em otimização de sistemas Windows com anos de experiência em diagnóstico de hardware, tuning de kernel e suporte técnico avançado. Fundador da Voltris e desenvolvedor do Voltris Optimizer.",
    authorCredentials = ["Especialista em Sistemas Windows", "Desenvolvedor do Voltris Optimizer", "Suporte Técnico Avançado"],
    lastUpdated = "2026",
    summaryTable,
    faqItems,
    externalReferences = [],
    advancedContentSections,
    additionalContentSections,
    showVoltrisOptimizerCTA = true,
    keyPoints,
    warningNote,
    children
}: GuideTemplateProps) {
    const pathname = usePathname();
    const hasCustomConclusion = contentSections.some(section =>
        section.title.toLowerCase().includes('conclusão') ||
        section.title.toLowerCase().includes('conclusao') ||
        section.title.toLowerCase().includes('considerações finais')
    );

    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const readingMinutes = calcReadingTime(contentSections);
    const difficultyColor = difficultyLevel === 'Iniciante' ? 'text-emerald-400' : difficultyLevel === 'Intermediário' ? 'text-yellow-400' : 'text-red-400';
    const difficultyBg = difficultyLevel === 'Iniciante' ? 'border-emerald-400/20 bg-emerald-400/5' : difficultyLevel === 'Intermediário' ? 'border-yellow-400/20 bg-yellow-400/5' : 'border-red-400/20 bg-red-400/5';

  // JSON-LD Article Schema para máximo E-E-A-T
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": title,
    "description": description,
    "keywords": keywords.join(", "),
    "author": {
      "@type": "Person",
      "name": author,
      "url": "https://voltris.com.br/sobre",
      "jobTitle": "Especialista em Otimização de Sistemas",
      "worksFor": {
        "@type": "Organization",
        "name": "Voltris",
        "url": "https://voltris.com.br"
      }
    },
    "publisher": {
      "@type": "Organization",
      "name": "Voltris",
      "url": "https://voltris.com.br",
      "logo": {
        "@type": "ImageObject",
        "url": "https://voltris.com.br/logo.png"
      }
    },
    "dateModified": `${lastUpdated}-01-01`,
    "datePublished": "2025-01-01",
    "inLanguage": "pt-BR",
    "learningResourceType": "Tutorial",
    "educationalLevel": difficultyLevel,
    "timeRequired": `PT${readingMinutes}M`
  };

  // JSON-LD HowTo Schema - Isso faz o Google mostrar o guia como um "Passo a Passo" rico nos resultados
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": title,
    "description": description,
    "totalTime": `PT${readingMinutes}M`,
    "step": contentSections.map((section, idx) => ({
      "@type": "HowToStep",
      "url": `https://voltris.com.br${pathname}/#section-${idx}`,
      "name": section.title || '',
      "itemListElement": [{
        "@type": "HowToDirection",
        "text": (section.content || '').replace(/<[^>]*>/g, '').substring(0, 500)
      }]
    }))
  };

    // Auto-track download clicks in HTML content (dangerouslySetInnerHTML)
    useEffect(() => {
        const handleContentClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const link = target.closest('a');
            if (link && link.href && (link.href.toLowerCase().endsWith('.exe') || link.href.includes('github.com/DougFHansen/voltris-releases'))) {
                const fileName = link.href.split('/').pop() || 'Unknown File';
                notifyDownload(`Automatic Guide link click: ${fileName}`);
            }
        };

        const article = document.querySelector('article');
        article?.addEventListener('click', handleContentClick, { capture: true });
        return () => article?.removeEventListener('click', handleContentClick);
    }, []);

    // Componente Interno de Banner para Reuso Estratégico
    const VoltrisOptimizerBanner = ({ isSecondary = false }) => (
        <div className={`my-12 relative group ${isSecondary ? 'opacity-90 scale-95' : ''}`}>
            <div className="absolute -inset-1 bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] rounded-3xl opacity-30 group-hover:opacity-60 blur-xl transition duration-500"></div>
            <div className="relative bg-[#050510]/80 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 overflow-hidden flex flex-col xl:flex-row items-center gap-12">
                <div className="flex-1 space-y-6 z-10 text-center xl:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#31A8FF]/10 border border-[#31A8FF]/20 text-[#31A8FF] text-[10px] font-black uppercase tracking-[0.2em]">
                        <Zap className="w-3 h-3 fill-current" /> Otimização Recomendada
                    </div>
                    <h3 className="text-3xl md:text-5xl font-black text-white leading-tight uppercase italic tracking-tighter">
                        Não faça no <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#31A8FF] to-[#8B31FF]">Manual.</span>
                    </h3>
                    <p className="text-slate-400 text-lg leading-relaxed font-bold">
                        O <span className="text-white">Voltris Optimizer</span> automatiza todo este guia e remove o delay do seu Windows em segundos.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center xl:justify-start">
                        <Link
                            href="/voltrisoptimizer"
                            onClick={() => notifyDownload(`Guide CTA Click - ${title}`)}
                            className="px-10 py-5 bg-white text-black font-black uppercase italic tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_rgba(255,255,255,0.1)] flex items-center justify-center gap-3 group"
                        >
                            <span>Baixar Agora</span>
                            <Download className="w-5 h-5 group-hover:animate-bounce" />
                        </Link>
                    </div>
                </div>
                <div className="w-full xl:w-[450px] shrink-0">
                    <OptimizerMockup />
                </div>
            </div>
        </div>
    );

    const allSections = [
        ...contentSections,
        ...(advancedContentSections || []),
        ...(additionalContentSections || []),
    ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <Header />

      {/* Barra de Progresso de Leitura Viral */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] z-[100] origin-left"
        style={{ scaleX }}
      />

      {/* Viral Floating Share Buttons (Discord & WhatsApp) */}
      <div className="fixed bottom-8 left-8 flex flex-col gap-4 z-50 animate-in slide-in-from-left duration-700">
        <a
          href={`https://wa.me/?text=Olha%20esse%20guia%20da%20Voltris:%20${title}%20-%20https://voltris.com.br/guias`}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-3 p-3 bg-emerald-500 rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all text-white"
          title="Compartilhar no WhatsApp"
        >
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.767 5.767 0 1.267.405 2.436 1.091 3.394l-.72 2.625 2.695-.71c.82.493 1.776.78 2.7.78 3.181 0 5.767-2.586 5.767-5.767 0-3.181-2.588-5.767-5.766-5.767zm3.39 8.161c-.146.417-.86.762-1.192.812-.331.05-1.118.06-2.115-.262-.997-.322-2.126-1.182-2.812-1.868-.686-.686-1.228-1.503-1.428-2.314-.05-.201-.06-.5-.03-.782s.11-.53.251-.672c.14-.141.312-.221.463-.221s.201.01.291.02c.091.011.201.021.312.282.11.261.382.934.422 1.024s.06.191.01.291c-.05.101-.11.201-.191.291-.08.09-.17.201-.25.291-.08.09-.171.182-.07.362.101.181.442.734.954 1.192.511.458 1.144.751 1.344.832.2.081.312.06.422-.06.11-.121.472-.553.593-.744.12-.191.251-.151.412-.101.161.05.994.472 1.165.553.171.08.281.121.322.191.04.07.04.412-.11.832z"/></svg>
        </a>
        <a
          href={`https://discord.com/channels/@me`}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-3 p-3 bg-blue-600 rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all text-white"
          title="Compartilhar com amigos no Discord"
        >
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037 19.736 19.736 0 0 0-4.885 1.515.069.069 0 0 0-.032.027C.533 9.048-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
        </a>

        {/* Floating Author Tooltip */}
        <div className="absolute left-16 top-0 hidden group-hover/btn:flex bg-white/10 backdrop-blur rounded-lg p-2 text-[10px] text-slate-400 border border-white/5 whitespace-nowrap">
          Conteúdo verificado por {author}
        </div>
      </div>
            <main className="min-h-screen bg-[#050510] font-sans selection:bg-[#31A8FF]/30">

                {/* --- HERO SECTION --- */}
                <section className="min-h-[100dvh] flex flex-col items-center justify-center relative px-4 overflow-hidden border-b border-white/5">
                    {/* Background Effects */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
                    <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#31A8FF]/10 blur-[150px] rounded-full mix-blend-screen pointer-events-none"></div>
                    <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-[#8B31FF]/10 blur-[150px] rounded-full mix-blend-screen pointer-events-none"></div>

                    <div className="relative max-w-5xl mx-auto text-center z-10 flex-grow flex flex-col items-center justify-center">

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 text-xs font-medium text-slate-400"
                        >
                            <BookOpen className="w-3 h-3 text-[#31A8FF]" />
                            <span>Guia Técnico Voltris — Verificado por Especialistas</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-8 tracking-tight leading-tight"
                        >
                            {title.replace(" - Voltris", "").replace(" | VOLTRIS", "")}
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg md:text-xl text-slate-400 mb-10 max-w-3xl mx-auto leading-relaxed font-light"
                        >
                            {description}
                        </motion.p>

                        {/* Meta Info Pills */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-wrap justify-center gap-3 text-sm mb-8"
                        >
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur text-slate-300">
                                <Clock className="w-4 h-4 text-[#31A8FF]" />
                                <span>{readingMinutes} min de leitura</span>
                            </div>
                            <div className={`flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur ${difficultyBg}`}>
                                <Award className={`w-4 h-4 ${difficultyColor}`} />
                                <span className={difficultyColor}>Nível: {difficultyLevel}</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur text-slate-300">
                                <User className="w-4 h-4 text-[#8B31FF]" />
                                <span>{author}</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur text-slate-300">
                                <Calendar className="w-4 h-4 text-emerald-400" />
                                <span>Atualizado em {lastUpdated}</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Scroll Indicator */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1, duration: 1, repeat: Infinity, repeatType: "reverse" }}
                        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer text-slate-500 hover:text-white transition-colors z-20"
                        onClick={() => {
                            const nextSection = document.getElementById('guide-content');
                            if (nextSection) nextSection.scrollIntoView({ behavior: 'smooth' });
                        }}
                    >
                        <span className="text-xs uppercase tracking-widest font-medium">SCROLL</span>
                        <div className="w-[1px] h-12 bg-gradient-to-b from-[#31A8FF] to-transparent"></div>
                    </motion.div>
                </section>

                {/* --- KEY POINTS TL;DR (se fornecido) --- */}
                {keyPoints && keyPoints.length > 0 && (
                    <section className="py-10 px-4 bg-[#08080F] border-b border-white/5">
                        <div className="max-w-4xl mx-auto">
                            <div className="bg-gradient-to-r from-[#31A8FF]/10 via-transparent to-[#8B31FF]/10 border border-[#31A8FF]/20 rounded-2xl p-6">
                                <h2 className="text-[#31A8FF] font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Lightbulb className="w-4 h-4" />
                                    Resumo Rápido — O que você vai aprender
                                </h2>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {keyPoints.map((point, i) => (
                                        <li key={i} className="flex items-start gap-3 text-slate-300 text-sm">
                                            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                            {point}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </section>
                )}

                {/* Warning note */}
                {warningNote && (
                    <section className="py-6 px-4 bg-[#08080F]">
                        <div className="max-w-4xl mx-auto">
                            <div className="flex items-start gap-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-5">
                                <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                                <p className="text-yellow-200 text-sm leading-relaxed">{warningNote}</p>
                            </div>
                        </div>
                    </section>
                )}

                {/* --- MAIN CONTENT SECTION --- */}
                <section id="guide-content" className="py-24 px-4 relative z-10 bg-[#050510]">
                    <div className="max-w-4xl mx-auto flex flex-col gap-12">

                        {/* Breadcrumbs */}
                        <Breadcrumbs
                            items={[
                                { label: 'Guias', href: '/guias' },
                                { label: title.replace(' - Voltris', '').replace(' | VOLTRIS', '').substring(0, 50) }
                            ]}
                        />

                        {/* Top Meta Info Area */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {summaryTable && summaryTable.length > 0 && (
                                <div className="bg-[#0A0A0F] border border-[#31A8FF]/20 rounded-2xl p-6 relative overflow-hidden h-full">
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-[#31A8FF]/10 blur-xl rounded-full"></div>
                                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                        <Target className="w-5 h-5 text-[#31A8FF]" /> Resumo Técnico
                                    </h3>
                                    <div className="space-y-3">
                                        {summaryTable.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center border-b border-white/5 pb-2 last:border-0 last:pb-0">
                                                <span className="text-slate-500 text-sm">{item.label}</span>
                                                <span className="text-white font-medium text-sm text-right">{item.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Table of Contents */}
                            <div className="bg-[#0A0A0F] border border-white/5 rounded-2xl p-6 h-full">
                                <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider text-slate-500 flex items-center gap-2">
                                    <BookOpen className="w-4 h-4 text-slate-500" /> Índice de Conteúdo
                                </h3>
                                <nav className="space-y-1 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                                    {allSections.map((section, idx) => (
                                        <a key={idx} href={`#section-${idx}`} className="flex items-center gap-2 text-slate-400 hover:text-white hover:bg-white/5 px-3 py-2 rounded-lg text-sm transition-colors border-l-2 border-transparent hover:border-[#31A8FF]">
                                            <ChevronRight className="w-3 h-3 shrink-0" />
                                            <span className="truncate">{idx + 1}. {section.title}</span>
                                        </a>
                                    ))}
                                </nav>
                            </div>
                        </div>

                        {/* Article Content */}
                        <article className="space-y-12" itemScope itemType="https://schema.org/TechArticle">
                            <meta itemProp="author" content={author} />
                            <meta itemProp="dateModified" content={`${lastUpdated}-01-01`} />

                            {contentSections.map((section, sectionIndex) => (
                                <React.Fragment key={sectionIndex}>
                                    <motion.div
                                        id={`section-${sectionIndex}`}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: "-100px" }}
                                        className="bg-[#0A0A0F] p-8 md:p-12 rounded-3xl border border-white/5 relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] opacity-30"></div>

                                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 tracking-tight flex items-start gap-4">
                                            <span className="text-[#31A8FF] text-xl opacity-50 font-mono mt-1">0{sectionIndex + 1}.</span>
                                            {section.title}
                                        </h2>

                                        <div
                                            className="text-slate-300 leading-8 prose prose-invert prose-lg max-w-none prose-headings:text-white prose-a:text-[#31A8FF] prose-strong:text-white prose-ul:list-disc prose-ol:list-decimal"
                                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(section.content || '') }}
                                        />

                                        {section.subsections && (
                                            <div className="mt-10 space-y-10 pl-0 md:pl-8 md:border-l-2 md:border-white/5">
                                                {section.subsections.map((subsection, subIndex) => (
                                                    <div key={subIndex}>
                                                        <h3 className="text-2xl font-bold text-white mb-5 flex items-center gap-3">
                                                            <span className="w-2 h-2 rounded-full bg-[#FF4B6B]"></span>
                                                            {subsection.subtitle}
                                                        </h3>
                                                        <div
                                                            className="text-slate-400 leading-relaxed prose prose-invert max-w-none"
                                                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(subsection.content || '') }}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>

                                    {/* Banner Estratégico após o primeiro capítulo */}
                                    {sectionIndex === 0 && showVoltrisOptimizerCTA && <VoltrisOptimizerBanner isSecondary={true} />}
                                </React.Fragment>
                            ))}

                            {/* Advanced Content Sections */}
                            {advancedContentSections && advancedContentSections.length > 0 && (
                                <>
                                    {advancedContentSections.map((section: ContentSection, sectionIndex: number) => (
                                        <motion.div
                                            key={`advanced-${sectionIndex}`}
                                            id={`section-${contentSections.length + sectionIndex}`}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true, margin: "-100px" }}
                                            className="bg-gradient-to-br from-[#1a1a2e] to-[#0A0A0F] p-8 md:p-12 rounded-3xl border border-[#8B31FF]/30 relative overflow-hidden"
                                        >
                                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#8B31FF] via-[#31A8FF] to-[#FF4B6B] opacity-50"></div>
                                            <div className="flex items-start gap-3 mb-2">
                                                <span className="bg-[#8B31FF]/20 text-[#8B31FF] text-xs font-bold px-2 py-1 rounded-full border border-[#8B31FF]/30">
                                                    CONTEÚDO AVANÇADO
                                                </span>
                                            </div>
                                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 tracking-tight flex items-start gap-4">
                                                <span className="text-[#8B31FF] text-xl opacity-50 font-mono mt-1">A{sectionIndex + 1}.</span>
                                                {section.title}
                                            </h2>
                                            <div
                                                className="text-slate-300 leading-8 prose prose-invert prose-lg max-w-none prose-headings:text-white prose-a:text-[#8B31FF] prose-strong:text-white"
                                                dangerouslySetInnerHTML={{ __html: section.content ? DOMPurify.sanitize(section.content) : '' }}
                                            />
                                        </motion.div>
                                    ))}
                                </>
                            )}

                            {/* Additional Content Sections */}
                            {additionalContentSections && additionalContentSections.length > 0 && (
                                <>
                                    {additionalContentSections.map((section: ContentSection, sectionIndex: number) => (
                                        <motion.div
                                            key={`additional-${sectionIndex}`}
                                            id={`section-${contentSections.length + (advancedContentSections?.length || 0) + sectionIndex}`}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true, margin: "-100px" }}
                                            className="bg-gradient-to-br from-[#2e1a1a] to-[#0A0A0F] p-8 md:p-12 rounded-3xl border border-[#FF4B6B]/30 relative overflow-hidden"
                                        >
                                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF4B6B] via-[#31A8FF] to-[#8B31FF] opacity-50"></div>
                                            <div className="flex items-start gap-3 mb-2">
                                                <span className="bg-[#FF4B6B]/20 text-[#FF4B6B] text-xs font-bold px-2 py-1 rounded-full border border-[#FF4B6B]/30">
                                                    SAIBA MAIS
                                                </span>
                                            </div>
                                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 tracking-tight">
                                                {section.title}
                                            </h2>
                                            <div
                                                className="text-slate-300 leading-8 prose prose-invert prose-lg max-w-none prose-headings:text-white"
                                                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(section.content || '') }}
                                            />
                                        </motion.div>
                                    ))}
                                </>
                            )}



                            {/* Voltris Optimizer CTA Final */}
                            {showVoltrisOptimizerCTA && <VoltrisOptimizerBanner />}

                            {/* Custom Children */}
                            {children}

                            {/* --- AUTHOR BIO — E-E-A-T MÁXIMO --- */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="bg-[#0A0A0F] border border-[#31A8FF]/20 rounded-3xl p-8 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-40 h-40 bg-[#31A8FF]/5 blur-3xl rounded-full"></div>
                                <div className="flex flex-col md:flex-row items-start gap-6 relative z-10">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#31A8FF] to-[#8B31FF] flex items-center justify-center text-white font-black text-2xl shrink-0">
                                        {author.split(' ')[0][0]}{author.split(' ').slice(-1)[0][0]}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-[#31A8FF] font-bold uppercase tracking-widest mb-1">Escrito por um especialista verificado</p>
                                        <h4 className="text-white font-bold text-lg mb-1">{author}</h4>
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {authorCredentials.map((cred, i) => (
                                                <span key={i} className="text-xs bg-white/5 border border-white/10 text-slate-400 px-2 py-1 rounded-full flex items-center gap-1">
                                                    <Star className="w-3 h-3 text-[#FFD700]" /> {cred}
                                                </span>
                                            ))}
                                        </div>
                                        <p className="text-slate-400 text-sm leading-relaxed">{authorBio}</p>
                                        <Link href="/sobre" className="inline-flex items-center gap-1 text-[#31A8FF] text-sm mt-3 hover:underline">
                                            Conhecer a equipe Voltris <ArrowRight className="w-3 h-3" />
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Conclusão Rica (não genérica) */}
                            {!hasCustomConclusion && (
                                <div className="bg-gradient-to-br from-[#1a1a2e] to-[#0A0A0F] p-8 md:p-12 rounded-3xl border border-[#31A8FF]/20 relative overflow-hidden">
                                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#31A8FF]/10 blur-[80px] rounded-full"></div>
                                    <h2 className="text-3xl font-bold text-white mb-6 relative z-10 flex items-center gap-3">
                                        <CheckCircle className="w-8 h-8 text-emerald-400" />
                                        Conclusão e Próximos Passos
                                    </h2>
                                    <p className="text-slate-300 leading-relaxed mb-6 relative z-10 text-lg">
                                        Seguindo este guia sobre <strong className="text-white">{title.split(' - ')[0].replace(' | VOLTRIS', '')}</strong>, você está equipado com o conhecimento técnico verificado para resolver este problema com confiança.
                                    </p>
                                    <p className="text-slate-400 leading-relaxed mb-8 relative z-10">
                                        Se ainda tiver dificuldades após seguir todos os passos, nossa equipe de suporte especializado está disponível para um diagnóstico remoto personalizado. Cada sistema é único e pode exigir uma abordagem específica.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-4 relative z-10">
                                        <Link href="/todos-os-servicos" className="flex-1 px-8 py-5 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition text-center shadow-[0_0_20px_rgba(255,255,255,0.1)] text-base">
                                            Ver Serviços Profissionais
                                        </Link>
                                        <Link href="https://wa.me/5511996716235" target="_blank" rel="noopener noreferrer" className="flex-1 px-8 py-5 bg-[#31A8FF]/10 text-[#31A8FF] border border-[#31A8FF]/20 font-bold rounded-xl hover:bg-[#31A8FF]/20 transition text-center flex items-center justify-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                            Suporte via WhatsApp
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </article>
                    </div>
                </section>

                {/* --- REFERÊNCIAS EXTERNAS (E-E-A-T) --- */}
                {externalReferences.length > 0 && (
                    <section className="py-12 px-4 border-t border-white/5 bg-[#020205]">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-xl font-bold text-white mb-2">Fontes e Referências Oficiais</h2>
                            <p className="text-slate-500 text-sm mb-6">Este guia foi elaborado com base em documentação técnica oficial e fontes verificadas.</p>
                            <ul className="flex flex-wrap gap-3">
                                {externalReferences.map((ref, i) => (
                                    <li key={i}>
                                        <a href={ref.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[#31A8FF] hover:underline text-sm bg-white/5 px-3 py-2 rounded-lg border border-white/10 hover:border-[#31A8FF]/30 transition">
                                            <ExternalLink className="w-3 h-3" />
                                            {ref.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>
                )}

                {/* --- FAQ & RELATED GUIDES --- */}
                <div className="bg-[#020205] relative z-10">
                    {faqItems && faqItems.length > 0 && (
                        <section className="py-20 px-4 border-t border-white/5 bg-[#050510]">
                            <div className="max-w-4xl mx-auto">
                                <h2 className="text-3xl font-bold text-white mb-2 text-center">Perguntas Frequentes</h2>
                                <p className="text-slate-500 text-center mb-10">Dúvidas comuns respondidas pela equipe técnica Voltris</p>
                                <div className="space-y-4">
                                    {faqItems.map((item, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 10 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="bg-[#0A0A0F] p-6 rounded-xl border border-white/5 hover:border-white/10 transition-colors"
                                        >
                                            <h3 className="text-lg font-bold text-white mb-3 flex items-start gap-3">
                                                <span className="text-[#31A8FF] mt-1 font-mono text-sm">Q{index + 1}.</span>
                                                {item.question}
                                            </h3>
                                            <div className="text-slate-400 text-sm leading-relaxed pl-8 border-l border-white/5 ml-4" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.answer) }} />
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}

                    {relatedGuides.length > 0 && (
                        <section className="py-20 px-4 border-t border-white/5">
                            <div className="max-w-7xl mx-auto">
                                <h2 className="text-3xl font-bold text-white mb-3 text-center">Continue Aprendendo</h2>
                                <p className="text-slate-500 text-center mb-10">Guias relacionados selecionados pela equipe Voltris</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {relatedGuides.map((guide, index) => (
                                        <Link
                                            key={index}
                                            href={guide.href}
                                            className="group bg-[#0A0A0F] p-6 rounded-2xl border border-white/5 hover:border-[#31A8FF]/30 transition-all duration-300 hover:-translate-y-1 block"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-[#31A8FF]/10 border border-[#31A8FF]/20 flex items-center justify-center shrink-0 mt-1 group-hover:bg-[#31A8FF] transition-all">
                                                    <BookOpen className="w-4 h-4 text-[#31A8FF] group-hover:text-white transition-colors" />
                                                </div>
                                                <div>
                                                    <h3 className="text-base font-bold text-white mb-1 group-hover:text-[#31A8FF] transition-colors">{guide.title}</h3>
                                                    <p className="text-slate-500 text-sm line-clamp-2">{guide.description}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}
                </div>


                <Footer />
                {faqItems && <FAQSchema faqItems={faqItems} />}

                {/* Botão Flutuante de Download Rápido (Conversão Viral) */}
                {showVoltrisOptimizerCTA && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="fixed bottom-8 right-8 z-[100]"
                    >
                        <Link
                            href="/voltrisoptimizer"
                            onClick={() => notifyDownload(`Floating Link Click - ${title}`)}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-white font-black rounded-full shadow-[0_10px_40px_rgba(49,168,255,0.4)] hover:scale-110 active:scale-95 transition-all text-xs uppercase tracking-widest group"
                        >
                            <Zap className="w-4 h-4 fill-current group-hover:animate-pulse" />
                            <span className="hidden sm:inline">Baixar Optimizer</span>
                            <span className="sm:hidden">Baixar</span>
                        </Link>
                    </motion.div>
                )}
            </main>
        </>
    );
}
