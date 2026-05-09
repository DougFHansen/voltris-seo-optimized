# AUDITORIA ENTERPRISE-GRADE DE CANONICALIZAÇÃO
## VOLTRIS.COM.BR - Infraestrutura SEO Técnica

---

# FASE 1 - AUDITORIA COMPLETA

## DOMÍNIO CANÔNICO OFICIAL ESCOLHIDO

**Versão Oficial:** `https://www.voltris.com.br`

**Razão:**
- Middleware já redireciona voltris.com.br → www.voltris.com.br
- Consistência com configuração existente
- Melhor prática SEO (www é mais comum para empresas)

---

# PROBLEMAS CRÍTICOS IDENTIFICADOS

## 1. ❌ SCHEMA ORGANIZATION - URLs SEM WWW
**Arquivo:** `app/layout.tsx` (linhas 136-137)
**Problema:**
```typescript
url: "https://voltris.com.br",           // ❌ SEM www
logo: "https://voltris.com.br/logo.png", // ❌ SEM www
```
**Impacto:** Schema markup inconsistente, Google vê URLs diferentes do domínio canônico
**Severidade:** CRÍTICA
**Correção:** Alterar para `https://www.voltris.com.br`

---

## 2. ❌ UTILS/SEOHELPERS.TS - MÚLTIPLAS URLS SEM WWW
**Arquivo:** `utils/seoHelpers.ts`
**Linhas afetadas:**
- Linha 210: `https://voltris.com.br${crumb.url}` ❌
- Linha 230: `"https://voltris.com.br/logo.png"` ❌
- Linha 240: `"https://voltris.com.br/logo.png"` ❌
- Linha 247: `"https://voltris.com.br"` ❌
- Linha 259: `"https://voltris.com.br"` ❌
- Linha 262: `"https://voltris.com.br/?s={search_term_string}"` ❌

**Impacto:** Schema markup de breadcrumbs, local business, website search todos inconsistentes
**Severidade:** CRÍTICA
**Correção:** Alterar todas para `https://www.voltris.com.br`

---

## 3. ❌ UTILS/SEO-STRUCTURED-DATA.TS - MÚLTIPLAS URLS SEM WWW
**Arquivo:** `utils/seo-structured-data.ts`
**Linhas afetadas:**
- Linha 13: `https://voltris.com.br${breadcrumb.href}` ❌
- Linha 48: `https://voltris.com.br` ❌
- Linha 55: `https://voltris.com.br/logo.png` ❌
- Linha 65: `https://voltris.com.br` ❌
- Linha 75: `https://voltris.com.br` ❌
- Linha 82: `https://voltris.com.br/logo.png` ❌
- Linha 87: `https://voltris.com.br/buscar?q={search_term_string}` ❌
- Linha 145: `https://voltris.com.br` ❌
- Linha 149: `https://voltris.com.br/voltrisoptimizer/documentacao` ❌

**Impacto:** Schema markup de breadcrumbs, article, website todos inconsistentes
**Severidade:** CRÍTICA
**Correção:** Alterar todas para `https://www.voltris.com.br`

---

## 4. ❌ COMPONENTS/ADVANCEDSEO.TSX - CANONICAL FALLBACK SEM WWW
**Arquivo:** `components/AdvancedSEO.tsx`
**Linhas afetadas:**
- Linha 98: `"https://voltris.com.br"` ❌
- Linha 234: `canonical || "https://voltris.com.br"` ❌

**Impacto:** Canonical tag fallback inconsistente quando canonical não é fornecido
**Severidade:** CRÍTICA
**Correção:** Alterar para `https://www.voltris.com.br`

---

## 5. ❌ MIDDLEWARE - FALTA REDIRECT HTTP → HTTPS
**Arquivo:** `middleware.ts`
**Problema atual (linhas 29-35):**
```typescript
// Redirecionamento 301: voltris.com.br → www.voltris.com.br
const hostname = request.nextUrl.hostname;
if (hostname === 'voltris.com.br') {
    const url = request.nextUrl.clone();
    url.hostname = 'www.voltris.com.br';
    return NextResponse.redirect(url, 301);
}
```

**FALTA:** Não redireciona http → https
**Impacto:** Usuários acessando http://voltris.com.br ou http://www.voltris.com.br não são redirecionados para https
**Severidade:** CRÍTICA
**Risco:** Segurança, mixed content, penalização HTTPS
**Correção:** Adicionar verificação de protocolo e redirecionar para https

---

## 6. ❌ NEXT.CONFIG.JS - FALTA REDIRECT GLOBAL HTTP → HTTPS
**Arquivo:** `next.config.js`
**Problema:** Não há redirect global no config.js
**Impacto:** Configuração de Next.js não impõe HTTPS no nível de framework
**Severidade:** ALTA
**Correção:** Adicionar redirect no array redirects()

---

## 7. ⚠️ NEXT.CONFIG.JS - SKIPTRAILINGSLASHREDIRECT
**Arquivo:** `next.config.js` (linha 4)
**Problema:**
```javascript
skipTrailingSlashRedirect: true,
```
**Impacto:** Pode causar inconsistência em trailing slash, URLs duplicadas com/sem slash
**Severidade:** MÉDIA
**Recomendação:** Avaliar necessidade, preferir consistência explícita

