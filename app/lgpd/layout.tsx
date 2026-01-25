import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'LGPD - Lei Geral de Proteção de Dados | VOLTRIS',
    description: 'Informações sobre como a VOLTRIS trata seus dados pessoais de acordo com a LGPD. Conheça nossos procedimentos de segurança e privacidade.',
    keywords: ['lgpd', 'proteção de dados', 'privacidade', 'segurança de dados', 'lei geral proteção dados', 'dados pessoais'],
    alternates: {
        canonical: 'https://voltris.com.br/lgpd'
    },
    openGraph: {
        title: 'LGPD - Lei Geral de Proteção de Dados | VOLTRIS',
        description: 'Como a VOLTRIS trata seus dados pessoais de acordo com a LGPD.',
        url: 'https://voltris.com.br/lgpd',
        type: 'website',
        locale: 'pt_BR',
        siteName: 'VOLTRIS',
        images: [{ url: '/logo.png', width: 1200, height: 630, alt: 'VOLTRIS - LGPD' }]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'LGPD | VOLTRIS',
        description: 'Proteção de dados e privacidade.',
        images: ['/logo.png']
    },
    robots: {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 }
    }
};

export default function LGPDLayout({ children }: { children: React.ReactNode }) {
    return children;
}
