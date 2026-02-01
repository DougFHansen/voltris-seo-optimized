import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Discord Lento e Travando Jogos? Guia de Otimização e Aceleração de Hardware (2026)";
const description = "Seu FPS cai quando você entra em call no Discord? Aprenda a desativar a Aceleração de Hardware e o Overlay para salvar sua GPU.";
const keywords = ['discord travando jogos', 'discord pc fraco', 'desativar overlay discord', 'aceleracao hardware discord', 'discord lagando voz', 'otimizar discord 2026'];

export const metadata: Metadata = createGuideMetadata('discord-otimizar-para-jogos', title, description, keywords);

export default function DiscordGuide() {
    const summaryTable = [
        { label: "Hardware Accel", value: "Desativar" },
        { label: "Overlay", value: "Desativar" },
        { label: "Qualidade", value: "Baixa" },
        { label: "Modo", value: "App (Não Web)" }
    ];

    const contentSections = [
        {
            title: "O Veneno da 'Aceleração de Hardware'",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
            O Discord é feito em Electron (basicamente um navegador Chrome disfarçado). Ele usa sua Placa de Vídeo (GPU) para desenhar as animações e interface. Isso é ótimo para PCs fortes, mas terrível se sua GPU já está em 99% de uso rodando o jogo.
        </p>
        <p class="mb-4 text-gray-300 font-bold text-lg text-center bg-red-900/20 p-4 border border-red-500 rounded">
            Se seu jogo trava, DESLIGUE ISSO.
        </p>
        <ol class="list-decimal list-inside text-gray-300 space-y-2 ml-4">
            <li>Vá nas <strong>Configurações de Usuário</strong> (Engrenagem).</li>
            <li>Aba <strong>Avançado</strong>.</li>
            <li>Desmarque: <strong>Aceleração de Hardware</strong>.</li>
            <li>O Discord vai reiniciar. Agora ele usará apenas a CPU para desenhar a interface, deixando a GPU livre para o jogo.</li>
        </ol>
      `,
            subsections: []
        },
        {
            title: "Overlay (Sobreposição In-Game)",
            content: `
        <p class="mb-4 text-gray-300">
            Aquele boneco que acende no canto da tela quando alguém fala consome cerca de 10 a 15 FPS em PCs fracos, além de causar conflito com anti-cheats.
        </p>
        <ol class="list-decimal list-inside text-gray-300 space-y-2 ml-4">
            <li>Configurações > <strong>Overlay de Jogo</strong>.</li>
            <li>Desmarque: <strong>Ativar overlay em jogo</strong>.</li>
        </ol>
      `
        },
        {
            title: "Dica de Ouro: Crise e Cancelamento de Eco",
            content: `
            <p class="text-gray-300 mb-4">
                Se sua voz fica cortando ou o robô "Krisp" consome muita CPU:
            </p>
            <ul class="list-disc list-inside text-gray-300 space-y-2">
                <li>Vá em <strong>Voz e Vídeo</strong>.</li>
                <li>Em "Supressão de Ruído", mude de <strong>Krisp</strong> para <strong>Padrão</strong> (ou Nenhum, se você tiver microfone bom/RTX Voice). O Krisp usa IA pesada.</li>
                <li>Desmarque "Qualidade de Serviço de Pacote Alto" se sua internet for ruim.</li>
            </ul>
        `
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="5 min"
            difficultyLevel="Iniciante"
            contentSections={contentSections}
            summaryTable={summaryTable}
        />
    );
}
