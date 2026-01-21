import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function SchedulingProcessPage() {
  return (
    <>
      <div className="min-h-screen bg-[#171313] text-white">
        <Header />
        <main className="pt-32 sm:pt-24 pb-16 px-4">
          <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-transparent bg-clip-text relative inline-block">
                Processo de Agendamento
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-[#FF4B6B] to-[#31A8FF]"></div>
              </h1>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto mt-8">
                Entenda como funciona nosso processo de agendamento e como
                garantimos o melhor horário para você.
              </p>
            </div>

            {/* Scheduling Features */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-gray-800 rounded-xl p-8 transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 rounded-lg bg-gradient-to-r from-[#FF4B6B] to-[#8B31FF]">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold">Flexibilidade</h3>
                </div>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#FF4B6B]"></div>
                    Horários flexíveis
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#8B31FF]"></div>
                    Agendamento online
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#31A8FF]"></div>
                    Reagendamento gratuito
                  </li>
                </ul>
              </div>

              <div className="bg-gray-800 rounded-xl p-8 transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 rounded-lg bg-gradient-to-r from-[#8B31FF] to-[#31A8FF]">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold">Confirmação</h3>
                </div>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#FF4B6B]"></div>
                    Confirmação por e-mail
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#8B31FF]"></div>
                    Lembrete por WhatsApp
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#31A8FF]"></div>
                    Instruções detalhadas
                  </li>
                </ul>
              </div>

              <div className="bg-gray-800 rounded-xl p-8 transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 rounded-lg bg-gradient-to-r from-[#31A8FF] to-[#FF4B6B]">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold">Preparação</h3>
                </div>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#FF4B6B]"></div>
                    Checklist prévio
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#8B31FF]"></div>
                    Requisitos técnicos
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#31A8FF]"></div>
                    Documentação necessária
                  </li>
                </ul>
              </div>
            </div>

            {/* Scheduling Steps */}
            <div className="bg-gray-800 rounded-xl p-8 mb-12">
              <h2 className="text-2xl font-bold mb-8 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-transparent bg-clip-text">
                Como Funciona o Agendamento?
              </h2>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="p-6 bg-gray-700/50 rounded-lg relative">
                  <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-[#FF4B6B] flex items-center justify-center text-lg font-bold">1</div>
                  <h3 className="font-semibold mb-3 mt-2">Escolha</h3>
                  <p className="text-gray-300 text-sm">
                    Selecione o serviço desejado e escolha a data e horário de sua preferência.
                  </p>
                </div>
                <div className="p-6 bg-gray-700/50 rounded-lg relative">
                  <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-[#8B31FF] flex items-center justify-center text-lg font-bold">2</div>
                  <h3 className="font-semibold mb-3 mt-2">Confirmação</h3>
                  <p className="text-gray-300 text-sm">
                    Nossa equipe confirmará a disponibilidade e enviará a confirmação.
                  </p>
                </div>
                <div className="p-6 bg-gray-700/50 rounded-lg relative">
                  <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-[#31A8FF] flex items-center justify-center text-lg font-bold">3</div>
                  <h3 className="font-semibold mb-3 mt-2">Preparação</h3>
                  <p className="text-gray-300 text-sm">
                    Você receberá um checklist com todos os requisitos necessários.
                  </p>
                </div>
                <div className="p-6 bg-gray-700/50 rounded-lg relative">
                  <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-[#FF4B6B] flex items-center justify-center text-lg font-bold">4</div>
                  <h3 className="font-semibold mb-3 mt-2">Lembrete</h3>
                  <p className="text-gray-300 text-sm">
                    No dia anterior, enviaremos um lembrete com todas as informações.
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-gray-800 rounded-xl p-8 mb-12">
              <h2 className="text-2xl font-bold mb-8 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-transparent bg-clip-text">
                Perguntas Frequentes
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Sobre o Agendamento</h3>
                  <ul className="space-y-6">
                    <li>
                      <h4 className="font-medium mb-2">Como posso reagendar?</h4>
                      <p className="text-gray-300 text-sm">
                        Você pode reagendar através do nosso site ou WhatsApp até 24 horas antes do horário marcado, sem custo adicional.
                      </p>
                    </li>
                    <li>
                      <h4 className="font-medium mb-2">Qual o prazo mínimo para agendamento?</h4>
                      <p className="text-gray-300 text-sm">
                        O prazo mínimo é de 4 horas de antecedência, sujeito à disponibilidade da nossa equipe.
                      </p>
                    </li>
                    <li>
                      <h4 className="font-medium mb-2">Posso escolher o técnico?</h4>
                      <p className="text-gray-300 text-sm">
                        Sim, você pode solicitar um técnico específico, sujeito à disponibilidade do profissional.
                      </p>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">Sobre o Atendimento</h3>
                  <ul className="space-y-6">
                    <li>
                      <h4 className="font-medium mb-2">Qual o tempo médio de atendimento?</h4>
                      <p className="text-gray-300 text-sm">
                        O tempo varia conforme o serviço, mas informamos uma estimativa no momento do agendamento.
                      </p>
                    </li>
                    <li>
                      <h4 className="font-medium mb-2">E se o serviço demorar mais que o previsto?</h4>
                      <p className="text-gray-300 text-sm">
                        Caso o serviço exceda o tempo estimado, você será consultado sobre a continuação.
                      </p>
                    </li>
                    <li>
                      <h4 className="font-medium mb-2">Vocês atendem fora do horário comercial?</h4>
                      <p className="text-gray-300 text-sm">
                        Sim, oferecemos atendimento 24/7, com valores diferenciados para horários especiais.
                      </p>
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
                Agendar Serviço
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
} 