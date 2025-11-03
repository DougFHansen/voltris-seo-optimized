'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FiSend, FiUser, FiMail, FiMessageSquare, FiCheck, FiAlertCircle, FiCornerUpLeft, FiX } from 'react-icons/fi';

interface Comment {
  id: string;
  name: string;
  email: string;
  comment: string;
  created_at: string;
  aprovado: boolean;
  parent_id?: string;
  replies?: Comment[];
  parent_name?: string;
}

interface CommentsProps {
  postSlug: string;
}

const supabase = createClient();

const CommentItem = ({ comment, onReply }: { comment: Comment; onReply: (parentId: string) => void }) => {
  const [isReplying, setIsReplying] = useState(false);

  return (
    <div className="mb-6">
      <div className="bg-[#1E1E1E] rounded-lg p-4 border border-[#8B31FF]/20">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h4 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF]">
              {comment.name}
            </h4>
            <p className="text-sm text-gray-400">
              {new Date(comment.created_at).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
            {comment.parent_id && comment.parent_name && (
              <div className="text-xs text-[#8B31FF] font-semibold mt-1">
                {comment.name} respondeu {comment.parent_name}
              </div>
            )}
          </div>
          <button
            onClick={() => {
              setIsReplying(!isReplying);
              onReply(comment.id);
            }}
            className="text-[#8B31FF] hover:text-[#FF4B6B] transition-colors duration-300 flex items-center"
          >
            <FiCornerUpLeft className="w-4 h-4 mr-1" />
            {isReplying ? 'Cancelar' : 'Responder'}
          </button>
        </div>
        <p className="text-gray-300 mb-4">{comment.comment}</p>
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-8 mt-4 space-y-4">
          {comment.replies.map((reply) => (
            <div key={reply.id} className="bg-[#1E1E1E]/50 rounded-lg p-4 border border-[#8B31FF]/10">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF]">
                    {reply.name}
                  </h4>
                  <p className="text-sm text-gray-400">
                    {new Date(reply.created_at).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsReplying(!isReplying);
                    onReply(reply.id);
                  }}
                  className="text-[#8B31FF] hover:text-[#FF4B6B] transition-colors duration-300 flex items-center"
                >
                  <FiCornerUpLeft className="w-4 h-4 mr-1" />
                  {isReplying ? 'Cancelar' : 'Responder'}
                </button>
              </div>
              <p className="text-gray-300">{reply.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

function buildCommentsTree(data: Comment[]): Comment[] {
  const commentsMap = new Map<string, Comment>();
  data.forEach(comment => {
    commentsMap.set(comment.id, { ...comment, replies: [] });
  });
  // Propaga parent_name recursivamente
  data.forEach(comment => {
    const commentWithReplies = commentsMap.get(comment.id)!;
    if (comment.parent_id) {
      const parent = commentsMap.get(comment.parent_id);
      if (parent) {
        commentWithReplies.parent_name = parent.name;
        parent.replies = parent.replies || [];
        parent.replies.push(commentWithReplies);
      }
    }
  });
  // Função recursiva para propagar parent_name para todos os níveis
  function propagateParentNames(comment: Comment, parentName?: string) {
    if (parentName) comment.parent_name = parentName;
    if (comment.replies && comment.replies.length > 0) {
      comment.replies.forEach(reply => propagateParentNames(reply, comment.name));
    }
  }
  const rootComments: Comment[] = [];
  commentsMap.forEach(c => {
    if (!c.parent_id) {
      propagateParentNames(c);
      rootComments.push(c);
    }
  });
  return rootComments;
}

export default function Comments({ postSlug }: CommentsProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');
  const [parentId, setParentId] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const queryClient = useQueryClient();

  const { data: comments, isLoading, error: queryError, refetch } = useQuery<Comment[]>({
    queryKey: ['comments', postSlug],
    queryFn: async () => {
      try {
        if (!postSlug) {
          console.warn('postSlug não fornecido');
          return [];
        }

        const { data, error } = await supabase
          .from('comments')
          .select('*')
          .eq('post_slug', postSlug)
          .eq('aprovado', true)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Erro ao buscar comentários:', error);
          throw new Error(error.message);
        }

        return buildCommentsTree(data || []);
      } catch (err) {
        console.error('Erro ao buscar comentários:', err);
        throw err;
      }
    },
    enabled: !!postSlug,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Atualização em tempo real
  useEffect(() => {
    if (!postSlug) return;

    const channel = supabase
      .channel('comments-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments',
          filter: `post_slug=eq.${postSlug}`
        },
        () => {
          refetch();
        }
      )
      .subscribe((status: 'SUBSCRIBED' | 'CLOSED' | 'CHANNEL_ERROR' | 'TIMED_OUT') => {
        if (status === 'SUBSCRIBED') {
          console.log('Inscrito no canal de comentários');
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [postSlug, refetch, supabase]);

  const submitComment = useMutation({
    mutationFn: async (commentData: { name: string; email: string; comment: string; parent_id?: string }) => {
      try {
        if (!postSlug) {
          throw new Error('postSlug não fornecido');
        }

        const { error } = await supabase.from('comments').insert([
          {
            post_slug: postSlug,
            name: commentData.name,
            email: commentData.email,
            comment: commentData.comment,
            parent_id: commentData.parent_id,
            aprovado: false,
          },
        ]);

        if (error) {
          throw new Error(error.message);
        }
      } catch (err) {
        console.error('Erro ao enviar comentário:', err);
        throw err;
      }
    },
    onSuccess: () => {
      setName('');
      setEmail('');
      setComment('');
      setParentId(undefined);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
      queryClient.invalidateQueries({ queryKey: ['comments', postSlug] });
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : 'Erro ao enviar comentário');
      setTimeout(() => setError(null), 5000);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await submitComment.mutateAsync({
        name,
        email,
        comment,
        parent_id: parentId
      });
    } catch (err) {
      console.error('Erro ao enviar comentário:', err);
      setError(err instanceof Error ? err.message : 'Erro ao enviar comentário');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = (id: string) => {
    setParentId(parentId === id ? undefined : id);
  };

  if (queryError) {
    return (
      <div className="bg-[#1E1E1E] rounded-lg p-6 border border-[#FF4B6B]/20">
        <div className="flex items-center justify-center text-[#FF4B6B] mb-4">
          <FiAlertCircle className="w-6 h-6 mr-2" />
          <h3 className="text-lg font-semibold">Erro ao carregar comentários</h3>
        </div>
        <p className="text-gray-400 text-center mb-4">
          Não foi possível carregar os comentários. Por favor, tente novamente mais tarde.
        </p>
        <button
          onClick={() => refetch()}
          className="w-full px-4 py-2 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-white rounded-lg hover:shadow-[0_0_20px_rgba(139,49,255,0.3)] transition-all duration-300"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#1E1E1E] rounded-lg p-6 border border-[#8B31FF]/20">
      <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF]">
        Comentários
      </h2>

      {/* Formulário de comentário */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">
              Nome
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg bg-[#171313] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8B31FF] focus:border-transparent"
                placeholder="Seu nome"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg bg-[#171313] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8B31FF] focus:border-transparent"
                placeholder="seu@email.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-400 mb-1">
              Comentário
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                <FiMessageSquare className="h-5 w-5 text-gray-500" />
              </div>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                rows={4}
                className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg bg-[#171313] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8B31FF] focus:border-transparent"
                placeholder="Seu comentário..."
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-500 flex items-center">
              <FiAlertCircle className="w-5 h-5 mr-2" />
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-green-500 flex items-center">
              <FiCheck className="w-5 h-5 mr-2" />
              Comentário enviado com sucesso! Aguarde a aprovação.
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full px-4 py-2 rounded-lg text-white flex items-center justify-center ${
              isSubmitting
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] hover:shadow-[0_0_20px_rgba(139,49,255,0.3)] transition-all duration-300'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                Enviando...
              </>
            ) : (
              <>
                <FiSend className="w-5 h-5 mr-2" />
                Enviar comentário
              </>
            )}
          </button>
        </div>
      </form>

      {/* Lista de comentários */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#8B31FF]"></div>
        </div>
      ) : comments && comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} onReply={handleReply} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400">
          <p>Nenhum comentário ainda. Seja o primeiro a comentar!</p>
        </div>
      )}
    </div>
  );
} 