'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  FaFileContract, FaCheckCircle, FaTools, FaUserShield, FaCreditCard, FaCopyright,
  FaExclamationTriangle, FaPowerOff, FaBalanceScale, FaSyncAlt, FaEnvelope, FaLaptopCode,
  FaCode, FaLightbulb, FaDatabase, FaDownload, FaCogs, FaCheck, FaKey, FaBan, FaUserLock,
  FaMoneyBillWave, FaTag, FaShieldAlt, FaFileInvoice, FaUndo, FaSearch, FaClock,
  FaPercentage, FaCalculator, FaCopy, FaEdit, FaShareAlt, FaTimesCircle, FaPauseCircle,
  FaUsers, FaLaptop, FaGavel, FaUserTimes, FaUserCog, FaMapMarkerAlt, FaHandshake, FaPhone
} from 'react-icons/fa';

export default function TermosUso() {
  return (
    <>
      <Header />
      <div className="pt-32 pb-20 bg-gray-50 min-h-screen relative overflow-hidden font-sans">
        {/* Background Ambience */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-200/30 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-purple-200/30 rounded-full blur-[120px]"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E')] opacity-5 hidden md:block"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-md">
              <FaFileContract className="text-4xl text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 tracking-tight">
              Termos de Uso
            </h1>
            <p className="text-gray-600 font-medium bg-white border border-gray-200 rounded-full px-6 py-2 inline-block shadow-sm">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>

          <div className="space-y-8">
            {/* Seção 1 */}
            <section className="p-8 rounded-3xl bg-white backdrop-blur-xl border border-gray-200 hover:border-blue-300 transition-all duration-500 group shadow-sm">
              <div className="flex items-center gap-5 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600 group-hover:scale-110 transition-transform">
                  <FaCheckCircle className="text-2xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 m-0">1. Aceitação dos Termos</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">
                Ao acessar e utilizar os serviços da Voltris, você concorda com estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não deverá utilizar nossos serviços.
              </p>
            </section>

            {/* Seção 2 */}
            <section className="p-8 rounded-3xl bg-white backdrop-blur-xl border border-gray-200 hover:border-purple-300 transition-all duration-500 group shadow-sm">
              <div className="flex items-center gap-5 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center flex-shrink-0 text-purple-600 group-hover:scale-110 transition-transform">
                  <FaTools className="text-2xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 m-0">2. Descrição dos Serviços</h2>
              </div>
              <ul className="grid md:grid-cols-2 gap-3">
                {[
                  { icon: FaLaptopCode, text: "Suporte técnico remoto" },
                  { icon: FaCode, text: "Criação e manutenção de websites" },
                  { icon: FaLightbulb, text: "Consultoria em tecnologia" },
                  { icon: FaDatabase, text: "Serviços de backup e recuperação" },
                  { icon: FaDownload, text: "Instalação e configuração de software" },
                  { icon: FaCogs, text: "Outros serviços tecnológicos" }
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3 text-gray-700 bg-gray-100 p-3 rounded-xl hover:bg-gray-200 transition-colors">
                    <item.icon className="text-blue-600 w-5 h-5 flex-shrink-0" />
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Seção 3 */}
            <section className="p-8 rounded-3xl bg-white backdrop-blur-xl border border-gray-200 hover:border-pink-300 transition-all duration-500 group shadow-sm">
              <div className="flex items-center gap-5 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-pink-100 flex items-center justify-center flex-shrink-0 text-pink-600 group-hover:scale-110 transition-transform">
                  <FaUserShield className="text-2xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 m-0">3. Responsabilidades</h2>
              </div>
              <ul className="grid md:grid-cols-2 gap-3">
                {[
                  { icon: FaCheck, text: "Informações verdadeiras e precisas" },
                  { icon: FaKey, text: "Segurança das credenciais" },
                  { icon: FaBan, text: "Uso legal dos serviços" },
                  { icon: FaExclamationTriangle, text: "Não interferência no sistema" },
                  { icon: FaCopyright, text: "Respeito à propriedade intelectual" },
                  { icon: FaUserLock, text: "Não compartilhamento de acesso" }
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3 text-gray-700 bg-gray-100 p-3 rounded-xl hover:bg-gray-200 transition-colors">
                    <item.icon className="text-pink-600 w-5 h-5 flex-shrink-0" />
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Seção 4 (Pagamentos) */}
            <section className="p-8 rounded-3xl bg-white backdrop-blur-xl border border-gray-200 hover:border-blue-300 transition-all duration-500 group shadow-sm">
              <div className="flex items-center gap-5 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600 group-hover:scale-110 transition-transform">
                  <FaCreditCard className="text-2xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 m-0">4. Pagamentos e Reembolsos</h2>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-100 p-6 rounded-2xl border border-gray-200">
                  <h3 className="text-gray-900 font-bold mb-4 flex gap-2 items-center"><FaMoneyBillWave className="text-emerald-500" /> 4.1 Pagamentos</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex gap-2"><FaTag /> Preços definidos no site</li>
                    <li className="flex gap-2"><FaShieldAlt /> Processamento seguro</li>
                    <li className="flex gap-2"><FaFileInvoice /> Faturas eletrônicas</li>
                    <li className="flex gap-2"><FaCreditCard /> Cartão, PIX, Boleto</li>
                  </ul>
                </div>
                <div className="bg-gray-100 p-6 rounded-2xl border border-gray-200">
                  <h3 className="text-gray-900 font-bold mb-4 flex gap-2 items-center"><FaUndo className="text-pink-600" /> 4.2 Reembolsos</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex gap-2"><FaSearch /> Avaliação caso a caso</li>
                    <li className="flex gap-2"><FaClock /> Prazo de 7 dias</li>
                    <li className="flex gap-2"><FaPercentage /> Reembolsos parciais possíveis</li>
                    <li className="flex gap-2"><FaCalculator /> Taxas podem ser deduzidas</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Seções Resumidas em Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* 5. Propriedade Intelectual */}
              <section className="p-8 rounded-3xl bg-white backdrop-blur-xl border border-gray-200 hover:border-purple-300 transition-all duration-500 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex gap-3 items-center"><FaCopyright className="text-purple-600" /> 5. Propriedade Intelectual</h2>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex gap-2 items-center"><FaBan /> Proibido copiar ou reproduzir</li>
                  <li className="flex gap-2 items-center"><FaEdit /> Proibido obras derivadas</li>
                  <li className="flex gap-2 items-center"><FaShareAlt /> Proibido distribuição comercial</li>
                </ul>
              </section>

              {/* 6. Limitação de Resp. */}
              <section className="p-8 rounded-3xl bg-white backdrop-blur-xl border border-gray-200 hover:border-pink-300 transition-all duration-500 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex gap-3 items-center"><FaExclamationTriangle className="text-pink-600" /> 6. Limitação</h2>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex gap-2 items-center"><FaTimesCircle /> Danos indiretos</li>
                  <li className="flex gap-2 items-center"><FaDatabase /> Perda de dados</li>
                  <li className="flex gap-2 items-center"><FaPauseCircle /> Interrupção de serviços</li>
                </ul>
              </section>

              {/* 7. Rescisão */}
              <section className="p-8 rounded-3xl bg-white backdrop-blur-xl border border-gray-200 hover:border-blue-300 transition-all duration-500 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex gap-3 items-center"><FaPowerOff className="text-blue-600" /> 7. Rescisão</h2>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex gap-2 items-center"><FaGavel /> Por violação de termos</li>
                  <li className="flex gap-2 items-center"><FaUserTimes /> Por solicitação do usuário</li>
                </ul>
              </section>

              {/* 8. Disposições Gerais */}
              <section className="p-8 rounded-3xl bg-white backdrop-blur-xl border border-gray-200 hover:border-purple-300 transition-all duration-500 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex gap-3 items-center"><FaBalanceScale className="text-purple-600" /> 8. Disposições</h2>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex gap-2 items-center"><FaGavel /> Leis do Brasil</li>
                  <li className="flex gap-2 items-center"><FaMapMarkerAlt /> Foro de São Paulo, SP</li>
                  <li className="flex gap-2 items-center"><FaHandshake /> Tolerância não é renúncia</li>
                </ul>
              </section>
            </div>

            <section className="p-8 rounded-3xl bg-white backdrop-blur-xl border border-gray-200 text-center mt-8 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-2 flex justify-center gap-3 items-center"><FaEnvelope /> Contato</h2>
              <p className="text-gray-600 text-sm">contato@voltris.com.br • (11) 99671-6235</p>
              <div className="mt-4 pt-4 border-t border-gray-200 mx-auto max-w-xs">
                <p className="text-xs text-gray-500"><FaSyncAlt className="inline mr-1" /> Termos sujeitos a alterações.</p>
              </div>
            </section>

          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
