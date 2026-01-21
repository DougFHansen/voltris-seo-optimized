import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Como Verificar e Preservar a Bateria do Notebook";
const description = "Aprenda a checar o desgaste da bateria e dicas para prolongar a vida útil dela.";
const keywords = ["bateria notebook","ciclos bateria","battery report","vida util bateria"];

export const metadata: Metadata = createGuideMetadata(title, description, keywords);

export default function GuidePage() {
  const contentSections = [
    {
      title: "Introdução",
      content: `
        <p class="mb-4">Este guia foi elaborado para resolver dúvidas comuns sobre <strong>Como Verificar e Preservar a Bateria do Notebook</strong>. Nossa equipe técnica compilou as melhores práticas e soluções testadas para garantir que você obtenha resultados profissionais.</p>
        <p>Abaixo, detalhamos os passos principais e conceitos fundamentais para dominar este tópico.</p>
      `,
    },
    
    {
      title: "Relatório de Bateria",
      content: `<p class="mb-4">Abra o CMD como Admin e digite "powercfg /batteryreport". Um arquivo HTML será gerado mostrando capacidade original vs atual.</p>`,
      subsections: []
    },
    
    {
      title: "Dicas de Preservação",
      content: `<p class="mb-4">Evite deixar descarregar até 0% constantemente. O ideal é manter entre 20% e 80% para química de lítio.</p>`,
      subsections: []
    },
    
    {
      title: "Calor é Inimigo",
      content: `<p class="mb-4">Nunca bloqueie as saídas de ar. O calor excessivo degrada a bateria permanentemente mais rápido que o uso.</p>`,
      subsections: []
    }
    ,
    {
      title: "Conclusão e Recomendações",
      content: `
        <p class="mb-4">Esperamos que este guia sobre <strong>Como Verificar e Preservar a Bateria do Notebook</strong> tenha sido útil. A tecnologia exige aprendizado constante e manutenção preventiva.</p>
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
