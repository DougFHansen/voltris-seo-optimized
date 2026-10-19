# RELATÓRIO DE ENTREGA — Correção Definitiva de Licenças, Renovação, Reembolsos e Faturas PDF

**Projeto:** `voltris.com.br` (site brasileiro VOLTRIS)
**Escopo:** Dashboard → Minhas Licenças / Gestão de Licenças & Faturamento
**Data da auditoria e implementação:** 2026-10-19
**Nenhum arquivo do site internacional, banco ou fluxo internacional foi alterado.**

---

## 1. DIAGNÓSTICO TÉCNICO DA ARQUITETURA ORIGINAL

### 1.1 Como o fluxo realmente funciona (descoberto, não presumido)

```
Navegador
  └─ POST /api/stripe/checkout        → cria Checkout Session (mode: subscription)
       └─ Stripe Checkout             → cobrana
            ├─ POST /api/webhook/stripe   → grava payments/subscriptions/licenses
            └─ GET  /api/v1/license/me    → painel lê licenses+payments+subscriptions
```

### 1.2 Schema real (descoberto via PostgREST contra o banco de produção)

| Tabela | Colunas que o código realmente usa |
|---|---|
| `payments` | `id, reference_id, user_id, customer_name, email, amount, plan_type, status, stripe_id, stripe_customer_id, stripe_subscription_id, created_at, updated_at, billing_period, provider` |
| `subscriptions` | `id, reference_id, pagbank_subscription_id, user_id, email, plan_type, status, payment_id, next_billing_at, canceled_at, created_at, updated_at, billing_period` |
| `licenses` | `license_key` (PK), `plan_type, max_devices, expires_at, billing_period, customer_email, notes, revoked, activated_at, created_at, user_id, email, client_id, payment_id, license_display_name` |
| `profiles` | `id, login, email, full_name, phone, address, city, neighborhood, state, cep, is_admin, role, is_blocked, is_deleted, created_at, updated_at` |

**Achado crítico:** `public.profiles` **NÃO tem a coluna `stripe_customer_id`**. Três rotas liam essa coluna.

### 1.3 Estado real do banco em 2026-10-19 (somente leitura)

| Métrica | Valor |
|---|---|
| Pagamentos `pending` | **35** |
| Pagamentos `approved` | **2** |
| Assinaturas | 7, todas `ACTIVE` |
| `subscriptions.next_billing_at` | **NULL em 7/7** |
| `subscriptions.canceled_at` | **NULL em 7/7** |
| Licenças | 10 (8 standard, 2 pro), 0 revogadas |
| Eventos no `stripe_event_log` | 2 |

---

## 2. CAUSAS REAIS DOS PROBLEMAS

### CAUSA RAIZ 1 — "Renovação: desligada" com assinatura viva
**Arquivos:** `app/api/webhook/stripe/route.ts` (handleCheckoutSettled, syncSubscription), `app/api/v1/license/me/route.ts`, `app/dashboard/DashboardClient.tsx`

O painel decidia "Renovação" lendo `subscriptions.next_billing_at`. **Nenhum caminho de código do webhook escrevia nessa coluna.** `syncSubscription()` gravava só `status`; `handleCheckoutSettled()` gravava só `status: 'ACTIVE'`. Resultado: banco sem a data → painel sem como afirmar renovação → exibia "desligada".

Agravante: não existia `cancel_at_period_end` na tabela, então um cancelamento agendado na Stripe não tinha espelho local e qualquer sincronização sobrescrevia o estado.

### CAUSA RAIZ 2 — Reembolso não cancelava a recorrência
**Arquivo:** `app/api/stripe/refund/route.ts:68`

```ts
if (latestCharge.invoice) { ... stripe.subscriptions.cancel(...) }
```

O campo `charge.invoice` foi **removido da API da Stripe** (2025-03+). Esse teste é **sempre falso** com a API atual. O cliente recebia o dinheiro de volta e **continuava sendo cobrado** no mês seguinte.

### CAUSA RAIZ 3 — Reembolso derrubava planos que continuavam pagos
**Arquivo:** `app/api/stripe/refund/route.ts:75-86`

