import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Como Desativar Telemetria e Melhorar Privacidade no Windows";
const description = "Reduza a coleta de dados da Microsoft e ganhe um pouco de desempenho desativando recursos desnecessários.";
const keywords = ["privacidade windows","desativar telemetria","windows espião","proteção dados"];

export const metadata: Metadata = createGuideMetadata(title, description, keywords);

export default function GuidePage() {
  const contentSections = [
    {
      title: "Introdução",
      content: `
        <p class="mb-4">Este guia foi elaborado para resolver dúvidas comuns sobre <strong>Como Desativar Telemetria e Melhorar Privacidade no Windows</strong>. Nossa equipe técnica compilou as melhores práticas e soluções testadas para garantir que você obtenha resultados profissionais.</p>
        <p>Abaixo, detalhamos os passos principais e conceitos fundamentais para dominar este tópico.</p>
      `,
    },
    
    {
      title: "Configurações Nativas",
      content: `<p class="mb-4">Vá em Configurações > Privacidade. Desative: ID de anúncio, Rastreamento de apps, e envie apenas dados de diagnóstico obrigatórios.</p>`,
      subsections: []
    },
    
    {
      title: "Serviços em Segundo Plano",
      content: `<p class="mb-4">Desative serviços como "Experiências de Usuário Conectado e Telemetria" via services.msc para reduzir uso de rede/disco.</p>`,
      subsections: []
    },
    
    {
      title: "Cuidado extra",
      content: `<p class="mb-4">Não use ferramentas que "quebram" o Windows. Desative apenas o necessário via menus oficiais ou ferramentas confiáveis como O&O ShutUp10 (com cautela).</p>`,
      subsections: []
    }
    ,
    {
      title: "Conclusão e Recomendações",
      content: `
        <p class="mb-4">Esperamos que este guia sobre <strong>Como Desativar Telemetria e Melhorar Privacidade no Windows</strong> tenha sido útil. A tecnologia exige aprendizado constante e manutenção preventiva.</p>
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