---

## 8. ❌ PUBLIC/GOOGLE479212FB5C17EF60.HTML - OG URL SEM WWW
**Arquivo:** `public/google479212fb5c17ef60.html` (linha 12)
**Problema:**
```html
<meta property="og:url" content="https://voltris.com.br/google479212fb5c17ef60.html">
```
**Impacto:** OpenGraph URL inconsistente
**Severidade:** MÉDIA
**Correção:** Alterar para `https://www.voltris.com.br`

---

# PROBLEMAS MÉDIOS IDENTIFICADOS

## 9. ⚠️ SUPABASE CONFIG - LOCALHOST URLs
**Arquivo:** `supabase/config.toml`
**Linhas:** 74, 110
**Problema:** URLs http://127.0.0.1 (apenas desenvolvimento)
**Impacto:** Nenhum em produção (config local)
**Severidade:** BAIXA
**Ação:** Não requer correção (config de desenvolvimento)

---

# CONFIGURAÇÕES CORRETAS IDENTIFICADAS ✅

## ✅ NEXT.CONFIG.JS - REDIRECTS 301
- Todos os redirects usam `permanent: true` (301)
- Consolidação de guias duplicados está correta
- Conversão de URLs datadas está correta

## ✅ MIDDLEWARE - REDIRECT WWW
- Redireciona voltris.com.br → www.voltris.com.br (linha 29-35)
- Status 301 correto
- Sem loops identificados

## ✅ APP/LAYOUT.TSX - METADATABASE
- `metadataBase: new URL('https://www.voltris.com.br')` ✅
- `openGraph.url: 'https://www.voltris.com.br'` ✅

## ✅ APP/LAYOUT.TSX - SCHEMA PERSON
- `url: 'https://www.voltris.com.br'` ✅

## ✅ APP/LAYOUT.TSX - SCHEMA WEBSITE
- `url: 'https://www.voltris.com.br'` ✅
- `urlTemplate: 'https://www.voltris.com.br/?s={search_term_string}'` ✅

## ✅ APP/ROBOTS.TS
- `domain: 'https://www.voltris.com.br'` ✅
- `sitemap: ${domain}/sitemap.xml` ✅

## ✅ APP/SITEMAP.TS
- `BASE_URL: 'https://www.voltris.com.br'` ✅

## ✅ LIB/URL-NORMALIZER.TS
- `CANONICAL_HOST = 'https://www.voltris.com.br'` ✅

## ✅ APP/VOLTRISOPTIMIZER - CANONICALS
- `/voltrisoptimizer/como-funciona` ✅
- `/voltrisoptimizer` ✅

## ✅ COMPONENTS/HEADER.TS
- Todos os links são relativos (path) ✅
- Não há URLs absolutas hardcoded

## ✅ COMPONENTS/FOOTER.TS
- Todos os links são relativos (path) ✅
- Não há URLs absolutas hardcoded

---

# RESUMO DOS PROBLEMAS

## CRÍTICOS (8 problemas)
1. Schema Organization URLs sem www (layout.tsx)
2. utils/seoHelpers.ts - 6 URLs sem www
3. utils/seo-structured-data.ts - 9 URLs sem www
4. components/AdvancedSEO.tsx - 2 URLs sem www
5. Middleware - Falta redirect HTTP → HTTPS
6. next.config.js - Falta redirect global HTTP → HTTPS
7. skipTrailingSlashRedirect pode causar inconsistência
8. public/google479212fb5c17ef60.html - OG URL sem www

## MÉDIOS (1 problema)
9. supabase/config.toml - localhost URLs (apenas dev, não requer correção)

## CORRETOS (12 configurações)
- metadataBase, openGraph.url, robots, sitemap, url-normalizer, etc.

---

# FASE 2 - PLANO DE IMPLEMENTAÇÃO

## ORDEM DE PRIORIDADE

### 1. CORRIGIR SCHEMA MARKUP (CRÍTICO)
- app/layout.tsx - Schema Organization
- utils/seoHelpers.ts - Todas as URLs
- utils/seo-structured-data.ts - Todas as URLs
- components/AdvancedSEO.tsx - Canonical fallback
- public/google479212fb5c17ef60.html - OG URL

### 2. IMPLEMENTAR REDIRECT GLOBAL HTTP → HTTPS (CRÍTICO)
- middleware.ts - Adicionar verificação de protocolo
- next.config.js - Adicionar redirect global

### 3. AVALIAR TRAILING SLASH (MÉDIO)
- Decidir padrão (com ou sem slash)
- Remover ou configurar skipTrailingSlashRedirect
- Normalizar todas as URLs

---

# FASE 3 - VALIDAÇÃO

Após implementação, validar:
1. Todos os redirects funcionam corretamente
2. Não há loops
3. Não há redirect chains
4. Schema markup está consistente
5. Canonical tags estão corretas
6. OpenGraph URLs estão corretas
7. Robots.txt aponta para sitemap correto
8. Sitemap contém apenas URLs canônicas
9. HTTP → HTTPS funciona
10. Non-WWW → WWW funciona

---

**Data:** 2026-05-08
**Auditor:** Cascade SEO Specialist Enterprise
**Status:** Auditoria completa, aguardando implementação
