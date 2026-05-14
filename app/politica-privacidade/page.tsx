'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  FaUserShield, FaInfoCircle, FaDatabase, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCreditCard,
  FaLaptop, FaNetworkWired, FaGlobe, FaDesktop, FaMemory, FaHistory, FaCogs, FaCheckCircle,
  FaChartLine, FaShieldAlt, FaGavel, FaHandshake, FaBuilding, FaSitemap, FaCookie, FaTachometerAlt,
  FaAd, FaCookieBite, FaEye, FaLink, FaHandPointer, FaCog, FaExternalLinkAlt, FaLock, FaUserLock,
  FaSave, FaGraduationCap, FaExclamationTriangle, FaSyncAlt
} from 'react-icons/fa';

export default function PoliticaPrivacidade() {
  return (
    <>
      <Header />
      <div className="pt-32 pb-20 bg-gray-50 min-h-screen relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-pink-200/30 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-200/30 rounded-full blur-[120px]"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E')] opacity-5 hidden md:block"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-pink-600 via-purple-600 to-blue-600 flex items-center justify-center shadow-md">
              <FaUserShield className="text-4xl text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 tracking-tight">
              Política de Privacidade
            </h1>
            <p className="text-gray-600 font-medium bg-white border border-gray-200 rounded-full px-6 py-2 inline-block shadow-sm">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>

          <div className="space-y-8">
            {/* Seção 1 */}
            <section className="p-8 rounded-3xl bg-white backdrop-blur-xl border border-gray-200 hover:border-pink-300 transition-all duration-500 group shadow-sm">
              <div className="flex items-center gap-5 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-pink-100 flex items-center justify-center flex-shrink-0 text-pink-600 group-hover:scale-110 transition-transform">
                  <FaInfoCircle className="text-2xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 m-0">1. Introdução</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">
                A Voltris está comprometida em proteger sua privacidade. Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas informações pessoais quando você utiliza nossos serviços de suporte técnico remoto.
              </p>
            </section>

            {/* Seção 2 */}
            <section className="p-8 rounded-3xl bg-white backdrop-blur-xl border border-gray-200 hover:border-purple-300 transition-all duration-500 group shadow-sm">
              <div className="flex items-center gap-5 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center flex-shrink-0 text-purple-600 group-hover:scale-110 transition-transform">
                  <FaDatabase className="text-2xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 m-0">2. Informações que Coletamos</h2>
              </div>

              <div className="space-y-8">
                <div className="bg-gray-100 p-6 rounded-2xl border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                    <FaUser className="text-pink-600" /> 2.1 Informações Pessoais
                  </h3>
                  <ul className="grid md:grid-cols-2 gap-3">
                    {[
                      { icon: FaUser, text: "Nome completo" },
                      { icon: FaEnvelope, text: "Endereço de e-mail" },
                      { icon: FaPhone, text: "Número de telefone" },
                      { icon: FaMapMarkerAlt, text: "Endereço físico" },
                      { icon: FaCreditCard, text: "Informações de pagamento" }
                    ].map((item, index) => (
                      <li key={index} className="flex items-center gap-3 text-gray-700 bg-white p-3 rounded-xl hover:bg-gray-200 transition-colors">
                        <item.icon className="text-purple-600 w-5 h-5 flex-shrink-0" />
                        <span>{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gray-100 p-6 rounded-2xl border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                    <FaLaptop className="text-blue-600" /> 2.2 Informações Técnicas
                  </h3>
                  <ul className="grid md:grid-cols-2 gap-3">
                    {[
                      { icon: FaNetworkWired, text: "Endereço IP" },
                      { icon: FaGlobe, text: "Tipo de navegador" },
                      { icon: FaDesktop, text: "Sistema operacional" },
                      { icon: FaMemory, text: "Informações de hardware" },
                      { icon: FaHistory, text: "Logs de acesso" }
                    ].map((item, index) => (
                      <li key={index} className="flex items-center gap-3 text-gray-700 bg-white p-3 rounded-xl hover:bg-gray-200 transition-colors">
                        <item.icon className="text-pink-600 w-5 h-5 flex-shrink-0" />
                        <span>{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Seção 3 */}
            <section className="p-8 rounded-3xl bg-white backdrop-blur-xl border border-gray-200 hover:border-blue-300 transition-all duration-500 group shadow-sm">
              <div className="flex items-center gap-5 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600 group-hover:scale-110 transition-transform">
                  <FaCogs className="text-2xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 m-0">3. Uso das Informações</h2>
              </div>
              <ul className="grid md:grid-cols-2 gap-3">
                {[
                  { icon: FaCheckCircle, text: "Fornecer e manter nossos serviços" },
                  { icon: FaCreditCard, text: "Processar pagamentos e transações" },
                  { icon: FaEnvelope, text: "Enviar comunicações importantes" },
                  { icon: FaChartLine, text: "Melhorar nossos serviços" },
                  { icon: FaShieldAlt, text: "Prevenir fraudes e garantir a segurança" },
                  { icon: FaGavel, text: "Cumprir obrigações legais" }
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3 text-gray-700 bg-gray-100 p-3 rounded-xl hover:bg-gray-200 transition-colors">
                    <item.icon className="text-purple-600 w-5 h-5 flex-shrink-0" />
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Seção 4 */}
            <section className="p-8 rounded-3xl bg-white backdrop-blur-xl border border-gray-200 hover:border-pink-300 transition-all duration-500 group shadow-sm">
              <div className="flex items-center gap-5 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-pink-100 flex items-center justify-center flex-shrink-0 text-pink-600 group-hover:scale-110 transition-transform">
                  <FaHandshake className="text-2xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 m-0">4. Compartilhamento de Dados</h2>
              </div>
              <ul className="grid md:grid-cols-2 gap-3">
                {[
                  { icon: FaUser, text: "Prestadores de serviços" },
                  { icon: FaHandshake, text: "Parceiros comerciais" },
                  { icon: FaBuilding, text: "Autoridades governamentais" },
                  { icon: FaSitemap, text: "Empresas do mesmo grupo econômico" }
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3 text-gray-700 bg-gray-100 p-3 rounded-xl hover:bg-gray-200 transition-colors">
                    <item.icon className="text-blue-600 w-5 h-5 flex-shrink-0" />
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Seção 5 */}
            <section className="p-8 rounded-3xl bg-white backdrop-blur-xl border border-gray-200 hover:border-purple-300 transition-all duration-500 group shadow-sm">
              <div className="flex items-center gap-5 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center flex-shrink-0 text-purple-600 group-hover:scale-110 transition-transform">
                  <FaCookie className="text-2xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 m-0">5. Cookies e Tecnologias</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Utilizamos cookies para melhorar sua experiência. Os tipos incluem:
              </p>
              <ul className="space-y-3">
                {[
                  { icon: FaShieldAlt, text: "Cookies essenciais: necessários para o funcionamento básico" },
                  { icon: FaTachometerAlt, text: "Cookies de desempenho: análise de uso do site" },
                  { icon: FaCogs, text: "Cookies de funcionalidade: preferências do usuário" },
                  { icon: FaAd, text: "Cookies de publicidade: anúncios relevantes" }
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-4 text-gray-700 border-l-2 border-pink-600 pl-4 py-1">
                    <div className="flex-1">
                      <strong className="text-gray-900 block mb-1">{item.text.split(':')[0]}</strong>
                      <span className="text-gray-500 text-sm">{item.text.split(':')[1]}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            {/* Seção 5.1 AdSense */}
            <section className="p-8 rounded-3xl bg-white backdrop-blur-xl border border-gray-200 hover:border-blue-300 transition-all duration-500 group shadow-sm">
              <div className="flex items-center gap-5 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600 group-hover:scale-110 transition-transform">
                  <FaAd className="text-2xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 m-0">5.1. Google AdSense</h2>
              </div>
              <div className="space-y-6 text-gray-600">
                <p>
                  Utilizamos o <strong className="text-gray-900">Google AdSense</strong> para exibir anúncios relevantes.
                </p>
                <div className="bg-gray-100 p-6 rounded-2xl border border-gray-200">
                  <h4 className="text-gray-900 font-bold mb-4 flex gap-2 items-center"><FaInfoCircle /> Como Funciona</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex gap-3"><FaCookieBite className="text-purple-600 mt-1" /> Uso de cookies para coletar interesses.</li>
                    <li className="flex gap-3"><FaChartLine className="text-purple-600 mt-1" /> Exibição de anúncios personalizados.</li>
                    <li className="flex gap-3"><FaNetworkWired className="text-purple-600 mt-1" /> Coleta de IP e dados de navegação pelo Google.</li>
                  </ul>
                </div>

                <div className="bg-gray-100 p-6 rounded-2xl border border-purple-200">
                  <h4 className="text-gray-900 font-bold mb-4">Links Importantes</h4>
                  <ul className="space-y-3 text-sm">
                    {[
                      { t: "Política de Privacidade do Google", u: "https://policies.google.com/privacy" },
                      { t: "Como o Google usa cookies", u: "https://policies.google.com/technologies/ads" },
                      { t: "Configurações de Anúncios", u: "https://adssettings.google.com" },
                    ].map((l, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <FaExternalLinkAlt className="text-purple-600" />
                        <a href={l.u} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-pink-600 hover:underline transition-colors">{l.t}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Seções Finais Compactadas */}
            <div className="grid md:grid-cols-2 gap-8">
              <section className="p-8 rounded-3xl bg-white backdrop-blur-xl border border-gray-200 hover:border-purple-300 transition-all duration-500 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex gap-3 items-center"><FaLock className="text-purple-600" /> 7. Segurança</h2>
                <ul className="space-y-2 text-gray-700 text-sm">
                  {["Criptografia de dados", "Controle de acesso", "Monitoramento", "Backup regular", "Treinamento"].map(t => (
                    <li key={t} className="flex gap-2 items-center"><FaCheckCircle className="text-purple-600" /> {t}</li>
                  ))}
                </ul>
              </section>

              <section className="p-8 rounded-3xl bg-white backdrop-blur-xl border border-gray-200 hover:border-pink-300 transition-all duration-500 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex gap-3 items-center"><FaEnvelope className="text-pink-600" /> 8. Contato</h2>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex gap-2 items-center"><FaEnvelope /> contato@voltris.com.br</li>
                  <li className="flex gap-2 items-center"><FaPhone /> (11) 99671-6235</li>
                  <li className="flex gap-2 items-center"><FaMapMarkerAlt /> São Paulo, SP</li>
                </ul>
              </section>
            </div>

            <section className="p-8 rounded-3xl bg-white backdrop-blur-xl border border-gray-200 text-center shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-2 flex justify-center gap-3 items-center"><FaSyncAlt /> 9. Alterações</h2>
              <p className="text-gray-500 text-sm">Reservamo-nos o direito de modificar esta política a qualquer momento.</p>
            </section>

          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
