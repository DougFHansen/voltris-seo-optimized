/**
 * Voltris Sales Bot - Telegram
 * Script standalone que envia mensagens de venda simulada a cada 5 minutos
 * Roda 100% no seu computador, sem depender do Vercel
 * 
 * Como usar:
 * 1. Certifique-se que as variáveis TELEGRAM_BOT_TOKEN e TELEGRAM_CHAT_ID estão no .env
 * 2. Rode: node scripts/telegram-sales-bot.js
 * 3. Ou clique duas vezes em start-sales-bot.bat
 */

const https = require('https');

// Configuração dos planos e preços
const PRICES = {
  month: {
    Standard: '9,90',
    Pro: '69,90',
    Enterprise: '299,90',
  },
  year: {
    Standard: '79,90',
    Pro: '149,90',
    Enterprise: '1.099,90',
  },
};

const CUSTOMER_NAMES = [
  'Carlos Silva', 'Maria Oliveira', 'João Pedro', 'Ana Costa', 'Fernanda Lima',
  'Ricardo Souza', 'Juliana Martins', 'Lucas Pereira', 'Beatriz Santos', 'Gabriel Almeida',
  'Camila Ferreira', 'Matheus Rodrigues', 'Isabella Gomes', 'Thiago Barbosa', 'Larissa Rocha',
  'Pedro Henrique', 'Mariana Dias', 'Felipe Araújo', 'Vitória Carvalho', 'Bruno Nogueira',
  'Amanda Pires', 'Rafael Cunha', 'Letícia Monteiro', 'Guilherme Cardoso', 'Sophia Teixeira',
  'Leonardo Moreira', 'Valentina Correia', 'Enzo Fernandes', 'Helena Machado', 'Daniel Brito',
];

const CITIES = [
  'São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Curitiba', 'Porto Alegre',
  'Salvador', 'Fortaleza', 'Brasília', 'Manaus', 'Recife',
  'Goiânia', 'Belém', 'São Luís', 'Maceió', 'Teresina',
  'Natal', 'Campo Grande', 'João Pessoa', 'Aracaju', 'Cuiabá',
];

const STATES = [
  'SP', 'RJ', 'MG', 'PR', 'RS', 'BA', 'CE', 'DF', 'AM', 'PE',
  'GO', 'PA', 'MA', 'AL', 'PI', 'RN', 'MS', 'PB', 'SE', 'MT',
];

