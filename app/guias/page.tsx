import { Metadata } from 'next';
import GuiasClient from './GuiasClient';
import { getAllGuides } from '@/lib/guides';

export const metadata: Metadata = {
  title: '300+ Guias de Otimização de PC e Windows 11 | VOLTRIS',
  description: 'Biblioteca gratuita de guias técnicos: aumentar FPS, otimizar Windows 11, corrigir erros, hardware e games. Atualizado 2026.',
  keywords: 'guia formatação windows, tutorial otimização pc, remover virus pc, consertar internet lenta, montar pc gamer, backup dados, segurança digital',
  openGraph: {
    title: '300+ Guias de Otimização de PC e Windows 11 | VOLTRIS',
    description: 'Biblioteca gratuita de guias técnicos: aumentar FPS, otimizar Windows 11, corrigir erros, hardware e games. Atualizado 2026.',
    url: 'https://www.voltris.com.br/guias',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.voltris.com.br/guias',
  },
};

export default function Guias() {
  const guides = getAllGuides();
  return <GuiasClient initialGuides={guides} />;
}
