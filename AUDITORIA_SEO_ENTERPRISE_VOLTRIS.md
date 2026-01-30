# Auditoria SEO Enterprise — VOLTRIS (voltris.com.br)

**Data:** Janeiro 2026  
**Escopo:** Indexação, crawl, técnico, arquitetura, on-page, conteúdo/EEAT, linkagem interna, performance, multi-buscador.  
**Objetivo:** Melhorar indexação e ranking sem quebrar o que já funciona; correções cirúrgicas e plano de execução realista.

---

## Resumo executivo

| Área | Status | Impacto |
|------|--------|--------|
| **Canonical / indexação guias** | Crítico | Maioria dos guias com canonical errado → páginas “não indexadas” ou consolidadas em /guias |
| **Canonical Sobre / Voltris Optimizer** | Alto | URLs reais (/sobre, /voltrisoptimizer) apontando para /about e /gamers → duplicidade/404 |
| **Login sem noindex** | Médio | Página de login indexável; desperdício de crawl e risco de thin content |
| **robots.txt (padrão \*.json)** | Baixo | Next.js pode não interpretar glob; revisar sintaxe |
| **Sitemap vs rotas** | OK | Sitemap alinhado às rotas; exterior/servicos dinâmico e guias via fs |
| **Schema BreadcrumbList global** | Médio | Breadcrumb fixo (Home → Serviços) em todas as páginas → sinal errado em guias/serviços |
| **WebSite SearchAction** | Baixo | target ?s= sem página de busca pode ser inconsistente |
| **EEAT / conteúdo** | Bom | Guias com createGuideMetadata + conteúdo estruturado; falta canonical por guia |

**Ação imediata recomendada:** Corrigir canonicals (guias, sobre, voltrisoptimizer), adicionar noindex em /login e ajustar createGuideMetadata para incluir canonical por slug.

---

## 1. Indexação e crawl (crítico)

### 1.1 Canonical incorreto na maioria dos guias

**Problema:** O helper `createGuideMetadata(title, description, keywords)` em `components/GuideTemplate.tsx` **não define `alternates.canonical`**. Os guias que usam só esse helper herdam o canonical do layout pai `/guias`, que é `https://voltris.com.br/guias`.

**Efeito:**
- Todas as URLs `/guias/[slug]` (ex.: `/guias/instalacao-windows-11`, `/guias/otimizacao-registro`) informam ao Google que a URL canônica é `/guias`.
- Resultado: “Descoberta — atualmente não indexada” ou consolidação de dezenas de guias em uma única URL, perda de ranking por página e desperdício de crawl em URLs “duplicadas”.

**Guias com canonical correto (layout + metadata.ts próprio):**  
formatacao-windows, backup-dados, limpeza-computador, manutencao-preventiva, otimizacao-performance, resolver-erros-windows, instalacao-drivers, seguranca-digital.

**Guias sem canonical por URL (só createGuideMetadata):**  
instalacao-windows-11, otimizacao-registro, recuperacao-dados, rede-corporativa, monitoramento-sistema, e todos os demais que não têm `layout.tsx` + `metadata.ts` na pasta do guia.

**Correção:**  
- Incluir em `createGuideMetadata` um parâmetro `slug: string` e definir:
  - `alternates: { canonical: \`https://voltris.com.br/guias/${slug}\` }`
- Em cada `page.tsx` de guia que usa `createGuideMetadata`, passar o slug (ex.: `createGuideMetadata('instalacao-windows-11', title, description, keywords)`).

Assim, todas as páginas de guia passam a declarar a própria URL como canônica.

### 1.2 Canonical errado em Sobre e Voltris Optimizer

**Sobre (`app/sobre/metadata.ts`):**
- `alternates.canonical: '/about'` e `openGraph.url: 'https://voltris.com.br/about'`.
- A rota real é `/sobre`. O canonical aponta para URL inexistente (/about).
- **Correção:** Usar `canonical: '/sobre'` e `openGraph.url: 'https://voltris.com.br/sobre'`.

