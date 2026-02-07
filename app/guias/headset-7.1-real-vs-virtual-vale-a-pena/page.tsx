import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'headset-7.1-real-vs-virtual-vale-a-pena',
    title: "Áudio Competitivo 2026: Headset vs IEM vs 7.1 Virtual",
    description: "Diga adeus ao som abafado. Descubra por que Pro Players estão trocando Headsets Gamers por IEMs, como usar Equalizador para ouvir passos e a verdade sobre 7.1 Virtual.",
    category: 'perifericos',
    difficulty: 'Intermediário',
    time: '30 min'
};

const title = "Áudio Competitivo 2026: Headset vs IEM vs 7.1 Virtual";
const description = "Diga adeus ao som abafado. Descubra por que Pro Players estão trocando Headsets Gamers por IEMs, como usar Equalizador para ouvir passos e a verdade sobre 7.1 Virtual.";

const keywords = [
    'headset 7.1 virtual vs real diferença 2026',
    'iem para jogos competitivo kz moondrop',
    'melhor eq para cs2 valorant passos',
    'open back vs closed back jogos',
    'dac amp vale a pena para jogos',
    'wireless delay audio bluetooth vs 2.4ghz'
];

export const metadata: Metadata = createGuideMetadata('headset-7.1-real-vs-virtual-vale-a-pena', title, description, keywords);

