import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Como Criar um Pen Drive Bootável do Windows";
const description = "A ferramenta essencial para formatar ou reparar PCs. Saiba como criar um usando Rufus ou Media Creation Tool.";
const keywords = ["pendrive bootavel","rufus tutorial","instalação windows usb","iso windows"];

export const metadata: Metadata = createGuideMetadata(title, description, keywords);

export default function GuidePage() {
  const contentSections = [
    {
      title: "Introdução",
      content: `
        <p class="mb-4">Este guia foi elaborado para resolver dúvidas comuns sobre <strong>Como Criar um Pen Drive Bootável do Windows</strong>. Nossa equipe técnica compilou as melhores práticas e soluções testadas para garantir que você obtenha resultados profissionais.</p>
        <p>Abaixo, detalhamos os passos principais e conceitos fundamentais para dominar este tópico.</p>
      `,
    },
    
    {
      title: "Media Creation Tool",
      content: `<p class="mb-4">A opção oficial e mais fácil. Baixe da Microsoft, execute e escolha "Criar mídia de instalação".</p>`,
      subsections: []
    },
    
    {
      title: "Rufus",
      content: `<p class="mb-4">Para usuários avançados. Permite baixar ISOs, remover requisitos do Windows 11 (TPM) e criar pendrives para BIOS legadas (MBR).</p>`,
      subsections: []
    },
    
    {
      title: "Uso",
      content: `<p class="mb-4">Insira no PC desligado, ligue pressionando a tecla de Boot Menu (F8, F11, F12 dependendo da marca) e selecione o USB.</p>`,
      subsections: []
    }
    ,
    {
      title: "Conclusão e Recomendações",
      content: `
        <p class="mb-4">Esperamos que este guia sobre <strong>Como Criar um Pen Drive Bootável do Windows</strong> tenha sido útil. A tecnologia exige aprendizado constante e manutenção preventiva.</p>
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
