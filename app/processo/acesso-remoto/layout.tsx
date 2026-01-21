import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Acesso Remoto Seguro | Processo Profissional | Voltris',
    description: 'Saiba como funciona o acesso remoto seguro da Voltris: criptografia, controle do cliente, transparência e conformidade LGPD.',
    alternates: {
        canonical: '/processo/acesso-remoto',
    },
    openGraph: {
        title: 'Acesso Remoto Seguro | Processo Profissional | Voltris',
        description: 'Atendimento remoto com segurança, transparência e ferramentas profissionais. Veja como protegemos seus dados!',
        url: 'https://voltris.com.br/processo/acesso-remoto',
        type: 'article',
        images: [
            {
                url: '/about-img.webp',
                width: 1200,
                height: 630,
                alt: 'Acesso Remoto Seguro Voltris',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Acesso Remoto Seguro | Processo Profissional | Voltris',
        description: 'Atendimento remoto com segurança, transparência e ferramentas profissionais.',
        images: ['/about-img.webp'],
    },
};

export default function AcessoRemotoLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
