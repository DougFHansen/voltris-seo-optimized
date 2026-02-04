import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Como rodar Clash Royale e Clash of Clans no PC Oficialmente (2026)";
const description = "Chega de emuladores lentos! Aprenda como jogar Clash Royale e Clash of Clans no seu computador usando o Google Play Games oficial em 2026.";
const keywords = [
    'como jogar clash royale no pc oficial 2026',
    'clash of clans para pc google play games tutorial',
    'jogar jogos de celular no pc windows 11 oficial guia',
    'google play games pc requisitos e instalacao 2026',
    'clash royale pc lag fix e controles tutorial'
];

export const metadata: Metadata = createGuideMetadata('clash-royale-clash-of-clans-pc-oficial', title, description, keywords);

export default function SupercellPCGuide() {
    const summaryTable = [
        { label: "Método", value: "Google Play Games para PC (Beta/Oficial)" },
        { label: "Vantagem", value: "Performance Nativa / Sem Virus" },
        { label: "Gráficos", value: "Suporte a 4K e 60+ FPS" },
        { label: "Dificuldade", value: "Fácil" }
    ];

    const contentSections = [
        {
            title: "A era pós-emuladores em 2026",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Por muitos anos, você precisava de programas pesados como BlueStacks para jogar Clash no PC. Em 2026, a Supercell e o Google lançaram a versão oficial para Windows via **Google Play Games**. Agora, o jogo roda como um aplicativo nativo do Windows 11, usando todo o poder da sua placa de vídeo e processador sem a lentidão de uma emulação completa de Android.
        </p>
      `
        },
        {
            title: "1. Requisitos do Sistema em 2026",
            content: `
        <p class="mb-4 text-gray-300">Para rodar os jogos da Supercell, seu PC precisa de:</p>
        <ul class="list-disc list-inside text-gray-300 space-y-3">
            <li><strong>Sistema:</strong> Windows 10 ou Windows 11 atualizado.</li>
            <li><strong>Armazenamento:</strong> SSD é obrigatório para evitar travadas no carregamento.</li>
            <li><strong>Memória:</strong> 8GB de RAM.</li>
            <li><strong>Hardware:</strong> Virtualização (VT-x ou AMD-V) ativa na BIOS (essencial).</li>
        </ul >
      `
        },
        {
            title: "2. Passo a Passo da Instalação",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Tutorial Rápido:</h4>
            <p class="text-sm text-gray-300">
                1. Acesse <strong>play.google.com/googleplaygames</strong> e baixe o instalador. <br/>
                2. Siga as instruções de instalação e faça login na sua Conta Google. <br/>
                3. Pesquise por 'Clash Royale' ou 'Clash of Clans' na loja e clique em 'Instalar no Windows'. <br/>
                4. O Google Play Games configurará automaticamente o seu teclado para ser usado no lugar do toque na tela.
            </p>
        </div>
      `
        },
        {
            title: "3. Sincronização e Supercell ID",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>Não perca sua vila:</strong> 
            <br/><br/>Ao abrir o jogo no PC, faça login imediatamente com o seu **Supercell ID**. Isso garante que todo o progresso que você tem no celular (Android ou iPhone) seja espelhado no computador. Em 2026, você pode jogar no ônibus pelo celular e continuar a mesma guerra de clãs no PC assim que chegar em casa, com as mesmas tropas e recursos.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/google-play-games-pc-beta-vale-a-pena",
            title: "Review Google Play PC",
            description: "Vale a pena trocar o emulador pelo oficial?"
        },
        {
            href: "/guias/jogos-android-no-pc-melhores-emuladores",
            title: "Melhores Emuladores",
            description: "Para jogos que ainda não estão no Google Play PC."
        },
        {
            href: "/guias/bluestacks-vs-ldplayer-qual-mais-leve",
            title: "BlueStacks vs LDPlayer",
            description: "Comparativo de emuladores para PC fraco."
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
