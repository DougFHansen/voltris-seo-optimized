import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Como Limpar Cache e Cookies Corretamente";
const description = "Resolva problemas de carregamento de sites e proteja sua privacidade limpando os dados de navegação.";
const keywords = ["limpar cache","apagar cookies","historico navegador","chrome lento"];

export const metadata: Metadata = createGuideMetadata(title, description, keywords);

export default function GuidePage() {
  const contentSections = [
    {
      title: "Introdução",
      content: `
        <p class="mb-4">Este guia foi elaborado para resolver dúvidas comuns sobre <strong>Como Limpar Cache e Cookies Corretamente</strong>. Nossa equipe técnica compilou as melhores práticas e soluções testadas para garantir que você obtenha resultados profissionais.</p>
        <p>Abaixo, detalhamos os passos principais e conceitos fundamentais para dominar este tópico.</p>
      `,
    },
    
    {
      title: "Google Chrome",
      content: `<p class="mb-4">Pressione Ctrl + Shift + Del. Selecione "Todo o período", marque "Imagens e arquivos em cache" e "Cookies". Clique em Limpar dados.</p>`,
      subsections: []
    },
    
    {
      title: "Privacidade",
      content: `<p class="mb-4">Limpar cookies desconecta você de sites, mas remove rastreadores. O cache limpo força o navegador a baixar versões novas dos sites.</p>`,
      subsections: []
    },
    
    {
      title: "Quando Fazer",
      content: `<p class="mb-4">Faça isso quando sites apresentarem erros de formatação, login, ou lentidão excessiva.</p>`,
      subsections: []
    }
    ,
    {
      title: "Conclusão e Recomendações",
      content: `
        <p class="mb-4">Esperamos que este guia sobre <strong>Como Limpar Cache e Cookies Corretamente</strong> tenha sido útil. A tecnologia exige aprendizado constante e manutenção preventiva.</p>
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
