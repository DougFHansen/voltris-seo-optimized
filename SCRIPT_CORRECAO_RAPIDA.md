# 🚀 SCRIPT DE CORREÇÃO RÁPIDA - PROBLEMAS CRÍTICOS

## EXECUTAR IMEDIATAMENTE

### 1. REMOVER REFERÊNCIAS A /BLOG (Schema.org)

**Arquivo:** `app/layout.tsx` (linhas 261-279)

**ANTES:**
```typescript
"name": [
  "Início", "Sobre", "Serviços", "FAQ",
  "Blog", // ❌ REMOVER
  "Guias", "Contato"
],
"url": [
  "https://voltris.com.br/",
  "https://voltris.com.br/about",
  "https://voltris.com.br/servicos",
  "https://voltris.com.br/faq",
  "https://voltris.com.br/blog", // ❌ REMOVER
  "https://voltris.com.br/guias",
  "https://voltris.com.br/contato"
]
```

**DEPOIS:**
```typescript
"name": [
  "Início", "Sobre", "Serviços", "Guias", "FAQ", "Contato"
],
"url": [
  "https://voltris.com.br/",
  "https://voltris.com.br/sobre",
  "https://voltris.com.br/servicos",
  "https://voltris.com.br/guias",
  "https://voltris.com.br/faq",
  "https://voltris.com.br/contato"
]
```

---

### 2. CRIAR TEMPLATE DE METADATA PARA GUIAS

**Criar arquivo:** `app/guias/_template-metadata.ts`

```typescript
import type { Metadata } from 'next';

export function createGuideMetadata(
  title: string,
  description: string,
  keywords: string[],
  slug: string
): Metadata {
  return {
    title: `${title} | Guia Completo 2026`,
    description,
    keywords,
    alternates: {
      canonical: `https://voltris.com.br/guias/${slug}`
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    },
    openGraph: {
      title: `${title} | VOLTRIS`,
      description,
      url: `https://voltris.com.br/guias/${slug}`,
      type: 'article',
      locale: 'pt_BR',
      images: [{
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: title
      }]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description
    }
  };
}
```

---

### 3. ADICIONAR METADATA EM GUIAS SEM ARQUIVO

**Guias prioritários para adicionar metadata.ts:**

1. `atalhos-produtividade-windows`
2. `atualizacao-drivers-video`
3. `autenticacao-dois-fatores`
4. `automacao-tarefas`
5. `compartilhamento-impressoras`
6. `configuracao-roteador-wifi`
7. `criar-pendrive-bootavel`
8. `criptografia-dados`
9. `diagnostico-hardware`
10. `extensoes-produtividade-chrome`

**Template:**
```typescript
// app/guias/[slug]/metadata.ts
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Como [Ação] [Tecnologia] | Guia Completo 2026',
  description: 'Aprenda [ação] passo a passo. [Benefício principal]. Tutorial profissional atualizado 2026.',
  keywords: [
    'palavra-chave principal',
    'variação 1',
    'variação 2',
    'long-tail keyword 1',
    'long-tail keyword 2'
  ],
  alternates: {
    canonical: 'https://voltris.com.br/guias/[slug]'
  },
  robots: {
    index: true,
    follow: true
  }
};
```

---

### 4. ADICIONAR LINKAGEM INTERNA EM GUIAS

**Padrão de links relacionados:**

```typescript
// Adicionar em CADA page.tsx:
const relatedGuides = [
  {
    href: "/guias/formatacao-windows",
    title: "Como Formatar Windows",
    description: "Guia completo de formatação"
  },
  {
    href: "/guias/otimizacao-performance",
    title: "Otimização de Performance",
    description: "Acelere seu PC"
  },
  {
    href: "/guias/seguranca-digital",
    title: "Segurança Digital",
    description: "Proteja seus dados"
  }
];
```

**Mapa de linkagem (Hub & Spoke):**

```
FORMATAÇÃO (Hub)
├─→ backup-dados
├─→ instalacao-drivers
├─→ otimizacao-performance
├─→ seguranca-digital
└─→ instalacao-windows-11

SEGURANÇA (Hub)
├─→ remocao-virus-malware
├─→ firewall-configuracao
├─→ vpn-configuracao
├─→ autenticacao-dois-fatores
└─→ criptografia-dados

