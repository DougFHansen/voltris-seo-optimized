# RELATÓRIO — PAINEL ADMINISTRATIVO E RECUPERAÇÃO DE SENHA
## VOLTRIS BRASIL — `voltris.com.br`

**Partes do Corrigir.txt concluídas:** 1 (auditoria), 2 (visão geral), 3 (clientes), 10 (e-mails), 11 (segurança), 12–14 (recuperação de senha), 16 (integridade), 18 (performance), 19 (validação), 20 (relatório).
**Partes em andamento:** 4–9 (licenças, compras, assinaturas, reembolsos, dispositivos, faturas) — **descritas na §7 com o que já está pronto e o que falta.**

---

## 1. AUDITORIA

### Componentes existentes (reaproveitados, não recriados)

| Componente | Situação |
|---|---|
| `app/restricted-area-admin/` | 5 abas: Pedidos, Tickets, Newsletter, Usuários, E-mails |
| `/api/admin/deploys`, `/api/admin/reconcile`, `/api/admin/emails` | 3 rotas, todas com guarda própria |
| Webhook Stripe + emissor de licença | Funcionando (missão anterior) |
| Gerador de fatura PDF | `lib/invoice-pdf.ts` — **é o mesmo usado pelo cliente e pelo e-mail** |
| Outbox de e-mail | Código pronto, **tabela nunca aplicada em produção** |

### Problemas identificados e causas

**1. A regra de autorização estava duplicada em três lugares.**
`/api/admin/deploys`, `/api/admin/reconcile` e `/api/admin/emails` faziam cada uma a própria checagem de `profiles.is_admin`. Três consequências: uma correção de segurança valeria para uma rota e não para as outras; `is_blocked`/`is_deleted` eram ignorados por duas delas; e `reconcile` — a operação mais sensível do painel, capaz de alterar um pagamento — usava a implementação menos completa.

**2. `email_outbox` não existe no banco.**
Verificado por consulta direta:
```
404 - relation "public.email_outbox" does not exist
```
As migrations das missões anteriores foram entregues como arquivo e nunca aplicadas. Sem elas, a aba "E-mails" não tem o que ler.

**3. `profiles.role` existe mas nunca foi usado.**
A autorização era binária (`is_admin` sim/não), sem separação de responsabilidades.

**4. Nenhuma métrica de negócio existia.** O painel era CRUD de newsletter e tickets.

**5. Nenhum índice para as consultas que o painel precisa.** `licenses`, `payments`, `profiles` e `license_devices` não tinham índice por dono, plano, status ou chave.

### Verificações que|date(m不在|mudam) a conclusão

| Verificação | Resultado |
|---|---|
| Existe `middleware.ts`? | **Não.** O Problema A da Parte 13 não se aplica |
| `/auth/callback` trata recuperação? | **Não** — trata apenas OAuth (`exchangeCodeForSession`) |
| O logout estava quebrado? | **Não.** Ver §3 |

---

## 2. ADMINISTRAÇÃO

### 2.1 Segurança (Parte 11) — o núcleo de tudo

`lib/admin-auth.ts` centraliza a autorização. Antes havia três cópias; agora há uma, e ela é maior.

**Quatro papéis, princípio do menor privilégio:**

| Papel | Pode | Não pode |
|---|---|---|
| `leitura` | Consultar tudo | Alterar nada |
| `suporte` | Licenças, dispositivos, reenviar e-mail | **Reembolsar, alterar pagamento, conciliar** |
| `financeiro` | Reembolsar, alterar pagamento, conciliar | **Revogar licença, alterar dispositivos** |
| `superadmin` | Tudo, inclusive editar papéis | — |

Reembolso e revogação de licença estão em papéis **diferentes de propósito**: mexer no dinheiro e mexer no direito do cliente não deveriam ser a mesma pessoa.

**Outras garantias:**
- O papel vem do banco com `service_role`, no servidor. Não há caminho em que o frontend conceda acesso a si mesmo — verificado por teste que percorre os componentes do painel procurando escrita em `is_admin`/`role`.
- `is_blocked` e `is_deleted` negam acesso mesmo para admin. A rota de deploys era a única que não checava: **um admin desativado continuava vendo o registro de deploys.**
- **Compatibilidade:** admin com `is_admin=true` e `role` NULL é tratado como `superadmin`. Os admins de produção estão exatamente assim; exigir papel preenchido quebraria o painel inteiro no primeiro deploy.
- `auditAction` grava admin, recurso, ação, justificativa, estado anterior, estado posterior, resultado e correlação. **Nunca lança** — falhar a trilha de auditoria não desfaz uma ação já concluída no provedor.
- `scrubForAudit` redige `password`, `token`, `access_token`, `refresh_token`, `api_key`, `secret`, `authorization`, `otp` — inclusive aninhados e dentro de listas.

