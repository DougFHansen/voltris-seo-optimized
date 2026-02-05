import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'configuracao-roteador-wifi',
  title: "Guia de Configuração de Roteador Wi-Fi (2026)",
  description: "Sua internet está lenta? Aprenda como configurar seu roteador, mudar o canal do Wi-Fi e colocar uma senha forte para máxima estabilidade em 2026.",
  category: 'rede-seguranca',
  difficulty: 'Intermediário',
  time: '20 min'
};

const title = "Guia de Configuração de Roteador Wi-Fi (2026)";
const description = "Sua internet está lenta? Aprenda como configurar seu roteador, mudar o canal do Wi-Fi e colocar uma senha forte para máxima estabilidade em 2026.";
const keywords = [
  'como configurar roteador wifi 2026 tutorial',
  'melhorar sinal wifi mudar canal roteador guia',
  'como mudar senha do wifi roteador tp-link d-link tutorial',
  'configuração iniciante roteador passo a passo 2026',
  'roteador 2.4ghz vs 5ghz qual usar guia completo'
];

export const metadata: Metadata = createGuideMetadata('configuracao-roteador-wifi', title, description, keywords);

export default function RouterConfigGuide() {
  const summaryTable = [
    { label: "Acesso Padrão", value: "192.168.1.1 ou 192.168.0.1" },
    { label: "Segurança", value: "WPA3 (Recomendado) / WPA2-AES (Mínimo)" },
    { label: "Dica de Sinal", value: "Canais 1, 6 ou 11 para 2.4GHz" },
    { label: "Dificuldade", value: "Médio" }
  ];

  const contentSections = [
    {
      title: "O coração da sua casa conectada",
      content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Em 2026, com dezenas de aparelhos inteligentes (lâmpadas, alexas, celulares e PCs) conectados ao mesmo tempo, um roteador mal configurado vira o gargalo da sua produtividade e lazer. Configurar o roteador corretamente não é apenas sobre "colocar internet", mas sobre garantir que o sinal chegue estável em todos os cômodos e que nenhum vizinho consiga roubar a sua banda.
        </p>
      `
    },
    {
      title: "1. Como acessar o Painel de Controle",
      content: `
        <p class="mb-4 text-gray-300">Para entrar nas configurações do seu aparelho:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Abra o navegador e digite o IP do Gateway (geralmente <code>192.168.1.1</code>).</li>
            <li>Se não souber, no CMD digite <code>ipconfig</code> e procure por 'Gateway Padrão'.</li>
            <li>Use o usuário e senha (geralmente adesivados embaixo do aparelho).</li>
            <li><strong>Aviso:</strong> Mude a senha de admin do roteador imediatamente! Deixar como 'admin' é a forma mais fácil de ser hackeado.</li>
        </ol>
      `
    },
    {
      title: "2. 2.4GHz vs 5GHz vs 6GHz",
      content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Escolhendo a Frequência:</h4>
            <p class="text-sm text-gray-300">
                - <strong>2.4GHz:</strong> Tem longo alcance, mas é lenta e sofre interferência de micro-ondas. <br/>
                - <strong>5GHz:</strong> Extremamente rápida, ideal para jogos e streaming 4K, mas o sinal não atravessa bem muitas paredes. <br/>
                - <strong>6GHz (Wi-Fi 6E/7):</strong> O padrão topo de linha de 2026. Latência quase zero, ideal para setups gamers profissionais.
            </p>
        </div>
      `
    },
    {
      title: "3. Otimização de Canais e Largura de Banda",
      content: `
        <p class="mb-4 text-gray-300">
            <strong>Fuja da Interferência:</strong> 
            <br/><br/>Se você mora em prédio, as redes dos vizinhos "brigam" pela mesma frequência. Use um app de 'Wifi Analyzer'. <br/><br/>
            - No 2.4GHz, use apenas os canais **1, 6 ou 11**. <br/>
            - No 5GHz, prefira canais acima de 100 se possível. <br/>
            Mudar a largura do canal de 80MHz para 160MHz (se o seu roteador suportar em 2026) pode dobrar a velocidade da sua internet instantaneamente.
        </p>
      `
    }
  ];

  // Additional advanced content sections
  const advancedContentSections = [
    {
      title: "4. Fundamentos Técnicos de Redes Wi-Fi",
      content: `
        <h4 class="text-white font-bold mb-3">🔬 Arquitetura de Redes Wi-Fi e Protocolos</h4>
        <p class="mb-4 text-gray-300">
          A configuração avançada de roteadores envolve compreensão dos protocolos subjacentes e da arquitetura de redes sem fio:
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h5 class="text-blue-400 font-bold mb-3">Padrões Wi-Fi e Frequências</h5>
            <ul class="text-sm text-gray-300 space-y-2">
              <li>• IEEE 802.11a/b/g/n/ac/ax/be (Wi-Fi 1-7)</li>
              <li>• Bandas 2.4GHz, 5GHz e 6GHz</li>
              <li>• Canais e largura de banda (20/40/80/160MHz)</li>
              <li>• Modulação OFDM e OFDMA</li>
              <li>• MU-MIMO (Multiple User - Multiple Input Multiple Output)</li>
            </ul>
          </div>
          <div class="bg-purple-900/10 p-5 rounded-xl border border-purple-500/20">
            <h5 class="text-purple-400 font-bold mb-3">Protocolos de Segurança</h5>
            <ul class="text-sm text-gray-300 space-y-2">
              <li>• WEP (obsoleto e inseguro)</li>
              <li>• WPA/WPA2 (PSK e Enterprise)</li>
              <li>• WPA3 (192-bit security e SAE)</li>
              <li>• WPA3-SAE (Simultaneous Authentication of Equals)</li>
              <li>• OWE (Opportunistic Wireless Encryption)</li>
            </ul>
          </div>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">⚙️ Arquitetura de Roteamento e Processamento</h4>
        <p class="mb-4 text-gray-300">
          O roteador executa múltiplas funções de rede com base em hardware e firmware:
        </p>
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-gray-300 border border-gray-700 rounded-lg">
            <thead class="bg-gray-800">
              <tr>
                <th class="p-3 text-left">Componente</th>
                <th class="p-3 text-left">Função</th>
                <th class="p-3 text-left">Importância</th>
                <th class="p-3 text-left">Técnica</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-t border-gray-700">
                <td class="p-3">CPU do Roteador</td>
                <td class="p-3">Processamento de pacotes e firewall</td>
                <td class="p-3">Crítica</td>
                <td class="p-3">ARM/MIPS cores</td>
              </tr>
              <tr class="border-t border-gray-700 bg-gray-800/30">
                <td class="p-3">RAM</td>
                <td class="p-3">Buffer de pacotes e conexões</td>
                <td class="p-3">Essencial</td>
                <td class="p-3">128MB-1GB+</td>
              </tr>
              <tr class="border-t border-gray-700">
                <td class="p-3">Chip Wi-Fi</td>
                <td class="p-3">Modulação e transmissão</td>
                <td class="p-3">Crítica</td>
                <td class="p-3">Qualcomm/Atheros/MediaTek</td>
              </tr>
              <tr class="border-t border-gray-700 bg-gray-800/30">
                <td class="p-3">QoS</td>
                <td class="p-3">Priorização de tráfego</td>
                <td class="p-3">Importante</td>
                <td class="p-3">HTB/DSCP/WMM</td>
              </tr>
              <tr class="border-t border-gray-700">
                <td class="p-3">NAT/Firewall</td>
                <td class="p-3">Tradução e proteção de rede</td>
                <td class="p-3">Essencial</td>
                <td class="p-3">Port forwarding/NAPT</td>
              </tr>
            </tbody>
          </table>
        </div>
      `
    },
    {
      title: "5. Configurações Avançadas de Segurança",
      content: `
        <h4 class="text-white font-bold mb-3">🛡️ Configurações de Segurança Avançadas</h4>
        <p class="mb-4 text-gray-300">
          A segurança de rede vai além da simples senha do Wi-Fi, envolvendo múltiplas camadas de proteção:
        </p>
        <div class="space-y-6">
          <div class="border-l-4 border-green-500 pl-4 py-2 bg-green-900/10">
            <h5 class="text-green-400 font-bold mb-2">Segurança Wi-Fi Avançada</h5>
            <p class="text-gray-300 text-sm">
              Configurações que protegem contra ataques sofisticados:
            </p>
            <ul class="text-sm text-gray-300 space-y-1 mt-2">
              <li>• WPA3 com 192-bit security para redes governamentais</li>
              <li>• WPA3-SAE para proteção contra ataques offline</li>
              <li>• OWE para redes públicas seguras</li>
              <li>• PMF (Protected Management Frames)</li>
              <li>• MAC Address Randomization</li>
            </ul>
          </div>
          <div class="border-l-4 border-blue-500 pl-4 py-2 bg-blue-900/10">
            <h5 class="text-blue-400 font-bold mb-2">Firewall e Acesso Remoto</h5>
            <p class="text-gray-300 text-sm">
              Configurações de firewall e acesso remoto seguras:
            </p>
            <ul class="text-sm text-gray-300 space-y-1 mt-2">
              <li>• Desativar WPS (vulnerabilidade conhecida)</li>
              <li>• Configurar DMZ com cautela</li>
              <li>• Bloquear ping WAN</li>
              <li>• Configuração de VPN no roteador</li>
              <li>• SSH/HTTPS somente via LAN</li>
            </ul>
          </div>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">🔧 Configurações de Segurança Recomendadas</h4>
        <p class="mb-4 text-gray-300">
          Parâmetros que devem ser configurados para segurança ideal:
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-gray-800 p-4 rounded-lg">
            <h5 class="text-cyan-400 font-bold mb-2">Autenticação</h5>
            <ul class="text-sm text-gray-300 space-y-2">
              <li>• Mudar credenciais padrão</li>
              <li>• Atualizar firmware regularmente</li>
              <li>• Configurar autenticação de dois fatores</li>
              <li>• Limitar tentativas de login</li>
            </ul>
          </div>
          <div class="bg-gray-800 p-4 rounded-lg">
            <h5 class="text-purple-400 font-bold mb-2">Monitoramento</h5>
            <ul class="text-sm text-gray-300 space-y-2">
              <li>• Logs de acesso</li>
              <li>• Lista de dispositivos conectados</li>
              <li>• Alertas de tentativas de intrusão</li>
              <li>• Monitoramento de tráfego</li>
            </ul>
          </div>
        </div>
      `
    },
    {
      title: "6. Otimização de Desempenho e QoS",
      content: `
        <h4 class="text-white font-bold mb-3">⚡ Técnicas de Otimização de Desempenho</h4>
        <p class="mb-4 text-gray-300">
          A otimização do roteador envolve configurações que maximizam a eficiência do uso da banda:
        </p>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 my-6">
          <div class="bg-indigo-900/10 p-5 rounded-xl border border-indigo-500/20">
            <h5 class="text-indigo-400 font-bold mb-3">Configurações de Rádio</h5>
            <ul class="text-sm text-gray-300 space-y-2">
              <li>• Potência de transmissão ideal</li>
              <li>• Seleção de canais não congestionados</li>
              <li>• Largura de banda otimizada</li>
              <li>• Agendamento de rádio</li>
              <li>• Beamforming ativo</li>
            </ul>
          </div>
          <div class="bg-cyan-900/10 p-5 rounded-xl border border-cyan-500/20">
            <h5 class="text-cyan-400 font-bold mb-3">QoS Avançado</h5>
            <ul class="text-sm text-gray-300 space-y-2">
              <li>• Priorização por aplicação</li>
              <li>• Controle de largura de banda</li>
              <li>• Marcação de pacotes DSCP</li>
              <li>• Filas de prioridade</li>
              <li>• Agendamento HTB</li>
            </ul>
          </div>
          <div class="bg-green-900/10 p-5 rounded-xl border border-green-500/20">
            <h5 class="text-green-400 font-bold mb-3">Recursos de Hardware</h5>
            <ul class="text-sm text-gray-300 space-y-2">
              <li>• Fast Path/NAT Acceleration</li>
              <li>• Hardware NAT</li>
              <li>• CPU offloading</li>
              <li>• Buffer management</li>
              <li>• Jumbo frames</li>
            </ul>
          </div>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">📊 Configurações de QoS para Diferentes Cenários</h4>
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-gray-300 border border-gray-700 rounded-lg">
            <thead class="bg-gray-800">
              <tr>
                <th class="p-3 text-left">Aplicação</th>
                <th class="p-3 text-left">Prioridade</th>
                <th class="p-3 text-left">Largura de Banda</th>
                <th class="p-3 text-left">Latência</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-t border-gray-700">
                <td class="p-3">Gaming Online</td>
                <td class="p-3">Alta</td>
                <td class="p-3">Garantida</td>
                <td class="p-3">Baixa</td>
              </tr>
              <tr class="border-t border-gray-700 bg-gray-800/30">
                <td class="p-3">Videoconferência</td>
                <td class="p-3">Alta</td>
                <td class="p-3">Garantida</td>
                <td class="p-3">Baixa</td>
              </tr>
              <tr class="border-t border-gray-700">
                <td class="p-3">Streaming 4K</td>
                <td class="p-3">Média</td>
                <td class="p-3">Garantida</td>
                <td class="p-3">Média</td>
              </tr>
              <tr class="border-t border-gray-700 bg-gray-800/30">
                <td class="p-3">Download</td>
                <td class="p-3">Baixa</td>
                <td class="p-3">Remanescente</td>
                <td class="p-3">Média</td>
              </tr>
              <tr class="border-t border-gray-700">
                <td class="p-3">Navegação Web</td>
                <td class="p-3">Média</td>
                <td class="p-3">Remanescente</td>
                <td class="p-3">Média</td>
              </tr>
            </tbody>
          </table>
        </div>
      `
    }
  ];

  const additionalContentSections = [
    {
      title: "7. Configurações Avançadas de Wi-Fi 6/6E e Wi-Fi 7",
      content: `
        <h4 class="text-white font-bold mb-3">📡 Tecnologias de Nova Geração</h4>
        <p class="mb-4 text-gray-300">
          As tecnologias Wi-Fi 6/6E e Wi-Fi 7 introduzem recursos avançados que devem ser configurados adequadamente:
        </p>
        <div class="space-y-6">
          <div class="border-l-4 border-purple-500 pl-4 py-2 bg-purple-900/10">
            <h5 class="text-purple-400 font-bold mb-2">Wi-Fi 6/6E (802.11ax)</h5>
            <p class="text-gray-300 text-sm">
              Oferece melhorias significativas em ambientes com muitos dispositivos:
            </p>
            <ul class="text-sm text-gray-300 space-y-1 mt-2">
              <li>• OFDMA (Orthogonal Frequency Division Multiple Access)</li>
              <li>• MU-MIMO bidirecional (UL/DL)</li>
              <li>• Target Wake Time (TWT) para economia de energia</li>
              <li>• BSS Coloring para redução de interferência</li>
              <li>• Suporte a 1024-QAM para maior eficiência</li>
            </ul>
          </div>
          <div class="border-l-4 border-cyan-500 pl-4 py-2 bg-cyan-900/10">
            <h5 class="text-cyan-400 font-bold mb-2">Wi-Fi 7 (802.11be)</h5>
            <p class="text-gray-300 text-sm">
              A próxima geração com recursos avançados para aplicações exigentes:
            </p>
            <ul class="text-sm text-gray-300 space-y-1 mt-2">
              <li>• 320 MHz de largura de canal</li>
              <li>• 4096-QAM para maior throughput</li>
              <li>• Multi-AP Coordination</li>
              <li>• Multi-Link Operation (MLO)</li>
              <li>• Latência extremamente baixa</li>
            </ul>
          </div>
          <div class="border-l-4 border-yellow-500 pl-4 py-2 bg-yellow-900/10">
            <h5 class="text-yellow-400 font-bold mb-2">Configurações Específicas</h5>
            <p class="text-gray-300 text-sm">
              Parâmetros que devem ser ajustados para aproveitar ao máximo a tecnologia:
            </p>
            <ul class="text-sm text-gray-300 space-y-1 mt-2">
              <li>• Habilitar OFDMA em ambos os bandas</li>
              <li>• Configurar MU-MIMO para upload e download</li>
              <li>• Ajustar TWT para dispositivos IoT</li>
              <li>• Utilizar BSS Coloring em ambientes densos</li>
              <li>• Configurar canais 6GHz para Wi-Fi 6E</li>
            </ul>
          </div>
        </div>
      `
    },
    {
      title: "8. Monitoramento e Diagnóstico de Rede",
      content: `
        <h4 class="text-white font-bold mb-3">🔍 Ferramentas e Técnicas de Monitoramento</h4>
        <p class="mb-4 text-gray-300">
          Monitorar o desempenho da rede é essencial para manter a qualidade do serviço:
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h5 class="text-blue-400 font-bold mb-3">Ferramentas de Hardware</h5>
            <ul class="text-sm text-gray-300 space-y-2">
              <li>• Wi-Fi analyzers (NetSpot, inSSIDer)</li>
              <li>• Medidores de sinal (WiFi Analyzer)</li>
              <li>• Ferramentas de diagnóstico embutidas</li>
              <li>• Dashboards do roteador</li>
              <li>• SNMP para monitoramento remoto</li>
            </ul>
          </div>
          <div class="bg-green-900/10 p-5 rounded-xl border border-green-500/20">
            <h5 class="text-green-400 font-bold mb-3">Métricas Importantes</h5>
            <ul class="text-sm text-gray-300 space-y-2">
              <li>• RSSI (Received Signal Strength Indicator)</li>
              <li>• SNR (Signal-to-Noise Ratio)</li>
              <li>• Throughput real x teórico</li>
              <li>• Latência e jitter</li>
              <li>• Taxa de retransmissão</li>
            </ul>
          </div>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">🛠️ Diagnóstico de Problemas Comuns</h4>
        <p class="mb-4 text-gray-300">
          Procedimentos para identificar e resolver problemas de rede:
        </p>
        <ul class="list-disc list-inside text-gray-300 space-y-3 ml-4">
          <li><strong>Latência alta:</strong> Verificar interferência de micro-ondas, outros roteadores, dispositivos Bluetooth</li>
          <li><strong>Velocidade baixa:</strong> Testar cabos Ethernet, verificar MTU, checar QoS</li>
          <li><strong>Desconexões:</strong> Atualizar firmware, verificar potência de transmissão, checar superaquecimento</li>
          <li><strong>Conflitos de IP:</strong> Verificar DHCP settings, escopo de IPs disponíveis</li>
          <li><strong>Problemas de roaming:</strong> Configurar canais adjacentes, verificar roaming assistido</li>
        </ul>
      `
    },
    {
      title: "9. Configurações para Ambientes Corporativos",
      content: `
        <h4 class="text-white font-bold mb-3">🏢 Cenários de Uso Avançado</h4>
        <p class="mb-4 text-gray-300">
          Em ambientes corporativos, as configurações de rede precisam de maior controle e segurança:
        </p>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
          <div class="bg-indigo-900/10 p-5 rounded-xl border border-indigo-500/20">
            <h5 class="text-indigo-400 font-bold mb-3">VLANs e Segmentação</h5>
            <ul class="text-sm text-gray-300 space-y-2">
              <li>• Separação de tráfego por departamento</li>
              <li>• Redes guest isoladas</li>
              <li>• QoS diferenciado por VLAN</li>
              <li>• Controle de acesso baseado em função</li>
              <li>• Monitoramento granular</li>
            </ul>
          </div>
          <div class="bg-cyan-900/10 p-5 rounded-xl border border-cyan-500/20">
            <h5 class="text-cyan-400 font-bold mb-3">Autenticação Avançada</h5>
            <ul class="text-sm text-gray-300 space-y-2">
              <li>• WPA2/WPA3-Enterprise</li>
              <li>• RADIUS server integration</li>
              <li>• Certificados digitais</li>
              <li>• 802.1X port-based authentication</li>
              <li>• Captive portal para visitantes</li>
            </ul>
          </div>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">📋 Checklist de Segurança Corporativa</h4>
        <p class="mb-4 text-gray-300">
          Elementos críticos para segurança em redes empresariais:
        </p>
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-gray-300 border border-gray-700 rounded-lg">
            <thead class="bg-gray-800">
              <tr>
                <th class="p-3 text-left">Item</th>
                <th class="p-3 text-left">Descrição</th>
                <th class="p-3 text-left">Importância</th>
                <th class="p-3 text-left">Frequência</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-t border-gray-700">
                <td class="p-3">Atualização de Firmware</td>
                <td class="p-3">Manter roteadores atualizados com patches de segurança</td>
                <td class="p-3">Crítica</td>
                <td class="p-3">Mensal</td>
              </tr>
              <tr class="border-t border-gray-700 bg-gray-800/30">
                <td class="p-3">Auditoria de Acessos</td>
                <td class="p-3">Revisar dispositivos conectados e permissões</td>
                <td class="p-3">Alta</td>
                <td class="p-3">Semanal</td>
              </tr>
              <tr class="border-t border-gray-700">
                <td class="p-3">Backup de Configurações</td>
                <td class="p-3">Salvar configurações críticas regularmente</td>
                <td class="p-3">Alta</td>
                <td class="p-3">Semanal</td>
              </tr>
              <tr class="border-t border-gray-700 bg-gray-800/30">
                <td class="p-3">Monitoramento de Tráfego</td>
                <td class="p-3">Identificar padrões anormais ou vazamentos de dados</td>
                <td class="p-3">Média</td>
                <td class="p-3">Contínuo</td>
              </tr>
              <tr class="border-t border-gray-700">
                <td class="p-3">Testes de Penetração</td>
                <td class="p-3">Verificar vulnerabilidades na rede Wi-Fi</td>
                <td class="p-3">Alta</td>
                <td class="p-3">Trimestral</td>
              </tr>
            </tbody>
          </table>
        </div>
      `
    }
  ];

  const relatedGuides = [
    {
      href: "/guias/abrir-portas-roteador-nat-aberto",
      title: "Abrir Portas",
      description: "Melhore o NAT para jogos online."
    },
    {
      href: "/guias/reduzir-ping-jogos-online",
      title: "Reduzir Ping",
      description: "Ajustes de latência no Windows 11."
    },
    {
      href: "/guias/seguranca-digital",
      title: "Proteção de Rede",
      description: "Aprenda a blindar sua conexão wifi."
    }
  ];

  const allContentSections = [...contentSections, ...additionalContentSections];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="20 min"
      difficultyLevel="Médio"
      contentSections={allContentSections}
      advancedContentSections={advancedContentSections}
      summaryTable={summaryTable}
      relatedGuides={relatedGuides}
    />
  );
}
