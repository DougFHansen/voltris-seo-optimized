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
};

export default function ServicosPage() {
  return <ServicosClient />;
}
