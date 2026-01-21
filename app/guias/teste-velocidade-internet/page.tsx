import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Como Testar Corretamente sua Velocidade de Internet";
const description = "Sua internet está lenta? Aprenda a medir Ping, Download e Upload de forma precisa.";
const keywords = ["teste velocidade","speedtest","internet lenta","ping alto"];

export const metadata: Metadata = createGuideMetadata(title, description, keywords);

export default function GuidePage() {
  const contentSections = [
    {
      title: "Introdução",
      content: `
        <p class="mb-4">Este guia foi elaborado para resolver dúvidas comuns sobre <strong>Como Testar Corretamente sua Velocidade de Internet</strong>. Nossa equipe técnica compilou as melhores práticas e soluções testadas para garantir que você obtenha resultados profissionais.</p>
        <p>Abaixo, detalhamos os passos principais e conceitos fundamentais para dominar este tópico.</p>
      `,
    },
    
    {
      title: "Preparação",
      content: `<p class="mb-4">Feche downloads, streamings e jogos. Se possível, conecte via cabo Ethernet para evitar oscilação do Wi-Fi.</p>`,
      subsections: []
    },
    
    {
      title: "Melhores Sites",
      content: `<p class="mb-4">Speedtest.net (Ookla), Fast.com (Netflix) e Brasil Banda Larga (EAQ/Anatel) são os mais confiáveis.</p>`,
      subsections: []
    },
    
    {
      title: "Entendendo Resultados",
      content: `<p class="mb-4">Ping < 20ms é ótimo para jogos. Download deve estar próximo do contratado. Upload geralmente é 50% do download (exceto fibra simétrica).</p>`,
      subsections: []
    }
    ,
    {
      title: "Conclusão e Recomendações",
      content: `
        <p class="mb-4">Esperamos que este guia sobre <strong>Como Testar Corretamente sua Velocidade de Internet</strong> tenha sido útil. A tecnologia exige aprendizado constante e manutenção preventiva.</p>
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
