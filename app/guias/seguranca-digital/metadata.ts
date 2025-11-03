import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Guia de Segurança Digital Essencial | Proteção Contra Vírus e Malware | VOLTRIS',
  description: 'Proteja seu computador contra vírus, malware e ataques cibernéticos. Guia completo sobre antivírus, firewall, senhas seguras, navegação segura e melhores práticas de segurança digital.',
  keywords: [
    'segurança digital',
    'proteção contra vírus',
    'antivírus Windows',
    'segurança computador',
    'proteção malware',
    'senhas seguras',
    'navegação segura',
    'firewall Windows',
    'proteção ransomware',
    'segurança online',
    'cybersecurity',
    'proteção dados',
    'privacidade digital',
    'autenticação dois fatores',
    'phishing proteção',
    'gerenciador senhas',
    'atualizações segurança',
    'proteção contra hackers'
  ],
  openGraph: {
    title: 'Guia de Segurança Digital Essencial | Proteção Contra Vírus e Malware | VOLTRIS',
    description: 'Proteja seu computador contra vírus, malware e ataques cibernéticos. Guia completo de segurança digital.',
    url: 'https://voltris.com.br/guias/seguranca-digital',
    siteName: 'VOLTRIS',
    images: [
      {
        url: 'https://voltris.com.br/logo.png',
        width: 1200,
        height: 630,
        alt: 'Guia de Segurança Digital - VOLTRIS',
      },
    ],
    locale: 'pt_BR',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Guia de Segurança Digital Essencial | VOLTRIS',
    description: 'Proteja seu computador contra vírus e malware. Guia completo de segurança digital.',
    images: ['https://voltris.com.br/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://voltris.com.br/guias/seguranca-digital',
  },
};

