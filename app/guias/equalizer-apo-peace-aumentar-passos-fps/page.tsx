import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'equalizer-apo-peace-aumentar-passos-fps',
    title: "Equalizer APO + Peace (2026): Aumentar Volume de Passos (FPS)",
    description: "Não gaste com Dolby Atmos. Use o Equalizer APO (Grátis) para equalizar seu fone e ouvir passos distantes em Valorant, CS2 e Warzone.",
    category: 'audio',
    difficulty: 'Avançado',
    time: '30 min'
};

const title = "Wallhack de Áudio (2026): Equalizer APO + Peace";
const description = "Fone de R$50 pode soar como um de R$500 se bem equalizado. Aprenda a cortar os graves (explosões) e aumentar os agudos (passos) para vantagem competitiva.";

const keywords = [
    'equalizer apo peace download config fps',
    'melhor equalização para ouvir passos warzone 3',
    'como instalar equalizer apo windows 11',
    'configurar compressor de audio para jogos',
    'heesuvi surround virtual 7.1 gratis',
    'aumentar volume do microfone baixo apo',
    'autoeq headapones preset',
    'voltris optimizer audio',
    'som abafado headset gamer fix'
];

export const metadata: Metadata = createGuideMetadata('equalizer-apo-peace-aumentar-passos-fps', title, description, keywords);

