import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import { getAllGuides } from '@/lib/guides';
import { CATEGORY_CONFIG } from '../GuiasServer';
import { Clock, Award, BookOpen, ArrowRight, Zap } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const categoryConfig = CATEGORY_CONFIG.find(c => c.id === category);
  
  if (!categoryConfig) {
    return {
      title: 'Categoria Não Encontrada',
      description: 'Esta categoria não existe.'
    };
  }
  
  const allGuides = getAllGuides();
  const categoryGuides = allGuides.filter(g => g.category === category);
  
  return {
    title: `${categoryConfig.title} | Guias Voltris`,
    description: categoryConfig.description,
    keywords: [categoryConfig.title, 'guias', 'tutorial', 'otimização', ...categoryGuides.slice(0, 5).map(g => g.title)],
    openGraph: {
      title: `${categoryConfig.title} | Guias Voltris`,
      description: categoryConfig.description,
      url: `https://www.voltris.com.br/guias/${category}`,
      type: 'website',
      images: [{
        url: 'https://www.voltris.com.br/logo.png',
        width: 1200,
        height: 630
      }]
    },
    alternates: {
      canonical: `https://www.voltris.com.br/guias/${category}`
    }
  };
}

export default async function CategoryHubPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const categoryConfig = CATEGORY_CONFIG.find(c => c.id === category);
  
  if (!categoryConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">Categoria não encontrada</h1>
      </div>
    );
  }
  
  const allGuides = getAllGuides();
  const categoryGuides = allGuides.filter(g => g.category === category);
  
  // Identificar guias pilares (mais autoridade)
  const pillarGuides = identifyPillarGuides(categoryGuides);
  const otherGuides = categoryGuides.filter(g => !pillarGuides.includes(g));
  
  const Icon = categoryConfig.icon;
  
  // JSON-LD CollectionPage Schema
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": categoryConfig.title,
    "description": categoryConfig.description,
    "url": `https://www.voltris.com.br/guias/${category}`,
    "hasPart": categoryGuides.map(guide => ({
      "@type": "TechArticle",
      "name": guide.title,
      "url": `https://www.voltris.com.br/guias/${guide.id}`,
      "author": {
        "@type": "Person",
        "name": "Douglas Felipe"
      },
      "datePublished": "2025-01-01",
      "dateModified": "2026-01-01"
    }))
  };
  
  // JSON-LD Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.voltris.com.br"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Guias",
        "item": "https://www.voltris.com.br/guias"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": categoryConfig.title,
        "item": `https://www.voltris.com.br/guias/${category}`
      }
    ]
  };
  
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      
      <Header />
      <main className="min-h-screen bg-gray-50 font-sans">
        {/* Hero Section */}
        <section className="min-h-[60vh] flex flex-col justify-center relative overflow-hidden border-b border-gray-200">
          <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-blue-100/30 blur-[150px] rounded-full pointer-events-none"></div>
          
          <div className="relative max-w-5xl mx-auto text-center px-4 z-10 py-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-blue-200 shadow-sm mb-8 text-xs font-medium text-gray-600">
              <Icon className="w-3 h-3" style={{ color: categoryConfig.color }} />
              <span>Categoria: {categoryConfig.title}</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
              {categoryConfig.title}
            </h1>
            
            <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto leading-relaxed">
              {categoryConfig.description}
            </p>
            
            <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
              <span className="px-4 py-2 bg-white border border-gray-200 rounded-full">
                {categoryGuides.length} guias disponíveis
              </span>
              <span className="px-4 py-2 bg-white border border-gray-200 rounded-full">
                Atualizado em 2026
              </span>
            </div>
          </div>
        </section>
        
        {/* Pillar Guides Section */}
        {pillarGuides.length > 0 && (
          <section className="py-16 px-4 bg-white">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Guias Principais</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pillarGuides.map(guide => (
                  <Link key={guide.id} href={`/guias/${guide.id}`} className="group">
                    <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition border border-gray-200 group-hover:border-blue-300">
                      <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition">
                        {guide.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                        {guide.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="px-2 py-1 bg-white rounded-full border border-gray-200">
                          {guide.difficulty}
                        </span>
                        <span>•</span>
                        <span>{guide.time}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
        
        {/* All Guides Section */}
        <section className="py-16 px-4 bg-gray-100">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Todas as Guias</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherGuides.map(guide => (
                <Link key={guide.id} href={`/guias/${guide.id}`} className="group">
                  <div className="bg-white rounded-xl p-6 hover:shadow-lg transition border border-gray-200 group-hover:border-blue-300">
                    <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition">
                      {guide.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                      {guide.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="px-2 py-1 bg-gray-100 rounded-full">
                        {guide.difficulty}
                      </span>
                      <span>•</span>
                      <span>{guide.time}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-24 px-4 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Precisa de Ajuda com {categoryConfig.title}?
            </h2>
            <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
              O Voltris Optimizer automatiza todas as configurações desta categoria em segundos.
            </p>
            <Link
              href="/voltrisoptimizer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:scale-105 transition shadow-lg"
            >
              <Zap className="w-5 h-5" />
              Baixar Voltris Optimizer
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

// Identificar guias pilares (mais autoridade)
function identifyPillarGuides(guides: any[]): any[] {
  const scored = guides.map(guide => {
    let score = 0;
    
    // Título longo indica conteúdo abrangente
    if (guide.title.length > 60) score += 2;
    if (guide.title.length > 80) score += 3;
    
    // Dificuldade Intermediário/Avançado indica conteúdo técnico
    if (guide.difficulty === 'Intermediário') score += 2;
    if (guide.difficulty === 'Avançado') score += 3;
    
    return { guide, score };
  });
  
  // Top 20% são pilares
  const pillarCount = Math.ceil(guides.length * 0.2);
  
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, pillarCount)
    .map(item => item.guide);
}
