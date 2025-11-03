"use client";

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdSenseBanner from '../components/AdSenseBanner';

export default function PoliticaPrivacidade() {
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
              <i className="fas fa-user-shield text-3xl text-white"></i>
            </div>
            <h1 className="text-4xl font-bold mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF]">
                Política de Privacidade
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
                  <i className="fas fa-info-circle text-xl text-white"></i>
                </div>
                <h2 className="text-2xl font-semibold text-white m-0">1. Introdução</h2>
              </div>
              <p className="text-gray-300 mb-0">
                A Voltris está comprometida em proteger sua privacidade. Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas informações pessoais quando você utiliza nossos serviços de suporte técnico remoto.
              </p>
            </section>

            <section className="mb-12 p-6 rounded-lg bg-[#1E1E1E] border border-white/10 hover:border-[#8B31FF]/30 transition-colors duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-database text-xl text-white"></i>
                </div>
                <h2 className="text-2xl font-semibold text-white m-0">2. Informações que Coletamos</h2>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-medium text-white mb-3 flex items-center gap-2">
                    <i className="fas fa-user text-[#FF4B6B]"></i>
                    2.1 Informações Pessoais
                  </h3>
                  <ul className="list-none pl-6 text-gray-300 space-y-2">
                    {[
                      { icon: "user", text: "Nome completo" },
                      { icon: "envelope", text: "Endereço de e-mail" },
                      { icon: "phone", text: "Número de telefone" },
                      { icon: "map-marker-alt", text: "Endereço físico" },
                      { icon: "credit-card", text: "Informações de pagamento" }
                    ].map((item, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <i className={`fas fa-${item.icon} text-[#8B31FF] w-5`}></i>
                        {item.text}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-medium text-white mb-3 flex items-center gap-2">
                    <i className="fas fa-laptop text-[#31A8FF]"></i>
                    2.2 Informações Técnicas
                  </h3>
                  <ul className="list-none pl-6 text-gray-300 space-y-2">
                    {[
                      { icon: "network-wired", text: "Endereço IP" },
                      { icon: "globe", text: "Tipo de navegador" },
                      { icon: "desktop", text: "Sistema operacional" },
                      { icon: "memory", text: "Informações de hardware" },
                      { icon: "history", text: "Logs de acesso" }
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

            <section className="mb-12 p-6 rounded-lg bg-[#1E1E1E] border border-white/10 hover:border-[#31A8FF]/30 transition-colors duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-cogs text-xl text-white"></i>
                </div>
                <h2 className="text-2xl font-semibold text-white m-0">3. Uso das Informações</h2>
              </div>
              <ul className="list-none pl-6 text-gray-300 space-y-2">
                {[
                  { icon: "check-circle", text: "Fornecer e manter nossos serviços" },
                  { icon: "credit-card", text: "Processar pagamentos e transações" },
                  { icon: "envelope", text: "Enviar comunicações importantes" },
                  { icon: "chart-line", text: "Melhorar nossos serviços" },
                  { icon: "shield-alt", text: "Prevenir fraudes e garantir a segurança" },
                  { icon: "gavel", text: "Cumprir obrigações legais" }
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
                  <i className="fas fa-handshake text-xl text-white"></i>
                </div>
                <h2 className="text-2xl font-semibold text-white m-0">4. Compartilhamento de Dados</h2>
              </div>
              <ul className="list-none pl-6 text-gray-300 space-y-2">
                {[
                  { icon: "users", text: "Prestadores de serviços" },
                  { icon: "handshake", text: "Parceiros comerciais" },
                  { icon: "building", text: "Autoridades governamentais" },
                  { icon: "sitemap", text: "Empresas do mesmo grupo econômico" }
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <i className={`fas fa-${item.icon} text-[#31A8FF] w-5`}></i>
                    {item.text}
                  </li>
                ))}
              </ul>
            </section>

            <section className="mb-12 p-6 rounded-lg bg-[#1E1E1E] border border-white/10 hover:border-[#8B31FF]/30 transition-colors duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-cookie text-xl text-white"></i>
                </div>
                <h2 className="text-2xl font-semibold text-white m-0">5. Cookies e Tecnologias Similares</h2>
              </div>
              <ul className="list-none pl-6 text-gray-300 space-y-2">
                {[
                  { icon: "shield-alt", text: "Cookies essenciais" },
                  { icon: "tachometer-alt", text: "Cookies de desempenho" },
                  { icon: "cogs", text: "Cookies de funcionalidade" },
                  { icon: "ad", text: "Cookies de publicidade" }
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
                  <i className="fas fa-lock text-xl text-white"></i>
                </div>
                <h2 className="text-2xl font-semibold text-white m-0">6. Segurança dos Dados</h2>
              </div>
              <ul className="list-none pl-6 text-gray-300 space-y-2">
                {[
                  { icon: "key", text: "Criptografia de dados" },
                  { icon: "user-lock", text: "Controle de acesso" },
                  { icon: "eye", text: "Monitoramento de segurança" },
                  { icon: "save", text: "Backup regular" },
                  { icon: "graduation-cap", text: "Treinamento de funcionários" }
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
                  <i className="fas fa-envelope text-xl text-white"></i>
                </div>
                <h2 className="text-2xl font-semibold text-white m-0">7. Contato</h2>
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

            <section className="mb-12 p-6 rounded-lg bg-[#1E1E1E] border border-white/10 hover:border-[#8B31FF]/30 transition-colors duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-sync-alt text-xl text-white"></i>
                </div>
                <h2 className="text-2xl font-semibold text-white m-0">8. Alterações na Política</h2>
              </div>
              <p className="text-gray-300 mb-0">
                Reservamo-nos o direito de modificar esta política a qualquer momento. Alterações significativas serão notificadas através do site ou por e-mail.
              </p>
            </section>
          </div>
        </div>
      </div>
      <AdSenseBanner />
      <Footer />
    </>
  );
} 