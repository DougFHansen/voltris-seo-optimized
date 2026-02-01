import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Erro VAN 9003 Valorant: Como Ativar Secure Boot e TPM 2.0 (Windows 11) (2026)";
const description = "O Valorant não abre e pede Secure Boot? Veja como entrar na BIOS (Gigabyte, ASUS, MSI) e ativar o TPM 2.0 sem formatar o PC.";
const keywords = ['erro van 9003 valorant', 'ativar secure boot gigabyte asus msi', 'tpm 2.0 valorant windows 11', 'como entrar na bios windows 11', 'valorant vanguard erro van9003', 'converter mbr para gpt sem formatar'];

export const metadata: Metadata = createGuideMetadata('valorant-van-9003-secure-boot-tpm-fix', title, description, keywords);

export default function Van9003Guide() {
    const summaryTable = [
        { label: "Erro", value: "VAN 9003" },
        { label: "Causa", value: "BIOS Desconfigurada" },
        { label: "Requisito 1", value: "UEFI (Não Legacy)" },
        { label: "Requisito 2", value: "Secure Boot ON" }
    ];

    const contentSections = [
        {
            title: "Por que isso acontece no Windows 11?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
          O Vanguard (Anti-Cheat do Valorant) no Windows 11 exige que seu PC garanta segurança de hardware. Isso significa que você PRECISA ter o <strong>TPM 2.0</strong> (Trusted Platform Module) e o <strong>Secure Boot</strong> ativados. Se um deles estiver desligado, o jogo bloqueia o acesso.
        </p>
      `,
            subsections: []
        },
        {
            title: "Passo 1: Verifique se seu Disco é GPT ou MBR",
            content: `
        <div class="bg-red-900/20 p-6 rounded-xl border border-red-500 mb-6">
            <h4 class="text-white font-bold mb-2 text-center">⚠ ATENÇÃO ⚠</h4>
            <p class="text-gray-300 text-sm">
                Se você ativar o Secure Boot em um disco MBR (Antigo), <strong>SEU WINDOWS NÃO VAI MAIS INICIAR</strong>. Verifique antes!
            </p>
        </div>
        <ol class="list-decimal list-inside text-gray-300 space-y-2 ml-4 mb-4">
            <li>Win + R > Digite <code>diskmgmt.msc</code>.</li>
            <li>Clique com botão direito no "Disco 0" (O quadrado cinza à esquerda) > Propriedades.</li>
            <li>Aba "Volumes".</li>
            <li>Em "Estilo de partição":
                <br/><strong class="text-green-400">Tabela de Partição GUID (GPT)</strong> = Seguro. Prossiga.
                <br/><strong class="text-red-400">MBR (Master Boot Record)</strong> = PERIGO. Você precisa converter para GPT antes (Pesquise: "mbr2gpt").
            </li>
        </ol>
      `,
            subsections: []
        },
        {
            title: "Passo 2: Ativando na BIOS (Tutorial Geral)",
            content: `
        <p class="mb-4 text-gray-300">
            Reinicie o PC e fique apertando <strong>DEL</strong> ou <strong>F2</strong> para entrar na BIOS.
        </p>
        <div class="space-y-4">
            <div class="bg-gray-800 p-4 rounded border-l-4 border-blue-500">
                <strong class="text-white block">Gigabyte</strong>
                <p class="text-gray-300 text-sm">
                    Aba BIOS > CSM Support: <strong>Disabled</strong>.
                    <br/>Secure Boot: <strong>Enabled</strong>.
                    <br/>Peripherals > Intel PTT (ou AMD fTPM): <strong>Enabled</strong>.
                </p>
            </div>
            <div class="bg-gray-800 p-4 rounded border-l-4 border-red-500">
                <strong class="text-white block">ASUS</strong>
                <p class="text-gray-300 text-sm">
                    Advanced Mode (F7) > Boot > CMS: <strong>Disabled</strong>.
                    <br/>Secure Boot > OS Type: <strong>Windows UEFI Mode</strong>.
                </p>
            </div>
            <div class="bg-gray-800 p-4 rounded border-l-4 border-gray-500">
                <strong class="text-white block">MSI</strong>
                <p class="text-gray-300 text-sm">
                    Settings > Security > Trusted Computing > Security Device Support: <strong>Enable</strong>.
                    <br/>Advanced > Windows OS Configuration > Secure Boot > <strong>Enable</strong>.
                </p>
            </div>
        </div>
      `,
            subsections: []
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="20 min"
            difficultyLevel="Avançado"
            contentSections={contentSections}
            summaryTable={summaryTable}
        />
    );
}
