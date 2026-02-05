import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'hard-reset-fones-bluetooth-fix',
  title: "Fone Bluetooth só funciona um lado? Como fazer Hard Reset",
  description: "Seu fone TWS parou de parear ou só sai som de um lado? Aprenda a resetar fones Xiaomi, JBL, Lenovo e QCY para voltarem ao padrão de fábrica.",
  category: 'games-fix',
  difficulty: 'Iniciante',
  time: '15 min'
};

const title = "Fone Bluetooth só funciona um lado? Como fazer Hard Reset";
const description = "Seu fone TWS parou de parear ou só sai som de um lado? Aprenda a resetar fones Xiaomi, JBL, Lenovo e QCY para voltarem ao padrão de fábrica.";
const keywords = [
    'fone bluetooth so funciona um lado como resolver 2026',
    'como resetar fone jbl bluetooth 2026',
    'reset airpods xiaomi airdots tutorial',
    'parear fones bluetooth modo mono fix',
    'fone bluetooth nao conecta no pc como resolver'
];

export const metadata: Metadata = createGuideMetadata('hard-reset-fones-bluetooth-fix', title, description, keywords);

export default function BluetoothResetGuide() {
    const summaryTable = [
        { label: "Causa Comum", value: "Desincronização entre os fones" },
        { label: "Solução", value: "Botão Touch (Segurar 10-15 seg)" },
        { label: "Check #1", value: "Limpar pinos de carregamento" },
        { label: "Dificuldade", value: "Fácil" }
    ];

    const contentSections = [
        {
            title: "Por que os fones Bluetooth param de sincronizar?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          A maioria dos fones TWS (True Wireless) funciona em um sistema de "Mestre e Escravo". Um fone se conecta ao seu celular e o outro se conecta ao primeiro fone. Se você tira apenas um fone da caixinha muitas vezes, essa conexão entre eles pode "quebrar", fazendo com que eles funcionem apenas como fones mono individuais.
        </p>
      `
        },
        {
            title: "1. Reset Geral (Xiaomi, Lenovo e Genéricos)",
            content: `
        <p class="mb-4 text-gray-300">Este é o método que resolve 90% dos problemas de pareamento:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>No seu celular, vá em Bluetooth e escolha <strong>'Esquecer este dispositivo'</strong>.</li>
            <li>Coloque os dois fones na caixinha de carregamento.</li>
            <li>Com eles dentro da case (ou logo após tirar), segure a área touch (ou botão) dos dois ao mesmo tempo por <strong>15 segundos</strong>.</li>
            <li>As luzes vão piscar em cores diferentes (geralmente vermelho/branco).</li>
            <li>Solte e aguarde 1 minuto. Tire os dois juntos da caixa e tente parear novamente.</li>
        </ol>
      `
        },
        {
            title: "2. Higienização: O vilão invisível",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Dica de Manutenção:</h4>
            <p class="text-sm text-gray-300">
                Muitas vezes um lado para de funcionar porque não está carregando. Use um cotonete com um pouco de <strong>álcool isopropílico</strong> para limpar os pinos dourados dentro da case e os contatos do fone. A sujeira do uso diário impede que o fone receba carga, simulando um defeito eletrônico.
            </p>
        </div>
      `
        },
        {
            title: "3. Problemas de Áudio no Windows",
            content: `
        <p class="mb-4 text-gray-300">
            Se o fone funciona no celular mas fica com o som "estourado" ou com microfone ruim no PC:
            <br/>Vá em Configurações de Som > Painel de Controle de Som. Desative o modo <strong>'Hands-Free AG Audio'</strong> e use apenas o modo 'Stereo'. O modo Hands-free reduz a qualidade para o nível de rádio AM para permitir o uso do microfone bluetooth.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/aumentar-volume-microfone-windows",
            title: "Volume Microfone",
            description: "Ajustes de áudio no sistema."
        },
        {
            href: "/guias/atualizacao-drivers-video",
            title: "Drivers de Sistema",
            description: "Atualize o driver de Bluetooth do seu PC."
        },
        {
            href: "/guias/diagnostico-hardware",
            title: "Diagnóstico",
            description: "Saiba se seu fone realmente queimou."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="15 min"
            difficultyLevel="Iniciante"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
