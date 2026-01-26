import { Metadata } from 'next';
import DocumentacaoClient from './DocumentacaoClient';

export const metadata: Metadata = {
  title: 'Documentação Técnica | Voltris Optimizer',
  description: 'Análise detalhada da engenharia por trás do Voltris Optimizer. Entenda como otimizamos o Kernel, Serviços e Redes do Windows.',
  keywords: [
    'documentação técnica',
    'voltris optimizer tech specs',
    'otimização kernel windows',
    'serviços windows desativados',
    'tcp ip tuning',
    'segurança voltris',
    'arquitetura de software'
  ],
  openGraph: {
    title: 'Voltris Optimizer | Documentação Técnica',
    description: 'Mergulhe na arquitetura técnica do Voltris Optimizer. Segurança, Performance e Engenharia de Software explicadas.',
    url: 'https://voltris.com.br/voltrisoptimizer/documentacao',
    type: 'article',
    siteName: 'Voltris Technology',
    locale: 'pt_BR',
  },
  alternates: {
    canonical: 'https://voltris.com.br/voltrisoptimizer/documentacao',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function DocumentacaoPage() {
  return <DocumentacaoClient />;
}
