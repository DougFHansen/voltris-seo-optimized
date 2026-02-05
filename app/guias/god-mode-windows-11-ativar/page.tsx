import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'god-mode-windows-11-ativar',
  title: "God Mode no Windows 11: Como ativar o painel secreto",
  description: "Quer ter acesso a todas as configurações do Windows em uma única pasta? Aprenda a ativar o famoso 'God Mode' (Modo Deus) no Windows 11 e 10.",
  category: 'software',
  difficulty: 'Iniciante',
  time: '5 min'
};

const title = "God Mode no Windows 11: Como ativar o painel secreto";
const description = "Quer ter acesso a todas as configurações do Windows em uma única pasta? Aprenda a ativar o famoso 'God Mode' (Modo Deus) no Windows 11 e 10.";
const keywords = [
    'como ativar god mode windows 11 tutorial 2026',
    'modo deus windows 10 como funciona',
    'atalho secreto configurações windows 11',
    'painel de controle oculto windows 2026',
    'dicas e truques secretos windows 11'
];

export const metadata: Metadata = createGuideMetadata('god-mode-windows-11-ativar', title, description, keywords);

export default function GodModeGuide() {
    const summaryTable = [
        { label: "O que é", value: "Acesso a 200+ configurações em uma pasta" },
        { label: "Nome da Pasta", value: "GodMode.{ED7BA470-8E54-465E-825C-99712043E01C}" },
        { label: "Segurança", value: "Totalmente Seguro (Recurso Nativo)" },
        { label: "Dificuldade", value: "Fácil" }
    ];

    const contentSections = [
        {
            title: "O que é o God Mode?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O **God Mode** (Modo Deus) não é um hack, mas sim um "atalho mestre" que a Microsoft criou para desenvolvedores. Ele reúne em uma única pasta mais de 200 configurações que normalmente ficam espalhadas entre o novo menu de Configurações e o antigo Painel de Controle, facilitando muito a vida de quem gosta de personalizar o sistema.
        </p>
      `
        },
        {
            title: "Passo a Passo: Como ativar",
            content: `
        <p class="mb-4 text-gray-300">É muito simples e não exige instalar nada:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Vá na sua Área de Trabalho (Desktop).</li>
            <li>Clique com o botão direito em um espaço vazio > <strong>Novo > Pasta</strong>.</li>
            <li>Renomeie a pasta com o seguinte código exatamente como está (copie e cole): <br/>
                <code class="bg-gray-800 p-2 rounded text-blue-400 block mt-2 text-xs">GodMode.{ED7BA470-8E54-465E-825C-99712043E01C}</code>
            </li>
            <li>Dê Enter. O ícone da pasta vai mudar para o ícone do Painel de Controle.</li>
        </ol>
      `
        },
        {
            title: "O que você encontra lá dentro?",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Categorias Úteis:</h4>
            <p class="text-sm text-gray-300">
                Uma vez aberta, você verá tudo organizado: <br/>
                - Administração do Computador. <br/>
                - Configurações de Backup e Restauração. <br/>
                - Opções de Energia e Suspensão avançadas. <br/>
                - Gerenciamento de Credenciais e Senhas. <br/>
                - Ajustes de Mouse, Teclado e Som.
            </p>
        </div>
      `
        },
        {
            title: "Dica: Use a Busca por configuração",
            content: `
        <p class="mb-4 text-gray-300">
            Como a lista é gigantesca, use a barra de busca no canto superior direito da pasta do God Mode. Digite algo como "Partição" ou "Cor" e ele filtrará instantaneamente a ferramenta exata que você precisa, sem você ter que navegar por 10 menus diferentes do Windows 11.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/atalhos-produtividade-windows",
            title: "Atalhos Windows",
            description: "Mais formas de navegar rápido no sistema."
        },
        {
            href: "/guias/debloating-windows-11",
            title: "Debloat Windows",
            description: "Limpe os apps inúteis que o God Mode mostra."
        },
        {
            href: "/guias/pos-instalacao-windows-11",
            title: "Pós-Instalação",
            description: "Monte seu PC com as melhores ferramentas."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="5 min"
            difficultyLevel="Iniciante"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
