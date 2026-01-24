import { metadata as aboutMetadata } from './metadata';
import Script from 'next/script';

export const metadata = aboutMetadata;

export default function AboutLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "VOLTRIS",
        "description": "Empresa especializada em suporte técnico remoto e criação de sites, com mais de 5000 clientes atendidos e 98% de satisfação.",
        "url": "https://voltris.com.br",
        "logo": "https://voltris.com.br/logo.png",
        "foundingDate": "2015",
        "numberOfEmployees": "10-50",
        "address": {
            "@type": "PostalAddress",
            "addressCountry": "BR"
        },
        "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "availableLanguage": "Portuguese",
            "areaServed": "BR"
        },
        "sameAs": [
            "https://www.facebook.com/voltris",
            "https://www.instagram.com/voltris",
            "https://www.linkedin.com/company/voltris"
        ],
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Serviços de Tecnologia VOLTRIS",
            "itemListElement": [
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Suporte Técnico Remoto",
                        "description": "Suporte remoto especializado em sistemas Windows"
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Criação de Sites",
                        "description": "Desenvolvimento de sites responsivos e otimizados"
                    }
                }
            ]
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": "5000",
            "bestRating": "5",
            "worstRating": "1"
        }
    };

    return (
        <>
            <Script
                id="about-structured-data"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(structuredData),
                }}
            />
            {children}
        </>
    );
}
