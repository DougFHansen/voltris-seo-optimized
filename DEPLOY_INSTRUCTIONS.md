# Instruções para Deploy do Projeto Voltris SEO Optimized

## Sumário
1. [Pré-requisitos](#pré-requisitos)
2. [Deploy no Vercel](#deploy-no-vercel)
3. [Configuração de Variáveis de Ambiente](#configuração-de-variáveis-de-ambiente)
4. [Verificação do Deploy](#verificação-do-deploy)

## Pré-requisitos

Antes de fazer o deploy, certifique-se de ter:

1. Conta no [Vercel](https://vercel.com/)
2. Conta no [Mercado Pago](https://www.mercadopago.com.br/) com acesso ao Access Token
3. Node.js instalado (versão 18 ou superior)
4. npm ou yarn instalado

## Deploy no Vercel

### Passo 1: Acessar o Vercel
1. Acesse [https://vercel.com](https://vercel.com)
2. Faça login ou crie uma nova conta

### Passo 2: Criar Novo Projeto
1. Clique no botão "New Project"
2. Selecione "Import Git Repository"
3. Conecte sua conta do GitHub
4. Procure e selecione o repositório `voltris-seo-optimized`
5. Clique em "Import"

### Passo 3: Configurar o Projeto
1. Na tela de configuração:
   - **Project Name**: Mantenha `voltris-seo-optimized` ou escolha outro nome
   - **Framework Preset**: Selecione "Next.js"
   - **Root Directory**: Deixe em branco (raiz do projeto)
   - **Build and Output Settings**: 
     - Build Command: `npm run build`
     - Output Directory: `.next`

### Passo 4: Adicionar Variáveis de Ambiente
1. Expanda a seção "Environment Variables"
2. Adicione a seguinte variável:
   ```
   Nome: MP_ACCESS_TOKEN
   Valor: SEU_ACCESS_TOKEN_DO_MERCADO_PAGO
   ```

### Passo 5: Deploy
1. Clique em "Deploy"
2. Aguarde o processo de build e deploy ser concluído
3. Ao finalizar, você receberá uma URL de produção

## Configuração de Variáveis de Ambiente

### MP_ACCESS_TOKEN
- **Descrição**: Token de acesso para integração com o Mercado Pago
- **Como obter**: 
  1. Acesse [https://www.mercadopago.com.br/developers](https://www.mercadopago.com.br/developers)
  2. Faça login na sua conta
  3. Vá para "Sua conta" > "Seus dados" > "Credenciais"
  4. Use o Access Token de produção ou sandbox para testes

## Verificação do Deploy

Após o deploy ser concluído:

1. Acesse a URL fornecida pelo Vercel
2. Verifique se a página inicial carrega corretamente
3. Teste a integração com o Mercado Pago acessando:
   - `https://SUA_URL/api/criar-pagamento`
4. Verifique se as páginas públicas estão acessíveis:
   - `https://SUA_URL/sucesso.html`
   - `https://SUA_URL/falha.html`

## Troubleshooting

### Problemas Comuns

1. **Erro no build**:
   - Verifique se todas as dependências estão corretamente listadas no `package.json`
   - Certifique-se de que a versão do Node.js usada pelo Vercel é compatível

2. **Erro na integração com Mercado Pago**:
   - Verifique se a variável `MP_ACCESS_TOKEN` está correta
   - Confirme se está usando o token de sandbox para testes

3. **Problemas de CORS**:
   - Certifique-se de que as URLs de callback estão corretamente configuradas no Mercado Pago

### Suporte

Se encontrar problemas não listados aqui:
1. Verifique os logs do Vercel
2. Consulte a documentação oficial do Next.js
3. Revise a documentação do SDK do Mercado Pago