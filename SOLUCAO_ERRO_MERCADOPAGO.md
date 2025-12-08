# 🔧 Solução: Erro "Uma das partes é de teste" no Mercado Pago

## ❌ Erro Encontrado

```
"Uma das partes com as quais você está tentando efetuar o pagamento é de teste."
```

## 🔍 Causa do Problema

Este erro ocorre quando você tenta fazer um pagamento de teste mas:

1. **Não está usando uma conta de teste do Mercado Pago** para fazer o pagamento
2. Está tentando pagar com uma conta real em um ambiente de teste
3. O comprador precisa ser uma **conta de teste** criada no painel do Mercado Pago

## ✅ Soluções

### Opção 1: Usar Conta de Teste do Mercado Pago (Recomendado)

O token que você tem (`APP_USR-1779915323498167-120406-7bd7b57f348d130c62a7f57975217fef-3039297620`) está correto para testes!

**O problema é que você precisa usar uma CONTA DE TESTE para fazer o pagamento:**

1. Acesse: https://www.mercadopago.com.br/developers/panel
2. Vá em: **TESTES** → **Contas de teste**
3. Crie uma conta de teste (ou use uma existente)
4. Faça login com essa conta de teste no Mercado Pago
5. Use essa conta para fazer o pagamento de teste

**Cartões de teste para usar:**
- Cartão aprovado: `5031 4332 1540 6351` (CVV: 123)
- Cartão rejeitado: `5031 4332 1540 6351` (CVV: 123) - mas com dados diferentes
- Vencimento: Qualquer data futura
- Nome: Qualquer nome
- CPF: Qualquer CPF válido

**✅ CONFIRMADO**: 
- O token `APP_USR-1779915323498167-120406-7bd7b57f348d130c62a7f57975217fef-3039297620` está correto para testes
- Este token aparece na seção "Credenciais de teste" do Mercado Pago
- O Mercado Pago pode usar tokens `APP_USR-` tanto para teste quanto para produção
- A diferença está na seção onde você obtém o token, não no prefixo

### Opção 2: Verificar Conta de Produção

Se você quer usar o token de **produção** (`APP_USR-...`):

1. Acesse: https://www.mercadopago.com.br/developers/panel
2. Verifique se sua conta está **totalmente verificada**:
   - Dados pessoais completos
   - Documentos verificados
   - Conta bancária cadastrada (se necessário)
3. Verifique se a aplicação está **habilitada para produção**
4. Certifique-se de que o token `APP_USR-1779915323498167-120406-7bd7b57f348d130c62a7f57975217fef-3039297620` está correto

### Opção 3: Criar Nova Aplicação (Se necessário)

1. Acesse: https://www.mercadopago.com.br/developers/panel
2. Vá em: **Suas integrações** → **Criar nova aplicação**
3. Configure:
   - Nome: Voltris Checkout
   - Tipo: Integração
4. Copie o novo **Access Token**
5. Configure no Vercel

## 🧪 Como Testar com Token de TESTE

### 1. Obter Token de Teste

```
1. Acesse: https://www.mercadopago.com.br/developers/panel
2. Vá em: Suas integrações → Suas credenciais
3. Copie o "Access Token" da seção TESTE
```

### 2. Configurar no Vercel

```
1. Acesse: https://vercel.com/dashboard
2. Vá em: Seu Projeto → Settings → Environment Variables
3. Edite ou adicione: MP_ACCESS_TOKEN
4. Cole o token de TESTE
5. Faça um novo deploy
```

### 3. Testar o Checkout

```
1. Acesse: https://voltris.com.br/teste-checkout
2. Crie um pagamento
3. Use cartões de teste do Mercado Pago:
   - Cartão: 5031 4332 1540 6351
   - CVV: 123
   - Vencimento: Qualquer data futura
```

## 📋 Checklist

- [ ] Token de TESTE obtido do painel do Mercado Pago
- [ ] Token configurado no Vercel como `MP_ACCESS_TOKEN`
- [ ] Novo deploy realizado no Vercel
- [ ] Teste realizado com cartão de teste
- [ ] Pagamento processado com sucesso

## 🚨 Importante

- **Para TESTES**: Use sempre token de TESTE (`TEST-...`)
- **Para PRODUÇÃO**: Use token de produção (`APP_USR-...`) apenas quando a conta estiver totalmente verificada
- **Nunca misture**: Token de teste com conta de produção ou vice-versa

## 📞 Próximos Passos

1. Obtenha o token de TESTE do Mercado Pago
2. Configure no Vercel
3. Faça um novo deploy
4. Teste novamente o checkout

---

**Nota**: O token atual (`APP_USR-1779915323498167-120406-7bd7b57f348d130c62a7f57975217fef-3039297620`) parece ser de produção, mas a conta pode não estar totalmente habilitada. Para testes, recomendo usar um token de TESTE.