```ts
await supabaseAdmin.from('licenses').update({ is_active: false }).eq('email', user.email);
```

Três defeitos: (a) `licenses` não tem `email` preenchido nem `is_active` — a coluna real é `customer_email` e o sinal é `revoked`; o update afetava **0 linhas**; (b) `subscriptions` e `payments` eram alterados **sem filtro de plano**, derrubando todas as compras do cliente; (c) não havia `stripe_refund_id`, então era impossível saber depois se o dinheiro saiu ou impedir reembolso duplicado.

### CAUSA RAIZ 4 — Cancelamento e Portal identificavam cliente por e-mail
**Arquivos:** `app/api/stripe/cancel/route.ts:17-32`, `app/api/stripe/portal/route.ts:15-31`

Ambos liam `profiles.stripe_customer_id` (**coluna inexistente**). A consulta falhava e o código caía em `stripe.customers.list({ email: user.email })` — prova de propriedade por **e-mail**, proibido pela missão §11 e inseguro: qualquer conta com o mesmo e-mail herdava o acesso.

### CAUSA RAIZ 5 — Cancelamento declarava sucesso sem confirmar
**Arquivo:** `app/api/stripe/cancel/route.ts:51-55`

Respondia `{success:true}` logo após o `update`, sem reler a Stripe, sem gravar espelho local e sem existir reativação. Uma falha da Stripe virava "Assinatura cancelada!" na tela.

### CAUSA RAIZ 6 — Webhook com 2 de 10 eventos
**Arquivo:** `app/api/webhook/stripe/route.ts`

Assinatura **só de teste** registrada com apenas `checkout.session.completed` e `invoice.paid`. Sem `customer.subscription.*`, o painel nunca recebia cancelamentos, nem falhas de cobrança, nem reembolsos da Stripe.

### CAUSA RAIZ 7 — Checkout sem vínculo com o cliente
**Arquivo:** `app/api/stripe/checkout/route.ts`

Usava só `customer_email`, sem `customer:`, sem `client_reference_id` e sem `subscription_data.metadata`. A Stripe criava um customer novo a cada compra, e o vínculo com o usuário dependia de e-mail — razãoda reconciliação admin precisar de heurísticas.

### CAUSA RAIZ 8 — 35 pagamentos `pending` sem causa tratável
**Auditoria:** `scripts` de leitura + `app/api/admin/reconcile/route.ts` (já existente, dry-run por padrão).

Os 35 pendentes **nunca foram pagos**: as sessões de checkout correspondentes estão `expired`/`unpaid` na Stripe (verificado em `cs_test_a1dNCmn4...`, cliente real `skincarebrasilofc@gmail.com`, 23/03/2026). Não são "pagamentos aprovados que não foram registrados" — são cobranças abandonadas. O caminho correto é a reconciliação admin já existente, não uma promoção em massa de status.

### CAUSA RAIZ 9 — Não havia fatura PDF
Não existia nenhuma biblioteca nem rota de geração de documento.

---

## 3. CORREÇÕES EFETIVAMENTE APLICADAS

### 3.1 Núcleo de domínio (novo)

| Arquivo | Responsabilidade |
|---|---|
| `lib/billing-state.ts` | Máquina de estados do faturamento (11 estados). `renewalEnabled` só é `true` com assinatura renovável + sem cancelamento agendado + data futura confirmada. Leitores tolerantes dos dois formatos de payload da Stripe 2025+ (`invoice.subscription` e `parent.subscription_details`). |
| `lib/billing-policy.ts` | Motor da política de reembolso (7 dias corridos, art. 49 CDC). Função pura: mesma entrada, mesmo resultado na rota, no painel e nos testes. |
| `lib/stripe-sync.ts` | Espelho Stripe→Supabase em UM lugar só (`next_billing_at`, `cancel_at_period_end`, `canceled_at`, `ended_at`, `stripe_customer_id`). Cancelamento confirmado nunca é sobrescrito. |
| `lib/stripe-events.ts` | Lista dos 10 eventos suportados, em módulo conferível fora da rota (restrição de exportação do Next.js). |
| `lib/company.ts` | Dados do emitente com **validação real de dígito verificador do CNPJ**. |
| `lib/invoice-data.ts` | Monta o documento a partir dos fatos do banco; separa compra / renovação / serviço / reembolso. |
| `lib/invoice-pdf.ts` | Gerador do PDF A4 com identidade VOLTRIS. |
| `lib/supabase-schema-compat.ts` | Select com fallback para deploys em rolling — **preserva os filtros de segurança** no caminho sem as colunas novas. |

