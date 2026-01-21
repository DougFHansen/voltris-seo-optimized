import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Como Escolher o Monitor Ideal para Trabalho e Jogos";
const description = "Hz, IPS, TN, Resolução? Entenda as sopas de letrinhas e compre o monitor certo.";
const keywords = ["escolher monitor","144hz vs 60hz","painel ips","monitor 4k"];

export const metadata: Metadata = createGuideMetadata(title, description, keywords);

export default function GuidePage() {
  const contentSections = [
    {
      title: "Introdução",
      content: `
        <p class="mb-4">Este guia foi elaborado para resolver dúvidas comuns sobre <strong>Como Escolher o Monitor Ideal para Trabalho e Jogos</strong>. Nossa equipe técnica compilou as melhores práticas e soluções testadas para garantir que você obtenha resultados profissionais.</p>
        <p>Abaixo, detalhamos os passos principais e conceitos fundamentais para dominar este tópico.</p>
      `,
    },
    
    {
      title: "Tipo de Painel",
      content: `<p class="mb-4">IPS (Cores fiéis, melhores ângulos), TN (Mais rápido, cores lavadas), VA (Contraste alto, pretos profundos).</p>`,
      subsections: []
    },
    
    {
      title: "Taxa de Atualização",
      content: `<p class="mb-4">60Hz (Padrão escritório), 144Hz+ (Essencial para jogos competitivos de tiro), 240Hz+ (Profissional).</p>`,
      subsections: []
    },
    
    {
      title: "Resolução x Tamanho",
      content: `<p class="mb-4">Full HD até 24". Quad HD (2K) ideal para 27". 4K recomendado para 32" ou mais. DPI importa para nitidez de texto.</p>`,
      subsections: []
    }
    ,
    {
      title: "Conclusão e Recomendações",
      content: `
        <p class="mb-4">Esperamos que este guia sobre <strong>Como Escolher o Monitor Ideal para Trabalho e Jogos</strong> tenha sido útil. A tecnologia exige aprendizado constante e manutenção preventiva.</p>
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
