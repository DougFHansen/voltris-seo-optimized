import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Guia Introdutório sobre Teclados Mecânicos";
const description = "Descubra por que todos estão trocando teclados de membrana por mecânicos e entenda os switches.";
const keywords = ["teclado mecanico","switch blue red brown","teclado gamer","vantagens mecanico"];

export const metadata: Metadata = createGuideMetadata(title, description, keywords);

export default function GuidePage() {
  const contentSections = [
    {
      title: "Introdução",
      content: `
        <p class="mb-4">Este guia foi elaborado para resolver dúvidas comuns sobre <strong>Guia Introdutório sobre Teclados Mecânicos</strong>. Nossa equipe técnica compilou as melhores práticas e soluções testadas para garantir que você obtenha resultados profissionais.</p>
        <p>Abaixo, detalhamos os passos principais e conceitos fundamentais para dominar este tópico.</p>
      `,
    },
    
    {
      title: "O que é Switch?",
      content: `<p class="mb-4">É o mecanismo sob cada tecla. Red (Linear/Silencioso), Blue (Clicky/Barulhento/Tátil), Brown (Tátil/Silencioso).</p>`,
      subsections: []
    },
    
    {
      title: "Durabilidade e Conforto",
      content: `<p class="mb-4">Duram 50+ milhões de toques. Oferecem melhor feedback tátil, reduzindo erros de digitação e fadiga.</p>`,
      subsections: []
    },
    
    {
      title: "Tamanhos",
      content: `<p class="mb-4">Full Size (com numérico), TKL (sem numérico), 60% (compacto). Escolha baseada no seu espaço de mesa e uso.</p>`,
      subsections: []
    }
    ,
    {
      title: "Conclusão e Recomendações",
      content: `
        <p class="mb-4">Esperamos que este guia sobre <strong>Guia Introdutório sobre Teclados Mecânicos</strong> tenha sido útil. A tecnologia exige aprendizado constante e manutenção preventiva.</p>
        <p>Se tiver dúvidas mais complexas ou precisar de assistência profissional, nossa equipe de suporte remoto está à disposição para ajudar.</p>
      `
    }
  ];

  const relatedGuides = [
    {
      href: "/guias/otimizacao-performance",
      title: "Otimização de Performance",
      description: "Melhore o desempenho do seu computador."
    },
    {
      href: "/guias/seguranca-digital",
      title: "Segurança Digital",
      description: "Proteja seus dados contra ameaças."
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
      relatedGuides={relatedGuides}
    />
  );
}
