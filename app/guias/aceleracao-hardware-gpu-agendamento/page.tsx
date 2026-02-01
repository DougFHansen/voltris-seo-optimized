import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Agendamento de GPU Acelerado por Hardware (HAGS): O que é e como ativar? (2026)";
const description = "Essa opção do Windows promete mais FPS. É verdade? Descubra como o HAGS funciona e por que ele é obrigatório para usar DLSS 3 e Frame Gen.";
const keywords = ['agendamento de gpu acelerado por hardware', 'hags windows 11', 'hardware accelerated gpu scheduling on vs off', 'dlss 3 precisa de hags', 'melhorar fps hags', 'gpu scheduler'];

export const metadata: Metadata = createGuideMetadata('aceleracao-hardware-gpu-agendamento', title, description, keywords);

export default function HAGSGuide() {
    const summaryTable = [
        { label: "Obrigatório para", value: "DLSS 3 / Frame Gen" },
        { label: "Ganha FPS?", value: "Pouco (1-2%)" },
        { label: "Ajuda CPU?", value: "Sim" },
        { label: "Bug", value: "OBS (Antigo)" }
    ];

    const contentSections = [
        {
            title: "O que o HAGS faz?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
          Tradicionalmente, a CPU é a gerente da GPU. Ela que manda a GPU desenhar cada quadro. Com o <strong>Hardware Accelerated GPU Scheduling (HAGS)</strong>, o Windows passa essa responsabilidade de gerenciamento para a própria GPU (que tem um chip dedicado pra isso).
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed">
          Isso tira uma carga minúscula da CPU. Em processadores fracos, ajuda. Em fortes, não muda nada.
        </p>
      `,
            subsections: []
        },
        {
            title: "Por que você PRECISA ativar em 2026?",
            content: `
        <div class="bg-blue-900/20 p-6 rounded-xl border border-blue-500 mb-6">
            <h4 class="text-white font-bold mb-2">DLSS 3 Frame Generation</h4>
            <p class="text-gray-300 text-sm">
                Se você tem uma placa RTX 4000 (4060, 4070...), o recurso de Frame Generation (que cria quadros falsos para dobrar o FPS) <strong>EXIGE</strong> que o HAGS esteja ligado. Sem ele, a opção nem aparece no jogo.
            </p>
        </div>
      `,
            subsections: []
        },
        {
            title: "Como Ativar",
            content: `
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4">
            <li>Aperte <strong>Win + I</strong> (Configurações).</li>
            <li>Sistema > Tela > <strong>Elementos Gráficos</strong>.</li>
            <li>Clique em "Alterar configurações de gráficos padrão" (texto azul).</li>
            <li>Ative: <strong>Agendamento de GPU acelerado por hardware</strong>.</li>
            <li>Reinicie o PC.</li>
        </ol>
      `
        },
        {
            title: "Problema conhecido: OBS Studio",
            content: `
        <p class="text-gray-300">
            Antigamente, o HAGS fazia o OBS travar. Isso foi corrigido em 2024. Se seu OBS ainda trava com HAGS, atualize o OBS e abra-o como Administrador.
        </p>
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
