import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'usb-nao-reconhecido-reset-drivers',
  title: "Dispositivo USB não reconhecido: Como resolver (2026)",
  description: "Seu pendrive, mouse ou teclado parou de funcionar e o Windows diz 'Dispositivo USB Desconhecido'? Aprenda a resetar os drivers em 2026.",
  category: 'windows-erros',
  difficulty: 'Intermediário',
  time: '15 min'
};

const title = "Dispositivo USB não reconhecido: Como resolver (2026)";
const description = "Seu pendrive, mouse ou teclado parou de funcionar e o Windows diz 'Dispositivo USB Desconhecido'? Aprenda a resetar os drivers em 2026.";
const keywords = [
    'dispositivo usb nao reconhecido windows 11 2026 tutorial',
    'como resetar drivers usb windows 11 guia',
    'erro usb desconhecido falha na solicitação de descritor de dispositivo 2026',
    'teclado e mouse usb nao funcionam como resolver tutorial',
    'consertar porta usb parou de funcionar windows 11 2026'
];

export const metadata: Metadata = createGuideMetadata('usb-nao-reconhecido-reset-drivers', title, description, keywords);

export default function USBTroubleshootingGuide() {
    const summaryTable = [
        { label: "Erro Comum", value: "Falha na solicitação de descritor" },
        { label: "Solução #1", value: "Desinstalar Hub USB no Gerenciador" },
        { label: "Ajuste Vital", value: "Desativar Suspensão Seletiva USB" },
        { label: "Dificuldade", value: "Médio" }
    ];

    const contentSections = [
        {
            title: "O mistério do USB 'Morto'",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Você conecta o dispositivo, ouve o barulho clássico do Windows, mas nada acontece (ou pior: aparece um erro de dispositivo desconhecido). Em 2026, com o Windows 11 sendo muito agressivo na economia de energia, muitas vezes o sistema "desliga" a porta USB para poupar bateria ou por causa de um driver que travou durante o uso. Felizmente, na maioria das vezes, o problema não é físico, mas sim lógico.
        </p>
      `
        },
        {
            title: "1. Resetando o Hub de Barramento USB",
            content: `
        <p class="mb-4 text-gray-300">Force o Windows a reviver as portas USB:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Abra o <strong>Gerenciador de Dispositivos</strong> (Win+X).</li>
            <li>Role até o final em 'Controladores USB'.</li>
            <li>Clique com o botão direito em <strong>'Generic USB Hub'</strong> ou <strong>'USB Root Hub'</strong>.</li>
            <li>Selecione 'Desinstalar dispositivo' em todos eles.</li>
            <li>Reinicie o computador. O Windows reinstalará os drivers originais e reativará a energia de todas as portas.</li>
        </ol>
      `
        },
        {
            title: "2. Desativando a Suspensão Seletiva",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Impedindo o Windows de dormir:</h4>
            <p class="text-sm text-gray-300">
                Se o seu mouse ou teclado desliga sozinho após alguns minutos parado: <br/><br/>
                - Vá em Painel de Controle > Hardware e Sons > Opções de Energia. <br/>
                - Clique em 'Alterar configurações do plano' > 'Alterar configurações de energia avançadas'. <br/>
                - Procure por <strong>Configurações USB</strong> > Configurações de suspensão seletiva USB. <br/>
                - Mude para <strong>Desabilitado</strong>. Isso garante energia constante para seus periféricos 24 horas por dia.
            </p>
        </div>
      `
        },
        {
            title: "3. Problemas com Fontes e Energia (2026)",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>Dica avançada:</strong> Em 2026, muitos periféricos RGB (teclados mecânicos, mouses com luzes) puxam muita energia. 
            <br/><br/>Se você usa um <strong>Hub USB sem fonte externa</strong>, as portas podem não aguentar. Tente conectar o dispositivo diretamente nas portas traseiras da placa-mãe (direto no gabinete) em vez das frontais. As portas traseiras têm fornecimento elétrico mais estável e direto, resolvendo muitos erros de 'Dispositivo não reconhecido'.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/teclado-notebook-parou-fix",
            title: "Teclado Notebook",
            description: "Dicas se o teclado interno parou."
        },
        {
            href: "/guias/pos-instalacao-windows-11",
            title: "Pós-Instalação",
            description: "Ajustes de driver para um PC novo."
        },
        {
            href: "/guias/gerenciamento-energia-windows-11",
            title: "Energia Windows",
            description: "Mais ajustes para evitar suspensão de hardware."
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
