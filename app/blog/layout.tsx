import type { Metadata } from 'next';
import Script from "next/script";

export const metadata: Metadata = {
  title: 'Blog VOLTRIS - Dicas e Tutoriais sobre Tecnologia',
  description: 'Confira as últimas novidades, dicas e tutoriais sobre tecnologia, otimização de computadores, segurança digital e muito mais.',
  keywords: 'tecnologia, windows, otimização, computador, segurança digital, manutenção, tutoriais',
  openGraph: {
    title: 'Blog VOLTRIS - Dicas e Tutoriais sobre Tecnologia',
    description: 'Confira as últimas novidades, dicas e tutoriais sobre tecnologia, otimização de computadores, segurança digital e muito mais.',
    url: 'https://voltris.com.br/blog',
    siteName: 'VOLTRIS',
    images: [
      {
        url: '/images/blog-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Blog VOLTRIS',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog VOLTRIS - Dicas e Tutoriais sobre Tecnologia',
    description: 'Confira as últimas novidades, dicas e tutoriais sobre tecnologia, otimização de computadores, segurança digital e muito mais.',
    images: ['/images/blog-og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://voltris.com.br/blog',
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9217408182316735"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      {children}
    </>
  );
} 