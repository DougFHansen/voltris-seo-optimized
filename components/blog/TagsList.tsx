'use client';

import Link from 'next/link';
import { Post } from '@/types/blog';
import SocialShare from './SocialShare';

interface TagsListProps {
  posts: Post[];
}

export default function TagsList({ posts }: TagsListProps) {
  // Extrair todas as tags únicas dos posts
  const allTags = Array.from(
    new Set(posts.flatMap(post => post.tags))
  ).sort();

  return (
    <div className="bg-[#1D1919] rounded-xl p-6 border border-[#8B31FF]/20">
      <h3 className="text-xl font-semibold text-white mb-4">Tags</h3>
      <div className="flex flex-wrap gap-2 mb-4">
        {allTags.map((tag) => (
          <Link
            key={tag}
            href={`/blog/tag/${tag.toLowerCase()}`}
            className="px-3 py-1 bg-[#171313] text-gray-300 text-sm rounded-full hover:bg-[#FF4B6B] hover:text-white transition-all duration-300"
          >
            {tag}
          </Link>
        ))}
      </div>
      <div className="pt-4 border-t border-gray-800 flex flex-col items-center">
        <h4 className="text-sm font-medium text-gray-400 mb-2 text-center">Compartilhe</h4>
        <div className="flex justify-center w-full">
          <SocialShare url={typeof window !== 'undefined' ? window.location.href : ''} title="Blog VOLTRIS" size={13} />
        </div>
      </div>
    </div>
  );
} 