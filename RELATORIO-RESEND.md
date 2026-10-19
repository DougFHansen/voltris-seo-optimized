# RELATÓRIO DE ENTREGA — INTEGRAÇÃO DO RESEND AO VOLTRIS BRASIL

**Projeto:** VOLTRIS — `voltris.com.br`
**Escopo:** e-mails transacionais de compra, renovação, cancelamento, reembolso e falha de pagamento, integrados ao fluxo de licenciamento, fatura PDF, Stripe e Supabase já existentes.
**Data:** 19 de outubro de 2026

---

## 1. AUDITORIA ANTERIOR

### 1.1 O que já existia e estava funcionando

| Item | Estado encontrado |
|---|---|
| Checkout Stripe | Funcionando |
| Webhook Stripe | Funcionando para emissão de licença |
| Emissão de licença | Via RPC canônica `renew_subscription_license`, idempotente por `payment_id` |
| Fatura PDF | Gerada por `lib/invoice-pdf.ts`, baixável no Dashboard |
| Painel do cliente | Consumindo o estado canônico de `/api/v1/license/me` |
| Supabase Auth | Funcionando com o mailer padrão do Supabase |

### 1.2 O que faltava

**Não existia nenhuma fila de e-mail.** Foram consultadas quatro tabelas candidatas no banco de produção e todas inexistentes:

| Tabela | Resultado |
|---|---|
| `email_queue` | `404 — relation "public.email_queue" does not exist` |
| `email_outbox` | `404 — relation "public.email_outbox" does not exist` |
| `emails` | `404 — relation "public.emails" does not exist` |
| `email_log` | `404 — relation "public.email_log" does not exist` |

Existem `public.notifications` (notificação in-app do sino) e `public.newsletter_subscribers` (marketing), mas nenhuma das duas serve para e-mail transacional com repetição — logo, a tabela nova era necessária e é **aditiva**, sem tocar nas existentes.

### 1.3 Falhas identificadas

**Falha 1 — nenhum e-mail era enviado.** `sendLicenseEmail` não é chamada em nenhum ponto do projeto. A busca por `sendLicenseEmail|emailService` em todo o código TypeScript retornou apenas a própria definição.

**Falha 2 — a função retornava sucesso sem enviar nada.** Três caminhos devolviam `true`:

| Caminho | O que realmente acontecia |
|---|---|
| SMTP | Imprimia *"implementação pendente"* e devolvia `true` |
| Fila | Gravava em `email_queue`, tabela inexistente — o `insert` falhava, o erro era engolido, a execução caía no caminho seguinte |
| Resend | Usava remetente fixo `naoresponda@voltris.com.br`, que **não é** o remetente verificado (`faturas@voltris.com.br`) |

Um chamador que conferisse o retorno receberia *"enviado"* com a licença nunca entregue.

**Falha 3 — a API da Resend não estava instalada** (`resend` ausente do `package.json`); o serviço fazia `fetch` cru na API.

**Falha 4 — dinheiro com separador decimal americano:** `R$ ${amountPaid.toFixed(2)}` produzia `R$ 15.00`.

**Falha 5 — vazamento de dados em log:** endereço do cliente e prefixo da chave de licença impressos em texto puro.

**Falha 6 — sem idempotência, sem retry, sem timeout:** uma indisponibilidade da Resend significava e-mail perdido para sempre.

**Falha 7 — o remetente estava fixo no código**, ignorando as variáveis `RESEND_FROM_EMAIL` e `RESEND_FROM_NAME` que já existiam na Vercel.

**Segurança — o arquivo expõe uma credencial.** O `Corrigir.txt` contém a chave `RESEND_API_KEY` em texto puro no repositório. Conforme a regra *"não exponha os valores secretos"*, **esta chave deve ser rotacionada no painel da Resend** — não repetida aqui. O arquivo em si é o vazamento.

### 1.4 Achado sobre o Supabase Auth (FASE 14)

Consulta de leitura à configuração de Auth do projeto de produção:

```json
{ "smtp_host": null, "smtp_user_set": false, "smtp_pass_set": false,
  "smtp_port": null, "smtp_admin_email": null }
```

**O Supabase Auth não tem SMTP próprio configurado** — os e-mails de autenticação usam o serviço padrão do Supabase, não o Resend.

Decisão: **não alterei**. A missão diz explicitamente para não substituir automaticamente os e-mails de autenticação nem duplicar mensagens, e que o objetivo prioritário é o transacional de compras e licenças. Migrar o SMTP do Auth é uma operação separada, com impacto em recuperação de senha e confirmação de cadastro, e que precisa ser testada por conta própria. Fica documentado na seção 5.

---

## 2. IMPLEMENTAÇÃO

### 2.1 Serviços utilizados

| Serviço | Papel |
|---|---|
| `resend@4.8.0` | SDK oficial da Resend (novamente instalado) |
| `pdf-lib` | Geração do anexo PDF — **reutilizado**, sem biblioteca nova |
| Supabase Postgres | Fila transacional persistente |
| Stripe | Já existente; apenas consumida para decidir o conteúdo do e-mail |

Nenhuma dependência nova foi criada além do SDK oficial da Resend.

### 2.2 Arquivos criados

| Arquivo | Responsabilidade |
|---|---|
| `lib/resend-client.ts` | **Única** porta de saída para a Resend em todo o projeto |
| `lib/email-templates.ts` | **Único** lugar que escreve HTML de e-mail (5 renderizadores) |
| `lib/email-outbox.ts` | Fila: enfileirar, reservar, enviar, repetir, desistir |
| `lib/email-notifier.ts` | Ponto de disparo por evento de negócio |
| `lib/invoice-service.ts` | Fatura única para Dashboard **e** e-mail |
| `app/api/email/outbox/route.ts` | Worker (cron da Vercel) + diagnóstico |
| `app/api/webhook/resend/route.ts` | Eventos de entrega da Resend |
| `app/api/admin/emails/route.ts` | API do histórico, atrás de `requireAdmin` |
| `app/restricted-area-admin/emails/AdminEmailsTab.tsx` | Aba "E-mails" no painel admin |
| `supabase/migrations/20261019130000_email_outbox.sql` | Tabela da fila (aditiva) |
| `scripts/preview-email.mjs` | Pré-visualização e envio opcional |
| `scripts/stubs/next-server.mjs` | Dublê de `next/server` **só para os testes** |
| `vercel.json` | Cron da fila a cada 5 minutos |

### 2.3 Integração com o Resend

Um único módulo fala com `api.resend.com`. Nenhum outro arquivo faz chamada direta.

**Decisões e o motivo:**

- **Configuração validada em runtime**, não só no import — em serverless o módulo é re-reevaluado a cada cold start, e erro de configuração tem que virar falha controlada e logada, não `undefined` silencioso.
- **Leitura preguiçosa do ambiente** (`fromEmail()` / `fromName()` em vez de `const` no topo do módulo). Capturar no topo congelaria o valor no primeiro import e faria o diagnóstico mentir depois de qualquer ajuste.
- **Timeout próprio via `Promise.race`.** O SDK v4 **não expõe** opção de timeout no construtor (`constructor(key?: string)`) — foi verificado no `.d.ts` do pacote. Sem isso, uma conexão pendurada consome a duração inteira da função.
- **`retry` do SDK desligado por ausência de opção**, e o backoff é do outbox: duas camadas de retry somadas é a forma mais comum de enviar o mesmo e-mail três vezes.
- **Classificação de erro em 9 categorias** (`CONFIG`, `AUTH`, `RATE_LIMIT`, `SENDER`, `VALIDATION`, `TIMEOUT`, `NETWORK`, `SERVER`, `UNKNOWN`), porque *repetir ou desistir* depende do tipo: 401 não melhora repetindo; 429 melhora.
- **`idempotencyKey` enviada à Resend** — cobre o caso em que a API aceita a mensagem e a resposta se perde. Como o `Promise.race` não cancela o `fetch` subjacente, essa ambiguidade é real e está tratada.
- **Validação de destinatário antes da chamada** — a API cobra por e-mail aceito e endereço inválido vira bounce, que é o sinal que derruba a reputação do domínio.
- **`scrubSecrets`** remove a chave de mensagens de erro, inclusive no formato `re_*` sem a chave exata no texto (log gerado em outro deploy).