`/api/admin/deploys` e `/api/admin/reconcile` migraram para o helper. A reconciliação agora exige `reconcile.apply` para **aplicar** e `payments.read` para o **dry-run**: mostrar o que está pendente é leitura; alterar um pagamento não é.

### 2.2 Visão Geral (Parte 2)

`GET /api/admin/overview` + aba "Visão Geral".

Sete períodos, com o dia de referência em `America/Sao_Paulo`. **Com UTC, a partir das 21h o painel já mostraria o dia seguinte** e o total do dia viria errado.

| Regra da missão | Como foi atendida |
|---|---|
| Não confundir receita recebida com prevista | Bruta = só pagamentos **confirmados**. `pending` não entra |
| Receita líquida | Bruta menos o efetivamente reembolsado |
| MRR quando houver base elegível | Calculado sobre assinaturas **ativas com renovação ligada**. Somar "todo mês que entrou" contaria a primeira cobrança de uma assinatura já cancelada |
| Dados reais, sem invenção | `pendingConfirmation` vem **`null`**, não estimado: `auth.users` não é legível pela API e um número chutado é pior que um ausente declarado |
| Gráficos só com dados reais | **Nenhum gráfico.** Com o volume atual seriam decoração |

**Tabela ausente não derruba o painel:** o campo zera e a lista `unavailable` diz o que falta. Isso importa agora — `email_outbox` ainda não existe, então os números de e-mail aparecem em 0 com aviso explícito em vez de sumir.

### 2.3 Clientes (Parte 3)

`GET /api/admin/clients` + aba "Clientes" com ficha em 6 abas (visão geral, compras, licenças, assinaturas, dispositivos, faturas).

- **Paginação e filtro sempre no servidor.** A base cresce; carregar tudo quebra (Parte 18).
- **E-mail mascarado na lista, completo só na ficha.** O suporte precisa distinguir homônimos e o domínio já faz isso; o local do e-mail não tem ganho operacional numa listagem.
- **Nada é unido por e-mail.** Todas as contagens vêm de `user_id`, conforme a regra explícita.
- **Zero N+1:** uma consulta agregada de compras e uma de licenças para a página inteira.

### 2.4 `admin.sql`

Roteiro único e **aditivo**, como pedido. Nenhum `DROP TABLE`, `TRUNCATE`, `DELETE` ou `UPDATE` em tabela existente. RLS nunca desabilitada. Idempotente.

| Seção | Conteúdo |
|---|---|
| 1 | Migrations pendentes: fatos de cobrança em `payments`/`subscriptions` e a tabela `email_outbox` com RLS **sem policy para `authenticated`** |
| 2 | `admin_roles`, `admin_role_grants`, `admin_audit_log` |
| 3 | 20 índices para as listagens não virarem varredura |
| 4 | Nota sobre o papel dos admins existentes |

**Sobre `admin_audit_log`:** não substitui `audit_logs` — os dois são escritos. É uma projeção. O motivo é concreto: a Parte 11 exige estado anterior/posterior e resultado por ação, e esconder isso dentro de `metadata` impede o painel de filtrar por SQL.

---

## 3. RECUPERAÇÃO DE SENHA

### Por que o link apresentava erro

O link de recuperação do Supabase chega em **dois formatos**, e o projeto não tratava nenhum:

```
implícito  /reset-password#access_token=…&type=recovery
           O fragmento NUNCA é enviado ao servidor — só o navegador o vê.
pkce       /reset-password?code=…
```

`app/reset-password/page.tsx` renderizava um formulário e chamava `updateUser()` **na primeira vez que alguém clicava em "Redefinir"**. Não lia token nenhum, nos dois formatos.

Um link expirado chega como `#error=otp_expired&error_code=…`. Isso era engolido: o usuário via um formulário normal e só descobria a falha ao enviar. **Esse é o "erro que surge e impede concluir a redefinição".**

### Por que o site aparecia logado

**Não era sessão velha. Era sessão de recuperação.**

O supabase-js absorve o token do fragmento e abre sessão. É o comportamento **oficial** do Supabase, documentado, e exatamente o que a Parte 12 descreve como *"Sessão nova estabelecida legitimamente pelo link de recuperação"*.

Confundi-la com sessão antiga é o que leva à solução errada — forçar logout, que **destruiria a sessão necessária para trocar a senha**. A missão proíbe isso na Regra 17, e com razão: o `updateUser()` passaria a falhar.

