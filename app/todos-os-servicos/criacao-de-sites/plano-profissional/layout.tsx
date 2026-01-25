import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Plano Profissional - Criação de Sites Avançados | VOLTRIS',
    description: 'Plano Profissional de criação de sites. Site completo com funcionalidades avançadas, blog integrado, SEO otimizado e suporte premium. Ideal para empresas em crescimento.',
    keywords: ['plano profissional site', 'site empresarial', 'criar site completo', 'site com blog', 'site profissional avançado'],
    alternates: {
        canonical: 'https://voltris.com.br/todos-os-servicos/criacao-de-sites/plano-profissional'
    },
    openGraph: {
        title: 'Plano Profissional - Criação de Sites Avançados | VOLTRIS',
        description: 'Site completo com funcionalidades avançadas e suporte premium.',
        url: 'https://voltris.com.br/todos-os-servicos/criacao-de-sites/plano-profissional',
        type: 'product',
        locale: 'pt_BR',
        siteName: 'VOLTRIS',
        images: [{ url: '/logo.png', width: 1200, height: 630, alt: 'VOLTRIS - Plano Profissional' }]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Plano Profissional - Criação de Sites | VOLTRIS',
        description: 'Site completo para empresas em crescimento.',
        images: ['/logo.png']
    },
    robots: {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 }
    }
};

export default function PlanoProfissionalLayout({ children }: { children: React.ReactNode }) {
    return children;
}
