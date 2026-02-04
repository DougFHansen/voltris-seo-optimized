import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Teclado do Notebook Parou: Como resolver (Guia 2026)";
const description = "Metade do seu teclado não funciona ou ele parou totalmente? Aprenda a diagnosticar problemas de driver, sujeira e hardware no seu notebook em 2026.";
const keywords = [
    'teclado notebook parou de funcionar como resolver 2026',
    'algumas teclas do notebook nao funcionam tutorial',
    'teclado notebook travado no windows 11 fix 2026',
    'como limpar teclado de notebook guia passo a passo',
    'teclado notebook parou apos atualização tutorial 2026'
];

export const metadata: Metadata = createGuideMetadata('teclado-notebook-parou-fix', title, description, keywords);

export default function LaptopKeyboardFixGuide() {
    const summaryTable = [
        { label: "Causa Software", value: "Driver 'HID Keyboard' corrompido" },
        { label: "Causa Hardware", value: "Cabo Flat solto ou oxidação" },
        { label: "Solução Paliativa", value: "Teclado Virtual ou USB" },
        { label: "Dificuldade", value: "Intermediária" }
    ];

    const contentSections = [
        {
            title: "O Pânico do Teclado Mudo",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Diferente de um PC desktop, onde você apenas troca o cabo, o teclado do notebook é integrado. Em 2026, com notebooks cada vez mais finos, os cabos internos são extremamente delicados. Se o seu teclado parou após uma pancada, derramamento de líquido ou até do nada após uma atualização do Windows 11, precisamos descobrir se o problema é apenas um "bug" de sistema ou se a peça física morreu.
        </p>
      `
        },
        {
            title: "1. O Teste de BIOS: É Software ou Hardware?",
            content: `
        <p class="mb-4 text-gray-300">Descubra em 10 segundos se o teclado está vivo:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Reinicie o notebook.</li>
            <li>Fique apertando a tecla <strong>F2, F10 ou DEL</strong> repetidamente enquanto ele liga.</li>
            <li>Se você conseguir entrar no menu da BIOS e navegar com as setas, o seu teclado está **funcionando perfeitamente**. O problema é o Windows.</li>
            <li>Se o teclado não responder nem na BIOS, infelizmente o problema é físico (Cabo flat ou defeito na peça).</li>
        </ol>
      `
        },
        {
            title: "2. Resetando o Driver (Solução Windows)",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Limpando registros:</h4>
            <p class="text-sm text-gray-300">
                1. Clique com o botão direito no Iniciar > <strong>Gerenciador de Dispositivos</strong>. <br/>
                2. Expanda 'Teclados'. <br/>
                3. Clique com o botão direito em todos os itens (ex: PS/2 Keyboard) e selecione <strong>Desinstalar dispositivo</strong>. <br/>
                4. Reinicie o notebook. O Windows 11 reinstalará os drivers originais automaticamente. Muitos erros de "algumas teclas não funcionam" são resolvidos com esse reset.
            </p>
        </div>
      `
        },
        {
            title: "3. Filtro de Teclas: O vilão silencioso",
            content: `
        <p class="mb-4 text-gray-300">
            Se você precisa segurar a tecla por 1 segundo para ela funcionar:
            <br/><br/><strong>Dica de 2026:</strong> Você pode ter ativado as 'Teclas de Filtragem' sem querer. Vá em Configurações > Acessibilidade > Teclado e verifique se <strong>Teclas de Filtragem</strong> e <strong>Teclas de Aderência</strong> estão desativadas. Essas opções impedem cliques rápidos de serem registrados.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/teclado-desconfigurado-abnt2-ansi",
            title: "Configurar Layout",
            description: "Corrija se as teclas estão trocadas."
        },
        {
            href: "/guias/pos-instalacao-windows-11",
            title: "Otimizar Sistema",
            description: "Garanta que os drivers estejam em dia."
        },
        {
            href: "/guias/limpeza-fisica-pc-gamer",
            title: "Limpar Teclado",
            description: "Dicas para remover sujeira entre as teclas."
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
            relatedGuides={relatedGuides}
        />
    );
}
