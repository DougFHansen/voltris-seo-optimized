import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Otimização Avançada de SSD no Windows 11: Aumente a Vida Útil e Velocidade (2026)";
const description = "Seu SSD NVMe ou SATA está lento? Entenda o Write Amplification, configure o Overprovisioning e aprenda a usar o TRIM corretamente para manter a performance de fábrica.";
const keywords = ['otimizacao ssd windows 11', 'ativar trim windows', 'ssd lento escrita', 'aumentar vida util ssd', 'overprovisioning explicado', 'firmware ssd update', 'hibernacao ssd mito'];

export const metadata: Metadata = createGuideMetadata('otimizacao-ssd-windows-11', title, description, keywords);

export default function SSDGuide() {
    const summaryTable = [
        { label: "TRIM", value: "Ativado (0)" },
        { label: "Indexação", value: "Depende" },
        { label: "Hibernação", value: "Desativar" },
        { label: "Espaço Livre", value: "15% a 20%" }
    ];

    const contentSections = [
        {
            title: "Introdução: Como um SSD morre?",
            content: `
        <p class="mb-4 text-gray-300 leading-relaxed">
            Diferente dos HDs antigos que morriam por falha mecânica, os SSDs morrem quando seus chips de memória NAND atingem o limite de ciclos de escrita (TBW). Além disso, eles sofrem de degradação de performance se forem mal configurados.
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed">
            Se você encher um SSD até 99%, ele precisa trabalhar dobrado para mover arquivos antigos e abrir espaço para novos (chamado de <em>Write Amplification</em>). Vamos configurar o Windows para evitar isso.
        </p>
      `,
            subsections: []
        },
        {
            title: "1. O Protocolo TRIM (O Lixeiro Digital)",
            content: `
        <p class="mb-4 text-gray-300">
            Quando você deleta um arquivo no Windows, ele não é apagado de verdade no SSD, apenas marcado como "livre". O SSD não sabe disso e continua mantendo energia naquele bloco. O comando TRIM avisa o controlador do SSD: "Pode apagar esses blocos fisicamente agora". Sem isso, a escrita fica lentíssima.
        </p>
        
        <div class="bg-[#121218] border border-gray-700 p-6 rounded-xl mb-6">
            <h4 class="text-white font-bold mb-4">Como Verificar o TRIM:</h4>
            <ol class="list-decimal list-inside text-gray-300 space-y-2">
                <li>Abra o CMD como Administrador.</li>
                <li>Digite: <code class="text-green-400 select-all">fsutil behavior query DisableDeleteNotify</code></li>
                <li>Resultado <strong>0</strong> = ATIVADO (Correto).</li>
                <li>Resultado <strong>1</strong> = DESATIVADO (Problema).</li>
            </ol>
             <p class="text-gray-400 text-sm mt-3">Se estiver 1, digite: <code class="text-yellow-400">fsutil behavior set DisableDeleteNotify 0</code>.</p>
        </div>
      `,
            subsections: []
        },
        {
            title: "2. Overprovisioning: O Segredo da Longevidade",
            content: `
        <p class="mb-4 text-gray-300">
            Esta é a dica mais valiosa deste guia. O SSD precisa de espaço "vazio" para fazer a manutenção interna (Garbage Collection). Se você usar 100% do espaço, ele sufoca.
        </p>
        <p class="mb-4 text-gray-300">
            <strong>Otimização Manual:</strong> Simplesmente deixe uma parte do seu SSD "Não Alocada" ou livre.
        </p>
        <ul class="list-disc list-inside text-gray-300 ml-4 bg-blue-900/20 p-4 border-l-4 border-blue-500 rounded">
            <li>SSD de 240GB: Deixe 20GB livres.</li>
            <li>SSD de 500GB: Deixe 40GB livres.</li>
            <li>SSD de 1TB: Deixe 80GB livres.</li>
        </ul>
        <p class="text-gray-300 mt-4 text-sm">
            Marcas como Samsung e Crucial têm softwares que fazem isso criando uma partição oculta. Mas você pode fazer isso apenas evitando encher o disco. Performance de escrita pode cair até 80% em um disco cheio.
        </p>
      `
        },
        {
            title: "3. Configurações do Windows (Mitos e Verdades)",
            content: `
           <h3 class="text-xl text-[#31A8FF] font-bold mt-6 mb-4">3.1 Desfragmentação</h3>
           <p class="text-gray-300 mb-4">
             MITO: Jamais "desfragmente" um SSD.
             VERDADE: A ferramenta "Otimizar Unidades" do Windows moderna identifica se é SSD e roda apenas o TRIM, não a desfragmentação. Mantenha o agendamento semanal ligado.
           </p>

           <h3 class="text-xl text-[#31A8FF] font-bold mt-6 mb-4">3.2 Hibernação (hiberfil.sys)</h3>
           <p class="text-gray-300 mb-4">
             A hibernação salva tudo da sua RAM para o SSD quando você desliga o PC. Se você tem 32GB de RAM, ele escreve 32GB no SSD todo dia. Isso consome a vida útil (TBW) desnecessariamente em desktops.
           </p>
           <p class="text-gray-300 mb-4">
             <strong>Recomendação:</strong> Desative se tiver um Desktop rápido (ele liga em 10s de qualquer jeito).
             <br/>Comando CMD: <code class="text-yellow-400">powercfg -h off</code>
           </p>

           <h3 class="text-xl text-[#31A8FF] font-bold mt-6 mb-4">3.3 Indexação de Pesquisa</h3>
           <p class="text-gray-300 mb-4">
             A indexação cria um banco de dados dos seus arquivos para a busca do Windows ser rápida. Em SSDs modernos, a leitura é tão rápida que a indexação é quase irrelevante, mas ela gasta ciclos de escrita.
           </p>
           <p class="text-gray-300">
             Se você usa o PC só para jogar, pode desativar o serviço "Windows Search". Se trabalha com muitos documentos, deixe ligado.
           </p>
        `
        },
        {
            title: "4. Atualização de Firmware",
            content: `
            <p class="mb-4 text-gray-300">
                Muitas pessoas compram um SSD e nunca atualizam o software interno dele. Fabricantes lançam correções críticas que resolvem telas azuis e lentidão.
            </p>
            <p class="text-gray-300">
                Baixe o software oficial da sua marca:
                <br/>- Kingston: Kingston SSD Manager
                <br/>- Samsung: Samsung Magician
                <br/>- WD/SanDisk: Western Digital Dashboard
                <br/>- Crucial: Storage Executive
            </p>
        `
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="20 min"
            difficultyLevel="Iniciante"
            contentSections={contentSections}
            summaryTable={summaryTable}
        />
    );
}
