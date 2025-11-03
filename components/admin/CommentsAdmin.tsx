'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase/client';
import { FiTrash2, FiMessageSquare, FiCornerUpLeft } from 'react-icons/fi';
import Link from 'next/link';

interface Comment {
  id: string;
  post_slug: string;
  name: string;
  email: string;
  comment: string;
  created_at: string;
  aprovado: boolean;
  parent_id?: string;
  parent_name?: string;
}

export default function CommentsAdmin() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [parentComment, setParentComment] = useState<Comment | null>(null);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      const map = new Map<string, Comment>();
      data.forEach((c: Comment) => map.set(c.id, c));
      const withParentName = data.map((c: Comment) => ({
        ...c,
        parent_name: c.parent_id ? map.get(c.parent_id)?.name : undefined,
      }));
      setComments(withParentName);
    } catch (err) {
      setError('Erro ao carregar comentários');
    } finally {
      setLoading(false);
    }
  };

  const fetchParentComment = async (parentId: string) => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('id', parentId)
        .single();

      if (error) throw error;
      setParentComment(data);
    } catch (error) {
      console.error('Erro ao buscar comentário pai:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este comentário?')) return;

    setError('');
    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setComments(comments.filter(c => c.id !== id));
    } catch (error) {
      console.error('Erro ao excluir comentário:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] mb-6">
        Gerenciar Comentários
      </h1>
      
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg p-4 mb-6">
          {error}
        </div>
      )}

      <div className="bg-[#1E1E1E] rounded-lg overflow-hidden border border-[#8B31FF]/20">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#8B31FF]/20">
            <thead className="bg-[#171313]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Comentário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Autor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Post
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#8B31FF]/20">
              {comments.map((comment) => (
                <tr key={comment.id} className="hover:bg-[#171313]/50">
                  <td className="px-6 py-4 whitespace-pre-wrap">
                    <div className="text-sm text-gray-300">
                      {comment.parent_id && comment.parent_name ? (
                        <div className="mb-2">
                          <span className="text-[#8B31FF] font-semibold">
                            {comment.name} respondeu {comment.parent_name}
                          </span>
                        </div>
                      ) : (
                        <div className="text-[#8B31FF] mb-1">
                          {comment.name} escreveu:
                        </div>
                      )}
                      <div className="text-gray-300">
                        {comment.comment}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-transparent bg-clip-text bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF]">
                      {comment.name}
                    </div>
                    <div className="text-sm text-gray-400">{comment.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <a
                      href={`/blog/${comment.post_slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#8B31FF] hover:text-[#FF4B6B] transition-colors duration-300 text-sm"
                    >
                      Ver post
                    </a>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {new Date(comment.created_at).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="text-red-400 hover:text-red-300"
                        title="Excluir comentário"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>
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