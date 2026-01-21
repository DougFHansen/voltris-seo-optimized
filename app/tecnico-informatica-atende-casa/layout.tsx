import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Técnico de Informática que Atende em Casa - Suporte Remoto e Presencial | VOLTRIS',
    description: 'Procurando técnico de informática que atende em casa? A VOLTRIS oferece suporte técnico remoto e presencial em todo Brasil. Resolva problemas de PC sem sair de casa.',
    keywords: [
        'técnico de informática atende em casa',
        'técnico informática em casa',
        'suporte técnico domiciliar',
        'técnico informática perto de mim',
        'assistência técnica computador casa',
        'manutenção computador em casa',
        'formatar pc em casa',
        'técnico informática domicílio'
    ],
    alternates: {
        canonical: '/tecnico-informatica-atende-casa',
    },
    openGraph: {
        title: 'Técnico de Informática que Atende em Casa | VOLTRIS',
        description: 'Suporte técnico de informática no conforto da sua casa. Atendimento remoto e presencial em todo Brasil.',
        url: 'https://voltris.com.br/tecnico-informatica-atende-casa',
        type: 'website',
        images: [
            {
                url: '/logo.png',
                width: 1200,
                height: 630,
                alt: 'Técnico de Informática em Casa VOLTRIS',
            },
        ],
    },
};

export default function TecnicoAtendeCasaLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