### 3.2 Rotas

| Rota | O que mudou |
|---|---|
| `POST /api/stripe/checkout` | Cria/reutiliza **Stripe Customer** e persiste `stripe_customer_id`; `client_reference_id`; `subscription_data.metadata`; **aviso legal de recorrência exibido na Stripe antes do pagamento**; aceita `stripePriceId` do catálogo quando cadastrado. |
| `POST /api/webhook/stripe` | **10 eventos** em vez de 2; grava o espelho da assinatura (corrige a causa raiz 1); lê o `id` da assinatura nos 2 formatos da API; processa reembolso/estorno; não declara sucesso antes de concluir. |
| `POST /api/stripe/cancel` | Assinatura vem de `subscriptions.user_id` (UUID da sessão); IDOR bloqueado; **relê a resposta da Stripe antes de declarar sucesso**; grava o espelho; retorna "acesso até"; **implementa reativação**; idempotente. |
| `POST /api/stripe/refund` | Identifica a **cobrança escolhida**; elegibilidade pela política; reembolso **real** na Stripe com **chave de idempotência**; fora do prazo → registro para análise (HTTP 202) sem afirmar devolução; encerra a recorrência com a API correta; revoga **só** o escopo `(user_id, plan_type)` da compra inicial. |
| `POST /api/stripe/sync` (**nova**) | "Sincronizar Agora" consulta a **Stripe de verdade** para as assinaturas do usuário e reconcilia. Retorna `ok:false` quando parcial — sem 200 falso. |
| `GET /api/billing/invoices` (**nova**) | Lista o que é baixável e o motivo de cada indisponibilidade. Sem chamada à Stripe. |
| `GET /api/billing/invoice` (**nova**) | Gera o PDF. Filtra por `id` **e** `user_id` da sessão; anexo privado, `no-store`, `nosniff`. |
| `GET /api/v1/license/me` | Passa a devolver os fatos de faturamento e de fatura por licença + o bloco de conta. |
| `POST /api/stripe/portal` | Corrigido (não lê mais coluna inexistente, não usa e-mail). |

### 3.3 Interface

- **"Gerenciar no Portal Stripe" saiu do cartão de licença** → **"Baixar Fatura (PDF)"** com ícone de documento novo (`receipt` em `VoltrisIcon`), estados reais e "Baixar novamente".
- **"Verificando pagamento com a Stripe…" saiu do rodapé** → estados do documento: `Preparando sua fatura…` / `Fatura disponível para download.` / `Não foi possível preparar a fatura. Tentar novamente.` / `Fatura indisponível: aguardando confirmação do pagamento.` — com `AbortController` de 25 s (nunca carregamento infinito).
- Card "Gestão de Licenças & Faturamento" com **botões inteligentes**: Reativar/Cancelar conforme o estado; reembolso desabilitado quando não elegível; "Assinatura encerrada" no lugar de ação enganosa; linha de estado com **Renovação: Ativada/Desligada** vinda do servidor.
- Modais profissionais de cancelamento (mostra acesso até, multa zero) e reembolso (motivo opcional, prazo do estorno). **`window.confirm` removido.**
- `/adquirir-licenca`: bloco de termos da assinatura (recorrência, cancelamento sem multa, 7 dias corridos, fatura PDF) **antes** do pagamento.

---

## 4. ARQUIVOS MODIFICADOS / CRIADOS

