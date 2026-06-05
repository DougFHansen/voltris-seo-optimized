"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from 'react-dom';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

const OptimizerMockup = dynamic(() => import('@/components/OptimizerMockup'), {
    loading: () => <div className="w-full h-[400px] bg-white/5 animate-pulse rounded-2xl" />,
    ssr: false
});

const ParticleBackground = dynamic(() => import("@/components/ParticleBackground"), {
    ssr: true
});

declare global {
    interface Window {
        adsbygoogle: unknown[];
    }
}

export default function HomeClient() {
    const [showMoreText, setShowMoreText] = useState(false);
    const [showParticles, setShowParticles] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const timer = setTimeout(() => setShowParticles(true), 3500); 
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const handleAnchorScroll = () => {
            const hash = window.location.hash;
            if (hash) {
                const element = document.querySelector(hash);
                if (element) {
                    const headerHeight = 80;
                    const elementPosition = (element as HTMLElement).offsetTop - headerHeight;
                    window.scrollTo({
                        top: elementPosition,
                        behavior: 'smooth'
                    });
                }
            }
        };

        handleAnchorScroll();

        window.addEventListener('hashchange', handleAnchorScroll);
        return () => {
            window.removeEventListener('hashchange', handleAnchorScroll);
        };
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const code = params.get('code');
            const error = params.get('error');
            const errorDescription = params.get('error_description');

            if (code) {
                const savedRedirect = sessionStorage.getItem('oauth_redirect_after_login');
                sessionStorage.removeItem('oauth_redirect_after_login');
                const nextParam = savedRedirect ? `&next=${encodeURIComponent(savedRedirect)}` : '';
                window.location.replace(`/auth/callback?code=${encodeURIComponent(code)}${nextParam}`);
                return;
            }

            if (error) {
                alert(`Erro de autenticação: ${error}\n${errorDescription || ''}`);
            }
        }
    }, []);

    if (!mounted) return null;

    const particlePlaceholder = document.getElementById('particle-background-placeholder');


    return (
        <>
            {particlePlaceholder && createPortal(
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-[2]">
                    {showParticles && <ParticleBackground />}
                </div>,
                particlePlaceholder
            )}

        </>
    );
}
