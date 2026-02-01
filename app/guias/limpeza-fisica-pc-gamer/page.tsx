import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Como Limpar PC Gamer Corretamente (Sem estragar) - Voltris";
const description = "Poeira causa aquecimento e lentidão. Aprenda a limpar ventoinhas, trocar pasta térmica e usar ar comprimido. O que NÃO usar (secador, aspirador).";
const keywords = ['limpar pc gamer', 'limpeza computador', 'trocar pasta termica', 'poeira pc aquecendo', 'latas ar comprimido'];

export const metadata: Metadata = createGuideMetadata('limpeza-fisica-pc-gamer', title, description, keywords);

export default function CleaningGuide() {
    const summaryTable = [
        { label: "Frequência", value: "A cada 6 meses" },
        { label: "Material", value: "Pincel ESD, Ar Comprimido" },
    ];

    const contentSections = [
        {
            title: "O que NÃO fazer (Erros Fatais)",
            content: `
        <ul class="space-y-3 text-red-300 list-disc list-inside ml-4 bg-red-900/20 p-4 rounded border border-red-500/30">
            <li><strong>NUNCA use aspirador de pó comum:</strong> Eles geram eletricidade estática na ponta do bocal que pode queimar a placa-mãe instantaneamente apenas ao chegar perto.</li>
            <li><strong>NUNCA sopre com a boca:</strong> Saliva é ácida e condutiva. Uma gota microscópica na placa pode oxidar circuitos em semanas.</li>
            <li><strong>NUNCA gire as ventoinhas com ar forte:</strong> Se elas girarem muito rápido desligadas, elas funcionam como geradores e mandam voltagem reversa para a placa-mãe. Segure-as com o dedo.</li>
        </ul>
      `,
            subsections: []
        },
        {
            title: "O Método Correto",
            content: `
        <p class="text-gray-300 mb-4">Desligue a fonte da tomada e aperte o botão Power por 10 segundos para descarregar capacitores.</p>
        <ol class="space-y-4 text-gray-300 list-decimal list-inside ml-4">
            <li>Use um pincel macio (de preferência antiestático) para soltar a poeira das ventoinhas e dissipadores.</li>
            <li>Use uma lata de ar comprimido ou soprador elétrico específico para empurrar a poeira para fora do gabinete.</li>
            <li>Limpe os filtros de poeira do gabinete com água e sabão (seque bem antes de colocar).</li>
            <li>Use Álcool Isopropílico 99% (não álcool de cozinha) para limpar contatos se necessário.</li>
        </ol>
      `
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="40 minutos"
            difficultyLevel="Iniciante"
            contentSections={contentSections}
            summaryTable={summaryTable}
        />
    );
}