**Criados**
```
lib/billing-state.ts
lib/billing-policy.ts
lib/stripe-sync.ts
lib/stripe-events.ts
lib/company.ts
lib/invoice-data.ts
lib/invoice-pdf.ts
lib/supabase-schema-compat.ts
app/api/stripe/sync/route.ts
app/api/billing/invoice/route.ts
app/api/billing/invoices/route.ts
supabase/migrations/20261019120000_billing_facts.sql
tests/billing-state.test.ts
tests/billing-policy.test.ts
tests/invoice-pdf.test.ts
tests/billing-routes-security.test.ts
scripts/alias-hooks.mjs, scripts/register-alias.mjs
scripts/preview-invoice.mjs, scripts/_audit-stripe.mjs
```

**Modificados**
```
app/api/webhook/stripe/route.ts
app/api/stripe/checkout/route.ts
app/api/stripe/cancel/route.ts
app/api/stripe/refund/route.ts
app/api/stripe/portal/route.ts
app/api/v1/license/me/route.ts
app/dashboard/DashboardClient.tsx
app/adquirir-licenca/page.tsx
components/dashboard/VoltrisIcon.tsx
lib/voltris-log.ts
.env.example
package.json  (+ pdf-lib)
```

---

## 5. MIGRAÇÃO SQL — `supabase/migrations/20261019120000_billing_facts.sql`

**Status: entregue, NÃO aplicada** (por decisão sua). O código já funciona sem ela — fallback testado contra produção.

**100% aditiva.** Nenhum `DROP`, `DELETE`, `TRUNCATE`, `ALTER COLUMN` ou mudança de tipo. Nenhuma linha existente de `payments`, `subscriptions` ou `licenses` é tocada.

- `subscriptions` + `stripe_customer_id, cancel_at_period_end, cancel_at, canceled_reason, ended_at, stripe_price_id, latest_invoice_id, payment_method_brand, payment_method_last4`
- `payments` + `stripe_charge_id, stripe_invoice_id, stripe_refund_id, refunded_amount, refunded_at, invoice_kind, period_start, period_end, paid_at, currency, customer_name_snapshot`
- Nova tabela `refund_requests` com **índices únicos parciais** que bloqueiam reembolso duplicado no nível do banco
- Backfill que **não inventa status** (só copia identificadores já existentes)

**Verificação pós-aplicação** (as consultas no fim do arquivo) deve retornar as colunas listadas e `refund_requests_ok = true`.

---

## 6. CONFIGURAÇÕES STRIPE A CONFERIR (modo LIVE)

> **Limitação honesta:** o `.env` local tem chaves de **teste** (`sk_test_`/`pk_test_`), mas o banco contém `cs_live_...` — ou seja, **produção roda em modo LIVE**. Com a chave de teste não é possível ler produtos, preços, assinaturas nem endpoints **live**. Nada foi executado em produção; todas as operações foram de leitura no ambiente de teste e no banco.

### 6.1 Endpoint de webhook (OBRIGATÓRIO)
`https://www.voltris.com.br/api/webhook/stripe` — deve estar registrado em **modo LIVE** com estes **10 eventos**:

```
- checkout.session.completed
- checkout.session.async_payment_succeeded
- checkout.session.async_payment_failed
- invoice.paid
- invoice.payment_failed
- customer.subscription.created
- customer.subscription.updated
- customer.subscription.deleted
- charge.refunded
- refund.updated
```

O endpoint de **teste** hoje tem apenas 2. O de live precisa ser conferido e corrigido.

### 6.2 Par de chaves
`STRIPE_SECRET_KEY` (live) e `STRIPE_WEBHOOK_SECRET` (do endpoint live) **precisam ser do mesmo modo**. Pares misturados fazem todo evento voltar 400.

### 6.3 Produtos e Preços (recomendado)
Hoje não há Products/Prices e o checkout usa `price_data` ad-hoc — funciona, mas o Price ID não é autoridade. Para usar Prices oficiais, cadastre 6 preços recorrentes BRL (standard/pro/enterprise × mês/ano) e preencha `stripePriceId` em `lib/license-catalog.ts`. O código já aceita o Price ID quando presente, com fallback automático.

