import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Guia de Teclados Mecânicos 2026: Switches Ópticos, Magnéticos e Hall Effect";
const description = "Blue, Red, Brown ou Rapid Trigger? Entenda a revolução dos teclados magnéticos (Wooting, Razer Huntsman) e qual switch escolher para digitar ou jogar.";
const keywords = ['teclado mecanico switch', 'hall effect keyboard', 'wooting 60he vale a pena', 'switch optico vs mecanico', 'rapid trigger explicado', 'melhor teclado valorant'];

export const metadata: Metadata = createGuideMetadata('teclados-mecanicos-switches-guia', title, description, keywords);

export default function KeyboardGuide() {
    const summaryTable = [
        { label: "Melhor Jogo", value: "Magnético (HE)" },
        { label: "Melhor Escrita", value: "Mecânico (Tátil)" },
        { label: "Mais Rápido", value: "Rapid Trigger" },
        { label: "Custo-Benefício", value: "Óptico" }
    ];

    const contentSections = [
        {
            title: "Introdução: O Fim do Teclado Mecânico Tradicional",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
          Até 2023, a discussão era "Cherry MX Red vs Blue". Em 2026, isso é passado. A nova meta competitiva são os <strong>Switches Magnéticos (Hall Effect)</strong> com tecnologia Rapid Trigger. Se você joga Valorant, CS2 ou osu! em nível alto, teclado mecânico comum virou desvantagem.
        </p>
      `,
            subsections: []
        },
        {
            title: "1. O que é Rapid Trigger? (A Revolução)",
            content: `
        <div class="bg-[#121218] border border-gray-700 p-6 rounded-xl mb-6">
            <h4 class="text-white font-bold mb-4">Como funciona o Mecânico Comum:</h4>
            <p class="text-gray-400 text-sm mb-4">
                Você aperta a tecla -> Ela desce 2mm -> Ativa -> Você solta -> Ela sobe 2mm -> Desativa. Existe um "ponto fixo" de reset.
            </p>
            <h4 class="text-white font-bold mb-4">Como funciona o Rapid Trigger (Magnético):</h4>
            <p class="text-green-400 text-sm">
                Você aperta a tecla -> Ela desce 0.1mm -> Ativa.
                <br/>Você solta a tecla 0.1mm -> Ela desativa INSTANTANEAMENTE.
            </p>
            <p class="text-gray-300 mt-4">
                Isso permite que você faça "strafe" (ADAD) no Valorant/CS2 com uma velocidade desumana. Você para de andar no exato milissegundo em que pensa em parar. Teclados como <strong>Wooting 60HE</strong>, <strong>Razer Huntsman V3 Pro</strong> e <strong>DrunkDeer</strong> usam isso.
            </p>
        </div>
      `,
            subsections: []
        },
        {
            title: "2. Guia de Switches Tradicionais (Para Digitação e Custo-Benefício)",
            content: `
        <p class="mb-4 text-gray-300">Se você não quer gastar R$ 1.000 num teclado magnético, os mecânicos ainda são ótimos.</p>
        
        <ul class="space-y-4 list-none text-gray-300">
            <li class="bg-blue-900/20 p-4 rounded border-l-4 border-blue-500">
                <strong class="text-blue-400 block">Switch Blue (Clicky)</strong>
                Faz barulho de máquina de escrever. Ótimo para digitar (você sente o clique), péssimo para jogar (pesado e barulhento no Discord).
            </li>
            <li class="bg-red-900/20 p-4 rounded border-l-4 border-red-500">
                <strong class="text-red-400 block">Switch Red (Linear)</strong>
                Suave, desce direto sem clique. O favorito dos gamers tradicionais. Leve e rápido.
            </li>
            <li class="bg-yellow-900/20 p-4 rounded border-l-4 border-yellow-700">
                <strong class="text-yellow-600 block">Switch Brown (Tátil)</strong>
                O meio termo. Tem um "degrau" tátil silencioso. Bom híbrido para quem trabalha e joga.
            </li>
        </ul>
      `,
            subsections: []
        },
        {
            title: "3. Switches Ópticos (O Meio Termo)",
            content: `
            <p class="mb-4 text-gray-300">
                Teclados ópticos usam luz infravermelha para detectar o clique. São imunes a "Double Click" (veja nosso guia sobre isso) e mais rápidos que os mecânicos, mas não têm a função analógica dos magnéticos.
            </p>
            <p class="text-gray-300">
                São uma excelente escolha para quem quer durabilidade extrema e rapidez sem pagar o preço do Hall Effect.
            </p>
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
