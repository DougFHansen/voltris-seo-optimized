import { Metadata } from 'next';
import EmpresasClient from './EmpresasClient';

export const metadata: Metadata = {
  title: 'Suporte de TI e Gestão Remota para Empresas - VOLTRIS',
  description: 'Otimize a infraestrutura de TI da sua empresa. Suporte remoto rápido, segurança cibernética (LGPD) e otimização de performance para máxima produtividade.',
  keywords: [
    'suporte ti empresas',
    'terceirização de ti',
    'gestão de ti remota',
    'segurança corporativa',
    'otimização de frota pc',
    'lgpd compliance'
  ],
  openGraph: {
    title: 'Gestão Avançada de TI para Empresas | VOLTRIS',
    description: 'Aumente a produtividade e reduza o tempo de inatividade com suporte corporativo especializado.',
    url: 'https://voltris.com.br/empresas',
    images: ['/logo.png']
  }
};

export default function EmpresasPage() {
  return <EmpresasClient />;
}
