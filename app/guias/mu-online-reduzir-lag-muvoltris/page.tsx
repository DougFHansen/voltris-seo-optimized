import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Mu Online: Como tirar o Lag e aumentar o FPS em 2026";
const description = "Sofrendo com travadas no Mu Online? Aprenda a otimizar o motor clássico do Mu para rodar liso em invasões e castelos, mesmo em PCs fracos.";
const keywords = [
    'como tirar lag mu online 2026 tutorial',
    'mu online fps boost pc fraco guia',
    'reduzir lag de skills mu online tutorial',
    'configurar main.exe mu online performance 2026',
    'mu online travando no windows 11 fix'
];

export const metadata: Metadata = createGuideMetadata('mu-online-reduzir-lag-muvoltris', title, description, keywords);

export default function MuOnlineFixGuide() {
    const summaryTable = [
        { label: "Motor Gráfico", value: "OpenGL antigo (Single Core)" },
        { label: "Solução #1", value: "Desativar Efeitos Dinâmicos (F9/F10)" },
        { label: "Check de Rede", value: "Priorizar conexão via cabo (Ethernet)" },
        { label: "Dificuldade", value: "Fácil" }
    ];

    const contentSections = [
        {
            title: "O desafio de rodar um clássico em 2026",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O **Mu Online** é um jogo que nasceu em uma época onde as placas de vídeo nem eram obrigatórias. Por isso, seu motor gráfico é extremamente dependente de um único núcleo do processador. Em 2026, com monitores de alta resolução, o Mu pode apresentar "engasgos" mesmo em PCs de última geração se o sistema não estiver configurado para lidar com instruções de vídeo antigas.
        </p>
      `
        },
        {
            title: "1. Otimização In-Game: Atalhos de Performance",
            content: `
        <p class="mb-4 text-gray-300">A maioria dos servidores modernos de Mu possui comandos de otimização nativos:</p>
        <ul class="list-disc list-inside text-gray-300 space-y-3">
            <li><strong>F9 / Tecla O:</strong> Geralmente desativa efeitos de brilho das asas e itens (+11/+15). Em Lorencia lotada, isso triplica seu FPS.</li>
            <li><strong>Desativar Som:</strong> Parece bobagem, mas o driver de áudio do Mu Online é muito antigo e pode causar micro-travadas cada vez que uma skill toca um som.</li>
            <li><strong>Ajuste de Anti-Aliasing:</strong> No launcher, procure manter o Antialiasing em 0 ou 2x. Mais que isso apenas borra a imagem no motor gráfico do Mu.</li>
        </ul >
      `
        },
        {
            title: "2. Compatibilidade no Windows 11",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Ajuste técnico:</h4>
            <p class="text-sm text-gray-300">
                1. Clique com o botão direito no <code>main.exe</code> do seu Mu Online. <br/>
                2. Vá em Propriedades > Compatibilidade. <br/>
                3. Marque <strong>'Desabilitar otimizações de tela inteira'</strong>. <br/>
                4. Clique em 'Alterar configurações de DPI alto' e marque a opção 'Substituir o ajuste de DPI'. <br/>
                Isso evita que o Windows tente "esticar" o jogo, o que causa latência de entrada e mouse pesado.
            </p>
        </div>
      `
        },
        {
            title: "3. Latência e Conectividade",
            content: `
        <p class="mb-4 text-gray-300">
            O lag no Mu muitas vezes é de rede, não de FPS. 
            <br/><br/><strong>Dica:</strong> Se suas skills demoram para sair, mude o seu <strong>DNS</strong>para o do Google ou Cloudflare. Evite jogar no Wi-Fi; o Mu Online não lida bem com perda de pacotes pequena, o que causa o efeito de "teletransporte" (desync) onde você volta para o lugar onde estava segundos atrás.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/reduzir-ping-jogos-online",
            title: "Reduzir Ping",
            description: "Dicas gerais para jogos competitivos."
        },
        {
            href: "/guias/melhor-dns-jogos-2026",
            title: "Melhores DNS",
            description: "Escolha o servidor ideal para o Mu."
        },
        {
            href: "/guias/lineage-2-otimizar-pvp-fps",
            title: "Otimizar MMORPG",
            description: "Dicas para outros clássicos."
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
