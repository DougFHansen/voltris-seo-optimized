import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'bluestacks-otimizacao-free-fire-pubg',
    title: "BlueStacks 5 (2026): Configuração Leve para Free Fire e 90 FPS",
    description: "Seu emulador trava? Guia definitivo de virtualização (VT-x), modo Eco, Root e mapeamento de teclas para subir capa no Free Fire.",
    category: 'emuladores',
    difficulty: 'Intermediário',
    time: '35 min'
};

const title = "BlueStacks 5 Turbo: Otimização Máxima (2026)";
const description = "Emuladores de Android são pesados por natureza. Aprenda a configurar o BlueStacks para consumir menos RAM e rodar Free Fire e PUBG Mobile a 90 FPS cravados.";

const keywords = [
    'bluestacks 5 travando pc fraco 2026',
    'como ativar virtualização vt-x bios',
    'free fire 90 fps bluestacks config',
    'bluestacks modo eco ram',
    'sensibilidade y free fire emulador',
    'root bluestacks 5 facil',
    'bs tweaker 6 download',
    'bluestacks tela azul hyper-v',
    'melhor resolução para emulador free fire',
    'voltris optimizer bluestacks priority'
];

export const metadata: Metadata = createGuideMetadata('bluestacks-otimizacao-free-fire-pubg', title, description, keywords);

