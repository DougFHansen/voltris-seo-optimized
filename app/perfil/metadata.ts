import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Perfil do Usuário | VOLTRIS',
  description: 'Gerencie seus dados, pedidos e preferências em seu perfil na VOLTRIS. Segurança, privacidade e controle total da sua conta.',
  openGraph: {
    title: 'Perfil do Usuário | VOLTRIS',
    description: 'Gerencie seus dados, pedidos e preferências em seu perfil na VOLTRIS. Segurança, privacidade e controle total da sua conta.',
    url: 'https://www.voltris.com.br/profile',
    type: 'website',
    images: [
      {
        url: 'https://www.voltris.com.br/logo.png',
        width: 1200,
        height: 630,
        alt: 'Logo VOLTRIS'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Perfil do Usuário | VOLTRIS',
    description: 'Gerencie seus dados, pedidos e preferências em seu perfil na VOLTRIS. Segurança, privacidade e controle total da sua conta.',
    images: ['https://www.voltris.com.br/logo.png']
  },
  robots: {
    index: false,
    follow: true,
  },
}; 
