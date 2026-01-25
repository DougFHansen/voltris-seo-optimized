import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Formatação de PC Remota - Windows 10 e 11 | VOLTRIS',
    description: 'Formatação remota completa do seu computador. Instalação limpa do Windows, drivers, programas essenciais e otimização. Serviço rápido e seguro, sem sair de casa.',
    keywords: ['formatação remota', 'formatar pc online', 'formatação windows 10', 'formatação windows 11', 'instalação limpa windows', 'formatar computador remoto', 'backup formatação', 'formatação profissional'],
    alternates: {
        canonical: 'https://voltris.com.br/formatacao'
    },
    openGraph: {
        title: 'Formatação de PC Remota - Windows 10 e 11 | VOLTRIS',
        description: 'Formatação remota completa com backup, instalação de drivers e otimização. Serviço profissional 100% online.',
        url: 'https://voltris.com.br/formatacao',
        type: 'website',
        locale: 'pt_BR',
        siteName: 'VOLTRIS',
        images: [
            {
                url: '/logo.png',
                width: 1200,
                height: 630,
                alt: 'VOLTRIS - Formatação Remota'
            }
        ]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Formatação de PC Remota | VOLTRIS',
        description: 'Formatação remota completa com backup e otimização.',
        images: ['/logo.png'],
        creator: '@voltris'
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    }
};

export default function FormatacaoLayout({ children }: { children: React.ReactNode }) {
    return children;
}
