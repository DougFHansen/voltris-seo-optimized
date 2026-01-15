const axios = require('axios');

// Configurações
const accessToken = process.env.MP_ACCESS_TOKEN;
const webhookUrl = 'https://www.voltris.com.br/api/webhook/mercadopago';

async function checkAndConfigureWebhook() {
    try {
        console.log('🔍 Verificando webhooks configurados...');
        
        // Listar webhooks existentes
        const listResponse = await axios.get('https://api.mercadopago.com/v1/webhooks', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('✅ Webhooks atuais:', listResponse.data);
        
        // Verificar se nosso webhook já existe
        const existingWebhook = listResponse.data.find(w => w.url === webhookUrl);
        
        if (existingWebhook) {
            console.log('✅ Webhook já configurado:', existingWebhook);
            
            // Testar o webhook
            console.log('🧪 Testando webhook...');
            const testResponse = await axios.post(webhookUrl, {
                action: 'test',
                data: { id: '123456' },
                live_mode: false
            });
            
            console.log('✅ Teste do webhook:', testResponse.data);
        } else {
            console.log('❌ Webhook não encontrado, configurando...');
            
            // Criar novo webhook
            const createResponse = await axios.post('https://api.mercadopago.com/v1/webhooks', {
                url: webhookUrl,
                event_types: ['payment.created', 'payment.updated']
            }, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('✅ Webhook criado:', createResponse.data);
        }
        
        // Testar com um pagamento pendente
        console.log('\n🧪 Testando com pagamento pendente...');
        const pendingPaymentId = '141426290431'; // ID do seu pagamento
        
        const paymentResponse = await axios.get(`https://api.mercadopago.com/v1/payments/${pendingPaymentId}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('📊 Status atual do pagamento:', {
            id: paymentResponse.data.id,
            status: paymentResponse.data.status,
            status_detail: paymentResponse.data.status_detail
        });
        
        // Se estiver aprovado, enviar notificação manual
        if (paymentResponse.data.status === 'approved') {
            console.log('🚀 Enviando notificação manual para webhook...');
            
            const webhookResponse = await axios.post(webhookUrl, {
                action: 'payment.updated',
                data: { id: pendingPaymentId },
                type: 'payment'
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('✅ Resposta do webhook:', webhookResponse.data);
        }
        
    } catch (error) {
        console.error('❌ Erro:', error.response?.data || error.message);
    }
}

// Executar
checkAndConfigureWebhook();