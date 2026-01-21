import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Como Otimizar o PC para Jogos em 2025";
const description = "Dicas práticas para aumentar FPS, reduzir input lag e melhorar a estabilidade dos seus jogos no Windows.";
const keywords = ["otimizar pc jogos","aumentar fps","reduzir input lag","windows modo jogo"];

export const metadata: Metadata = createGuideMetadata(title, description, keywords);

export default function GuidePage() {
  const contentSections = [
    {
      title: "Introdução",
      content: `
        <p class="mb-4">Este guia foi elaborado para resolver dúvidas comuns sobre <strong>Como Otimizar o PC para Jogos em 2025</strong>. Nossa equipe técnica compilou as melhores práticas e soluções testadas para garantir que você obtenha resultados profissionais.</p>
        <p>Abaixo, detalhamos os passos principais e conceitos fundamentais para dominar este tópico.</p>
      `,
    },
    
    {
      title: "Atualize seus Drivers",
      content: `<p class="mb-4">Drivers de vídeo desatualizados são a causa #1 de baixa performance. Mantenha seus drivers NVIDIA ou AMD sempre na última versão estável.</p>`,
      subsections: []
    },
    
    {
      title: "Ative o Modo de Jogo",
      content: `<p class="mb-4">No Windows, vá em Configurações > Jogos > Modo de Jogo e ative-o. Isso prioriza o jogo sobre processos em segundo plano.</p>`,
      subsections: []
    },
    
    {
      title: "Gerencie Energia",
      content: `<p class="mb-4">No Painel de Controle > Opções de Energia, escolha "Alto Desempenho" para garantir que CPU e GPU operem em frequência máxima.</p>`,
      subsections: []
    }
    ,
    {
      title: "Conclusão e Recomendações",
      content: `
        <p class="mb-4">Esperamos que este guia sobre <strong>Como Otimizar o PC para Jogos em 2025</strong> tenha sido útil. A tecnologia exige aprendizado constante e manutenção preventiva.</p>
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
