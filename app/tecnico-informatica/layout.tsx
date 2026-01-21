import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Técnico de Informática Online - Suporte Técnico Remoto Especializado | VOLTRIS',
    description: 'Técnico de informática online para suporte técnico remoto em todo Brasil. Especialistas em Windows, formatação, otimização e manutenção de computadores.',
    keywords: [
        'técnico de informática',
        'técnico informática online',
        'suporte técnico remoto',
        'técnico de computador',
        'assistência técnica informática',
        'manutenção de sistemas',
        'técnico windows'
    ],
    alternates: {
        canonical: '/tecnico-informatica',
    },
    openGraph: {
        title: 'Técnico de Informática Online | Suporte Remoto VOLTRIS',
        description: 'Suporte técnico remoto especializado em informática. Atendimento rápido e seguro em todo Brasil.',
        url: 'https://voltris.com.br/tecnico-informatica',
        type: 'website',
        images: [
            {
                url: '/logo.png',
                width: 1200,
                height: 630,
                alt: 'Técnico de Informática VOLTRIS',
            },
        ],
    },
};

export default function TecnicoInformaticaLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
