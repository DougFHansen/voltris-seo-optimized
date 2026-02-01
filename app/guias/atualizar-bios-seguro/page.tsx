import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Como Atualizar a BIOS da Placa-Mãe com Segurança - Voltris";
const description = "Atualizar a BIOS melhora a compatibilidade com memórias e processadores novos, mas é arriscado. Veja o passo a passo seguro para ASUS, Gigabyte, MSI e ASRock.";
const keywords = ['atualizar bios', 'update bios asus', 'flash bios gigabyte', 'bios msi update', 'riscos atualizar bios'];

export const metadata: Metadata = createGuideMetadata('atualizar-bios-seguro', title, description, keywords);

export default function BIOSGuide() {
    const summaryTable = [
        { label: "Risco", value: "Alto (Perda da Placa)" },
        { label: "Tempo", value: "30 min" },
        { label: "Ferramenta", value: "Pen Drive FAT32" }
    ];

    const contentSections = [
        {
            title: "O Risco Real: Bricking",
            content: `
        <div class="bg-red-900/20 border-l-4 border-red-500 p-4 mb-6">
            <p class="text-red-400 font-bold">Nunca Desligue o PC</p>
            <p class="text-gray-300 text-sm">Se a energia acabar durante a atualização, sua placa-mãe pode morrer ("brickar"). Se possível, use um No-Break ou faça em dia de tempo estável (sem chuvas).</p>
        </div>
      `
        },
        {
            title: "Passo 1: Descubra seu modelo exato",
            content: `
        <p class="mb-4">Instalar a BIOS de um modelo parecido (ex: "B450M-Gaming" vs "B450M-Gaming/BR") pode estragar tudo.</p>
        <p class="text-gray-300">Use o <strong>CPU-Z</strong> > Aba Mainboard para ver o modelo e a versão atual.</p>
      `
        },
        {
            title: "Passo 2: O Pen Drive FAT32",
            content: `
        <ol class="text-gray-300 list-decimal list-inside ml-4">
            <li>Pegue um pen drive confiável.</li>
            <li>Formate-o no Windows como <strong>FAT32</strong> (Não use NTFS).</li>
            <li>Baixe o arquivo da BIOS no site da fabricante. Descompacte o arquivo.</li>
            <li>Copie o arquivo (geralmente .CAP, .ROM ou .F20) para a raiz do pen drive.</li>
        </ol>
      `
        },
        {
            title: "Passo 3: M-Flash / Q-Flash / EZ Flash",
            content: `
        <p class="text-gray-300">Reinicie o PC, entre na BIOS (DEL). Procure pela ferramenta de Flash (o nome muda por marca). Selecione o arquivo no pen drive e aguarde a barrinha encher. O PC vai reiniciar sozinho.</p>
      `
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="30 minutos"
            difficultyLevel="Avançado"
            contentSections={contentSections}
            summaryTable={summaryTable}
        />
    );
}
