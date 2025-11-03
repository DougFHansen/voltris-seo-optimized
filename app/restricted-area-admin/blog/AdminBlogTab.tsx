import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { createClient } from '@/utils/supabase/client';
import { FiSearch, FiFilter, FiFileText, FiTrash2, FiEdit, FiPlus, FiEye, FiStar, FiCalendar, FiMessageSquare, FiCheck, FiZap } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import ConfirmModal from '@/components/ConfirmModal';
import NewPost from './new/page';

interface BlogPost {
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
  created_at: string;
}

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

export default function AdminBlogTab() {
  const supabaseUrl = 'https://zamjyyzockbbugjepkhk.supabase.co';
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'blog' | 'comments' | 'ia'>('blog');
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const supabase = createClient();
  const [form, setForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    tags: '',
    author: '',
    featured: false,
    cover_image: '',
    imageFile: null as File | null,
  });
  const [formLoading, setFormLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
  const [fileName, setFileName] = useState('');
  const [date, setDate] = useState('');

  // Função para buscar posts (deve ser visível para todo o componente)
  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('date', { ascending: false });
    if (error) {
      setPosts([]);
      setLoading(false);
      return;
    }
    setPosts(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    setDate(new Date().toISOString());
  }, []);

  useEffect(() => {
    if (activeSubTab === 'comments') {
      fetchComments();
    }
  }, [activeSubTab]);

  useEffect(() => {
    if (form.imageFile) {
      setFileName(`${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${form.imageFile.name.split('.').pop()}`);
    }
  }, [form.imageFile]);

  // Funções para gerenciar comentários
  const fetchComments = async () => {
    setCommentsLoading(true);
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Mapear comentários para incluir nome do comentário pai
      const map = new Map<string, Comment>();
      data.forEach((c: Comment) => map.set(c.id, c));
      const withParentName = data.map((c: Comment) => ({
        ...c,
        parent_name: c.parent_id ? map.get(c.parent_id)?.name : undefined,
      }));
      
      setComments(withParentName);
    } catch (error) {
      console.error('Erro ao carregar comentários:', error);
      toast.error('Erro ao carregar comentários');
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleApproveComment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('comments')
        .update({ aprovado: true })
        .eq('id', id);

      if (error) throw error;
      toast.success('Comentário aprovado com sucesso!');
      fetchComments();
    } catch (error) {
      console.error('Erro ao aprovar comentário:', error);
      toast.error('Erro ao aprovar comentário');
    }
  };

  const handleDeleteComment = async (id: string) => {
    setConfirmMessage('Tem certeza que deseja excluir este comentário?');
    setConfirmAction(() => async () => {
      try {
        const { error } = await supabase
          .from('comments')
          .delete()
          .eq('id', id);

        if (error) throw error;
        toast.success('Comentário excluído com sucesso!');
        fetchComments();
      } catch (error) {
        console.error('Erro ao excluir comentário:', error);
        toast.error('Erro ao excluir comentário');
      }
      setShowConfirm(false);
    });
    setShowConfirm(true);
  };

  const handleDeletePost = async (postId: string) => {
    setConfirmMessage('Tem certeza que deseja remover este post?');
    setConfirmAction(() => async () => {
      try {
        const { error } = await supabase
          .from('blog_posts')
          .delete()
          .eq('id', postId);
        if (error) throw error;
        toast.success('Post removido com sucesso!');
        fetchPosts();
      } catch (error) {
        console.error('Erro ao remover post:', error);
        toast.error('Erro ao remover post');
      }
      setShowConfirm(false);
    });
    setShowConfirm(true);
  };

  const handleBulkDelete = async () => {
    if (selectedPosts.length === 0) {
      toast.error('Selecione pelo menos um post para remover');
      return;
    }
    setConfirmMessage(`Tem certeza que deseja remover ${selectedPosts.length} post(s)?`);
    setConfirmAction(() => async () => {
      try {
        const { error } = await supabase
          .from('blog_posts')
          .delete()
          .in('id', selectedPosts);
        if (error) throw error;
        toast.success(`${selectedPosts.length} post(s) removido(s) com sucesso!`);
        setSelectedPosts([]);
        fetchPosts();
      } catch (error) {
        console.error('Erro ao remover posts:', error);
        toast.error('Erro ao remover posts');
      }
      setShowConfirm(false);
    });
    setShowConfirm(true);
  };

  const handleToggleFeatured = async (postId: string, currentFeatured: boolean) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({ featured: !currentFeatured })
        .eq('id', postId);
      
      if (error) throw error;
      toast.success(`Post ${!currentFeatured ? 'destacado' : 'removido dos destaques'} com sucesso!`);
      fetchPosts();
    } catch (error) {
      console.error('Erro ao atualizar destaque:', error);
      toast.error('Erro ao atualizar destaque do post');
    }
  };

  const handleSelectAll = () => {
    if (selectedPosts.length === filteredPosts.length) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(filteredPosts.map(p => p.id));
    }
  };

  const handleSelectPost = (postId: string) => {
    setSelectedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setForm({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      tags: post.tags.join(', '),
      author: post.author,
      featured: post.featured,
      cover_image: post.cover_image,
      imageFile: null,
    });
    setShowEditModal(true);
  };

  const handleUpdatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;
    
    setFormLoading(true);
    try {
      // Validação básica
      if (!form.title || !form.excerpt || !form.content || !form.category || !form.author) {
        toast.error('Preencha todos os campos obrigatórios!');
        setFormLoading(false);
        return;
      }
      
      let coverImageUrl = form.cover_image;
      if (form.imageFile) {
        const uploadResult = await uploadImage(form.imageFile);
        console.log('Resultado do upload da imagem:', uploadResult);
        coverImageUrl = uploadResult;
      }
      
      const tagsArr = form.tags.split(',').map(t => t.trim()).filter(Boolean);
      const payload = {
        title: form.title,
        excerpt: form.excerpt,
        content: form.content,
        cover_image: coverImageUrl,
        category: form.category,
        tags: tagsArr,
        author: form.author,
        featured: form.featured,
      };
      
      console.log('Payload para atualização:', payload);
      const { data, error } = await supabase
        .from('blog_posts')
        .update(payload)
        .eq('id', editingPost.id)
        .select();
        
      console.log('Resposta da atualização:', { data, error });
      if (error) throw error;
      
      toast.success('Post atualizado com sucesso!');
      setShowEditModal(false);
      setEditingPost(null);
      setForm({ title: '', excerpt: '', content: '', category: '', tags: '', author: '', featured: false, cover_image: '', imageFile: null });
      fetchPosts();
    } catch (err: any) {
      toast.error('Erro ao atualizar post: ' + (err?.message || JSON.stringify(err)));
      console.error('Erro ao atualizar post:', err);
    } finally {
      setFormLoading(false);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesFilter = filter === 'all' || 
      (filter === 'featured' && post.featured) ||
      (filter === 'category' && post.category === filter);
    const matchesSearch = 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getCategoryColor = (category: string) => {
    const colors = {
      'tecnologia': 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      'Games': 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      'dicas': 'bg-green-500/10 text-green-400 border-green-500/30',
      'tutoriais': 'bg-orange-500/10 text-orange-400 border-orange-500/30',
      'noticias': 'bg-red-500/10 text-red-400 border-red-500/30',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500/10 text-gray-400 border-gray-500/30';
  };

  // Função para upload da imagem
  const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const { data, error } = await supabase.storage.from('blog-images').upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });
    if (error) throw error;
    
    // Retornar a URL pública da imagem
    const { data: { publicUrl } } = supabase.storage
      .from('blog-images')
      .getPublicUrl(data.path);
    
    return publicUrl;
  };

  // Função para criar post
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      // Validação básica
      if (!form.title || !form.excerpt || !form.content || !form.category || !form.author) {
        toast.error('Preencha todos os campos obrigatórios!');
        setFormLoading(false);
        return;
      }
      let coverImageUrl = form.cover_image;
      if (form.imageFile) {
        const uploadResult = await uploadImage(form.imageFile);
        console.log('Resultado do upload da imagem:', uploadResult);
        coverImageUrl = uploadResult;
      }
      const tagsArr = form.tags.split(',').map(t => t.trim()).filter(Boolean);
      const payload = {
        title: form.title,
        excerpt: form.excerpt,
        content: form.content,
        cover_image: coverImageUrl,
        category: form.category,
        tags: tagsArr,
        author: form.author,
        featured: form.featured,
        date: new Date().toISOString(),
      };
      console.log('Payload enviado para Supabase:', payload);
      const { data, error } = await supabase.from('blog_posts').insert([payload]).select();
      console.log('Resposta do insert:', { data, error });
      if (error) throw error;
      toast.success('Post criado com sucesso!');
      setShowCreateModal(false);
      setForm({ title: '', excerpt: '', content: '', category: '', tags: '', author: '', featured: false, cover_image: '', imageFile: null });
      fetchPosts();
    } catch (err: any) {
      toast.error('Erro ao criar post: ' + (err?.message || JSON.stringify(err)));
      console.error('Erro ao criar post:', err);
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-12 h-12 border-4 border-[#FF4B6B] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header otimizado */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative bg-gradient-to-br from-[#1E1E1E]/90 to-[#171313]/90 backdrop-blur-xl p-6 rounded-2xl border border-gray-800/30"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="w-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-3">
              <div className="bg-gradient-to-br from-[#FF4B6B] to-[#8B31FF] rounded-xl p-3 shadow-lg">
                <FiFileText className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-transparent bg-clip-text leading-tight">
                Gerenciar Blog
              </h1>
            </div>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed">Gerencie posts, comentários e conteúdo do blog</p>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Total: {posts.length} posts</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Sub-tabs otimizadas */}
      <div className="flex gap-2 border-b border-[#8B31FF]/20 pb-2">
        <button
          onClick={() => setActiveSubTab('blog')}
          className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-all duration-300 ${
            activeSubTab === 'blog'
              ? 'bg-gradient-to-r from-[#FF4B6B]/20 via-[#8B31FF]/20 to-[#31A8FF]/20 text-white'
              : 'text-gray-400 hover:text-white hover:bg-[#1E1E1E]/40'
          }`}
        >
          <FiFileText className="w-4 h-4" />
          Posts
        </button>
        <button
          onClick={() => setActiveSubTab('comments')}
          className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-all duration-300 ${
            activeSubTab === 'comments'
              ? 'bg-gradient-to-r from-[#FF4B6B]/20 via-[#8B31FF]/20 to-[#31A8FF]/20 text-white'
              : 'text-gray-400 hover:text-white hover:bg-[#1E1E1E]/40'
          }`}
        >
          <FiMessageSquare className="w-4 h-4" />
          Comentários
        </button>
        <button
          onClick={() => setActiveSubTab('ia')}
          className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-all duration-300 ${
            activeSubTab === 'ia'
              ? 'bg-gradient-to-r from-[#FF4B6B]/20 via-[#8B31FF]/20 to-[#31A8FF]/20 text-white'
              : 'text-gray-400 hover:text-white hover:bg-[#1E1E1E]/40'
          }`}
        >
          <FiZap className="w-4 h-4" />
          IA
        </button>
      </div>

      {/* Blog Content */}
      {activeSubTab === 'blog' && (
        <>
          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar por título, resumo, autor ou categoria..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 sm:py-3 bg-[#1E1E1E]/40 backdrop-blur-xl border border-gray-800/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#8B31FF] transition-colors duration-300 text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-[#1E1E1E]/40 backdrop-blur-xl border border-gray-800/30 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white focus:outline-none focus:border-[#8B31FF] transition-colors duration-300 text-sm min-w-[140px]"
              >
                <option value="all">Todos os Posts</option>
                <option value="featured">Destaques</option>
                <option value="tecnologia">Tecnologia</option>
                <option value="Games">Games</option>
                <option value="dicas">Dicas</option>
                <option value="tutoriais">Tutoriais</option>
                <option value="noticias">Notícias</option>
              </select>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 sm:py-3 bg-gradient-to-r from-[#31A8FF] to-[#8B31FF] text-white rounded-xl hover:opacity-90 transition-opacity duration-300 text-sm font-medium whitespace-nowrap"
            >
              <FiPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Novo Post</span>
              <span className="sm:hidden">Novo</span>
            </button>
          </div>

          {/* Bulk Actions */}
          {selectedPosts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#1E1E1E]/40 backdrop-blur-xl p-4 rounded-xl border border-[#8B31FF]/30"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <span className="text-white text-sm sm:text-base">
                  {selectedPosts.length} post(s) selecionado(s)
                </span>
                <button
                  onClick={handleBulkDelete}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300 text-sm font-medium"
                >
                  <FiTrash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Remover Selecionados</span>
                  <span className="sm:hidden">Remover</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* Posts List */}
          <div className="space-y-4">
            {filteredPosts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-500/10 flex items-center justify-center">
                  <FiFileText className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-400 text-lg">Nenhum post encontrado</p>
              </motion.div>
            ) : (
              <div className="bg-[#1E1E1E]/40 backdrop-blur-xl rounded-2xl border border-gray-800/30 overflow-hidden">
                <div className="p-4 border-b border-gray-800/30">
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={selectedPosts.length === filteredPosts.length && filteredPosts.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-[#8B31FF] bg-gray-800 border-gray-600 rounded focus:ring-[#8B31FF] focus:ring-2"
                    />
                    <span className="text-gray-300 font-medium text-sm sm:text-base">Selecionar Todos</span>
                  </div>
                </div>
                
                {filteredPosts.map((post) => {
                  const imageUrl = post.cover_image && post.cover_image.startsWith('http')
                    ? post.cover_image
                    : `${supabaseUrl}/storage/v1/object/public/blog-images/${post.cover_image}`;
                  return (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 sm:p-6 border-b border-gray-800/30 last:border-b-0 hover:bg-[#171313]/30 transition-colors duration-300"
                    >
                      <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
                        <div className="flex items-start gap-3 sm:gap-4 flex-1 w-full">
                          <input
                            type="checkbox"
                            checked={selectedPosts.includes(post.id)}
                            onChange={() => handleSelectPost(post.id)}
                            className="w-4 h-4 text-[#8B31FF] bg-gray-800 border-gray-600 rounded focus:ring-[#8B31FF] focus:ring-2 mt-1 flex-shrink-0"
                          />
                          
                          <div className="w-20 h-16 sm:w-24 sm:h-16 relative mr-3 sm:mr-4 flex-shrink-0">
                            <Image src={imageUrl} alt={post.title} fill className="object-cover rounded" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                              <h3 className="text-white font-semibold text-base sm:text-lg leading-tight">{post.title}</h3>
                              <div className="flex flex-wrap gap-2">
                                {post.featured && (
                                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 whitespace-nowrap">
                                    <FiStar className="w-3 h-3 inline mr-1" />
                                    Destaque
                                  </span>
                                )}
                                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(post.category)} whitespace-nowrap`}>
                                  {post.category}
                                </span>
                              </div>
                            </div>
                            
                            <p className="text-gray-400 text-sm mb-3 line-clamp-2" dangerouslySetInnerHTML={{ __html: post.content }} />
                            
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <FiCalendar className="w-3 h-3" />
                                {new Date(post.date).toLocaleDateString('pt-BR')}
                              </div>
                              <span>Por: {post.author}</span>
                              {post.tags && post.tags.length > 0 && (
                                <div className="flex items-center gap-1 flex-wrap">
                                  <span>Tags:</span>
                                  {post.tags.slice(0, 3).map((tag, index) => (
                                    <span key={index} className="px-1 py-0.5 bg-gray-700 rounded text-xs">
                                      {tag}
                                    </span>
                                  ))}
                                  {post.tags.length > 3 && (
                                    <span className="text-gray-400">+{post.tags.length - 3}</span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={() => handleToggleFeatured(post.id, post.featured)}
                            className={`p-2 rounded-lg transition-all duration-300 ${
                              post.featured 
                                ? 'text-yellow-400 hover:bg-yellow-500/10' 
                                : 'text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/10'
                            }`}
                            title={post.featured ? 'Remover destaque' : 'Destacar post'}
                          >
                            <FiStar className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditPost(post)}
                            className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all duration-300"
                            title="Editar post"
                          >
                            <FiEdit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-300"
                            title="Remover post"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {/* Comments Content */}
      {activeSubTab === 'comments' && (
        <div className="space-y-4 sm:space-y-6">
          {/* Comments Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden bg-gradient-to-br from-[#1E1E1E]/90 to-[#171313]/90 backdrop-blur-xl p-4 sm:p-6 rounded-2xl border border-gray-800/30"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6">
              <div className="w-full">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-3">
                  <div className="bg-gradient-to-br from-[#FF4B6B] to-[#8B31FF] rounded-xl p-2 sm:p-3 shadow-lg">
                    <FiMessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-transparent bg-clip-text leading-tight">
                    Comentários do Blog
                  </h2>
                </div>
                <p className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed">Gerencie comentários dos posts do blog</p>
              </div>
              <div className="flex items-center gap-4 text-xs sm:text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Total: {comments.length} comentários</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Comments List */}
          {commentsLoading ? (
            <div className="flex items-center justify-center min-h-[50vh]">
              <div className="w-12 h-12 border-4 border-[#FF4B6B] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : comments.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-500/10 flex items-center justify-center">
                <FiMessageSquare className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-400 text-lg">Nenhum comentário encontrado</p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#1E1E1E]/40 backdrop-blur-xl p-4 sm:p-6 rounded-xl border border-gray-800/30"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                    <div className="flex-1">
                      <h3 className="text-base sm:text-lg font-semibold text-white leading-tight">{comment.name}</h3>
                      <p className="text-sm text-gray-400">{comment.email}</p>
                      <a
                        href={`/blog/${comment.post_slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[#8B31FF] hover:text-[#7B21FF] transition-colors"
                      >
                        Ver post
                      </a>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      {!comment.aprovado && (
                        <button
                          onClick={() => handleApproveComment(comment.id)}
                          className="p-2 text-green-500 hover:bg-green-500/10 rounded-lg transition-colors"
                          title="Aprovar comentário"
                        >
                          <FiCheck className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Excluir comentário"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {comment.parent_id && comment.parent_name && (
                    <div className="mb-3 p-3 bg-[#171313]/50 rounded-lg border-l-4 border-[#8B31FF]">
                      <p className="text-sm text-[#8B31FF] font-medium">
                        Resposta para: {comment.parent_name}
                      </p>
                    </div>
                  )}
                  
                  <p className="text-gray-300 mb-4 leading-relaxed">{comment.comment}</p>
                  
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-sm text-gray-500">
                    <span>{new Date(comment.created_at).toLocaleString('pt-BR')}</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
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
            </div>
          )}
        </div>
      )}

      {/* Create/Edit Modal Placeholder */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#1E1E1E] rounded-2xl p-4 sm:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-start mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                {showCreateModal ? 'Criar Novo Post' : 'Editar Post'}
              </h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setShowEditModal(false);
                  setEditingPost(null);
                }}
                className="text-gray-400 hover:text-white transition-colors duration-300 p-1"
              >
                ✕
              </button>
            </div>
            <form onSubmit={showEditModal ? handleUpdatePost : handleCreatePost} className="space-y-4 text-left">
              <div>
                <label className="block text-gray-300 mb-1 text-sm sm:text-base">Título *</label>
                <input type="text" className="w-full bg-[#171313] border border-gray-700 rounded-lg px-3 sm:px-4 py-2 text-white text-sm" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-gray-300 mb-1 text-sm sm:text-base">Resumo *</label>
                <input type="text" className="w-full bg-[#171313] border border-gray-700 rounded-lg px-3 sm:px-4 py-2 text-white text-sm" value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-gray-300 mb-1 text-sm sm:text-base">Conteúdo *</label>
                <textarea className="w-full bg-[#171313] border border-gray-700 rounded-lg px-3 sm:px-4 py-2 text-white min-h-[120px] text-sm" value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} required />
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-gray-300 mb-1 text-sm sm:text-base">Categoria *</label>
                  <select className="w-full bg-[#171313] border border-gray-700 rounded-lg px-3 sm:px-4 py-2 text-white text-sm" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} required>
                    <option value="">Selecione</option>
                    <option value="Games">Games</option>
                    <option value="Segurança">Segurança</option>
                    <option value="Tutoriais">Tutoriais</option>
                    <option value="Dicas">Dicas</option>
                    <option value="Informática">Informática</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-gray-300 mb-1 text-sm sm:text-base">Tags (separadas por vírgula)</label>
                  <input type="text" className="w-full bg-[#171313] border border-gray-700 rounded-lg px-3 sm:px-4 py-2 text-white text-sm" value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="ex: tecnologia, inovação, IA" />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-gray-300 mb-1 text-sm sm:text-base">Autor *</label>
                  <input type="text" className="w-full bg-[#171313] border border-gray-700 rounded-lg px-3 sm:px-4 py-2 text-white text-sm" value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))} required />
                </div>
                <div className="flex-1">
                  <label className="block text-gray-300 mb-1 text-sm sm:text-base">Destaque</label>
                  <div className="flex items-center">
                    <input type="checkbox" className="mr-2" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} />
                    <span className="text-gray-400 text-sm">Marcar como destaque</span>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-gray-300 mb-1 text-sm sm:text-base">Imagem de Capa *</label>
                <input type="file" accept="image/*" ref={fileInputRef} onChange={e => setForm(f => ({ ...f, imageFile: e.target.files?.[0] || null }))} className="block w-full text-gray-400 text-sm" required={!form.cover_image} />
                {form.imageFile && <span className="text-gray-400 text-xs mt-1 block">{form.imageFile.name}</span>}
              </div>
              {form.imageFile && (
                <div className="mt-2">
                  <Image
                    src={URL.createObjectURL(form.imageFile)}
                    alt="Prévia da imagem"
                    width={320}
                    height={180}
                    className="w-full max-w-xs rounded shadow border border-gray-700"
                    style={{ maxHeight: 180, objectFit: 'cover' }}
                  />
                </div>
              )}
              {!form.imageFile && form.cover_image && (
                <div className="mt-2">
                  <Image
                    src={form.cover_image}
                    alt="Imagem atual"
                    width={320}
                    height={180}
                    className="w-full max-w-xs rounded shadow border border-gray-700"
                    style={{ maxHeight: 180, objectFit: 'cover' }}
                  />
                </div>
              )}
              <button type="submit" disabled={formLoading} className="w-full py-3 rounded-xl bg-gradient-to-r from-[#31A8FF] to-[#8B31FF] text-white font-bold text-base sm:text-lg mt-2 hover:opacity-90 transition-opacity duration-300 disabled:opacity-60">
                {formLoading ? (showEditModal ? 'Atualizando...' : 'Publicando...') : (showEditModal ? 'Atualizar Post' : 'Publicar Post')}
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Gerar com IA Content */}
      {activeSubTab === 'ia' && (
        <NewPost />
      )}

      {/* Modal de confirmação moderno */}
      <ConfirmModal
        open={showConfirm}
        message={confirmMessage}
        confirmText="Remover"
        cancelText="Cancelar"
        onConfirm={() => { if (confirmAction) confirmAction(); }}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
} 