'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';

interface Post {
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
}

export default function EditPost({ params }: { params: { id: string } }) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<Post>({
    id: '',
    title: '',
    excerpt: '',
    content: '',
    cover_image: '',
    category: '',
    tags: [],
    date: '',
    author: '',
    featured: false,
  });
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    fetchPost();
  }, [params.id]);

  useEffect(() => {
    if (fileName) {
      const filePath = `${fileName}`;
      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);
      setFormData(prev => ({ ...prev, cover_image: publicUrl }));
      setImagePreview(publicUrl);
    }
  }, [fileName]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) throw error;
      setFormData(data);
      setImagePreview(data.cover_image);
    } catch (error) {
      console.error('Error fetching post:', error);
      setError('Erro ao carregar post. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const fileExt = file.name.split('.').pop();
      setFileName(`${Math.random()}.${fileExt}`);

      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Erro ao fazer upload da imagem. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({
          title: formData.title,
          excerpt: formData.excerpt,
          content: formData.content,
          category: formData.category,
          tags: formData.tags,
          cover_image: formData.cover_image,
        })
        .eq('id', params.id);

      if (error) throw error;
      router.push('/restricted-area-admin/blog');
    } catch (error) {
      console.error('Error updating post:', error);
      setError('Erro ao atualizar post. Tente novamente.');
    } finally {
      setLoading(false);
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
            Editar Post
          </h1>
          <Link
            href="/restricted-area-admin/blog"
            className="px-4 py-2 bg-[#2A2A2A] text-white rounded-lg hover:bg-[#3A3A3A] transition-colors flex items-center gap-2"
          >
            <FiArrowLeft />
            Voltar
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1E1E1E] rounded-xl p-8 border border-gray-800"
        >
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Título
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-2 bg-[#2A2A2A] rounded-lg border border-gray-700 focus:border-[#8B31FF] focus:outline-none text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Subtítulo
              </label>
              <input
                type="text"
                value={formData.excerpt}
                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                className="w-full px-4 py-2 bg-[#2A2A2A] rounded-lg border border-gray-700 focus:border-[#8B31FF] focus:outline-none text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Conteúdo
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                className="w-full px-4 py-2 bg-[#2A2A2A] rounded-lg border border-gray-700 focus:border-[#8B31FF] focus:outline-none text-white min-h-[200px]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Categoria
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-2 bg-[#2A2A2A] rounded-lg border border-gray-700 focus:border-[#8B31FF] focus:outline-none text-white"
                required
              >
                <option value="">Selecione uma categoria</option>
                <option value="Games">Games</option>
                <option value="Segurança">Segurança</option>
                <option value="Tutoriais">Tutoriais</option>
                <option value="Dicas">Dicas</option>
                <option value="Informática">Informática</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tags (separadas por vírgula)
              </label>
              <input
                type="text"
                value={formData.tags.join(', ')}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value.split(',').map(tag => tag.trim()) }))}
                className="w-full px-4 py-2 bg-[#2A2A2A] rounded-lg border border-gray-700 focus:border-[#8B31FF] focus:outline-none text-white"
                placeholder="Ex: tecnologia, programação, web"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Imagem de Capa
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full px-4 py-2 bg-[#2A2A2A] rounded-lg border border-gray-700 focus:border-[#8B31FF] focus:outline-none text-white"
              />
              {imagePreview && (
                <div className="mt-4 relative w-full h-64 rounded-lg overflow-hidden">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
} 