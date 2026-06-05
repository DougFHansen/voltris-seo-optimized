import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Planos de Suporte TI Mensal para Empresas | VOLTRIS",
  description: "Contratos de suporte técnico gerenciado (MSP) com valores fixos. Escolha o plano ideal para sua empresa: Essencial, Business Pro ou Enterprise.",
  keywords: ["planos suporte ti", "contrato mensal ti empresas", "valor manutenção ti b2b", "terceirização ti preço"],
};

export default function PlansLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
