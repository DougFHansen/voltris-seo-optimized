import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Teclado Desconfigurado: Como mudar para ABNT2 ou ANSI (2026)";
const description = "Seu teclado está trocando o @ pelo \" ou não tem o Ç? Aprenda como configurar o idioma e o layout do teclado no Windows 11 em 2026.";
const keywords = [
    'teclado desconfigurado abnt2 como resolver 2026',
    'mudar teclado para internacional estados unidos tutorial',
    'tutorial layout teclado windows 11 passo a passo',
    'teclado sem ç como configurar windows 11 2026',
    'atalho para mudar idioma teclado windows 11 guia'
];

export const metadata: Metadata = createGuideMetadata('teclado-desconfigurado-abnt2-ansi', title, description, keywords);

export default function KeyboardConfigGuide() {
    const summaryTable = [
        { label: "Layout ABNT2", value: "Possui tecla Ç e AltGr" },
        { label: "Layout ANSI (EUA)", value: "Não tem Ç / @ fica no '2'" },
        { label: "Atalho de Troca", value: "Win + Espaço" },
        { label: "Dificuldade", value: "Iniciante" }
    ];

    const contentSections = [
        {
            title: "O mistério das teclas trocadas",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Em 2026, com a popularização de teclados mecânicos importados, é muito comum comprar um teclado com o layout americano (ANSI) e tentar usá-lo com as configurações brasileiras (ABNT2). Isso faz com que os símbolos não correspondam ao que está impresso na tecla. Resolver isso no Windows 11 leva menos de um minuto, desde que você saiba exatamente qual layout o seu hardware possui.
        </p>
      `
        },
        {
            title: "1. Identificando seu Layout",
            content: `
        <p class="mb-4 text-gray-300">Antes de configurar, olhe para o seu teclado:</p>
        <ul class="list-disc list-inside text-gray-300 space-y-3">
            <li><strong>ABNT2:</strong> Tem a tecla 'Ç' e o 'Enter' tem formato de bota (grande). O '@' costuma ficar na tecla '2'.</li>
            <li><strong>Estados Unidos (Internacional):</strong> Não tem a tecla 'Ç'. O 'Enter' é uma barra horizontal pequena. O '@' fica no '2', mas os acentos funcionam de forma diferente (ex: apertar ' e depois 'c' para fazer 'ç').</li>
        </ul >
      `
        },
        {
            title: "2. Como configurar no Windows 11",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Passo a Passo:</h4>
            <p class="text-sm text-gray-300">
                1. Vá em Configurações > Hora e Idioma > <strong>Idioma e Região</strong>. <br/>
                2. Em 'Português (Brasil)', clique nos três pontos (...) e selecione <strong>Opções de Idioma</strong>. <br/>
                3. Role até 'Teclados' e clique em 'Adicionar um teclado'. <br/>
                4. Escolha 'Português (Brasil ABNT2)' ou 'Estados Unidos (Internacional)'. <br/>
                5. <strong>Dica:</strong> Remova os teclados que você não usa para evitar que o Windows troque sozinho durante o uso.
            </p>
        </div>
      `
        },
        {
            title: "3. O Atalho Mágico",
            content: `
        <p class="mb-4 text-gray-300">
            Se o seu teclado desconfigura "do nada" enquanto você joga ou digita:
            <br/><br/><strong>Atenção:</strong> O atalho <strong>Windows + Espaço</strong> alterna entre os layouts instalados. Em 2026, muitos usuários apertam isso acidentalmente. Se o seu teclado ficar louco, tente esse atalho para voltar ao layout correto imediatamente.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/teclado-mecanico-vs-membrana-qual-o-melhor",
            title: "Tipos de Teclado",
            description: "Conheça as tecnologias de switches."
        },
        {
            href: "/guias/teclado-notebook-parou-fix",
            title: "Teclado Falhando",
            description: "Dicas se o teclado parou totalmente."
        },
        {
            href: "/guias/atalhos-produtividade-windows",
            title: "Atalhos Windows",
            description: "Mais combos de teclas para o dia a dia."
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
