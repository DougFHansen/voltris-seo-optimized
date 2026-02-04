import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Webcam Piscando ou com Tela Preta: Como resolver (2026)";
const description = "Sua webcam trava, fica preta ou fica piscando durante reuniões? Aprenda a resolver problemas de driver e privacidade no Windows 11 em 2026.";
const keywords = [
    'webcam piscando windows 11 como resolver 2026',
    'webcam tela preta no meet discord tutorial guia',
    'consertar camera notebook parou de funcionar 2026',
    'webcam piscando luz azul ou verde tutorial 2026',
    'resetar drivers de camera windows 11 tutorial passo a passo'
];

export const metadata: Metadata = createGuideMetadata('webcam-piscando-tela-preta-fix', title, description, keywords);

export default function WebcamFixGuide() {
    const summaryTable = [
        { label: "Causa #1", value: "Configurações de Privacidade do Windows" },
        { label: "Causa #2", value: "Banda USB saturada (Muitos dispositivos)" },
        { label: "Sintoma", value: "Luz da câmera acende mas a imagem não aparece" },
        { label: "Dificuldade", value: "Fácil" }
    ];

    const contentSections = [
        {
            title: "Por que a imagem some?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Problemas de webcam no Windows 11 em 2026 são, na maioria das vezes, questões de permissão ou largura de banda. Se você está tentando usar a câmera no Drive, Discord ou Zoom e ela fica com a tela preta (mesmo com o LED de luz aceso), o sistema pode estar bloqueando o acesso por segurança ou o seu driver de vídeo está tendo conflito com a codificação do sensor.
        </p>
      `
        },
        {
            title: "1. Verificando a Privacidade do Windows",
            content: `
        <p class="mb-4 text-gray-300">O Windows 11 é rigoroso com a sua imagem:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Vá em Configurações > <strong>Privacidade e Segurança</strong> > Câmera.</li>
            <li>Certifique-se de que 'Acesso à câmera' está ativado.</li>
            <li>Certifique-se de que o aplicativo específico (ex: Navegador ou Discord) tem permissão individual logo abaixo na lista.</li>
            <li><strong>Dica:</strong> Algumas Webcams e Notebooks de 2026 possuem um <strong>botão físico</strong> ou uma trava de privacidade deslizante. Verifique se o obturador está aberto!</li>
        </ol>
      `
        },
        {
            title: "2. Resetando o Driver da Câmera",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Limpando registros antigos:</h4>
            <p class="text-sm text-gray-300">
                1. Clique com o botão direito no Iniciar > <strong>Gerenciador de Dispositivos</strong>. <br/>
                2. Expanda 'Câmeras'. <br/>
                3. Clique com o botão direito na sua câmera e selecione <strong>Desinstalar dispositivo</strong>. <br/>
                4. Reinicie o sistema. O Windows 11 buscará o driver mais estável e compatível com a sua versão do sistema automaticamente.
            </p>
        </div>
      `
        },
        {
            title: "3. O \"Limite\" do barramento USB",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>Sua webcam pisca sem parar?</strong> 
            <br/><br/>Webcams 4K de 2026 exigem muita energia e largura de banda. Se você usa um Hub USB para conectar teclado, mouse, fone e webcam ao mesmo tempo, a porta pode não conseguir transmitir os dados da imagem. Tente conectar a webcam diretamente em uma porta <strong>USB 3.0 (Azul)</strong> na parte traseira do seu PC. Isso resolve 90% dos casos de interferência e imagem piscando.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/usb-nao-reconhecido-reset-drivers",
            title: "Problemas USB",
            description: "Dicas se a porta parou de funcionar."
        },
        {
            href: "/guias/como-usar-obs-studio-gravar-tela",
            title: "Configurar OBS",
            description: "Melhore a imagem da sua webcam."
        },
        {
            href: "/guias/pos-instalacao-windows-11",
            title: "Drivers Windows",
            description: "Mantenha o sistema em dia."
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
