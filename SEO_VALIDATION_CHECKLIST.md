# Checklist de Validação SEO & Google Search Console (30 Dias)

## 1. Validação Técnica (Imediata)

### A. Estrutura de Renderização (Verificado no Código)
- [x] **Home (`/`)**: Convertida para Server Component. Metadados gerados no servidor.
- [x] **Guias (`/guias`)**: Convertida para Server Component. Metadados gerados no servidor.
- [x] **Serviços (`/todos-os-servicos`)**: Convertida para Server Component.
- [x] **Criação de Sites (`/todos-os-servicos/criacao-de-sites`)**: Convertida para Server Component.
- [x] **Sitemap**: Rewrite conflitante removido do `next.config.js`.

### B. Como Validar o "View Source"
O Googlebot vê o que está no "Exibir Código Fonte" (Ctrl+U), não o que está no "Inspecionar Elemento".
1. Abra seu site em uma aba anônima.
2. Pressione **Ctrl+U**.
3. Procure por `<title>`.
   - **Esperado:** `<title>VOLTRIS - Suporte Técnico Remoto e Criação de Sites | Atendimento Online</title>` (ou o título específico da página).
   - **Erro:** Se você ver apenas "Loading..." ou um título genérico, algo está errado.
4. Procure por `meta name="description"`.
   - **Esperado:** Texto rico e específico para cada página.
5. Procure por `schema.org` ou `application/ld+json`.
   - **Esperado:** O JSON estruturado deve estar presente no HTML bruto.

## 2. Checklist Google Search Console (GSC)

### Semana 1: Configuração e Limpeza
- [ ] **Cadastro:** Adicione todas as versões do domínio (`https://voltris.com.br`, `http://voltris.com.br`, `https://www.voltris.com.br`).
- [ ] **Sitemap:** Envie o sitemap em `Indexação > Sitemaps`. A URL deve ser `https://voltris.com.br/sitemap.xml`.
  - *Monitoramento:* Verifique se o status fica "Sucesso". Se der erro "Não foi possível buscar", aguarde 24h e tente novamente.
- [ ] **Robots.txt:** Verifique se não há bloqueios indesejados em `Configurações > Abrir Relatório robots.txt`.

### Semana 2: Indexação e Erros
- [ ] **Inspeção de URL:** Digite a URL da Home na barra de busca do GSC e clique em "Testar URL publicada".
  - Verifique se o HTML renderizado (bloco de código à direita) contém seus metadados.
- [ ] **Páginas Não Indexadas:** Vá em `Indexação > Páginas`.
  - Ignore erros de "Rastreada, mas não indexada" por enquanto (comum em sites novos).
  - Priorize resolver "Erro 5xx" ou "Bloqueada por robots.txt".

### Semana 3: Core Web Vitals
- [ ] **Experiência:** Check a aba `Principais métricas da web`.
  - No Mobile, o LCP deve estar abaixo de 2.5s.
  - Se estiver "Dados insuficientes", use o PageSpeed Insights para testes de laboratório.

## 3. Próximos Passos (Estratégia de 30 Dias)
1. **Canonicalização:** Garanta que todas as páginas tenham a tag `<link rel="canonical" href="..." />` apontando para si mesmas (auto-referência) para evitar conteúdo duplicado.
2. **Cluster de Conteúdo:** Comece a escrever os artigos listados na página de Guias. Cada clique em um guia que não existe é uma oportunidade perdida (erro 404).
3. **Backlinks:** Cadastre a Voltris em diretórios locais de empresas (Google Meu Negócio, Bing Places) para gerar os primeiros sinais de autoridade.

---
*Relatório Gerado por Antigravity Agent em 21/01/2026*
