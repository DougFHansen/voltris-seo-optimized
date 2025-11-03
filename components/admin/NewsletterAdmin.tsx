'use client';

import { useState } from 'react';
import { supabase } from '@/app/lib/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface Subscriber {
  id: string;
  email: string;
  source: 'site' | 'blog';
  subscribed_at: string;
  status: string;
}

export default function NewsletterAdmin() {
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: subscribers = [], isLoading } = useQuery({
    queryKey: ['newsletter-subscribers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('subscribed_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      // Atualizar o cache do React Query
      queryClient.setQueryData(['newsletter-subscribers'], (oldData: Subscriber[] | undefined) => {
        if (!oldData) return [];
        return oldData.map(sub => 
          sub.id === id ? { ...sub, status: newStatus } : sub
        );
      });
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
      setError('Erro ao atualizar status do inscrito');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF4B6B]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-white">Inscritos na Newsletter</h2>
        <div className="text-gray-400">
          Total: {subscribers.length} inscritos
        </div>
      </div>

      <div className="bg-[#171313] rounded-lg border border-[#8B31FF]/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#8B31FF]/5">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Fonte
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Data de Inscrição
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#8B31FF]/10">
              {subscribers.map((subscriber) => (
                <tr key={subscriber.id} className="hover:bg-[#8B31FF]/5">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {subscriber.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {subscriber.source === 'site' ? 'Site' : 'Blog'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {new Date(subscriber.subscribed_at).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      subscriber.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {subscriber.status === 'active' ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <select
                      value={subscriber.status}
                      onChange={(e) => handleStatusChange(subscriber.id, e.target.value)}
                      className="bg-[#171313] border border-[#8B31FF]/20 rounded px-2 py-1 text-sm focus:outline-none focus:border-[#FF4B6B]"
                    >
                      <option value="active">Ativo</option>
                      <option value="inactive">Inativo</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 