import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'ddu-limpeza-drivers-video-guia',
    title: "DDU (Display Driver Uninstaller): Como Usar e Limpar Drivers",
    description: "Drivers corrompidos causam tela azul e lag. Aprenda a usar o DDU em Modo de Segurança para fazer uma instalação limpa da Nvidia/AMD.",
    category: 'hardware',
    difficulty: 'Avançado',
    time: '30 min'
};

const title = "DDU Guide (2026): Instalação Limpa de GPU";
const description = "Trocou de placa de vídeo? O jogo está crashando sem motivo? A culpa pode ser de restos de drivers antigos. DDU resolve 90% dos problemas de GPU.";

const keywords = [
    'como usar ddu display driver uninstaller modo de seguranca',
    'driver de video com problema tela piscando',
    'troquei de nvidia para amd o que fazer',
    'limpeza completa driver gpu',
    'black screen driver install fix',
    'ddu safe mode tutorial windows 11',
    'desativar windows update drivers ddu',
    'voltris optimizer clean install',
    'nvcleanstall vs ddu'
];

export const metadata: Metadata = createGuideMetadata('ddu-limpeza-drivers-video-guia', title, description, keywords);

export default function DDUGuide() {
    const summaryTable = [
        { label: "Ferramenta", value: "DDU (Wagnardsoft)" },
        { label: "Modo", value: "Safe Mode (Obrigatório)" },
        { label: "Internet", value: "Desconectada" },
        { label: "Opção", value: "Clean and Restart" },
        { label: "Prevent", value: "Windows Update Off" },
        { label: "Backup", value: "Restore Point" }
    ];

    const contentSections = [
        {
            title: "Introdução: Por que desinstalar não basta?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Quando você desinstala pelo Painel de Controle, arquivos de registro e DLLs velhas ficam para trás. Se você trocar de Nvidia para AMD (ou vice-versa) sem limpar, o conflito é certo.
        </p>
      `
        },
        {
            title: "Capítulo 1: Preparação (Antes de começar)",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Checklist</h4>
                <p class="text-gray-400 text-xs text-justify">
                    1. Baixe o <strong>DDU</strong> (Site oficial Wagnardsoft).
                    2. Baixe o driver novo da sua placa (Nvidia/AMD) e salve no Desktop.
                    3. <strong>Desconecte o cabo de rede/Wi-Fi.</strong> Isso é crucial. Se o Windows tiver internet, ele vai tentar baixar um driver genérico automaticamente assim que você reiniciar, estragando a limpeza.
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: Entrando em Modo de Segurança",
            content: `
        <p class="mb-4 text-gray-300">
            O DDU funciona melhor sem interferência.
            <br/>Segure a tecla <strong>SHIFT</strong> e clique em Reiniciar no Menu Iniciar.
            <br/>Vá em Solução de Problemas > Opções Avançadas > Configurações de Inicialização > Reiniciar.
            <br/>Aperte <strong>4</strong> para ativar o Modo de Segurança.
        </p>
      `
        },
        {
            title: "Capítulo 3: Executando a Limpeza",
            content: `
        <p class="mb-4 text-gray-300">
            Já no Modo de Segurança:
            <br/>1. Abra o DDU.
            <br/>2. Selecione o tipo de dispositivo: <strong>GPU</strong>.
            <br/>3. Selecione a marca (Nvidia/AMD/Intel).
            <br/>4. Clique em <strong>"Clean and restart"</strong> (Altamente recomendado).
            <br/>O PC vai piscar, trabalhar por 2 minutos e reiniciar normal.
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: Opções do DDU",
            content: `
        <p class="mb-4 text-gray-300">
            Nas opções do DDU, marque:
            <br/>- <strong>"Prevent downloads of drivers from 'Windows Update'"</strong>. Isso impede que o Windows estrague tudo instalando drivers velhos de 2023.
            <br/>- Remove C:Nvidia/AMD folders (Apaga instaladores velhos que ocupam GBs).
        </p>
      `
        },
        {
            title: "Capítulo 5: Instalando o Novo Driver",
            content: `
        <p class="mb-4 text-gray-300">
            De volta ao Windows normal (ainda sem internet):
            <br/>A resolução estará baixa (640x480 ou 800x600). É normal, você está sem driver.
            <br/>Execute o instalador do driver que você baixou no passo 1.
            <br/>Escolha "Instalação Expressa" ou "Personalizada" (se quiser NVCleanstall).
            <br/>Só reconecte a internet DEPOIS que a instalação terminar.
        </p>
      `
        },
        {
            title: "Capítulo 6: Erros Comuns",
            content: `
        <p class="mb-4 text-gray-300">
            - <strong>Tela Preta Infinita:</strong> Acontece raramente. Se esperar 10 min e não voltar, force o reinício. O DDU geralmente cria um Ponto de Restauração antes de começar por segurança.
            - <strong>Mouse travando:</strong> No modo de segurança, drivers USB de mouse gamer podem não carregar. Tenha um mouse simples USB por perto se precisar.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 7: NVCleanstall (Expert)",
            content: `
            <p class="mb-4 text-gray-300">
                Se você tem Nvidia, após o DDU, use o <strong>NVCleanstall</strong> em vez do instalador oficial.
                <br/>Ele permite instalar o driver SEM a Telemetria, SEM o GeForce Experience e SEM drivers de óculos 3D inúteis. O driver fica mais leve e responsivo.
            </p>
            `
        },
        {
            title: "Capítulo 8: Limpeza de Áudio (Realtek)",
            content: `
            <p class="mb-4 text-gray-300">
                O DDU também limpa drivers de Áudio (Realtek/SoundBlaster).
                <br/>Útil se seu microfone parou de funcionar ou o som está chiando após um update do Windows. Selecione "Audio" no menu drop-down.
            </p>
            `
        },
        {
            title: "Capítulo 9: Frequência de Limpeza",
            content: `
            <p class="mb-4 text-gray-300">
                Não use DDU a cada update de driver (ex: toda semana). É desnecessário e estressa o registro.
                <br/>Use DDU apenas quando:
                <br/>1. Trocar de Placa de Vídeo.
                <br/>2. Tiver problemas graves (crashes, tela azul).
                <br/>3. Uma vez por ano para faxina.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Posso usar DDU sem Modo de Segurança?",
            answer: "Pode, mas não é recomendado. Arquivos em uso pelo Windows não serão deletados corretamente, e a limpeza será parcial."
        },
        {
            question: "Resolvi o problema mas perdi meus perfis de jogos.",
            answer: "Sim, DDU apaga todas as configurações do Painel Nvidia/AMD. Você terá que configurar V-Sync, Modo de Latência, etc., tudo de novo."
        },
        {
            question: "Pin / Senha não funciona no Modo Seguro?",
            answer: "Se você usa conta Microsoft, às vezes o Modo Seguro pede a SENHA do email, não o PIN numérico. Saiba sua senha antes de entrar."
        }
    ];

    const externalReferences = [
        { name: "Wagnardsoft (DDU Official)", url: "https://www.wagnardsoft.com/" },
        { name: "NVCleanstall Guide", url: "https://www.techpowerup.com/download/techpowerup-nvcleanstall/" }
    ];

    const relatedGuides = [
        {
            href: "/guias/nvidia-painel-controle-melhores-configuracoes",
            title: "Nvidia Config",
            description: "O que fazer pós-DDU."
        },
        {
            href: "/guias/amd-adrenalin-configuracao-competitiva",
            title: "AMD Config",
            description: "O que fazer pós-DDU."
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
