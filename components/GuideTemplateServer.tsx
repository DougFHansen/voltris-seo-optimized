import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import ContextualCTA from '@/components/ContextualCTA';
import { InternalLinks } from '@/components/InternalLinks';
import ComparisonTable from '@/components/ComparisonTable';
import { QuickSolutionBox } from '@/components/QuickSolutionBox';
import { FunnelProgression } from '@/components/FunnelProgression';
import { AISummaryBlock } from '@/components/AISummaryBlock';
import { SectionSummary } from '@/components/SectionWithSummary';
import { Clock, ArrowRight, BookOpen, User, Calendar, Award, CheckCircle, AlertTriangle, ChevronRight, Lightbulb, Target, Star, ExternalLink } from 'lucide-react';
import DOMPurify from 'isomorphic-dompurify';
import { GuideMetadata, getAllGuides } from '@/lib/guides';
import { extractEntitiesFromText, generateEntitySchema } from '@/lib/entitySchema';

export interface SummaryTableItem {
    label: string;
    value: string;
}

export interface ContentSection {
    title: string;
    content: string;
    subsections?: Subsection[];
    summary?: string; // AEO/GEO: Micro-sumário para chunk extraction (resposta curta, definição objetiva, contexto independente)
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

export interface GuideTemplateServerProps {
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
    externalReferences?: ExternalReference[];
    advancedContentSections?: ContentSection[];
    additionalContentSections?: ContentSection[];
    showVoltrisOptimizerCTA?: boolean;
    keyPoints?: string[];
    warningNote?: string;
    isHowTo?: boolean;
    pathname: string;
    category?: string;
    allGuides?: GuideMetadata[];
    quickSolution?: string;
    aiSummary?: string; // Nova prop para AEO/GEO - Answer-First Block
}

// Calcula o tempo de leitura estimado baseado no conteúdo
function calcReadingTime(sections: ContentSection[]): number {
    const totalText = sections.map(s => (s.content || '') + (s.subsections?.map(sub => sub.content || '').join(' ') || '')).join(' ');
    const wordCount = (totalText || '').replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length;
    return Math.max(3, Math.ceil(wordCount / 200));
}

export default function GuideTemplateServer({
    title,
    description,
    keywords,
    estimatedTime,
    difficultyLevel,
    contentSections,
    relatedGuides = [],
    author = "Douglas Felipe",
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
    isHowTo = false,
    pathname,
    category = 'default',
    allGuides = [],
    quickSolution,
    aiSummary
}: GuideTemplateServerProps) {
    const activeAllGuides = allGuides && allGuides.length > 0 ? allGuides : getAllGuides();

    // Criar currentGuide a partir das props
    const currentGuide = {
        id: pathname?.split('/').pop() || '',
        title,
        description,
        category: category || 'default',
        difficulty: difficultyLevel,
        time: estimatedTime,
        keywords: keywords || []
    };
    const readingMinutes = calcReadingTime(contentSections);
    const difficultyColor = difficultyLevel === 'Iniciante' ? 'text-emerald-400' : difficultyLevel === 'Intermediário' ? 'text-yellow-400' : 'text-red-400';
    const difficultyBg = difficultyLevel === 'Iniciante' ? 'border-emerald-400/20 bg-emerald-400/5' : difficultyLevel === 'Intermediário' ? 'border-yellow-400/20 bg-yellow-400/5' : 'border-red-400/20 bg-red-400/5';

    const hasCustomConclusion = contentSections.some(section =>
        section.title.toLowerCase().includes('conclusão') ||
        section.title.toLowerCase().includes('conclusao') ||
        section.title.toLowerCase().includes('considerações finais')
    );

    const allSections = [
        ...contentSections,
        ...(advancedContentSections || []),
        ...(additionalContentSections || []),
    ];

    // Extrair entidades para Entity SEO (AEO/GEO - category-aware)
    const entityText = `${title} ${description} ${contentSections.map(s => s.content).join(' ')}`;
    const entities = extractEntitiesFromText(entityText, category);
    const entitySchema = generateEntitySchema(entities, category);

    // JSON-LD Article Schema para máximo E-E-A-T (Server-side)
    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        "headline": title,
        "description": description,
        "keywords": keywords.join(", "),
        "author": {
            "@type": "Person",
            "name": author,
            "url": "https://www.voltris.com.br/sobre",
            "jobTitle": "Especialista em Otimização de Sistemas",
            "worksFor": {
                "@type": "Organization",
                "name": "Voltris",
                "url": "https://www.voltris.com.br"
            }
        },
        "publisher": {
            "@type": "Organization",
            "name": "Voltris",
            "url": "https://www.voltris.com.br",
            "logo": {
                "@type": "ImageObject",
                "url": "https://www.voltris.com.br/logo.png"
            }
        },
        "dateModified": `${lastUpdated}-01-01`,
        "datePublished": "2025-01-01",
        "inLanguage": "pt-BR",
        "learningResourceType": "Tutorial",
        "educationalLevel": difficultyLevel,
        "timeRequired": `PT${readingMinutes}M`
    };

