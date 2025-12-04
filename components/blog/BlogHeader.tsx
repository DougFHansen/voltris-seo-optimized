import Link from 'next/link';
import { Post } from '@/types/blog';
import Image from 'next/image';

interface BlogHeaderProps {
  posts: Post[];
}

export default function BlogHeader({ posts }: BlogHeaderProps) {
  return (
    <header className="fixed w-full top-0 left-0 z-50 transition-all duration-300 ease-in-out backdrop-blur-md bg-[#171313]/80 border-b border-[#FF4B6B]/10">
      <nav className="container mx-auto px-2 py-2">
        <div className="flex flex-wrap items-center max-w-7xl mx-auto">
          {/* Left Side - Logo */}
          <div className="w-1/2 sm:w-1/4 flex-shrink-0 pl-2 sm:pl-8 mb-2 sm:mb-0">
            <Link href="/" className="logo group">
              <Image 
                src="/logo.png" 
                alt="logo" 
                width={90} 
                height={90} 
                className="h-9 sm:h-12 w-auto block transition-transform duration-500 group-hover:rotate-180" 
                priority
              />
            </Link>
          </div>

          {/* Center - Navigation Links */}
          <div className="w-full sm:w-2/4 flex justify-center order-3 sm:order-none mb-2 sm:mb-0">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:space-x-4">
              <Link
                href="/blog"
                className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] relative group text-base sm:text-lg"
              >
                Todos os Posts
                <span className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] w-full"></span>
              </Link>
              {Array.from(new Set(posts.map((post) => post.category))).map((cat) => (
                <Link
                  key={String(cat)}
                  href={`/blog/category/${String(cat)
                    .toLowerCase()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .trim()
                  }`}
                  className="text-white text-base sm:text-lg hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] transition-all duration-300 relative group"
                >
                  {String(cat)}
                  <span className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] transition-all duration-300 w-0 group-hover:w-full"></span>
                </Link>
              ))}
            </div>
          </div>

          {/* Right Side - Back to Site */}
          <div className="w-1/2 sm:w-1/4 flex justify-end items-center gap-2 sm:gap-4 pr-2 sm:pr-8">
            <Link
              href="/"
              className="flex items-center gap-2 px-2 sm:px-4 py-2 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-white rounded-lg hover:shadow-[0_0_20px_rgba(139,49,255,0.3)] transition-all duration-300 ease-out hover:scale-105 text-sm sm:text-base"
            >
              <i className="fas fa-arrow-left text-lg sm:text-xl"></i>
              <span className="hidden md:inline">Voltar ao Site</span>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
} 