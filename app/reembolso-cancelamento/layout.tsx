import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Política de Reembolso e Cancelamento | VOLTRIS',
    description: 'Nossa política de reembolso e cancelamento foi desenvolvida para garantir a sua total satisfação e transparência.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
