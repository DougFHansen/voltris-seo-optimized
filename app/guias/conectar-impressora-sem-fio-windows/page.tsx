import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'conectar-impressora-sem-fio-windows',
  title: "Conectar Impressora Sem Fio Windows (2026) - Tutorial Completo",
  description: "Aprenda a conectar facilmente uma impressora sem fio no Windows 10/11. Tutorial passo a passo para configuração de impressoras Wi-Fi.",
  category: 'windows-geral',
  difficulty: 'Iniciante',
  time: '8 min'
};

const title = "Conectar Impressora Sem Fio Windows (2026) - Tutorial Completo";
const description = "Aprenda a conectar facilmente uma impressora sem fio no Windows 10/11. Tutorial passo a passo para configuração de impressoras Wi-Fi.";
const keywords = [
    'conectar facilmente uma impressora sem fio no windows 2026',
    'como configurar impressora wifi windows 10 11',
    'impressora sem fio windows tutorial passo a passo',
    'instalar impressora wireless windows 2026',
    'conectar impressora wifi windows 10',
    'configurar impressora sem fio windows 11',
    'impressora wifi não conecta windows',
    'como adicionar impressora sem fio windows',
    'instalar impressora sem cabo windows',
    'configurar impressora de rede windows',
    'impressora wireless windows tutorial completo'
];

export const metadata: Metadata = createGuideMetadata('conectar-impressora-sem-fio-windows', title, description, keywords);

