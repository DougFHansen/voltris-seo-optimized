import { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLdGuide from '@/components/JsonLdGuide';

export const metadata: Metadata = {
  title: 'Como Aumentar FPS no CS2 2026 - Guia Completo',
  description: 'Aprenda como aumentar FPS no Counter-Strike 2 com configurações otimizadas, ajustes de sistema e dicas avançadas para máxima performance.',
  keywords: [
    'como aumentar fps cs2',
    'cs2 fps',
    'otimizar cs2',
    'configurar cs2',
    'counter strike 2 fps',
    'performance cs2',
    'voltris optimizer'
  ],
  openGraph: {
    title: 'Como Aumentar FPS no CS2 2026 - Guia Completo',
    description: 'Aprenda como aumentar FPS no Counter-Strike 2 com configurações otimizadas.',
    url: 'https://www.voltris.com.br/como-aumentar-fps-cs2',
    siteName: 'VOLTRIS',
    locale: 'pt_BR',
    type: 'article',
    images: [
      {
        url: 'https://www.voltris.com.br/logo.png',
        width: 1200,
        height: 630,
        alt: 'Como Aumentar FPS no CS2',
      },
    ],
  },
  alternates: {
    canonical: 'https://www.voltris.com.br/como-aumentar-fps-cs2',
  },
};

export default function AumentarFpsCS2Page() {
  const breadcrumbItems = [
    { label: 'Guias', href: '/guias' },
    { label: 'Como Aumentar FPS CS2' },
  ];

  return (
    <>
      <JsonLdGuide
        title="Como Aumentar FPS no CS2 2026 - Guia Completo"
        description="Aprenda como aumentar FPS no Counter-Strike 2 com configurações otimizadas, ajustes de sistema e dicas avançadas para máxima performance."
        estimatedTime="10"
        difficulty="Intermediário"
        category="Jogos"
        faqItems={[
          {
            question: "Qual é a melhor configuração para CS2?",
            answer: "Desativar V-Sync, usar lançamento de console -nojoy, configurar para baixa qualidade e usar plano de alto desempenho."
          },
          {
            question: "O CS2 consome muitos recursos?",
            answer: "O CS2 usa o Source 2 engine e é bem otimizado, mas configurações corretas do Windows ajudam."
          }
        ]}
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Breadcrumbs items={breadcrumbItems} />

          <article className="prose prose-invert prose-lg max-w-none">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Como Aumentar FPS no CS2 2026 - Guia Completo
            </h1>

            <p className="text-xl text-gray-300 mb-8">
              Aprenda como aumentar FPS no Counter-Strike 2 com configurações otimizadas, ajustes de sistema e dicas avançadas.
            </p>

            <h2 className="text-3xl font-bold text-white mt-12 mb-4">Solução Automática</h2>
            <p className="text-gray-300 mb-4">
              Use o <Link href="/voltrisoptimizer" className="text-[#31A8FF] hover:underline">Voltris Optimizer</Link> para otimizar automaticamente seu PC para CS2.
            </p>

            <h2 className="text-3xl font-bold text-white mt-12 mb-4">Launch Options do CS2</h2>
            <p className="text-gray-300 mb-4">
              Adicione ao lançamento do CS2:
            </p>
            <code className="block bg-gray-800 p-4 rounded text-gray-300 mb-4">
              -nojoy -novid -freq 240 -high -threads 8 -nod3d9ex -noaafonts
            </code>

            <h2 className="text-3xl font-bold text-white mt-12 mb-4">Configurações do CS2</h2>
            <ol className="list-decimal text-gray-300 space-y-2 ml-6">
              <li>Desativar V-Sync</li>
              <li>Limitar FPS a 300 ou desativar</li>
              <li>Modo de exibição: Tela cheia</li>
              <li>Resolução: Nativa</li>
              <li>Qualidade global: Muito baixa</li>
              <li>Sombra: Muito baixa</li>
              <li>Luz: Muito baixa</li>
              <li>Efeitos: Muito baixa</li>
              <li>Modelos: Baixo</li>
              <li>Textura: Médio</li>
              <li>Filtragem: Bilinear</li>
            </ol>

            <h2 className="text-3xl font-bold text-white mt-12 mb-4">Páginas Relacionadas</h2>
            <ul className="list-disc text-gray-300 space-y-2 ml-6">
              <li><Link href="/aumentar-fps" className="text-[#31A8FF] hover:underline">Como Aumentar FPS</Link></li>
              <li><Link href="/otimizar-windows-para-counter-strike-2-cs2" className="text-[#31A8FF] hover:underline">Otimizar Windows para CS2</Link></li>
              <li><Link href="/como-desativar-vbs-windows-11-gamer" className="text-[#31A8FF] hover:underline">Como Desativar VBS</Link></li>
            </ul>

            <div className="mt-12 p-6 bg-purple-900/30 rounded-lg border border-purple-500/30">
              <h3 className="text-xl font-bold text-white mb-4">Automatize com Voltris Optimizer</h3>
              <p className="text-gray-300 mb-4">
                Otimize automaticamente seu PC para CS2 com o Voltris Optimizer.
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
