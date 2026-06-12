import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Serviços Combinados de Otimização e Limpeza | VOLTRIS',
    description: 'Pacotes completos de serviços combinados de otimização de PC, limpeza de hardware e instalação de software para máxima performance.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