### 2.4 Templates criados (FASE 5)

Cinco renderizadores, todos em `lib/email-templates.ts`:

| Renderizador | Assunto |
|---|---|
| `renderPurchaseEmail` | Pagamento confirmado e sua licença está disponível |
| `renderRenewalEmail` | Sua assinatura foi renovada com sucesso |
| `renderCancellationEmail` | Renovação automática desativada |
| `renderRefundEmail` | **Quatro** assuntos distintos, um por estágio |
| `renderPaymentFailedEmail` | Não foi possível processar sua renovação |

**Identidade visual:** base escura `#08080c` e as cores da marca (`#FF4B6B`, `#8B31FF`, `#31A8FF`).

**Compatibilidade de cliente:**
- Layout em `<table role="presentation">` — sem flex/grid;
- **sem `border-radius` em `<td>`** — o botão é quadrado de propósito (ver 2.9);
- degradê sempre com `background-color` sólido de reserva — sem isso o Outlook/Word Engine renderiza o fundo branco;
- `600px` com `max-width` e media query para telas estreitas;
- `<style>` apenas para media query e `prefers-color-scheme`.

### 2.5 Fatura em PDF — o MESMO documento do Dashboard (FASE 6)

`lib/invoice-service.ts` expõe `loadInvoiceForOwner`, usado pelo download no painel **e** pelo anexo do e-mail. `buildInvoiceData` monta a estrutura e `generateInvoicePdf` gera o PDF — **um gerador só**.

Isso não é cosmético: quando os dois PDFs são montados em lugares diferentes, divergem na primeira mudança de layout e o cliente passa a receber um documento diferente do que baixou no site.

**Filtro de propriedade:** a consulta exige `id` **E** `user_id` da sessão. É o que impede que o anexo do e-mail aceite um `payment_id` de outro cliente.

**Fatura só para cobrança confirmada.** Statuses aceitos: `approved`, `paid`, `refunded`, `partially_refunded`, `charged_back`. Qualquer outro devolve *"aguardando confirmação do pagamento"* — nunca um documento dizendo "Pago" para transação não liquidada.

### 2.6 Integração com o Stripe — onde cada e-mail nasce

| Evento | Arquivo | Notificação |
|---|---|---|
| `checkout.session.completed` | `app/api/webhook/stripe/route.ts` | `notifyPurchaseConfirmed` |
| `invoice.paid` (assinatura conhecida) | idem | `notifySubscriptionRenewed` |
| `invoice.paid` (assinatura ainda não registrada) | idem | `handleFirstSubscriptionCharge` → `notifyPurchaseConfirmed` |
| `invoice.payment_failed` | idem | `notifyPaymentFailed` |
| `charge.refunded` integral | idem | `notifyRefund({ stage: 'confirmed' })` |
| `POST /api/stripe/cancel` | `app/api/stripe/cancel/route.ts` | `notifyRenewalCanceled` |
| `POST /api/stripe/refund` | `app/api/stripe/refund/route.ts` | `notifyRefund` (solicitado / em processamento / confirmado) |

Três decisões que evitam enganar o cliente:

1. **Cancelamento** dispara e-mail **só depois** de `confirmed` — a Stripe devolveu `cancel_at_period_end` como pedimos. É o requisito *"não envie esse e-mail se a operação de cancelamento falhou"*.
2. **Reativar a renovação não gera e-mail** — o cliente acabou de desligá-la; avisá-lo de volta que religamos seria confuso.
3. **Estágio do reembolso vem do estado real da operação**, nunca do clique: `confirmed` só quando `refund.status === 'succeeded'`; caso contrário `processing`.