export default function AudioGuide() {
    const summaryTable = [
        { label: "Software", value: "Equalizer APO (Driver)" },
        { label: "Interface", value: "Peace GUI (Skin)" },
        { label: "Frequência Passos", value: "2kHz - 4kHz (Boost)" },
        { label: "Frequência Explosão", value: "100Hz - 200Hz (Cut)" },
        { label: "Compressor", value: "ON (Nivela volume)" },
        { label: "Pre-Amp", value: "-5 dB (Evita Clipping)" },
        { label: "Surround", value: "Stereo (Sempre)" }
    ];

    const contentSections = [
        {
            title: "Introdução: O Segredo dos Pro Players",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Jogos como CS e Tarkov têm sons de passos em frequências específicas (agudos médios). Explosões e tiros são graves. Se você aumentar o volume para ouvir passos, o tiro te deixa surdo. A solução é o Compressor.
        </p>
      `
        },
        {
            title: "Capítulo 1: Instalação (Cuidado)",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Passo a Passo</h4>
                <p class="text-gray-400 text-xs text-justify">
                    1. Baixe o <strong>Equalizer APO</strong> (SourceForge).
                    <br/>2. Na instalação, marque APENAS o seu fone de ouvido (Playback Devices) e microfone (Capture Devices).
                    <br/>3. Reinicie o PC. (Obrigatório).
                    <br/>4. Baixe o <strong>Peace Equalizer</strong> (Interface gráfica).
                    <br/>5. Abra o Peace.
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: Equalização para Passos (Footsteps)",
            content: `
        <p class="mb-4 text-gray-300">
            No Peace, você verá sliders de frequência.
            <br/>- <strong>60Hz a 250Hz (Graves):</strong> Reduza (-3dB a -6dB). Isso diminui o "Boom" de granadas e o ronco de motores, limpando o som.
            <br/>- <strong>2000Hz a 4000Hz (Médios Agudos):</strong> Aumente (+3dB a +6dB). É aqui que vivem os passos em madeira, metal e terra.
            <br/>- <strong>8000Hz+ (Agudos):</strong> Mantenha neutro ou leve boost para "ar".
        </p>
      `
        },
        {
            title: "Capítulo 3: Compressor (Nivelamento)",
            content: `
        <p class="mb-4 text-gray-300">
            A ferramenta mais poderosa.
            <br/>No painel "Effects" do Peace, ative o Compression.
            <br/>Ele aumenta sons baixos (passos longe) e diminui sons altos (tiro de AWP do seu lado) automaticamente em tempo real.
            <br/>Configure para um ataque rápido (5ms) e release médio (50ms).
            <br/><em>Aviso:</em> Isso tira a noção de distância. Um passo longe vai soar tão alto quanto um perto. Exige costume.
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: AutoEQ (Correção de Fone)",
            content: `
        <p class="mb-4 text-gray-300">
            Se seu fone é ruim (muito grave, som de caixa), use o botão "AutoEQ" no Peace.
            <br/>Procure o modelo do seu fone (ex: HyperX Cloud II).
            <br/>O software aplica uma curva Harman Target que deixa o som "plano" e perfeito, como fones de estúdio de $1000. Comece daí e depois aplique o boost de passos.
        </p>
      `
        },
        {
            title: "Capítulo 5: Pre-Amplification (Ganho)",
            content: `
        <p class="mb-4 text-gray-300">
            Se você fez boost de +6dB em alguma frequência, você PRECISA baixar o "Pre-Amplifying" geral para -6dB.
            <br/>Se não fizer isso, quando o som bater no teto (0dB), vai distorcer (Clipping) e parecer estourado.
            <br/>Sempre corte frequências (Subtractive EQ) antes de aumentar.
        </p>
      `
        },
        {
            title: "Capítulo 6: Microfone (Voz de Locutor)",
            content: `
        <p class="mb-4 text-gray-300">
            Você também instalou no Mic, certo?
            <br/>- Aplique um High Pass Filter (Corte de Graves) até 100Hz. Remove ruído de ar condicionado e batidas na mesa.
            <br/>- Aplique um pouco de Ganho se seu mic for baixo.
            <br/>- Aplique Gate para silenciar quando não estiver falando.
        </p>
      `
        },
        {
            title: "Capítulo 7: Perfis (Jogos vs Música)",
            content: `
        <p class="mb-4 text-gray-300">
            Salve um perfil "FPS Mode" com graves cortados.
            <br/>Salve um perfil "Music Mode" com graves normais (Bass Boost).
            <br/>Use hotkeys (Ctrl+F1, Ctrl+F2) para trocar instantaneamente antes de abrir o Spotify.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 8: HeSuVi (Surround 7.1 Virtual)",
            content: `
            <p class="mb-4 text-gray-300">
                O "HeSuVi" é um addon para o Equalizer APO que simula o som binaural do Dolby Atmos, Sennheiser GSX e outros, de graça.
                <br/>Funciona melhor que o 7.1 nativo dos headsets USB baratos. Vale testar para imersão, mas Stereo puro ainda é melhor para precisão competitiva.
            </p>
            `
        },
        {
            title: "Capítulo 9: Soluções de Problemas",
            content: `
            <p class="mb-4 text-gray-300">
                O som parou?
                <br/>Vá nas propriedades do fone no Windows e desative "Aprimoramentos de áudio" (ou ative, depende do driver Realtek).
                <br/>Reinstale o APO como SFX/EFX (Experimental) no Configurator se o modo padrão LFX/GFX não funcionar.
            </p>
            `
        },
        {
            title: "Capítulo 10: Delay (Latência)",
            content: `
            <p class="mb-4 text-gray-300">
                O APO adiciona cerca de 0.5ms de latência. Imperceptível para humanos.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Isso dá ban (VAC/Vanguard)?",
            answer: "Não. É um driver de áudio do Windows, não injeta no jogo. Totalmente seguro e indetectável."
        },
        {
            question: "Funciona em fone USB e P2?",
            answer: "Funciona em qualquer dispositivo de áudio reconhecido pelo Windows (USB, Bluetooth, HDMI, P2)."
        },
        {
            question: "Som ficou baixo?",
            answer: "Verifique o Pre-Amp. Aumente o volume do Windows para 100%."
        }
    ];

    const externalReferences = [
        { name: "Equalizer APO Download", url: "https://sourceforge.net/projects/equalizerapo/" },
        { name: "Peace Equalizer Download", url: "https://sourceforge.net/projects/peace-equalizer-apo-extension/" }
    ];

    const relatedGuides = [
        {
            href: "/guias/discord-nitro-qualidade-voz-krisp",
            title: "Discord",
            description: "Melhorar mic lá também."
        },
        {
            href: "/guias/escape-from-tarkov-otimizacao-fps-ram",
            title: "Tarkov",
            description: "Onde o som é tudo."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="30 min"
            difficultyLevel="Avançado"
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