### Qual código provocava

| Problema da Parte 13 | Situação |
|---|---|
| **A — Middleware** | Não se aplica: não existe `middleware.ts` neste projeto |
| **B — Callback incorreto** | **Confirmado.** `/auth/callback` só trata OAuth. Não é ele, porém, que recebe o link — o `redirectTo` aponta direto para `/reset-password` |
| **C — Estado inconsistente** | Parcial: era a sessão de recuperação, não cache antigo |
| **D — Erro invisível** | **Confirmado.** Erro do fragmento não lido; mensagem do Supabase em inglês crua |
| **E — Sessão incorreta** | **Confirmado.** O formulário aceitava submissão sem contexto de recuperação validado |

### Correção aplicada

**`lib/password-recovery.ts` (novo)** — a lógica fica fora do componente porque o Next não permite exportar funções de `page.tsx`, e assim ela fica testável sem navegador:

- `interpretRecoveryLink()` reconhece os dois formatos e **prioriza o erro explícito sobre o token**;
- normaliza `#` e `?` — a URL é fronteira de confiança; sem isso um link perfeito cairia em "link inválido";
- distingue `otp_expired` (expirado) de `otp_disabled` (configuração) — orientação ao usuário é diferente;
- `explainUpdateError()` traduz erros do Supabase em português **acionável**;
- `hasPasswordIdentity()` distingue conta Google de conta com senha local, **sem presumir e sem bloquear** quem legitimamente precisa definir uma senha.

**`app/reset-password/page.tsx` reescrito:**

- resolve o link nos dois formatos (`setSession` / `exchangeCodeForSession`);
- estado "Link inválido" com o motivo real e botão para pedir outro;
- **limpa o fragmento da URL após o uso** — sem isso o botão "voltar" do navegador reapresenta o token;
- requisitos de senha visíveis, mostrar/ocultar, comparação dos campos;
- botão só habilita com senha válida **E** confirmação;
- trata conta Google sem assumir senha local;
- `role="alert"` nas mensagens.

**Política de sessão (Parte 14):** o `signOut` vem **depois** do `updateUser`. Antes, destruiria a sessão que autoriza a troca. Depois, encerra a recuperação e leva ao login. Um teste garante a ordem.

### Como a sessão funciona depois

```
clicar no link → sessão de recuperação abre (comportamento oficial do Supabase)
              → tela "Criar nova senha" com o e-mail da conta VALIDADA PELO TOKEN
              → usuário troca a senha
              → confirmação na tela
              → signOut encerra a sessão de recuperação
              → redireciona para /login
```

A conta alvo é determinada pelo token, **nunca pelo e-mail digitado no navegador**.

### Como foi testado

44 testes novos em `tests/password-recovery.test.ts`, mais os 23 de `invoice-pdf-fixes.test.ts`.

O que eles travam, entre outros: os dois formatos de link; link expirado, inválido, ausente e reutilizado; prioridade do erro sobre o token; limite exato de 8 caracteres; campo vazio nunca "coincide"; conta Google não tem senha local; **`signOut` depois de `updateUser` na ordem do arquivo**; nenhuma chamada a `signup`, `signIn` ou insert em `profiles`.

---

## 4. FATURA PDF — 4 defeitos corrigidos

Observados em fatura gerada com dados reais:

| # | Defeito | Correção |
|---|---|---|
| 1 | O documento se contradizia: *"Mensal — assinatura recorrente"* e *"— (compra avulsa)"* | `billingLabel()` passou a receber `stripe_subscription_id`. Recorrência é propriedade da assinatura, não do período |
| 2 | ID da Stripe de 72 caracteres quebrava a linha em 4 partes, colidindo com a linha seguinte | `shortenRef()` — formato `prefixo…sufixo` |
| 3 | `licenses.client_id` existia e nunca era impresso; "ID do cliente" mostrava o CPF/CNPJ (nulo) | Passa a trazer o identificador interno; CPF/CNPJ vira linha própria |
| 4 | *"Período pago: — a 18/11/2026"* — travessão parecendo data | `periodEnd` só herda a validade quando existe `period_start`; o PDF formata "de X a Y", "até X", "a partir de X" ou "—" |

**Verificado:** `billingLabel = "Mensal — compra avulsa"`, `clientId = "797344"`, período `null..null`, PDF de 4.246 bytes com header `%PDF-`.

