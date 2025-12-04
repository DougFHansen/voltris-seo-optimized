'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';

interface NewTicketFormProps {
  onSuccess: () => void;
  onClose: () => void;
}

export default function NewTicketForm({ onSuccess, onClose }: NewTicketFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    try {
      setIsSubmitting(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Primeiro, criar o ticket
      const { data: ticket, error: ticketError } = await supabase
        .from('tickets')
        .insert([
          {
            title: title.trim(),
            status: 'Aberto',
            priority,
            user_id: user.id
          }
        ])
        .select()
        .single();

      if (ticketError) {
        console.error('Erro ao criar ticket:', ticketError);
        throw new Error(ticketError.message || 'Erro ao criar ticket');
      }

      // Depois, adicionar a descrição como primeira mensagem
      const { error: messageError } = await supabase
        .from('ticket_messages')
        .insert({
          ticket_id: ticket.id,
          content: description.trim(),
          user_id: user.id
        });

      if (messageError) {
        console.error('Erro ao adicionar mensagem:', messageError);
        throw new Error(messageError.message || 'Erro ao adicionar mensagem inicial');
      }

      toast.success('Ticket criado com sucesso!');
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Erro ao criar ticket:', error);
      toast.error(error?.message || 'Erro ao criar ticket');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={onClose}
        className="absolute top-0 right-0 text-gray-400 hover:text-white transition-colors duration-300"
      >
        <FiX className="w-6 h-6" />
      </button>

      <h2 className="text-2xl font-bold text-white mb-6">Novo Ticket</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
            Título
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 bg-[#1E1E1E]/40 backdrop-blur-xl border border-gray-800/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#8B31FF] transition-colors duration-300"
            placeholder="Digite o título do ticket"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
            Descrição
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 bg-[#1E1E1E]/40 backdrop-blur-xl border border-gray-800/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#8B31FF] transition-colors duration-300"
            placeholder="Descreva o problema ou solicitação"
          />
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-300 mb-2">
            Prioridade
          </label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
            className="w-full px-4 py-2 bg-[#1E1E1E]/40 backdrop-blur-xl border border-gray-800/30 rounded-xl text-white focus:outline-none focus:border-[#8B31FF] transition-colors duration-300"
          >
            <option value="low">Baixa</option>
            <option value="medium">Média</option>
            <option value="high">Alta</option>
          </select>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 text-gray-300 hover:text-white transition-colors duration-300"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-gradient-to-r from-[#FF4B6B] to-[#8B31FF] text-white rounded-xl hover:shadow-lg hover:shadow-[#8B31FF]/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Criando...' : 'Criar Ticket'}
          </button>
        </div>
      </form>
    </div>
  );
} 