import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Dicas Avançadas para Proteger sua Rede Wi-Fi";
const description = "Vá além da senha forte. Oculte SSID, filtre MAC e crie redes de convidados.";
const keywords = ["proteger wifi","ocultar rede","filtro mac","rede convidados"];

export const metadata: Metadata = createGuideMetadata(title, description, keywords);

export default function GuidePage() {
  const contentSections = [
    {
      title: "Introdução",
      content: `
        <p class="mb-4">Este guia foi elaborado para resolver dúvidas comuns sobre <strong>Dicas Avançadas para Proteger sua Rede Wi-Fi</strong>. Nossa equipe técnica compilou as melhores práticas e soluções testadas para garantir que você obtenha resultados profissionais.</p>
        <p>Abaixo, detalhamos os passos principais e conceitos fundamentais para dominar este tópico.</p>
      `,
    },
    
    {
      title: "Rede de Convidados",
      content: `<p class="mb-4">Crie uma SSID "Guest" isolada. Assim, visitantes acessam a internet, mas não seus arquivos compartilhados locais.</p>`,
      subsections: []
    },
    
    {
      title: "Atualização de Firmware",
      content: `<p class="mb-4">Verifique no site do fabricante do roteador se há updates. Firmwares antigos têm brechas de segurança conhecidas.</p>`,
      subsections: []
    },
    
    {
      title: "Desativar WPS",
      content: `<p class="mb-4">O WPS (botão de conexão fácil) é extremamente vulnerável a ataques de força bruta. Desative-o nas configurações.</p>`,
      subsections: []
    }
    ,
    {
      title: "Conclusão e Recomendações",
      content: `
        <p class="mb-4">Esperamos que este guia sobre <strong>Dicas Avançadas para Proteger sua Rede Wi-Fi</strong> tenha sido útil. A tecnologia exige aprendizado constante e manutenção preventiva.</p>
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
