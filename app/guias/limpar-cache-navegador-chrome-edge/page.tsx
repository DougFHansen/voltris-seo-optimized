import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Como Limpar o Cache do Navegador (Chrome, Edge e Firefox)";
const description = "Seus sites estão demorando para carregar ou aparecendo com erro? Aprenda a limpar o cache e os cookies do seu navegador para navegar mais rápido.";
const keywords = [
    'como limpar cache chrome pc tutorial 2026',
    'excluir cookies e cache microsoft edge windows 11',
    'limpar dados de navegação firefox passo a passo',
    'atalho para limpar cache navegador windows',
    'navegador lento como resolver limpeza de cache'
];

export const metadata: Metadata = createGuideMetadata('limpar-cache-navegador-chrome-edge', title, description, keywords);

export default function BrowserCacheGuide() {
    const summaryTable = [
        { label: "Atalho Universal", value: "Ctrl + Shift + Del" },
        { label: "O que limpar", value: "Imagens e arquivos em cache" },
        { label: "Cuidado", value: "Limpar Cookies desloga suas contas" },
        { label: "Dificuldade", value: "Fácil" }
    ];

    const contentSections = [
        {
            title: "Por que limpar o Cache?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O **Cache** é como uma "memória de curto prazo" do seu navegador. Ele guarda logos de sites e fotos para que você não precise baixar tudo de novo cada vez que abre uma página. O problema é que esses arquivos podem ficar velhos (corrompidos), fazendo sites como o Facebook, YouTube ou Gmail travarem ou abrirem com erro visual.
        </p>
      `
        },
        {
            title: "1. O Atalho Mágico (Atalho Universal)",
            content: `
        <p class="mb-4 text-gray-300">Não importa se você usa Chrome, Edge, Brave ou Firefox, o comando é o mesmo:</p>
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20 text-center">
            <kbd class="px-3 py-2 bg-gray-800 rounded border border-gray-600 text-white font-bold">Ctrl</kbd> + 
            <kbd class="px-3 py-2 bg-gray-800 rounded border border-gray-600 text-white font-bold">Shift</kbd> + 
            <kbd class="px-3 py-2 bg-gray-800 rounded border border-gray-600 text-white font-bold">Del</kbd>
        </div>
        <p class="mt-4 text-sm text-gray-300">
            Pressionar essas três teclas juntas abrirá instantaneamente a janela de 'Limpar dados de navegação'.
        </p>
      `
        },
        {
            title: "2. O que marcar na hora de limpar?",
            content: `
        <ul class="list-disc list-inside text-gray-300 space-y-3">
            <li><strong>Intervalo de tempo:</strong> Recomendamos 'Todo o período'.</li>
            <li><strong>Imagens e arquivos armazenados em cache:</strong> MARQUE (Isso limpa a sujeira visual).</li>
            <li><strong>Cookies e outros dados do site:</strong> OPCIONAL (Lembre-se: se marcar isso, você precisará digitar sua senha de novo em todos os sites).</li>
            <li><strong>Histórico de navegação:</strong> Só marque se quiser esconder os sites que visitou. Não afeta a velocidade.</li>
        </ul>
      `
        },
        {
            title: "3. Limpeza 'Hard' (Hard Reload)",
            content: `
        <p class="mb-4 text-gray-300">
            Se apenas UM site específico está dando erro, você não precisa limpar o cache de tudo. 
            <br/>Com o site aberto, segure a tecla <strong>Ctrl</strong> e clique no botão de <strong>Recarregar (atualizar)</strong>. Ou aperte <strong>Ctrl + F5</strong>. Isso força o navegador a ignorar o cache e baixar tudo do zero apenas para aquele site.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/atalhos-navegador-produtividade",
            title: "Atalhos Navegador",
            description: "Aprenda a navegar como um profissional."
        },
        {
            href: "/guias/como-limpar-cache-dns-ip-flushdns",
            title: "Flush DNS",
            description: "Se o site ainda não abre, o problema pode ser o DNS."
        },
        {
            href: "/guias/limpeza-disco-profunda-arquivos-temporarios",
            title: "Limpeza de Disco",
            description: "Limpe arquivos temporários de todo o Windows."
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
