"use client";
import { useState, useEffect } from 'react';
import { usePWANotifications } from '../hooks/usePWANotifications';
import { useAuth } from '../hooks/useAuth';

export default function PushNotificationSetup() {
  const { user } = useAuth();
  const {
    isSupported,
    permission,
    isSubscribed,
    subscription,
    loading,
    error,
    browserInfo,
    browserFingerprint,
    subscriptionId,
    deviceType,
    platform,
    requestPermission,
    subscribeToPushNotifications,
    unsubscribeFromPushNotifications,
    testNotification,
    refreshSubscription,
    clearError
  } = usePWANotifications();

  const [showAdvancedInfo, setShowAdvancedInfo] = useState(false);

  // Verificar se o usuário está autenticado
  if (!user) {
    return (
      <div className="bg-gradient-to-r from-[#1E1E1E]/80 to-[#2A2A2A]/80 rounded-xl border border-[#8B31FF]/20 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-[#31A8FF] to-[#8B31FF] rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white">Notificações Push para PWA</h2>
        </div>
        
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <p className="text-blue-400 font-medium">Faça login para ativar</p>
          <p className="text-gray-400 text-sm mt-2">Entre na sua conta para configurar as notificações PWA</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-[#1E1E1E]/80 to-[#2A2A2A]/80 rounded-xl border border-[#8B31FF]/20 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-r from-[#31A8FF] to-[#8B31FF] rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-white">Notificações Push para PWA</h2>
          <p className="text-gray-400 text-sm mt-1">
            Sistema profissional de notificações para {deviceType} ({platform})
          </p>
        </div>
        
        <button
          onClick={() => setShowAdvancedInfo(!showAdvancedInfo)}
          className="text-gray-400 hover:text-white transition-colors"
          title="Informações técnicas"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>

      {!isSupported ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-red-400 font-medium">Navegador não suportado</p>
          <p className="text-gray-400 text-sm mt-2">Seu navegador não suporta notificações push PWA</p>
          
          {showAdvancedInfo && (
            <div className="mt-4 p-4 bg-[#1A1A1A]/40 rounded-lg border border-[#8B31FF]/10">
              <h4 className="text-white font-medium mb-2">Detalhes técnicos:</h4>
              <div className="text-left text-xs text-gray-400 space-y-1">
                <p>• Service Worker: {typeof navigator.serviceWorker !== 'undefined' ? '✅' : '❌'}</p>
                <p>• Push Manager: {typeof PushManager !== 'undefined' ? '✅' : '❌'}</p>
                <p>• Notifications: {typeof Notification !== 'undefined' ? '✅' : '❌'}</p>
                <p>• HTTPS: {window.location.protocol === 'https:' ? '✅' : '❌'}</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Status da Permissão */}
          <div className="bg-[#1A1A1A]/60 rounded-lg p-4 border border-[#8B31FF]/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Status da permissão:</p>
                <div className="flex items-center gap-2 mt-1">
                  {permission === 'granted' ? (
                    <span className="text-green-400 font-medium flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Permitido
                    </span>
                  ) : permission === 'denied' ? (
                    <span className="text-red-400 font-medium flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      Negado
                    </span>
                  ) : (
                    <span className="text-yellow-400 font-medium flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      Não definido
                    </span>
                  )}
                </div>
              </div>
              
              {permission !== 'granted' && (
                <button
                  onClick={requestPermission}
                  disabled={loading}
                  className="bg-gradient-to-r from-[#31A8FF] to-[#8B31FF] hover:from-[#2A8FE6] hover:to-[#7A2AE6] text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Ativando...
                    </div>
                  ) : (
                    'Ativar Notificações'
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Status da Inscrição */}
          {permission === 'granted' && (
            <div className="bg-[#1A1A1A]/60 rounded-lg p-4 border border-[#8B31FF]/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">Inscrição push:</p>
                  <div className="flex items-center gap-2 mt-1">
                    {isSubscribed ? (
                      <span className="text-green-400 font-medium flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Ativa
                      </span>
                    ) : (
                      <span className="text-yellow-400 font-medium flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        Pendente
                      </span>
                    )}
                  </div>
                  
                  {isSubscribed && subscriptionId && (
                    <p className="text-xs text-gray-500 mt-1">ID: {subscriptionId.substring(0, 8)}...</p>
                  )}
                </div>
                
                <div className="flex gap-2">
                  {!isSubscribed && (
                    <button
                      onClick={subscribeToPushNotifications}
                      disabled={loading}
                      className="bg-gradient-to-r from-[#31A8FF] to-[#8B31FF] hover:from-[#2A8FE6] hover:to-[#7A2AE6] text-white px-3 py-2 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      {loading ? 'Ativando...' : 'Ativar'}
                    </button>
                  )}
                  
                  {isSubscribed && (
                    <button
                      onClick={unsubscribeFromPushNotifications}
                      disabled={loading}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 text-sm"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      Desativar
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Botão de Teste */}
          {isSubscribed && (
            <div className="text-center">
              <button
                onClick={testNotification}
                disabled={loading}
                className="bg-gradient-to-r from-[#FF4B6B] to-[#8B31FF] hover:from-[#E63A5A] hover:to-[#7A2AE6] text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Testar Notificação
              </button>
            </div>
          )}

          {/* Mensagem de Erro */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div className="flex-1">
                  <p className="text-red-400 text-sm">{error}</p>
                  <button
                    onClick={clearError}
                    className="text-red-300 hover:text-red-200 text-xs mt-2 underline"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Informações Avançadas */}
          {showAdvancedInfo && (
            <div className="bg-[#1A1A1A]/40 rounded-lg p-4 border border-[#8B31FF]/10">
              <h4 className="text-white font-medium mb-3">Informações técnicas:</h4>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
                <div>
                  <p className="text-gray-400">Dispositivo:</p>
                  <p className="font-medium">{deviceType}</p>
                </div>
                <div>
                  <p className="text-gray-400">Plataforma:</p>
                  <p className="font-medium">{platform}</p>
                </div>
                <div>
                  <p className="text-gray-400">Fingerprint:</p>
                  <p className="font-mono text-xs">{browserFingerprint?.substring(0, 12)}...</p>
                </div>
                <div>
                  <p className="text-gray-400">Status:</p>
                  <p className="font-medium">{isSubscribed ? 'Ativo' : 'Inativo'}</p>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-[#8B31FF]/20">
                <button
                  onClick={refreshSubscription}
                  disabled={loading}
                  className="text-[#31A8FF] hover:text-[#2A8FE6] text-sm underline disabled:opacity-50"
                >
                  Atualizar status
                </button>
              </div>
            </div>
          )}

          {/* Como Funciona */}
          <div className="bg-[#1A1A1A]/40 rounded-lg p-4 border border-[#8B31FF]/10">
            <h3 className="text-white font-medium mb-3">Como funciona:</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-[#31A8FF] rounded-full mt-2 flex-shrink-0"></span>
                Sistema inteligente que identifica seu navegador automaticamente
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-[#8B31FF] rounded-full mt-2 flex-shrink-0"></span>
                Funciona no PWA instalado no celular e no desktop
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-[#FF4B6B] rounded-full mt-2 flex-shrink-0"></span>
                Receba notificações para novos pedidos, tickets e atualizações
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-[#31A8FF] rounded-full mt-2 flex-shrink-0"></span>
                Clique na notificação para abrir o site diretamente
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-[#FFD700] rounded-full mt-2 flex-shrink-0"></span>
                Sistema profissional que reconhece navegadores já configurados
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
