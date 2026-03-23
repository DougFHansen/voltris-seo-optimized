'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from '@/app/hooks/useAuth';
import { Loader2 } from 'lucide-react';

function LinkDeviceContent() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const supabase = createClient();

    const installationId = searchParams.get('installation_id');

    useEffect(() => {
        const handleLinking = async () => {
            // Aguardar o AuthProvider resolver o estado inicial
            if (authLoading) return;

            console.log('[LINK_DEVICE] Iniciando processo de vinculação');
            console.log('[LINK_DEVICE] installation_id:', installationId);
            console.log('[LINK_DEVICE] Usuário Autenticado:', user ? user.email : 'Nenhum');

            if (!user) {
                // Redirecionar para login preservando o installation_id e o retorno para cá
                const redirectUrl = `/auth/link-device${installationId ? `?installation_id=${installationId}` : ''}`;
                console.log('[LINK_DEVICE] Redirecionando para login com redirect:', redirectUrl);
                router.push(`/login?redirect=${encodeURIComponent(redirectUrl)}&installation_id=${installationId || ''}`);
                return;
            }

            if (!installationId) {
                console.log('[LINK_DEVICE] Sem installation_id, redirecionando para dashboard');
                router.push('/dashboard?tab=pc');
                return;
            }

            try {
                console.log('[LINK_DEVICE] Chamando API de vinculação');
                console.log('[LINK_DEVICE] Payload:', { installation_id: installationId, user_id: user.id });

                // 2. Vincular dispositivo
                const response = await fetch('/api/v1/install/link', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        installation_id: installationId,
                        user_id: user.id
                    })
                });

                console.log('[LINK_DEVICE] Resposta da API:', response.status, response.statusText);
                const responseData = await response.json();
                console.log('[LINK_DEVICE] Dados da resposta:', responseData);

                if (!response.ok) {
                    console.error('[LINK_DEVICE] Erro na vinculação:', responseData);
                    throw new Error('Falha na vinculação');
                }

                console.log('[LINK_DEVICE] Vinculação bem-sucedida! Redirecionando para dashboard');
                // 3. Sucesso -> Dashboard
                router.push('/dashboard?tab=pc&linked=true');
            } catch (err) {
                console.error('[LINK_DEVICE] Erro:', err);
                router.push('/dashboard?tab=pc&error=link_failed');
            }
        };

        handleLinking();
    }, [installationId, router, user, authLoading]);

    return (
        <div className="h-screen w-full bg-[#050510] flex flex-col items-center justify-center text-white">
            <Loader2 className="w-12 h-12 text-[#31A8FF] animate-spin mb-4" />
            <h1 className="text-xl font-bold">Vinculando seu Computador...</h1>
            <p className="text-slate-400 text-sm mt-2">Aguarde um momento enquanto sincronizamos sua conta.</p>
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
