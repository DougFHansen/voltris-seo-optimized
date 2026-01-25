import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contact Us - IT Support for Brazilians Abroad | VOLTRIS',
    description: 'Contact VOLTRIS for remote IT support. We help Brazilians living abroad with technical support, website creation, and technology solutions. Available worldwide.',
    keywords: ['contact voltris', 'it support abroad', 'brazilian it support', 'remote tech support', 'contact technical support'],
    alternates: {
        canonical: 'https://voltris.com.br/exterior/contato'
    },
    openGraph: {
        title: 'Contact Us - IT Support for Brazilians Abroad | VOLTRIS',
        description: 'Remote IT support for Brazilians living abroad. Contact us now.',
        url: 'https://voltris.com.br/exterior/contato',
        type: 'website',
        locale: 'en_US',
        siteName: 'VOLTRIS',
        images: [{ url: '/logo.png', width: 1200, height: 630, alt: 'VOLTRIS - Contact' }]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Contact Us | VOLTRIS',
        description: 'IT support for Brazilians abroad.',
        images: ['/logo.png']
    },
    robots: {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 }
    }
};

export default function ExteriorContatoLayout({ children }: { children: React.ReactNode }) {
    return children;
}
