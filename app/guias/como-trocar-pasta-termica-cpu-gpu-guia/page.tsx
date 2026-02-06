import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'como-trocar-pasta-termica-cpu-gpu-guia',
    title: "Troca de Pasta Térmica (CPU/GPU): Guia Seguro de Manutenção",
    description: "Seu PC está superaquecendo? Aprenda a abrir seu processador e placa de vídeo para trocar a pasta térmica corretamente. Método Gota, X ou Espalhar?",
    category: 'hardware',
    difficulty: 'Avançado',
    time: '40 min'
};

const title = "Guia de Manutenção: Troca de Pasta Térmica";
const description = "Uma pasta térmica seca faz seu PC perder 30% de desempenho (Thermal Throttling). A manutenção anual é obrigatória para Gamers. Aprenda a fazer sem riscos.";

const keywords = [
    'qual melhor pasta termica processador 2026',
    'arctic mx-4 vs mx-6 vs thermal grizzly kryonaut',
    'como aplicar pasta termica gota ou espalhar',
    'como abrir placa de video para limpar rtx 3060',
    'thermal pads trocar espessura correta',
    'alcool isopropilico limpeza pc',
    'voltris optimizer temps',
    'metal liquido vale a pena'
];

export const metadata: Metadata = createGuideMetadata('como-trocar-pasta-termica-cpu-gpu-guia', title, description, keywords);

