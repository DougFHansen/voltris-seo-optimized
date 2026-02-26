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
    'belo-horizonte': {
        slug: 'belo-horizonte',
        name: 'Belo Horizonte',
        state: 'Minas Gerais',
        stateAbbr: 'MG',
        neighborhoods: ['Savassi', 'Lourdes', 'Pampulha', 'Buritis', 'Sion', 'Funcionários', 'Castelo', 'Santa Efigênia', 'Horto', 'Betim', 'Contagem', 'Nova Lima'],
        description: 'Assistência técnica de informática em Belo Horizonte e MG. Suporte remoto rápido para empresas e gamers em toda a Grande BH.'
    },
    'curitiba': {
        slug: 'curitiba',
        name: 'Curitiba',
        state: 'Paraná',
        stateAbbr: 'PR',
        neighborhoods: ['Batel', 'Centro Cívico', 'Água Verde', 'Bigorrilho', 'Santa Felicidade', 'Pinheirinho', 'Portão', 'Jardim Botânico', 'Cidade Industrial', 'Londrina', 'Maringá', 'Cascavel'],
        description: 'Técnico de informática em Curitiba e Paraná. Especialista em performance de PC, suporte técnico remoto e manutenção de sistemas no PR.'
    },
    'porto-alegre': {
        slug: 'porto-alegre',
        name: 'Porto Alegre',
        state: 'Rio Grande do Sul',
        stateAbbr: 'RS',
        neighborhoods: ['Moinhos de Vento', 'Petrópolis', 'Bela Vista', 'Menino Deus', 'Cidade Baixa', 'Ipanema', 'Canoas', 'Caxias do Sul', 'Pelotas', 'Passo Fundo', 'Novo Hamburgo', 'Gravataí'],
        description: 'Suporte técnico de informática no Rio Grande do Sul. Atendimento especializado em Porto Alegre e cidades gaúchas via acesso remoto.'
    },
    'salvador': {
        slug: 'salvador',
        name: 'Salvador',
        state: 'Bahia',
        stateAbbr: 'BA',
        neighborhoods: ['Barra', 'Caminho das Árvores', 'Itaigara', 'Pituba', 'Rio Vermelho', 'Graça', 'Feira de Santana', 'Vitória da Conquista', 'Camaçari', 'Lauro de Freitas', 'Itabuna', 'Ilhéus'],
        description: 'Técnico de informática em Salvador e Bahia. Reparo de PC, otimização de Windows e assistência técnica remota em todo o estado baiano.'
    },
    'brasilia': {
        slug: 'brasilia',
        name: 'Brasília',
        state: 'Distrito Federal',
        stateAbbr: 'DF',
        neighborhoods: ['Asa Sul', 'Asa Norte', 'Lago Sul', 'Lago Norte', 'Sudoeste', 'Águas Claras', 'Taguatinga', 'Ceilândia', 'Guará', 'Sobradinho', 'Samambaia', 'Gama'],
        description: 'Assistência técnica de informática em Brasília e DF. Suporte remoto para órgãos e profissionais na capital federal com segurança máxima.'
    },
    'fortaleza': {
        slug: 'fortaleza',
        name: 'Fortaleza',
        state: 'Ceará',
        stateAbbr: 'CE',
        neighborhoods: ['Aldeota', 'Meireles', 'Cocó', 'Papicu', 'Dionísio Torres', 'Fátima', 'Caucaia', 'Maracanaú', 'Sobral', 'Juazeiro do Norte', 'Itapipoca', 'Maranguape'],
        description: 'Suporte técnico de informática no Ceará. Especialista em Fortaleza para manutenção remota de computadores e notebooks.'
    },
    'recife': {
        slug: 'recife',
        name: 'Recife',
        state: 'Pernambuco',
        stateAbbr: 'PE',
        neighborhoods: ['Boa Viagem', 'Graças', 'Espinheiro', 'Casa Forte', 'Pina', 'Imbiribeira', 'Olinda', 'Jaboatão dos Guararapes', 'Caruaru', 'Petrolina', 'Paulista', 'Cabo de Santo Agostinho'],
        description: 'Técnico de informática em Recife e Pernambuco. Assistência remota 24h para problemas de rede, vírus e performance de PC.'
    },
    'goiania': {
        slug: 'goiania',
        name: 'Goiânia',
        state: 'Goiás',
        stateAbbr: 'GO',
        neighborhoods: ['Setor Bueno', 'Setor Marista', 'Setor Oeste', 'Jardim Goiás', 'Alphaville', 'Parque Amazônia', 'Aparecida de Goiânia', 'Anápolis', 'Rio Verde', 'Luziânia', 'Águas Lindas', 'Trindade'],
        description: 'Assistência técnica de informática em Goiás. Atendimento remoto em Goiânia e cidades goianas com foco em performance e segurança.'
    },
    'florianopolis': {
        slug: 'florianopolis',
        name: 'Florianópolis',
        state: 'Santa Catarina',
        stateAbbr: 'SC',
        neighborhoods: ['Centro', 'Trindade', 'Jurerê', 'Campeche', 'Itacorubi', 'Coqueiros', 'Joinvile', 'Blumenau', 'São José', 'Chapecó', 'Itajaí', 'Criciúma'],
        description: 'Suporte técnico de informática em Santa Catarina. Técnico remoto em Florianópolis e principais polos tecnológicos catarinenses.'
    },
    'manaus': {
        slug: 'manaus',
        name: 'Manaus',
        state: 'Amazonas',
        stateAbbr: 'AM',
        neighborhoods: ['Adrianópolis', 'Ponta Negra', 'Vieiralves', 'Aleixo', 'Dom Pedro', 'Tarumã', 'Distrito Industrial', 'Parque 10', 'Constantino Nery', 'Flores'],
        description: 'Técnico de informática em Manaus e Amazonas. Suporte remoto rápido para a região norte com foco em manutenção e otimização.'
    },
    'belem': {
        slug: 'belem',
        name: 'Belém',
        state: 'Pará',
        stateAbbr: 'PA',
        neighborhoods: ['Umarizal', 'Nazaré', 'Batista Campos', 'Reduto', 'Marco', 'Cidade Velha', 'São Brás', 'Pedreira', 'Telégrafo', 'Jurunas'],
        description: 'Assistência técnica de informática em Belém e Pará. Resolva problemas de lentidão e erros via suporte remoto seguro.'
    },
    'vitoria': {
        slug: 'vitoria',
        name: 'Vitória',
        state: 'Espírito Santo',
        stateAbbr: 'ES',
        neighborhoods: ['Praia do Canto', 'Jardim Camburi', 'Jardim da Penha', 'Enseada do Suá', 'Mata da Praia', 'Bento Ferreira', 'Vila Velha', 'Serra', 'Cariacica'],
        description: 'Técnico de informática em Vitória e ES. Suporte técnico especializado para profissionais e empresas capixabas.'
    },
    'campo-grande': {
        slug: 'campo-grande',
        name: 'Campo Grande',
        state: 'Mato Grosso do Sul',
        stateAbbr: 'MS',
        neighborhoods: ['Centro', 'Santa Fé', 'Carandá Bosque', 'Jardim dos Estados', 'Chácara Cachoeira', 'Tiradentes', 'Vilacity', 'Monte Castelo'],
        description: 'Suporte técnico de informática no Mato Grosso do Sul. Atendimento especializado em Campo Grande via acesso remoto.'
    },
    'cuiaba': {
        slug: 'cuiaba',
        name: 'Cuiabá',
        state: 'Mato Grosso',
        stateAbbr: 'MT',
        neighborhoods: ['Goiabeiras', 'Bosque da Saúde', 'Santa Rosa', 'Duque de Caxias', 'Jardim das Américas', 'Centro Sul', 'Várzea Grande'],
        description: 'Técnico de informática em Cuiabá e MT. Otimização de PC Gamer e assistência técnica remota em todo o Mato Grosso.'
    },
    'sao-luis': {
        slug: 'sao-luis',
        name: 'São Luís',
        state: 'Maranhão',
        stateAbbr: 'MA',
        neighborhoods: ['Ponta d\'Areia', 'Renascença', 'Calhau', 'Cohama', 'Turu', 'Olho d\'Água', 'Centro', 'Anjo da Guarda'],
        description: 'Assistência técnica de informática no Maranhão. Técnico remoto em São Luís para manutenção de computadores e notebooks.'
    },
    'natal': {
        slug: 'natal',
        name: 'Natal',
        state: 'Rio Grande do Norte',
        stateAbbr: 'RN',
        neighborhoods: ['Tirol', 'Petrópolis', 'Ponta Negra', 'Capim Macio', 'Lagoa Nova', 'Candelária', 'Parnamirim', 'Mossoró'],
        description: 'Suporte técnico de informática no RN. Atendimento remoto em Natal e potiguar com foco em performance e segurança.'
    },
    'joao-pessoa': {
        slug: 'joao-pessoa',
        name: 'João Pessoa',
        state: 'Paraíba',
        stateAbbr: 'PB',
        neighborhoods: ['Manaíra', 'Tambaú', 'Cabo Branco', 'Altiplano', 'Bessa', 'Intermares', 'Campina Grande', 'Cabedelo'],
        description: 'Técnico de informática na Paraíba. Assistência remota em João Pessoa para problemas de rede, vírus e performance de PC.'
    },
    'maceio': {
        slug: 'maceio',
        name: 'Maceió',
        state: 'Alagoas',
        stateAbbr: 'AL',
        neighborhoods: ['Ponta Verde', 'Jatiúca', 'Pajuçara', 'Farol', 'Arapiraca', 'Rio Largo', 'Palmeira dos Índios', 'Marechal Deodoro'],
        description: 'Suporte técnico de informática em Alagoas. Técnico remoto em Maceió com foco em manutenção e otimização imediata.'
    },
    'teresina': {
        slug: 'teresina',
        name: 'Teresina',
        state: 'Piauí',
        stateAbbr: 'PI',
        neighborhoods: ['Jóquei', 'Fátima', 'São Cristóvão', 'Horto', 'Ilhotas', 'Centro', 'Parnaíba', 'Picos'],
        description: 'Assistência técnica de informática no Piauí. Especialista em Teresina para manutenção remota de computadores.'
    },
    'aracaju': {
        slug: 'aracaju',
        name: 'Aracaju',
        state: 'Sergipe',
        stateAbbr: 'SE',
        neighborhoods: ['Treze de Julho', 'Jardins', 'Atalaia', 'Grageru', 'Farolândia', 'Centro', 'Nossa Senhora do Socorro', 'Lagarto'],
        description: 'Técnico de informática em Sergipe. Suporte remoto em Aracaju para resolução de erros e otimização de performance.'
    },
    'palmas': {
        slug: 'palmas',
        name: 'Palmas',
        state: 'Tocantins',
        stateAbbr: 'TO',
        neighborhoods: ['Plano Diretor Sul', 'Plano Diretor Norte', 'Taquaralto', 'Araguaína', 'Gurupi', 'Porto Nacional'],
        description: 'Suporte técnico de informática no Tocantins. Atendimento remoto em Palmas para empresas e usuários domésticos.'
    },
    'rio-branco': {
        slug: 'rio-branco',
        name: 'Rio Branco',
        state: 'Acre',
        stateAbbr: 'AC',
        neighborhoods: ['Bosque', 'Ivana', 'Jardim Eulália', 'Cerâmica', 'Cruzeiro do Sul', 'Sena Madureira'],
        description: 'Assistência técnica de informática no Acre. Suporte remoto em Rio Branco para manutenção de hardware e software.'
    },
    'porto-velho': {
        slug: 'porto-velho',
        name: 'Porto Velho',
        state: 'Rondônia',
        stateAbbr: 'RO',
        neighborhoods: ['Olaria', 'São João Bosco', 'Nossa Senhora das Graças', 'Ji-Paraná', 'Ariquemes', 'Vilhena'],
        description: 'Técnico de informática em Rondônia. Suporte remoto rápido em Porto Velho para otimização de sistemas e performance.'
    },
    'boa-vista': {
        slug: 'boa-vista',
        name: 'Boa Vista',
        state: 'Roraima',
        stateAbbr: 'RR',
        neighborhoods: ['Caçari', 'Paraviana', 'São Francisco', 'Canarinho', 'Caracaraí', 'Rorainópolis'],
        description: 'Suporte técnico de informática em Roraima. Atendimento remoto em Boa Vista para resolução de bugs e erros.'
    },
    'macapa': {
        slug: 'macapa',
        name: 'Macapá',
        state: 'Amapá',
        stateAbbr: 'AP',
        neighborhoods: ['Central', 'Santa Rita', 'Laguinho', 'Trem', 'Santana', 'Laranjal do Jari'],
        description: 'Assistência técnica de informática no Amapá. Suporte remoto em Macapá focado em segurança e desempenho de computadores.'
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
