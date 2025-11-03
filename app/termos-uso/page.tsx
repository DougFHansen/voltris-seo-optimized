"use client";

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdSenseBanner from '../components/AdSenseBanner';

export default function TermosUso() {
  return (
    <>
      <Header />
      <div className="pt-32 pb-20 bg-[#171313] min-h-screen">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FF4B6B] opacity-5 rounded-full filter blur-[100px]"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#8B31FF] opacity-5 rounded-full filter blur-[100px]"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 relative">
          <div className="text-center mb-12">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] flex items-center justify-center">
              <i className="fas fa-file-contract text-3xl text-white"></i>
            </div>
            <h1 className="text-4xl font-bold mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF]">
                Termos de Uso
              </span>
            </h1>
            <p className="text-gray-400">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>

          <div className="prose prose-invert max-w-none">
            <section className="mb-12 p-6 rounded-lg bg-[#1E1E1E] border border-white/10 hover:border-[#FF4B6B]/30 transition-colors duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-check-circle text-xl text-white"></i>
                </div>
                <h2 className="text-2xl font-semibold text-white m-0">1. Aceitação dos Termos</h2>
              </div>
              <p className="text-gray-300 mb-0">
                Ao acessar e utilizar os serviços da Voltris, você concorda com estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não deverá utilizar nossos serviços.
              </p>
            </section>

            <section className="mb-12 p-6 rounded-lg bg-[#1E1E1E] border border-white/10 hover:border-[#8B31FF]/30 transition-colors duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-tools text-xl text-white"></i>
                </div>
                <h2 className="text-2xl font-semibold text-white m-0">2. Descrição dos Serviços</h2>
              </div>
              <ul className="list-none pl-6 text-gray-300 space-y-2">
                {[
                  { icon: "laptop-code", text: "Suporte técnico remoto" },
                  { icon: "code", text: "Criação e manutenção de websites" },
                  { icon: "lightbulb", text: "Consultoria em tecnologia" },
                  { icon: "database", text: "Serviços de backup e recuperação de dados" },
                  { icon: "download", text: "Instalação e configuração de software" },
                  { icon: "cogs", text: "Outros serviços relacionados à tecnologia" }
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <i className={`fas fa-${item.icon} text-[#FF4B6B] w-5`}></i>
                    {item.text}
                  </li>
                ))}
              </ul>
            </section>

            <section className="mb-12 p-6 rounded-lg bg-[#1E1E1E] border border-white/10 hover:border-[#31A8FF]/30 transition-colors duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-user-shield text-xl text-white"></i>
                </div>
                <h2 className="text-2xl font-semibold text-white m-0">3. Responsabilidades do Usuário</h2>
              </div>
              <ul className="list-none pl-6 text-gray-300 space-y-2">
                {[
                  { icon: "check", text: "Fornecer informações verdadeiras e precisas" },
                  { icon: "key", text: "Manter suas credenciais de acesso seguras" },
                  { icon: "ban", text: "Não utilizar nossos serviços para fins ilegais" },
                  { icon: "exclamation-triangle", text: "Não interferir no funcionamento dos serviços" },
                  { icon: "copyright", text: "Respeitar os direitos de propriedade intelectual" },
                  { icon: "user-lock", text: "Não compartilhar acesso com terceiros" }
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <i className={`fas fa-${item.icon} text-[#8B31FF] w-5`}></i>
                    {item.text}
                  </li>
                ))}
              </ul>
            </section>

            <section className="mb-12 p-6 rounded-lg bg-[#1E1E1E] border border-white/10 hover:border-[#FF4B6B]/30 transition-colors duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-credit-card text-xl text-white"></i>
                </div>
                <h2 className="text-2xl font-semibold text-white m-0">4. Pagamentos e Reembolsos</h2>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-medium text-white mb-3 flex items-center gap-2">
                    <i className="fas fa-money-bill-wave text-[#FF4B6B]"></i>
                    4.1 Pagamentos
                  </h3>
                  <ul className="list-none pl-6 text-gray-300 space-y-2">
                    {[
                      { icon: "tag", text: "Os preços dos serviços são definidos em nosso site" },
                      { icon: "shield-alt", text: "Pagamentos são processados de forma segura" },
                      { icon: "file-invoice", text: "Faturas são emitidas eletronicamente" },
                      { icon: "credit-card", text: "Métodos de pagamento aceitos: cartão de crédito, PIX, boleto" }
                    ].map((item, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <i className={`fas fa-${item.icon} text-[#31A8FF] w-5`}></i>
                        {item.text}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-medium text-white mb-3 flex items-center gap-2">
                    <i className="fas fa-undo text-[#8B31FF]"></i>
                    4.2 Reembolsos
                  </h3>
                  <ul className="list-none pl-6 text-gray-300 space-y-2">
                    {[
                      { icon: "search", text: "Reembolsos são avaliados caso a caso" },
                      { icon: "clock", text: "Prazo de 7 dias para solicitação de reembolso" },
                      { icon: "percentage", text: "Reembolsos parciais podem ser aplicados" },
                      { icon: "calculator", text: "Taxas de processamento podem ser deduzidas" }
                    ].map((item, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <i className={`fas fa-${item.icon} text-[#FF4B6B] w-5`}></i>
                        {item.text}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-12 p-6 rounded-lg bg-[#1E1E1E] border border-white/10 hover:border-[#8B31FF]/30 transition-colors duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-copyright text-xl text-white"></i>
                </div>
                <h2 className="text-2xl font-semibold text-white m-0">5. Propriedade Intelectual</h2>
              </div>
              <ul className="list-none pl-6 text-gray-300 space-y-2">
                {[
                  { icon: "copy", text: "Copiar ou reproduzir o conteúdo" },
                  { icon: "edit", text: "Modificar ou criar obras derivadas" },
                  { icon: "share-alt", text: "Distribuir ou comercializar o conteúdo" },
                  { icon: "ban", text: "Utilizar o conteúdo para fins não autorizados" }
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <i className={`fas fa-${item.icon} text-[#31A8FF] w-5`}></i>
                    {item.text}
                  </li>
                ))}
              </ul>
            </section>

            <section className="mb-12 p-6 rounded-lg bg-[#1E1E1E] border border-white/10 hover:border-[#FF4B6B]/30 transition-colors duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-exclamation-triangle text-xl text-white"></i>
                </div>
                <h2 className="text-2xl font-semibold text-white m-0">6. Limitação de Responsabilidade</h2>
              </div>
              <ul className="list-none pl-6 text-gray-300 space-y-2">
                {[
                  { icon: "times-circle", text: "Danos indiretos ou consequenciais" },
                  { icon: "database", text: "Perda de dados ou lucros" },
                  { icon: "pause-circle", text: "Interrupção dos serviços" },
                  { icon: "users", text: "Ações de terceiros" },
                  { icon: "laptop", text: "Problemas de hardware ou software do usuário" }
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <i className={`fas fa-${item.icon} text-[#8B31FF] w-5`}></i>
                    {item.text}
                  </li>
                ))}
              </ul>
            </section>

            <section className="mb-12 p-6 rounded-lg bg-[#1E1E1E] border border-white/10 hover:border-[#31A8FF]/30 transition-colors duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-power-off text-xl text-white"></i>
                </div>
                <h2 className="text-2xl font-semibold text-white m-0">7. Rescisão</h2>
              </div>
              <ul className="list-none pl-6 text-gray-300 space-y-2">
                {[
                  { icon: "gavel", text: "Por violação destes termos" },
                  { icon: "user-times", text: "Por solicitação sua" },
                  { icon: "user-cog", text: "Por decisão administrativa" },
                  { icon: "shield-alt", text: "Por motivos de segurança" }
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <i className={`fas fa-${item.icon} text-[#FF4B6B] w-5`}></i>
                    {item.text}
                  </li>
                ))}
              </ul>
            </section>

            <section className="mb-12 p-6 rounded-lg bg-[#1E1E1E] border border-white/10 hover:border-[#8B31FF]/30 transition-colors duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-balance-scale text-xl text-white"></i>
                </div>
                <h2 className="text-2xl font-semibold text-white m-0">8. Disposições Gerais</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <i className="fas fa-gavel text-[#FF4B6B] w-5"></i>
                  <h3 className="text-xl font-medium text-white m-0">8.1 Lei Aplicável</h3>
                </div>
                <p className="text-gray-300">
                  Estes termos são regidos pelas leis do Brasil.
                </p>

                <div className="flex items-center gap-2">
                  <i className="fas fa-map-marker-alt text-[#8B31FF] w-5"></i>
                  <h3 className="text-xl font-medium text-white m-0">8.2 Foro</h3>
                </div>
                <p className="text-gray-300">
                  Qualquer disputa será submetida ao foro de São Paulo, SP.
                </p>

                <div className="flex items-center gap-2">
                  <i className="fas fa-handshake text-[#31A8FF] w-5"></i>
                  <h3 className="text-xl font-medium text-white m-0">8.3 Tolerância</h3>
                </div>
                <p className="text-gray-300">
                  A não exigência de qualquer direito não constitui renúncia.
                </p>
              </div>
            </section>

            <section className="mb-12 p-6 rounded-lg bg-[#1E1E1E] border border-white/10 hover:border-[#FF4B6B]/30 transition-colors duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-sync-alt text-xl text-white"></i>
                </div>
                <h2 className="text-2xl font-semibold text-white m-0">9. Alterações nos Termos</h2>
              </div>
              <p className="text-gray-300 mb-0">
                Reservamo-nos o direito de modificar estes termos a qualquer momento. Alterações significativas serão notificadas através do site ou por e-mail.
              </p>
            </section>

            <section className="mb-12 p-6 rounded-lg bg-[#1E1E1E] border border-white/10 hover:border-[#8B31FF]/30 transition-colors duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-envelope text-xl text-white"></i>
                </div>
                <h2 className="text-2xl font-semibold text-white m-0">10. Contato</h2>
              </div>
              <ul className="list-none pl-6 text-gray-300 space-y-2">
                {[
                  { icon: "envelope", text: "contato@voltris.com.br" },
                  { icon: "phone", text: "(11) 99671-6235" },
                  { icon: "map-marker-alt", text: "São Paulo, SP" }
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <i className={`fas fa-${item.icon} text-[#31A8FF] w-5`}></i>
                    {item.text}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
      <AdSenseBanner />
      <Footer />
    </>
  );
} 