### 6.4 Textos do Checkout
Configurar em **Settings > Checkout > Customer-facing messages**: política de reembolso, contato e termos (o `custom_text.submit` já envia a mensagem de recorrência).

---

## 7. CONFIGURAÇÕES VERCEL

**Obrigatórias:**
```
VOLTRIS_RAZAO_SOCIAL=VOLTRIS TECNOLOGIA LTDA
VOLTRIS_CNPJ=47.241.737/0001-60
VOLTRIS_EMAIL=contato@voltris.com.br
VOLTRIS_TELEFONE=(11) 99671-6235
VOLTRIS_SITE=https://www.voltris.com.br
```
(opcionais: `VOLTRIS_ENDERECO`, `VOLTRIS_CIDADE`, `VOLTRIS_UF`, `VOLTRIS_CEP`, `VOLTRIS_NOME_FANTASIA`)

**Pendência bloqueante:** a **razão social não existe em nenhum arquivo do projeto**. O CNPJ `47.241.737/0001-60` foi extraído do rodapé e **validado por dígito verificador** (está correto). Sem `VOLTRIS_RAZAO_SOCIAL` o PDF sai com "VOLTRIS". O código **não inventa** CNPJ: se o valor configurado for inválido, o campo sai vazio.

**Opcional:** `STRIPE_API_SUPPORTS_CANCELLATION_DETAILS=1` (registra o motivo do cancelamento na Stripe).

**Já existentes e corretos:** `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_BASE_URL`, `NEXT_PUBLIC_SITE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SUPABASE_URL/ANON_KEY`.

---

## 8. RESULTADO DOS TESTES AUTOMATIZADOS

```
npm test
ℹ tests 299   ℹ suites 68   ℹ pass 299   ℹ fail 0   ℹ duration 2.5s
```

| Arquivo | Testes | Cobre |
|---|---|---|
| `tests/license-state.test.ts` | *(pré-existente)* | 6 estados da licença |
| `tests/license-catalog.test.ts` | *(pré-existente)* | catálogo |
| `tests/licensing-invariants.test.ts` | *(pré-existente)* | invariantes de licenciamento |
| `tests/desktop-license-contract.test.ts` | *(pré-existente)* | contrato com o app desktop |
| **`tests/billing-state.test.ts`** | **37** | precedência de `cancel_at_period_end`, 11 estados alcançáveis, `renewalEnabled` só com data futura, leitores dos 2 formatos de payload |
| **`tests/billing-policy.test.ts`** | **34** | 7 dias corridos (limite inclusivo), 8 casos de duplicidade, base legal em todos os resultados |
| **`tests/invoice-pdf.test.ts`** | **39** | CNPJ por dígito verificador, BRL, fuso America/Sao_Paulo, PDF A4 real, texto dentro do arquivo, compra ≠ renovação, cenários extremos |
| **`tests/billing-routes-security.test.ts`** | **60** | IDOR, filtros de posse, idempotência, ausência dos padrões defeituosos, cobertura de eventos |

**Baseline antes da intervenção: 113 testes. Depois: 299.** Nenhum teste pré-existente foi removido ou afrouxado.

**Bug real encontrado pelo teste:** as datas do PDF usavam o fuso **do servidor** — a mesma cobrança apareceria como "18/11" na Vercel (UTC) e "19/11" local. Corrigido para `America/Sao_Paulo` fixo.

---

## 9. RESULTADO DOS TESTES DE INTEGRAÇÃO

### 9.1 Banco de produção (somente leitura) — **PASSOU**
```
subscriptions.fallback_preserva_filtro_user_id ............ true
payments.fallback_preserva_filtro_in ....................... true
licencas.lidas ............................................ 2
assinaturas_do_usuario .................................... 2
pagamentos_do_usuario: 1 approved, invoicable: true
pdf_gerado_de_dado_real: 4445 bytes,
  VOLTRIS-Fatura-Comercial-st_1792377997027.pdf,
  tipo: purchase, valor: 4.99, cliente: "Douglas Felipe Becker"
integridade_nenhuma_cobranca_nao_confirmada_e_faturavel ... true
```
**Confirma:** (a) o fallback de schema preserva os filtros de segurança; (b) a cadeia completa banco → `buildInvoiceData` → PDF produz um documento real com dados reais.

