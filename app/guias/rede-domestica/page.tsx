import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'rede-domestica',
  title: "Guia Completo de Configuração de Rede Doméstica",
  description: "Configure roteadores, extensores Wi-Fi, VLANs e segurança de rede residencial. Otimização de cobertura e performance.",
  category: 'rede-seguranca',
  difficulty: 'Intermediário',
  time: '80 minutos'
};

const title = "Guia Completo de Configuração de Rede Doméstica";
const description = "Configure roteadores, extensores Wi-Fi, VLANs e segurança de rede residencial. Otimização de cobertura e performance.";
const keywords = ["rede doméstica","roteador","wi-fi","extensor","vlan","segurança rede"];

export const metadata: Metadata = createGuideMetadata('rede-domestica', title, description, keywords);

export default function RededomesticaGuide() {
  const contentSections = [
    {
      title: "Planejamento e Estruturação da Rede Doméstica",
      content: `
        <p class="mb-4">Uma rede doméstica bem planejada permite que todos os seus dispositivos conectados compartilhem internet, imprimam remotamente, acessem arquivos e streamem conteúdo de forma eficiente. O sucesso depende de um bom planejamento inicial e escolha adequada de equipamentos.</p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <div class="bg-[#171313] p-4 rounded-lg border border-[#31A8FF]/30">
            <h3 class="text-white font-semibold mb-2">Componentes Essenciais</h3>
            <ul class="text-gray-300 text-sm space-y-1">
              <li>📡 Roteador WiFi dual-band (2.4GHz e 5GHz)</li>
              <li>🔌 Modem compatível com seu provedor de internet</li>
              <li>📱 Smartphones, tablets e computadores</li>
              <li>📺 Smart TVs e dispositivos de streaming</li>
            </ul>
          </div>
          <div class="bg-[#171313] p-4 rounded-lg border border-[#FF4B6B]/30">
            <h3 class="text-white font-semibold mb-2">Considerações Iniciais</h3>
            <ul class="text-gray-300 text-sm space-y-1">
              <li>🏠 Área total da residência em metros quadrados</li>
              <li>📶 Quantidade de paredes e obstáculos</li>
              <li>使用網路 Quantidade de dispositivos simultâneos</li>
              <li>⏱️ Tempo estimado de configuração: 60-90 minutos</li>
            </ul>
          </div>
        </div>
        
        <div class="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4 my-6">
          <h3 class="text-orange-400 font-semibold mb-2">📋 Checklist Inicial</h3>
          <p class="text-gray-300 text-sm">Antes de começar, tenha: login/senha do provedor, modelo do roteador, lista de dispositivos a conectar e mapa da casa indicando áreas problemáticas de sinal.</p>
        </div>
      `,
      subsections: []
    },
    {
      title: "Configuração do Roteador - Passo a Passo",
      content: `
        <p class="mb-4">Siga este tutorial completo para configurar seu roteador WiFi doméstico com segurança e otimização de sinal desde o primeiro acesso.</p>
      `,
      subsections: [
        {
          subtitle: "Passo 1: Conexão Física Inicial",
          content: `
            <ol class="space-y-2 text-gray-300 list-decimal list-inside ml-4">
              <li><strong>Conecte o modem:</strong> Ligue o cabo da operadora no porta WAN do roteador</li>
              <li><strong>Energia:</strong> Conecte o adaptador de energia do roteador e aguarde 2 minutos</li>
              <li><strong>Primeiro acesso:</strong> Conecte um computador via cabo Ethernet à porta LAN</li>
              <li><strong>Endereço IP:</strong> Abra navegador e acesse 192.168.1.1 ou 192.168.0.1</li>
              <li><strong>Login padrão:</strong> Usuário "admin" e senha "admin" (verifique manual)</li>
            </ol>
          `
        },
        {
          subtitle: "Passo 2: Configuração Básica de Internet",
          content: `
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4">
              <li><strong>Tipo de conexão:</strong> Selecione PPPoE, DHCP ou IP Estático conforme provedor</li>
              <li><strong>Credenciais PPPoE:</strong> Insira login e senha fornecidos pela operadora</li>
              <li><strong>Clone MAC Address:</strong> Habilite se seu provedor vincular internet ao MAC do computador</li>
              <li><strong>Teste conexão:</strong> Clique em "Connect" e verifique status verde</li>
              <li><strong>DNS:</strong> Configure DNS público (8.8.8.8 e 8.8.4.4) para melhor performance</li>
            </ul>
          `
        },
        {
          subtitle: "Passo 3: Configuração WiFi e Segurança",
          content: `
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4">
              <li><strong>Rede 2.4GHz:</strong> Nome (SSID) claro + senha WPA2/WPA3 forte (12+ caracteres)</li>
              <li><strong>Rede 5GHz:</strong> Mesmo nome com sufixo "_5G" para fácil identificação</li>
              <li><strong>Canal 2.4GHz:</strong> Use canal 1, 6 ou 11 (menos congestionados)</li>
              <li><strong>Canal 5GHz:</strong> Deixe em auto ou escolha canal menos utilizado</li>
              <li><strong>Segurança:</strong> Desative WPS e habilite apenas WPA2/WPA3 Personal</li>
            </ul>
          `
        },
        {
          subtitle: "Passo 4: Otimização Avançada",
          content: `
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4">
              <li><strong>QoS (Qualidade de Serviço):</strong> Priorize streaming e jogos sobre downloads</li>
              <li><strong>Guest Network:</strong> Crie rede convidada separada para visitantes</li>
              <li><strong>Controle parental:</strong> Bloqueie sites inadequados e limite horários</li>
              <li><strong>Firmware:</strong> Verifique e atualize firmware para última versão estável</li>
              <li><strong>Reinicialização:</strong> Programe reinicialização semanal para manter performance</li>
            </ul>
          `
        }
      ]
    },
    {
      title: "Equipamentos e Extensão de Sinal",
      content: `
        <p class="mb-4">Escolha os equipamentos certos para sua casa e solucione problemas de cobertura WiFi com soluções eficazes.</p>
      `,
      subsections: [
        {
          subtitle: "Roteadores Recomendados por Faixa de Preço",
          content: `
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="bg-[#171313] p-3 rounded border border-[#31A8FF]/20">
                <h4 class="text-white font-semibold mb-2">Entry Level (R$ 200-400)</h4>
                <ul class="text-gray-300 text-xs space-y-1">
                  <li>TP-Link Archer A7 ou AX1800</li>
                  <li>WiFi dual-band AC1200</li>
                  <li>4 antenas externas ajustáveis</li>
                  <li>Ideal para casas até 100m²</li>
                </ul>
              </div>
              <div class="bg-[#171313] p-3 rounded border border-[#8B31FF]/20">
                <h4 class="text-white font-semibold mb-2">Mid Range (R$ 400-800)</h4>
                <ul class="text-gray-300 text-xs space-y-1">
                  <li>ASUS RT-AX58U ou AX6000</li>
                  <li>WiFi 6 AX3000 dual-band</li>
                  <li>Portas gigabit + USB 3.0</li>
                  <li>Cobertura até 150m²</li>
                </ul>
              </div>
              <div class="bg-[#171313] p-3 rounded border border-[#FF4B6B]/20">
                <h4 class="text-white font-semibold mb-2">Premium (R$ 800+)</h4>
                <ul class="text-gray-300 text-xs space-y-1">
                  <li>Netgear Nighthawk AX12</li>
                  <li>WiFi 6 tri-band AX6000</li>
                  <li>Processador dedicado</li>
                  <li>Cobertura até 250m² + MU-MIMO</li>
                </ul>
              </div>
            </div>
          `
        },
        {
          subtitle: "Soluções para Extensão de Sinal",
          content: `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-[#171313] p-3 rounded border border-green-500/30">
                <h4 class="text-green-400 font-semibold mb-2">Mesh WiFi Systems</h4>
                <ul class="text-gray-300 text-xs space-y-1">
                  <li>Sistema de pontos coordenados</li>
                  <li>Roteador + 1-2 extensores mesh</li>
                  <li>Mesmo SSID em toda a casa</li>
                  <li>Auto-otimização de canais</li>
                </ul>
              </div>
              <div class="bg-[#171313] p-3 rounded border border-blue-500/30">
                <h4 class="text-blue-400 font-semibold mb-2">Repetidores Tradicionais</h4>
                <ul class="text-gray-300 text-xs space-y-1">
                  <li>Extensão simples de sinal existente</li>
                  <li>SSID separado (_EXT)</li>
                  <li>Perda de 50% da velocidade</li>
                  <li>Custo-benefício para áreas pequenas</li>
                </ul>
              </div>
            </div>
          `
        }
      ]
    },
    {
      title: "Problemas Comuns de Rede e Soluções",
      content: `
        <p class="mb-4">Diagnóstico e solução de problemas frequentes em redes domésticas WiFi e cabeada.</p>
      `,
      subsections: [
        {
          subtitle: "Problemas de Conectividade",
          content: `
            <div class="space-y-4">
              <div class="bg-[#171313] p-4 rounded-lg border border-red-500/30">
                <h4 class="text-red-400 font-semibold mb-2">❌ Sem Internet em Todos os Dispositivos</h4>
                <p class="text-gray-300 text-sm mb-2">Diagnóstico e Solução:</p>
                <ul class="text-gray-300 text-xs space-y-1 ml-4">
                  <li>Verifique se modem está sincronizado (luzes status)</li>
                  <li>Reinicie modem e roteador (30 segundos desligados)</li>
                  <li>Teste conexão com cabo direto do modem ao computador</li>
                  <li>Verifique credenciais PPPoE no painel do roteador</li>
                </ul>
              </div>
              
              <div class="bg-[#171313] p-4 rounded-lg border border-yellow-500/30">
                <h4 class="text-yellow-400 font-semibold mb-2">⚠️ Internet Lenta ou Instável</h4>
                <p class="text-gray-300 text-sm mb-2">Possíveis Causas:</p>
                <ul class="text-gray-300 text-xs space-y-1 ml-4 mb-2">
                  <li>Interferência de micro-ondas, baby phones ou vizinhos</li>
                  <li>Canal WiFi congestionado (use WiFi Analyzer app)</li>
                  <li>Dispositivos antigos limitando toda a rede</li>
                  <li>ISP com problemas na região</li>
                </ul>
                <p class="text-gray-300 text-sm">Solução: Troque canal WiFi, atualize firmware, posicione roteador estrategicamente.</p>
              </div>
            </div>
          `
        },
        {
          subtitle: "Problemas de Sinal WiFi",
          content: `
            <div class="space-y-4">
              <div class="bg-[#171313] p-4 rounded-lg border border-purple-500/30">
                <h4 class="text-purple-400 font-semibold mb-2">📶 Sinal Fraco em Determinados Cômodos</h4>
                <p class="text-gray-300 text-sm mb-2">Soluções Escalonadas:</p>
                <ul class="text-gray-300 text-xs space-y-1 ml-4">
                  <li><strong>Imediata:</strong> Reposicione roteador em local central e elevado</li>
                  <li><strong>Curto prazo:</strong> Instale repetidor WiFi no ponto médio</li>
                  <li><strong>Médio prazo:</strong> Sistema Mesh WiFi com 2-3 pontos</li>
                  <li><strong>Alternativa:</strong> Cabo Ethernet para dispositivos fixos</li>
                </ul>
              </div>
              
              <div class="bg-[#171313] p-4 rounded-lg border border-blue-500/30">
                <h4 class="text-blue-400 font-semibold mb-2">📱 Dispositivos Desconectando Constantemente</h4>
                <p class="text-gray-300 text-sm mb-2">Causas Comuns:</p>
                <ul class="text-gray-300 text-xs space-y-1 ml-4 mb-2">
                  <li>Timeout de inatividade muito curto no roteador</li>
                  <li>Lista de clientes lotada (limite de conexões)</li>
                  <li>Firmware desatualizado</li>
                  <li>Problemas de driver no dispositivo</li>
                </ul>
                <p class="text-gray-300 text-sm">Solução: Aumente timeout no painel, atualize firmware, reinicie roteador.</p>
              </div>
            </div>
          `
        },
        {
          subtitle: "Dicas de Manutenção Preventiva",
          content: `
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4">
              <li>Atualize firmware do roteador trimestralmente</li>
              <li>Reinicie roteador mensalmente para limpar cache</li>
              <li>Monitore dispositivos conectados para identificar intrusos</li>
              <li>Faça backup das configurações antes de grandes mudanças</li>
              <li>Documente layout físico da rede e posicionamento de equipamentos</li>
            </ul>
          `
        }
      ]
    }
  ];

  const relatedGuides = [
    {
      href: "/guias/seguranca-digital",
      title: "Segurança Digital Completa",
      description: "Proteção abrangente contra ameaças cibernéticas"
    },
    {
      href: "/guias/otimizacao-performance",
      title: "Otimização de Performance",
      description: "Maximize o desempenho do seu sistema"
    },
    {
      href: "/guias/manutencao-preventiva",
      title: "Manutenção Preventiva",
      description: "Estratégias completas de cuidados com o sistema"
    }
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="80 minutos"
      difficultyLevel="Intermediário"
      contentSections={contentSections}
      relatedGuides={relatedGuides}
    />
  );
}