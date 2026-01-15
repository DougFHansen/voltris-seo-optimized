// Script para testar o endpoint de validação de licenças
const axios = require('axios');

async function testLicenseEndpoint() {
  const baseUrl = 'http://localhost:3000'; // ou seu domínio
  
  console.log('🧪 Testando endpoint de validação de licenças...\n');
  
  // Teste 1: Chave de teste válida
  console.log('=== Teste 1: Chave de teste válida ===');
  try {
    const response = await axios.post(`${baseUrl}/api/license/validate`, {
      license_key: 'VOLTRIS-LIC-TESTE-20260113-ABC123DEF456'
    });
    
    console.log('✅ Status:', response.status);
    console.log('✅ Resposta:', JSON.stringify(response.data, null, 2));
    
    if (response.data.success && response.data.license) {
      console.log('✅ Licença válida retornada corretamente!\n');
    } else {
      console.log('❌ Formato da resposta inesperado\n');
    }
  } catch (error) {
    console.log('❌ Erro:', error.response?.data || error.message);
    console.log('');
  }
  
  // Teste 2: Chave inválida
  console.log('=== Teste 2: Chave inválida ===');
  try {
    const response = await axios.post(`${baseUrl}/api/license/validate`, {
      license_key: 'CHAVE-INVALIDA-123456'
    });
    
    console.log('✅ Status:', response.status);
    console.log('✅ Resposta:', JSON.stringify(response.data, null, 2));
    
    if (!response.data.success) {
      console.log('✅ Erro de licença inválida retornado corretamente!\n');
    } else {
      console.log('❌ Esperava erro mas recebeu sucesso\n');
    }
  } catch (error) {
    console.log('✅ Erro esperado:', error.response?.data || error.message);
    console.log('');
  }
  
  // Teste 3: Sem chave
  console.log('=== Teste 3: Requisição sem chave ===');
  try {
    const response = await axios.post(`${baseUrl}/api/license/validate`, {});
    
    console.log('✅ Status:', response.status);
    console.log('✅ Resposta:', JSON.stringify(response.data, null, 2));
    
    if (!response.data.success && response.data.error.includes('obrigatória')) {
      console.log('✅ Erro de chave obrigatória retornado corretamente!\n');
    } else {
      console.log('❌ Formato de erro inesperado\n');
    }
  } catch (error) {
    console.log('✅ Erro esperado:', error.response?.data || error.message);
    console.log('');
  }
  
  console.log('🏁 Testes concluídos!');
}

// Executar testes
testLicenseEndpoint().catch(console.error);