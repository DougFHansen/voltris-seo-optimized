import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'windows-sandbox-testar-virus',
  title: "Windows Sandbox: Como testar arquivos suspeitos com segurança (2026)",
  description: "Quer abrir um arquivo mas tem medo de vírus? Aprenda como ativar e usar o Windows Sandbox, a área isolada do Windows 11 para testes em 2026.",
  category: 'software',
  difficulty: 'Iniciante',
  time: '15 min'
};

const title = "Windows Sandbox: Como testar arquivos suspeitos com segurança (2026)";
const description = "Quer abrir um arquivo mas tem medo de vírus? Aprenda como ativar e usar o Windows Sandbox, a área isolada do Windows 11 para testes em 2026.";
const keywords = [
    'windows sandbox como ativar 2026 tutorial',
    'testar virus com seguranca windows 11 guia',
    'como usar windows sandbox tutorial passo a passo 2026',
    'windows sandbox vs maquina virtual qual melhor para testes',
    'habilitar sandbox windows 11 pro tutorial 2026'
];

export const metadata: Metadata = createGuideMetadata('windows-sandbox-testar-virus', title, description, keywords);

export default function SandboxGuide() {
    const summaryTable = [
        { label: "Requisito #1", value: "Windows 10/11 Pro ou Enterprise" },
        { label: "Requisito #2", value: "Virtualização ativa na BIOS" },
        { label: "Vantagem", value: "Ao fechar, tudo é deletado (Zero risco)" },
        { label: "Dificuldade", value: "Fácil" }
    ];

    const contentSections = [
        {
            title: "O que é o Windows Sandbox?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Em 2026, baixar arquivos da internet é um campo minado. O **Windows Sandbox** é como um "quarto de isolamento" para o seu computador. É um ambiente temporário do Windows 11 onde você pode baixar, instalar e rodar qualquer programa suspeito sem que ele tenha acesso aos seus arquivos reais, fotos ou senhas. Quando você fecha o Sandbox, tudo o que aconteceu lá dentro é deletado permanentemente, como se nunca tivesse existido.
        </p>
      `
        },
        {
            title: "1. Como ativar o Sandbox (Passo a Passo)",
            content: `
        <p class="mb-4 text-gray-300">O recurso vem desligado por padrão no Windows 11:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Pesquise por 'Ativar ou desativar recursos do Windows' no menu Iniciar.</li>
            <li>Role a lista até encontrar <strong>'Área de Transferência do Windows' (Windows Sandbox)</strong>.</li>
            <li>Marque a caixa e clique em OK. O Windows pedirá para reiniciar o PC.</li>
            <li><strong>Aviso:</strong> Se a opção estiver cinza (bloqueada), você precisa ativar a 'Virtualization' na sua BIOS primeiro.</li>
        </ol>
      `
        },
        {
            title: "2. Testando arquivos na prática",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Fluxo de Trabalho em 2026:</h4>
            <p class="text-sm text-gray-300">
                1. Pesquise por 'Windows Sandbox' no Iniciar e abra como Administrador. <br/>
                2. No seu Windows real, clique com o botão direito no arquivo suspeito e selecione 'Copiar'. <br/>
                3. Dentro da janela do Sandbox, clique com o botão direito no desktop e selecione 'Colar'. <br/>
                4. Execute o arquivo à vontade. Você pode navegar em sites perigosos ou rodar instaladores duvidosos. Se o arquivo for um vírus, ele ficará preso dentro do Sandbox e não poderá sair para infectar o seu PC real.
            </p>
        </div>
      `
        },
        {
            title: "3. Diferença entre Sandbox e Máquina Virtual",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>Por que usar o Sandbox?</strong> 
            <br/><br/>Diferente de uma Máquina Virtual (VM) comum que exige Gigabytes de espaço e instalação lenta, o Sandbox é leve e descartável. Ele usa o próprio kernel do seu Windows 11 para rodar, sendo extremamente rápido. Em 2026, ele é a ferramenta favorita de pesquisadores de segurança e usuários que buscam privacidade total ao testar novas ferramentas e scripts.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/virtualizacao-vmware",
            title: "Usar VMWare",
            description: "Para testes que precisam ser salvos."
        },
        {
            href: "/guias/remocao-virus-malware",
            title: "Remover Vírus",
            description: "O que fazer se o vírus já saiu do controle."
        },
        {
            href: "/guias/identificacao-phishing",
            title: "Evitar Phishing",
            description: "Aprenda a identificar arquivos perigosos."
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