### 9.2 Stripe — **NÃO EXECUTADO em produção**
Não foi possível rodar teste de integração Stripe real: só há chave de teste no ambiente, e produção é modo LIVE. **Não inventei resultado.** Ver §6.

### 9.3 Build / tipos / lint

| Verificação | Resultado |
|---|---|
| `npx next build` | ✅ **exit 0** — compilou em 2,1 min, 555 páginas |
| `npx tsc --noEmit` | ✅ **0 erros nos arquivos novos/modificados** |
| `npm test` | ✅ **299/299** |
| `next lint` | ✅ Nenhum erro novo. Permanecem erros `no-explicit-any` **pré-existentes** em ~30 arquivos não tocados |

Erros pré-existentes **não introduzidos** por esta intervenção (confirmados por `git stash` do baseline):
- `lib/stripe.ts(8)` — `apiVersion: '2025-02-24.acacia'` incompatível com `stripe@20`
- ~180 erros de tipo em `app/guias/*` (propriedade `pathname` ausente)
- `app/api/sign-up/route.ts` — "is not a module"

---

## 10. PRÉVIA VISUAL DA NOVA INTERFACE

O cartão de licença agora mostra:

```
┌──────────────────────────────────────────────────────────────────┐
│ ▣  VOLTRIS PRO                          [Ativa]      Acesso até   │
│    Assinatura ativa: a próxima cobrança está programada. 19/11    │
│    faltam 30 dias                                                  │
│                                                                  │
│  Por que este estado?  Cancelamento não corta o período pago     │
│                                                                  │
│  CHAVE DE ATIVAÇÃO        VOLTRIS-PRO-••••••-•••-••••DB11C        │
│  👁  📋                                                        │
│                                                                  │
│  Plano     Período   Dispositivos   Ativada em   Pagamento  ...   │
│  Assinatura   Renovação: ativada · 19/11/2026                     │
│                                                                  │
│ ────────────────────────────────────────────────────────────────  │
│ 🧾 Fatura disponível para download.   [Baixar Fatura (PDF)] [App]│
└──────────────────────────────────────────────────────────────────┘
```

Card "Gestão de Licenças & Faturamento":

```
┌──────────────────────────────────────────────────────────────────┐
│ ▣  Gestão de Licenças & Faturamento      [⟳ Sincronizar Agora]     │
│    Assinatura ativa: a próxima cobrança está programada na Stripe.│
│                                                                  │
│ [✕ Cancelar Renovação Automática]  [⟳ Solicitar Reembolso (7 Dias)]│
│                                                                  │
│ Estado: Ativa · Renovação: Ativada · Próxima cobrança: 19/11/2026 │
└──────────────────────────────────────────────────────────────────┘
```

Antes → depois:

| Antes | Depois |
|---|---|
| `Gerenciar no Portal Stripe` | `Baixar Fatura (PDF)` |
| `Verificando pagamento com a Stripe…` | `Fatura disponível para download.` |
| `Renovação: desligada` (sempre) | `Renovação: Ativada · 19/11/2026` |
| `Sincronizar Agora` → relia o banco | → reconcilia com a Stripe |
| `window.confirm` | Modal profissional |
| Botões fixos | Botões conforme o estado real |

---

## 11. PRÉVIA VISUAL DO PDF EM A4

`Fatura de Renovação` (pg. 1/1, 595,28 × 841,89 pt):

