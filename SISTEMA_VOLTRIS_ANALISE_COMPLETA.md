# 🔍 ANÁLISE COMPLETA DO SISTEMA VOLTRIS
## Aplicativo Desktop + Site de Pagamentos

**Data da Análise:** 02/01/2026  
**Analista:** Qoder AI  
**Versão:** 1.0.0

---

## 📋 SUMÁRIO EXECUTIVO

O Sistema Voltris é composto por:
1. **Aplicativo Desktop** (C# WPF) - Voltris Optimizer
2. **Site** (Next.js 15 + Supabase) - Sistema de pagamentos e licenciamento
3. **Backend API** - Gerenciamento de licenças e assinaturas

**Status Atual:** Sistema de pagamento em produção, mas com problemas no webhook e geração de licenças.

---

## 🏗️ ARQUITETURA ATUAL

### **1. APLICATIVO DESKTOP (C# WPF)**

#### **1.1 Sistema de Licenciamento**

**Formato da Licença:**
```
VOLTRIS-LIC-{CLIENT_ID}-{YYYYMMDD}-{SIGNATURE}
```

**Exemplo:**
```
VOLTRIS-LIC-CLIENTE01-20260201-A1B2C3D4E5F6G7H8
```

**Componentes Principais:**

| Arquivo | Responsabilidade |
|---------|------------------|
| `LicenseManager.cs` | Gerencia ativação, validação e armazenamento de licenças |
| `LicenseSecurityService.cs` | Gera e valida assinaturas com chave ofuscada |
| `LicenseGenerator/Program.cs` | Ferramenta CLI para gerar licenças manualmente |
| `TrialProtectionService.cs` | Sistema de trial de 7 dias com proteção anti-manipulação |
| `LicenseApiService.cs` | Comunicação com API de licenças (backend) |
| `LicenseModels.cs` | Modelos de dados e enums |

**Chave Secreta (Ofuscada):**
```csharp
// LicenseSecurityService.cs e LicenseGenerator/Program.cs
const string LicenseSecretKey = "VOLTRIS_SECRET_LICENSE_KEY_2025";
```

⚠️ **CRÍTICO:** Esta chave DEVE ser a mesma em TODOS os lugares:
- Aplicativo (LicenseSecurityService.cs)
- Gerador de Licenças (Program.cs)
- Backend do Site (Supabase function)

---

#### **1.2 Sistema de Trial**

**Período:** 7 dias  
**Proteção:** Múltiplas camadas

**Fontes de Verificação:**
1. Registro do Windows (`HKCU\Software\Voltris\Optimizer`)
2. Arquivo oculto em `%LOCALAPPDATA%\Voltris\.trial`
3. Arquivo backup em `%PROGRAMDATA%\Voltris\.trialdata`
4. Configurações do app (`settings.json`)

**Verificações de Segurança:**
- Machine ID (CPU + Motherboard + BIOS Serial)
- Hash de integridade (SHA256)
- Detecção de manipulação de clock
- Verificação online de hora (worldtimeapi.org)

**Fluxo:**
```
1ª Execução → Salva data em 4 locais
Toda execução → Verifica se passou 7 dias
Trial expirado + Sem licença → Bloqueia recursos Pro
```

---

#### **1.3 Tipos de Licença**

| Tipo | Max Devices | Descrição |
|------|------------|-----------|
| **Trial** | 1 | 7 dias gratuitos |
| **Standard** | 1 | R$ 29,90 - 1 dispositivo |
| **Pro** | 3 | R$ 59,90 - 3 dispositivos |
| **Enterprise** | 9999 (ilimitado) | R$ 149,90 - Dispositivos ilimitados |

**Mapeamento no Código:**
```csharp
public enum LicenseType
{
    Trial = 0,
    Standard = 1,
    Pro = 2,
    Enterprise = 3
}
```

---

#### **1.4 Ativação de Licença**

**Processo:**
1. Usuário insere chave: `VOLTRIS-LIC-...`
2. App valida formato e assinatura localmente
3. App verifica data de validade
4. App salva no registro do Windows
5. `LicenseManager.IsPro = true`

**Validação Local (Offline):**
```csharp
// Reconstruir conteúdo
var licenseContent = $"{{"id":"{clientId}","validUntil":"{validityDate:yyyy-MM-dd}","plan":"Mensal"}}";

// Gerar assinatura esperada
var expectedSignature = GenerateLicenseSignature(licenseContent);

// Comparar com assinatura da chave
if (signature == expectedSignature && validityDate >= DateTime.Today)
    return true; // Válida
```

**Validação Online (API):**
```csharp
// LicenseApiService.cs
var response = await _httpClient.PostAsJsonAsync(
    "https://api.voltris.com/v1/license/validate",
    new { LicenseKey, DeviceId }
);
```

---

#### **1.5 Sistema de Dispositivos**

**Device ID (Fingerprint):**
- Gerado por `DeviceFingerprintService.cs`
- Baseado em: CPU ID + Motherboard Serial + BIOS Serial
- Persistido para evitar regeneração

**Controle de Slots:**
- Pro: até 3 dispositivos simultâneos
- Enterprise: ilimitado
- Standard/Trial: 1 dispositivo

**Ativação:**
1. Usuário ativa licença em PC1
2. App registra `device_id_1` na API
3. Usuário ativa mesma licença em PC2
4. API verifica: `devices_in_use < max_devices`
5. Se OK, registra `device_id_2`

---

#### **1.6 Comunicação com Site**

**PurchaseHandler.cs:**
```csharp
// URL da API
var apiUrl = "https://voltris.com.br/api/pagamento?plan=pro";

// Chama API
var response = await client.GetAsync(apiUrl);

// Obtém init_point do Checkout Pro
var paymentUrl = jsonDocument.RootElement.GetProperty("init_point").GetString();

// Abre no navegador
Process.Start(paymentUrl);
```

**Fluxo Completo:**
```
APP → GET /api/pagamento?plan=pro
    ← { "init_point": "https://mercadopago.com.br/checkout/..." }

APP → Abre navegador com init_point

Usuário → Paga no Mercado Pago

Mercado Pago → Webhook para /api/webhook/mercadopago
            → Cria pagamento no BD
            → Gera licença
            → Salva em licenses

Usuário → Volta para /sucesso?payment_id=...
       → Página busca licença
       → Exibe licença

Usuário → Copia licença
       → Cola no app
       → App valida e ativa
```

---

### **2. SITE (Next.js 15 + Supabase)**

#### **2.1 Estrutura de Tabelas**

**Tabela: `payments`**
```sql
CREATE TABLE payments (
    id UUID PRIMARY KEY,
    preference_id TEXT UNIQUE,        -- ID da preferência MP
    payment_id TEXT UNIQUE,           -- ID do pagamento MP (quando aprovado)
    user_id UUID REFERENCES auth.users,
    email TEXT NOT NULL,
    license_type license_type NOT NULL,  -- enum: trial/pro/premium/enterprise
    amount NUMERIC(10,2) NOT NULL,
    currency TEXT DEFAULT 'BRL',
    status payment_status_mp NOT NULL,   -- enum: pending/approved/rejected...
    mercado_pago_data JSONB,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    processed_at TIMESTAMPTZ
);
```

**Tabela: `licenses`**
```sql
CREATE TABLE licenses (
    id UUID PRIMARY KEY,
    license_key TEXT UNIQUE NOT NULL,    -- VOLTRIS-LIC-...
    payment_id UUID REFERENCES payments,
    user_id UUID REFERENCES auth.users,
    email TEXT NOT NULL,
    license_type license_type NOT NULL,
    max_devices INTEGER NOT NULL DEFAULT 1,
    devices_in_use INTEGER NOT NULL DEFAULT 0,
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    activated_at TIMESTAMPTZ
);
```

**Tabela: `license_devices`**
```sql
CREATE TABLE license_devices (
    id UUID PRIMARY KEY,
    license_id UUID REFERENCES licenses,
    device_id TEXT NOT NULL,             -- Fingerprint do dispositivo
    device_name TEXT,
    machine_name TEXT,
    os_version TEXT,
    processor_count INTEGER,
    activated_at TIMESTAMPTZ,
    last_used_at TIMESTAMPTZ,
    UNIQUE(license_id, device_id)
);
```

---

#### **2.2 Função de Geração de Licença**

**Supabase Function: `generate_license_key()`**
```sql
CREATE OR REPLACE FUNCTION generate_license_key(
    p_client_id TEXT,
    p_valid_until DATE,
    p_plan TEXT
) RETURNS TEXT AS $$
DECLARE
    v_content TEXT;
    v_signature TEXT;
    v_formatted_date TEXT;
BEGIN
    v_formatted_date := TO_CHAR(p_valid_until, 'YYYYMMDD');
    
    v_content := json_build_object(
        'id', p_client_id,
        'validUntil', p_valid_until::TEXT,
        'plan', p_plan
    )::TEXT;
    
    v_signature := SUBSTRING(
        ENCODE(
            DIGEST(v_content || 'VOLTRIS_SECRET_KEY_2024', 'sha256'), 
            'hex'
        ), 
        1, 
        16
    );
    
    RETURN 'VOLTRIS-LIC-' || p_client_id || '-' || v_formatted_date || '-' || UPPER(v_signature);
END;
$$ LANGUAGE plpgsql;
```

⚠️ **PROBLEMA IDENTIFICADO:**
A chave secreta na função Supabase é **`VOLTRIS_SECRET_KEY_2024`** mas no app é **`VOLTRIS_SECRET_LICENSE_KEY_2025`**!

**INCOMPATIBILIDADE DETECTADA!** 🔴

---

#### **2.3 APIs do Site**

| Endpoint | Método | Responsabilidade |
|----------|--------|------------------|
| `/api/pagamento` | GET | Cria preferência no Mercado Pago, retorna `init_point` |
| `/api/webhook/mercadopago` | POST | Recebe webhook, processa pagamento, gera licença |
| `/api/pagamento/processar-retorno` | POST | Fallback: processa pagamento quando webhook falha |
| `/api/license/get` | GET | Busca licença por `preference_id` ou `payment_id` |

**Problema Atual:**
- Webhook estava usando `MP_ACCESS_TOKEN` em vez de `MERCADOPAGO_ACCESS_TOKEN_PROD`
- ✅ **JÁ CORRIGIDO** no último commit

---

#### **2.4 Fluxo de Pagamento Atual**

```
1. Usuário acessa /teste-checkout
   └─ Escolhe plano (Pro/Premium)
   └─ Informa email (obrigatório)
   
2. Frontend chama GET /api/pagamento?plan=pro&email=user@email.com
   └─ API cria preferência no Mercado Pago
   └─ Retorna: { "init_point": "https://..." }
   
3. Usuário é redirecionado para Checkout Pro
   └─ Paga com cartão ou PIX
   
4. Mercado Pago chama webhook POST /api/webhook/mercadopago
   └─ Webhook busca dados do pagamento via API MP
   └─ Webhook cria/atualiza registro em payments
   └─ Se aprovado: webhook gera licença
   
5. Usuário é redirecionado para /sucesso?payment_id=123&status=approved
   └─ Página busca licença em /api/license/get
   └─ Exibe licença para o usuário
```

---

## 🚨 PROBLEMAS IDENTIFICADOS

### **CRÍTICO #1: Incompatibilidade de Chave Secreta**

| Local | Chave Usada |
|-------|-------------|
| App (C#) | `VOLTRIS_SECRET_LICENSE_KEY_2025` |
| Supabase Function | `VOLTRIS_SECRET_KEY_2024` |

**Impacto:** Licenças geradas no site NÃO serão válidas no app!

**Solução:** Padronizar chave em todos os lugares.

---

### **CRÍTICO #2: API URL Inexistente**

O app tenta chamar:
```
https://api.voltris.com/v1/license/validate
```

Mas esta API **NÃO EXISTE**!

**Impacto:** Validação online não funciona, apenas offline.

**Solução:** Criar endpoints de validação no site ou desabilitar validação online.

---

### **CRÍTICO #3: Webhook Falhando**

**Problema:** Variável de ambiente errada (`MP_ACCESS_TOKEN`)  
**Status:** ✅ Corrigido para `MERCADOPAGO_ACCESS_TOKEN_PROD`  
**Pendente:** Testar deploy no Vercel

---

### **Problema #4: Planos Desalinhados**

| Local | Trial | Standard | Pro | Premium | Enterprise |
|-------|-------|----------|-----|---------|------------|
| App (LicenseModels.cs) | ✅ Grátis | ✅ R$ 29,90 | ✅ R$ 59,90 | ❌ | ✅ R$ 149,90 |
| Site (teste-checkout) | ✅ R$ 0,01 | ❌ | ✅ R$ 1,00 | ✅ R$ 1,00 | ❌ |
| Requisito do Usuário | ✅ 7 dias | ❌ | ✅ R$ 49,90 | ✅ R$ 99,90 | ✅ R$ 149,90 (6 meses) |

**Conclusão:** Planos estão completamente desalinhados!

---

## ✅ PROPOSTA DE SOLUÇÃO

### **FASE 1: CORREÇÕES CRÍTICAS**

#### **1.1 Padronizar Chave Secreta**

**Decisão:** Usar `VOLTRIS_SECRET_LICENSE_KEY_2025` em TODOS os lugares.

**Ações:**
1. ✅ App já usa `VOLTRIS_SECRET_LICENSE_KEY_2025`
2. ✅ LicenseGenerator já usa `VOLTRIS_SECRET_LICENSE_KEY_2025`
3. ⚠️ Atualizar Supabase function `generate_license_key()`
4. ⚠️ Verificar se há código no site que valide assinaturas

---

#### **1.2 Criar API de Validação**

**Endpoints Necessários:**
```
POST /api/v1/license/validate
  Request: { licenseKey, deviceId, version, platform }
  Response: { valid, type, maxDevices, devicesInUse, expiresAt }

POST /api/v1/license/activate
  Request: { licenseKey, deviceId, machineName, osVersion }
  Response: { success, type, maxDevices, expiresAt }

POST /api/v1/license/deactivate
  Request: { licenseKey, deviceId }
  Response: { success }

GET /api/v1/license/info?key=VOLTRIS-LIC-...
  Response: { valid, type, maxDevices, devicesInUse, expiresAt, activatedAt, registeredDevices[] }
```

---

#### **1.3 Padronizar Planos**

**Planos Finais (conforme requisito do usuário):**

| Plano | Preço | Período | Dispositivos | Features |
|-------|-------|---------|--------------|----------|
| **Trial** | R$ 0,00 | 7 dias | 1 | Todas as funcionalidades |
| **Pro** | R$ 49,90 | 1 mês | 1 | Todas as funcionalidades + Suporte prioritário |
| **Premium** | R$ 99,90 | 3 meses | 3 | Todas + Otimizações avançadas |
| **Enterprise** | R$ 149,90 | 6 meses | Ilimitado | Todas + API + Admin panel |

**Atualizar em:**
1. `LicenseModels.cs` no app
2. `/api/pagamento/route.js` no site
3. Página de checkout
4. Banco de dados (migrations)

---

### **FASE 2: TRIAL COM CARTÃO**

**Requisito:** Trial de 7 dias COM cartão obrigatório, sem cobrança imediata.

**Solução:** Usar **Checkout Pro com Preauthorization** ou **Subscription Trial**

**Fluxo:**
```
1. Usuário clica "Iniciar Trial"
2. Redireciona para Checkout Pro com trial_period=7
3. Mercado Pago valida cartão (sem cobrar)
4. Webhook recebe confirmação
5. Site gera licença Trial com expires_at = hoje + 7 dias
6. Após 7 dias: Mercado Pago cobra automaticamente (se não cancelar)
```

**Implementação:**
```javascript
// /api/pagamento/route.js
const preference = {
  items: [{
    title: "Voltris Optimizer - Trial",
    quantity: 1,
    unit_price: 0.01, // Valor simbólico
  }],
  auto_return: "approved",
  back_urls: { ... },
  payment_methods: {
    excluded_payment_types: [
      { id: "account_money" }, // Desabilitar saldo em conta
      { id: "ticket" }, // Desabilitar boleto
    ],
    excluded_payment_methods: [
      { id: "pix" }, // Desabilitar PIX
    ],
  },
  // Configurar trial
  subscription_plan_id: "trial_7_days", // Criar plano no MP
};
```

---

### **FASE 3: ASSINATURAS RECORRENTES**

**Mercado Pago Subscriptions:**

**Planos:**
```javascript
// Pro: R$ 49,90/mês
{
  reason: "Voltris Optimizer Pro",
  auto_recurring: {
    frequency: 1,
    frequency_type: "months",
    transaction_amount: 49.90,
    currency_id: "BRL",
  },
  back_url: "https://voltris.com.br/sucesso",
}

// Premium: R$ 99,90 a cada 3 meses
{
  auto_recurring: {
    frequency: 3,
    frequency_type: "months",
    transaction_amount: 99.90,
  },
}

// Enterprise: R$ 149,90 a cada 6 meses
{
  auto_recurring: {
    frequency: 6,
    frequency_type: "months",
    transaction_amount: 149.90,
  },
}
```

**Webhooks:**
```
payment.created → Primeira cobrança
payment.updated → Renovação automática
subscription.updated → Cancelamento
subscription.paused → Suspensão
```

---

### **FASE 4: CHECKOUT PROFISSIONAL**

**Estrutura:**
```
/checkout (nova página)
  ├─ Comparação de planos lado a lado
  ├─ Toggle Trial vs Pago
  ├─ Formulário:
  │   ├─ Nome completo (obrigatório)
  │   ├─ Email (obrigatório)
  │   ├─ Telefone (opcional)
  │   └─ CPF (obrigatório para nota fiscal)
  ├─ Resumo do pedido
  ├─ Selos de segurança (MP, SSL, etc)
  └─ Botão "Finalizar Compra"
```

**Design:**
- Cores: Verde (#10B981) e Roxo (#8B31FF) do branding Voltris
- Cards com glassmorphism
- Animações suaves (Framer Motion)
- Responsivo mobile-first

---

## 🔄 SINCRONIZAÇÃO APP ↔ SITE

### **Fonte Única da Verdade: BACKEND (Supabase)**

```
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (Supabase)                        │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  payments → licenses → license_devices               │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  APIs:                                                       │
│  - POST /api/v1/license/validate                            │
│  - POST /api/v1/license/activate                            │
│  - POST /api/v1/license/deactivate                          │
│  - GET  /api/v1/license/info                                │
│                                                              │
└─────────────────────┬────────────────────────────────────────┘
                      │
          ┌───────────┴───────────┐
          │                       │
          ▼                       ▼
    ┌──────────┐           ┌──────────┐
    │   APP    │           │   SITE   │
    │  (C# )   │           │ (Next.js)│
    └──────────┘           └──────────┘
    
    Valida:                Gera:
    - Offline (assinatura) - Preferência MP
    - Online (API)         - Licença (webhook)
    - Trial (local)        - Processa pagamento
    - Devices (API)        - Exibe licença
```

### **Regras:**

1. **Geração de Licença:** SEMPRE no backend (webhook)
2. **Validação de Licença:** App valida offline + consulta online
3. **Ativação de Dispositivo:** App registra no backend
4. **Status de Assinatura:** Backend notifica app (polling ou push)
5. **Trial:** Gerenciado localmente no app (segurança multi-camada)

---

## 📊 DECISÕES TÉCNICAS

### **PIX em Assinaturas Recorrentes**

**Limitação:** Mercado Pago NÃO suporta PIX recorrente.

**Solução:**
- PIX disponível apenas para **pagamento único** (1 mês)
- Para **assinaturas recorrentes**: apenas cartão de crédito
- UI deve informar claramente esta limitação

---

### **Telefone no Checkout**

**Decisão:** OPCIONAL

**Justificativa:**
- Mercado Pago não exige telefone
- Email é suficiente para comunicação
- CPF é obrigatório apenas se emitir nota fiscal

---

### **CPF/CNPJ**

**Decisão:** OPCIONAL (a princípio)

**Justificativa:**
- Não é obrigatório para pagamento
- Pode ser coletado futuramente se houver emissão de nota fiscal
- Simplifica onboarding inicial

---

## 🎯 PRÓXIMOS PASSOS

### **IMEDIATO (Hoje)**

- [x] Análise completa do aplicativo ✅
- [ ] Corrigir chave secreta no Supabase function
- [ ] Testar pagamento com webhook corrigido
- [ ] Verificar geração de licença

### **CURTO PRAZO (Esta Semana)**

- [ ] Criar APIs de validação de licença
- [ ] Padronizar planos em todos os lugares
- [ ] Criar página de checkout profissional
- [ ] Implementar trial com cartão obrigatório

### **MÉDIO PRAZO (Próximas 2 Semanas)**

- [ ] Implementar assinaturas recorrentes
- [ ] Sistema de cancelamento de assinatura
- [ ] Painel do usuário para gerenciar licenças
- [ ] Sistema de upgrade/downgrade

### **LONGO PRAZO (Próximo Mês)**

- [ ] Emails transacionais (licença, renovação, cancelamento)
- [ ] Dashboard administrativo
- [ ] Métricas e analytics
- [ ] Sistema de afiliados (futuro)

---

## 📝 NOTAS FINAIS

**Arquitetura Atual:** Sólida, mas com problemas de integração.

**Pontos Fortes:**
- ✅ Sistema de trial robusto no app
- ✅ Geração de licenças criptograficamente segura
- ✅ Controle de dispositivos implementado
- ✅ Estrutura de banco de dados bem projetada

**Pontos Fracos:**
- ❌ Inconsistência de chaves secretas
- ❌ API de validação inexistente
- ❌ Planos desalinhados entre app e site
- ❌ Webhook com problemas (corrigido, mas não testado)

**Prioridade #1:** Sincronizar chaves secretas e criar APIs de validação.

**Prioridade #2:** Padronizar planos e preços.

**Prioridade #3:** Criar checkout profissional e trial com cartão.

---

**Documento gerado automaticamente por Qoder AI**  
**Última atualização:** 02/01/2026 04:50 BRT