**Um ponto que não era bug:** a expiração da imagem (`18/10/2026, 21:00`) seemed anterior ao início da vigência. Rodando o formatador atual com o dado do banco: `18/11/2026, 21:00`. A imagem foi gerada **antes** da licença ser emitida com a validade correta.

---

## 5. EVIDÊNCIAS

### Validação executada

| Verificação | Resultado |
|---|---|
| `npm test` | **535 passando, 0 falhando** (442 anteriores + 93 novos) |
| `npx tsc --noEmit` | 0 erros nos arquivos tocados |
| `npx next build` | **exit 0** |
| Rotas `/api/admin` no build | 5, todas com guarda verificada |
| `admin.sql` | Sem `DROP TABLE`, `TRUNCATE`, `DELETE` ou `UPDATE` em tabela existente |

### Arquivos criados

```
lib/password-recovery.ts        lógica da recuperação (testável sem navegador)
lib/admin-auth.ts               RBAC, auditoria, rate limit
lib/admin-queries.ts            período, máscara, paginação, métricas
app/api/admin/overview/route.ts
app/api/admin/clients/route.ts
app/restricted-area-admin/overview/AdminOverviewTab.tsx
app/restricted-area-admin/clients/AdminClientsTab.tsx
tests/password-recovery.test.ts
tests/admin-security.test.ts
tests/invoice-pdf-fixes.test.ts
admin.sql
scripts/stubs/next-headers.mjs
scripts/preview-invoice-fix.mjs
```

### Arquivos modificados

```
app/reset-password/page.tsx     reescrito
app/api/admin/emails/route.ts   guarda → requireCapability
app/api/admin/deploys/route.ts  guarda inline → helper (corrige is_blocked)
app/api/admin/reconcile/route.ts guarda inline → helper (separa apply de dry-run)
lib/invoice-data.ts             billingLabel, periodEnd, client_id
lib/invoice-pdf.ts              shortenRef, período, ID do cliente
app/restricted-area-admin/page.tsx   abas Visão Geral e Clientes
scripts/alias-hooks.mjs         stub de next/headers
```

### Testes pendentes — declarados, não escondidos

A Parte 15 pede 25 cenários de recuperação e E2E com navegador. **O que não foi executado:**

| Cenário | Por quê |
|---|---|
| 2, 4, 12, 14, 15 — cookies, e-mail real, `updateUser` real, login posterior, senha antiga | Exigem caixa de e-mail e conta de teste. **Não fiz conta real nem enviei e-mail** |
| 18 — reutilização indevida do link | Exige token real do Supabase |
| 21 — ausência de redirecionamento infinito | Verificado por inspeção do código (não há loop), não em navegador |
| 23 — funcional em mobile | Verificado estruturalmente (`max-w-md`, `px-4`, `break-all`), não em dispositivo |
| E2E automatizado | **Não executado.** Não há Playwright/Cypress no projeto e não os instalei |

O que **foi** verificado: parsing dos quatro formatos de link, classificação de erro, regras de senha, identidade, ordem das operações e ausência de `signup`/`signIn`/`insert` — 44 testes.

### Configurações externas pendentes

**1. Redirect URLs do Supabase — a mais importante.**
Supabase → Auth → URL Configuration → Redirect URLs precisa conter:
```
https://www.voltris.com.br/reset-password
```
**Se não contiver, o Supabase ignora o `redirectTo` e manda o usuário para a Site URL, perdendo o token.** Não dá para verificar por API — essa tela só existe no painel. Enquanto não for conferida, o bug pode persistir **por um motivo que nenhum código corrige**.

**2. `CRON_SECRET`** na Vercel — sem ela o worker de e-mail fica fechado (por segurança).

**3. Aplicar `admin.sql`** — sem isso: `email_outbox` não existe (aba "E-mails" vazia), `cancel_at_period_end` não existe, e as métricas de assinatura ficam incompletas.

---

## 6. COMMITS LOCAIS NÃO ENVIADOS

Quatro commits prontos, aguardando o token do GitHub (ele saiu do `Corrigir.txt` quando a missão foi restaurada):

```
469043ac  fix(auth): recuperacao de senha + 4 defeitos da fatura PDF
55d49d44  feat(admin): RBAC, visao geral, clientes + admin.sql
559bc37 / ba00de02 / 469043ac — anteriores já no GitHub
```

Para enviar, cole o token no `Corrigir.txt` ou me passe diretamente.

---

## 7. PARTES 4 A 9 — O QUE FALTA

Não entregaram tudo. O que está pronto e o que falta, sem disfarçar:

