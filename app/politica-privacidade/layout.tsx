import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Política de Privacidade - VOLTRIS',
    description: 'Política de privacidade da VOLTRIS. Saiba como coletamos, usamos e protegemos suas informações pessoais. Transparência e segurança em primeiro lugar.',
    keywords: ['política de privacidade', 'privacidade voltris', 'proteção dados pessoais', 'uso de dados', 'segurança informação'],
    alternates: {
        canonical: 'https://voltris.com.br/politica-privacidade'
    },
    openGraph: {
        title: 'Política de Privacidade - VOLTRIS',
        description: 'Como coletamos, usamos e protegemos suas informações pessoais.',
        url: 'https://voltris.com.br/politica-privacidade',
        type: 'website',
        locale: 'pt_BR',
        siteName: 'VOLTRIS',
        images: [{ url: '/logo.png', width: 1200, height: 630, alt: 'VOLTRIS - Política de Privacidade' }]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Política de Privacidade | VOLTRIS',
        description: 'Proteção e privacidade dos seus dados.',
        images: ['/logo.png']
    },
    robots: {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 }
    }
};

export default function PoliticaPrivacidadeLayout({ children }: { children: React.ReactNode }) {
    return children;
}
