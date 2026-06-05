/**
 * Teste do sistema de notificações expandido
 * Execute este arquivo no console do navegador para testar
 */

// Teste de notificação de página
async function testPageView() {
  console.log('🧪 Testando notificação de página...');
  try {
    const result = await notifyPageView('Teste de Página - Debug');
    console.log('✅ Resultado do teste de página:', result);
  } catch (error) {
    console.error('❌ Erro no teste de página:', error);
  }
}

// Teste de notificação de download
async function testDownload() {
  console.log('🧪 Testando notificação de download...');
  try {
    const result = await notifyDownload('Arquivo de Teste - Debug.exe');
    console.log('✅ Resultado do teste de download:', result);
  } catch (error) {
    console.error('❌ Erro no teste de download:', error);
  }
}

// Teste de notificação de compra
async function testPurchase() {
  console.log('🧪 Testando notificação de compra...');
  try {
    const result = await notifyPurchaseAttempt('premium', 'yearly');
    console.log('✅ Resultado do teste de compra:', result);
  } catch (error) {
    console.error('❌ Erro no teste de compra:', error);
  }
}

// Função para obter informações do navegador
async function testBrowserInfo() {
  console.log('🧪 Testando informações do navegador...');
  try {
    const browserInfo = await import('./browserFingerprint').then(m => m.getBrowserNotificationInfo());
    console.log('📊 Informações do navegador:', browserInfo);
    return browserInfo;
  } catch (error) {
    console.error('❌ Erro ao obter informações do navegador:', error);
  }
}

// Função para testar localização
async function testLocation() {
  console.log('🧪 Testando localização...');
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    console.log('🗺️ Localização:', {
      country: data.country_name,
      region: data.region,
      city: data.city,
      timezone: data.timezone,
      ip: data.ip ? data.ip.replace(/\d+\.\d+\.\d+\./, 'xxx.xxx.xxx.') : 'Desconhecido'
    });
    return data;
  } catch (error) {
    console.error('❌ Erro ao obter localização:', error);
  }
}

// Executar todos os testes
async function runAllTests() {
  console.log('🚀 Iniciando todos os testes...');
  
  await testBrowserInfo();
  await testLocation();
  await testPageView();
  await testDownload();
  await testPurchase();
  
  console.log('✅ Todos os testes concluídos!');
}

// Disponibilizar funções globalmente para teste
window.testNotifications = {
  testPageView,
  testDownload,
  testPurchase,
  testBrowserInfo,
  testLocation,
  runAllTests
};

console.log('🧪 Funções de teste disponíveis em window.testNotifications');
console.log('📝 Use: window.testNotifications.runAllTests() para executar todos os testes');
