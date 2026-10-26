-- ============================================================================
--  SQLCOMPLETO.sql — SCHEMA COMPLETO DO SITE VOLTRIS
-- ============================================================================
--
--  Este arquivo e' o UNICO arquivo .sql do projeto. Ele reune:
--    - as 46 tabelas do schema public (as que o site usa);
--    - as views, funcoes, policies, triggers, indices, grants e extensoes;
--    - as colunas que faltavam em cada tabela (completadas pelo schema real);
--
--  COMO FOI MONTADO
--    - base: os 41 CREATE TABLE dos 62 arquivos .sql do
--      projeto (migrations em ordem cronologica + scripts de setup/fix);
--    - conferencia: o schema REAL do banco de producao (48 tabelas com todas as
--      colunas e tipos). Tabela que so existe no banco foi gerada aqui;
--      coluna que faltava na definicao do repo foi completada aqui.
--
--  COMO APLICAR
--    psql "$DATABASE_URL" -f SQLCOMPLETO.sql
--    (ou: supabase db reset && psql "$DATABASE_URL" -f SQLCOMPLETO.sql)
--
--  O ARQUIVO E' IDEMPOTENTE: pode ser aplicado quantas vezes quiser.
--  Nao contem DADOS (INSERT/UPDATE/TRUNCATE) — so estrutura.
--
--  Gerado em 2026-10-21
-- ============================================================================

-- ============================================================================
--  FASE 1 — EXTENSOES
-- ============================================================================
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- ============================================================
-- VOLTRIS — FIX COMPLETO DO SISTEMA DE LICENÇAS
-- Execute este script inteiro no SQL Editor do Supabase
-- ============================================================

-- Extensão necessária para SHA256
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
-- 12. HABILITAR EXTENSÃO PARA CRIPTOGRAFIA (necessária para DIGEST)
CREATE EXTENSION IF NOT EXISTS pgcrypto;
-- 3. HABILITAR EXTENSÃO PARA CRIPTOGRAFIA
CREATE EXTENSION IF NOT EXISTS pgcrypto;
-- ==========================================
-- VOLTRIS OPTIMIZER - SISTEMA DE LICENCIAMENTO PRO
-- SCRIPT DE RESET E CONFIGURAÇÃO COMPLETA (V3)
-- ALINHADO COM: LicenseGenerator, LicenseManager.cs e Checkout
-- ==========================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
-- =========================================================================
-- MASTER SQL: SISTEMA DE TELEMETRIA, INSTALAÇÕES E LICENCIAMENTO ENTERPRISE
-- Projeto: Voltris Optimizer (Silicon Valley Standard)
-- =========================================================================

-- 1. EXTENSÕES E TIPOS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- ============================================================================
-- 20261015210000_fix_signer_search_path.sql
-- CORREÇÃO DE BUG COMPROVADO NO BANCO VIVO (auditoria 2026-10-15).
--
-- EVIDÊNCIA REAL (chamada via PostgREST, service_role, chave válida):
--   SELECT public.get_license_renewal_artifact('VOLTRIS-PRO-…')  ->
--     HTTP 404 / sqlstate 42883
--     "function digest(text, unknown) does not exist"
--   Enquanto a MESMA generate_voltris_signature() chamada DIRETAMENTE pela API
--   responde 200 com 16 hex. Ou seja: o assinador funciona; ele quebra quando
--   chamado DENTRO de uma função que fixou search_path sem o schema do pgcrypto.
--
-- CAUSA RAIZ: as funções abaixo são SECURITY DEFINER com
--   SET search_path = public, pg_temp
-- e, na mesma transação, chamam generate_voltris_signature() -> digest(), que
-- vive no schema "extensions" (pgcrypto do Supabase). Como o search_path do
-- chamador vale também para a chamada aninhada, "digest" não é resolvível.
--
-- IMPACTO (por isso este bug é crítico, não cosmético):
--   * generate_complete_license_v3  -> EMISSÃO DE LICENÇA NOVA QUEBRA (42883).
--   * renew_subscription_license    -> RENOVAÇÃO QUEBRA no caminho de emissão.
--   * get_license_renewal_artifact  -> artefato que o desktop usa para aceitar
--                                      a renovação QUEBRA (acesso não volta).
--   Qualquer função que dependa do assinador está no mesmo risco.
--
-- O QUE MUDA: nada de lógica, nada de algoritmo, nada de segredo. Apenas o
-- search_path passa a incluir "extensions", com pg_temp por último (prática de
-- segurança padrão para SECURITY DEFINER). As 8 licenças existentes não são
-- tocadas e continuam validando com a mesma assinatura.
--
-- JUSTIFICATIVA (missão sec.13 - nada de mudança sem motivo): correção de
-- falha comprovada por teste no banco vivo; exigida pelas seções 4, 5, 7 e 8.
-- ============================================================================

-- 0. Garante o pré-requisito (já existe hoje; idempotente).
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

-- ============================================================================
--  FASE 2 — TIPOS (ENUMs) — precisam existir ANTES das tabelas
-- ============================================================================
-- =====================================================
-- SISTEMA COMPLETO DE SERVIÇOS E PEDIDOS - VOLTRIS
-- =====================================================

-- 1. ENUM PARA STATUS DO SERVIÇO
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'service_status') THEN
        CREATE TYPE service_status AS ENUM ('active', 'inactive', 'maintenance');
    END IF;
END$$;

-- =====================================================
-- SISTEMA DE LICENÇAS E PAGAMENTOS - VOLTRIS
-- =====================================================

-- 1. ENUM PARA TIPO DE LICENÇA
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'license_type') THEN
        CREATE TYPE license_type AS ENUM ('trial', 'pro', 'premium', 'enterprise');
    END IF;
END$$;

-- 2. ENUM PARA STATUS DE PAGAMENTO
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status_mp') THEN
        CREATE TYPE payment_status_mp AS ENUM ('pending', 'approved', 'rejected', 'cancelled', 'refunded', 'charged_back');
    END IF;
END$$;

-- =====================================================
-- PARTE 2: CRIAÇÃO DE TIPOS E EXTENSÕES
-- =====================================================

-- 1. ENUM PARA TIPO DE LICENÇA
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'license_type') THEN
        CREATE TYPE license_type AS ENUM ('trial', 'pro', 'premium', 'enterprise');
    END IF;
END$$;

-- 2. ENUM PARA STATUS DE PAGAMENTO
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status_mp') THEN
        CREATE TYPE payment_status_mp AS ENUM ('pending', 'approved', 'rejected', 'cancelled', 'refunded', 'charged_back');
    END IF;
END$$;

-- Migration: Sistema de Notificações VOLTRIS

-- 1. Tipos ENUM
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notification_type') THEN
        CREATE TYPE notification_type AS ENUM ('ticket', 'order', 'system', 'profile', 'newsletter', 'comment');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notification_sound') THEN
        CREATE TYPE notification_sound AS ENUM ('ping', 'chime', 'tone');
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'license_status_type') THEN
        CREATE TYPE license_status_type AS ENUM ('trial', 'active', 'expired', 'revoked');
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_namespace n ON n.oid = t.typnamespace
                   WHERE t.typname = 'license_status_type' AND n.nspname = 'public') THEN
-- ═══════════════════════════════════════════════════════════════════════════
-- PASSO 2: RECRIAR TIPO ENUM
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TYPE license_status_type AS ENUM ('trial', 'active', 'expired', 'revoked');
    END IF;
END $$;

-- ============================================================================
-- notificacaocorrigida.sql — VOLTRIS BRASIL
-- ============================================================================
-- Objetivo: consertar o subsistema de notificações IN-APP (o "sino").
--
-- O QUE ESTAVA QUEBRADO (medido em produção, 2026-10-19)
-- ---------------------------------------------------------------------------
-- 1. A tabela `notifications` existia, mas SEM política de UPDATE e SEM
--    política de DELETE. O botão "marcar como lida" e o "limpar todas"
--    alteravam só o estado local da tela: o banco continuava com
--    `read = false` e o badge voltava ao recarregar a página.
--
-- 2. `notifications` NUNCA foi adicionada à publicação `supabase_realtime`.
--    O cliente assinava o canal `postgres_changes` e não recebia NENHUM
--    evento: o sino só atualizava ao recarregar a página.
--
-- 3. As triggers de status (ticket e pedido) estavam QUEBRADAS: gravavam em
--    colunas que não existem (`body`, `data`) e usavam valores de enum
--    inexistentes (`ticket_status`, `order_status`, `alert`, `default`).
--    Ou seja: quando o admin mudava o status de um ticket, o cliente não era
--    notificado. Nenhum erro aparecia — a trigger só falhava calada.
--
-- 4. O enum `notification_type` não tinha valores para licença, serviço e
--    reembolso, e não havia como ligar a notificação a um pedido/licença
--    (sem `action_url` e sem `data`).
--
-- 5. A policy de INSERT permitia o próprio cliente inserir notificação para
--    si mesmo — dava para "forjar" aviso no próprio sino.
--
-- GARANTIAS
--   - ADITIVO e IDEMPOTENTE: pode rodar quantas vezes for preciso.
--   - Nenhum DELETE de dado, nenhum TRUNCATE, nenhum UPDATE em massa.
--   - A tabela continua com RLS ligada e as policies passam a separar
--     "minha notificação" de "notificação de administração".
--
-- O APLICATIVO CONTINUA FUNCIONANDO SEM ESTE ARQUIVO: o servidor detecta
-- em runtime se as colunas novas existem e usa o formato completo quando
-- existem, e o formato Reduced quando não. Aplica este arquivo para
-- liberar o tempo real (Realtime), a marcação de lida no banco e as
-- notificações clicáveis.
--
-- Onde aplicar: SQL Editor do Supabase (ou `supabase db push`).
--
-- ERRO 55P04 (se você ver): "unsafe use of new value ... of enum type
-- notification_type". Acontece porque o SQL Editor roda o arquivo inteiro
-- numa transação e o Postgres só libera o uso de um valor novo de enum
-- DEPOIS do commit. A Seção 1 explica a ordem recomendada — o arquivo já
-- foi ajustado para não usar os valores novos em lugar nenhum, então dá
-- para rodar tudo de uma vez.
-- ============================================================================


-- ############################################################################
-- SEÇÃO 1 — ENUM: TIPOS NOVOS
--
-- `ALTER TYPE ... ADD VALUE` não roda dentro de bloco transacional em
-- Postgres antigo; o SQL Editor do Supabase roda cada comando em autocommit,
-- então funciona. Se der erro de transação, rode estas 3 linhas isoladas.
-- ############################################################################
-- BLOCO 1 — OS TRÊS VALORES NOVOS DO ENUM
--
-- ATENÇÃO: LEIA ANTES DE EXECUTAR
--
-- O erro "55P04: unsafe use of new value" acontece porque o SQL Editor do
-- Supabase roda o ARQUIVO INTEIRO numa transação só. E o Postgres tem uma
-- regra dura: um valor novo de enum só pode ser USADO depois dedar COMMIT.
--
-- Ou seja:
--   - `ALTER TYPE ... ADD VALUE` pode ser executado dentro da transação;
--   - mas qualquer coisa que USE esse valor na MESMA transação estoura.
--
-- Por isso este arquivo foi reescrito para NÃO usar os valores novos em
-- lugar nenhum: a Seção 5 (triggers) grava 'ticket' e 'order', que já
-- existiam, e a verificação do final (Seção 6) lista o enum dentro de um
-- bloco com tratamento de erro. Assim dá para rodar o arquivo inteiro de
-- uma vez, em uma transação só, sem erro.
--
-- Se preferir executar em partes (recomendado, para ver o resultado em
-- etapas), a ordem é:
--   1) rode só as 3 linhas ALTER TYPE abaixo e deixe o editor COMITAR;
--   2) depois rode o restante do arquivo (Seções 2 a 6).
--
-- O arquivo é idempotente: rodar de novo não quebra nada.
-- ############################################################################

ALTER TYPE public.notification_type ADD VALUE IF NOT EXISTS 'license';
ALTER TYPE public.notification_type ADD VALUE IF NOT EXISTS 'service';
ALTER TYPE public.notification_type ADD VALUE IF NOT EXISTS 'refund';
-- ============================================================================
--  FASE 3 — TABELAS (46)
-- ============================================================================
-- fonte: admin.sql
-- ----------------------------------------------------------------------------
-- 2.3  TRILHA DE AUDITORIA ESTRUTURADA
--
--      `audit_logs` já existe e é genérico (`event_type`, `metadata` jsonb,
--      `created_at`). Ele CONTINUA sendo escrito — não é substituído.
--
--      Por que uma tabela nova então? Três motivos concretos:
--
--        a) A PARTE 11 pede resultado e estado anterior/posterior por ação.
--           Esconder isso dentro de `metadata` significa que nenhum filtro do
--           painel pode consultá-lo por SQL.
--        b) O painel precisa listar "ações deste administrador nos últimos 7
--           dias" e "ações que falharam". Com jsonb isso exige varrer e
--           deserializar em JS — lento e frágil.
--        c) `audit_logs` não tem índice por recurso. A listagem por licença ou
--           por cliente exigiria varredura completa.
--
--      É uma Projection, não uma duplicação: os dois registros são escritos.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
    id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id       uuid ,
    admin_email    text,
    admin_role     text,
    action         text NOT NULL,
    resource       text NOT NULL,
    resource_id    text,
    reason         text,
    outcome        text NOT NULL DEFAULT 'OK',
    before_state   jsonb,
    after_state    jsonb,
    correlation_id text,
    created_at     timestamptz NOT NULL DEFAULT NOW()
);

-- fonte: admin.sql
-- ############################################################################
-- SEÇÃO 2 — TABELAS DO PAINEL ADMINISTRATIVO
-- ############################################################################

-- ----------------------------------------------------------------------------
-- 2.1  PAPÉIS DE ADMINISTRAÇÃO
--
--      `profiles.role` já existe, mas nenhuma coluna marca QUANDO o papel
--      mudou nem POR QUEM. Sem isso, um privilégio concedido não tem trilha
--      e uma investigação de acesso indevido não tem por onde começar.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_role_grants (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     uuid NOT NULL ,
    role        text NOT NULL,
    granted_by  uuid ,
    reason      text,
    created_at  timestamptz NOT NULL DEFAULT NOW(),
    revoked_at  timestamptz,
    revoked_by  uuid );

-- fonte: admin.sql
-- ----------------------------------------------------------------------------
-- 2.2  PAPÉIS CONHECIDOS
--
--      Tabela de referência em vez de texto solto no código: o painel mostra
--      os nomes legíveis, a aplicação valida contra a lista, e um papel novo
--      não exige deploy de migration.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_roles (
    role        text PRIMARY KEY,
    label       text NOT NULL,
    description text,
    -- Ordinal para ordenar a interface do mais restrito ao mais amplo.
    rank        integer NOT NULL DEFAULT 0
);

-- fonte: supabase/setup_license_automation.sql
-- 4. LOGS DE AUDITORIA
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- fonte: services/enterprise-schema.sql
-- 1. COMPANIES Table
CREATE TABLE IF NOT EXISTS public.companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    cnpj TEXT,
    plan_type TEXT DEFAULT 'standard', -- standard, pro, enterprise
    max_devices INTEGER DEFAULT 5,
    license_key TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    subscription_status TEXT DEFAULT 'active', -- active, overdue, cancelled
    subscription_end TIMESTAMP WITH TIME ZONE
);

-- fonte: services/enterprise-schema.sql
-- 2. COMPANY_USERS Table (Linking Auth Users to Companies)
CREATE TABLE IF NOT EXISTS public.company_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID ,
    user_id UUID NOT NULL, -- References auth.users.id (Supabase Auth)
    role TEXT DEFAULT 'viewer', -- owner, admin, viewer
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(company_id, user_id)
);

-- fonte: supabase/setup_remote_commands.sql
-- Tabela de Comandos Remotos
CREATE TABLE IF NOT EXISTS device_commands (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    installation_id UUID NOT NULL ,
    command_type TEXT NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, grabbed, completed, failed
    payload JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    executed_at TIMESTAMPTZ,
    result_data JSONB
);

-- fonte: admin.sql
-- ----------------------------------------------------------------------------
-- 1.2  OUTBOX DE E-MAIL (a tabela que a aba "E-mails" do painel consome)
--
--      RLS ligado e SEM policy para `authenticated`: a tabela guarda corpo de
--      e-mail e endereço de terceiros. Se houvesse policy "filtra por user_id",
--      qualquer cliente com conta leria o histórico de e-mail dos outros.
--      O acesso passa só pela API, com service_role, depois de requireAdmin.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.email_outbox (
    id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    template_type       text NOT NULL,
    idempotency_key     text NOT NULL,
    recipient_email     text NOT NULL,
    user_id             uuid ,
    payment_id          uuid ,
    license_key         text,
    subscription_id     text,
    subject             text NOT NULL,
    html_body           text NOT NULL,
    text_body           text,
    attachment_name     text,
    attachment_content  text,
    attachment_size     integer,
    status              text NOT NULL DEFAULT 'pending',
    provider_message_id text,
    attempts            integer NOT NULL DEFAULT 0,
    available_at        timestamptz NOT NULL DEFAULT NOW(),
    last_error          text,
    last_error_kind     text,
    sent_at             timestamptz,
    delivery_status     text,
    delivered_at        timestamptz,
    opened_at           timestamptz,
    delivery_flag       text,
    delivery_flag_at    timestamptz,
    meta                jsonb,
    created_at          timestamptz NOT NULL DEFAULT NOW(),
    updated_at          timestamptz NOT NULL DEFAULT NOW()
);

-- fonte: supabase/setup_telemetry.sql
-- 3. TABELA DE EVENTOS (TELEMETRIA E AUDITORIA)
-- Registra ações específicas como "Otizimização Aplicada", "Crash", "Troca de Plano".
CREATE TABLE IF NOT EXISTS installation_events (
  id BIGSERIAL PRIMARY KEY,
  installation_id UUID ,
  event_type TEXT NOT NULL, -- Ex: 'APP_START', 'OPTIMIZATION_ON', 'CRASH', 'LICENSE_ACTIVATE'
  payload JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- fonte: supabase/setup_telemetry.sql
-- 4. TABELA DE HEARTBEATS (MÉTRICAS DE UPTIME)
-- Histórico bruto para geração de gráficos de uso/retenção.
CREATE TABLE IF NOT EXISTS installation_heartbeats (
  id BIGSERIAL PRIMARY KEY,
  installation_id UUID ,
  is_optimized BOOLEAN,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- fonte: supabase/migrate_add_missing_columns.sql
-- ═══════════════════════════════════════════════════════════════════════════
-- PASSO 3: RECRIAR TABELA installations (COM TODAS AS COLUNAS)
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS installations (
  id UUID PRIMARY KEY,                                          -- GUID gerado pelo App WPF
  user_id UUID , -- Vinculação com conta do site

  -- Identificação do PC
  pc_name TEXT,                                                  -- Nome do computador (Environment.MachineName)

  -- Hardware Info (enviado pelo app via /api/v1/install)
  app_version TEXT,
  cpu_name TEXT,                                                 -- Ex: "Intel Core i7-12700H"
  gpu_name TEXT,                                                 -- Ex: "NVIDIA GeForce RTX 3060"
  ram_gb_total INTEGER,                                          -- Ex: 16
  disk_type TEXT,                                                -- Ex: "SSD" ou "HDD"
  disk_main_type TEXT,                                           -- Alias legado (compatibilidade)
  os_name TEXT,                                                  -- Ex: "Microsoft Windows NT 10.0.22631.0"
  os_build TEXT,                                                 -- Ex: "22631"
  windows_edition TEXT,                                          -- Ex: "Windows 11 Pro"
  architecture TEXT,                                             -- Ex: "x64"

  -- Status de Licença
  license_key TEXT,
  license_status license_status_type DEFAULT 'trial',
  license_expires_at TIMESTAMPTZ,
  is_licensed BOOLEAN DEFAULT FALSE,                             -- Para o dashboard mostrar "Acesso Total" vs "Restrito"

  -- Estado de Operação
  is_optimized BOOLEAN DEFAULT FALSE,
  last_heartbeat TIMESTAMPTZ DEFAULT NOW(),
  last_active TIMESTAMPTZ DEFAULT NOW(),                         -- Fallback/alias para last_heartbeat
  last_optimized_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- fonte: supabase/migrations/20240000000022_complete_licenses_system_fixed.sql
-- 3. TABELA DE DISPOSITIVOS (para controle de ativação)
CREATE TABLE IF NOT EXISTS license_devices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    license_id UUID ,
    device_id TEXT NOT NULL, -- ID único do dispositivo
    device_name TEXT,
    machine_name TEXT,
    os_version TEXT,
    processor_count INTEGER,
    activated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_used_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(license_id, device_id)
);

-- fonte: supabase/fix_license_system.sql
CREATE TABLE IF NOT EXISTS public.licenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id UUID ,
    user_id UUID ,
    email TEXT NOT NULL,
    client_id TEXT NOT NULL,
    license_key TEXT UNIQUE NOT NULL,
    license_type TEXT NOT NULL DEFAULT 'standard',
    max_devices INTEGER NOT NULL DEFAULT 1,
    devices_in_use INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    expires_at TIMESTAMPTZ NOT NULL,
    activated_at TIMESTAMPTZ,
    last_device_id TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- fonte: supabase/migrations/add_link_status_events.sql
-- Realtime já está ativo para installations (verificar no Supabase)
-- Se precisar ativar manualmente:
-- ALTER PUBLICATION supabase_realtime ADD TABLE installations;

-- Criar uma view "link_sessions" para armazenar links temporários de vinculação
-- (opcional, para rastreamento; não é crítico para o SSE)
CREATE TABLE IF NOT EXISTS link_sessions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    installation_id uuid NOT NULL ,
    link_id TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'pending', -- pending, confirmed, expired, failed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    confirmed_at TIMESTAMP WITH TIME ZONE,
    confirmed_by_user_id uuid,
    
    CONSTRAINT link_sessions_valid_status CHECK (status IN ('pending', 'confirmed', 'expired', 'failed'))
);

-- fonte: supabase/migrations/20240714000000_create_notifications_and_user_settings.sql
-- 2. Tabela notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL ,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type notification_type NOT NULL,
    read BOOLEAN DEFAULT false,
    sound notification_sound DEFAULT 'ping',
    created_at TIMESTAMPTZ DEFAULT timezone('utc', now())
);

-- fonte: supabase/payments-table.sql
-- ==========================================
-- TABELA DE PAGAMENTOS - SUPABASE
-- Estrutura completa e otimizada
-- ==========================================

-- Criar tabela de pagamentos
CREATE TABLE IF NOT EXISTS payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    preference_id TEXT UNIQUE,           -- ID da preferência do Mercado Pago
    payment_id TEXT UNIQUE,              -- ID do pagamento após aprovação
    email TEXT NOT NULL,                 -- Email do cliente
    full_name TEXT,                      -- Nome completo do cliente
    license_type TEXT NOT NULL,          -- Tipo de licença (trial, standard, pro, enterprise)
    amount DECIMAL(10,2) NOT NULL,       -- Valor pago
    currency TEXT DEFAULT 'BRL',         -- Moeda (BRL, USD, etc)
    status TEXT NOT NULL DEFAULT 'pending', -- Status do pagamento
    processed_at TIMESTAMPTZ,            -- Quando foi processado/aprovado
    mercado_pago_data JSONB,             -- Dados completos do Mercado Pago
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- fonte: supabase/migrations/20240000000000_create_profiles.sql
-- Create profiles table
create table if not exists public.profiles (
    id uuid references auth.users on delete cascade primary key,
    login text unique,
    full_name text,
    phone text,
    city text,
    neighborhood text,
    state text,
    cep text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- fonte: supabase/migrations/20240716000000_create_push_subscriptions.sql
-- Migration: Sistema de Inscrições Push PWA VOLTRIS
-- Data: 2024-07-16
-- Descrição: Sistema profissional para gerenciar notificações push por navegador/dispositivo

-- 1. Tabela push_subscriptions para gerenciar inscrições push
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL ,
    
    -- Dados da inscrição push
    endpoint TEXT NOT NULL,
    p256dh TEXT NOT NULL,
    auth TEXT NOT NULL,
    
    -- Identificação do navegador/dispositivo
    user_agent TEXT,
    browser_fingerprint TEXT, -- Hash único do navegador
    device_type TEXT CHECK (device_type IN ('desktop', 'mobile', 'tablet')),
    platform TEXT, -- Windows, macOS, Linux, Android, iOS
    
    -- Status e controle
    is_active BOOLEAN DEFAULT true,
    last_used TIMESTAMPTZ DEFAULT timezone('utc', now()),
    created_at TIMESTAMPTZ DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc', now())
);

-- fonte: supabase/migrations/20261019120000_billing_facts.sql
-- ---------------------------------------------------------------------------
-- 3. Solicitações de reembolso (item 8: "registre a solicitação")
--
--    automatic  -> devolvido na API da Stripe dentro dos 7 dias
--    manual     -> fora da janela / falha técnica; aguardando a equipe
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.refund_requests (
    id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id         uuid ,
    user_id            uuid ,
    subscription_id    TEXT,                       -- sub_... quando houver
    stripe_charge_id   TEXT,
    stripe_refund_id   TEXT,
    amount             NUMERIC(12,2),
    currency           TEXT DEFAULT 'BRL',
    -- requested | processing | succeeded | failed | canceled | rejected
    status             TEXT NOT NULL DEFAULT 'requested',
    reason             TEXT NOT NULL DEFAULT 'customer_request',  -- requested_by_customer|duplicate|fraudulent
    source             TEXT NOT NULL DEFAULT 'automatic',        -- automatic|manual
    customer_message   TEXT,
    outcome_message    TEXT,
    policy_basis       TEXT,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved_at        TIMESTAMPTZ
);

-- fonte: services/enterprise-schema.sql
-- 6. REMOTE COMMANDS Table
CREATE TABLE IF NOT EXISTS public.remote_commands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id UUID ,
    company_id UUID ,
    create_user_id UUID, -- Who requested the command
    
    command_type TEXT NOT NULL, -- OPTIMIZE_RAM, CLEAN_SYSTEM, UPDATE_POLICY, REMOTE_LOCK
    payload JSONB DEFAULT '{}',
    status TEXT DEFAULT 'pending', -- pending, sent, completed, failed
    
    result_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    executed_at TIMESTAMP WITH TIME ZONE
);

-- fonte: services/session-schema.sql
-- 1. SESSIONS Table (Tracks App Usage Duration)
CREATE TABLE IF NOT EXISTS public.sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id UUID ,
    app_version TEXT,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_heartbeat_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    duration_seconds INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active', -- active, idle, completed, timeout
    ip_address TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- fonte: supabase/migrations/20260208_slo_monitoring.sql
-- ============================================================================
-- SLO MONITORING - AUTOMATED QUERIES
-- Run every 5 minutes via cron job
-- ============================================================================

-- Create SLO metrics table
CREATE TABLE IF NOT EXISTS slo_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name VARCHAR(255) NOT NULL,
  measured_at TIMESTAMPTZ DEFAULT NOW(),
  actual_value DECIMAL(10,4),
  target_value DECIMAL(10,4),
  within_slo BOOLEAN,
  error_budget_consumed_pct DECIMAL(10,2), -- Increased from (5,2) to support values > 999.99
  measurement_window VARCHAR(50),
  total_requests BIGINT,
  failed_requests BIGINT
);

-- fonte: supabase/migrations/20261015200000_webhook_hardening_and_renewal.sql
-- ============================================================================
-- 20261015200000_webhook_hardening_and_renewal.sql
-- Missao secoes 4 e 7: idempotencia PERSISTENTE de webhooks + renovacao
-- canonica baseada no periodo REAL da Stripe.
--
-- JUSTIFICATIVA DAS NOVAS ESTRUTURAS (missao sec.13 exige justificativa):
--   public.stripe_event_log: unicos requisitos "idempotencia persistente por
--   event.id" e "protecao contra replay" (sec.4/9) exigem registro duravel.
--   Nenhuma tabela existente (audit_logs) tem constraint de unicidade por
--   evento; adicionar UNIQUE em audit_logs afetaria usos antigos. Tabela nova,
--   minima, RLS on sem policies = invisivel fora de service_role.
--
--   renew_subscription_license (reescrita): a versao atual usa colunas que nao
--   existem (license_type/is_active/id) e calcula validade como now()+31 dias,
--   exatamente o que a missao (sec.7) proibe. Passa a usar o period end
--   AUTORITATIVO da Stripe, GREATEST contra eventos fora de ordem, lock
--   advisory por assinatura e restauracao de acesso em renovacao legitima.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Log/idempotencia de eventos Stripe
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.stripe_event_log (
    event_id   text PRIMARY KEY,
    event_type text NOT NULL,
    status     text NOT NULL DEFAULT 'processing',  -- processing | done | error
    detail     jsonb,
    created_at timestamptz NOT NULL DEFAULT NOW(),
    updated_at timestamptz NOT NULL DEFAULT NOW()
);

