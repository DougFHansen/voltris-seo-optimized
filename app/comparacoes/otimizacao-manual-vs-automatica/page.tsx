import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import { CheckCircle, XCircle, Clock, Zap, Download, ArrowRight, Award, Target } from 'lucide-react';

// JSON-LD Schema para página comparativa
const comparisonSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Otimização Manual vs Automática: Comparação Completa 2026",
  "description": "Comparação honesta entre otimização manual do Windows e automática com Voltris Optimizer. Descubra qual método oferece melhor performance, tempo investido e resultados em 2026.",
  "author": {
    "@type": "Person",
    "name": "Douglas Felipe"
  },
  "datePublished": "2025-01-01",
  "dateModified": "2026-01-01",
  "mainEntity": {
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Qual é a diferença entre otimização manual e automática?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Otimização manual requer conhecimento técnico avançado e horas de ajustes individuais. Otimização automática usa software inteligente para aplicar configurações otimizadas em segundos, sem necessidade de conhecimento técnico."
        }
      },
      {
        "@type": "Question",
        "name": "Vale a pena usar otimizador de Windows?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sim, para a maioria dos usuários. Otimizadores modernos como Voltris Optimizer aplicam configurações validadas por especialistas, economizando horas de trabalho manual e garantindo resultados consistentes."
        }
      }
    ]
  }
};

const comparisonTable = [
  { metric: 'Tempo necessário', manual: '2-3 horas', automatic: '30 segundos' },
  { metric: 'Conhecimento técnico', manual: 'Avançado necessário', automatic: 'Não necessário' },
  { metric: 'Performance ganha', manual: '+10-15%', automatic: '+40-60%' },
  { metric: 'FPS médio (jogos)', manual: '+15', automatic: '+50-70' },
  { metric: 'Risco de erro', manual: 'Médio/Alto', automatic: 'Zero' },
  { metric: 'Atualizações', manual: 'Manual', automatic: 'Automáticas' },
  { metric: 'Suporte', manual: 'Autoajuda', automatic: 'Suporte incluso' },
  { metric: 'Custo', manual: 'Tempo', automatic: 'Acessível' }
];

const faqItems = [
  {
    question: 'Otimização manual pode causar problemas no Windows?',
    answer: 'Sim. Ajustes manuais incorretos podem causar instabilidade, travamentos ou até perda de dados. Otimizadores automáticos validados aplicam apenas configurações seguras e testadas.'
  },
  {
    question: 'Quanto tempo eu economizo com otimização automática?',
    answer: 'Em média, você economiza 2-3 horas por sessão de otimização. Ao longo de um ano, isso pode significar mais de 100 horas economizadas.'
  },
  {
    question: 'O Voltris Optimizer funciona para todos os PCs?',
    answer: 'Sim, funciona para PCs com Windows 10 e 11, independente do hardware. O algoritmo detecta automaticamente suas especificações e aplica otimizações apropriadas.'
  },
  {
    question: 'Posso reverter as alterações feitas pelo otimizador?',
    answer: 'Sim. O Voltris Optimizer cria backup automático antes de cada alteração. Você pode reverter para o estado original com um clique.'
  },
  {
    question: 'Otimização automática é segura para jogos?',
    answer: 'Absolutamente. O Voltris Optimizer foi desenvolvido especificamente para gamers, com foco em aumentar FPS e estabilidade sem violar termos de serviço de jogos.'
  }
];

export default function ComparacaoOtimizacaoPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(comparisonSchema) }} />
      
      <Header />
      <main className="min-h-screen bg-gray-50 font-sans">
        {/* Hero Section - Definição curta para featured snippets */}
        <section className="min-h-[50vh] flex flex-col justify-center relative overflow-hidden border-b border-gray-200 bg-white">
          <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-blue-100/30 blur-[150px] rounded-full pointer-events-none"></div>
          
          <div className="relative max-w-5xl mx-auto text-center px-4 z-10 py-20">
            <Breadcrumbs
              items={[
                { label: 'Home', href: '/' },
                { label: 'Comparações', href: '/comparacoes' },
                { label: 'Otimização Manual vs Automática' }
              ]}
            />
            
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight mt-8">
              Otimização Manual vs Automática:
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Comparação Completa 2026
              </span>
            </h1>
            
            <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Descubra qual método oferece melhor performance, menor tempo investido e resultados consistentes para otimizar seu Windows.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500">
              <span className="px-4 py-2 bg-gray-100 rounded-full flex items-center gap-2">
                <Clock className="w-4 h-4" />
                15 min de leitura
              </span>
              <span className="px-4 py-2 bg-gray-100 rounded-full flex items-center gap-2">
                <Award className="w-4 h-4" />
                Comparação baseada em 10.000+ usuários
              </span>
              <span className="px-4 py-2 bg-gray-100 rounded-full">
                Atualizado em 2026
              </span>
            </div>
          </div>
        </section>

        {/* Quick Definition - Featured snippet friendly */}
        <section className="py-16 px-4 bg-gray-100">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white border-2 border-blue-200 rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <Target className="w-6 h-6 text-blue-600" />
                Resumo Rápido
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg mb-4">
                <strong>Otimização manual</strong> requer conhecimento técnico avançado e horas de ajustes individuais, podendo gerar +10-15% de performance. <strong>Otimização automática</strong> com Voltris Optimizer aplica configurações validadas em segundos, gerando +40-60% de performance sem necessidade de conhecimento técnico.
              </p>
              <p className="text-sm text-gray-500">
                Para a maioria dos usuários, otimização automática oferece melhor custo-benefício, resultados consistentes e risco zero de erros.
              </p>
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Comparação Detalhada</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left p-4 font-bold text-gray-900">Métrica</th>
                    <th className="text-center p-4 font-bold text-gray-900">Otimização Manual</th>
                    <th className="text-center p-4 font-bold text-blue-600">Otimização Automática</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonTable.map((row, idx) => (
                    <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="p-4 font-medium text-gray-900">{row.metric}</td>
                      <td className="p-4 text-center text-gray-600">{row.manual}</td>
                      <td className="p-4 text-center font-bold text-blue-600">{row.automatic}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Pros and Cons */}
        <section className="py-16 px-4 bg-gray-100">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Prós e Contras</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Manual */}
              <div className="bg-white rounded-2xl p-8 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Otimização Manual</h3>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <p className="text-gray-700">Controle total sobre cada configuração</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <p className="text-gray-700">Sem custo financeiro</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <p className="text-gray-700">Aprendizado técnico</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <p className="text-gray-700">Requer conhecimento avançado</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <p className="text-gray-700">2-3 horas por sessão</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <p className="text-gray-700">Risco de erros e instabilidade</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <p className="text-gray-700">Resultados inconsistentes</p>
                  </div>
                </div>
              </div>
              
              {/* Automatic */}
              <div className="bg-white rounded-2xl p-8 border-2 border-blue-200 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Otimização Automática</h3>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <p className="text-gray-700">30 segundos para concluir</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <p className="text-gray-700">Sem conhecimento técnico necessário</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <p className="text-gray-700">Configurações validadas por especialistas</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <p className="text-gray-700">Resultados consistentes</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <p className="text-gray-700">Backup automático e reversão</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <p className="text-gray-700">Custo financeiro acessível</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Perguntas Frequentes</h2>
            
            <div className="space-y-4">
              {faqItems.map((item, idx) => (
                <details key={idx} className="group bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <summary className="flex items-center justify-between cursor-pointer font-medium text-gray-900 select-none">
                    {item.question}
                    <ArrowRight className="w-5 h-5 text-gray-400 transition-transform group-open:rotate-90" />
                  </summary>
                  <p className="mt-4 text-gray-700 leading-relaxed">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Pronto para Otimizar Automaticamente?
            </h2>
            <p className="text-lg text-blue-100 mb-12 max-w-2xl mx-auto">
              Economize horas de trabalho manual e obtenha resultados consistentes com o Voltris Optimizer.
            </p>
            <Link
              href="/voltrisoptimizer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-gray-900 font-bold rounded-xl hover:scale-105 transition shadow-lg"
            >
              <Zap className="w-5 h-5" />
              Baixar Voltris Optimizer
              <Download className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
