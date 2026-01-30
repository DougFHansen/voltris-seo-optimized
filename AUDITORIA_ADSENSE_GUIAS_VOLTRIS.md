# Auditoria Google AdSense — Páginas de Guias (voltris.com.br/guias)

**Data:** Janeiro 2026  
**Escopo:** Implementação do AdSense nas páginas de guias.  
**Referências:** [Program Policies](https://support.google.com/adsense/answer/48182), [Ad Placement](https://support.google.com/adsense/answer/1346295), [Publisher Policies](https://support.google.com/publisherpolicies/answer/10502938), [Better Ads Standards](https://support.google.com/publisherpolicies/answer/11127848).

---

## 1. Análise da tag AdSense (código)

### 1.1 Script principal

| Aspecto | Estado atual | Política / risco | Ação |
|--------|---------------|-------------------|------|
| **URL do script** | `pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9217408182316735` | Uso do domínio oficial; `client` correto. | OK |
| **Carregamento** | `strategy="afterInteractive"` no Next.js Script | Não bloqueia LCP; alinhado a boas práticas. | OK |
| **Atributo async** | Presente no Script | Exigido para não bloquear parsing. | OK |
| **crossOrigin** | `anonymous` | Adequado para script de terceiros. | OK |

**Problema: script duplicado**

- O script é incluído **dentro** de `AdSenseBanner.tsx`.
- Em cada página de guia há **dois** blocos de anúncio (meio do conteúdo + antes do rodapé), logo **dois** `<Script src="...adsbygoogle.js">` com o mesmo `src`.
- **Risco:** Duplicação de script (repetição no DOM, possível reexecução). Políticas pedem que o código AdSense não seja alterado; múltiplas cargas do mesmo script podem ser interpretadas de forma negativa.
- **Correção:** Carregar o script **uma única vez** no layout global (ex.: `app/layout.tsx`) e, no `AdSenseBanner`, renderizar apenas o `<ins>` e o `push({})`. Assim há um único script por página.

### 1.2 Meta tag no head

- `app/layout.tsx` contém `<meta name="google-adsense-account" content="ca-pub-9217408182316735" />`.
- **Conformidade:** Atende à exigência de identificação da conta no head.

### 1.3 Slot do anúncio (crítico)

| Local | Valor atual | Situação |
|-------|-------------|----------|
| `components/AdSenseBanner.tsx` | `data-ad-slot="1234567890"` | Placeholder inválido. |
| `app/adsense-config.ts` | `BANNER: '3007424757'`, etc. | Slots reais definidos, mas **não usados** no componente. |

- **Risco:** Com slot placeholder, os anúncios podem não ser exibidos corretamente ou a conta pode ser sinalizada na revisão.
- **Correção:** Usar no componente o slot definido em `ADSENSE_CONFIG.AD_SLOTS.BANNER` (ou o slot de “in-article”/display que você tiver criado no painel do AdSense para essas páginas). Substituir `1234567890` por esse valor.

### 1.4 Identificação do anúncio (Publisher / Ad placement)

- No `GuideTemplateClient`, o bloco no meio do conteúdo tem o rótulo **“Publicidade”** acima do componente (`<p className="...">Publicidade</p>`).
- **Conformidade:** Atende à exigência de que anúncios sejam claramente identificados (“Advertisements” ou “Sponsored links” / equivalente em português).
- O bloco antes do rodapé **não** tem rótulo visível. **Recomendação:** Adicionar o mesmo rótulo “Publicidade” (ou “Anúncios”) acima do segundo `AdSenseBanner` para consistência e conformidade.

---

## 2. Posicionamento dos anúncios

### 2.1 Páginas de guia (GuideTemplateClient)

| Posição | Onde | Conteúdo acima | Conformidade |
|---------|------|----------------|--------------|
| **1** | Após todas as `contentSections`, antes do Glossário | Hero full-screen + todo o conteúdo do guia | Conteúdo abundante acima; não é “só anúncio” acima da dobra. OK. |
| **2** | Após FAQ/Related, antes do Footer | Conteúdo completo + FAQ/Related | Abaixo da dobra; posição típica de rodapé. OK. |

- **Above the fold:** Anúncios não ocupam a dobra sozinhos; há conteúdo editorial (título, descrição, início do guia) visível primeiro. Alinhado à política de “sufficient content above the fold”.
- **Proximidade a botões/links:** O anúncio do meio está entre blocos de texto e o Glossário; o do rodapé está acima do Footer (links). Não há anúncio colado em botões de CTA (ex.: “Ver Serviços”, “WhatsApp”) de forma que induza clique acidental. OK.
- **Confusão com conteúdo:** Rótulo “Publicidade” no primeiro bloco reduz risco de confusão; segundo bloco deve ganhar rótulo também.

### 2.2 Página hub /guias (GuiasClient)

- Um único `AdSenseBanner` após `</main>` e antes do `Footer`.
- Muito conteúdo (lista de guias, categorias) acima. Conformidade OK.

### 2.3 Resumo de posicionamento

- Nenhum anúncio **acima** do conteúdo principal.
- Anúncio no meio do artigo só quando `contentSections.length >= 2` (guias com pelo menos 2 seções), o que evita página “fininha” com dois blocos de anúncio.
- Recomendação já citada: rotular o segundo bloco (antes do Footer) como “Publicidade”.

---

## 3. Experiência do usuário (UX)

### 3.1 Better Ads Standards

- **Pop-ups:** Não utilizados. OK.
- **Prestitial / countdown:** Não utilizados. OK.
- **Vídeo com som automático:** Não utilizado. OK.
- **Large sticky ads:** Nenhum anúncio fixo em tela inteira ou “large sticky”. OK.
- **Ad density:** Dois blocos por página de guia, com bastante texto entre e após eles; proporção conteúdo > anúncios. OK para desktop; em mobile, manter no máximo 2 blocos e evitar mais unidades em páginas curtas.

### 3.2 Fluxo de leitura

- Primeiro anúncio após o corpo do guia e antes do Glossário (bloco fixo). Separação visual (`my-16`) adequada.
- Segundo anúncio após FAQ/Related, antes do Footer. Não corta parágrafos nem frases.
- Conteúdo permanece o elemento central; anúncios atuam como separadores entre seções.

### 3.3 Layout shift (CLS)

- `AdSenseBanner` usa container com `min-h-[280px]`, reservando altura mínima.
- **Efeito:** Reduz CLS quando o anúncio é preenchido. Se houver “no fill”, o espaço pode permanecer vazio; 280px é um compromisso razoável entre estabilidade e não deixar buraco excessivo.
- **Recomendação:** Manter altura mínima definida; evitar remover o min-height sem substituir por outra estratégia (ex.: placeholder) para não piorar CLS.

---

## 4. Conteúdo vs anúncios

### 4.1 Proporção

- Política: não colocar **mais anúncios do que conteúdo** na página.
- Guias: texto longo (várias seções, subsections, FAQ, Glossário). Dois blocos de anúncio por página.
- **Conclusão:** Proporção conteúdo > anúncios está respeitada.
- Guias com **uma única** seção exibem apenas **um** anúncio (rodapé), devido à condição `contentSections.length >= 2`. Correto.

### 4.2 Risco de “página focada em anúncios”

- Não há múltiplas unidades por seção; não há anúncios na hero nem na primeira dobra.
- Risco de reprovação por excesso de anúncios: **baixo**, desde que o slot seja válido e o restante da implementação permaneça como está.

---

## 5. SEO + AdSense (Core Web Vitals)

### 5.1 LCP

- Script AdSense com `afterInteractive`: não bloqueia a primeira pintura.
- Anúncios ficam no meio e no final da página; não competem com o elemento de LCP (título/texto/hero).

### 5.2 CLS

- `min-h-[280px]` no container do anúncio reduz deslocamento quando o ad é carregado.
- Manter esse reserva de espaço (ou equivalente) para não degradar CLS.

### 5.3 Preconnect

- No `layout.tsx` há `preconnect` para `pagead2.googlesyndication.com` e `googleads.g.doubleclick.net`. Favorece tempo de carregamento do script/ads sem atrapalhar SEO.

---

## 6. Páginas essenciais para aprovação

| Página | Existência | Menção AdSense / adequação |
|--------|------------|----------------------------|
| **Política de Privacidade** | Sim (`/politica-privacidade`) | Seção 5.1 “Google AdSense”: uso de cookies, anúncios personalizados, links para Política do Google, Uso de cookies, Configurações de anúncios. Adequado para aprovação. |
| **Sobre** | Sim (`/sobre`) | Página institucional. OK. |
| **Contato** | Sim (`/contato`) | Página de contato. OK. |

- Nenhum ajuste obrigatório nas três páginas para o critério “confiança” do AdSense; a Política de Privacidade já cobre o uso do AdSense de forma explícita.

---

## 7. Riscos de reprovação ou suspensão

| Risco | Nível | Motivo | Mitigação |
|-------|--------|--------|------------|
| **Slot placeholder (1234567890)** | **Alto** | Slot inválido; anúncios podem não servir ou conta sinalizada na revisão. | Usar slot real do painel AdSense (ex.: `ADSENSE_CONFIG.AD_SLOTS.BANNER` ou o slot de display/in-article criado para guias). |
| **Script duplicado** | Médio | Dois `<Script>` com o mesmo `src` por página; má prática e possível interpretação negativa. | Carregar `adsbygoogle.js` uma vez no layout; no componente, apenas `<ins>` + `push({})`. |
| **Segundo bloco sem rótulo** | Baixo | Políticas exigem que anúncios sejam claramente identificados. | Adicionar texto “Publicidade” (ou “Anúncios”) acima do `AdSenseBanner` antes do Footer. |
| Conteúdo insuficiente | Baixo | Guias longos; proporção OK. | Manter padrão atual; não reduzir texto nem aumentar número de blocos em páginas curtas. |
| Cliques acidentais | Baixo | Anúncios não estão sobrepostos a botões. | Manter distância entre anúncios e CTAs. |
| Modificação do código AdSense | Baixo | Apenas Next.js Script e slot; sem alteração do script do Google. | Não alterar o `src` nem o domínio do script; usar apenas configuração (slot, format) recomendada. |

---

## 8. Checklist final para aprovação

### O que está OK

- [x] Meta `google-adsense-account` no head.
- [x] Preconnect para domínios do AdSense.
- [x] Script com `async` e carregamento `afterInteractive`.
- [x] Anúncios **abaixo** do conteúdo principal (não ocupam a dobra sozinhos).
- [x] Rótulo “Publicidade” no primeiro bloco nas páginas de guia.
- [x] No máximo 2 blocos por página de guia; 1 em guias com uma seção.
- [x] Política de Privacidade com seção específica para Google AdSense e links oficiais.
- [x] Páginas Sobre e Contato existentes.
- [x] Sem pop-ups, prestitial, sticky grande ou vídeo com som automático (Better Ads).
- [x] Reserva de altura no container (`min-h-[280px]`) para mitigar CLS.

### O que precisa de ajuste

- [ ] **Substituir `data-ad-slot="1234567890"`** pelo slot real (ex.: do `adsense-config.ts` ou do painel AdSense).
- [ ] **Carregar o script AdSense uma única vez** no layout; no `AdSenseBanner`, manter apenas `<ins>` e o `push({})`.
- [ ] **Rotular o segundo bloco de anúncio** (antes do Footer) como “Publicidade” ou “Anúncios”.

### O que não deve ser feito (preservar aprovação)

- [ ] Não colocar anúncios antes do conteúdo principal (acima da dobra como único elemento).
- [ ] Não aumentar o número de blocos em páginas curtas.
- [ ] Não remover o rótulo “Publicidade” nem adicionar rótulos que confundam com conteúdo editorial.
- [ ] Não colar anúncios em botões (CTA, WhatsApp, etc.).
- [ ] Não usar formatos proibidos pelo Better Ads (pop-up, prestitial, large sticky, vídeo com som automático).

---

## 9. Resumo executivo

- **Implementação geral:** Alinhada às políticas de posicionamento e conteúdo (conteúdo primeiro, anúncios identificados, sem excesso de unidades).
- **Correções críticas para aprovação:** (1) Usar slot real em vez de `1234567890`; (2) Carregar o script do AdSense uma vez no layout; (3) Rotular o segundo bloco de anúncio.
- **UX e Core Web Vitals:** Posicionamento e reserva de altura adequados; sem práticas intrusivas.
- Após os três ajustes acima, a implementação nas páginas de guias fica em condições de **aprovação inicial** e de **monetização sustentável** sem práticas abusivas.