### 2.7 Banco de dados alterado

Uma migration, `supabase/migrations/20261019130000_email_outbox.sql`. **Não aplicada** — entregue como arquivo, conforme combinado.

**Nada destrutivo:** apenas `CREATE TABLE IF NOT EXISTS`, índices, trigger de `updated_at`, RLS e views.

Tabela `public.email_outbox`:

| Grupo | Colunas |
|---|---|
| Identificação | `id`, `template_type`, `idempotency_key` |
| Vínculos | `recipient_email`, `user_id`, `payment_id`, `license_key`, `subscription_id` |
| Conteúdo já renderizado | `subject`, `html_body`, `text_body` |
| Anexo | `attachment_name`, `attachment_content` (base64), `attachment_size` |
| Estado | `status`, `provider_message_id`, `attempts`, `available_at`, `last_error`, `last_error_kind` |
| Entrega (FASE 12) | `delivery_status`, `delivered_at`, `opened_at`, `delivery_flag`, `delivery_flag_at` |
| Auditoria | `sent_at`, `meta`, `created_at`, `updated_at` |

**Índice único em `idempotency_key`** — é o que impede e-mail duplicado quando a Stripe reenvia o webhook, independentemente de qual processo tentou.

**Segurança:** RLS ligado **sem policy para `anon`/`authenticated`** e `REVOKE ALL`. A tabela contém corpo de e-mail, endereço do destinatário e a fatura em base64. Se houvesse policy "filtra por `user_id`", **qualquer cliente autenticado leria o histórico de e-mail dos outros**. O acesso é só pela API, com `service_role`, depois de validar `profiles.is_admin` no servidor.

### 2.8 Webhook da Resend (FASE 12)

`app/api/webhook/resend/route.ts`.

**Autenticidade:** verificação de assinatura Svix implementada no próprio arquivo (HMAC-SHA256, comparação em tempo constante, janela de 5 min contra replay). O segredo é o **do webhook da Resend** — `RESEND_WEBHOOK_SECRET`, separado do `STRIPE_WEBHOOK_SECRET`. Sem ele a rota responde **503**, e não aceita nada: um webhook sem autenticação permitiria forjar "entregue" no histórico.

**A distinção que a missão exige é preservada por colunas separadas:**

| Sinal | Significado |
|---|---|
| `status = 'sent'` | A Resend **aceitou** |
| `delivery_status = 'delivered'` | O servidor de destino **recebeu** |
| `delivery_status = 'opened'` | O destinatário abriu |

`bounced` e `complained` vão para `delivery_flag`, **separado de `status`** — é sinal de reputação (endereço ruim), não falha de envio. Mexer em `status` com bounce esconderia a falha real de configuração do remetente.

### 2.9 Correções feitas durante a própria implementação

Três defeitos foram encontrados pelos testes e corrigidos no código, não no teste:

1. **`border-radius` no `<td>` do botão** — violava a própria regra de compatibilidade da missão. O botão é quadrado de propósito: com as quinas cortadas em parte dos clientes e inteiras em outros, fica pior do que reto e consistente.
2. **A versão em texto do e-mail de reembolso perdia o qualifier** — quem lia em modo texto não encontrava *"ainda não foi creditado"* nem *"não afirmamos que o valor já foi devolvido"*. A alternativa textual virava um canal **menos preciso** que o principal. Cada estágio agora tem seu qualifier próprio na versão texto.
3. **Variáveis de ambiente capturadas no topo do módulo** — congelavam o valor no primeiro import e faziam o diagnóstico de configuração mentir. Passaram a ser lidas a cada chamada.

---

## 3. CONFIABILIDADE

### 3.1 Idempotência

Duas camadas independentes:

**Camada 1 — banco.** `idempotency_key` com índice único. Um segundo evento cai em `23505` e vira no-op. Cobre *"a Stripe reenvia o webhook"* sem depender de lógica de aplicação.

