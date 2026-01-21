import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Guia de Instalação Limpa do Windows 11";
const description = "Aprenda passo a passo como fazer uma instalação limpa do Windows 11, garantindo máximo desempenho e sistema livre de bloatware.";
const keywords = ["instalação windows 11","formatar pc","windows 11 limpo","instalar windows usb"];

export const metadata: Metadata = createGuideMetadata(title, description, keywords);

export default function GuidePage() {
  const contentSections = [
    {
      title: "Introdução",
      content: `
        <p class="mb-4">Este guia foi elaborado para resolver dúvidas comuns sobre <strong>Guia de Instalação Limpa do Windows 11</strong>. Nossa equipe técnica compilou as melhores práticas e soluções testadas para garantir que você obtenha resultados profissionais.</p>
        <p>Abaixo, detalhamos os passos principais e conceitos fundamentais para dominar este tópico.</p>
      `,
    },
    
    {
      title: "Requisitos do Sistema",
      content: `<p class="mb-4">Antes de começar, verifique se seu PC atende aos requisitos mínimos: TPM 2.0, Secure Boot, Processador compatível de 64 bits, 4GB de RAM e 64GB de armazenamento.</p>`,
      subsections: []
    },
    
    {
      title: "Criando o Pen Drive Bootável",
      content: `<p class="mb-4">Use a ferramenta Media Creation Tool da Microsoft. Baixe-a do site oficial, insira um pen drive de 8GB+ e siga as instruções para criar a mídia de instalação.</p>`,
      subsections: []
    },
    
    {
      title: "O Processo de Instalação",
      content: `<p class="mb-4">Reinicie o PC com o pen drive conectado. Acesse a BIOS/UEFI para alterar a ordem de boot. No instalador, escolha "Instalação Personalizada", exclua as partições antigas e instale no espaço não alocado.</p>`,
      subsections: []
    }
    ,
    {
      title: "Conclusão e Recomendações",
      content: `
        <p class="mb-4">Esperamos que este guia sobre <strong>Guia de Instalação Limpa do Windows 11</strong> tenha sido útil. A tecnologia exige aprendizado constante e manutenção preventiva.</p>
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
