import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'IT Services for Brazilians Abroad | VOLTRIS',
    description: 'Complete IT services for Brazilians living abroad. Remote technical support, website creation, cloud solutions, and technology consulting. Available worldwide 24/7.',
    keywords: ['it services abroad', 'brazilian it support', 'remote tech support', 'website creation abroad', 'cloud solutions'],
    alternates: {
        canonical: 'https://voltris.com.br/exterior/servicos'
    },
    openGraph: {
        title: 'IT Services for Brazilians Abroad | VOLTRIS',
        description: 'Complete IT services for Brazilians living abroad. Available worldwide 24/7.',
        url: 'https://voltris.com.br/exterior/servicos',
        type: 'website',
        locale: 'en_US',
        siteName: 'VOLTRIS',
        images: [{ url: '/logo.png', width: 1200, height: 630, alt: 'VOLTRIS - Services' }]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'IT Services Abroad | VOLTRIS',
        description: 'Complete IT services for Brazilians abroad.',
        images: ['/logo.png']
    },
    robots: {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 }
    }
};

export default function ExteriorServicosLayout({ children }: { children: React.ReactNode }) {
    return children;
}
