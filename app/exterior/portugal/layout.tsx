import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Suporte Técnico para Brasileiros em Portugal | Suporte Remoto em Português | VOLTRIS",
  description: "Suporte técnico remoto especializado para brasileiros que moram em Portugal. Resolva problemas de lentidão, vírus e formatação via AnyDesk com pagamento via Wise ou PIX.",
  keywords: [
    "suporte técnico portugal", 
    "brasileiros em portugal suporte ti", 
    "conserto de pc lisboa", 
    "tecnico informatica porto em portugues", 
    "ajuda windows portugal brasileiros",
    "ti remota portugal"
  ],
};

export default function PortugalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
