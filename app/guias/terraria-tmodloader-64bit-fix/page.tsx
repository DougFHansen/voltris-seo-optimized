import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "tModLoader 64-bit: Como rodar Terraria com muitos Mods (2026)";
const description = "Seu Terraria trava por falta de memória ao usar mods? Aprenda como instalar e configurar o tModLoader 64-bit para usar toda a sua RAM em 2026.";
const keywords = [
    'tmodloader 64 bit tutorial como instalar 2026',
    'terraria tmodloader out of memory fix guia 2026',
    'como colocar mais ram no terraria tmodloader tutorial',
    'erro de memoria terraria mods como resolver 2026',
    'baixar tmodloader 64 bit para terraria 1.3 e 1.4'
];

export const metadata: Metadata = createGuideMetadata('terraria-tmodloader-64bit-fix', title, description, keywords);

export default function TModLoaderGuide() {
    const summaryTable = [
        { label: "Versão Atual (1.4+)", value: "Nativamente 64-bit (Steam)" },
        { label: "Versão Legacy (1.3)", value: "Requer Patch de Terceiros" },
        { label: "Benefício", value: "Uso de +4GB de RAM (Fim do Out of Memory)" },
        { label: "Dificuldade", value: "Média" }
    ];

    const contentSections = [
        {
            title: "O Limite da Memória no Terraria",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O **tModLoader** é a ferramenta que transforma o Terraria em uma experiência infinita. No entanto, por anos, a versão 1.3.5 era limitada a 32-bit, o que significa que o jogo só conseguia usar 4GB de RAM. Se você instalasse mods gigantes como o **Calamity** ou **Thorium**, o jogo travava com o erro 'Out of Memory'. Em 2026, temos duas situações diferentes dependendo da versão que você joga.
        </p>
      `
        },
        {
            title: "1. tModLoader na Steam (Versão 1.4+)",
            content: `
        <p class="mb-4 text-gray-300">Boas notícias para os jogadores modernos:</p>
        <p class="text-sm text-gray-300">
            Diferente das versões antigas, o tModLoader baixado diretamente da Steam para o Terraria 1.4 (Journey's End) já é **nativamente 64-bit**. Você não precisa instalar patches externos. Se o seu jogo ainda está travando, o problema não é o limite de bits, mas sim a falta de RAM física no seu PC. Certifique-se de que você tem pelo menos 8GB de RAM total no sistema para uma experiência fluida com muitos mods pesados em 2026.
        </p>
      `
        },
        {
            title: "2. tModLoader 64-bit para Legacy (Versão 1.3)",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Para quem usa mods antigos:</h4>
            <p class="text-sm text-gray-300">
                Se você ainda joga a versão 1.3 para usar mods que não foram atualizados: <br/><br/>
                1. Procure pelo 'tModLoader 64-bit' no GitHub (repositório de tModLoader-64bit). <br/>
                2. Baixe o arquivo .zip da versão correspondente à sua. <br/>
                3. Extraia e substitua os arquivos na pasta de instalação do Terraria. <br/>
                4. Execute o arquivo <code>tModLoader64bit.exe</code>. Isso permitirá que o Terraria use 100% da RAM disponível no seu PC, acabando com as quedas de frames e crashes.
            </p>
        </div>
      `
        },
        {
            title: "3. Otimização de Jogabilidade",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>Dica de 2026:</strong> Mesmo com a versão 64-bit, muitos mods causam conflitos. 
            <br/><br/>Se o FPS estiver baixo, desative o mod <strong>'Overhaul'</strong> ou reduza a qualidade da iluminação para 'Trippy' nas configurações de vídeo. Isso tira o peso do processador, permitindo que o jogo rode liso mesmo durante invasões de bosses no modo Survival.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/otimizacao-performance",
            title: "Otimizar Janelas",
            description: "Aumente o FPS em jogos 2D."
        },
        {
            href: "/guias/limpar-memoria-ram-windows",
            title: "Limpar RAM",
            description: "Libere memória para seus mods."
        },
        {
            href: "/guias/minecraft-alocar-mais-ram",
            title: "Alocar RAM",
            description: "Dicas de JVM aplicáveis a outros jogos."
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
