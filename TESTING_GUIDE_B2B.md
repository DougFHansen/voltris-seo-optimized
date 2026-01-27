# Guia de Testes e Implementação B2B - Voltris Optimizer

Este guia detalha como configurar e validar as novas funcionalidades corporativas (SaaS B2B).

## 1. Configuração do Backend (Supabase)

Antes de testar, você deve criar as tabelas no Banco de Dados.

1.  Acesse o Painel do Supabase do seu projeto.
2.  Vá em **SQL Editor**.
3.  Abra o arquivo local `services/enterprise-schema.sql` (criado neste update).
4.  Copie e cole todo o conteúdo no SQL Editor e clique em **RUN**.
    *   Isso criará as tabelas: `companies`, `company_users`, `devices`, `telemetry_logs`, `remote_commands`.

### Criar Dados de Teste

Para ver o dashboard funcionando, crie uma empresa fictícia e vincule seu usuário:

```sql
-- Substitua SEU_ID_DE_USUARIO pelo seu UUID do Supabase (tabela auth.users)
-- Você pode pegar seu ID fazendo login no site e olhando no LocalStorage ou na tabela auth.users.

WITH new_company AS (
  INSERT INTO public.companies (name, plan_type, max_devices)
  VALUES ('Minha Empresa Teste', 'pro', 10)
  RETURNING id
)
INSERT INTO public.company_users (company_id, user_id, role)
SELECT id, 'SEU_ID_DE_USUARIO_AQUI', 'owner'
FROM new_company;
```

## 2. Testar o Dashboard B2B

1.  Rode o site localmente: `npm run dev`.
2.  Acesse `http://localhost:3000/dashboard`.
3.  No Sidebar, clique em **Gestão de Empresas**.
4.  Você deve ver o Painel da "Minha Empresa Teste" com estatísticas zeradas.
5.  Clique em **Gerenciar PCs**, deve estar vazio.

## 3. Testar Conexão com Desktop App

Para que o Desktop App local se comunique com o Site Local (`localhost:3000`), você precisa atualizar a URL da API no código C# ou usar um Tunnel (ngrok).

**Opção A: Alterar URL no C# (Recomendado para Dev)**
No arquivo `Services/Enterprise/EnterpriseService.cs` do app WPF:
```csharp
private const string ApiBaseUrl = "http://localhost:3000/api/v1"; 
```
*Compile e execute o App.*

**Opção B: Teste via Postman / Curl**

1.  **Registrar PC**:
    ```bash
    curl -X POST http://localhost:3000/api/v1/devices/register \
    -H "Content-Type: application/json" \
    -d '{ "identity": { "machine_id": "TEST-PC-01", "hostname": "DEV-MACHINE", "os_version": "Windows 11" } }'
    ```
    *Resultado*: O PC deve aparecer na aba "Gerenciar PCs" do Dashboard (talvez precise de refresh). Note que `company_id` será null inicialmente.
    *Correção Manual*: Vá no SQL e update o `company_id` do device criado para o ID da sua empresa teste. (Em produção, teríamos um fluxo de "Claim" ou Token).

    ```sql
    UPDATE public.devices SET company_id = (SELECT id FROM public.companies LIMIT 1) WHERE machine_id = 'TEST-PC-01';
    ```

2.  **Enviar Heartbeat (Telemetria)**:
    ```bash
    curl -X POST http://localhost:3000/api/v1/telemetry/heartbeat \
    -H "Content-Type: application/json" \
    -d '{ "machine_id": "TEST-PC-01", "status": "OK", "metrics": { "cpu_usage": 15, "ram_usage_percent": 45, "disk_usage_percent": 80 } }'
    ```
    *Resultado*: Verifique no banco `telemetry_logs` se o registro entrou.

3.  **Testar Alertas**:
    Envie um heartbeat com alerta:
    ```json
    {
      "machine_id": "TEST-PC-01",
      "status": "WARNING",
      "metrics": { ... },
      "active_alerts": [ { "type": "RAM_HIGH", "level": "CRITICAL", "message": "RAM 99%" } ]
    }
    ```
    *Resultado*: No Dashboard "Visão Geral", o card de Alertas deve ficar vermelho e listar o problema.

4.  **Testar Comandos Remotos**:
    1.  No Dashboard > Gerenciar PCs, clique no botão ⚡ (Otimizar) no device `TEST-PC-01`.
    2.  Verifique no banco `remote_commands` se criou um registro `status: pending`.
    3.  Consulte via API (Simulando o PC):
        ```bash
        curl "http://localhost:3000/api/v1/commands/pending?machine_id=TEST-PC-01"
        ```
    4.  Você deve receber o JSON do comando.

## 4. Próximos Passos (Produção)

1.  Implementar fluxo de **Convite/Token** para que o PC se auto-associe à empresa sem SQL manual.
2.  Proteger as APIs `/api/v1` com um **Company API Token** ou **Client Certificate**.
3.  Deploy do Site na Vercel e atualização da URL no App Desktop.
