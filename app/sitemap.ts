import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';

// Helper to get all guide slugs dynamically
function getGuideSlugs(): string[] {
  const guidesDirectory = path.join(process.cwd(), 'app', 'guias');

  if (!fs.existsSync(guidesDirectory)) {
    return [];
  }

  const entries = fs.readdirSync(guidesDirectory, { withFileTypes: true });

  return entries
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://voltris.com.br';
  const currentDate = new Date();

  // Dynamic Guides
  const guideSlugs = getGuideSlugs();
  const guideUrls = guideSlugs.map(slug => ({
    url: `${baseUrl}/guias/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Static URLs
  const staticUrls = [
    // PÁGINA PRINCIPAL - Prioridade máxima
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'hourly' as const,
      priority: 1.0,
    },
    // LANDING PAGES SEO
    { url: `${baseUrl}/tecnico-informatica`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${baseUrl}/tecnico-informatica-minha-regiao`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${baseUrl}/tecnico-informatica-atende-casa`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${baseUrl}/criar-site`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${baseUrl}/criadores-de-site`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.9 },

    // SERVIÇOS PRINCIPAIS
    { url: `${baseUrl}/servicos`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${baseUrl}/todos-os-servicos`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${baseUrl}/formatacao`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/otimizacao-pc`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/erros-jogos`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },

    // VOLTRIS OPTIMIZER
    { url: `${baseUrl}/voltrisoptimizer`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/voltrisoptimizer/como-funciona`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${baseUrl}/voltrisoptimizer/documentacao`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.6 },

    // SUBCATEGORIAS DE SERVIÇOS
    { url: `${baseUrl}/todos-os-servicos/criacao-de-sites`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/todos-os-servicos/criacao-de-sites/plano-basico`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${baseUrl}/todos-os-servicos/criacao-de-sites/plano-profissional`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${baseUrl}/todos-os-servicos/criacao-de-sites/plano-empresarial`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${baseUrl}/todos-os-servicos/suporte-ao-windows`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/todos-os-servicos/instalacao-de-programas`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/todos-os-servicos/instalacao-do-office`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },

    // INSTITUCIONAL
    { url: `${baseUrl}/sobre`, lastModified: currentDate, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/faq`, lastModified: currentDate, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/contato`, lastModified: currentDate, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/lgpd`, lastModified: currentDate, changeFrequency: 'yearly' as const, priority: 0.4 },
    { url: `${baseUrl}/politica-privacidade`, lastModified: currentDate, changeFrequency: 'yearly' as const, priority: 0.4 },
    { url: `${baseUrl}/termos-uso`, lastModified: currentDate, changeFrequency: 'yearly' as const, priority: 0.4 },

    // GUIAS ROOT
    { url: `${baseUrl}/guias`, lastModified: currentDate, changeFrequency: 'daily' as const, priority: 0.9 },

    // INTERNACIONAL (EXTERIOR)
    { url: `${baseUrl}/exterior`, lastModified: currentDate, changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/exterior/servicos`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${baseUrl}/exterior/contato`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/exterior/orcamento`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/exterior/servicos/suporte-tecnico`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${baseUrl}/exterior/servicos/criacao-sites`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${baseUrl}/exterior/servicos/migracao-dados`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${baseUrl}/exterior/servicos/configuracao-redes`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${baseUrl}/exterior/servicos/suporte-nuvem`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${baseUrl}/exterior/servicos/consultoria`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.7 },
  ];

  // Local SEO Slugs
  const localSlugs = ['sao-paulo', 'rio-de-janeiro', 'parana'];
  const localUrls = localSlugs.map(slug => ({
    url: `${baseUrl}/tecnico-informatica-em/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticUrls, ...guideUrls, ...localUrls];
}