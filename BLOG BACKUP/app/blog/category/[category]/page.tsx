'use client';

import { useEffect, useState, use } from 'react';
import { createClient } from '@/utils/supabase/client';
import { notFound } from 'next/navigation';
import PostCard from '@/components/blog/PostCard';
import PostsCarousel from '@/components/blog/PostsCarousel';
import CategoryList from '@/components/blog/CategoryList';
import NewsletterSignup from '@/components/blog/NewsletterSignup';
import TagsList from '@/components/blog/TagsList';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { posts as staticPosts } from '@/data/blog/posts';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface CategoryPageProps {
  params: Promise<{ category: string }>;
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
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { category } = use(params) as { category: string };
  const router = useRouter();
  const [dbPosts, setDbPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .order('date', { ascending: false });

        if (error) throw error;
        
        // Transformar os dados para corresponder à interface Post
        const transformedPosts = (data || []).map((post: any) => ({
          ...post,
          description: post.excerpt,
          coverImage: post.cover_image,
          content: post.content || post.excerpt, // Usar excerpt como fallback se content não existir
          slug: post.id // Usando o ID como slug temporariamente
        }));
        
        setDbPosts(transformedPosts);
        setLoading(false);
      } catch (err) {
        console.error('Erro ao buscar posts:', err);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#171313] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8B31FF]"></div>
      </div>
    );
  }

  // Função para normalizar a categoria
  const normalizeCategory = (category: string) => {
    return category
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  };

  // Redireciona se a categoria da URL não estiver normalizada
  if (category !== normalizeCategory(category)) {
    if (typeof window !== 'undefined') {
      router.replace(`/blog/category/${normalizeCategory(category)}`);
      return null;
    }
  }

  // Normaliza a categoria da URL
  const normalizedCategory = normalizeCategory(category);

  // Combina os posts estáticos com os posts do banco de dados
  const allPosts = [...staticPosts, ...dbPosts];

  // Filtra os posts da categoria
  console.log('Categorias dos posts:', allPosts.map(post => normalizeCategory(post.category)));
  console.log('Categoria da URL:', normalizedCategory);
  const categoryPosts = allPosts.filter(post => {
    const normalizedPostCategory = normalizeCategory(post.category);
    return normalizedPostCategory === normalizedCategory;
  });

  // Obtém a categoria original para exibição
  const categoryName = categoryPosts[0]?.category || category.charAt(0).toUpperCase() + category.slice(1);
  const categories = Array.from(new Set(allPosts.map(post => post.category)));

  if (categoryPosts.length === 0) {
    notFound();
  }

  // Busca de posts na categoria
  const filteredCategoryPosts = categoryPosts.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q)) ||
      (p.content && p.content.toLowerCase().includes(q))
    );
  });

  return (
    <>
      <main className="bg-[#171313] min-h-screen">
        {/* Nav de Categorias */}
        <header className="fixed w-full top-0 left-0 z-50 transition-all duration-300 ease-in-out backdrop-blur-md bg-[#171313]/80 border-b border-[#FF4B6B]/10">
          <nav className="container mx-auto px-2 py-2">
            <div className="flex items-center max-w-7xl mx-auto">
              {/* Left Side - Logo */}
              <div className="w-1/4 flex-shrink-0 pl-8">
                <Link href="/" className="logo">
                  <Image src="/logo.png" alt="logo" width={137} height={48} className="h-14 w-auto block" />
                </Link>
              </div>

              {/* Center - Navigation Links */}
              <div className="w-2/4 flex justify-center">
                <div className="hidden md:flex items-center justify-center space-x-4">
                  <Link
                    href="/blog"
                    className={`text-white hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] transition-all duration-300 relative group`}
                  >
                    Todos os Posts
                    <span className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] transition-all duration-300 w-0 group-hover:w-full"></span>
                  </Link>
                  {categories.map((cat) => (
                    <Link
                      key={cat}
                      href={`/blog/category/${normalizeCategory(cat)}`}
                      className={`text-white hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] transition-all duration-300 relative group ${
                        normalizeCategory(cat) === normalizedCategory ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF]' : ''
                      }`}
                    >
                      {cat}
                      <span className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] transition-all duration-300 ${
                        normalizeCategory(cat) === normalizedCategory ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}></span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Right Side - Back to Site */}
              <div className="w-1/4 flex justify-end items-center gap-4 pr-8">
                <Link
                  href="/"
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-white rounded-lg hover:shadow-[0_0_20px_rgba(139,49,255,0.3)] transition-all duration-300 ease-out hover:scale-105"
                >
                  <i className="fas fa-arrow-left text-xl"></i>
                  <span className="hidden md:inline">Voltar ao Site</span>
                </Link>
              </div>
            </div>
          </nav>
        </header>

        {/* Espaçamento para compensar o header fixo */}
        <div className="h-20"></div>

        {/* Posts Carousel */}
        <div className="py-8 bg-[#171313]">
          <div className="container mx-auto px-4">
            <PostsCarousel posts={categoryPosts} />
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 auto-rows-fr">
                {filteredCategoryPosts.map((post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
                {filteredCategoryPosts.length === 0 && (
                  <div className="col-span-full text-center text-gray-400 py-12">
                    Nenhum post encontrado.
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-8">
              <div>
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Buscar posts..."
                  className="w-full px-4 py-3 rounded-lg bg-[#1E1E1E] border border-[#8B31FF]/30 text-white focus:outline-none focus:border-[#8B31FF] transition-all mb-6"
                  aria-label="Buscar posts..."
                />
              </div>
              <CategoryList posts={allPosts} />
              <NewsletterSignup />
              <TagsList posts={allPosts} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
} 