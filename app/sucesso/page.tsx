'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

interface LicenseData {
  license_key: string;
  license_type: string;
  expires_at: string;
  max_devices: number;
}

function SucessoContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [license, setLicense] = useState<LicenseData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryAttempts, setRetryAttempts] = useState(0);
  const maxRetries = 5;
  
  // Extrair parâmetros com fallback para evitar undefined
  const preferenceId = searchParams?.get('preference_id') || null;
  const paymentId = searchParams?.get('payment_id') || null;
  const collectionId = searchParams?.get('collection_id') || null;
  const status = searchParams?.get('status') || null;
  
  console.log('[SUCESSO FINAL] Parâmetros recebidos:', { preferenceId, paymentId, collectionId, status });

  useEffect(() => {
    console.log('[SUCESSO FINAL] useEffect disparado com:', { preferenceId, paymentId, collectionId });
    
    if (preferenceId || paymentId || collectionId) {
      console.log('[SUCESSO FINAL] Processando pagamento...');
      processPaymentReturn();
    } else {
      console.log('[SUCESSO FINAL] Nenhum parâmetro encontrado');
      setError('Parâmetros de pagamento não encontrados');
      setLoading(false);
    }
  }, [preferenceId, paymentId, collectionId]);

  // Auto-retry para licenças pendentes e status pending
  useEffect(() => {
    if (!license && retryAttempts < maxRetries && (preferenceId || paymentId || collectionId)) {
      const timer = setTimeout(() => {
        console.log(`[SUCESSO FINAL] Auto-retry ${retryAttempts + 1}/${maxRetries}...`);
        
        // Se status for pending, verificar status real do pagamento
        if (status === 'pending' && collectionId) {
          checkPaymentStatus(collectionId);
        }
        
        fetchLicense();
        setRetryAttempts(prev => prev + 1);
      }, 3000); // Tentar a cada 3 segundos
      
      return () => clearTimeout(timer);
    }
  }, [license, retryAttempts, preferenceId, paymentId, collectionId, status]);

  async function checkPaymentStatus(paymentId: string) {
    try {
      console.log(`[SUCESSO FINAL] Verificando status real do pagamento ${paymentId}...`);
      
      const response = await fetch(`/api/check-payment-status?payment_id=${paymentId}`);
      const data = await response.json();
      
      console.log(`[SUCESSO FINAL] Status do pagamento:`, data);
      
      if (data.status === 'approved') {
        // Atualizar status e tentar gerar licença
        window.location.search = window.location.search.replace(/status=pending/, 'status=approved');
      }
    } catch (error) {
      console.error('[SUCESSO FINAL] Erro ao verificar status do pagamento:', error);
    }
  }

  async function processPaymentReturn() {
    try {
      setLoading(true);
      
      // Detectar se é pagamento SIMULADO
      const isSimulated = preferenceId && preferenceId.startsWith('SIMULADO-');
      
      if (isSimulated) {
        console.log('[SUCESSO FINAL] Pagamento simulado detectado, buscando licença diretamente...');
        await fetchLicense();
        return;
      }
      
      // Para pagamentos reais, processar normalmente
      if (paymentId && status === 'approved') {
        console.log('[SUCESSO FINAL] Processando retorno do pagamento real...');
        await fetchLicense();
      } else {
        await fetchLicense();
      }
      
    } catch (err) {
      console.error('[SUCESSO FINAL] Erro:', err);
      await fetchLicense();
    }
  }

  async function fetchLicense() {
    try {
      setLoading(true);
      setError(null);
      
      console.log('[SUCESSO FINAL] Buscando licença...', {
        preference_id: preferenceId,
        payment_id: paymentId,
        collection_id: collectionId,
      });
      
      // Tentar buscar licença pelo preference_id ou payment_id
      const params = new URLSearchParams();
      if (preferenceId) params.append('preference_id', preferenceId);
      if (paymentId) params.append('payment_id', paymentId);
      if (collectionId) params.append('payment_id', collectionId);
      
      const response = await fetch(`/api/license/get?${params.toString()}`);
      
      const data = await response.json();
      
      console.log('[SUCESSO FINAL] Resposta da API:', {
        status: response.status,
        success: data.success,
        has_license: !!data.license,
        message: data.message,
      });
      
      if (!response.ok || !data.success) {
        // Se licença ainda está sendo gerada
        if (data.message && data.message.includes('sendo gerada')) {
          setError(data.message);
          // Tentar novamente automaticamente após o tempo sugerido
          if (data.retry_after) {
            setTimeout(() => {
              if (!license) {
                fetchLicense();
              }
            }, data.retry_after * 1000);
          }
          return;
        }
        
        throw new Error(data.error || data.message || 'Erro ao buscar licença');
      }
      
      if (data.license) {
        console.log('[SUCESSO FINAL] ✅ Licença encontrada:', data.license.license_key.substring(0, 20) + '...');
        setLicense(data.license);
        setError(null);
      } else {
        setError('Licença ainda não foi gerada. Aguarde alguns instantes e tente novamente.');
      }
    } catch (err: any) {
      console.error('[SUCESSO FINAL] Erro ao buscar licença:', err);
      setError(err.message || 'Erro ao buscar licença. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  }

  function copyLicenseKey() {
    if (license?.license_key) {
      navigator.clipboard.writeText(license.license_key);
      alert('Chave de licença copiada para a área de transferência!');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 md:p-12 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Processando pagamento...</h1>
          <p className="text-gray-600">Aguarde enquanto verificamos seu pagamento e geramos sua licença.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 md:p-12 text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Aguarde...</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchLicense}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  if (license) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 md:p-12">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Pagamento Aprovado!</h1>
            <p className="text-gray-600">Sua licença foi gerada com sucesso.</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Sua Licença</h2>
            
            <div className="space-y-3 mb-6">
              <div>
                <label className="text-sm font-medium text-gray-600">Tipo de Licença</label>
                <p className="text-lg font-semibold text-gray-800 capitalize">{license.license_type}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Válida até</label>
                <p className="text-lg font-semibold text-gray-800">
                  {new Date(license.expires_at).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Dispositivos</label>
                <p className="text-lg font-semibold text-gray-800">
                  Até {license.max_devices} dispositivo{license.max_devices > 1 ? 's' : ''}
                </p>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">Chave de Licença</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={license.license_key}
                  readOnly
                  className="flex-1 bg-white border-2 border-gray-300 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-green-500"
                />
                <button
                  onClick={copyLicenseKey}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors whitespace-nowrap"
                >
                  Copiar
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Importante:</strong> Copie e salve sua chave de licença em local seguro. 
              Você precisará dela para ativar o programa Voltris Optimizer.
            </p>
          </div>
          
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-5 mb-6">
            <div className="flex items-start gap-3">
              <div className="text-2xl">⚠️</div>
              <div className="text-left">
                <h3 className="font-bold text-yellow-900 mb-2 text-lg">NÃO PERCA ESTA LICENÇA!</h3>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>✅ <strong>Anote</strong> ou salve a chave em um lugar seguro</li>
                  <li>✅ <strong>Em até 10 minutos</strong>, você também receberá a licença no email cadastrado</li>
                  <li>✅ <strong>Guarde este email</strong> para futuras reinstalações do programa</li>
                  <li>✅ Use a licença no <strong>Voltris Optimizer</strong> para ativar todas as funcionalidades</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => window.close()}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Fechar
            </button>
            <button
              onClick={() => router.push('/')}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Voltar ao Site
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 md:p-12 text-center">
        <div className="text-6xl mb-4">❌</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Erro</h1>
        <p className="text-gray-600">Não foi possível processar sua solicitação.</p>
      </div>
    </div>
  );
}

export default function SucessoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 md:p-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Carregando...</h1>
            <p className="text-gray-600">Aguarde enquanto processamos sua solicitação.</p>
          </div>
        </div>
      </div>
    }>
      <SucessoContent />
    </Suspense>
  );
}