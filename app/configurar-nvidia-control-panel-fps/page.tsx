import { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLdGuide from '@/components/JsonLdGuide';

export const metadata: Metadata = {
  title: 'Configurar NVIDIA Control Panel para FPS Máximo - Guia 2026',
  description: 'Aprenda como configurar o NVIDIA Control Panel para aumentar FPS em jogos com ajustes avançados de GPU.',
  keywords: [
    'configurar nvidia control panel',
    'nvidia control panel fps',
    'otimizar nvidia',
    'configurar gpu nvidia',
    'nvidia settings jogos',
    'aumentar fps nvidia',
    'voltris optimizer'
  ],
  openGraph: {
    title: 'Configurar NVIDIA Control Panel para FPS Máximo - Guia 2026',
    description: 'Aprenda como configurar o NVIDIA Control Panel para aumentar FPS em jogos.',
    url: 'https://www.voltris.com.br/configurar-nvidia-control-panel-fps',
    siteName: 'VOLTRIS',
    locale: 'pt_BR',
    type: 'article',
    images: [
      {
        url: 'https://www.voltris.com.br/logo.png',
        width: 1200,
        height: 630,
        alt: 'Configurar NVIDIA Control Panel',
      },
    ],
  },
  alternates: {
    canonical: 'https://www.voltris.com.br/configurar-nvidia-control-panel-fps',
  },
};

export default function ConfigurarNvidiaPage() {
  const breadcrumbItems = [
    { label: 'Guias', href: '/guias' },
    { label: 'Configurar NVIDIA Control Panel' },
  ];

  return (
    <>
      <JsonLdGuide
        title="Configurar NVIDIA Control Panel para FPS Máximo - Guia 2026"
        description="Aprenda como configurar o NVIDIA Control Panel para aumentar FPS em jogos com ajustes avançados de GPU."
        estimatedTime="8"
        difficulty="Intermediário"
        category="Hardware"
        faqItems={[
          {
            question: "Qual é a melhor configuração do NVIDIA Control Panel?",
            answer: "Modo de alimentação: Preferir máximo desempenho, Qualidade de imagem: Alta performance, V-Sync: Desativado."
          },
          {
            question: "O NVIDIA Control Panel afeta FPS?",
            answer: "Sim, configurações corretas podem aumentar FPS significativamente, especialmente em jogos pesados."
          }
        ]}
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Breadcrumbs items={breadcrumbItems} />

          <article className="prose prose-invert prose-lg max-w-none">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Configurar NVIDIA Control Panel para FPS Máximo - Guia 2026
            </h1>

            <p className="text-xl text-gray-300 mb-8">
              Aprenda como configurar o NVIDIA Control Panel para aumentar FPS em jogos com ajustes avançados de GPU.
            </p>

            <h2 className="text-3xl font-bold text-white mt-12 mb-4">3D Settings</h2>
            <ol className="list-decimal text-gray-300 space-y-2 ml-6">
              <li>Modo de alimentação: Preferir máximo desempenho</li>
              <li>Qualidade de imagem: Alta performance</li>
              <li>V-Sync: Desativado</li>
              <li>Tripple Buffering: Desativado</li>
              <li>Low Latency Mode: Ultra</li>
              <li>Max Frame Rate: Desativado (ou limitar ao refresh rate)</li>
            </ol>

            <h2 className="text-3xl font-bold text-white mt-12 mb-4">Adjust Image Settings</h2>
            <ol className="list-decimal text-gray-300 space-y-2 ml-6">
              <li>Imagem Sharpening: Desativado (ou usar com moderação)</li>
              <li>DSR Factors: Desativado (aumenta carga na GPU)</li>
            </ol>

            <h2 className="text-3xl font-bold text-white mt-12 mb-4">Páginas Relacionadas</h2>
            <ul className="list-disc text-gray-300 space-y-2 ml-6">
              <li><Link href="/aumentar-fps" className="text-[#31A8FF] hover:underline">Como Aumentar FPS</Link></li>
              <li><Link href="/como-limpar-cache-nvidia-windows-11" className="text-[#31A8FF] hover:underline">Como Limpar Cache NVIDIA</Link></li>
              <li><Link href="/como-aumentar-fps-valorant-2026" className="text-[#31A8FF] hover:underline">Aumentar FPS Valorant</Link></li>
            </ul>

            <div className="mt-12 p-6 bg-purple-900/30 rounded-lg border border-purple-500/30">
              <h3 className="text-xl font-bold text-white mb-4">Automatize com Voltris Optimizer</h3>
              <p className="text-gray-300 mb-4">
                O Voltris Optimizer configura automaticamente o NVIDIA Control Panel para máxima performance.
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
