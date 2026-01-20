'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { notFound } from 'next/navigation';
import PostCard from '@/components/blog/PostCard';
import PostsCarousel from '@/components/blog/PostsCarousel';
import CategoryList from '@/components/blog/CategoryList';
import TagsList from '@/components/blog/TagsList';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { posts as staticPosts } from '@/data/blog/posts';
import OptimizedImage from '@/components/blog/OptimizedImage';
import Breadcrumbs from '@/components/blog/Breadcrumbs';
import SocialShare from '@/components/blog/SocialShare';
import MetaTags from '@/components/blog/MetaTags';
import { use } from 'react';
import Comments from '@/components/blog/Comments';
import NewsletterSignup from '@/components/blog/NewsletterSignup';
import BlogHeader from '@/components/blog/BlogHeader';
import ReactMarkdown from 'react-markdown';

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

interface Post {
  id: string;
  title: string;
  excerpt: string;
  description: string;
  content: string;
  coverImage: string;
  cover_image: string;
  category: string;
  tags: string[];
  date: string;
  author: string;
  featured: boolean;
  slug: string;
  subtitle?: string;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 segundo

const supabase = createClient();

export default function PostPage({ params }: PostPageProps) {
  const resolvedParams = use(params);
  const [dbPosts, setDbPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingStaticPosts, setUsingStaticPosts] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let retryCount = 0;
    let timeoutId: NodeJS.Timeout;

    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Verificar se as variáveis de ambiente estão configuradas
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
          console.warn('Configuração do Supabase não encontrada. Usando posts estáticos.');
          setUsingStaticPosts(true);
          setLoading(false);
          return;
        }

        const { data, error: supabaseError } = await supabase
          .from('blog_posts')
          .select('*')
          .order('date', { ascending: false });

        if (supabaseError) {
          throw new Error(supabaseError.message);
        }
        
        if (!data) {
          setDbPosts([]);
          return;
        }

        // Transformar os dados para corresponder à interface Post
        const transformedPosts = data.map((post: any) => ({
          ...post,
          description: post.excerpt || '',
          coverImage: post.cover_image || '',
          content: post.content || post.excerpt || '',
          slug: post.slug || post.id,
          tags: post.tags || [],
          category: post.category || 'Sem categoria',
          author: post.author || 'Voltris',
          date: post.date || new Date().toISOString(),
          featured: post.featured || false
        }));
        
        setDbPosts(transformedPosts);
        setLoading(false);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao buscar posts';
        
        // Tentar novamente se for um erro de conexão e ainda não atingiu o limite de tentativas
        if (errorMessage.includes('Failed to fetch') && retryCount < MAX_RETRIES) {
          retryCount++;
          console.log(`Tentativa ${retryCount} de ${MAX_RETRIES}...`);
          
          // Esperar um tempo antes de tentar novamente
          timeoutId = setTimeout(() => {
            fetchPosts();
          }, RETRY_DELAY * retryCount);
          
          return;
        }

