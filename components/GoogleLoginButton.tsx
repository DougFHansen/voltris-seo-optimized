'use client';

import { createClient } from '@/utils/supabase/client';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { Loader2 } from 'lucide-react';

interface GoogleLoginButtonProps {
    onSuccess?: () => void;
    onError?: (error: string) => void;
    disabled?: boolean;
    redirect?: string;
}

export default function GoogleLoginButton({ onSuccess, onError, disabled, redirect }: GoogleLoginButtonProps) {
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    const handleGoogleLogin = async () => {
        try {
            setLoading(true);
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                   redirectTo: `${window.location.origin}/auth/callback${redirect ? `?next=${encodeURIComponent(redirect)}` : ''}`,
                },
            });

            if (error) throw error;
            
            if (onSuccess) onSuccess();
        } catch (error: any) {
            console.error('Error logging in with Google:', error);
            if (onError) onError(error.message || 'Erro ao entrar com Google');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={disabled || loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl text-gray-700 font-semibold text-sm transition-all duration-300 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed group"
        >
            {loading ? (
                <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
            ) : (
                <FcGoogle className="w-5 h-5 group-hover:scale-110 transition-transform" />
            )}
            Continuar com Google
        </button>
    );
}
