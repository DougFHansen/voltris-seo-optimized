import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'gta-v-otimizar-fps-pc-fraco',
  title: "GTA V e FiveM (2026): Guia Definitivo de FPS para PC Fraco e High-End",
  description: "Aprenda a otimizar o GTA V e FiveM. Configurações ocultas de sombras, como limpar o cache do FiveM, ajustes de XML e densidade de população.",
  category: 'jogos',
  difficulty: 'Intermediário',
  time: '45 min'
};

const title = "GTA V & FiveM Optimization (2026): FPS, Texturas e Cidades Pesadas";
const description = "Rodar GTA V é fácil. Rodar FiveM em uma cidade com 500 mods e 300 players é outra história. Este guia foca em estabilidade para Roleplay.";

const keywords = [
  'gta v fps boost fivem 2026',
  'como limpar cache fivem completo',
  'melhores configurações graficas fivem pvp',
  'gta v travando texturas sumindo fix',
  'extended texture budget fivem barra verde',
  'sombra gta v muito pesado',
  'densidade demografica gta v cpu',
  'commandline.txt gta v comandos',
  'fivem citizenfx.ini otimizacao',
  'nbp citizen gta 5 graphics'
];

export const metadata: Metadata = createGuideMetadata('gta-v-otimizar-fps-pc-fraco', title, description, keywords);

