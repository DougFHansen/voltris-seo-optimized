'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { motion, useScroll, useSpring } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { Download, Zap, BookOpen } from 'lucide-react';
import { notifyDownload } from '@/utils/notifications';
import OptimizerMockup from '@/components/OptimizerMockup';
import DOMPurify from 'isomorphic-dompurify';

export interface GuideTemplateClientProps {
    title: string;
    showVoltrisOptimizerCTA?: boolean;
}

// Componente Interno de Banner para Reuso Estratégico (Client-side para interatividade)
const VoltrisOptimizerBanner = ({ isSecondary = false, title }: { isSecondary?: boolean; title: string }) => (
    <div className={`my-12 relative group ${isSecondary ? 'opacity-90 scale-95' : ''}`}>
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl opacity-30 group-hover:opacity-60 blur-xl transition duration-500"></div>
        <div className="relative bg-white/95 backdrop-blur-3xl border border-gray-200 rounded-[2.5rem] p-8 md:p-12 flex flex-col xl:flex-row items-center gap-12 shadow-xl">
            <div className="flex-1 space-y-6 z-10 text-center xl:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-[10px] font-black uppercase tracking-[0.2em]">
                    <Zap className="w-3 h-3 fill-current" /> Otimização Recomendada
                </div>
                <h3 className="text-xl md:text-2xl font-black text-gray-900 leading-tight uppercase italic tracking-tight">
                    Não perca tempo com <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Ajustes Manuais.</span>
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed font-bold">
                    O <span className="text-gray-900">Voltris Optimizer PRO</span> automatiza este guia e aplica 150+ otimizações de kernel instantaneamente.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center xl:justify-start">
                    <Link
                        href="/voltrisoptimizer"
                        onClick={() => notifyDownload(`Guide CTA Click (Free) - ${title}`)}
                        className="px-6 py-3 bg-white border-2 border-gray-200 text-gray-900 font-bold uppercase italic tracking-wider rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2 group"
                    >
                        <span>Versão Grátis</span>
                        <Download className="w-4 h-4" />
                    </Link>
                    <Link
                        href="/adquirir-licenca"
                        onClick={() => notifyDownload(`Guide CTA Click (PRO) - ${title}`)}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold uppercase italic tracking-wider rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
                    >
                        <span>Obter Licença PRO</span>
                        <Zap className="w-4 h-4 fill-current group-hover:animate-pulse" />
                    </Link>
                </div>
            </div>
            <div className="w-full xl:w-[450px] shrink-0">
                <OptimizerMockup />
            </div>
        </div>
    </div>
);

export default function GuideTemplateClient({ title, showVoltrisOptimizerCTA = true }: GuideTemplateClientProps) {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

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

    if (!mounted) return null;

    const secondaryBannerPlaceholder = document.getElementById('voltris-optimizer-banner-secondary');
    const finalBannerPlaceholder = document.getElementById('voltris-optimizer-banner-final');

    return (
        <>
            {/* Barra de Progresso de Leitura Viral */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] z-[100] origin-left"
                style={{ scaleX }}
            />

            {/* Viral Floating Share Buttons (Discord & WhatsApp) */}
            <div className="fixed bottom-8 left-8 flex flex-col gap-4 z-50 animate-in slide-in-from-left duration-700">
                <a
                    href={`https://wa.me/?text=Olha%20esse%20guia%20da%20Voltris:%20${title}%20-%20https://www.voltris.com.br/guias`}
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
            </div>

            {/* Scroll Indicator Animado (substitui o estático do Server Component) */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 1, repeat: Infinity, repeatType: "reverse" }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer text-gray-400 hover:text-gray-900 transition-colors z-20"
                onClick={() => {
                    const nextSection = document.getElementById('guide-content');
                    if (nextSection) nextSection.scrollIntoView({ behavior: 'smooth' });
                }}
            >
                <span className="text-xs uppercase tracking-widest font-medium">SCROLL</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-blue-600 to-transparent"></div>
            </motion.div>

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

            {/* Banners do Voltris Optimizer via createPortal */}
            {secondaryBannerPlaceholder && showVoltrisOptimizerCTA && createPortal(
                <VoltrisOptimizerBanner isSecondary={true} title={title} />,
                secondaryBannerPlaceholder
            )}

            {finalBannerPlaceholder && showVoltrisOptimizerCTA && createPortal(
                <VoltrisOptimizerBanner isSecondary={false} title={title} />,
                finalBannerPlaceholder
            )}
        </>
    );
}
