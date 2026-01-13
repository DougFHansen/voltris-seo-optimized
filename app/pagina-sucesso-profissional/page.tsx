'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

interface LicenseData {
  license_key: string;
  license_type: string;
  expires_at: string;
  max_devices: number;
}

function PaginaSucessoProfissional() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [license, setLicense] = useState<LicenseData | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Extrair parâmetros
  const preferenceId = searchParams?.get('preference_id') || '';
  const paymentId = searchParams?.get('payment_id') || '';
  
  useEffect(() => {
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
      
      // Construir URL corretamente
      let url = '/api/license/get?';
      if (preferenceId) {
        url += `preference_id=${preferenceId}`;
      } else if (paymentId) {
        url += `payment_id=${paymentId}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (response.ok && data.success) {
        if (data.license) {
          setLicense(data.license);
          setError(null);
        } else {
          setError('Licença ainda sendo gerada. Aguarde alguns instantes e tente novamente.');
        }
      } else {
        setError(data.error || data.message || 'Pagamento não encontrado');
      }
    } catch (err: any) {
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
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', borderRadius: '1rem', padding: '2rem', textAlign: 'center', maxWidth: '500px', border: '1px solid rgba(255,255,255,0.2)' }}>
          <div style={{ width: '3rem', height: '3rem', border: '4px solid rgba(255,255,255,0.3)', borderTopColor: '#ffffff', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }}></div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>Processando pagamento...</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)' }}>Aguarde enquanto geramos sua licença.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', borderRadius: '1rem', padding: '2rem', textAlign: 'center', maxWidth: '500px', border: '1px solid rgba(255,255,255,0.2)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '1rem' }}>Aguarde...</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '1.5rem' }}>{error}</p>
          <button 
            onClick={fetchLicense}
            style={{ backgroundColor: '#667eea', color: 'white', fontWeight: 'semibold', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer' }}
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  if (license) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        {/* Header */}
        <header style={{ backgroundColor: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem 2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '2.5rem', height: '2.5rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: 'white', fontWeight: 'bold', fontSize: '1.25rem' }}>V</span>
                </div>
                <h1 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 'bold' }}>Voltris Optimizer</h1>
              </div>
              <nav>
                <a href="/" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', hover: { color: 'white' } }}>Voltar ao Site</a>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {/* Success Banner */}
            <div style={{ backgroundColor: 'rgba(72, 187, 120, 0.2)', border: '1px solid rgba(72, 187, 120, 0.3)', borderRadius: '1rem', padding: '2rem', textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>Pagamento Aprovado!</h1>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.25rem' }}>Sua licença foi gerada com sucesso</p>
            </div>

            {/* License Card */}
            <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', borderRadius: '1rem', padding: '2rem', border: '1px solid rgba(255,255,255,0.2)', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '1.5rem', textAlign: 'center' }}>Sua Licença Premium</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '0.75rem', padding: '1.5rem' }}>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', fontWeight: 'medium', marginBottom: '0.5rem' }}>Tipo de Licença</div>
                  <div style={{ color: 'white', fontSize: '1.25rem', fontWeight: 'bold', textTransform: 'capitalize' }}>{license.license_type}</div>
                </div>
                
                <div style={{ backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '0.75rem', padding: '1.5rem' }}>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', fontWeight: 'medium', marginBottom: '0.5rem' }}>Válida até</div>
                  <div style={{ color: 'white', fontSize: '1.25rem', fontWeight: 'bold' }}>
                    {new Date(license.expires_at).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </div>
                </div>
                
                <div style={{ backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '0.75rem', padding: '1.5rem' }}>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', fontWeight: 'medium', marginBottom: '0.5rem' }}>Dispositivos</div>
                  <div style={{ color: 'white', fontSize: '1.25rem', fontWeight: 'bold' }}>
                    Até {license.max_devices} dispositivo{license.max_devices > 1 ? 's' : ''}
                  </div>
                </div>
                
                <div style={{ backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '0.75rem', padding: '1.5rem' }}>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', fontWeight: 'medium', marginBottom: '0.5rem' }}>Status</div>
                  <div style={{ color: '#48bb78', fontSize: '1.25rem', fontWeight: 'bold' }}>✓ Ativa</div>
                </div>
              </div>

              {/* License Key */}
              <div style={{ backgroundColor: 'rgba(102, 126, 234, 0.2)', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid rgba(102, 126, 234, 0.3)' }}>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', fontWeight: 'medium', marginBottom: '0.75rem' }}>Sua Chave de Licença</div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <input
                    type="text"
                    value={license.license_key}
                    readOnly
                    style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '0.5rem', padding: '0.75rem', color: 'white', fontFamily: 'monospace', fontSize: '0.875rem' }}
                  />
                  <button
                    onClick={copyLicenseKey}
                    style={{ backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', fontWeight: 'semibold', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}
                  >
                    Copiar
                  </button>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div style={{ backgroundColor: 'rgba(56, 189, 248, 0.2)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '1rem', padding: '1.5rem', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', marginBottom: '1rem' }}>Instruções de Ativação</h3>
              <ul style={{ color: 'rgba(255,255,255,0.8)', paddingLeft: '1.5rem' }}>
                <li style={{ marginBottom: '0.5rem' }}>Baixe o Voltris Optimizer no site oficial</li>
                <li style={{ marginBottom: '0.5rem' }}>Abra o programa e vá em "Ativar Licença"</li>
                <li style={{ marginBottom: '0.5rem' }}>Cole sua chave de licença e clique em "Ativar"</li>
                <li>Pronto! Seu otimizador está liberado</li>
              </ul>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
              <button
                onClick={() => window.close()}
                style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 'semibold', padding: '1rem 2rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer' }}
              >
                Fechar
              </button>
              <a
                href="/"
                style={{ backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', fontWeight: 'semibold', padding: '1rem 2rem', borderRadius: '0.75rem', textDecoration: 'none', textAlign: 'center' }}
              >
                Voltar ao Site Principal
              </a>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer style={{ backgroundColor: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(10px)', borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '3rem' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem 2rem', textAlign: 'center' }}>
            <p style={{ color: 'rgba(255,255,255,0.7)' }}>© 2026 Voltris Optimizer. Todos os direitos reservados.</p>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #4a5568 0%, #2d3748 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', borderRadius: '1rem', padding: '2rem', textAlign: 'center', maxWidth: '500px', border: '1px solid rgba(255,255,255,0.2)' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❌</div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>Erro</h1>
        <p style={{ color: 'rgba(255,255,255,0.8)' }}>Não foi possível processar sua solicitação.</p>
      </div>
    </div>
  );
}

export default function PaginaSucessoFinal() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'white', fontSize: '1.25rem' }}>Carregando...</div>
      </div>
    }>
      <PaginaSucessoProfissional />
    </Suspense>
  );
}