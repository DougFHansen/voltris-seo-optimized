'use client';

import { useEffect, useState } from 'react';
import PostCard from '@/components/blog/PostCard';
import PostsCarousel from '@/components/blog/PostsCarousel';
import CategoryList from '@/components/blog/CategoryList';
import NewsletterSignup from '@/components/blog/NewsletterSignup';
import TagsList from '@/components/blog/TagsList';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { posts as staticPosts } from '@/data/blog/posts';
import { Post } from '@/types/blog';
import { createClient } from '@/utils/supabase/client';
import BlogHeader from '@/components/blog/BlogHeader';
import AdSenseBanner from '../components/AdSenseBanner';

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const supabase = createClient();

  useEffect(() => {
    const fetchDbPosts = async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('date', { ascending: false });
      let dbPosts: Post[] = [];
      if (data) {
        dbPosts = data.map((post: any) => ({
          ...post,
          slug: post.slug || post.id || '',
          description: post.description || post.excerpt || '',
          content: post.content || '',
          coverImage: post.cover_image || post.coverImage || '',
          excerpt: post.excerpt || '',
          category: post.category || '',
          tags: post.tags || [],
          author: post.author || '',
          featured: !!post.featured,
          date: post.date || '',
          subtitle: post.subtitle || '',
        }));
      }
      setPosts([...dbPosts, ...staticPosts]);
      setLoading(false);
    };
    fetchDbPosts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#171313] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8B31FF]"></div>
      </div>
    );
  }

  // Filtro de busca
  const filteredPosts = posts.filter((post: Post) => {
    const q = search.toLowerCase();
    return (
      post.title.toLowerCase().includes(q) ||
      (post.description && post.description.toLowerCase().includes(q)) ||
      (post.content && post.content.toLowerCase().includes(q))
    );
  });

  return (
    <>
      <main className="bg-[#171313] min-h-screen">
        {/* Header */}
        <BlogHeader posts={posts} />

        {/* Espaçamento para compensar o header fixo */}
        <div className="h-36 sm:h-24"></div>

        {/* Campo de Busca no topo (apenas mobile/tablet, fora do grid) */}
        <div className="block lg:hidden w-full max-w-2xl mx-auto px-2 sm:px-4 mt-2 mb-4">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar posts..."
            className="w-full px-4 py-3 rounded-lg bg-[#1E1E1E] border border-[#8B31FF]/30 text-white focus:outline-none focus:border-[#8B31FF] transition-all"
            aria-label="Buscar posts..."
          />
        </div>

        {/* Featured Posts Carousel */}
        <div className="py-8 bg-[#171313]">
          <div className="container mx-auto px-4">
            <PostsCarousel posts={posts.filter(post => post.featured)} />
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Posts Grid */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 auto-rows-fr">
                {filteredPosts.map((post, idx) => (
                  <PostCard key={post.slug + '-' + idx} post={post} />
                ))}
                {filteredPosts.length === 0 && (
                  <div className="col-span-full text-center text-gray-400 py-12">
                    Nenhum post encontrado.
                  </div>
                )}
              </div>

              {/* Sidebar (categorias, newsletter, tags) abaixo dos posts em mobile/tablet */}
              <div className="block lg:hidden space-y-6 sm:space-y-8 mt-8">
                <CategoryList posts={posts} />
                <NewsletterSignup />
                <TagsList posts={posts} />
              </div>
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
              </div>
              <CategoryList posts={posts} />
              <NewsletterSignup />
              <TagsList posts={posts} />
            </div>
          </div>
        </div>
      </main>
      <AdSenseBanner />
      <Footer />
    </>
  );
} 