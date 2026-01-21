import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contrato de Serviço | Processo Profissional | Voltris',
    description: 'Conheça o contrato de serviço da Voltris: segurança, transparência, privacidade e garantias para o cliente. Leia os termos!',
    alternates: {
        canonical: '/processo/contrato',
    },
    openGraph: {
        title: 'Contrato de Serviço | Processo Profissional | Voltris',
        description: 'Veja como nosso contrato protege você: termos claros, garantias, privacidade e conformidade legal.',
        url: 'https://voltris.com.br/processo/contrato',
        type: 'article',
        images: [
            {
                url: '/about-img.webp',
                width: 1200,
                height: 630,
                alt: 'Contrato de Serviço Voltris',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Contrato de Serviço | Processo Profissional | Voltris',
        description: 'Termos claros e segurança jurídica para nossos clientes.',
        images: ['/about-img.webp'],
    },
};

export default function ContratoLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