| Parte | Situação |
|---|---|
| **4 — Licenças** | A **dados e filtros** já vêm pela ficha do cliente. Falta a aba dedicada com as ações (suspender, revogar, reemitir, alterar plano/validade) e a confirmação+auditoria da Parte 4 |
| **5 — Compras** | `/api/admin/reconcile` já é a ferramenta de diagnóstico e conciliação da parte, com dry-run obrigatório. Falta a listagem dedicada com filtros e exportação CSV |
| **6 — Assinaturas** | Falta a aba. `/api/stripe/cancel` e `/api/stripe/sync` já operam sobre a Stripe com re-leitura e confirmação |
| **7 — Reembolsos** | `refund_requests` já existe no banco e `/api/stripe/refund` executa reembolso real com idempotency key. Falta a tela de solicitações |
| **8 — Dispositivos** | `license_devices` populado e exibido na ficha do cliente. Falta a aba e a ação de desvincular com justificativa |
| **9 — Faturas** | O gerador e o download existem (`/api/billing/invoice`). Falta a listagem no admin |

O padrão já está pronto para as seis: `requireCapability`, `auditAction`, `paginate`, `sanitizeSearch`. São telas sobre a mesma camada.

---

## 8. FICHA DO CLIENTE VAZIA + CADASTRO INCOMPLETO (2026-10-19)

Duas perguntas do operador: *"por que as informações do usuário não aparecem
corretamente no modal?"* e *"no cadastro, tudo deve ser obrigatório"*.

### 8.1 Causa raiz (medida em produção, não estimada)

A migration `supabase/migrations/20260219000001_fix_function_search_path_security.sql`
redefiniu `public.handle_new_user()` para gravar **apenas** `id, email, full_name,
created_at, updated_at`. O formulário de cadastro continuava enviando `login`,
`phone`, `address`, `city`, `neighborhood`, `state`, `cep` em
`raw_user_meta_data` — o trigger simplesmente descartava.

Distribuição real dos 113 perfis na data:

| Campo | Antes de 2026-02-19 (11 perfis) | Depois (102 perfis) |
|---|---|---|
| `login` | 1/11 | **0/102** |
| `neighborhood` | 1/11 | **0/102** |
| `phone` / `city` / `state` / `cep` | ~6/11 | 47/102 (gravados por outros fluxos, ex.: checkout) |

Ou seja: **o dado nunca foi salvo** — não é bug de exibição. Não existe
"informação escondida" para recuperar: em `auth.users.raw_user_meta_data` só 23
dos 128 usuários têm `login` e 22 têm endereço (o resto entrou por OAuth ou
pelo checkout).

### 8.2 O que foi entregue

- **Modal da ficha**: passou a exibir `Login`, `Nome completo`, `Telefone`, `CEP`,
  `Endereço`, `Bairro`, `Cidade / UF` e `Situação`. O que falta aparece como
  **"Não informado"** (nunca mais travessão silencioso) e um aviso explica que
  o cadastro está incompleto e que o cliente pode completar em "Meu Perfil".
- **Cadastro obrigatório de verdade**: `lib/signup-rules.ts` centraliza as
  regras dos 3 passos. `login`, e-mail, senha, nome completo, WhatsApp, CEP,
  rua, número, **bairro**, cidade e UF são obrigatórios; os três passos são
  **revalidados no momento de criar a conta** (voltar e apagar um campo não
  escapa). O botão "Corrigir CEP / Digitar Manualmente" deixou de ser um beco
  sem saída (o endereço manual é aceito, com CEP de 8 dígitos).
- **Gravação do perfil**: o cadastro agora grava `login`, telefone, endereço,
  bairro, cidade, UF e CEP em `profiles` logo após o `signUp`, e detecta
  atualização silenciosa (RLS barrando / nenhuma linha alterada) em vez de
  fingir sucesso. Verificado ao vivo: a policy de UPDATE do próprio perfil
  funciona com sessão `authenticated` (PATCH do próprio usuário, mesmos
  valores, volta a linha).
- **`admin.sql` Seção 5**: recria `handle_new_user()` com todos os campos
  (`CREATE OR REPLACE`, `ON CONFLICT (id) DO NOTHING`, tratamento de `login`
  duplicado, `search_path` fixo). Corrige os **próximos** cadastros; **não
  faz backfill** — alterar linhas existentes em massa está fora do escopo da
  missão.

### 8.3 Como confirmar no ar

```bash
npm test                       # 660 testes, 0 falha
npx next build                 # exit 0
```