**Voltris Optimizer (`app/voltrisoptimizer/metadata.ts`):**
- `metadataBase: new URL('https://voltris.com.br/gamers')` e `alternates.canonical: '/gamers'`.
- A rota real é `/voltrisoptimizer`. Todas as páginas do produto (incl. /voltrisoptimizer/como-funciona) passam a ter canonical e OG apontando para `voltris.com.br/gamers`.
- **Correção:** `metadataBase: new URL('https://voltris.com.br')` e `canonical: '/voltrisoptimizer'`; OG url `https://voltris.com.br/voltrisoptimizer`.

### 1.3 Página de login indexável

**Problema:** `app/login/metadata.ts` não define `robots: { index: false, follow: false }`. A página `/login` é rastreável e pode ser indexada (thin content, pouco valor para busca).

**Correção:** Adicionar em `login/metadata.ts`:
```ts
robots: { index: false, follow: false },
```

### 1.4 Processo (agendamento, contrato, acesso-remoto, conclusão)

- Essas páginas têm `index: true` por padrão e não estão no sitemap (correto para funil).
- São encontradas apenas por links internos. Opcional: definir `robots: { index: false, follow: true }` para concentrar autoridade nas páginas de serviço/landing; não obrigatório.

### 1.5 Dashboard e áreas restritas

- `robots.txt` já bloqueia `/dashboard/`, `/restricted-area-admin/`, `/api/`, `/auth/`, `/admin/`, `/private/`. Nenhum ajuste necessário para indexação dessas rotas.

---

## 2. SEO técnico

### 2.1 robots.txt

**Configuração atual (`app/robots.ts`):**
- `allow: '/'`, `disallow` para dashboard, admin, api, auth, admin, private.
- Regra `'*.json'` no array `disallow`: em Robots Exclusion Standard, padrões com `*` nem sempre são suportados (Next.js gera texto; Google suporta `*`). Bing e outros podem ignorar.
- **Recomendação:** Manter; se quiser garantir bloqueio de JSON, usar uma regra explícita por path conhecido (ex.: `/api/*`) em vez de confiar só em `*.json`.

**Sitemap e host:**  
`https://voltris.com.br/sitemap.xml` e `host: https://voltris.com.br` estão corretos.

**Crawl-delay (bingbot, Slurp):**  
Bing ignora `Crawl-delay`. Yahoo/Slurp historicamente respeitava; impacto hoje é baixo. Pode manter ou remover.

### 2.2 Sitemap

- **Base:** `https://voltris.com.br`.
- **Guias:** Obtidos via `fs.readdirSync(app/guias)` (apenas diretórios) → todas as pastas de guia entram.
- **Estáticos:** Home, landing (tecnico-informatica, criar-site, criadores-de-site, etc.), serviços, exterior, institucional, voltrisoptimizer — alinhados às rotas existentes.
- **Local:** `tecnico-informatica-em/[slug]` com slugs sao-paulo, rio-de-janeiro, parana.
- **Frequência/prioridade:** Coerentes (home 1.0/hourly, guias 0.8/weekly, institucional 0.4/yearly).

**Melhoria opcional:**  
Incluir `lastModified` real por guia (ex.: data da última alteração do arquivo) em vez de `new Date()` em build, para sinalizar atualização ao buscador.

### 2.3 Headers HTTP

- `next.config.js`: `X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`, `Referrer-Policy`; `Content-Type` e cache para `/sitemap.xml` e `/robots.txt`. Adequado.

### 2.4 Status e redirecionamentos

- Nenhum redirect 301/302 encontrado no código analisado para as rotas públicas.
- `skipTrailingSlashRedirect: true` evita 307 em rotas; garantir que a convenção de URL (com ou sem barra final) seja única em todo o site (ex.: sempre sem barra).
- **not-found:** `app/not-found.tsx` não define `robots: noindex`. Em Next.js 13+, a página 404 pode ser servida com status 404; confirmar que o status HTTP é 404 e, se desejado, adicionar noindex na metadata da not-found para evitar indexação de URLs de erro.

---

## 3. Arquitetura e estrutura

### 3.1 Estrutura de URLs

