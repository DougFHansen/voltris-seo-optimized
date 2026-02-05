import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'gta-san-andreas-correcao-grafica',
  title: "GTA San Andreas: Como corrigir Gráficos e Bugs no Windows 10 e 11",
  description: "O GTA San Andreas clássico está bugado no seu PC moderno? Aprenda a instalar o SilentPatch, Widescreen Fix e SkyGfx para ter a melhor experiência defi...",
  category: 'games-fix',
  difficulty: 'Intermediário',
  time: '30 min'
};

const title = "GTA San Andreas 2026: O Guia Definitivo de Restauração Gráfica e Correção de Engine";
const description = "Descubra como transformar o port quebrado do GTA San Andreas (PC) na versão definitiva em 2026. Uma análise técnica exaustiva sobre SilentPatch, SkyGfx, renderização PS2, correção de memória 4GB e texturas HD.";
const keywords = [
    'gta san andreas fix pc 2026',
    'restauração gráfica gta sa completa',
    'silentpatch gta sa analise técnica',
    'skygfx ps2 vs pc renderware',
    'project2dfx lod lights tutorial avançado',
    'gta sa widescreen fix thirteenag config',
    'como instalar mods gta sa corretamente modloader',
    'gta sa crash 0xc0000005 fix 4gb patch',
    'rosa project evolved texturas',
    'reshade gta san andreas preset realista'
];

export const metadata: Metadata = createGuideMetadata('gta-san-andreas-correcao-grafica', title, description, keywords);

