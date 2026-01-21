import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Como Resolver Problemas de Áudio no Windows";
const description = "Sem som? Microfone chiando? Veja como diagnosticar e consertar problemas de áudio comuns.";
const keywords = ["pc sem som","audio nao funciona","driver realtek","microfone baixo"];

export const metadata: Metadata = createGuideMetadata(title, description, keywords);

export default function GuidePage() {
  const contentSections = [
    {
      title: "Introdução",
      content: `
        <p class="mb-4">Este guia foi elaborado para resolver dúvidas comuns sobre <strong>Como Resolver Problemas de Áudio no Windows</strong>. Nossa equipe técnica compilou as melhores práticas e soluções testadas para garantir que você obtenha resultados profissionais.</p>
        <p>Abaixo, detalhamos os passos principais e conceitos fundamentais para dominar este tópico.</p>
      `,
    },
    
    {
      title: "Verificações Básicas",
      content: `<p class="mb-4">Confira se o dispositivo de saída correto está selecionado na barra de tarefas. Verifique cabos e mute físico.</p>`,
      subsections: []
    },
    
    {
      title: "Solução de Problemas do Windows",
      content: `<p class="mb-4">Clique com botão direito no ícone de som > Solucionar problemas de som. O Windows pode reiniciar o serviço de áudio automaticamente.</p>`,
      subsections: []
    },
    
    {
      title: "Drivers",
      content: `<p class="mb-4">Gerenciador de Dispositivos > Controladores de som > Desinstalar dispositivo. Reinicie o PC para o Windows reinstalar o driver genérico.</p>`,
      subsections: []
    }
    ,
    {
      title: "Conclusão e Recomendações",
      content: `
        <p class="mb-4">Esperamos que este guia sobre <strong>Como Resolver Problemas de Áudio no Windows</strong> tenha sido útil. A tecnologia exige aprendizado constante e manutenção preventiva.</p>
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
