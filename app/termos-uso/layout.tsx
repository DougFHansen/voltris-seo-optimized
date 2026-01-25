import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Termos de Uso - VOLTRIS',
    description: 'Termos e condições de uso dos serviços VOLTRIS. Leia atentamente antes de contratar nossos serviços de suporte técnico e criação de sites.',
    keywords: ['termos de uso', 'condições de uso', 'termos serviço', 'contrato voltris', 'termos condições'],
    alternates: {
        canonical: 'https://voltris.com.br/termos-uso'
    },
    openGraph: {
        title: 'Termos de Uso - VOLTRIS',
        description: 'Termos e condições de uso dos nossos serviços.',
        url: 'https://voltris.com.br/termos-uso',
        type: 'website',
        locale: 'pt_BR',
        siteName: 'VOLTRIS',
        images: [{ url: '/logo.png', width: 1200, height: 630, alt: 'VOLTRIS - Termos de Uso' }]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Termos de Uso | VOLTRIS',
        description: 'Termos e condições de uso.',
        images: ['/logo.png']
    },
    robots: {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 }
    }
};

export default function TermosUsoLayout({ children }: { children: React.ReactNode }) {
    return children;
}
