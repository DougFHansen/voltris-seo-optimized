import Link from 'next/link';

export default function SkipLink() {
  return (
    <Link
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#8B31FF] focus:text-white focus:rounded focus:outline-none focus:ring-2 focus:ring-[#8B31FF] focus:ring-offset-2"
    >
      Pular para o conteúdo principal
    </Link>
  );
} 