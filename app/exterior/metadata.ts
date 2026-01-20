import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'VOLTRIS Exterior - Serviços de TI Premium para Brasileiros no Exterior',
  description: '✓ Empresa brasileira especializada em suporte técnico remoto para expatriados ✓ Atendimento exclusivo em português ✓ Formatação, otimização e segurança digital ✓ Serviços internacionais com qualidade brasileira',
  keywords: [
    'serviços de ti para brasileiros no exterior',
    'suporte técnico remoto internacional',
    'empresa brasileira de tecnologia exterior',
    'formatação de pc para expatriados',
    'otimização de sistema internacional',
    'suporte técnico em português para estrangeiros',
    'tecnologia para brasileiros fora do brasil',
    'serviços de informática internacionais',
    'suporte remoto para expatriados brasileiros',
    'ti premium para brasileiros no exterior'
  ],
  authors: [{ name: "VOLTRIS" }],
  creator: "VOLTRIS",
  publisher: "VOLTRIS",
  metadataBase: new URL('https://voltris.com.br/exterior'),
  alternates: {
    canonical: '/exterior',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://voltris.com.br/exterior',
    siteName: 'VOLTRIS Exterior',
    title: 'VOLTRIS Exterior - Serviços de TI Premium para Brasileiros no Exterior',
    description: 'Empresa brasileira especializada em oferecer soluções tecnológicas de alta qualidade para expatriados. Atendimento exclusivo em português com padrões internacionais de excelência.',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'VOLTRIS Exterior - Serviços de TI para Brasileiros no Exterior',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VOLTRIS Exterior - Serviços de TI Premium para Brasileiros no Exterior',
    description: 'Empresa brasileira de tecnologia especializada em suporte técnico remoto para expatriados. Atendimento exclusivo em português com qualidade internacional.',
    images: ['/logo.png'],
    creator: '@voltris',
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
};