PUSH `46d28f81` → Vercel "Deployment has completed". Conferido no site:
`/_next/static/chunks/app/login/page-*.js` contém as novas regras;
`/_next/static/chunks/app/restricted-area-admin/page-*.js` contém o novo aviso
do modal; `GET /api/admin/clients?detail=<id>` devolve todos os campos;
`GET /api/admin/reconcile` (dry-run) devolve o efeito novo
`payments.status -> "approved" (+ paid_at se vazio)`.

### 8.4 Pendências (não resolvidas por código)

1. **Aplicar `admin.sql`** no SQL Editor do Supabase — a Seção 5 ainda não foi
   executada em produção. Até lá, o cadastro se sustenta na gravação do
   cliente, que já funciona, mas o trigger continua gravando só nome/e-mail.
2. **Cadastro social (Google)** não passa pelo formulário: essas contas
   continuam sem telefone/endereço. Se quiser, o próximo passo é uma etapa de
   complementação de perfil no primeiro acesso.
3. **Contas antigas** continuam incompletas — só o cliente pode completar em
   "Meu Perfil" (ou o operador, com revisão).
4. **Reconciliação ainda não aplicada**: Álvaro continua `pending` porque a
   conciliação exige ação explícita do operador (`RECONCILE-APPLY`) no painel.

---

## 9. CONTA SOCIAL SEM PERFIL + CONCILIAÇÃO APLICADA (2026-10-19)

### 9.1 Etapa de complementação para contas Google

Contas criadas pelo Google nunca passam pelo formulário: chegavam ao painel sem
`login`, telefone e endereço — e, com o trigger quebrado, sem `bairro` também.

- `lib/profile-completeness.ts` define a lista de campos (a **mesma** do
  cadastro) e quem é obrigado a completar:
  - conta social incompleta → **tem** de completar;
  - conta de e-mail → **não** é exigida retroativamente (quem já passou pelo
    formulário não é punido);
  - administrador → **não** fica preso no formulário (a equipe não pode ser
    trancada; a ficha do painel continua mostrando o que falta).
- `/perfil` deixou de ser só "editar dados": agora exige `login` e `bairro`
  também, consulta o CEP real, checa disponibilidade de usuário/WhatsApp, valida
  com as **mesmas** regras do cadastro (`lib/signup-rules.ts`) e detecta
  gravação silenciosa (update sem erro e sem linha = erro na tela).
- `AuthGuard` leva a conta social incompleta para `/perfil?force=1&redirect=…` e
  não renderiza a página protegida até a complementação.
- `app/auth/callback/route.ts` passou a usar a **mesma** regra (antes checava
  `phone/city/state/cep` e ignorava `login`/`neighborhood`).

### 9.2 Reconciliação: Álvaro liquidado

Com a autorização explícita do operador, foi aplicada **apenas** a linha do
Álvaro (`refs: ["st_1792253655757"]`), com a frase `RECONCILE-APPLY`:

| Campo | Antes | Depois |
|---|---|---|
| `payments.status` | `pending` | **`approved`** |
| `payments.stripe_id` | `null` | `cs_live_a13KrZUFcNHTn6AMLeVoj28b7uYa5c12Pz1RK4wwaxexdR1ugJwiYuNP7T` |
| `payments.paid_at` | `null` | `2026-10-19T13:27:52.457+00:00` |
| `subscriptions.status` | `ACTIVE` | `ACTIVE` (com `next_billing_at` = 2026-11-17T16:15:41Z, vindo da Stripe) |
| `licenses` | `VOLTRIS-PRO-257682-20261117-21E5A428FFBF67C4` | intacta, não revogada |

O restante do relatório (22 `MARK_UNPAID`, 3 `EMIT_LICENSE`, 1 `NEEDS_MANUAL`)
continua **sem aplicar**: é decisão do operador.

### 9.3 Verificação

```
npm test        -> 680 testes, 0 falha
npx next build  -> exit 0
```

Push `69b9e021` → Vercel "Deployment has completed". Conferido no ar:
`/perfil` serve o formulário novo (campos `login`/`bairro`, consulta de CEP e de
disponibilidade) e o chunk do `/dashboard` contém o desvio para
`/perfil?force=1&redirect=`.

---

## 10. TRAVA DE CADASTRO DUPLICADO — EXISTIA NO CÓDIGO, MAS NUNCA FUNCIONOU (2026-10-19)

Pergunta do operador: *"no cadastro, foi feito a opção de não poder cadastrar com
um telefone/e-mail já cadastrado?"*. A resposta honesta: **as travas estavam
escritas, mas não funcionavam — nenhuma das três.**

### 10.1 Os três defeitos (medidos, não estimados)

