'use client';

import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCards, Pagination, Navigation } from 'swiper/modules';
import Link from 'next/link';
import Image from 'next/image';
import { posts as allPosts } from '@/data/blog/posts';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-cards';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  readTime: string;
}

const samplePosts: BlogPost[] = [
  {
    id: 1,
    title: "Como Otimizar seu Windows para Melhor Desempenho",
    excerpt: "Dicas práticas para aumentar a velocidade e eficiência do seu sistema operacional Windows.",
    image: "/blog/windows-optimization.jpg",
    category: "Otimização",
    date: "2024-03-15",
    readTime: "5 min"
  },
  {
    id: 2,
    title: "Guia de Segurança Digital para 2024",
    excerpt: "Proteja seus dados e sua privacidade com as melhores práticas de segurança digital.",
    image: "/blog/security-guide.jpg",
    category: "Segurança",
    date: "2024-03-10",
    readTime: "7 min"
  },
  {
    id: 3,
    title: "Novidades em Tecnologia para Empresas",
    excerpt: "Descubra as últimas tendências em tecnologia que estão transformando o ambiente empresarial.",
    image: "/blog/tech-news.jpg",
    category: "Notícias Tech",
    date: "2024-03-05",
    readTime: "4 min"
  }
];

export default function HomeBlogSection() {
  // Filtra posts do GTA 6 com foto
  const gta6Posts = allPosts.filter(
    post =>
      (post.category?.toLowerCase().includes('gta 6') ||
        post.tags?.some(tag => tag.toLowerCase().includes('gta 6')))
      && post.coverImage && post.coverImage !== ''
  );

  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;

  return (
    <section className="py-12 bg-gradient-to-br from-[#1c1c1e]/60 to-[#2a2a2e]/60 relative overflow-hidden">
      {/* Reflexos coloridos */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FF4B6B] opacity-20 rounded-full filter blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#8B31FF] opacity-20 rounded-full filter blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-[#31A8FF] opacity-20 rounded-full filter blur-[100px] pointer-events-none"></div>
      {/* Overlay escuro */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 pointer-events-none"></div>
      
      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 relative inline-block">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF]">
              BLOG VOLTRIS
            </span>
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-[#FF4B6B] to-[#31A8FF]"></div>
          </h2>
          <p className="text-[#e2e8f0] text-lg md:text-xl max-w-3xl mx-auto mt-8">
            Fique por dentro das últimas novidades e dicas sobre tecnologia
          </p>
        </div>

        {/* Blog Posts Slider */}
        <div className="max-w-7xl mx-auto">
          <Swiper
            effect={'cards'}
            grabCursor={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            navigation={!isMobile}
            modules={[Autoplay, EffectCards, Pagination, Navigation]}
            className="blog-cards-swiper"
          >
            {gta6Posts.map((post) => (
              <SwiperSlide key={post.slug}>
                <div className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-300 hover:scale-[1.02] group h-full flex flex-col justify-between">
                  <div className="flex flex-row h-full">
                    <div className="relative w-1/2 h-auto">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover transform transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                        placeholder="blur"
                        blurDataURL="/logo.png"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#171313] via-transparent opacity-60" />
                    </div>
                    <div className="w-1/2 p-10 flex flex-col justify-between relative h-full">
                      <div>
                        <div className="flex items-center gap-4 mb-4">
                          <span className="px-4 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-[#FF4B6B] to-[#8B31FF] text-white">
                            {post.category}
                          </span>
                          <span className="text-[#a0aec0] text-sm">{('readTime' in post && post.readTime) ? post.readTime + ' de leitura' : ''}</span>
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-4 line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#FF4B6B] group-hover:to-[#31A8FF] transition-all duration-300">
                          {post.title}
                        </h3>
                        <p className="text-[#e2e8f0] mb-6 line-clamp-3">
                          {post.excerpt}
                        </p>
                      </div>
                      <div className="absolute bottom-2 right-10 w-auto flex items-center justify-end">
                        <Link 
                          href={`/blog/${post.slug}`}
                          className="text-white font-medium hover:text-[#FF4B6B] transition-colors duration-300"
                          style={{whiteSpace: 'nowrap'}}
                        >
                          Ler mais →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <Link 
            href="/blog"
            className="inline-flex items-center px-6 py-2 rounded-lg bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-white font-semibold hover:shadow-[0_0_20px_rgba(139,49,255,0.3)] transition-all duration-300 ease-out hover:scale-105 gap-2 group"
          >
            <span>Explorar Blog</span>
            <svg 
              className="w-5 h-5 transform transition-transform group-hover:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M13 7l5 5m0 0l-5 5m5-5H6" 
              />
            </svg>
          </Link>
        </div>
      </div>

      <style jsx global>{`
        .blog-cards-swiper {
          padding: 20px 0 60px !important;
        }
        .blog-cards-swiper .swiper-pagination-bullet {
          background: #8B31FF;
        }
        .blog-cards-swiper .swiper-pagination-bullet-active {
          background: #FF4B6B;
        }
        .blog-cards-swiper .swiper-button-next,
        .blog-cards-swiper .swiper-button-prev {
          color: #FF4B6B;
        }
        .blog-cards-swiper .swiper-button-next:hover,
        .blog-cards-swiper .swiper-button-prev:hover {
          color: #8B31FF;
        }
        @media (max-width: 767px) {
          .blog-cards-swiper .swiper-button-next,
          .blog-cards-swiper .swiper-button-prev {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
} 