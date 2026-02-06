import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'phasmophobia-reconhecimento-voz-vr',
    title: "Phasmophobia (2026): Reconhecimento de Voz, VR e FPS",
    description: "O fantasma não te ouve? Aprenda a configurar o reconhecimento de voz (Vosk/Windows), reduzir o lag em mapas grandes (Sunny Meadows) e otimizar para VR.",
    category: 'jogos',
    difficulty: 'Intermediário',
    time: '20 min'
};

const title = "Phasmophobia Tuning (2026): Voz e Medo Sem Lag";
const description = "Phasmophobia depende 100% do microfone. Se falhar, você morre. Além disso, a iluminação dinâmica pesa muito em VR. Vamos consertar.";

const keywords = [
    'phasmophobia voice recognition not working fix',
    'phasmophobia vosk vs windows mode',
    'phasmophobia vr lag fix quest 3',
    'como fazer o fantasma ouvir phasmophobia',
    'sunny meadows fps drop fix',
    'melhores configurações graficas phasmophobia',
    'microphone input sensitivity phasmophobia',
    'voltris optimizer kinetic games',
    'spirit box não funciona'
];

export const metadata: Metadata = createGuideMetadata('phasmophobia-reconhecimento-voz-vr', title, description, keywords);

export default function PhasmophobiaGuide() {
    const summaryTable = [
        { label: "Voz", value: "Vosk (Inglês) / Windows (PT-BR)" },
        { label: "Shadows", value: "Hard (Mais leve)" },
        { label: "Light", value: "Low (Volumetric)" },
        { label: "Texture", value: "Full" },
        { label: "VR", value: "Foveated Render" },
        { label: "Microfone", value: "Default System" },
        { label: "Spirit Box", value: "Toggle Mode" }
    ];

    const contentSections = [
        {
            title: "Introdução: 'Give Us A Sign'",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O sistema de voz é o coração do jogo. Existem dois modos: Vosk (Processamento dentro do jogo) e Windows (Cortana/Speech API). Escolher o errado faz o jogo ignorar suas perguntas.
        </p>
      `
        },
        {
            title: "Capítulo 1: Configurando a Voz (Vosk vs Windows)",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Qual usar?</h4>
                <p class="text-gray-400 text-xs text-justify">
                    - <strong>Vosk:</strong> Mais rápido, processa offline. Funciona PERFEITO em Inglês. Tende a falhar em Português ou sotaques fortes.
                    <br/>- <strong>Windows:</strong> Usa o pacote de idioma do seu Windows. Funciona melhor em <strong>Português (Brasil)</strong>, mas requer que você tenha baixado o pacote de fala nas configurações do Windows > Hora e Idioma > Fala.
                    <br/>- <strong>Teste:</strong> Vá em Audio Settings e clique em "Test". Se a barrinha não encher quando você fala "Give us a sign", o jogo não está te ouvindo.
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: Alt-Tab Quebra a Voz",
            content: `
        <p class="mb-4 text-gray-300">
            Um bug antigo do Unity: Se você der Alt-Tab, o reconhecimento de voz do Windows perde o foco.
            <br/>Solução: Clique na barra de tarefas do Windows e depois clique no jogo de novo para "retomar" o foco do áudio. Ou use o modo Vosk.
        </p>
      `
        },
        {
            title: "Capítulo 3: Gráficos (Iluminação)",
            content: `
        <p class="mb-4 text-gray-300">
            - <strong>Shadows:</strong> Hard. (Soft Shadows borrada exige mais GPU).
            - <strong>Volumetric Lighting:</strong> Low ou Off. A neblina do acampamento e mapas externos pesa muito.
            - <strong>Bloom:</strong> Off. Ajuda a não ser cegado pela lanterna no escuro.
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: VR Optimization (Quest/Index)",
            content: `
        <p class="mb-4 text-gray-300">
            Em VR, o jogo renderiza duas telas.
            <br/>- Desligue "Eye Adaptation". Em VR isso causa náusea quando a luz muda rápido.
            <br/>- Use o <strong>OpenXR Toolkit</strong> para aplicar FSR (Upscaling) se sua placa de vídeo não aguentar 90 FPS nativos.
        </p>
      `
        },
        {
            title: "Capítulo 5: Mapa Sunny Meadows (FPS Drop)",
            content: `
        <p class="mb-4 text-gray-300">
            O hospício (Sunny Meadows) tem centenas de objetos físicos e luzes.
            <br/>Se travar lá, baixe a resolução de texturas para <strong>Half</strong>.
            <br/>Não acenda todas as luzes do mapa ao mesmo tempo. O jogo tem um limite de luzes dinâmicas; se passar, elas começam a piscar.
        </p>
      `
        },
        {
            title: "Capítulo 6: Microfone (Input Sensitivity)",
            content: `
        <p class="mb-4 text-gray-300">
            O jogo não tem ajuste de ganho (volume) de microfone, apenas sensibilidade de ativação.
            <br/>Ajuste o slider até que a barra azul só suba quando você fala. Se ficar sempre cheia, o fantasma vai te achar no armário por causa do ruído do ventilador (Ambient Noise).
            <br/>Use "Push to Talk" se tiver ambiente barulhento.
        </p>
      `
        },
        {
            title: "Capítulo 7: Spirit Box",
            content: `
        <p class="mb-4 text-gray-300">
            Para a Spirit Box funcionar, você precisa:
            <br/>1. Apagar as luzes da sala.
            <br/>2. Estar sozinho (se o fantasma for tímido).
            <br/>3. Falar perguntas específicas ("Where are you?", "Are you friendly?"). Perguntas aleatórias não ativam o script.
            <br/>Se o ícone do microfone na Spirit Box não piscar (X ou Fantasma), o jogo não detectou sua voz.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 8: Weather (Chuva/Neve)",
            content: `
            <p class="mb-4 text-gray-300">
                A chuva e neve no exterior consomem partículas.
                <br/>Se tiver PC muito fraco, evite contratos com "Heavy Rain" se possível, ou olhe para o chão ao caminhar para a casa.
            </p>
            `
        },
        {
            title: "Capítulo 9: Crossplay",
            content: `
            <p class="mb-4 text-gray-300">
                Funciona bem entre PC e Console.
                <br/>O carregamento é sincronizado. Se você tiver SSD e o amigo do PS4 tiver HD, você vai esperar na van até ele carregar.
            </p>
            `
        },
        {
            title: "Capítulo 10: Filtros de Cor",
            content: `
            <p class="mb-4 text-gray-300">
                Aumente o <strong>Brilho (Brightness)</strong> no jogo para 2.0 ou 3.0.
                <br/>Alguns monitores são muito escuros e você não vê nada sem lanterna. Aumentar o brilho ajuda a sobreviver durante caçadas sem luz.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Fantasma me acha no armário sem eu falar?",
            answer: "Sim, se seu microfone estiver 'Aberto' e captar respiração ou teclado mecânico barulhento. Use Push-To-Talk ou silencie o mic fisicamente."
        },
        {
            question: "O jogo crasha ao carregar?",
            answer: "Verifique integridade dos arquivos na Steam. Geralmente é arquivo de mapa corrompido."
        },
        {
            question: "VR mãos tortas?",
            answer: "Na calibração inicial, estique os braços em 'T-Pose' corretamente. Ajuste o ângulo do controle nas opções de VR."
        }
    ];

    const externalReferences = [
        { name: "Phasmophobia Voice Recognition Fix", url: "https://steamcommunity.com/sharedfiles/filedetails/?id=2238908341" },
        { name: "Kinetic Games Discord", url: "https://discord.gg/phasmophobia" }
    ];

    const relatedGuides = [
        {
            href: "/guias/discord-otimizacao-overlay-lag",
            title: "Discord",
            description: "Overlay pode bugar mic."
        },
        {
            href: "/guias/windows-defender-otimizacao-jogos",
            title: "Defender",
            description: "Permissão de microfone."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="20 min"
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
