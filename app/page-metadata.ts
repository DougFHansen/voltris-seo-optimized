import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Suporte Técnico Remoto Especializado em Windows | VOLTRIS",
  description: "Suporte técnico remoto especializado em Windows, formatação, otimização e recuperação de dados. Atendimento 100% online e seguro em todo Brasil.",
  keywords: [
    "suporte técnico remoto",
    "manutenção de computador",
    "criação de sites",
    "otimização de Windows",
    "consultoria TI"
  ],
  openGraph: {
    title: "VOLTRIS - Suporte Técnico Remoto e Criação de Sites Profissionais",
    description: "Suporte técnico remoto especializado em Windows, criação de sites profissionais, otimização de computadores e manutenção de sistemas.",
    url: "https://voltris.com.br",
    type: "website",
    images: [
      {
        url: "/remotebanner.jpg",
        width: 1200,
        height: 630,
        alt: "VOLTRIS - Suporte Técnico Remoto e Criação de Sites"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "VOLTRIS - Suporte Técnico Remoto e Criação de Sites Profissionais",
    description: "Suporte técnico remoto especializado em Windows e criação de sites profissionais.",
    images: ["/remotebanner.jpg"]
  },
  alternates: {
    canonical: "https://voltris.com.br"
  }
};