import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Técnico de Informática em São Paulo - Suporte Presencial e Remoto | VOLTRIS',
    description: 'Suporte técnico de informática especializado na cidade de São Paulo. Otimização de PC, redes e servidores.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
