import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdSenseBanner from '@/components/AdSenseBanner';

interface GuideTemplateProps {
  title: string;
  description: string;
  keywords: string[];
  estimatedTime: string;
  difficultyLevel: string;
  contentSections: ContentSection[];
  relatedGuides?: RelatedGuide[];
  author?: string;
  lastUpdated?: string;
}

interface ContentSection {
  title: string;
  content: string;
  subsections?: Subsection[];
}

interface Subsection {
  subtitle: string;
  content: string;
}

interface RelatedGuide {
  href: string;
  title: string;
  description: string;
}

export function createGuideMetadata(title: string, description: string, keywords: string[]): Metadata {
  return {
    title: `${title} | VOLTRIS`,
    description,
    keywords,
    openGraph: {
      title: `${title} | VOLTRIS`,
      description,
      type: "article",
      locale: "pt_BR"
    },
    twitter: {
      card: "summary_large_image",
      title,
      description
    }
  };
}

export function GuideTemplate({
  title,
  description,
  keywords,
  estimatedTime,
  difficultyLevel,
  contentSections,
  relatedGuides = [],
  author = "Equipe Técnica Voltris",
  lastUpdated = "Janeiro 2025"
}: GuideTemplateProps) {
  const hasCustomConclusion = contentSections.some(section =>
    section.title.toLowerCase().includes('conclusão') ||
    section.title.toLowerCase().includes('conclusao') ||
    section.title.toLowerCase().includes('considerações finais')
  );

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-[#0A0A0F] via-[#121218] to-[#0A0A0F] pt-24">

        {/* Hero Section */}
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF4B6B]/10 via-[#8B31FF]/10 to-[#31A8FF]/10"></div>
          <div className="relative max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {title}
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              {description}
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
              <span className="bg-[#1c1c1e] px-3 py-1 rounded-full">Tempo estimado: {estimatedTime}</span>
              <span className="bg-[#1c1c1e] px-3 py-1 rounded-full">Nível: {difficultyLevel}</span>
              <span className="bg-[#1c1c1e] px-3 py-1 rounded-full">Autor: {author}</span>
              <span className="bg-[#1c1c1e] px-3 py-1 rounded-full">Atualizado: {lastUpdated}</span>
            </div>
          </div>
        </section>

        {/* Table of Contents */}
        <section className="py-12 px-4 bg-[#121218]">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6">Conteúdo do Guia</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contentSections.slice(0, 4).map((section, index) => (
                <div key={index} className="bg-[#1c1c1e] p-4 rounded-lg">
                  <h3 className="text-white font-semibold mb-2">{section.title}</h3>
                  <ul className="text-gray-400 text-sm space-y-1">
                    {section.subsections?.slice(0, 3).map((sub, subIndex) => (
                      <li key={subIndex}>• {sub.subtitle}</li>
                    )) || <li>• Conteúdo especializado</li>}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            {contentSections.map((section, sectionIndex) => (
              <div
                key={sectionIndex}
                className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-6 sm:p-8 rounded-2xl border border-[#FF4B6B]/20 shadow-lg"
              >
                <h2 className="text-3xl font-bold text-white mb-4">{section.title}</h2>
                <div
                  className="text-gray-300 leading-relaxed prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />

                {section.subsections && (
                  <div className="mt-6 space-y-6">
                    {section.subsections.map((subsection, subIndex) => (
                      <div key={subIndex}>
                        <h3 className="text-2xl font-bold text-white mb-3">{subsection.subtitle}</h3>
                        <div
                          className="text-gray-300 leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: subsection.content }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Conclusão (Generic) - Only shown if no specific conclusion exists */}
            {!hasCustomConclusion && (
              <div className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-6 sm:p-8 rounded-2xl border border-[#31A8FF]/20 shadow-lg">
                <h2 className="text-3xl font-bold text-white mb-4">Conclusão</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Este guia apresentou informações técnicas detalhadas sobre {title.toLowerCase()},
                  com procedimentos práticos, melhores práticas e soluções específicas para
                  os desafios comuns encontrados nesta área de especialização.
                </p>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Lembre-se de que a tecnologia evolui constantemente, então mantenha-se atualizado
                  com as melhores práticas e novas ferramentas disponíveis no mercado.
                </p>
                <div className="bg-[#171313] p-6 rounded-lg border border-[#31A8FF]/30 mt-6">
                  <p className="text-white font-semibold mb-3 text-lg">Precisa de Assistência Profissional?</p>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Nossa equipe especializada está pronta para ajudar com implementações complexas,
                    troubleshooting avançado e consultoria técnica personalizada.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      href="/todos-os-servicos"
                      className="px-6 py-3 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300 text-center"
                    >
                      Ver Serviços Especializados
                    </Link>
                    <Link
                      href="https://wa.me/5511996716235?text=Olá!%20Preciso%20de%20ajuda%20técnica."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 border-2 border-[#31A8FF] text-[#31A8FF] font-bold rounded-xl hover:bg-[#31A8FF] hover:text-white transition-all duration-300 text-center"
                    >
                      Falar com Especialista
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Related Guides */}
        {relatedGuides.length > 0 && (
          <section className="py-12 px-4 bg-[#1D1919]">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Guias Relacionados</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedGuides.map((guide, index) => (
                  <Link
                    key={index}
                    href={guide.href}
                    className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-6 rounded-xl border border-[#8B31FF]/10 hover:border-[#FF4B6B]/30 transition-all duration-300"
                  >
                    <h3 className="text-xl font-bold text-white mb-2">{guide.title}</h3>
                    <p className="text-gray-400 text-sm">{guide.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <AdSenseBanner />
      <Footer />
    </>
  );
}