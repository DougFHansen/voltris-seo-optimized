import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Como Identificar e Evitar E-mails de Phishing";
const description = "Não caia em golpes. Aprenda a reconhecer e-mails falsos de bancos e serviços.";
const keywords = ["phishing email","golpe internet","segurança email","fraude bancaria"];

export const metadata: Metadata = createGuideMetadata(title, description, keywords);

export default function GuidePage() {
  const contentSections = [
    {
      title: "Introdução",
      content: `
        <p class="mb-4">Este guia foi elaborado para resolver dúvidas comuns sobre <strong>Como Identificar e Evitar E-mails de Phishing</strong>. Nossa equipe técnica compilou as melhores práticas e soluções testadas para garantir que você obtenha resultados profissionais.</p>
        <p>Abaixo, detalhamos os passos principais e conceitos fundamentais para dominar este tópico.</p>
      `,
    },
    
    {
      title: "Verifique o Remetente",
      content: `<p class="mb-4">Bancos nunca usam domínios públicos (ex: @gmail.com) ou domínios estranhos (ex: @itau-seguranca-verify.com).</p>`,
      subsections: []
    },
    
    {
      title: "Senso de Urgência",
      content: `<p class="mb-4">Golpistas usam medo: "Sua conta será bloqueada hoje!". Instituições sérias não fazem isso por e-mail.</p>`,
      subsections: []
    },
    
    {
      title: "Links Suspeitos",
      content: `<p class="mb-4">Passe o mouse sobre o link (sem clicar). Se o endereço real for diferente do texto exibido, é golpe. Delete imediatamente.</p>`,
      subsections: []
    }
    ,
    {
      title: "Conclusão e Recomendações",
      content: `
        <p class="mb-4">Esperamos que este guia sobre <strong>Como Identificar e Evitar E-mails de Phishing</strong> tenha sido útil. A tecnologia exige aprendizado constante e manutenção preventiva.</p>
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