export default function ConectarImpressoraSemFioWindowsGuide() {
    const summaryTable = [
        { label: "Nível de Dificuldade", value: "Iniciante" },
        { label: "Tempo Estimado", value: "8 minutos" },
        { label: "Suporte Principal", value: "Wi-Fi, USB, Ethernet" }
    ];

    const contentSections = [
        {
            title: "Por Que Conectar Impressora Sem Fio?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Conectar uma <strong>impressora sem fio</strong> oferece <strong>conveniência máxima</strong> no escritório ou em casa. Sem cabos bagunçando o ambiente, múltiplos dispositivos podem usar a mesma impressora, e você pode imprimir de qualquer lugar na rede.
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Em 2026, as impressoras Wi-Fi evoluíram com <strong>tecnologias avançadas</strong> como <strong>Wi-Fi Direct</strong>, <strong>AirPrint</strong> e <strong>impressão móvel</strong>, tornando o processo mais simples que nunca.
        </p>
        `
        },
        {
            title: "Verificando Compatibilidade",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Antes de começar, verifique se sua impressora é <strong>compatível com Windows</strong> e suporta conexão sem fio:
        </p>
        <div class="bg-gray-800 rounded-lg p-6 mb-6">
          <h3 class="text-xl font-bold mb-4 text-blue-400">📋 Checklist de Compatibilidade:</h3>
          <div class="grid md:grid-cols-2 gap-4">
            <div class="space-y-4">
              <h4 class="text-lg font-semibold text-blue-300 mb-2">✅ Compatível com:</h4>
              <ul class="space-y-2 text-gray-300">
                <li>Windows 10/11 (todas as versões)</li>
                <li>Wi-Fi 802.11 b/g/n/ac/ax</li>
                <li>Wi-Fi Direct (para conexão direta)</li>
                <li>USB (para configuração inicial)</li>
                <li>Ethernet (alternativa sem fio)</li>
              </ul>
            </div>
            <div class="space-y-4">
              <h4 class="text-lg font-semibold text-blue-300 mb-2">🏷️ Marcas Populares:</h4>
              <ul class="space-y-2 text-gray-300">
                <li>HP (todos os modelos 2015+)</li>
                <li>Canon (PIXMA, MAXIFY)</li>
                <li>Epson (EcoTank, WorkForce)</li>
                <li>Brother (MFC, HL series)</li>
                <li>Samsung (Xpress, MultiPress)</li>
              </ul>
            </div>
          </div>
        </div>
        `
        },
        {
            title: "Método 1: Conexão Wi-Fi Direta",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O método mais <strong>simples e direto</strong> para conectar sua impressora sem fio:
        </p>
        <div class="bg-blue-900/20 rounded-lg p-6 mb-6">
          <h3 class="text-xl font-bold mb-4 text-blue-400">📡 Passo a Passo:</h3>
          <ol class="space-y-4 text-gray-300 list-decimal list-inside">
            <li class="mb-4">
              <strong>1. Preparar a Impressora:</strong>
              <ul class="space-y-1 text-gray-300 ml-4">
                <li>Ligue a impressora e aguarde aquecimento</li>
                <li>Verifique se o Wi-Fi está ativado</li>
                <li>Procure o botão Wi-Fi ou Wireless</li>
              </ul>
            </li>
            <li class="mb-4">
              <strong>2. Ativar Wi-Fi Direct:</strong>
              <ul class="space-y-1 text-gray-300 ml-4">
                <li>Pressione e segure o botão Wi-Fi por 5 segundos</li>
                <li>Aguarde o indicador Wi-Fi piscar</li>
                <li>A impressora entrará em modo de pareamento</li>
              </ul>
            </li>
            <li class="mb-4">
              <strong>3. Conectar no Windows:</strong>
              <ul class="space-y-1 text-gray-300 ml-4">
                <li>Abra Configurações → Dispositivos → Impressoras e scanners</li>
                <li>Clique em "Adicionar impressora ou scanner"</li>
                <li>Selecione "Adicionar uma impressora de rede"</li>
              </ul>
            </li>
            <li class="mb-4">
              <strong>4. Selecionar a Impressora:</strong>
              <ul class="space-y-1 text-gray-300 ml-4">
                <li>Windows buscará impressoras disponíveis</li>
                <li>Selecione sua impressora da lista</li>
                <li>Clique em "Adicionar dispositivo"</li>
              </ul>
            </li>
            <li class="mb-4">
              <strong>5. Configurar e Testar:</strong>
              <ul class="space-y-1 text-gray-300 ml-4">
                <li>Aguarde instalação automática de drivers</li>
                <li>Imprima uma página de teste</li>
                <li>Verifique se a impressora aparece como padrão</li>
              </ul>
            </li>
          </ol>
        </div>
        `
        },
        {
            title: "Método 2: Configuração WPS",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          <strong>WPS (Wi-Fi Protected Setup)</strong> é o método mais <strong>rápido e seguro</strong> para conectar impressoras sem fio:
        </p>
        <div class="bg-green-900/20 rounded-lg p-6 mb-6">
          <h3 class="text-xl font-bold mb-4 text-green-400">🔐 Configuração WPS:</h3>
          <div class="grid md:grid-cols-2 gap-4">
            <div class="space-y-4">
              <h4 class="text-lg font-semibold text-green-400 mb-2">📱 No Roteador:</h4>
              <ul class="space-y-2 text-gray-300">
                <li>Pressione o botão WPS do roteador</li>
                <li>Aguarde o indicador WPS piscar</li>
                <li>Normalmente 60-120 segundos</li>
                <li>O roteador entrará em modo WPS</li>
              </ul>
            </div>
            <div class="space-y-4">
              <h4 class="text-lg font-semibold text-green-400 mb-2">🖨️ Na Impressora:</h4>
              <ul class="space-y-2 text-gray-300">
                <li>Pressione o botão WPS da impressora</li>
                <li>Segure por 3-5 segundos</li>
                <li>Aguarde conexão automática</li>
                <li>Indicador Wi-Fi ficará sólido</li>
              </ul>
            </div>
          </div>
          <div class="mt-4 p-4 bg-green-800/50 rounded-lg border border-green-500/30">
            <h4 class="text-lg font-semibold text-green-300 mb-2">✅ Sucesso!</h4>
            <p class="text-gray-300">A impressora conectará automaticamente à rede. Windows detectará e instalará drivers automaticamente.</p>
          </div>
        </div>
        `
        },
        {
            title: "Método 3: Configuração Manual",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Para <strong>controle total</strong> sobre a configuração, use o método manual:
        </p>
        <div class="bg-purple-900/20 rounded-lg p-6 mb-6">
          <h3 class="text-xl font-bold mb-4 text-purple-400">⚙️ Configuração Manual:</h3>
          <ol class="space-y-4 text-gray-300 list-decimal list-inside">
            <li class="mb-4">
              <strong>1. Obter Informações da Rede:</strong>
              <ul class="space-y-1 text-gray-300 ml-4">
                <li>Nome da rede (SSID)</li>
                <li>Senha do Wi-Fi</li>
                <li>Tipo de segurança (WPA2/WPA3)</li>
                <li>Canal e frequência (2.4GHz/5GHz)</li>
              </ul>
            </li>
            <li class="mb-4">
              <strong>2. Acessar Painel da Impressora:</strong>
              <ul class="space-y-1 text-gray-300 ml-4">
                <li>Conecte via USB inicialmente</li>
                <li>Abra o software do fabricante</li>
                <li>Procure "Configurações de Rede" ou "Wireless Setup"</li>
              </ul>
            </li>
            <li class="mb-4">
              <strong>3. Configurar Rede Wi-Fi:</strong>
              <ul class="space-y-1 text-gray-300 ml-4">
                <li>Selecione sua rede Wi-Fi</li>
                <li>Digite a senha corretamente</li>
                <li>Escolha tipo de segurança</li>
                <li>Salve as configurações</li>
              </ul>
            </li>
            <li class="mb-4">
              <strong>4. Desconectar e Testar:</strong>
              <ul class="space-y-1 text-gray-300 ml-4">
                <li>Desconecte o cabo USB</li>
                <li>Reinicie a impressora</li>
                <li>Teste impressão via Wi-Fi</li>
                <li>Verifique se aparece no Windows</li>
              </ul>
            </li>
          </ol>
        </div>
        `
        },
        {
            title: "Resolução de Problemas Comuns",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Problemas frequentes ao conectar impressoras sem fio e suas <strong>soluções rápidas</strong>:
        </p>
        <div class="space-y-4">
          <div class="bg-red-900/20 border border-red-500/30 rounded-lg p-6 mb-4">
            <h3 class="text-xl font-bold mb-4 text-red-400">🚨 Impressora Não Encontrada</h3>
            <div class="space-y-2 text-gray-300">
              <p class="mb-2"><strong>Causa:</strong> Impressora fora do alcance ou desligada</p>
              <p class="mb-2"><strong>Solução:</strong></p>
              <ul class="space-y-1 text-gray-300 ml-4">
                <li>Verifique se a impressora está ligada</li>
                <li>Confirme se está no mesmo andar/próximo ao roteador</li>
                <li>Reinicie a impressora e o roteador</li>
                <li>Use o aplicativo do fabricante para diagnóstico</li>
              </ul>
            </div>
          </div>
          <div class="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-6 mb-4">
            <h3 class="text-xl font-bold mb-4 text-yellow-400">⚠️ Falha na Conexão</h3>
            <div class="space-y-2 text-gray-300">
              <p class="mb-2"><strong>Causa:</strong> Senha incorreta ou rede muito distante</p>
              <p class="mb-2"><strong>Solução:</strong></p>
              <ul class="space-y-1 text-gray-300 ml-4">
                <li>Verifique a senha do Wi-Fi</li>
                <li>Teste proximidade com o roteador</li>
                <li>Reinicie ambos os dispositivos</li>
                <li>Tente conectar com cabo USB primeiro</li>
              </ul>
            </div>
          </div>
          <div class="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6 mb-4">
            <h3 class="text-xl font-bold mb-4 text-blue-400">🖨️ Drivers Não Instalados</h3>
            <div class="space-y-2 text-gray-300">
              <p class="mb-2"><strong>Causa:</strong> Windows não encontrou drivers automaticamente</p>
              <p class="mb-2"><strong>Solução:</strong></p>
              <ul class="space-y-1 text-gray-300 ml-4">
                <li>Visite o site do fabricante</li>
                <li>Baixe drivers para seu modelo específico</li>
                <li>Instale manualmente</li>
                <li>Reinicie o Windows</li>
              </ul>
            </div>
          </div>
        </div>
        `
        }
    ];

    const faqItems = [
        {
            question: "Qual a diferença entre Wi-Fi e Wi-Fi Direct?",
            answer: "Wi-Fi conecta através do roteador, Wi-Fi Direct conecta diretamente ao dispositivo. Wi-Fi Direct é mais rápido para configuração inicial, mas Wi-Fi oferece melhor estabilidade para uso contínuo."
        },
        {
            question: "Por que minha impressora não aparece no Windows?",
            answer: "Verifique se está na mesma rede, se o firewall está bloqueando, e se os drivers estão instalados. Tente reiniciar a impressora e usar o software do fabricante."
        },
        {
            question: "É seguro usar WPS?",
            answer: "WPS é conveniente mas menos seguro que senha tradicional. Use apenas em redes confiáveis. Para máxima segurança, prefira configuração manual com senha forte."
        },
        {
            question: "Como conectar impressora antiga sem fio?",
            answer: "Verifique se o modelo suporta Wi-Fi. Se não, use um adaptador USB-Wi-Fi ou conecte via cabo ao computador e compartilhe na rede."
        }
    ];

    const externalReferences = [
        { name: "Suporte Microsoft Impressoras", url: "https://support.microsoft.com/pt-br/windows/printers" },
        { name: "Guia de Configuração Wi-Fi", url: "https://www.microsoft.com/pt-br/windows/wifi-setup" },
        { name: "Drivers de Impressoras Populares", url: "https://support.hp.com/pt-br/printers" }
    ];

    const relatedGuides = [
        {
            href: "/guias/otimizacao-windows-11-para-games",
            title: "Otimização Windows 11",
            description: "Configure o Windows para máximo desempenho"
        },
        {
            href: "/guias/configurar-rede-wifi-windows",
            title: "Configurar Rede Wi-Fi",
            description: "Otimize sua conexão sem fio"
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="8 min"
            difficultyLevel="Iniciante"
            contentSections={contentSections}
            summaryTable={summaryTable}
            faqItems={faqItems}
            externalReferences={externalReferences}
            relatedGuides={relatedGuides}
        />
    );
}
