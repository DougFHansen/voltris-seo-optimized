import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'LGPD - Lei Geral de Proteção de Dados | VOLTRIS',
  description: 'Como a VOLTRIS aplica a LGPD: direitos do titular, bases legais, tratamento de dados e contato do encarregado. Conformidade com a Lei 13.709/2018.',
  openGraph: {
    title: 'LGPD - Lei Geral de Proteção de Dados | VOLTRIS',
    description: 'Informações sobre aplicação da LGPD na VOLTRIS: direitos do titular, bases legais e conformidade.',
    url: 'https://voltris.com.br/lgpd',
    type: 'website',
    images: [
      {
        url: 'https://voltris.com.br/logo.png',
        width: 1200,
        height: 630,
        alt: 'Logo VOLTRIS'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LGPD - Lei Geral de Proteção de Dados | VOLTRIS',
    description: 'Conformidade com a LGPD: direitos do titular, bases legais e tratamento de dados.',
    images: ['https://voltris.com.br/logo.png']
  }
}; 