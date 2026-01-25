import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Plano Básico - Criação de Sites Profissionais | VOLTRIS',
    description: 'Plano Básico de criação de sites. Site profissional, responsivo e otimizado para SEO. Ideal para pequenos negócios e profissionais autônomos. A partir de R$ 497.',
    keywords: ['plano básico site', 'site profissional barato', 'criar site básico', 'site pequeno negócio', 'site profissional autônomo'],
    alternates: {
        canonical: 'https://voltris.com.br/todos-os-servicos/criacao-de-sites/plano-basico'
    },
    openGraph: {
        title: 'Plano Básico - Criação de Sites Profissionais | VOLTRIS',
        description: 'Site profissional, responsivo e otimizado para SEO. Ideal para pequenos negócios.',
        url: 'https://voltris.com.br/todos-os-servicos/criacao-de-sites/plano-basico',
        type: 'website',
        locale: 'pt_BR',
        siteName: 'VOLTRIS',
        images: [{ url: '/logo.png', width: 1200, height: 630, alt: 'VOLTRIS - Plano Básico' }]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Plano Básico - Criação de Sites | VOLTRIS',
        description: 'Site profissional para pequenos negócios.',
        images: ['/logo.png']
    },
    robots: {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 }
    }
};

export default function PlanoBasicoLayout({ children }: { children: React.ReactNode }) {
    return children;
}
