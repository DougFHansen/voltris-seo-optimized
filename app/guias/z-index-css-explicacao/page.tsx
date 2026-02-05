import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'z-index-css-explicacao',
  title: "z-index no CSS: Guia Definitivo e Empilhamento (2026)",
  description: "Entenda de uma vez por todas como funciona o z-index no CSS, por que ele 'ignora' alguns elementos e como dominar o Stacking Context em 2026.",
  category: 'windows-geral',
  difficulty: 'Intermediário',
  time: '15 min'
};

const title = "z-index no CSS: Guia Definitivo e Empilhamento (2026)";
const description = "Entenda de uma vez por todas como funciona o z-index no CSS, por que ele 'ignora' alguns elementos e como dominar o Stacking Context em 2026.";
const keywords = [
    'como funciona z-index css tutorial 2026',
    'z-index nao funciona motivo e solucao guia',
    'o que é stacking context css tutorial 2026',
    'ordem de empilhamento css guia completo 2026',
    'z-index vs position absolute tutorial css guia'
];

export const metadata: Metadata = createGuideMetadata('z-index-css-explicacao', title, description, keywords);

export default function ZIndexGuide() {
    const summaryTable = [
        { label: "Requisito Principal", value: "Elemento deve ter 'position' (relative, absolute, etc)" },
        { label: "O Vilão", value: "Stacking Context (Contexto de Empilhamento)" },
        { label: "Valor Máximo", value: "2147483647 (Mas nunca use isso!)" },
        { label: "Dificuldade", value: "Médio" }
    ];

    const contentSections = [
        {
            title: "O que é o z-index?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          No desenvolvimento web de 2026, criar interfaces modernas com camadas sobrepostas (glassmorphism, modais, headers fixos) é regra. O **z-index** é a propriedade CSS que define quem fica "na frente" de quem no eixo Z (profundidade). No entanto, ele é famoso por ser uma das propriedades que mais gera frustração em desenvolvedores iniciantes por parecer "não funcionar" sem motivo aparente.
        </p>
      `
        },
        {
            title: "1. A Regra de Ouro da Posição",
            content: `
        <p class="mb-4 text-gray-300">O z-index só funciona em elementos que possuem uma posição definida:</p>
        <div class="bg-gray-800 p-4 rounded-lg mb-4">
            <code class="text-blue-400">
                .caixa {"{"} <br/>
                &nbsp;&nbsp;position: relative; /* ou absolute, fixed, sticky */ <br/>
                &nbsp;&nbsp;z-index: 10; <br/>
                {"}"}
            </code>
        </div>
        <p class="text-sm text-gray-300">
            Se o seu elemento tem <code>position: static</code> (o padrão do navegador), o z-index será **completamente ignorado**. Lembre-se sempre de trocar para <code>relative</code> se quiser apenas mover o elemento no eixo Z.
        </p>
      `
        },
        {
            title: "2. O Stacking Context (Dono da festa)",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Por que o '9999' não funciona?</h4>
            <p class="text-sm text-gray-300">
                Muitas vezes você coloca <code>z-index: 9999</code> em um balão e ele continua atrás de um fundo que tem <code>z-index: 1</code>. Isso acontece por causa do <strong>Stacking Context</strong>. <br/><br/>
                Imagine que cada container-pai é uma pasta. Se o 'Pai A' tem z-index 1 e o 'Pai B' tem z-index 2, nada dentro do 'Pai A' (mesmo que tenha z-index um bilhão) conseguirá ficar na frente do 'Pai B'. O filho está preso ao nível de hierarquia do seu pai.
            </p>
        </div>
      `
        },
        {
            title: "3. Boas Práticas em 2026",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>Não use valores aleatórios:</strong> Evite usar <code>z-index: 9999999</code>. Isso cria uma "guerra de números" impossível de manter em projetos grandes. 
            <br/><br/><strong>Dica:</strong> Em 2026, a melhor prática é criar variáveis CSS para os seus níveis de camada: <br/>
            - <code>--z-modal: 100;</code> <br/>
            - <code>--z-dropdown: 50;</code> <br/>
            - <code>--z-header: 10;</code> <br/>
            Assim, você mantém a organização e garante que os elementos sigam a lógica visual correta do seu design.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/css-grid-vs-flexbox-qual-usar",
            title: "Grid vs Flexbox",
            description: "Domine o layout moderno."
        },
        {
            href: "/guias/otimizacao-seo-frontend",
            title: "SEO para Devs",
            description: "Aumente a visibilidade do seu site."
        },
        {
            href: "/guias/melhores-praticas-clean-code-javascript",
            title: "JS Clean Code",
            description: "Escreva códigos melhores em 2026."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="15 min"
            difficultyLevel="Médio"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
