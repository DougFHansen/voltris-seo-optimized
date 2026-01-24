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
      <div className="pt-32 pb-20 bg-[#050510] min-h-screen relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#FF4B6B]/5 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#8B31FF]/5 rounded-full blur-[120px]"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 hidden md:block"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] flex items-center justify-center shadow-[0_0_40px_rgba(139,49,255,0.3)]">
              <FaUserShield className="text-4xl text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight">
              Política de Privacidade
            </h1>
            <p className="text-slate-400 font-medium bg-white/5 border border-white/10 rounded-full px-6 py-2 inline-block">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>

          <div className="space-y-8">
            {/* Seção 1 */}
            <section className="p-8 rounded-3xl bg-[#121218]/50 backdrop-blur-xl border border-white/5 hover:border-[#FF4B6B]/30 transition-all duration-500 group">
              <div className="flex items-center gap-5 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-[#FF4B6B]/10 flex items-center justify-center flex-shrink-0 text-[#FF4B6B] group-hover:scale-110 transition-transform">
                  <FaInfoCircle className="text-2xl" />
                </div>
                <h2 className="text-2xl font-bold text-white m-0">1. Introdução</h2>
              </div>
              <p className="text-slate-300 leading-relaxed text-lg">
                A Voltris está comprometida em proteger sua privacidade. Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas informações pessoais quando você utiliza nossos serviços de suporte técnico remoto.
              </p>
            </section>

            {/* Seção 2 */}
            <section className="p-8 rounded-3xl bg-[#121218]/50 backdrop-blur-xl border border-white/5 hover:border-[#8B31FF]/30 transition-all duration-500 group">
              <div className="flex items-center gap-5 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-[#8B31FF]/10 flex items-center justify-center flex-shrink-0 text-[#8B31FF] group-hover:scale-110 transition-transform">
                  <FaDatabase className="text-2xl" />
                </div>
                <h2 className="text-2xl font-bold text-white m-0">2. Informações que Coletamos</h2>
              </div>

              <div className="space-y-8">
                <div className="bg-white/[0.02] p-6 rounded-2xl border border-white/5">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                    <FaUser className="text-[#FF4B6B]" /> 2.1 Informações Pessoais
                  </h3>
                  <ul className="grid md:grid-cols-2 gap-3">
                    {[
                      { icon: FaUser, text: "Nome completo" },
                      { icon: FaEnvelope, text: "Endereço de e-mail" },
                      { icon: FaPhone, text: "Número de telefone" },
                      { icon: FaMapMarkerAlt, text: "Endereço físico" },
                      { icon: FaCreditCard, text: "Informações de pagamento" }
                    ].map((item, index) => (
                      <li key={index} className="flex items-center gap-3 text-slate-300 bg-white/5 p-3 rounded-xl hover:bg-white/10 transition-colors">
                        <item.icon className="text-[#8B31FF] w-5 h-5 flex-shrink-0" />
                        <span>{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white/[0.02] p-6 rounded-2xl border border-white/5">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                    <FaLaptop className="text-[#31A8FF]" /> 2.2 Informações Técnicas
                  </h3>
                  <ul className="grid md:grid-cols-2 gap-3">
                    {[
                      { icon: FaNetworkWired, text: "Endereço IP" },
                      { icon: FaGlobe, text: "Tipo de navegador" },
                      { icon: FaDesktop, text: "Sistema operacional" },
                      { icon: FaMemory, text: "Informações de hardware" },
                      { icon: FaHistory, text: "Logs de acesso" }
                    ].map((item, index) => (
                      <li key={index} className="flex items-center gap-3 text-slate-300 bg-white/5 p-3 rounded-xl hover:bg-white/10 transition-colors">
                        <item.icon className="text-[#FF4B6B] w-5 h-5 flex-shrink-0" />
                        <span>{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Seção 3 */}
            <section className="p-8 rounded-3xl bg-[#121218]/50 backdrop-blur-xl border border-white/5 hover:border-[#31A8FF]/30 transition-all duration-500 group">
              <div className="flex items-center gap-5 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-[#31A8FF]/10 flex items-center justify-center flex-shrink-0 text-[#31A8FF] group-hover:scale-110 transition-transform">
                  <FaCogs className="text-2xl" />
                </div>
                <h2 className="text-2xl font-bold text-white m-0">3. Uso das Informações</h2>
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
                  <li key={index} className="flex items-center gap-3 text-slate-300 bg-white/5 p-3 rounded-xl hover:bg-white/10 transition-colors">
                    <item.icon className="text-[#8B31FF] w-5 h-5 flex-shrink-0" />
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Seção 4 */}
            <section className="p-8 rounded-3xl bg-[#121218]/50 backdrop-blur-xl border border-white/5 hover:border-[#FF4B6B]/30 transition-all duration-500 group">
              <div className="flex items-center gap-5 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-[#FF4B6B]/10 flex items-center justify-center flex-shrink-0 text-[#FF4B6B] group-hover:scale-110 transition-transform">
                  <FaHandshake className="text-2xl" />
                </div>
                <h2 className="text-2xl font-bold text-white m-0">4. Compartilhamento de Dados</h2>
              </div>
              <ul className="grid md:grid-cols-2 gap-3">
                {[
                  { icon: FaUser, text: "Prestadores de serviços" },
                  { icon: FaHandshake, text: "Parceiros comerciais" },
                  { icon: FaBuilding, text: "Autoridades governamentais" },
                  { icon: FaSitemap, text: "Empresas do mesmo grupo econômico" }
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3 text-slate-300 bg-white/5 p-3 rounded-xl hover:bg-white/10 transition-colors">
                    <item.icon className="text-[#31A8FF] w-5 h-5 flex-shrink-0" />
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Seção 5 */}
            <section className="p-8 rounded-3xl bg-[#121218]/50 backdrop-blur-xl border border-white/5 hover:border-[#8B31FF]/30 transition-all duration-500 group">
              <div className="flex items-center gap-5 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-[#8B31FF]/10 flex items-center justify-center flex-shrink-0 text-[#8B31FF] group-hover:scale-110 transition-transform">
                  <FaCookie className="text-2xl" />
                </div>
                <h2 className="text-2xl font-bold text-white m-0">5. Cookies e Tecnologias</h2>
              </div>
              <p className="text-slate-300 mb-6">
                Utilizamos cookies para melhorar sua experiência. Os tipos incluem:
              </p>
              <ul className="space-y-3">
                {[
                  { icon: FaShieldAlt, text: "Cookies essenciais: necessários para o funcionamento básico" },
                  { icon: FaTachometerAlt, text: "Cookies de desempenho: análise de uso do site" },
                  { icon: FaCogs, text: "Cookies de funcionalidade: preferências do usuário" },
                  { icon: FaAd, text: "Cookies de publicidade: anúncios relevantes" }
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-4 text-slate-300 border-l-2 border-[#FF4B6B] pl-4 py-1">
                    <div className="flex-1">
                      <strong className="text-white block mb-1">{item.text.split(':')[0]}</strong>
                      <span className="text-slate-400 text-sm">{item.text.split(':')[1]}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            {/* Seção 5.1 AdSense */}
            <section className="p-8 rounded-3xl bg-[#121218]/50 backdrop-blur-xl border border-white/5 hover:border-[#31A8FF]/30 transition-all duration-500 group">
              <div className="flex items-center gap-5 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-[#31A8FF]/10 flex items-center justify-center flex-shrink-0 text-[#31A8FF] group-hover:scale-110 transition-transform">
                  <FaAd className="text-2xl" />
                </div>
                <h2 className="text-2xl font-bold text-white m-0">5.1. Google AdSense</h2>
              </div>
              <div className="space-y-6 text-slate-300">
                <p>
                  Utilizamos o <strong className="text-white">Google AdSense</strong> para exibir anúncios relevantes.
                </p>
                <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                  <h4 className="text-white font-bold mb-4 flex gap-2 items-center"><FaInfoCircle /> Como Funciona</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex gap-3"><FaCookieBite className="text-[#8B31FF] mt-1" /> Uso de cookies para coletar interesses.</li>
                    <li className="flex gap-3"><FaChartLine className="text-[#8B31FF] mt-1" /> Exibição de anúncios personalizados.</li>
                    <li className="flex gap-3"><FaNetworkWired className="text-[#8B31FF] mt-1" /> Coleta de IP e dados de navegação pelo Google.</li>
                  </ul>
                </div>

                <div className="bg-[#0A0A0F] p-6 rounded-2xl border border-[#8B31FF]/20">
                  <h4 className="text-white font-bold mb-4">Links Importantes</h4>
                  <ul className="space-y-3 text-sm">
                    {[
                      { t: "Política de Privacidade do Google", u: "https://policies.google.com/privacy" },
                      { t: "Como o Google usa cookies", u: "https://policies.google.com/technologies/ads" },
                      { t: "Configurações de Anúncios", u: "https://adssettings.google.com" },
                    ].map((l, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <FaExternalLinkAlt className="text-[#8B31FF]" />
                        <a href={l.u} target="_blank" rel="noopener noreferrer" className="text-[#31A8FF] hover:text-[#FF4B6B] hover:underline transition-colors">{l.t}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Seções Finais Compactadas */}
            <div className="grid md:grid-cols-2 gap-8">
              <section className="p-8 rounded-3xl bg-[#121218]/50 backdrop-blur-xl border border-white/5 hover:border-[#8B31FF]/30 transition-all duration-500">
                <h2 className="text-xl font-bold text-white mb-4 flex gap-3 items-center"><FaLock className="text-[#8B31FF]" /> 7. Segurança</h2>
                <ul className="space-y-2 text-slate-300 text-sm">
                  {["Criptografia de dados", "Controle de acesso", "Monitoramento", "Backup regular", "Treinamento"].map(t => (
                    <li key={t} className="flex gap-2 items-center"><FaCheckCircle className="text-[#8B31FF]" /> {t}</li>
                  ))}
                </ul>
              </section>

              <section className="p-8 rounded-3xl bg-[#121218]/50 backdrop-blur-xl border border-white/5 hover:border-[#FF4B6B]/30 transition-all duration-500">
                <h2 className="text-xl font-bold text-white mb-4 flex gap-3 items-center"><FaEnvelope className="text-[#FF4B6B]" /> 8. Contato</h2>
                <ul className="space-y-2 text-slate-300 text-sm">
                  <li className="flex gap-2 items-center"><FaEnvelope /> contato@voltris.com.br</li>
                  <li className="flex gap-2 items-center"><FaPhone /> (11) 99671-6235</li>
                  <li className="flex gap-2 items-center"><FaMapMarkerAlt /> São Paulo, SP</li>
                </ul>
              </section>
            </div>

            <section className="p-8 rounded-3xl bg-[#121218]/50 backdrop-blur-xl border border-white/5 text-center">
              <h2 className="text-xl font-bold text-white mb-2 flex justify-center gap-3 items-center"><FaSyncAlt /> 9. Alterações</h2>
              <p className="text-slate-400 text-sm">Reservamo-nos o direito de modificar esta política a qualquer momento.</p>
            </section>

          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
