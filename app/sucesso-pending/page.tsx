'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function SucessoPendingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [collectionId, setCollectionId] = useState<string | null>(null);
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('');

  // Extrair parâmetros
  useEffect(() => {
    const statusParam = searchParams?.get('status') || '';
    const paymentIdParam = searchParams?.get('payment_id') || '';
    const collectionIdParam = searchParams?.get('collection_id') || '';
    const preferenceIdParam = searchParams?.get('preference_id') || '';
    
    console.log('[SUCESSO PENDING] Parâmetros recebidos:', {
      status: statusParam,
      payment_id: paymentIdParam,
      collection_id: collectionIdParam,
      preference_id: preferenceIdParam
    });
    
    setStatus(statusParam);
    setPaymentId(paymentIdParam);
    setCollectionId(collectionIdParam);
    setPreferenceId(preferenceIdParam);
    
    // Mensagem baseada no status
    let statusMessage = '';
    switch (statusParam) {
      case 'pending':
        statusMessage = 'Seu pagamento está sendo processado. Isso pode levar alguns minutos.';
        break;
      case 'in_process':
        statusMessage = 'Seu pagamento está em processamento. Aguarde a confirmação.';
        break;
      default:
        statusMessage = 'Estamos verificando o status do seu pagamento.';
    }
    
    setMessage(statusMessage);
    setLoading(false);
  }, [searchParams]);

  async function checkPaymentStatus() {
    if (!paymentId && !collectionId) {
      alert('Nenhum ID de pagamento encontrado');
      return;
    }

    try {
      setChecking(true);
      
      const actualPaymentId = paymentId || collectionId;
      console.log(`[SUCESSO PENDING] Verificando status do pagamento ${actualPaymentId}...`);
      
      // Chamar API para verificar status no Mercado Pago
      const response = await fetch(`/api/check-payment-status?payment_id=${actualPaymentId}`);
      const data = await response.json();
      
      console.log('[SUCESSO PENDING] Status check response:', data);
      
      if (response.ok) {
        if (data.status === 'approved') {
          // Redirecionar para página de sucesso principal
          const returnUrl = new URL('/sucesso', window.location.origin);
          if (preferenceId) returnUrl.searchParams.set('preference_id', preferenceId);
          if (paymentId) returnUrl.searchParams.set('payment_id', paymentId);
          if (collectionId) returnUrl.searchParams.set('collection_id', collectionId);
          returnUrl.searchParams.set('status', 'approved');
          
          window.location.href = returnUrl.toString();
          return;
        } else {
          // Atualizar mensagem com status atual
          let newMessage = '';
          switch (data.status) {
            case 'pending':
              newMessage = 'Pagamento ainda pendente. Continuamos monitorando...';
              break;
            case 'in_process':
              newMessage = 'Pagamento em processamento. Aguarde mais alguns minutos.';
              break;
            case 'rejected':
              newMessage = 'Pagamento rejeitado. Por favor, tente novamente.';
              break;
            default:
              newMessage = `Status atual: ${data.status}. Continuamos monitorando.`;
          }
          setMessage(newMessage);
        }
      } else {
        setMessage('Erro ao verificar status. Tente novamente.');
      }
    } catch (error) {
      console.error('[SUCESSO PENDING] Erro ao verificar status:', error);
      setMessage('Erro de conexão. Tente novamente.');
    } finally {
      setChecking(false);
    }
  }

  // Auto-check a cada 10 segundos
  useEffect(() => {
    if ((status === 'pending' || status === 'in_process') && (paymentId || collectionId)) {
      const interval = setInterval(() => {
        console.log('[SUCESSO PENDING] Auto-check de status...');
        checkPaymentStatus();
      }, 10000); // 10 segundos
      
      return () => clearInterval(interval);
    }
  }, [status, paymentId, collectionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 md:p-12 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-600 mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Carregando...</h1>
          <p className="text-gray-600">Aguarde enquanto carregamos as informações do pagamento.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 md:p-12">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">
            {status === 'pending' ? '⏳' : status === 'in_process' ? '🔄' : '❓'}
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {status === 'pending' ? 'Pagamento Pendente' : 
             status === 'in_process' ? 'Processando Pagamento' : 
             'Status do Pagamento'}
          </h1>
          <p className="text-gray-600">{message}</p>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Informações do Pagamento</h2>
          
          <div className="space-y-3">
            {preferenceId && (
              <div>
                <label className="text-sm font-medium text-gray-600">Preference ID</label>
                <p className="text-gray-800 font-mono text-sm break-all">{preferenceId}</p>
              </div>
            )}
            
            {(paymentId || collectionId) && (
              <div>
                <label className="text-sm font-medium text-gray-600">Payment ID</label>
                <p className="text-gray-800 font-mono text-sm break-all">
                  {paymentId || collectionId}
                </p>
              </div>
            )}
            
            <div>
              <label className="text-sm font-medium text-gray-600">Status Atual</label>
              <p className="text-gray-800 font-semibold capitalize">{status || 'desconhecido'}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            <strong>O que acontece agora?</strong>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Continuamos monitorando automaticamente o status do seu pagamento</li>
              <li>Assim que for aprovado, você será redirecionado automaticamente</li>
              <li>Se preferir, você pode verificar manualmente o status abaixo</li>
            </ul>
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={checkPaymentStatus}
            disabled={checking}
            className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            {checking ? 'Verificando...' : 'Verificar Status Manualmente'}
          </button>
          
          <button
            onClick={() => router.push('/')}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Voltar ao Site
          </button>
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Este processo pode levar alguns minutos. Por favor, aguarde.</p>
        </div>
      </div>
    </div>
  );
}

export default function SucessoPendingPage() {
  return <SucessoPendingContent />;
}