'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiX, FiTrash2 } from 'react-icons/fi';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

interface Comment {
  id: string;
  post_slug: string;
  name: string;
  email: string;
  comment: string;
  created_at: string;
  aprovado: boolean;
}

export default function CommentsAdmin() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const { error } = await supabase
        .from('comments')
        .update({ aprovado: true })
        .eq('id', id);

      if (error) throw error;
      fetchComments();
    } catch (error) {
      console.error('Error approving comment:', error);
      alert('Erro ao aprovar comentário. Tente novamente.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este comentário?')) return;

    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Erro ao excluir comentário. Tente novamente.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#171313] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8B31FF]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#171313] py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF]">
            Gerenciamento de Comentários
          </h1>
          <Link
            href="/restricted-area-admin/blog"
            className="px-4 py-2 bg-[#2A2A2A] text-white rounded-lg hover:bg-[#3A3A3A] transition-colors"
          >
            Voltar para Blog
          </Link>
        </div>

        <div className="space-y-4">
          {comments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#1E1E1E] rounded-xl p-6 border border-gray-800"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">{comment.name}</h3>
                  <p className="text-sm text-gray-400">{comment.email}</p>
                  <Link
                    href={`/blog/${comment.post_slug}`}
                    className="text-sm text-[#8B31FF] hover:text-[#7B21FF] transition-colors"
                  >
                    Ver post
                  </Link>
                </div>
                <div className="flex gap-2">
                  {!comment.aprovado && (
                    <button
                      onClick={() => handleApprove(comment.id)}
                      className="p-2 text-green-500 hover:bg-green-500/10 rounded-lg transition-colors"
                    >
                      <FiCheck />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
              <p className="text-gray-300 mb-4">{comment.comment}</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{new Date(comment.created_at).toLocaleString()}</span>
                <span
                  className={`px-2 py-1 rounded-full ${
                    comment.aprovado
                      ? 'bg-green-500/10 text-green-500'
                      : 'bg-yellow-500/10 text-yellow-500'
                  }`}
                >
                  {comment.aprovado ? 'Aprovado' : 'Pendente'}
                </span>
              </div>
            </motion.div>
          ))}
          {comments.length === 0 && (
            <p className="text-center text-gray-400 py-8">
              Nenhum comentário encontrado.
            </p>
          )}
        </div>
      </div>
    </div>
  );
} 