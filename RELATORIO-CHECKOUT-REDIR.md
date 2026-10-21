# Relatório: por que a compra não voltava para a aba "Minhas Licenças"

**Data:** 2026-10-21
**Sintoma:** depois de finalizar a compra no checkout da Stripe, o cliente não
redirecionava para o dashboard na aba **Minhas Licenças**.

---

## 1. O que foi apurado (com prova, não com suposição)

### 1.1 A URL de volta da Stripe estava errada

A `success_url` montada pela rota de checkout usava `NEXT_PUBLIC_BASE_URL`.
O valor que estava valendo no ambiente que gerava as sessões era
**`http://voltris.com.br`** — http (sem TLS) e sem `www`.

Evidência direta (sessões reais lidas na API da Stripe):

```
cs_test_a1T6A3rzaVfdzbFumFv99dhXRiT8tbJmdMyCHizYMQTMRqBwaQg2ggiKTk
success_url: http://voltris.com.br/dashboard?checkout_success=true&type=license&ref=st_1792107372038
```

Evidência corroborante no banco (e-mail de compra gravado em `email_outbox`
às 2026-10-21 14:33, na hora da compra real):

```
http://voltris.com.br/dashboard?tab=licenses
```

Consequências:

| Ambiente | O que acontecia |
|---|---|
| **Desenvolvimento** | o checkout voltava para o site de **PRODUÇÃO** (`voltris.com.br`), nunca para o `localhost:3000` testado |
| **Produção** | 2 saltos extras (http→https e sem-www→www) antes do painel; o cookie de sessão é `Secure` e não viaja no salto em claro |

O domínio canônico real é `https://www.voltris.com.br` (é para lá que a
Vercel redireciona: `voltris.com.br` → `www.voltris.com.br`, 308).

### 1.2 A aba "Minhas Licenças" nunca era marcada como ativa

`components/dashboard/dashboardTabs.ts` decidia a aba ativa lendo **apenas**
`?tab=`. A rota de checkout mandava `?checkout_success=true` (sem `?tab=`).

Resultado: o **conteúdo** da aba de licenças aparecia (o `DashboardClient`
tinha um fallback próprio para `checkout_success`), mas o **menu lateral
continuava destacando "Visão Geral"**. O cliente concluía que não tinha sido
redirecionado. Duas funções diferentes, duas respostas diferentes.

### 1.3 Qualquer desvio de autenticação descartava a query string

`components/AuthGuard.tsx` montava o destino com o **pathname só**:

```ts
router.push('/login');                                             // sem destino
router.replace(`/perfil?force=1&redirect=${encodeURIComponent(pathname)}`); // sem query
```

Ou seja: quem voltava da Stripe e passasse por `/login` ou por `/perfil`
(conta social com perfil incompleto) terminava em `/dashboard` **sem
parâmetro** — aba "Visão Geral", sem aviso de compra, sem `ref`.

### 1.4 O webhook da Stripe só escutava 2 dos 10 eventos

```
we_1TE3bxJRTq12GaHbsTaBrq4P  https://www.voltris.com.br/api/webhook/stripe
inscritos: 2/10
  checkout.session.completed, invoice.paid
```

Faltando `invoice.payment_failed`, `customer.subscription.created/updated/deleted`,
`charge.refunded`, `refund.updated`, `checkout.session.async_payment_*`.

Ou seja: falha de cobrança não virava `FALHA_NO_PAGAMENTO`, cancelamento feito
no painel da Stripe não espelhava no banco, reembolso não chegava. **A aba
"Minhas Licenças" exibia estado errado.**

### 1.5 Bug de dados: `reference_id` com prefixo duplo

`lib/stripe-sync.ts` gravava `sub_${stripeSubscriptionId}`, e o id da Stripe
já vem `sub_...`. Resultado no banco (hoje):

```
subscriptions.reference_id = "sub_sub_1UT0ZNJpNL78U7iCJ8S9nlnm"
```

Quebrava o casamento por referência entre `subscriptions` e `payments`.

### 1.6 Compra de hoje que ficou pendente

`payments.st_1792592055173` (pro/mensal, 14:14) está `pending` e **não existe
`checkout.session.completed` no `stripe_event_log`** — a sessão nunca foi
liquidada (checkout abandonado ou cartão recusado na página da Stripe; recusa
de cartão não dispara webhook).

---

## 2. As correções

