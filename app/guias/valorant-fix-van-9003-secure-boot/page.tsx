import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Valorant: Como Corrigir Erro VAN 9003 (Secure Boot) - Voltris";
const description = "O Valorant não abre no Windows 11? Aprenda a ativar o Secure Boot e TPM 2.0 na BIOS para resolver o erro VAN 9003 definitivamente.";
const keywords = ['erro van 9003', 'valorant secure boot', 'ativar tpm 2.0 valorant', 'van 9003 windows 11', 'valorant nao abre'];

export const metadata: Metadata = createGuideMetadata('valorant-fix-van-9003-secure-boot', title, description, keywords);

export default function ValorantVanGuide() {
    const summaryTable = [
        { label: "Erro", value: "VAN 9003" },
        { label: "Solução", value: "BIOS Config" }
    ];

    const contentSections = [
        {
            title: "Por que isso acontece?",
            content: `
        <p class="mb-4">O Windows 11 exige segurança máxima para rodar o Vanguard (Anti-Cheat do Valorant). Se o <strong>Secure Boot</strong> (Inicialização Segura) estiver desligado na BIOS, o jogo bloqueia seu acesso.</p>
      `,
            subsections: []
        },
        {
            title: "Como Ativar na BIOS",
            content: `
        <ol class="space-y-4 text-gray-300 list-decimal list-inside ml-4">
            <li>Reinicie o PC e entre na BIOS (DEL ou F2).</li>
            <li>Procure pela aba <strong>Boot</strong> ou <strong>Security</strong>.</li>
            <li>Encontre "Secure Boot" e mude para <strong>Enabled</strong>.</li>
            <li><span class="text-yellow-400">Atenção:</span> Se estiver em "Standard" ou "Custom", deixe em Standard. O "OS Type" deve ser "Windows UEFI Mode".</li>
            <li>Procure também por <strong>TPM 2.0</strong> (ou fTPM/PTT) e ative.</li>
            <li>Salve (F10) e reinicie.</li>
        </ol>
      `
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="10 minutos"
            difficultyLevel="Intermediário"
            contentSections={contentSections}
            summaryTable={summaryTable}
        />
    );
}
