'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import Header from "@/components/Header";
import Footer from "@/components/Footer";


export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: password
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      console.error('Password Reset Error:', error);
    } else {
      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    }
  };

  return (
    <>
      <Header />
      <div className="pt-16 sm:pt-20 bg-[#171313] min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md bg-[#171313] p-8 rounded-lg shadow-lg border border-[#8B31FF]/10">
          <h2 className="text-2xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF]">
            Redefinir Senha
          </h2>
          {success ? (
            <div className="text-center">
              <p className="text-green-500 mb-4">Senha redefinida com sucesso!</p>
              <p className="text-[#adb5bd]">Redirecionando para a página de login...</p>
            </div>
          ) : (
            <form onSubmit={handleResetPassword}>
              <div className="mb-4">
                <label htmlFor="password" className="block text-white text-sm font-bold mb-2">Nova Senha:</label>
                <input
                  type="password"
                  id="password"
                  className="w-full px-4 py-2 rounded-lg bg-[#2a2a2e] text-white border border-[#8B31FF]/30 focus:border-[#FF4B6B] focus:outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <div className="mb-6">
                <label htmlFor="confirmPassword" className="block text-white text-sm font-bold mb-2">Confirmar Nova Senha:</label>
                <input
                  type="password"
                  id="confirmPassword"
                  className="w-full px-4 py-2 rounded-lg bg-[#2a2a2e] text-white border border-[#8B31FF]/30 focus:border-[#FF4B6B] focus:outline-none"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              {error && (
                <p className="text-[#FF4B6B] text-sm italic mb-4 text-center">{error}</p>
              )}
              <button
                type="submit"
                className={`w-full px-6 py-3 rounded-lg bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-white font-semibold hover:shadow-[0_0_20px_rgba(139,49,255,0.3)] transition-all duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={loading}
              >
                {loading ? 'Redefinindo...' : 'Redefinir Senha'}
              </button>
            </form>
          )}
        </div>
      </div>
      
      <Footer />
    </>
  );
} 
