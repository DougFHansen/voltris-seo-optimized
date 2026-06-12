import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Adquirir Licença Voltris Optimizer | VOLTRIS',
    description: 'Adquira agora a licença do Voltris Optimizer e destrave a performance máxima do seu PC para jogos e trabalho. Compra 100% segura.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
