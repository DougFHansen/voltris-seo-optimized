import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'rog-ally-legion-go-otimizacao-windows-tdp-guia',
    title: "ROG Ally & Legion Go (2026): Windows Otimizado e Bateria",
    description: "O Windows 11 não é feito para telas de 7 polegadas. Aprenda a fazer debloat, configurar o Armory Crate SE, ajustar curvas de TDP e usar RSR para ganhar FPS.",
    category: 'emulacao',
    difficulty: 'Intermediário',
    time: '30 min'
};

const title = "ROG Ally e Handhelds Windows: Guia de Performance";
const description = "Diferente do Steam Deck, aqui você tem o peso do Windows. A otimização é obrigatória para não ter a bateria drenada em 40 minutos.";

const keywords = [
    'melhorar bateria rog ally desligar core isolation',
    'legion go fps boost drivers',
    'amd rsr vs fsr qual usar handheld',
    'armory crate se configs recomendadas',
    'hibernar windows 11 handheld bug fix',
    'vram 6gb ou auto rog ally',
    'voltris optimizer handheld windows',
    'lossless scaling app steam'
];

export const metadata: Metadata = createGuideMetadata('rog-ally-legion-go-otimizacao-windows-tdp-guia', title, description, keywords);

export default function RogAllyGuide() {
    const summaryTable = [
        { label: "VRAM", value: "6GB (Equilíbrio)" },
        { label: "Core Isolation", value: "OFF (Ganho FPS)" },
        { label: "TDP (AAA)", value: "25W / 30W" },
        { label: "TDP (Indie)", value: "10W / 15W" },
        { label: "Resolução", value: "900p (RSR ON)" },
        { label: "CPU Boost", value: "OFF (Menos calor)" },
        { label: "Hibernate", value: "ON (Melhor que sleep)" }
    ];

    const contentSections = [
        {
            title: "Introdução: A Batalha contra o Windows",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O Windows rodando em segundo plano consome bateria e CPU. A Asus e a Lenovo tentam ajudar com seus softwares, mas o segredo está em limpar o Windows e controlar o hardware manualmente.
        </p>
      `
        },
        {
            title: "Capítulo 1: Configuração de VRAM (UMA)",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Armory Crate > Settings</h4>
                <p class="text-gray-400 text-xs text-justify">
                    Por padrão, vem em 4GB.
                    <br/>- <strong>6GB:</strong> O melhor equilíbrio. Deixa 10GB de RAM para o sistema/jogo e 6GB para texturas. Roda quase tudo (Cyberpunk, Starfield).
                    <br/>- <strong>Auto:</strong> Causa stutter em alguns jogos (Hogwarts Legacy) que não sabem pedir memória.
                    <br/>- <strong>8GB:</strong> Arriscado. Sobra pouca RAM (8GB) para o Windows + Jogo, podendo causar crashes.
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: Debloat e Core Isolation",
            content: `
        <p class="mb-4 text-gray-300">
            1. <strong>Core Isolation (Integridade de Memória):</strong> Desative em Configurações > Segurança > Isolamento de Núcleo. Isso dá um boost de 5-10% de FPS em CPUs Ryzen como o Z1 Extreme.
            2. <strong>Startup Apps:</strong> Desative TUDO (Steam, Epic, EA) de iniciar com o Windows. Abra apenas o que for jogar.
            3. Use o nosso guia de "Debloat Windows 11" para remover Teams, Widget e Telemetria.
        </p>
      `
        },
        {
            title: "Capítulo 3: CPU Boost (O Vilão do Calor)",
            content: `
        <p class="mb-4 text-gray-300">
            O Z1 Extreme tenta dar boost para 5.0GHz à toa, esquentando o aparelho para 95°C.
            <br/>Desative o "CPU Boost" nas opções de energia do Windows (exige edição de registro simples para aparecer a opção).
            <br/>Resultado: Mesma performance em jogos (que dependem de GPU), mas rodando a 70°C e ventoinhas silenciosas.
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: RSR (Radeon Super Resolution)",
            content: `
        <p class="mb-4 text-gray-300">
            A tela do Ally é 1080p, do Legion é 1600p. Rodar nativo pesa.
            <br/>1. Ative RSR no Painel da AMD ou Central de Comando.
            <br/>2. No jogo, coloque a resolução em <strong>720p</strong> (Ally) ou <strong>800p</strong> (Legion).
            <br/>3. O driver vai fazer upscale para a tela cheia com nitidez.
            <br/>É quase mágico: Performance de 720p com visual próximo do nativo.
        </p>
      `
        },
        {
            title: "Capítulo 5: Resolução 900p (O Sweet Spot)",
            content: `
        <p class="mb-4 text-gray-300">
            Existe um mod de registro para habilitar <strong>900p</strong> no ROG Ally.
            <br/>É o equilíbrio perfeito entre nitidez e FPS. Muito melhor que 720p e muito mais leve que 1080p. Altamente recomendado.
        </p>
      `
        },
        {
            title: "Capítulo 6: TDP Manual",
            content: `
        <p class="mb-4 text-gray-300">
            Não use os perfis padrão (Turbo/Performance). Crie manuais:
            <br/>- <strong>18W:</strong> Para jogos AAA (Cyberpunk a 40fps).
            <br/>- <strong>25W/30W:</strong> Só ligado na tomada. Na bateria dura 40 min.
            <br/>- <strong>12W:</strong> Para Indies (Hades, Dead Cells). Bateria dura 3-4h.
        </p>
      `
        },
        {
            title: "Capítulo 7: Hibernate vs Sleep",
            content: `
        <p class="mb-4 text-gray-300">
            O "Sleep" (Suspensão) do Windows é bugado. O portátil liga na mochila e frita.
            <br/>Mude a ação do botão Power para <strong>Hibernar</strong>.
            <br/>Demora 10 segundos a mais para ligar, mas salva a bateria e não acorda sozinho.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 8: Lossless Scaling (App)",
            content: `
            <p class="mb-4 text-gray-300">
                Compre o app "Lossless Scaling" na Steam.
                <br/>Ele tem o modo "Frame Generation" (LSFG) que funciona em QUALQUER jogo e QUALQUER GPU.
                <br/>Transforma 30fps em 60fps (fake frames). Tem um pouco de ghosting, mas para jogar RPGs lentos no handheld é incrível.
            </p>
            `
        },
        {
            title: "Capítulo 9: Legion Space",
            content: `
            <p class="mb-4 text-gray-300">
                O software da Lenovo é pesado. Muitos usuários preferem fechá-lo e usar o "Handheld Companion" ou apenas a Steam Big Picture.
            </p>
            `
        },
        {
            title: "Capítulo 10: SD Card (O Burnout do Ally)",
            content: `
            <p class="mb-4 text-gray-300">
                O leitor de cartão do ROG Ally original queima com o calor da saída de ar.
                <br/>Aumente a curva de ventoinha (Fan Curve) para manter o device dbaixo de 75°C e proteger o leitor, ou simplesmente troque o SSD interno por um de 2TB 2230.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Dual Boot com SteamOS (Bazzite)?",
            answer: "Bazzite é um Linux incrível que imita o Steam Deck no Ally. Vale a pena se você só quer jogar e odeia o Windows. Ganha suspensão instantânea e interface limpa."
        },
        {
            question: "AMD Fluid Motion Frames (AFMF) funciona?",
            answer: "Sim, nos drivers novos. Gera frames via driver. É bom, mas desliga se você mexer a câmera muito rápido. Lossless Scaling costuma ser mais consistente."
        }
    ];

    const externalReferences = [
        { name: "Rog Ally 900p Mod", url: "https://rogallylife.com/2023/08/01/rog-ally-900p-resolution-guide/" },
        { name: "Handheld Companion", url: "https://github.com/Valkirie/HandheldCompanion" }
    ];

    const relatedGuides = [
        {
            href: "/guias/steam-deck-otimizacao-cryoutilities-protonge-guia",
            title: "Steam Deck",
            description: "Alternativa Linux."
        },
        {
            href: "/guias/debloat-windows-11-otimizacao-powershell",
            title: "Debloat",
            description: "Essencial."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="30 min"
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
