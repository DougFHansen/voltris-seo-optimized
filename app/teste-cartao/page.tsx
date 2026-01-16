'use client'

import { useState } from 'react'
import { CreditCard, Shield, Check } from 'lucide-react'

export default function TesteCartaoPage() {
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !fullName) {
      setError('Email e nome completo são obrigatórios')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      console.log('[TESTE CARTÃO] Iniciando pagamento com cartão...')
      
      const response = await fetch('/api/pagamento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: 'pro',
          email,
          fullName,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar pagamento')
      }

      if (data.init_point) {
        console.log('[TESTE CARTÃO] Redirecionando para checkout...')
        window.location.href = data.init_point
      } else {
        throw new Error('URL de pagamento não recebida')
      }
    } catch (err: any) {
      console.error('[TESTE CARTÃO] Erro:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CreditCard className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Teste de Pagamento com Cartão
            </h1>
            <p className="text-gray-600">
              Teste o sistema de pagamento usando cartão de crédito
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-800 mb-2">ℹ️ Informações Importantes:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• PIX temporariamente limitado devido a políticas de segurança do Mercado Pago</li>
              <li>• Cartão de crédito está 100% funcional</li>
              <li>• Valor do teste: R$ 1,00</li>
              <li>• <a href="/pix-limitacao" className="text-blue-600 hover:underline">Saiba mais sobre a limitação do PIX</a></li>
            </ul>
          </div>

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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Processando...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  Pagar com Cartão de Crédito (R$ 1,00)
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-3">Dados para Teste:</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Cartão de Teste:</strong>
              </p>
              <p className="font-mono text-sm">5031 4332 1540 6351</p>
              <p className="text-sm text-gray-600 mt-2">
                <strong>CVV:</strong> 123 | <strong>Vencimento:</strong> 12/25 | <strong>Nome:</strong> APRO
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}