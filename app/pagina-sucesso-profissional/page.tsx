'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

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
      <>
        <Header />
        <main className="bg-[#0a0a0a] min-h-screen pt-20 pb-12">
          <div className="container mx-auto px-4 flex items-center justify-center min-h-[calc(100vh-8rem)]">
            <div className="bg-white rounded-xl shadow-2xl p-8 text-center max-w-md w-full border border-gray-200">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-[#8B31FF] rounded-full animate-spin mx-auto mb-6"></div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Processando pagamento...</h1>
              <p className="text-gray-600">Aguarde enquanto buscamos sua licença.</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <main className="bg-[#0a0a0a] min-h-screen pt-20 pb-12">
          <div className="container mx-auto px-4 flex items-center justify-center min-h-[calc(100vh-8rem)]">
            <div className="bg-white rounded-xl shadow-2xl p-8 text-center max-w-md w-full border border-red-200">
              <div className="text-5xl mb-6">⚠️</div>
              <h1 className="text-2xl font-bold text-red-600 mb-4">Aguarde...</h1>
              <p className="text-gray-600 mb-6">{error}</p>
              <button 
                onClick={fetchLicense}
                className="bg-gradient-to-r from-[#8B31FF] to-[#31A8FF] text-white font-semibold py-3 px-6 rounded-lg hover:shadow-lg transition-all duration-300"
              >
                Tentar Novamente
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (license) {
    return (
      <>
        <Header />
        <main className="bg-[#0a0a0a] min-h-screen pt-20 pb-12">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              {/* Success Banner */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-8 mb-8 text-center">
                <div className="text-6xl mb-4">✅</div>
                <h1 className="text-4xl font-bold text-gray-800 mb-2">Pagamento Aprovado!</h1>
                <p className="text-gray-600 text-xl">Sua licença foi gerada com sucesso</p>
              </div>

              {/* License Card */}
              <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Sua Licença Premium</h2>
                
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="text-gray-500 text-sm font-medium mb-2">Tipo de Licença</div>
                    <div className="text-gray-800 text-xl font-bold capitalize">{license.license_type}</div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="text-gray-500 text-sm font-medium mb-2">Válida até</div>
                    <div className="text-gray-800 text-xl font-bold">
                      {new Date(license.expires_at).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="text-gray-500 text-sm font-medium mb-2">Dispositivos</div>
                    <div className="text-gray-800 text-xl font-bold">
                      Até {license.max_devices} dispositivo{license.max_devices > 1 ? 's' : ''}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="text-gray-500 text-sm font-medium mb-2">Status</div>
                    <div className="text-green-600 text-xl font-bold">✓ Ativa</div>
                  </div>
                </div>

                {/* License Key */}
                <div className="bg-gradient-to-r from-[#8B31FF]/5 to-[#31A8FF]/5 rounded-xl p-6 border border-[#8B31FF]/20">
                  <div className="text-gray-500 text-sm font-medium mb-3">Sua Chave de Licença</div>
                  <div className="flex gap-3 flex-wrap">
                    <input
                      type="text"
                      value={license.license_key}
                      readOnly
                      className="flex-1 min-w-[200px] bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-800 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#8B31FF]"
                    />
                    <button
                      onClick={copyLicenseKey}
                      className="bg-gradient-to-r from-[#8B31FF] to-[#31A8FF] text-white font-semibold px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 whitespace-nowrap"
                    >
                      Copiar
                    </button>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Instruções de Ativação</h3>
                <ul className="text-gray-600 space-y-2">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Baixe o Voltris Optimizer no site oficial</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Abra o programa e vá em "Ativar Licença"</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Cole sua chave de licença e clique em "Ativar"</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Pronto! Seu otimizador está liberado</span>
                  </li>
                </ul>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => window.close()}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-4 px-8 rounded-xl transition-all duration-300"
                >
                  Fechar
                </button>
                <a
                  href="/"
                  className="bg-gradient-to-r from-[#8B31FF] to-[#31A8FF] text-white font-semibold py-4 px-8 rounded-xl hover:shadow-lg transition-all duration-300 text-center"
                >
                  Voltar ao Site Principal
                </a>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="bg-[#0a0a0a] min-h-screen pt-20 pb-12">
        <div className="container mx-auto px-4 flex items-center justify-center min-h-[calc(100vh-8rem)]">
          <div className="bg-white rounded-xl shadow-2xl p-8 text-center max-w-md w-full border border-red-200">
            <div className="text-5xl mb-6">❌</div>
            <h1 className="text-2xl font-bold text-red-600 mb-2">Erro</h1>
            <p className="text-gray-600">Não foi possível processar sua solicitação.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function PaginaSucessoFinal() {
  return (
    <Suspense fallback={
      <>
        <Header />
        <main className="bg-[#0a0a0a] min-h-screen pt-20 pb-12">
          <div className="container mx-auto px-4 flex items-center justify-center min-h-[calc(100vh-8rem)]">
            <div className="bg-white rounded-xl shadow-2xl p-8 text-center max-w-md w-full">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-[#8B31FF] rounded-full animate-spin mx-auto mb-6"></div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Carregando...</h1>
              <p className="text-gray-600">Aguarde enquanto carregamos sua página.</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    }>
      <PaginaSucessoProfissional />
    </Suspense>
  );
}