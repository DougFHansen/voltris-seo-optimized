'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  FaUndoAlt, FaCalendarCheck, FaBan, FaHandHoldingUsd, FaFileContract, FaCheckCircle,
  FaExclamationCircle, FaShieldAlt, FaEnvelope, FaClock, FaHistory, FaGavel
} from 'react-icons/fa';

export default function ReembolsoCancelamento() {
  const lastUpdate = new Date().toLocaleDateString('pt-BR');

  return (
    <>
      <Header />
      <div className="pt-32 pb-20 bg-gray-50 min-h-screen relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-200/30 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-purple-200/30 rounded-full blur-[120px]"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 hidden md:block"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-md">
              <FaUndoAlt className="text-4xl text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 tracking-tight leading-tight">
              Política de Reembolso <br /><span className="text-blue-600">e Cancelamento</span>
            </h1>
            <p className="text-gray-600 font-medium bg-white border border-gray-200 rounded-full px-6 py-2 inline-block shadow-sm">
              Última atualização: {lastUpdate}
            </p>
          </div>

          <div className="grid gap-8">
            {/* Introdução */}
            <section className="p-8 rounded-3xl bg-white backdrop-blur-xl border border-gray-200 hover:border-blue-300 transition-all duration-500 group shadow-sm">
              <div className="flex items-center gap-5 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600 group-hover:scale-110 transition-transform">
                  <FaShieldAlt className="text-2xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 m-0">Compromisso Voltris</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">
                Nossa política de reembolso e cancelamento foi desenvolvida para garantir a sua total satisfação e transparência, em conformidade com o <strong>Código de Defesa do Consumidor (CDC)</strong> e as melhores práticas do mercado de software.
              </p>
            </section>

            {/* Sobre os Produtos e Serviços - REQUISITO STRIPE */}
            <section className="p-8 rounded-3xl bg-white backdrop-blur-xl border border-gray-200 hover:border-purple-300 transition-all duration-500 group shadow-sm">
              <div className="flex items-center gap-5 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center flex-shrink-0 text-purple-600 group-hover:scale-110 transition-transform">
                  <FaFileContract className="text-2xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 m-0">Sobre os Produtos e Serviços</h2>
              </div>
              <div className="space-y-4 text-gray-600">
                <p>
                  A <strong>VOLTRIS</strong> comercializa licenças de software para o aplicativo <strong>Voltris Optimizer</strong>, uma ferramenta digital de otimização de sistemas Windows focada em melhorar o desempenho, reduzir a latência e aumentar a produtividade computacional.
                </p>
                <p>
                  Oferecemos também serviços especializados de suporte técnico remoto para diagnóstico e otimização de hardware e software. Todos os nossos produtos são entregues de forma 100% digital, por meio de e-mail e download direto no nosso site oficial.
                </p>
              </div>
            </section>

            {/* Direito de Arrependimento */}
            <section className="p-8 rounded-3xl bg-white backdrop-blur-xl border border-gray-200 border-l-4 border-l-emerald-500 hover:border-purple-300 transition-all duration-500 group shadow-sm">
              <div className="flex items-center gap-5 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center flex-shrink-0 text-emerald-600 group-hover:scale-110 transition-transform">
                  <FaCalendarCheck className="text-2xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 m-0">1. Direito de Arrependimento</h2>
              </div>
              <div className="space-y-4 text-gray-600">
                <p>
                  De acordo com o Artigo 49 do Código de Defesa do Consumidor, para compras realizadas pela internet, o consumidor tem o prazo de <strong>7 (sete) dias corridos</strong>, a contar da data de recebimento do produto ou assinatura do serviço, para desistir da compra.
                </p>
                <div className="bg-gray-100 p-6 rounded-2xl border border-gray-200 space-y-3">
                  <p className="flex items-center gap-3 text-gray-900 font-bold"><FaCheckCircle className="text-emerald-500" /> Reembolso de 100% do valor pago.</p>
                  <p className="flex items-center gap-3 text-gray-900 font-bold"><FaCheckCircle className="text-emerald-500" /> Sem necessidade de justificativa.</p>
                  <p className="flex items-center gap-3 text-gray-900 font-bold"><FaCheckCircle className="text-emerald-500" /> Cancelamento imediato da licença.</p>
                </div>
              </div>
            </section>

            {/* Condições para Reembolso de Software */}
            <section className="p-8 rounded-3xl bg-white backdrop-blur-xl border border-gray-200 hover:border-pink-300 transition-all duration-500 group shadow-sm">
              <div className="flex items-center gap-5 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-pink-100 flex items-center justify-center flex-shrink-0 text-pink-600 group-hover:scale-110 transition-transform">
                  <FaFileContract className="text-2xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 m-0">2. Regras Adicionais de Software</h2>
              </div>
              <div className="space-y-4 text-gray-600">
                <p>Como vendemos bens digitais (licenças de ativação), o reembolso após o período de 7 dias é analisado caso a caso, seguindo as diretrizes:</p>
                <ul className="space-y-4">
                  <li className="flex gap-4 p-4 rounded-2xl bg-gray-100 border border-gray-200">
                    <FaBan className="text-pink-600 mt-1 shrink-0" />
                    <div>
                      <strong className="text-gray-900 block">Licença já Ativada</strong>
                      <span className="text-sm text-gray-500">Após os 7 dias iniciais, se a licença já tiver sido ativada e vinculada a um hardware, o reembolso não poderá ser processado a menos que haja falha técnica comprovada no produto.</span>
                    </div>
                  </li>
                  <li className="flex gap-4 p-4 rounded-2xl bg-gray-100 border border-gray-200">
                    <FaExclamationCircle className="text-blue-600 mt-1 shrink-0" />
                    <div>
                      <strong className="text-gray-900 block">Erros Técnicos</strong>
                      <span className="text-sm text-gray-500">Caso o software apresente incompatibilidade grave que impossibilite o uso e nosso suporte técnico não consiga resolver em até 48 horas úteis, o reembolso poderá ser solicitado a qualquer momento.</span>
                    </div>
                  </li>
                </ul>
              </div>
            </section>

            {/* Processo de Reembolso */}
            <section className="p-8 rounded-3xl bg-white backdrop-blur-xl border border-gray-200 hover:border-purple-300 transition-all duration-500 group shadow-sm">
              <div className="flex items-center gap-5 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center flex-shrink-0 text-purple-600 group-hover:scale-110 transition-transform">
                  <FaHandHoldingUsd className="text-2xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 m-0">3. Processo e Prazos</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-gray-100 border border-gray-200">
                  <h4 className="text-gray-900 font-bold mb-3 flex items-center gap-2"><FaEnvelope className="text-blue-600" /> Como solicitar</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">Envie um e-mail para <strong>contato@voltris.com.br</strong> com o título "Solicitação de Reembolso" informando o seu e-mail de compra ou número do pedido.</p>
                </div>
                <div className="p-6 rounded-2xl bg-gray-100 border border-gray-200">
                  <h4 className="text-gray-900 font-bold mb-3 flex items-center gap-2"><FaClock className="text-purple-600" /> Prazo de Estorno</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">Após aprovado, o estorno no cartão de crédito pode levar de 1 a 2 faturas dependendo do seu banco. Pix é estornado em até 24h.</p>
                </div>
              </div>
            </section>

            {/* Cancelamento de Assinatura */}
            <section className="p-8 rounded-3xl bg-white backdrop-blur-xl border border-gray-200 hover:border-pink-300 transition-all duration-500 group shadow-sm">
              <div className="flex items-center gap-5 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-pink-100 flex items-center justify-center flex-shrink-0 text-pink-600 group-hover:scale-110 transition-transform">
                  <FaBan className="text-2xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 m-0">4. Cancelamento de Planos</h2>
              </div>
              <div className="space-y-4 text-gray-600">
                <p>Para planos recorrentes (assinaturas), você pode cancelar a renovação a qualquer momento através do seu painel de controle:</p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-3"><FaHistory className="text-purple-600" /> O acesso continua ativo até o fim do período já pago.</li>
                  <li className="flex items-center gap-3"><FaBan className="text-pink-600" /> Não há multas por cancelamento de renovação.</li>
                  <li className="flex items-center gap-3"><FaGavel className="text-blue-600" /> Reservamo-nos o direito de cancelar licenças em casos de fraude comprovada.</li>
                </ul>
              </div>
            </section>

          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