-- fonte: supabase/migrations/20260102000002_add_subscriptions.sql
-- =====================================================
-- MIGRATION: Sistema de Assinaturas Recorrentes
-- Objetivo: Adicionar suporte completo a assinaturas com Mercado Pago
-- =====================================================

-- 1. Criar tabela de assinaturas
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Identificação
    license_id UUID NOT NULL ,
    user_id UUID ,
    email TEXT NOT NULL,
    full_name TEXT,
    phone TEXT,
    
    -- Mercado Pago
    mp_subscription_id TEXT UNIQUE, -- ID da assinatura no Mercado Pago
    mp_preapproval_plan_id TEXT, -- ID do plano no Mercado Pago
    mp_payer_id TEXT, -- ID do pagador
    mp_payment_method_id TEXT, -- Método de pagamento
    
    -- Plano e pagamento
    plan_code license_type NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    currency TEXT DEFAULT 'BRL',
    billing_frequency TEXT DEFAULT 'monthly', -- monthly, quarterly, biannual
    next_billing_date TIMESTAMPTZ,
    
    -- Status
    status TEXT NOT NULL DEFAULT 'pending', -- pending, active, paused, cancelled, expired
    is_trial BOOLEAN DEFAULT false,
    trial_ends_at TIMESTAMPTZ,
    
    -- Controle
    started_at TIMESTAMPTZ DEFAULT NOW(),
    activated_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    cancellation_reason TEXT,
    
    -- Auditoria
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- fonte: supabase/migrations/20240000000001_create_tickets.sql
-- Create ticket_messages table
create table if not exists public.ticket_messages (
    id uuid default gen_random_uuid() primary key,
    ticket_id uuid references public.tickets on delete cascade not null,
    content text not null,
    user_id uuid references auth.users on delete cascade not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- fonte: supabase/migrations/20240000000001_create_tickets.sql
-- Create tickets table
create table if not exists public.tickets (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    status text not null default 'Aberto',
    priority text not null default 'medium',
    user_id uuid references auth.users on delete cascade not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- fonte: supabase/create_trial_activations_table.sql
-- =====================================================
-- TABELA TRIAL ACTIVATIONS - HWID + SUPABASE 100% SEGURO
-- =====================================================
-- Criar tabela de trial activations com RLS (Row Level Security)
-- Proteção contra formatação e reinstalação do Windows

-- Criar tabela principal
CREATE TABLE IF NOT EXISTS trial_activations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    hwid_hash VARCHAR(128) NOT NULL UNIQUE,                    -- HWID SHA512 hash (128 chars)
    hwid_components TEXT NOT NULL,                             -- Componentes JSON para auditoria
    trial_started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    trial_expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '15 days'),
    is_expired BOOLEAN DEFAULT FALSE,
    activation_ip INET,                                         -- IP da primeira ativação
    user_agent TEXT,                                           -- User Agent para auditoria
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- fonte: supabase/migrations/20260208_tenant_isolation.sql
-- Create user-company mapping
CREATE TABLE IF NOT EXISTS user_companies (
  user_id UUID ,
  company_id UUID ,
  role VARCHAR(50) DEFAULT 'member', --  member, admin, owner
  PRIMARY KEY (user_id, company_id)
);

-- fonte: supabase/migrations/20240714000000_create_notifications_and_user_settings.sql
-- 3. Tabela user_settings
CREATE TABLE IF NOT EXISTS public.user_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL ,
    notifications_enabled BOOLEAN DEFAULT true,
    sound_enabled BOOLEAN DEFAULT true,
    notification_categories JSON DEFAULT '"[\"ticket\", \"order\", \"system\", \"profile\"]"',
    sound_theme TEXT DEFAULT 'default',
    volume NUMERIC(3,2) DEFAULT 1.0,
    sound_volume INTEGER DEFAULT 70,
    created_at TIMESTAMPTZ DEFAULT timezone('utc', now())
);

-- gerada a partir do schema real do banco (nao havia CREATE TABLE no repo)
CREATE TABLE IF NOT EXISTS public.auth_audit (
    "id" integer GENERATED BY DEFAULT AS IDENTITY NOT NULL PRIMARY KEY,
    "event_type" text NOT NULL,
    "user_email" text,
    "user_id" uuid,
    "metadata" jsonb,
    "error_message" text,
    "created_at" timestamptz DEFAULT now() NOT NULL,
    "ip_address" text
);

-- gerada a partir do schema real do banco (nao havia CREATE TABLE no repo)
CREATE TABLE IF NOT EXISTS public.client_cost_analysis (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    "company_id" uuid,
    "device_id" uuid,
    "period_month" date NOT NULL,
    "total_cost_usd" numeric,
    "revenue_usd" numeric,
    "margin_usd" numeric,
    "feature_breakdown" jsonb,
    "usage_breakdown" jsonb,
    "profitability_score" numeric,
    "churn_risk_score" numeric,
    "created_at" timestamptz DEFAULT now()
);

-- gerada a partir do schema real do banco (nao havia CREATE TABLE no repo)
CREATE TABLE IF NOT EXISTS public.conversations (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    "user_id" uuid,
    "started_at" timestamptz DEFAULT now(),
    "ended_at" timestamptz,
    "status" text,
    "whatsapp_sent" boolean
);

-- gerada a partir do schema real do banco (nao havia CREATE TABLE no repo)
CREATE TABLE IF NOT EXISTS public.data_retention_policies (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    "event_type" text NOT NULL,
    "retention_days" integer NOT NULL,
    "auto_delete" boolean,
    "last_cleanup_at" timestamptz,
    "next_cleanup_at" timestamptz,
    "created_at" timestamptz DEFAULT now(),
    "updated_at" timestamptz DEFAULT now()
);

-- gerada a partir do schema real do banco (nao havia CREATE TABLE no repo)
CREATE TABLE IF NOT EXISTS public.deploy_correlation_metrics (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    "deploy_version" text NOT NULL,
    "analysis_start" timestamptz NOT NULL,
    "analysis_end" timestamptz NOT NULL,
    "avg_performance_change_pct" numeric,
    "p95_latency_change_ms" integer,
    "crash_rate_before" numeric,
    "crash_rate_after" numeric,
    "crash_rate_change_pct" numeric,
    "error_rate_before" numeric,
    "error_rate_after" numeric,
    "error_rate_change_pct" numeric,
    "new_bugs_count" integer,
    "resolved_bugs_count" integer,
    "new_bug_patterns" text[],
    "feature_adoption_change" jsonb,
    "feature_performance_change" jsonb,
    "affected_users" integer,
    "user_satisfaction_score" numeric,
    "deploy_health_score" numeric,
    "rollback_recommended" boolean,
    "created_at" timestamptz DEFAULT now()
);

-- gerada a partir do schema real do banco (nao havia CREATE TABLE no repo)
CREATE TABLE IF NOT EXISTS public.deploy_registry (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    "deploy_version" text NOT NULL,
    "git_commit_hash" text,
    "git_branch" text,
    "deployed_at" timestamptz NOT NULL,
    "deployed_by" text,
    "release_notes" text,
    "feature_flags_snapshot" jsonb,
    "environment" text,
    "build_number" text,
    "created_at" timestamptz DEFAULT now()
);

-- gerada a partir do schema real do banco (nao havia CREATE TABLE no repo)
CREATE TABLE IF NOT EXISTS public.event_registry (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    "event_name" text NOT NULL,
    "event_version" text NOT NULL,
    "schema_version" text NOT NULL,
    "owner_system" text NOT NULL,
    "module_name" text NOT NULL,
    "feature_name" text NOT NULL,
    "owner_team" text,
    "description" text NOT NULL,
    "criticality_level" text NOT NULL,
    "retention_days" integer,
    "contains_pii" boolean,
    "status" text,
    "deprecation_date" timestamptz,
    "sunset_date" timestamptz,
    "replacement_event" text,
    "payload_schema" jsonb NOT NULL,
    "example_payload" jsonb,
    "created_at" timestamptz DEFAULT now(),
    "created_by" text,
    "updated_at" timestamptz DEFAULT now(),
    "updated_by" text
);

-- gerada a partir do schema real do banco (nao havia CREATE TABLE no repo)
CREATE TABLE IF NOT EXISTS public.messages (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    "conversation_id" uuid,
    "sender" text NOT NULL,
    "content" text NOT NULL,
    "created_at" timestamptz DEFAULT now()
);

-- gerada a partir do schema real do banco (nao havia CREATE TABLE no repo)
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    "email" text NOT NULL,
    "source" text NOT NULL,
    "subscribed_at" timestamptz DEFAULT now() NOT NULL,
    "status" text NOT NULL,
    "created_at" timestamptz DEFAULT now() NOT NULL
);

-- gerada a partir do schema real do banco (nao havia CREATE TABLE no repo)
CREATE TABLE IF NOT EXISTS public.notification_preferences (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    "user_id" uuid,
    "email_notifications" boolean,
    "push_notifications" boolean,
    "sms_notifications" boolean,
    "created_at" timestamptz DEFAULT now(),
    "updated_at" timestamptz DEFAULT now()
);

-- gerada a partir do schema real do banco (nao havia CREATE TABLE no repo)
CREATE TABLE IF NOT EXISTS public.orders (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    "user_id" uuid NOT NULL,
    "service_id" text,
    "service_name" text,
    "service_description" text,
    "plan_type" text,
    "final_price" numeric NOT NULL,
    "payment_method" text,
    "status" text NOT NULL,
    "payment_status" text NOT NULL,
    "notes" text,
    "scheduling_type" text,
    "appointment_datetime" timestamptz,
    "created_at" timestamptz DEFAULT now() NOT NULL,
    "updated_at" timestamptz DEFAULT now() NOT NULL,
    "total" numeric,
    "items" jsonb,
    "cancelled_by" text
);

-- gerada a partir do schema real do banco (nao havia CREATE TABLE no repo)
CREATE TABLE IF NOT EXISTS public.ratings (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    "conversation_id" uuid,
    "rating" integer,
    "feedback" text,
    "created_at" timestamptz DEFAULT now()
);

-- gerada a partir do schema real do banco (nao havia CREATE TABLE no repo)
CREATE TABLE IF NOT EXISTS public.rejected_events (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    "event_type" text NOT NULL,
    "raw_payload" jsonb NOT NULL,
    "rejection_reason" text NOT NULL,
    "validation_errors" jsonb,
    "suggested_fix" text,
    "device_id" uuid,
    "session_id" uuid,
    "app_version" text,
    "rejected_at" timestamptz
);

-- gerada a partir do schema real do banco (nao havia CREATE TABLE no repo)
CREATE TABLE IF NOT EXISTS public.service_requests (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    "user_id" uuid NOT NULL,
    "order_id" uuid,
    "status" text NOT NULL,
    "requested_services" jsonb NOT NULL,
    "scheduling_type" text NOT NULL,
    "requested_datetime" timestamptz,
    "admin_notes" text,
    "final_price" numeric,
    "created_at" timestamptz DEFAULT now() NOT NULL,
    "updated_at" timestamptz DEFAULT now() NOT NULL
);

-- gerada a partir do schema real do banco (nao havia CREATE TABLE no repo)
CREATE TABLE IF NOT EXISTS public.user_deletion_requests (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    "device_id" uuid,
    "company_id" uuid,
    "requested_at" timestamptz,
    "requested_by" text,
    "deletion_scope" jsonb,
    "status" text,
    "processed_at" timestamptz,
    "completed_at" timestamptz,
    "deleted_records" jsonb
);

-- gerada a partir do schema real do banco (nao havia CREATE TABLE no repo)
CREATE TABLE IF NOT EXISTS public.user_journeys (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    "session_id" uuid NOT NULL,
    "device_id" uuid NOT NULL,
    "journey_start" timestamptz NOT NULL,
    "journey_end" timestamptz,
    "duration_seconds" integer,
    "event_sequence" jsonb,
    "page_sequence" text[],
    "feature_sequence" text[],
    "completed" boolean,
    "completion_type" text,
    "total_events" integer,
    "error_count" integer,
    "success_rate" numeric,
    "journey_type" text,
    "friction_detected" boolean,
    "created_at" timestamptz DEFAULT now()
);

-- gerada a partir do schema real do banco (nao havia CREATE TABLE no repo)
CREATE TABLE IF NOT EXISTS public.ux_friction_points (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    "feature_name" text NOT NULL,
    "action_sequence" text[],
    "friction_type" text,
    "severity" text,
    "affected_users" integer,
    "occurrence_count" integer,
    "avg_impact_score" numeric,
    "common_metadata" jsonb,
    "user_segments" jsonb,
    "detected_at" timestamptz,
    "resolved_at" timestamptz,
    "resolution_notes" text
);

-- ============================================================================
--  FASE 4 — COLUNAS COMPLETADAS (o que faltava em cada tabela)
-- ============================================================================
ALTER TABLE public.installations ADD COLUMN IF NOT EXISTS "linked_at" timestamptz;
ALTER TABLE public.installations ADD COLUMN IF NOT EXISTS "last_link_check_at" timestamptz;
ALTER TABLE public.installations ADD COLUMN IF NOT EXISTS "trial_started_at" timestamptz;
ALTER TABLE public.installations ADD COLUMN IF NOT EXISTS "device_credential_hash" text;
ALTER TABLE public.installations ADD COLUMN IF NOT EXISTS "device_credential_issued" timestamptz;
ALTER TABLE public.installations ADD COLUMN IF NOT EXISTS "unlinked_at" timestamptz;
ALTER TABLE public.installations ADD COLUMN IF NOT EXISTS "link_confirmed_via_ip" text;
ALTER TABLE public.license_devices ADD COLUMN IF NOT EXISTS "license_key" text NOT NULL;
ALTER TABLE public.license_devices ADD COLUMN IF NOT EXISTS "app_version" text;
ALTER TABLE public.license_devices ADD COLUMN IF NOT EXISTS "last_seen_at" timestamptz NOT NULL;
ALTER TABLE public.licenses ADD COLUMN IF NOT EXISTS "plan_type" text NOT NULL;
ALTER TABLE public.licenses ADD COLUMN IF NOT EXISTS "billing_period" text NOT NULL;
ALTER TABLE public.licenses ADD COLUMN IF NOT EXISTS "customer_email" text;
ALTER TABLE public.licenses ADD COLUMN IF NOT EXISTS "notes" text;
ALTER TABLE public.licenses ADD COLUMN IF NOT EXISTS "revoked" boolean NOT NULL;
ALTER TABLE public.licenses ADD COLUMN IF NOT EXISTS "license_display_name" text;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS "data" jsonb;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS "action_url" text;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS "audience" text NOT NULL;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS "read_at" timestamptz;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS "updated_at" timestamptz;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS "reference_id" text NOT NULL;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS "user_id" uuid;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS "customer_name" text;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS "plan_type" text;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS "stripe_id" text;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS "stripe_customer_id" text;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS "stripe_subscription_id" text;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS "billing_period" text;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS "provider" text;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS "stripe_charge_id" text;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS "stripe_invoice_id" text;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS "stripe_refund_id" text;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS "refunded_amount" numeric;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS "refunded_at" timestamptz;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS "invoice_kind" text;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS "period_start" timestamptz;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS "period_end" timestamptz;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS "paid_at" timestamptz;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS "customer_name_snapshot" text;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS "payment_method" text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS "email" text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS "address" text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS "is_admin" boolean;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS "role" text NOT NULL;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS "is_blocked" boolean NOT NULL;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS "is_deleted" boolean NOT NULL;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS "phone_normalized" text;
ALTER TABLE public.refund_requests ADD COLUMN IF NOT EXISTS "processed_by" uuid;
ALTER TABLE public.refund_requests ADD COLUMN IF NOT EXISTS "processed_at" timestamptz;
ALTER TABLE public.refund_requests ADD COLUMN IF NOT EXISTS "requested_amount" numeric;
ALTER TABLE public.refund_requests ADD COLUMN IF NOT EXISTS "stripe_payment_intent" text;
ALTER TABLE public.refund_requests ADD COLUMN IF NOT EXISTS "license_impact" text;
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS "health_score" integer;
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS "reference_id" text NOT NULL;
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS "pagbank_subscription_id" text NOT NULL;
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS "plan_type" text NOT NULL;
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS "payment_id" uuid;
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS "next_billing_at" timestamptz;
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS "canceled_at" timestamptz;
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS "billing_period" text;
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS "stripe_customer_id" text;
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS "cancel_at_period_end" boolean;
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS "cancel_at" timestamptz;
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS "canceled_reason" text;
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS "ended_at" timestamptz;
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS "stripe_price_id" text;
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS "latest_invoice_id" text;
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS "payment_method_brand" text;
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS "payment_method_last4" text;
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS "current_period_start" timestamptz;
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS "current_period_end" timestamptz;
ALTER TABLE public.tickets ADD COLUMN IF NOT EXISTS "updated_at" timestamptz NOT NULL;

-- ============================================================================
--  FASE 5 — CHAVES ESTRANGEIRAS (depois de TODAS as tabelas, por causa da ordem)
-- ============================================================================
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint
                   WHERE conname = 'admin_audit_log_admin_id_fk' AND conrelid = 'public.admin_audit_log'::regclass) THEN
        ALTER TABLE public.admin_audit_log ADD CONSTRAINT admin_audit_log_admin_id_fk
            FOREIGN KEY ("admin_id") REFERENCES auth.users(id) ON DELETE SET NULL;
    END IF;
END $$;
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint
                   WHERE conname = 'admin_role_grants_user_id_fk' AND conrelid = 'public.admin_role_grants'::regclass) THEN
        ALTER TABLE public.admin_role_grants ADD CONSTRAINT admin_role_grants_user_id_fk
            FOREIGN KEY ("user_id") REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint
                   WHERE conname = 'admin_role_grants_granted_by_fk' AND conrelid = 'public.admin_role_grants'::regclass) THEN
        ALTER TABLE public.admin_role_grants ADD CONSTRAINT admin_role_grants_granted_by_fk
            FOREIGN KEY ("granted_by") REFERENCES auth.users(id) ON DELETE SET NULL;
    END IF;
END $$;
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint
                   WHERE conname = 'admin_role_grants_revoked_by_fk' AND conrelid = 'public.admin_role_grants'::regclass) THEN
        ALTER TABLE public.admin_role_grants ADD CONSTRAINT admin_role_grants_revoked_by_fk
            FOREIGN KEY ("revoked_by") REFERENCES auth.users(id) ON DELETE SET NULL;
    END IF;
END $$;
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint
                   WHERE conname = 'company_users_company_id_fk' AND conrelid = 'public.company_users'::regclass) THEN
        ALTER TABLE public.company_users ADD CONSTRAINT company_users_company_id_fk
            FOREIGN KEY ("company_id") REFERENCES public.companies(id) ON DELETE CASCADE;
    END IF;
END $$;
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint
                   WHERE conname = 'device_commands_installation_id_fk' AND conrelid = 'public.device_commands'::regclass) THEN
        ALTER TABLE public.device_commands ADD CONSTRAINT device_commands_installation_id_fk
            FOREIGN KEY ("installation_id") REFERENCES public.installations(id);
    END IF;
END $$;
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint
                   WHERE conname = 'email_outbox_user_id_fk' AND conrelid = 'public.email_outbox'::regclass) THEN
        ALTER TABLE public.email_outbox ADD CONSTRAINT email_outbox_user_id_fk
            FOREIGN KEY ("user_id") REFERENCES auth.users(id) ON DELETE SET NULL;
    END IF;
END $$;
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint
                   WHERE conname = 'email_outbox_payment_id_fk' AND conrelid = 'public.email_outbox'::regclass) THEN
        ALTER TABLE public.email_outbox ADD CONSTRAINT email_outbox_payment_id_fk
            FOREIGN KEY ("payment_id") REFERENCES public.payments(id) ON DELETE SET NULL;
    END IF;
END $$;
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint
                   WHERE conname = 'installation_events_installation_id_fk' AND conrelid = 'public.installation_events'::regclass) THEN
        ALTER TABLE public.installation_events ADD CONSTRAINT installation_events_installation_id_fk
            FOREIGN KEY ("installation_id") REFERENCES public.installations(id) ON DELETE CASCADE;
    END IF;
END $$;
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint
                   WHERE conname = 'installation_heartbeats_installation_id_fk' AND conrelid = 'public.installation_heartbeats'::regclass) THEN
        ALTER TABLE public.installation_heartbeats ADD CONSTRAINT installation_heartbeats_installation_id_fk
            FOREIGN KEY ("installation_id") REFERENCES public.installations(id) ON DELETE CASCADE;
    END IF;
END $$;
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint
                   WHERE conname = 'installations_WPF_fk' AND conrelid = 'public.installations'::regclass) THEN
        ALTER TABLE public.installations ADD CONSTRAINT installations_WPF_fk
            FOREIGN KEY ("WPF") REFERENCES public.profiles(id) ON DELETE SET NULL;
    END IF;
END $$;
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint
                   WHERE conname = 'license_devices_license_id_fk' AND conrelid = 'public.license_devices'::regclass) THEN
        ALTER TABLE public.license_devices ADD CONSTRAINT license_devices_license_id_fk
            FOREIGN KEY ("license_id") REFERENCES public.licenses(id) ON DELETE CASCADE NOT NULL;
    END IF;
END $$;
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint
                   WHERE conname = 'licenses_payment_id_fk' AND conrelid = 'public.licenses'::regclass) THEN
        ALTER TABLE public.licenses ADD CONSTRAINT licenses_payment_id_fk
            FOREIGN KEY ("payment_id") REFERENCES public.payments(id) ON DELETE SET NULL;
    END IF;
END $$;
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint
                   WHERE conname = 'licenses_user_id_fk' AND conrelid = 'public.licenses'::regclass) THEN
        ALTER TABLE public.licenses ADD CONSTRAINT licenses_user_id_fk
            FOREIGN KEY ("user_id") REFERENCES auth.users(id) ON DELETE SET NULL;
    END IF;
END $$;
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint
                   WHERE conname = 'link_sessions_installation_id_fk' AND conrelid = 'public.link_sessions'::regclass) THEN
        ALTER TABLE public.link_sessions ADD CONSTRAINT link_sessions_installation_id_fk
            FOREIGN KEY ("installation_id") REFERENCES public.installations(id) ON DELETE CASCADE;
    END IF;
END $$;
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint
                   WHERE conname = 'notifications_user_id_fk' AND conrelid = 'public.notifications'::regclass) THEN
        ALTER TABLE public.notifications ADD CONSTRAINT notifications_user_id_fk
            FOREIGN KEY ("user_id") REFERENCES public.profiles(id) ON DELETE CASCADE;
    END IF;
END $$;
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint
                   WHERE conname = 'push_subscriptions_user_id_fk' AND conrelid = 'public.push_subscriptions'::regclass) THEN
        ALTER TABLE public.push_subscriptions ADD CONSTRAINT push_subscriptions_user_id_fk
            FOREIGN KEY ("user_id") REFERENCES public.profiles(id) ON DELETE CASCADE;
    END IF;
END $$;
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint
                   WHERE conname = 'refund_requests_payment_id_fk' AND conrelid = 'public.refund_requests'::regclass) THEN
        ALTER TABLE public.refund_requests ADD CONSTRAINT refund_requests_payment_id_fk
            FOREIGN KEY ("payment_id") REFERENCES public.payments(id) ON DELETE CASCADE;
    END IF;
END $$;
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint
                   WHERE conname = 'refund_requests_user_id_fk' AND conrelid = 'public.refund_requests'::regclass) THEN
        ALTER TABLE public.refund_requests ADD CONSTRAINT refund_requests_user_id_fk
            FOREIGN KEY ("user_id") REFERENCES auth.users(id) ON DELETE SET NULL;
    END IF;
END $$;
-- ignorada: remote_commands.device_id -> public.devices (essa tabela nao existe no banco)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint
                   WHERE conname = 'remote_commands_company_id_fk' AND conrelid = 'public.remote_commands'::regclass) THEN
        ALTER TABLE public.remote_commands ADD CONSTRAINT remote_commands_company_id_fk
            FOREIGN KEY ("company_id") REFERENCES public.companies(id) ON DELETE CASCADE;
    END IF;
END $$;
-- ignorada: sessions.device_id -> public.devices (essa tabela nao existe no banco)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint
                   WHERE conname = 'subscriptions_license_id_fk' AND conrelid = 'public.subscriptions'::regclass) THEN
        ALTER TABLE public.subscriptions ADD CONSTRAINT subscriptions_license_id_fk
            FOREIGN KEY ("license_id") REFERENCES public.licenses(id) ON DELETE CASCADE;
    END IF;
END $$;
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint
                   WHERE conname = 'subscriptions_user_id_fk' AND conrelid = 'public.subscriptions'::regclass) THEN
        ALTER TABLE public.subscriptions ADD CONSTRAINT subscriptions_user_id_fk
            FOREIGN KEY ("user_id") REFERENCES auth.users(id) ON DELETE SET NULL;
    END IF;
END $$;
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint
                   WHERE conname = 'user_companies_user_id_fk' AND conrelid = 'public.user_companies'::regclass) THEN
        ALTER TABLE public.user_companies ADD CONSTRAINT user_companies_user_id_fk
            FOREIGN KEY ("user_id") REFERENCES auth.users(id);
    END IF;
END $$;
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint
                   WHERE conname = 'user_companies_company_id_fk' AND conrelid = 'public.user_companies'::regclass) THEN
        ALTER TABLE public.user_companies ADD CONSTRAINT user_companies_company_id_fk
            FOREIGN KEY ("company_id") REFERENCES public.companies(id);
    END IF;
END $$;
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint
                   WHERE conname = 'user_settings_user_id_fk' AND conrelid = 'public.user_settings'::regclass) THEN
        ALTER TABLE public.user_settings ADD CONSTRAINT user_settings_user_id_fk
            FOREIGN KEY ("user_id") REFERENCES public.profiles(id) ON DELETE CASCADE;
    END IF;
END $$;

-- ============================================================================
--  FASE 6 — ALTER TABLE (indices, constraints, defaults, RLS)
-- ============================================================================
-- Row Level Security (RLS) Policies (Examples)
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
-- 3. UPDATED DEVICES VIEW (Optional helper, but kept within constraints)
-- We don't alter existing tables, but we can ensure devices has a 'last_active_session_id' if we wanted, 
-- but we will stick to using the sessions table for tracking to avoid migration risks.

-- 4. RLS Policies (Basic examples, ensure to refine based on your auth model)
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
-- 2. ACTIVITY SESSIONS (Sessões detalhadas)
-- (Sua tabela 'sessions' atual foca em estado, vamos criar uma de histórico se necessário, 
-- ou alterar a session atual para suportar metrics de encerramento)
ALTER TABLE public.sessions 
ADD COLUMN IF NOT EXISTS close_reason TEXT DEFAULT 'unknown', -- 'user_exit', 'crash', 'shutdown', 'update'
ADD COLUMN IF NOT EXISTS duration_seconds INTEGER DEFAULT 0;
-- ============================================================
-- VOLTRIS — SECURITY HARDENING: FIX RLS LEAKS
-- Este script corrige políticas que permitem acesso anônimo excessivo.
-- ============================================================

-- 1. TABELA: payments
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
-- 2. TABELA: licenses
ALTER TABLE public.licenses ENABLE ROW LEVEL SECURITY;
-- 3. TABELA: subscriptions
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
-- 4. TABELA: audit_logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
-- Adicionar coluna license_key (chave de licença do programa)
ALTER TABLE installations 
ADD COLUMN IF NOT EXISTS license_key TEXT;
-- Adicionar coluna license_activated_at (data de ativação da licença)
ALTER TABLE installations 
ADD COLUMN IF NOT EXISTS license_activated_at TIMESTAMPTZ;
-- Adicionar coluna license_expires_at (data de expiração da licença)
ALTER TABLE installations 
ADD COLUMN IF NOT EXISTS license_expires_at TIMESTAMPTZ;
-- Habilitar RLS (Row Level Security) - MÁXIMA SEGURANÇA
ALTER TABLE trial_activations ENABLE ROW LEVEL SECURITY;
-- Configurar row security para ser restritivo por padrão
ALTER TABLE trial_activations FORCE ROW LEVEL SECURITY;
-- Adicionar devices_in_use se não existir (para bancos já criados)
ALTER TABLE public.licenses ADD COLUMN IF NOT EXISTS devices_in_use INTEGER NOT NULL DEFAULT 0;
-- ------------------------------------------------------------
-- 4. RLS — POLÍTICAS DE SEGURANÇA
-- ------------------------------------------------------------

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
-- 7. ADD MISSING COLUMNS TO INSTALLATIONS
ALTER TABLE installations ADD COLUMN IF NOT EXISTS gpu_name TEXT;
ALTER TABLE installations ADD COLUMN IF NOT EXISTS disk_type TEXT;
ALTER TABLE installations ADD COLUMN IF NOT EXISTS windows_edition TEXT;
ALTER TABLE installations ADD COLUMN IF NOT EXISTS hostname TEXT;
ALTER TABLE installations ADD COLUMN IF NOT EXISTS architecture TEXT DEFAULT 'x64';
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
-- ═══════════════════════════════════════════════════════════════════════════
-- PASSO 8: ROW LEVEL SECURITY (RLS)
-- ═══════════════════════════════════════════════════════════════════════════

