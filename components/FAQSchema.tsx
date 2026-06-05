import React from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  faqs: FAQItem[];
}

export default function FAQSchema({ faqs }: FAQSchemaProps) {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData, null, 2) }}
    />
  );
}

// FAQ predefinidos para diferentes categorias
export const ssdFAQs: FAQItem[] = [
  {
    question: "Vale a pena trocar HD por SSD em 2026?",
    answer: "Sim! SSD oferece até 10x mais velocidade de leitura, reduzindo tempo de carregamento de jogos e sistema em 80%. O custo-benefício atual é excelente com SSDs de 1TB custando R$ 200-350."
  },
  {
    question: "NVMe é muito melhor que SSD SATA?",
    answer: "Para jogos e uso diário, a diferença é mínima (5-15%). NVMe brilha em transferência de arquivos grandes e trabalho profissional. Para orçamento limitado, SSD SATA ainda é a melhor escolha."
  },
  {
    question: "Posso usar SSD e HD juntos?",
    answer: "Sim! Use SSD para Windows e programas principais, HD para armazenamento de arquivos e jogos menos usados. Esta configuração oferece o melhor equilíbrio entre performance e custo."
  }
];

export const dnsFAQs: FAQItem[] = [
  {
    question: "Mudar DNS realmente reduz ping?",
    answer: "DNS não reduz ping durante a partida, mas melhora estabilidade de conexão, velocidade de login e reduz quedas no lobby. DNS ruim causa desconexões e lentidão inicial."
  },
  {
    question: "Qual o melhor DNS para jogos no Brasil?",
    answer: "Cloudflare (1.1.1.1) é o mais rápido na maioria das regiões. Google (8.8.8.8) oferece maior estabilidade. Teste ambos para descobrir qual funciona melhor na sua conexão."
  },
  {
    question: "Como configurar DNS no Windows 11?",
    answer: "Vá em Configurações > Rede e Internet > Propriedades do adaptador > IPv4 > Use os seguintes DNS. Digite 1.1.1.1 e 1.0.0.1 (Cloudflare) ou 8.8.8.8 e 8.8.4.4 (Google)."
  }
];

export const windowsFAQs: FAQItem[] = [
  {
    question: "É seguro remover apps do Windows 11?",
    answer: "Sim, se criar ponto de restauração antes. Apps como Candy Crush, Xbox Game Bar e Clima podem ser removidos sem afetar o sistema. Use scripts PowerShell seguros ou Voltris Optimizer."
  },
  {
    question: "Quanto RAM posso liberar com debloat?",
    answer: "Normalmente 1-2GB de RAM e 5-10% de uso de CPU. O ganho depende de quantos apps pré-instalados seu PC veio e quais serviços você desativa."
  },
  {
    question: "Preciso fazer debloat toda vez?",
    answer: "Não! Uma vez é suficiente. Atualizações do Windows podem reinstalar alguns apps, mas o Voltris Optimizer pode manter seu sistema limpo automaticamente."
  }
];

export const overwatchFAQs: FAQItem[] = [
  {
    question: "Reduce Buffering deve ficar ON ou OFF?",
    answer: "ON para PCs potentes (RTX 2070+), OFF para PCs fracos. Reduce Buffering ON reduz input lag mas pode causar perda de FPS em hardware limitado."
  },
  {
    question: "Render Scale 75% ou 100% para competitivo?",
    answer: "75% aumenta FPS e visibilidade em longa distância. Pros usam 75-100% dependendo do hardware. Teste ambos para encontrar seu equilíbrio entre performance e clareza."
  },
  {
    question: "Nvidia Reflex realmente funciona?",
    answer: "Sim! Reflex + Boost pode reduzir input lag em até 40%. Essencial para jogos rápidos como Overwatch. Mantenha sempre ON para melhor responsividade."
  }
];
