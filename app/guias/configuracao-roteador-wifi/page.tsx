import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

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

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="20 min"
      difficultyLevel="Médio"
      contentSections={contentSections}
      summaryTable={summaryTable}
      relatedGuides={relatedGuides}
    />
  );
}
