import React from 'react';

interface ReviewItem {
  author: string;
  datePublished: string;
  reviewRating: number;
  reviewBody: string;
}

interface ReviewSchemaProps {
  productName: string;
  description: string;
  brand: string;
  aggregateRating: number;
  reviewCount: number;
  reviews?: ReviewItem[];
  bestRating?: number;
  worstRating?: number;
}

export default function ReviewSchema({ 
  productName, 
  description, 
  brand, 
  aggregateRating, 
  reviewCount, 
  reviews = [],
  bestRating = 5,
  worstRating = 1 
}: ReviewSchemaProps) {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": productName,
    "description": description,
    "brand": {
      "@type": "Brand",
      "name": brand
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": aggregateRating,
      "reviewCount": reviewCount,
      "bestRating": bestRating,
      "worstRating": worstRating
    },
    "offers": {
      "@type": "Offer",
      "price": "29.90",
      "priceCurrency": "BRL",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "VOLTRIS"
      }
    },
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Windows 10, Windows 11",
    "features": [
      "Otimização automática de sistema",
      "Controle remoto via web",
      "Modo Gamer inteligente",
      "Limpeza profunda de arquivos",
      "Otimização de rede",
      "Monitoramento em tempo real"
    ]
  };

  // Adicionar reviews individuais se fornecidos
  if (reviews.length > 0) {
    (schemaData as any).review = reviews.map(review => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": review.author
      },
      "datePublished": review.datePublished,
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": review.reviewRating
      },
      "reviewBody": review.reviewBody
    }));
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData, null, 2) }}
    />
  );
}

// Reviews predefinidos para o Voltris Optimizer
export const voltrisOptimizerReviews: ReviewItem[] = [
  {
    author: "Carlos Silva",
    datePublished: "2026-03-15",
    reviewRating: 5,
    reviewBody: "Software incrível! Meu PC ganhou nova vida. FPS no CS2 subiu de 120 para 280 estáveis. Vale cada centavo!"
  },
  {
    author: "Ana Mendes",
    datePublished: "2026-03-10",
    reviewRating: 4,
    reviewBody: "Muito bom para otimizar Windows 11. Reduziu o uso de RAM em 2GB. Interface intuitiva e suporte excelente."
  },
  {
    author: "Roberto Santos",
    datePublished: "2026-03-05",
    reviewRating: 5,
    reviewBody: "Como streamer, a otimização de rede fez diferença enorme. Ping estável e zero quedas durante lives. Recomendo!"
  },
  {
    author: "Juliana Costa",
    datePublished: "2026-02-28",
    reviewRating: 5,
    reviewBody: "O controle remoto via web é genial! Consigo otimizar todos os PCs da empresa de um só lugar. Revolucionou nosso suporte."
  },
  {
    author: "Marcos Oliveira",
    datePublished: "2026-02-20",
    reviewRating: 4,
    reviewBody: "Gostei muito do modo gamer. Meu notebook antigo agora roda Fortnite em 60 FPS estáveis. Bom investimento!"
  }
];

// Reviews para serviços de suporte técnico
export const suporteTecnicoReviews: ReviewItem[] = [
  {
    author: "Fernanda Lima",
    datePublished: "2026-03-18",
    reviewRating: 5,
    reviewBody: "Suporte rápido e eficiente. Resolvi problema de formatação em menos de 2 horas. Atendimento online muito prático!"
  },
  {
    author: "Pedro Henrique",
    datePublished: "2026-03-12",
    reviewRating: 5,
    reviewBody: "Técnico muito capacitado. Otimizou meu PC para jogos e a diferença foi enorme. Preço justo e serviço de qualidade."
  },
  {
    author: "Luciana Ferreira",
    datePublished: "2026-03-08",
    reviewRating: 4,
    reviewBody: "Bom serviço de manutenção preventiva. PC ficou muito mais rápido e estável. Recomendo para empresas."
  }
];
