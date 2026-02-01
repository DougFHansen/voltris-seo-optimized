import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Disco 100% no Gerenciador de Tarefas: 5 Passos para Resolver Definitivamente (2026)";
const description = "Seu PC trava e o HD fica em 100% de uso? O culpado geralmente é o SysMain ou Telemetria. Veja como desativar esses serviços e salvar seu computador.";
const keywords = ['disco 100% windows 10', 'disco 100% windows 11', 'desativar sysmain', 'hd 100 por cento fix', 'pc travando disco 100', 'otimizar windows hd lento'];

export const metadata: Metadata = createGuideMetadata('erro-disco-100-porcento-gerenciador-tarefas', title, description, keywords);

export default function Disk100Guide() {
    const summaryTable = [
        { label: "Culpado 1", value: "SysMain (Superfetch)" },
        { label: "Culpado 2", value: "Telemetria" },
        { label: "Culpado 3", value: "Windows Search" },
        { label: "Solução Real", value: "Trocar p/ SSD" }
    ];

    const contentSections = [
        {
            title: "O que Causa o Disco 100%?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
          Se você ainda usa um HD mecânico (Disco Rígido) como disco principal do Windows 10 ou 11, o problema é físico. O Windows moderno faz tantas leituras/escritas de fundo que satura a velocidade física do HD (que é lenta).
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed">
          Porém, podemos aliviar a carga desativando serviços que foram feitos para SSDs e matam HDs.
        </p>
      `,
            subsections: []
        },
        {
            title: "Passo 1: Matar o SysMain (Antigo Superfetch)",
            content: `
        <p class="mb-4 text-gray-300">O SysMain tenta "prever" quais apps você vai abrir e pré-carrega eles na RAM. Em HDs, isso causa leitura constante.</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-2 ml-4 mb-6">
            <li>Pressione <strong>Win + R</strong>, digite <code class="text-green-400">services.msc</code> e dê Enter.</li>
            <li>Procure na lista por <strong>SysMain</strong>.</li>
            <li>Clique duas vezes nele.</li>
            <li>Em "Tipo de Inicialização", mude para <strong>Desativado</strong>.</li>
            <li>Clique no botão <strong>Parar</strong>. Aplique e dê OK.</li>
        </ol>
      `,
            subsections: []
        },
        {
            title: "Passo 2: Desativar Telemetria (Espionagem)",
            content: `
        <p class="mb-4 text-gray-300">O Windows coleta dados de uso o tempo todo. Vamos cortar isso.</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-2 ml-4 mb-6">
            <li>Ainda no <code>services.msc</code>.</li>
            <li>Procure por <strong>Experiências de Usuário Conectado e Telemetria</strong>.</li>
            <li>Faça o mesmo: Coloque como <strong>Desativado</strong> e clique em <strong>Parar</strong>.</li>
        </ol>
      `,
            subsections: []
        },
        {
            title: "Passo 3: Desfragmentação Agendada (O Assassino de HDs)",
            content: `
            <p class="mb-4 text-gray-300">
                O Windows tenta desfragmentar seu HD enquanto você usa.
            </p>
            <ol class="list-decimal list-inside text-gray-300 space-y-2 ml-4">
                <li>Abra o "Meu Computador".</li>
                <li>Clique direito no Disco C: > Propriedades > Ferramentas.</li>
                <li>Clique em Otimizar.</li>
                <li>Clique em <strong>Alterar configurações</strong>.</li>
                <li><strong>Desmarque</strong> a caixa "Executar seguindo um agendamento".</li>
            </ol>
            <p class="text-gray-400 text-sm mt-2">Agora você terá que lembrar de desfragmentar manualmente uma vez por mês, mas seu PC vai parar de travar do nada.</p>
        `
        },
        {
            title: "Passo 4: Modo de Alto Desempenho",
            content: `
            <p class="text-gray-300">
                Às vezes o HD entra em modo de economia de energia e demora para "acordar".
                Vá em Opções de Energia e selecione <strong>Alto Desempenho</strong>.
            </p>
        `
        },
        {
            title: "A Única Solução Verdadeira",
            content: `
            <div class="bg-blue-900/20 p-6 rounded-xl border border-blue-500 mt-4 text-center">
                <h4 class="text-white font-bold text-xl mb-2">Compre um SSD (R$ 80,00)</h4>
                <p class="text-gray-300">
                    Nenhum tutorial de software faz milagre. Um SSD SATA de 120GB custa menos de 80 reais hoje e deixa o PC 10x mais rápido que qualquer otimização. Use o HD antigo apenas para guardar arquivos (Fotos/Vídeos) e o SSD para o Windows.
                </p>
            </div>
        `
        }
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
