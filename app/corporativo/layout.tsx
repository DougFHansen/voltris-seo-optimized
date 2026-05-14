import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Suporte TI Corporativo & Gestão de TI para Empresas | VOLTRIS",
  description: "Consultoria de TI 100% remota para empresas via AnyDesk e TeamViewer. Suporte B2B especializado em segurança, LGPD, servidores e manutenção preventiva.",
  keywords: [
    "suporte ti empresas", 
    "gestão de ti b2b", 
    "consultoria ti remota", 
    "contrato mensal ti", 
    "segurança digital empresas", 
    "manutenção servidores remota",
    "msp brasil",
    "suporte ti bauru",
    "ti para clinicas",
    "ti para escritorio de advocacia"
  ],
  alternates: {
    canonical: 'https://www.voltris.com.br/corporativo'
  },
  openGraph: {
    title: "VOLTRIS Corporativo | TI Estratégica para o seu Negócio",
    description: "Sua empresa sem interrupções técnicas. Suporte proativo 100% remoto.",
    url: 'https://www.voltris.com.br/corporativo',
    siteName: 'VOLTRIS',
    images: [{ url: '/remotebanner.jpg', width: 1200, height: 630 }],
    locale: 'pt_BR',
    type: 'website',
  }
};

export default function CorporateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
