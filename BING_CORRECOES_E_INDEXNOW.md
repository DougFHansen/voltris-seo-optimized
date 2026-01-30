# Correções Bing Webmaster + IndexNow

**Data:** Janeiro 2026  
**Objetivo:** Atender alertas do Bing (sitemap, títulos/descrições duplicados, IndexNow, links externos).

---

## 1. Páginas no Sitemap

**Problema:** "Algumas de suas portas novas e importantes não estão incluídas em seus mapas de site."

**O que foi feito:**
- Inclusão de `/voltrisoptimizer/documentacao` no `app/sitemap.ts`.
- O sitemap já inclui guias (via `getGuideSlugs()`), estáticos, exterior e local. Nenhuma rota pública relevante ficou de fora.

**Como conferir:** Acesse `https://voltris.com.br/sitemap.xml` e confira se todas as URLs públicas desejadas aparecem.

---

## 2. IndexNow (Bing + Yandex)

**Problema:** Bing recomenda IndexNow para notificar mudanças e ganhar visibilidade.

**O que foi feito:**
1. **Arquivo de chave** em `public/b3ea85422343fbf303fc4e7243937093.txt` com o conteúdo da chave (obrigatório para o protocolo).
2. **Rota API** `POST /api/indexnow` que envia URLs para Bing e Yandex.

**Como usar:**
- **Após publicar conteúdo novo ou alterar páginas:**  
  Enviar um POST para `https://voltris.com.br/api/indexnow` com as URLs alteradas:

  ```json
  { "urlList": [
    "https://voltris.com.br/guias/novo-guia",
    "https://voltris.com.br/servicos"
  ]}
  ```

- **Sem body (padrão):** envia a homepage e o sitemap para notificar o site.
- **Máximo:** 10.000 URLs por requisição.

**Exemplo (curl):**
```bash
curl -X POST https://voltris.com.br/api/indexnow \
  -H "Content-Type: application/json" \
  -d '{"urlList":["https://voltris.com.br/guias/formatacao-windows"]}'
```

**Automação sugerida:** No deploy (Vercel/CI), chamar `POST /api/indexnow` com a lista de URLs alteradas ou deixar sem body para notificar apenas homepage + sitemap.

---

## 3. Meta Descriptions Duplicadas

**Problema:** "There are too many pages with identical meta descriptions."

**O que foi feito:**
- **Serviços:** `/servicos` tinha título e descrição iguais aos de "Todos os Serviços". Ajuste em `app/servicos/metadata.ts`: título "Serviços de TI - Suporte Técnico Remoto e Criação de Sites" e descrição focada na página de serviços (não na lista completa).
- **LGPD:** `app/lgpd/metadata.ts` com título "LGPD - Lei Geral de Proteção de Dados" e descrição específica (direitos do titular, bases legais, Lei 13.709/2018), diferente da Política de Privacidade. Corrigido também `openGraph.url` para `https://voltris.com.br/lgpd`.
- **Criação de Sites:** `app/todos-os-servicos/criacao-de-sites/layout.tsx` com título e descrições únicos ("Planos Básico, Profissional e Empresarial"), distintos dos planos individuais.

Cada página indexável passou a ter **uma única** meta description por URL.

---

## 4. Títulos Duplicados

**Problema:** "Você tem muitas páginas com títulos idênticos em seu site."

**O que foi feito:**
- Diferença clara entre **Serviços** (página de serviços) e **Todos os Serviços** (lista completa).
- **LGPD** com título "LGPD - Lei Geral de Proteção de Dados" e **Política de Privacidade** com "Política de Privacidade - VOLTRIS".
- **Criação de Sites** (hub) com "Criação de Sites - Planos Básico, Profissional e Empresarial"; planos básico, profissional e empresarial já tinham títulos próprios.

Guias continuam com títulos únicos via `createGuideMetadata(slug, title, ...)` em cada `page.tsx`.

---

## 5. Links Externos de Qualidade

**Problema:** "Seu site não tem links externos suficientes de domínios de alta qualidade."

**O que foi feito:**
- **Template de guias:** suporte a `externalReferences` em `GuideTemplateClient` (lista de `{ name, url }`).
- **Guia Formatação Windows:** bloco "Referências e fontes oficiais" com links para:
  - Microsoft: Criar mídia de instalação do Windows
  - Microsoft: Reinstalar o Windows
  - Rufus (ferramenta de boot)
- **Guia Instalação de Drivers:** bloco com links para:
  - Microsoft: Atualizar drivers no Windows
  - NVIDIA Drivers
  - AMD Drivers

**Para novos guias:** use a prop `externalReferences` no `GuideTemplate` com 2–3 links para fontes oficiais (Microsoft, fabricantes, documentação). Isso reforça E-E-A-T e atende à expectativa do Bing sobre referências externas.

---

## Checklist pós-deploy

- [ ] Abrir `https://voltris.com.br/sitemap.xml` e conferir se todas as páginas importantes estão listadas.
- [ ] Abrir `https://voltris.com.br/b3ea85422343fbf303fc4e7243937093.txt` e confirmar que o conteúdo é a chave (uma linha).
- [ ] No Bing Webmaster Tools, enviar o sitemap de novo se necessário e verificar erros de "páginas não incluídas".
- [ ] Após publicar novo conteúdo, chamar `POST /api/indexnow` com as URLs novas/alteradas (ou sem body para notificar homepage + sitemap).
- [ ] Revisar relatórios do Bing (títulos/descrições duplicados) após algumas semanas para confirmar que os alertas diminuíram.

---

**Nota sobre backlinks:** O aviso "links externos de domínios de alta qualidade" pode referir-se também a **backlinks** (outros sites apontando para o voltris.com.br). Isso não se resolve só no código: é trabalho de divulgação, parcerias e conteúdo que outros queiram referenciar. As referências externas que adicionamos (links de saída para Microsoft, etc.) ajudam em E-E-A-T e sinal de qualidade para o Bing.
