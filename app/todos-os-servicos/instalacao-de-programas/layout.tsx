import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Instalação de Programas Comuns | Instale Software Remotamente | VOLTRIS',
    description: 'Instalação de programas comuns, instalação remota de software, segurança, agilidade e suporte especializado. Instale Google Chrome, WhatsApp, Zoom e muito mais!',
    keywords: [
        'instalação de programas',
        'instalar programas remotamente',
        'instalação profissional de software',
        'instalar Google Chrome',
        'instalar WhatsApp',
        'instalar Zoom',
        'instalar programas comuns',
        'suporte remoto',
        'instalação segura'
    ],
    alternates: {
        canonical: '/todos-os-servicos/instalacao-de-programas',
    },
    openGraph: {
        title: 'Instalação de Programas Comuns | Suporte Remoto VOLTRIS',
        description: 'Instale programas comuns com segurança, agilidade e suporte remoto especializado. Atendimento imediato!',
        url: 'https://voltris.com.br/todos-os-servicos/instalacao-de-programas',
        type: 'website',
        images: [
            {
                url: '/logo.png',
                width: 1200,
                height: 630,
                alt: 'Instalação de Programas VOLTRIS',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Instalação de Programas Comuns | Suporte Remoto VOLTRIS',
        description: 'Instale programas comuns com segurança, agilidade e suporte remoto especializado.',
        images: ['/logo.png'],
    },
};

export default function InstalacaoProgramasLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