**Camada 2 — Resend.** A mesma chave vai como header `Idempotency-Key`. Cobre *"a Resend aceitou e a resposta se perdeu no caminho de volta"*, que é explicitamente pedida na missão e que o `Promise.race` do timeout torna real.

Formato das chaves — **determinísticas a partir do fato de negócio**, nunca de `Date.now()` ou `Math.random()`:

| Evento | Chave | Efeito |
|---|---|---|
| Compra | `purchase:<payment_id>` | 1 e-mail por compra |
| Renovação | `renewal:<stripe_invoice_id>` | 1 e-mail por cobrança recorrente |
| Cancelamento | `cancel:<subscription_id>:<dia>` | 2 cliques no mesmo dia → 1 e-mail |
| Reembolso | `refund:<refund_id>:<estágio>` | 4 estágios → 4 mensagens distintas |
| Pagamento recusado | `payment_failed:<sub_id>:<dia>` | Várias recusas no dia → 1 aviso |

### 3.2 Reenvios

`resendOutboxEmail` — **manual e auditado**:

- Recusa reenviar linha com `status = 'sent'` (criaria duplicidade);
- Usa chave **nova** (`{original}.resend:{timestamp}`) — se reutilizasse a original, a Resend recusaria como duplicata e o "reenvio" não enviaria nada;
- Marca a original como `canceled` com motivo, **sem apagar o histórico**;
- Grava em `audit_logs` com o id do administrador.

### 3.3 Tratamento de falhas

A regra crítica da missão é: *"a emissão da licença e a confirmação do pagamento NÃO podem depender de a Resend estar disponível."*

Por isso o desenho é **transacional-outbox**, não envio direto no webhook:

1. O webhook confirma o pagamento e emite a licença (caminho já testado).
2. No mesmo passo grava a **intenção** na fila. Se a gravação falhar, a compra continua válida — só o aviso se atrasa.
3. O worker pega as pendentes, chama a Resend e grava o resultado.
4. Falha transitória volta para `pending` com backoff; esgotadas as tentativas, vai para `failed` e aparece no admin.

**Todas as funções de `lib/email-notifier.ts` nunca lançam.** Uma falha de e-mail aparece como log, nunca como erro do webhook.

**Backoff exponencial com jitter**, teto de 6 h. O jitter não é enfeite: sem ele, N linhas que falharam juntas voltam no mesmo instante e repetem a rajada. `Retry-After` da Resend prevalece sobre o cálculo. Teto de **5 tentativas**.

**Recuperação:** linhas presas em `processing` (worker morto no meio) voltam para a fila após 5 minutos.

**Reserva atômica:** o worker marca as linhas com `UPDATE ... WHERE status='pending'` devolvendo as linhas. Se vierem zero, outro worker já pegou. Sem isso, dois workers mandariam o mesmo e-mail.

### 3.4 Logs

Sistema `lib/voltris-log.ts` com `correlation_id` por operação, quatro operações novas (`EMAIL_ENQUEUE`, `EMAIL_WORKER`, `EMAIL_RESEND`, `ADMIN_EMAILS`) e **máscara de e-mail** (`maskEmail`) em todos os registros de destinatário.

A API key nunca aparece em log: `scrubSecrets` é aplicado na classificação de erro, e as mensagens persistidas no banco são truncadas em 500 caracteres.

### 3.5 Segurança

| Medida | Onde |
|---|---|
| Nenhum segredo em log | `scrubSecrets` |
| Destinatário inválido não vira chamada | `isValidEmail` antes da API |
| Tabela sem policy para `authenticated` | Migration |
| Histórico atrás de `requireAdmin` | `app/api/admin/emails/route.ts` |
| anexo em base64 **não** sai na listagem | A API omite `attachment_content` |
| E-mail mascarado na resposta da API | `maskEmail` |
| Webhook assinado e com janela anti-replay | `verifySvixSignature` |
| Worker aceita `limit` com teto de 50 | `app/api/email/outbox/route.ts` |
| Worker não aceita destinatário, template ou conteúdo pela rede | A rota só lê o que já está na fila |
| Toda query parametrizada (zod) | `ListQuery`, `ActionBody` |
| Reenvio não aceita outro destinatário | Usa o da linha original |