export default function PasteGuide() {
    const summaryTable = [
        { label: "Material 1", value: "Pasta Térmica de Prata/Cerâmica" },
        { label: "Material 2", value: "Álcool Isopropílico 99%" },
        { label: "Material 3", value: "Papel Toalha / Filtro de Café" },
        { label: "Frequência", value: "A cada 12-18 meses" },
        { label: "Risco CPU", value: "Baixo" },
        { label: "Risco GPU", value: "Médio (Perda de Garantia)" },
        { label: "Melhor Método", value: "X ou Espalhar" }
    ];

    const contentSections = [
        {
            title: "Introdução: Quando trocar?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Se as temperaturas subiram 5-10°C em comparação a quando o PC era novo, ou se a ventoinha vive em 100% fazendo barulho, é hora de trocar.
          <br/>Pastas de fábrica secam rápido. Uma pasta de qualidade (Kryonaut, MX-6, MasterGel Maker) dura anos e baixa até 8°C.
        </p>
      `
        },
        {
            title: "Capítulo 1: Materiais Necessários",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">O Kit Básico</h4>
                <p class="text-gray-400 text-xs text-justify">
                    - <strong>Pasta Térmica:</strong> Não compre a branca barata (Implastec branc) para PC Gamer! Ela resseca em 1 mês. Invista R$ 50,00 em uma Arctic, Cooler Master ou Thermal Grizzly.
                    - <strong>Limpador:</strong> Álcool Isopropílico (encontra em farmácia de manipulação ou loja de eletrônica). Não use álcool de cozinha (tem água e oxida) nem perfume/acetona.
                    - <strong>Pano:</strong> Filtro de café é ótimo (não solta fiapos). Papel higiênico solta pó.
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: CPU (Processador)",
            content: `
        <p class="mb-4 text-gray-300">
            1. Desligue o PC e tire da tomada.
            <br/>2. Remova o Cooler. (Dica: Se por AMD, rode um jogo antes para esquentar a pasta, e gire o cooler levemente ao retirar para não arrancar o processador junto do socket).
            <br/>3. Limpe a pasta velha da CPU e do Cooler com o álcool até brilhar.
            <br/>4. Aplique a nova pasta.
            <br/>Qual método?
            <br/>- <strong>Gota (Ervilha):</strong> Funciona, mas às vezes não cobre os cantos (Ryzen e Intel novos são retangulares).
            <br/>- <strong>X (Xis):</strong> O melhor custo-benefício. Garante cobertura total.
            <br/>- <strong>Espalhar com espátula:</strong> O mais garantido, mas faz sujeira.
            <br/>Recomendamos o "X".
            <br/>5. Recoloque o cooler, apertando os parafusos em cruz (um pouco o topo-esquerdo, um pouco o baixo-direito, etc) para pressão igual.
        </p>
      `
        },
        {
            title: "Capítulo 3: GPU (Placa de Vídeo) - Atenção",
            content: `
        <p class="mb-4 text-gray-300">
            Abrir a GPU geralmente rompe o lacre de garantia (verifique sua marca, MSI/Galax permitem abrir).
            <br/>1. Solte os parafusos traseiros (backplate).
            <br/>2. Solte os cabos do das ventoinhas e LED com cuidado (são frágeis!).
            <br/>3. O chip da GPU é "Direct Die" (cristal exposto). Você PRECISA cobrir 100% dele. Aqui o método da gota NÃO serve.
            <br/>USE O MÉTODO DE ESPALHAR OU UM "X" BEM GENEROSO. Se uma partezinha ficar sem pasta, o hotspot vai bater 105°C e a placa vai travar.
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: Thermal Pads",
            content: `
        <p class="mb-4 text-gray-300">
            Ao abrir a GPU, você verá "borrachinhas" nas memórias (VRAM).
            <br/>Se elas rasgarem, você precisa trocar.
            <br/>CUIDADO: A espessura tem que ser exata (0.5mm, 1.0mm, 2.0mm). Se colocar errado, o dissipador não encosta na GPU e ela queima.
            <br/>Se os pads originais estiverem inteiros, não mexa neles. Apenas limpe a poeira.
        </p>
      `
        },
        {
            title: "Capítulo 5: Metal Líquido (Conductonaut)",
            content: `
        <p class="mb-4 text-gray-300">
            Metal Líquido baixa 15°C, mas é condutivo. Se pingar na placa, dá curto e mata o PC.
            <br/>Além disso, ele corrói alumínio. Só pode ser usado em dissipadores de Cobre niquelado.
            <br/>NÃO RECOMENDAMOS para usuários comuns. O risco não vale os 3°C a menos que uma Kryonaut normal.
        </p>
      `
        },
        {
            title: "Capítulo 6: Erros Comuns",
            content: `
        <p class="mb-4 text-gray-300">
            - Colocar pasta demais: Não estraga (se não for condutiva), mas faz sujeira e pode isolar o calor se for uma camada grossa demais. A camada tem que ser fina.
            - Colocar pasta de menos: O pior erro. Causa superaquecimento.
            - Esquecer de ligar o fan do cooler depois.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 7: Limpeza das Ventoinhas",
            content: `
            <p class="mb-4 text-gray-300">
                Use um pincel macio para tirar a poeira das pás.
                <br/>Se usar Ar Comprimido ou Aspirador: SEGURE A VENTOINHA para ela não girar. Se ela girar muito rápido com o ar, ela gera energia (dínamo) e pode queimar a placa-mãe.
            </p>
            `
        },
        {
            title: "Capítulo 8: Tempo de Cura",
            content: `
            <p class="mb-4 text-gray-300">
                Algumas pastas antigas (Artic Silver 5) demoravam 200 horas para curar.
                <br/>Pastas modernas (MX-4/6, Kryonaut) têm tempo de cura zero. Aplicou, tá pronto.
            </p>
            `
        },
        {
            title: "Capítulo 9: Thermal Puttys (Massinha)",
            content: `
            <p class="mb-4 text-gray-300">
                Uma novidade que substitui os Thermal Pads. É uma pasta grossa que se molda a qualquer espessura. Ótimo para VRAM de GDDR6X (RTX 3070ti/3080).
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Pasta vence no tubo?",
            answer: "Sim, geralmente em 3 a 5 anos. Se sair um 'óleo' transparente antes da pasta cinza, ela estragou (separação de componentes). Jogue fora."
        },
        {
            question: "Pasta de dente serve?",
            answer: "Apenas para testes de 10 minutos. Ela seca e vira isolante térmico. Jamais use."
        }
    ];

    const externalReferences = [
        { name: "Gamers Nexus - Paste Methods Tested", url: "https://www.youtube.com/watch?v=r2MEAnZ3swQ" },
        { name: "Thermal Grizzly", url: "https://www.thermal-grizzly.com/" }
    ];

    const relatedGuides = [
        {
            href: "/guias/termperatura-pc-fan-control-curva",
            title: "Fan Control",
            description: "Ajustar curvas."
        },
        {
            href: "/guias/msi-afterburner-overclock-undervolt-guia",
            title: "Undervolt",
            description: "Esfriar GPU."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="40 min"
            difficultyLevel="Avançado"
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
