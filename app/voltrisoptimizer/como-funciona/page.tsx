import { Metadata } from 'next';
import HowItWorksClient from './HowItWorksClient';

export const metadata: Metadata = {
    title: 'Como Funciona o Voltris Optimizer | A Ciência da Performance (Kernel & IA)',
    description: 'Entenda a tecnologia por trás do Voltris Optimizer. Otimização de threads, redução de latência de sistema e debloat inteligente para Gamers, Streamers e Empresas.',
    keywords: [
        'como funciona voltris',
        'tecnologia de otimização pc',
        'redução latência windows explicaçao',
        'otimização kernel windows',
        'software aumentar fps como funciona',
        'processos windows desnecessários',
        'voltris é seguro',
        'engenharia de software performance',
        'latência dpc explicada',
        'otimização para streamers obs'
    ],
    openGraph: {
        title: 'Engenharia de Performance: Como o Voltris Acelera seu PC',
        description: 'Não é mágica, é engenharia. Veja como atuamos no Kernel do Windows para desbloquear hardware em Jogos, Streaming e Workstations.',
        url: 'https://voltris.com.br/voltrisoptimizer/como-funciona',
        type: 'article',
        images: [
            {
                url: 'https://voltris.com.br/og-how-it-works.jpg',
                width: 1200,
                height: 630,
                alt: 'Diagrama de funcionamento do Voltris Optimizer',
            },
        ],
    },
    alternates: {
        canonical: 'https://voltris.com.br/voltrisoptimizer/como-funciona',
    },
};

export default function HowItWorksPage() {
    return <HowItWorksClient />;
}