---

## 4. TESTES

### 4.1 Executados e resultados

```
npm test   →   tests 419 | pass 419 | fail 0 | duration 4482ms
```

| Suíte | Testes | Cobre |
|---|---|---|
| `tests/email-resend-client.test.ts` | 36 | Validação de destinatário, aferição de configuração, classificação de erro, limpeza de segredos, garantias de `sendEmail` |
| `tests/email-templates.test.ts` | 50 | Escape de HTML, envelope, compatibilidade Outlook/Gmail, identidade visual, formatação pt-BR, os 5 eventos, ausência de promessa falsa |
| `tests/email-outbox.test.ts` | 34 | Backoff, idempotência, máquina de estados, recuperação, estatísticas, formato das chaves |

Baseline anterior: **299**. Total agora: **419**. Nenhum teste existente foi removido ou desabilitado.

```
npm run test:email   →   120 testes dos três arquivos acima
```

### 4.2 Evidências executadas

| Verificação | Comando | Resultado |
|---|---|---|
| TypeScript | `npx tsc --noEmit` | **0 erros** nos arquivos tocados |
| ESLint | `npx eslint <arquivos novos>` | **0 código morto**; restam 12 `no-explicit-any`, padrão **pré-existente** do projeto (confirmado em arquivos não tocados) |
| Build de produção | `npx next build` | **exit 0**, 11 rotas novas compiladas |
| Renderização real | `npm run preview:email` | 5 HTML + 5 TXT gerados |
| PDF do anexo | `buildInvoiceData` + `generateInvoicePdf` | **4.201 bytes, header `%PDF-`** |
| Refusão de envio sem config | `preview-email.mjs --send` | Abortou com "configuração da Resend está incompleta" |

Rotas confirmadas no build:

```
ƒ /api/admin/emails      ƒ /api/email/outbox      ƒ /api/webhook/resend
ƒ /api/webhook/stripe    ƒ /api/stripe/cancel      ƒ /api/stripe/refund
```

### 4.3 Limitações — o que NÃO foi testado de verdade

**Estas limitações são reais e não devem ser lidas como "testado".**

1. **Nenhum e-mail foi enviado para um endereço real.** `RESEND_API_KEY` não está no ambiente local. O script de preview existe e **recusa enviar** sem a configuração completa — o que é o comportamento correto, e por isso não há evidência de entrega.
2. **Não houve compra real de ponta a ponta.** As rotas de notificação foram integradas e compiladas, mas o disparo via webhook Stripe não foi exercitado contra o painel ao vivo.
3. **O caminho de sucesso do worker não é coberto por teste unitário.** Um teste que "simulasse" a Resend verificaria o mock, não o código. O que os testes provam é o **contrato de falha** — que é o que pode dar errado sem ninguém perceber. O caminho de sucesso exige a API real.
4. **O webhook da Resend não foi exercitado com assinatura válida.** A verificação Svix está implementada e revisada, mas não foi testada contra um evento real.
5. **Os testes de compatibilidade de e-mail são estruturais** (ex.: *"todo degradê tem cor sólida de reserva"*). Eles provam a regra estrutural, **não** a renderização real no Outlook — isso exige cliente de e-mail de verdade.
6. **A migration não foi aplicada**, portanto o comportamento em produção da tabela nova ainda não existe.

---

## 5. OPERAÇÃO

### 5.1 Aplicar a migration

No SQL Editor do Supabase (ou `supabase db push`):

```bash
supabase/migrations/20261019130000_email_outbox.sql
```

Verificações que a migration imprime ao final:

