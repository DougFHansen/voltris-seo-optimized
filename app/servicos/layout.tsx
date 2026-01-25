import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Serviços de TI - Suporte Técnico e Criação de Sites | VOLTRIS',
    description: 'Conheça todos os nossos serviços: suporte técnico remoto, formatação, otimização de PC, criação de sites, instalação de programas e muito mais. Atendimento em todo Brasil.',
    keywords: ['serviços de ti', 'suporte técnico', 'criação de sites', 'manutenção de computador', 'serviços informática', 'ti remoto', 'formatação pc', 'otimização windows'],
    alternates: {
        canonical: 'https://voltris.com.br/servicos'
    },
    openGraph: {
        title: 'Serviços de TI - Suporte Técnico e Criação de Sites | VOLTRIS',
        description: 'Serviços completos de TI: suporte técnico remoto, formatação, otimização e criação de sites profissionais.',
        url: 'https://voltris.com.br/servicos',
        type: 'website',
        locale: 'pt_BR',
        siteName: 'VOLTRIS',
        images: [{ url: '/logo.png', width: 1200, height: 630, alt: 'VOLTRIS - Serviços de TI' }]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Serviços de TI | VOLTRIS',
        description: 'Serviços completos de TI e suporte técnico remoto.',
        images: ['/logo.png']
    },
    robots: {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 }
    }
};

export default function ServicosLayout({ children }: { children: React.ReactNode }) {
    return children;
}
