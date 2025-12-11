'use client';

import { useState, useEffect } from 'react';

export default function TesteCheckoutPage() {
  const [plan, setPlan] = useState<'trial' | 'pro' | 'premium'>('pro');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [license, setLicense] = useState<any>(null);
  const [checkingLicense, setCheckingLicense] = useState(false);

  async function criarPagamento() {
    try {
      setLoading(true);
      setError(null);
      setPaymentData(null);
      setLicense(null);

      const params = new URLSearchParams();
      params.append('plan', plan);
      if (email) params.append('email', email);

      const response = await fetch(`/api/pagamento?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar pagamento');
      }

      setPaymentData(data);
      
      // SEMPRE usar sandbox_init_point para testes (forçar sandbox)
      const checkoutUrl = data.sandbox_init_point || data.init_point;
      if (checkoutUrl) {
        // Adicionar aviso se não estiver usando sandbox
        if (!data.sandbox_init_point) {
          console.warn('⚠️ sandbox_init_point não disponível - usando init_point de produção');
        }
        window.open(checkoutUrl, '_blank');
      } else {
        setError('URL de checkout não disponível');
      }
    } catch (err: any) {
      setError(err.message || 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }

  async function verificarLicenca() {
    if (!paymentData?.preference_id) {
      setError('Crie um pagamento primeiro');
      return;
    }

    try {
      setCheckingLicense(true);
      setError(null);

      const response = await fetch(
        `/api/license/get?preference_id=${paymentData.preference_id}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao buscar licença');
      }

      if (data.license) {
        setLicense(data.license);
      } else {
        setError(data.message || 'Licença ainda não foi gerada. Aguarde alguns segundos e tente novamente.');
      }
    } catch (err: any) {
      setError(err.message || 'Erro desconhecido');
    } finally {
      setCheckingLicense(false);
    }
  }

  function abrirCheckout() {
    // Usar sandbox_init_point se disponível (para testes), senão usar init_point
    const checkoutUrl = paymentData?.sandbox_init_point || paymentData?.init_point;
    if (checkoutUrl) {
      window.open(checkoutUrl, '_blank');
    }
  }

  // Verificar licença automaticamente a cada 5 segundos se paymentData existe
  useEffect(() => {
    if (paymentData?.preference_id && !license) {
      const interval = setInterval(() => {
        verificarLicenca();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [paymentData, license]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🧪 Página de Teste - Checkout
          </h1>
          <p className="text-gray-600 mb-6">
            Use esta página para testar o sistema de checkout completo
          </p>

          {/* Formulário */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plano
              </label>
              <select
                value={plan}
                onChange={(e) => setPlan(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="trial">Trial (R$ 0,00)</option>
                <option value="pro">Pro (R$ 49,90)</option>
                <option value="premium">Premium (R$ 99,90)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email (opcional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="teste@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={criarPagamento}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              {loading ? 'Criando pagamento...' : 'Criar Pagamento e Abrir Checkout'}
            </button>
          </div>

          {/* Erro */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800 font-semibold">❌ Erro</p>
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Dados do Pagamento */}
          {paymentData && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                ✅ Pagamento Criado
              </h2>
              <div className="space-y-2 mb-4">
                <p>
                  <strong>Preference ID:</strong>{' '}
                  <code className="bg-white px-2 py-1 rounded text-sm">
                    {paymentData.preference_id}
                  </code>
                </p>
                <p>
                  <strong>Payment ID:</strong>{' '}
                  <code className="bg-white px-2 py-1 rounded text-sm">
                    {paymentData.payment_id || 'Aguardando pagamento...'}
                  </code>
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  💡 O checkout do Mercado Pago deve ter aberto em uma nova aba. 
                  Complete o pagamento lá e depois clique em "Verificar Licença".
                </p>
                {paymentData.sandbox_init_point && (
                  <div className="text-sm text-yellow-600 mt-2 font-semibold space-y-1">
                    <p>⚠️ IMPORTANTE: Use o link SANDBOX para testes</p>
                    <p className="text-xs text-yellow-700">
                      Antes de pagar, você PRECISA fazer login com uma CONTA DE TESTE do Mercado Pago.
                      Crie uma conta de teste "Comprador" no painel do Mercado Pago e faça login com ela antes de pagar.
                    </p>
                  </div>
                )}
              </div>
              <div className="flex gap-4">
                <button
                  onClick={abrirCheckout}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                >
                  Abrir Checkout Novamente
                </button>
                <button
                  onClick={verificarLicenca}
                  disabled={checkingLicense}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                >
                  {checkingLicense ? 'Verificando...' : 'Verificar Licença'}
                </button>
              </div>
            </div>
          )}

          {/* Licença */}
          {license && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                🎉 Licença Gerada com Sucesso!
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Tipo de Licença
                  </label>
                  <p className="text-lg font-semibold text-gray-800 capitalize">
                    {license.license_type}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Válida até
                  </label>
                  <p className="text-lg font-semibold text-gray-800">
                    {new Date(license.expires_at).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Chave de Licença
                  </label>
                  <div className="flex gap-2 mt-1">
                    <input
                      type="text"
                      value={license.license_key}
                      readOnly
                      className="flex-1 bg-white border-2 border-gray-300 rounded-lg px-4 py-2 font-mono text-sm"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(license.license_key);
                        alert('✅ Chave copiada para a área de transferência!');
                      }}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                      Copiar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Instruções */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            📖 Instruções de Teste
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            <li>Selecione o plano e insira um email (opcional)</li>
            <li>Clique em "Criar Pagamento e Abrir Checkout"</li>
            <li>O checkout do Mercado Pago abrirá automaticamente em nova aba</li>
            <li>
              No Mercado Pago, use um cartão de teste:
              <ul className="list-disc list-inside ml-6 mt-1">
                <li>
                  <strong>Cartão:</strong> 5031 4332 1540 6351
                </li>
                <li>
                  <strong>CVV:</strong> 123
                </li>
                <li>
                  <strong>Vencimento:</strong> Qualquer data futura (ex: 12/25)
                </li>
                <li>
                  <strong>Nome:</strong> Qualquer nome
                </li>
                <li>
                  <strong>CPF:</strong> Qualquer CPF válido (ex: 123.456.789-00)
                </li>
              </ul>
            </li>
            <li>Complete o pagamento no Mercado Pago</li>
            <li>
              Volte para esta página e clique em "Verificar Licença"
            </li>
            <li>
              A licença deve aparecer automaticamente após o webhook processar (pode levar alguns segundos)
            </li>
          </ol>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 font-semibold mb-2">⚠️ Importante</p>
            <ul className="list-disc list-inside text-yellow-700 space-y-1">
              <li>
                Certifique-se de que as variáveis de ambiente estão configuradas
                no Vercel
              </li>
              <li>
                O webhook pode levar alguns segundos para processar o pagamento
              </li>
              <li>
                Verifique os logs no Vercel para debug: Dashboard → Deployments
                → Logs
              </li>
              <li>
                Se a licença não aparecer, aguarde 10-15 segundos e clique novamente em "Verificar Licença"
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
