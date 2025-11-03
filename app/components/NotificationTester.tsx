"use client";
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function NotificationTester() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testNotification = async (type: 'test' | 'ticket' | 'order' | 'system') => {
    if (!user) {
      setError('Usuário não autenticado');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const notificationData = {
        title: '',
        body: '',
        type: type as 'ticket' | 'order' | 'system',
        userId: user.id,
        requireInteraction: true
      };

      switch (type) {
        case 'test':
          notificationData.title = 'VOLTRIS - Teste de Notificação';
          notificationData.body = 'Esta é uma notificação de teste! Seu sistema PWA está funcionando perfeitamente! 🎉';
          break;
        case 'ticket':
          notificationData.title = 'VOLTRIS - Novo Ticket';
          notificationData.body = 'Você recebeu um novo ticket de suporte. Clique para visualizar os detalhes.';
          break;
        case 'order':
          notificationData.title = 'VOLTRIS - Pedido Atualizado';
          notificationData.body = 'Seu pedido foi atualizado. Verifique o status na área do cliente.';
          break;
        case 'system':
          notificationData.title = 'VOLTRIS - Manutenção';
          notificationData.body = 'Sistema será atualizado em breve. Agradecemos sua compreensão.';
          break;
      }

      const response = await fetch('/api/send-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificationData),
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setResult(data);
      
      if (data.success) {
        console.log('✅ Notificação enviada com sucesso:', data);
      } else {
        setError(data.message || 'Erro desconhecido');
      }
    } catch (err) {
      console.error('❌ Erro ao enviar notificação:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const getNotificationStats = async () => {
    if (!user) {
      setError('Usuário não autenticado');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`/api/send-notification?userId=${user.id}`);
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setResult(data);
      
      if (data.success) {
        console.log('📊 Estatísticas obtidas:', data);
      } else {
        setError(data.message || 'Erro desconhecido');
      }
    } catch (err) {
      console.error('❌ Erro ao buscar estatísticas:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-[#1E1E1E]/80 to-[#2A2A2A]/80 rounded-xl border border-[#8B31FF]/20 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-r from-[#FF4B6B] to-[#8B31FF] rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-white">Testador de Notificações PWA</h2>
      </div>

      <div className="space-y-4">
        <p className="text-gray-300 text-sm">
          Teste o sistema de notificações push enviando diferentes tipos de notificações para seu dispositivo.
        </p>

        {/* Botões de Teste */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => testNotification('test')}
            disabled={loading}
            className="bg-gradient-to-r from-[#31A8FF] to-[#8B31FF] hover:from-[#2A8FE6] hover:to-[#7A2AE6] text-white px-4 py-3 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🧪 Teste Geral
          </button>
          
          <button
            onClick={() => testNotification('ticket')}
            disabled={loading}
            className="bg-gradient-to-r from-[#FF4B6B] to-[#8B31FF] hover:from-[#E63A5A] hover:to-[#7A2AE6] text-white px-4 py-3 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🎫 Simular Ticket
          </button>
          
          <button
            onClick={() => testNotification('order')}
            disabled={loading}
            className="bg-gradient-to-r from-[#FFD700] to-[#8B31FF] hover:from-[#E6C200] hover:to-[#7A2AE6] text-white px-4 py-3 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            📦 Simular Pedido
          </button>
          
          <button
            onClick={() => testNotification('system')}
            disabled={loading}
            className="bg-gradient-to-r from-[#00D4AA] to-[#8B31FF] hover:from-[#00B894] hover:to-[#7A2AE6] text-white px-4 py-3 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ⚙️ Simular Sistema
          </button>
        </div>

        {/* Botão de Estatísticas */}
        <div className="text-center">
          <button
            onClick={getNotificationStats}
            disabled={loading}
            className="bg-gradient-to-r from-[#8B31FF] to-[#FF4B6B] hover:from-[#7A2AE6] hover:to-[#E63A5A] text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            📊 Ver Estatísticas
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-4">
            <div className="w-8 h-8 border-4 border-[#8B31FF] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-400 text-sm mt-2">Processando...</p>
          </div>
        )}

        {/* Resultado */}
        {result && (
          <div className="bg-[#1A1A1A]/60 rounded-lg p-4 border border-[#8B31FF]/20">
            <h4 className="text-white font-medium mb-3">Resultado:</h4>
            <div className="bg-[#0A0A0A]/60 rounded p-3 font-mono text-sm text-gray-300 overflow-x-auto">
              <pre>{JSON.stringify(result, null, 2)}</pre>
            </div>
          </div>
        )}

        {/* Erro */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <p className="text-red-400 text-sm font-medium">Erro:</p>
                <p className="text-red-300 text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Informações */}
        <div className="bg-[#1A1A1A]/40 rounded-lg p-4 border border-[#8B31FF]/10">
          <h4 className="text-white font-medium mb-2">Como usar:</h4>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• <strong>Teste Geral:</strong> Envia uma notificação de teste básica</li>
            <li>• <strong>Simular Ticket:</strong> Simula uma notificação de novo ticket</li>
            <li>• <strong>Simular Pedido:</strong> Simula uma notificação de atualização de pedido</li>
            <li>• <strong>Simular Sistema:</strong> Simula uma notificação de manutenção</li>
            <li>• <strong>Ver Estatísticas:</strong> Mostra estatísticas das suas inscrições push</li>
          </ul>
          
          <div className="mt-3 pt-3 border-t border-[#8B31FF]/20">
            <p className="text-xs text-gray-400">
              💡 <strong>Dica:</strong> As notificações só funcionarão se você tiver ativado as notificações push PWA 
              e estiver usando um navegador compatível.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