- **Padrão:** minúsculas, hífens, sem barra final (Next App Router).
- **Profundidade:** Home → 1 clique (servicos, guias, sobre, etc.); 2 cliques (guias/[slug], todos-os-servicos/..., exterior/servicos/...). Boa para rastreamento e autoridade.

### 3.2 Páginas órfãs / sitemap

- Todas as rotas públicas relevantes estão no sitemap; guias dinâmicos via diretórios. Nenhuma rota importante órfã detectada.

### 3.3 Cobertura de rotas no sitemap

- Rotas listadas (criar-site, criadores-de-site, tecnico-informatica-minha-regiao, erros-jogos, voltrisoptimizer, exterior/orcamento, exterior/servicos/...) existem no projeto. OK.

### 3.4 Duplicidade e canibalização

- Risco principal era canonical (já tratado acima). Com canonical correto por guia e por página de serviço, canibalização entre guias e entre /guias vs /guias/[slug] diminui.
- Títulos e metas por guia já são distintos via createGuideMetadata; com canonical certo, o sinal fica consistente.

---

## 4. SEO on-page

### 4.1 Layout raiz

- `metadataBase: 'https://voltris.com.br'`, `alternates.canonical: './'`. Em Next, `./` com metadataBase costuma resolver para a URL atual; mesmo assim, em páginas filhas é mais seguro definir canonical explícito (já recomendado para guias).
- Title template `%s | VOLTRIS` e description/keywords padrão estão bons.

### 4.2 Guias

- Títulos e descrições por guia são únicos (createGuideMetadata + textos por página).
- Falta apenas canonical por URL (correção no createGuideMetadata).
- Guias com metadata.ts próprio (ex.: formatacao-windows) já têm canonical e OG corretos.

### 4.3 Bing e multi-buscador

- `layout.tsx` já tem meta para bingbot e `msvalidate.01`; `BingSiteAuth.xml` no public está correto.
- Manter título e descrição claros e, onde fizer sentido, alinhar termos às buscas (Bing ainda valoriza mais correspondência exata em alguns casos; não exagerar).

---

## 5. Conteúdo e EEAT

### 5.1 Pontos fortes

- Guias com estrutura (contentSections, subsections), FAQ em vários guias, autor “Equipe Técnica Voltris” e “lastUpdated”.
- Schema Article/FAQ quando presente (GuideTemplateClient, FAQSchema) reforça EEAT.
- Citações de especialista em alguns guias (ex.: formatacao-windows) aumentam confiança.

### 5.2 Melhorias sugeridas

- Garantir que todo guia tenha pelo menos um bloco FAQ (mesmo que curto) para rich results e clareza.
- Incluir data de publicação/atualização real no schema (datePublished/dateModified) quando houver metadata.ts ou createGuideMetadata estendido.
- Manter “Equipe Técnica Voltris” e, onde aplicável, nome de especialista para reforçar autoridade.

---

## 6. Linkagem interna

### 6.1 Guias

- `GuiasClient.tsx` lista guias por categoria com links para `/guias/[slug]`. Boa malha interna a partir do hub /guias.
- `GuideTemplateClient` permite `relatedGuides` com links; usar em todos os guias para criar clusters (ex.: formatação ↔ backup, instalação Windows ↔ drivers).

### 6.2 Breadcrumbs

- Componente `Breadcrumbs` com microdados (Schema BreadcrumbList) está correto.
- No layout raiz, há um BreadcrumbList **global** fixo (Home → Serviços) em JSON-LD. Isso sobrescreve/compete com o breadcrumb real em páginas internas (guias, serviços, etc.).
- **Correção:** Remover o BreadcrumbList fixo do `layout.tsx` e deixar apenas breadcrumbs por página (via componente Breadcrumbs + JSON-LD por rota ou via generateMetadata).

### 6.3 Pilares e clusters

- /guias como pilar e /guias/[slug] como cluster está coerente. Reforçar links do pilar para guias principais (formatação, otimização, segurança, backup) e entre guias relacionados aumenta fluxo de autoridade.

---

## 7. Performance e compatibilidade com crawlers

### 7.1 JavaScript

