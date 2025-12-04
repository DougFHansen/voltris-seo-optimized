'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Post } from '@/types/blog';

interface PostsCarouselProps {
  posts: Post[];
}

export default function PostsCarousel({ posts }: PostsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % posts.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [posts.length]);

  const currentPost = posts[currentIndex];

  return (
    <div className="relative h-[400px] md:h-[500px] rounded-xl overflow-hidden">
      <Image
        src={currentPost.coverImage}
        alt={currentPost.title}
        fill
        className="object-cover transition-opacity duration-500"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
      <div className="absolute bottom-0 left-0 p-8 md:p-12">
        <span className="px-3 py-1 bg-[#FF4B6B] text-white text-sm rounded-full mb-4 inline-block">
          {currentPost.category}
        </span>
        <Link href={`/blog/${currentPost.slug}`}>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#FF4B6B] hover:via-[#8B31FF] hover:to-[#31A8FF] transition-all duration-300">
            {currentPost.title}
          </h2>
        </Link>
        <p className="text-gray-300 text-lg mb-4 line-clamp-2">
          {currentPost.excerpt}
        </p>
        <div className="flex items-center text-gray-300 space-x-4">
          <span>{currentPost.author}</span>
          <span>•</span>
          <span>{new Date(currentPost.date).toLocaleDateString('pt-BR')}</span>
        </div>
      </div>
    </div>
  );
} 