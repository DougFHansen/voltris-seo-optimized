import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Agendamento de Serviços | Processo Profissional | Voltris',
    description: 'Entenda o processo de agendamento de serviços da Voltris: flexibilidade, confirmação rápida, checklist e atendimento premium. Garanta seu horário online!',
    alternates: {
        canonical: '/processo/agendamento',
    },
    openGraph: {
        title: 'Agendamento de Serviços | Processo Profissional | Voltris',
        description: 'Veja como funciona o agendamento de serviços na Voltris. Atendimento profissional e seguro.',
        url: 'https://voltris.com.br/processo/agendamento',
        type: 'article',
        images: [
            {
                url: '/about-img.webp',
                width: 1200,
                height: 630,
                alt: 'Agendamento de Serviços Voltris',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Agendamento de Serviços | Processo Profissional | Voltris',
        description: 'Veja como funciona o agendamento de serviços na Voltris.',
        images: ['/about-img.webp'],
    },
};

export default function AgendamentoLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
