'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface LicenseData {
  license_key: string;
  license_type: string;
  expires_at: string;
  max_devices: number;
}

export default function PaginaSucessoSimples() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [license, setLicense] = useState<LicenseData | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Extrair parâmetros
  const preferenceId = searchParams?.get('preference_id') || '';
  const paymentId = searchParams?.get('payment_id') || '';
  const status = searchParams?.get('status') || '';
  
  console.log('[PAGINA SUCESSO SIMPLES] Parâmetros:', { preferenceId, paymentId, status });

  useEffect(() => {
    console.log('[PAGINA SUCESSO SIMPLES] useEffect disparado');
    if (preferenceId || paymentId) {
      fetchLicense();
    } else {
      setError('Parâmetros de pagamento não encontrados');
      setLoading(false);
    }
  }, [preferenceId, paymentId]);

  async function fetchLicense() {
    try {
      setLoading(true);
      setError(null);
      
      console.log('[PAGINA SUCESSO SIMPLES] Buscando licença...');
      
      // Construir URL corretamente - usar apenas um parâmetro
      let url = '/api/license/get?';
      if (preferenceId) {
        url += `preference_id=${preferenceId}`;
      } else if (paymentId) {
        url += `payment_id=${paymentId}`;
      }
      
      console.log('[PAGINA SUCESSO SIMPLES] URL:', url);
      
      const response = await fetch(url);
      const data = await response.json();
      
      console.log('[PAGINA SUCESSO SIMPLES] Resposta:', data);
      
      if (response.ok && data.success) {
        if (data.license) {
          console.log('[PAGINA SUCESSO SIMPLES] Licença encontrada!');
          setLicense(data.license);
          setError(null);
        } else {
          console.log('[PAGINA SUCESSO SIMPLES] Pagamento encontrado mas licença pendente');
          setError('Licença ainda sendo gerada. Aguarde alguns instantes e tente novamente.');
        }
      } else {
        console.log('[PAGINA SUCESSO SIMPLES] Erro na resposta:', data.error || data.message);
        setError(data.error || data.message || 'Pagamento não encontrado');
      }
    } catch (err: any) {
      console.error('[PAGINA SUCESSO SIMPLES] Erro:', err);
      setError(err.message || 'Erro de conexão');
    } finally {
      setLoading(false);
    }
  }

  function copyLicenseKey() {
    if (license?.license_key) {
      navigator.clipboard.writeText(license.license_key);
      alert('Chave de licença copiada!');
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '1rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', padding: '2rem', textAlign: 'center', maxWidth: '500px' }}>
          <div style={{ width: '3rem', height: '3rem', border: '4px solid #e5e7eb', borderTopColor: '#10b981', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }}></div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>Processando pagamento...</h1>
          <p style={{ color: '#6b7280' }}>Aguarde enquanto buscamos sua licença.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '1rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', padding: '2rem', textAlign: 'center', maxWidth: '500px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#dc2626', marginBottom: '1rem' }}>Aguarde...</h1>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>{error}</p>
          <button 
            onClick={fetchLicense}
            style={{ backgroundColor: '#10b981', color: 'white', fontWeight: 'semibold', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer' }}
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  if (license) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '1rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', padding: '2rem', maxWidth: '600px', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>Pagamento Aprovado!</h1>
            <p style={{ color: '#6b7280' }}>Sua licença foi gerada com sucesso.</p>
          </div>
          
          <div style={{ backgroundColor: '#f9fafb', borderRadius: '0.5rem', padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'semibold', color: '#1f2937', marginBottom: '1rem' }}>Sua Licença</h2>
            
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 'medium', color: '#6b7280', marginBottom: '0.25rem' }}>Tipo de Licença</div>
              <div style={{ fontSize: '1.125rem', fontWeight: 'semibold', color: '#1f2937', textTransform: 'capitalize' }}>{license.license_type}</div>
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 'medium', color: '#6b7280', marginBottom: '0.25rem' }}>Válida até</div>
              <div style={{ fontSize: '1.125rem', fontWeight: 'semibold', color: '#1f2937' }}>
                {new Date(license.expires_at).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                })}
              </div>
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 'medium', color: '#6b7280', marginBottom: '0.25rem' }}>Dispositivos</div>
              <div style={{ fontSize: '1.125rem', fontWeight: 'semibold', color: '#1f2937' }}>
                Até {license.max_devices} dispositivo{license.max_devices > 1 ? 's' : ''}
              </div>
            </div>
            
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 'medium', color: '#6b7280', marginBottom: '0.5rem' }}>Chave de Licença</div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  value={license.license_key}
                  readOnly
                  style={{ flex: 1, backgroundColor: 'white', border: '2px solid #d1d5db', borderRadius: '0.5rem', padding: '0.75rem', fontFamily: 'monospace', fontSize: '0.875rem' }}
                />
                <button
                  onClick={copyLicenseKey}
                  style={{ backgroundColor: '#10b981', color: 'white', fontWeight: 'semibold', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}
                >
                  Copiar
                </button>
              </div>
            </div>
          </div>
          
          <div style={{ backgroundColor: '#eff6ff', border: '1px solid #dbeafe', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '0.875rem', color: '#1e40af' }}>
              <strong>Importante:</strong> Anote sua chave de licença. Você precisará dela para ativar o Voltris Optimizer.
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button
              onClick={() => window.close()}
              style={{ backgroundColor: '#e5e7eb', color: '#374151', fontWeight: 'semibold', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer' }}
            >
              Fechar
            </button>
            <button
              onClick={() => window.location.href = '/'}
              style={{ backgroundColor: '#10b981', color: 'white', fontWeight: 'semibold', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer' }}
            >
              Voltar ao Site
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '1rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', padding: '2rem', textAlign: 'center', maxWidth: '500px' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❌</div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#dc2626', marginBottom: '0.5rem' }}>Erro</h1>
        <p style={{ color: '#6b7280' }}>Não foi possível processar sua solicitação.</p>
      </div>
    </div>
  );
}