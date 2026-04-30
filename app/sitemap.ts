import { MetadataRoute } from 'next';

const BASE_URL = 'https://www.voltris.com.br';

const CRITICAL_ROUTES = [
  '',
  '/servicos',
  '/contato',
  '/sobre',
  '/guias',
  '/todos-os-servicos',
  '/otimizacao-pc',
  '/formatar-windows',
  '/assistencia-tecnica',
  '/tecnico-informatica',
  '/suporte-tecnico-remoto',
  '/manutencao-computador',
  '/erros-jogos',
  '/voltrisoptimizer',
  '/adquirir-licenca',
  '/criar-site',
  '/faq',
  '/exterior',
  '/exterior/servicos',
  '/exterior/contato',
  '/exterior/orcamento',
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return CRITICAL_ROUTES.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: now,
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : route.startsWith('/exterior') ? 0.8 : 0.9,
  }));
}