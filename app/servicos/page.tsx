import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Serviços VOLTRIS | Otimização de PC e Suporte Técnico Remoto',
  description: 'Conheça todos os serviços VOLTRIS: otimização gamer, suporte técnico, formatação remota, overclock e muito mais. Atendimento especializado em todo o Brasil.',
  keywords: [
    'serviços voltris',
    'otimização de pc',
    'suporte técnico remoto',
    'formatação de computador',
    'overclock pc gamer',
    'limpeza de vírus',
    'assistência técnica especializada',
    'serviços de informática'
  ],
  openGraph: {
    title: 'Serviços VOLTRIS | Otimização e Suporte Técnico Especializado',
    description: 'Todos os serviços de otimização de PC e suporte técnico remoto. Especialistas em performance gamer e manutenção de sistemas.',
    url: 'https://voltris.com.br/servicos',
    siteName: 'VOLTRIS',
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: 'https://voltris.com.br/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Serviços VOLTRIS - Otimização de PC',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Serviços VOLTRIS | Otimização e Suporte Técnico',
    description: 'Todos os serviços de otimização de PC e suporte técnico remoto especializado.',
    creator: '@voltris',
  },
  alternates: {
    canonical: 'https://voltris.com.br/servicos',
  },
};

// Client Component
function ServicosClientComponent() {
  return (
    <div className="bg-[#050510] min-h-screen text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl mb-4">Serviços VOLTRIS</h1>
        <p className="text-gray-400">Página em manutenção para correção de build</p>
        <p className="text-gray-500 mt-4">WhatsApp: (11) 99671-6235</p>
        <p className="text-gray-500">E-mail: contato@voltris.com.br</p>
      </div>
    </div>
  );
}

export default function ServicesPage() {
  return <ServicosClientComponent />;
}