export default function AudioSurroundGuide() {
    const summaryTable = [
        { label: "Melhor Palco Sonoro", value: "Headphones Open-Back (Sennheiser/Audio-Technica)" },
        { label: "Melhor Isolamento/Foco", value: "IEMs (In-Ear Monitors)" },
        { label: "7.1 Virtual", value: "Geralmente RUIM (Distorce áudio)" },
        { label: "Wireless", value: "Obrigatório Dongle 2.4GHz (Jamais Bluetooth)" },
        { label: "DAC/Amp", value: "Necessário para fones acima de 80 Ohms" },
        { label: "Footsteps", value: "Requer EQ (Boost 2k-4kHz)" }
    ];

    const contentSections = [
        {
            title: "Introdução: O Fim do 'Headset Gamer'?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Em 2026, a era dos headsets de plástico com luzinhas RGB e "Som 7.1" está acabando no cenário profissional. Jogadores sérios perceberam que equipamentos de <strong>audiófilo</strong> (focados em fidelidade pura) entregam uma vantagem competitiva muito maior (Wallhack sonoro) do que graves estourados que tremem a cabeça mas escondem o som dos passos.
        </p>
      `
        },
        {
            title: "1. Aberto (Open-Back) vs Fechado (Closed-Back)",
            content: `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border-t-4 border-blue-500">
                <h4 class="text-blue-400 font-bold mb-2 text-lg">Closed-Back (Fechado)</h4>
                <p class="text-gray-400 text-sm mb-2">Padrão da maioria dos "Gamers".</p>
                <ul class="list-disc list-inside text-gray-300 text-sm space-y-2">
                    <li><strong>Prós:</strong> Isola o barulho do ventilador/teclado. Mais graves (explosões impactantes).</li>
                    <li><strong>Contras:</strong> "Palco Sonoro" (Soundstage) pequeno. O som parece vir de dentro da sua cabeça, dificultando saber a distância exata do inimigo.</li>
                    <li><strong>Uso:</strong> LAN Houses, ambientes barulhentos.</li>
                </ul>
            </div>
            <div class="bg-[#0A0A0F] p-4 rounded-xl border-t-4 border-purple-500">
                <h4 class="text-purple-400 font-bold mb-2 text-lg">Open-Back (Aberto)</h4>
                <p class="text-gray-400 text-sm mb-2">A escolha dos especialistas.</p>
                <ul class="list-disc list-inside text-gray-300 text-sm space-y-2">
                    <li><strong>Prós:</strong> O som "vaza" para fora. Isso cria um Palco Sonoro natural e amplo. Você ouve EXATAMENTE onde o inimigo está, como se estivesse lá.</li>
                    <li><strong>Contras:</strong> Você ouve o barulho do seu quarto. Ninguém ao seu redor quer ouvir seu jogo. Menos graves.</li>
                    <li><strong>Uso:</strong> Quarto silencioso, Competitivo Hardcore.</li>
                </ul>
            </div>
        </div>
      `
        },
        {
            title: "2. A Revolução dos IEMs (In-Ear Monitors)",
            content: `
        <div class="bg-gray-800/50 p-6 rounded-xl border border-gray-700 mb-6">
            <h4 class="text-white font-bold mb-3">Por que os Pros usam fone de celular?</h4>
            <p class="text-gray-300 mb-4">
                Você já deve ter visto em campeonatos de CS2/Valorant: os jogadores usam um fone grande (apenas para abafar o barulho da torcida/ruído branco) e, por baixo dele, pequenos fones intra-auriculares (IEMs).
            </p>
            <p class="text-gray-300 text-sm">
                <strong>Vantagens dos IEMs (Ex: Moondrop, KZ, Truthear):</strong>
                <br/>1. <strong>Isolamento Passivo:</strong> Entram no canal auditivo, bloqueando tudo.
                <br/>2. <strong>Detalhe:</strong> Drivers focados em clareza extrema.
                <br/>3. <strong>Conforto:</strong> Sem arco apertando a cabeça ou esquentando as orelhas.
                <br/>4. <strong>Preço:</strong> Um IEM de R$ 150,00 muitas vezes sola um Headset Gamer de R$ 600,00 em qualidade de áudio.
            </p>
        </div>
      `
        },
        {
            title: "3. O Mito do 7.1 Virtual",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>Headset com "7.1" na caixa:</strong> Geralmente é um fone estéreo comum com uma placa de som USB barata que aplica um efeito de eco (Reverb).
            <br/><br/>
            <strong>Por que evitar:</strong> Esse eco distorce o áudio original. Em jogos competitivos, você quer o som LIMPO e SECO para identificar a direção. O 7.1 Virtual embola os sons: uma granada explodindo na esquerda ecoa na direita, confundindo seu cérebro.
            <br/><br/>
            <strong>A Exceção:</strong> HRTF Real (Dolby Atmos / Windows Sonic). Se o jogo suporta nativamente (como Overwatch 2), o processamento é feito na engine do jogo, o que é MUITO melhor que o software do headset.
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "4. Equalização (EQ): O Wallhack Legalizado",
            content: `
            <div class="bg-emerald-900/10 p-5 rounded-xl border border-emerald-500/20 mb-6">
                <h4 class="text-emerald-400 font-bold mb-2">Como configurar seu equalizador (APO / Software):</h4>
                <p class="text-sm text-gray-300">
                    Jogos não são filmes. Graves altos (explosões) atrapalham. Passos são frequências médias-altas.
                    <br/><br/>
                    <strong>Receita de Bolo para FPS (Valorant/CS):</strong>
                    <br/>- <strong>Bass (20Hz - 150Hz):</strong> <span class="text-red-400 font-bold">REDUZA (-3dB a -5dB)</span>. Limpa o som de fundo (vento, zumbido, explosões).
                    <br/>- <strong>Mids (250Hz - 1kHz):</strong> Neutro ou leve corte para tirar som de "caixa".
                    <br/>- <strong>High-Mids (2kHz - 4kHz):</strong> <span class="text-green-400 font-bold">AUMENTE (+3dB a +5dB)</span>. É AQUI que vivem os passos (footsteps) e recargas de arma. Crunch!
                    <br/>- <strong>Treble (6kHz+):</strong> Cuidado. Muito alto machuca o ouvido (sibilância). Ajuste a gosto.
                </p>
            </div>
          `
        },
        {
            title: "5. Impedância e DAC/Amp",
            content: `
            <p class="mb-4 text-gray-300">
                Se você comprar um fone de audiófilo (Ex: Beyerdynamic DT 990 Pro), ele pode ter <strong>250 Ohms</strong>.
                <br/>Se você ligar isso na saída da placa-mãe, o som vai sair BAIXO e sem vida.
                <br/><br/>
                <strong>Regra:</strong>
                <br/>- Até 32-50 Ohms: Funciona em qualquer coisa (PC, Celular, Controle de Console).
                <br/>- 80 Ohms+: Requer uma placa de som dedicada ou DAC/Amp externo para ter volume e graves.
                <br/>- Sensibilidade (dB/mW) também importa, mas impedância é o guia rápido.
            </p>
          `
        },
        {
            title: "6. Wireless: 2.4GHz vs Bluetooth",
            content: `
            <ul class="space-y-4">
                <li class="bg-gray-800 p-4 rounded-lg border-l-4 border-green-500">
                    <span class="text-green-400 font-bold block mb-1">Dongle USB (2.4GHz / Lightspeed / Hyperspeed)</span>
                    <span class="text-sm text-gray-300">Latência de 1ms. Igual a cabo. Perfeito para jogos. Use sempre com o extensor USB próximo ao mouse/fone para evitar interferência.</span>
                </li>
                <li class="bg-gray-800 p-4 rounded-lg border-l-4 border-red-500">
                    <span class="text-red-400 font-bold block mb-1">Bluetooth</span>
                    <span class="text-sm text-gray-300">Latência de 40ms a 200ms. O som do tiro sai depois que você clicou. O áudio piora se você ligar o microfone (perfil HFP limita a banda). <strong>INUTILIZÁVEL para jogos competitivos.</strong></span>
                </li>
            </ul>
          `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/aumentar-volume-microfone-windows",
            title: "Configurar Microfone",
            description: "Não seja o cara que estoura o ouvido do time."
        },
        {
            href: "/guias/solucao-problemas-audio",
            title: "Audio Troubleshooting",
            description: "Corrigir chiados e problemas de driver."
        },
        {
            href: "/guias/equalizer-apo-peace-aumentar-passos-fps",
            title: "Guia Equalizer APO",
            description: "Tutorial passo a passo para instalar EQ no Windows."
        }
    ];

    const faqItems = [
        {
            question: "Fone gamer com vibração vale a pena?",
            answer: "Não. É um truque (gimmick) que distorce os graves e cansa a cabeça. Evite."
        },
        {
            question: "Preciso de placa de som dedicada?",
            answer: "Para 99% dos usuários, não. As placas-mãe modernas (com chips Realtek ALC1200/1220 ou ALC4080) já são excelentes. Só invista em DAC externo se seu fone tiver alta impedância ou se ouvir estática (ruído elétrico) na saída frontal do gabinete."
        },
        {
            question: "Microfone de headset é bom para Stream?",
            answer: "Geralmente não. Eles comprimem muito a voz (efeito piloto de avião). Se quer streamar, compre um microfone USB dedicado ou dinâmico."
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
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
            faqItems={faqItems}
        />
    );
}