- Next.js App Router entrega HTML no servidor; conteúdo principal dos guias e páginas estáticas é renderizado no servidor, adequado para Google e Bing.
- Componentes client (GuiasClient, GuideTemplateClient) são usados para interatividade; o texto dos guias está no HTML inicial. OK.

### 7.2 Imagens e recursos

- next/image com formatos webp/avif; preconnect para domínios externos (fonts, Ads). Boa prática.

### 7.3 Crawlers alternativos

- Estrutura semântica (headings, article, breadcrumbs) e meta tags padrão ajudam crawlers que não executam tanto JS. Manter HTML bem estruturado e canonical/meta por página.

---

## 8. Multi-buscador (Google, Bing, Yahoo, DuckDuckGo, etc.)

- **Google:** metadataBase, canonical, sitemap, robots, Schema.org e verification já configurados.
- **Bing:** msvalidate.01, BingSiteAuth.xml, meta bingbot; host e sitemap iguais. Ajustes de canonical beneficiam todos.
- **Outros:** robots.txt com regras por user-agent (Slurp, bingbot) e regra geral `*`; sitemap e canonical únicos ajudam qualquer buscador que respeite esses padrões.

Nenhuma alteração específica por buscador além das correções de canonical e noindex já citadas.

---

## 9. Plano de ação prioritário

### Fase 1 — Imediato (impacto em indexação)

| # | Ação | Onde | Prioridade |
|---|------|------|------------|
| 1 | Adicionar `slug` a `createGuideMetadata` e setar `alternates.canonical` para `https://voltris.com.br/guias/${slug}`; em cada guia que usa o helper, passar o slug. | `components/GuideTemplate.tsx` + cada `app/guias/[slug]/page.tsx` | Crítica |
| 2 | Corrigir canonical e OG em Sobre: `/sobre` e `https://voltris.com.br/sobre`. | `app/sobre/metadata.ts` | Alta |
| 3 | Corrigir Voltris Optimizer: metadataBase e canonical para `/voltrisoptimizer` e url OG. | `app/voltrisoptimizer/metadata.ts` | Alta |
| 4 | Adicionar `robots: { index: false, follow: false }` na página de login. | `app/login/metadata.ts` | Média |

### Fase 2 — Estrutura e sinal

| # | Ação | Onde | Prioridade |
|---|------|------|------------|
| 5 | Remover BreadcrumbList fixo (Home → Serviços) do layout raiz; usar apenas breadcrumbs por página. | `app/layout.tsx` | Média |
| 6 | Verificar se existe página de busca; se não, remover ou ajustar WebSite SearchAction (target ?s=). | `app/layout.tsx` + `utils/seoHelpers.ts` / Breadcrumbs | Baixa |
| 7 | (Opcional) Adicionar noindex em `app/not-found.tsx` para evitar indexação de 404. | `app/not-found.tsx` | Baixa |

### Fase 3 — Otimização contínua

| # | Ação | Prioridade |
|---|------|------------|
| 8 | Reforçar relatedGuides em todos os guias (clusters temáticos). | Média |
| 9 | lastModified no sitemap por guia baseado em data do arquivo (opcional). | Baixa |
| 10 | Revisar robots disallow `*.json` se quiser bloqueio explícito em caminhos conhecidos. | Baixa |

---

## Checklist pós-correção

- [ ] Todo guia declara canonical para a própria URL (`/guias/[slug]`).
- [ ] /sobre tem canonical e OG url = `/sobre`.
- [ ] /voltrisoptimizer (e subpáginas) têm canonical e OG = `/voltrisoptimizer` (e paths completos).
- [ ] /login tem robots noindex, nofollow.
- [ ] BreadcrumbList global removido do layout; breadcrumbs por página com JSON-LD correto.
- [ ] Validar no GSC/Bing Webmaster: cobertura de índice, “página com canonical em outra URL” e “descoberta — não indexada” após 2–4 semanas.

---

**Fim da auditoria.**  
Implementando as correções críticas (createGuideMetadata + canonical sobre/voltrisoptimizer + noindex login) em seguida.
