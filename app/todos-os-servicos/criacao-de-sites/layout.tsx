import { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
    title: 'Criação de Sites - Planos Básico, Profissional e Empresarial | VOLTRIS',
    description: 'Contrate criação de sites profissionais: design responsivo, SEO e hospedagem. Planos básico, profissional e empresarial. Orçamento sem compromisso.',
    keywords: [
        'criação de sites',
        'desenvolvimento web',
        'design responsivo',
        'SEO',
        'hospedagem',
        'sites profissionais',
        'desenvolvimento de sites',
        'web design'
    ],
    alternates: {
        canonical: '/todos-os-servicos/criacao-de-sites',
    },
    openGraph: {
        title: 'Criação de Sites - Planos Básico, Profissional e Empresarial | VOLTRIS',
        description: 'Sites profissionais com design responsivo, SEO e hospedagem. Planos para pequenos negócios e empresas.',
        url: 'https://voltris.com.br/todos-os-servicos/criacao-de-sites',
        type: 'website',
        images: [
            {
                url: '/logo.png',
                width: 1200,
                height: 630,
                alt: 'Criação de Sites Profissionais VOLTRIS',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Criação de Sites - Planos Básico, Profissional e Empresarial | VOLTRIS',
        description: 'Sites profissionais com design responsivo, SEO e hospedagem. Planos para todos os portes.',
        images: ['/logo.png'],
    },
};

export default function CriacaoSitesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "Criação de Sites Profissionais",
        "description": "Criação de sites profissionais com design responsivo, otimização SEO e hospedagem incluída",
        "provider": {
            "@type": "Organization",
            "name": "VOLTRIS",
            "url": "https://voltris.com.br"
        },
        "serviceType": "Desenvolvimento Web",
        "areaServed": {
            "@type": "Country",
            "name": "Brasil"
        },
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Planos de Criação de Sites",
            "itemListElement": [
                {
                    "@type": "Offer",
                    "name": "Plano Básico",
                    "price": "997.00",
                    "priceCurrency": "BRL",
                    "description": "Site de até 5 páginas com design responsivo e otimização básica SEO"
                },
                {
                    "@type": "Offer",
                    "name": "Plano Profissional",
                    "price": "1997.00",
                    "priceCurrency": "BRL",
                    "description": "Site de até 10 páginas com design premium e otimização SEO avançada"
                },
                {
                    "@type": "Offer",
                    "name": "Plano Empresarial",
                    "price": "3997.00",
                    "priceCurrency": "BRL",
                    "description": "Site personalizado com páginas ilimitadas e e-commerce"
                }
            ]
        }
    };

    return (
        <>
            <Script
                id="criacao-sites-structured-data"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(structuredData),
                }}
            />
            {children}
        </>
    );
}
