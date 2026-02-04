import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Como Alocar mais Memória RAM no Minecraft (Launcher Original e TLauncher)";
const description = "Seu Minecraft está travando ou dando erro de 'Out of Memory'? Aprenda a alocar mais RAM para o jogo e melhore o carregamento de chunks em 2026.";
const keywords = [
    'como alocar mais memoria ram no minecraft 2026 tutorial',
    'aumentar ram minecraft launcher original passo a passo',
    'tlauncher como alocar mais ram tutorial 2026',
    'minecraft erro out of memory como resolver windows 11',
    'argumentos de inicialização java minecraft fps boost'
];

export const metadata: Metadata = createGuideMetadata('minecraft-alocar-mais-ram', title, description, keywords);

export default function MinecraftRAMGuide() {
    const summaryTable = [
        { label: "Onde mudar", value: "Argumentos JVM (Launcher)" },
        { label: "Valor Recomendado", value: "4GB a 8GB (Depende dos Mods)" },
        { label: "Alerta", value: "Nunca aloque mais de 50% da sua RAM total" },
        { label: "Dificuldade", value: "Fácil" }
    ];

    const contentSections = [
        {
            title: "Por que o Minecraft precisa de RAM?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Diferente de outros jogos, o **Minecraft** roda sobre o Java. Ele cria uma "caixa" de memória virtual onde guarda todas as informações dos blocos (chunks), entidades e mods. Por padrão, o Minecraft vem configurado para usar apenas 2GB de RAM. Em 2026, com texturas em alta definição e mods pesados, 2GB não são suficientes nem para o jogo básico carregar o mapa sem travar.
        </p>
      `
        },
        {
            title: "1. No Launcher Original (Minecraft Java Edition)",
            content: `
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Abra o Launcher e vá na aba <strong>Instalações</strong>.</li>
            <li>Passe o mouse sobre a versão que você joga e clique nos <strong>três pontinhos (...) > Editar</strong>.</li>
            <li>Clique em 'Mais Opções' na parte inferior.</li>
            <li>No campo 'Argumentos JVM', você verá algo como <code>-Xmx2G</code>.</li>
            <li>Mude o '2G' para o valor desejado. Ex: <strong>-Xmx4G</strong> para 4GB ou <strong>-Xmx8G</strong> para 8GB.</li>
            <li>Salve e inicie o jogo.</li>
        </ol>
      `
        },
        {
            title: "2. No TLauncher (Alternativo)",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Simplicidade:</h4>
            <p class="text-sm text-gray-300">
                1. Abra o TLauncher e clique na <strong>Engrenagem (Configurações)</strong> no canto inferior direito. <br/>
                2. No menu lateral, selecione 'Configurações'. <br/>
                3. Você verá uma barra de rolagem chamada <strong>'Alocação de Memória'</strong>. <br/>
                4. Arraste para o valor desejado (ex: 4096MB para 4GB). <br/>
                5. Clique em Salvar.
            </p>
        </div>
      `
        },
        {
            title: "3. O Erro do Excesso: Não exagere!",
            content: `
        <p class="mb-4 text-gray-300">
            Muitos jogadores pensam: "Se eu tenho 16GB, vou colocar 14GB no Minecraft". 
            <br/><br/><strong>Não faça isso!</strong> Se você alocar RAM demais, o Windows e o próprio Java (através do <i>Garbage Collector</i>) terão dificuldades para gerenciar a limpeza de dados, o que causa travadas gigantes (Lags de 1 segundo) a cada 2 minutos. O ideal para 2026 é manter entre 4GB e 6GB para o jogo base, subindo para 8GB apenas em modpacks gigantes com centenas de mods.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/minecraft-lento-como-ganhar-fps",
            title: "Minecraft Lento",
            description: "Dicas de FPS além da memória RAM."
        },
        {
            href: "/guias/minecraft-aumentar-fps-fabric-sodium",
            title: "Fabric + Sodium",
            description: "O combo de performance definitivo em 2026."
        },
        {
            href: "/guias/limpar-memoria-ram-windows",
            title: "Limpar RAM",
            description: "Libere espaço antes de abrir o Mine."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="10 min"
            difficultyLevel="Iniciante"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
