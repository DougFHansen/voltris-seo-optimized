import { Metadata } from 'next';
import { generateMetadata } from '@/utils/seoHelpers';

export const metadata: Metadata = generateMetadata({
  title: "Criar Site Profissional - VOLTRIS",
  description: "Criação de sites profissionais e responsivos para sua empresa. Desenvolvimento web com SEO otimizado, design moderno e suporte completo. Solicite seu orçamento!",
  keywords: [
    "criação de sites",
    "desenvolvimento web",
    "site profissional",
    "design responsivo",
    "SEO",
    "marketing digital",
    "site empresarial",
    "e-commerce",
    "landing page",
    "portfolio",
    "site institucional"
  ],
  url: '/criar-site',
  image: 'https://voltris.com.br/logo.png'
}); 