**(a) O endpoint respondia "disponível" para tudo.**
O código chamava `auth.admin.getUserByEmail(...)` — método que **não existe**
no `@supabase/supabase-js` 2.50.3 (`getUserById`, `listUsers`, `createUser`,
`generateLink`… é o que existe). A chamada estourava `TypeError` e caía no
`catch`, que devolvia `{ available: true }`. Como o cadastro **sempre** envia
e-mail, o endpoint respondia "disponível" em 100% dos casos — inclusive quando
o e-mail, o usuário e o WhatsApp já existiam.

**(b) A trava de telefone comparava a coisa errada.**
```
or=(phone.eq.37998127122, phone.ilike.*37998127122*)
```
contra o telefone **formatado** do banco, `"(37) 99812-7122"`. O hífen quebra
a sequência de dígitos: as duas variantes devolvem **0 linhas**. Testado no ar
com o número do Álvaro: 0 candidatos para os dois filtros.

**(c) A falha era ABERTA.**
O `catch` devolvia `available: true` — "não consegui verificar" virava "pode
cadastrar". Como o WhatsApp **não tem restrição no banco**, essa falha
aberta produzia duplicatas sem ninguém perceber.

**Consequência real no banco:** `11996716235` está em **3 contas**
(`voltris tecnologia` — e-mail nulo, `douglas felipe moraes gonçalves` — a conta
do operador, e `upgrademu upgrade`). E-mail e usuário: 0 duplicatas (o UNIQUE
do Auth e o índice único de `profiles.login` seguram a barra — mas só depois
de o usuário tentar, com mensagem crua).

### 10.2 O que foi corrigido

- `lib/phone-dup.ts`: normalização do número (só dígitos, sem DDI 55, sem zero à
  esquerda), comparação exata e padrões de busca que casam com **qualquer**
  formatação (o hífen deixa de atrapalhar).
- O endpoint compara o número normalizado e traz candidatos por padrão antes
  de decidir; o filtro por texto com dígitos saiu.
- E-mail conferido em `profiles` **e** em `auth.users` (`listUsers` com cache de
  60s e limite de 10 páginas); `getUserByEmail` saiu.
- Usuário conferido sem o bug do `maybeSingle` (várias linhas = conflito).
- A própria conta é excluída pelo **token** da requisição — nunca pelo corpo
  (senão bastaria mandar o id da vítima para burlar a trava).
- Falha **fechada** (HTTP 503) em vez de "disponível".
- O cadastro revalida e-mail, usuário e WhatsApp **antes** de criar a conta.
- `admin.sql` Seção 6: coluna `phone_normalized` (acelerador opcional, com o
  backfill comentado para revisão manual — a aplicação não depende dela).

### 10.3 Verificação no ar (endpoint novo, deploy `a92831f9`)

| Consulta | Resultado |
|---|---|
| `{phone: "(37) 99812-7122"}` | `available:false` — "já está em uso: WhatsApp" |
| `{phone: "37998127122"}` (sem formatação) | `available:false` — "WhatsApp" |
| `{email: "alvaroaraujodxd@gmail.com"}` | `available:false` — "e-mail" |
| `{login: "Douglas Felipe"}` | `available:false` — "usuário" |
| dados novos | `available:true` |
| `{login, email}` **com o token do dono** | `available:true` (não conflita consigo mesmo) |
| `{login, email}` **sem token** | `available:false` |

```
npm test -> 697 testes, 0 falha
```

### 10.4 Pendência de dado (decisão do operador)

As 3 contas com o WhatsApp `11996716235` continuam lá. **Não apaguei nem
bloqueei nada**: decidir qual conta é a legítima (e o que fazer com as outras)
é decisão de negócio. A trava impede novas duplicatas a partir de agora; o
passado só sai com uma ação explícita no painel.

---

## 11. PAINEL COM A CARA DO DASHBOARD + NOTIFICAÇÕES COMPLETAS (2026-10-19)

### 11.1 Design: o painel passou a ser o dashboard

O admin usava `react-icons/fi` monocromos, cards `rounded-xl bg-slate-900/60` e
chips retangulares — o dashboard usava `VoltrisIcon` com ícone colorido por
aba, cards `rounded-2xl bg-slate-900/50` e pílulas arredondadas. Agora são a
**mesma interface** em dois níveis de acesso:

- sidebar com o sistema de menu do dashboard (`.vtab` + `.vtab__ico`, cor por
  aba via `--vtab-color`, trilho lateral e pílula de gradiente no item ativo);
- mesmo fundo (`bg-[#0a0a0f]`, gradiente radial e grade de 60px) e a mesma
  lateral (`bg-[#12121A]`, `border-white/5`);
