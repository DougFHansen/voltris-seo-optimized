'use client';

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

interface SocialShareProps {
  url: string;
  title: string;
  size?: number;
}

export default function SocialShare({ url, title, size = 16 }: SocialShareProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erro ao copiar link:', err);
    }
  };

  const shareLinks = [
    {
      name: 'Twitter',
      icon: FaTwitter,
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      color: 'hover:text-[#1DA1F2]'
    },
    {
      name: 'Facebook',
      icon: FaFacebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      color: 'hover:text-[#4267B2]'
    },
    {
      name: 'LinkedIn',
      icon: FaLinkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      color: 'hover:text-[#0077B5]'
    },
    {
      name: 'WhatsApp',
      icon: FaWhatsapp,
      url: `https://wa.me/5511996716235?text=${encodeURIComponent(`${title} ${url}`)}`,
      color: 'hover:text-[#25D366]'
    },
    {
      name: 'Telegram',
      icon: FaTelegram,
      url: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      color: 'hover:text-[#0088cc]'
    },
    {
      name: 'Reddit',
      icon: FaReddit,
      url: `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
      color: 'hover:text-[#FF4500]'
    },
    {
      name: 'Tumblr',
      icon: FaTumblr,
      url: `https://www.tumblr.com/widgets/share/tool?canonicalUrl=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&caption=${encodeURIComponent(title)}`,
      color: 'hover:text-[#36465D]'
    },
    {
      name: 'Pinterest',
      icon: FaPinterest,
      url: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(title)}`,
      color: 'hover:text-[#E60023]'
    }
  ];

  return (
    <div className="flex flex-wrap items-center gap-1">
      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`p-1 text-gray-400 ${link.color} transition-colors`}
          title={`Compartilhar no ${link.name}`}
          aria-label={`Compartilhar no ${link.name}`}
        >
          <link.icon style={{ width: size, height: size }} />
        </a>
      ))}
      <button
        onClick={handleCopyLink}
        className="p-1 text-gray-400 hover:text-[#8B31FF] transition-colors relative"
        title="Copiar link"
        aria-label="Copiar link"
      >
        <FaLink style={{ width: size, height: size }} />
        {copied && (
          <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[#8B31FF] text-white text-xs px-2 py-1 rounded whitespace-nowrap">
            Link copiado!
          </span>
        )}
      </button>
    </div>
  );
} 