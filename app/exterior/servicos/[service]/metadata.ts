import { Metadata } from 'next';

// Dados dos serviços internacionais (mesmos dados do page.tsx)
const serviceData = {
  "formatacao": {
    title: "Formatação Remota Internacional",
    description: "Formatação completa do seu computador com instalação de programas essenciais, drivers e configurações otimizadas para uso no exterior.",
  },
  "otimizacao-pc": {
    title: "Otimização de PC para Performance",
    description: "Otimização completa do seu computador para máxima performance, especialmente útil para gamers e profissionais que exigem alta performance.",
  },
  "correcao-erros": {
    title: "Correção de Erros no Windows/Mac",
    description: "Solução rápida de problemas e erros no sistema operacional, crashes, inicialização e outros problemas técnicos.",
  },
  "remocao-virus": {
    title: "Remoção de Vírus e Malware",
    description: "Remoção completa de vírus, malware, spyware e outros programas maliciosos que comprometem a segurança do seu dispositivo.",
  },
  "erros-jogos": {
    title: "Correção de Erros em Jogos",
    description: "Especialistas em resolver problemas em jogos populares como GTA, CS2, Cyberpunk, Valorant, League of Legends e outros títulos internacionais.",
  },
  "instalacao-programas": {
    title: "Instalação de Programas e Softwares",
    description: "Instalação e configuração remota de programas essenciais, softwares especializados e ferramentas de produtividade para uso internacional.",
  },
  "recuperacao-dados": {
    title: "Recuperação de Dados Perdidos",
    description: "Recuperação especializada de arquivos, documentos, fotos e dados importantes perdidos devido a formatação, danos em HDs ou exclusão acidental.",
  },
  "configuracao-redes": {
    title: "Configuração de Redes e Internet",
    description: "Otimização de conexões de internet, configuração de redes Wi-Fi, segurança de roteadores e conectividade com serviços brasileiros do exterior.",
  },
  "suporte-nuvem": {
    title: "Suporte a Serviços em Nuvem",
    description: "Assistência especializada com Google Workspace, Microsoft 365, Dropbox, iCloud e outros serviços em nuvem utilizados internacionalmente.",
  },
  "consultoria": {
    title: "Consultoria de TI Internacional",
    description: "Planejamento estratégico de tecnologia para brasileiros que trabalham remotamente ou possuem negócios internacionais.",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ service: string }> }): Promise<Metadata> {
  const { service } = await params;
  const serviceId = service;
  const serviceObj = serviceData[serviceId as keyof typeof serviceData];

  if (!serviceObj) {
    return {
      title: 'Serviço não encontrado | VOLTRIS',
      description: 'O serviço solicitado não foi encontrado.',
    };
  }

  const title = `${serviceObj.title} | Serviços Internacionais | VOLTRIS`;
  const description = serviceObj.description;

  return {
    title,
    description,
    keywords: `${serviceObj.title.toLowerCase()}, serviços internacionais, suporte técnico exterior, VOLTRIS global`,
    openGraph: {
      title,
      description,
      url: `https://www.voltris.com.br/exterior/servicos/${service}`,
      type: 'website',
      locale: 'pt_BR',
      siteName: 'VOLTRIS',
      images: [
        {
          url: 'https://www.voltris.com.br/logo.png',
          width: 1200,
          height: 630,
          alt: serviceObj.title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://www.voltris.com.br/logo.png'],
      creator: '@voltris'
    },
    alternates: {
      canonical: `https://www.voltris.com.br/exterior/servicos/${service}`
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    }
  };
}
