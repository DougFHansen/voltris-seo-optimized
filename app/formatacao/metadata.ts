import { Metadata } from 'next';
import { generateMetadata } from '@/utils/seoHelpers';

export const metadata: Metadata = generateMetadata({
  title: "Formatação de Computador Remota - VOLTRIS",
  description: "Formatação remota completa do seu computador com instalação de programas essenciais. Backup de dados, instalação de drivers e otimização. Atendimento 24h!",
  keywords: [
    "formatação de computador",
    "formatação remota",
    "formatação Windows",
    "instalação de programas",
    "backup de dados",
    "driver impressora",
    "antivírus",
    "Office",
    "limpeza computador",
    "otimização sistema"
  ],
  url: '/formatacao',
  image: 'https://voltris.com.br/logo.png'
}); 