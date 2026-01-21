import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Todos os Serviços de Suporte e Desenvolvimento | VOLTRIS',
    description: 'Confira todos os serviços da VOLTRIS: Suporte técnico remoto, criação de sites, otimização de Windows, remoção de vírus, instalação de redes e muito mais. Soluções completas 100% online.',
    keywords: [
        'serviços suporte técnico',
        'criação de sites profissionais',
        'otimização de pc',
        'formatação remota',
        'suporte windows',
        'instalação office',
        'correção erros jogos',
        'suporte remoto 24h'
    ],
    alternates: {
        canonical: '/todos-os-servicos',
    },
    openGraph: {
        title: 'Nossos Serviços | Suporte e Tecnologia VOLTRIS',
        description: 'Soluções completas em suporte técnico e desenvolvimento web. Atendimento em todo Brasil.',
        url: 'https://voltris.com.br/todos-os-servicos',
        type: 'website',
        images: [
            {
                url: '/logo.png',
                width: 1200,
                height: 630,
                alt: 'Serviços VOLTRIS',
            },
        ],
    },
};

export default function TodosServicosLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
