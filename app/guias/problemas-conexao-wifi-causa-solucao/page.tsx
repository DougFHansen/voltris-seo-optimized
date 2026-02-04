import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Problemas de Wi-Fi: Como resolver quedas e sinal fraco (2026)";
const description = "Seu Wi-Fi vive caindo ou a velocidade está baixa? Aprenda a configurar seu roteador e o Windows 11 para ter uma conexão Wi-Fi estável em 2026.";
const keywords = [
    'wifi caindo no windows 11 como resolver 2026',
    'sinal wifi fraco notebook tutorial 2026',
    'melhorar velocidade wifi 5ghz vs 2.4ghz guia',
    'resetar driver de rede wifi windows tutorial',
    'canal de wifi saturado como mudar tutorial 2026'
];

export const metadata: Metadata = createGuideMetadata('problemas-conexao-wifi-causa-solucao', title, description, keywords);

export default function WiFiSolutionsGuide() {
    const summaryTable = [
        { label: "Banda 2.4GHz", value: "Maior alcance / Menor velocidade" },
        { label: "Banda 5GHz / 6GHz", value: "Menor alcance / Velocidade Altíssima" },
        { label: "Check de Hardware", value: "Antenas mal posicionadas" },
        { label: "Dificuldade", value: "Iniciante" }
    ];

    const contentSections = [
        {
            title: "O Wi-Fi: invisível e instável",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Em 2026, com o aumento de dispositivos inteligentes (lâmpadas, TVs, geladeiras), o ar das nossas casas está lotado de ondas de rádio. O maior problema do Wi-Fi não é a falta de tecnologia, mas a **interferência**. Se o seu notebook gamer ou PC de trabalho está sofrendo com quedas de sinal, o culpado provavelmente não é o aparelho em si, mas sim o "congestionamento" de canais ao seu redor.
        </p>
      `
        },
        {
            title: "1. 2.4GHz vs 5GHz: Escolha a Batalha Certa",
            content: `
        <p class="mb-4 text-gray-300">Entenda para onde conectar cada dispositivo:</p>
        <ul class="list-disc list-inside text-gray-300 space-y-3">
            <li><strong>2.4GHz:</strong> Use apenas para dispositivos lentos ou se houver muitas paredes entre você e o roteador. É uma frequência lenta, mas que atravessa concreto com facilidade.</li>
            <li><strong>5GHz / 6GHz (Wi-Fi 6E/7):</strong> Obrigatório para notebooks de 2026. A velocidade é comparável ao cabo, mas qualquer parede grossa derruba o sinal pela metade. Tente manter o roteador no mesmo cômodo ou use sistemas Mesh.</li>
        </ul >
      `
        },
        {
            title: "2. Gerenciamento de Energia no Windows 11",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">PC "dormindo" na rede:</h4>
            <p class="text-sm text-gray-300">
                Uma causa comum de quedas no Wi-Fi é o Windows tentando economizar bateria. <br/><br/>
                1. Vá no Gerenciador de Dispositivos. <br/>
                2. Expanda 'Adaptadores de Rede' e clique com o botão direito no seu Wi-Fi. <br/>
                3. Vá em 'Gerenciamento de Energia' e <strong>DESMARQUE</strong> a caixa: 'O computador pode desligar o dispositivo para economizar energia'. Isso evita que o Wi-Fi caia após alguns minutos de inatividade.
            </p>
        </div>
      `
        },
        {
            title: "3. Limpando a Pilha de Rede (Flush)",
            content: `
        <p class="mb-4 text-gray-300">
            Se o Wi-Fi conecta mas a internet não carrega nada:
            <br/><br/>Abra o CMD como administrador e digite estes três comandos em ordem:
            <br/>1. <code>netsh winsock reset</code>
            <br/>2. <code>netsh int ip reset</code>
            <br/>3. <code>ipconfig /flushdns</code>
            <br/>Isso limpa todos os "caminhos" antigos de rede que podem estar corrompidos após uma atualização do Windows 11 em 2026.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/configuracao-roteador-wifi",
            title: "Configurar Roteador",
            description: "Aprenda a mudar o canal do Wi-Fi."
        },
        {
            href: "/guias/troubleshooting-internet",
            title: "Internet troubleshooting",
            description: "Dicas extras para problemas de provedor."
        },
        {
            href: "/guias/perda-de-pacote-packet-loss-fix",
            title: "Packet Loss",
            description: "Como resolver o lag no Wi-Fi."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="15 min"
            difficultyLevel="Iniciante"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