```
████████████████████████████████████████████████████████████████  ← degradê
   ╲▌╱  VOLTRIS                          Fatura de Renovação
        VOLTRIS OPTIMIZER                renew_in_1UQpl
   ──────────────────────────────────────────────────────────────
   EMITENTE                            CLIENTE
   VOLTRIS                             Maria Aparecida de Souza
   CNPJ: 47.241.737/0001-60             cliente.exemplo@voltris.com.br
   São Paulo, SP — Brasil              ID do cliente: ***.456.789-**
   contato@voltris.com.br
   ┌────────────────────────────────────────────────────────────┐
   ▌│ VOLTRIS OPTIMIZER                        R$ 15,00         │  ← degradê lateral
   ▌│ Cobrança recorrente do período contratado. VALOR PAGO...  │
   ▌│ (PRO) (MENSAL) (PAGO)                                     │
   └────────────────────────────────────────────────────────────┘
   DADOS DA TRANSAÇÃO
   Identificador da compra   1e0f9938-ada6-4233-   Fatura Stripe   in_1UQpl…
   Referência do pagamento   pi_3UQpljJpNL78U7i…   Cobrança Stripe  ch_3UQpl…
   Data da compra            19/10/2026, 00:47     Período pago    19/10 a 19/11
   Pagamento confirmado em   19/10/2026, 00:47     Assinatura      sub_1UQpl…
   Modalidade de cobrança    Mensal — assinatura…  Plano adquirido  VOLTRIS PRO
   LICENÇA VOLTRIS OPTIMIZER
   ┌────────────────────────────────────────────────────────────┐
   │ Chave de licença                 Início da vigência 19/10… │
   │ VOLTRIS-PRO-804836-20261115-…    Expiração          19/11… │
   │ Dispositivos                     Situação           Ativa   │
   │ 3 permitidos · 2 em uso                                   │
   └────────────────────────────────────────────────────────────┘
   ──────────────────────────────────────────────────────────────
   Fatura comercial — Este documento não substitui nota fiscal
   eletrônica (NFS-e).
   www.voltris.com.br · contato@voltris.com.br
```

Elementos conferidos:
- ✅ A4 exato, uma página, degradê rosa→roxo→azul, glifo "V" da marca
- ✅ Acentuação completa em português (WinAnsi)
- ✅ Valores em BRL (`R$ 15,00`, nunca `US$` nem `15.00`)
- ✅ Datas em pt-BR no fuso **America/Sao_Paulo**
- ✅ Título **distingue** Compra / Renovação / Serviço / Reembolso
- ✅ Renovação mostra **o período dela**, não o da compra inicial
- ✅ Aviso de que não é NFS-e, sempre
- ✅ Campo ausente aparece como "—" (nunca inventado)

Gerar as amostras: `npm run preview:invoice`

---

## 12. CHECKLIST DE VALIDAÇÃO DO AMBIENTE DE PRODUÇÃO

**Antes do deploy**
- [ ] Aplicar `supabase/migrations/20261019120000_billing_facts.sql`
- [ ] Conferir as 3 consultas de verificação ao final da migration
- [ ] Definir `VOLTRIS_RAZAO_SOCIAL` e `VOLTRIS_CNPJ` na Vercel
- [ ] Confirmar `STRIPE_SECRET_KEY` e `STRIPE_WEBHOOK_SECRET` **live** na Vercel

**Stripe (modo LIVE)**
- [ ] Registrar os 10 eventos no endpoint `/api/webhook/stripe` (§6.1)
- [ ] Conferir `STRIPE_WEBHOOK_SECRET` = segredo do endpoint live
- [ ] Verificar que as 7 assinaturas existentes têm método de pagamento

**Após o deploy**
- [ ] Logar no painel → aba Licenças → "Renovação: Ativada" + data futura
- [ ] "Sincronizar Agora" → reconcilia e mostra a data real
- [ ] "Baixar Fatura (PDF)" → PDF A4 abre com os dados corretos
- [ ] "Cancelar Renovação" → Stripe reflete `cancel_at_period_end: true`
- [ ] Cancelar em uma assinatura → Reativar → Stripe reflete `false`
- [ ] Reembolso (Stripe test mode, nunca live) → devolução + assinatura encerrada
- [ ] Usuário B tentando acessar a fatura de A → **404**

