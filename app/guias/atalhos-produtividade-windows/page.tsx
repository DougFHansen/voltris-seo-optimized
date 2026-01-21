import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Os Melhores Atalhos de Teclado para Windows";
const description = "Aumente sua produtividade dominando os atalhos de teclado mais úteis do Windows 10 e 11.";
const keywords = ["atalhos windows","teclas atalho","produtividade pc","dicas teclado"];

export const metadata: Metadata = createGuideMetadata(title, description, keywords);

export default function GuidePage() {
  const contentSections = [
    {
      title: "Introdução",
      content: `
        <p class="mb-4">Este guia foi elaborado para resolver dúvidas comuns sobre <strong>Os Melhores Atalhos de Teclado para Windows</strong>. Nossa equipe técnica compilou as melhores práticas e soluções testadas para garantir que você obtenha resultados profissionais.</p>
        <p>Abaixo, detalhamos os passos principais e conceitos fundamentais para dominar este tópico.</p>
      `,
    },
    
    {
      title: "Gerenciamento de Janelas",
      content: `<p class="mb-4">Win + Setas para dividir tela. Win + D para mostrar desktop. Alt + Tab para alternar apps.</p>`,
      subsections: []
    },
    
    {
      title: "Explorador de Arquivos",
      content: `<p class="mb-4">Win + E abre o Explorador. F2 renomeia arquivos. Ctrl + Shift + N cria nova pasta.</p>`,
      subsections: []
    },
    
    {
      title: "Sistema",
      content: `<p class="mb-4">Win + X abre menu rápido de admin. Win + L bloqueia o PC. Ctrl + Shift + Esc abre o Gerenciador de Tarefas diretamente.</p>`,
      subsections: []
    }
    ,
    {
      title: "Conclusão e Recomendações",
      content: `
        <p class="mb-4">Esperamos que este guia sobre <strong>Os Melhores Atalhos de Teclado para Windows</strong> tenha sido útil. A tecnologia exige aprendizado constante e manutenção preventiva.</p>
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
