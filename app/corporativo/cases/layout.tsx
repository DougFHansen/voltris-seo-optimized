import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Cases de Sucesso & Prova Social TI B2B | VOLTRIS",
  description: "Veja como a Voltris transformou a infraestrutura tecnológica de clínicas, escritórios e empresas em todo o Brasil com suporte 100% remoto.",
  keywords: ["cases de sucesso ti", "depoimentos suporte ti", "projetos ti empresas", "prova social b2b voltris"],
};

export default function CasesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
