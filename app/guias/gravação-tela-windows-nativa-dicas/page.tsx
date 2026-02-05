import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'gravação-tela-windows-nativa-dicas',
  title: "Como Gravar Tela no Windows sem instalar nada (2026)",
  description: "Precisa gravar uma aula, tutorial ou gameplay rápida? Aprenda a usar a Ferramenta de Captura e a Xbox Game Bar nativas do Windows 10 e 11.",
  category: 'software',
  difficulty: 'Iniciante',
  time: '10 min'
};

const title = "Como Gravar Tela no Windows sem instalar nada (2026)";
const description = "Precisa gravar uma aula, tutorial ou gameplay rápida? Aprenda a usar a Ferramenta de Captura e a Xbox Game Bar nativas do Windows 10 e 11.";
const keywords = [
    'como gravar tela windows 11 nativo 2026',
    'atalho para gravar tela windows 10 sem programa',
    'xbox game bar como gravar jogos windows',
    'ferramenta de captura windows gravar video tutorial',
    'gravar audio interno pc windows 11'
];

export const metadata: Metadata = createGuideMetadata('gravação-tela-windows-nativa-dicas', title, description, keywords);

export default function NativeRecordingGuide() {
    const summaryTable = [
        { label: "Atalho Snipping Tool", value: "Win + Shift + S (Depois selecione vídeo)" },
        { label: "Atalho Game Bar", value: "Win + Alt + R (Iniciar/Parar)" },
        { label: "Onde salva", value: "Vídeos > Capturas" },
        { label: "Dificuldade", value: "Fácil" }
    ];

    const contentSections = [
        {
            title: "As duas ferramentas nativas do Windows",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Muitas pessoas instalam programas pesados para fazer uma gravação simples de 1 minuto. O Windows 11 tem duas ferramentas embutidas excelentes: a **Xbox Game Bar** (focada em jogos e apps únicos) e a **Ferramenta de Captura** (focada em tutoriais e captura de janelas específicas).
        </p>
      `
        },
        {
            title: "1. Ferramenta de Captura (Melhor para Tutoriais)",
            content: `
        <p class="mb-4 text-gray-300">Diferente do print tradicional, agora você pode gravar vídeo de uma área selecionada:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Aperte <strong>Win + Shift + S</strong>.</li>
            <li>No topo da tela, clique no ícone de <strong>Câmera de Vídeo</strong>.</li>
            <li>Selecione a área da tela que deseja gravar.</li>
            <li>Clique em Iniciar. Quando terminar, o vídeo abrirá para você salvar.</li>
            <li><strong>Dica:</strong> Nas configurações da ferramenta, você pode escolher se deseja gravar o microfone e o áudio do sistema separadamente.</li>
        </ol>
      `
        },
        {
            title: "2. Xbox Game Bar (Melhor para Apps e Jogos)",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Gravação Rápida:</h4>
            <p class="text-sm text-gray-300">
                Se você já está dentro de um app ou jogo, simplesmente aperte <strong>Win + Alt + R</strong>. A gravação começará instantaneamente. Se quiser abrir o painel completo para ver o volume do microfone, aperte <strong>Win + G</strong>.
            </p>
        </div>
      `
        },
        {
            title: "3. Por que meu vídeo está travando?",
            content: `
        <p class="mb-4 text-gray-300">
            A gravação nativa do Windows usa muita CPU se a sua placa de vídeo não for detectada. 
            <br/>Vá em <strong>Configurações > Jogos > Capturas</strong>. Certifique-se de que a taxa de quadros está em <strong>60 FPS</strong> e a qualidade de vídeo em 'Padrão'. Se colocar em 'Alta', o arquivo ficará gigantesco e poderá dar lag durante a gravação.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/como-usar-obs-studio-gravar-tela",
            title: "Gravar com OBS",
            description: "Para gravações mais profissionais de longa duração."
        },
        {
            href: "/guias/atalhos-produtividade-windows",
            title: "Atalhos Windows",
            description: "Domine seu teclado no Windows 11."
        },
        {
            href: "/guias/formatfactory-vs-handbrake-converter-video",
            title: "Converter Vídeo",
            description: "Reduza o tamanho dos vídeos gravados."
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
