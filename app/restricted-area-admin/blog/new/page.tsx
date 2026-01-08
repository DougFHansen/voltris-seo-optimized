'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiZap, FiImage } from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';
import Cropper from 'react-easy-crop';
import getCroppedImg from '@/utils/cropImage';

// Utilitário para converter dataURL em Blob
function dataURLtoBlob(dataurl: string) {
  const arr: string[] = dataurl.split(',');
  if (arr.length < 2) {
    throw new Error('dataURL inválido');
  }
  const mimeMatch = arr[0].match(/:(.*?);/);
  if (!mimeMatch) {
    throw new Error('Tipo MIME não encontrado no dataURL');
  }
  const mime = mimeMatch[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

export default function NewPost() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [aiCategory, setAiCategory] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    tags: '',
    cover_image: '',
  });
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [rawImage, setRawImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [createdAt, setCreatedAt] = useState('');

  useEffect(() => {
    if (fileName) {
      const filePath = `${fileName}`;
      const { error: uploadError } = supabase.storage
        .from('blog-images')
        .upload(filePath, blob);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);
      setFormData(prev => ({ ...prev, cover_image: publicUrl }));
    }
  }, [fileName]);

  useEffect(() => {
    setCreatedAt(new Date().toISOString());
  }, []);

  const onCropComplete = (_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setRawImage(reader.result as string);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropConfirm = async () => {
    console.log('Confirmar Recorte clicado');
    console.log('rawImage:', rawImage);
    console.log('croppedAreaPixels:', croppedAreaPixels);
    if (!rawImage || !croppedAreaPixels) {
      setError('Imagem ou área de recorte não definida.');
      return;
    }
    try {
      const croppedImage = await getCroppedImg(rawImage, croppedAreaPixels);
      setImagePreview(croppedImage);
      setShowCropper(false);
      setRawImage(null);
      // upload para o Supabase
      setLoading(true);
      const blob = dataURLtoBlob(croppedImage);
      const fileExt = 'png';
      setFileName(`${Math.random()}.${fileExt}`);
    } catch (err) {
      setError('Erro ao recortar imagem');
      console.error('Erro ao recortar imagem:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateWithAI = async () => {
    if (!aiTopic || !aiCategory) {
      setError('Por favor, preencha o tópico e a categoria para gerar com IA.');
      return;
    }

    setAiLoading(true);
    setError('');

    try {
      // Gerar conteúdo com Gemini
      const response = await fetch('/api/generate-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: aiTopic,
          category: aiCategory,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao gerar conteúdo');
      }

      const generatedContent = await response.json();

      // Buscar imagem relacionada
      console.log('Descrição enviada ao Unsplash:', generatedContent.image_description);
      const imageResponse = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: generatedContent.image_description, // corrigido para snake_case
        }),
      });

      let imageUrl = '';
      if (imageResponse.ok) {
        const imageData = await imageResponse.json();
        console.log('Resultado da API do Unsplash:', imageData);
        imageUrl = imageData.imageUrl;
      } else {
        setError('Não foi possível obter uma imagem do Unsplash para este post.');
      }

      // Preencher o formulário com o conteúdo gerado
      setFormData({
        title: generatedContent.title,
        excerpt: generatedContent.excerpt,
        content: generatedContent.content,
        category: aiCategory,
        tags: generatedContent.tags.join(', '),
        cover_image: imageUrl,
      });

      if (imageUrl) {
        setImagePreview(imageUrl);
      } else {
        setImagePreview(null);
      }

      setAiTopic('');
      setAiCategory('');
    } catch (error) {
      console.error('Erro ao gerar com IA:', error);
      setError(error instanceof Error ? error.message : 'Erro ao gerar conteúdo com IA.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.from('blog_posts').insert([
        {
          ...formData,
          tags: formData.tags.split(',').map(tag => tag.trim()),
          author: 'Equipe VOLTRIS',
          date: createdAt,
        },
      ]);

      if (error) throw error;
      router.push('/restricted-area-admin/blog');
    } catch (error) {
      console.error('Error creating post:', error);
      setError('Erro ao criar post. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#171313] py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF]">
            Novo Post
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

          {/* Seção de IA */}
          <div className="mb-8 p-6 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-xl border border-purple-500/20">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <FiZap className="text-yellow-400" />
              Gerar Post com IA
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tópico do Post
                </label>
                <input
                  type="text"
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  placeholder="Ex: Como proteger seu computador de vírus"
                  className="w-full px-4 py-2 bg-[#2A2A2A] rounded-lg border border-gray-700 focus:border-[#8B31FF] focus:outline-none text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Categoria
                </label>
                <select
                  value={aiCategory}
                  onChange={(e) => setAiCategory(e.target.value)}
                  className="w-full px-4 py-2 bg-[#2A2A2A] rounded-lg border border-gray-700 focus:border-[#8B31FF] focus:outline-none text-white"
                >
                  <option value="">Selecione uma categoria</option>
                  <option value="Games">Games</option>
                  <option value="Segurança">Segurança</option>
                  <option value="Tutoriais">Tutoriais</option>
                  <option value="Dicas">Dicas</option>
                  <option value="Informática">Informática</option>
                </select>
              </div>
            </div>
            <button
              type="button"
              onClick={generateWithAI}
              disabled={aiLoading}
              className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
            >
              {aiLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  Gerando...
                </>
              ) : (
                <>
                  <FiZap />
                  Gerar com IA
                </>
              )}
            </button>
          </div>

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
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
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
              {showCropper && rawImage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
                  <div className="bg-[#1E1E1E] p-6 rounded-xl shadow-xl flex flex-col items-center">
                    <div className="relative w-[90vw] max-w-xl h-[50vw] max-h-[400px]">
                      <Cropper
                        image={rawImage}
                        crop={crop}
                        zoom={zoom}
                        aspect={3/1}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                      />
                    </div>
                    <div className="w-full flex flex-col items-center mt-4">
                      {/* Slider removido/comentado pois não está importado ou definido */}
                      {/*
                      <Slider
                        min={1}
                        max={3}
                        step={0.1}
                        value={zoom}
                        onChange={(_: any, value: any) => setZoom(Number(value))}
                        className="w-64"
                      />
                      */}
                      <div className="flex gap-4 mt-4">
                        <button type="button" onClick={() => setShowCropper(false)} className="px-4 py-2 bg-gray-600 text-white rounded-lg">Cancelar</button>
                        <button type="button" onClick={handleCropConfirm} className="px-4 py-2 bg-gradient-to-r from-[#31A8FF] to-[#8B31FF] text-white rounded-lg">Confirmar Recorte</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {imagePreview && (
                <div className="mt-4 relative w-full h-64 rounded-lg overflow-hidden">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                  <p className="text-xs text-gray-400 mt-2">Prévia da imagem de capa ajustada</p>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? 'Criando...' : 'Criar Post'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
} 
