import { Metadata } from 'next';
import GuiasClient from './GuiasClient';

export const metadata: Metadata = {
  title: 'Guias e Tutoriais Técnicos | VOLTRIS',
  description: 'Aprenda a formatar, otimizar, remover vírus e resolver problemas no seu PC com nossos guias detalhados escritos por especialistas.',
  keywords: 'guia formatação windows, tutorial otimização pc, remover virus pc, consertar internet lenta, montar pc gamer, backup dados, segurança digital',
  openGraph: {
    title: 'Guias e Tutoriais Técnicos | VOLTRIS',
    description: 'Tutoriais passo-a-passo para resolver problemas do seu computador.',
    url: 'https://voltris.com.br/guias',
    type: 'website',
  },
};

export default function Guias() {
  return <GuiasClient />;
}
