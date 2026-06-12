import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Glossário Técnico de Informática e Hardware | VOLTRIS',
    description: 'Dicionário técnico com os principais termos de hardware, software, otimização de PC e performance gamer explicados de forma simples.',
    keywords: ['glossário técnico informática', 'termos de hardware', 'dicionário tech', 'o que é fps', 'o que é bottleneck', 'termos pc gamer'],
    alternates: {
        canonical: 'https://www.voltris.com.br/glossario',
    }
};

export default function GlossarioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
}
