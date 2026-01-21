import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Como Configurar e Proteger seu Roteador Wi-Fi";
const description = "Melhore a segurança e o alcance da sua rede doméstica com estas configurações essenciais de roteador.";
const keywords = ["configurar roteador","segurança wifi","mudar senha wifi","melhor canal wifi"];

export const metadata: Metadata = createGuideMetadata(title, description, keywords);

export default function GuidePage() {
  const contentSections = [
    {
      title: "Introdução",
      content: `
        <p class="mb-4">Este guia foi elaborado para resolver dúvidas comuns sobre <strong>Como Configurar e Proteger seu Roteador Wi-Fi</strong>. Nossa equipe técnica compilou as melhores práticas e soluções testadas para garantir que você obtenha resultados profissionais.</p>
        <p>Abaixo, detalhamos os passos principais e conceitos fundamentais para dominar este tópico.</p>
      `,
    },
    
    {
      title: "Acesse o Painel Admin",
      content: `<p class="mb-4">Digite o IP do gateway (geralmente 192.168.0.1 ou 1.1) no navegador. Use as credenciais padrão (admin/admin) e MUDE-AS imediatamente.</p>`,
      subsections: []
    },
    
    {
      title: "Criptografia Forte",
      content: `<p class="mb-4">Certifique-se de usar WPA2-AES ou WPA3. Evite WEP ou WPA-TKIP que são vulneráveis.</p>`,
      subsections: []
    },
    
    {
      title: "Otimização de Canal",
      content: `<p class="mb-4">Utilize apps como WiFi Analyzer para encontrar canais menos congestionados (geralmente 1, 6 ou 11 para 2.4GHz) e melhore a estabilidade.</p>`,
      subsections: []
    }
    ,
    {
      title: "Conclusão e Recomendações",
      content: `
        <p class="mb-4">Esperamos que este guia sobre <strong>Como Configurar e Proteger seu Roteador Wi-Fi</strong> tenha sido útil. A tecnologia exige aprendizado constante e manutenção preventiva.</p>
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
