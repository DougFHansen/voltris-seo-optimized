import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog e Guias Técnicos | Dicas de Formatação, Otimização e Manutenção - VOLTRIS',
  description: 'Artigos e guias técnicos sobre formatação de Windows, otimização de PC, assistência técnica e dicas de manutenção. Aprenda a deixar seu computador mais rápido e seguro.',
  keywords: [
    'blog técnico',
    'guias técnicos',
    'dicas de formatação',
    'tutorial otimização pc',
    'como otimizar windows',
    'manutenção computador',
    'formatação windows tutorial',
    'otimização jogos',
    'tutorial assistência técnica',
    'dicas tecnologia',
    'guia manutenção',
    'tutoriais pc'
  ],
  alternates: {
    canonical: 'https://voltris.com.br/cluster-conteudo'
  },
  openGraph: {
    title: 'Blog e Guias Técnicos | Dicas de Formatação, Otimização e Manutenção - VOLTRIS',
    description: 'Artigos e guias técnicos sobre formatação de Windows, otimização de PC, assistência técnica e dicas de manutenção. Aprenda a deixar seu computador mais rápido e seguro.',
    url: 'https://voltris.com.br/cluster-conteudo',
    type: 'website',
    images: [{
      url: '/tech-blog-cluster.jpg',
      width: 1200,
      height: 630,
      alt: 'Cluster de Conteúdo Técnico'
    }]
  }
};