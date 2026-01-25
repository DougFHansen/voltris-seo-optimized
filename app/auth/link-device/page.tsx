'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Loader2 } from 'lucide-react';

function LinkDeviceContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const supabase = createClient();

    const installationId = searchParams.get('installation_id');

    useEffect(() => {
        const handleLinking = async () => {
            // 1. Verificar sessão
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
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
                        user_id: session.user.id
                    })
                });

                if (!response.ok) throw new Error('Falha na vinculação');

                // 3. Sucesso -> Dashboard
                router.push('/dashboard?tab=pc&linked=true');
            } catch (err) {
                console.error('[LINK_DEVICE] Erro:', err);
                router.push('/dashboard?tab=pc&error=link_failed');
            }
        };

        handleLinking();
    }, [installationId, router, supabase]);

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