- cards, tabelas, cabeçalhos, chips e botões das 11 abas no padrão do
  dashboard;
- kit compartilhado `app/restricted-area-admin/_ui.tsx` (Card, StatCard,
  Table, Chip, Button, Filtros e os estados de carregamento/erro/vazio).

### 11.2 Notificações: o que estava quebrado (medido)

| Defeito | Efeito |
|---|---|
| `notifications` nunca foi publicada no `supabase_realtime` | o sino só atualizava ao recarregar a página |
| não havia policy de **UPDATE** nem de **DELETE** | "marcar como lida" e "limpar todas" mentiam: a tela mudava, o banco não |
| a policy de **INSERT** deixava o cliente forjar aviso | notificação falsa no próprio sino |
| as triggers de status gravavam em colunas inexistentes (`body`, `data`) e com enum inválido | admin respondia um ticket e o cliente **não era notificado** — sem erro nenhum |
| nenhuma compra, renovação, falha de pagamento ou reembolso gerava notificação in-app | só e-mail |
| não existia tela de notificações no painel | o admin recebia alerta e não tinha onde ver |

### 11.3 O que foi entregue

- **Vocabulário único** (`lib/notification-kinds.ts`): cada tipo de negócio
  (compra, licença, serviço, ticket, reembolso…) tem um tipo "refinado" e um
  tipo "base". O app **detecta em runtime** o que o banco aceita e funciona
  ANTES e DEPOIS de `notificacaocorrigida.sql` — nunca deixa de notificar.
- **Isolamento garantido no servidor**: `/api/notifications` filtra por
  `user_id` da **sessão** (o corpo da requisição nunca escolhe o dono) para
  listar, marcar lida e limpar. Um usuário não vê nem toca na notificação de
  outro. O admin tem rota própria (`/api/admin/notifications`) com
  `requireCapability` + auditoria, e vê o movimento completo (compras, pedidos,
  tickets, reembolsos) com e-mail mascarado.
- **Eventos que agora notificam** (cliente **e** admin): compra/licença
  emitida, renovação, pagamento recusado, pedido de serviço, chamado aberto,
  resposta do suporte, reembolso (solicitado / em processamento / confirmado).
- **"Responder" no painel de Tickets**: o texto vai para a Central de Suporte
  do cliente e vira notificação no sino dele.
- **Cliente reescrito**: leitura pela API do servidor, Realtime (com fallback
  de polling de 45s), notificação do navegador (com Service Worker, que é o
  caminho que funciona no Android/iOS), som respeitando as preferências,
  toast para todo tipo, e sino/central de notificações no estilo do dashboard
  e responsivos.
- **`notificacaocorrigida.sql`**: arquivo para você aplicar no Supabase
  (policies, realtime, enums, colunas, índices e as triggers corrigidas — que
  ignoram a mudança vinda do painel para o cliente não receber a notícia em
  duplicidade).

### 11.4 Verificação no ar

| Teste | Resultado |
|---|---|
| `GET /api/notifications` sem sessão | 401 |
| `GET /api/admin/notifications` sem sessão | 401 |
| `GET /api/notifications` com a sessão do Alvaro | 1 notificação (a dele) |
| `GET /api/notifications` com a sessão do admin | 9 notificações (as dele) |
| `GET /api/admin/notifications` com a sessão do admin | 11 notificações, e-mail mascarado (`a…d@gmail.com`) |
| Resumo do painel | `{porTipo:{order:9,ticket:2}, naoLidas:2, total:11}` |
| Marcar como lida | `read:false → read:true` **persistido no banco** (antes não persistia) e revertido depois do teste |

```
npm test -> 740 testes, 0 falha
npx next build -> exit 0
```

### 11.5 Pendências (não são código)

1. **Aplicar `notificacaocorrigida.sql`** no SQL Editor do Supabase. Sem ele:
   o Realtime não dispara (o polling de 45s cobre), os tipos refinados não
   existem e as notificações não têm link de navegação (`action_url`).
2. **Web Push (notificação com o app fechado)**: precisa de
   `NEXT_PUBLIC_VAPID_PUBLIC_KEY` e `VAPID_PRIVATE_KEY` na Vercel. Sem elas o
   sistema avisa no-app, no toast e na notificação do navegador (com a aba
   aberta) — e o botão de push se mantém desligado em vez de fingir.
3. Aplicar também `admin.sql` (Seções 5 e 6) e `notificacaocorrigida.sql` na
   mesma janela, para o cadastro e as notificações ficarem completos.

---

*Nenhum valor secreto é reproduzido neste relatório.*