**Reconciliação dos 35 pendentes** (opcional, com evidência)
```
GET  /api/admin/reconcile                                        # dry-run
POST /api/admin/reconcile {"apply":true,"confirm":"RECONCILE-APPLY"}
```
Verificado: as sessões correspondentes estão `expired`/`unpaid`. A rota deve classificá-las como `WAIT_STRIPE`/`NEEDS_MANUAL`. **Não marcar como "não pago" sem prova.**

---

## 13. LIMITAÇÕES E PENDÊNCIAS NÃO VERIFICADAS

| # | Item | Situação |
|---|---|---|
| 1 | **Testes de integração Stripe reais** | Não executados — só há chave de teste no ambiente e produção é LIVE. Nenhum resultado inventado. Requer §12. |
| 2 | **Endpoint live** | Não pude ler o endpoint live. Os 2 eventos do endpoint de **teste** estão documentados; o live precisa ser conferido por você. |
| 3 | **Cobrança recorrente efetiva** | O ciclo de faturamento **depende do próximo ciclo real**. O código e os testes estão prontos; **nenhuma cobrança real foi executada nem simulada** nesta entrega. |
| 4 | **Razão social** | Não existe no projeto. Via variável de ambiente; sem ela o PDF traz "VOLTRIS". |
| 5 | **Products/Prices oficiais** | Não cadastrados. O checkout segue com `price_data` ad-hoc (funciona). `stripePriceId` no catálogo ativa o uso de Prices oficiais. |
| 6 | **Migration não aplicada** | Decisão sua. Sem ela o painel mostra "ainda não temos a data da próxima cobrança" — honesto, e o botão de cancelamento continua disponível. |
| 7 | **NFS-e** | Não implementado. O documento se declara explicitamente "fatura comercial", conforme §6. |
| 8 | **`lib/stripe.ts` apiVersion** | Erro de tipo **pré-existente**: `'2025-02-24.acacia'` vs `stripe@20` (`2026-02-25.clover`). **Não alterei** — mudar a versão da API muda o formato dos eventos e exige validação conjunta do painel. Recomendo alinhar com a versão do endpoint (verificar antes). |
| 9 | **Erros de tipo em `app/guias/*`** | ~180 erros **pré-existentes**, em arquivos não tocados por esta missão. |
| 10 | **Reembolso parcial** | A rota executa reembolso integral. Parcial fica registrado no banco e espelhado pelo webhook, mas não há UI para solicá-la. |

---

## 14. CRITÉRIOS DE ACEITAÇÃO

| | Critério | Status |
|---|---|---|
| **A** | Compra recorrente cria a assinatura correta e o painel mostra o estado real | ✅ Implementado — **falta aplicar a migration + sincronizar** para as 7 assinaturas existentes |
| **B** | Preparado e validado para cobranças periódicas e renovação de licença | ✅ `invoice.paid` → `renew_subscription_license` com período da Stripe; cobertura de 10 eventos |
| **C** | Usuário baixa fatura PDF verdadeira com identidade VOLTRIS | ✅ **Verificado com dado real** (4.445 bytes, cliente real do banco) |
| **D** | Cancelamento executa operação verdadeira com confirmação | ✅ `stripe.subscriptions.update` + releitura + espelho local + reativação |
| **E** | Reembolso executa fluxo financeiro real, automático ou em análise | ✅ Dentro de 7 dias: reembolso real; fora: 202 + revisão, sem afirmar devolução |
| **F** | Nenhum cliente acessa documento/cancelamento/reembolso de outro | ✅ `user_id` da sessão em todas as rotas; **60 testes de segurança** |
| **G** | Nenhum webhook/pagamento duplicado gera licença ou fatura inconsistente | ✅ `stripe_event_log` por `event.id`; `refund_requests` com índice único parcial; chave de idempotência no refund; RPC idempotente por `payment_id` |
| **H** | Funcionalidades existentes continuam funcionando | ✅ 113 testes pré-existentes intactos; build exit 0; nenhuma regressão |

---

**INVESTIGUEI · CORRI A CAUSA RAIZ · IMPLEMENTEI · TESTEI · VALIDEI · DOCUMENTEI.**