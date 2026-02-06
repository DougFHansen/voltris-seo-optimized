import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'taxa-amostragem-audio-44khz-192khz-bug',
    title: "Taxa de Amostragem (2026): 44.1kHz vs 48kHz vs 192kHz",
    description: "Colocar o áudio em 'Qualidade de Estúdio' (192kHz) pode deixar seu PC mudo ou bugar o som do jogo. Entenda qual a taxa correta para Gamers.",
    category: 'audio',
    difficulty: 'Iniciante',
    time: '10 min'
};

const title = "Configuração de Som do Windows (2026): 48kHz é a Lei";
const description = "Você comprou um DAC de 32-bit 384kHz e colocou no máximo? Parabéns, você está gastando CPU à toa e causando bugs no Discord.";

const keywords = [
    'qual melhor taxa de amostragem para jogos 24bit 48000hz',
    'som chiando windows 11 fix',
    'discord som robotico sample rate mismatch',
    '44.1khz vs 48khz games latency',
    'formato de audio padrao windows studio quality',
    'obs audio desincronizado sample rate',
    'crackling audio fix realtek',
    'voltris optimizer sound',
    'voicemeeter banana sample rate'
];

export const metadata: Metadata = createGuideMetadata('taxa-amostragem-audio-44khz-192khz-bug', title, description, keywords);

