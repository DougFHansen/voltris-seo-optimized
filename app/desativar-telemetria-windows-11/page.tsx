import { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLdGuide from '@/components/JsonLdGuide';

export const metadata: Metadata = {
  title: 'Como Desativar Telemetria Windows 11 - Guia Completo 2026',
  description: 'Aprenda como desativar telemetria do Windows 11 para melhorar performance e privacidade com configurações avançadas.',
  keywords: [
    'desativar telemetria windows 11',
    'telemetria windows 11',
    'privacidade windows 11',
    'performance windows 11',
    'desativar coleta de dados',
    'windows 11 otimização',
    'voltris optimizer'
  ],
  openGraph: {
    title: 'Como Desativar Telemetria Windows 11 - Guia Completo 2026',
    description: 'Aprenda como desativar telemetria do Windows 11 para melhorar performance.',
    url: 'https://www.voltris.com.br/desativar-telemetria-windows-11',
    siteName: 'VOLTRIS',
    locale: 'pt_BR',
    type: 'article',
    images: [
      {
        url: 'https://www.voltris.com.br/logo.png',
        width: 1200,
        height: 630,
        alt: 'Desativar Telemetria Windows 11',
      },
    ],
  },
  alternates: {
    canonical: 'https://www.voltris.com.br/desativar-telemetria-windows-11',
  },
};

export default function DesativarTelemetriaPage() {
  const breadcrumbItems = [
    { label: 'Guias', href: '/guias' },
    { label: 'Desativar Telemetria Windows 11' },
  ];

  return (
    <>
      <JsonLdGuide
        title="Como Desativar Telemetria Windows 11 - Guia Completo 2026"
        description="Aprenda como desativar telemetria do Windows 11 para melhorar performance e privacidade com configurações avançadas."
        estimatedTime="8"
        difficulty="Intermediário"
        category="Windows"
        faqItems={[
          {
            question: "É seguro desativar telemetria?",
            answer: "Sim, a telemetria coleta dados de uso e pode ser desativada sem afetar o funcionamento do sistema."
          },
          {
            question: "A telemetria afeta performance?",
            answer: "Sim, a telemetria consome recursos em segundo plano e pode afetar performance, especialmente em PCs mais antigos."
          }
        ]}
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Breadcrumbs items={breadcrumbItems} />

          <article className="prose prose-invert prose-lg max-w-none">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Como Desativar Telemetria Windows 11 - Guia Completo 2026
            </h1>

            <p className="text-xl text-gray-300 mb-8">
              Aprenda como desativar telemetria do Windows 11 para melhorar performance e privacidade com configurações avançadas.
            </p>

            <h2 className="text-3xl font-bold text-white mt-12 mb-4">Solução Automática</h2>
            <p className="text-gray-300 mb-4">
              Use o <Link href="/voltrisoptimizer" className="text-[#31A8FF] hover:underline">Voltris Optimizer</Link> para desativar automaticamente telemetria e otimizar o Windows.
            </p>

            <h2 className="text-3xl font-bold text-white mt-12 mb-4">Método 1: Configurações do Windows</h2>
            <ol className="list-decimal text-gray-300 space-y-2 ml-6">
              <li>Abrir Configurações</li>
              <li>Ir para Privacidade e segurança</li>
              <li>Clicar em Diagnóstico e feedback</li>
              <li>Desativar &quot;Enviar dados de diagnóstico opcionais&quot;</li>
              <li>Desativar &quot;Experiência personalizada&quot;</li>
              <li>Desativar &quot;Recomendações&quot;</li>
            </ol>

            <h2 className="text-3xl font-bold text-white mt-12 mb-4">Método 2: Editor de Registro</h2>
            <ol className="list-decimal text-gray-300 space-y-2 ml-6">
              <li>Pressione Win + R, digite regedit</li>
              <li>Navegue para HKEY_LOCAL_MACHINE\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection</li>
              <li>Criar DWORD: AllowTelemetry</li>
              <li>Valor: 0 (Desativado)</li>
              <li>Reiniciar o computador</li>
            </ol>

            <h2 className="text-3xl font-bold text-white mt-12 mb-4">Método 3: PowerShell</h2>
            <p className="text-gray-300 mb-4">
              Execute como administrador:
            </p>
            <code className="block bg-gray-800 p-4 rounded text-gray-300 mb-4">
              Set-ItemProperty -Path &quot;HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection&quot; -Name &quot;AllowTelemetry&quot; -Value 0
            </code>

            <h2 className="text-3xl font-bold text-white mt-12 mb-4">Páginas Relacionadas</h2>
            <ul className="list-disc text-gray-300 space-y-2 ml-6">
              <li><Link href="/otimizacao-windows-11" className="text-[#31A8FF] hover:underline">Otimização Windows 11</Link></li>
              <li><Link href="/como-desativar-vbs-windows-11-gamer" className="text-[#31A8FF] hover:underline">Como Desativar VBS</Link></li>
              <li><Link href="/aumentar-fps" className="text-[#31A8FF] hover:underline">Como Aumentar FPS</Link></li>
            </ul>

            <div className="mt-12 p-6 bg-purple-900/30 rounded-lg border border-purple-500/30">
              <h3 className="text-xl font-bold text-white mb-4">Automatize com Voltris Optimizer</h3>
              <p className="text-gray-300 mb-4">
                O Voltris Optimizer desativa automaticamente telemetria e otimiza todas as configurações do Windows 11.
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
