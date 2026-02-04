import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Como Resolver Erro 0xc00007b no Windows 11 (2026)";
const description = "Seu jogo ou programa não abre e mostra o erro 0xc00007b? Aprenda como corrigir a incompatibilidade de DLLs e runtimes no Windows 11 em 2026.";
const keywords = [
    'como resolver erro 0xc00007b windows 11 2026',
    'aplicativo não inicializou corretamente 0xc00007b fix',
    'corrigir erro de dll 64 bits e 32 bits tutorial',
    'instalar visual c++ para corrigir erro 0xc00007b guia',
    'erro ao abrir jogo 0xc00007b solucao definitiva 2026'
];

export const metadata: Metadata = createGuideMetadata('erro-0xc00007b-aplicativo-nao-inicializou', title, description, keywords);

export default function Error07bFixGuide() {
    const summaryTable = [
        { label: "O que significa", value: "Tentativa de carregar DLL de 32 bits em app de 64 bits (ou vice-versa)" },
        { label: "Causa Principal", value: "Arquivos do Visual C++ corrompidos ou misturados" },
        { label: "Solução Chave", value: "Reinstalação completa das Runtimes All-in-One" },
        { label: "Dificuldade", value: "Médio" }
    ];

    const contentSections = [
        {
            title: "O Pavor dos Aplicativos: O Erro 0xc00007b",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O erro **0xc00007b** no Windows 11 é um dos mais comuns e frustrantes. Ele simplesmente diz que o "aplicativo não pôde ser inicializado corretamente". Tecnicamente, isso ocorre quando há uma confusão entre a arquitetura do programa e as bibliotecas (DLLs) que ele usa. Imagine um programa de 64 bits tentando usar uma peça de 32 bits; o sistema entra em conflito e trava a inicialização imediatamente.
        </p>
      `
        },
        {
            title: "1. O Erro Humano: Baixar DLLs avulsas",
            content: `
        <p class="mb-4 text-gray-300">A maior causa desse erro em 2026 é tentar "consertar" o Windows baixando arquivos .dll de sites aleatórios:</p>
        <p class="text-sm text-gray-300">
            Muitas vezes, quando falta uma DLL, o usuário pesquisa o nome dela no Google, baixa e joga na pasta 'System32' ou na pasta do jogo. **Isso é o que gera o erro 0xc00007b**. Se você baixar a versão de 32 bits de uma DLL e colocá-la onde o Windows espera uma de 64 bits, o sistema ficará "envenenado". <br/><br/>
            <strong>Primeiro passo:</strong> Apague qualquer DLL que você tenha baixado e colocado manualmente na pasta do jogo ou no diretório Windows.
        </p>
      `
        },
        {
            title: "2. Reinstalação de Runtimes com o All-in-One",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">A Solução Definitiva:</h4>
            <p class="text-sm text-gray-300">
                1. Vá ao Painel de Controle > Desinstalar um Programa. <br/>
                2. Desinstale todas as versões do **Microsoft Visual C++ Redistributable** (2005 até 2022/2026). <br/>
                3. Reinicie o computador. <br/>
                4. Baixe o pacote **Visual C++ All-in-One** (muito comum em sites como TechPowerUp). <br/>
                5. Execute o arquivo 'install_all.bat' como administrador. Ele colocará cada DLL na arquitetura correta automaticamente.
            </p>
        </div>
      `
        },
        {
            title: "3. Verificação de Arquivos de Sistema",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>Check de Integridade:</strong> 
            <br/><br/>Muitas vezes, o erro persiste porque arquivos vitais do Windows foram sobrescritos. Abra o CMD como administrador e digite: <br/><br/>
            <code>sfc /scannow</code> <br/><br/>
            Este comando fará uma varredura completa. Se ele encontrar DLLs erradas na pasta do sistema, ele buscará as originais no banco de dados do Windows 11 e as substituirá, resolvendo o erro 0xc00007b de uma vez por todas.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/corrigir-dll-faltando-vcredist-directx",
            title: "Guia de Runtimes",
            description: "Entenda por que as DLLs são importantes."
        },
        {
            href: "/guias/pos-instalacao-windows-11",
            title: "Checklist Windows",
            description: "Tudo o que você deve ter instalado."
        },
        {
            href: "/guias/como-resolver-tela-azul",
            title: "Problemas de Boot",
            description: "O que fazer se o Windows sequer ligar."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="20 min"
            difficultyLevel="Médio"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