const SALE_TEMPLATES = {
  Standard: [
    `💰 <b>NOVA VENDA REALIZADA!</b>\n\n🎫 <b>Plano:</b> Standard\n💳 <b>Valor:</b> R$ {{price}}/{{period}}\n👤 <b>Cliente:</b> {{customer}}\n📍 <b>Local:</b> {{city}}/{{state}}\n⏰ <b>Horário:</b> {{time}}\n\n✅ Licença ativada automaticamente. Mais um cliente otimizando seu PC!`,
    `🎉 <b>VENDA CONFIRMADA!</b>\n\n📦 Plano Standard - {{periodText}}\n💵 R$ {{price}}\n👤 {{customer}} ({{city}}/{{state}})\n🕐 {{time}}\n\n🚀 Ativação imediata concluída.`,
    `💎 <b>Ping! Nova venda no ar!</b>\n\n🥉 Plano Standard\n💰 R$ {{price}} ({{periodText}})\n📍 {{city}}, {{state}}\n👤 {{customer}}\n⏰ {{time}}\n\n✨ Cliente pronto para otimizar!`,
  ],
  Pro: [
    `🚀 <b>NOVA VENDA - PLANO PRO!</b>\n\n🎫 <b>Plano:</b> Pro (Mais Vendido)\n💳 <b>Valor:</b> R$ {{price}}/{{period}}\n👤 <b>Cliente:</b> {{customer}}\n📍 <b>Local:</b> {{city}}/{{state}}\n⏰ <b>Horário:</b> {{time}}\n\n🔥 Plano preferido dos gamers! Ativação automática.`,
    `💳 <b>VENDA PRO CONFIRMADA!</b>\n\n⭐ Plano Pro - {{periodText}}\n💵 R$ {{price}}\n👤 {{customer}}\n📍 {{city}}/{{state}}\n🕐 {{time}}\n\n🎯 Mais um entusiasta maximizando performance!`,
    `⚡ <b>Ping! Venda Pro!</b>\n\n🥈 Plano Pro\n💰 R$ {{price}} ({{periodText}})\n📍 {{city}}, {{state}}\n👤 {{customer}}\n⏰ {{time}}\n\n🏆 Escolha dos gamers exigentes!`,
  ],
  Enterprise: [
    `👑 <b>NOVA VENDA ENTERPRISE!</b>\n\n🎫 <b>Plano:</b> Enterprise\n💳 <b>Valor:</b> R$ {{price}}/{{period}}\n👤 <b>Cliente:</b> {{customer}}\n📍 <b>Local:</b> {{city}}/{{state}}\n⏰ <b>Horário:</b> {{time}}\n\n🏢 Empresa escalando com Voltris! Suporte VIP ativado.`,
    `💎 <b>VENDA ENTERPRISE!</b>\n\n👑 Plano Enterprise - {{periodText}}\n💵 R$ {{price}}\n👤 {{customer}}\n📍 {{city}}/{{state}}\n🕐 {{time}}\n\n🚀 Dispositivos ilimitados + API ativada!`,
    `🔥 <b>GRANDE VENDA!</b>\n\n👑 Enterprise\n💰 R$ {{price}} ({{periodText}})\n📍 {{city}}, {{state}}\n👤 {{customer}}\n⏰ {{time}}\n\n🏢 Mais uma empresa dominando performance!`,
  ],
};

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateTime() {
  const now = new Date();
  return now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function generateSaleMessage() {
  const period = Math.random() > 0.4 ? 'month' : 'year';
  const planWeights = [
    { plan: 'Standard', weight: 0.35 },
    { plan: 'Pro', weight: 0.50 },
    { plan: 'Enterprise', weight: 0.15 },
  ];

  const random = Math.random();
  let cumulativeWeight = 0;
  let selectedPlan = 'Standard';

  for (const item of planWeights) {
    cumulativeWeight += item.weight;
    if (random <= cumulativeWeight) {
      selectedPlan = item.plan;
      break;
    }
  }

  const price = PRICES[period][selectedPlan];
  const customer = getRandomItem(CUSTOMER_NAMES);
  const city = getRandomItem(CITIES);
  const state = getRandomItem(STATES);
  const time = generateTime();
  const periodText = period === 'month' ? 'Mensal' : 'Anual';
  const periodLabel = period === 'month' ? 'mês' : 'ano';

  const templates = SALE_TEMPLATES[selectedPlan];
  const template = getRandomItem(templates);

  const message = template
    .replace(/\{\{price\}\}/g, price)
    .replace(/\{\{period\}\}/g, periodLabel)
    .replace(/\{\{periodText\}\}/g, periodText)
    .replace(/\{\{customer\}\}/g, customer)
    .replace(/\{\{city\}\}/g, city)
    .replace(/\{\{state\}\}/g, state)
    .replace(/\{\{time\}\}/g, time);

  return { plan: selectedPlan, period, price, customer, city, state, message };
}

async function sendToTelegram(message) {
  const token = process.env.TELEGRAM_BOT_TOKEN?.replace(/['"]/g, '').trim();
  const chatId = process.env.TELEGRAM_CHAT_ID?.replace(/['"]/g, '').trim() || '-1003839628448';

  if (!token) {
    console.error('❌ ERRO: TELEGRAM_BOT_TOKEN não configurado no .env');
    console.log('📝 Adicione ao .env.local:');
    console.log('   TELEGRAM_BOT_TOKEN=seu_token_aqui');
    console.log('   TELEGRAM_CHAT_ID=-1003839628448');
    return false;
  }

  return new Promise((resolve) => {
    const data = JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML',
    });

    const options = {
      hostname: 'api.telegram.org',
      port: 443,
      path: `/bot${token}/sendMessage`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => { responseData += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ Mensagem enviada com sucesso!');
          resolve(true);
        } else {
          console.error('❌ Erro ao enviar:', responseData);
          resolve(false);
        }
      });
    });

    req.on('error', (err) => {
      console.error('❌ Erro de rede:', err.message);
      resolve(false);
    });

    req.write(data);
    req.end();
  });
}

async function runSimulation() {
  console.log('🤖 Voltris Sales Bot iniciado!');
  console.log('⏰ Enviando mensagens a cada 5 minutos...');
  console.log('💡 Pressione Ctrl+C para parar\n');

  // Enviar primeira mensagem imediatamente
  await sendNextSale();

  // Configurar intervalo de 5 minutos (300.000 ms)
  setInterval(sendNextSale, 5 * 60 * 1000);
}

async function sendNextSale() {
  const { plan, period, price, customer, city, state, message } = generateSaleMessage();
  const periodText = period === 'month' ? 'Mensal' : 'Anual';

  console.log(`\n📦 Nova venda simulada:`);
  console.log(`   Plano: ${plan} (${periodText})`);
  console.log(`   Valor: R$ ${price}`);
  console.log(`   Cliente: ${customer}`);
  console.log(`   Local: ${city}/${state}`);
  console.log(`   Horário: ${new Date().toLocaleTimeString('pt-BR')}`);

  await sendToTelegram(message);
  console.log(`\n⏳ Próxima mensagem em 5 minutos...`);
}

// Carregar variáveis de ambiente do .env.local se existir
try {
  const fs = require('fs');
  const path = require('path');
  const envPath = path.join(__dirname, '..', '.env.local');
  
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0 && !key.startsWith('#')) {
        const value = valueParts.join('=').trim();
        if (!process.env[key.trim()]) {
          process.env[key.trim()] = value.replace(/^["']|["']$/g, '');
        }
      }
    });
    console.log('✅ Variáveis de ambiente carregadas do .env.local');
  }
} catch (err) {
  console.log('⚠️  Não foi possível carregar .env.local');
}

// Verificar se o token está configurado
if (!process.env.TELEGRAM_BOT_TOKEN) {
  console.error('\n❌ ERRO CRÍTICO: TELEGRAM_BOT_TOKEN não encontrado!');
  console.log('\n📝 Para configurar:');
  console.log('   1. Crie um arquivo .env.local na raiz do projeto');
  console.log('   2. Adicione as linhas:');
  console.log('      TELEGRAM_BOT_TOKEN=seu_token_aqui');
  console.log('      TELEGRAM_CHAT_ID=-1003839628448');
  console.log('\n   Ou defina como variável de ambiente do Windows\n');
  process.exit(1);
}

// Iniciar o bot
runSimulation().catch(console.error);
