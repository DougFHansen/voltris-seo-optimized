# 📘 Guia de Boas Práticas - Criação de Novos Guias Voltris

## 🎯 Checklist Obrigatório para Cada Novo Guia

### 1. META TAGS (Prioridade MÁXIMA)

```typescript
// metadata.ts
export const metadata: Metadata = {
  // ✅ Title: 50-60 caracteres (MÁXIMO 60!)
  title: 'Como [Ação] [Tecnologia] | Guia [Ano]',
  
  // ✅ Description: 150-155 caracteres (MÁXIMO 155!)
  description: 'Aprenda [ação] de forma [adjetivo]. Guia passo a passo com [benefícios]. Tutorial profissional.',
  
  // ✅ Keywords: 10-15 termos relevantes
  keywords: [
    'palavra-chave principal',
    'variação 1',
    'variação 2',
    'long-tail keyword 1',
    'long-tail keyword 2'
  ]
};
```

**Ferramentas para validar:**
- Title/Description: https://moz.com/learn/seo/title-tag
- Contador de caracteres: https://charactercounttool.com/

---

### 2. ESTRUTURA DE HEADINGS

```tsx
// ✅ CORRETO
<h1>Título Principal do Guia</h1>
  <h2>Seção Principal 1</h2>
    <h3>Subseção 1.1</h3>
    <h3>Subseção 1.2</h3>
  <h2>Seção Principal 2</h2>
    <h3>Subseção 2.1</h3>

// ❌ ERRADO
<h1>Parte 1</h1>
<h1>Parte 2</h1> // Múltiplos H1!
<h3>Seção</h3>
  <h2>Subseção</h2> // Hierarquia quebrada!
```

**Regras:**
- ✅ Apenas 1 H1 por página
- ✅ Hierarquia sequencial (H1 → H2 → H3)
- ✅ Descritivo, não genérico ("Instalação de Drivers" > "Passo 2")

---

### 3. POSICIONAMENTO DE ADSENSE

```tsx
// ❌ NUNCA FAÇA ISSO
<Header />
<AdSenseBanner /> // ❌ Antes do conteúdo!
<article>Conteúdo...</article>

// ✅ SEMPRE FAÇA ASSIM
<Header />
<article>
  <section>Introdução...</section>
  <section>Passo 1...</section>
  
  {/* ✅ Após 40-60% do conteúdo */}
  <div className="ad-container">
    <p className="ad-label">Publicidade</p>
    <AdSenseBanner />
  </div>
  
  <section>Passo 2...</section>
  <section>Conclusão...</section>
</article>

{/* ✅ Final da página (opcional) */}
<AdSenseBanner />
<Footer />
```

**Regras de Ouro:**
1. Conteúdo SEMPRE vem primeiro
2. Anúncios após 40-60% do conteúdo
3. Máximo 3 anúncios por página
4. Label "Publicidade" visível
5. Não bloquear navegação ou CTAs

---

### 4. CONTEÚDO EEAT (Expertise, Experience, Authoritativeness, Trustworthiness)

#### Expertise (Especialização)
```tsx
// ✅ Adicionar credenciais do autor
<div className="author-box">
  <img src="/authors/nome.jpg" alt="Nome do Especialista" />
  <div>
    <h4>Nome do Especialista</h4>
    <p>Certificação Microsoft (MCP) | 15+ anos de experiência</p>
  </div>
</div>
```

#### Experience (Experiência)
```tsx
// ✅ Casos reais e dados
<div className="case-study">
  <h3>📊 Caso Real</h3>
  <p>"Em 2024, aplicamos esta técnica em 500+ computadores. 
  95% tiveram aumento de 200% na velocidade."</p>
</div>
```

#### Authoritativeness (Autoridade)
```tsx
// ✅ Citar fontes oficiais
<p>Segundo a <a href="https://docs.microsoft.com" rel="nofollow">
documentação oficial da Microsoft</a>, o método recomendado é...</p>
```

