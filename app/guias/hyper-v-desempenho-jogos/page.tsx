import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Hyper-V: Ativar ou Desativar para ganhar Performance em Jogos?";
const description = "Descubra se o Hyper-V (VBS) está roubando seus frames! Aprenda como funciona a virtualização do Windows e saiba quando desativar para ganhar FPS em 2026.";
const keywords = [
    'hyper-v tira fps em jogos windows 11 2026',
    'como desativar hyper-v para jogar valorant e cs2',
    'o que é virtualização baseada em segurança vbs windows',
    'ganhar performance jogos desativando hyper-v tutorial',
    'conflitos hyper-v e emuladores android 2026 fix'
];

export const metadata: Metadata = createGuideMetadata('hyper-v-desempenho-jogos', title, description, keywords);

export default function HyperVPerformanceGuide() {
    const summaryTable = [
        { label: "O que é", value: "Tecnologia de Virtualização da Microsoft" },
        { label: "Impacto no FPS", value: "Pode reduzir de 5% a 25% em jogos antigos" },
        { label: "Uso Obrigatório", value: "WSL2, Docker e Segurança do Core (VBS)" },
        { label: "Dificuldade", value: "Média" }
    ];

    const contentSections = [
        {
            title: "O Custo da Segurança no Windows 11",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          No Windows 11, a Microsoft ativou recursos como o <strong>VBS (Virtualization-Based Security)</strong> por padrão. Ele usa o motor do Hyper-V para criar uma "bolha" de segurança ao redor do seu sistema. Embora isso torne seu PC quase imune a certos tipos de malware persistente, ele cria uma camada extra de processamento que pode "roubar" CPU dos seus jogos. Em 2026, com CPUs de muitos núcleos, o impacto é menor, mas em processadores de entrada, a diferença de FPS é nítida.
        </p>
      `
        },
        {
            title: "1. Como saber se o Hyper-V está ativo?",
            content: `
        <p class="mb-4 text-gray-300">Não confie apenas no menu de recursos. Veja o status real:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Pesquise por <strong>'Informações do Sistema'</strong> (msinfo32) no Iniciar.</li>
            <li>Role até o final da lista na aba 'Resumo do Sistema'.</li>
            <li>Procure por <strong>'Segurança baseada em virtualização'</strong>. Se estiver 'Em execução', o Hyper-V está ativo e pesando no seu sistema.</li>
        </ol>
      `
        },
        {
            title: "2. Quando você DEVE manter ativo?",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Não desligue se:</h4>
            <p class="text-sm text-gray-300">
                - Você usa o <strong>Google Play Games para PC</strong>. <br/>
                - Você é desenvolvedor e usa <strong>Docker</strong> ou <strong>WSL2</strong>. <br/>
                - Você prioriza segurança absoluta acima de alguns frames extras. <br/>
                Desativar o Hyper-V deixará seu PC mais vulnerável a ataques de "Nível de Kernel".
            </p>
        </div>
      `
        },
        {
            title: "3. Como desativar de forma segura",
            content: `
        <p class="mb-4 text-gray-300">
            Se você decidiu que o FPS é mais importante:
            <br/>1. Vá em 'Ativar ou desativar recursos do Windows'.
            <br/>2. Desmarque <strong>'Hyper-V'</strong>, 'Plataforma de Máquina Virtual' e 'Plataforma do Hipervisor do Windows'.
            <br/>3. Reinicie o PC.
            <br/><strong>Dica Extra:</strong> Para desativar apenas a parte de segurança (VBS) sem remover o motor, vá em <strong>Segurança do Windows > Segurança do Dispositivo > Detalhes do isolamento de núcleo</strong> e desligue a 'Integridade da Memória'.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/vbs-memory-integrity-performance",
            title: "Integridade de Memória",
            description: "Analise profunda sobre este recurso."
        },
        {
            href: "/guias/atualizar-bios-seguro",
            title: "Virtualização BIOS",
            description: "Como desligar o suporte na placa-mãe."
        },
        {
            href: "/guias/otimizacao-performance",
            title: "Otimizar Janelas",
            description: "Dicas extras de performance para o Win 11."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="15 min"
            difficultyLevel="Intermediário"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
