'use client';

import Link from 'next/link';
import { 
  Wrench, 
  Zap, 
  Download, 
  Monitor, 
  ArrowRight, 
  CheckCircle2,
  Star
} from 'lucide-react';



export default function ServiceIntegrationPage() {
  const integrationBenefits = [
    {
      title: "Formatação + Otimização",
      description: "Combine a instalação limpa do Windows com otimizações avançadas para desempenho máximo desde o início",
      benefits: [
        "Sistema operacional completamente limpo",
        "Configurações otimizadas desde a instalação",
        "Aumento de FPS em jogos desde o primeiro uso",
        "Desempenho otimizado desde o início"
      ]
    },
    {
      title: "Formatação + Assistência",
      description: "Identifique e resolva problemas de hardware antes da formatação para garantir estabilidade",
      benefits: [
        "Diagnóstico completo de hardware",
        "Substituição de peças defeituosas",
        "Instalação limpa em hardware saudável",
        "Maior durabilidade do sistema"
      ]
    },
    {
      title: "Otimização + Software",
      description: "Potencialize os resultados da otimização com nosso software de otimização contínua",
      benefits: [
        "Otimizações manuais + automáticas",
        "Controle remoto para ajustes personalizados",
        "Atualizações constantes de perfis",
        "Resultados sustentáveis no tempo"
      ]
    },
    {
      title: "Assistência + Otimização",
      description: "Resolva problemas de hardware e otimize o software para desempenho ideal",
      benefits: [
        "Problemas de hardware resolvidos",
        "Sistema operacional otimizado",
        "Melhora de desempenho integral",
        "Garantia de ambos os serviços"
      ]
    }
  ];

  const successStories = [
    {
      title: "Jogador Profissional",
      story: "Após combinar formatação, otimização e software Voltris Optimizer, aumentou o FPS médio em 45% e reduziu o input lag em 35%",
      services: ["Formatação", "Otimização", "Software"]
    },
    {
      title: "Studio de Design",
      story: "Após combinar assistência técnica (limpeza e upgrade) com otimização, aumentaram a produtividade em 60%",
      services: ["Assistência", "Otimização"]
    },
    {
      title: "Escritório Contábil",
      story: "Com formatação e otimização combinadas, resolveram problemas de lentidão e aumentaram a segurança em 90%",
      services: ["Formatação", "Otimização"]
    }
  ];

  const serviceFlow = [
    {
      step: 1,
      title: "Avaliação Inicial",
      description: "Diagnosticamos seu PC para identificar as necessidades específicas"
    },
    {
      step: 2,
      title: "Plano Personalizado",
      description: "Elaboramos um plano com os serviços ideais para seu caso"
    },
    {
      step: 3,
      title: "Execução Integrada",
      description: "Aplicamos os serviços de forma coordenada para resultados máximos"
    },
    {
      step: 4,
      title: "Resultado Otimizado",
      description: "Seu PC com desempenho máximo e estabilidade garantida"
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
              <span className="text-blue-500">Integração de</span><br />
              Serviços Técnicos
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Como nossos serviços de formatação, otimização e assistência técnica trabalham juntos 
              para maximizar o desempenho do seu PC. Soluções integradas para resultados completos.
            </p>
          </div>
        </div>
      </section>

      {/* Integration Benefits */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Benefícios da Integração</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Por que combinar nossos serviços gera melhores resultados
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {integrationBenefits.map((benefit, index) => (
              <div key={index} className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
                <h3 className="text-2xl font-bold mb-4">{benefit.title}</h3>
                <p className="text-gray-400 mb-6">{benefit.description}</p>
                
                <ul className="space-y-3">
                  {benefit.benefits.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="text-green-500 mt-1" size={20} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Flow */}
      <section className="py-20 bg-gray-900 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Fluxo de Serviços Integrados</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Como trabalhamos de forma coordenada para resultados máximos
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-500 transform -translate-x-1/2"></div>
            
            <div className="space-y-12">
              {serviceFlow.map((step, index) => (
                <div key={index} className="relative flex items-start gap-8">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center font-bold text-white">
                    {step.step}
                  </div>
                  <div className="flex-1 bg-gray-800 rounded-2xl p-6 border border-gray-700">
                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                    <p className="text-gray-400">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Histórias de Sucesso</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Resultados reais com serviços integrados
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <div key={index} className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold mb-4">{story.title}</h3>
                <p className="text-gray-400 mb-4">{story.story}</p>
                
                <div className="mt-4">
                  <p className="text-sm text-gray-400 mb-2">Serviços combinados:</p>
                  <div className="flex flex-wrap gap-2">
                    {story.services.map((service, idx) => (
                      <span key={idx} className="text-xs bg-blue-600/20 text-blue-400 px-2 py-1 rounded">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#31A8FF]/20 via-[#8B31FF]/20 to-[#FF4B6B]/20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Quer resultados máximos?</h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Combine nossos serviços para potencializar o desempenho do seu PC
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/servicos-combinados" 
              className="bg-gradient-to-r from-[#31A8FF] to-[#8B31FF] hover:from-[#8B31FF] hover:to-[#FF4B6B] text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center gap-2"
            >
              Ver Pacotes Integrados
              <ArrowRight size={16} />
            </Link>
            <Link 
              href="/contato" 
              className="bg-gradient-to-r from-[#6B7280] to-[#4B5563] hover:from-[#4B5563] hover:to-[#374151] text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center gap-2"
            >
              Solicitar Avaliação
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}