#### Trustworthiness (Confiabilidade)
```tsx
// ✅ Disclaimers e avisos
<div className="warning">
  ⚠️ <strong>Aviso:</strong> Faça backup antes de prosseguir. 
  Não nos responsabilizamos por perda de dados.
</div>
```

---

### 5. ELEMENTOS VISUAIS

#### Imagens Obrigatórias:
1. **Screenshot do processo principal** (após H2 principal)
2. **Diagrama ou infográfico** (conceitos complexos)
3. **Resultado final** (antes/depois)

```tsx
<figure>
  <img 
    src="/guias/[slug]/[nome].webp" 
    alt="Descrição detalhada do que aparece na imagem"
    loading="lazy"
    width="800" 
    height="600" 
  />
  <figcaption>Legenda explicativa da imagem</figcaption>
</figure>
```

**Formato:**
- Tipo: WebP (melhor compressão)
- Tamanho: Máx 200KB
- Dimensões: 800x600px ou 1200x800px
- Alt text: Descritivo, com palavra-chave

---

### 6. LINKAGEM INTERNA

```tsx
// ✅ Links contextuais (dentro do texto)
<p>Após a formatação, é crucial instalar um 
<a href="/guias/seguranca-digital">antivírus profissional</a> 
e configurar o <a href="/guias/backup-dados">backup automático</a>.</p>

// ✅ Guias relacionados (final da página)
const relatedGuides = [
  {
    href: "/guias/otimizacao-performance",
    title: "Otimização de Performance",
    description: "Acelere seu PC após a formatação"
  },
  // Mínimo 3, máximo 5
];
```

**Regras:**
- Mínimo 3 links internos por guia
- Anchor text descritivo (não "clique aqui")
- Links relevantes ao contexto

---

### 7. FAQ (Perguntas Frequentes)

```typescript
const faqItems = [
  {
    question: "Pergunta específica e comum?",
    answer: "Resposta direta e completa. Use <strong>negrito</strong> para destacar pontos importantes."
  },
  // Mínimo 4, ideal 6-8 perguntas
];
```

**Benefícios:**
- ✅ Rich snippets no Google (Featured Snippets)
- ✅ Responde dúvidas comuns
- ✅ Aumenta tempo na página

---

### 8. BREADCRUMBS

```tsx
// ✅ Sempre incluir no início do conteúdo
<Breadcrumbs 
  items={[
    { label: 'Guias', href: '/guias' },
    { label: 'Nome do Guia' }
  ]} 
/>
```

**Automático no GuideTemplate** - não precisa adicionar manualmente!

---

### 9. STRUCTURED DATA (Schema.org)

```typescript
// layout.tsx
const structuredData = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "Título do Guia",
  "description": "Descrição completa",
  "totalTime": "PT2H", // 2 horas
  "tool": [
    { "@type": "HowToTool", "name": "Ferramenta necessária" }
  ],
  "step": [
    {
      "@type": "HowToStep",
      "position": 1,
      "name": "Nome do Passo",
      "text": "Descrição do passo"
    }
  ]
};
```

**Automático no GuideTemplate** - apenas preencher dados!

---

### 10. ESCANEABILIDADE (UX)

#### ✅ Use listas:
```html
<ul class="checklist">
  ✓ Item 1 concluído
  ✓ Item 2 concluído
  ☐ Item 3 pendente
</ul>
```

#### ✅ Use boxes de destaque:
```html
<div class="tip-box">
  💡 <strong>Dica Pro:</strong> Texto da dica
</div>

<div class="warning-box">
  ⚠️ <strong>Atenção:</strong> Aviso importante
</div>
```

#### ✅ Use tabelas comparativas:
```html
<table>
  <tr>
    <th>Recurso</th>
    <th>Windows 10</th>
    <th>Windows 11</th>
  </tr>
  <tr>
    <td>TPM 2.0</td>
    <td>Opcional</td>
    <td>Obrigatório</td>
  </tr>
</table>
```

