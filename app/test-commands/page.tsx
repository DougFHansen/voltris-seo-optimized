'use client';

import { useState } from 'react';

export default function TestCommandsPage() {
    const [installationId, setInstallationId] = useState('');
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const testCreateCommand = async (commandType: string) => {
        setLoading(true);
        setResult(null);
        
        try {
            console.log('Criando comando:', commandType, 'para installation_id:', installationId);
            
            const response = await fetch('/api/v1/commands/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    installation_id: installationId,
                    command_type: commandType
                })
            });
            
            const data = await response.json();
            console.log('Resposta:', data);
            
            setResult({
                status: response.status,
                data: data
            });
        } catch (error: any) {
            console.error('Erro:', error);
            setResult({
                error: error.message
            });
        } finally {
            setLoading(false);
        }
    };

    const testPendingCommands = async () => {
        setLoading(true);
        setResult(null);
        
        try {
            console.log('Buscando comandos pendentes para machine_id:', installationId);
            
            const response = await fetch(`/api/v1/commands/pending?machine_id=${installationId}`);
            const data = await response.json();
            console.log('Resposta:', data);
            
            setResult({
                status: response.status,
                data: data
            });
        } catch (error: any) {
            console.error('Erro:', error);
            setResult({
                error: error.message
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050510] text-white p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">🧪 Teste de Comandos Remotos</h1>
                
                <div className="bg-[#121218] border border-white/10 rounded-xl p-6 mb-6">
                    <label className="block text-sm font-medium mb-2">Installation ID:</label>
                    <input
                        type="text"
                        value={installationId}
                        onChange={(e) => setInstallationId(e.target.value)}
                        placeholder="Digite o installation_id (GUID)"
                        className="w-full px-4 py-2 bg-[#0A0A0F] border border-white/10 rounded-lg text-white"
                    />
                    <p className="text-xs text-slate-500 mt-2">
                        Você pode encontrar o installation_id no aplicativo em Configurações → Conta
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <button
                        onClick={() => testCreateCommand('OPTIMIZE_RAM')}
                        disabled={!installationId || loading}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg font-bold transition-colors"
                    >
                        ⚡ Criar OPTIMIZE_RAM
                    </button>
                    
                    <button
                        onClick={() => testCreateCommand('CLEAN_SYSTEM')}
                        disabled={!installationId || loading}
                        className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded-lg font-bold transition-colors"
                    >
                        🧹 Criar CLEAN_SYSTEM
                    </button>
                    
                    <button
                        onClick={testPendingCommands}
                        disabled={!installationId || loading}
                        className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 rounded-lg font-bold transition-colors"
                    >
                        📋 Buscar Pendentes
                    </button>
                </div>

                {loading && (
                    <div className="bg-[#121218] border border-white/10 rounded-xl p-6">
                        <p className="text-center">Carregando...</p>
                    </div>
                )}

                {result && !loading && (
                    <div className="bg-[#121218] border border-white/10 rounded-xl p-6">
                        <h2 className="text-xl font-bold mb-4">Resultado:</h2>
                        <pre className="bg-[#0A0A0F] p-4 rounded-lg overflow-auto text-sm">
                            {JSON.stringify(result, null, 2)}
                        </pre>
                    </div>
                )}

                <div className="mt-8 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
                    <h3 className="text-yellow-500 font-bold mb-2">📝 Como usar:</h3>
                    <ol className="list-decimal list-inside space-y-2 text-sm">
                        <li>Abra o aplicativo Voltris Optimizer</li>
                        <li>Vá em Configurações → Conta</li>
                        <li>Copie o Installation ID</li>
                        <li>Cole aqui e teste os comandos</li>
                        <li>Verifique os logs do console (F12) para mais detalhes</li>
                    </ol>
                </div>
            </div>
        </div>
    );
}
