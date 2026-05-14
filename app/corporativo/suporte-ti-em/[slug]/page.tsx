import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import LocalCorporateClient from '../LocalCorporateClient';

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
        description: 'Suporte técnico de TI para empresas em São Paulo. Manutenção preventiva de computadores, gestão de redes e suporte remoto especializado B2B.'
    },
    'rio-de-janeiro': {
        slug: 'rio-de-janeiro',
        name: 'Rio de Janeiro',
        state: 'Rio de Janeiro',
        stateAbbr: 'RJ',
        neighborhoods: ['Barra da Tijuca', 'Copacabana', 'Tijuca', 'Recreio', 'Ipanema', 'Botafogo', 'Leblon', 'Flamengo', 'Centro', 'Jacarepaguá', 'Méier', 'Niterói'],
        description: 'Consultoria de TI e suporte empresarial no Rio de Janeiro. Atendimento especializado para escritórios, clínicas e comércios cariocas.'
    },
    'curitiba': {
        slug: 'curitiba',
        name: 'Curitiba',
        state: 'Paraná',
        stateAbbr: 'PR',
        neighborhoods: ['Batel', 'Centro Cívico', 'Água Verde', 'Bigorrilho', 'Santa Felicidade', 'Pinheirinho', 'Portão', 'Jardim Botânico', 'Cidade Industrial', 'Londrina', 'Maringá', 'Cascavel'],
        description: 'Suporte técnico corporativo em Curitiba e Paraná. Gestão de TI para PMEs com foco em segurança, backup e estabilidade operacional.'
    },
    'belo-horizonte': {
        slug: 'belo-horizonte',
        name: 'Belo Horizonte',
        state: 'Minas Gerais',
        stateAbbr: 'MG',
        neighborhoods: ['Savassi', 'Lourdes', 'Pampulha', 'Buritis', 'Sion', 'Funcionários', 'Castelo', 'Santa Efigênia', 'Horto', 'Betim', 'Contagem', 'Nova Lima'],
        description: 'Assistência técnica de informática para empresas em Belo Horizonte. Suporte remoto rápido e gestão de infraestrutura de rede em MG.'
    },
    'porto-alegre': {
        slug: 'porto-alegre',
        name: 'Porto Alegre',
        state: 'Rio Grande do Sul',
        stateAbbr: 'RS',
        neighborhoods: ['Moinhos de Vento', 'Petrópolis', 'Bela Vista', 'Menino Deus', 'Cidade Baixa', 'Ipanema', 'Canoas', 'Caxias do Sul', 'Pelotas', 'Passo Fundo', 'Novo Hamburgo', 'Gravataí'],
        description: 'Suporte de TI empresarial no Rio Grande do Sul. Técnico remoto especializado em Porto Alegre para manutenção e segurança de redes.'
    },
    'florianopolis': {
        slug: 'florianopolis',
        name: 'Florianópolis',
        state: 'Santa Catarina',
        stateAbbr: 'SC',
        neighborhoods: ['Centro', 'Trindade', 'Jurerê', 'Campeche', 'Itacorubi', 'Coqueiros', 'Joinvile', 'Blumenau', 'São José', 'Chapecó', 'Itajaí', 'Criciúma'],
        description: 'Consultoria de TI em Florianópolis e SC. Atendimento especializado para startups e empresas catarinenses via suporte remoto seguro.'
    },
    'campinas': {
        slug: 'campinas',
        name: 'Campinas',
        state: 'São Paulo',
        stateAbbr: 'SP',
        neighborhoods: ['Cambuí', 'Barão Geraldo', 'Taquaral', 'Guanabara', 'Mansões Santo Antônio', 'Alphaville', 'Nova Campinas', 'Jardim Aurélia'],
        description: 'Suporte técnico de TI em Campinas para empresas. Manutenção preventiva e gestão de infraestrutura tecnológica para o interior paulista.'
    }
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const location = locations[params.slug];

    if (!location) return { title: 'Suporte TI para Empresas' };

    return {
        title: `Suporte de TI para Empresas em ${location.name} - Consultoria e Manutenção | VOLTRIS`,
        description: `${location.description} Atendimento com SLA garantido e protocolos de segurança Enterprise. Foco em continuidade de negócio.`,
        keywords: [
            `suporte ti empresas ${location.name}`,
            `manutenção computadores empresarial ${location.name}`,
            `gestão de ti ${location.name}`,
            `consultoria informática empresas ${location.name}`,
            `suporte técnico corporativo ${location.name}`,
            `contrato ti ${location.name}`,
            `assistência técnica empresa ${location.name}`,
            `backup em nuvem empresas ${location.name}`,
            `segurança de dados ${location.name} empresa`
        ],
        alternates: {
            canonical: `https://www.voltris.com.br/corporativo/suporte-ti-em/${location.slug}`
        },
        openGraph: {
            title: `Suporte de TI para Empresas em ${location.name} | VOLTRIS`,
            description: location.description,
            url: `https://www.voltris.com.br/corporativo/suporte-ti-em/${location.slug}`,
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

export default function CorporateLocalPage({ params }: { params: { slug: string } }) {
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
                        "@type": "Service",
                        "name": `Suporte de TI Empresarial em ${location.name}`,
                        "description": location.description,
                        "provider": {
                            "@type": "Organization",
                            "name": "VOLTRIS",
                            "url": "https://www.voltris.com.br/corporativo"
                        },
                        "areaServed": {
                            "@type": "City",
                            "name": location.name
                        },
                        "serviceType": "B2B IT Support"
                    })
                }}
            />
            <LocalCorporateClient
                locationName={location.name}
                stateAbbr={location.stateAbbr}
                regionalContext={{
                    neighborhoods: location.neighborhoods,
                    localFact: `Atendemos o setor empresarial de ${location.name} com protocolos de segurança de elite.`
                }}
            />
        </>
    );
}
