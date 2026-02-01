import { Metadata } from 'next';
import ServicosClient from './ServicosClient';

export const metadata: Metadata = {
  title: 'Nossos Serviços | VOLTRIS - Suporte Técnico Remoto',
  description: 'Conheça nossos serviços de suporte técnico: formatação, otimização, remoção de vírus, instalação de programas e criação de sites. Atendimento rápido e seguro.',
  keywords: 'serviços informática, suporte técnico preços, formatação valor, otimização pc preço, criação sites orçamento, limpeza virus valor',
  openGraph: {
    title: 'Nossos Serviços | VOLTRIS',
    description: 'Soluções completas em suporte técnico remoto e desenvolvimento web.',
    url: 'https://voltris.com.br/todos-os-servicos',
    type: 'website',
  },
  alternates: {
    canonical: 'https://voltris.com.br/todos-os-servicos',
  },
};

export default function ServicosPage() {
  return (
    <>
      <ServicosClient />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Suporte Técnico Remoto em Informática e TI",
            "provider": {
              "@type": "Organization",
              "name": "Voltris",
              "url": "https://voltris.com.br"
            },
            "areaServed": {
              "@type": "Country",
              "name": "Brasil"
            },
            "serviceType": [
              "Suporte Técnico Remoto",
              "Formatação de PC",
              "Otimização de Computador",
              "Suporte Windows",
              "Segurança Digital",
              "Instalação de Programas",
              "Criação de Sites"
            ],
            "availableChannel": {
              "@type": "ServiceChannel",
              "serviceLocation": {
                "@type": "VirtualLocation",
                "url": "https://voltris.com.br"
              }
            }
          })
        }}
      />
    </>
  );
}
