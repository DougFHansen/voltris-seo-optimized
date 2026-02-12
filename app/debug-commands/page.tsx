'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function DebugCommandsPage() {
    const [installations, setInstallations] = useState<any[]>([]);
    const [commands, setCommands] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [testResult, setTestResult] = useState<string>('');
    
    const supabase = createClient();
    const APP_MACHINE_ID = '612f0f8d-8780-42f9-8daf-3bdffe299bc6'; // Do log do app

    useEffect(() => {
        loadData();
        const interval = setInterval(loadData, 5000); // Atualizar a cada 5 segundos
        return () => clearInterval(interval);
    }, []);

    const loadData = async () => {
        try {
            // Buscar instalações
            const { data: user } = await supabase.auth.getUser();
            if (user.user) {
                const { data: installs } = await supabase
                    .from('installations')
                    .select('*')
                    .eq('user_id', user.user.id);
                setInstallations(installs || []);
            }

            // Buscar comandos recentes
            const { data: cmds } = await supabase
                .from('device_commands')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(10);
            setCommands(cmds || []);
            
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const testCommand = async (installationId: string, commandType: string) => {
        setTestResult('Enviando...');
        try {
            const response = await fetch('/api/v1/commands/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    installation_id: installationId,
                    command_type: commandType
                })
            });
            
            const data = await response.json();
            setTestResult(`✅ Sucesso! Command ID: ${data.command?.id}\nAguarde até 30 segundos para o app executar.`);
            loadData();
        } catch (err: any) {
            setTestResult(`❌ Erro: ${err.message}`);
        }
    };

    if (loading) return <div className="p-8 text-white">Carregando...</div>;

    return (
        <div className="min-h-screen bg-[#0A0A0F] p-8 text-white">
            <h1 className="text-3xl font-bold mb-8">🔍 Debug - Comandos Remotos</h1>
            
            {/* Machine ID do App */}
            <div className="bg-[#121218] border border-white/10 rounded-xl p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">📱 Machine ID do App (dos logs)</h2>
                <code className="bg-black/50 px-4 py-2 rounded text-green-400 block">
                    {APP_MACHINE_ID}
                </code>
            </div>

            {/* Instalações */}
            <div className="bg-[#121218] border border-white/10 rounded-xl p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">💻 Instalações no Banco</h2>
                {installations.length === 0 ? (
                    <p className="text-slate-400">Nenhuma instalação encontrada</p>
                ) : (
                    <div className="space-y-4">
                        {installations.map(inst => (
                            <div key={inst.id} className="bg-black/30 p-4 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <div>
                                        <p className="font-bold">{inst.os_name}</p>
                                        <code className={`text-xs ${inst.id === APP_MACHINE_ID ? 'text-green-400' : 'text-slate-400'}`}>
                                            {inst.id}
                                        </code>
                                        {inst.id === APP_MACHINE_ID && (
                                            <span className="ml-2 text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                                                ✓ MATCH!
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => testCommand(inst.id, 'OPTIMIZE_RAM')}
                                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded text-sm font-bold"
                                        >
                                            Test OPTIMIZE
                                        </button>
                                        <button
                                            onClick={() => testCommand(inst.id, 'CLEAN_SYSTEM')}
                                            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded text-sm font-bold"
                                        >
                                            Test CLEAN
                                        </button>
                                    </div>
                                </div>
                                <div className="text-xs text-slate-400 mt-2">
                                    <p>CPU: {inst.cpu_name}</p>
                                    <p>RAM: {inst.ram_gb_total}GB</p>
                                    <p>Last Heartbeat: {new Date(inst.last_heartbeat).toLocaleString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Resultado do Teste */}
            {testResult && (
                <div className="bg-[#121218] border border-white/10 rounded-xl p-6 mb-6">
                    <h2 className="text-xl font-bold mb-4">📊 Resultado do Teste</h2>
                    <pre className="bg-black/50 p-4 rounded text-sm whitespace-pre-wrap">
                        {testResult}
                    </pre>
                </div>
            )}

            {/* Comandos Recentes */}
            <div className="bg-[#121218] border border-white/10 rounded-xl p-6">
                <h2 className="text-xl font-bold mb-4">📋 Últimos 10 Comandos</h2>
                {commands.length === 0 ? (
                    <p className="text-slate-400">Nenhum comando encontrado</p>
                ) : (
                    <div className="space-y-2">
                        {commands.map(cmd => (
                            <div key={cmd.id} className="bg-black/30 p-3 rounded text-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className={`font-bold ${
                                            cmd.status === 'completed' ? 'text-green-400' :
                                            cmd.status === 'failed' ? 'text-red-400' :
                                            'text-yellow-400'
                                        }`}>
                                            {cmd.command_type}
                                        </span>
                                        <span className="ml-2 text-slate-400">
                                            {cmd.status}
                                        </span>
                                    </div>
                                    <span className="text-xs text-slate-500">
                                        {new Date(cmd.created_at).toLocaleString()}
                                    </span>
                                </div>
                                <code className="text-xs text-slate-500 block mt-1">
                                    {cmd.installation_id}
                                </code>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Instruções */}
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 mt-6">
                <h2 className="text-xl font-bold mb-4 text-yellow-400">⚠️ Como Testar</h2>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li>Verifique se o Machine ID do app (verde acima) corresponde a alguma instalação</li>
                    <li>Se não corresponder, o app não está vinculado corretamente</li>
                    <li>Clique em "Test OPTIMIZE" ou "Test CLEAN" na instalação correta</li>
                    <li>Aguarde até 30 segundos (intervalo de polling)</li>
                    <li>Verifique os logs do app para ver a execução</li>
                    <li>Atualize esta página para ver o status do comando mudar para "completed"</li>
                </ol>
            </div>
        </div>
    );
}
