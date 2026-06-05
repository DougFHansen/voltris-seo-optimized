'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Loader2 } from 'lucide-react';

const INSTALLATION_ID = 'DC045D24-F4A2-4B77-8046-0A7CD04A2B0C';

export default function DebugPage() {
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    const addResult = (title: string, content: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
        setResults(prev => [...prev, { title, content, type }]);
    };

    const runAllTests = async () => {
        setResults([]);
        setLoading(true);

        try {
            // Teste 1: Endpoint de Debug
            addResult('1️⃣ Teste: Endpoint de Debug', 'Executando...', 'info');
            try {
                const response = await fetch(`/api/v1/install/debug?installation_id=${INSTALLATION_ID}`);
                const data = await response.json();

                if (data.installation) {
                    addResult('1️⃣ Teste: Endpoint de Debug',
                        `✅ Instalação encontrada no banco!\n\nID: ${data.installation.id}\nUser ID: ${data.installation.user_id || '❌ NULL'}\nApp Version: ${data.installation.app_version || 'N/A'}\nCPU: ${data.installation.cpu_name || 'N/A'}\nOS: ${data.installation.os_name || 'N/A'}\nLast Heartbeat: ${data.installation.last_heartbeat || 'N/A'}\nUpdated At: ${data.installation.updated_at || 'N/A'}`,
                        'success');
                } else {
                    addResult('1️⃣ Teste: Endpoint de Debug',
                        `❌ Instalação NÃO encontrada no banco!\n\nErro: ${data.error || 'Registro não existe'}`,
                        'error');
                }
            } catch (err: any) {
                addResult('1️⃣ Teste: Endpoint de Debug',
                    `❌ Erro ao chamar endpoint: ${err.message}`,
                    'error');
            }

            // Teste 2: Verificar Sessão
            addResult('2️⃣ Teste: Sessão do Usuário', 'Executando...', 'info');
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();

            if (session) {
                addResult('2️⃣ Teste: Sessão do Usuário',
                    `✅ Usuário autenticado!\n\nUser ID: ${session.user.id}\nEmail: ${session.user.email}\nProvider: ${session.user.app_metadata?.provider || 'N/A'}`,
                    'success');
            } else {
                addResult('2️⃣ Teste: Sessão do Usuário',
                    `❌ Usuário NÃO autenticado!\n\nErro: ${sessionError?.message || 'Sem sessão ativa'}`,
                    'error');
                setLoading(false);
                return;
            }

            // Teste 3: Query com filtro de user_id
            addResult('3️⃣ Teste: Query Filtrada por User ID', 'Executando...', 'info');
            const { data: installations, error: queryError } = await supabase
                .from('installations')
                .select('*')
                .eq('user_id', session.user.id);

            if (queryError) {
                addResult('3️⃣ Teste: Query Filtrada por User ID',
                    `❌ Erro na query:\n\n${queryError.message}\nCode: ${queryError.code}\nDetails: ${queryError.details}\nHint: ${queryError.hint}`,
                    'error');
            } else if (installations && installations.length > 0) {
                addResult('3️⃣ Teste: Query Filtrada por User ID',
                    `✅ Instalações encontradas: ${installations.length}\n\n${JSON.stringify(installations, null, 2)}`,
                    'success');
            } else {
                addResult('3️⃣ Teste: Query Filtrada por User ID',
                    `⚠️ Nenhuma instalação encontrada para este user_id\n\nUser ID buscado: ${session.user.id}\nResultado: Array vazio\n\nIsso significa que:\n- O registro existe no banco (teste 1)\n- Mas o user_id não está vinculado corretamente\n- OU as políticas RLS estão bloqueando`,
                    'warning');
            }

            // Teste 4: Query sem filtro
            addResult('4️⃣ Teste: Query Sem Filtro', 'Executando...', 'info');
            const { data: allInstalls, error: allError } = await supabase
                .from('installations')
                .select('*');

            if (allError) {
                addResult('4️⃣ Teste: Query Sem Filtro',
                    `❌ Erro na query: ${allError.message}`,
                    'error');
            } else {
                addResult('4️⃣ Teste: Query Sem Filtro',
                    `📊 Total de instalações visíveis: ${allInstalls?.length || 0}\n\n${allInstalls && allInstalls.length > 0 ? JSON.stringify(allInstalls, null, 2) : 'Nenhuma instalação visível (RLS está bloqueando tudo)'}`,
                    allInstalls && allInstalls.length > 0 ? 'success' : 'warning');
            }

        } catch (err: any) {
            addResult('❌ Erro Geral', err.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'success': return 'border-green-500 bg-green-500/5';
            case 'error': return 'border-red-500 bg-red-500/5';
            case 'warning': return 'border-yellow-500 bg-yellow-500/5';
            default: return 'border-blue-500 bg-blue-500/5';
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-[#31A8FF] to-[#8B31FF] bg-clip-text text-transparent">
                    🔍 Debug de Vinculação
                </h1>
                <p className="text-slate-400 mb-8">Voltris Optimizer - Diagnóstico de Instalações</p>

                <div className="bg-[#1a1a22] border border-white/5 rounded-3xl p-8 mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-[#8B31FF]">Instruções</h2>
                    <ol className="list-decimal list-inside space-y-2 text-slate-300">
                        <li>Certifique-se de estar <strong className="text-white">logado</strong> em voltris.com.br</li>
                        <li>Clique no botão abaixo para executar todos os testes</li>
                        <li>Aguarde os resultados aparecerem</li>
                        <li>Copie os resultados e envie para análise</li>
                    </ol>

                    <button
                        onClick={runAllTests}
                        disabled={loading}
                        className="mt-6 px-8 py-4 bg-gradient-to-r from-[#8B31FF] to-[#31A8FF] rounded-2xl font-bold text-white hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Executando Testes...
                            </>
                        ) : (
                            '▶️ Executar Todos os Testes'
                        )}
                    </button>
                </div>

                <div className="space-y-6">
                    {results.map((result, index) => (
                        <div key={index} className="bg-[#1a1a22] border border-white/5 rounded-3xl p-6">
                            <h3 className="text-xl font-bold mb-4 text-[#31A8FF]">{result.title}</h3>
                            <div className={`border-l-4 ${getTypeColor(result.type)} p-4 rounded-r-lg`}>
                                <pre className="whitespace-pre-wrap font-mono text-sm text-slate-300">
                                    {result.content}
                                </pre>
                            </div>
                        </div>
                    ))}
                </div>

                {results.length > 0 && !loading && (
                    <div className="mt-8 bg-[#1a1a22] border border-white/5 rounded-3xl p-8">
                        <h2 className="text-2xl font-bold mb-4 text-[#8B31FF]">5️⃣ Análise Final</h2>
                        <div className="space-y-4 text-slate-300">
                            <p className="font-bold text-white">Resumo dos Testes:</p>
                            <ul className="list-disc list-inside space-y-2">
                                <li>Instalação existe no banco? {results.some(r => r.title.includes('Debug') && r.type === 'success') ? '✅ SIM' : '❌ NÃO'}</li>
                                <li>Usuário está autenticado? {results.some(r => r.title.includes('Sessão') && r.type === 'success') ? '✅ SIM' : '❌ NÃO'}</li>
                                <li>Query encontra instalações? {results.some(r => r.title.includes('Filtrada') && r.type === 'success') ? '✅ SIM' : '❌ NÃO'}</li>
                            </ul>

                            <p className="font-bold text-white mt-6">Próximos Passos:</p>
                            <div className="bg-[#121218] border border-white/5 rounded-xl p-4 mt-2">
                                <p className="text-sm">
                                    {results.some(r => r.title.includes('Debug') && r.type === 'success') &&
                                        !results.some(r => r.title.includes('Filtrada') && r.type === 'success') ? (
                                        <>
                                            <strong className="text-yellow-400">⚠️ Instalação existe mas a query não encontra:</strong><br />
                                            → O user_id não foi salvo corretamente na vinculação<br />
                                            → Verifique os logs da API de vinculação
                                        </>
                                    ) : results.some(r => r.type === 'error' && r.title.includes('Query')) ? (
                                        <>
                                            <strong className="text-red-400">❌ Query retorna erro:</strong><br />
                                            → Problema nas políticas RLS<br />
                                            → Execute novamente a migração SQL
                                        </>
                                    ) : results.some(r => r.title.includes('Filtrada') && r.type === 'success') ? (
                                        <>
                                            <strong className="text-green-400">✅ Tudo está OK!</strong><br />
                                            → Se o Dashboard não mostra, é problema no componente React<br />
                                            → Verifique o console do navegador na página do Dashboard
                                        </>
                                    ) : (
                                        <>
                                            <strong className="text-slate-400">ℹ️ Execute os testes para diagnóstico</strong>
                                        </>
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
