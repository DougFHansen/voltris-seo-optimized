import { Metadata } from 'next';
import OptimizerClient from './OptimizerClient';

export const metadata: Metadata = {
  title: 'Voltris Optimizer | Software de Performance para Windows Enterprise e Gamers',
  description: 'A plataforma definitiva de otimização de sistemas. Aumente FPS em jogos, acelere processos corporativos e recupere a performance do seu PC. Tecnologia de ponta para Windows.',
  keywords: [
    // Cluster: Core / Otimização Geral
    'otimizar windows',
    'acelerar pc',
    'software de otimização',
    'limpeza de sistema',
    'pc lento soluções',
    'alternativa ccleaner',
    'melhor otimizador windows 11',
    'desempenho máximo pc',

    // Cluster: Gamers
    'aumentar fps',
    'reduzir input lag',
    'otimizador jogos',
    'game booster profissional',
    'fps boost windows',
    'reduzir ping jogos',
    'estabilidade frame time',

    // Cluster: Enterprise / B2B
    'otimização pc corporativo',
    'manutenção preventiva ti',
    'acelerar computador escritório',
    'produtividade windows',
    'pc travando empresa',
    'suporte ti remoto',
    'otimização home office',

    // Cluster: Técnico
    'otimização kernel windows',
    'gerenciamento threads cpu',
    'redução latência dpc',
    'otimização tcp ip',
    'debloat windows seguro'
  ],
  openGraph: {
    title: 'Voltris Optimizer | Engenharia de Performance para Windows',
    description: 'Transforme seu computador com o software líder em otimização. Ideal para Gamers, Empresas e Profissionais que exigem velocidade e estabilidade.',
    url: 'https://voltris.com.br/voltrisoptimizer',
    type: 'website',
    siteName: 'Voltris Technology',
    images: [
      {
        url: 'https://voltris.com.br/og-optimizer-enterprise.jpg', // Placeholder para imagem real
        width: 1200,
        height: 630,
        alt: 'Voltris Optimizer Dashboard',
      },
    ],
    locale: 'pt_BR',
  },
  alternates: {
    canonical: 'https://voltris.com.br/voltrisoptimizer',
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
};

export default function OptimizerPage() {
  return <OptimizerClient />;
}
