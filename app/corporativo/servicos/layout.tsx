import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Serviços de TI Enterprise | Manutenção & Suporte B2B | VOLTRIS",
  description: "Soluções completas de TI para empresas: Gestão de Infraestrutura, Cibersegurança, Backup em Nuvem e Suporte Remoto Imediato via AnyDesk.",
  keywords: ["serviços de ti empresas", "manutenção de servidores", "cibersegurança b2b", "backup nuvem empresas", "suporte remoto ti"],
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
