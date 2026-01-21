import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Guia Básico para Montar seu Primeiro PC Gamer";
const description = "O passo a passo fundamental para quem quer montar o próprio computador e economizar.";
const keywords = ["montar pc gamer","tutorial montagem pc","peças computador","compatibilidade hardware"];

export const metadata: Metadata = createGuideMetadata(title, description, keywords);

export default function GuidePage() {
  const contentSections = [
    {
      title: "Introdução",
      content: `
        <p class="mb-4">Este guia foi elaborado para resolver dúvidas comuns sobre <strong>Guia Básico para Montar seu Primeiro PC Gamer</strong>. Nossa equipe técnica compilou as melhores práticas e soluções testadas para garantir que você obtenha resultados profissionais.</p>
        <p>Abaixo, detalhamos os passos principais e conceitos fundamentais para dominar este tópico.</p>
      `,
    },
    
    {
      title: "Planejamento e Compatibilidade",
      content: `<p class="mb-4">Use sites como MEUPC.NET ou PCPartPicker para garantir que CPU, Placa Mãe e RAM sejam compatíveis.</p>`,
      subsections: []
    },
    
    {
      title: "A Montagem",
      content: `<p class="mb-4">Instale CPU, RAM e SSD na placa mãe FORA do gabinete (sobre a caixa). Teste o boot. Só depois instale no gabinete.</p>`,
      subsections: []
    },
    
    {
      title: "Cable Management",
      content: `<p class="mb-4">Organize os cabos atrás da placa mãe. Isso melhora o fluxo de ar e a estética do setup.</p>`,
      subsections: []
    }
    ,
    {
      title: "Conclusão e Recomendações",
      content: `
        <p class="mb-4">Esperamos que este guia sobre <strong>Guia Básico para Montar seu Primeiro PC Gamer</strong> tenha sido útil. A tecnologia exige aprendizado constante e manutenção preventiva.</p>
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
