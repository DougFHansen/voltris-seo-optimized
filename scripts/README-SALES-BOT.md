# Voltris Sales Bot - Telegram

Bot de simulação de vendas que envia mensagens profissionais e aleatórias para o Telegram a cada 5 minutos.

---

## Requisitos

- Node.js instalado (versão 18+ recomendada)
- Token do bot do Telegram
- ID do chat do Telegram

---

## Configuração

### 1. Configure as variáveis de ambiente

Escolha UMA das opções abaixo:

#### Opção A: Arquivo .env.local (Recomendado)

Na raiz do projeto, crie/edite o arquivo `.env.local` e adicione:

```env
TELEGRAM_BOT_TOKEN=seu_token_aqui
TELEGRAM_CHAT_ID=-1003839628448
```

#### Opção B: Variáveis de ambiente do Windows

1. Pressione `Win + R`, digite `sysdm.cpl` e pressione Enter
2. Vá em "Avançado" > "Variáveis de Ambiente"
3. Em "Variáveis do usuário", clique em "Novo..."
4. Nome: `TELEGRAM_BOT_TOKEN`
5. Valor: seu token do bot
6. Repita para `TELEGRAM_CHAT_ID` = `-1003839628448`
7. Reinicie o terminal/VS Code

---

## Como usar

### Método 1: Duplo clique (Mais fácil)

1. Abra a pasta `scripts`
2. Clique duas vezes em `start-sales-bot.bat`
3. Pronto! O bot está rodando

### Método 2: Terminal

```bash
cd scripts
node telegram-sales-bot.js
```

---

## Funcionamento

- Envia uma mensagem de venda simulada **imediatamente** ao iniciar
- Depois envia **a cada 5 minutos** automaticamente
- As mensagens incluem:
  - Plano (Standard/Pro/Enterprise)
  - Preço real (R$ 9,90 a R$ 1.099,90)
  - Periodo (Mensal/Anual)
  - Nome fictício de cliente
  - Cidade/Estado aleatório
  - Horário da "venda"

---

## Exemplo de mensagem no Telegram

```
🚀 NOVA VENDA - PLANO PRO!

🎫 Plano: Pro (Mais Vendido)
💳 Valor: R$ 69,90/mês
👤 Cliente: Maria Oliveira
📍 Local: Curitiba/PR
⏰ Horário: 14:32:18

🔥 Plano preferido dos gamers! Ativação automática.
```

---

## Parar o bot

- Pressione `Ctrl + C` no terminal
- Ou feche a janela do terminal

---

## Distribuição das vendas simuladas

| Plano | Probabilidade | Preço Mensal | Preço Anual |
|-------|--------------|--------------|-------------|
| Standard | 35% | R$ 9,90 | R$ 79,90 |
| Pro | 50% | R$ 69,90 | R$ 149,90 |
| Enterprise | 15% | R$ 299,90 | R$ 1.099,90 |

Periodo: 60% Mensal / 40% Anual

---

## Notas

- Este script roda **100% no seu computador**, sem depender do Vercel
- Não gasta nenhum recurso do Vercel
- Para rodar 24/7, deixe o computador ligado ou use um serviço de hospedagem free tier
