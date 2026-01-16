'use client'

import { useState } from 'react'
import { Zap, AlertTriangle, CheckCircle } from 'lucide-react'

export default function TestePixForcadoPage() {
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [resultado, setResultado] = useState<{success: boolean, message: string, url?: string, error?: boolean} | null>(null)
  const [logs, setLogs] = useState<Array<{timestamp: string, mensagem: string, tipo: string}>>([])

  const log = (mensagem: string, tipo: string = 'info') => {
    const novoLog = {
      timestamp: new Date().toLocaleTimeString(),
      mensagem,
      tipo
    }
    setLogs(prev => [...prev, novoLog])
    console.log(`[PIX FORÇADO] ${mensagem}`)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !fullName) {
      log('Email e nome completo são obrigatórios', 'error')
      return
    }

    setLoading(true)
    setResultado(null)
    setLogs([])

    try {
      log('Iniciando teste PIX FORÇADO...', 'info')
      log(`Dados: ${email} - ${fullName}`, 'info')

      const response = await fetch('/api/pagamento/pix-forcado', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          fullName,
          valor: 1.00
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        log(`ERRO HTTP ${response.status}: ${data.error}`, 'error')
        log(`Detalhes: ${JSON.stringify(data.details)}`, 'error')
        throw new Error(data.error)
      }

      if (data.init_point) {
        log('✅ SUCESSO! Preferência PIX criada', 'success')
        log(`🔗 URL: ${data.init_point.substring(0, 60)}...`, 'success')
        
        setResultado({
          success: true,
          message: 'Checkout PIX FORÇADO criado com sucesso!',
          url: data.init_point
        })

        log('Redirecionando para checkout em 3 segundos...', 'info')
        setTimeout(() => {
          window.location.href = data.init_point
        }, 3000)
      } else {
        throw new Error('URL de pagamento não recebida')
      }

    } catch (err: any) {
      log(`❌ FALHA CRÍTICA: ${err.message}`, 'error')
      setResultado({
        success: false,
        message: err.message,
        error: true
      })
    } finally {
      setLoading(false)
    }
  }

  const getLogColor = (tipo: string) => {
    switch (tipo) {
      case 'success': return 'text-green-600'
      case 'error': return 'text-red-600'
      case 'warning': return 'text-yellow-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <Zap className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Teste PIX Forçado
            </h1>
            <p className="text-gray-600">
              Abordagem máxima para forçar aceitação do PIX
            </p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-red-800 mb-2">⚠️ Estratégia de Força:</h3>
            <ul className="text-sm text-red-700 space-y-1">
              <li>• Mínimo de exclusões de métodos de pagamento</li>
              <li>• Máximo de métodos disponíveis (incluindo PIX)</li>
              <li>• Configuração otimizada para PIX</li>
              <li>• Se falhar, capturaremos o erro exato para análise</li>
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
                  Você será redirecionado automaticamente. Prepare-se para clicar em "Criar PIX".
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Nome Sobrenome"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Forçando PIX...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  FORÇAR PAGAMENTO PIX (R$ 1,00)
                </>
              )}
            </button>
          </form>

          {/* Logs em tempo real */}
          {logs.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-3">Logs Técnicos:</h3>
              <div className="bg-gray-900 rounded-lg p-4 text-sm font-mono max-h-60 overflow-y-auto">
                {logs.map((log, index) => (
                  <div key={index} className={`mb-1 ${getLogColor(log.tipo)}`}>
                    <span className="text-gray-400">[{log.timestamp}]</span> {log.mensagem}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>🎯 Objetivo: Identificar exatamente onde ocorre a rejeição do PIX</p>
          </div>
        </div>
      </div>
    </div>
  )
}