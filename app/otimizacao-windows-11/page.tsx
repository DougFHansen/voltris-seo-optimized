import { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLdGuide from '@/components/JsonLdGuide';

export const metadata: Metadata = {
  title: 'Otimização Windows 11 - Guia Completo 2026',
  description: 'Aprenda como otimizar o Windows 11 para máxima performance, desativar recursos desnecessários e melhorar desempenho de jogos.',
  keywords: [
    'otimização windows 11',
    'configurar windows 11',
    'desativar recursos windows 11',
    'windows 11 para jogos',
    'performance windows 11',
    'otimização pc',
    'voltris optimizer'
  ],
  openGraph: {
    title: 'Otimização Windows 11 - Guia Completo 2026',
    description: 'Aprenda como otimizar o Windows 11 para máxima performance e jogos.',
    url: 'https://www.voltris.com.br/otimizacao-windows-11',
    siteName: 'VOLTRIS',
    locale: 'pt_BR',
    type: 'article',
    images: [
      {
        url: 'https://www.voltris.com.br/logo.png',
        width: 1200,
        height: 630,
        alt: 'Otimização Windows 11',
      },
    ],
  },
  alternates: {
    canonical: 'https://www.voltris.com.br/otimizacao-windows-11',
  },
};

export default function OtimizacaoWindows11Page() {
  const breadcrumbItems = [
    { label: 'Guias', href: '/guias' },
    { label: 'Otimização Windows 11' },
  ];

  return (
    <>
      <JsonLdGuide
        title="Otimização Windows 11 - Guia Completo 2026"
        description="Aprenda como otimizar o Windows 11 para máxima performance, desativar recursos desnecessários e melhorar desempenho de jogos."
        estimatedTime="20"
        difficulty="Intermediário"
        category="Windows"
        faqItems={[
          {
            question: "Quais recursos do Windows 11 afetam performance?",
            answer: "VBS, telemetria, Cortana, Windows Search e animações são os principais recursos que afetam performance."
          },
          {
            question: "É seguro desativar telemetria?",
            answer: "Sim, a telemetria coleta dados de uso e pode ser desativada sem afetar o funcionamento do sistema."
          },
          {
            question: "O plano de energia afeta performance?",
            answer: "Sim, o plano de alto desempenho permite que o CPU e GPU operem em frequências máximas."
          }
        ]}
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Breadcrumbs items={breadcrumbItems} />

          <article className="prose prose-invert prose-lg max-w-none">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Otimização Windows 11 - Guia Completo 2026
            </h1>

            <p className="text-xl text-gray-300 mb-8">
              Aprenda como otimizar o Windows 11 para máxima performance, desativar recursos desnecessários e melhorar o desempenho de jogos.
            </p>

            <h2 className="text-3xl font-bold text-white mt-12 mb-4">Solução Automática (5 Minutos)</h2>
            <p className="text-gray-300 mb-4">
              Use o <Link href="/voltrisoptimizer" className="text-[#31A8FF] hover:underline">Voltris Optimizer</Link> para otimizar automaticamente todas as configurações do Windows 11.
            </p>

            <h2 className="text-3xl font-bold text-white mt-12 mb-4">Solução Manual (20 Minutos)</h2>

            <h3 className="text-2xl font-bold text-white mt-8 mb-4">1. Desativar Telemetria</h3>
            <p className="text-gray-300 mb-4">
              A telemetria coleta dados de uso e pode afetar performance:
            </p>
            <ol className="list-decimal text-gray-300 space-y-2 ml-6">
              <li>Abrir Configurações &gt; Privacidade</li>
              <li>Ir para Diagnóstico e feedback</li>
              <li>Desativar &quot;Dados de diagnóstico opcionais&quot;</li>
              <li>Desativar &quot;Experiência personalizada&quot;</li>
            </ol>

            <h3 className="text-2xl font-bold text-white mt-8 mb-4">2. Desativar Cortana</h3>
            <p className="text-gray-300 mb-4">
              Cortana consome recursos em segundo plano:
            </p>
            <ol className="list-decimal text-gray-300 space-y-2 ml-6">
              <li>Abrir Configurações {'>'} Privacidade</li>
              <li>Ir para Histórico de voz</li>
              <li>Desativar &quot;Histórico de voz&quot;</li>
              <li>Ir para Permissões de voz</li>
              <li>Desativar &quot;Reconhecimento de voz online&quot;</li>
            </ol>

            <h3 className="text-2xl font-bold text-white mt-8 mb-4">3. Desativar Windows Search</h3>
            <p className="text-gray-300 mb-4">
              O Windows Search indexa arquivos constantemente:
            </p>
            <ol className="list-decimal text-gray-300 space-y-2 ml-6">
              <li>Abrir Serviços (Win + R, digite services.msc)</li>
              <li>Encontrar &quot;Windows Search&quot;</li>
              <li>Clicar com botão direito {'>'} Propriedades</li>
              <li>Tipo de inicialização: Desativado</li>
              <li>Clicar em Parar</li>
            </ol>

            <h3 className="text-2xl font-bold text-white mt-8 mb-4">4. Otimizar Inicialização</h3>
            <p className="text-gray-300 mb-4">
              Reduzir programas que iniciam automaticamente:
            </p>
            <ol className="list-decimal text-gray-300 space-y-2 ml-6">
              <li>Abrir Gerenciador de Tarefas (Ctrl + Shift + Esc)</li>
              <li>Aba Inicialização</li>
              <li>Desativar programas desnecessários</li>
            </ol>

            <h3 className="text-2xl font-bold text-white mt-8 mb-4">5. Configurar Plano de Energia</h3>
            <p className="text-gray-300 mb-4">
              Use o plano de alto desempenho:
            </p>
            <ol className="list-decimal text-gray-300 space-y-2 ml-6">
              <li>Abrir Configurações {'>'} Sistema {'>'} Energia</li>
              <li>Selecionar &quot;Alto desempenho&quot;</li>
              <li>Clicar em &quot;Opções adicionais de energia&quot;</li>
              <li>Desativar &quot;Ligação rápida de início&quot;</li>
            </ol>

            <h2 className="text-3xl font-bold text-white mt-12 mb-4">Páginas Relacionadas</h2>
            <ul className="list-disc text-gray-300 space-y-2 ml-6">
              <li><Link href="/como-desativar-vbs-windows-11-gamer" className="text-[#31A8FF] hover:underline">Como Desativar VBS Windows 11</Link></li>
              <li><Link href="/como-corrigir-queda-de-wifi-windows-11" className="text-[#31A8FF] hover:underline">Como Corrigir Queda de WiFi</Link></li>
              <li><Link href="/otimizacao-windows-jogos" className="text-[#31A8FF] hover:underline">Otimização Windows para Jogos</Link></li>
              <li><Link href="/aumentar-fps" className="text-[#31A8FF] hover:underline">Como Aumentar FPS</Link></li>
            </ul>

            <div className="mt-12 p-6 bg-purple-900/30 rounded-lg border border-purple-500/30">
              <h3 className="text-xl font-bold text-white mb-4">Automatize com Voltris Optimizer</h3>
              <p className="text-gray-300 mb-4">
                O Voltris Optimizer desativa automaticamente telemetria, Cortana e otimiza todas as configurações do Windows 11 em 5 minutos.
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
