import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Valorant: Guia Definitivo e Completo para Reduzir Input Lag e Latência (2026)";
const description = "Seu jogo parece pesado? Tiros não registram? Este é o guia mais completo da internet para otimizar Valorant, Windows, NVIDIA e Mouse para a menor latência possível.";
const keywords = ['valorant input lag', 'reduzir latencia valorant', 'nvidia reflex on vs boost', 'raw input buffer valorant', 'otimizacao mouse valorant', 'fps valorant', 'latencia do sistema', 'otimizacao windows jogos'];

export const metadata: Metadata = createGuideMetadata('valorant-reduzir-input-lag', title, description, keywords);

export default function ValorantGuide() {
    const contentSections = [
        {
            title: "Introdução: Por que milissegundos importam?",
            content: `
          <p class="mb-6 text-gray-300 leading-relaxed">
            Em jogos de tiro tático (TacFPS) como Valorant, a diferença entre a vitória e a derrota é medida em milissegundos. Muitas vezes, você sente que atirou primeiro, mas morreu. Isso geralmente não é culpa dos seus reflexos, mas sim da <strong>Latência do Sistema (Input Lag)</strong>.
          </p>
          <p class="mb-6 text-gray-300 leading-relaxed">
            Input Lag é o tempo total que leva desde o momento que você clica no mouse até o momento em que o pixel muda na tela (Muzzle Flash). Se esse tempo for alto (acima de 20ms), seu cérebro está reagindo ao passado, não ao presente. Você está, literalmente, jogando com delay.
          </p>
          <p class="mb-6 text-gray-300 leading-relaxed">
            Neste guia extenso, vamos cobrir TODAS as camadas de otimização: Configurações do Jogo, Otimizações do Windows, Painel NVIDIA, Ajustes de BIOS e Periféricos. Prepare-se, pois vamos transformar seu PC em uma máquina de competição.
          </p>
        `,
            subsections: []
        },
        {
            title: "Capítulo 1: Configurações Críticas In-Game",
            content: `
        <p class="mb-6 text-gray-300">Vamos começar pelo básico: o menu do próprio jogo. Muitas configurações vêm ativadas por padrão para deixar o jogo "bonito", mas adicionam atraso.</p>
        
        <h3 class="text-xl text-[#31A8FF] font-bold mt-8 mb-4">1.1 NVIDIA Reflex Low Latency</h3>
        <p class="text-gray-300 mb-4">Esta é, sem dúvida, a configuração mais impactante. O Reflex sincroniza a CPU e a GPU para que a placa de vídeo não crie uma "fila" de quadros pré-renderizados.</p>
        <ul class="list-none space-y-4 mb-6">
            <li class="bg-gray-800/50 p-4 rounded border-l-4 border-gray-600">
                <strong class="text-white block mb-1">Desligado</strong>
                <span class="text-gray-400">O jogo permite que a CPU envie frames mais rápido do que a GPU consegue processar, criando "buffer". Resultado: Alto FPS, mas Latência alta.</span>
            </li>
            <li class="bg-gray-800/50 p-4 rounded border-l-4 border-blue-500">
                <strong class="text-white block mb-1">Ligado (On)</strong>
                <span class="text-gray-400">Obrigatório. Elimina a fila de pré-renderização. Reduz drasticamente o input lag em cenários onde a GPU é o gargalo.</span>
            </li>
            <li class="bg-gray-800/50 p-4 rounded border-l-4 border-[#31A8FF]">
                <strong class="text-white block mb-1">Ligado + Boost</strong>
                <span class="text-gray-400">Além de ligar o Reflex, força sua GPU a rodar no clock máximo o tempo todo, mesmo em cenas leves. Isso impede micro-travadas (stutters) quando a ação explode na tela. <strong>Recomendado para todos os PCs desktop.</strong> (Em notebooks, pode aumentar o calor).</span>
            </li>
        </ul>

        <h3 class="text-xl text-[#31A8FF] font-bold mt-8 mb-4">1.2 Raw Input Buffer [Beta]</h3>
        <p class="text-gray-300 mb-4">Antigamente, o Valorant dependia do Windows para ler o movimento do mouse. Isso era ruim.</p>
        <p class="text-gray-300 mb-4">
            Se você usa um mouse moderno com <strong>Polling Rate de 1000Hz, 4000Hz ou 8000Hz</strong>, você PRECISA ativar essa opção. O <em>Raw Input Buffer</em> permite que o Valorant leia os dados brutos direto da porta USB, ignorando as camadas de processamento do Windows que adicionam atraso e inconsistência.
        </p>

        <h3 class="text-xl text-[#31A8FF] font-bold mt-8 mb-4">1.3 Configurações de Vídeo</h3>
        <p class="text-gray-300 mb-4">Gráficos bonitos = Processamento extra = Latência.</p>
        <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4">
            <li><strong>Modo de Exibição:</strong> <span class="text-green-400">Tela Cheia (Fullscreen)</span>. Jamais use Janela ou Janela em Tela Cheia, pois isso força o <em>Desktop Window Manager</em> (DWM) do Windows a processar cada frame, adicionando V-Sync forçado e input lag.</li>
            <li><strong>Resolução:</strong> A nativa do seu monitor (ex: 1920x1080). Baixar a resolução aumenta o FPS, mas não necessariamente reduz a latência do sistema se sua GPU já estiver folgada.</li>
            <li><strong>Limitador de FPS:</strong> Desligue todos. Deixe o FPS solto. Quanto maior o FPS, menor o tempo entre um quadro e outro, e menor o input lag (mesmo que seu monitor seja 60Hz).</li>
        </ul>
      `,
            subsections: []
        },
        {
            title: "Capítulo 2: Otimizações do Windows para Mouse",
            content: `
            <p class="mb-6 text-gray-300">O Windows foi feito para escritório, não para eSports. Por padrão, ele tenta "ajudar" seu mouse a chegar nos botões, o que é terrível para mirar.</p>
            
            <h3 class="text-xl text-[#31A8FF] font-bold mt-8 mb-4">2.1 Desativando a Aceleração (EPP)</h3>
            <p class="text-gray-300 mb-4">A "Aceleração de Mouse" faz com que o cursor ande mais se você mover a mão mais rápido. Isso destrói sua memória muscular, pois o mesmo movimento da mão resulta em distâncias diferentes na tela.</p>
            <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4 bg-gray-900/50 p-6 rounded-xl border border-gray-800">
                <li>Pressione <strong>Win + R</strong>, digite <code class="text-yellow-400">main.cpl</code> e dê Enter.</li>
                <li>Vá na aba <strong>Opções de Ponteiro</strong>.</li>
                <li><strong>DESMARQUE</strong> a caixa "Aprimorar precisão do ponteiro".</li>
                <li>Garanta que a velocidade do ponteiro esteja no risquinho do meio (6/11). Isso garante movimento 1:1 pixel perfect.</li>
            </ol>
        `
        },
        {
            title: "Capítulo 3: Otimizações de Arquivo e Executável",
            content: `
           <p class="mb-6 text-gray-300">Podemos forçar o Windows a tratar o Valorant como prioridade absoluta, ignorando desenhadores de interface e economias de energia.</p>
           
           <h3 class="text-xl text-[#31A8FF] font-bold mt-8 mb-4">3.1 Desabilitar Otimizações de Tela Inteira</h3>
           <p class="text-gray-300 mb-4">
             Apesar do nome, as "Otimizações de Tela Inteira" do Windows 10/11 muitas vezes criam uma sobreposição híbrida que causa input lag. Vamos desativá-las no arquivo raiz.
           </p>
           <ol class="list-decimal list-inside text-gray-300 space-y-2 ml-4 mb-6">
             <li>Navegue até: <code>C:\\Riot Games\\VALORANT\\live\\ShooterGame\\Binaries\\Win64</code></li>
             <li>Encontre o arquivo <strong>VALORANT-Win64-Shipping.exe</strong> (Este é o jogo real, não o atalho da área de trabalho).</li>
             <li>Clique direito > <strong>Propriedades</strong>.</li>
             <li>Vá na aba <strong>Compatibilidade</strong>.</li>
             <li>Marque a caixa: <strong>[x] Desabilitar otimizações de tela inteira</strong>.</li>
             <li>Clique em <strong>Alterar configurações de DPI alto</strong>.</li>
             <li>Marque a caixa inferior: <strong>[x] Substituir o comportamento de ajuste de DPI</strong>, e selecione "Aplicativo".</li>
             <li>Repita o processo para o arquivo <code>VALORANT.exe</code> na pasta anterior, apenas por garantia.</li>
           </ol>

           <h3 class="text-xl text-[#31A8FF] font-bold mt-8 mb-4">3.2 Modo de Jogo (Game Mode)</h3>
           <p class="text-gray-300 mb-4">
             No passado, o "Game Mode" do Windows era ruim. Hoje, no Windows 11 23H2/24H2, ele é excelente. Ele suspende processos de fundo (como Windows Update e Indexação) enquanto você joga.
           </p>
           <p class="text-gray-300">Vá em Configurações > Jogos > Modo de Jogo e ative-o.</p>
        `
        },
        {
            title: "Capítulo 4: Hardware e BIOS (Avançado)",
            content: `
            <p class="mb-6 text-gray-300">Se você quer extrair até a última gota de performance, precisa ir na BIOS.</p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div class="bg-gray-800 p-6 rounded-xl border-t-4 border-yellow-500">
                    <h4 class="text-white font-bold mb-2">HPET (High Precision Event Timer)</h4>
                    <p class="text-gray-400 text-sm">O HPET é um relógio de alta precisão antigo. Em PCs modernos, ele adiciona latência desnecessária. Desative-o no Gerenciador de Dispositivos (Dispositivos de Sistema) e na BIOS se possível.</p>
                </div>
                <div class="bg-gray-800 p-6 rounded-xl border-t-4 border-yellow-500">
                    <h4 class="text-white font-bold mb-2">C-States (Economia de Energia)</h4>
                    <p class="text-gray-400 text-sm">Na BIOS, os C-States fazem a CPU dormir agressivamente para economizar luz. Desative C-States para que o processador esteja sempre acordado e pronto para processar o clique do mouse instantaneamente.</p>
                </div>
            </div>
        `
        },
        {
            title: "Perguntas Frequentes (FAQ)",
            content: `
            <div class="space-y-6 mt-8">
                <div>
                    <h4 class="text-white font-bold text-lg mb-2">Devo limitar o FPS no Valorant?</h4>
                    <p class="text-gray-300">Não, a menos que seu PC esteja superaquecendo ou você use G-Sync/V-Sync (nesse caso, limite 3 FPS abaixo dos Hz do monitor). Caso contrário, FPS ilimitado = menor input lag.</p>
                </div>
                <hr class="border-gray-800" />
                <div>
                    <h4 class="text-white font-bold text-lg mb-2">Qual a diferença entre NVIDIA Reflex On e Boost?</h4>
                    <p class="text-gray-300">"On" apenas remove a fila de frames. "Boost" remove a fila E impede que a placa de vídeo reduza o clock (MHz) em áreas leves do mapa. Use Boost se puder.</p>
                </div>
                <hr class="border-gray-800" />
                <div>
                    <h4 class="text-white font-bold text-lg mb-2">O que é Polling Rate do mouse?</h4>
                    <p class="text-gray-300">É quantas vezes por segundo o mouse "fala" com o PC. 1000Hz (1ms) é o padrão competitivo. 500Hz (2ms) é mais estável em PCs muito fracos. 125Hz (8ms) é inaceitável para jogos.</p>
                </div>
            </div>
        `
        }
    ];

    const summaryTable = [
        { label: "NVIDIA Reflex", value: "On + Boost" },
        { label: "Raw Input", value: "Ligado" },
        { label: "Tela", value: "Fullscreen Real" },
        { label: "Aceleração Mouse", value: "Desligada" },
        { label: "Otim. Tela Inteira", value: "Desabilitado" },
        { label: "Game Mode", value: "Ligado" }
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