PERFORMANCE (Hub)
├─→ limpeza-computador
├─→ otimizacao-registro
├─→ gestao-servicos
├─→ monitoramento-sistema
└─→ manutencao-preventiva
```

---

### 5. EXPANDIR CONTEÚDO - TEMPLATE

**Estrutura mínima (1500 palavras):**

```typescript
const contentSections = [
  {
    title: "Introdução: O Que É e Por Que Importa",
    content: `
      <p>Explicação completa do tema (150 palavras)</p>
      <p>Contexto e importância (150 palavras)</p>
    `,
    subsections: [
      {
        subtitle: "Para Quem É Este Guia",
        content: `<p>Público-alvo e pré-requisitos (100 palavras)</p>`
      },
      {
        subtitle: "O Que Você Vai Aprender",
        content: `<ul><li>Tópico 1</li><li>Tópico 2</li><li>Tópico 3</li></ul>`
      }
    ]
  },
  {
    title: "Pré-Requisitos e Ferramentas",
    content: `
      <p>Lista de ferramentas necessárias (200 palavras)</p>
      <ul>
        <li>Ferramenta 1 + link de download</li>
        <li>Ferramenta 2 + link de download</li>
      </ul>
    `
  },
  {
    title: "Passo a Passo Detalhado",
    content: `<p>Introdução ao processo (100 palavras)</p>`,
    subsections: [
      {
        subtitle: "Etapa 1: [Nome da Etapa]",
        content: `
          <p>Explicação detalhada (200 palavras)</p>
          <ol>
            <li>Passo 1</li>
            <li>Passo 2</li>
            <li>Passo 3</li>
          </ol>
          <div class="tip-box">💡 Dica: [Dica útil]</div>
        `
      },
      {
        subtitle: "Etapa 2: [Nome da Etapa]",
        content: `<p>Explicação detalhada (200 palavras)</p>`
      },
      {
        subtitle: "Etapa 3: [Nome da Etapa]",
        content: `<p>Explicação detalhada (200 palavras)</p>`
      }
    ]
  },
  {
    title: "Troubleshooting: Problemas Comuns",
    content: `<p>Introdução (50 palavras)</p>`,
    subsections: [
      {
        subtitle: "Erro 1: [Descrição]",
        content: `
          <p><strong>Causa:</strong> Explicação (50 palavras)</p>
          <p><strong>Solução:</strong> Passo a passo (100 palavras)</p>
        `
      },
      {
        subtitle: "Erro 2: [Descrição]",
        content: `<p>Causa e solução (150 palavras)</p>`
      }
    ]
  },
  {
    title: "Dicas Avançadas e Otimizações",
    content: `
      <p>Técnicas avançadas para usuários experientes (300 palavras)</p>
      <ul>
        <li>Dica 1</li>
        <li>Dica 2</li>
        <li>Dica 3</li>
      </ul>
    `
  }
];

const faqItems = [
  {
    question: "Pergunta frequente 1?",
    answer: "Resposta detalhada com <strong>destaques</strong> (50 palavras)"
  },
  {
    question: "Pergunta frequente 2?",
    answer: "Resposta detalhada (50 palavras)"
  },
  {
    question: "Pergunta frequente 3?",
    answer: "Resposta detalhada (50 palavras)"
  },
  {
    question: "Pergunta frequente 4?",
    answer: "Resposta detalhada (50 palavras)"
  },
  {
    question: "Pergunta frequente 5?",
    answer: "Resposta detalhada (50 palavras)"
  },
  {
    question: "Pergunta frequente 6?",
    answer: "Resposta detalhada (50 palavras)"
  }
];

// Total: ~1800 palavras
```

---

### 6. SOLICITAR INDEXAÇÃO (Google Search Console)

**Processo:**

1. Acessar: https://search.google.com/search-console
2. Selecionar propriedade: voltris.com.br
3. URL Inspection Tool
4. Inserir URL do guia
5. Clicar em "Request Indexing"
6. Aguardar 24-48h

**Priorizar:**
```
1. /guias/formatacao-windows
2. /guias/otimizacao-performance
3. /guias/seguranca-digital
4. /guias/remocao-virus-malware
5. /guias/backup-dados
6. /guias/instalacao-drivers
7. /guias/resolver-erros-windows
8. /guias/limpeza-computador
9. /guias/manutencao-preventiva
10. /guias/instalacao-windows-11
```

---

### 7. MONITORAMENTO DIÁRIO

**Verificar no Search Console:**

```
Coverage Report:
- Excluded → Discovered - currently not indexed
  Meta: Reduzir de 180 para <50 em 30 dias

- Valid → Indexed
  Meta: Aumentar de 41 para 80+ em 30 dias

Performance Report:
- Impressions: Meta +300%
- Clicks: Meta +200%
- CTR: Meta +25%
- Position: Meta -15 (melhoria)
```

---

## ORDEM DE EXECUÇÃO

### DIA 1 (HOJE):
1. ✅ Remover /blog do Schema.org
2. ✅ Criar template de metadata
3. ✅ Adicionar metadata em 10 guias prioritários

### DIA 2:
4. ✅ Expandir 3 guias principais (2000+ palavras)
5. ✅ Adicionar linkagem interna em 10 guias

### DIA 3:
6. ✅ Expandir mais 3 guias (2000+ palavras)
7. ✅ Solicitar indexação dos 6 guias expandidos

### DIA 4-7:
8. ✅ Expandir 4 guias restantes (top 10)
9. ✅ Adicionar FAQs em todos os 10 guias
10. ✅ Monitorar indexação no Search Console

---

## RESULTADO ESPERADO (7 DIAS):

- ✅ 10 guias robustos (2000+ palavras)
- ✅ Metadata completa em 50 guias
- ✅ Linkagem interna básica implementada
- ✅ Primeiras 10-15 páginas indexadas
- ✅ +50% de impressões

---

**IMPORTANTE:** Executar na ordem. Não pular etapas.
