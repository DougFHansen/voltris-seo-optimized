import { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLdGuide from '@/components/JsonLdGuide';

export const metadata: Metadata = {
  title: 'Como Aumentar FPS no Valorant 2026 - Guia Completo',
  description: 'Aprenda como aumentar FPS no Valorant com configurações otimizadas, ajustes de sistema e dicas avançadas para máxima performance.',
  keywords: [
    'como aumentar fps valorant',
    'valorant fps',
    'otimizar valorant',
    'configurar valorant',
    'valorant 2026',
    'performance valorant',
    'voltris optimizer'
  ],
  openGraph: {
    title: 'Como Aumentar FPS no Valorant 2026 - Guia Completo',
    description: 'Aprenda como aumentar FPS no Valorant com configurações otimizadas.',
    url: 'https://www.voltris.com.br/como-aumentar-fps-valorant-2026',
    siteName: 'VOLTRIS',
    locale: 'pt_BR',
    type: 'article',
    images: [
      {
        url: 'https://www.voltris.com.br/logo.png',
        width: 1200,
        height: 630,
        alt: 'Como Aumentar FPS no Valorant',
      },
    ],
  },
  alternates: {
    canonical: 'https://www.voltris.com.br/como-aumentar-fps-valorant-2026',
  },
};

export default function AumentarFpsValorantPage() {
  const breadcrumbItems = [
    { label: 'Guias', href: '/guias' },
    { label: 'Como Aumentar FPS Valorant' },
  ];

  return (
    <>
      <JsonLdGuide
        title="Como Aumentar FPS no Valorant 2026 - Guia Completo"
        description="Aprenda como aumentar FPS no Valorant com configurações otimizadas, ajustes de sistema e dicas avançadas para máxima performance."
        estimatedTime="10"
        difficulty="Intermediário"
        category="Jogos"
        faqItems={[
          {
            question: "Qual é a melhor configuração para Valorant?",
            answer: "Desativar VBS, usar plano de alto desempenho, atualizar drivers e configurar o jogo para priorizar performance são as principais otimizações."
          },
          {
            question: "O Valorant consome muitos recursos?",
            answer: "O Valorant é bem otimizado, mas configurar o Windows corretamente pode aumentar FPS significativamente."
          }
        ]}
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Breadcrumbs items={breadcrumbItems} />

          <article className="prose prose-invert prose-lg max-w-none">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Como Aumentar FPS no Valorant 2026 - Guia Completo
            </h1>

            <p className="text-xl text-gray-300 mb-8">
              Aprenda como aumentar FPS no Valorant com configurações otimizadas, ajustes de sistema e dicas avançadas.
            </p>

            <h2 className="text-3xl font-bold text-white mt-12 mb-4">Solução Automática</h2>
            <p className="text-gray-300 mb-4">
              Use o <Link href="/voltrisoptimizer" className="text-[#31A8FF] hover:underline">Voltris Optimizer</Link> para otimizar automaticamente seu PC para Valorant.
            </p>

            <h2 className="text-3xl font-bold text-white mt-12 mb-4">Configurações do Valorant</h2>
            <ol className="list-decimal text-gray-300 space-y-2 ml-6">
              <li>Desativar V-Sync</li>
              <li>Limitar FPS a 144 ou 240 (dependendo do monitor)</li>
              <li>Modo de exibição: Tela cheia</li>
              <li>Qualidade de materiais: Baixo</li>
              <li>Qualidade de textura: Médio</li>
              <li>Detalhes: Baixo</li>
              <li>UI: Baixo</li>
              <li>Anti-aliasing: FXAA</li>
              <li>Anisotropia: 4x</li>
              <li>Reflexo: Desativado</li>
              <li>Sombra: Desativado</li>
              <li>Clipping: Desativado</li>
            </ol>

            <h2 className="text-3xl font-bold text-white mt-12 mb-4">Páginas Relacionadas</h2>
            <ul className="list-disc text-gray-300 space-y-2 ml-6">
              <li><Link href="/aumentar-fps" className="text-[#31A8FF] hover:underline">Como Aumentar FPS</Link></li>
              <li><Link href="/otimizar-windows-para-valorant" className="text-[#31A8FF] hover:underline">Otimizar Windows para Valorant</Link></li>
              <li><Link href="/como-desativar-vbs-windows-11-gamer" className="text-[#31A8FF] hover:underline">Como Desativar VBS</Link></li>
            </ul>

            <div className="mt-12 p-6 bg-purple-900/30 rounded-lg border border-purple-500/30">
              <h3 className="text-xl font-bold text-white mb-4">Automatize com Voltris Optimizer</h3>
              <p className="text-gray-300 mb-4">
                Otimize automaticamente seu PC para Valorant com o Voltris Optimizer.
              </p>
              <Link 
                href="/voltrisoptimizer" 
                className="inline-block px-6 py-3 bg-[#31A8FF] text-white font-bold rounded-lg hover:bg-[#2b93df] transition-all"
              >
                Baixar Voltris Optimizer
              </Link>
            </div>
          </article>
        </div>
      </div>
    </>
  );
}
