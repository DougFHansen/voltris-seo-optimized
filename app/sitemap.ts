import { MetadataRoute } from 'next';


export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://voltris.com.br';
  const currentDate = new Date();
  
  // URLs estáticas principais
  const staticUrls = [
    // PÁGINA PRINCIPAL - Prioridade máxima
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'hourly' as const,
      priority: 1.0,
    },
    // LANDING PAGES SEO - Alta prioridade
    {
      url: `${baseUrl}/tecnico-informatica`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tecnico-informatica-minha-regiao`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tecnico-informatica-atende-casa`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/criar-site`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/criadores-de-site`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    // PÁGINAS PRINCIPAIS DE SERVIÇOS - Alta prioridade
    {
      url: `${baseUrl}/servicos`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/todos-os-servicos`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    // SERVIÇOS ESPECÍFICOS - Alta prioridade
    {
      url: `${baseUrl}/formatacao`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/otimizacao-pc`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/instalacao-office`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/erros-jogos`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/optimizer`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/gamers`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    // SUBCATEGORIAS DE SERVIÇOS - Média-alta prioridade
    {
      url: `${baseUrl}/todos-os-servicos/criacao-de-sites`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/todos-os-servicos/suporte-windows`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/todos-os-servicos/instalacao-de-programas`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    // PLANOS DE CRIAÇÃO DE SITES - Média prioridade
    {
      url: `${baseUrl}/todos-os-servicos/criacao-de-sites/plano-basico`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/todos-os-servicos/criacao-de-sites/plano-profissional`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/todos-os-servicos/criacao-de-sites/plano-empresarial`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },

    // PÁGINAS INFORMATIVAS - Média prioridade
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contato`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    // PÁGINA DE GUIAS - Prioridade MÁXIMA (conteúdo principal)
    {
      url: `${baseUrl}/guias`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/reviews`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/lgpd`,
      lastModified: currentDate,
      changeFrequency: 'yearly' as const,
      priority: 0.4,
    },
    // PÁGINAS LEGAIS - Baixa prioridade
    {
      url: `${baseUrl}/politica-privacidade`,
      lastModified: currentDate,
      changeFrequency: 'yearly' as const,
      priority: 0.4,
    },
    {
      url: `${baseUrl}/termos-uso`,
      lastModified: currentDate,
      changeFrequency: 'yearly' as const,
      priority: 0.4,
    },
    // PÁGINAS DE PROCESSO - Prioridade média-alta
    {
      url: `${baseUrl}/processo/agendamento`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/processo/acesso-remoto`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/processo/contrato`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/processo/conclusao`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    // SEÇÃO INTERNACIONAL - Nova camada para brasileiros no exterior
    {
      url: `${baseUrl}/exterior`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/exterior/servicos`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/exterior/contato`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/exterior/orcamento`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/exterior/servicos/suporte-tecnico`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/exterior/servicos/criacao-sites`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/exterior/servicos/migracao-dados`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/exterior/servicos/configuracao-redes`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/exterior/servicos/suporte-nuvem`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/exterior/servicos/consultoria`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
  ];

  return staticUrls;
} 