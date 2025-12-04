import { Metadata } from 'next';
import { generateMetadata } from '@/utils/seoHelpers';

export const metadata: Metadata = generateMetadata({
  title: "Instalação do Office Remota - VOLTRIS",
  description: "Instalação remota do Microsoft Office (Word, Excel, PowerPoint, Outlook). Configuração completa e ativação. Suporte técnico especializado.",
  keywords: [
    "instalação Office",
    "Microsoft Office",
    "Word Excel PowerPoint",
    "instalação remota",
    "configuração Office",
    "ativação Office",
    "Office 365",
    "Office 2021",
    "Office 2019",
    "suporte Office"
  ],
  url: '/instalacao-office',
  image: 'https://voltris.com.br/logo.png'
}); 