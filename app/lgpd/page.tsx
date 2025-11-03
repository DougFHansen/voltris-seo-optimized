"use client";

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdSenseBanner from '../components/AdSenseBanner';

export default function LGPD() {
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
              <i className="fas fa-shield-alt text-3xl text-white"></i>
            </div>
            <h1 className="text-4xl font-bold mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF]">
                Lei Geral de Proteção de Dados
              </span>
            </h1>
            <p className="text-gray-400">
              Lei nº 13.709/2018 - Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>

          <div className="prose prose-invert max-w-none">
            <section className="mb-12 p-6 rounded-lg bg-[#1E1E1E] border border-white/10 hover:border-[#FF4B6B]/30 transition-colors duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-info-circle text-xl text-white"></i>
                </div>
                <h2 className="text-2xl font-semibold text-white m-0">1. O que é a LGPD?</h2>
              </div>
              <p className="text-gray-300 mb-0">
                A Lei Geral de Proteção de Dados (LGPD) é a legislação brasileira que regula as atividades de tratamento de dados pessoais. Ela foi criada para proteger os direitos fundamentais de liberdade e de privacidade dos cidadãos, estabelecendo regras claras sobre coleta, armazenamento, tratamento e compartilhamento de dados pessoais.
              </p>
            </section>

            <section className="mb-12 p-6 rounded-lg bg-[#1E1E1E] border border-white/10 hover:border-[#8B31FF]/30 transition-colors duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-user-shield text-xl text-white"></i>
                </div>
                <h2 className="text-2xl font-semibold text-white m-0">2. Direitos do Titular dos Dados</h2>
              </div>
              <ul className="list-none pl-6 text-gray-300 space-y-2">
                {[
                  { icon: "eye", text: "Confirmação da existência de tratamento" },
                  { icon: "edit", text: "Acesso aos dados" },
                  { icon: "trash-alt", text: "Correção de dados incompletos ou desatualizados" },
                  { icon: "user-secret", text: "Anonimização, bloqueio ou eliminação de dados desnecessários" },
                  { icon: "exchange-alt", text: "Portabilidade dos dados" },
                  { icon: "info-circle", text: "Informação sobre compartilhamento" },
                  { icon: "undo", text: "Revogação do consentimento" }
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
                  <i className="fas fa-gavel text-xl text-white"></i>
                </div>
                <h2 className="text-2xl font-semibold text-white m-0">3. Bases Legais para Tratamento</h2>
              </div>
              <ul className="list-none pl-6 text-gray-300 space-y-2">
                {[
                  { icon: "check-circle", text: "Consentimento do titular" },
                  { icon: "file-contract", text: "Cumprimento de obrigação legal" },
                  { icon: "building", text: "Execução de políticas públicas" },
                  { icon: "search", text: "Estudos por órgão de pesquisa" },
                  { icon: "shield-alt", text: "Exercício regular de direitos" },
                  { icon: "handshake", text: "Proteção ao crédito" }
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
                  <i className="fas fa-lock text-xl text-white"></i>
                </div>
                <h2 className="text-2xl font-semibold text-white m-0">4. Medidas de Segurança</h2>
              </div>
              <ul className="list-none pl-6 text-gray-300 space-y-2">
                {[
                  { icon: "key", text: "Criptografia de dados" },
                  { icon: "user-lock", text: "Controle de acesso" },
                  { icon: "eye", text: "Monitoramento de segurança" },
                  { icon: "save", text: "Backup regular" },
                  { icon: "graduation-cap", text: "Treinamento de funcionários" },
                  { icon: "shield-alt", text: "Políticas de segurança" }
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
                  <i className="fas fa-exclamation-triangle text-xl text-white"></i>
                </div>
                <h2 className="text-2xl font-semibold text-white m-0">5. Sanções Administrativas</h2>
              </div>
              <ul className="list-none pl-6 text-gray-300 space-y-2">
                {[
                  { icon: "money-bill-wave", text: "Multa de até 2% do faturamento" },
                  { icon: "ban", text: "Suspensão do exercício da atividade" },
                  { icon: "gavel", text: "Proibição parcial ou total do exercício de atividades" },
                  { icon: "exclamation-circle", text: "Publicização da infração" }
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
                  <i className="fas fa-envelope text-xl text-white"></i>
                </div>
                <h2 className="text-2xl font-semibold text-white m-0">6. Contato</h2>
              </div>
              <ul className="list-none pl-6 text-gray-300 space-y-2">
                {[
                  { icon: "envelope", text: "contato@voltris.com.br" },
                  { icon: "phone", text: "(11) 99671-6235" },
                  { icon: "map-marker-alt", text: "São Paulo, SP" }
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <i className={`fas fa-${item.icon} text-[#8B31FF] w-5`}></i>
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