        // Se todas as tentativas falharem, usar posts estáticos
        console.warn('Não foi possível conectar ao Supabase. Usando posts estáticos.');
        setUsingStaticPosts(true);
        setError(null);
        setLoading(false);
      }
    };

    fetchPosts();

    // Limpar o timeout se o componente for desmontado
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#171313] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8B31FF] mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando posts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#171313] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="mb-6">
            <i className="fas fa-exclamation-circle text-4xl text-[#FF4B6B]"></i>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Erro ao carregar posts</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <div className="space-y-4">
            <Link 
              href="/"
              className="inline-block w-full px-6 py-3 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-white rounded-lg hover:shadow-[0_0_20px_rgba(139,49,255,0.3)] transition-all duration-300"
            >
              Voltar ao início
            </Link>
            <button 
              onClick={() => window.location.reload()}
              className="inline-block w-full px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all duration-300"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Combina os posts estáticos com os posts do banco de dados
  const allPosts = [...staticPosts, ...dbPosts];

  // Encontra o post atual
  const post = allPosts.find(p => p.slug === resolvedParams.slug);

  if (!post) {
    notFound();
  }

  // Encontra posts relacionados (mesma categoria)
  const relatedPosts = allPosts
    .filter(p => p.category === post.category && p.slug !== post.slug)
    .slice(0, 4);

  // Busca de posts
  const filteredPosts = allPosts.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q)) ||
      (p.content && p.content.toLowerCase().includes(q))
    );
  });

  return (
    <>
      <MetaTags
        title={post.title}
        description={post.excerpt}
        keywords={post.tags}
        image={post.coverImage}
        url={`/blog/${post.slug}`}
        type="article"
        author={post.author}
        date={post.date}
      />
      <main className="bg-[#171313] min-h-screen">
        {/* Header */}
        <BlogHeader posts={allPosts} />

        {/* Espaçamento para compensar o header fixo */}
        <div className="h-20"></div>

        {/* Breadcrumbs */}
        <div className="container mx-auto px-4">
          <Breadcrumbs />
        </div>

        {/* Post Content */}
        <article className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-[#1E1E1E] rounded-2xl p-8 border border-gray-800/50">
                <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF]">
                  {post.title}
                </h1>
                <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden">
                  <OptimizedImage
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
                {post.subtitle && (
                  <h2 className="text-xl font-semibold mb-2 text-[#8B31FF]">{post.subtitle}</h2>
                )}
                {(post.description || post.excerpt) && (
                  <div className="mb-6 text-gray-300 text-lg">
                    {(post.description || post.excerpt)
                      .split(/\n\n+/)
                      .map((paragraph: string, idx: number) => (
                        <p key={idx} className="mb-4">{paragraph}</p>
                      ))}
                  </div>
                )}
                <div className="flex items-center gap-4 text-gray-400 mb-8">
                  <span>{new Date(post.date).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{post.author}</span>
                  <span>•</span>
                  <Link
                    href={`/blog/category/${post.category
                      .toLowerCase()
                      .normalize('NFD')
                      .replace(/[\u0300-\u036f]/g, '')
                      .trim()
                    }`}
                    className="text-[#8B31FF] hover:text-[#7B21FF] transition-colors"
                  >
                    {post.category}
                  </Link>
                </div>
                <div className="prose prose-invert max-w-none">
                  {/* Renderização segura do HTML gerado pela IA */}
                  <div dangerouslySetInnerHTML={{ __html: post.content || '' }} />
                </div>

                {/* Social Share */}
                <div className="mt-8 pt-8 border-t border-gray-800">
                  <SocialShare
                    url={`https://voltris.com.br/blog/${post.slug}`}
                    title={post.title}
                  />
                </div>
              </div>

              {/* Comments Section */}
              <Comments postSlug={post.slug} />

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <div className="mt-12">
                  <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF]">
                    Posts Relacionados
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {relatedPosts.map((relatedPost) => (
                      <PostCard key={relatedPost.slug} post={relatedPost} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar à direita em desktop (com campo de busca no topo do sidebar) */}
            <div className="hidden lg:block space-y-6 sm:space-y-8 mt-8 lg:mt-0">
              <div>
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Buscar posts..."
                  className="w-full px-4 py-3 rounded-lg bg-[#1E1E1E] border border-[#8B31FF]/30 text-white focus:outline-none focus:border-[#8B31FF] transition-all"
                  aria-label="Buscar posts..."
                />
                {search && (
                  <div className="mt-4 space-y-4">
                    {filteredPosts.length > 0 ? (
                      filteredPosts.map((p) => (
                        <PostCard key={p.slug} post={p} />
                      ))
                    ) : (
                      <div className="text-gray-400 text-center">Nenhum post encontrado.</div>
                    )}
                  </div>
                )}
              </div>
              <CategoryList posts={allPosts} />
              <NewsletterSignup />
              <TagsList posts={allPosts} />
            </div>
            {/* Sidebar abaixo do conteúdo em mobile/tablet */}
            <div className="block lg:hidden space-y-6 sm:space-y-8 mt-8">
              <div>
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Buscar posts..."
                  className="w-full px-4 py-3 rounded-lg bg-[#1E1E1E] border border-[#8B31FF]/30 text-white focus:outline-none focus:border-[#8B31FF] transition-all"
                  aria-label="Buscar posts..."
                />
                {search && (
                  <div className="mt-4 space-y-4">
                    {filteredPosts.length > 0 ? (
                      filteredPosts.map((p) => (
                        <PostCard key={p.slug} post={p} />
                      ))
                    ) : (
                      <div className="text-gray-400 text-center">Nenhum post encontrado.</div>
                    )}
                  </div>
                )}
              </div>
              <CategoryList posts={allPosts} />
              <NewsletterSignup />
              <TagsList posts={allPosts} />
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
} 