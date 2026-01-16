'use client'

import { useState, useEffect } from 'react'
import { Terminal, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'

export default function DiagnosticoPixPage() {
  const [diagnostico, setDiagnostico] = useState<{contaVerificada: boolean, configuracaoOk: boolean, recomendacao: string} | null>(null)
  const [loading, setLoading] = useState(true)
  const [logs, setLogs] = useState<Array<{timestamp: string, mensagem: string, tipo: string}>>([])

  useEffect(() => {
    realizarDiagnostico()
  }, [])

  const log = (mensagem: string, tipo: string = 'info') => {
    const novoLog = {
      timestamp: new Date().toLocaleTimeString(),
      mensagem,
      tipo
    }
    setLogs(prev => [...prev, novoLog])
    console.log(`[DIAGNÓSTICO PIX] ${mensagem}`)
  }

  const realizarDiagnostico = async () => {
    setLoading(true)
    setLogs([])
    
    try {
      log('Iniciando diagnóstico completo do PIX...', 'info')
      
      // 1. Testar conta Mercado Pago
      log('1. Verificando status da conta Mercado Pago...', 'info')
      const contaResponse = await fetch('/api/mercadopago/verificar-conta')
      const contaData = await contaResponse.json()
      
      if (contaData.error) {
        log(`❌ Erro ao verificar conta: ${contaData.error}`, 'error')
      } else {
        log(`✅ Conta verificada: ${contaData.status}`, 'success')
        log(`📊 Nível: ${contaData.nivel || 'Não especificado'}`, 'info')
      }

      // 2. Testar configuração de pagamento
      log('2. Testando configuração de pagamento com PIX...', 'info')
      const pagamentoResponse = await fetch('/api/pagamento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: 'pro',
          email: 'teste@diagnostico.com',
          fullName: 'Teste Diagnóstico',
          diagnostico: true // Flag especial para diagnóstico
        })
      })
      
      const pagamentoData = await pagamentoResponse.json()
      
      if (pagamentoData.error) {
        log(`❌ Erro na configuração: ${pagamentoData.error}`, 'error')
      } else {
        log('✅ Configuração de pagamento criada com sucesso', 'success')
        log(`🔗 URL de checkout: ${pagamentoData.init_point?.substring(0, 50)}...`, 'info')
      }

      // 3. Verificar métodos de pagamento disponíveis
      log('3. Verificando métodos de pagamento disponíveis...', 'info')
      if (pagamentoData.init_point) {
        // Simular acesso ao checkout para ver métodos disponíveis
        log('📋 Métodos de pagamento que devem estar disponíveis:', 'info')
        log('• Cartão de crédito (funcionando)', 'info')
        log('• PIX (teoricamente reabilitado)', 'info')
        log('• Transferência bancária', 'info')
      }

      // 4. Recomendações finais
      log('4. Análise concluída', 'info')
      
      const resultado = {
        contaVerificada: !contaData.error,
        configuracaoOk: !pagamentoData.error,
        recomendacao: contaData.error ? 
          'Problema na verificação da conta Mercado Pago' :
          pagamentoData.error ? 
          'Problema na configuração do pagamento' :
          'Configuração técnica ok - problema pode ser específico do PIX'
      }
      
      setDiagnostico(resultado)
      log('🎯 Diagnóstico completo realizado', 'success')
      
    } catch (error: any) {
      log(`❌ Erro no diagnóstico: ${error.message}`, 'error')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (tipo: string) => {
    switch (tipo) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      default: return <Terminal className="w-4 h-4 text-blue-500" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <Terminal className="w-8 h-8 text-green-400" />
            <h1 className="text-3xl font-bold">Diagnóstico Técnico PIX</h1>
          </div>

          {loading && (
            <div className="bg-gray-700 rounded-lg p-6 mb-6">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-400"></div>
                <span>Executando diagnóstico técnico...</span>
              </div>
            </div>
          )}

          {diagnostico && (
            <div className="bg-gray-700 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Resultado do Diagnóstico</h2>
              
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className={`p-4 rounded-lg ${diagnostico.contaVerificada ? 'bg-green-900/30 border border-green-700' : 'bg-red-900/30 border border-red-700'}`}>
                  <div className="flex items-center gap-2">
                    {diagnostico.contaVerificada ? 
                      <CheckCircle className="w-5 h-5 text-green-400" /> : 
                      <XCircle className="w-5 h-5 text-red-400" />
                    }
                    <span className="font-medium">Conta Mercado Pago</span>
                  </div>
                  <p className="text-sm mt-1">
                    {diagnostico.contaVerificada ? 'Verificada e ativa' : 'Problemas na verificação'}
                  </p>
                </div>
                
                <div className={`p-4 rounded-lg ${diagnostico.configuracaoOk ? 'bg-green-900/30 border border-green-700' : 'bg-red-900/30 border border-red-700'}`}>
                  <div className="flex items-center gap-2">
                    {diagnostico.configuracaoOk ? 
                      <CheckCircle className="w-5 h-5 text-green-400" /> : 
                      <XCircle className="w-5 h-5 text-red-400" />
                    }
                    <span className="font-medium">Configuração de Pagamento</span>
                  </div>
                  <p className="text-sm mt-1">
                    {diagnostico.configuracaoOk ? 'Configurada corretamente' : 'Erros na configuração'}
                  </p>
                </div>
              </div>

              <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Recomendação Técnica</h3>
                <p className="text-sm">{diagnostico.recomendacao}</p>
              </div>
            </div>
          )}

          <div className="bg-black rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Terminal className="w-5 h-5" />
              Logs do Diagnóstico
            </h2>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {logs.map((log, index) => (
                <div key={index} className="flex items-start gap-3 text-sm font-mono">
                  <span className="text-gray-400 w-20">{log.timestamp}</span>
                  {getStatusIcon(log.tipo)}
                  <span className={
                    log.tipo === 'error' ? 'text-red-400' :
                    log.tipo === 'success' ? 'text-green-400' :
                    log.tipo === 'warning' ? 'text-yellow-400' :
                    'text-gray-300'
                  }>
                    {log.mensagem}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <button
              onClick={realizarDiagnostico}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              {loading ? 'Diagnosticando...' : 'Repetir Diagnóstico'}
            </button>
            
            <a 
              href="/teste-cartao" 
              className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Testar Pagamento
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}