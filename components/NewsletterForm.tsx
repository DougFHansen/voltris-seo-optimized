'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

interface NewsletterFormProps {
  source: 'site' | 'blog';
}

export default function NewsletterForm({ source }: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const supabase = createClient();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus('error');
      setErrorMessage('Por favor, insira um email válido');
      return;
    }

    try {
      // Verificar se o email já está cadastrado
      const { data: existingSubscriber } = await supabase
        .from('newsletter_subscribers')
        .select('email')
        .eq('email', email)
        .eq('source', source)
        .single();

      if (existingSubscriber) {
        setStatus('error');
        setErrorMessage('Este email já está inscrito na newsletter');
        return;
      }

      // Inserir novo inscrito
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([
          {
            email,
            source,
            subscribed_at: typeof window !== 'undefined' ? new Date().toISOString() : '',
            status: 'active'
          }
        ]);

      if (error) throw error;

      setStatus('success');
      setEmail('');
    } catch (error) {
      console.error('Erro ao salvar inscrição:', error);
      setStatus('error');
      setErrorMessage('Erro ao realizar inscrição. Tente novamente.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {mounted && (
        <input
          type="email"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          placeholder="Seu melhor e-mail"
          className="w-full px-4 py-2 bg-[#171313] border border-[#8B31FF]/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FF4B6B] transition-colors duration-300 text-center"
          required
        />
      )}
      {!mounted && (
        <input
          type="email"
          defaultValue=""
          placeholder="Seu melhor e-mail"
          className="w-full px-4 py-2 bg-[#171313] border border-[#8B31FF]/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FF4B6B] transition-colors duration-300 text-center"
          required
          readOnly
        />
      )}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full px-4 py-2 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-white rounded-lg font-semibold hover:opacity-90 transition-all duration-300 disabled:opacity-50"
      >
        {status === 'loading' ? 'Enviando...' : 'Inscrever-se'}
      </button>
      {status === 'success' && (
        <p className="text-green-500 text-sm">Inscrição realizada com sucesso!</p>
      )}
      {status === 'error' && (
        <p className="text-red-500 text-sm">{errorMessage}</p>
      )}
    </form>
  );
} 