'use client'

import { useState } from 'react'
import { QrCode, CreditCard, AlertTriangle, CheckCircle } from 'lucide-react'

export default function TestePixEspecificoPage() {
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [resultado, setResultado] = useState<{success: boolean, message: string, url?: string, error?: boolean} | null>(null)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !fullName) {
      setError('Email e nome completo são obrigatórios')
      return
    }

    setLoading(true)
    setError('')
    setResultado(null)

    try {
      console.log('[TESTE PIX ESPECÍFICO] Iniciando pagamento PIX...')

      // Forçar configuração específica para PIX
      const response = await fetch('/api/pagamento/pix-especifico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          fullName,
          metodo: 'pix', // Flag específica para PIX
          valor: 1.00
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar pagamento PIX')
      }

      if (data.init_point) {
        console.log('[TESTE PIX ESPECÍFICO] Redirecionando para checkout PIX...')
        setResultado({
          success: true,
          message: 'Checkout PIX criado com sucesso!',
          url: data.init_point
        })
        // Redirecionar após breve delay para mostrar resultado
        setTimeout(() => {
          window.location.href = data.init_point
        }, 2000)
      } else {
        throw new Error('URL de pagamento PIX não recebida')
      }
    } catch (err: any) {
      console.error('[TESTE PIX ESPECÍFICO] Erro:', err)
      setResultado({
        success: false,
        message: err.message,
        error: true
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
              <QrCode className="w-8 h-8 text-purple-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Teste Específico PIX
            </h1>
            <p className="text-gray-600">
              Teste direto do método PIX após diagnóstico positivo
            </p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-purple-800 mb-2">ℹ️ Contexto Técnico:</h3>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>• Diagnóstico confirmou: conta verificada ✅</li>
              <li>• Configuração técnica ok ✅</li>
              <li>• PIX reabilitado no sistema ✅</li>
              <li>• Teste específico para identificar ponto exato da rejeição</li>
            </ul>
          </div>

          {resultado && (
            <div className={`rounded-lg p-4 mb-6 ${
              resultado.success 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-center gap-2">
                {resultado.success ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                )}
                <span className={`font-medium ${
                  resultado.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  {resultado.message}
                </span>
              </div>
              
              {resultado.success && (
                <p className="text-sm text-green-700 mt-2">
                  Você será redirecionado automaticamente para o checkout do Mercado Pago.
                </p>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                Nome Completo *
              </label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Nome Sobrenome"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Processando PIX...
                </>
              ) : (
                <>
                  <QrCode className="w-5 h-5" />
                  Testar Pagamento PIX (R$ 1,00)
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-3">Observações Técnicas:</h3>
            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
              <p className="mb-2">
                <strong>Objetivo:</strong> Identificar exatamente onde ocorre a rejeição do PIX
              </p>
              <p className="mb-2">
                <strong>Metodologia:</strong> Forçar configuração específica para PIX no backend
              </p>
              <p>
                <strong>Expected:</strong> Se rejeitado, capturar mensagem exata de erro para análise
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}