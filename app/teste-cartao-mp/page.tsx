'use client';

import { useState } from 'react';

export default function TesteCartaoMP() {
  const [loading, setLoading] = useState(false);
  const [debugData, setDebugData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function criarPreferencia() {
    try {
      setLoading(true);
      setError(null);
      
      console.log('[TESTE CARTÃO] Criando preferência...');
      
      const response = await fetch('/api/pagamento/debug-cartao?plan=premium&email=test@testuser.com');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      console.log('[TESTE CARTÃO] Debug data:', data);
      setDebugData(data);
      
      if (data.success && data.checkout_urls?.use_this_for_testing) {
        console.log('[TESTE CARTÃO] Abrindo checkout...');
        
        // Abrir checkout em nova janela
        window.open(data.checkout_urls.use_this_for_testing, '_blank');
      } else {
        throw new Error('Checkout URL não disponível');
      }
      
    } catch (err: any) {
      console.error('[TESTE CARTÃO] Erro:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">
          🧪 Teste de Cartão - Mercado Pago Sandbox
        </h1>

        <div className="bg-slate-800 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">📋 Instruções</h2>
          <ol className="list-decimal list-inside space-y-2 text-slate-300">
            <li>Clique em "Criar Preferência e Abrir Checkout"</li>
            <li>Uma nova aba será aberta com o checkout do Mercado Pago</li>
            <li>Faça login com seu <strong>test user COMPRADOR</strong></li>
            <li>Digite o código de verificação (últimos 6 dígitos do user ID)</li>
            <li>Selecione "Cartão de crédito ou débito"</li>
            <li>Use o cartão de teste <strong>VISA</strong>: <code className="bg-slate-700 px-2 py-1 rounded">4235 6477 2802 5682</code></li>
            <li>CVV: <code className="bg-slate-700 px-2 py-1 rounded">123</code></li>
            <li>Vencimento: <code className="bg-slate-700 px-2 py-1 rounded">11/25</code></li>
            <li>Nome: <code className="bg-slate-700 px-2 py-1 rounded">APRO</code></li>
            <li>CPF: <code className="bg-slate-700 px-2 py-1 rounded">12345678909</code></li>
            <li><strong>Se der erro, abra F12 (Console) e copie TUDO!</strong></li>
            <li><strong>Tire screenshot da mensagem de erro</strong></li>
          </ol>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">🎯 Cartões de Teste</h2>
          <div className="space-y-4">
            <div className="bg-slate-700 p-4 rounded">
              <h3 className="font-semibold text-green-400">✅ APROVADO</h3>
              <p className="text-sm text-slate-300 mt-2">Número: <code>4235 6477 2802 5682</code> (VISA)</p>
              <p className="text-sm text-slate-300">Nome: APRO</p>
            </div>
            
            <div className="bg-slate-700 p-4 rounded">
              <h3 className="font-semibold text-yellow-400">⏳ PENDENTE</h3>
              <p className="text-sm text-slate-300 mt-2">Número: <code>4235 6477 2802 5682</code> (VISA)</p>
              <p className="text-sm text-slate-300">Nome: CONT</p>
            </div>
            
            <div className="bg-slate-700 p-4 rounded">
              <h3 className="font-semibold text-red-400">❌ REJEITADO</h3>
              <p className="text-sm text-slate-300 mt-2">Número: <code>4235 6477 2802 5682</code> (VISA)</p>
              <p className="text-sm text-slate-300">Nome: OTHE</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-8">
          <button
            onClick={criarPreferencia}
            disabled={loading}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-slate-600 disabled:to-slate-700 text-white font-bold py-4 px-8 rounded-lg text-xl shadow-lg transform transition hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
          >
            {loading ? '⏳ Criando...' : '🚀 Criar Preferência e Abrir Checkout'}
          </button>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 mb-6">
            <h3 className="text-xl font-semibold text-red-300 mb-2">❌ Erro</h3>
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {debugData && (
          <div className="bg-slate-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">🔍 Debug Data</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-purple-400">✅ Validação</h3>
                <pre className="bg-slate-900 p-4 rounded mt-2 text-xs overflow-x-auto">
                  {JSON.stringify(debugData.validation, null, 2)}
                </pre>
              </div>

              <div>
                <h3 className="font-semibold text-blue-400">🔗 URLs do Checkout</h3>
                <div className="bg-slate-900 p-4 rounded mt-2 space-y-2">
                  <div>
                    <p className="text-xs text-slate-400">Sandbox (teste):</p>
                    <a 
                      href={debugData.checkout_urls?.sandbox} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-300 hover:text-blue-200 text-xs break-all underline"
                    >
                      {debugData.checkout_urls?.sandbox}
                    </a>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-green-400">📤 Payload Enviado</h3>
                <pre className="bg-slate-900 p-4 rounded mt-2 text-xs overflow-x-auto max-h-96">
                  {JSON.stringify(debugData.payload_sent, null, 2)}
                </pre>
              </div>

              <div>
                <h3 className="font-semibold text-yellow-400">📥 Resposta do Mercado Pago</h3>
                <pre className="bg-slate-900 p-4 rounded mt-2 text-xs overflow-x-auto max-h-96">
                  {JSON.stringify(debugData.mercadopago_response, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