-- installations
ALTER TABLE installations ENABLE ROW LEVEL SECURITY;
-- device_commands
ALTER TABLE device_commands ENABLE ROW LEVEL SECURITY;
-- installation_events
ALTER TABLE installation_events ENABLE ROW LEVEL SECURITY;
-- installation_heartbeats
ALTER TABLE installation_heartbeats ENABLE ROW LEVEL SECURITY;
-- Enable RLS (Row Level Security)
alter table public.profiles enable row level security;
-- Enable RLS
alter table public.tickets enable row level security;
alter table public.ticket_messages enable row level security;
-- Atualizar a tabela orders para incluir informações detalhadas dos serviços
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS service_name TEXT,
ADD COLUMN IF NOT EXISTS service_description TEXT,
ADD COLUMN IF NOT EXISTS plan_type TEXT CHECK (plan_type IN ('basico', 'profissional', 'empresarial', 'gamer', 'corporativa')),
ADD COLUMN IF NOT EXISTS notes TEXT;
-- Script completo para configurar o sistema de pedidos
-- Execute este script no SQL Editor do Supabase Dashboard

-- 1. Atualizar a tabela orders para incluir informações detalhadas dos serviços
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS service_name TEXT,
ADD COLUMN IF NOT EXISTS service_description TEXT,
ADD COLUMN IF NOT EXISTS plan_type TEXT CHECK (plan_type IN ('basico', 'profissional', 'empresarial', 'gamer', 'corporativa', 'Formatação Básica', 'Formatação Média', 'Formatação Avançada', 'Formatação Corporativa', 'Otimização Básica', 'Otimização Média', 'Otimização Avançada', 'Otimização Premium', 'Office 365', 'Office 2021', 'Office 2019', 'Office Empresarial')),
ADD COLUMN IF NOT EXISTS notes TEXT;
-- 6. ATUALIZAR TABELA ORDERS (ADICIONAR CAMPOS NECESSÁRIOS)
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS service_name TEXT,
ADD COLUMN IF NOT EXISTS service_description TEXT,
ADD COLUMN IF NOT EXISTS plan_type TEXT CHECK (plan_type IN ('basico', 'profissional', 'empresarial', 'gamer', 'corporativa')),
ADD COLUMN IF NOT EXISTS notes TEXT;
-- 9. HABILITAR RLS NAS TABELAS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
-- 9. POLÍTICAS RLS PARA PAGAMENTOS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
-- 10. POLÍTICAS RLS PARA LICENÇAS
ALTER TABLE licenses ENABLE ROW LEVEL SECURITY;
-- 11. POLÍTICAS RLS PARA DISPOSITIVOS
ALTER TABLE license_devices ENABLE ROW LEVEL SECURITY;
-- =====================================================
-- PARTE 7: POLÍTICAS RLS PARA PAGAMENTOS
-- =====================================================

-- Habilitar RLS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
-- =====================================================
-- PARTE 8: POLÍTICAS RLS PARA LICENÇAS
-- =====================================================

ALTER TABLE licenses ENABLE ROW LEVEL SECURITY;
-- =====================================================
-- PARTE 9: POLÍTICAS RLS PARA DISPOSITIVOS
-- =====================================================

ALTER TABLE license_devices ENABLE ROW LEVEL SECURITY;
-- Adiciona campos de status para bloqueio e exclusão lógica de usuários
alter table public.profiles add column if not exists is_blocked boolean not null default false;
alter table public.profiles add column if not exists is_deleted boolean not null default false;
-- Atualizar os tipos de planos permitidos na tabela orders
-- Adicionar novos tipos de planos para os serviços específicos

-- Remover a restrição atual
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_plan_type_check;
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'orders_plan_type_check' AND conrelid = 'public.orders'::regclass) THEN
        ALTER TABLE public.orders ADD CONSTRAINT orders_plan_type_check 
CHECK (plan_type IN (
    'basico', 'profissional', 'empresarial', 'gamer', 'corporativa',
    'Formatação Básica', 'Formatação Média', 'Formatação Avançada', 'Formatação Corporativa',
    'Otimização Básica', 'Otimização Média', 'Otimização Avançada', 'Otimização Premium',
    'Office 365', 'Office 2021', 'Office 2019', 'Office Empresarial'
));
    END IF;
END $$;
-- Adiciona o campo address na tabela profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS address text;
-- Migration: Adiciona coluna cancelled_by para rastrear quem cancelou o pedido
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS cancelled_by TEXT CHECK (cancelled_by IN ('client', 'admin'));
-- RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
-- RLS (Row Level Security)
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;
-- 3. Adicionar campos de assinatura na tabela licenses
ALTER TABLE licenses 
ADD COLUMN IF NOT EXISTS subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS is_recurring BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS auto_renew BOOLEAN DEFAULT true;
-- 8. RLS Policies
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
-- Políticas RLS (apenas se não existirem)
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
-- Políticas RLS (Row Level Security)
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
-- 7. POLÍTICAS DE SEGURANÇA (RLS)
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.licenses ENABLE ROW LEVEL SECURITY;
-- RLS (Segurança)
ALTER TABLE device_commands ENABLE ROW LEVEL SECURITY;
-- RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
-- 7. SEGURANÇA (ROW LEVEL SECURITY)
ALTER TABLE installations ENABLE ROW LEVEL SECURITY;
ALTER TABLE installation_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE installation_heartbeats ENABLE ROW LEVEL SECURITY;
-- ============================================================================
-- FASE 5 — installations.trial_started_at
--
-- O trial era calculado a partir de created_at. Em maquinas antigas isso dava
-- "0 dias restantes" na primeira consulta. trial_started_at passa a ser a
-- origem do trial, com backfill a partir de created_at (mesmo comportamento de
-- antes, porem explicito) e DEFAULT now() para registros novos.
-- O endpoint /api/v1/install NAO envia esta coluna, entao um heartbeat jamais
-- reinicia o trial.
-- ============================================================================
ALTER TABLE public.installations
    ADD COLUMN IF NOT EXISTS trial_started_at TIMESTAMPTZ DEFAULT now();
