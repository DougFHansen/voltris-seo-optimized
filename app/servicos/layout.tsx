import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'IT Services - Technical Support and Web Design | VOLTRIS',
    description: 'Discover all our services: remote technical support, formatting, PC optimization, website creation, software installation and much more. Worldwide service.',
    keywords: ['it services', 'technical support', 'web design', 'computer maintenance', 'IT services', 'remote IT', 'pc formatting', 'windows optimization'],
    alternates: {
        canonical: 'https://www.voltris.com.br/servicos'
    },
    openGraph: {
        title: 'IT Services - Technical Support and Web Design | VOLTRIS',
        description: 'Complete IT Services: remote technical support, formatting, optimization and professional website creation.',
        url: 'https://www.voltris.com.br/servicos',
        type: 'website',
        locale: 'en_US',
        siteName: 'VOLTRIS',
        images: [{ url: '/logo.png', width: 1200, height: 630, alt: 'VOLTRIS - IT Services' }]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'IT Services | VOLTRIS',
        description: 'Complete IT services and remote technical support.',
        images: ['/logo.png']
    },
    robots: {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 }
    }
};

export default function ServicosLayout({ children }: { children: React.ReactNode }) {
    return children;
}
