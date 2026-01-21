import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Suporte Windows Profissional - Planos de Manutenção Mensal | VOLTRIS',
    description: 'Mantenha seu Windows sempre atualizado e seguro com nossos planos de suporte mensal. Otimização, backup, antivírus e suporte remoto prioritário 24/7.',
    keywords: [
        'suporte windows',
        'manutenção mensal computador',
        'plano suporte ti',
        'suporte técnico empresarial',
        'otimização mensal windows',
        'backup nuvem windows',
        'técnico windows remoto'
    ],
    alternates: {
        canonical: '/todos-os-servicos/suporte-ao-windows',
    },
    openGraph: {
        title: 'Suporte Windows Profissional | Planos VOLTRIS',
        description: 'Planos de suporte mensal para usuários domésticos e empresas. Performance e segurança garantidas.',
        url: 'https://voltris.com.br/todos-os-servicos/suporte-ao-windows',
        type: 'website',
        images: [
            {
                url: '/logo.png',
                width: 1200,
                height: 630,
                alt: 'Suporte Windows VOLTRIS',
            },
        ],
    },
};

export default function SuporteWindowsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
