import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import LocalTecnicoClient from '../LocalTecnicoClient';

interface LocationData {
    slug: string;
    name: string;
    state: string;
    stateAbbr: string;
    neighborhoods: string[];
    description: string;
}

const locations: Record<string, LocationData> = {
    'sao-paulo': {
        slug: 'sao-paulo',
        name: 'São Paulo',
        state: 'São Paulo',
        stateAbbr: 'SP',
        neighborhoods: ['Paulista', 'Itaim Bibi', 'Moema', 'Tatuapé', 'Pinheiros', 'Morumbi', 'Santana', 'Mooca', 'Barra Funda', 'Vila Madalena', 'Ibirapuera', 'Bela Vista'],
        description: 'Suporte técnico de informática em São Paulo. Manutenção de computadores, otimização de PC Gamer e assistência remota na capital paulista.'
    },
    'rio-de-janeiro': {
        slug: 'rio-de-janeiro',
        name: 'Rio de Janeiro',
        state: 'Rio de Janeiro',
        stateAbbr: 'RJ',
        neighborhoods: ['Barra da Tijuca', 'Copacabana', 'Tijuca', 'Recreio', 'Ipanema', 'Botafogo', 'Leblon', 'Flamengo', 'Centro', 'Jacarepaguá', 'Méier', 'Niterói'],
        description: 'Técnico de informática no Rio de Janeiro. Reparo de computadores, suporte Windows e otimização gamer em toda a região carioca.'
    },
    'parana': {
        slug: 'parana',
        name: 'Paraná',
        state: 'Paraná',
        stateAbbr: 'PR',
        neighborhoods: ['Curitiba', 'Londrina', 'Maringá', 'Ponta Grossa', 'Cascavel', 'São José dos Pinhais', 'Foz do Iguaçu', 'Colombo', 'Batel', 'Pinheirinho', 'Santa Felicidade', 'Água Verde'],
        description: 'Assistência técnica de informática no Paraná. Suporte remoto em Curitiba e principais cidades do PR. Manutenção e performance para seu PC.'
    }
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const location = locations[params.slug];

    if (!location) return { title: 'Técnico de Informática' };

    return {
        title: `Técnico de Informática em ${location.name} - Suporte Remoto e Manutenção | VOLTRIS`,
        description: `${location.description} Atendimento 24h, 100% seguro e sem necessidade de deslocamento. Resolva problemas de lentidão e erros agora.`,
        keywords: [
            `técnico de informática em ${location.name}`,
            `manutenção de computador ${location.name}`,
            `reparo de pc ${location.name}`,
            `suporte técnico ${location.name}`,
            `otimização de pc gamer ${location.name}`,
            `formatar pc ${location.name}`,
            `assistência técnica informática ${location.name}`,
            `técnico de pc em ${location.name}`,
            `suporte windows ${location.name}`,
            `limpeza de vírus ${location.name}`
        ],
        alternates: {
            canonical: `https://voltris.com.br/tecnico-informatica-em/${location.slug}`
        },
        openGraph: {
            title: `Técnico de Informática em ${location.name} | VOLTRIS`,
            description: location.description,
            url: `https://voltris.com.br/tecnico-informatica-em/${location.slug}`,
            type: 'website',
            images: [{ url: '/remotebanner.jpg', width: 1200, height: 630 }]
        }
    };
}

export async function generateStaticParams() {
    return Object.keys(locations).map((slug) => ({
        slug,
    }));
}

export default function LocalPage({ params }: { params: { slug: string } }) {
    const location = locations[params.slug];

    if (!location) {
        notFound();
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "LocalBusiness",
                        "name": `VOLTRIS - Técnico de Informática em ${location.name}`,
                        "description": location.description,
                        "url": `https://voltris.com.br/tecnico-informatica-em/${location.slug}`,
                        "telephone": "+5511996716235",
                        "address": {
                            "@type": "PostalAddress",
                            "addressLocality": location.name,
                            "addressRegion": location.stateAbbr,
                            "addressCountry": "BR"
                        },
                        "geo": {
                            "@type": "GeoCircle",
                            "itemOffered": {
                                "@type": "Service",
                                "name": "Suporte Técnico de Informática Remoto"
                            }
                        },
                        "areaServed": location.name,
                        "openingHours": "Mo-Su 00:00-23:59"
                    })
                }}
            />
            <LocalTecnicoClient
                locationName={location.name}
                stateAbbr={location.stateAbbr}
                regionalContext={{
                    neighborhoods: location.neighborhoods,
                    localFact: `Atendemos toda a região de ${location.name} com protocolos de segurança de elite.`
                }}
            />
        </>
    );
}
