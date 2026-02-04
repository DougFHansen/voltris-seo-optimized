'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdSenseBanner from '@/components/AdSenseBanner';
import Breadcrumbs from '@/components/Breadcrumbs';
import { FAQSchema } from '@/components/SEOStructuredData';
import { motion } from 'framer-motion';
import { Clock, ArrowRight, BookOpen, User, Calendar, Award } from 'lucide-react';

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
    lastUpdated?: string;
    summaryTable?: SummaryTableItem[];
    faqItems?: Array<{ question: string; answer: string }>;
    /** Links externos para fontes oficiais (Microsoft, etc.) — melhora E-E-A-T e sinal para buscadores */
    externalReferences?: ExternalReference[];
    /** Seções avançadas de conteúdo para guias técnicos de alta profundidade */
    advancedContentSections?: ContentSection[];
    /** Seções adicionais de conteúdo */
    additionalContentSections?: ContentSection[];
}

export function GuideTemplateClient({
    title,
    description,
    keywords,
    estimatedTime,
    difficultyLevel,
    contentSections,
    relatedGuides = [],
    author = "Equipe Técnica Voltris",
    lastUpdated = "Janeiro 2025",
    summaryTable,
    faqItems,
    externalReferences = [],
    advancedContentSections,
    additionalContentSections
}: GuideTemplateProps) {
    const hasCustomConclusion = contentSections.some(section =>
        section.title.toLowerCase().includes('conclusão') ||
        section.title.toLowerCase().includes('conclusao') ||
        section.title.toLowerCase().includes('considerações finais')
    );

    return (
        <>
            <Header />
            <main className="min-h-screen bg-[#050510] font-sans selection:bg-[#31A8FF]/30">

                {/* --- FULL SCREEN HERO --- */}
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
                            <span>Guia Técnico Oficial</span>
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
                            className="flex flex-wrap justify-center gap-4 text-sm"
                        >
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur text-slate-300">
                                <Clock className="w-4 h-4 text-[#31A8FF]" />
                                <span>{estimatedTime}</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur text-slate-300">
                                <Award className="w-4 h-4 text-[#FF4B6B]" />
                                <span>Nível: {difficultyLevel}</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur text-slate-300">
                                <User className="w-4 h-4 text-[#8B31FF]" />
                                <span>{author}</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur text-slate-300">
                                <Calendar className="w-4 h-4 text-emerald-400" />
                                <span>{lastUpdated}</span>
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
                            if (nextSection) {
                                nextSection.scrollIntoView({ behavior: 'smooth' });
                            } else {
                                window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
                            }
                        }}
                    >
                        <span className="text-xs uppercase tracking-widest font-medium">SCROLL</span>
                        <div className="w-[1px] h-12 bg-gradient-to-b from-[#31A8FF] to-transparent"></div>
                    </motion.div>
                </section>

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

                        {/* Top Meta Info Area (Summary & Navigation) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Summary Table */}
                            {summaryTable && summaryTable.length > 0 && (
                                <div className="bg-[#0A0A0F] border border-[#31A8FF]/20 rounded-2xl p-6 relative overflow-hidden h-full">
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-[#31A8FF]/10 blur-xl rounded-full"></div>
                                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                        <Award className="w-5 h-5 text-[#31A8FF]" /> Resumo Técnico
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
                                    {contentSections.map((section, idx) => (
                                        <a key={idx} href={`#section-${idx}`} className="block text-slate-400 hover:text-white hover:bg-white/5 px-3 py-2 rounded-lg text-sm transition-colors truncate border-l-2 border-transparent hover:border-[#31A8FF]">
                                            {idx + 1}. {section.title}
                                        </a>
                                    ))}
                                </nav>
                            </div>
                        </div>

                        {/* Right Content (Article) */}
                        <article className="space-y-12">
                            {contentSections.map((section, sectionIndex) => (
                                <motion.div
                                    key={sectionIndex}
                                    id={`section-${sectionIndex}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    className="bg-[#0A0A0F] p-8 md:p-12 rounded-3xl border border-white/5 relative overflow-hidden"
                                >
                                    {/* Decorative gradient for section */}
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] opacity-30"></div>

                                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 tracking-tight flex items-start gap-4">
                                        <span className="text-[#31A8FF] text-xl opacity-50 font-mono mt-1">0{sectionIndex + 1}.</span>
                                        {section.title}
                                    </h2>

                                    <div
                                        className="text-slate-300 leading-8 prose prose-invert prose-lg max-w-none prose-headings:text-white prose-a:text-[#31A8FF] prose-strong:text-white prose-ul:list-disc prose-ol:list-decimal"
                                        dangerouslySetInnerHTML={{ __html: section.content }}
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
                                                        dangerouslySetInnerHTML={{ __html: subsection.content }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            ))}

                            {/* Advanced Content Sections */}
                            {advancedContentSections && advancedContentSections.length > 0 && (
                                <>
                                    {advancedContentSections.map((section: ContentSection, sectionIndex: number) => (
                                        <motion.div
                                            key={`advanced-${sectionIndex}`}
                                            id={`advanced-section-${sectionIndex}`}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true, margin: "-100px" }}
                                            className="bg-gradient-to-br from-[#1a1a2e] to-[#0A0A0F] p-8 md:p-12 rounded-3xl border border-[#8B31FF]/30 relative overflow-hidden"
                                        >
                                            {/* Decorative gradient for advanced section */}
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
                                                className="text-slate-300 leading-8 prose prose-invert prose-lg max-w-none prose-headings:text-white prose-a:text-[#8B31FF] prose-strong:text-white prose-ul:list-disc prose-ol:list-decimal"
                                                dangerouslySetInnerHTML={{ __html: section.content }}
                                            />

                                            {section.subsections && (
                                                <div className="mt-10 space-y-10 pl-0 md:pl-8 md:border-l-2 md:border-[#8B31FF]/30">
                                                    {section.subsections.map((subsection: Subsection, subIndex: number) => (
                                                        <div key={`advanced-sub-${subIndex}`}>
                                                            <h3 className="text-2xl font-bold text-white mb-5 flex items-center gap-3">
                                                                <span className="w-2 h-2 rounded-full bg-[#8B31FF]"></span>
                                                                {subsection.subtitle}
                                                            </h3>
                                                            <div
                                                                className="text-slate-400 leading-relaxed prose prose-invert max-w-none"
                                                                dangerouslySetInnerHTML={{ __html: subsection.content }}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
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
                                            id={`additional-section-${sectionIndex}`}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true, margin: "-100px" }}
                                            className="bg-gradient-to-br from-[#2e1a1a] to-[#0A0A0F] p-8 md:p-12 rounded-3xl border border-[#FF4B6B]/30 relative overflow-hidden"
                                        >
                                            {/* Decorative gradient for additional section */}
                                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF4B6B] via-[#31A8FF] to-[#8B31FF] opacity-50"></div>

                                            <div className="flex items-start gap-3 mb-2">
                                                <span className="bg-[#FF4B6B]/20 text-[#FF4B6B] text-xs font-bold px-2 py-1 rounded-full border border-[#FF4B6B]/30">
                                                    CONTEÚDO ADICIONAL
                                                </span>
                                            </div>

                                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 tracking-tight flex items-start gap-4">
                                                <span className="text-[#FF4B6B] text-xl opacity-50 font-mono mt-1">AD{sectionIndex + 1}.</span>
                                                {section.title}
                                            </h2>

                                            <div
                                                className="text-slate-300 leading-8 prose prose-invert prose-lg max-w-none prose-headings:text-white prose-a:text-[#FF4B6B] prose-strong:text-white prose-ul:list-disc prose-ol:list-decimal"
                                                dangerouslySetInnerHTML={{ __html: section.content }}
                                            />

                                            {section.subsections && (
                                                <div className="mt-10 space-y-10 pl-0 md:pl-8 md:border-l-2 md:border-[#FF4B6B]/30">
                                                    {section.subsections.map((subsection: Subsection, subIndex: number) => (
                                                        <div key={`additional-sub-${subIndex}`}>
                                                            <h3 className="text-2xl font-bold text-white mb-5 flex items-center gap-3">
                                                                <span className="w-2 h-2 rounded-full bg-[#FF4B6B]"></span>
                                                                {subsection.subtitle}
                                                            </h3>
                                                            <div
                                                                className="text-slate-400 leading-relaxed prose prose-invert max-w-none"
                                                                dangerouslySetInnerHTML={{ __html: subsection.content }}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </motion.div>
                                    ))}
                                </>
                            )}

                            {/* AdSense após 40% do conteúdo (posição ideal) */}
                            {contentSections.length >= 2 && (
                                <div className="my-16">
                                    <p className="text-center text-xs text-slate-600 mb-2 uppercase tracking-wider">Publicidade</p>
                                    <AdSenseBanner />
                                </div>
                            )}

                            {/* --- SEO CONTENT INJECTION: GLOBAL GLOSSARY --- */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                className="bg-[#0A0A0F] border border-white/5 rounded-3xl p-8 md:p-10 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#8B31FF]/5 blur-[60px] rounded-full point-events-none"></div>
                                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                    <BookOpen className="w-6 h-6 text-[#8B31FF]" />
                                    Glossário Técnico Fundamental
                                </h3>
                                <p className="text-slate-400 mb-8 text-sm">
                                    Para garantir que você entenda todos os termos técnicos mencionados em nossos guias, preparamos este glossário rápido com as definições mais importantes do mundo da tecnologia.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                                    <div>
                                        <h4 className="text-[#31A8FF] font-bold text-sm uppercase tracking-wider mb-2">BIOS / UEFI</h4>
                                        <p className="text-slate-400 text-sm leading-relaxed">
                                            O sistema básico que roda antes do Windows. É lá que configuramos a ordem de boot (para formatar) e ajustes de hardware como XMP para memória RAM.
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="text-[#31A8FF] font-bold text-sm uppercase tracking-wider mb-2">Drivers</h4>
                                        <p className="text-slate-400 text-sm leading-relaxed">
                                            Programas que ensinam o Windows a conversar com seu hardware (placa de vídeo, som, wi-fi). Drivers desatualizados são a causa nº 1 de telas azuis e lentidão.
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="text-[#FF4B6B] font-bold text-sm uppercase tracking-wider mb-2">Malware vs Vírus</h4>
                                        <p className="text-slate-400 text-sm leading-relaxed">
                                            Malware é qualquer software malicioso. Vírus é um tipo específico que se replica. Hoje, o maior perigo é o <strong>Ransomware</strong>, que sequestra seus dados e pede resgate.
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="text-[#31FF8B] font-bold text-sm uppercase tracking-wider mb-2">SSD (Solid State Drive)</h4>
                                        <p className="text-slate-400 text-sm leading-relaxed">
                                            Armazenamento moderno, 10x mais rápido que os HDs antigos. Se seu PC demora mais de 1 minuto para ligar, a culpa provavelmente é da falta de um SSD.
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="text-[#E11D48] font-bold text-sm uppercase tracking-wider mb-2">FPS / Hz</h4>
                                        <p className="text-slate-400 text-sm leading-relaxed">
                                            FPS é quantos quadros seu PC gera por segundo. Hz é quantos quadros seu monitor consegue mostrar. Para jogos competitivos, quanto maior, melhor.
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="text-[#FFB800] font-bold text-sm uppercase tracking-wider mb-2">Bloatware</h4>
                                        <p className="text-slate-400 text-sm leading-relaxed">
                                            Programas inúteis que já vêm pré-instalados no PC (fábrica) ou que instalamos sem querer junto com outros sofwares. Eles consomem RAM e processamento à toa.
                                        </p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Conclusion */}
                            {!hasCustomConclusion && (
                                <div className="bg-gradient-to-br from-[#1a1a2e] to-[#0A0A0F] p-8 md:p-12 rounded-3xl border border-[#31A8FF]/20 relative overflow-hidden">
                                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#31A8FF]/10 blur-[80px] rounded-full"></div>
                                    <h2 className="text-3xl font-bold text-white mb-6 relative z-10">Conclusão</h2>
                                    <p className="text-slate-300 leading-relaxed mb-8 relative z-10 text-lg">
                                        Esperamos que este guia sobre <strong>{title.split(' - ')[0]}</strong> tenha resolvido suas dúvidas. A tecnologia evolui rápido, então fique atento às novas atualizações.
                                    </p>

                                    <div className="flex flex-col sm:flex-row gap-4 relative z-10">
                                        <Link href="/todos-os-servicos" className="flex-1 px-8 py-5 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition text-center shadow-[0_0_20px_rgba(255,255,255,0.1)] text-lg">
                                            Ver Serviços Profissionais
                                        </Link>
                                        <Link href="https://wa.me/5511996716235" className="flex-1 px-8 py-5 bg-[#31A8FF]/10 text-[#31A8FF] border border-[#31A8FF]/20 font-bold rounded-xl hover:bg-[#31A8FF]/20 transition text-center flex items-center justify-center gap-2 text-lg">
                                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                            Suporte via WhatsApp
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </article>
                    </div>
                </section>

                {/* --- REFERÊNCIAS EXTERNAS (E-E-A-T / Bing) --- */}
                {externalReferences.length > 0 && (
                    <section className="py-12 px-4 border-t border-white/5 bg-[#020205]">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-xl font-bold text-white mb-4">Referências e fontes oficiais</h2>
                            <ul className="flex flex-wrap gap-3 text-sm">
                                {externalReferences.map((ref, i) => (
                                    <li key={i}>
                                        <a href={ref.url} target="_blank" rel="noopener noreferrer" className="text-[#31A8FF] hover:underline">
                                            {ref.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>
                )}

                {/* --- EXTRA CONTENT (FAQ & RELATED) --- */}
                <div className="bg-[#020205] relative z-10">
                    {relatedGuides.length > 0 && (
                        <section className="py-20 px-4 border-t border-white/5">
                            <div className="max-w-7xl mx-auto">
                                <h2 className="text-3xl font-bold text-white mb-10 text-center">Guias Relacionados</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {relatedGuides.map((guide, index) => (
                                        <Link
                                            key={index}
                                            href={guide.href}
                                            className="group bg-[#0A0A0F] p-6 rounded-2xl border border-white/5 hover:border-[#31A8FF]/30 transition-all duration-300 hover:-translate-y-1 block"
                                        >
                                            <h3 className="text-lg font-bold text-white mb-3 group-hover:text-[#31A8FF] transition-colors">{guide.title}</h3>
                                            <p className="text-slate-500 text-sm line-clamp-2">{guide.description}</p>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}

                    {faqItems && faqItems.length > 0 && (
                        <section className="py-20 px-4 border-t border-white/5 bg-[#050510]">
                            <div className="max-w-4xl mx-auto">
                                <h2 className="text-3xl font-bold text-white mb-10 text-center">Perguntas Frequentes</h2>
                                <div className="space-y-4">
                                    {faqItems.map((item, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 10 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="bg-[#0A0A0F] p-6 rounded-xl border border-white/5 hover:border-white/10 transition-colors"
                                        >
                                            <h3 className="text-lg font-bold text-white mb-3 flex items-start gap-3">
                                                <span className="text-[#31A8FF] mt-1">?</span>
                                                {item.question}
                                            </h3>
                                            <div className="text-slate-400 text-sm leading-relaxed pl-6 border-l border-white/5 ml-2" dangerouslySetInnerHTML={{ __html: item.answer }} />
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}
                </div>

                <div className="my-16">
                    <p className="text-center text-xs text-slate-600 mb-2 uppercase tracking-wider">Publicidade</p>
                    <AdSenseBanner />
                </div>
                <Footer />
                {faqItems && <FAQSchema faqItems={faqItems} />}
            </main>
        </>
    );
}