export default function BlueStacksGuide() {
    const summaryTable = [
        { label: "Engine", value: "Nougat 32-bit (Leve)" },
        { label: "Cores", value: "Metade dos reais" },
        { label: "RAM", value: "4GB (Máx)" },
        { label: "Graphics", value: "OpenGL" },
        { label: "FPS", value: "90 ou 240" },
        { label: "Device", value: "Asus ROG Phone 2" },
        { label: "Hyper-V", value: "OFF (Crucial)" }
    ];

    const contentSections = [
        {
            title: "Introdução: Virtualização é Obrigatória",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Sem VT-x (SVM na AMD) ativado na BIOS, o BlueStacks usa apenas 1 núcleo da CPU e roda a 5 FPS. Esse é o erro #1. Reinicie seu PC, entre na BIOS e ative a Virtualização antes de tudo.
        </p>
      `
        },
        {
            title: "Capítulo 1: Escolhendo a Instância (Nougat vs Pie)",
            content: `
        <div class="space-y-4">
             <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Nougat 32-bit (Recomendado)</h4>
                <p class="text-gray-400 text-xs">A versão mais leve e compatível com Free Fire. Use esta se tiver menos de 8GB de RAM.</p>
            </div>
             <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Pie 64-bit (Beta)</h4>
                <p class="text-gray-400 text-xs">Melhor para jogos novos (Genshin, TFT), mas consome 30% mais RAM.</p>
            </div>
             <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Android 11</h4>
                <p class="text-gray-400 text-xs">Ainda instável em 2026. Evite.</p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: Alocação de Recursos (CPU e RAM)",
            content: `
        <p class="mb-4 text-gray-300">
            Configurações > Desempenho.
            <br/>- <strong>Alocação de CPU:</strong> Selecione a METADE dos seus núcleos físicos. (Ex: Se tem um i5 de 6 núcleos, coloque 3 ou 4. Nunca coloque todos, o Windows precisa respirar).
            <br/>- <strong>Alocação de Memória:</strong> 4GB (4096MB) é o ideal. Mais que isso é desperdício para jogos mobile, menos que 2GB trava.
        </p>
      `
        },
        {
            title: "Capítulo 3: Gráficos e FPS",
            content: `
        <p class="mb-4 text-gray-300">
            - <strong>Motor Gráfico:</strong> Desempenho.
            - <strong>Renderizador:</strong> OpenGL (Mais estável que DirectX para emulação Android).
            - <strong>Taxa de Quadros:</strong> Ative "Taxa de quadros alta". Coloque em 90 ou 240.
            <br/><em>Dica Pro:</em> Ative "Mostrar FPS durante o jogo" para monitorar quedas.
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: Perfil do Dispositivo (ROG Phone)",
            content: `
        <p class="mb-4 text-gray-300">
            Configurações > Telefone.
            <br/>Selecione <strong>ASUS ROG Phone 2</strong>.
            <br/>Por quê? Esse perfil libera a opção de 90 FPS dentro do Free Fire e PUBG. Se usar perfil de Samsung S10/S20, o jogo limita a 60 FPS.
        </p>
      `
        },
        {
            title: "Capítulo 5: Otimização do Windows (Hyper-V)",
            content: `
        <p class="mb-4 text-gray-300">
            O BlueStacks odeia o Hyper-V (virtualização da Microsoft).
            <br/>Abra o CMD como Admin e digite:
            <br/><code>bcdedit /set hypervisorlaunchtype off</code>
            <br/>Reinicie o PC. Isso resolve 99% das Telas Azuis (BSOD) ao abrir o emulador.
        </p>
      `
        },
        {
            title: "Capítulo 6: BS Tweaker 6 (Root)",
            content: `
        <p class="mb-4 text-gray-300">
            Para usuários avançados. O BS Tweaker permite:
            <br/>- Fazer Root (para usar GlTools e mudar gráficos do jogo).
            <br/>- Remover anúncios do BlueStacks.
            <br/>- Comprimir o disco (liberar espaço).
            <br/>Use com cuidado.
        </p>
      `
        },
        {
            title: "Capítulo 7: Sensibilidade Y (Capa)",
            content: `
        <p class="mb-4 text-gray-300">
            No editor de controles:
            <br/>Aumente a <strong>Sensibilidade do Mouse Y</strong> (Vertical).
            <br/>Geralmente usa-se X=1.0 e Y=1.5 ou 2.0. Isso facilita puxar a mira para cima (subir capa) com pouco movimento do mouse.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 8: Modo Eco (Multiboxing)",
            content: `
            <p class="mb-4 text-gray-300">
                Se você joga jogos de Gacha (Reroll) e abre 4 janelas.
                <br/>Ative o <strong>Modo Eco</strong> nas instâncias secundárias. Isso limita o FPS delas a 5 e corta o som, permitindo rodar 10 contas ao mesmo tempo.
            </p>
            `
        },
        {
            title: "Capítulo 9: Limpeza de Disco",
            content: `
            <p class="mb-4 text-gray-300">
                O emulador cria um arquivo .vdi que só cresce. Mesmo desinstalando apps, ele não diminui.
                <br/>Use a ferramenta "Disk Cleanup" dentro das configurações do BlueStacks a cada mês para recuperar 10-20GB de espaço no SSD.
            </p>
            `
        },
        {
            title: "Capítulo 10: MSI App Player vs BlueStacks",
            content: `
            <p class="mb-4 text-gray-300">
                O MSI App Player é uma versão "Lite" do BlueStacks 4.
                <br/>Para PCs EXTREMAMENTE fracos (2GB RAM), o MSI antigo ainda roda melhor que o BlueStacks 5. Mas para PCs modernos, o BS5 é superior.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Free Fire fecha sozinho (Crash)?",
            answer: "Geralmente é falta de RAM. Feche o Chrome. Tente mudar o renderizador de OpenGL para DirectX. Se não resolver, crie uma nova instância Nougat 32-bit limpa."
        },
        {
            question: "Mouse travando (pixel skipping)?",
            answer: "Ajuste o DPI do emulador para o mesmo DPI do seu mouse (ex: 800 ou 1600). DPIs diferentes podem causar imprecisão."
        },
        {
            question: "Posso ser banido por usar emulador?",
            answer: "No Free Fire, você cai na 'lista de emuladores' e joga separado do mobile (ou em salas mistas específicas). Se usar bypass (fingir que é mobile), SIM, você será banido. Jogue limpo."
        }
    ];

    const externalReferences = [
        { name: "BS Tweaker (Ferramenta Root)", url: "https://bstweaker.tk/" },
        { name: "BlueStacks Support", url: "https://support.bluestacks.com/" }
    ];

    const relatedGuides = [
        {
            href: "/guias/windows-defender-otimizacao-jogos",
            title: "Defender",
            description: "Adicione a pasta do BlueStacks nas exclusões."
        },
        {
            href: "/guias/otimizacao-ssd-windows-11",
            title: "SSD",
            description: "Loading rápido."
        },
        {
            href: "/guias/como-escolher-mouse-gamer",
            title: "Mouse",
            description: "Essencial para emulador."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="35 min"
            difficultyLevel="Intermediário"
            contentSections={contentSections}
            advancedContentSections={advancedContentSections}
            additionalContentSections={additionalContentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
            faqItems={faqItems}
            externalReferences={externalReferences}
        />
    );
}
