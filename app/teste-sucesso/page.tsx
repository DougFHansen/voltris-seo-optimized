'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

function TesteSucessoContent() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useState<Record<string, string>>({});
  
  useEffect(() => {
    // Capturar todos os parâmetros
    const paramObj: Record<string, string> = {};
    for (const [key, value] of searchParams.entries()) {
      paramObj[key] = value;
    }
    setParams(paramObj);
    setLoading(false);
    
    console.log('[TESTE SUCESSO] Parâmetros recebidos:', paramObj);
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-2xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          🧪 Página de Teste de Sucesso
        </h1>
        
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">📊 Parâmetros Recebidos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(params).map(([key, value]) => (
              <div key={key} className="bg-white rounded-lg p-3 border border-gray-200">
                <span className="font-medium text-gray-700">{key}:</span>
                <span className="ml-2 text-gray-900 font-mono break-all">{value}</span>
              </div>
            ))}
          </div>
          {Object.keys(params).length === 0 && (
            <p className="text-gray-600 italic">Nenhum parâmetro recebido</p>
          )}
        </div>
        
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-green-900 mb-4">✅ Status</h2>
          <p className="text-green-800">
            <strong>Página carregada com sucesso!</strong> Esta é uma página de teste para verificar 
            se os parâmetros estão sendo passados corretamente.
          </p>
        </div>
        
        <div className="mt-8 text-center">
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors mr-4"
          >
            Recarregar Página
          </button>
          <button 
            onClick={() => window.history.back()}
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TesteSucessoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-2xl">Carregando...</div>
      </div>
    }>
      <TesteSucessoContent />
    </Suspense>
  );
}