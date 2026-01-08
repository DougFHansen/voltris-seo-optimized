'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiEdit2, FiTrash2, FiPlus, FiMessageSquare } from 'react-icons/fi';
import Image from 'next/image';
import Link from 'next/link';
import CommentsAdmin from '@/components/admin/CommentsAdmin';

import Footer from '@/components/Footer';

type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string;
  category: string;
  tags: string[];
  date: string;
  author: string;
  featured: boolean;
};

export default function BlogAdmin() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState<Partial<BlogPost>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'novo' | 'comentarios'>('novo');
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    checkAdmin();
    fetchPosts();
  }, []);

  const checkAdmin = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        router.push('/login');
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();

      if (profileError || !profile?.is_admin) {
        router.push('/dashboard');
        return;
      }
    } catch (err) {
      console.error('Erro ao verificar admin:', err);
      setError('Erro ao carregar dados. Por favor, tente novamente.');
    }
  };

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        console.error('Erro ao buscar posts:', error);
        throw error;
      }
      console.log('Posts carregados:', data);
      setPosts(data || []);
      setLoading(false);
    } catch (err) {
      console.error('Erro ao buscar posts:', err);
      setError('Erro ao carregar posts. Por favor, tente novamente.');
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const [fileName, setFileName] = useState('');
      useEffect(() => {
        if (fileExt) setFileName(`${Math.random()}.${fileExt}`);
      }, [fileExt]);

      const filePath = `blog/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);

      setCurrentPost(prev => ({ ...prev, cover_image: publicUrl }));
      setImagePreview(publicUrl);
    } catch (err) {
      console.error('Erro ao fazer upload da imagem:', err);
      setError('Erro ao fazer upload da imagem. Por favor, tente novamente.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!currentPost.title || !currentPost.excerpt || !currentPost.content || !currentPost.category || !currentPost.cover_image) {
        setError('Por favor, preencha todos os campos obrigatórios.');
        return;
      }

      const postData = {
        title: currentPost.title,
        excerpt: currentPost.excerpt,
        content: currentPost.content,
        cover_image: currentPost.cover_image,
        category: currentPost.category,
        tags: currentPost.tags || [],
        author: 'Equipe VOLTRIS',
        date: new Date().toISOString(),
        featured: false
      };

      console.log('Dados do post a serem salvos:', postData);

      if (currentPost.id) {
        // Atualizar post existente
        const { data, error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', currentPost.id)
          .select();

        if (error) {
          console.error('Erro ao atualizar post:', error);
          throw new Error(error.message);
        }
        console.log('Post atualizado:', data);
      } else {
        // Criar novo post
        const { data, error } = await supabase
          .from('blog_posts')
          .insert([postData])
          .select();

        if (error) {
          console.error('Erro ao criar post:', error);
          throw new Error(error.message);
        }
        console.log('Post criado:', data);
      }

      setIsModalOpen(false);
      setCurrentPost({});
      setImagePreview(null);
      fetchPosts();
    } catch (err) {
      console.error('Erro ao salvar post:', err);
      setError(err instanceof Error ? err.message : 'Erro ao salvar post. Por favor, tente novamente.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este post?')) return;

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchPosts();
    } catch (err) {
      console.error('Erro ao excluir post:', err);
      setError('Erro ao excluir post. Por favor, tente novamente.');
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
    <>
      <div className="min-h-screen bg-[#171313] py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF]">
              Gerenciamento do Blog
            </h1>
            <div className="flex gap-4">
              <Link
                href="/restricted-area-admin/blog/comments"
                className="px-4 py-2 bg-[#2A2A2A] text-white rounded-lg hover:bg-[#3A3A3A] transition-colors flex items-center gap-2"
              >
                <FiMessageSquare />
                Comentários
              </Link>
              <Link
                href="/restricted-area-admin/blog/new"
                className="px-4 py-2 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <FiPlus />
                Novo Post
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#1E1E1E] rounded-xl overflow-hidden border border-gray-800"
              >
                <div className="relative h-48">
                  <Image
                    src={post.cover_image}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-white mb-2 line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {new Date(post.date).toLocaleDateString()}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => router.push(`/restricted-area-admin/blog/edit/${post.id}`)}
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
} 
