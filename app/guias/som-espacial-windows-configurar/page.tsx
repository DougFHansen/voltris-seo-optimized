import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'som-espacial-windows-configurar',
  title: "Som Espacial no Windows 11: Como ativar e configurar (2026)",
  description: "Quer ouvir passos com precisão nos jogos? Aprenda como ativar o Windows Sonic, Dolby Atmos e DTS:X para ter som espacial em 2026.",
  category: 'software',
  difficulty: 'Iniciante',
  time: '10 min'
};

const title = "Som Espacial no Windows 11: Como ativar e configurar (2026)";
const description = "Quer ouvir passos com precisão nos jogos? Aprenda como ativar o Windows Sonic, Dolby Atmos e DTS:X para ter som espacial em 2026.";
const keywords = [
    'como ativar som espacial windows 11 2026',
    'windows sonic para fones de ouvido vale a pena',
    'dolby atmos vs dts sound unbound qual melhor 2026',
    'melhorar som para jogos fps valorant cs2 2026',
    'configurar audio espacial windows 11 fone de ouvido'
];

export const metadata: Metadata = createGuideMetadata('som-espacial-windows-configurar', title, description, keywords);

export default function SpatialAudioGuide() {
    const summaryTable = [
        { label: "Nativo (Grátis)", value: "Windows Sonic para Fones de Ouvido" },
        { label: "Premium (Pago)", value: "Dolby Atmos / DTS Sound Unbound" },
        { label: "Uso Principal", value: "Localização de inimigos (Vertical e 360°)" },
        { label: "Dificuldade", value: "Fácil" }
    ];

    const contentSections = [
        {
            title: "O que é o Som Espacial?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Diferente do som estéreo comum (esquerda e direita), o **Som Espacial** cria uma esfera virtual de áudio ao redor da sua cabeça. Em 2026, isso é fundamental para jogos competitivos, permitindo que você identifique se um inimigo está acima de você, atrás ou em um andar inferior. O Windows 11 processa essa informação e simula a distância e direção usando algoritmos avançados.
        </p>
      `
        },
        {
            title: "1. Ativando o Windows Sonic (Grátis)",
            content: `
        <p class="mb-4 text-gray-300">A Microsoft oferece uma opção excelente sem custo adicional:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Clique com o botão direito no ícone de som na barra de tarefas.</li>
            <li>Vá em <strong>Configurações de Som</strong>.</li>
            <li>Clique no seu dispositivo de saída (Fones de ouvido).</li>
            <li>Role até 'Som Espacial' e selecione <strong>Windows Sonic para Fones de Ouvido</strong>.</li>
            <li>Certifique-se de que qualquer efeito de "Surround" do driver do seu fone (ex: Logitech G Hub ou Razer Synapse) esteja DESATIVADO para não haver conflito.</li>
        </ol>
      `
        },
        {
            title: "2. Dolby Atmos vs DTS:X",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Qual escolher em 2026?</h4>
            <p class="text-sm text-gray-300">
                Se você busca a melhor experiência cinematográfica, o **Dolby Atmos** é superior por ter maior suporte em filmes e jogos AAA. Já o **DTS Headphone:X** é muitas vezes preferido por jogadores de FPS por ter uma equalização que destaca melhor frequências de passos e recargas. Ambos são pagos (licença única), mas oferecem períodos de teste gratuitos. Experimente os dois antes de comprar.
            </p>
        </div>
      `
        },
        {
            title: "3. Importância da Taxa de Amostragem",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>O ajuste fino:</strong> 
            <br/><br/>Para que o som espacial funcione perfeitamente sem chiados ou atrasos, vá em Propriedades do Dispositivo > Configurações Avançadas e mude o formato padrão para <strong>24 bits, 48000 Hz (Qualidade de Estúdio)</strong>. Evite valores muito altos (como 192kHz) em jogos, pois eles podem desativar o processamento de som espacial ou causar distorção no posicionamento virtual.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/corrigir-audio-chiado-windows",
            title: "Corrigir Áudio",
            description: "Resolva problemas de estática e estalos."
        },
        {
            href: "/guias/aumentar-volume-microfone-windows",
            title: "Volume Microfone",
            description: "Seja ouvido com clareza pelo seu time."
        },
        {
            href: "/guias/headset-7.1-real-vs-virtual-vale-a-pena",
            title: "Headset 7.1 vs Estéreo",
            description: "Entenda por que o estéreo com som espacial é melhor."
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
