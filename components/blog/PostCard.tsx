'use client';

import { Post } from '@/types/blog';
import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from '@/utils/formatDate';
import { useState } from 'react';
import { 
  FaTwitter, 
  FaFacebook, 
  FaLinkedin, 
  FaLink, 
  FaWhatsapp, 
  FaPinterest,
  FaTelegram,
  FaReddit,
  FaTumblr
} from 'react-icons/fa';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const [copied, setCopied] = useState(false);
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://voltris.com.br';
  const postUrl = `${baseUrl}/blog/${post.slug}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erro ao copiar link:', err);
    }
  };

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(post.title)}`,
    facebook: `https://www.facebook.com/sharer.php?u=${encodeURIComponent(postUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${post.title} ${postUrl}`)}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(postUrl)}&media=${encodeURIComponent(post.coverImage)}&description=${encodeURIComponent(post.title)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(post.title)}`,
    reddit: `https://reddit.com/submit?url=${encodeURIComponent(postUrl)}&title=${encodeURIComponent(post.title)}`,
    tumblr: `https://www.tumblr.com/widgets/share/tool?canonicalUrl=${encodeURIComponent(postUrl)}&title=${encodeURIComponent(post.title)}&caption=${encodeURIComponent(post.excerpt)}`
  };

  return (
    <article className="bg-[#1D1919] rounded-xl overflow-hidden border border-[#8B31FF]/20 hover:border-[#FF4B6B]/30 transition-all duration-300 group flex flex-col h-full">
      <div className="flex-1">
        <Link href={`/blog/${post.slug}`} className="block">
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-4 left-4">
              <span className="px-3 py-1 bg-[#FF4B6B] text-white text-sm rounded-full">
                {post.category}
              </span>
            </div>
          </div>
          <div className="p-6 flex flex-col justify-between lg:h-44">
            <h2 className="text-xl font-semibold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] transition-all duration-300 line-clamp-2">
              {post.title}
            </h2>
            <div className="flex items-center justify-between text-sm text-gray-500 h-6">
              <span className="truncate max-w-[45%]">{post.author}</span>
              <span className="truncate max-w-[45%]">{formatDate(post.date)}</span>
            </div>
          </div>
        </Link>
        <div className="flex flex-wrap lg:flex-nowrap items-center gap-1 px-4 pb-4 pt-2">
          <a
            href={shareLinks.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-gray-400 hover:text-[#1DA1F2] transition-colors"
            title="Compartilhar no Twitter"
            aria-label="Compartilhar no Twitter"
          >
            <FaTwitter />
          </a>
          <a
            href={shareLinks.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-gray-400 hover:text-[#4267B2] transition-colors"
            title="Compartilhar no Facebook"
            aria-label="Compartilhar no Facebook"
          >
            <FaFacebook />
          </a>
          <a
            href={shareLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-gray-400 hover:text-[#0077B5] transition-colors"
            title="Compartilhar no LinkedIn"
            aria-label="Compartilhar no LinkedIn"
          >
            <FaLinkedin />
          </a>
          <a
            href={shareLinks.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-gray-400 hover:text-[#25D366] transition-colors"
            title="Compartilhar no WhatsApp"
            aria-label="Compartilhar no WhatsApp"
          >
            <FaWhatsapp />
          </a>
          <a
            href={shareLinks.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-gray-400 hover:text-[#0088cc] transition-colors"
            title="Compartilhar no Telegram"
            aria-label="Compartilhar no Telegram"
          >
            <FaTelegram />
          </a>
          <a
            href={shareLinks.reddit}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-gray-400 hover:text-[#FF4500] transition-colors"
            title="Compartilhar no Reddit"
            aria-label="Compartilhar no Reddit"
          >
            <FaReddit />
          </a>
          <a
            href={shareLinks.tumblr}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-gray-400 hover:text-[#36465D] transition-colors"
            title="Compartilhar no Tumblr"
            aria-label="Compartilhar no Tumblr"
          >
            <FaTumblr />
          </a>
          <a
            href={shareLinks.pinterest}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-gray-400 hover:text-[#E60023] transition-colors"
            title="Compartilhar no Pinterest"
            aria-label="Compartilhar no Pinterest"
          >
            <FaPinterest />
          </a>
          <button
            onClick={handleCopyLink}
            className="p-2 text-gray-400 hover:text-[#8B31FF] transition-colors relative"
            title="Copiar link"
            aria-label="Copiar link"
          >
            <FaLink />
            {copied && (
              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[#8B31FF] text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                Link copiado!
              </span>
            )}
          </button>
        </div>
      </div>
    </article>
  );
} 