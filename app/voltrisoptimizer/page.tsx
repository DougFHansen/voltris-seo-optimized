import { Metadata } from 'next';
import OptimizerClient from './OptimizerClient';

export const metadata: Metadata = {
  title: 'Voltris Optimizer | Otimizador de PC para Jogos e Empresas (Grátis)',
  description: 'Aumente seu FPS em até 40% e elimine o lag do Windows. O Voltris Optimizer utiliza engenharia de kernel para acelerar seu PC e otimizar o sistema automaticamente. Gratuito e 100% Seguro.',
  keywords: [
    // Cluster: Core / Otimização Geral
    'otimizar windows',
    'acelerar pc',
    'software de otimização',
    'limpeza de sistema',
    'pc lento soluções',
    'pc lento solução',
    'como deixar o pc mais rápido',
    'programa para deixar pc mais rápido',
    'otimizar computador automaticamente',
    'limpar ram automaticamente',
    'melhorar desempenho do windows',
    'programa para melhorar desempenho do windows',
    'alternativa ccleaner',
    'melhor otimizador windows 11',
    'melhor otimizador windows 10',
    'desempenho máximo pc',

    // Cluster: Gamers
    'aumentar fps',
    'aumentar fps em jogos',
    'melhorar fps',
    'como aumentar fps',
    'reduzir input lag',
    'reduzir lag no windows',
    'otimizador jogos',
    'otimizar pc para jogos',
    'otimização de pc gamer',
    'game booster profissional',
    'fps boost windows',
    'reduzir ping jogos',
    'estabilidade frame time',
    'otimizar windows para jogos',
    'melhorar desempenho em jogos',
    'otimização para jogos competitivos',

    // Cluster: Streamers
    'melhorar fps para live',
    'otimizar pc para live',
    'reduzir lag no windows para streaming',
    'otimização para OBS',
    'melhorar desempenho para OBS',
    'otimizar pc para streaming',

    // Cluster: Enterprise / B2B
    'otimização pc corporativo',
    'otimização remota de computadores',
    'gerenciamento remoto de performance',
    'software saas de otimização empresarial',
    'controle de desempenho de máquinas corporativas',
    'gestão de performance windows via nuvem',
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
    'debloat windows seguro',
    'software saas brasileiro',
    'controle remoto via web',
    'tecnologia saas',

    // Cluster: Inovação
    'primeiro software brasileiro saas',
    'tecnologia brasileira',
    'inovação brasileira',
    'software brasileiro de otimização',

    // Cluster: Autoridade Técnica (Novo)
    'limpar shader cache nvidia',
    'limpar shader cache amd',
    'reduzir input lag windows',
    'ajuste timer resolution',
    'limpeza winsxs profunda',
    'reparar windows corrompido sfc',
    'otimização de kernel por ia',
    'voltris shield segurança',
    'lyra ai engine performance'
  ],
  openGraph: {
    title: 'VOLTRIS OPTIMIZER | Primeiro Software Brasileiro SaaS de Otimização com Controle Remoto',
    description: 'Software de otimização profissional com controle remoto via web. Aumente FPS, otimize para streaming, acelere empresas. Tecnologia SaaS brasileira inovadora.',
    url: 'https://voltris.com.br/voltrisoptimizer',
    type: 'website',
    siteName: 'VOLTRIS Technology',
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
