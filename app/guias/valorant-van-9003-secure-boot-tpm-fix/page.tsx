import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Valorant VAN 9003 e TPM 2.0: Guia por Placa-Mãe (2026)";
const description = "Saiba como ativar o TPM 2.0 e o Secure Boot em placas ASUS, Gigabyte, MSI e ASRock para resolver o erro VAN 9003 do Valorant em 2026.";
const keywords = [
    'valorant van 9003 tpm 2.0 como ativar 2026',
    'erro van 9003 placa mae gigabyte tutorial',
    'ativar tpm 2.0 asus valorant windows 11 guia',
    'valorant vanguard tpm 2.0 fix msi tutorial 2026',
    'como saber se meu pc tem tpm 2.0 para valorant guia'
];

export const metadata: Metadata = createGuideMetadata('valorant-van-9003-secure-boot-tpm-fix', title, description, keywords);

export default function ValorantTPMGuide() {
    const summaryTable = [
        { label: "ASUS", value: "Procure por PTT ou fTPM na aba Advanced" },
        { label: "Gigabyte", value: "Intel Platform Trust Tech ou AMD fTPM" },
        { label: "MSI", value: "Security Device Support: Enable" },
        { label: "Dificuldade", value: "Intermediária" }
    ];

    const contentSections = [
        {
            title: "O que é o TPM e por que o Valorant exige?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O **TPM 2.0** (Trusted Platform Module) é um componente de segurança que protege chaves de criptografia e identidades. Em 2026, a Riot Games usa o TPM para "marcar" o seu hardware. Se um trapaceiro for banido, o Vanguard bane o ID do TPM, tornando impossível para ele criar uma nova conta no mesmo PC. Por isso, no Windows 11, o Valorant exige que ele esteja ativado.
        </p>
      `
        },
        {
            title: "1. Como ver se o TPM está ativo agora",
            content: `
        <p class="mb-4 text-gray-300">Não precisa abrir a BIOS para checar:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Aperte <strong>Win + R</strong> e digite <code>tpm.msc</code>.</li>
            <li>Se aparecer 'O TPM está pronto para uso', seu problema é apenas o **Secure Boot**.</li>
            <li>Se aparecer 'Não é possível encontrar o TPM compatível', você precisa ativá-lo na BIOS.</li>
        </ol>
      `
        },
        {
            title: "2. Ativando por Marca de Placa-Mãe",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Onde encontrar a opção:</h4>
            <ul class="text-sm text-gray-300 space-y-2">
                <li><strong>ASUS:</strong> Advanced > PCH-FW Configuration > PTT OU Advanced > CPU Configuration > fTPM.</li>
                <li><strong>Gigabyte:</strong> Settings > Miscellaneous > Intel Platform Trust Technology (PTT) OU Peripherals > AMD CPU fTPM.</li>
                <li><strong>MSI:</strong> Security > Trusted Computing > Security Device Support [Enabled].</li>
                <li><strong>ASRock:</strong> Security > Intel (R) Platform Trust Technology [Enabled].</li>
            </ul>
        </div>
      `
        },
        {
            title: "3. Aviso sobre Modo de BIOS (UEFI)",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>O Erro persiste?</strong> 
            <br/><br/>Muitos usuários ativam o TPM mas o erro VAN 9003 continua. Isso acontece porque o Windows 11 está instalado no modo **CSM/Legacy**. Em 2026, para que o TPM e o Secure Boot funcionem para o Vanguard, o seu 'Modo da BIOS' deve estar em <strong>UEFI</strong>. Se você mudar para UEFI e o PC não der boot, significa que você precisa converter seu SSD de MBR para GPT.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/valorant-fix-van-9003-secure-boot",
            title: "Guia Secure Boot",
            description: "Ative a segurança final para o Vanguard."
        },
        {
            href: "/guias/criar-ponto-restauracao-windows",
            title: "Ponto de Restauração",
            description: "Segurança antes de mexer na BIOS."
        },
        {
            href: "/guias/valorant-reduzir-input-lag",
            title: "Reduzir Input Lag",
            description: "Melhore sua resposta no jogo."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="20 min"
            difficultyLevel="Intermediária"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
