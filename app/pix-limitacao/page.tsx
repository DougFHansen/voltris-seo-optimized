'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, CreditCard, Shield, Info } from 'lucide-react'

export default function PixLimitationPage() {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Limitação Temporária no PIX
            </h1>
            <p className="text-gray-600">
              Informações importantes sobre pagamento via PIX
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-yellow-800 mb-2">Aviso Importante</h3>
                <p className="text-yellow-700 text-sm">
                  Estamos realizando testes técnicos para reabilitar o PIX. Para sua conta verificada, o PIX deve funcionar normalmente.
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <CreditCard className="w-6 h-6 text-green-600" />
                <h3 className="font-semibold text-green-800">Método Disponível</h3>
              </div>
              <p className="text-green-700 text-sm">
                <strong>Cartão de Crédito</strong> está funcionando normalmente para todos os pagamentos.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="w-6 h-6 text-blue-600" />
                <h3 className="font-semibold text-blue-800">Segurança</h3>
              </div>
              <p className="text-blue-700 text-sm">
                Todos os pagamentos são processados com segurança pelo Mercado Pago.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <button 
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center gap-2 text-gray-700 font-medium hover:text-gray-900 transition-colors"
            >
              <Info className="w-5 h-5" />
              {showDetails ? 'Ocultar' : 'Ver'} detalhes técnicos
            </button>
            
            {showDetails && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-2">Motivo técnico:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Política de segurança do Mercado Pago para transações PIX guest</li>
                  <li>• Requerimentos de verificação de conta mais rigorosos</li>
                  <li>• Restrições para contas com histórico limitado</li>
                  <li>• Medidas anti-fraude que afetam pagamentos diretos</li>
                </ul>
                
                <h4 className="font-semibold text-gray-800 mt-4 mb-2">Soluções alternativas:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Utilize cartão de crédito (funciona 100%)</li>
                  <li>• Faça login na sua conta Mercado Pago</li>
                  <li>• Utilize saldo em conta Mercado Pago</li>
                  <li>• Aguarde liberação automática (tempo indeterminado)</li>
                </ul>
              </div>
            )}
          </div>

          <div className="text-center">
            <a 
              href="/teste-cartao"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              <CreditCard className="w-5 h-5" />
              Prosseguir com Cartão de Crédito
            </a>
            
            <p className="text-sm text-gray-500 mt-4">
              Valor do teste: R$ 1,00 • Pagamento seguro pelo Mercado Pago
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}