| Consulta | Esperado |
|---|---|
| `SELECT ... FROM pg_indexes WHERE indexname='uniq_email_outbox_idempotency_key'` | `t` |
| `SELECT relrowsecurity FROM pg_class WHERE relname='email_outbox'` | `t` |
| `SELECT policyname FROM pg_policies WHERE tablename='email_outbox'` | apenas a policy `service_role` |

### 5.2 Variáveis de ambiente

Já cadastradas na Vercel para Production: `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RESEND_FROM_NAME`.

**Novas, necessárias:**

| Nome | Finalidade | Segreta | Exige redeploy |
|---|---|---|---|
| `RESEND_WEBHOOK_SECRET` | Assinatura do webhook de entrega. **Separada** do `STRIPE_WEBHOOK_SECRET` | **Sim** | Não (lida em runtime) |
| `EMAIL_CRON_SECRET` | Autoriza chamada manual ao worker por header `x-cron-secret` | **Sim** | Não |

Sem `RESEND_WEBHOOK_SECRET` a rota responde **503** e o status de entrega não é atualizado — por opção, não por esquecimento.

**Rotação recomendada:** a chave da Resend está em texto puro no `Corrigir.txt`. Gere uma nova no painel da Resend, atualize a Vercel e apague a do arquivo.

### 5.3 Cadastrar o webhook na Resend

Em **Resend → Webhooks → Add Webhook**:

| Campo | Valor |
|---|---|
| Eventos | `email.sent`, `email.delivered`, `email.delivery_delayed`, `email.bounced`, `email.complained`, `email.opened`, `email.clicked` |
| Endpoint | `https://www.voltris.com.br/api/webhook/resend` |

### 5.4 Como verificar os envios

1. **Resend → Emails**: filtro por `tag = template` (o worker aplica `template` e `payment`).
2. **No VOLTRIS**: `Painel admin → aba "E-mails"`. Cada linha mostra o estado do envio e, **separadamente**, o da entrega.

A distinção importa na hora de atender: `Aceito` sem `Entregue` é o caso de "cliente diz que não recebeu" — e é invisível se os dois estados forem um só.

### 5.5 Como identificar falhas

O painel mostra o motivo classificado. A decisão de repetir ou desistir já está tomada pelo sistema:

| `last_error_kind` | Significado | Ação |
|---|---|---|
| `CONFIG` | Falta chave ou remetente | O e-mail **não** foi tentado. Corrija a variável |
| `AUTH` | 401/403 | Chave inválida ou sem permissão. **Rotacione** |
| `SENDER` | 422 — remetente não autorizado | `RESEND_FROM_EMAIL` fora do domínio verificado |
| `RATE_LIMIT` | 429 | Reagendado automaticamente com `Retry-After` |
| `TIMEOUT` / `NETWORK` / `SERVER` | Transitório | Reagendado com backoff. A chave de idempotência evita duplicata |
| `VALIDATION` | Payload rejeitado | Dado inválido — revisar template ou destinatário |

Diagnóstico rápido sem sessão: `GET /api/email/outbox` com o header `x-cron-secret`.

Sinais de fila parada (vermelhos na aba admin):

- **"E-mail transacional desativado"** → configuração ausente; nenhuma compra se perde, tudo fica na fila;
- **"Fila de e-mail parada há N minutos"** → clique em **"Processar fila agora"**.

### 5.6 Como reenviar com segurança

Na aba **E-mails**, botão **"Reenviar"** em linhas `Na fila`, `Falhou` ou `Cancelado`. Botão **desaparece** em linhas `Aceito` — reenviar criaria duplicidade.

O reenvio enfileira uma nova linha com chave própria, marca a original como `canceled` com motivo, grava em `audit_logs` e **não apaga histórico**. Clique em "Processar fila agora" para enviar sem esperar o cron.

### 5.7 Como validar um PDF

1. **Anexo do e-mail** e **download no painel** saem do mesmo gerador — basta comparar os dois arquivos, devem ser equivalentes.
2. Confira: CNPJ da `VOLTRIS_CNPJ` (validado por dígito verificador — se inválido, o campo **sai omitido**, nunca com número errado), valor pago, validade, chave de licença.
3. Fuso fixo `America/Sao_Paulo` — a data não varia com o fuso da máquina que gerou.

