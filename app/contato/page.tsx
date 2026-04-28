import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contato VOLTRIS | Suporte Técnico Remoto e WhatsApp',
  description: 'Entre em contato com a VOLTRIS para suporte técnico especializado. WhatsApp rápido, e-mail para orçamentos e atendimento 100% remoto em todo o Brasil.',
  keywords: [
    'contato voltris',
    'suporte técnico whatsapp',
    'atendimento remoto',
    'telefone voltris',
    'e-mail voltris',
    'suporte técnico online',
    'assistência técnica contato',
    'voltris telefone whatsapp'
  ],
  openGraph: {
    title: 'Contato VOLTRIS | Suporte Técnico Especializado',
    description: 'Fale conosco via WhatsApp para suporte técnico imediato. Atendimento remoto especializado em otimização de PCs e Windows.',
    url: 'https://voltris.com.br/contato',
    siteName: 'VOLTRIS',
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: 'https://voltris.com.br/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Contato VOLTRIS - Suporte Técnico Remoto',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contato VOLTRIS | Suporte Técnico Especializado',
    description: 'Fale conosco via WhatsApp para suporte técnico imediato. Atendimento 100% remoto.',
    creator: '@voltris',
  },
  alternates: {
    canonical: 'https://voltris.com.br/contato',
  },
};

// Client Component
function ContatoClient() {
  return (
    <div className="min-h-screen bg-[#050510] text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl mb-4">Contato VOLTRIS</h1>
        <p className="text-gray-400">Página em manutenção para correção de build</p>
        <p className="text-gray-500 mt-4">WhatsApp: (11) 99671-6235</p>
        <p className="text-gray-500">E-mail: contato@voltris.com.br</p>
      </div>
    </div>
  );
}

export default function ContatoPage() {
  return <ContatoClient />;
}
