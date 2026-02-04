import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Como Criar um Ponto de Restauração no Windows 11 (2026)";
const description = "Vai instalar um driver novo ou mexer no registro? Aprenda como criar um Ponto de Restauração para proteger seu Windows contra erros em 2026.";
const keywords = [
    'como criar ponto de restauração windows 11 2026',
    'restauração do sistema windows 11 como usar guia',
    'criar backup de registro windows 11 tutorial 2026',
    'recuperar windows 11 após erro de atualização guia',
    'ponto de restauração automático vs manual tutorial'
];

export const metadata: Metadata = createGuideMetadata('criar-ponto-restauracao-windows', title, description, keywords);

export default function RestorePointGuide() {
    const summaryTable = [
        { label: "O que faz", value: "Tira um 'print' das configurações do Windows" },
        { label: "Frequência", value: "Sempre antes de instalar mods ou novos drivers" },
        { label: "Espaço em Disco", value: "Configurável (geralmente 5% a 10%)" },
        { label: "Dificuldade", value: "Fácil" }
    ];

    const contentSections = [
        {
            title: "O seu seguro contra telas azuis",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Em 2026, modificar o Windows 11 com scripts de otimização ou instalar drivers beta é comum para quem busca performance. O problema é que um comando errado pode corromper o sistema. O **Ponto de Restauração** é como um botão de "voltar no tempo": se algo der errado, você pode retornar o Windows para o estado exato em que ele estava há 10 minutos, salvando o seu trabalho e evitando uma formatação.
        </p>
      `
        },
        {
            title: "1. Ativando a Proteção do Sistema",
            content: `
        <p class="mb-4 text-gray-300">Por padrão, o Windows 11 pode estar com essa função desligada:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Pesquise por <strong>'Criar ponto de restauração'</strong> no menu Iniciar.</li>
            <li>Na aba 'Proteção do Sistema', selecione o seu disco C: e clique em <strong>Configurar</strong>.</li>
            <li>Marque 'Ativar proteção do sistema' e reserve cerca de 5GB a 10GB de espaço.</li>
            <li>Clique em OK. Agora o Windows está pronto para criar backups.</li>
        </ol>
      `
        },
        {
            title: "2. Criando o seu Ponto Manual",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Procedimento de Segurança:</h4>
            <p class="text-sm text-gray-300">
                Ainda na mesma janela, clique no botão <strong>Criar...</strong> ao lado de 'Crie um ponto de restauração agora'. <br/><br/>
                Dê um nome claro para o ponto, como <i>"Antes de instalar Driver NVIDIA 555.25"</i> ou <i>"Antes de Otimizar Registro"</i>. Clique em Criar. Levará cerca de 30 segundos. Agora, você está seguro para fazer qualquer mudança profunda no Windows em 2026.
            </p>
        </div>
      `
        },
        {
            title: "3. Como Voltar no Tempo?",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>Se o PC der erro:</strong> 
            <br/><br/>Abra novamente a ferramenta e clique em **Restauração do Sistema**. Selecione o ponto que você criou e avance. O Windows reiniciará e começará a desfazer as mudanças de arquivos de sistema e registro. <br/><br/>
            <strong>Dica Vital:</strong> Restaurar o sistema **não apaga seus arquivos pessoais** (fotos, documentos), mas vai desinstalar qualquer programa que você tenha colocado no PC após a criação do ponto.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/pos-instalacao-windows-11",
            title: "Checklist Windows",
            description: "Ajustes essenciais para um sistema novo."
        },
        {
            href: "/guias/remover-bloatware-windows-powershell",
            title: "Remover Bloatware",
            description: "Crie um ponto antes de usar scripts."
        },
        {
            href: "/guias/como-resolver-tela-azul",
            title: "Fix Tela Azul",
            description: "Use a restauração se o sistema não ligar."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="5 min"
            difficultyLevel="Fácil"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
