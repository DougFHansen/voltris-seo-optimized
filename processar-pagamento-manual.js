/**
 * Script para processar pagamento PIX manualmente
 * 
 * Use este script se você pagou o PIX mas a licença não foi gerada
 * 
 * COMO USAR:
 * 1. Abra o terminal no diretório do projeto
 * 2. Execute: node processar-pagamento-manual.js PAYMENT_ID
 * 3. Substitua PAYMENT_ID pelo ID do pagamento (exemplo: 140838370020)
 */

const PAYMENT_ID = process.argv[2];

if (!PAYMENT_ID) {
  console.error('❌ Erro: Forneça o ID do pagamento!');
  console.log('Uso: node processar-pagamento-manual.js PAYMENT_ID');
  console.log('Exemplo: node processar-pagamento-manual.js 140838370020');
  process.exit(1);
}

console.log(`🔄 Processando pagamento ${PAYMENT_ID}...`);

const API_URL = 'https://voltris.com.br/api/pagamento/processar-retorno';

fetch(API_URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    payment_id: PAYMENT_ID,
    collection_id: PAYMENT_ID,
    status: 'approved'
  })
})
  .then(response => response.json())
  .then(data => {
    console.log('\n✅ Resposta da API:');
    console.log(JSON.stringify(data, null, 2));
    
    if (data.license) {
      console.log('\n🎉 LICENÇA GERADA COM SUCESSO!');
      console.log('═══════════════════════════════════════');
      console.log(`Chave: ${data.license.license_key}`);
      console.log(`Tipo: ${data.license.license_type}`);
      console.log(`Válida até: ${data.license.expires_at}`);
      console.log(`Dispositivos: ${data.license.max_devices}`);
      console.log('═══════════════════════════════════════');
    } else {
      console.log('\n⚠️ Licença ainda não foi gerada. Verifique o status do pagamento.');
    }
  })
  .catch(error => {
    console.error('\n❌ Erro ao processar:', error.message);
  });