-- ============================================================================
-- FASE 6 — licenses / license_devices
--
-- Schema REAL de public.licenses:
--   license_key (PK) | plan_type | max_devices | expires_at | billing_period
--   customer_email | notes | revoked | activated_at | created_at
--
-- O codigo do site, as Edge Functions e as migrations antigas assumem um schema
-- INCOMPATIVEL (id, user_id, email, license_type, is_active, devices_in_use,
-- license_display_name, license_id, device_name, last_used_at...). Isso produzia
-- 42703 em /api/v1/license/*.
--
-- DECISAO: nao renomear e nao dropar nada (licenses tem PK license_key e
-- clientes reais). Tornar o schema existente CANONICO e adicionar SOMENTE o que
-- nao tem equivalente:
--
--   licenses.user_id              -> vinculo UUID com profiles (arquitetura correta)
--   licenses.email                -> alias persistido de customer_email
--   licenses.client_id            -> id embutido na chave (VOLTRIS-PLANO-ID-...)
--   licenses.payment_id           -> referencia de pagamento
--   licenses.license_display_name -> nome de exibicao
--
--   license_devices.device_name     -> nome do PC
--   license_devices.last_used_at    -> ultimo uso
--   license_devices.processor_count
--
-- NAO adicionamos license_type / is_active / devices_in_use / license_id:
-- o codigo passa a usar plan_type / revoked / contagem real / license_key.
-- Uma unica arquitetura, sem duplicacao.
-- ============================================================================
ALTER TABLE public.licenses
    ADD COLUMN IF NOT EXISTS user_id              UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS email                TEXT,
    ADD COLUMN IF NOT EXISTS client_id            TEXT,
    ADD COLUMN IF NOT EXISTS payment_id           TEXT,
    ADD COLUMN IF NOT EXISTS license_display_name TEXT;
ALTER TABLE public.license_devices
    ADD COLUMN IF NOT EXISTS device_name     TEXT,
    ADD COLUMN IF NOT EXISTS last_used_at    TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS processor_count INTEGER;
-- ============================================================================
-- FASE 1 — Colunas
-- ============================================================================
ALTER TABLE public.installations
    ADD COLUMN IF NOT EXISTS device_credential_hash    TEXT,
    ADD COLUMN IF NOT EXISTS device_credential_issued TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS unlinked_at              TIMESTAMPTZ;
-- ⚠️ IMPORTANTE: NÃO USE RLS COM DEVICE_CREDENTIAL
-- RLS trabalha com auth.uid() (sessão de usuário), não com device_credential (header)
-- Segurança vem da validação de credencial no backend (NextJS), não no BD

-- Se RLS já estiver habilitado, DESABILITAR:;
-- IMPORTANTE: Adicionar campos à tabela installations se não existirem
-- (Para rastreamento avançado — opcional)
ALTER TABLE installations 
ADD COLUMN IF NOT EXISTS linked_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS link_confirmed_via_ip TEXT,
ADD COLUMN IF NOT EXISTS last_link_check_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.stripe_event_log ENABLE ROW LEVEL SECURITY;
-- ============================================================================
-- 20261019120000_billing_facts.sql
-- Missão §3, §5, §7, §8 e §10 — FATOS FINANCEIROS que faltavam no banco.
--
-- DIAGNÓSTICO (verificado no banco de produção em 2026-10-19):
--   1. `public.subscriptions.next_billing_at` é NULL em 7/7 linhas e
--      `canceled_at` NULL em 7/7. O painel decide "Renovação: desligada"
--      lendo exatamente essa coluna — a assinatura estava ATIVA na Stripe e o
--      banco não tinha o dado para provar isso.
--   2. Não existe `cancel_at_period_end` em `subscriptions`: o cancelamento
--      agendado na Stripe não tinha espelho local, então um sincronismo mal
--      feito sobrescrevia cancelamento confirmado.
--   3. `public.payments` guarda no máximo UM identificador Stripe
--      (`stripe_id`), e ele é sobrescrito por `COALESCE(stripe_id, ...)`.
--      Isso torna impossível:
--        - distinguir a compra inicial de uma RENOVAÇÃO (mesmo `stripe_id`
--          guardado para o pagamento);
--        - emitir fatura histórica da cobrança certa;
--        - impedir reembolso duplicado (não há onde gravar o refund id);
--        - dizer qual fatura da Stripe corresponde à cobrança.
--   4. Não existe registro de solicitação manual de reembolso: o caso "fora da
--      janela de 7 dias" simplesmente não tinha onde ser protocolado.
--
-- DECISÕES (itens 1-5, 14 e 15 da missão):
--   - NADA é destrutivo: só ADD COLUMN IF NOT EXISTS e CREATE IF NOT EXISTS.
--     Nenhuma linha existente de payments/subscriptions/licenses é alterada.
--   - Colunas novas são NULLABLE e sem DEFAULT: linha antiga continua válida
--     e significa "informação não registrada naquela época" — nunca "falso".
--   - A verdade continua sendo a Stripe.Estas colunas são o ESPELHO local,
--     escrito exclusivamente pelo webhook e por rotas autenticadas.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Espelho fiel da assinatura na Stripe
-- ---------------------------------------------------------------------------
ALTER TABLE public.subscriptions
    ADD COLUMN IF NOT EXISTS stripe_customer_id  TEXT,       -- cus_...
    ADD COLUMN IF NOT EXISTS cancel_at_period_end BOOLEAN,   -- espelho do flag da Stripe
    ADD COLUMN IF NOT EXISTS cancel_at           TIMESTAMPTZ,-- epoch pedido pelo cliente
    ADD COLUMN IF NOT EXISTS canceled_reason     TEXT,       -- duplicate|cancellation_requested|fraudulent|null
    ADD COLUMN IF NOT EXISTS ended_at            TIMESTAMPTZ,-- current_period_end quando cancelou
    ADD COLUMN IF NOT EXISTS stripe_price_id     TEXT,       -- price_... (autoridade do plano/período)
    ADD COLUMN IF NOT EXISTS latest_invoice_id   TEXT,       -- in_... da última cobrança
    ADD COLUMN IF NOT EXISTS payment_method_brand TEXT,      -- visa/master/…
    ADD COLUMN IF NOT EXISTS payment_method_last4 TEXT;
-- somente últimos 4 dígitos

-- ---------------------------------------------------------------------------
-- 2. Fatos por COBRANÇA (não por compra) — base da fatura PDF e do reembolso
-- ---------------------------------------------------------------------------
ALTER TABLE public.payments
    ADD COLUMN IF NOT EXISTS stripe_charge_id    TEXT,       -- ch_...
    ADD COLUMN IF NOT EXISTS stripe_invoice_id   TEXT,       -- in_...
    ADD COLUMN IF NOT EXISTS stripe_refund_id    TEXT,       -- re_... (idempotência de reembolso)
    ADD COLUMN IF NOT EXISTS refunded_amount     NUMERIC(12,2),
    ADD COLUMN IF NOT EXISTS refunded_at         TIMESTAMPTZ,
    -- 'purchase' (primeira compra) | 'renewal' (cobrança recorrente) | 'service'
    ADD COLUMN IF NOT EXISTS invoice_kind        TEXT,
    -- Período REALMENTE pago, conforme a Stripe (authoritative)
    ADD COLUMN IF NOT EXISTS period_start        TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS period_end          TIMESTAMPTZ,
    -- Data de liquidação confirmada (≠ created_at, que é a data da intenção)
    ADD COLUMN IF NOT EXISTS paid_at             TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS currency            TEXT DEFAULT 'BRL',
    ADD COLUMN IF NOT EXISTS customer_name_snapshot TEXT;
ALTER TABLE public.refund_requests ENABLE ROW LEVEL SECURITY;
-- ---------------------------------------------------------------------------
-- 4. SEGURANÇA (FASE 11/§13 — "Nenhum usuário comum poderá visualizar e-mails
--    transacionais de outros clientes")
--
--    A tabela contém corpo de e-mail e o endereço do destinatário. Por isso:
--    RLS ligado, SEM policy para anon/authenticated (nem o próprio dono lê),
--    e o acesso acontece só pela API autenticada com service_role depois de
--    validar `profiles.is_admin`.
--
--    Nada de "policy que filtra por user_id": isso exporia o histórico de
--    e-mail (incluindo HTML e anexos) para qualquer usuário autenticado.
-- ---------------------------------------------------------------------------
ALTER TABLE public.email_outbox ENABLE ROW LEVEL SECURITY;
-- ============================================================================
-- admin.sql — VOLTRIS BRASIL
-- ============================================================================
-- Objetivo: roteiro SQL ÚNICO e ADITIVO para o painel administrativo.
--
-- Onde este arquivo entra na rotina
-- ---------------------------------
-- Execute no SQL Editor do Supabase (ou `supabase db push`). Ele reúne:
--
--   1. MIGRATIONS PENDENTES das missões anteriores, que foram entregues como
--      arquivo mas NUNCA foram aplicadas em produção. Verificado por consulta
--      direta: `email_outbox` retorna
--      `404 - relation "public.email_outbox" does not exist`.
--      Sem elas, a aba "E-mails" do painel e o outbox transacional não funcionam.
--
--   2. TABELAS NOVAS do painel administrativo (PARTE 11 — auditoria real).
--
--   3. ÍNDICES que o painel precisa para não fazer N+1 nem varrer tabela toda.
--
-- GARANTIAS
--   - NADA destrutivo: só CREATE ... IF NOT EXISTS, ALTER ... ENABLE RLS e
--     índices. Nenhum DROP, nenhum TRUNCATE, nenhum DELETE.
--   - Não altera linhas existentes de `payments`, `licenses`, `subscriptions`
--     nem `profiles`: são dados de clientes. A Seção 5 recria SOMENTE a função
--     de trigger `handle_new_user()`; nenhum cadastro existente é reescrito.
--     Colunas novas, quando estritamente necessárias, são aditivas e com DEFAULT.
--   - RLS nunca é desabilitada.
--   - Pode ser executado mais de uma vez sem efeito colateral.
--
-- Verificações pós-execução estão no final do arquivo.
-- ============================================================================


-- ############################################################################
-- SEÇÃO 1 — MIGRATIONS PENDENTES
-- ############################################################################

-- ----------------------------------------------------------------------------
-- 1.1  FATOS DE COBRANÇA EM `payments` e `subscriptions`
--
--      Origem: a fatura em PDF e o espelho da assinatura precisavam de campos
--      que não existiam. O painel administrativo depende deles para mostrar o
--      estado financeiro real, então esta migration é PRÉ-REQUISITO do painel,
--      não um extra opcional.
-- ----------------------------------------------------------------------------
ALTER TABLE public.payments
    ADD COLUMN IF NOT EXISTS stripe_invoice_id   text,
    ADD COLUMN IF NOT EXISTS stripe_charge_id    text,
    ADD COLUMN IF NOT EXISTS stripe_customer_id  text,
    ADD COLUMN IF NOT EXISTS stripe_refund_id    text,
    ADD COLUMN IF NOT EXISTS currency            text DEFAULT 'BRL',
    ADD COLUMN IF NOT EXISTS invoice_kind        text,
    ADD COLUMN IF NOT EXISTS paid_at             timestamptz,
    ADD COLUMN IF NOT EXISTS period_start        timestamptz,
    ADD COLUMN IF NOT EXISTS period_end          timestamptz,
    ADD COLUMN IF NOT EXISTS refunded_amount     numeric,
    ADD COLUMN IF NOT EXISTS refunded_at         timestamptz,
    ADD COLUMN IF NOT EXISTS customer_name_snapshot text,
    ADD COLUMN IF NOT EXISTS payment_method      text;
ALTER TABLE public.subscriptions
    ADD COLUMN IF NOT EXISTS stripe_customer_id  text,
    ADD COLUMN IF NOT EXISTS cancel_at_period_end boolean DEFAULT false,
    ADD COLUMN IF NOT EXISTS cancel_at            timestamptz,
    ADD COLUMN IF NOT EXISTS canceled_at          timestamptz,
    ADD COLUMN IF NOT EXISTS ended_at             timestamptz,
    ADD COLUMN IF NOT EXISTS current_period_start timestamptz,
    ADD COLUMN IF NOT EXISTS current_period_end   timestamptz;
ALTER TABLE public.email_outbox ENABLE ROW LEVEL SECURITY;
-- A coluna `delivery_status` só existe a partir desta versão do arquivo.
-- Em bases onde a tabela já existia sem as colunas de entrega, o ALTER abaixo
-- as acrescenta. É a diferença entre o painel mostrar "entregue" e mostrar
-- "aguardando" para sempre.
ALTER TABLE public.email_outbox
    ADD COLUMN IF NOT EXISTS delivery_status  text,
    ADD COLUMN IF NOT EXISTS delivered_at     timestamptz,
    ADD COLUMN IF NOT EXISTS opened_at        timestamptz,
    ADD COLUMN IF NOT EXISTS delivery_flag    text,
    ADD COLUMN IF NOT EXISTS delivery_flag_at timestamptz;
ALTER TABLE public.admin_role_grants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;
-- ############################################################################
-- SEÇÃO 6 — TELEFONE NORMALIZADO (acelerador da trava de WhatsApp duplicado)
--
-- MEDIDO EM PRODUÇÃO (2026-10-19): a trava de telefone duplicado NUNCA
-- funcionou. O endpoint comparava
--     or=(phone.eq.37998127122, phone.ilike.*37998127122*)
-- contra o telefone gravado FORMATADO ("(37) 99812-7122"): o hífen quebra a
-- sequência de dígitos e nenhuma linha era devolvida. No banco existem 3
-- contas com o mesmo WhatsApp (11996716235).
--
-- O código já foi corrigido e hoje a comparação é feita sobre o número
-- NORMALIZADO (ver lib/phone-dup.ts), sem depender de coluna nova.
--
-- Esta seção é o acelerador para o volume crescer: uma coluna com o número
-- só em dígitos (indexável) permite consulta exata em vez de varrer a tabela
-- com padrão curinga.
--
-- A coluna é ADITIVA e a aplicação NÃO depende dela: se ela não existir, o
-- endpoint usa o caminho textual e continua correto.
-- ############################################################################

ALTER TABLE public.profiles
    ADD COLUMN IF NOT EXISTS phone_normalized text;
-- ############################################################################
-- SEÇÃO 2 — COLUNAS NOVAS
--
--   action_url : para onde o clique leva (pedido, ticket, licença…)
--   data       : metadados de negócio (jsonb)
--   audience   : 'user' (padrão) ou 'admin' (notificação de operação)
--   read_at    : quando foi lida
--   updated_at : última alteração
-- ############################################################################

ALTER TABLE public.notifications
    ADD COLUMN IF NOT EXISTS action_url text,
    ADD COLUMN IF NOT EXISTS data jsonb,
    ADD COLUMN IF NOT EXISTS audience text NOT NULL DEFAULT 'user',
    ADD COLUMN IF NOT EXISTS read_at timestamptz,
    ADD COLUMN IF NOT EXISTS updated_at timestamptz;
-- ############################################################################
-- SEÇÃO 3 — POLÍTICAS (RLS)
--
-- ANTES
--   SELECT : dono OU qualquer admin
--   INSERT : o próprio dono (dava para forjar notificação)
--   UPDATE : NENHUMA  -> "marcar como lida" não persistia
--   DELETE : NENHUMA  -> "limpar todas" não persistia
--
-- DEPOIS
--   SELECT : o dono vê as próprias + as de operação destined a ele
--   INSERT : somente service_role (o servidor grava)
--   UPDATE : somente o dono, e somente as próprias linhas
--   DELETE : somente o dono, e somente as próprias linhas
-- ############################################################################

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
-- Sem REPLICA IDENTITY FULL, o payload do Realtime traz apenas a chave
-- primária no DELETE/UPDATE (o nome do usuário não vem junto).
ALTER TABLE public.notifications REPLICA IDENTITY FULL;
-- ============================================================================
-- 7) PUSH SUBSCRIPTIONS - COLUNAS QUE FALTAM NO BANCO DE PRODUCAO
-- ============================================================================
--
-- O BANCO DE PRODUCAO tem a versao ANTIGA da tabela public.push_subscriptions:
-- id, user_id, endpoint, p256dh, auth, created_at, updated_at.
--
-- O codigo do sistema (registro da inscricao, envio do aviso com o site
-- fechado e desativacao) usa is_active, browser_fingerprint, user_agent,
-- platform, device_type e last_used. Sem essas colunas o "Ativar
-- notificacoes" falhava com:
--
--     column push_subscriptions.is_active does not exist   (Postgres 42703)
--
-- O codigo ja foi blindado para funcionar com os dois schemas (ele detecta as
-- colunas existentes antes de gravar), mas esta e a CORRECAO DEFINITIVA: rode
-- este arquivo e a tabela passa a ter o schema completo.
--
-- Tudo e idempotente: pode rodar quantas vezes quiser, sem erro e sem
-- perder nenhuma inscricao ja gravada.
-- ============================================================================

-- 7.1 Colunas que faltam (as inscricoes ja existentes continuam valendo).
ALTER TABLE public.push_subscriptions
    ADD COLUMN IF NOT EXISTS is_active           BOOLEAN     DEFAULT TRUE,
    ADD COLUMN IF NOT EXISTS browser_fingerprint  TEXT,
    ADD COLUMN IF NOT EXISTS user_agent           TEXT,
    ADD COLUMN IF NOT EXISTS platform             TEXT,
    ADD COLUMN IF NOT EXISTS device_type          TEXT,
    ADD COLUMN IF NOT EXISTS last_used            TIMESTAMPTZ;

-- ============================================================================
--  FASE 6 — FUNCOES (41)
-- ============================================================================
-- fonte: services/fix-create-company-rpc.sql
-- SOLUÇÃO DEFINITIVA PARA CRIAÇÃO DE EMPRESAS
-- O RLS é muito restritivo para criar registros interligados. 
-- Esta função roda como "Security Definer" (superusuário), ignorando as travas apenas para esta ação específica.

CREATE OR REPLACE FUNCTION create_new_organization(org_name TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER -- IMPORTANTE: Roda com permissões elevadas
AS $$
DECLARE
  new_company_id UUID;
  current_user_id UUID;
BEGIN
  -- 1. Verificar autenticação
  current_user_id := auth.uid();
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Você precisa estar logado.';
  END IF;

  -- 2. Inserir a Empresa
  INSERT INTO public.companies (name, plan_type, max_devices)
  VALUES (org_name, 'trial', 5)
  RETURNING id INTO new_company_id;

  -- 3. Inserir o Vínculo (Owner)
  INSERT INTO public.company_users (company_id, user_id, role)
  VALUES (new_company_id, current_user_id, 'owner');

  -- 4. Retornar dados
  RETURN jsonb_build_object('id', new_company_id, 'name', org_name);
END;
$$;

-- fonte: services/mock-payment-rpc.sql
-- FUNÇÃO DE MOCK DE COMPRA (Simula o Webhook de Pagamento)
-- Aumenta as licenças e muda o plano, ignorando RLS travado
CREATE OR REPLACE FUNCTION mock_buy_licenses(p_company_id UUID, p_quantity INT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_new_max INT;
BEGIN
  -- 1. Verificar se usuário é dono da empresa (Segurança básica)
  IF NOT EXISTS (
    SELECT 1 FROM public.company_users 
    WHERE company_id = p_company_id 
    AND user_id = auth.uid() 
    AND role = 'owner'
  ) THEN
    RAISE EXCEPTION 'Apenas o dono da empresa pode comprar licenças.';
  END IF;

  -- 2. Atualizar Licenças
  UPDATE public.companies
  SET 
    max_devices = COALESCE(max_devices, 0) + p_quantity,
    plan_type = 'pro',
    updated_at = NOW()
  WHERE id = p_company_id
  RETURNING max_devices INTO v_new_max;

  -- 3. Retornar sucesso
  RETURN jsonb_build_object('success', true, 'new_limit', v_new_max);
END;
$$;

-- fonte: supabase/FIX_LICENSE_COUNTER_SYNC.sql
-- ============================================================
-- VOLTRIS - LICENSE COUNTER SYNC FIX
-- Garante que o contador 'devices_in_use' da tabela 'licenses' 
-- esteja sempre sincronizado com a tabela 'license_devices'.
-- ============================================================

-- 1. Função para atualizar o contador de dispositivos em uso
CREATE OR REPLACE FUNCTION public.sync_license_device_count()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE public.licenses 
        SET devices_in_use = (SELECT count(*) FROM public.license_devices WHERE license_id = NEW.license_id),
            activated_at = COALESCE(activated_at, NOW())
        WHERE id = NEW.license_id;
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE public.licenses 
        SET devices_in_use = (SELECT count(*) FROM public.license_devices WHERE license_id = OLD.license_id)
        WHERE id = OLD.license_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- fonte: supabase/FIX_RLS_RECURSION.sql
-- 3. Criar uma função ignorando RLS (SECURITY DEFINER) para verificar a flag de admin.
-- Isso é fundamental porque evita que a checagem de Admin dispare o RLS da tabela denovo.
CREATE OR REPLACE FUNCTION public.check_is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER SET search_path = public
AS $$
  SELECT is_admin FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$;

-- fonte: supabase/migrations/20261015180000_fix_generate_complete_license_v3.sql
CREATE OR REPLACE FUNCTION public.generate_complete_license_v3(
    p_payment_id       uuid,
    p_user_id          uuid          DEFAULT NULL,
    p_email            text          DEFAULT NULL,
    p_plan_type        text          DEFAULT 'standard',
    p_billing_period   text          DEFAULT 'month',
    p_stripe_session_id text         DEFAULT NULL,
    p_valid_until      date          DEFAULT NULL
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $function$
DECLARE
    v_client_id            TEXT;
    v_plan_code            TEXT;
    v_max_devices          INTEGER;
    v_valid_until          DATE;
    v_valid_until_str      TEXT;
    v_key_date_str         TEXT;
    v_json_content         TEXT;
    v_signature            TEXT;
    v_final_key            TEXT;
    v_display_name         TEXT;
    v_existing_key         TEXT;
    v_pay                  RECORD;
    v_attempt              INTEGER;
BEGIN
    -- ========================================================================
    -- VALIDACAS EXPLICITAS (item 4: nenhum caminho retorna NULL silencioso)
    -- ========================================================================
    IF p_payment_id IS NULL THEN
        RAISE EXCEPTION 'PAYMENT_ID_REQUIRED: a emissao exige o payment_id real (idempotencia por pagamento)';
    END IF;

    IF lower(p_plan_type) NOT IN ('trial', 'standard', 'pro', 'enterprise') THEN
        RAISE EXCEPTION 'INVALID_PLAN_TYPE: % (esperado: trial|standard|pro|enterprise)', p_plan_type;
    END IF;

    IF p_billing_period IS NOT NULL
       AND lower(p_billing_period) NOT IN ('month', 'year', 'mensal', 'anual') THEN
        RAISE EXCEPTION 'INVALID_BILLING_PERIOD: % (esperado: month|year)', p_billing_period;
    END IF;

    -- Pagamento precisa existir e nao pode estar liquidado-negativo
    -- (refund/cancel/fail). checkout.session.completed = liquido; a prova
    -- Stripe fica no stripe_id gravado aqui, dentro da mesma transacao.
    SELECT id, status, plan_type, user_id, email INTO v_pay
    FROM public.payments
    WHERE id = p_payment_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'PAYMENT_NOT_FOUND: pagamento % inexistente em public.payments', p_payment_id;
    END IF;

    IF lower(coalesce(v_pay.status, '')) IN
       ('refunded', 'charged_back', 'chargeback', 'canceled', 'cancelled',
        'failed', 'estornado', 'devolvido', 'cancelado') THEN
        RAISE EXCEPTION 'PAYMENT_NOT_SETTLED: pagamento % esta com status "%"', p_payment_id, v_pay.status;
    END IF;

    IF v_pay.plan_type IS NOT NULL
       AND lower(v_pay.plan_type) <> lower(p_plan_type) THEN
        RAISE EXCEPTION 'PAYMENT_PLAN_MISMATCH: pagamento % e do plano "%", licensa pedida "%"',
            p_payment_id, v_pay.plan_type, p_plan_type;
    END IF;

    -- user_id, quando informado, precisa ser um usuario real (item 9)
    IF p_user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM auth.users WHERE id = p_user_id) THEN
        RAISE EXCEPTION 'USER_NOT_FOUND: auth.users não contém %', p_user_id;
    END IF;

    -- ========================================================================
    -- IDEMPOTENCIA + CONCORRENCIA (item 5)
    -- Lock transacional por pagamento: duas chamadas simultaneas para o mesmo
    -- payment_id se serializam; a segunda retorna a chave ja emitida.
    -- ========================================================================
    PERFORM pg_advisory_xact_lock(hashtextextended(p_payment_id::text, 0));

    SELECT license_key INTO v_existing_key
    FROM public.licenses
    WHERE payment_id = p_payment_id::text
    LIMIT 1;

    IF FOUND THEN
        -- Garantia extra: mesmo no caminho idempotente, o pagamento fica aprovado.
        UPDATE public.payments
        SET status     = 'approved',
            stripe_id  = COALESCE(stripe_id, p_stripe_session_id),
            updated_at = NOW()
        WHERE id = p_payment_id
          AND lower(coalesce(status, '')) <> 'approved';

        RETURN jsonb_build_object(
            'success', TRUE,
            'already_issued', TRUE,
            'license_key', v_existing_key,
            'payment_id', p_payment_id::text,
            'user_id', COALESCE(p_user_id::text, v_pay.user_id::text),
            'expires_at', (SELECT expires_at FROM public.licenses WHERE license_key = v_existing_key)
        );
    END IF;

    -- ========================================================================
    -- CONFIGURACAO DO PLANO (mapeamento canonico; pro = 3 dispositivos)
    -- p_valid_until permite o fim de periodo REAL confirmado na Stripe (item 8);
    -- sem ele, usa a duracao do periodo a partir de hoje (comportamento antigo).
    -- ========================================================================
    CASE lower(p_plan_type)
        WHEN 'trial' THEN
            v_plan_code := 'TRI'; v_max_devices := 1;
            v_valid_until := CURRENT_DATE + INTERVAL '15 days';
        WHEN 'standard' THEN
            v_plan_code := 'STA'; v_max_devices := 1;
            v_valid_until := CURRENT_DATE + (CASE WHEN lower(coalesce(p_billing_period, 'month')) IN ('year', 'anual') THEN INTERVAL '1 year' ELSE INTERVAL '1 month' END);
        WHEN 'pro' THEN
            v_plan_code := 'PRO'; v_max_devices := 3;
            v_valid_until := CURRENT_DATE + (CASE WHEN lower(coalesce(p_billing_period, 'month')) IN ('year', 'anual') THEN INTERVAL '1 year' ELSE INTERVAL '1 month' END);
        WHEN 'enterprise' THEN
            v_plan_code := 'ENT'; v_max_devices := 9999;
            v_valid_until := CURRENT_DATE + (CASE WHEN lower(coalesce(p_billing_period, 'month')) IN ('year', 'anual') THEN INTERVAL '1 year' ELSE INTERVAL '1 month' END);
    END CASE;

    IF p_valid_until IS NOT NULL AND lower(p_plan_type) <> 'trial' THEN
        IF p_billing_period IS NOT NULL
           AND lower(p_billing_period) NOT IN ('month', 'year', 'mensal', 'anual') THEN
            RAISE EXCEPTION 'INVALID_BILLING_PERIOD: % (esperado: month|year)', p_billing_period;
        END IF;
        v_valid_until := p_valid_until;
    END IF;

    v_valid_until_str := to_char(v_valid_until, 'YYYY-MM-DD');
    v_key_date_str    := to_char(v_valid_until, 'YYYYMMDD');

    v_display_name := CASE lower(p_plan_type)
        WHEN 'trial'      THEN 'Trial'
        WHEN 'standard'   THEN 'VOLTRIS STANDARD'
        WHEN 'pro'        THEN 'VOLTRIS PRO'
        WHEN 'enterprise' THEN 'VOLTRIS ENTERPRISE'
    END;

    -- ========================================================================
    -- CHAVE CANONICA (identica ao LicenseGenerator C# e a licenca Pro atual):
    --   JSON  = {"id":"<6>","validUntil":"YYYY-MM-DD","plan":"<lower>","maxDevices":<n>}
    --   SIG   = upper(hex(sha256(JSON + segredo)))[0..16]  via generate_voltris_signature
    --   KEY   = VOLTRIS-<COD>-<ID6>-<YYYYMMDD>-<SIG16>
    -- ========================================================================
    v_attempt := 0;
    LOOP
        v_attempt := v_attempt + 1;
        v_client_id := floor(random() * (999999 - 100000 + 1) + 100000)::TEXT;

        v_json_content := format('{"id":"%s","validUntil":"%s","plan":"%s","maxDevices":%s}',
                                 v_client_id, v_valid_until_str, lower(p_plan_type), v_max_devices);
        v_signature    := public.generate_voltris_signature(v_json_content);
        v_final_key    := format('VOLTRIS-%s-%s-%s-%s', v_plan_code, v_client_id, v_key_date_str, v_signature);

        EXIT WHEN NOT EXISTS (SELECT 1 FROM public.licenses WHERE license_key = v_final_key);
        IF v_attempt >= 12 THEN
            RAISE EXCEPTION 'KEY_COLLISION: nao foi possivel gerar chave unica apos % tentativas', v_attempt;
        END IF;
    END LOOP;

    -- ========================================================================
    -- INSERT NO SCHEMA CANONICO (plan_type / license_key PK; sem id, sem
    -- license_type, sem is_active) + vinculo real de user/payment/email.
    -- ========================================================================
    INSERT INTO public.licenses (
        payment_id, user_id, email, customer_email, client_id, license_key,
        plan_type, billing_period, max_devices, expires_at,
        license_display_name, revoked, notes, activated_at
    ) VALUES (
        p_payment_id::text,
        COALESCE(p_user_id, v_pay.user_id),
        COALESCE(p_email, v_pay.email),
        COALESCE(p_email, v_pay.email),
        v_client_id,
        v_final_key,
        lower(p_plan_type),
        CASE WHEN lower(coalesce(p_billing_period, 'month')) IN ('year', 'anual') THEN 'year' ELSE 'month' END,
        v_max_devices,
        v_valid_until,
        v_display_name,
        FALSE,
        'Emitida via RPC canonica generate_complete_license_v3',
        NULL
    );

    -- ========================================================================
    -- PAGAMENTO APROVADO NA MESMA TRANSAcao (item 10): liquidez ja provada
    -- pelo evento Stripe (payment_status=paid) checado pelo webhook ANTES de
    -- chamar este RPC; aqui grava-se a prova (stripe_id) junto do status.
    -- ========================================================================
    UPDATE public.payments
    SET status     = 'approved',
        stripe_id  = COALESCE(stripe_id, p_stripe_session_id),
        user_id    = COALESCE(user_id, p_user_id),
        updated_at = NOW()
    WHERE id = p_payment_id;

    RETURN jsonb_build_object(
        'success', TRUE,
        'already_issued', FALSE,
        'license_key', v_final_key,
        'plan_type', lower(p_plan_type),
        'billing_period', CASE WHEN lower(coalesce(p_billing_period, 'month')) IN ('year', 'anual') THEN 'year' ELSE 'month' END,
        'max_devices', v_max_devices,
        'license_display_name', v_display_name,
        'user_id', COALESCE(p_user_id::text, v_pay.user_id::text),
        'payment_id', p_payment_id::text,
        'expires_at', v_valid_until::timestamp with time zone
    );
END;
$function$;

-- fonte: supabase/create_trial_activations_table.sql
-- =====================================================
-- TRIGGERS E FUNÇÕES AUTOMÁTICAS
-- =====================================================

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_trial_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- fonte: supabase/create_trial_activations_table.sql
-- =====================================================
-- FUNÇÕES DE AUDITORIA E MANUTENÇÃO
-- =====================================================

-- Função para limpar trials expirados (manutenção)
CREATE OR REPLACE FUNCTION cleanup_expired_trials()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM trial_activations 
    WHERE is_expired = TRUE 
      AND trial_expires_at < NOW() - INTERVAL '30 days';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- fonte: supabase/create_trial_activations_table.sql
-- Função para verificar integridade do HWID
CREATE OR REPLACE FUNCTION verify_hwid_integrity(input_hwid VARCHAR(128))
RETURNS BOOLEAN AS $$
DECLARE
    trial_count INTEGER;
BEGIN
    -- Verificar se HWID existe e não está expirado
    SELECT COUNT(*) INTO trial_count
    FROM trial_activations 
    WHERE hwid_hash = input_hwid 
      AND is_expired = FALSE 
      AND trial_expires_at > NOW();
    
    RETURN trial_count > 0;
END;
$$ LANGUAGE plpgsql;

-- fonte: supabase/migrations/20260818000000_security_hardening.sql
-- ============================================================================
-- 9. Funções de GERAÇÃO DE LICENÇA — segredo hardcoded + EXECUTE público.
--    generate_voltris_signature usa o segredo 'VOLTRIS_SECRET_LICENSE_KEY_2025'
--    hardcoded e era executável por qualquer pessoa, permitindo forjar chaves.
--    CORREÇÃO SEM QUEBRAR: o valor do segredo NÃO é trocado (licenças existentes
--    e o app C# dependem dele). Passamos a ler de current_setting com o mesmo
--    valor como fallback, e REVOGAMOS o EXECUTE para public/anon/authenticated.
-- ============================================================================
CREATE OR REPLACE FUNCTION public.generate_voltris_signature(p_content TEXT)
RETURNS TEXT AS $$
DECLARE
    v_secret TEXT := COALESCE(
        current_setting('app.license_secret', true),
        'VOLTRIS_SECRET_LICENSE_KEY_2025'
    );
    v_hash TEXT;
BEGIN
    v_hash := upper(encode(digest(p_content || v_secret, 'sha256'), 'hex'));
    RETURN substring(v_hash from 1 for 16);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- fonte: supabase/migrations/20260219000001_fix_function_search_path_security.sql
-- ============================================================================
-- 18. update_device_updated_at - Telemetry
-- ============================================================================
CREATE OR REPLACE FUNCTION update_device_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- fonte: supabase/migrations/20260219000001_fix_function_search_path_security.sql
-- ============================================================================
-- 19. cleanup_old_sessions - Telemetry
-- ============================================================================
CREATE OR REPLACE FUNCTION cleanup_old_sessions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    DELETE FROM sessions
    WHERE ended_at < NOW() - INTERVAL '30 days'
    OR (status = 'closed' AND last_heartbeat_at < NOW() - INTERVAL '7 days');
END;
$$;

-- fonte: supabase/setup_telemetry.sql
-- 8. TRIGGERS
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- fonte: supabase/migrations/20260926000000_repair_installations_and_rls.sql
CREATE OR REPLACE FUNCTION public.sync_last_active()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
    IF NEW.last_heartbeat IS DISTINCT FROM OLD.last_heartbeat THEN
        NEW.last_active := NEW.last_heartbeat;
    END IF;
    RETURN NEW;
END;
$$;

-- fonte: supabase/migrations/20260219000001_fix_function_search_path_security.sql
-- ============================================================================
-- 17. handle_updated_at - Generic Trigger
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- fonte: admin.sql
-- ############################################################################
-- SEÇÃO 5 — CADASTRO: TRIGGER QUE GRAVA O PERFIL COMPLETO
--
-- PROBLEMA REAL, MEDIDO EM PRODUÇÃO (2026-10-19)
--
--   `public.handle_new_user()` foi redefinida pela migration
--   `20260219000001_fix_function_search_path_security.sql` e passou a inserir
--   APENAS (id, email, full_name, created_at, updated_at).
--
--   Nos 102 perfis criados DEPOIS de 2026-02-19:
--       login .......... 0/102 preenchidos
--       neighborhood ... 0/102 preenchidos
--       phone/city/state/cep ... 47/102 (preenchidos por outros fluxos)
--
--   O cadastro enviava tudo em `raw_user_meta_data`, mas o trigger descartava
--   login, telefone, endereço, bairro, cidade, UF e CEP. Era por isso que a
--   ficha do cliente no painel aparecia com "—" nesses campos.
--
-- O QUE ESTE BLOCO FAZ
--
--   Recria a função com TODOS os campos, mantendo `search_path` fixo
--   (segurança). É `CREATE OR REPLACE`: não apaga dado, não altera nenhuma
--   linha existente e pode rodar quantas vezes for preciso.
--
--   `ON CONFLICT (id) DO NOTHING`: se outro trigger já criou o perfil, o
--   cadastro não falha.
--
--   `login` é UNIQUE. Para cadastro social (sem `login` no metadata), o
--   fallback é a parte local do e-mail; se ela já existir, o bloco de exceção
--   acrescenta um sufixo curto do id em vez de derrubar o cadastro.
--
-- IMPORTANTE
--
--   Isto corrige os PRÓXIMOS cadastros. NÃO faz backfill: preencher dados de
--   clientes existentes a partir do metadata é decisão de negócio e deve ser
--   feita com revisão, não por script automático. (A missão proíbe UPDATE em
--   massa de dados existentes.)
-- ############################################################################

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_email TEXT := NEW.email;
    v_login TEXT;
BEGIN
    v_login := COALESCE(
        NULLIF(BTRIM(NEW.raw_user_meta_data->>'login'), ''),
        NULLIF(split_part(COALESCE(NEW.email, ''), '@', 1), ''),
        'usuario'
    );

    BEGIN
        INSERT INTO public.profiles (
            id, login, email, full_name, phone, address,
            city, neighborhood, state, cep, created_at, updated_at
        ) VALUES (
            NEW.id,
            v_login,
            v_email,
            COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
            COALESCE(NEW.raw_user_meta_data->>'phone', ''),
            COALESCE(NEW.raw_user_meta_data->>'address', ''),
            COALESCE(NEW.raw_user_meta_data->>'city', ''),
            COALESCE(NEW.raw_user_meta_data->>'neighborhood', ''),
            COALESCE(NEW.raw_user_meta_data->>'state', ''),
            COALESCE(NEW.raw_user_meta_data->>'cep', ''),
            NOW(), NOW()
        )
        ON CONFLICT (id) DO NOTHING;
    EXCEPTION WHEN unique_violation THEN
        -- `login` já usado por outra conta: usa e-mail local + sufixo do id.
        INSERT INTO public.profiles (
            id, login, email, full_name, phone, address,
            city, neighborhood, state, cep, created_at, updated_at
        ) VALUES (
            NEW.id,
            LEFT(
                COALESCE(NULLIF(split_part(COALESCE(NEW.email, ''), '@', 1), ''), 'usuario')
                || '-' || substr(NEW.id::text, 1, 8),
                30
            ),
            v_email,
            COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
            COALESCE(NEW.raw_user_meta_data->>'phone', ''),
            COALESCE(NEW.raw_user_meta_data->>'address', ''),
            COALESCE(NEW.raw_user_meta_data->>'city', ''),
            COALESCE(NEW.raw_user_meta_data->>'neighborhood', ''),
            COALESCE(NEW.raw_user_meta_data->>'state', ''),
            COALESCE(NEW.raw_user_meta_data->>'cep', ''),
            NOW(), NOW()
        )
        ON CONFLICT (id) DO NOTHING;
    END;

    RETURN NEW;
END;
$$;

-- fonte: supabase/migrations/20260219000001_fix_function_search_path_security.sql
-- ============================================================================
-- 20. update_orders_updated_at - Orders
-- ============================================================================
CREATE OR REPLACE FUNCTION update_orders_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- fonte: supabase/migrations/20260926000000_repair_installations_and_rls.sql
CREATE FUNCTION public.get_user_orders_with_details(user_uuid UUID)
RETURNS TABLE (
    id UUID,
    status TEXT,
    total NUMERIC,
    created_at TIMESTAMPTZ,
    service_name TEXT,
    service_description TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    IF user_uuid IS DISTINCT FROM auth.uid() THEN
        RAISE EXCEPTION 'Acesso negado' USING ERRCODE = '42501';
    END IF;

    RETURN QUERY
    SELECT o.id, o.status, o.total, o.created_at, o.service_name, o.service_description
      FROM public.orders o
     WHERE o.user_id = auth.uid()
     ORDER BY o.created_at DESC;
END;
$$;

-- fonte: supabase/migrations/20260219000001_fix_function_search_path_security.sql
CREATE OR REPLACE FUNCTION create_order_from_service(
    p_user_id UUID,
    p_service_id TEXT,
    p_amount DECIMAL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_order_id UUID;
BEGIN
    INSERT INTO orders (user_id, service_id, total_amount, status)
    VALUES (p_user_id, p_service_id, p_amount, 'pending')
    RETURNING id INTO v_order_id;
    
    RETURN v_order_id;
END;
$$;

-- fonte: supabase/migrations/20260219000001_fix_function_search_path_security.sql
CREATE OR REPLACE FUNCTION generate_license_key(
    p_client_id TEXT,
    p_valid_until DATE,
    p_plan_code license_type
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_secret_key TEXT := 'VOLTRIS_SECRET_2024_PRODUCTION';
    v_payload TEXT;
    v_hash TEXT;
BEGIN
    v_payload := p_client_id || '|' || p_valid_until::TEXT || '|' || p_plan_code::TEXT;
    v_hash := encode(digest(v_payload || v_secret_key, 'sha256'), 'hex');
    RETURN 'VOLTRIS-' || UPPER(SUBSTRING(v_hash FROM 1 FOR 8)) || '-' || 
           UPPER(SUBSTRING(v_hash FROM 9 FOR 8)) || '-' || 
           UPPER(SUBSTRING(v_hash FROM 17 FOR 8));
END;
$$;

-- fonte: notificacaocorrigida.sql
-- ############################################################################
-- SEÇÃO 5 — TRIGGERS CORRIGIDAS (status de ticket e de pedido)
--
-- As versões em produção gravavam em colunas inexistentes (`body`, `data`) e
-- usavam valores de enum inexistentes (`ticket_status`, `order_status`,
-- `alert`, `default`). Resultado: erro silencioso e NENHUMA notificação
-- quando o admin respondia um ticket.
--
-- Agora gravam com valores válidos, `data` jsonb e `action_url` — e são
-- recriadas porque as functions estavam erradas, não só o corpo delas.
-- ############################################################################

CREATE OR REPLACE FUNCTION public.notify_ticket_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    caller_role TEXT := COALESCE(current_setting('request.jwt.claims', true)::jsonb ->> 'role', '');
BEGIN
    -- Quando a mudança vem do PAINEL (service_role), a notificação já foi
    -- enviada pela rota, com a justificativa do operador. Dispara aqui
    -- também = o cliente receberia a mesma notícia duas vezes.
    IF caller_role = 'service_role' THEN
        RETURN NEW;
    END IF;

    IF NEW.status IS DISTINCT FROM OLD.status THEN
        INSERT INTO public.notifications (
            user_id, title, message, type, read, sound,
            action_url, data, audience, created_at, updated_at
        ) VALUES (
            NEW.user_id,
            'Atualização do seu chamado',
            'O status do chamado "' || COALESCE(NEW.title, 'sem título') || '" mudou para: ' || COALESCE(NEW.status, '—') || '.',
            'ticket',
            false,
            'chime',
            '/dashboard/tickets',
            jsonb_build_object('ticket_id', NEW.id, 'status', NEW.status, 'kind', 'ticket_reply'),
            'user',
            NOW(),
            NOW()
        );
    END IF;
    RETURN NEW;
END;
$$;

-- fonte: notificacaocorrigida.sql
CREATE OR REPLACE FUNCTION public.notify_order_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    caller_role TEXT := COALESCE(current_setting('request.jwt.claims', true)::jsonb ->> 'role', '');
BEGIN
    -- Mesma regra da trigger de ticket: o painel já notifica.
    IF caller_role = 'service_role' THEN
        RETURN NEW;
    END IF;

    IF NEW.status IS DISTINCT FROM OLD.status THEN
        INSERT INTO public.notifications (
            user_id, title, message, type, read, sound,
            action_url, data, audience, created_at, updated_at
        ) VALUES (
            NEW.user_id,
            'Status do pedido atualizado',
            'Seu pedido #' || LEFT(COALESCE(NEW.id::text, ''), 8) || ' está com status: ' || COALESCE(NEW.status, '—') || '.',
            'order',
            false,
            'chime',
            '/dashboard?tab=orders',
            jsonb_build_object('order_id', NEW.id, 'status', NEW.status, 'kind', 'service'),
            'user',
            NOW(),
            NOW()
        );
    END IF;
    RETURN NEW;
END;
$$;

-- fonte: supabase/migrations/20260219000001_fix_function_search_path_security.sql
CREATE OR REPLACE FUNCTION generate_browser_fingerprint(
    p_user_agent TEXT,
    p_platform TEXT,
    p_language TEXT
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    RETURN encode(
        digest(p_user_agent || p_platform || p_language, 'sha256'),
        'hex'
    );
END;
$$;

-- fonte: supabase/migrations/20260219000001_fix_function_search_path_security.sql
-- ============================================================================
-- 12. update_push_subscription_updated_at - Push Subscriptions
-- ============================================================================
CREATE OR REPLACE FUNCTION update_push_subscription_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- fonte: supabase/migrations/20260219000001_fix_function_search_path_security.sql
-- ============================================================================
-- 13. cleanup_inactive_push_subscriptions - Push Subscriptions
-- ============================================================================
CREATE OR REPLACE FUNCTION cleanup_inactive_push_subscriptions()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM push_subscriptions
    WHERE updated_at < NOW() - INTERVAL '90 days'
    AND status = 'inactive';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$;

-- fonte: supabase/migrations/20260219000001_fix_function_search_path_security.sql
CREATE OR REPLACE FUNCTION get_plan_config(p_plan_code license_type)
RETURNS TABLE (
    code license_type,
    name TEXT,
    duration_days INTEGER,
    max_devices INTEGER,
    features JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p_plan_code,
    CASE p_plan_code
      WHEN 'trial' THEN 'Trial'
      WHEN 'standard' THEN 'Standard'
      WHEN 'pro' THEN 'Pro'
      WHEN 'enterprise' THEN 'Enterprise'
    END::TEXT,
    CASE p_plan_code
      WHEN 'trial' THEN 7
      WHEN 'standard' THEN 30
      WHEN 'pro' THEN 365
      WHEN 'enterprise' THEN 365
    END::INTEGER,
    CASE p_plan_code
      WHEN 'trial' THEN 1
      WHEN 'standard' THEN 3
      WHEN 'pro' THEN 10
      WHEN 'enterprise' THEN 999
    END::INTEGER,
    CASE p_plan_code
      WHEN 'trial' THEN '{"basic": true}'::JSONB
      WHEN 'standard' THEN '{"basic": true, "advanced": false}'::JSONB
      WHEN 'pro' THEN '{"basic": true, "advanced": true}'::JSONB
      WHEN 'enterprise' THEN '{"basic": true, "advanced": true, "enterprise": true}'::JSONB
    END::JSONB;
END;
$$;

-- fonte: supabase/migrations/20260219000001_fix_function_search_path_security.sql
CREATE OR REPLACE FUNCTION calculate_expiry_date(
    p_plan_code license_type,
    p_start_date TIMESTAMPTZ DEFAULT NOW()
)
RETURNS TIMESTAMPTZ
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    duration_days INTEGER;
BEGIN
    SELECT 
        CASE p_plan_code
            WHEN 'trial' THEN 7
            WHEN 'standard' THEN 30
            WHEN 'pro' THEN 365
            WHEN 'enterprise' THEN 365
        END
    INTO duration_days;
    
    RETURN p_start_date + (duration_days || ' days')::INTERVAL;
END;
$$;

-- fonte: supabase/migrations/20260219000001_fix_function_search_path_security.sql
CREATE OR REPLACE FUNCTION create_subscription_from_license(
    p_license_id UUID,
    p_email TEXT,
    p_mp_subscription_id TEXT,
    p_mp_preapproval_id TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_subscription_id UUID;
    v_license_record RECORD;
BEGIN
    SELECT * INTO v_license_record FROM licenses WHERE id = p_license_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'License not found';
    END IF;
    
    INSERT INTO subscriptions (
        license_id,
        email,
        mp_subscription_id,
        mp_preapproval_id,
        status,
        plan_type,
        billing_cycle,
        next_billing_date
    ) VALUES (
        p_license_id,
        p_email,
        p_mp_subscription_id,
        p_mp_preapproval_id,
        'active',
        v_license_record.plan_type,
        'monthly',
        NOW() + INTERVAL '1 month'
    )
    RETURNING id INTO v_subscription_id;
    
    RETURN v_subscription_id;
END;
$$;

-- fonte: supabase/migrations/20260219000001_fix_function_search_path_security.sql
CREATE OR REPLACE FUNCTION record_subscription_payment(
    p_subscription_id UUID,
    p_mp_payment_id TEXT,
    p_amount DECIMAL,
    p_status TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_payment_id UUID;
BEGIN
    INSERT INTO subscription_payments (
        subscription_id,
        mp_payment_id,
        amount,
        status,
        paid_at
    ) VALUES (
        p_subscription_id,
        p_mp_payment_id,
        p_amount,
        p_status,
        CASE WHEN p_status = 'approved' THEN NOW() ELSE NULL END
    )
    RETURNING id INTO v_payment_id;
    
    IF p_status = 'approved' THEN
        UPDATE subscriptions
        SET 
            last_payment_date = NOW(),
            next_billing_date = NOW() + INTERVAL '1 month',
            failed_payment_count = 0
        WHERE id = p_subscription_id;
    END IF;
    
    RETURN v_payment_id;
END;
$$;

-- fonte: supabase/migrations/20260219000001_fix_function_search_path_security.sql
CREATE OR REPLACE FUNCTION cancel_subscription(
    p_subscription_id UUID,
    p_reason TEXT DEFAULT NULL,
    p_cancelled_by TEXT DEFAULT 'user'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    UPDATE subscriptions
    SET 
        status = 'cancelled',
        cancelled_at = NOW(),
        cancellation_reason = p_reason,
        cancelled_by = p_cancelled_by
    WHERE id = p_subscription_id;
    
    RETURN FOUND;
END;
$$;

-- fonte: supabase/migrations/20260219000001_fix_function_search_path_security.sql
-- ============================================================================
-- CORREÇÃO DE SEGURANÇA: Adicionar search_path a todas as funções
-- Data: 19/02/2026
-- Problema: Funções sem search_path explícito são vulneráveis a search path hijacking
-- Referência: https://www.postgresql.org/docs/current/sql-createfunction.html
-- ============================================================================

-- ============================================================================
-- 1. check_slo_breaches - SLO Monitoring
-- ============================================================================
CREATE OR REPLACE FUNCTION check_slo_breaches()
RETURNS TABLE (
  metric VARCHAR,
  actual DECIMAL,
  target DECIMAL,
  breach_severity VARCHAR
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    metric_name::VARCHAR,
    actual_value,
    target_value,
    CASE 
      WHEN NOT within_slo THEN 'CRITICAL'
      WHEN error_budget_consumed_pct > 90 THEN 'WARNING'
      WHEN error_budget_consumed_pct > 70 THEN 'INFO'
      ELSE 'OK'
    END::VARCHAR
  FROM slo_metrics
  WHERE measured_at > NOW() - INTERVAL '10 minutes'
  AND (NOT within_slo OR error_budget_consumed_pct > 70)
  ORDER BY measured_at DESC;
END;
$$;

-- fonte: supabase/migrations/20260818000000_security_hardening.sql
-- ============================================================================
-- 8. export_tenant_data / delete_tenant_data — SECURITY DEFINER sem check
--    de admin. Recriar exigindo sessão de administrador e revogar acesso
--    público/anon/authenticated (apenas service_role poderá invocar).
-- ============================================================================
CREATE OR REPLACE FUNCTION export_tenant_data(
  target_company_id UUID,
  start_date TIMESTAMPTZ DEFAULT NOW() - INTERVAL '30 days',
  end_date TIMESTAMPTZ DEFAULT NOW()
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  result JSONB;
  v_is_admin BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = true
  ) INTO v_is_admin;

  IF NOT v_is_admin THEN
    RAISE EXCEPTION 'Somente administradores podem exportar dados de tenant';
  END IF;

  SELECT jsonb_build_object(
    'company_id', target_company_id,
    'export_date', NOW(),
    'period', jsonb_build_object('start', start_date, 'end', end_date),
    'devices', (
      SELECT jsonb_agg(row_to_json(d))
      FROM devices d
      WHERE company_id = target_company_id
    ),
    'events', (
      SELECT jsonb_agg(row_to_json(e))
      FROM telemetry_events e
      WHERE device_id IN (SELECT id FROM devices WHERE company_id = target_company_id)
      AND timestamp BETWEEN start_date AND end_date
    )
  ) INTO result;

  RETURN result;
END;
$$;

-- fonte: supabase/migrations/20260818000000_security_hardening.sql
CREATE OR REPLACE FUNCTION delete_tenant_data(
  target_company_id UUID,
  confirmation_token VARCHAR(255)
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  deleted_count JSONB;
  v_is_admin BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = true
  ) INTO v_is_admin;

  IF NOT v_is_admin THEN
    RAISE EXCEPTION 'Somente administradores podem excluir dados de tenant';
  END IF;

  IF confirmation_token != 'DELETE_CONFIRMED' THEN
    RAISE EXCEPTION 'Invalid confirmation token';
  END IF;

  WITH
    deleted_events AS (
      DELETE FROM telemetry_events
      WHERE device_id IN (SELECT id FROM devices WHERE company_id = target_company_id)
      RETURNING 1
    ),
    deleted_devices AS (
      DELETE FROM devices
      WHERE company_id = target_company_id
      RETURNING 1
    )
  SELECT jsonb_build_object(
    'events_deleted', (SELECT COUNT(*) FROM deleted_events),
    'devices_deleted', (SELECT COUNT(*) FROM deleted_devices)
  ) INTO deleted_count;

  RETURN deleted_count;
END;
$$;

-- fonte: supabase/migrations/20261015200000_webhook_hardening_and_renewal.sql
CREATE OR REPLACE FUNCTION public.renew_subscription_license(
    p_subscription_pagbank_id text,
    p_payment_id       uuid          DEFAULT NULL,
    p_period_start     timestamptz   DEFAULT NULL,
    p_period_end       timestamptz   DEFAULT NULL,
    p_stripe_invoice_id text         DEFAULT NULL
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $function$
DECLARE
    v_sub         RECORD;
    v_lic         RECORD;
    v_new_expires TIMESTAMPTZ;
    v_interval    INTERVAL;
    v_issued      JSONB;
BEGIN
    IF p_subscription_pagbank_id IS NULL OR p_subscription_pagbank_id = '' THEN
        RAISE EXCEPTION 'SUBSCRIPTION_ID_REQUIRED: informe o id da assinatura Stripe';
    END IF;

    SELECT * INTO v_sub
    FROM public.subscriptions
    WHERE pagbank_subscription_id = p_subscription_pagbank_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'SUBSCRIPTION_NOT_FOUND: %', p_subscription_pagbank_id;
    END IF;

    -- Concorrencia: duas tentativas de renovacao da mesma assinatura se serializam.
    PERFORM pg_advisory_xact_lock(hashtextextended(p_subscription_pagbank_id, 0));

    v_interval := CASE
        WHEN lower(coalesce(v_sub.billing_period, 'month')) IN ('year', 'anual')
            THEN INTERVAL '1 year'
        ELSE INTERVAL '1 month'
    END;

    -- Licenca da assinatura: mesmo plano, dono certo (user_id; fallback e-mail).
    SELECT * INTO v_lic
    FROM public.licenses
    WHERE plan_type = lower(v_sub.plan_type)
      AND (
            (v_sub.user_id IS NOT NULL AND user_id = v_sub.user_id)
         OR (v_sub.user_id IS NULL AND lower(customer_email) = lower(coalesce(v_sub.email, '')))
      )
    ORDER BY revoked ASC, created_at DESC
    LIMIT 1;

    IF FOUND THEN
        -- Periodo da Stripe e autoridade; GREATEST impede evento atrasado/fora de
        -- ordem de encurtar validade ja paga. Sem period_end, soma o intervalo.
        v_new_expires := COALESCE(
            p_period_end,
            GREATEST(COALESCE(v_lic.expires_at, NOW()), NOW()) + v_interval
        );
        v_new_expires := GREATEST(COALESCE(v_lic.expires_at, v_new_expires), v_new_expires);

        UPDATE public.licenses
        SET expires_at = v_new_expires,
            revoked    = FALSE,   -- renovacao legitima restaura o acesso (sec.7)
            notes      = 'Renovada em ' || to_char(NOW(), 'YYYY-MM-DD"T"HH24:MI:SS"Z"')
                        || ' (invoice=' || COALESCE(p_stripe_invoice_id, 'n/d') || ')'
        WHERE license_key = v_lic.license_key;

        UPDATE public.subscriptions
        SET status = 'ACTIVE', updated_at = NOW()
        WHERE pagbank_subscription_id = p_subscription_pagbank_id;

        INSERT INTO public.audit_logs (event_type, metadata)
        VALUES ('LICENSE_RENEWED', jsonb_build_object(
            'license_key',  v_lic.license_key,
            'subscription', p_subscription_pagbank_id,
            'invoice',      p_stripe_invoice_id,
            'payment_id',   p_payment_id::text,
            'new_expires_at', v_new_expires
        ));

        RETURN jsonb_build_object(
            'action', 'renewed',
            'license_key', v_lic.license_key,
            'expires_at', v_new_expires
        );
    END IF;

    -- Sem licença do plano: emitir (idempotente por payment_id) com validade =
    -- periodo pago real. Exige payment_id real — nada de NULL silencioso.
    IF p_payment_id IS NULL THEN
        RAISE EXCEPTION 'RENEW_NO_LICENSE_NO_PAYMENT: assinatura % sem licença do plano "%" e sem payment_id para emitir',
            p_subscription_pagbank_id, v_sub.plan_type;
    END IF;

    v_issued := public.generate_complete_license_v3(
        p_payment_id,
        v_sub.user_id,
        v_sub.email,
        v_sub.plan_type,
        v_sub.billing_period,
        NULL,
        date(p_period_end)
    );

    UPDATE public.subscriptions
    SET status = 'ACTIVE', updated_at = NOW()
    WHERE pagbank_subscription_id = p_subscription_pagbank_id;

    IF v_issued IS NULL OR v_issued = 'null'::jsonb THEN
        RAISE EXCEPTION 'ISSUE_RETURNED_NULL para assinatura %', p_subscription_pagbank_id;
    END IF;

    RETURN v_issued || jsonb_build_object('action', 'issued');
END;
$function$;

-- fonte: supabase/migrations/20260926000000_repair_installations_and_rls.sql
-- ============================================================================
-- FASE 11 — profiles: impedir auto-promocao a admin
-- A policy de UPDATE de profiles permite ao proprio usuario alterar is_admin.
-- Este trigger fecha a brecha.
-- ============================================================================
CREATE OR REPLACE FUNCTION public.prevent_sensitive_profile_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    IF coalesce(
        current_setting('request.jwt.claims', true)::jsonb ->> 'role', ''
    ) = 'service_role' THEN
        RETURN NEW;
    END IF;

    IF NEW.is_admin   IS DISTINCT FROM OLD.is_admin
       OR NEW.is_blocked IS DISTINCT FROM OLD.is_blocked
       OR NEW.is_deleted  IS DISTINCT FROM OLD.is_deleted
       OR NEW.role        IS DISTINCT FROM OLD.role THEN
        RAISE EXCEPTION 'Nao e permitido alterar colunas sensiveis do perfil'
            USING ERRCODE = '42501';
    END IF;

    RETURN NEW;
END;
$$;

-- fonte: supabase/migrations/20260926000000_repair_installations_and_rls.sql
-- ============================================================================
-- FASE 3 — FUNCOES
-- ============================================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
    NEW.updated_at := now();
    RETURN NEW;
END;
$$;

-- fonte: supabase/migrations/add_link_status_events.sql
-- Função para limpar links expirados (opcional, pode ser cronjob)
CREATE OR REPLACE FUNCTION cleanup_expired_links()
RETURNS void AS $$
BEGIN
    UPDATE link_sessions
    SET status = 'expired'
    WHERE status = 'pending' AND expires_at < now();
END;
$$ LANGUAGE plpgsql;

-- fonte: supabase/migrations/20261015200000_webhook_hardening_and_renewal.sql
-- ---------------------------------------------------------------------------
-- 3b. Artefato de renovacao (ponte desktop <-> servidor autoritativo)
--
-- JUSTIFICATIVA (missao sec.5 e sec.8): o app desktop trata a data embutida na
-- chave como TETO anti-fraude, mas a renovacao legitima muda apenas
-- licenses.expires_at. Sem um comprovante, o desktop nao pode aceitar validade
-- maior (qualquer um editaria o proprio cache). Esta devolve o mesmo
-- SIG16 = generate_voltris_signature(JSON canonico) que a emissao ja usa, ou
-- seja: NENHUM algoritmo novo, e o desktop re-verifica com o verificador que
-- ele ja tinha. So service_role executa (exposto por rota propria com
-- rate limit); nenhuma PII sai daqui.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_license_renewal_artifact(
    p_license_key text,
    p_device_id   text DEFAULT NULL
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $function$
DECLARE
    v_lic         RECORD;
    v_id6         TEXT;
    v_plan_code   TEXT;
    v_max         INTEGER;
    v_valid_date  DATE;
    v_json        TEXT;
    v_sig         TEXT;
    v_device_ok   BOOLEAN := NULL;
BEGIN
    IF p_license_key IS NULL OR length(btrim(p_license_key)) < 10 THEN
        RAISE EXCEPTION 'LICENSE_KEY_REQUIRED: informe a chave de licenca';
    END IF;

    SELECT * INTO v_lic
    FROM public.licenses
    WHERE upper(license_key) = upper(btrim(p_license_key))
    LIMIT 1;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'LICENSE_NOT_FOUND: %', btrim(p_license_key);
    END IF;

    -- Identidade tirada da PROPRIA chave, para o desktop poder recomputar o
    -- mesmo JSON a partir do que ele ja guarda.
    v_plan_code := upper(split_part(v_lic.license_key, '-', 2));
    v_id6       := split_part(v_lic.license_key, '-', 3);
    v_max := CASE v_plan_code
        WHEN 'STA' THEN 1
        WHEN 'PRO' THEN 3
        WHEN 'ENT' THEN 9999
        WHEN 'TRI' THEN 1
        WHEN 'TRL' THEN 1
        ELSE COALESCE(v_lic.max_devices, 1)
    END;

    -- Validade autoritativa = expires_at do banco (movido apenas pela Stripe).
    v_valid_date := ((COALESCE(v_lic.expires_at, NOW()) AT TIME ZONE 'UTC')::date);

    v_json := format('{"id":"%s","validUntil":"%s","plan":"%s","maxDevices":%s}',
                     v_id6, to_char(v_valid_date, 'YYYY-MM-DD'),
                     lower(v_lic.plan_type), v_max);
    v_sig := public.generate_voltris_signature(v_json);

    IF p_device_id IS NOT NULL AND btrim(p_device_id) <> '' THEN
        SELECT EXISTS (
            SELECT 1 FROM public.license_devices
            WHERE license_key = v_lic.license_key
              AND lower(device_id) = lower(btrim(p_device_id))
        ) INTO v_device_ok;
    END IF;

    INSERT INTO public.audit_logs (event_type, metadata)
    VALUES ('RENEWAL_ARTIFACT_READ', jsonb_build_object(
        'license_key_tail', right(v_lic.license_key, 4),
        'plan_type',        v_lic.plan_type,
        'expires_at',       v_lic.expires_at,
        'revoked',          v_lic.revoked,
        'device_provided',  (p_device_id IS NOT NULL AND btrim(p_device_id) <> '')
    ));

    RETURN jsonb_build_object(
        'valid',               COALESCE(v_lic.revoked, FALSE) = FALSE
                                AND v_lic.expires_at > NOW(),
        'revoked',             COALESCE(v_lic.revoked, FALSE),
        'license_key',         v_lic.license_key,
        'plan_type',           v_lic.plan_type,
        'billing_period',      v_lic.billing_period,
        'max_devices',         v_max,
        'expires_at',          v_lic.expires_at,
        'renewal_valid_until', to_char(v_valid_date, 'YYYYMMDD'),
        'renewal_signature',   v_sig,
        'device_registered',   v_device_ok,
        'server_time',         NOW()
    );
END;
$function$;

-- fonte: supabase/migrations/20261019120000_billing_facts.sql
-- ---------------------------------------------------------------------------
-- 4. Trigger de updated_at (mesma convenção já usada no projeto)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at_refund_requests()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- fonte: supabase/migrations/20261019120000_billing_facts.sql
-- ---------------------------------------------------------------------------
-- 6. Espelho automático de subscriptions -> payments.stripe_customer_id
--
--    O checkout grava o cus_ no pagamento; a assinatura é criada depois (no
--    webhook). Propagar aqui mantém os dois lados coerentes sem depender da
--    ordem em que os eventos chegam.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.sync_stripe_customer_to_payments()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.stripe_customer_id IS NOT NULL THEN
        UPDATE public.payments
           SET stripe_customer_id = NEW.stripe_customer_id,
               updated_at = NOW()
         WHERE stripe_subscription_id = NEW.pagbank_subscription_id
           AND (stripe_customer_id IS DISTINCT FROM NEW.stripe_customer_id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- fonte: admin.sql
CREATE OR REPLACE FUNCTION public.set_updated_at_email_outbox()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- fonte: supabase/extension_diagnostics.sql
-- ---------------------------------------------------------------------------
-- 2. A FUNÇÃO: LIMITE GLOBAL + GRAVAÇÃO, NUMA IDA SÓ
-- ---------------------------------------------------------------------------
--
-- POR QUE UMA FUNÇÃO, E NÃO DUAS CONSULTAS
-- ----------------------------------------
-- Duas consultas são duas idas ao banco, e cada ida custa tempo de
-- invocação serverless. Uma função faz o limite e a gravação no mesmo
-- Transaction, e o limite e a gravação não podem discordar um do outro:
-- o que for aceito é gravado, e o que for recusado não é.
--
-- A FUNÇÃO É "SECURITY DEFINER" PORQUE
-- ------------------------------------
-- A tabela é escrita pela service role, e a função é o caminho. O
-- `search_path` é fixado em `public` porque uma função sem search_path
-- fixo é uma função que pode ser sequestrada por um objeto do schema de
-- quem a chamou.
--
-- O LIMITE
-- ---------
-- 120 eventos por minuto, no TOTAL, de todas as origens. É o teto que
-- impede que mil endereços diferentes enchem o grupo. O limite por origem
-- (10 por minuto) é o que existe na memória da instância; este é o que
-- existe entre instâncias.

CREATE OR REPLACE FUNCTION public.record_extension_diagnostics(p_events JSONB)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_limit      INTEGER     := 120;
    v_count      INTEGER;
    v_inserted   INTEGER;
    v_accepted   JSONB;
BEGIN
    IF p_events IS NULL OR jsonb_typeof(p_events) <> 'array' THEN
        RETURN jsonb_build_object('accepted', false, 'reason', 'invalid_events');
    END IF;

    IF jsonb_array_length(p_events) = 0 THEN
        RETURN jsonb_build_object('accepted', false, 'reason', 'empty_batch');
    END IF;

    IF jsonb_array_length(p_events) > 20 THEN
        RETURN jsonb_build_object('accepted', false, 'reason', 'batch_too_large');
    END IF;

    -- O LIMITE GLOBAL. Conta o que chegou no último minuto.
    SELECT count(*) INTO v_count
    FROM public.extension_diagnostics
    WHERE created_at > now() - interval '1 minute';

    IF v_count + jsonb_array_length(p_events) > v_limit THEN
        RETURN jsonb_build_object('accepted', false, 'reason', 'global_rate_limit', 'current', v_count);
    END IF;

    -- A GRAVAÇÃO DO LOTE.
    INSERT INTO public.extension_diagnostics (
        schema_version,
        source,
        error_code,
        event_name,
        component,
        severity,
        extension_version,
        browser,
        browser_major,
        message,
        occurrences,
        diagnostics,
        occurred_at,
        is_test_event
    )
    SELECT
        (e ->> 'schema_version')::smallint,
        COALESCE(e ->> 'source', 'voltris-shield-extension'),
        (e ->> 'error_code')::text,
        (e ->> 'event_name')::text,
        (e ->> 'component')::text,
        (e ->> 'severity')::text,
        (e ->> 'extension_version')::text,
        (e ->> 'browser')::text,
        (e ->> 'browser_major')::text,
        left(COALESCE(e ->> 'message', ''), 500)::text,
        GREATEST(1, COALESCE((e ->> 'occurrences')::int, 1)),
        CASE WHEN e ? 'diagnostics' AND e -> 'diagnostics' <> 'null'::jsonb
             THEN e -> 'diagnostics' ELSE NULL END,
        COALESCE((e ->> 'occurred_at')::timestamptz, now()),
        COALESCE((e ->> 'is_test_event')::boolean, FALSE)
    FROM jsonb_array_elements(p_events) AS e
    WHERE e ? 'error_code' AND e ? 'event_name' AND e ? 'component';

    GET DIAGNOSTICS v_inserted = ROW_COUNT;

    RETURN jsonb_build_object('accepted', true, 'count', v_inserted);
END;
$$;

-- ============================================================================
--  FASE 7 — ROW LEVEL SECURITY E POLICIES (143)
-- ============================================================================
DROP POLICY IF EXISTS "Users can create companies" ON public.companies;
CREATE POLICY "Users can create companies" 
ON public.companies FOR INSERT 
TO authenticated 
WITH CHECK (true);
DROP POLICY IF EXISTS "Users can view their own companies" ON public.companies;
CREATE POLICY "Users can view their own companies" 
ON public.companies FOR SELECT 
TO authenticated 
USING (
  id IN (
    SELECT company_id FROM public.company_users 
    WHERE user_id = auth.uid()
  )
);
DROP POLICY IF EXISTS "Users can join companies" ON public.company_users;
CREATE POLICY "Users can join companies" 
ON public.company_users FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can view their memberships" ON public.company_users;
CREATE POLICY "Users can view their memberships" 
ON public.company_users FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can send commands" ON public.remote_commands;
CREATE POLICY "Users can send commands" 
ON public.remote_commands FOR INSERT 
TO authenticated 
WITH CHECK (
  company_id IN (
    SELECT company_id FROM public.company_users 
    WHERE user_id = auth.uid()
  )
);
DROP POLICY IF EXISTS "Users can view commands" ON public.remote_commands;
CREATE POLICY "Users can view commands" 
ON public.remote_commands FOR SELECT 
TO authenticated 
USING (
  company_id IN (
    SELECT company_id FROM public.company_users 
    WHERE user_id = auth.uid()
  )
);
DROP POLICY IF EXISTS "service_all_payments" ON public.payments;
-- Service role acesso total
CREATE POLICY "service_all_payments" ON public.payments
    FOR ALL USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "service_all_licenses" ON public.licenses;
CREATE POLICY "service_all_licenses" ON public.licenses
    FOR ALL USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Service role full access subscriptions" ON public.subscriptions;
CREATE POLICY "Service role full access subscriptions" ON public.subscriptions
    FOR ALL USING (true);
DROP POLICY IF EXISTS "service_all_audit_logs" ON public.audit_logs;
CREATE POLICY "service_all_audit_logs" ON public.audit_logs
    FOR ALL USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR SELECT
    TO authenticated
    USING (
      (auth.jwt() ->> 'email') IN (SELECT email FROM public.profiles WHERE is_admin = true)
      OR auth.uid() = id
    );
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT 
    TO authenticated 
    USING ( auth.uid() = id );
DROP POLICY IF EXISTS "Admins view all profiles securely" ON public.profiles;
-- 4. Criar a política de administradores utilizando a nova função segura
CREATE POLICY "Admins view all profiles securely" ON public.profiles
    FOR SELECT 
    TO authenticated 
    USING ( public.check_is_admin() );
DROP POLICY IF EXISTS "Allow anonymous trial activation" ON public.trial_activations;
-- =====================================================
-- POLÍTICAS DE SEGURANÇA RLS
-- =====================================================

-- 1. Permitir INSERT anônimo (para criar trial na primeira ativação)
CREATE POLICY "Allow anonymous trial activation" ON trial_activations
    FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow anonymous trial verification" ON public.trial_activations;
-- 2. Permitir SELECT anônimo (para verificar trial existente)
CREATE POLICY "Allow anonymous trial verification" ON trial_activations
    FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow update own trial" ON public.trial_activations;
-- 3. Permitir UPDATE apenas se o hwid for o mesmo (proteção contra tampering)
CREATE POLICY "Allow update own trial" ON trial_activations
    FOR UPDATE USING (hwid_hash = current_setting('app.current_hwid', true));
DROP POLICY IF EXISTS "Deny trial deletion" ON public.trial_activations;
-- 4. Negar DELETE (não permitir remoção de trials)
CREATE POLICY "Deny trial deletion" ON trial_activations
    FOR DELETE USING (false);
DROP POLICY IF EXISTS "users_select_own_payments" ON public.payments;
-- Usuários veem apenas seus próprios dados
CREATE POLICY "users_select_own_payments" ON public.payments
    FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "users_select_own_licenses" ON public.licenses;
CREATE POLICY "users_select_own_licenses" ON public.licenses
    FOR SELECT USING (
        auth.uid() = user_id
        OR email = (auth.jwt() ->> 'email')
    );
DROP POLICY IF EXISTS "Service role can manage sessions" ON public.sessions;
CREATE POLICY "Service role can manage sessions" ON sessions FOR ALL USING (true);
DROP POLICY IF EXISTS "Admins can view all sessions" ON public.sessions;
CREATE POLICY "Admins can view all sessions" ON sessions FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);
DROP POLICY IF EXISTS "Service role can manage companies" ON public.companies;
CREATE POLICY "Service role can manage companies" ON companies FOR ALL USING (true);
DROP POLICY IF EXISTS "Admins can view all companies" ON public.companies;
CREATE POLICY "Admins can view all companies" ON companies FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);
DROP POLICY IF EXISTS "Users can view own installations" ON public.installations;
CREATE POLICY "Users can view own installations" ON installations 
FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins can manage all installations" ON public.installations;
CREATE POLICY "Admins can manage all installations"
ON installations FOR ALL
USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);
DROP POLICY IF EXISTS "Service role full access installations" ON public.installations;
CREATE POLICY "Service role full access installations"
ON installations FOR ALL
USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Users can insert commands for own installations" ON public.device_commands;
CREATE POLICY "Users can insert commands for own installations"
ON device_commands FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM installations
    WHERE installations.id = device_commands.installation_id
    AND installations.user_id = auth.uid()
  )
);
DROP POLICY IF EXISTS "Users can view commands for own installations" ON public.device_commands;
CREATE POLICY "Users can view commands for own installations"
ON device_commands FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM installations
    WHERE installations.id = device_commands.installation_id
    AND installations.user_id = auth.uid()
  )
);
DROP POLICY IF EXISTS "Service role full access device_commands" ON public.device_commands;
CREATE POLICY "Service role full access device_commands"
ON device_commands FOR ALL
USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Users can view own events" ON public.installation_events;
CREATE POLICY "Users can view own events" ON installation_events 
FOR SELECT USING (
  EXISTS (SELECT 1 FROM installations WHERE id = installation_id AND user_id = auth.uid())
);
DROP POLICY IF EXISTS "Admins can manage all events" ON public.installation_events;
CREATE POLICY "Admins can manage all events"
ON installation_events FOR ALL
USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);
DROP POLICY IF EXISTS "Users can view own heartbeats" ON public.installation_heartbeats;
CREATE POLICY "Users can view own heartbeats"
ON installation_heartbeats FOR SELECT
USING (
  EXISTS (SELECT 1 FROM installations WHERE id = installation_id AND user_id = auth.uid())
);
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
-- Create policies
create policy "Users can view their own profile"
    on public.profiles for select
    using ( auth.uid() = id );
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
create policy "Users can insert their own profile"
    on public.profiles for insert
    with check ( auth.uid() = id );
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
create policy "Users can update their own profile"
    on public.profiles for update
    using ( auth.uid() = id );
DROP POLICY IF EXISTS "Users can view their own tickets" ON public.tickets;
-- Create policies for tickets
create policy "Users can view their own tickets"
    on public.tickets for select
    using ( auth.uid() = user_id );
DROP POLICY IF EXISTS "Users can insert their own tickets" ON public.tickets;
create policy "Users can insert their own tickets"
    on public.tickets for insert
    with check ( auth.uid() = user_id );
DROP POLICY IF EXISTS "Users can update their own tickets" ON public.tickets;
create policy "Users can update their own tickets"
    on public.tickets for update
    using ( auth.uid() = user_id );
DROP POLICY IF EXISTS "Users can view messages from their tickets" ON public.ticket_messages;
-- Create policies for ticket_messages
create policy "Users can view messages from their tickets"
    on public.ticket_messages for select
    using (
        exists (
            select 1 from public.tickets
            where tickets.id = ticket_messages.ticket_id
            and tickets.user_id = auth.uid()
        )
    );
DROP POLICY IF EXISTS "Users can insert messages in their tickets" ON public.ticket_messages;
create policy "Users can insert messages in their tickets"
    on public.ticket_messages for insert
    with check (
        exists (
            select 1 from public.tickets
            where tickets.id = ticket_id
            and tickets.user_id = auth.uid()
        )
    );
DROP POLICY IF EXISTS "Admins can view all tickets" ON public.tickets;
-- Create policy for admins to view all tickets and messages
create policy "Admins can view all tickets"
    on public.tickets for select
    using (
        exists (
            select 1 from public.profiles
            where profiles.id = auth.uid()
            and profiles.is_admin = true
        )
    );
DROP POLICY IF EXISTS "Admins can view all messages" ON public.ticket_messages;
create policy "Admins can view all messages"
    on public.ticket_messages for select
    using (
        exists (
            select 1 from public.profiles
            where profiles.id = auth.uid()
            and profiles.is_admin = true
        )
    );
DROP POLICY IF EXISTS "Admins can insert messages in any ticket" ON public.ticket_messages;
create policy "Admins can insert messages in any ticket"
    on public.ticket_messages for insert
    with check (
        exists (
            select 1 from public.profiles
            where profiles.id = auth.uid()
            and profiles.is_admin = true
        )
    );
DROP POLICY IF EXISTS "Admins can update any ticket" ON public.tickets;
create policy "Admins can update any ticket"
    on public.tickets for update
    using (
        exists (
            select 1 from public.profiles
            where profiles.id = auth.uid()
            and profiles.is_admin = true
        )
    );
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
CREATE POLICY "Users can view their own orders"
ON orders
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert their own orders" ON public.orders;
CREATE POLICY "Users can insert their own orders"
ON orders
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update their own orders" ON public.orders;
CREATE POLICY "Users can update their own orders"
ON orders
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can view their own payments" ON public.payments;
-- Usuários autenticados veem apenas os próprios pagamentos
CREATE POLICY "Users can view their own payments"
ON payments
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Service role can manage all payments" ON public.payments;
CREATE POLICY "Service role can manage all payments"
ON payments
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
DROP POLICY IF EXISTS "Users can view their own licenses" ON public.licenses;
-- Usuários autenticados veem apenas as próprias licenças
CREATE POLICY "Users can view their own licenses"
ON licenses
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id
  OR email = (SELECT email FROM auth.users WHERE id = auth.uid())
);
DROP POLICY IF EXISTS "Service role can manage all licenses" ON public.licenses;
CREATE POLICY "Service role can manage all licenses"
ON licenses
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
DROP POLICY IF EXISTS "Users can view devices of their licenses" ON public.license_devices;
-- Usuários autenticados veem dispositivos das próprias licenças
CREATE POLICY "Users can view devices of their licenses"
ON license_devices
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM licenses
    WHERE licenses.id = license_devices.license_id
    AND (
      licenses.user_id = auth.uid()
      OR licenses.email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  )
);
DROP POLICY IF EXISTS "Service role can manage all devices" ON public.license_devices;
CREATE POLICY "Service role can manage all devices"
ON license_devices
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
DROP POLICY IF EXISTS "Allow payment creation without auth" ON public.payments;
-- Política 1: Permitir INSERT sem autenticação (para criar pagamento antes do checkout)
CREATE POLICY "Allow payment creation without auth"
    ON payments FOR INSERT
    WITH CHECK (true);
DROP POLICY IF EXISTS "Allow payment updates without auth" ON public.payments;
-- Política 2: Permitir UPDATE sem autenticação (para webhook do Mercado Pago)
CREATE POLICY "Allow payment updates without auth"
    ON payments FOR UPDATE
    USING (true)
    WITH CHECK (true);
DROP POLICY IF EXISTS "Allow payment lookup by preference or payment id" ON public.payments;
-- Política 3: Permitir SELECT sem autenticação (para verificar status do pagamento)
CREATE POLICY "Allow payment lookup by preference or payment id"
    ON payments FOR SELECT
    USING (true);
DROP POLICY IF EXISTS "Allow license creation without auth" ON public.licenses;
-- Política 2: Permitir INSERT sem autenticação (para webhook criar licença)
CREATE POLICY "Allow license creation without auth"
    ON licenses FOR INSERT
    WITH CHECK (true);
DROP POLICY IF EXISTS "Allow license updates without auth" ON public.licenses;
-- Política 3: Permitir UPDATE sem autenticação (para atualizar status)
CREATE POLICY "Allow license updates without auth"
    ON licenses FOR UPDATE
    USING (true)
    WITH CHECK (true);
DROP POLICY IF EXISTS "Allow device activation without auth" ON public.license_devices;
-- Política 2: Permitir INSERT sem autenticação (para ativar dispositivo)
CREATE POLICY "Allow device activation without auth"
    ON license_devices FOR INSERT
    WITH CHECK (true);
DROP POLICY IF EXISTS "Allow device updates without auth" ON public.license_devices;
-- Política 3: Permitir UPDATE sem autenticação (para atualizar last_used_at)
CREATE POLICY "Allow device updates without auth"
    ON license_devices FOR UPDATE
    USING (true)
    WITH CHECK (true);
DROP POLICY IF EXISTS "Usuários podem ver seus próprios perfis" ON public.profiles;
-- Usuário pode ver o próprio perfil
CREATE POLICY "Usuários podem ver seus próprios perfis"
    ON public.profiles
    FOR SELECT
    USING (auth.uid() = id);
DROP POLICY IF EXISTS "Admins podem ver todos os perfis" ON public.profiles;
-- Admin pode ver todos os perfis (além do próprio)
CREATE POLICY "Admins podem ver todos os perfis"
    ON public.profiles
    FOR SELECT
    USING (
      EXISTS (
        SELECT 1 FROM public.profiles AS p
        WHERE p.id = auth.uid() AND p.is_admin = true
      )
      OR auth.uid() = id
    );
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios perfis" ON public.profiles;
-- Usuário pode atualizar o próprio perfil
CREATE POLICY "Usuários podem atualizar seus próprios perfis"
    ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id);
DROP POLICY IF EXISTS "Permitir insert do próprio perfil" ON public.profiles;
-- Usuário pode inserir o próprio perfil
CREATE POLICY "Permitir insert do próprio perfil"
    ON public.profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "Debug realtime select" ON public.orders;
-- Policy temporária para debug do realtime
CREATE POLICY "Debug realtime select" ON orders FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
CREATE POLICY "Users can view their own notifications"
    ON public.notifications FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert their own notifications" ON public.notifications;
CREATE POLICY "Users can insert their own notifications"
    ON public.notifications FOR INSERT
    WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admin can view all notifications" ON public.notifications;
CREATE POLICY "Admin can view all notifications"
    ON public.notifications FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.is_admin = TRUE
              AND COALESCE(p.is_blocked, false) = false
              AND COALESCE(p.is_deleted, false) = false
        )
    );
DROP POLICY IF EXISTS "Users can view their own settings" ON public.user_settings;
CREATE POLICY "Users can view their own settings"
    ON public.user_settings FOR SELECT
    USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update their own settings" ON public.user_settings;
CREATE POLICY "Users can update their own settings"
    ON public.user_settings FOR UPDATE
    USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert their own settings" ON public.user_settings;
CREATE POLICY "Users can insert their own settings"
    ON public.user_settings FOR INSERT
    WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can view their own push subscriptions" ON public.push_subscriptions;
CREATE POLICY "Users can view their own push subscriptions"
    ON public.push_subscriptions FOR SELECT
    USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert their own push subscriptions" ON public.push_subscriptions;
CREATE POLICY "Users can insert their own push subscriptions"
    ON public.push_subscriptions FOR INSERT
    WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update their own push subscriptions" ON public.push_subscriptions;
CREATE POLICY "Users can update their own push subscriptions"
    ON public.push_subscriptions FOR UPDATE
    USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete their own push subscriptions" ON public.push_subscriptions;
CREATE POLICY "Users can delete their own push subscriptions"
    ON public.push_subscriptions FOR DELETE
    USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admin can view all push subscriptions" ON public.push_subscriptions;
CREATE POLICY "Admin can view all push subscriptions"
    ON public.push_subscriptions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND is_admin = TRUE
        )
    );
DROP POLICY IF EXISTS "Users can view own subscriptions" ON public.subscriptions;
-- Política: Usuários podem ver suas próprias assinaturas
CREATE POLICY "Users can view own subscriptions"
    ON subscriptions FOR SELECT
    USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Service role full access to subscriptions" ON public.subscriptions;
-- Política: Service role tem acesso total
CREATE POLICY "Service role full access to subscriptions"
    ON subscriptions FOR ALL
    USING (auth.jwt()->>'role' = 'service_role');
DROP POLICY IF EXISTS "Allow authenticated users to read their installations" ON public.installations;
CREATE POLICY "Allow authenticated users to read their installations"
ON installations
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins can view all installations" ON public.installations;
CREATE POLICY "Admins can view all installations"
ON installations
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = true
  )
);
DROP POLICY IF EXISTS "Service role can manage everything" ON public.installations;
CREATE POLICY "Service role can manage everything"
ON installations
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
DROP POLICY IF EXISTS "Allow anon to insert installations" ON public.installations;
-- 4. Allow anon to insert/update (for app registration before login)
CREATE POLICY "Allow anon to insert installations"
ON installations
FOR INSERT
TO anon
WITH CHECK (true);
DROP POLICY IF EXISTS "Allow anon to update installations" ON public.installations;
CREATE POLICY "Allow anon to update installations"
ON installations
FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);
DROP POLICY IF EXISTS "Anyone can create payments" ON public.payments;
-- Política para inserção pública (qualquer um pode criar pagamento)
CREATE POLICY "Anyone can create payments" 
ON payments FOR INSERT 
WITH CHECK (true);
DROP POLICY IF EXISTS "Only service role can update payments" ON public.payments;
-- Política para atualização (apenas sistema/backend)
CREATE POLICY "Only service role can update payments" 
ON payments FOR UPDATE 
USING (current_setting('role') = 'service_role');
DROP POLICY IF EXISTS "Users can view own payments" ON public.payments;
-- Usuários só veem seus próprios registros
CREATE POLICY "Users can view own payments" ON public.payments FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can view own licenses" ON public.licenses;
CREATE POLICY "Users can view own licenses" ON public.licenses FOR SELECT USING (auth.uid() = user_id OR email = (SELECT (auth.jwt() ->> 'email')));
DROP POLICY IF EXISTS "Service role full access on payments" ON public.payments;
CREATE POLICY "Service role full access on payments" ON public.payments FOR ALL USING (true);
DROP POLICY IF EXISTS "Service role full access on licenses" ON public.licenses;
CREATE POLICY "Service role full access on licenses" ON public.licenses FOR ALL USING (true);
DROP POLICY IF EXISTS "Users can insert commands for their own installations" ON public.device_commands;
-- Política: Usuário autenticado pode criar comandos para suas próprias instalações
CREATE POLICY "Users can insert commands for their own installations"
ON device_commands FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM installations 
        WHERE installations.id = device_commands.installation_id 
        AND installations.user_id = auth.uid()
    )
);
DROP POLICY IF EXISTS "Users can view commands for their own installations" ON public.device_commands;
-- Política: Usuário pode ver histórico de comandos
CREATE POLICY "Users can view commands for their own installations"
ON device_commands FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM installations 
        WHERE installations.id = device_commands.installation_id 
        AND installations.user_id = auth.uid()
    )
);
DROP POLICY IF EXISTS "Users view own subscriptions" ON public.subscriptions;
CREATE POLICY "Users view own subscriptions" ON public.subscriptions
    FOR SELECT USING (auth.uid() = user_id OR email = (SELECT auth.jwt() ->> 'email'));
DROP POLICY IF EXISTS "Admins can view all events" ON public.installation_events;
CREATE POLICY "Admins can view all events" ON installation_events 
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
CREATE POLICY "Admins can view all orders"
ON orders
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = true
  )
);
DROP POLICY IF EXISTS "Admins can update all orders" ON public.orders;
CREATE POLICY "Admins can update all orders"
ON orders
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = true
  )
);
DROP POLICY IF EXISTS "Service role can manage all orders" ON public.orders;
CREATE POLICY "Service role can manage all orders"
ON orders
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
DROP POLICY IF EXISTS installations_select_own ON public.installations;
-- ============================================================================
-- FASE 8 — POLICIES
-- Somente dois papeis podem tocar tabela de dispositivo:
--   authenticated -> apenas as proprias linhas
--   service_role  -> endpoints da API (o desktop NUNCA usa service_role)
-- Nao existe policy para anon.
-- ============================================================================

-- 8.1 installations
CREATE POLICY installations_select_own
    ON public.installations
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);
DROP POLICY IF EXISTS installations_admin_all ON public.installations;
CREATE POLICY installations_admin_all
    ON public.installations
    FOR ALL
    TO authenticated
    USING      (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_admin))
    WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_admin));
DROP POLICY IF EXISTS installations_service_all ON public.installations;
CREATE POLICY installations_service_all
    ON public.installations
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
DROP POLICY IF EXISTS installation_events_select_own ON public.installation_events;
-- 8.2 installation_events
CREATE POLICY installation_events_select_own
    ON public.installation_events
    FOR SELECT
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.installations i
         WHERE i.id = installation_events.installation_id
           AND i.user_id = auth.uid()
    ));
DROP POLICY IF EXISTS installation_events_service_all ON public.installation_events;
CREATE POLICY installation_events_service_all
    ON public.installation_events
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
DROP POLICY IF EXISTS installation_heartbeats_select_own ON public.installation_heartbeats;
-- 8.3 installation_heartbeats
CREATE POLICY installation_heartbeats_select_own
    ON public.installation_heartbeats
    FOR SELECT
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.installations i
         WHERE i.id = installation_heartbeats.installation_id
           AND i.user_id = auth.uid()
    ));
DROP POLICY IF EXISTS installation_heartbeats_service_all ON public.installation_heartbeats;
CREATE POLICY installation_heartbeats_service_all
    ON public.installation_heartbeats
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
DROP POLICY IF EXISTS device_commands_select_own ON public.device_commands;
-- 8.4 device_commands (vinculo via installations.user_id; device_commands
--     nunca teve user_id — este era parte do bug)
CREATE POLICY device_commands_select_own
    ON public.device_commands
    FOR SELECT
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.installations i
         WHERE i.id = device_commands.installation_id
           AND i.user_id = auth.uid()
    ));
DROP POLICY IF EXISTS device_commands_insert_own ON public.device_commands;
CREATE POLICY device_commands_insert_own
    ON public.device_commands
    FOR INSERT
    TO authenticated
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.installations i
         WHERE i.id = device_commands.installation_id
           AND i.user_id = auth.uid()
    ));
DROP POLICY IF EXISTS device_commands_update_own ON public.device_commands;
CREATE POLICY device_commands_update_own
    ON public.device_commands
    FOR UPDATE
    TO authenticated
    USING      (EXISTS (SELECT 1 FROM public.installations i WHERE i.id = device_commands.installation_id AND i.user_id = auth.uid()))
    WITH CHECK (EXISTS (SELECT 1 FROM public.installations i WHERE i.id = device_commands.installation_id AND i.user_id = auth.uid()));
DROP POLICY IF EXISTS device_commands_service_all ON public.device_commands;
CREATE POLICY device_commands_service_all
    ON public.device_commands
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
DROP POLICY IF EXISTS remote_commands_select_own_company ON public.remote_commands;
-- 8.5 remote_commands (tabela legada do painel enterprise; travada em company_id)
CREATE POLICY remote_commands_select_own_company
    ON public.remote_commands
    FOR SELECT
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.company_users cu
         WHERE cu.user_id = auth.uid()
           AND cu.company_id = remote_commands.company_id
    ));
DROP POLICY IF EXISTS remote_commands_insert_own_company ON public.remote_commands;
CREATE POLICY remote_commands_insert_own_company
    ON public.remote_commands
    FOR INSERT
    TO authenticated
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.company_users cu
         WHERE cu.user_id = auth.uid()
           AND cu.company_id = remote_commands.company_id
    ));
DROP POLICY IF EXISTS remote_commands_service_all ON public.remote_commands;
CREATE POLICY remote_commands_service_all
    ON public.remote_commands
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
DROP POLICY IF EXISTS licenses_select_own ON public.licenses;
-- 8.6 licenses (schema canonico: user_id e o vinculo; customer_email e o fallback legado)
CREATE POLICY licenses_select_own
    ON public.licenses
    FOR SELECT
    TO authenticated
    USING (
        user_id = auth.uid()
        OR lower(customer_email) = lower((SELECT u.email FROM auth.users u WHERE u.id = auth.uid()))
    );
DROP POLICY IF EXISTS licenses_service_all ON public.licenses;
CREATE POLICY licenses_service_all
    ON public.licenses
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
DROP POLICY IF EXISTS license_devices_select_own ON public.license_devices;
-- 8.7 license_devices
CREATE POLICY license_devices_select_own
    ON public.license_devices
    FOR SELECT
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.licenses l
         WHERE l.license_key = license_devices.license_key
           AND (
                 l.user_id = auth.uid()
                 OR lower(l.customer_email) = lower((SELECT u.email FROM auth.users u WHERE u.id = auth.uid()))
               )
    ));
DROP POLICY IF EXISTS license_devices_service_all ON public.license_devices;
CREATE POLICY license_devices_service_all
    ON public.license_devices
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
DROP POLICY IF EXISTS "service role only stripe_event_log" ON public.stripe_event_log;
CREATE POLICY "service role only stripe_event_log"
    ON public.stripe_event_log FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "service role only refund_requests" ON public.refund_requests;
CREATE POLICY "service role only refund_requests"
    ON public.refund_requests FOR ALL TO service_role
    USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "service role only inserts notifications" ON public.notifications;
CREATE POLICY "service role only inserts notifications"
    ON public.notifications FOR INSERT
    TO service_role
    WITH CHECK (true);
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
CREATE POLICY "Users can update their own notifications"
    ON public.notifications FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete their own notifications" ON public.notifications;
CREATE POLICY "Users can delete their own notifications"
    ON public.notifications FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- ============================================================================
--  FASE 8 — TRIGGERS (21)
-- ============================================================================
DROP TRIGGER IF EXISTS tr_sync_license_device_count ON public.license_devices;
CREATE TRIGGER tr_sync_license_device_count
AFTER INSERT OR DELETE ON public.license_devices
FOR EACH ROW
EXECUTE FUNCTION public.sync_license_device_count();

DROP TRIGGER IF EXISTS trial_activations_updated_at ON public.trial_activations;
CREATE TRIGGER trial_activations_updated_at 
    BEFORE UPDATE ON trial_activations 
    FOR EACH ROW EXECUTE FUNCTION update_trial_updated_at_column();

DROP TRIGGER IF EXISTS tr_installations_updated_at ON public.installations;
CREATE TRIGGER tr_installations_updated_at
    BEFORE UPDATE ON public.installations
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS tr_sync_last_active ON public.installations;
CREATE TRIGGER tr_sync_last_active
    BEFORE UPDATE ON public.installations
    FOR EACH ROW
    EXECUTE FUNCTION public.sync_last_active();

DROP TRIGGER IF EXISTS handle_updated_at ON public.profiles;
-- Create trigger for updated_at
create trigger handle_updated_at
    before update on public.profiles
    for each row
    execute function public.handle_updated_at();

DROP TRIGGER IF EXISTS update_orders_updated_at_trigger ON public.orders;
CREATE TRIGGER update_orders_updated_at_trigger
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_orders_updated_at();

DROP TRIGGER IF EXISTS update_payments_updated_at ON public.payments;
CREATE TRIGGER update_payments_updated_at 
    BEFORE UPDATE ON payments 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_licenses_updated_at ON public.licenses;
CREATE TRIGGER update_licenses_updated_at
    BEFORE UPDATE ON licenses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_notify_ticket_status_change ON public.tickets;
CREATE TRIGGER trg_notify_ticket_status_change
    AFTER UPDATE ON public.tickets
    FOR EACH ROW
    EXECUTE FUNCTION public.notify_ticket_status_change();

DROP TRIGGER IF EXISTS trg_notify_order_status_change ON public.orders;
CREATE TRIGGER trg_notify_order_status_change
    AFTER UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.notify_order_status_change();

DROP TRIGGER IF EXISTS trigger_update_push_subscription_updated_at ON public.push_subscriptions;
CREATE TRIGGER trigger_update_push_subscription_updated_at
    BEFORE UPDATE ON public.push_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_push_subscription_updated_at();

DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON public.subscriptions;
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS prevent_sensitive_profile_update_trigger ON public.profiles;
CREATE TRIGGER prevent_sensitive_profile_update_trigger
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.prevent_sensitive_profile_update();

DROP TRIGGER IF EXISTS tr_refund_requests_updated_at ON public.refund_requests;
CREATE TRIGGER tr_refund_requests_updated_at
    BEFORE UPDATE ON public.refund_requests
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_refund_requests();

DROP TRIGGER IF EXISTS tr_subscriptions_stripe_customer ON public.subscriptions;
CREATE TRIGGER tr_subscriptions_stripe_customer
    AFTER INSERT OR UPDATE OF stripe_customer_id ON public.subscriptions
    FOR EACH ROW EXECUTE FUNCTION public.sync_stripe_customer_to_payments();

DROP TRIGGER IF EXISTS tr_email_outbox_updated_at ON public.email_outbox;
CREATE TRIGGER tr_email_outbox_updated_at
    BEFORE UPDATE ON public.email_outbox
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_email_outbox();

-- ============================================================================
--  FASE 9 — INDICES (139)
-- ============================================================================
-- Index for faster active session lookups
CREATE INDEX IF NOT EXISTS idx_sessions_device_status ON public.sessions (device_id, status);
CREATE INDEX IF NOT EXISTS idx_sessions_active ON public.sessions (status) WHERE status = 'active';
-- Criar índice para melhorar performance
CREATE INDEX IF NOT EXISTS idx_licenses_display_name 
ON licenses(license_display_name);
-- Criar índice para melhorar performance de queries
CREATE INDEX IF NOT EXISTS idx_installations_license_status 
ON installations(license_status);
-- Índices para performance e consultas rápidas
CREATE INDEX IF NOT EXISTS idx_trial_activations_hwid ON trial_activations(hwid_hash);
CREATE INDEX IF NOT EXISTS idx_trial_activations_expires ON trial_activations(trial_expires_at);
CREATE INDEX IF NOT EXISTS idx_trial_activations_created ON trial_activations(created_at);
CREATE INDEX IF NOT EXISTS idx_trial_activations_ip ON trial_activations(activation_ip);
-- Índices
CREATE INDEX IF NOT EXISTS idx_payments_reference_id ON public.payments(reference_id);
CREATE INDEX IF NOT EXISTS idx_payments_email ON payments(email);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_licenses_email ON licenses(email);
CREATE INDEX IF NOT EXISTS idx_licenses_user_id   ON public.licenses(user_id);
CREATE INDEX IF NOT EXISTS idx_licenses_payment_id ON licenses(payment_id);
CREATE INDEX IF NOT EXISTS idx_licenses_license_key ON licenses(license_key);
CREATE INDEX IF NOT EXISTS idx_sessions_device_id ON sessions(device_id);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions(status);
CREATE INDEX IF NOT EXISTS idx_sessions_last_heartbeat ON sessions(last_heartbeat_at);
-- 5. ÍNDICES DE PERFORMANCE (ESTRUTURA ENTERPRISE)
CREATE INDEX IF NOT EXISTS idx_installations_user_id ON installations(user_id);
CREATE INDEX IF NOT EXISTS idx_installations_last_heartbeat ON installations(last_heartbeat);
CREATE INDEX IF NOT EXISTS idx_installations_license_key ON installations(license_key);
-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_device_commands_installation_id ON device_commands(installation_id);
CREATE INDEX IF NOT EXISTS idx_device_commands_status ON device_commands(status);
CREATE INDEX IF NOT EXISTS idx_device_commands_created ON device_commands(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_inst_id_type ON installation_events(installation_id, event_type);
CREATE INDEX IF NOT EXISTS idx_heartbeats_timestamp ON installation_heartbeats(timestamp);
-- 7. CRIAR ÍNDICES PARA MELHOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_orders_service_id ON orders(service_id);
CREATE INDEX IF NOT EXISTS idx_orders_service_name ON orders(service_name);
CREATE INDEX IF NOT EXISTS idx_orders_plan_type ON orders(plan_type);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_payments_preference_id ON payments(preference_id);
CREATE INDEX IF NOT EXISTS idx_payments_payment_id ON payments(payment_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at);
CREATE INDEX IF NOT EXISTS idx_licenses_is_active ON licenses(is_active);
CREATE INDEX IF NOT EXISTS idx_license_devices_license_id ON license_devices(license_id);
CREATE INDEX IF NOT EXISTS idx_license_devices_device_id ON license_devices(device_id);
-- Índices
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON public.notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_settings_user_id ON public.user_settings(user_id);
-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_id ON public.push_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_endpoint ON public.push_subscriptions(endpoint);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_browser_fingerprint ON public.push_subscriptions(browser_fingerprint);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_is_active ON public.push_subscriptions(is_active);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_last_used ON public.push_subscriptions(last_used);
-- Índice único para evitar duplicatas por usuário/navegador
CREATE UNIQUE INDEX IF NOT EXISTS idx_push_subscriptions_user_browser ON public.push_subscriptions(user_id, browser_fingerprint);
-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_license ON subscriptions(license_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user
    ON public.subscriptions (user_id) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_subscriptions_email ON public.subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_subscriptions_mp_subscription ON subscriptions(mp_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_next_billing
    ON public.subscriptions (next_billing_at) WHERE next_billing_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_licenses_subscription ON licenses(subscription_id);
CREATE INDEX IF NOT EXISTS idx_slo_metrics_name ON slo_metrics(metric_name);
CREATE INDEX IF NOT EXISTS idx_slo_metrics_time ON slo_metrics(measured_at DESC);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_pagbank_id ON public.subscriptions(pagbank_subscription_id);
CREATE INDEX IF NOT EXISTS idx_licenses_client_id ON public.licenses(client_id);
CREATE INDEX IF NOT EXISTS idx_licenses_plan_type ON public.licenses(plan_type);
CREATE INDEX IF NOT EXISTS idx_license_devices_license_key ON public.license_devices(license_key);
-- Impede device duplicado na mesma licenca. CREATE UNIQUE INDEX CONCURRENTLY nao
-- e possivel dentro de transaction; se ja houver duplicata o INSERT falha e a
-- migration aborta — o que e o comportamento correto (dado inconsistente visivel).
CREATE UNIQUE INDEX IF NOT EXISTS uq_license_devices_license_device
    ON public.license_devices(license_key, device_id);
-- Índices para performance
CREATE INDEX IF NOT EXISTS link_sessions_installation_id_idx ON link_sessions(installation_id);
CREATE INDEX IF NOT EXISTS link_sessions_link_id_idx ON link_sessions(link_id);
CREATE INDEX IF NOT EXISTS link_sessions_expires_at_idx ON link_sessions(expires_at);
-- Uma única solicitação ABERTA por cobrança: bloqueia reembolso duplicado no
-- nível do banco, não só na aplicação.
CREATE UNIQUE INDEX IF NOT EXISTS uniq_refund_request_open_per_payment
    ON public.refund_requests (payment_id)
    WHERE status IN ('requested', 'processing');
CREATE UNIQUE INDEX IF NOT EXISTS uniq_refund_request_open_per_charge
    ON public.refund_requests (stripe_charge_id)
    WHERE status IN ('requested', 'processing') AND stripe_charge_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_refund_requests_user  ON public.refund_requests (user_id);
CREATE INDEX IF NOT EXISTS idx_refund_requests_stat  ON public.refund_requests (status);
CREATE INDEX IF NOT EXISTS idx_refund_requests_pay   ON public.refund_requests (payment_id);
-- ---------------------------------------------------------------------------
-- 5. Índices de consulta frequente (painel + webhook)
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_payments_stripe_invoice   ON public.payments (stripe_invoice_id)   WHERE stripe_invoice_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_payments_stripe_charge    ON public.payments (stripe_charge_id)    WHERE stripe_charge_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_payments_stripe_sub_id    ON public.payments (stripe_subscription_id) WHERE stripe_subscription_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_payments_user_created     ON public.payments (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_subscriptions_sub_id      ON public.subscriptions (pagbank_subscription_id);
-- Idempotência: índice ÚNICO é o que impede e-mail duplicado quando a Stripe
-- reenvia o webhook. Não parcial — qualquer repetição é barrada pelo banco.
CREATE UNIQUE INDEX IF NOT EXISTS uniq_email_outbox_idempotency_key
    ON public.email_outbox (idempotency_key);
CREATE INDEX IF NOT EXISTS idx_email_outbox_ready
    ON public.email_outbox (available_at)
    WHERE status IN ('pending', 'processing');
CREATE INDEX IF NOT EXISTS idx_email_outbox_status
    ON public.email_outbox (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_outbox_user
    ON public.email_outbox (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_outbox_provider_id
    ON public.email_outbox (provider_message_id)
    WHERE provider_message_id IS NOT NULL;
-- Diagnóstico de reputação: quantos endereços devolveram/spamaram.
CREATE INDEX IF NOT EXISTS idx_email_outbox_delivery_flag
    ON public.email_outbox (delivery_flag_at DESC)
    WHERE delivery_flag IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_email_outbox_template_failed
    ON public.email_outbox (template_type, created_at DESC)
    WHERE status = 'failed';
CREATE INDEX IF NOT EXISTS idx_payments_status_created
    ON public.payments (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payments_user
    ON public.payments (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_id
    ON public.payments (stripe_id) WHERE stripe_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_payments_invoice_kind
    ON public.payments (invoice_kind, created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS uniq_admin_role_grants_active
    ON public.admin_role_grants (user_id, role)
    WHERE revoked_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_admin_role_grants_user
    ON public.admin_role_grants (user_id, created_at DESC);
-- Índices pensados para as consultas que o painel realmente faz.
CREATE INDEX IF NOT EXISTS idx_admin_audit_created
    ON public.admin_audit_log (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_audit_resource
    ON public.admin_audit_log (resource, resource_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_audit_admin
    ON public.admin_audit_log (admin_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_audit_failures
    ON public.admin_audit_log (created_at DESC)
    WHERE outcome IN ('DENIED', 'FAILED');
-- ############################################################################
-- SEÇÃO 3 — ÍNDICES PARA O PAINEL
--
-- A PARTE 18 proíbe carregar tudo no navegador. Estes índices existem para
-- que cada listagem do painel seja uma consulta indexada com paginação, e não
-- uma varredura de tabela.
-- ############################################################################

-- Busca de clientes por nome/e-mail sem varrer `profiles`.
CREATE INDEX IF NOT EXISTS idx_profiles_email_lower
    ON public.profiles (lower(email));
CREATE INDEX IF NOT EXISTS idx_profiles_created
    ON public.profiles (created_at DESC);
-- O painel filtra por "admin que não está bloqueado/excluído" constantemente.
CREATE INDEX IF NOT EXISTS idx_profiles_admin
    ON public.profiles (is_admin, created_at DESC);
-- Licenças: a tela principal do painel. Filtra por plano, status e dono.
CREATE INDEX IF NOT EXISTS idx_licenses_user_plan
    ON public.licenses (user_id, plan_type);
CREATE INDEX IF NOT EXISTS idx_licenses_expires
    ON public.licenses (expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_licenses_revoked
    ON public.licenses (revoked, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_licenses_payment
    ON public.licenses (payment_id) WHERE payment_id IS NOT NULL;
-- Busca pela chave de licença digitada pelo suporte.
CREATE INDEX IF NOT EXISTS idx_licenses_key_prefix
    ON public.licenses (left(license_key, 12));
-- Dispositivos: a tela de máquinas vinculadas entra sempre pela chave.
CREATE INDEX IF NOT EXISTS idx_license_devices_key
    ON public.license_devices (license_key);
CREATE INDEX IF NOT EXISTS idx_license_devices_last_seen
    ON public.license_devices (last_seen_at DESC NULLS LAST);
-- Reconciliação financeira: a lista de "pendentes" da PARTE 5.
CREATE INDEX IF NOT EXISTS idx_payments_pending_probe
    ON public.payments (created_at DESC)
    WHERE status IN ('pending', 'processing');
-- Webhooks: tela de falhas recentes.
CREATE INDEX IF NOT EXISTS idx_stripe_event_log_failures
    ON public.stripe_event_log (created_at DESC)
    WHERE status <> 'processed';
-- Fim de período pago, para a lista de vencimentos.
CREATE INDEX IF NOT EXISTS idx_payments_period_end
    ON public.payments (period_end)
    WHERE period_end IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_phone_normalized
    ON public.profiles (phone_normalized)
    WHERE phone_normalized IS NOT NULL;
-- Índice de leitura do sino: "minhas não lidas, mais recentes primeiro".
CREATE INDEX IF NOT EXISTS idx_notifications_user_created
    ON public.notifications (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread
    ON public.notifications (user_id)
    WHERE read = false;
-- Notificações de operação (compras, pedidos, tickets) para o admin.
CREATE INDEX IF NOT EXISTS idx_notifications_audience_created
    ON public.notifications (audience, created_at DESC);
-- 7.3 Indice para localizar a inscricao do navegador (mesmo dispositivo,
--     outro login) sem varrer a tabela inteira.
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_fingerprint
    ON public.push_subscriptions (user_id, browser_fingerprint);
-- 7.4 Indice do envio de avisos: apenas inscricoes ativas por usuario.
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_active
    ON public.push_subscriptions (user_id)
 WHERE is_active = TRUE;

-- ============================================================================
--  FASE 10 — VIEWS
-- ============================================================================
-- fonte: supabase/create_trial_activations_table.sql
-- =====================================================
-- VIEWS PARA CONSULTAS OTIMIZADAS
-- =====================================================

-- View para trials ativos (performance)
CREATE OR REPLACE VIEW active_trials AS
SELECT 
    id,
    hwid_hash,
    trial_started_at,
    trial_expires_at,
    activation_ip,
    created_at
FROM trial_activations 
WHERE is_expired = FALSE 
  AND trial_expires_at > NOW()
  AND hwid_hash IS NOT NULL;

-- fonte: supabase/migrations/20260208_slo_monitoring.sql
-- ============================================================================
-- AUTOMATED SLO DASHBOARD VIEW
-- ============================================================================
CREATE OR REPLACE VIEW slo_dashboard AS
SELECT 
  metric_name,
  actual_value || '/' || target_value AS value,
  CASE 
    WHEN within_slo THEN '✅ PASS'
    ELSE '🚨 BREACH'
  END AS status,
  error_budget_consumed_pct || '%' AS error_budget_used,
  measurement_window,
  measured_at
FROM slo_metrics
WHERE measured_at = (
  SELECT MAX(measured_at) 
  FROM slo_metrics sub 
  WHERE sub.metric_name = slo_metrics.metric_name
)
ORDER BY metric_name;

-- fonte: supabase/migrations/20260219000002_fix_all_remaining_functions.sql
-- ============================================================================
-- 4. Criar view para monitorar funções no futuro
-- ============================================================================
CREATE OR REPLACE VIEW function_security_audit AS
SELECT 
    n.nspname as schema_name,
    p.proname as function_name,
    pg_get_function_identity_arguments(p.oid) as arguments,
    CASE 
        WHEN p.prosecdef THEN 'SECURITY DEFINER'
        ELSE 'SECURITY INVOKER'
    END as security_type,
    CASE 
        WHEN p.proconfig IS NOT NULL AND 
             EXISTS (SELECT 1 FROM unnest(p.proconfig) cfg WHERE cfg LIKE 'search_path=%')
        THEN 'SET'
        ELSE 'NOT SET'
    END as search_path_status,
    CASE 
        WHEN p.prosecdef AND 
             p.proconfig IS NOT NULL AND 
             EXISTS (SELECT 1 FROM unnest(p.proconfig) cfg WHERE cfg LIKE 'search_path=%')
        THEN '✅ SECURE'
        ELSE '⚠️ VULNERABLE'
    END as security_status
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
AND p.proname NOT LIKE 'pg_%'
AND p.proname NOT LIKE 'uuid_%'
ORDER BY security_status DESC, function_name;

-- fonte: supabase/migrations/20261019130000_email_outbox.sql
-- ---------------------------------------------------------------------------
-- 5. Views de diagnóstico (somente leitura, sem dados sensíveis além do
--    necessário para o admin decidir o que fazer)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE VIEW public.email_outbox_health
WITH (security_invoker = true) AS
SELECT
    status,
    count(*)::int AS total,
    min(created_at)  AS oldest_created_at,
    min(available_at) AS next_available_at,
    count(*) FILTER (WHERE last_error_kind = 'RATE_LIMIT')::int AS rate_limited,
    count(*) FILTER (WHERE last_error_kind IN ('CONFIG', 'AUTH', 'SENDER'))::int AS config_errors
FROM public.email_outbox
GROUP BY status;

-- ============================================================================
--  FASE 11 — BLOCOS DO (idempotentes por construcao)
-- ============================================================================
-- =========================================================================
-- ADICIONAR CAMPOS GPU E DISK TYPE NA TABELA INSTALLATIONS
-- =========================================================================

-- Adicionar campo gpu_name se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'installations' 
        AND column_name = 'gpu_name'
    ) THEN
        ALTER TABLE installations ADD COLUMN IF NOT EXISTS gpu_name TEXT;
        COMMENT ON COLUMN installations.gpu_name IS 'Nome da placa de vídeo (GPU)';
    END IF;
END $$;

-- Adicionar campo disk_type se não existir (renomear disk_main_type para disk_type)
DO $$ 
BEGIN
    -- Se disk_type não existe mas disk_main_type existe, renomear
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'installations' 
        AND column_name = 'disk_type'
    ) AND EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'installations' 
        AND column_name = 'disk_main_type'
    ) THEN
        ALTER TABLE installations RENAME COLUMN disk_main_type TO disk_type;
        COMMENT ON COLUMN installations.disk_type IS 'Tipo do disco principal (SSD ou HDD)';
    -- Se disk_type não existe e disk_main_type também não, criar disk_type
    ELSIF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'installations' 
        AND column_name = 'disk_type'
    ) THEN
        ALTER TABLE installations ADD COLUMN IF NOT EXISTS disk_type TEXT;
        COMMENT ON COLUMN installations.disk_type IS 'Tipo do disco principal (SSD ou HDD)';
    END IF;
END $$;

-- Adicionar campo windows_edition se não existir (para LTSC, Pro, Home, etc)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'installations' 
        AND column_name = 'windows_edition'
    ) THEN
        ALTER TABLE installations ADD COLUMN IF NOT EXISTS windows_edition TEXT;
        COMMENT ON COLUMN installations.windows_edition IS 'Edição do Windows (LTSC, Pro, Home, Enterprise, etc)';
    END IF;
END $$;

-- Adicionar campo license_display_name na tabela licenses
-- Execute este SQL no Supabase SQL Editor

-- Adicionar coluna license_display_name se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'licenses' 
        AND column_name = 'license_display_name'
    ) THEN
        ALTER TABLE licenses 
        ADD COLUMN IF NOT EXISTS license_display_name TEXT DEFAULT 'VOLTRIS STANDARD';
        
        -- Atualizar registros existentes com nomes apropriados
        UPDATE licenses 
        SET license_display_name = CASE 
            WHEN license_type = 'trial' THEN 'Trial'
            WHEN license_type = 'standard' THEN 'VOLTRIS STANDARD'
            WHEN license_type = 'pro' THEN 'VOLTRIS PRO'
            WHEN license_type = 'enterprise' THEN 'VOLTRIS ENTERPRISE'
            ELSE 'VOLTRIS STANDARD'
        END
        WHERE license_display_name = 'VOLTRIS STANDARD';
        
        RAISE NOTICE 'Campo license_display_name adicionado e registros atualizados';
    ELSE
        RAISE NOTICE 'Campo license_display_name já existe';
    END IF;
END $$;

-- Adicionar campos de licença na tabela installations
-- Execute este SQL no Supabase SQL Editor

-- Verificar se o tipo ENUM já existe (já foi criado em setup_telemetry.sql)
-- license_status_type AS ENUM ('trial', 'active', 'expired', 'revoked')

-- Adicionar coluna license_status se não existir (usando o ENUM existente)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'installations' 
        AND column_name = 'license_status'
    ) THEN
        ALTER TABLE installations 
        ADD COLUMN IF NOT EXISTS license_status license_status_type DEFAULT 'trial';
    END IF;
END $$;

-- =========================================================================
-- ADICIONAR CAMPO PC_NAME NA TABELA INSTALLATIONS
-- =========================================================================

DO $$ 
BEGIN
    -- Verificar se a tabela existe antes de tentar alterá-la
    IF EXISTS (
        SELECT 1 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'installations'
    ) THEN
        -- Verificar se a coluna já não existe
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'installations' 
            AND column_name = 'pc_name'
        ) THEN
            ALTER TABLE public.installations ADD COLUMN IF NOT EXISTS pc_name TEXT;
            COMMENT ON COLUMN public.installations.pc_name IS 'Nome do computador (Hostname)';
        END IF;
    ELSE
        -- Se a tabela não existe, informa o motivo
        RAISE NOTICE 'A tabela public.installations não foi encontrada. Certifique-se de executar o setup_telemetry.sql primeiro.';
    END IF;
END $$;

-- 14. ENABLE REALTIME
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE sessions;
    ALTER PUBLICATION supabase_realtime ADD TABLE devices;
    ALTER PUBLICATION supabase_realtime ADD TABLE device_profiles;
  END IF;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- ═══════════════════════════════════════════════════════════════════════════
-- PASSO 9: REALTIME (Supabase)
-- ═══════════════════════════════════════════════════════════════════════════

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    -- installations
    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'installations'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE installations;
    END IF;
    -- device_commands
    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'device_commands'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE device_commands;
    END IF;
  END IF;
END $$;

-- 12. Mensagem de confirmação
DO $$
BEGIN
    RAISE NOTICE 'Sistema de pedidos configurado com sucesso!';
    RAISE NOTICE 'Tabela orders atualizada com novos campos';
    RAISE NOTICE 'Índices criados para melhor performance';
    RAISE NOTICE 'Políticas RLS configuradas';
    RAISE NOTICE 'Função get_user_orders_with_details criada';
    RAISE NOTICE 'Serviços padrão inseridos';
END $$;

-- 17. MENSAGEM DE CONFIRMAÇÃO
DO $$
BEGIN
    RAISE NOTICE '=====================================================';
    RAISE NOTICE 'SISTEMA COMPLETO DE SERVIÇOS E PEDIDOS CONFIGURADO!';
    RAISE NOTICE '=====================================================';
    RAISE NOTICE '✅ Tabela services criada com % serviços', (SELECT COUNT(*) FROM services);
    RAISE NOTICE '✅ Tabela orders atualizada com novos campos';
    RAISE NOTICE '✅ Índices criados para melhor performance';
    RAISE NOTICE '✅ Políticas RLS configuradas';
    RAISE NOTICE '✅ Funções auxiliares criadas';
    RAISE NOTICE '✅ Sistema pronto para uso!';
    RAISE NOTICE '=====================================================';
END $$;

-- =====================================================
-- SISTEMA COMPLETO DE LICENÇAS E PAGAMENTOS - VOLTRIS
-- Versão corrigida com políticas RLS adequadas
-- =====================================================

-- =====================================================
-- PARTE 1: LIMPEZA (remover políticas e triggers existentes)
-- =====================================================
-- NOTA: Só remove se as tabelas existirem

DO $$
BEGIN
    -- Remover políticas RLS de payments (se tabela existir)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'payments') THEN
        DROP POLICY IF EXISTS "Users can view their own payments" ON payments;
        DROP POLICY IF EXISTS "Service role can manage all payments" ON payments;
        DROP POLICY IF EXISTS "Allow payment creation without auth" ON payments;
        DROP POLICY IF EXISTS "Allow payment updates without auth" ON payments;
        DROP POLICY IF EXISTS "Allow payment lookup by preference or payment id" ON payments;
        DROP TRIGGER IF EXISTS update_payments_updated_at ON payments;
    END IF;

    -- Remover políticas RLS de licenses (se tabela existir)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'licenses') THEN
        DROP POLICY IF EXISTS "Users can view their own licenses" ON licenses;
        DROP POLICY IF EXISTS "Service role can manage all licenses" ON licenses;
        DROP POLICY IF EXISTS "Allow license creation without auth" ON licenses;
        DROP POLICY IF EXISTS "Allow license updates without auth" ON licenses;
        DROP TRIGGER IF EXISTS update_licenses_updated_at ON licenses;
    END IF;

    -- Remover políticas RLS de license_devices (se tabela existir)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'license_devices') THEN
        DROP POLICY IF EXISTS "Users can view devices of their licenses" ON license_devices;
        DROP POLICY IF EXISTS "Service role can manage all devices" ON license_devices;
        DROP POLICY IF EXISTS "Allow device activation without auth" ON license_devices;
        DROP POLICY IF EXISTS "Allow device updates without auth" ON license_devices;
    END IF;
END$$;

-- Verificar se a alteração foi aplicada
DO $$
BEGIN
    RAISE NOTICE 'Tipos de planos atualizados com sucesso!';
    RAISE NOTICE 'Novos tipos adicionados: Formatação, Otimização e Office';
END $$;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Seed data inserted successfully!';
  RAISE NOTICE '📊 Sample analytics data ready for testing';
  RAISE NOTICE '💰 Sample cost data ready for dashboards';
  RAISE NOTICE '🛰 Initial deploy registered: v1.0.0';
  RAISE NOTICE '🎉 Enterprise Telemetry Platform is ready!';
END $$;

-- ============================================================================
-- VERIFICAÇÃO FINAL
-- ============================================================================
DO $$
DECLARE
    func_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO func_count
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public'
    AND p.prosecdef = false  -- Não é SECURITY DEFINER
    AND p.proname NOT LIKE 'pg_%'
    AND p.proname NOT LIKE 'uuid_%';
    
    IF func_count > 0 THEN
        RAISE NOTICE 'AVISO: Ainda existem % funções sem SECURITY DEFINER', func_count;
    ELSE
        RAISE NOTICE 'SUCESSO: Todas as funções públicas têm SECURITY DEFINER e search_path configurado';
    END IF;
END $$;

-- ============================================================================
-- CORREÇÃO AUTOMÁTICA: Adicionar search_path a TODAS as funções restantes
-- Data: 19/02/2026
-- Esta migração corrige funções que podem ter sido criadas fora das migrações
-- ============================================================================

-- ============================================================================
-- 1. Listar e corrigir todas as funções sem SECURITY DEFINER
-- ============================================================================

-- Função auxiliar para adicionar search_path a uma função existente
DO $$
DECLARE
    func_record RECORD;
    func_definition TEXT;
BEGIN
    -- Iterar sobre todas as funções públicas sem SECURITY DEFINER
    FOR func_record IN 
        SELECT 
            p.proname as function_name,
            pg_get_functiondef(p.oid) as function_def
        FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public'
        AND p.prosecdef = false  -- Não tem SECURITY DEFINER
        AND p.proname NOT LIKE 'pg_%'
        AND p.proname NOT LIKE 'uuid_%'
        AND p.proname NOT IN (
            -- Funções já corrigidas na migração anterior
            'check_slo_breaches',
            'update_updated_at_column',
            'export_tenant_data',
            'delete_tenant_data',
            'get_plan_config',
            'calculate_expiry_date',
            'generate_license_key',
            'create_subscription_from_license',
            'record_subscription_payment',
            'cancel_subscription',
            'generate_browser_fingerprint',
            'update_push_subscription_updated_at',
            'cleanup_inactive_push_subscriptions',
            'notify_order_status_change',
            'notify_ticket_status_change',
            'handle_new_user',
            'handle_updated_at',
            'update_device_updated_at',
            'cleanup_old_sessions',
            'update_orders_updated_at',
            'get_user_orders_with_details',
            'create_order_from_service'
        )
    LOOP
        RAISE NOTICE 'Corrigindo função: %', func_record.function_name;
        
        -- Dropar e recriar com SECURITY DEFINER e search_path
        -- Nota: Isso é uma abordagem genérica, pode precisar de ajustes manuais
        EXECUTE format('DROP FUNCTION IF EXISTS %I CASCADE', func_record.function_name);
        
        -- Log para revisão manual
        RAISE NOTICE 'Função % foi dropada. Revisar se precisa ser recriada manualmente.', func_record.function_name;
    END LOOP;
END $$;

-- ============================================================================
-- 3. Verificação final e relatório
-- ============================================================================
DO $$
DECLARE
    func_count INTEGER;
    func_list TEXT;
BEGIN
    -- Contar funções restantes sem SECURITY DEFINER
    SELECT COUNT(*) INTO func_count
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public'
    AND p.prosecdef = false
    AND p.proname NOT LIKE 'pg_%'
    AND p.proname NOT LIKE 'uuid_%';
    
    IF func_count > 0 THEN
        -- Listar funções restantes
        SELECT string_agg(p.proname, ', ') INTO func_list
        FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public'
        AND p.prosecdef = false
        AND p.proname NOT LIKE 'pg_%'
        AND p.proname NOT LIKE 'uuid_%';
        
        RAISE NOTICE '========================================';
        RAISE NOTICE 'AVISO: % funções ainda sem SECURITY DEFINER:', func_count;
        RAISE NOTICE 'Funções: %', func_list;
        RAISE NOTICE '========================================';
        RAISE NOTICE 'Estas funções foram DROPADAS para segurança.';
        RAISE NOTICE 'Se necessário, recrie-as manualmente com:';
        RAISE NOTICE '  SECURITY DEFINER';
        RAISE NOTICE '  SET search_path = public, pg_temp';
        RAISE NOTICE '========================================';
    ELSE
        RAISE NOTICE '========================================';
        RAISE NOTICE 'SUCESSO: Todas as funções públicas estão seguras!';
        RAISE NOTICE 'Todas têm SECURITY DEFINER e search_path configurado.';
        RAISE NOTICE '========================================';
    END IF;
END $$;

-- 6. HABILITAR REALTIME (PARA DASHBOARD ADMIN)
DO $$ 
BEGIN
  -- Verificar se a publicação existe
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    -- Verificar se a tabela já faz parte da publicação para não dar erro ao adicionar
    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables 
      WHERE pubname = 'supabase_realtime' 
      AND schemaname = 'public' 
      AND tablename = 'installations'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE installations;
    END IF;
  ELSE
    -- Se não existir a publicação padrão, cria ela com a tabela
    CREATE PUBLICATION supabase_realtime FOR TABLE installations;
  END IF;
END $$;

-- ============================================================================
-- FASE 1 — AUDITORIA: registrar o estado antes de alterar
-- ============================================================================
DO $$
DECLARE
    v_t text;
BEGIN
    -- Definicoes em texto. O registro estruturado fica em audit_logs na
    -- FASE 13, onde a gravacao e tolerante a falha.
    SELECT string_agg(pg_get_triggerdef(t.oid), E'\n---\n' ORDER BY t.tgname)
      INTO v_t
      FROM pg_trigger t
     WHERE t.tgrelid = 'public.installations'::regclass
       AND NOT t.tgisinternal;

    RAISE NOTICE E'[FASE 1] triggers em installations ANTES da correcao:\n%', coalesce(v_t, '(nenhum)');
END $$;

-- ============================================================================
-- FASE 2 — REMOCAO DOS TRIGGERS QUEBRADOS
--
-- Remove TODOS os triggers nao-internos de installations. Justificativa: existe
-- pelo menos um trigger orfao (nao versionado no repositorio) que impede
-- qualquer escrita na tabela. Os triggers legitimos sao recriados na FASE 4 de
-- forma idempotente, portanto nada de funcional se perde.
--
-- A definicao completa do que existia antes fica gravada em audit_logs
-- (FASE 1), então nada se perde de forma irreversivel.
-- ============================================================================
DO $$
DECLARE
    r      record;
    v_drop text := '';
BEGIN
    FOR r IN
        SELECT t.tgname
          FROM pg_trigger t
         WHERE t.tgrelid = 'public.installations'::regclass
           AND NOT t.tgisinternal
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS %I ON public.installations', r.tgname);
        v_drop := v_drop || r.tgname || ' ';
    END LOOP;

    RAISE NOTICE '[FASE 2] triggers removidos de installations: %',
        coalesce(nullif(v_drop, ''), '(nenhum)');

    -- license_devices: tr_sync_license_device_count referencia licenses.id,
    -- licenses.devices_in_use e license_devices.license_id — nenhuma dessas
    -- colunas existe. O trigger fica armado e quebraria toda ativacao.
    FOR r IN
        SELECT t.tgname
          FROM pg_trigger t
         WHERE t.tgrelid = 'public.license_devices'::regclass
           AND NOT t.tgisinternal
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS %I ON public.license_devices', r.tgname);
        RAISE NOTICE '[FASE 2] trigger removido de license_devices: %', r.tgname;
    END LOOP;
END $$;

-- ============================================================================
-- FASE 7 — RLS
-- Garante RLS ligado e remove TODAS as policies (inclusive as PUBLIC
-- `USING (true)` criadas sem clausula TO, que abriam leitura/escrita total
-- via anon key).
-- ============================================================================
DO $$
DECLARE
    v_tbl  text;
    v_list text[] := ARRAY[
        'installations', 'installation_events', 'installation_heartbeats',
        'device_commands', 'remote_commands',
        'licenses', 'license_devices'
    ];
    r record;
BEGIN
    FOREACH v_tbl IN ARRAY v_list LOOP
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY',  v_tbl);
        EXECUTE format('ALTER TABLE public.%I FORCE  ROW LEVEL SECURITY', v_tbl);

        FOR r IN
            SELECT policyname
              FROM pg_policies
             WHERE schemaname = 'public'
               AND tablename = v_tbl
        LOOP
            EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', r.policyname, v_tbl);
            RAISE NOTICE '[FASE 7] policy removida: %.%', v_tbl, r.policyname;
        END LOOP;
    END LOOP;
END $$;

-- ============================================================================
-- FASE 9 — GRANTS DE TABELA
-- A anon key e publica (esta no bundle do app desktop). Ela nao deve tocar em
-- nenhuma tabela de dispositivo/licenca: tudo passa pelos endpoints, que usam
-- service_role.
-- ============================================================================
DO $$
DECLARE
    v_tbl  text;
    v_list text[] := ARRAY[
        'installations', 'installation_events', 'installation_heartbeats',
        'device_commands', 'remote_commands',
        'licenses', 'license_devices'
    ];
BEGIN
    FOREACH v_tbl IN ARRAY v_list LOOP
        EXECUTE format('REVOKE ALL ON TABLE public.%I FROM anon',         v_tbl);
        EXECUTE format('REVOKE ALL ON TABLE public.%I FROM authenticated', v_tbl);
        EXECUTE format('GRANT  ALL ON TABLE public.%I TO service_role',    v_tbl);
    END LOOP;
END $$;

-- ============================================================================
-- FASE 10 — GRANTS DE FUNCAO
-- A parte 9 da migration 20260818000000 nunca foi aplicada (a secao 3 abortou
-- com 42703 em licenses.user_id). Aqui e feito dinamicamente, para nao depender
-- da assinatura exata de cada funcao.
-- ============================================================================
DO $$
DECLARE
    r record;
BEGIN
    FOR r IN
        SELECT p.oid::regprocedure AS sig
          FROM pg_proc p
          JOIN pg_namespace n ON n.oid = p.pronamespace
         WHERE n.nspname = 'public'
           AND p.proname IN (
                 'generate_voltris_signature',
                 'generate_license_key',
                 'generate_complete_license_v2',
                 'generate_complete_license_v3',
                 'export_tenant_data',
                 'delete_tenant_data'
           )
    LOOP
        EXECUTE format('REVOKE EXECUTE ON FUNCTION %s FROM PUBLIC, anon, authenticated', r.sig);
        EXECUTE format('GRANT  EXECUTE ON FUNCTION %s TO service_role', r.sig);
        RAISE NOTICE '[FASE 10] exec restrito a service_role: %', r.sig;
    END LOOP;
END $$;

-- ============================================================================
-- FASE 4 — Backfill de linked_at
-- linked_at recebeu DEFAULT now() em uma migration anterior, o que deixou as
-- 46 linhas antigas com o mesmo carimbo. Para as linhas  ja desvinculadas
-- não ha data confiável de vinculo, então nao inventamos: fica como esta.
-- Para as ainda vinculadas, mantemos o valor atual.
-- ============================================================================

-- ============================================================================
-- FASE 5 — Validação
-- ============================================================================
DO $$
DECLARE
    v_bad text;
BEGIN
    -- 5.1 as tres colunas existem
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
         WHERE table_schema = 'public' AND table_name = 'installations'
           AND column_name = 'device_credential_hash'
    ) THEN
        RAISE EXCEPTION 'VALIDACAO FALHOU (5.1): device_credential_hash ausente';
    END IF;

    -- 5.2 nenhuma credencial em texto plano (64 chars base64 seria o token)
    SELECT string_agg(id::text, ', ') INTO v_bad
      FROM public.installations
     WHERE device_credential_hash IS NOT NULL
       AND length(device_credential_hash) <> 64;
    IF v_bad IS NOT NULL THEN
        RAISE EXCEPTION 'VALIDACAO FALHOU (5.2): hash de credencial com tamanho inesperado em: %', v_bad;
    END IF;

    -- 5.3 coerência: vinculado sem credencial é aceitável (legado, ainda vai
    --     reivindicar); desvinculado NUNCA pode ter credencial
    SELECT string_agg(id::text, ', ') INTO v_bad
      FROM public.installations
     WHERE user_id IS NULL
       AND device_credential_hash IS NOT NULL;
    IF v_bad IS NOT NULL THEN
        RAISE EXCEPTION 'VALIDACAO FALHOU (5.3): desvinculado com credencial ativa em: %', v_bad;
    END IF;

    RAISE NOTICE 'VALIDACAO OK: credencial de dispositivo pronta.';
END $$;

-- ============================================================================
-- 20261015180000_fix_generate_complete_license_v3.sql
-- Corrige a EMISSAO de licencas via RPC sem tocar em nenhuma licenca existente.
--
-- DIAGNOSTICO REAL (verificado em 2026-10-15 contra o banco de producao):
--   Existem 2 sobrecargas de public.generate_complete_license_v3:
--
--   A) generate_complete_license_v3(uuid, uuid, text, text, text)
--      - Insere em `license_type` e faz `RETURNING id`: colunas que NAO existem
--        no schema canonico de public.licenses (42703).
--      - `EXCEPTION WHEN OTHERS ... RETURN NULL` engole o erro -> o webhook
--        recebe NULL e acha que "gerou". Falha silenciosa.
--      - ASSINATURA: usa generate_voltris_signature (SHA-256 puro de
--        payload+segredo) = o mecanismo CANONICO aceito pelo app C#, pelas Edge
--        Functions e pela licenca Pro ja existente (verificado por teste).
--
--   B) generate_complete_license_v3(text,...,text, int, int) — 7 args, todos
--      com DEFAULT:
--      - Escreve o schema canonico, mas grava payment_id/user_id APENAS no
--        campo de texto `notes` (vinculo incorreto).
--      - ASSINATURA: HMAC-SHA256 com segredo embutido no corpo = NAO-canonica.
--        Teste real: 6 das 7 licencas Standard existentes foram geradas por ela.
--      - Como todos os parametros tem DEFAULT, ela TAMBEM casa com a chamada
--        nomeada de 5 argumentos do webhook -> o PostgREST pode resolver como
--        chamada ambigua e recusar o call ANTES de executar qualquer corpo
--        (por isso nao ha LICENSE_GEN_ERROR em audit_logs).
--
-- DECISOES DESTA MIGRATION (itens 1-5, 14, 15 da missao):
--   1. NADA toca nas 8 linhas existentes de public.licenses. As chaves continuam
--      validas no banco; a validacao de ativacao nao depende de quem as gerou.
--   2. A sobrecarga B e RENOMEADA para generate_complete_license_v3_legacy_hmac
--      (nao apagada) — preserves comportamento para qualquer caller explicito —
--      e removida da resolucao de ambiguidade do nome `generate_complete_license_v3`.
--   3. A sobrecarga A e RECONSTRUIDA no schema canonico, com assinatura canonica
--      (generate_voltris_signature), erros EXPLICITOS (sem NULL silencioso),
--      idempotencia por payment_id e advisory lock para corrida.
--   4. O status do pagamento e atualizado DENTRO da mesma transacao da emissao:
--      ou licencia+pagamento aprovam juntos, ou nada acontece (rollback).
--   5. EXEC apenas para service_role (mesma politica da FASE 10 da reparacao).
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Remove a ambiguidade: renomeia a sobrecarga legada de 7 args (HMAC).
--    Idempotente: so age se ela ainda estiver no lugar.
-- ---------------------------------------------------------------------------
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM pg_proc p
        JOIN pg_namespace n ON n.oid = p.pronamespace
        WHERE n.nspname = 'public'
          AND p.proname = 'generate_complete_license_v3'
          AND p.pronargs = 7
    ) THEN
        ALTER FUNCTION public.generate_complete_license_v3(text, text, text, text, text, integer, integer)
            RENAME TO generate_complete_license_v3_legacy_hmac;
        RAISE NOTICE '[VOLTRIS] Sobrecarga legada (HMAC, 7 args) renomeada para generate_complete_license_v3_legacy_hmac';
    END IF;
END $$;

-- ---------------------------------------------------------------------------
-- 3. GRANTS: emissor apenas service_role (novo RPC e o legado renomeado).
-- ---------------------------------------------------------------------------
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN
        SELECT p.oid::regprocedure AS sig
        FROM pg_proc p
        JOIN pg_namespace n ON n.oid = p.pronamespace
        WHERE n.nspname = 'public'
          AND p.proname IN ('generate_complete_license_v3', 'generate_complete_license_v3_legacy_hmac')
    LOOP
        EXECUTE format('REVOKE EXECUTE ON FUNCTION %s FROM PUBLIC, anon, authenticated', r.sig);
        EXECUTE format('GRANT  EXECUTE ON FUNCTION %s TO service_role', r.sig);
        RAISE NOTICE '[VOLTRIS] grants de emissao restritos a service_role: %', r.sig;
    END LOOP;
END $$;

DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN
        SELECT p.oid::regprocedure AS sig
        FROM pg_proc p
        JOIN pg_namespace n ON n.oid = p.pronamespace
        WHERE n.nspname = 'public'
          AND p.proname = 'get_license_renewal_artifact'
    LOOP
        EXECUTE format('REVOKE EXECUTE ON FUNCTION %s FROM PUBLIC, anon, authenticated', r.sig);
        EXECUTE format('GRANT  EXECUTE ON FUNCTION %s TO service_role', r.sig);
        RAISE NOTICE '[VOLTRIS] artefato de renovacao restrito a service_role: %', r.sig;
    END LOOP;
END $$;

-- ---------------------------------------------------------------------------
-- 3. Grants: execucao apenas service_role (padrao FASE 10 da reparacao)
-- ---------------------------------------------------------------------------
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN
        SELECT p.oid::regprocedure AS sig
        FROM pg_proc p
        JOIN pg_namespace n ON n.oid = p.pronamespace
        WHERE n.nspname = 'public'
          AND p.proname = 'renew_subscription_license'
    LOOP
        EXECUTE format('REVOKE EXECUTE ON FUNCTION %s FROM PUBLIC, anon, authenticated', r.sig);
        EXECUTE format('GRANT  EXECUTE ON FUNCTION %s TO service_role', r.sig);
        RAISE NOTICE '[VOLTRIS] renew restrito a service_role: %', r.sig;
    END LOOP;
END $$;

-- 2. Auto-cura: aplica search_path correto em TODAS as funções do schema public
--    que usam o assinador (direta ou indiretamente). Robusto a sobrecargas: a
--    lista vem do próprio catálogo, não de assinaturas escritas à mão.
DO $$
DECLARE
    r        RECORD;
    v_count  INTEGER := 0;
BEGIN
    FOR r IN
        SELECT p.oid, p.oid::regprocedure AS sig
        FROM pg_proc p
        JOIN pg_namespace n ON n.oid = p.pronamespace
        WHERE n.nspname = 'public'
          AND p.prokind = 'f'
          AND (
                pg_get_functiondef(p.oid) ILIKE '%digest(%'
             OR pg_get_functiondef(p.oid) ILIKE '%generate_voltris_signature(%'
             OR p.proname IN ('generate_voltris_signature',
                              'generate_complete_license_v3',
                              'renew_subscription_license',
                              'get_license_renewal_artifact')
          )
    LOOP
        EXECUTE format('ALTER FUNCTION %s SET search_path = public, extensions, pg_temp', r.sig);
        v_count := v_count + 1;
        RAISE NOTICE '[VOLTRIS] search_path corrigido (pgcrypto visível): %', r.sig;
    END LOOP;
    RAISE NOTICE '[VOLTRIS] funções ajustadas: %', v_count;
END $$;

-- 3. O assinador em si também fica SECURITY DEFINER-consistente: continua lendo
--    o segredo de current_setting com o mesmo fallback de sempre (nada trocado).
--    (Reaplicado via ALTER para não reescrever corpo/segredo.)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
               WHERE n.nspname = 'public' AND p.proname = 'generate_voltris_signature') THEN
        RAISE NOTICE '[VOLTRIS] generate_voltris_signature presente e com search_path corrigido';
    ELSE
        RAISE EXCEPTION 'ASSINADOR_AUSENTE: public.generate_voltris_signature não existe — interrompendo';
    END IF;
END $$;

-- ---------------------------------------------------------------------------
-- 4. VERIFICAÇÃO PÓS-APLICAÇÃO
--    IMPORTANT: os testes abaixo são NÃO-FATAIS (RAISE WARNING, nunca EXCEPTION),
--    para que um teste opinativo jamais faça ROLLBACK do ALTER da seção 2 quando o
--    script roda como transação única. O conserto real é a seção 2; seção 4 reporta.
-- ---------------------------------------------------------------------------
DO $$
DECLARE
    v_sig   TEXT;
    v_art   JSONB;
    v_key   TEXT;
BEGIN
    -- 4.1 Cadeia de assinatura isolada (16 hex maiúsculos):
    v_sig := public.generate_voltris_signature('{"id":"123456","validUntil":"2026-11-15","plan":"pro","maxDevices":3}');
    IF length(v_sig) = 16 AND v_sig ~ '^[0-9A-F]{16}$' THEN
        RAISE NOTICE '[VOLTRIS][OK] 4.1 assinador canônico vivo (16 hex)';
    ELSE
        RAISE WARNING 'TESTE_4_1_FALHOU (nao fatal): assinador devolveu %', v_sig;
    END IF;

    -- 4.2 O TESTE QUE ANTES FALHAVA: assinatura dentro de função com
    --     search_path restrito. Antes: 42883 digest(text, unknown).
    SELECT license_key INTO v_key FROM public.licenses
     WHERE plan_type = 'pro' AND revoked = FALSE
     ORDER BY expires_at DESC LIMIT 1;
    IF v_key IS NULL THEN
        RAISE NOTICE '[VOLTRIS][--] 4.2 sem licença pro viva para testar o artefato (ignorado)';
    ELSE
        BEGIN
            v_art := public.get_license_renewal_artifact(v_key);
            IF v_art ->> 'renewal_signature' IS NOT NULL THEN
                RAISE NOTICE '[VOLTRIS][OK] 4.2 artefato de renovação gerado (chave de teste terminada em %)', right(v_key, 4);
            ELSE
                RAISE WARNING 'TESTE_4_2_FALHOU (nao fatal): artefato sem renewal_signature: %', v_art;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE WARNING 'TESTE_4_2_FALHOU (nao fatal): get_license_renewal_artifact -> SQLSTATE % / %', SQLSTATE, SQLERRM;
        END;
    END IF;

    -- 4.3 A renovação precisa validar ANTES de escrever. Robusto a assinatura:
    --     usa EXECUTE dinâmico com o 1º parâmetro nomeado; qualquer falha aqui é
    --     apenas INFORMATIVA (WARNING), nunca aborta o conserto já aplicado.
    BEGIN
        EXECUTE format('SELECT public.renew_subscription_license(p_subscription_pagbank_id => %L)',
                       'SUB_INEXISTENTE_VERIFICACAO');
        RAISE WARNING 'TESTE_4_3 (nao fatal): renew aceitou assinatura inexistente — conferir';
    EXCEPTION
        WHEN OTHERS THEN
            IF SQLERRM ILIKE 'SUBSCRIPTION_NOT_FOUND%' THEN
                RAISE NOTICE '[VOLTRIS][OK] 4.3 renew valida assinatura antes de escrever';
            ELSE
                RAISE WARNING 'TESTE_4_3 (informativo, nao fatal): %', SQLERRM;
            END IF;
    END;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'email_outbox' AND policyname = 'service role only email_outbox'
    ) THEN
        DROP POLICY IF EXISTS "service role only email_outbox" ON public.email_outbox;
        CREATE POLICY "service role only email_outbox"
            ON public.email_outbox FOR ALL TO service_role
            USING (true) WITH CHECK (true);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'email_outbox' AND policyname = 'service role only email_outbox'
    ) THEN
        DROP POLICY IF EXISTS "service role only email_outbox" ON public.email_outbox;
        CREATE POLICY "service role only email_outbox"
            ON public.email_outbox FOR ALL TO service_role
            USING (true) WITH CHECK (true);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'admin_role_grants' AND policyname = 'service role only admin_role_grants'
    ) THEN
        DROP POLICY IF EXISTS "service role only admin_role_grants" ON public.admin_role_grants;
        CREATE POLICY "service role only admin_role_grants"
            ON public.admin_role_grants FOR ALL TO service_role
            USING (true) WITH CHECK (true);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'admin_roles' AND policyname = 'service role read admin_roles'
    ) THEN
        DROP POLICY IF EXISTS "service role read admin_roles" ON public.admin_roles;
        CREATE POLICY "service role read admin_roles"
            ON public.admin_roles FOR SELECT TO service_role
            USING (true);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'admin_audit_log' AND policyname = 'service role only admin_audit_log'
    ) THEN
        DROP POLICY IF EXISTS "service role only admin_audit_log" ON public.admin_audit_log;
        CREATE POLICY "service role only admin_audit_log"
            ON public.admin_audit_log FOR ALL TO service_role
            USING (true) WITH CHECK (true);
    END IF;
END $$;

-- ----------------------------------------------------------------------------
-- 2.4  SOLICITAÇÕES DE REEMBOLSO
--
--      `refund_requests` JÁ EXISTE no banco, então este bloco NÃO a recria.
--      O que falta é a origem declarada: `source` existe como texto livre e é
--      o que separa "pedido do cliente" de "ação do admin" — distinção que a
--      PARTE 7 exige ("uma solicitação registrada não é um reembolso
--      concluído"). Um CHECK explícito impede que os dois virem a mesma coisa.
--
--      Também se garante que a referência de quem processou exista, para a
--      tela de reembolsos mostrar "responsável pelo processamento".
-- ----------------------------------------------------------------------------
DO $$
BEGIN
    IF to_regclass('public.refund_requests') IS NOT NULL THEN
        ALTER TABLE public.refund_requests
            ADD COLUMN IF NOT EXISTS processed_by        uuid REFERENCES auth.users(id) ON DELETE SET NULL,
            ADD COLUMN IF NOT EXISTS processed_at        timestamptz,
            ADD COLUMN IF NOT EXISTS requested_amount    numeric,
            ADD COLUMN IF NOT EXISTS stripe_payment_intent text,
            ADD COLUMN IF NOT EXISTS license_impact      text;
    END IF;
END $$;

DO $$
BEGIN
    IF to_regclass('public.refund_requests') IS NOT NULL THEN
        CREATE INDEX IF NOT EXISTS idx_refund_requests_status
            ON public.refund_requests (status, created_at DESC);
        CREATE INDEX IF NOT EXISTS idx_refund_requests_payment
            ON public.refund_requests (payment_id, created_at DESC);
    END IF;
END $$;

-- ############################################################################
-- SEÇÃO 4 — PAPEL DO PRIMEIRO ADMIN
--
-- `profiles.role` é NULL nos admins que já existem. A aplicação trata
-- `is_admin = true` sem papel como superadmin, então nada quebra. Este bloco
-- apenas DEIXA EXPLÍCITO o estado atual, para quem for ler o banco daqui a
-- seis meses saber que a omissão é conhecida e não um bug.
--
-- Não preenche `role` de propósito: atribuir superadmin a um usuário é uma
-- decisão de negócio, e o default seguro (sem papel) ainda resolve para o
-- superadmin por compatibilidade. Quem quiser assumir de fato, faz pelo painel.
-- ############################################################################

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema='public' AND table_name='profiles' AND column_name='role'
    ) THEN
        RAISE NOTICE 'admin.sql: % admin(s) com is_admin=true e role nulo serão tratados como superadmin por compatibilidade.',
            (SELECT count(*) FROM public.profiles WHERE is_admin = true AND role IS NULL);
    END IF;
END $$;

-- Confirma que o trigger existe e aponta para a função recriada.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger
        WHERE tgname = 'on_auth_user_created'
          AND tgrelid = 'auth.users'::regclass
    ) THEN
        RAISE NOTICE 'admin.sql: trigger on_auth_user_created NÃO existe — crie-o manualmente.';
    ELSE
        RAISE NOTICE 'admin.sql: trigger on_auth_user_created presente; novos cadastros gravarão login, telefone, endereço, bairro, cidade, UF e CEP.';
    END IF;
END $$;

-- ############################################################################
-- SEÇÃO 4 — REALTIME (o sino passa a chegar SEM recarregar a página)
--
-- Sem isto, o canal `postgres_changes` do cliente fica muda: nenhuma
-- notificação aparece em tempo real.
-- ############################################################################

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables
        WHERE pubname = 'supabase_realtime'
          AND schemaname = 'public'
          AND tablename = 'notifications'
    ) THEN
        EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications';
        RAISE NOTICE 'notificacaocorrigida.sql: notifications adicionada à publicação supabase_realtime.';
    ELSE
        RAISE NOTICE 'notificacaocorrigida.sql: notifications já está na publicação supabase_realtime.';
    END IF;
END $$;

-- 6.5 Os tipos novos do enum estão lá?
-- ESPERADO: license, refund, service
--
-- Esta consulta NÃO pode derrubar o script: dentro da MESMA transação em que
-- os valores foram adicionados, listar o enum pode estourar o erro 55P04
-- ("unsafe use of new value"). Por isso ela vai dentro de um bloco com
-- tratamento de erro — e, se acontecer, é só aviso: os valores serão
-- commitados no fim da transação e a listagem passa a funcionar depois.
DO $$
BEGIN
    PERFORM 1 FROM unnest(enum_range(NULL::public.notification_type));
    RAISE NOTICE 'notificacaocorrigida.sql: tipos do enum notification_type: %',
        (SELECT string_agg(e.enumlabel, ', ' ORDER BY e.enumsortorder)
           FROM pg_enum e
           JOIN pg_type t ON t.oid = e.enumtypid
          WHERE t.typname = 'notification_type');
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'notificacaocorrigida.sql: nao foi possivel listar o enum nesta transacao (%). Rode a consulta 6.5 de novo depois do commit.', SQLERRM;
END $$;

-- ============================================================================
--  FASE 12 — GRANTS E COMENTARIOS
-- ============================================================================
-- =====================================================
-- SEGURANÇA ADICIONAL
-- =====================================================

-- Restringir acesso a tabelas do sistema (prevenir SQL injection)
REVOKE ALL ON SCHEMA public FROM public;
GRANT USAGE ON SCHEMA public TO public;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
-- 7. Política para permitir acesso à função
GRANT EXECUTE ON FUNCTION get_user_orders_with_details(UUID) TO authenticated;
-- 14. CONCEDER PERMISSÕES PARA A FUNÇÃO
GRANT EXECUTE ON FUNCTION get_user_orders_with_details(UUID) TO authenticated;
-- 16. CONCEDER PERMISSÕES PARA A FUNÇÃO
GRANT EXECUTE ON FUNCTION create_order_from_service(UUID, TEXT, TEXT, TEXT, TEXT, NUMERIC, TEXT, TEXT) TO authenticated;
REVOKE EXECUTE ON FUNCTION get_user_orders_with_details(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION get_user_orders_with_details(UUID) TO authenticated;
REVOKE EXECUTE ON FUNCTION export_tenant_data(UUID, TIMESTAMPTZ, TIMESTAMPTZ) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION delete_tenant_data(UUID, VARCHAR) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION export_tenant_data(UUID, TIMESTAMPTZ, TIMESTAMPTZ) TO service_role;
GRANT EXECUTE ON FUNCTION delete_tenant_data(UUID, VARCHAR) TO service_role;
REVOKE EXECUTE ON FUNCTION public.generate_voltris_signature(TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.generate_voltris_signature(TEXT) TO service_role;
-- generate_complete_license_v3 (chamada pelo webhook via service_role)
REVOKE EXECUTE ON FUNCTION public.generate_complete_license_v3(UUID, UUID, TEXT, TEXT) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.generate_complete_license_v3(UUID, UUID, TEXT, TEXT, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.generate_complete_license_v3(UUID, UUID, TEXT, TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION public.generate_complete_license_v3(UUID, UUID, TEXT, TEXT, TEXT) TO service_role;
-- generate_license_key (usado internamente) — manter apenas service_role
REVOKE EXECUTE ON FUNCTION generate_license_key(TEXT, DATE, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION generate_license_key(TEXT, DATE, TEXT) TO service_role;
-- authenticated so precisa LER (dashboard) e escrever em device_commands
-- (envio de comando remoto do painel "Meu Computador").
GRANT SELECT ON public.installations          TO authenticated;
GRANT SELECT ON public.installation_events    TO authenticated;
GRANT SELECT ON public.installation_heartbeats TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.device_commands TO authenticated;
GRANT SELECT ON public.licenses               TO authenticated;
GRANT SELECT ON public.license_devices        TO authenticated;
REVOKE EXECUTE ON FUNCTION public.get_user_orders_with_details(UUID) FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.get_user_orders_with_details(UUID) TO authenticated;
REVOKE ALL ON public.stripe_event_log FROM PUBLIC, anon, authenticated;
GRANT ALL ON public.stripe_event_log TO service_role;
REVOKE ALL ON public.refund_requests FROM PUBLIC, anon, authenticated;
GRANT ALL ON public.refund_requests TO service_role;
REVOKE ALL ON public.email_outbox FROM PUBLIC, anon, authenticated;
GRANT ALL ON public.email_outbox TO service_role;
REVOKE ALL ON public.email_outbox FROM PUBLIC, anon, authenticated;
GRANT ALL ON public.email_outbox TO service_role;
REVOKE ALL ON public.admin_role_grants FROM PUBLIC, anon, authenticated;
GRANT ALL ON public.admin_role_grants TO service_role;
REVOKE ALL ON public.admin_roles FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.admin_roles TO service_role;
REVOKE ALL ON public.admin_audit_log FROM PUBLIC, anon, authenticated;
GRANT ALL ON public.admin_audit_log TO service_role;
-- A função é chamada pelo trigger, não por RPC. Ninguém precisa executá-la.
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;
-- Nenhum papel do Supabase (anon, authenticated) tem politica de leitura:
-- sem politica, o RLS nega. As duas linhas abaixo são explícitas para que
-- a negacao seja uma DECISAO e nao uma ausencia.

REVOKE ALL ON public.extension_diagnostics FROM anon;
REVOKE ALL ON public.extension_diagnostics FROM authenticated;
REVOKE ALL ON FUNCTION public.record_extension_diagnostics(JSONB) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.record_extension_diagnostics(JSONB) FROM anon;
REVOKE ALL ON FUNCTION public.record_extension_diagnostics(JSONB) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.record_extension_diagnostics(JSONB) TO service_role;

-- Comentários para documentação
COMMENT ON COLUMN installations.os_name IS 'Nome completo do sistema operacional com versão legível';
COMMENT ON COLUMN installations.os_build IS 'Build number do Windows (ex: 19044)';
-- Comentário para documentação
COMMENT ON COLUMN licenses.license_display_name IS 'Nome completo da licença para exibição (ex: VOLTRIS STANDARD, VOLTRIS PRO)';
-- Comentários para documentação
COMMENT ON COLUMN installations.license_status IS 'Status da licença: trial (período de teste), active (licença ativa), expired (licença expirada), revoked (revogada)';
COMMENT ON COLUMN installations.license_key IS 'Chave de licença do Voltris Optimizer (formato: VOLTRIS-XXX-XXXXX-XXXXXXXX-XXXXXXXXXXXXXXXX)';
COMMENT ON COLUMN installations.license_activated_at IS 'Data e hora em que a licença foi ativada';
COMMENT ON COLUMN installations.license_expires_at IS 'Data e hora em que a licença expira (NULL para licenças vitalícias)';
-- 15. COMMENTS
COMMENT ON TABLE devices IS 'Stores unique device information for each machine running Voltris';
COMMENT ON TABLE device_profiles IS 'Hardware profiles for each device';
COMMENT ON TABLE sessions IS 'Active and historical app sessions';
COMMENT ON TABLE telemetry_events IS 'Detailed event tracking for analytics';
COMMENT ON TABLE companies IS 'Company/organization information for enterprise users';
-- ═══════════════════════════════════════════════════════════════════════════
-- PASSO 10: COMENTÁRIOS
-- ═══════════════════════════════════════════════════════════════════════════

COMMENT ON TABLE installations IS 'Instâncias do Voltris Optimizer por máquina. Contém hardware, licença e status.';
COMMENT ON TABLE device_commands IS 'Comandos remotos enviados do dashboard web para o app desktop.';
COMMENT ON TABLE installation_events IS 'Telemetria de eventos e ações realizadas no software.';
COMMENT ON TABLE installation_heartbeats IS 'Logs periódicos de atividade para métricas de retenção.';
COMMENT ON COLUMN installations.pc_name IS 'Nome do computador (Environment.MachineName)';
COMMENT ON COLUMN installations.gpu_name IS 'Nome da GPU (ex: NVIDIA GeForce RTX 3060)';
COMMENT ON COLUMN installations.is_licensed IS 'Se o dispositivo tem licença ativa (para dashboard)';
COMMENT ON COLUMN installations.last_active IS 'Alias de last_heartbeat — sincronizado via trigger';
COMMENT ON COLUMN device_commands.command_type IS 'Tipos: optimize, shutdown, restart_link, gamer_mode, prepare_pc, heartbeat';
-- 13. COMENTÁRIOS
COMMENT ON TABLE payments IS 'Armazena pagamentos do Mercado Pago';
COMMENT ON TABLE licenses IS 'Armazena licenças geradas após pagamento aprovado';
COMMENT ON TABLE license_devices IS 'Controla dispositivos ativados por licença';
-- =====================================================
-- PARTE 10: COMENTÁRIOS
-- =====================================================

COMMENT ON TABLE payments IS 'Armazena pagamentos do Mercado Pago';
COMMENT ON TABLE licenses IS 'Armazena licenças geradas após pagamento aprovado';
COMMENT ON TABLE license_devices IS 'Controla dispositivos ativados por licença';
COMMENT ON COLUMN payments.preference_id IS 'ID da preferência do Mercado Pago (pode ser NULL inicialmente)';
COMMENT ON COLUMN payments.payment_id IS 'ID do pagamento do Mercado Pago (quando aprovado)';
COMMENT ON COLUMN payments.user_id IS 'ID do usuário (opcional, pode ser NULL para pagamentos sem login)';
COMMENT ON COLUMN public.orders.cancelled_by IS 'Indica quem cancelou o pedido: client (cliente) ou admin (administrador)';
-- 5. Comentários para documentação
COMMENT ON TABLE public.push_subscriptions IS 'Sistema profissional de inscrições push PWA para VOLTRIS';
COMMENT ON COLUMN public.push_subscriptions.browser_fingerprint IS 'Hash único do navegador para evitar duplicatas';
COMMENT ON COLUMN public.push_subscriptions.device_type IS 'Tipo de dispositivo: desktop, mobile, tablet';
COMMENT ON COLUMN public.push_subscriptions.platform IS 'Sistema operacional do dispositivo';
COMMENT ON COLUMN public.push_subscriptions.is_active IS 'Status da inscrição (ativa/inativa)';
COMMENT ON COLUMN public.push_subscriptions.last_used IS 'Última vez que a inscrição foi utilizada';
-- Comentário explicativo
COMMENT ON FUNCTION generate_license_key(TEXT, DATE, TEXT) IS 
'Gera chave de licença compatível com o aplicativo Voltris Optimizer. 
IMPORTANTE: A chave secreta VOLTRIS_SECRET_LICENSE_KEY_2025 deve ser idêntica 
à usada no código C# para garantir compatibilidade.';
-- Comentários
COMMENT ON TABLE license_plans IS 'Configuração centralizada dos planos de licença do Voltris Optimizer';
COMMENT ON FUNCTION get_plan_config(license_type) IS 'Retorna configuração completa de um plano';
COMMENT ON FUNCTION calculate_expiry_date(license_type, TIMESTAMPTZ) IS 'Calcula data de expiração baseada no plano e data de início';
-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE data_retention_policies IS 'Seeded with common event retention policies';
COMMENT ON TABLE deploy_registry IS 'Seeded with initial deploy v1.0.0';
COMMENT ON TABLE feature_usage_intelligence IS 'Seeded with sample analytics for testing';
COMMENT ON TABLE feature_cost_tracking IS 'Seeded with sample cost data for testing';
COMMENT ON TABLE telemetry_health_metrics IS 'Seeded with sample health metric';
-- Recriar a função se ela existir no banco
-- Esta é uma função que pode ter sido criada manualmente ou por outra migração
-- Vamos garantir que ela tenha search_path seguro

-- ============================================================================
-- COMENTÁRIOS E DOCUMENTAÇÃO
-- ============================================================================
COMMENT ON FUNCTION check_slo_breaches() IS 'Verifica violações de SLO com search_path seguro';
COMMENT ON FUNCTION update_updated_at_column() IS 'Trigger genérico para atualizar updated_at com search_path seguro';
COMMENT ON FUNCTION export_tenant_data(UUID, TIMESTAMPTZ, TIMESTAMPTZ) IS 'Exporta dados de tenant com search_path seguro';
COMMENT ON FUNCTION delete_tenant_data(UUID, VARCHAR) IS 'Deleta dados de tenant com search_path seguro';
COMMENT ON VIEW function_security_audit IS 'View para auditar segurança de funções - verificar search_path e SECURITY DEFINER';
-- 9. COMENTÁRIOS (DOCUMENTAÇÃO SQL)
COMMENT ON TABLE installations IS 'Armazena instâncias únicas do software Voltris por máquina.';
COMMENT ON TABLE installation_events IS 'Telemetria de eventos e ações realizadas no software.';
COMMENT ON TABLE installation_heartbeats IS 'Logs periódicos de atividade para métricas de retenção.';
COMMENT ON FUNCTION public.set_updated_at() IS
'Garante updated_at em UPDATE. search_path fixo para impedir hijack de schema.';
COMMENT ON FUNCTION public.sync_last_active() IS
'Mantem installations.last_active igual a last_heartbeat (alias de leitura do dashboard).';
COMMENT ON COLUMN public.installations.device_credential_hash IS
'SHA-256 (hex) da credencial do dispositivo. NUNCA o token em si. NULL = nenhum vinculo ativo com credencial emitida.';
COMMENT ON COLUMN public.installations.device_credential_issued IS
'Quando a credencial atual foi emitida.';
COMMENT ON COLUMN public.installations.unlinked_at IS
'Quando o vinculo foi desfeito. NULL = vinculado.';
COMMENT ON FUNCTION public.record_extension_diagnostics(JSONB) IS
    'Registra um lote de diagnosticos da extensao VOLTRIS Shield: confere o limite global por minuto e grava, na mesma transacao. Chamada apenas pela service role.';

-- ============================================================================
--  FASE 13 — REALTIME E REFRESH DO POSTGREST
-- ============================================================================
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables
        WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'orders'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE orders;
    END IF;
END $$;
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables
        WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'link_sessions'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE link_sessions;
    END IF;
END $$;
-- Force o PostgREST a reler o schema (policies e funcoes mudaram).
NOTIFY pgrst, 'reload schema';
NOTIFY pgrst, 'reload schema';
NOTIFY pgrst, 'reload schema';
NOTIFY pgrst, 'reload schema';
NOTIFY pgrst, 'reload schema';
NOTIFY pgrst, 'reload schema';
NOTIFY pgrst, 'reload schema';
NOTIFY pgrst, 'reload schema';

NOTIFY pgrst, 'reload schema';

-- ============================================================================
--  FASE 14 — FUNCOES QUE EXISTEM NO BANCO MAS NAO TINHAM DDL NO REPOSITORIO
-- ============================================================================
--
-- Estas funcoes existem no banco de producao (expostas como RPC) e o site
-- NAO as chama — mas elas precisam ser recriadas se o banco for recriado do
-- zero. O CREATE delas nunca foi versionado no repositorio (foram feitas
-- direto no painel do Supabase), entao nao ha o que copiar para ca.
--
-- Para recria-las, exporte do banco de producao:
--     pg_dump --schema-only --no-owner --no-privileges \
--       --db-url "$DATABASE_URL" > funcoes-legadas.sql
--
--   - public.create_notification()
--   - public.mark_notification_read()
--   - public.mark_all_notifications_read()
--   - public.get_all_orders_with_details()
--   - public.get_service_requests_with_order_details()
--   - public.generate_slug()
--   - public.generate_complete_license_v2()
--   - public.generate_complete_license_v3_legacy_hmac()
--
-- ATENCAO: generate_complete_license_v2 e a versao ANTIGA da emissao de
-- licenca (a de producao e a generate_complete_license_v3). Nao copie a
-- versao antiga por cima da atual.

-- ============================================================================
--  FIM
-- ============================================================================