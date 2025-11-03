import { Metadata } from 'next';
import { generateMetadata } from '@/utils/seoHelpers';

export const metadata: Metadata = generateMetadata({
  title: "Otimização de PC Remota - VOLTRIS",
  description: "Otimização remota completa do seu computador para melhor desempenho. Aceleração de sistema, limpeza de arquivos temporários e configuração avançada.",
  keywords: [
    "otimização de PC",
    "otimização de computador",
    "aceleração de sistema",
    "limpeza de computador",
    "melhorar desempenho",
    "computador lento",
    "otimização Windows",
    "limpeza de arquivos",
    "desfragmentação",
    "configuração avançada"
  ],
  url: '/otimizacao-pc',
  image: 'https://voltris.com.br/logo.png'
}); 