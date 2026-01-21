import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Conclusão e Garantia | Processo Profissional | Voltris',
    description: 'Veja como é feita a conclusão dos serviços Voltris: testes, documentação, garantia e suporte pós-serviço. Satisfação total!',
    alternates: {
        canonical: '/processo/conclusao',
    },
    openGraph: {
        title: 'Conclusão e Garantia | Processo Profissional | Voltris',
        description: 'Finalização profissional, garantia de 30 dias, suporte 24/7 e documentação completa.',
        url: 'https://voltris.com.br/processo/conclusao',
        type: 'article',
        images: [
            {
                url: '/about-img.webp',
                width: 1200,
                height: 630,
                alt: 'Conclusão e Garantia Voltris',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Conclusão e Garantia | Processo Profissional | Voltris',
        description: 'Finalização profissional e garantia total de satisfação.',
        images: ['/about-img.webp'],
    },
};

export default function ConclusaoLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