export default function GTASAFixGuide() {
    const summaryTable = [
        { label: "Versão Base", value: "GTA SA v1.0 US (Hoodlum Executable)" },
        { label: "API", value: "DirectX 9.0c (Wrappers Suportados)" },
        { label: "Correção de Engine", value: "SilentPatch v1.1 Build 32" },
        { label: "Pipeline Gráfica", value: "SkyGfx 4.2b (Extended)" },
        { label: "Texturas", value: "RoSA Project Evolved (AI Upscale + Manual)" },
        { label: "Iluminação", value: "Project2DFX + SkyGfx Radiosity" },
        { label: "Gerenciamento", value: "ModLoader 0.3.8" },
        { label: "Dificuldade", value: "Expert (Requer atenção aos detalhes)" },
        { label: "Tempo de Leitura", value: "45-60 minutos" }
    ];

    const contentSections = [
        {
            title: "Introdução: A Tragédia do Port de PC e a Renascença do Modding",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
            O lançamento de <strong>Grand Theft Auto: San Andreas</strong> no PC em 2005 foi, ironicamente, um dos momentos mais tristes para a preservação de jogos. Enquanto a versão original de PlayStation 2 (2004) era uma obra-prima técnica que extraía cada gota de performance do console com efeitos visuais únicos, a versão de PC foi um "port" apressado, terceirizado e mal otimizado.
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
            A Rockstar Games desativou pipelines inteiras de renderização. O céu laranja característico do pôr do sol de Los Santos desapareceu, substituído por um filtro cinza genérico. Os reflexos metálicos nos carros, que usavam mapeamento de ambiente dinâmico no PS2, viraram texturas estáticas e sem vida. A vegetação foi reduzida, sombras quebraram, e bugs de física atrelados ao framerate tornaram o jogo instável em computadores modernos.
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
            Em 2026, a situação oficial é ainda pior. A "Definitive Edition" baseada na Unreal Engine falhou em capturar a alma do original, e a versão Steam clássica é injogável sem modificações. Felizmente, a comunidade de engenharia reversa — liderada por heróis como <em>Silent</em>, <em>ThirteenAG</em> e <em>TheHero</em> — desmontou o código do jogo byte por byte para restaurar e superar a glória original.
        </p>
        <p class="mb-8 text-gray-300 leading-relaxed text-lg font-bold">
            Este não é um tutorial simples. É um manifesto técnico de 10 fases sobre como reconstruir o GTA San Andreas para que ele rode em 4K, 60 FPS, com gráficos de última geração, mantendo a direção de arte original intacta.
        </p>
      `
        },
        {
            title: "Fase 1: A Fundação - Downgrade e Preparações do Executável",
            content: `
        <h3 class="text-2xl text-white font-bold mb-4">Por que o Executável v1.0 US é a Pedra Angular</h3>
        <p class="mb-4 text-gray-300 leading-relaxed">
            Antes de qualquer arquivo ser copiado, você precisa entender o conceito de <strong>Memory Offset</strong>. Mods de GTA San Andreas não funcionam apenas substituindo arquivos; eles funcionam injetando código Assembly (ASM) diretamente na memória RAM enquanto o jogo roda (.ASI Plugins).
        </p>
        <p class="mb-4 text-gray-300 leading-relaxed">
            Os desenvolvedores de mods criam seus códigos baseando-se nos endereços de memória da versão <strong>1.0 US Compact</strong> (o famoso executável "Hoodlum" de 14.383.616 bytes ou sua versão compacta de 5.8MB). As versões Steam, Rockstar Launcher e Windows Store possuem executáveis criptografados ou recompilados com endereços de memória totalmente diferentes. Tentar rodar um mod moderno na versão Steam é como tentar abrir uma porta usando uma chave feita para outra fechadura: o jogo vai crashar instantaneamente.
        </p>
        
        <h3 class="text-2xl text-white font-bold mb-4 mt-8">O Processo de Downgrade Cirúrgico</h3>
        <p class="mb-4 text-gray-300 leading-relaxed">
            Não basta baixar um <code>gta_sa.exe</code> pirata e colar na pasta. A estrutura de dados (arquivos <code>.dat</code>, <code>.ide</code>, <code>.ipl</code> na pasta <code>data/</code>) mudou entre as versões.
        </p>
        <div class="bg-gray-800 p-6 rounded-xl border-l-4 border-blue-500 my-6">
            <h4 class="text-xl text-blue-400 font-bold mb-3">Passo a Passo Técnico:</h4>
            <ol class="list-decimal list-inside text-gray-300 space-y-4">
                <li><strong>Ferramenta:</strong> Utilize o <a href="#" class="text-blue-300 underline">GTA San Andreas Downgrader</a> (ferramenta open-source). Ele verifica o hash SHA-1 de cada arquivo da sua instalação.</li>
                <li><strong>Limpeza:</strong> O Downgrader move sua instalação atual para uma pasta de backup e baixa os arquivos "Diff" necessários para recriar a versão 1.0 Retail.</li>
                <li><strong>Resultado:</strong> Você terá uma pasta limpa, sem DRM, pronta para aceitar injeção de DLLs.</li>
                <li><strong>Localização:</strong> Mova essa pasta para <code>C:\Games\GTA San Andreas</code>. Nunca deixe em <code>Arquivos de Programas</code>, pois o Windows VirtualStore interfere na leitura de arquivos <code>.ini</code> de configuração.</li>
            </ol>
        </div>
      `
        },
        {
            title: "Fase 2: O Corretor de Engine (SilentPatch)",
            content: `
        <h3 class="text-2xl text-white font-bold mb-4">Engenharia Reversa aplicada a Bugs de 20 anos</h3>
        <p class="mb-4 text-gray-300 leading-relaxed">
            O <strong>SilentPatch</strong> é, sem dúvida, o mod mais essencial já criado para a trilogia GTA. O modder <em>Silent</em> passou anos analisando o código descompilado do jogo para encontrar erros lógicos em C++ deixados pelos programadores originais da Rockstar North.
        </p>
        <p class="mb-4 text-gray-300 leading-relaxed">
            Diferente de mods que mudam o visual, o SilentPatch muda o <strong>comportamento</strong> do código. Ele intercepta chamadas de função defeituosas e as redireciona para rotinas corrigidas dentro do <code>SilentPatchSA.asi</code>.
        </p>
        
        <h4 class="text-xl text-white font-bold mb-3 mt-6">Análise de Bugs Críticos Corrigidos:</h4>
        <ul class="list-disc list-inside text-gray-300 space-y-3 mb-6">
            <li><strong>O Bug dos 14ms (Frame Limiter):</strong> A Rockstar implementou um limitador de quadros impreciso que arredondava o tempo de quadros. Isso fazia o jogo oscilar entre 25 e 26 FPS, causando "stuttering". O SilentPatch introduz um timer de alta precisão, travando o jogo em 30 FPS perfeitos (ou 60, se configurado).</li>
            <li><strong>Mouse Hook Lost:</strong> Um bug clássico onde o mouse parava de funcionar se você desse Alt-Tab. O patch força a reinicialização da interface DirectInput ao retomar o foco da janela.</li>
            <li><strong>NVC (Name Vehicle Colours):</strong> Um erro de array que impedia que vans e caminhões tivessem variações de cores corretas, fazendo todos parecerem iguais.</li>
            <li><strong>Wet Road Reflections:</strong> As estradas molhadas (quando chove) não refletiam luzes corretamente devido a um erro de shader DirectX 9. O patch restaura o efeito de reflexão especular.</li>
        </ul>
      `
        },
        {
            title: "Fase 3: A Matemática da Tela (Widescreen Fix)",
            content: `
        <h3 class="text-2xl text-white font-bold mb-4">Projeção 3D e Aspect Ratio</h3>
        <p class="mb-4 text-gray-300 leading-relaxed">
            Jogos antigos renderizam a cena 3D assumindo uma tela quadrada (4:3). Quando você força 1920x1080 (16:9), a engine simplesmente "estica" essa imagem quadrada para preencher o retângulo, resultando no famoso "CJ Gordo" e miras ovais.
        </p>
        <p class="mb-4 text-gray-300 leading-relaxed">
            O <strong>Widescreen Fix de ThirteenAG</strong> não é uma simples alteração de resolução. Ele hackeia a matriz de projeção da câmera (Camera FOV) diretamente na memória.
        </p>
        
        <div class="bg-gray-900 p-5 rounded-lg border border-gray-700 font-mono text-sm text-green-400 mb-6">
            <h5 class="text-gray-500 mb-2">// GTASA.WidescreenFix.ini Explicado</h5>
            <p>ForceAspectRatio=auto <span class="text-gray-500">; Detecta se seu monitor é 16:9, 21:9 ou 32:9 e ajusta o FOV horizontal automaticamente.</span></p>
            <p>HudWidthScale=1.0 <span class="text-gray-500">; Ajusta a largura dos elementos 2D (Radar, Vida) para que não fiquem esticados.</span></p>
            <p>RestoreCutsceneFOV=1 <span class="text-gray-500">; Um fix crucial. As cutscenes originais davam "zoom in" em widescreen, cortando a cabeça dos personagens. Isso restaura o enquadramento original (Vert- to Hor+).</span></p>
        </div>
      `
        },
        {
            title: "Fase 4: Restaurando a Alma do PS2 (SkyGfx)",
            content: `
        <h3 class="text-2xl text-white font-bold mb-4">Pipeline Gráfica: PC vs Console</h3>
        <p class="mb-4 text-gray-300 leading-relaxed">
            A maior perda da versão PC foi a atmosfera. No PlayStation 2, o GTA SA utilizava o hardware único (Emotion Engine) para criar efeitos de pós-processamento que definiam a identidade visual do jogo. O port de PC desativou tudo isso por incompatibilidade ou preguiça. O mod <strong>SkyGfx</strong> reimplementa a pipeline do PS2 usando shaders HLSL modernos.
        </p>

        <h4 class="text-xl text-yellow-400 font-bold mb-2 mt-6">1. Color Cycle (O Filtro Laranja)</h4>
        <p class="mb-4 text-gray-300 leading-relaxed">
            O PS2 não usava uma iluminação estática. Ele usava tabelas de cores (Lookup Tables) que mudavam a cada "minuto" do jogo. O pôr do sol em Los Santos inundava a tela com um laranja quente e saturado, simulando a poluição de Los Angeles nos anos 90. No PC, isso virou um filtro cinza e sem graça. O SkyGfx restaura as matrizes de mistura de cores originais.
        </p>

        <h4 class="text-xl text-cyan-400 font-bold mb-2 mt-6">2. PS2 Radiosity (Bloom Primitivo)</h4>
        <p class="mb-4 text-gray-300 leading-relaxed">
            Para simular o brilho do sol e luzes de neon, o PS2 renderizava a cena em baixa resolução, aplicava um blur e somava de volta na imagem original. Isso criava um efeito de "sonho" e suavizava os polígonos serrilhados. O SkyGfx recria esse pass de renderização com precisão de pixel.
        </p>

        <h4 class="text-xl text-purple-400 font-bold mb-2 mt-6">3. Matriz de Reflexão de Veículos</h4>
        <p class="mb-4 text-gray-300 leading-relaxed">
            Carros no PC parecem feitos de plástico fosco. No PS2, eles tinham um brilho metálico que reagia ao ambiente. O SkyGfx reativa o "Environment Mapping" do RenderWare, que distorce uma textura de reflexo baseada na geometria (normais) da lataria do carro.
        </p>
      `
        },
        {
            title: "Fase 5: Quebrando Limites (Project2DFX)",
            content: `
        <h3 class="text-2xl text-white font-bold mb-4">LOD Lights e Draw Distance</h3>
        <p class="mb-4 text-gray-300 leading-relaxed">
            O hardware de 2004 tinha apenas 32MB de RAM. Para economizar memória, o jogo parava de desenhar luzes e objetos a poucos metros de distância. O fundo era apenas uma névoa sólida.
        </p>
        <p class="mb-4 text-gray-300 leading-relaxed">
            O <strong>Project2DFX</strong> é um plugin monumental que injeta código para permitir "LOD (Level of Detail) Lights". Ele coloca uma "corona" (ponto de luz) em cada poste, janela e semáforo de todo o mapa de San Andreas.
        </p>
        <div class="bg-indigo-900/20 p-5 rounded-xl border border-indigo-500/30 my-6">
            <h4 class="text-lg text-indigo-300 font-bold mb-2">O Impacto Visual:</h4>
            <p class="text-gray-300">
                Ao subir na torre da Maze Bank em Los Santos à noite, você não vê mais um abismo preto. Você vê as luzes de Las Venturas brilhando no horizonte a quilômetros de distância, e as pontes de San Fierro iluminadas. Isso restaura a escala épica que os desenvolvedores imaginaram, mas não podiam renderizar na época.
            </p>
        </div>
        <p class="mb-4 text-gray-300 leading-relaxed font-bold">
            Requisito Técnico: Para usar o Project2DFX, você PRECISA instalar o "Open Limit Adjuster". O jogo original tem um limite rígido de quantos objetos podem existir. O Limit Adjuster aloca memória dinamicamente para permitir milhares de novas luzes sem crashar.
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Fase 6: Texturas de Alta Definição (RoSA Project Evolved)",
            content: `
        <h3 class="text-2xl text-white font-bold mb-4">Além do Upscale: Fotogrametria e Arte Manual</h3>
        <p class="mb-4 text-gray-300 leading-relaxed">
            Muitos packs de textura apenas passam as imagens originais por um filtro de IA, resultando em visuais estranhos e artefatos. O <strong>RoSA Project Evolved</strong> é diferente. É um esforço comunitário contínuo para substituir texturas manualmente.
        </p>
        <p class="mb-4 text-gray-300 leading-relaxed">
            Os modders procuram as fontes originais das texturas (muitas vezes fotos de bancos de imagem dos anos 90) ou fotografam superfícies reais (asfalto, tijolos, grama) para criar substitutos em 2048x2048 ou 4096x4096.
        </p>
        <p class="mb-4 text-gray-300 leading-relaxed">
            Isso resulta em:
        </p>
        <ul class="list-disc list-inside text-gray-300 space-y-2 mb-6">
            <li>Asfalto com granulação visível de pedras e piche.</li>
            <li>Paredes com texturas de reboco reais, não borrões marrons.</li>
            <li>Placas de lojas legíveis em alta resolução (mantendo as piadas originais da Rockstar).</li>
        </ul>
      `
        },
        {
            title: "Fase 7: Vegetação Volumétrica (Insanity / AI Vegetation)",
            content: `
        <h3 class="text-2xl text-white font-bold mb-4">De "X" para Modelos 3D</h3>
        <p class="mb-4 text-gray-300 leading-relaxed">
            A vegetação original do jogo consiste em dois planos cruzados formando um "X" com uma textura de folha de baixa resolução. Isso funciona de longe, mas é horrível de perto.
        </p>
        <p class="mb-4 text-gray-300 leading-relaxed">
            Mods como <strong>Insanity Vegetation</strong> ou <strong>Behind Space of Realities</strong> substituem os modelos 3D das árvores e palmeiras. Eles aumentam a contagem de polígonos drasticamente, criando troncos redondos (não quadrados) e copas volumosas que projetam sombras complexas.
        </p>
        <p class="mb-4 text-gray-300 leading-relaxed">
            Combinado com o <strong>"Prelighting Fix"</strong> do SilentPatch, essas novas florestas reagem corretamente à luz do dia e aos faróis dos carros, transformando as áreas rurais (Flint County e Back o' Beyond) em experiências imersivas de nova geração.
        </p>
      `
        },
        {
            title: "Fase 8: Gerenciamento de Memória (LargeAddressAware)",
            content: `
        <h3 class="text-2xl text-white font-bold mb-4">O Gargalo dos 2 Gigabytes</h3>
        <p class="mb-4 text-gray-300 leading-relaxed">
            Aqui está a parte mais técnica e crítica para quem instala mods de textura. O executável <code>gta_sa.exe</code> é um aplicativo de <strong>32 bits</strong>. Na arquitetura Windows, apps 32-bit são limitados a endereçar no máximo 2GB de RAM virtual, mesmo que você tenha 64GB de RAM instalada no seu PC Gamer.
        </p>
        <p class="mb-4 text-gray-300 leading-relaxed">
            O jogo original usa cerca de 800MB. Mas ao instalar o RoSA Project (Texturas HD) e o Project2DFX (milhares de luzes), o consumo de RAM dispara. Assim que o jogo tenta alocar o byte número 2.147.483.649, ocorre o Windows mata o processo. É o famoso crash "Out of Memory" ou texturas brancas/piscando.
        </p>
        
        <h4 class="text-xl text-green-400 font-bold mb-3 mt-6">A Solução: The 4GB Patch</h4>
        <p class="mb-4 text-gray-300 leading-relaxed">
            Precisamos modificar o <strong>Cabeçalho PE (Portable Executable)</strong> do arquivo .exe. Existe uma flag chamada <code>IMAGE_FILE_LARGE_ADDRESS_AWARE</code>. Quando ativada, ela diz ao Windows x64: "Ei, eu sei lidar com endereços maiores, me dê até 4GB de espaço".
        </p>
        <div class="bg-gray-800 p-4 rounded-lg border border-gray-600">
            <p class="text-gray-300 font-bold">Procedimento Obrigatório:</p>
            <ol class="list-decimal list-inside text-gray-300 space-y-2 mt-2">
                <li>Baixe a ferramenta <strong>4GB Patch (NTCore)</strong>.</li>
                <li>Execute-a e selecione seu <code>gta_sa.exe</code>.</li>
                <li>A ferramenta fará o backup automático e aplicará a flag no binário.</li>
                <li>Pronto. Seu limite de memória dobrou, permitindo mods gráficos pesados.</li>
            </ol>
        </div>
      `
        },
        {
            title: "Fase 9: Anti-Aliasing e Driver Injection",
            content: `
        <h3 class="text-2xl text-white font-bold mb-4">Forçando Qualidade via Hardware</h3>
        <p class="mb-4 text-gray-300 leading-relaxed">
            O Anti-Aliasing (AA) nativo do GTA SA é uma implementação antiga de MSAA que muitas vezes falha em suavizar bordas de texturas transparentes (como cercas e folhas). Como o jogo roda em DirectX 9, podemos usar o Painel de Controle da GPU para forçar técnicas modernas.
        </p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            <div class="bg-green-900/10 p-5 rounded-xl border border-green-500/20">
                <h5 class="text-green-400 font-bold mb-2">NVIDIA Inspector Profile</h5>
                <ul class="list-disc list-inside text-gray-300 space-y-2 text-sm">
                    <li><strong>Antialiasing Mode:</strong> Override any application setting</li>
                    <li><strong>Setting:</strong> 4x ou 8x Multisampling</li>
                    <li><strong>Transparency Supersampling:</strong> 4x Sparse Grid Supersampling (SGSSAA). <em>Isso é vital para suavizar a grama e grades, que o AA normal ignora.</em></li>
                    <li><strong>Anisotropic Filtering:</strong> 16x (Clamp).</li>
                </ul>
            </div>
            <div class="bg-red-900/10 p-5 rounded-xl border border-red-500/20">
                <h5 class="text-red-400 font-bold mb-2">AMD Adrenalin</h5>
                <ul class="list-disc list-inside text-gray-300 space-y-2 text-sm">
                    <li><strong>Anti-Aliasing Level:</strong> 8xEQ</li>
                    <li><strong>Method:</strong> Supersampling</li>
                    <li><strong>Anisotropic Filtering:</strong> 16x (High Quality)</li>
                    <li><strong>Texture Filtering Quality:</strong> High</li>
                </ul>
            </div>
        </div>
      `
        },
        {
            title: "Fase 10: O Toque Final (ReShade)",
            content: `
        <h3 class="text-2xl text-white font-bold mb-4">Pós-Processamento Cinemático</h3>
        <p class="mb-4 text-gray-300 leading-relaxed">
            Se depois de tudo isso você ainda quiser um visual mais moderno, o <strong>ReShade</strong> é a ferramenta final. Ele se injeta na pipeline do DirectX e aplica efeitos na imagem final, antes de ir para o monitor.
        </p>
        <p class="mb-4 text-gray-300 leading-relaxed">
            Recomendamos um setup minimalista para não destruir a arte original:
        </p>
        <ul class="list-disc list-inside text-gray-300 space-y-3 mb-6">
            <li><strong>MXAO (Marty McFly's Ambient Occlusion):</strong> Cria sombras de contato realistas nos cantos de paredes e objetos, dando volume à geometria simples do jogo.</li>
            <li><strong>Bloom (Efficient):</strong> Adiciona um brilho suave em luzes fortes, simulando lentes de câmera.</li>
            <li><strong>Vibrance:</strong> Um ajuste leve de saturação inteligente que realça cores lavadas sem estourar as cores já vivas.</li>
            <li><strong>Debanding:</strong> Remove o efeito de "faixas" (banding) no céu gradiente, comum em jogos de 8-bit de cor.</li>
        </ul>
      `
        }
    ];

    const faqItems = [
        {
            question: "Posso instalar tudo isso na versão Steam 'The Definitive Edition'?",
            answer: "NÃO. A 'Definitive Edition' (Trilogy Remaster) usa Unreal Engine 4. NENHUM destes mods funciona nela. Este guia é exclusivamente para a versão Clássica (RenderWare), que deve sofrer downgrade para v1.0."
        },
        {
            question: "Meu jogo crasha na tela de carregamento. O que fiz errado?",
            answer: "Crash na tela de load (barra na metade) geralmente é problema de áudio ou mapa. Se você instalou o Project2DFX sem o Open Limit Adjuster, crasha. Se instalou mods de som sem o ModLoader, crasha. Verifique se o 'gta_sa.exe' está na versão 1.0 US e se o 'VorbisFile.dll' (ASI Loader) está presente."
        },
        {
            question: "O ModLoader é realmente necessário?",
            answer: "Sim. Instalar mods substituindo arquivos originais (gta3.img) é uma prática destrutiva e obsoleta. O ModLoader virtualiza o sistema de arquivos. Se um mod der problema, você só deleta a pasta dele e o jogo volta ao normal sem precisar reinstalar tudo. É a única forma profissional de manter o jogo estável."
        },
        {
            question: "Como vejo se o 4GB Patch funcionou?",
            answer: "Não há aviso visual. Mas se você instalar texturas HD e o jogo abrir e rodar por mais de 5 minutos voando rápido pela cidade, funcionou. Sem o patch, o jogo fecha sozinho ao atingir ~1.8GB de uso de RAM no Gerenciador de Tarefas."
        }
    ];

    const externalReferences = [
        { name: "SilentPatch Official (CookiePLMonster)", url: "https://cookieplmonster.github.io/mods/gta-san-andreas/" },
        { name: "Widescreen Fixes Pack (ThirteenAG)", url: "https://thirteenag.github.io/wfp#gtasa" },
        { name: "SkyGfx Source Code & Releases", url: "https://github.com/aap/skygfx" },
        { name: "Project2DFX (LOD Lights)", url: "https://github.com/ThirteenAG/Project2DFX" },
        { name: "RoSA Project Evolved (Textures)", url: "https://www.mixmods.com.br/2021/07/rosa-project-evolved/" },
        { name: "GTA San Andreas Downgrader Tool", url: "https://gtaforums.com/topic/927016-san-andreas-downgrader/" }
    ];

    const relatedGuides = [
        {
            href: "/guias/otimizacao-performance",
            title: "Otimização de FPS",
            description: "Como manter 60 FPS estáveis com gráficos no ultra."
        },
        {
            href: "/guias/erro-0xc00007b-aplicativo-nao-inicializou",
            title: "Erro 0xc00007b",
            description: "Se o jogo nem abrir, comece por aqui."
        },
        {
            href: "/guias/calibrar-cores-monitor",
            title: "Calibrar Monitor",
            description: "Garanta a fidelidade do SkyGfx."
        }
    ];

    const allContentSections = [...contentSections, ...advancedContentSections];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="1 hora"
            difficultyLevel="Expert"
            author="Voltris Technical Archive"
            lastUpdated="2026"
            contentSections={allContentSections}
            summaryTable={summaryTable}
            faqItems={faqItems}
            externalReferences={externalReferences}
            relatedGuides={relatedGuides}
        />
    );
}
