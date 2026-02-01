import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Erro 0xc00007b: O Guia Definitivo e Técnico para Resolver (2026)";
const description = "O erro 'O aplicativo não pôde ser inicializado corretamente (0xc00007b)' é o pesadelo dos gamers. Entenda a causa raiz (DLLs misturadas) e veja 3 métodos infalíveis para corrigir sem formatar.";
const keywords = ['erro 0xc00007b', 'corrigir erro 0xc00007b windows 11', 'aio runtimes techpowerup', 'dependency walker tutorial', 'dll 32 bits em system32', 'visual c++ erro de lado a lado'];

export const metadata: Metadata = createGuideMetadata('erro-0xc00007b-aplicativo-nao-inicializou', title, description, keywords);

export default function Error7bGuide() {
    const summaryTable = [
        { label: "Ferramenta Principal", value: "AIO Runtimes" },
        { label: "Ferramenta Avançada", value: "Dependency Walker" },
        { label: "Nível de Risco", value: "Médio" },
        { label: "Tempo Estimado", value: "20 Minutos" }
    ];

    const contentSections = [
        {
            title: "Introdução Técnica: Por que esse erro acontece?",
            content: `
        <p class="mb-4 text-gray-300 leading-relaxed">
            Se você pesquisar na internet, 90% dos sites vão mandar você baixar uma DLL solta e jogar na pasta do Windows. <strong>Não faça isso.</strong> Foi exatamente isso que causou o problema.
        </p>
        <div class="bg-[#121218] border border-gray-700 p-6 rounded-xl mb-6">
            <h4 class="text-white font-bold mb-4">A Anatomia do Erro 0xc00007b</h4>
            <p class="text-gray-300 mb-4">
                O código <code>0xc00007b</code> significa <code>STATUS_INVALID_IMAGE_FORMAT</code>. Em termos simples: O executável do seu jogo (que é 64-bits) tentou carregar uma DLL (biblioteca de código) que é 32-bits, ou vice-versa.
            </p>
            <p class="text-gray-300">
                O Windows possui duas pastas críticas:
                <br/><span class="text-green-400 font-mono">C:\\Windows\\System32</span> (Contém arquivos de 64-bits).
                <br/><span class="text-green-400 font-mono">C:\\Windows\\SysWOW64</span> (Contém arquivos de 32-bits).
            </p>
            <p class="text-gray-300 mt-4 text-sm italic">
                Sim, a Microsoft colocou arquivos 64-bits na pasta chamada "System32" e arquivos 32-bits na pasta "SysWOW64". É confuso de propósito por razões de compatibilidade em 2003. O erro acontece quando você joga a DLL errada na pasta errada.
            </p>
        </div>
      `,
            subsections: []
        },
        {
            title: "Método 1: A Solução Automática (AIO Runtimes)",
            content: `
        <p class="mb-4 text-gray-300">Como é impossível saber qual das 200 DLLs do seu sistema está corrompida olhando a olho nu, a melhor solução é <strong>reinstalar todas</strong> de uma vez usando um script automatizado.</p>
        
        <ol class="space-y-4 text-gray-300 list-decimal list-inside ml-4 bg-gray-900/50 p-6 rounded-xl border border-gray-800">
            <li>Faça o download do pacote <strong>"Visual C++ Redistributable Runtimes All-in-One"</strong> do site TechPowerUp (é a fonte mais segura e atualizada).</li>
            <li>Extraia o arquivo ZIP para uma pasta na Área de Trabalho.</li>
            <li>Você verá vários arquivos. Clique com o botão direito no arquivo chamado <strong>install_all.bat</strong>.</li>
            <li>Selecione <strong>Executar como Administrador</strong>.</li>
        </ol>

        <p class="text-gray-300 mt-4">
            Uma tela preta (CMD) vai abrir. Ele vai, silenciosamente, desinstalar todos os Visual C++ conflitantes do seu PC (2005, 2008, 2010... até 2022) e instalar as versões corretas oficiais da Microsoft. Quando a tela fechar sozinha, reinicie o PC. Isso resolve 95% dos casos.
        </p>
      `
        },
        {
            title: "Método 2: DirectX End-User Runtime (O Esquecido)",
            content: `
            <p class="mb-4 text-gray-300">Às vezes o problema não é C++, é DirectX. Jogos antigos precisam do DirectX 9.0c, que não vem completo no Windows 10/11.</p>
            <ol class="space-y-2 text-gray-300 list-decimal list-inside ml-4">
                <li>Baixe o <strong>DirectX End-User Runtime Web Installer</strong> no site oficial da Microsoft.</li>
                <li>Execute o <code>dxwebsetup.exe</code>.</li>
                <li>Muito cuidado: Na instalação, ele vai oferecer para instalar a "Barra do Bing". <strong>DESMARQUE</strong> essa opção.</li>
                <li>Deixe ele baixar os arquivos legados (uns 90MB).</li>
            </ol>
        `
        },
        {
            title: "Método 3: Diagnóstico Cirúrgico com Dependency Walker (Avançado)",
            content: `
            <p class="mb-4 text-gray-300">Se nada funcionou, precisamos saber EXATAMENTE qual arquivo está quebrado. Para isso, usamos uma ferramenta de engenharia reversa chamada <strong>Dependency Walker</strong> (ou a versão moderna "Dependencies" do lucasg no GitHub).</p>
            
            <ol class="space-y-4 text-gray-300 list-decimal list-inside ml-4">
                <li>Baixe o programa <strong>Dependencies</strong> (gratuito e open source).</li>
                <li>Abra o programa e arraste o executável do jogo (ex: <code>GTA5.exe</code>) para dentro dele.</li>
                <li>Ele vai mostrar uma árvore hierárquica de todas as DLLs que o jogo precisa.</li>
                <li>Procure por DLLs marcadas em <strong>VERMELHO</strong>.</li>
                <li>Geralmente você verá algo como <code>XINPUT1_3.DLL</code> ou <code>MSVCP140.DLL</code> em vermelho, indicando que a arquitetura (x86/x64) não bate com o jogo.</li>
                <li>Agora que você sabe o nome exato do culpado, vá na pasta System32 (e SysWOW64) e delete esse arquivo específico.</li>
                <li>Depois, repare a instalação do Visual C++ ou DirectX correspondente.</li>
            </ol>
        `
        },
        {
            title: "Perguntas Frequentes (FAQ)",
            content: `
            <div class="space-y-6 mt-8">
                <div>
                    <h4 class="text-white font-bold text-lg mb-2">Formatar o PC resolve?</h4>
                    <p class="text-gray-300">Sim, resolve 100%. Mas é como demolir a casa porque a lâmpada queimou. Usando os passos acima (especialmente o Método 1), você resolve em 5 minutos sem perder seus dados.</p>
                </div>
                <hr class="border-gray-800" />
                <div>
                    <h4 class="text-white font-bold text-lg mb-2">O erro continua aparecendo no arquivo MSVCR100.dll</h4>
                    <p class="text-gray-300">MSVCR100 refere-se especificamente ao Visual C++ 2010. Tente desinstalar manualmente apenas essa versão no Painel de Controle e baixe o instalador do 2010 SP1 (x86 e x64) no site da Microsoft.</p>
                </div>
            </div>
        `
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="20 min"
            difficultyLevel="Intermediário"
            contentSections={contentSections}
            summaryTable={summaryTable}
        />
    );
}