| Arquivo | O que mudou |
|---|---|
| `lib/site-url.ts` (novo) | resolve a URL base do site: `https` fora de localhost, sem barra final, e **a origem real da requisição vence o ambiente** quando ela é comprovadamente do mesmo site. Origem de terceiro é rejeitada (nada de open redirect). |
| `lib/checkout-redirect.ts` (novo) | função pura que monta `success_url`/`cancel_url`. |
| `lib/safe-redirect.ts` (novo) | `redirect` só aceita caminho interno (fecha open redirect no `/login` e no `/perfil`). |
| `app/api/stripe/checkout/route.ts` | usa as duas funções acima; `success_url` passa a ser `/dashboard?tab=licenses&checkout_success=true&type=...&ref=...`. |
| `components/dashboard/dashboardTabs.ts` | `resolveDashboardTab()` — **fonte única** de "qual aba está aberta", usada pelo conteúdo E pelo menu. |
| `app/dashboard/DashboardClient.tsx` | passa a usar `resolveDashboardTab()`. |
| `components/AuthGuard.tsx` | o destino carrega a query string **inteira** nos desvios para `/login` e `/perfil`. A query é lida de `window.location.search` (e não de `useSearchParams`) para não obrigar as páginas que usam o AuthGuard a declararem uma fronteira de Suspense. |
| `app/login/page.tsx`, `app/perfil/page.tsx` | devolvem o cliente ao destino recebido, filtrado por `safeInternalRedirect`. |
| `app/api/stripe/portal/route.ts`, `lib/email-templates.ts` | mesma resolução de URL (portal e e-mail voltam para `?tab=licenses`). |
| `lib/stripe-sync.ts` | `reference_id` sem prefixo duplo. |
| `scripts/stripe-webhook-events-check.mjs` (novo) | confere (e corrige com `--apply`) os eventos inscritos no endpoint da Stripe. |
| `scripts/stripe-checkout-url-check.mjs` (novo) | prova, contra a API real da Stripe, que as 6 combinações voltam para a aba certa. |

### A URL de volta, agora

```
https://www.voltris.com.br/dashboard?tab=licenses&checkout_success=true&type=license&ref=st_...
```

- `tab=licenses` → abre **e marca** a aba Minhas Licenças;
- `checkout_success=true` → dispara o aviso de compra e a releitura automática;
- `type` → o aviso fala da coisa certa (licença ou serviço);
- `ref` → o painel sabe qual compra foi concluída.

---

## 3. As provas

### 3.1 Suíte de testes — `npm test`

```
ℹ tests 938   ℹ pass 938   ℹ fail 0
```

`tests/checkout-redirect.test.ts` (36 testes) trava:

- as **3 licenças × 2 períodos** montando a URL de volta para `?tab=licenses`;
- nenhuma URL de retorno nascendo em `http`;
- `checkout_success=true` resolvendo para `licenses` (e o menu lateral marcando
  a aba certa, e "Visão Geral" **não**);
- o destino atravessando `/login` e `/perfil` sem perder a query string;
- `redirect` recusando destino externo;
- todo evento declarado suportado tendo handler no webhook.

### 3.2 Contra a API REAL da Stripe — `npm run verify:checkout-url`

```
OK  standard/month   -> https://www.voltris.com.br/dashboard?tab=licenses&checkout_success=true&type=license&ref=...
OK  standard/year    -> ...
OK  pro/month        -> ...
OK  pro/year         -> ...
OK  enterprise/month -> ...
OK  enterprise/year  -> ...
6 sessões de teste expiradas (nada pendente).
```

A sessão é criada e **relida da API**: o que a Stripe guardou é o que importa.

### 3.3 Em runtime, na rota de verdade

`npm start` (produção) e `npm run dev` (desenvolvimento), chamando
`POST /api/stripe/checkout`:

```
produção  | Origin: https://www.voltris.com.br -> usada: 'https://www.voltris.com.br'
produção  | Origin: https://site-do-atacante.com -> (ignorado, cai no configurado)
dev       | Origin: http://localhost:3000        -> usada: 'http://localhost:3000'
```

### 3.4 Build e tipos

- `npm run build` → OK (exit 0);
- `npm run type-check` → **nenhum erro novo** nos arquivos tocados (os erros
  pré-existentes em `supabase/functions/*` e `tests/helpers/*` são de antes e
  o projeto já sobe o build com `ignoreBuildErrors`).

### 3.5 Webhook

```
we_1TE3bxJRTq12GaHbsTaBrq4P  https://www.voltris.com.br/api/webhook/stripe
inscritos: 10/10
-> OK: inscrito em todos os eventos suportados
```

(Endpoint de **teste**. O de **produção** depende da chave live — ver §4.1.)

---

## 4. O que ainda depende de fora do código

**Dois itens precisam de ação no painel da Stripe / na Vercel.**

### 4.1 Webhook da Stripe em PRODUÇÃO (urgente)

O endpoint de **teste** já foi corrigido (10/10 eventos). O endpoint de
**produção** (conta live) continua com 2/10 e **precisa da chave `sk_live_...`
para ser corrigido**. Sem isso, o painel continua mentindo sobre renovação,
falha de cobrança e reembolso.

```bash
# com a chave de PRODUÇÃO no ambiente:
npm run verify:stripe-webhook        # mostra o que falta
npm run fix:stripe-webhook           # inscreve os 10 eventos
```

### 4.2 Variável de ambiente na Vercel

`NEXT_PUBLIC_BASE_URL` está como `http://voltris.com.br` no painel da Vercel.
**O código agora é imune a isso** (a origem da requisição vence), mas o
valor deve ser corrigido para:

```
NEXT_PUBLIC_BASE_URL=https://www.voltris.com.br
VOLTRIS_SITE=https://www.voltris.com.br
```

`NEXT_PUBLIC_*` é embutido no build: o valor errado também afeta os links
dos e-mails (que não têm requisição de origem).

### 4.3 `middleware.ts` está desativado

O arquivo existe apenas como `middleware.ts.bak`. A canonicalização
(http→https e sem-www→www) que o comentário do `next.config.mjs` promete está
sendo feita só pela Vercel. Vale reativar o middleware com o cuidado de não
causar loop de redirect no app desktop (o motivo do desativamento).
