'use client';

import Link from 'next/link';
import { 
  Wrench, 
  Zap, 
  Download, 
  Monitor, 
  BookOpen, 
  FileText, 
  Settings, 
  Gamepad2 
} from 'lucide-react';

export default function ContentClusterPage() {
  const contentClusters = [
    {
      title: "Formatação de Windows",
      description: "Tudo sobre como formatar seu computador corretamente",
      icon: <Download className="w-8 h-8 text-blue-500" />,
      articles: [
        { title: "Como formatar Windows 10 passo a passo", slug: "como-formatar-windows-10" },
        { title: "Diferenças entre formatação rápida e completa", slug: "formatacao-rapida-vs-completa" },
        { title: "Como fazer backup antes de formatar", slug: "backup-antes-formatacao" },
        { title: "Como instalar drivers após formatação", slug: "instalar-drivers-pos-formatar" }
      ]
    },
    {
      title: "Otimização de PC",
      description: "Técnicas e dicas para deixar seu PC mais rápido",
      icon: <Zap className="w-8 h-8 text-green-500" />,
      articles: [
        { title: "Como aumentar FPS em jogos", slug: "aumentar-fps-em-jogos" },
        { title: "Otimizações do Windows para gaming", slug: "otimizacoes-windows-gaming" },
        { title: "Como limpar o Windows corretamente", slug: "limpar-windows-corretamente" },
        { title: "Reduzir uso de RAM e CPU", slug: "reduzir-uso-ram-cpu" }
      ]
    },
    {
      title: "Assistência Técnica",
      description: "Resolução de problemas e manutenção preventiva",
      icon: <Wrench className="w-8 h-8 text-purple-500" />,
      articles: [
        { title: "Como identificar problemas de hardware", slug: "identificar-problemas-hardware" },
        { title: "Sinais de que seu PC precisa de manutenção", slug: "sinais-manutencao-pc" },
        { title: "Como limpar cooler do computador", slug: "limpar-cooler-computador" },
        { title: "Substituição de pasta térmica", slug: "substituicao-pasta-termica" }
      ]
    },
    {
      title: "Software e Aplicações",
      description: "Dicas sobre softwares úteis e otimização de programas",
      icon: <Monitor className="w-8 h-8 text-cyan-500" />,
      articles: [
        { title: "Programas essenciais após formatar", slug: "programas-essenciais-pos-formatar" },
        { title: "Como remover bloatware do Windows", slug: "remover-bloatware-windows" },
        { title: "Softwares para otimização de PC", slug: "softwares-otimizacao-pc" },
        { title: "Como desativar programas na inicialização", slug: "desativar-programas-inicializacao" }
      ]
    }
  ];

  const popularArticles = [
    {
      title: "Como aumentar FPS em qualquer jogo",
      slug: "gta-v-fix-texturas-sumindo",
      excerpt: "Descubra como aumentar o FPS em seus jogos favoritos com algumas configurações simples...",
      category: "Otimização de PC",
      date: "2024-01-15"
    },
    {
      title: "Formatação de Windows: Guia completo",
      slug: "formatacao-limpa-windows-11-rufus-gpt",
      excerpt: "Um guia completo sobre como formatar seu Windows corretamente, desde o backup até a instalação...",
      category: "Formatação",
      date: "2024-01-10"
    },
    {
      title: "Sinais de que seu PC precisa de manutenção",
      slug: "manutencao-preventiva-computador",
      excerpt: "Reconheça os sinais que indicam que seu computador precisa de assistência técnica...",
      category: "Assistência",
      date: "2024-01-05"
    },
    {
      title: "Como limpar o Windows sem perder arquivos",
      slug: "limpeza-disco-profunda-arquivos-temporarios",
      excerpt: "Aprenda a limpar seu Windows de forma segura sem perder seus arquivos importantes...",
      category: "Otimização",
      date: "2024-01-01"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 px-4">
        <div className="absolute inset-0 bg-[url('/background-grid.svg')] opacity-10"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="text-blue-500">Blog e Guias</span><br />
              Técnicos
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Artigos, tutoriais e guias técnicos sobre formatação, otimização, assistência e manutenção de computadores. 
              Aprenda a deixar seu PC mais rápido, seguro e eficiente.
            </p>
          </div>
        </div>
      </section>

      {/* Content Clusters */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Clusters de Conteúdo</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Explore nossos clusters de conteúdo organizados por temas
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {contentClusters.map((cluster, index) => (
              <div key={index} className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-gray-700 rounded-lg">
                    {cluster.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{cluster.title}</h3>
                    <p className="text-gray-400">{cluster.description}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {cluster.articles.map((article, idx) => (
                    <Link 
                      key={idx}
                      href={`/guias/${article.slug}`}
                      className="flex items-center justify-between p-3 hover:bg-gray-700 rounded-lg transition-all group"
                    >
                      <span className="group-hover:text-blue-400 transition-colors">{article.title}</span>
                      <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ))}
                </div>

                <Link 
                  href={`/guias?categoria=${cluster.title.toLowerCase().replace(' ', '-')}`}
                  className="inline-block mt-6 text-blue-400 hover:text-blue-300 font-medium"
                >
                  Ver todos os artigos →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="py-20 bg-gray-900 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Artigos Populares</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Os artigos mais lidos e procurados por nossa comunidade
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {popularArticles.map((article, index) => (
              <div key={index} className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold px-2 py-1 bg-blue-600 rounded-full">{article.category}</span>
                  <span className="text-xs text-gray-400">{article.date}</span>
                </div>
                <h3 className="text-xl font-bold mb-3">{article.title}</h3>
                <p className="text-gray-400 mb-4">{article.excerpt}</p>
                <Link 
                  href={`/guias/${article.slug}`}
                  className="text-blue-400 hover:text-blue-300 font-medium"
                >
                  Ler artigo completo →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Quer mais dicas técnicas?</h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Inscreva-se em nossa newsletter para receber dicas exclusivas sobre otimização e manutenção de PC
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <input 
              type="email" 
              placeholder="Seu melhor e-mail" 
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white flex-grow min-w-[250px]"
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-all">
              Inscrever-se
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}