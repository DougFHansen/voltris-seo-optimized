import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Blog e Guias Técnicos | VOLTRIS',
    description: 'Artigos, tutoriais e guias técnicos sobre formatação, otimização, assistência e manutenção de computadores.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
