'use client';

import { useEffect, Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from '@/app/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import { FiAlertCircle } from 'react-icons/fi';
import Link from 'next/link';

function LinkDeviceContent() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const installationId = searchParams.get('installation_id');
    const [error, setLocalError] = useState<string | null>(null);

    useEffect(() => {
        const handleLinking = async () => {
            // Aguardar o AuthProvider resolver o estado inicial
            if (authLoading) return;

            console.log('[LINK_DEVICE] Iniciando processo de vinculação');
            console.log('[LINK_DEVICE] installation_id:', installationId);

            if (!user) {
                // Redirecionar para login preservando o installation_id e o retorno para cá
                const redirectUrl = `/auth/link-device${installationId ? `?installation_id=${installationId}` : ''}`;
                router.push(`/login?redirect=${encodeURIComponent(redirectUrl)}&installation_id=${installationId || ''}`);
                return;
            }

            if (!installationId) {
                router.push('/dashboard?tab=pc');
                return;
            }

            try {
                // 2. Vincular dispositivo
                const response = await fetch('/api/v1/install/link', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        installation_id: installationId,
                        user_id: user.id
                    })
                });

                const responseData = await response.json();

                if (!response.ok) {
                    setLocalError(responseData.error || 'Erro desconhecido na vinculação');
                    return;
                }

                console.log('[LINK_DEVICE] Vinculação bem-sucedida!');
                // 3. Sucesso -> Dashboard
                router.push('/dashboard?tab=pc&linked=true');
            } catch (err: any) {
                console.error('[LINK_DEVICE] Erro:', err);
                setLocalError(err.message || 'Erro de rede ao tentar vincular');
            }
        };

        handleLinking();
    }, [installationId, router, user, authLoading]);

    return (
        <div className="h-screen w-full bg-[#050510] flex flex-col items-center justify-center text-white p-4">
            <div className="p-8 rounded-[2.5rem] bg-[#12121A] border border-white/10 backdrop-blur-xl max-w-md w-full text-center shadow-2xl">
                {error ? (
                    <div className="space-y-6">
                        <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-3xl flex items-center justify-center mx-auto border border-red-500/20">
                            <FiAlertCircle className="w-10 h-10" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-3xl font-black uppercase italic tracking-tighter">Falha Crítica</h2>
                            <p className="text-white/40 text-sm font-bold uppercase tracking-wide px-4">{error}</p>
                        </div>
                        <div className="flex flex-col gap-3 pt-4">
                            <button 
                                onClick={() => window.location.reload()}
                                className="w-full py-5 bg-white text-black font-black uppercase italic text-xs rounded-2xl hover:scale-105 transition-all shadow-xl"
                            >
                                Tentar Novamente
                            </button>
                            <Link 
                                href="/dashboard"
                                className="w-full py-5 bg-white/5 text-white/40 font-black uppercase italic text-xs rounded-2xl hover:bg-white/10 border border-white/5"
                            >
                                Ir para o Dashboard
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8 py-4">
                        <div className="relative mx-auto w-24 h-24">
                           <div className="absolute inset-0 border-t-4 border-[#31A8FF] rounded-full animate-spin"></div>
                           <div className="absolute inset-0 border-b-4 border-[#8B31FF] rounded-full animate-spin-slow opacity-50"></div>
                           <div className="absolute inset-0 flex items-center justify-center">
                              <Loader2 className="w-8 h-8 text-white/20 animate-pulse" />
                           </div>
                        </div>
                        <div className="space-y-3">
                            <h2 className="text-2xl font-black uppercase italic tracking-tighter animate-pulse">Vinculando seu PC</h2>
                            <p className="text-[#31A8FF] text-[10px] font-black uppercase tracking-[0.3em] opacity-70">Estabelecendo Link Neural...</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function LinkDevicePage() {
    return (
        <Suspense fallback={
            <div className="h-screen w-full bg-[#050510] flex items-center justify-center text-white">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        }>
            <LinkDeviceContent />
        </Suspense>
    );
}
