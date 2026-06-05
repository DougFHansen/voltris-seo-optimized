const webpush = require('web-push');

// Gerar chaves VAPID
const vapidKeys = webpush.generateVAPIDKeys();

console.log('🔑 Chaves VAPID geradas com sucesso!');
console.log('');
console.log('📋 Chave Pública (use no cliente):');
console.log(vapidKeys.publicKey);
console.log('');
console.log('🔒 Chave Privada (use no servidor):');
console.log(vapidKeys.privateKey);
console.log('');
console.log('💡 Copie a chave pública para o arquivo app/utils/vapid.ts');
console.log('💡 Guarde a chave privada para uso no servidor (não exponha no cliente)');