    // JSON-LD HowTo Schema (Server-side)
    const howToSchema = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": title,
        "description": description,
        "totalTime": `PT${readingMinutes}M`,
        "step": contentSections.map((section, idx) => ({
            "@type": "HowToStep",
            "url": `https://www.voltris.com.br${pathname}/#section-${idx}`,
            "name": section.title || '',
            "itemListElement": [{
                "@type": "HowToDirection",
                "text": (section.content || '').replace(/<[^>]*>/g, '').substring(0, 500)
            }]
        }))
    };

    // JSON-LD FAQPage Schema (Server-side) - Para AEO/GEO
    const faqSchema = faqItems && faqItems.length > 0 ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqItems.map((item) => ({
            "@type": "Question",
            "name": item.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": item.answer
            }
        }))
    } : null;

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
            />
            {isHowTo && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
                />
            )}
            {/* FAQ Schema para AEO/GEO */}
            {faqSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
                />
            )}
            {/* Entity Schema para Entity SEO */}
            {entities.length > 0 && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(entitySchema) }}
                />
            )}
            <Header />
            <main className="min-h-screen bg-gray-50 font-sans selection:bg-blue-100">

                {/* --- HERO SECTION (SERVER-SIDE) --- */}
                <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden border-b border-gray-200">
                    {/* Background Effects */}
                    <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-blue-100/30 blur-[150px] rounded-full pointer-events-none"></div>
                    <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-purple-100/30 blur-[150px] rounded-full pointer-events-none"></div>

                    <div className="relative max-w-5xl mx-auto text-center z-10 flex-grow flex flex-col items-center justify-center py-20">

                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-blue-200 shadow-sm mb-8 text-xs font-medium text-gray-600">
                            <BookOpen className="w-3 h-3 text-blue-600" />
                            <span>Guia Técnico Voltris — Verificado por Especialistas</span>
                        </div>

                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-8 tracking-tight leading-tight">
                            {title.replace(" - Voltris", "").replace(" | VOLTRIS", "")}
                        </h1>

                        <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-3xl mx-auto leading-relaxed">
                            {description}
                        </p>

                        {/* Meta Info Pills */}
                        <div className="flex flex-wrap justify-center gap-3 text-sm mb-8">
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm text-gray-700">
                                <Clock className="w-4 h-4 text-blue-600" />
                                <span>{readingMinutes} min de leitura</span>
                            </div>
                            <div className={`flex items-center gap-2 px-4 py-2 rounded-full border shadow-sm ${difficultyBg}`}>
                                <Award className={`w-4 h-4 ${difficultyColor}`} />
                                <span className={difficultyColor}>Nível: {difficultyLevel}</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm text-gray-700">
                                <User className="w-4 h-4 text-purple-600" />
                                <span>{author}</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm text-gray-700">
                                <Calendar className="w-4 h-4 text-emerald-600" />
                                <span>Atualizado em {lastUpdated}</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- AI SUMMARY BLOCK (AEO/GEO - Answer-First) --- */}
                {aiSummary && (
                    <AISummaryBlock
                        directAnswer={aiSummary}
                        estimatedTime={estimatedTime}
                        successRate="90%"
                        nextStep="Siga os passos detalhados abaixo"
                        category={category}
                    />
                )}

                {/* --- KEY POINTS TL;DR (SERVER-SIDE) --- */}
                {keyPoints && keyPoints.length > 0 && (
                    <section className="py-10 px-4 bg-white border-b border-gray-200">
                        <div className="max-w-4xl mx-auto">
                            <div className="bg-gradient-to-r from-blue-50 via-transparent to-purple-50 border border-blue-200 rounded-2xl p-6">
                                <h2 className="text-blue-600 font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Lightbulb className="w-4 h-4" />
                                    Resumo Rápido — O que você vai aprender
                                </h2>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {keyPoints.map((point, i) => (
                                        <li key={i} className="flex items-start gap-3 text-gray-700 text-sm">
                                            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                            {point}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </section>
                )}

                {/* Warning note (SERVER-SIDE) */}
                {warningNote && (
                    <section className="py-6 px-4 bg-gray-50">
                        <div className="max-w-4xl mx-auto">
                            <div className="flex items-start gap-4 bg-yellow-50 border border-yellow-200 rounded-xl p-5">
                                <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                                <p className="text-yellow-800 text-sm leading-relaxed">{warningNote}</p>
                            </div>
                        </div>
                    </section>
                )}

                {/* Quick Solution Box (Server Component) */}
                {quickSolution && (
                    <section className="py-6 px-4 bg-gray-50">
                        <div className="max-w-4xl mx-auto">
                            <QuickSolutionBox quickSolution={quickSolution} category={category} guideTitle={title} />
                        </div>
                    </section>
                )}

                {/* Funnel Progression (Server Component) - Recomendação editorial natural */}
                {activeAllGuides.length > 0 && (
                    <section className="py-6 px-4 bg-gray-50">
                        <div className="max-w-4xl mx-auto">
                            <FunnelProgression currentGuide={currentGuide as any} allGuides={activeAllGuides} />
                        </div>
                    </section>
                )}

                {/* CTA Contextual - Topo (Server Component) */}
                {showVoltrisOptimizerCTA && category && (
                    <section className="py-6 px-4 bg-gray-50">
                        <div className="max-w-6xl mx-auto">
                            <ContextualCTA category={category} guideTitle={title} position="top" />
                        </div>
                    </section>
                )}

                {/* --- MAIN CONTENT SECTION (SERVER-SIDE) --- */}
                <section id="guide-content" className="py-24 px-4 relative z-10 bg-gray-100">
                    <div className="max-w-6xl mx-auto">
                        {/* Conteúdo Principal */}
                        <div className="flex flex-col gap-12">

                            {/* Breadcrumbs (SERVER-SIDE) */}
                            <Breadcrumbs
                                items={[
                                    { label: 'Guias', href: '/guias' },
                                    { label: title.replace(' - Voltris', '').replace(' | VOLTRIS', '').substring(0, 50) }
                                ]}
                            />

                            {/* Top Meta Info Area (SERVER-SIDE) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {summaryTable && summaryTable.length > 0 && (
                                    <div className="bg-white border border-blue-200 rounded-2xl p-6 relative overflow-hidden h-full shadow-sm">
                                        <div className="absolute top-0 right-0 w-20 h-20 bg-blue-100 blur-xl rounded-full"></div>
                                        <h3 className="text-gray-900 font-bold mb-4 flex items-center gap-2">
                                            <Target className="w-5 h-5 text-blue-600" /> Resumo Técnico
                                        </h3>
                                        <div className="space-y-3">
                                            {summaryTable.map((item, idx) => (
                                                <div key={idx} className="flex justify-between items-center border-b border-gray-200 pb-2 last:border-0 last:pb-0">
                                                    <span className="text-gray-500 text-sm">{item.label}</span>
                                                    <span className="text-gray-900 font-medium text-sm text-right">{item.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Table of Contents (SERVER-SIDE) - CSS sticky + details/summary para mobile */}
                                <div className="bg-white border border-gray-200 rounded-2xl p-6 h-full shadow-sm">
                                    <h3 className="text-gray-900 font-bold mb-4 text-sm uppercase tracking-wider text-gray-500 flex items-center gap-2">
                                        <BookOpen className="w-4 h-4 text-gray-500" /> Índice de Conteúdo
                                    </h3>
                                    <details className="lg:hidden group" open>
                                        <summary className="flex items-center justify-between cursor-pointer text-sm font-medium text-gray-700 mb-3 select-none">
                                            <span>Mostrar seções</span>
                                            <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90" />
                                        </summary>
                                        <nav className="space-y-1">
                                            {allSections.map((section, idx) => (
                                                <a key={idx} href={`#section-${idx}`} className="block flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-lg text-sm transition-colors border-l-2 border-transparent hover:border-blue-600">
                                                    <span className="truncate">{idx + 1}. {section.title}</span>
                                                </a>
                                            ))}
                                        </nav>
                                    </details>
                                    <nav className="hidden lg:block space-y-1 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                                        {allSections.map((section, idx) => (
                                            <a key={idx} href={`#section-${idx}`} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-lg text-sm transition-colors border-l-2 border-transparent hover:border-blue-600">
                                                <ChevronRight className="w-3 h-3 shrink-0" />
                                                <span className="truncate">{idx + 1}. {section.title}</span>
                                            </a>
                                        ))}
                                    </nav>
                                </div>
                            </div>

                            {/* Article Content (SERVER-SIDE) */}
                            <article className="space-y-12" itemScope itemType="https://schema.org/TechArticle">
                                <meta itemProp="author" content={author} />
                                <meta itemProp="dateModified" content={`${lastUpdated}-01-01`} />

                                {contentSections.map((section, sectionIndex) => (
                                    <React.Fragment key={sectionIndex}>
                                        <div
                                            id={`section-${sectionIndex}`}
                                            className="bg-white p-8 md:p-12 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden"
                                        >
                                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-50"></div>

                                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 tracking-tight flex items-start gap-4">
                                                <span className="text-blue-600 text-xl opacity-50 font-mono mt-1">0{sectionIndex + 1}.</span>
                                                {section.title}
                                            </h2>

                                            {/* AEO/GEO: Micro-sumário para chunk extraction */}
                                            {section.summary && <SectionSummary summary={section.summary} />}

                                            <div
                                                className="text-gray-700 leading-8 prose prose-lg max-w-none prose-headings:text-gray-900 prose-a:text-blue-600 prose-strong:text-gray-900 prose-ul:list-disc prose-ol:list-decimal"
                                                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(section.content || '') }}
                                            />

                                            {section.subsections && (
                                                <div className="mt-10 space-y-10 pl-0 md:pl-8 md:border-l-2 md:border-gray-200">
                                                    {section.subsections.map((subsection, subIndex) => (
                                                        <div key={subIndex}>
                                                            <h3 className="text-2xl font-bold text-gray-900 mb-5 flex items-center gap-3">
                                                                <span className="w-2 h-2 rounded-full bg-pink-600"></span>
                                                                {subsection.subtitle}
                                                            </h3>
                                                            <div
                                                                className="text-gray-600 leading-relaxed prose max-w-none"
                                                                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(subsection.content || '') }}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Placeholder para VoltrisOptimizerBanner (será client-side) */}
                                        {sectionIndex === 0 && showVoltrisOptimizerCTA && (
                                            <div id="voltris-optimizer-banner-secondary" className="my-12"></div>
                                        )}

                                        {/* CTA Contextual - Meio (Server Component) após 50% do conteúdo */}
                                        {sectionIndex === Math.floor(contentSections.length / 2) && showVoltrisOptimizerCTA && category && (
                                            <div className="max-w-6xl mx-auto -mx-4">
                                                <ContextualCTA category={category} guideTitle={title} position="middle" />
                                            </div>
                                        )}
                                    </React.Fragment>
                                ))}

                                {/* Advanced Content Sections (SERVER-SIDE) */}
                                {advancedContentSections && advancedContentSections.length > 0 && (
                                    <>
                                        {advancedContentSections.map((section: ContentSection, sectionIndex: number) => (
                                            <div
                                                key={`advanced-${sectionIndex}`}
                                                id={`section-${contentSections.length + sectionIndex}`}
                                                className="bg-gradient-to-br from-purple-50 to-white p-8 md:p-12 rounded-2xl border border-purple-200 shadow-sm relative overflow-hidden"
                                            >
                                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 opacity-50"></div>
                                                <div className="flex items-start gap-3 mb-2">
                                                    <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-1 rounded-full border border-purple-200">
                                                        CONTEÚDO AVANÇADO
                                                    </span>
                                                </div>
                                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 tracking-tight flex items-start gap-4">
                                                    <span className="text-purple-600 text-xl opacity-50 font-mono mt-1">A{sectionIndex + 1}.</span>
                                                    {section.title}
                                                </h2>

                                                {/* AEO/GEO: Micro-sumário para chunk extraction */}
                                                {section.summary && <SectionSummary summary={section.summary} />}

                                                <div
                                                    className="text-gray-700 leading-8 prose prose-lg max-w-none prose-headings:text-gray-900 prose-a:text-purple-600 prose-strong:text-gray-900"
                                                    dangerouslySetInnerHTML={{ __html: section.content ? DOMPurify.sanitize(section.content) : '' }}
                                                />
                                            </div>
                                        ))}
                                    </>
                                )}

                                {/* Additional Content Sections (SERVER-SIDE) */}
                                {additionalContentSections && additionalContentSections.length > 0 && (
                                    <>
                                        {additionalContentSections.map((section: ContentSection, sectionIndex: number) => (
                                            <div
                                                key={`additional-${sectionIndex}`}
                                                id={`section-${contentSections.length + (advancedContentSections?.length || 0) + sectionIndex}`}
                                                className="bg-gradient-to-br from-pink-50 to-white p-8 md:p-12 rounded-2xl border border-pink-200 shadow-sm relative overflow-hidden"
                                            >
                                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-600 via-blue-600 to-purple-600 opacity-50"></div>
                                                <div className="flex items-start gap-3 mb-2">
                                                    <span className="bg-pink-100 text-pink-700 text-xs font-bold px-2 py-1 rounded-full border border-pink-200">
                                                        SAIBA MAIS
                                                    </span>
                                                </div>
                                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 tracking-tight">
                                                    {section.title}
                                                </h2>

                                                {/* AEO/GEO: Micro-sumário para chunk extraction */}
                                                {section.summary && <SectionSummary summary={section.summary} />}

                                                <div
                                                    className="text-gray-700 leading-8 prose prose-lg max-w-none prose-headings:text-gray-900"
                                                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(section.content || '') }}
                                                />
                                            </div>
                                        ))}
                                    </>
                                )}

                                {/* Placeholder para VoltrisOptimizerBanner final (será client-side) */}
                                {showVoltrisOptimizerCTA && (
                                    <div id="voltris-optimizer-banner-final" className="my-12"></div>
                                )}

                                {/* --- AUTHOR BIO — E-E-A-T MÁXIMO (SERVER-SIDE) --- */}
                                <div className="bg-white border border-blue-200 rounded-2xl p-8 relative overflow-hidden shadow-sm">
                                    <div className="absolute top-0 right-0 w-40 h-40 bg-blue-100 blur-3xl rounded-full"></div>
                                    <div className="flex flex-col md:flex-row items-start gap-6 relative z-10">
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#31A8FF] to-[#8B31FF] flex items-center justify-center text-white font-black text-2xl shrink-0">
                                            {author.split(' ')[0][0]}{author.split(' ').slice(-1)[0][0]}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-blue-600 font-bold uppercase tracking-widest mb-1">Escrito por um especialista verificado</p>
                                            <h4 className="text-gray-900 font-bold text-lg mb-1">{author}</h4>
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {authorCredentials.map((cred, i) => (
                                                    <span key={i} className="text-xs bg-gray-100 border border-gray-200 text-gray-600 px-2 py-1 rounded-full flex items-center gap-1">
                                                        <Star className="w-3 h-3 text-yellow-500" /> {cred}
                                                    </span>
                                                ))}
                                            </div>
                                            <p className="text-gray-600 text-sm leading-relaxed">{authorBio}</p>
                                            <Link href="/sobre" className="inline-flex items-center gap-1 text-blue-600 text-sm mt-3 hover:underline">
                                                Conhecer a equipe Voltris <ArrowRight className="w-3 h-3" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                {/* Conclusão Rica (SERVER-SIDE) */}
                                {!hasCustomConclusion && (
                                    <div className="bg-gradient-to-br from-blue-50 to-white p-8 md:p-12 rounded-2xl border border-blue-200 shadow-sm relative overflow-hidden">
                                        <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-100/50 blur-[80px] rounded-full"></div>
                                        <h2 className="text-3xl font-bold text-gray-900 mb-6 relative z-10 flex items-center gap-3">
                                            <CheckCircle className="w-8 h-8 text-emerald-600" />
                                            Conclusão e Próximos Passos
                                        </h2>
                                        <p className="text-gray-700 leading-relaxed mb-6 relative z-10 text-lg">
                                            Seguindo este guia sobre <strong className="text-gray-900">{title.split(' - ')[0].replace(' | VOLTRIS', '')}</strong>, você está equipado com o conhecimento técnico verificado para resolver este problema com confiança.
                                        </p>
                                        <p className="text-gray-600 leading-relaxed mb-8 relative z-10">
                                            Se ainda tiver dificuldades após seguir todos os passos, nossa equipe de suporte especializado está disponível para um diagnóstico remoto personalizado. Cada sistema é único e pode exigir uma abordagem específica.
                                        </p>
                                        <div className="flex flex-col sm:flex-row gap-4 relative z-10">
                                            <Link href="/todos-os-servicos" className="flex-1 px-8 py-5 bg-white text-gray-900 border border-gray-200 font-bold rounded-xl hover:bg-gray-50 transition text-center shadow-sm text-base">
                                                Ver Serviços Profissionais
                                            </Link>
                                            <Link href="https://wa.me/5511996716235" target="_blank" rel="noopener noreferrer" className="flex-1 px-8 py-5 bg-blue-50 text-blue-600 border border-blue-200 font-bold rounded-xl hover:bg-blue-100 transition text-center flex items-center justify-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                                Suporte via WhatsApp
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </article>
                        </div>
                    </div>
                </section>

                {/* --- REFERÊNCIAS EXTERNAS (E-E-A-T) (SERVER-SIDE) --- */}
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

                {/* --- FAQ & RELATED GUIDES (SERVER-SIDE) --- */}
                <div className="bg-[#020205] relative z-10">
                    {faqItems && faqItems.length > 0 && (
                        <section className="py-20 px-4 border-t border-white/5 bg-[#050510]">
                            <div className="max-w-4xl mx-auto">
                                <h2 className="text-3xl font-bold text-white mb-2 text-center">Perguntas Frequentes</h2>
                                <p className="text-slate-500 text-center mb-10">Dúvidas comuns respondidas pela equipe técnica Voltris</p>
                                <div className="space-y-4">
                                    {faqItems.map((item, index) => (
                                        <div
                                            key={index}
                                            className="bg-[#0A0A0F] p-6 rounded-xl border border-white/5 hover:border-white/10 transition-colors"
                                        >
                                            <h3 className="text-lg font-bold text-white mb-3 flex items-start gap-3">
                                                <span className="text-[#31A8FF] mt-1 font-mono text-sm">Q{index + 1}.</span>
                                                {item.question}
                                            </h3>
                                            <div className="text-slate-400 text-sm leading-relaxed pl-8 border-l border-white/5 ml-4" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.answer) }} />
                                        </div>
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

                    {/* Internal Links Inteligentes (Server Component) */}
                    {activeAllGuides.length > 0 && (
                        <section className="py-20 px-4 border-t border-white/5 bg-[#050510]">
                            <div className="max-w-4xl mx-auto">
                                <InternalLinks currentGuide={currentGuide as any} allGuides={activeAllGuides} type="related" maxLinks={5} />
                            </div>
                        </section>
                    )}

                    {/* Tabela Comparativa Before/After (Server Component) */}
                    {showVoltrisOptimizerCTA && category && (
                        <section className="py-20 px-4 border-t border-white/5 bg-[#050510]">
                            <div className="max-w-4xl mx-auto">
                                <ComparisonTable category={category} />
                            </div>
                        </section>
                    )}

                    {/* CTA Contextual - Final (Server Component) */}
                    {showVoltrisOptimizerCTA && category && (
                        <section className="py-20 px-4 border-t border-white/5 bg-[#050510]">
                            <div className="max-w-6xl mx-auto">
                                <ContextualCTA category={category} guideTitle={title} position="final" />
                            </div>
                        </section>
                    )}
                </div>

                <Footer />
            </main>
        </>
    );
}
