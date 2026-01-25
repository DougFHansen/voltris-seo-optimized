import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Instalação do Microsoft Office - Remoto e Profissional | VOLTRIS',
    description: 'Instalação e ativação do Microsoft Office (Word, Excel, PowerPoint). Configuração completa, sincronização OneDrive e suporte técnico. Serviço 100% remoto.',
    keywords: ['instalação office', 'instalar microsoft office', 'ativar office', 'office remoto', 'configurar office', 'office word excel'],
    alternates: {
        canonical: 'https://voltris.com.br/todos-os-servicos/instalacao-do-office'
    },
    openGraph: {
        title: 'Instalação do Microsoft Office - Remoto e Profissional | VOLTRIS',
        description: 'Instalação e ativação do Microsoft Office com configuração completa.',
        url: 'https://voltris.com.br/todos-os-servicos/instalacao-do-office',
        type: 'service',
        locale: 'pt_BR',
        siteName: 'VOLTRIS',
        images: [{ url: '/logo.png', width: 1200, height: 630, alt: 'VOLTRIS - Instalação Office' }]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Instalação do Microsoft Office | VOLTRIS',
        description: 'Instalação e configuração profissional do Office.',
        images: ['/logo.png']
    },
    robots: {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 }
    }
};

export default function InstalacaoOfficeLayout({ children }: { children: React.ReactNode }) {
    return children;
}
