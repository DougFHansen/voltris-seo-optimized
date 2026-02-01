import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Fortnite: Guia Completo do Modo Performance e Otimização para PC Fraco (2026)";
const description = "Seu Fortnite está travando? Aprenda a configurar o Modo Performance (Alpha), ajustar Malhas (Meshes) e editar o arquivo GameUserSettings.ini para dobrar seu FPS.";
const keywords = ['fortnite modo performance', 'aumentar fps fortnite pc fraco', 'fortnite stutters fix', 'malhas moveis fortnite', 'resolucao 3d fortnite', 'otimizar fortnite 2026'];

export const metadata: Metadata = createGuideMetadata('fortnite-modo-performance-pc-fraco', title, description, keywords);

export default function FortniteGuide() {
    const contentSections = [
        {
            title: "Introdução: O que é o Modo Performance?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
          O Fortnite é um jogo pesado por causa da engine Unreal Engine 5 e suas tecnologias como Nanite e Lumen. Para PCs competitivos ou máquinas mais fracas, a Epic Games criou o <strong>Modo Performance (Alpha)</strong>.
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed">
          Este modo sacrifica a beleza visual (sombras, iluminação global, grama) em troca de um ganho massivo de FPS e latência reduzida. Se você joga em um PC sem placa de vídeo dedicada ou quer alcançar 144/240Hz, este modo é obrigatório.
        </p>
      `,
            subsections: []
        },
        {
            title: "Passo 1: Ativando e Configurando o Modo Performance",
            content: `
        <p class="mb-4 text-gray-300">Dentro do jogo, vá em Configurações > Vídeo.</p>
        
        <div class="bg-[#121218] border border-gray-700 p-6 rounded-xl mb-6">
            <h4 class="text-white font-bold mb-4">Configurações Críticas:</h4>
            <ul class="list-disc list-inside text-gray-400 space-y-3">
                <li><strong>Modo de Renderização:</strong> <span class="text-green-400 font-bold">Desempenho (Performance)</span>. Ao selecionar isso, o jogo vai pedir para reiniciar. Reinicie.</li>
                <li><strong>Malhas (Meshes):</strong> <span class="text-yellow-400 font-bold">Baixo (Low)</span>. 
                    <p class="text-sm mt-1 ml-6">Malhas "Altas" são mais bonitas e permitem ver através da construção quando ela está quebrando, mas consomem muito mais memória RAM e VRAM. Para PC fraco, use Baixo (conhecido como "Mobile Builds").</p>
                </li>
                <li><strong>Resolução 3D:</strong> <span class="text-blue-400 font-bold">100% ou inferior</span>.
                    <p class="text-sm mt-1 ml-6">Se mesmo no modo desempenho seu PC trava, baixe a resolução 3D para 70% ou 80%. O jogo ficará borrado, mas muito mais leve.</p>
                </li>
            </ul>
        </div>
      `,
            subsections: []
        },
        {
            title: "Passo 2: Opções do Epic Games Launcher (Economia de Espaço)",
            content: `
        <p class="mb-4 text-gray-300">Você pode remover texturas de alta resolução para deixar o jogo mais leve e carregar mais rápido.</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-2 ml-4">
            <li>Abra o Launcher da Epic Games.</li>
            <li>Vá em <strong>Biblioteca</strong>.</li>
            <li>Clique nos <strong>três pontos (...)</strong> ao lado do Fortnite > <strong>Opções</strong>.</li>
            <li><strong>Desmarque</strong> a caixa: <em>Texturas de Alta Resolução</em> (Isso economiza uns 15GB).</li>
            <li><strong>Desmarque</strong> a caixa: <em>Shaders do DirectX 12</em> (Se você for usar o modo Performance).</li>
            <li><strong>Marque</strong> a caixa: <em>Desativar Streaming de Cosméticos</em>.
                <p class="text-sm text-green-400 mt-1 ml-6">Isso é crucial! Baixa todas as skins para o seu PC. Se não marcar isso, o jogo tenta baixar a skin do inimigo <em>enquanto você atira nele</em>, causando travadas (stutters).</p>
            </li>
        </ol>
      `
        },
        {
            title: "Passo 3: Editando o GameUserSettings.ini (Avançado)",
            content: `
            <p class="mb-4 text-gray-300">Algumas configurações não aparecem no menu. Vamos editar o arquivo manualmente.</p>
            <ol class="list-decimal list-inside text-gray-300 space-y-2 ml-4">
                <li>Pressione <strong>Win + R</strong>, digite <code>%localappdata%</code> e dê Enter.</li>
                <li>Navegue até: <code>FortniteGame > Saved > Config > WindowsClient</code>.</li>
                <li>Abra o arquivo <strong>GameUserSettings.ini</strong>.</li>
                <li>Procure e altere as seguintes linhas:</li>
            </ol>
            
            <div class="space-y-4 mt-6">
                <div class="bg-gray-800 p-3 rounded">
                    <code class="text-green-400 block">bDisableMouseAcceleration=True</code>
                    <p class="text-gray-400 text-sm">Garante que a aceleração do mouse esteja desligada na engine.</p>
                </div>
                <div class="bg-gray-800 p-3 rounded">
                    <code class="text-green-400 block">bShowGrass=False</code>
                    <p class="text-gray-400 text-sm">Desliga a grama (mesmo se o jogo teimar em ligar).</p>
                </div>
                <div class="bg-gray-800 p-3 rounded">
                    <code class="text-green-400 block">RayTracing=False</code>
                    <p class="text-gray-400 text-sm">Garante que nenhum traço de Ray Tracing esteja ativo.</p>
                </div>
            </div>
            <p class="mt-4 text-gray-300">Salve e marque o arquivo como "Somente Leitura" nas propriedades.</p>
        `
        },
        {
            title: "Dica Extra: Limpeza de Cache de Shader",
            content: `
            <p class="text-gray-300 mb-4">Se o Fortnite gagueja (stuttering) muito, seu cache de shader pode estar corrompido.</p>
            <p class="text-gray-300">
                Vá em <code>%localappdata%\\NVIDIA\\DXCache</code> (para placas NVIDIA) ou <code>%localappdata%\\AMD\\DxCache</code> e apague tudo o que conseguir. O jogo vai compilar shaders novos na próxima vez que abrir (a primeira partida vai travar um pouco, depois fica liso).
            </p>
        `
        }
    ];

    const summaryTable = [
        { label: "Modo Render", value: "Desempenho" },
        { label: "Malhas", value: "Baixo (Mobile)" },
        { label: "Texturas HD", value: "Desinstaladas" },
        { label: "Cosméticos", value: "Pré-carregados" }
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
        />
    );
}
