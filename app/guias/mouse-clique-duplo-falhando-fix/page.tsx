import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Mouse com Clique Duplo (Double Click)? Guia de Conserto (Software e Hardware) (2026)";
const description = "Seu mouse clika duas vezes sozinho? Aprenda a aumentar o Debounce Time no software, limpar o switch com álcool isopropílico ou trocar por switches ópticos.";
const keywords = ['mouse double click fix', 'consertar clique duplo mouse', 'debounce time mouse', 'limpar switch mouse', 'logitech g pro double click', 'trocar switch mouse solda'];

export const metadata: Metadata = createGuideMetadata('mouse-clique-duplo-falhando-fix', title, description, keywords);

export default function MouseFixGuide() {
    const summaryTable = [
        { label: "Causa", value: "Oxidação/Desgaste" },
        { label: "Solução Fácil", value: "Debounce Time" },
        { label: "Solução Média", value: "Limpeza WD-40" },
        { label: "Definitivo", value: "Troca de Switch" }
    ];

    const contentSections = [
        {
            title: "Por que o Clique Duplo acontece?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
          Dentro do seu mouse, existe uma pequena lâmina de metal (switch). Com o tempo, a eletricidade cria carbonização ou oxidação, fazendo com que o metal "vibre" (bouncing) e envie múltiplos sinais elétricos em um único toque. Isso é o temido Double Click.
        </p>
      `,
            subsections: []
        },
        {
            title: "Solução 1: Ajuste de Software (Debounce Time)",
            content: `
        <p class="mb-4 text-gray-300">
            Se você tem um mouse gamer moderno (Glorious, Razer, HyperX, Model O), o software dele provavelmente tem essa configuração.
        </p>
        <ol class="list-decimal list-inside text-gray-300 space-y-2 ml-4">
            <li>Abra o driver do mouse.</li>
            <li>Procure por <strong>Debounce Time</strong>.</li>
            <li>Aumente o valor.
                <br/>- Padrão: 4ms.
                <br/>- Recomendado p/ corrigir erro: <strong>10ms a 14ms</strong>.
            </li>
        </ol>
        <p class="text-gray-300 mt-2 text-sm italic">
            Isso força o mouse a ignorar o segundo clique fantasma. Aumenta um pouco a latência (input lag), mas salva o mouse.
        </p>
      `,
            subsections: []
        },
        {
            title: "Solução 2: O Truque da Umidade (Emergência)",
            content: `
        <p class="mb-4 text-gray-300">
            Muitas vezes o problema é eletricidade estática acumulada em dias secos.
        </p>
        <ul class="list-disc list-inside text-gray-300 space-y-2">
            <li>Desligue o mouse.</li>
            <li>Respire quente (bafo) perto do botão (umidade ajuda a conduzir).</li>
            <li>Clique furiosamente por 30 segundos.</li>
            <li>Isso pode limpar a oxidação temporariamente.</li>
        </ul>
      `
        },
        {
            title: "Solução 3: Limpeza Química ( WD-40 / Limpa Contato)",
            content: `
            <p class="mb-4 text-gray-300">
                Se você tem coragem de abrir o mouse (geralmente parafusos ficam embaixo dos pés de teflon):
            </p>
            <ol class="list-decimal list-inside text-gray-300 space-y-2 ml-4">
                <li>Abra a carcaça.</li>
                <li>Localize a caixinha do switch (OMRON, Kailh).</li>
                <li>Pingue <strong>UMA GOTA</strong> de Álcool Isopropílico 100% ou Limpa Contato Elétrico dentro do êmbolo do switch.</li>
                <li>Clique várias vezes para o líquido entrar.</li>
                <li>Espere secar 10 minutos.</li>
            </ol>
            <p class="text-red-400 mt-2 font-bold bg-red-900/20 p-2 rounded">
                 NUNCA use óleo, desengripante comum ou água. Tem que ser Limpa Contato ou Isopropílico.
            </p>
        `
        },
        {
            title: "Solução Definitiva: Switches Ópticos",
            content: `
            <p class="text-gray-300">
                Para seu próximo mouse, compre um com <strong>Switches Ópticos</strong> (Razer Viper/Deathadder, Logitech G502 X). Eles usam luz, não contato físico, então é fisicamente impossível dar double click. Duram para sempre.
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
            difficultyLevel="Intermediário"
            contentSections={contentSections}
            summaryTable={summaryTable}
        />
    );
}
