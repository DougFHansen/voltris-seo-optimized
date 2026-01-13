'use client';

import { useState } from 'react';

export default function SimulacaoPagamentoPage() {
  const [formData, setFormData] = useState({
    plan: 'pro',
    email: 'teste@voltris.com.br',
    fullName: 'Usuário Teste Desenvolvimento',
    simulateApproved: true
  });
  
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('[SIMULAÇÃO] Form submit iniciado');
    
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      console.log('[SIMULAÇÃO] Dados do formulário:', formData);
      
      const response = await fetch('/api/pagamento/simular-pagamento', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          plan: formData.plan,
          email: formData.email,
          fullName: formData.fullName,
          simulateApproved: formData.simulateApproved
        })
      });
      
      console.log('[SIMULAÇÃO] Status da resposta:', response.status);
      
      const data = await response.json();
      console.log('[SIMULAÇÃO] Dados recebidos:', data);
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}: Erro na simulação`);
      }
      
      setResult(data);
      console.log('[SIMULAÇÃO] Simulação concluída com sucesso');
      
    } catch (err: any) {
      console.error('[SIMULAÇÃO] Erro capturado:', err);
      setError(err.message || 'Erro desconhecido na simulação');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    
    const newValue = type === 'checkbox' ? target.checked : value;
    
    console.log(`[FORM] Campo ${name} alterado para:`, newValue);
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              🧪 Simulador de Pagamento
            </h1>
            <p className="text-xl text-gray-600">
              Teste o fluxo completo de pagamento e geração de licença<br/>
              <span className="text-red-500 font-semibold">SEM CARTÕES REAIS OU DE TESTE</span>
            </p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Plano */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plano *
                </label>
                <select
                  name="plan"
                  value={formData.plan}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="trial">Trial (7 dias)</option>
                  <option value="standard">Standard (1 ano)</option>
                  <option value="pro">Pro (1 ano)</option>
                  <option value="enterprise">Enterprise (Vitalício)</option>
                </select>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="seu@email.com"
                />
                <p className="mt-1 text-xs text-gray-500">Digite um email válido com @</p>
              </div>

              {/* Nome Completo */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo
                </label>
                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Seu Nome Completo"
                />
              </div>

              {/* Status do Pagamento */}
              <div className="flex items-start pt-6">
                <div className="flex items-center h-5">
                  <input
                    id="simulateApproved"
                    type="checkbox"
                    name="simulateApproved"
                    checked={formData.simulateApproved}
                    onChange={handleChange}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="simulateApproved" className="font-medium text-gray-700">
                    Simular pagamento <span className="font-semibold text-green-600">APROVADO</span>
                  </label>
                  <p className="text-gray-500">Se desmarcado, simula pagamento pendente</p>
                </div>
              </div>
            </div>

            {/* Botão Submit */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`
                  w-full py-4 rounded-lg font-bold text-lg transition-all duration-300 shadow-lg
                  ${loading 
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transform hover:scale-105 active:scale-95'
                  }
                `}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Simulando...
                  </div>
                ) : '🚀 Iniciar Simulação'}
              </button>
            </div>
          </form>

          {/* Erro */}
          {error && (
            <div className="mt-6 bg-red-50 border-2 border-red-200 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <div className="text-2xl text-red-500">❌</div>
                <div>
                  <h3 className="font-bold text-red-900 mb-2">Erro na Simulação</h3>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Resultado */}
        {result && (
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              🎉 Resultado da Simulação
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Dados do Pagamento */}
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-green-900 mb-4">💳 Pagamento</h3>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-green-700">ID:</span>
                    <code className="ml-2 bg-white px-2 py-1 rounded text-sm">
                      {result.payment.id}
                    </code>
                  </div>
                  <div>
                    <span className="font-medium text-green-700">Preferência:</span>
                    <code className="ml-2 bg-white px-2 py-1 rounded text-sm">
                      {result.payment.preference_id}
                    </code>
                  </div>
                  <div>
                    <span className="font-medium text-green-700">Email:</span>
                    <span className="ml-2 text-green-800">{result.payment.email}</span>
                  </div>
                  <div>
                    <span className="font-medium text-green-700">Plano:</span>
                    <span className="ml-2 text-green-800 capitalize">{result.payment.license_type}</span>
                  </div>
                  <div>
                    <span className="font-medium text-green-700">Valor:</span>
                    <span className="ml-2 text-green-800">R$ {result.payment.amount.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="font-medium text-green-700">Status:</span>
                    <span className={`ml-2 font-bold ${
                      result.payment.status === 'approved' 
                        ? 'text-green-600' 
                        : 'text-yellow-600'
                    }`}>
                      {result.payment.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dados da Licença (se gerada) */}
              {result.license ? (
                <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-purple-900 mb-4">🔑 Licença Gerada</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium text-purple-700">Chave:</span>
                      <div className="mt-1">
                        <input
                          type="text"
                          value={result.license.license_key}
                          readOnly
                          className="w-full bg-white border-2 border-purple-300 rounded-lg px-3 py-2 font-mono text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-purple-700">Tipo:</span>
                      <span className="ml-2 text-purple-800 capitalize">{result.license.license_type}</span>
                    </div>
                    <div>
                      <span className="font-medium text-purple-700">Dispositivos:</span>
                      <span className="ml-2 text-purple-800">Até {result.license.max_devices}</span>
                    </div>
                    <div>
                      <span className="font-medium text-purple-700">Expira em:</span>
                      <span className="ml-2 text-purple-800">
                        {new Date(result.license.expires_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-purple-700">Status:</span>
                      <span className="ml-2 font-bold text-green-600">
                        {result.license.is_active ? 'ATIVA' : 'INATIVA'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-yellow-900 mb-4">⏳ Licença Pendente</h3>
                  <p className="text-yellow-800">
                    Pagamento simulado como PENDING. A licença será gerada quando o pagamento for aprovado.
                  </p>
                </div>
              )}
            </div>

            {/* Links úteis */}
            <div className="mt-8 bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-blue-900 mb-4">🔗 Links para Teste</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-blue-700 mb-2">Página de Sucesso (com licença):</p>
                  <a 
                    href={result.urls.success}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    Abrir Página de Sucesso
                  </a>
                </div>
                <div>
                  <p className="text-sm text-blue-700 mb-2">Verificar Licença via API:</p>
                  <a 
                    href={result.urls.check_license}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    Verificar Licença
                  </a>
                </div>
              </div>
            </div>

            {/* Mensagem final */}
            <div className="mt-6 text-center">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-300 rounded-full px-6 py-3">
                <div className="text-2xl">✅</div>
                <div className="text-green-800 font-semibold">
                  {result.message}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Instruções */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            📖 Como Usar este Simulador
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">🎯 Teste Rápido (Recomendado)</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>Preencha os dados (plano, email)</li>
                <li>Marque "Simular pagamento APROVADO"</li>
                <li>Clique em "Iniciar Simulação"</li>
                <li>Clique em "Abrir Página de Sucesso"</li>
                <li>Veja a licença gerada imediatamente!</li>
              </ol>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">🔄 Teste Completo</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>Desmarque "Simular pagamento APROVADO"</li>
                <li>Inicie a simulação</li>
                <li>Vá para a página de sucesso</li>
                <li>Veja o sistema de retry funcionando</li>
                <li>Atualize a página para ver a licença</li>
              </ol>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="text-2xl">⚠️</div>
              <div>
                <h3 className="font-bold text-yellow-900 mb-2">Importante</h3>
                <ul className="list-disc list-inside text-yellow-800 space-y-1 text-sm">
                  <li>Esta ferramenta é <span className="font-semibold">exclusiva para desenvolvimento</span></li>
                  <li>Nenhum pagamento real é processado</li>
                  <li>Dados são armazenados no banco como simulações</li>
                  <li>Perfeito para testar fluxos sem cartões</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}