---

## 📊 TEMPLATE DE NOVO GUIA

```typescript
// page.tsx
import { GuideTemplate } from '@/components/GuideTemplate';

const title = "Como [Ação] [Tecnologia] | Guia Completo 2026";
const description = "Aprenda [ação] de forma [adjetivo]. Guia passo a passo com [benefícios]. Tutorial profissional.";
const keywords = ['palavra-chave 1', 'palavra-chave 2', ...];

export default function NovoGuide() {
  const summaryTable = [
    { label: "Dificuldade", value: "Iniciante|Intermediário|Avançado" },
    { label: "Tempo Médio", value: "XX min" },
    { label: "Ferramentas", value: "Lista de ferramentas" }
  ];

  const faqItems = [
    {
      question: "Pergunta comum?",
      answer: "Resposta detalhada com <strong>destaques</strong>."
    },
    // Mínimo 4 FAQs
  ];

  const contentSections = [
    {
      title: "Introdução e Conceitos",
      content: `<p>Texto introdutório...</p>`,
      subsections: [
        {
          subtitle: "Subtópico 1",
          content: `<p>Conteúdo...</p>`
        }
      ]
    },
    {
      title: "Passo a Passo",
      content: `<p>Instruções...</p>`,
      subsections: [
        {
          subtitle: "Etapa 1: Nome",
          content: `<ol><li>Passo 1</li><li>Passo 2</li></ol>`
        }
      ]
    }
  ];

  const relatedGuides = [
    {
      href: "/guias/guia-relacionado",
      title: "Título do Guia Relacionado",
      description: "Descrição breve"
    },
    // Mínimo 3 guias
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="XX minutos"
      difficultyLevel="Intermediário"
      contentSections={contentSections}
      relatedGuides={relatedGuides}
      summaryTable={summaryTable}
      faqItems={faqItems}
      author="Nome do Especialista"
      lastUpdated="Janeiro 2026"
    />
  );
}
```

---

## ✅ CHECKLIST FINAL ANTES DE PUBLICAR

### SEO
- [ ] Title tem 50-60 caracteres
- [ ] Description tem 150-155 caracteres
- [ ] Apenas 1 H1 na página
- [ ] Hierarquia de headings correta (H1 → H2 → H3)
- [ ] Mínimo 3 links internos
- [ ] Breadcrumbs implementados
- [ ] Schema.org configurado

### Conteúdo
- [ ] Mínimo 1500 palavras
- [ ] Introdução clara (o que, por que, para quem)
- [ ] Passo a passo detalhado
- [ ] Exemplos práticos ou casos reais
- [ ] FAQ com 4+ perguntas
- [ ] Conclusão com CTAs

### UX
- [ ] Imagens com alt text
- [ ] Listas e bullets para escaneabilidade
- [ ] Boxes de destaque (dicas, avisos)
- [ ] Índice de conteúdo automático
- [ ] Guias relacionados (3-5)

### AdSense
- [ ] Anúncios APÓS conteúdo principal
- [ ] Label "Publicidade" visível
- [ ] Máximo 3 anúncios por página
- [ ] Não bloqueia navegação

### Performance
- [ ] Imagens otimizadas (WebP, <200KB)
- [ ] Lazy loading ativado
- [ ] Scripts diferidos quando possível

---

## 🚀 PUBLICAÇÃO

1. **Testar localmente:**
   ```bash
   npm run dev
   ```

2. **Validar SEO:**
   - Google Search Console
   - PageSpeed Insights
   - Schema.org Validator

3. **Deploy:**
   ```bash
   git add .
   git commit -m "feat: adiciona guia [nome-do-guia]"
   git push
   ```

4. **Pós-publicação:**
   - Solicitar indexação no Google Search Console
   - Compartilhar nas redes sociais
   - Monitorar Analytics (primeiros 7 dias)

---

**Última Atualização:** 30/01/2026  
**Responsável:** Equipe Técnica Voltris
