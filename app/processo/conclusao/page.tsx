import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function CompletionProcessPage() {
  return (
    <>
      <div className="min-h-screen bg-[#171313] text-white">
        <Header />
        <main className="pt-32 sm:pt-24 pb-16 px-4">
          <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-transparent bg-clip-text relative inline-block">
                Conclusão e Garantia
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-[#FF4B6B] to-[#31A8FF]"></div>
              </h1>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto mt-8">
                Entenda como finalizamos nossos serviços e as garantias que oferecemos
                para sua total satisfação.
              </p>
            </div>

            {/* Quality Assurance */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-gray-800 rounded-xl p-8 transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 rounded-lg bg-gradient-to-r from-[#FF4B6B] to-[#8B31FF]">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold">Testes</h3>
                </div>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#FF4B6B]"></div>
                    Verificação completa
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#8B31FF]"></div>
                    Testes de performance
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#31A8FF]"></div>
                    Validação de segurança
                  </li>
                </ul>
              </div>

              <div className="bg-gray-800 rounded-xl p-8 transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 rounded-lg bg-gradient-to-r from-[#8B31FF] to-[#31A8FF]">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold">Documentação</h3>
                </div>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#FF4B6B]"></div>
                    Relatório detalhado
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#8B31FF]"></div>
                    Manual do usuário
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#31A8FF]"></div>
                    Dicas de manutenção
                  </li>
                </ul>
              </div>

              <div className="bg-gray-800 rounded-xl p-8 transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 rounded-lg bg-gradient-to-r from-[#31A8FF] to-[#FF4B6B]">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold">Otimização</h3>
                </div>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#FF4B6B]"></div>
                    Ajustes finais
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#8B31FF]"></div>
                    Configurações personalizadas
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#31A8FF]"></div>
                    Recomendações de uso
                  </li>
                </ul>
              </div>
            </div>

            {/* Warranty Information */}
            <div className="bg-gray-800 rounded-xl p-8 mb-12">
              <h2 className="text-2xl font-bold mb-8 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-transparent bg-clip-text">
                Nossa Garantia
              </h2>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="p-6 bg-gray-700/50 rounded-lg relative">
                  <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-[#FF4B6B] flex items-center justify-center text-lg font-bold">30</div>
                  <h3 className="font-semibold mb-3 mt-2">Dias de Garantia</h3>
                  <p className="text-gray-300 text-sm">
                    Todos os serviços incluem garantia de 30 dias para sua tranquilidade.
                  </p>
                </div>
                <div className="p-6 bg-gray-700/50 rounded-lg relative">
                  <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-[#8B31FF] flex items-center justify-center text-lg font-bold">24</div>
                  <h3 className="font-semibold mb-3 mt-2">Suporte 24/7</h3>
                  <p className="text-gray-300 text-sm">
                    Atendimento disponível 24 horas por dia, 7 dias por semana.
                  </p>
                </div>
                <div className="p-6 bg-gray-700/50 rounded-lg relative">
                  <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-[#31A8FF] flex items-center justify-center text-lg font-bold">0</div>
                  <h3 className="font-semibold mb-3 mt-2">Custo Extra</h3>
                  <p className="text-gray-300 text-sm">
                    Sem custos adicionais para correções durante o período de garantia.
                  </p>
                </div>
                <div className="p-6 bg-gray-700/50 rounded-lg relative">
                  <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-[#FF4B6B] flex items-center justify-center text-lg font-bold">∞</div>
                  <h3 className="font-semibold mb-3 mt-2">Satisfação</h3>
                  <p className="text-gray-300 text-sm">
                    Comprometimento total com sua satisfação e resultados.
                  </p>
                </div>
              </div>
            </div>

            {/* Support Information */}
            <div className="bg-gray-800 rounded-xl p-8 mb-12">
              <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-transparent bg-clip-text">
                Suporte Pós-Serviço
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Canais de Atendimento</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">WhatsApp Business 24/7</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">E-mail com resposta em até 2 horas</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">Chat online no site</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">Benefícios Exclusivos</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">Desconto em serviços futuros</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">Prioridade no atendimento</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">Consultoria gratuita</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center">
              <Link
                href="/servicos"
                className="inline-block px-8 py-4 bg-gradient-to-r from-[#FF4B6B] to-[#8B31FF] rounded-lg font-medium text-white hover:opacity-90 transition-opacity duration-300"
              >
                Solicitar Serviço
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
} 