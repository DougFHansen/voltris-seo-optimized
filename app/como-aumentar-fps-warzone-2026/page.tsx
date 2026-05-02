import { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLdGuide from '@/components/JsonLdGuide';

export const metadata: Metadata = {
  title: 'Como Aumentar FPS no Warzone 2026 - Guia Completo',
  description: 'Aprenda como aumentar FPS no Warzone com configurações otimizadas, ajustes de sistema e dicas avançadas para máxima performance.',
  keywords: [
    'como aumentar fps warzone',
    'warzone fps',
    'otimizar warzone',
    'configurar warzone',
    'warzone 2026',
    'performance warzone',
    'voltris optimizer'
  ],
  openGraph: {
    title: 'Como Aumentar FPS no Warzone 2026 - Guia Completo',
    description: 'Aprenda como aumentar FPS no Warzone com configurações otimizadas.',
    url: 'https://www.voltris.com.br/como-aumentar-fps-warzone-2026',
    siteName: 'VOLTRIS',
    locale: 'pt_BR',
    type: 'article',
    images: [
      {
        url: 'https://www.voltris.com.br/logo.png',
        width: 1200,
        height: 630,
        alt: 'Como Aumentar FPS no Warzone',
      },
    ],
  },
  alternates: {
    canonical: 'https://www.voltris.com.br/como-aumentar-fps-warzone-2026',
  },
};

export default function AumentarFpsWarzonePage() {
  const breadcrumbItems = [
    { label: 'Guias', href: '/guias' },
    { label: 'Como Aumentar FPS Warzone' },
  ];

  return (
    <>
      <JsonLdGuide
        title="Como Aumentar FPS no Warzone 2026 - Guia Completo"
        description="Aprenda como aumentar FPS no Warzone com configurações otimizadas, ajustes de sistema e dicas avançadas para máxima performance."
        estimatedTime="10"
        difficulty="Intermediário"
        category="Jogos"
        faqItems={[
          {
            question: "Qual é a melhor configuração para Warzone?",
            answer: "Desativar VBS, usar plano de alto desempenho, atualizar drivers e configurar o jogo para baixa qualidade com alta resolução."
          },
          {
            question: "O Warzone consome muitos recursos?",
            answer: "Sim, o Warzone é um jogo pesado. Otimizar o Windows e atualizar drivers é essencial."
          }
        ]}
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Breadcrumbs items={breadcrumbItems} />

          <article className="prose prose-invert prose-lg max-w-none">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Como Aumentar FPS no Warzone 2026 - Guia Completo
            </h1>

            <p className="text-xl text-gray-300 mb-8">
              Aprenda como aumentar FPS no Warzone com configurações otimizadas, ajustes de sistema e dicas avançadas.
            </p>

            <h2 className="text-3xl font-bold text-white mt-12 mb-4">Solução Automática</h2>
            <p className="text-gray-300 mb-4">
              Use o <Link href="/voltrisoptimizer" className="text-[#31A8FF] hover:underline">Voltris Optimizer</Link> para otimizar automaticamente seu PC para Warzone.
            </p>

            <h2 className="text-3xl font-bold text-white mt-12 mb-4">Configurações do Warzone</h2>
            <ol className="list-decimal text-gray-300 space-y-2 ml-6">
              <li>Desativar V-Sync</li>
              <li>Limitar FPS a 144 ou 240</li>
              <li>Modo de exibição: Tela cheia exclusiva</li>
              <li>Qualidade de renderização: Normal</li>
              <li>Resolução: Nativa do monitor</li>
              <li>Qualidade de textura: Médio</li>
              <li>Filtragem de textura: Bilinear</li>
              <li>Detalhes: Baixo</li>
              <li>Sombra: Desativado</li>
              <li>Oclusão: Desativado</li>
              <li>Reflexo: Desativado</li>
              <li>Tesselação: Desativado</li>
            </ol>

            <h2 className="text-3xl font-bold text-white mt-12 mb-4">Páginas Relacionadas</h2>
            <ul className="list-disc text-gray-300 space-y-2 ml-6">
              <li><Link href="/aumentar-fps" className="text-[#31A8FF] hover:underline">Como Aumentar FPS</Link></li>
              <li><Link href="/otimizar-windows-11-para-warzone-2026" className="text-[#31A8FF] hover:underline">Otimizar Windows para Warzone</Link></li>
              <li><Link href="/como-desativar-vbs-windows-11-gamer" className="text-[#31A8FF] hover:underline">Como Desativar VBS</Link></li>
            </ul>

            <div className="mt-12 p-6 bg-purple-900/30 rounded-lg border border-purple-500/30">
              <h3 className="text-xl font-bold text-white mb-4">Automatize com Voltris Optimizer</h3>
              <p className="text-gray-300 mb-4">
                Otimize automaticamente seu PC para Warzone com o Voltris Optimizer.
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