export default function GTAGuide() {
  const summaryTable = [
    { label: "Texturas", value: "Normal/High" },
    { label: "Sombras", value: "Sharp (Nítido)" },
    { label: "Grama", value: "Normal (FPS Killer)" },
    { label: "Reflexos MS", value: "Off" },
    { label: "Post FX", value: "Normal" },
    { label: "FiveM", value: "Cache Limpo" },
    { label: "V-Sync", value: "Metade (Se fraco)" }
  ];

  const contentSections = [
    {
      title: "Introdução: FiveM vs GTA Online",
      content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O FiveM é uma plataforma pesada. Ele carrega assets customizados (carros, roupas) que não foram otimizados pela Rockstar. Por isso, um PC que roda GTA V no Ultra pode chorar no FiveM.
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed">
            Neste guia, vamos focar em configurações que lidam com o excesso de polígonos de mods mal feitos, salvando sua VRAM.
        </p>
      `
    },
    {
      title: "Capítulo 1: Configurações Gráficas Críticas",
      content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Grass Quality (Grama)</h4>
                <p class="text-white font-mono text-sm mb-2">Recomendado: <span class="text-emerald-400">Normal</span></p>
                <p class="text-gray-400 text-xs">A grama no Ultra é o maior devorador de FPS em áreas rurais (Sandy Shores). Coloque em Normal e ganhe 20 FPS instantaneamente.</p>
            </div>
            
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Post FX</h4>
                <p class="text-white font-mono text-sm mb-2">Recomendado: <span class="text-emerald-400">Normal</span></p>
                <p class="text-gray-400 text-xs">Controla Bloom, Motion Blur e HDR. No Ultra, pesa muito. No Normal, o jogo fica mais limpo e leve.</p>
            </div>

             <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Extended Texture Budget (A barra)</h4>
                <p class="text-white font-mono text-sm mb-2">Recomendado: <span class="text-emerald-400">Metade da VRAM</span></p>
                <p class="text-gray-400 text-xs">No menu gráfico avançado. Aumente isso até a barra de uso de VRAM ficar verde/amarela. Se ficar vermelha, você terá "texturas sumindo" (cidade invisível).</p>
            </div>
        </div>
      `
    },
    {
      title: "Capítulo 2: Sombras e Reflexos",
      content: `
        <table class="w-full text-sm text-left text-gray-400">
            <tbody>
                <tr class="border-b border-gray-700">
                    <td class="py-2 font-bold">Shadow Quality</td>
                    <td class="py-2 text-yellow-400">Normal/High</td>
                    <td class="py-2">Very High usa "PCSS" ou "Nvidia sombras" que são pesadíssimas. Use "Sharp" (Nítido).</td>
                </tr>
                <tr class="border-b border-gray-700">
                    <td class="py-2 font-bold">Reflection MSAA</td>
                    <td class="py-2 text-red-400">Off</td>
                    <td class="py-2">Antialiasing nos reflexos. Totalmente inútil e pesado.</td>
                </tr>
                <tr class="border-b border-gray-700">
                    <td class="py-2 font-bold">Water Quality</td>
                    <td class="py-2 text-emerald-400">High</td>
                    <td class="py-2">Normal deixa a água feia, High é otimizado. Very High simula física de ondas complexa (pesado).</td>
                </tr>
            </tbody>
        </table>
      `
    },
    {
      title: "Capítulo 3: FiveM - Limpeza de Cache",
      content: `
        <p class="mb-4 text-gray-300">
            Se você vê carros piscando, roupas bugadas ou crasha ao entrar no servidor.
        </p>
        <ol class="list-decimal list-inside text-gray-300 text-sm space-y-2">
            <li>Feche o FiveM.</li>
            <li>Vá em <code>AppData\\Local\\FiveM\\FiveM.app\\data</code>.</li>
            <li>Apague as pastas <code>cache</code>, <code>server-cache</code> e <code>server-cache-priv</code>.</li>
            <li><strong>NÃO APAGUE</strong> a pasta <code>game-storage</code> (são os arquivos base do GTA, 50GB+).</li>
            <li>Reinicie o FiveM.</li>
        </ol>
      `
    }
  ];

  const advancedContentSections = [
    {
      title: "Capítulo 4: Densidade e Variedade (CPU)",
      content: `
        <p class="mb-4 text-gray-300">
            O GTA V usa muito a CPU para calcular a IA dos NPCs e carros.
            <br/>- <strong>Population Density:</strong> 50% ou menos.
            <br/>- <strong>Population Variety:</strong> 0% (Baixo). Isso faz o jogo carregar menos modelos de carros diferentes na RAM, reduzindo stutter.
            <br/>- <strong>Distance Scaling:</strong> 100%. (Não reduza isso ou prédios vão aparecer do nada na sua cara).
        </p>
      `
    },
    {
      title: "Capítulo 5: Tesselation e DirectX",
      content: `
        <p class="mb-4 text-gray-300">
            - <strong>DirectX Version:</strong> Use DX11. O DX10/10.1 é legado e tem bugs visuais.
            - <strong>Tessellation:</strong> Normal ou Off. Apenas adiciona relevo em árvores e pedras. Em cidades RP, é inútil.
        </p>
      `
    },
    {
      title: "Capítulo 6: Commandline.txt",
      content: `
        <p class="mb-4 text-gray-300">
            Crie um arquivo <code>commandline.txt</code> na pasta raiz do GTA V com:
        </p>
        <code class="block bg-black/50 p-3 rounded text-green-400 font-mono text-sm">
            -ignoreDifferentVideoCard
            -disableHyperthreading
            -high
        </code>
        <p class="mt-2 text-xs text-gray-400">
            Nota: <code>-disableHyperthreading</code> ajuda em CPUs Intel antigas (i5/i7 de 4ª a 9ª gen). Em Ryzens modernos, não use.
        </p>
      `
    },
    {
      title: "Capítulo 7: GTA Settings.xml (Ajuste Fino)",
      content: `
        <p class="mb-4 text-gray-300">
            Em <code>Documentos\\Rockstar Games\\GTA V\\settings.xml</code>.
            <br/>Você pode desligar sombras completamente mudando <code>ShadowQuality value="0"</code> (O menu só deixa ir até 1).
            <br/>Isso dá um boost gigante de FPS, mas o jogo fica feio (sem sombras). Use apenas em PCs "batata".
        </p>
      `
    }
  ];

  const additionalContentSections = [
    {
      title: "Capítulo 8: O Problema das Cidades Otimizadas",
      content: `
            <p class="mb-4 text-gray-300">
                Muitos servidores de RP usam "Cidades FPS Boost" que removem props (lixo, postes, neblina).
                <br/>Se você tem FPS baixo, procure servidores que oferecem "Modo Batata" ou "FPS Mode" no comando /fps dentro do jogo.
            </p>
            `
    },
    {
      title: "Capítulo 9: Gráficos PVP (No Props)",
      content: `
            <p class="mb-4 text-gray-300">
                Para PVP, você quer ver através de arbustos e remover efeitos de fumaça.
                <br/>Instale mods gráficos como <strong>NVE (Versão Low)</strong> ou <strong>CitzenFX Vision</strong> que limpam a atmosfera e removem a neblina de distância, melhorando a visibilidade de inimigos.
            </p>
            `
    },
    {
      title: "Capítulo 10: Limite de FPS (Engine Cap)",
      content: `
            <p class="mb-4 text-gray-300">
                A engine do GTA V (RAGE) começa a bugar física acima de 188 FPS.
                <br/>Carros ficam mais lentos ou voam.
                <br/>Se você tem um PC monstro, limite o FPS em 160-180 para evitar bugs de física no RP.
            </p>
            `
    }
  ];

  const faqItems = [
    {
      question: "FiveM está usando 100% da CPU?",
      answer: "Isso é 'normal' em servidores pesados devido aos scripts Lua mal otimizados. A única solução é fechar tudo em background (Chrome, Discord Overlay) e dar prioridade Alta ao processo FiveM no Gerenciador de Tarefas."
    },
    {
      question: "Texturas sumindo (Cidade Invisível)?",
      answer: "Isso é gargalo de carregamento. Sua CPU ou HD não consegue enviar as texturas para a GPU a tempo. Solução: Instale no SSD (Obrigatório) e defina 'Texture Quality' para Normal com 'Extended Texture Budget' aumentado."
    },
    {
      question: "VSync no GTA?",
      answer: "O VSync do GTA V é ruim (input lag alto). Deixe desligado no jogo e ligue no Painel Nvidia se precisar."
    }
  ];

  const externalReferences = [
    { name: "FiveM Fórum (Suporte Técnico)", url: "https://forum.cfx.re/" },
    { name: "GTA V Mods (Gráficos)", url: "https://www.gta5-mods.com/" },
    { name: "NaturalVision Evolved (Graphic Mod)", url: "https://www.razedmods.com/gta-v" }
  ];

  const relatedGuides = [
    {
      href: "/guias/otimizacao-ssd-windows-11",
      title: "SSD Setup",
      description: "Essencial para não cair no limbo (chão sumir)."
    },
    {
      href: "/guias/nvidia-painel-controle-melhores-configuracoes",
      title: "Nvidia Guide",
      description: "Configure VSync corretamente."
    },
    {
      href: "/guias/como-escolher-fonte-pc-gamer",
      title: "Hardware",
      description: "GTA V consome muita energia da GPU."
    }
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="45 min"
      difficultyLevel="Intermediário"
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
