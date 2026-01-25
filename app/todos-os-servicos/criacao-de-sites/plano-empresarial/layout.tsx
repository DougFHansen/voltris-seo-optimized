import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Plano Empresarial - Sites Corporativos de Alto Nível | VOLTRIS',
    description: 'Plano Empresarial de criação de sites. Solução completa para grandes empresas com sistema de gestão, integrações, dashboard administrativo e suporte dedicado 24/7.',
    keywords: ['plano empresarial site', 'site corporativo', 'site grande empresa', 'portal empresarial', 'site com dashboard'],
    alternates: {
        canonical: 'https://voltris.com.br/todos-os-servicos/criacao-de-sites/plano-empresarial'
    },
    openGraph: {
        title: 'Plano Empresarial - Sites Corporativos de Alto Nível | VOLTRIS',
        description: 'Solução completa para grandes empresas com suporte dedicado 24/7.',
        url: 'https://voltris.com.br/todos-os-servicos/criacao-de-sites/plano-empresarial',
        type: 'product',
        locale: 'pt_BR',
        siteName: 'VOLTRIS',
        images: [{ url: '/logo.png', width: 1200, height: 630, alt: 'VOLTRIS - Plano Empresarial' }]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Plano Empresarial - Sites Corporativos | VOLTRIS',
        description: 'Solução completa para grandes empresas.',
        images: ['/logo.png']
    },
    robots: {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 }
    }
};

export default function PlanoEmpresarialLayout({ children }: { children: React.ReactNode }) {
    return children;
}
