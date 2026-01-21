import { Metadata } from 'next';
import CriacaoSitesClient from './CriacaoSitesClient';

export const metadata: Metadata = {
  title: 'Criação de Sites Profissionais | VOLTRIS',
  description: 'Desenvolvimento de sites profissionais, rápidos e otimizados para SEO. Aumente suas vendas com um site moderno e responsivo.',
  keywords: 'criação de sites, desenvolvimento web, site profissional, site responsivo, site seo, comprar site, loja virtual, ecommerce',
  openGraph: {
    title: 'Criação de Sites Profissionais | VOLTRIS',
    description: 'Sites modernos que convertem visitantes em clientes.',
    url: 'https://voltris.com.br/todos-os-servicos/criacao-de-sites',
    type: 'website',
  },
  alternates: {
    canonical: 'https://voltris.com.br/todos-os-servicos/criacao-de-sites',
  },
};

export default function CriacaoSitesPage() {
  return <CriacaoSitesClient />;
}