### 5.8 Diagnóstico de problemas futuros

```bash
npm run preview:email                       # renderiza os 5 e-mails sem enviar
npm run preview:email -- seu@email.com      # envia de verdade (exige config)
npm run test:email                          # 120 testes de e-mail
GET /api/email/outbox                       # saúde da fila + config
```

---

## 6. COMO CADA REGRA FINAL FOI ATENDIDA

| # | Regra | Como |
|---|---|---|
| 1–2 | Só `voltris.com.br`, sem mexer no internacional | Escopo limitado aos arquivos de e-mail; nenhum arquivo do site internacional tocado |
| 3 | Não duplicar sistemas | Reutiliza `invoice-data`/`invoice-pdf`, o webhook Stripe e o painel existentes. `services/emailService.ts` virou *stub* que lança, com a justificativa escrita |
| 4 | Não apagar registros | Nenhum `DELETE`/`TRUNCATE`. Migration só cria |
| 5 | Sem SQL destrutivo | Só `CREATE ... IF NOT EXISTS` |
| 6 | Não comprometer a segurança do Supabase | RLS ligado **sem policy** para `authenticated` |
| 7 | Não quebrar o checkout Stripe | Nenhuma alteração no fluxo de criação de sessão; notificações são pós-confirmação |
| 8 | Não emitir licença sem pagamento | E-mail de compra só após `payment_status='paid'`; fatura exige status confirmado |
| 9 | Não emitir fatura inventada | PDF vem dos fatos do banco, nunca de dados de exemplo |
| 10 | Não enviar duplicados | Índice único + `idempotencyKey` na Resend |
| 11 | Sem marketing em massa | Só transacional; newsletter intocada |
| 12 | Não depender do e-mail para liberar a compra | Outbox transacional; notifier nunca lança |
| 13 | Não alterar a identidade visual | Mesma paleta do site |
| 14 | Sem credenciais em log | `scrubSecrets`; e-mail mascarado |
| 15 | Não marcar entregue sem confirmação | `status='sent'` e `delivery_status='delivered'` são colunas distintas |
| 16 | Sem operação financeira real em teste | Nenhum reembolso/cobrança executado; nenhum e-mail enviado |
| 17 | Não substituir o Auth | SMTP do Auth **não** foi tocado |
| 18 | Sem dependências desnecessárias | Só o SDK oficial da Resend; PDF reaproveitado |
| 19 | Respeitar limites do plano | `429` mapeado e respeitado; sem envio em massa |
| 20 | Não concluir sem validar | Seção 4.3 lista explicitamente o que **não** foi testado |

---

## 7. PENDÊNCIAS

Nada de código falta. São ações de configuração:

1. **Aplicar** `supabase/migrations/20261019130000_email_outbox.sql`.
2. **Rotacionar** `RESEND_API_KEY` (está em texto puro no `Corrigir.txt`) e atualizar a Vercel.
3. **Cadastrar** `RESEND_WEBHOOK_SECRET` e `EMAIL_CRON_SECRET` na Vercel.
4. **Registrar** o webhook da Resend com os 7 eventos de entrega.
5. **Fazer uma compra de teste** no modo de teste da Stripe e confirmar: licença emitida, e-mail recebido com PDF, status "Entregue" na aba admin.
6. **Opcional:** migrar o SMTP do Supabase Auth para o Resend (FASE 14) — decisão deliberadamente adiada, ver 1.4.

O cron em `vercel.json` roda a cada 5 minutos. **Requer plano da Vercel com cron.** Sem ele, nada quebra: o webhook drena a fila logo após enfileirar e o botão "Processar fila agora" cobre o resto. O cron é a garantia de que um e-mail pendente não fica parado.

---

*Nenhum valor secreto é reproduzido neste relatório.*
