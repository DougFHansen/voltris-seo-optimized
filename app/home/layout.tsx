import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Suporte Técnico Residencial Remoto | Formatação & Vírus | VOLTRIS",
  description: "Resolva problemas de lentidão, vírus e formatação sem sair de casa. Suporte técnico especializado 100% remoto via AnyDesk para seu PC residencial.",
  keywords: ["suporte pc residencial", "formatação remota", "limpeza virus pc", "assistencia tecnica remota", "tecnico informatica domiciliar"],
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
