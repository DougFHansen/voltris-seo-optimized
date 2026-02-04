import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Erro DX11 Feature Level 10.0 no Valorant: Como Resolver (2026)";
const description = "Seu Valorant não abre com erro de Feature Level 10.0? Aprenda como corrigir erros de DirectX e rodar o jogo no Windows 11 em 2026.";
const keywords = [
    'erro dx11 feature level 10.0 valorant como resolver 2026',
    'valorant directx runtime error fix tutorial',
    'atualizar placa de video para feature level 11.0 guia',
    'como jogar valorant em placa de video antiga 2026',
    'corrigir erro de motor grafico valorant tutorial'
];

export const metadata: Metadata = createGuideMetadata('dx11-feature-level-10.0-error-valorant', title, description, keywords);

export default function ValorantDX11Guide() {
    const summaryTable = [
        { label: "Causa #1", value: "GPU não suporta DirectX 11 nativamente" },
        { label: "Causa #2", value: "Driver de vídeo corrompido ou genérico" },
        { label: "Check Vital", value: "Verificar suporte via 'dxdiag'" },
        { label: "Dificuldade", value: "Médio" }
    ];

    const contentSections = [
        {
            title: "O Pavor dos Jogadores de Valorant em 2026",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O erro **"DX11 Feature Level 10.0 is required to run the engine"** no Valorant é crual. Ele significa que o motor gráfico do jogo está pedindo uma instrução que o seu hardware ou driver não consegue entregar. Em 2026, com as atualizações constantes do Vanguard e do motor da Riot Games, placas de vídeo muito antigas estão perdendo o suporte oficial, mas muitas vezes o problema é apenas um software mal configurado.
        </p>
      `
        },
        {
            title: "1. Verificando o suporte real (DXDIAG)",
            content: `
        <p class="mb-4 text-gray-300">Descubra se a sua placa ainda aguenta o tranco:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Aperte <code>Win + R</code>, digite <strong>dxdiag</strong> e dê Enter.</li>
            <li>Vá na aba 'Exibição' (Display).</li>
            <li>À direita, procure por <strong>'Níveis de Recurso' (Feature Levels)</strong>.</li>
            <li>Se a lista parar em 10.0 ou 9.3, sua placa infelizmente é fraca demais para o Valorant moderno. Se listar 11.0 ou superior, o erro é no software e nós podemos consertar.</li>
        </ol>
      `
        },
        {
            title: "2. Reinstalando Drivers e Runtimes 2026",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">A Solução via Software:</h4>
            <p class="text-sm text-gray-300">
                1. Use o <strong>DDU</strong> para apagar todo o driver atual (veja nosso guia). <br/>
                2. Baixe o driver mais recente direto do site da NVIDIA, AMD ou Intel. <br/>
                3. Baixe o <strong>DirectX End-User Runtime</strong> no site da Microsoft para repor DLLs de motor gráfico que podem estar faltando. <br/><br/>
                Muitas vezes, o Windows 11 instala um driver básico que diz "suportar DirectX 12", mas carece dos recursos das versões anteriores, gerando o erro no Valorant.
            </p>
        </div>
      `
        },
        {
            title: "3. O \"Golpe\" das Placas Remarcadas",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>Cuidado em 2026:</strong> 
            <br/><br/>Se você comprou uma placa de vídeo muito barata de sites internacionais, ela pode ser uma "Fake GPU". Por exemplo, uma placa modificada para parecer uma GTX 1050, mas que o chip real é uma 9600GT antiga. Essas placas não possuem Feature Level 11.0 fisicamente. Se o erro persistir após todos os drivers limpos, considere que o seu hardware pode ser o limite físico intransponível.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/como-usar-ddu-driver-uninstaller",
            title: "Guia DDU",
            description: "Limpe seus drivers para fixar o DirectX."
        },
        {
            href: "/guias/valorant-reduzir-input-lag",
            title: "Otmizar Valorant",
            description: "Melhore a performance após abrir o jogo."
        },
        {
            href: "/guias/como-escolher-placa-de-video",
            title: "Upgrade de GPU",
            description: "Escolha uma placa que suporte o Valorant em 2026."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="15 min"
            difficultyLevel="Médio"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
