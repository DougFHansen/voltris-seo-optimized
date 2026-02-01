import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Clash Royale e Clash of Clans no PC (Oficial): Supercell ID e Sem Emulador (2026)";
const description = "A Supercell lançou versões nativas de PC para Clash Royale e CoC. Veja como baixar, logar com Supercell ID e as vantagens sobre emuladores.";
const keywords = ['clash royale pc download oficial', 'clash of clans pc oficial', 'jogar clash royale pc sem emulador', 'supercell id login pc', 'clash of clans google play games', 'clash royale 120 fps pc'];

export const metadata: Metadata = createGuideMetadata('clash-royale-clash-of-clans-pc-oficial', title, description, keywords);

export default function SupercellGuide() {
    const summaryTable = [
        { label: "Método", value: "Google Play Games" },
        { label: "FPS", value: "Ilimitado" },
        { label: "Controles", value: "Mouse Preciso" },
        { label: "Emulador", value: "Não Precisa" }
    ];

    const contentSections = [
        {
            title: "Chegou a hora de deletar o Emulador",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
          Durante anos, jogar Clash Royale no PC significava lidar com emuladores travando. Agora, a Supercell lançou os portais oficiais dentro do <strong>Google Play Games beta</strong>.
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed font-bold text-green-400">
           Vantagem Suprema: O jogo não esquenta seu PC. Roda como se fosse Campo Minado, ultra leve.
        </p>
      `,
            subsections: []
        },
        {
            title: "Como Instalar",
            content: `
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4 mb-6">
            <li>Baixe o <strong>Google Play Games beta</strong> no site oficial do Android.</li>
            <li>Habilite a Virtualização na BIOS (Se ainda não tiver feito).</li>
            <li>Faça login com sua conta Google.</li>
            <li>Pesquise por "Clash Royale" ou "Clash of Clans".</li>
            <li>Instale.</li>
        </ol>
      `,
            subsections: []
        },
        {
            title: "Migrando sua conta (Supercell ID)",
            content: `
        <p class="mb-4 text-gray-300">
            Não comece do zero!
        </p>
        <ul class="list-disc list-inside text-gray-300 space-y-2">
            <li>Abra o jogo no PC.</li>
            <li>Vá nas configurações (Engrenagem).</li>
            <li>Clique no botão azul <strong>Supercell ID</strong>.</li>
            <li>Coloque seu e-mail.</li>
            <li>Vá no seu e-mail (no celular ou PC), pegue o código de 6 dígitos.</li>
            <li>Digite no jogo. Pronto, sua vila CV15 está na tela grande.</li>
        </ul>
      `
        },
        {
            title: "Dica de Pro Player: Keybinds",
            content: `
        <p class="text-gray-300 mb-4">
            No Clash of Clans, você pode usar teclas (1, 2, 3...) para selecionar as tropas em vez de clicar. Isso faz o ataque "LaLo" ou "Queen Walk" ser muito mais rápido do que com dedo na tela.
        </p>
        <p class="text-gray-300">
            No Clash Royale, use as teclas para soltar cartas rapidamente no "Double Elixir".
        </p>
      `
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="10 min"
            difficultyLevel="Iniciante"
            contentSections={contentSections}
            summaryTable={summaryTable}
        />
    );
}
