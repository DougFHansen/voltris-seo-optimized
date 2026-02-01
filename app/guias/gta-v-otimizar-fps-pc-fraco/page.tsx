import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "GTA V: Otimização Extrema para PC Fraco e Notebooks (30 para 60 FPS)";
const description = "Seu PC não tem placa de vídeo? Aprenda a editar os arquivos ocultos do GTA V para remover sombras, reflexos e rodar o jogo liso em Intel HD Graphics ou hardware antigo.";
const keywords = ['gta v pc fraco', 'gta v settings.xml download', 'tirar sombras gta v', 'commandline gta v fps', 'gta 5 intel hd graphics', 'aumentar fps gta v fivem'];

export const metadata: Metadata = createGuideMetadata('gta-v-otimizar-fps-pc-fraco', title, description, keywords);

export default function GTA5Guide() {
    const summaryTable = [
        { label: "Ganho Estimado", value: "+35 FPS" },
        { label: "Risco de Ban", value: "Zero (No Online)" },
        { label: "Arquivo Chave", value: "settings.xml" },
        { label: "Qualidade", value: "Baixíssima" }
    ];

    const contentSections = [
        {
            title: "Introdução: É possível rodar GTA V sem Placa de Vídeo?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
          Sim. O GTA V é um dos jogos mais bem otimizados da história. Sua engine (RAGE) é incrivelmente escalável. O problema é que o menu de configurações dentro do jogo tem um limite mínimo. Ele não deixa você desligar as sombras completamente, por exemplo.
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed">
          Neste guia, vamos "quebrar" esses limites editando manualmente o arquivo de configuração do jogo para desativar efeitos pesados que consomem sua CPU e GPU integrada. Este método funciona para o Modo História, GTA Online e FiveM.
        </p>
      `,
            subsections: []
        },
        {
            title: "Passo 1: O Arquivo Secreto (settings.xml)",
            content: `
        <p class="mb-4 text-gray-300">
          Todas as configurações gráficas do GTA V ficam salvas em um arquivo de texto simples. Vamos editá-lo.
        </p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4 mb-6 bg-gray-900/50 p-6 rounded-xl border border-gray-800">
            <li>Vá em <strong>Documentos</strong> > <strong>Rockstar Games</strong> > <strong>GTA V</strong>.</li>
            <li>Encontre o arquivo <code>settings.xml</code>.</li>
            <li>Faça uma cópia dele (backup) caso algo dê errado.</li>
            <li>Clique com botão direito no original > <strong>Abrir com</strong> > <strong>Bloco de Notas</strong>.</li>
        </ol>

        <h3 class="text-xl text-[#31A8FF] font-bold mt-8 mb-4">O que mudar exatamente?</h3>
        <p class="text-gray-300 mb-4">Use <strong>Ctrl + F</strong> para encontrar as linhas abaixo e troque o valor <span class="text-yellow-400">value="x"</span> pelo número indicado:</p>

        <div class="space-y-4">
            <div class="bg-gray-800 p-4 rounded border-l-4 border-red-500">
                <code class="block text-green-400 font-bold text-lg mb-2">&lt;ShadowQuality value="0" /&gt;</code>
                <p class="text-gray-300 text-sm">Desliga completamente o processamento de sombras dinâmicas. O jogo fica "feio" (sem profundidade), mas libera uns 20% de performance da CPU.</p>
            </div>
            
            <div class="bg-gray-800 p-4 rounded border-l-4 border-red-500">
                <code class="block text-green-400 font-bold text-lg mb-2">&lt;ReflectionQuality value="0" /&gt;</code>
                <p class="text-gray-300 text-sm">Remove reflexos em carros, janelas e poças. Essencial para Intel HD Graphics.</p>
            </div>

            <div class="bg-gray-800 p-4 rounded border-l-4 border-red-500">
                <code class="block text-green-400 font-bold text-lg mb-2">&lt;GrassQuality value="0" /&gt;</code>
                <p class="text-gray-300 text-sm">Remove a vegetação rasteira. Em áreas de floresta (Norte do mapa), isso evita que o FPS caia para 10.</p>
            </div>
            
             <div class="bg-gray-800 p-4 rounded border-l-4 border-yellow-500">
                <code class="block text-green-400 font-bold text-lg mb-2">&lt;WaterQuality value="0" /&gt;</code>
                <p class="text-gray-300 text-sm">Água no mínimo. O mar fica parecendo uma gelatina azul sólida, mas para de travar perto da praia.</p>
            </div>
        </div>
        
        <p class="mt-6 text-gray-300 font-bold text-center border p-4 border-yellow-500 rounded bg-yellow-900/20 text-yellow-200">
            IMPORTANTE: Depois de salvar, clique com o botão direito no arquivo settings.xml > Propriedades > Marque "Somente Leitura". Se não fizer isso, o GTA vai detectar que os gráficos estão "baixos demais" e restaurar tudo para o Médio automaticamente.
        </p>
      `,
            subsections: []
        },
        {
            title: "Passo 2: Arquivo commandline.txt",
            content: `
        <p class="mb-4 text-gray-300">
            Podemos forçar parâmetros de inicialização criando um arquivo na pasta raiz do jogo.
        </p>
        <ol class="list-decimal list-inside text-gray-300 space-y-2 ml-4">
            <li>Vá onde o GTA V está instalado (Steam/Epic/Pasta do Jogo).</li>
            <li>Crie um arquivo de texto chamado <code>commandline.txt</code>.</li>
            <li>Cole o seguinte conteúdo dentro dele:</li>
        </ol>
        <code class="block bg-[#121218] p-4 my-4 text-green-400 font-mono text-sm leading-loose">
            -ignoreDifferentVideoCard
            <br/>-disableHyperthreading
            <br/>-frameLimit 0
            <br/>-height 720
            <br/>-width 1280
        </code>
        <p class="text-gray-300 mt-2 text-sm">
            Nota: <code>-disableHyperthreading</code> ajuda em alguns processadores i5/i7 antigos, mas pode piorar em i3 de 2 núcleos. Teste com e sem.
        </p>
      `
        },
        {
            title: "Passo 3: Aumentando a Memória Virtual (Pagefile)",
            content: `
            <p class="mb-4 text-gray-300">
                GTA V consome muita RAM. Se você tem 4GB ou 8GB, o jogo vai fechar sozinho ou travar muito. Precisamos usar seu HD/SSD como RAM extra.
            </p>
            <ol class="list-decimal list-inside text-gray-300 space-y-2 ml-4">
                <li>Pesquise no Windows: <strong>"Exibir configurações avançadas do sistema"</strong>.</li>
                <li>Aba Avançado > Desempenho (Configurações) > Aba Avançado.</li>
                <li>Em Memória Virtual, clique em Alterar.</li>
                <li>Desmarque "Gerenciar automaticamente".</li>
                <li>Selecione seu SSD, clique em Tamanho Personalizado.</li>
                <li>Inicial: <strong>8000</strong> (8GB). Máximo: <strong>16000</strong> (16GB).</li>
                <li>Clique em Definir > OK > Reinicie o PC.</li>
            </ol>
            <p class="text-gray-300 mt-2 text-sm italic">
                Isso não substitui RAM real (é muito mais lento), mas impede o jogo de fechar por falta de memória.
            </p>
        `
        },
        {
            title: "Perguntas Frequentes (FAQ)",
            content: `
            <div class="space-y-6 mt-8">
                <div>
                    <h4 class="text-white font-bold text-lg mb-2">Posso ser banido do GTA Online por isso?</h4>
                    <p class="text-gray-300">Não. A Rockstar permite edição do <code>settings.xml</code> e <code>commandline.txt</code>. Você só seria banido se injetasse DLLs ou usasse Mods (arquivos .rpf modificados) dentro do modo Online.</p>
                </div>
                <hr class="border-gray-800" />
                <div>
                    <h4 class="text-white font-bold text-lg mb-2">As texturas estão sumindo (chão invisível). O que fazer?</h4>
                    <p class="text-gray-300">Isso é gargalo de CPU ou HD lento. Tente limitar o FPS em 30 (use o RivaTuner) ou dê prioridade Alta ao processo do GTA5.exe no Gerenciador de Tarefas. Isso dá tempo ao processador para carregar o mapa.</p>
                </div>
                <hr class="border-gray-800" />
                <div>
                    <h4 class="text-white font-bold text-lg mb-2">FiveM roda com essas configs?</h4>
                    <p class="text-gray-300">Sim! O FiveM herda as configurações do GTA base. Se você otimizar o GTA V, o FiveM também voa.</p>
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
