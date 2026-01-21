import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Como Atualizar Drivers de Placa de Vídeo (NVIDIA/AMD)";
const description = "Garanta o melhor desempenho em jogos e corrigindo bugs visuais mantendo sua GPU atualizada.";
const keywords = ["atualizar driver video","geforce experience","amd adrenalin","driver gpu"];

export const metadata: Metadata = createGuideMetadata(title, description, keywords);

export default function GuidePage() {
  const contentSections = [
    {
      title: "Introdução",
      content: `
        <p class="mb-4">Este guia foi elaborado para resolver dúvidas comuns sobre <strong>Como Atualizar Drivers de Placa de Vídeo (NVIDIA/AMD)</strong>. Nossa equipe técnica compilou as melhores práticas e soluções testadas para garantir que você obtenha resultados profissionais.</p>
        <p>Abaixo, detalhamos os passos principais e conceitos fundamentais para dominar este tópico.</p>
      `,
    },
    
    {
      title: "NVIDIA",
      content: `<p class="mb-4">Baixe o GeForce Experience. Ele notifica novos "Game Ready Drivers" e permite instalação expressa.</p>`,
      subsections: []
    },
    
    {
      title: "AMD",
      content: `<p class="mb-4">Use o AMD Adrenalin Software. Além de drivers, oferece ferramentas de overlay e ajuste de performance.</p>`,
      subsections: []
    },
    
    {
      title: "DDU (Instalação Limpa)",
      content: `<p class="mb-4">Se tiver problemas, use o Display Driver Uninstaller (DDU) para remover completamente drivers antigos antes de instalar o novo.</p>`,
      subsections: []
    }
    ,
    {
      title: "Conclusão e Recomendações",
      content: `
        <p class="mb-4">Esperamos que este guia sobre <strong>Como Atualizar Drivers de Placa de Vídeo (NVIDIA/AMD)</strong> tenha sido útil. A tecnologia exige aprendizado constante e manutenção preventiva.</p>
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
