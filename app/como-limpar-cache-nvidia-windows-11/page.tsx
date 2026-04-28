import { Metadata } from 'next';
import React from 'react';
import { GuideTemplateClient } from '@/components/GuideTemplateClient';

export const metadata: Metadata = {
  title: 'Como Limpar Cache NVIDIA Windows 11 | Shader Cache 2026',
  description: 'Jogos com micro-travamentos? Aprenda a limpar o Shader Cache da NVIDIA para resolver problemas de performance e garantir fluidez em novos updates de drivers. Guia completo.',
  keywords: [
    'como limpar cache nvidia windows 11',
    'shader cache nvidia reset',
    'limpar dxcache nvidia',
    'voltris ultra cleaner nvidia',
    'corrigir stuttering nvidia windows 11',
    'apagar cache driver de vídeo',
    'nvidia shader cache limpeza',
    'dxcache glcache delete',
    'nvidia performance problems'
  ],
  openGraph: {
    title: 'Como Limpar Cache NVIDIA Windows 11 | Guia Shader Cache 2026',
    description: 'Resolva micro-travamentos e problemas de performance limpando o Shader Cache da NVIDIA. Guia completo para Windows 11.',
    url: 'https://voltris.com.br/como-limpar-cache-nvidia-windows-11',
    siteName: 'VOLTRIS',
    locale: 'pt_BR',
    type: 'article',
    images: [
      {
        url: 'https://voltris.com.br/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Como Limpar Cache NVIDIA Windows 11 - Guia VOLTRIS',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Como Limpar Cache NVIDIA Windows 11 | Guia VOLTRIS',
    description: 'Resolva micro-travamentos limpando o Shader Cache da NVIDIA.',
    creator: '@voltris',
  },
  alternates: {
    canonical: 'https://voltris.com.br/como-limpar-cache-nvidia-windows-11',
  },
};

export default function LimparCacheNvidia() {
    const title = 'Como Limpar o Cache da NVIDIA no Windows 11 (Shader Cache 2026)';
    const description = 'Seus jogos estão com micro-travamentos? Aprenda a limpar o Shader Cache da NVIDIA para resolver problemas de performance e garantir a fluidez em novos updates de drivers.';
    const keywords = ['como limpar cache nvidia windows 11', 'shader cache nvidia reset', 'limpar dxcache nvidia', 'voltris ultra cleaner nvidia', 'corrigir stuttering nvidia windows 11', 'apagar cache driver de vídeo'];

    const summaryTable = [
        { label: "O Inimigo Oculto", value: "Shader Cache Corrompido" },
        { label: "Maior Benefício", value: "Fim do Stuttering (Engasgos)" },
        { label: "Técnica Chave", value: "DXCache & GLCache Purge" },
        { label: "Frequência Recomendada", value: "A cada novo Driver" }
    ];

    const contentSections = [
        {
            title: "O que é o Shader Cache e por que ele trava seu jogo?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O **Shader Cache** é um banco de dados que seu driver da NVIDIA cria para armazenar códigos pré-compilados do motor gráfico dos seus jogos. Isso deveria acelerar o carregamento, mas quando o cache fica muito grande ou corrompido (especialmente após um update de driver), ele causa micro-travamentos constantes.
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed">
            Se você sente que o seu Windows 11 está com lag mesmo em menus simples ou que o seu FPS está oscilando, limpar as pastas <code>DXCache</code> e <code>GLCache</code> é o passo obrigatório de limpeza técnica.
        </p>
        
        <div class="bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-2xl my-6">
            <h4 class="text-emerald-400 font-black mb-2 flex items-center gap-2">Configuração Pro: Shader Cache Size</h4>
            <p class="text-gray-300 text-sm">
                No Painel de Controle da NVIDIA, recomendamos definir o <code>Shader Cache Size</code> para **Unbreakable** ou **Unlimited**. Isso evita que o Windows sobrescreva arquivos importantes, mas exige que você faça a limpeza manual (ou automática com o Voltris) se o driver mudar.
            </p>
        </div>
      `
        },
        {
            title: "Como Limpar Manualmente (Sem quebrar o Driver)",
            content: `
        <p class="mb-4 text-gray-300">
            Você deve fechar todos os seus jogos e navegar até:
            <br/><br/>
            <code>%LOCALAPPDATA%\\NVIDIA\\DXCache</code>
            <br/><br/>
            Apague tudo o que for possível dentro desta pasta. Alguns arquivos podem estar em uso pelo Windows; ignore-os. Repita o processo na pasta <code>GLCache</code>. Isso forçará o sistema a reconstruir o 'mapa' de performance de forma pura e estável.
        </p>
      `
        },
        {
            title: "A Vantagem do Voltris Ultra Cleaner GPU-Fix",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
            O **Voltris Ultra Cleaner** possui um módulo exclusivo para limpeza de kernels de vídeo que o Windows ignora.
        </p>
        <ul class="space-y-4 text-slate-300">
            <li class="flex items-start gap-3"><div class="w-2 h-2 rounded-full bg-[#10b981] mt-1.5 shrink-0"></div> **Deep Driver Flush:** Limpa registros de versões de drivers antigas que conflitam com a atual.</li>
            <li class="flex items-start gap-3"><div class="w-2 h-2 rounded-full bg-[#10b981] mt-1.5 shrink-0"></div> **Auto DXCache Reset:** Agenda limpezas periódicas de shaders para garantir a estabilidade do PC.</li>
            <li class="flex items-start gap-3"><div class="w-2 h-2 rounded-full bg-[#10b981] mt-1.5 shrink-0"></div> **VRAM Management:** Libera a memória de vídeo reservada por processos zumbis do Windows.</li>
        </ul>
      `
        }
    ];

    const faqItems = [
        {
            question: "Limpando o cache, o primeiro carregamento do jogo será lento?",
            answer: "Sim, nos primeiros 30 segundos de gameplay, o jogo precisará re-compilar os shaders. No entanto, após essa etapa curta, a performance será muito mais estável e fluida do que antes."
        },
        {
            question: "Isso funciona para AMD também?",
            answer: "Embora o guia foque em NVIDIA, a estrutura de shaders no Windows é semelhante para AMD e Intel. O Voltris Optimizer possui módulos dedicados para limpar caches de todas as marcas de GPU."
        }
    ];

    const relatedGuides = [
        { href: "/melhores-programas-otimizar-windows", title: "Top Otimizadores", description: "Veja por que a Voltris é a melhor para manutenção de GPU." },
        { href: "/diagnostico-hardware-temperatura-pc", title: "Saúde Térmica", description: "Verifique se a sua placa de vídeo está trabalhando quente." }
    ];

    return (
        <GuideTemplateClient
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="10 min"
            difficultyLevel="Intermediário"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
            faqItems={faqItems}
            showVoltrisOptimizerCTA={true}
            keyPoints={[
                "Diferenciar caches DX11, DX12 e OpenGL",
                "Gestão profissional de Shader Cache no Painel NVIDIA",
                "Limpeza profunda de registros de drivers gráficos",
                "Otimização de entrega de memória de vídeo pelo Windows",
                "Fim dos micro-travamentos (*stuttering*) em novos jogos"
            ]}
        />
    );
}
