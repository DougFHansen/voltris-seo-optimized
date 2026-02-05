import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'instalar-apps-android-windows-11',
  title: "Como rodar Apps de Android no Windows 11 (Sem Emulador)",
  description: "Quer usar Instagram, TikTok ou jogos de celular direto no Windows 11? Aprenda a configurar o Subsistema Windows para Android (WSA) e a Amazon Appstore...",
  category: 'software',
  difficulty: 'Intermediário',
  time: '25 min'
};

const title = "Como rodar Apps de Android no Windows 11 (Sem Emulador)";
const description = "Quer usar Instagram, TikTok ou jogos de celular direto no Windows 11? Aprenda a configurar o Subsistema Windows para Android (WSA) e a Amazon Appstore.";
const keywords = [
    'como instalar apps android no windows 11 tutorial 2026',
    'instalar apk no windows 11 subsistema android',
    'subsistema windows para android wsa como ativar',
    'rodar jogos de celular no pc sem bluestacks',
    'amazon appstore windows 11 brasil download'
];

export const metadata: Metadata = createGuideMetadata('instalar-apps-android-windows-11', title, description, keywords);

export default function AndroidOnWindowsGuide() {
    const summaryTable = [
        { label: "Recurso", value: "WSA (Windows Subsystem for Android)" },
        { label: "Requisito RAM", value: "8GB (Recomendado 16GB)" },
        { label: "Virtualização", value: "Deve estar ATIVA na BIOS" },
        { label: "Dificuldade", value: "Média" }
    ];

    const contentSections = [
        {
            title: "O que é o WSA?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Diferente dos emuladores como BlueStacks que criam um "computador dentro do computador", o **WSA** integra o Android diretamente no núcleo do Windows 11. Isso significa que os apps de celular aparecem no seu Menu Iniciar, podem ser fixados na barra de tarefas e funcionam com as notificações nativas do Windows, de forma muito mais leve e rápida.
        </p>
      `
        },
        {
            title: "1. Requisitos e Ativação",
            content: `
        <p class="mb-4 text-gray-300">Antes de começar, seu PC precisa estar pronto:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>A virtualização deve estar ligada na BIOS (SVM na AMD ou VT-x na Intel).</li>
            <li>Vá em 'Ativar ou desativar recursos do Windows' e marque <strong>'Plataforma de Máquina Virtual'</strong>.</li>
            <li>Reinicie o computador.</li>
            <li>Abra a Microsoft Store e pesquise por <strong>'Amazon Appstore'</strong>. Ao instalar este app, o Subsistema Android será instalado automaticamente.</li>
        </ol>
      `
        },
        {
            title: "2. Instalando qualquer APK (Sideload)",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Dica Avançada:</h4>
            <p class="text-sm text-gray-300">
                A Amazon Appstore tem poucos apps. Para instalar qualquer aplicativo (como o WhatsApp ou um jogo específico), use ferramentas de terceiros como o <strong>'WSA Pacman'</strong> ou <strong>'WSATools'</strong> disponíveis na Microsoft Store. Elas permitem que você apenas clique duas vezes em um arquivo .APK e ele seja instalado no Windows como se fosse um programa comum.
            </p>
        </div>
      `
        },
        {
            title: "3. Gerenciamento de Memória",
            content: `
        <p class="mb-4 text-gray-300">
            O Android no Windows consome muita RAM. 
            <br/>Abra as 'Configurações do Subsistema Windows para Android' e, em <strong>Recursos do Sistema</strong>, mude para 'Conforme Necessário'. Isso faz o Windows fechar o modo Android quando você não estiver usando nenhum app de celular, liberando memória para seus jogos de PC.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/windows-sandbox-testar-virus",
            title: "Windows Sandbox",
            description: "Outra forma de rodar apps isoladamente."
        },
        {
            href: "/guias/bluestacks-vs-ldplayer-qual-mais-leve",
            title: "Emuladores Clássicos",
            description: "Se o WSA não funcionar no seu PC."
        },
        {
            href: "/guias/atualizar-bios-seguro",
            title: "Ativar Virtualização",
            description: "Guia para entrar na BIOS."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="25 min"
            difficultyLevel="Intermediário"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
