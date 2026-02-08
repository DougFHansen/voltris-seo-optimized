'use client';

import { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Filter, Activity, Terminal, AlertCircle } from 'lucide-react';

interface TelemetryEvent {
    id: string;
    event_type: string;
    feature_name: string;
    action_name: string;
    success: boolean;
    timestamp: string;
    machine_id: string;
    hostname: string;
    metadata: any;
}

export default function AdminTelemetryLogs() {
    const [logs, setLogs] = useState<TelemetryEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        fetchLogs();
        const interval = setInterval(fetchLogs, 10000); // 10s refresh
        return () => clearInterval(interval);
    }, []);

    const fetchLogs = async () => {
        try {
            const res = await fetch('/api/admin/telemetry/logs');
            console.log('[AdminTelemetryLogs] Response status:', res.status, res.ok);
            if (res.ok) {
                const data = await res.json();
                console.log('[AdminTelemetryLogs] Data received:', data);
                console.log('[AdminTelemetryLogs] Logs count:', data.logs?.length || 0);
                setLogs(data.logs);
            } else {
                const errorText = await res.text();
                console.error('[AdminTelemetryLogs] API error:', res.status, errorText);
            }
        } catch (error) {
            console.error('[AdminTelemetryLogs] Failed to fetch logs', error);
        } finally {
            setLoading(false);
        }
    };

    const getEventBadge = (type: string) => {
        switch (type) {
            case 'APP_START': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'EXCEPTION': return 'bg-red-500/10 text-red-500 border-red-500/20';
            case 'SYSTEM_HEALTH': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'PAGE_VIEW': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
            default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
        }
    };

    const filteredLogs = logs.filter(log =>
        log.event_type.toLowerCase().includes(filter.toLowerCase()) ||
        log.hostname?.toLowerCase().includes(filter.toLowerCase()) ||
        log.feature_name.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <Card className="border-stone-800 bg-stone-950/40 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-xl flex items-center gap-2">
                    <Terminal className="h-5 w-5 text-blue-500" />
                    Fluxo de Telemetria Enterprise
                </CardTitle>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-stone-500" />
                        <input
                            type="text"
                            placeholder="Filtrar eventos..."
                            className="pl-9 pr-4 py-2 bg-stone-900/50 border border-stone-800 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-64"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        />
                    </div>
                    <Badge variant="outline" className="font-mono text-[10px] uppercase">
                        Real-time Stream
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="rounded-xl border border-stone-800 bg-stone-900/20 overflow-hidden">
                    <Table>
                        <TableHeader className="bg-stone-900/40">
                            <TableRow className="hover:bg-transparent border-stone-800">
                                <TableHead className="w-[180px]">Timestamp</TableHead>
                                <TableHead className="w-[150px]">Tipo</TableHead>
                                <TableHead>Dispositivo</TableHead>
                                <TableHead>Feature / Ação</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Detalhes</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-64 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <Activity className="h-8 w-8 text-blue-500 animate-pulse" />
                                            <span className="text-stone-500 animate-pulse">Sincronizando logs...</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : filteredLogs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-64 text-center text-stone-500">
                                        Nenhum evento encontrado para o filtro aplicado.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredLogs.map((log) => (
                                    <TableRow key={log.id} className="border-stone-800/50 hover:bg-stone-800/30 transition-colors group">
                                        <TableCell className="font-mono text-xs text-stone-500">
                                            {new Date(log.timestamp).toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={`text-[10px] font-bold ${getEventBadge(log.event_type)}`}>
                                                {log.event_type}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-stone-300">{log.hostname || 'Desconhecido'}</span>
                                                <span className="text-[10px] text-stone-600 font-mono truncate max-w-[120px]">{log.machine_id}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <span className="px-1.5 py-0.5 rounded bg-stone-800 text-stone-400 text-[10px] font-medium uppercase tracking-wider">
                                                    {log.feature_name}
                                                </span>
                                                <span className="text-stone-300 text-xs">
                                                    {log.action_name}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {log.success ? (
                                                <Badge className="bg-emerald-500/20 text-emerald-500 border-none hover:bg-emerald-500/20 text-[10px]">SUCCESS</Badge>
                                            ) : (
                                                <div className="flex items-center gap-1.5 text-red-500">
                                                    <AlertCircle className="h-3 w-3" />
                                                    <span className="text-[10px] font-bold">FAILURE</span>
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <button
                                                className="text-[10px] text-stone-500 hover:text-blue-400 font-mono underline decoration-stone-700 underline-offset-4"
                                                onClick={() => console.log('Metadata:', log.metadata)}
                                            >
                                                VIEW_JSON
                                            </button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
