'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function FalhaContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [paymentDetails, setPaymentDetails] = useState<{
    status: string;
    payment_id: string;
    external_reference: string;
  } | null>(null);

  useEffect(() => {
    const status = searchParams.get('status') || searchParams.get('collection_status') || 'unknown';
    const payment_id = searchParams.get('payment_id') || searchParams.get('collection_id') || 'unknown';
    const external_reference = searchParams.get('external_reference') || '';
    
    setPaymentDetails({
      status,
      payment_id,
      external_reference,
    });

    console.log('[FALHA] Parâmetros recebidos:', {
      status,
      payment_id,
      external_reference,
    });
  }, [searchParams]);

  const getStatusMessage = () => {
    if (!paymentDetails) return { 
      title: 'Pagamento não processado', 
      message: 'Não foi possível processar seu pagamento.',
      details: ['Tente novamente mais tarde']
    };
    
    switch (paymentDetails.status) {
      case 'rejected':
        return {
          title: 'Pagamento Recusado',
          message: 'Seu pagamento foi recusado pela operadora do cartão.',
          details: [
            'Verifique se os dados do cartão estão corretos',
            'Confirme se há saldo/limite disponível',
            'Entre em contato com seu banco se necessário',
            'Tente novamente com outro cartão',
          ],
        };
      case 'pending':
        return {
          title: 'Pagamento Pendente',
          message: 'Seu pagamento está em análise.',
          details: [
            'Aguarde a confirmação da operadora',
            'Você receberá um email quando o pagamento for aprovado',
            'Isso pode levar alguns minutos',
            'Se preferir, tente outro método de pagamento',
          ],
        };
      case 'cancelled':
        return {
          title: 'Pagamento Cancelado',
          message: 'Você cancelou o pagamento.',
          details: [
            'Nenhuma cobrança foi realizada',
            'Você pode tentar novamente quando quiser',
            'Seus dados estão seguros',
          ],
        };
      default:
        return {
          title: 'Erro no Pagamento',
          message: 'Ocorreu um problema ao processar seu pagamento.',
          details: [
            'Verifique sua conexão com a internet',
            'Tente novamente em alguns minutos',
            'Se o problema persistir, entre em contato',
          ],
        };
    }
  };

  const statusInfo = getStatusMessage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 md:p-12">
        <div className="text-center">
          {/* Icon */}
          <div className="text-6xl mb-4">
            {paymentDetails?.status === 'pending' ? '⏳' : '❌'}
          </div>
          
          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {statusInfo.title}
          </h1>
          
          {/* Message */}
          <p className="text-gray-600 mb-8 text-lg">
            {statusInfo.message}
          </p>
          
          {/* Details */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">O que fazer agora?</h2>
            <ul className="space-y-3">
              {statusInfo.details.map((detail, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-orange-500 font-bold">•</span>
                  <span className="text-gray-700">{detail}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Payment Details (if available) */}
          {paymentDetails && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-blue-900 mb-2 text-sm">Detalhes do Pagamento</h3>
              <div className="text-xs text-blue-800 space-y-1">
                <p><strong>Status:</strong> {paymentDetails.status}</p>
                <p><strong>ID:</strong> {paymentDetails.payment_id}</p>
                {paymentDetails.external_reference && (
                  <p><strong>Referência:</strong> {paymentDetails.external_reference}</p>
                )}
              </div>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/checkout')}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg"
            >
              Tentar Novamente
            </button>
            <button
              onClick={() => router.push('/')}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              Voltar para Home
            </button>
          </div>
          
          {/* Support Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Precisa de ajuda? Entre em contato pelo email:{' '}
              <a href="mailto:suporte@voltris.com.br" className="text-blue-600 hover:underline font-semibold">
                suporte@voltris.com.br
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FalhaPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 md:p-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600 mx-auto mb-4"></div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Carregando...</h1>
            <p className="text-gray-600">Aguarde enquanto processamos sua solicitação.</p>
          </div>
        </div>
      </div>
    }>
      <FalhaContent />
    </Suspense>
  );
}
