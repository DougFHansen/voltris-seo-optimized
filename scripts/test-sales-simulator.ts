/**
 * Script de teste para o simulador de vendas
 * Rode com: npx tsx scripts/test-sales-simulator.ts
 */

import { generateSimulatedSale } from '../services/salesSimulator';

console.log('🧪 Testando Simulador de Vendas\n');

// Gerar 5 mensagens de exemplo
for (let i = 0; i < 5; i++) {
  const { sale, message } = generateSimulatedSale();
  console.log(`📦 Venda ${i + 1}:`);
  console.log(`   Plano: ${sale.plan}`);
  console.log(`   Período: ${sale.period}`);
  console.log(`   Preço: R$ ${sale.price}`);
  console.log(`   Cliente: ${sale.customerName}`);
  console.log(`   Local: ${sale.city}/${sale.state}`);
  console.log(`\n📨 Mensagem do Telegram:`);
  console.log(message);
  console.log('\n' + '='.repeat(60) + '\n');
}

console.log('✅ Teste concluído!');
