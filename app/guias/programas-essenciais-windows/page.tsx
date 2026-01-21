import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "10 Programas Essenciais para Todo PC Windows Novo";
const description = "Acabou de formatar ou comprar um PC? Instale estes softwares gratuitos indispensáveis para o dia a dia.";
const keywords = ["programas essenciais pc","softwares uteis windows","kit pos formatação"];

export const metadata: Metadata = createGuideMetadata(title, description, keywords);

export default function GuidePage() {
  const contentSections = [
    {
      title: "Introdução",
      content: `
        <p class="mb-4">Este guia foi elaborado para resolver dúvidas comuns sobre <strong>10 Programas Essenciais para Todo PC Windows Novo</strong>. Nossa equipe técnica compilou as melhores práticas e soluções testadas para garantir que você obtenha resultados profissionais.</p>
        <p>Abaixo, detalhamos os passos principais e conceitos fundamentais para dominar este tópico.</p>
      `,
    },
    
    {
      title: "Navegadores e Comunicação",
      content: `<p class="mb-4">Chrome/Firefox/Edge para navegar. Discord ou Zoom para comunicação.</p>`,
      subsections: []
    },
    
    {
      title: "Segurança e Manutenção",
      content: `<p class="mb-4">Malwarebytes para varreduras ocasionais. HWMonitor para checar temperaturas.</p>`,
      subsections: []
    },
    
    {
      title: "Mídia e Documentos",
      content: `<p class="mb-4">VLC Media Player para vídeos. Adobe Reader ou SumatraPDF para leitura. 7-Zip para descompactar arquivos.</p>`,
      subsections: []
    }
    ,
    {
      title: "Conclusão e Recomendações",
      content: `
        <p class="mb-4">Esperamos que este guia sobre <strong>10 Programas Essenciais para Todo PC Windows Novo</strong> tenha sido útil. A tecnologia exige aprendizado constante e manutenção preventiva.</p>
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
