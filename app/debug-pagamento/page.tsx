'use client';

import { useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';

function DebugPagamento() {
  const searchParams = useSearchParams();
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  const preferenceId = searchParams?.get('preference_id') || '';
  const paymentId = searchParams?.get('payment_id') || '';

  async function debugPayment() {
    setLoading(true);
    try {
      console.log('[DEBUG] Buscando pagamento com:', { preferenceId, paymentId });
      
      // Primeiro tentar pela preference_id
      if (preferenceId) {
        console.log('[DEBUG] Buscando por preference_id:', preferenceId);
        const response = await fetch(`/api/license/get?preference_id=${preferenceId}`);
        const data = await response.json();
        setResult({
          method: 'preference_id',
          preference_id: preferenceId,
          data: data
        });
        return;
      }
      
      // Depois tentar pelo payment_id
      if (paymentId) {
        console.log('[DEBUG] Buscando por payment_id:', paymentId);
        const response = await fetch(`/api/license/get?payment_id=${paymentId}`);
        const data = await response.json();
        setResult({
          method: 'payment_id',
          payment_id: paymentId,
          data: data
        });
        return;
      }
      
      setResult({
        error: 'Nenhum ID fornecido',
        message: 'Por favor, forneça preference_id ou payment_id na URL'
      });
      
    } catch (error: any) {
      setResult({
        error: 'Erro na requisição',
        message: error.message
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '2rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '2rem' }}>
          🔍 Debug de Pagamento
        </h1>
        
        <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: '1.5rem', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'semibold', marginBottom: '1rem' }}>IDs Recebidos:</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Preference ID:</div>
              <div style={{ fontFamily: 'monospace', backgroundColor: '#f9fafb', padding: '0.5rem', borderRadius: '0.25rem' }}>
                {preferenceId || 'não fornecido'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Payment ID:</div>
              <div style={{ fontFamily: 'monospace', backgroundColor: '#f9fafb', padding: '0.5rem', borderRadius: '0.25rem' }}>
                {paymentId || 'não fornecido'}
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={debugPayment}
          disabled={loading}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            fontWeight: 'semibold',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            border: 'none',
            cursor: 'pointer',
            marginBottom: '2rem',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? 'Buscando...' : '🔍 Diagnosticar Pagamento'}
        </button>

        {result && (
          <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'semibold', marginBottom: '1rem' }}>
              Resultado do Diagnóstico:
            </h2>
            
            <div style={{ 
              fontFamily: 'monospace', 
              backgroundColor: '#f9fafb', 
              padding: '1rem', 
              borderRadius: '0.25rem',
              maxHeight: '400px',
              overflow: 'auto'
            }}>
              <pre>{JSON.stringify(result, null, 2)}</pre>
            </div>
          </div>
        )}

        <div style={{ marginTop: '2rem', backgroundColor: '#fffbeb', border: '1px solid #fbbf24', borderRadius: '0.5rem', padding: '1.5rem' }}>
          <h3 style={{ color: '#92400e', fontWeight: 'semibold', marginBottom: '0.5rem' }}>💡 Instruções:</h3>
          <ul style={{ color: '#92400e', paddingLeft: '1.5rem' }}>
            <li>Use a URL: <code>/debug-pagamento?preference_id=SEU_ID_AQUI</code></li>
            <li>Ou: <code>/debug-pagamento?payment_id=SEU_ID_AQUI</code></li>
            <li>Clique em "Diagnosticar Pagamento" para ver resultados detalhados</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function DebugPagamentoPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>Carregando debugger...</div>
      </div>
    }>
      <DebugPagamento />
    </Suspense>
  );
}