import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Otimização de PC - Deixe seu Computador Mais Rápido | VOLTRIS',
    description: 'Otimização completa de PC. Limpeza de arquivos temporários, desativação de programas desnecessários, ajustes de performance e muito mais. PC mais rápido em minutos.',
    keywords: ['otimização de pc', 'deixar pc mais rápido', 'otimizar windows', 'limpeza de pc', 'melhorar performance pc', 'computador lento', 'acelerar windows'],
    alternates: {
        canonical: 'https://voltris.com.br/otimizacao-pc'
    },
    openGraph: {
        title: 'Otimização de PC - Deixe seu Computador Mais Rápido | VOLTRIS',
        description: 'Otimização completa para deixar seu PC mais rápido. Serviço remoto profissional.',
        url: 'https://voltris.com.br/otimizacao-pc',
        type: 'service',
        locale: 'pt_BR',
        siteName: 'VOLTRIS',
        images: [{ url: '/logo.png', width: 1200, height: 630, alt: 'VOLTRIS - Otimização de PC' }]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Otimização de PC | VOLTRIS',
        description: 'Deixe seu PC mais rápido com nossa otimização profissional.',
        images: ['/logo.png']
    },
    robots: {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 }
    }
};

export default function OtimizacaoPcLayout({ children }: { children: React.ReactNode }) {
    return children;
}
