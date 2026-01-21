import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";

export default function AboutPage() {
  return (
    <>
      <Header />

      <main className="bg-[#171313] min-h-screen">
        {/* Hero Section */}
        <section className="pt-32 sm:pt-24 relative overflow-hidden">
          {/* Background Gradient Effects */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FF4B6B] opacity-10 rounded-full filter blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#8B31FF] opacity-10 rounded-full filter blur-[100px]" />

          <div className="container mx-auto px-4 py-16">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 relative inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF]">
                  Sobre a VOLTRIS
                </span>
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-[#FF4B6B] to-[#31A8FF]"></div>
              </h1>
              <p className="text-[#e2e8f0] text-lg md:text-xl mt-12 leading-relaxed">
                Somos uma empresa especializada em soluções tecnológicas, focada em proporcionar o melhor suporte técnico remoto para nossos clientes em todo o Brasil.
              </p>
            </div>
          </div>
        </section>

        {/* Mission and Values */}
        <section className="py-20 relative">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-8 rounded-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(139,49,255,0.2)]">
                <div className="w-16 h-16 bg-gradient-to-r from-[#FF4B6B] to-[#8B31FF] rounded-full flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Nossa Missão</h3>
                <p className="text-[#e2e8f0] leading-relaxed">
                  Fornecer soluções tecnológicas inovadoras e suporte técnico de excelência, garantindo a satisfação e o sucesso de nossos clientes.
                </p>
              </div>

              <div className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-8 rounded-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(139,49,255,0.2)]">
                <div className="w-16 h-16 bg-gradient-to-r from-[#8B31FF] to-[#31A8FF] rounded-full flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Nossos Valores</h3>
                <p className="text-[#e2e8f0] leading-relaxed">
                  Excelência, integridade, inovação e compromisso com o cliente são os pilares que guiam nossas ações e decisões.
                </p>
              </div>

              <div className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-8 rounded-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(139,49,255,0.2)]">
                <div className="w-16 h-16 bg-gradient-to-r from-[#31A8FF] to-[#FF4B6B] rounded-full flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Nossa Equipe</h3>
                <p className="text-[#e2e8f0] leading-relaxed">
                  Profissionais altamente qualificados e apaixonados por tecnologia, prontos para oferecer as melhores soluções.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-20 relative">
          <div className="container mx-auto px-4">
            <div className="w-full flex justify-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold relative inline-block text-center">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF]">
                  Nossa História
                </span>
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-[#FF4B6B] to-[#31A8FF]"></div>
              </h2>
            </div>

            <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-8 md:p-12 rounded-2xl shadow-xl relative overflow-hidden">
              {/* Background Accent */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>

              <div className="space-y-6 text-[#e2e8f0] text-lg leading-relaxed relative z-10">
                <p>
                  A história da VOLTRIS começou com uma paixão genuína por tecnologia e um desejo de ajudar pessoas. Em 2014, nosso fundador, um entusiasta da tecnologia, começou prestando suporte técnico remoto para amigos e familiares, transformando problemas complexos em soluções simples e acessíveis.
                </p>

                <p>
                  O que começou como uma iniciativa individual logo se transformou em algo maior. À medida que a qualidade do serviço se destacava, o boca a boca se espalhou, e mais pessoas começaram a buscar ajuda. Empresas locais também notaram a eficiência e profissionalismo do atendimento, e assim nasceu a visão do que viria a se tornar a VOLTRIS.
                </p>

                <p>
                  Com o crescimento da demanda e o feedback positivo dos clientes, percebemos que havia uma necessidade real no mercado por um serviço de suporte técnico que combinasse excelência técnica com atendimento humanizado. Foi então que, em 2015, a VOLTRIS foi oficialmente fundada, com a missão de democratizar o acesso ao suporte técnico de qualidade em todo o Brasil.
                </p>

                <p>
                  Hoje, somos uma equipe de profissionais apaixonados por tecnologia, especializados em diversas áreas - desde formatação e otimização de computadores até desenvolvimento web e soluções empresariais. Nossa abordagem continua a mesma: tratar cada cliente como único, oferecendo soluções personalizadas e garantindo que a tecnologia seja uma aliada, não um obstáculo.
                </p>

                <p>
                  Com mais de 5.000 clientes atendidos e uma taxa de satisfação de 98%, nos orgulhamos em manter vivo o espírito que deu origem à VOLTRIS: a dedicação em resolver problemas e o compromisso com a excelência. Seja para um usuário doméstico ou uma grande empresa, nossa missão é proporcionar soluções tecnológicas acessíveis, eficientes e seguras, 24 horas por dia, 7 dias por semana.
                </p>

                <p>
                  Ao longo dos anos, desenvolvemos uma metodologia única de atendimento que combina diagnóstico preciso, soluções eficientes e comunicação clara. Cada técnico da VOLTRIS passa por um rigoroso processo de seleção e treinamento contínuo, garantindo que estejam sempre atualizados com as últimas tecnologias e melhores práticas do mercado. Nossa equipe é composta por especialistas em diferentes áreas: engenheiros de sistemas, desenvolvedores web, especialistas em segurança digital, técnicos em hardware e profissionais certificados em tecnologias Microsoft.
                </p>

                <p>
                  Investimos constantemente em tecnologia e infraestrutura para oferecer o melhor serviço possível. Utilizamos ferramentas de última geração para acesso remoto seguro, monitoramento de sistemas e backup automatizado. Nossa infraestrutura de nuvem garante que todos os dados dos clientes sejam armazenados com criptografia de ponta a ponta, seguindo os mais altos padrões de segurança da indústria.
                </p>

                <p>
                  Além dos serviços tradicionais de suporte técnico, desenvolvemos soluções personalizadas para empresas de diversos portes. Nossos projetos de desenvolvimento web já ajudaram centenas de empresas a estabelecerem sua presença online, com sites responsivos, otimizados para mecanismos de busca e integrados com as principais ferramentas de marketing digital. Cada projeto é tratado como único, com atenção aos detalhes e foco em resultados mensuráveis.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Founder's Message - E-E-A-T Booster */}
        <section className="py-20 bg-[#1c1c1e] relative overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
              <div className="w-full md:w-1/3 flex justify-center">
                <div className="relative w-64 h-64 md:w-80 md:h-80">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] rounded-full blur-sm opacity-50"></div>
                  <div className="absolute inset-1 bg-[#171313] rounded-full flex items-center justify-center overflow-hidden border-2 border-white/10">
                    <i className="fas fa-user-tie text-9xl text-gray-700"></i>
                  </div>
                  {/* Placeholder for real photo */}
                  <div className="absolute bottom-4 right-4 bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/20">
                    <p className="text-white font-bold text-sm">Douglas Hansen</p>
                    <p className="text-blue-400 text-xs">CEO & Fundador</p>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-2/3">
                <h3 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="w-2 h-12 bg-gradient-to-b from-[#FF4B6B] to-[#8B31FF] rounded-full block"></span>
                  Uma Palavra do Fundador
                </h3>
                <div className="space-y-4 text-gray-300 text-lg leading-relaxed italic">
                  <p>
                    "Quando criei a Voltris, meu objetivo não era apenas abrir mais uma empresa de TI. Eu queria acabar com a frustração que vejo todos os dias: pessoas perdendo trabalho importante por causa de vírus, gamers com lag injusto e pequenas empresas paradas por falhas técnicas simples."
                  </p>
                  <p>
                    "A tecnologia deve ser libertadora, não uma dor de cabeça. Por isso, treinei minha equipe para não apenas 'consertar computadores', mas para **entender pessoas**. Cada chamado que atendemos é tratado com a urgência e o respeito de quem sabe que, do outro lado, existe alguém precisando voltar a trabalhar ou se divertir."
                  </p>
                  <p>
                    "Nosso compromisso não é com máquinas, é com a sua tranquilidade. Sejam bem-vindos à nova era do suporte técnico."
                  </p>
                </div>
                <div className="mt-8">
                  <Image
                    src="/signature.png"
                    alt="Assinatura Douglas Hansen"
                    width={200}
                    height={80}
                    className="opacity-60 invert"
                    style={{ display: 'none' }} // Hidden until real image provided
                  />
                  <p className="text-2xl font-handwriting text-[#31A8FF] font-bold mt-2" style={{ fontFamily: 'cursive' }}>Douglas Hansen</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Metodology Section */}
        <section className="py-20 relative">
          <div className="container mx-auto px-4">
            <div className="w-full flex justify-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold relative inline-block text-center">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF]">
                  Nossa Metodologia de Trabalho
                </span>
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-[#FF4B6B] to-[#31A8FF]"></div>
              </h2>
            </div>

            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <div className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-6 rounded-xl border border-[#8B31FF]/20">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#FF4B6B] to-[#8B31FF] rounded-lg flex items-center justify-center mb-4">
                    <i className="fas fa-search text-white text-xl"></i>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Diagnóstico Preciso</h3>
                  <p className="text-[#e2e8f0] text-sm leading-relaxed">
                    Começamos cada atendimento com uma análise detalhada do problema, utilizando ferramentas de diagnóstico avançadas para identificar a causa raiz de forma rápida e precisa.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-6 rounded-xl border border-[#31A8FF]/20">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#8B31FF] to-[#31A8FF] rounded-lg flex items-center justify-center mb-4">
                    <i className="fas fa-lightbulb text-white text-xl"></i>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Solução Personalizada</h3>
                  <p className="text-[#e2e8f0] text-sm leading-relaxed">
                    Desenvolvemos soluções customizadas para cada situação, considerando as necessidades específicas do cliente e as melhores práticas da indústria.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-6 rounded-xl border border-[#FF4B6B]/20">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#31A8FF] to-[#FF4B6B] rounded-lg flex items-center justify-center mb-4">
                    <i className="fas fa-cogs text-white text-xl"></i>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Execução Eficiente</h3>
                  <p className="text-[#e2e8f0] text-sm leading-relaxed">
                    Implementamos as soluções de forma estruturada e eficiente, sempre mantendo o cliente informado sobre cada etapa do processo e garantindo mínima interrupção.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-6 rounded-xl border border-[#8B31FF]/20">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] rounded-lg flex items-center justify-center mb-4">
                    <i className="fas fa-check-circle text-white text-xl"></i>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Acompanhamento</h3>
                  <p className="text-[#e2e8f0] text-sm leading-relaxed">
                    Após a conclusão do serviço, oferecemos suporte contínuo e acompanhamento para garantir que tudo continue funcionando perfeitamente e para prevenir problemas futuros.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-8 rounded-2xl border border-[#8B31FF]/20">
                <h3 className="text-2xl font-bold text-white mb-6 text-center">Processo Padronizado com Flexibilidade</h3>
                <div className="space-y-4 text-[#e2e8f0] leading-relaxed">
                  <p>
                    Nossa metodologia de trabalho foi desenvolvida ao longo de anos de experiência e é constantemente refinada com base no feedback dos clientes e nas melhores práticas da indústria. Embora tenhamos processos padronizados para garantir consistência e qualidade, sempre adaptamos nossa abordagem às necessidades específicas de cada cliente.
                  </p>
                  <p>
                    Para serviços de suporte técnico remoto, seguimos um protocolo de 5 etapas: contato inicial e triagem, diagnóstico remoto, apresentação da solução proposta, execução com monitoramento em tempo real, e validação final com o cliente. Para projetos de desenvolvimento web, nosso processo inclui descoberta e planejamento, design e prototipagem, desenvolvimento e testes, lançamento e otimização, além de suporte pós-lançamento.
                  </p>
                  <p>
                    Todos os nossos técnicos seguem rigorosamente protocolos de segurança, garantindo que o acesso remoto seja feito apenas com o consentimento explícito do cliente e que todos os dados sejam tratados com máxima confidencialidade. Utilizamos conexões criptografadas e ferramentas certificadas internacionalmente, como AnyDesk e TeamViewer, que são reconhecidas por sua segurança e confiabilidade.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Certifications and Qualifications */}
        <section className="py-20 relative bg-[#1c1c1e]">
          <div className="container mx-auto px-4">
            <div className="w-full flex justify-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-center relative inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF]">
                  Certificações e Qualificações
                </span>
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-[#FF4B6B] to-[#31A8FF]"></div>
              </h2>
            </div>

            <div className="max-w-6xl mx-auto">
              <div className="bg-gradient-to-br from-[#171313] to-[#1c1c1e] p-8 rounded-2xl border border-[#8B31FF]/20 mb-8">
                <p className="text-[#e2e8f0] text-lg leading-relaxed mb-6">
                  Na VOLTRIS, acreditamos que a excelência técnica começa com educação e certificação contínua. Nossa equipe é composta por profissionais que possuem certificações reconhecidas internacionalmente e que participam regularmente de treinamentos e atualizações para manter-se na vanguarda das tecnologias.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-xl font-bold text-white mb-4">Certificações da Equipe</h4>
                    <ul className="space-y-3 text-[#e2e8f0]">
                      <li className="flex items-start">
                        <i className="fas fa-certificate text-[#FF4B6B] mr-3 mt-1"></i>
                        <span>Microsoft Certified Solutions Expert (MCSE)</span>
                      </li>
                      <li className="flex items-start">
                        <i className="fas fa-certificate text-[#8B31FF] mr-3 mt-1"></i>
                        <span>CompTIA A+ e Network+ Certification</span>
                      </li>
                      <li className="flex items-start">
                        <i className="fas fa-certificate text-[#31A8FF] mr-3 mt-1"></i>
                        <span>Google Cloud Professional Certifications</span>
                      </li>
                      <li className="flex items-start">
                        <i className="fas fa-certificate text-[#FF4B6B] mr-3 mt-1"></i>
                        <span>Certified Information Systems Security Professional (CISSP)</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xl font-bold text-white mb-4">Áreas de Especialização</h4>
                    <ul className="space-y-3 text-[#e2e8f0]">
                      <li className="flex items-start">
                        <i className="fas fa-check-circle text-[#8B31FF] mr-3 mt-1"></i>
                        <span>Sistemas Operacionais Windows (todas as versões)</span>
                      </li>
                      <li className="flex items-start">
                        <i className="fas fa-check-circle text-[#31A8FF] mr-3 mt-1"></i>
                        <span>Desenvolvimento Web (React, Next.js, Node.js)</span>
                      </li>
                      <li className="flex items-start">
                        <i className="fas fa-check-circle text-[#FF4B6B] mr-3 mt-1"></i>
                        <span>Segurança Digital e Proteção contra Malware</span>
                      </li>
                      <li className="flex items-start">
                        <i className="fas fa-check-circle text-[#8B31FF] mr-3 mt-1"></i>
                        <span>Recuperação de Dados e Backup em Nuvem</span>
                      </li>
                      <li className="flex items-start">
                        <i className="fas fa-check-circle text-[#31A8FF] mr-3 mt-1"></i>
                        <span>Otimização de Performance e Hardware</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#171313] to-[#1c1c1e] p-8 rounded-2xl border border-[#31A8FF]/20">
                <h3 className="text-2xl font-bold text-white mb-6 text-center">Compromisso com Educação Contínua</h3>
                <p className="text-[#e2e8f0] leading-relaxed mb-4">
                  Entendemos que o mundo da tecnologia está em constante evolução, e por isso investimos pesado na educação contínua de nossa equipe. Mensalmente, realizamos treinamentos internos sobre novas tecnologias, ferramentas emergentes e melhores práticas da indústria. Participamos de conferências nacionais e internacionais, mantemos parcerias com fornecedores de tecnologia e acompanhamos de perto as tendências do mercado.
                </p>
                <p className="text-[#e2e8f0] leading-relaxed">
                  Este compromisso com a educação contínua garante que quando você contrata um serviço da VOLTRIS, está trabalhando com profissionais que estão sempre atualizados e preparados para lidar com os desafios tecnológicos mais modernos, desde os sistemas legacy até as tecnologias mais recentes em computação em nuvem, inteligência artificial e desenvolvimento de aplicações web modernas.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 relative bg-[#1c1c1e]">
          <div className="container mx-auto px-4">
            <div className="w-full flex justify-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-center relative inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF]">
                  Por que escolher a VOLTRIS?
                </span>
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-[#FF4B6B] to-[#31A8FF]"></div>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] rounded-2xl transform rotate-1"></div>
                <div className="relative bg-[#171313] p-8 rounded-2xl">
                  <h3 className="text-2xl font-bold text-white mb-6">Atendimento Personalizado</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-[#FF4B6B] mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-[#e2e8f0]">Suporte técnico 24/7</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-[#8B31FF] mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-[#e2e8f0]">Atendimento remoto em todo o Brasil</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-[#31A8FF] mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-[#e2e8f0]">Profissionais certificados</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] rounded-2xl transform -rotate-1"></div>
                <div className="relative bg-[#171313] p-8 rounded-2xl">
                  <h3 className="text-2xl font-bold text-white mb-6">Tecnologia de Ponta</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-[#FF4B6B] mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-[#e2e8f0]">Ferramentas de última geração</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-[#8B31FF] mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-[#e2e8f0]">Soluções personalizadas</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-[#31A8FF] mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-[#e2e8f0]">Segurança garantida</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#FF4B6B] to-[#8B31FF] text-transparent bg-clip-text mb-2">5000+</div>
                <p className="text-[#e2e8f0]">Clientes Atendidos</p>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#8B31FF] to-[#31A8FF] text-transparent bg-clip-text mb-2">98%</div>
                <p className="text-[#e2e8f0]">Satisfação</p>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#31A8FF] to-[#FF4B6B] text-transparent bg-clip-text mb-2">24/7</div>
                <p className="text-[#e2e8f0]">Suporte</p>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-transparent bg-clip-text mb-2">10+</div>
                <p className="text-[#e2e8f0]">Anos de Experiência</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
} 