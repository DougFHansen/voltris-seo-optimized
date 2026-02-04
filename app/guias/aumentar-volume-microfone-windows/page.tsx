import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Microfone muito Baixo no Windows 11? Como Resolver (2026)";
const description = "Seu time não te ouve no Discord? Aprenda a aumentar o volume do microfone, configurar o ganho (boost) e remover ruídos de fundo no Windows 11 em 2026.";
const keywords = [
    'aumentar volume microfone windows 11 tutorial 2026',
    'microfone muito baixo discord como resolver guia',
    'ativar aumento de sensibilidade microfone windows 11',
    'melhorar qualidade do audio microfone tutorial 2026',
    'resolver microfone estourado ou com chiado guia'
];

export const metadata: Metadata = createGuideMetadata('aumentar-volume-microfone-windows', title, description, keywords);

export default function MicrophoneBoostGuide() {
    const summaryTable = [
        { label: "Nível Recomendado", value: "80% a 100%" },
        { label: "Ganho (Boost)", value: "+10dB a +20dB (Cuidado com chiado)" },
        { label: "Software Adjunto", value: "Discord / Voicemeeter / SteelSeries Sonar" },
        { label: "Dificuldade", value: "Iniciante" }
    ];

    const contentSections = [
        {
            title: "Por que meu microfone está tão baixo?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Ter um microfone baixo pode ser causado por três motivos principais: drivers genéricos do Windows, configurações de sensibilidade mal ajustadas ou o fato de o Windows 11 estar "gerenciando" o volume para você sem permissão. Em 2026, com o aumento das chamadas de vídeo e trabalho remoto, ter uma voz clara e audível não é apenas para gamers, mas uma necessidade profissional.
        </p>
      `
        },
        {
            title: "1. Aumentando o Ganho (Microphone Boost)",
            content: `
        <p class="mb-4 text-gray-300">Este é o ajuste mais potente no sistema:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Vá em Painel de Controle > Som > Aba Gravação.</li>
            <li>Clique com o botão direito no seu microfone e vá em <strong>Propriedades</strong>.</li>
            <li>Na aba 'Níveis', certifique-se de que o primeiro slider esteja em 100.</li>
            <li>No segundo slider (<strong>Aumento do Microfone</strong>), experimente colocar em +10dB ou +20dB. <br/> <i>Atenção: Aumentar demais pode causar chiados de fundo.</i></li>
        </ol>
      `
        },
        {
            title: "2. Desativando o Controle Exclusivo",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Evite que o Discord mude o seu volume:</h4>
            <p class="text-sm text-gray-300">
                Ainda nas Propriedades do Microfone, vá na aba <strong>Avançado</strong>. Desmarque a opção <strong>"Permitir que aplicativos assumam controle exclusivo deste dispositivo"</strong>. Isso impede que programas como Skype ou Discord diminuam o seu volume sozinhos no meio de uma fala.
            </p>
        </div>
      `
        },
        {
            title: "3. Plugins de Redução de Ruído (IA) em 2026",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>Voz de Estúdio:</strong> 
            <br/><br/>Se você aumentou o ganho e agora ouve o ventilador ou o teclado, use ferramentas de IA como o <strong>NVIDIA Broadcast</strong> ou a redução de ruído integrada do <strong>Discord (Krisp)</strong>. Em 2026, essas ferramentas conseguem isolar a sua voz com perfeição, permitindo que você suba o volume (Boost) sem trazer o barulho da casa junto.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/solucao-problemas-audio",
            title: "Problemas de Som",
            description: "Resolva erros gerais de áudio no Windows."
        },
        {
            href: "/guias/som-espacial-windows-configurar",
            title: "Som Espacial",
            description: "Melhore o que você ouve também."
        },
        {
            href: "/guias/atualizacao-drivers-video",
            title: "Drivers de Áudio",
            description: "Muitas vezes embutidos no driver da GPU."
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
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
