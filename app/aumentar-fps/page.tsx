import { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLdGuide from '@/components/JsonLdGuide';

export const metadata: Metadata = {
  title: 'Como Aumentar FPS no Windows 11 - Guia Completo 2026',
  description: 'Aprenda como aumentar FPS no Windows 11 com configurações avançadas, otimização de sistema e ajustes de hardware. Guia completo para gamers.',
  keywords: [
    'como aumentar fps',
    'aumentar fps windows 11',
    'otimização fps jogos',
    'configurar fps jogos',
    'desbloquear fps',
    'performance gamer',
    'otimização pc gamer',
    'voltris optimizer'
  ],
  openGraph: {
    title: 'Como Aumentar FPS no Windows 11 - Guia Completo 2026',
    description: 'Aprenda como aumentar FPS no Windows 11 com configurações avançadas e otimização de sistema.',
    url: 'https://www.voltris.com.br/aumentar-fps',
    siteName: 'VOLTRIS',
    locale: 'pt_BR',
    type: 'article',
    images: [
      {
        url: 'https://www.voltris.com.br/logo.png',
        width: 1200,
        height: 630,
        alt: 'Como Aumentar FPS no Windows 11',
      },
    ],
  },
  alternates: {
    canonical: 'https://www.voltris.com.br/aumentar-fps',
  },
};

export default function AumentarFpsPage() {
  const breadcrumbItems = [
    { label: 'Guias', href: '/guias' },
    { label: 'Como Aumentar FPS' },
  ];

  return (
    <>
      <JsonLdGuide
        title="Como Aumentar FPS no Windows 11 - Guia Completo 2026"
        description="Aprenda como aumentar FPS no Windows 11 com configurações avançadas, otimização de sistema e ajustes de hardware. Guia completo para gamers."
        estimatedTime="15"
        difficulty="Intermediário"
        category="Performance de PC"
        faqItems={[
          {
            question: "Qual é a forma mais rápida de aumentar FPS?",
            answer: "A forma mais rápida é usar o Voltris Optimizer, que otimiza automaticamente todas as configurações do Windows em 5 minutos."
          },
          {
            question: "O VBS afeta o FPS?",
            answer: "Sim, o Virtualization-Based Security (VBS) pode reduzir o FPS em 5-15% em alguns jogos. Desativá-lo pode melhorar significativamente a performance."
          },
          {
            question: "Otimizar via BIOS é seguro?",
            answer: "Sim, se feito corretamente. Ativar XMP para RAM e ajustar planos de energia são modificações seguras que podem aumentar FPS."
          }
        ]}
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Breadcrumbs items={breadcrumbItems} />

          <article className="prose prose-invert prose-lg max-w-none">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Como Aumentar FPS no Windows 11 - Guia Completo 2026
            </h1>

            <p className="text-xl text-gray-300 mb-8">
              Aprenda as técnicas mais eficazes para aumentar FPS no Windows 11, desde configurações do sistema até ajustes avançados de hardware.
            </p>

            <h2 className="text-3xl font-bold text-white mt-12 mb-4">Solução Rápida (5 Minutos)</h2>
            <p className="text-gray-300 mb-4">
              Se você quer resultados rápidos sem complicação, use o <Link href="/voltrisoptimizer" className="text-[#31A8FF] hover:underline">Voltris Optimizer</Link>. Ele detecta e otimiza automaticamente todas as configurações que afetam performance.
            </p>

            <h2 className="text-3xl font-bold text-white mt-12 mb-4">Solução Manual (15 Minutos)</h2>

            <h3 className="text-2xl font-bold text-white mt-8 mb-4">1. Desativar VBS (Virtualization-Based Security)</h3>
            <p className="text-gray-300 mb-4">
              O VBS pode reduzir FPS em 5-15%. Para desativar:
            </p>
            <ol className="list-decimal text-gray-300 space-y-2 ml-6">
              <li>Abrir Segurança do Windows</li>
              <li>Ir para Segurança do Dispositivo</li>
              <li>Desativar Isolamento de Núcleo</li>
              <li>Reiniciar o computador</li>
            </ol>

            <h3 className="text-2xl font-bold text-white mt-8 mb-4">2. Configurar Plano de Energia Gamer</h3>
            <p className="text-gray-300 mb-4">
              Use o plano de energia de alto desempenho:
            </p>
            <ol className="list-decimal text-gray-300 space-y-2 ml-6">
              <li>Abrir Configurações &gt; Sistema &gt; Energia</li>
              <li>Selecionar "Alto desempenho"</li>
              <li>Clicar em "Opções adicionais de energia"</li>
              <li>Desativar "Ligação rápida de início"</li>
            </ol>

            <h3 className="text-2xl font-bold text-white mt-8 mb-4">3. Ativar XMP na BIOS</h3>
            <p className="text-gray-300 mb-4">
              XMP permite que sua RAM rode na velocidade máxima:
            </p>
            <ol className="list-decimal text-gray-300 space-y-2 ml-6">
              <li>Reiniciar e entrar na BIOS (F2 ou DEL)</li>
              <li>Ir para configurações de RAM/Memory</li>
              <li>Ativar XMP ou DOCP</li>
              <li>Salvar e reiniciar</li>
            </ol>

            <h3 className="text-2xl font-bold text-white mt-8 mb-4">4. Atualizar Drivers</h3>
            <p className="text-gray-300 mb-4">
              Drivers atualizados são essenciais para performance:
            </p>
            <ul className="list-disc text-gray-300 space-y-2 ml-6">
              <li>NVIDIA: GeForce Experience</li>
              <li>AMD: AMD Adrenalin</li>
              <li>Intel: Intel Driver & Support Assistant</li>
            </ul>

            <h2 className="text-3xl font-bold text-white mt-12 mb-4">Páginas Relacionadas</h2>
            <ul className="list-disc text-gray-300 space-y-2 ml-6">
              <li><Link href="/como-aumentar-fps-valorant-2026" className="text-[#31A8FF] hover:underline">Como Aumentar FPS no Valorant 2026</Link></li>
              <li><Link href="/como-aumentar-fps-warzone-2026" className="text-[#31A8FF] hover:underline">Como Aumentar FPS no Warzone 2026</Link></li>
              <li><Link href="/como-aumentar-fps-cs2-2026" className="text-[#31A8FF] hover:underline">Como Aumentar FPS no CS2 2026</Link></li>
              <li><Link href="/configurar-nvidia-control-panel-fps" className="text-[#31A8FF] hover:underline">Configurar NVIDIA Control Panel para FPS</Link></li>
              <li><Link href="/otimizar-windows-para-valorant" className="text-[#31A8FF] hover:underline">Otimizar Windows para Valorant</Link></li>
              <li><Link href="/otimizar-windows-para-fortnite-2026" className="text-[#31A8FF] hover:underline">Otimizar Windows para Fortnite</Link></li>
              <li><Link href="/otimizar-windows-para-counter-strike-2-cs2" className="text-[#31A8FF] hover:underline">Otimizar Windows para CS2</Link></li>
              <li><Link href="/como-desativar-vbs-windows-11-gamer" className="text-[#31A8FF] hover:underline">Como Desativar VBS Windows 11</Link></li>
              <li><Link href="/como-limpar-cache-nvidia-windows-11" className="text-[#31A8FF] hover:underline">Como Limpar Cache NVIDIA</Link></li>
            </ul>

            <div className="mt-12 p-6 bg-purple-900/30 rounded-lg border border-purple-500/30">
              <h3 className="text-xl font-bold text-white mb-4">Automatize Tudo com Voltris Optimizer</h3>
              <p className="text-gray-300 mb-4">
                O Voltris Optimizer faz tudo isso automaticamente em 5 minutos. Economize tempo e garanta configurações otimizadas.
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
