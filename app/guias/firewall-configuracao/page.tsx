import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdSenseBanner from '@/components/AdSenseBanner';

export const metadata: Metadata = {
  title: "Guia Completo de Configuração de Firewall para Windows | VOLTRIS",
  description: "Aprenda a configurar firewall do Windows para proteger seu computador contra ameaças cibernéticas. Guia passo a passo para iniciantes e usuários avançados.",
  keywords: [
    "configuração de firewall",
    "proteção de rede windows",
    "segurança cibernética",
    "firewall do windows",
    "bloquear programas suspeitos",
    "proteção contra hackers"
  ],
  openGraph: {
    title: "Guia Completo de Configuração de Firewall para Windows | VOLTRIS",
    description: "Proteja seu computador com configuração profissional de firewall do Windows.",
    type: "article",
    locale: "pt_BR"
  },
  twitter: {
    card: "summary_large_image",
    title: "Guia Completo de Configuração de Firewall para Windows",
    description: "Aprenda a configurar firewall do Windows para proteção máxima."
  }
};

export default function FirewallConfiguracaoGuide() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-[#0A0A0F] via-[#121218] to-[#0A0A0F]">
        
        {/* Hero Section */}
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF4B6B]/10 via-[#8B31FF]/10 to-[#31A8FF]/10"></div>
          <div className="relative max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Guia Completo de Configuração de Firewall para Windows
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Proteja seu computador contra ameaças cibernéticas com configuração profissional do firewall do Windows. 
              Aprenda desde conceitos básicos até configurações avançadas.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
              <span className="bg-[#1c1c1e] px-3 py-1 rounded-full">Tempo estimado: 45 minutos</span>
              <span className="bg-[#1c1c1e] px-3 py-1 rounded-full">Nível: Intermediário</span>
              <span className="bg-[#1c1c1e] px-3 py-1 rounded-full">Atualizado: Janeiro 2025</span>
            </div>
          </div>
        </section>

        {/* Table of Contents */}
        <section className="py-12 px-4 bg-[#121218]">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6">Conteúdo do Guia</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#1c1c1e] p-4 rounded-lg">
                <h3 className="text-white font-semibold mb-2">Fundamentos</h3>
                <ul className="text-gray-400 text-sm space-y-1">
                  <li>• O que é firewall e como funciona</li>
                  <li>• Tipos de firewall (rede, aplicativo)</li>
                  <li>• Importância da proteção de rede</li>
                </ul>
              </div>
              <div className="bg-[#1c1c1e] p-4 rounded-lg">
                <h3 className="text-white font-semibold mb-2">Configuração Prática</h3>
                <ul className="text-gray-400 text-sm space-y-1">
                  <li>• Configuração básica do Windows Defender</li>
                  <li>• Regras de entrada e saída</li>
                  <li>• Exceções e permissões</li>
                </ul>
              </div>
              <div className="bg-[#1c1c1e] p-4 rounded-lg">
                <h3 className="text-white font-semibold mb-2">Avançado</h3>
                <ul className="text-gray-400 text-sm space-y-1">
                  <li>• Monitoramento de conexões</li>
                  <li>• Logs e análise de tráfego</li>
                  <li>• Configurações para servidores</li>
                </ul>
              </div>
              <div className="bg-[#1c1c1e] p-4 rounded-lg">
                <h3 className="text-white font-semibold mb-2">Solução de Problemas</h3>
                <ul className="text-gray-400 text-sm space-y-1">
                  <li>• Problemas comuns e soluções</li>
                  <li>• Diagnóstico de bloqueios</li>
                  <li>• Performance e otimização</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            
            {/* Introdução */}
            <div className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-6 sm:p-8 rounded-2xl border border-[#FF4B6B]/20 shadow-lg">
              <h2 className="text-3xl font-bold text-white mb-4">O Que é Firewall e Por Que Você Precisa?</h2>
              
              <p className="text-gray-300 leading-relaxed mb-4">
                Um firewall é um sistema de segurança de rede que monitora e controla o tráfego de entrada e saída 
                com base em regras de segurança predeterminadas. Ele atua como uma barreira entre sua rede confiável 
                e redes não confiáveis, como a internet.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                <div className="bg-[#171313] p-4 rounded-lg border border-[#31A8FF]/30">
                  <h3 className="text-white font-semibold mb-2">Funções Principais</h3>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>✓ Bloquear acessos não autorizados</li>
                    <li>✓ Monitorar tráfego de rede</li>
                    <li>✓ Prevenir ataques cibernéticos</li>
                    <li>✓ Controlar aplicativos de rede</li>
                  </ul>
                </div>
                <div className="bg-[#171313] p-4 rounded-lg border border-[#8B31FF]/30">
                  <h3 className="text-white font-semibold mb-2">Tipos de Ameaças</h3>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>✗ Malware e vírus</li>
                    <li>✗ Hackers e crackers</li>
                    <li>✗ Spyware e keyloggers</li>
                    <li>✗ Ataques de negação de serviço</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-[#171313] p-4 rounded-lg border border-[#FF4B6B]/30 mt-4">
                <p className="text-white font-semibold mb-2">💡 Importante:</p>
                <p className="text-gray-300 leading-relaxed">
                  O firewall do Windows Defender já vem habilitado por padrão, mas muitas vezes com configurações 
                  básicas. Uma configuração adequada pode aumentar significativamente sua segurança sem impactar 
                  o desempenho do sistema.
                </p>
              </div>
            </div>

            {/* Tipos de Firewall */}
            <div className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-6 sm:p-8 rounded-2xl border border-[#31A8FF]/20 shadow-lg">
              <h2 className="text-3xl font-bold text-white mb-4">Tipos de Firewall no Windows</h2>
              
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-3">Firewall de Rede (Network Level)</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Opera na camada de rede e filtra tráfego com base em protocolos, portas e endereços IP:
                </p>
                <ul className="space-y-2 text-gray-300 list-disc list-inside ml-4 mb-4">
                  <li>Bloqueia conexões em portas específicas</li>
                  <li>Controla acesso por endereço IP de origem/destino</li>
                  <li>Protege contra varreduras de portas</li>
                  <li>Ideal para proteção contra ataques de rede</li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-3">Firewall de Aplicativo (Application Level)</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Controla quais programas podem acessar a internet:
                </p>
                <ul className="space-y-2 text-gray-300 list-disc list-inside ml-4 mb-4">
                  <li>Permite ou bloqueia aplicativos individualmente</li>
                  <li>Alerta sobre tentativas de conexão suspeitas</li>
                  <li>Controla upload/download de dados</li>
                  <li>Protege contra malware que tenta se comunicar</li>
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#171313] p-4 rounded-lg border border-[#FF4B6B]/30">
                  <h4 className="text-white font-semibold mb-2">Vantagens do Firewall do Windows</h4>
                  <ul className="space-y-1 text-gray-300 text-sm">
                    <li>✓ Integrado nativamente</li>
                    <li>✓ Sem custo adicional</li>
                    <li>✓ Atualizações automáticas</li>
                    <li>✓ Baixo impacto no desempenho</li>
                  </ul>
                </div>
                <div className="bg-[#171313] p-4 rounded-lg border border-[#31A8FF]/30">
                  <h4 className="text-white font-semibold mb-2">Limitações</h4>
                  <ul className="space-y-1 text-gray-300 text-sm">
                    <li>✗ Interface limitada</li>
                    <li>✗ Poucas opções avançadas</li>
                    <li>✗ Sem análise de comportamento</li>
                    <li>✗ Não substitui antivírus completo</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Configuração Básica */}
            <div className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-6 sm:p-8 rounded-2xl border border-[#8B31FF]/20 shadow-lg">
              <h2 className="text-3xl font-bold text-white mb-4">Configuração Básica do Firewall do Windows</h2>
              
              <h3 className="text-2xl font-bold text-white mb-3 mt-6">Passo 1: Acessar Configurações do Firewall</h3>
              <ol className="space-y-3 text-gray-300 list-decimal list-inside ml-4 mb-6">
                <li>Pressione <kbd className="bg-[#2a2a2e] px-2 py-1 rounded">Windows + S</kbd> e digite "Firewall do Windows"</li>
                <li>Clique em "Firewall do Windows Defender" nos resultados</li>
                <li>Na janela que abre, clique em "Ativar ou desativar o Firewall do Windows Defender"</li>
                <li>Você verá as configurações para redes privadas e públicas</li>
              </ol>

              <h3 className="text-2xl font-bold text-white mb-3 mt-6">Passo 2: Configurar Perfis de Rede</h3>
              <div className="mb-4">
                <h4 className="text-xl font-bold text-white mb-2">Rede Privada (Casa/Escritório)</h4>
                <ul className="space-y-2 text-gray-300 list-disc list-inside ml-4 mb-4">
                  <li>Marque "Ativar firewall do Windows Defender" para rede privada</li>
                  <li>Habilite proteção contra invasores (ativado por padrão)</li>
                  <li>Permita exceções controladas para dispositivos confiáveis</li>
                </ul>
              </div>

              <div className="mb-4">
                <h4 className="text-xl font-bold text-white mb-2">Rede Pública (Hotéis, cafés, aeroportos)</h4>
                <ul className="space-y-2 text-gray-300 list-disc list-inside ml-4 mb-4">
                  <li>Sempre mantenha o firewall ATIVADO</li>
                  <li>Desative compartilhamento de rede</li>
                  <li>Bloqueie todas as conexões de entrada não solicitadas</li>
                </ul>
              </div>

              <div className="bg-[#171313] p-4 rounded-lg border border-[#31A8FF]/30">
                <p className="text-white font-semibold mb-2">💡 Dica Profissional:</p>
                <p className="text-gray-300 leading-relaxed">
                  Em redes públicas, considere usar uma rede virtual privada (VPN) além do firewall para 
                  criptografar todo o tráfego de internet e proteger sua privacidade.
                </p>
              </div>
            </div>

            {/* Regras Avançadas */}
            <div className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-6 sm:p-8 rounded-2xl border border-[#FF4B6B]/20 shadow-lg">
              <h2 className="text-3xl font-bold text-white mb-4">Configuração de Regras Avançadas</h2>
              
              <h3 className="text-2xl font-bold text-white mb-3 mt-6">Criando Regras de Entrada</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                As regras de entrada controlam quais conexões externas podem chegar ao seu computador:
              </p>
              
              <ol className="space-y-3 text-gray-300 list-decimal list-inside ml-4 mb-6">
                <li>No painel do firewall, clique em "Regras de entrada avançadas"</li>
                <li>Clique em "Nova regra" no painel direito</li>
                <li>Escolha o tipo de regra (Porta, Programa, Predefinida, Personalizada)</li>
                <li>Configure porta específica ou intervalo de portas</li>
                <li>Defina a ação (Permitir, Bloquear, Permitir se seguro)</li>
                <li>Especifique perfil (Domínio, Privado, Público)</li>
                <li>Dê um nome descritivo à regra</li>
              </ol>

              <h3 className="text-2xl font-bold text-white mb-3 mt-6">Exemplos Práticos de Regras</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#171313] p-4 rounded-lg border border-[#31A8FF]/30">
                  <h4 className="text-white font-semibold mb-2">Servidor Web Local</h4>
                  <p className="text-gray-300 text-sm mb-2">Permitir acesso à porta 80 (HTTP):</p>
                  <ul className="text-gray-300 text-xs space-y-1">
                    <li>Tipo: Porta</li>
                    <li>Protocolo: TCP</li>
                    <li>Porta local: 80</li>
                    <li>Ação: Permitir</li>
                    <li>Perfil: Privado</li>
                  </ul>
                </div>
                <div className="bg-[#171313] p-4 rounded-lg border border-[#8B31FF]/30">
                  <h4 className="text-white font-semibold mb-2">Bloquear Software Suspeito</h4>
                  <p className="text-gray-300 text-sm mb-2">Bloquear programa específico:</p>
                  <ul className="text-gray-300 text-xs space-y-1">
                    <li>Tipo: Programa</li>
                    <li>Caminho: C:\suspect.exe</li>
                    <li>Ação: Bloquear</li>
                    <li>Para todas as conexões</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Monitoramento e Logs */}
            <div className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-6 sm:p-8 rounded-2xl border border-[#31A8FF]/20 shadow-lg">
              <h2 className="text-3xl font-bold text-white mb-4">Monitoramento e Análise de Logs</h2>
              
              <h3 className="text-2xl font-bold text-white mb-3 mt-6">Visualizando Logs do Firewall</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                O firewall registra todas as tentativas de conexão bloqueadas e permitidas:
              </p>
              
              <ol className="space-y-3 text-gray-300 list-decimal list-inside ml-4 mb-6">
                <li>Abra o Visualizador de Eventos (eventvwr.msc)</li>
                <li>Navegue para Windows Logs &gt; Security</li>
                <li>Filtre eventos com ID 5152 (pacotes bloqueados) e 5154 (portas escutando)</li>
                <li>Analise padrões de tentativas de conexão suspeitas</li>
              </ol>

              <h3 className="text-2xl font-bold text-white mb-3 mt-6">Ferramentas de Monitoramento</h3>
              <div className="mb-4">
                <h4 className="text-xl font-bold text-white mb-2">Built-in Tools</h4>
                <ul className="space-y-2 text-gray-300 list-disc list-inside ml-4 mb-4">
                  <li><strong className="text-white">netstat</strong>: Mostra conexões ativas e portas escutando</li>
                  <li><strong className="text-white">resmon</strong>: Monitor de recursos com visão de rede</li>
                  <li><strong className="text-white">perfmon</strong>: Monitor de desempenho com contadores de rede</li>
                </ul>
              </div>

              <div className="mb-4">
                <h4 className="text-xl font-bold text-white mb-2">Ferramentas de Terceiros</h4>
                <ul className="space-y-2 text-gray-300 list-disc list-inside ml-4 mb-4">
                  <li><strong className="text-white">TCPView</strong>: Visualização em tempo real de conexões TCP/UDP</li>
                  <li><strong className="text-white">Wireshark</strong>: Análise profunda de pacotes de rede</li>
                  <li><strong className="text-white">GlassWire</strong>: Firewall com interface gráfica avançada</li>
                </ul>
              </div>
            </div>

            {/* Problemas Comuns */}
            <div className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-6 sm:p-8 rounded-2xl border border-[#8B31FF]/20 shadow-lg">
              <h2 className="text-3xl font-bold text-white mb-4">Problemas Comuns e Soluções</h2>
              
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Internet Lentificada pelo Firewall</h3>
                <p className="text-gray-300 leading-relaxed mb-2">
                  Solução: Verifique regras conflitantes e desative proteção contra invasores temporariamente
                </p>
                <ol className="space-y-1 text-gray-300 list-decimal list-inside ml-4 text-sm">
                  <li>Abra propriedades do firewall</li>
                  <li>Desmarque "Proteção contra invasores" temporariamente</li>
                  <li>Teste velocidade da internet</li>
                  <li>Reative se não afetar significativamente</li>
                </ol>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Programas Bloqueados Indevidamente</h3>
                <p className="text-gray-300 leading-relaxed mb-2">
                  Solução: Criar exceção para programa específico
                </p>
                <ol className="space-y-1 text-gray-300 list-decimal list-inside ml-4 text-sm">
                  <li>Vá em "Permitir um aplicativo através do firewall"</li>
                  <li>Clique em "Alterar configurações"</li>
                  <li>Clique em "Permitir outro aplicativo"</li>
                  <li>Procure e selecione o programa</li>
                  <li>Marque redes privadas/públicas conforme necessário</li>
                </ol>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Firewall Desativado Automaticamente</h3>
                <p className="text-gray-300 leading-relaxed mb-2">
                  Causa comum: Software de segurança concorrente
                </p>
                <ul className="space-y-1 text-gray-300 list-disc list-inside ml-4 text-sm">
                  <li>Desinstale outros firewalls ou antivírus</li>
                  <li>Verifique políticas de grupo (gpedit.msc)</li>
                  <li>Restaure configurações padrão do firewall</li>
                </ul>
              </div>
            </div>

            {/* Conclusão */}
            <div className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-6 sm:p-8 rounded-2xl border border-[#FF4B6B]/20 shadow-lg">
              <h2 className="text-3xl font-bold text-white mb-4">Conclusão</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Uma configuração adequada do firewall é essencial para a segurança do seu sistema Windows. 
                Embora o firewall padrão ofereça proteção básica, configurações personalizadas podem 
                proporcionar segurança muito mais robusta contra ameaças modernas.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                Lembre-se de revisar periodicamente suas regras de firewall, especialmente após instalar 
                novos programas ou alterar sua configuração de rede. A segurança cibernética é um processo 
                contínuo, não um destino final.
              </p>
              <div className="bg-[#171313] p-6 rounded-lg border border-[#31A8FF]/30 mt-6">
                <p className="text-white font-semibold mb-3 text-lg">Precisa de Ajuda Profissional?</p>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Nossa equipe pode configurar e otimizar seu firewall para necessidades específicas, 
                  garantindo máxima segurança sem comprometer o desempenho.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    href="/todos-os-servicos"
                    className="px-6 py-3 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300 text-center"
                  >
                    Ver Serviços de Segurança
                  </Link>
                  <Link 
                    href="https://wa.me/5511996716235?text=Olá!%20Preciso%20de%20ajuda%20com%20configuração%20de%20firewall."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 border-2 border-[#31A8FF] text-[#31A8FF] font-bold rounded-xl hover:bg-[#31A8FF] hover:text-white transition-all duration-300 text-center"
                  >
                    Falar com Especialista
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Guides */}
        <section className="py-12 px-4 bg-[#1D1919]">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Guias Relacionados</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link href="/guias/seguranca-digital" className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-6 rounded-xl border border-[#8B31FF]/10 hover:border-[#FF4B6B]/30 transition-all duration-300">
                <h3 className="text-xl font-bold text-white mb-2">Guia de Segurança Digital</h3>
                <p className="text-gray-400 text-sm">Proteção completa contra ameaças cibernéticas.</p>
              </Link>
              <Link href="/guias/otimizacao-performance" className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-6 rounded-xl border border-[#31A8FF]/10 hover:border-[#FF4B6B]/30 transition-all duration-300">
                <h3 className="text-xl font-bold text-white mb-2">Otimização de Performance</h3>
                <p className="text-gray-400 text-sm">Melhore o desempenho do seu computador.</p>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <AdSenseBanner />
      <Footer />
    </>
  );
}