export default function SampleRateGuide() {
    const summaryTable = [
        { label: "Padrão", value: "24-bit / 48000 Hz" },
        { label: "CD Quality", value: "16-bit / 44100 Hz" },
        { label: "Studio", value: "24-bit / 96000 Hz+" },
        { label: "Recomendado", value: "48kHz (Jogos)" },
        { label: "Bug", value: "Som Chiando (Mismatch)" },
        { label: "CPU Usage", value: "Alto em 192kHz" }
    ];

    const contentSections = [
        {
            title: "Introdução: O Mito da Qualidade",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          A maioria dos arquivos de áudio de jogos e filmes são masterizados em 48kHz. Músicas (Spotify/CD) são 44.1kHz. Se você forçar o Windows a rodar em 192kHz, o sistema tem que fazer "Resampling" em tempo real, o que pode gerar artefatos e latência.
        </p>
      `
        },
        {
            title: "Capítulo 1: A Configuração Ideal (48kHz)",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Painel Realtek / Windows</h4>
                <p class="text-gray-400 text-xs text-justify">
                    Vá em Som > Propriedades do Dispositivo > Avançado.
                    <br/>Formato Padrão: <strong>24 bits, 48000 Hz (Qualidade de Estúdio)</strong>.
                    <br/>- Por que não 44100Hz? Porque vídeos modernos e jogos usam 48k.
                    <br/>- Por que não 96000Hz? Porque nenhum jogo tem áudio nessa fidelidade. É desperdício de CPU.
                    <br/>- Por que 24 bits? Porque dá mais margem dinâmica (volume) sem ruído de fundo (hiss) que o 16 bits.
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: Sample Rate Mismatch (O Bug do Robô)",
            content: `
        <p class="mb-4 text-gray-300">
            Se seu Microfone está em 48kHz e seu Fone está em 44.1kHz, alguns programas (Discord, OBS, Voicemeeter) enlouquecem.
            <br/>O som fica picotando, acelerado (voz de esquilo) ou lento (voz de monstro).
            <br/><strong>Regra de Ouro:</strong> Defina TUDO (Entrada e Saída) para 48000 Hz. Sincronia total.
        </p>
      `
        },
        {
            title: "Capítulo 3: OBS e Desincronia",
            content: `
        <p class="mb-4 text-gray-300">
            Se sua live fica com o áudio atrasado depois de 1 hora:
            <br/>Verifique em Settings > Audio no OBS. Deve estar em 48kHz.
            <br/>Se o dispositivo do Windows estiver em 44.1kHz, o OBS vai tentar converter, e a cada segundo ele "perde" algumas amostras, acumulando delay (Drifting).
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: Latência e Buffer",
            content: `
        <p class="mb-4 text-gray-300">
            Taxas de amostragem mais altas (192kHz) teoricamente têm menor latência (o buffer enche mais rápido).
            <br/>Mas a carga na CPU aumenta. Se a CPU engasgar, você ouve um "POP" ou "Click" no áudio (DPC Latency Spike).
            <br/>48kHz é o ponto doce de baixa latência e estabilidade.
        </p>
      `
        },
        {
            title: "Capítulo 5: Exclusive Mode (Modo Exclusivo)",
            content: `
        <p class="mb-4 text-gray-300">
            Nas propriedades, as caixas "Permitir que aplicativos assumam controle exclusivo".
            <br/>- <strong>Jogos:</strong> Deixe marcado. Alguns jogos (como CS2) precisam disso para latência mínima.
            <br/>- <strong>Daws (Produção Musical):</strong> Se você abrir o FL Studio com driver ASIO, ele vai silenciar o YouTube/Discord. É normal do modo exclusivo.
        </p>
      `
        },
        {
            title: "Capítulo 6: Som Espacial (Windows Sonic)",
            content: `
        <p class="mb-4 text-gray-300">
            Botão direito no ícone de som > Som Espacial.
            <br/>Windows Sonic for Headphones (Grátis).
            <br/>Ele tenta simular 7.1. Funciona bem em filmes, mas em jogos competitivos estraga a noção de direção precisa (frente/trás). Mantenha desativado para CS/Valorant.
        </p>
      `
        },
        {
            title: "Capítulo 7: Driver Realtek vs Microsoft High Definition",
            content: `
        <p class="mb-4 text-gray-300">
            Às vezes o driver da Realtek da fabricante da placa-mãe é cheio de bloatware (Nahimic, Sonic Studio) que causa lag.
            <br/>Desinstalar e deixar o driver genérico "High Definition Audio Device" da Microsoft muitas vezes melhora a qualidade e remove efeitos indesejados.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 8: USB DACs Externos",
            content: `
            <p class="mb-4 text-gray-300">
                Se usa um DAC externo (Focusrite, Fiio), instale os drivers ASIO do fabricante.
                <br/>Mas no Windows (WDM), mantenha 48kHz. Deixe 192kHz apenas para ouvir arquivos FLAC Lossless no player de música dedicado (Foobar2000 em modo WASAPI).
            </p>
            `
        },
        {
            title: "Capítulo 9: HDMI Audio (GPU)",
            content: `
            <p class="mb-4 text-gray-300">
                O áudio que sai pelo monitor (HDMI/DisplayPort) é processado pela Placa de Vídeo.
                <br/>Ele também precisa ser configurado para 48kHz no Painel de Som.
            </p>
            `
        },
        {
            title: "Capítulo 10: Reiniciar Áudio",
            content: `
            <p class="mb-4 text-gray-300">
                Se o som sumir:
                <br/>Abra Services.msc e reinicie o serviço "Áudio do Windows" (Windows Audio). Mais rápido que reiniciar o PC.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Posso ouvir a diferença entre 48k e 192k?",
            answer: "Cientificamente, ouvido humano ouve até 20kHz. 44.1kHz cobre isso (Teorema de Nyquist). 192kHz serve para mixagem e evitar erros matemáticos em plugins, não para audição final. Você não vai ouvir diferença."
        },
        {
            question: "Som do Discord cortando?",
            answer: "Desative 'Redução de Ruído' no driver da Realtek. Deixe o Krisp do Discord cuidar disso."
        }
    ];

    const externalReferences = [
        { name: "Audio Sample Rate Explained", url: "https://www.soundguys.com/sample-rates-explained-134/" },
        { name: "ASIO4ALL", url: "https://www.asio4all.org/" }
    ];

    const relatedGuides = [
        {
            href: "/guias/equalizer-apo-peace-aumentar-passos-fps",
            title: "Equalizer",
            description: "Melhorar o som."
        },
        {
            href: "/guias/obs-studio-gravacao-replay-buffer-av1",
            title: "OBS",
            description: "Sync de áudio."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="10 min"
            difficultyLevel="Iniciante"
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
