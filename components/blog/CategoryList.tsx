'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SocialShare from './SocialShare';

interface CategoryListProps {
  posts: Array<{
    category: string;
    slug: string;
  }>;
}

export default function CategoryList({ posts }: CategoryListProps) {
  const pathname = usePathname();
  
  // Obter categorias únicas e contar posts por categoria
  const categoryCounts = posts.reduce((acc, post) => {
    const category = post.category;
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categories = Object.keys(categoryCounts);
  
  // Função para normalizar a categoria
  const normalizeCategory = (category: string) => {
    return category
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  };

  return (
    <div className="bg-[#1D1919] rounded-xl p-6 border border-[#8B31FF]/20">
      <h3 className="text-xl font-semibold text-white mb-4">Categorias</h3>
      <ul className="space-y-2 mb-4">
        <li>
          <Link
            href="/blog"
            className={`flex items-center justify-between px-4 py-2 rounded-lg transition-all duration-300 ${
              pathname === '/blog'
                ? 'bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-white'
                : 'text-gray-400 hover:text-white hover:bg-[#2A2525]'
            }`}
          >
            <span>Todos os Posts</span>
            <span className="text-sm text-gray-500 group-hover:text-[#FF4B6B]">
              {posts.length}
            </span>
          </Link>
        </li>
        {categories.map((category) => (
          <li key={category}>
            <Link
              href={`/blog/category/${normalizeCategory(category)}`}
              className={`flex items-center justify-between px-4 py-2 rounded-lg transition-all duration-300 ${
                pathname === `/blog/category/${normalizeCategory(category)}`
                  ? 'bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-white'
                  : 'text-gray-400 hover:text-white hover:bg-[#2A2525]'
              }`}
            >
              <span>{category}</span>
              <span className="text-sm text-gray-500 group-hover:text-[#FF4B6B]">
                {categoryCounts[category]}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="pt-4 border-t border-gray-800 flex flex-col items-center">
        <h4 className="text-sm font-medium text-gray-400 mb-2 text-center">Compartilhe</h4>
        <div className="flex justify-center w-full">
          <SocialShare url={typeof window !== 'undefined' ? window.location.href : ''} title="Blog VOLTRIS" size={13} />
        </div>
      </div>
    </div>
  );
} 