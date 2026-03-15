'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Terminal, RefreshCcw, Search, CheckCircle2, XCircle, Clock } from 'lucide-react';

interface TelemetryLog {
    id: string;
    timestamp: string;
    event_type: string;
    feature_name: string;
    action_name: string;
    success: boolean;
    duration_ms: number;
    error_code?: string;
    metadata: any;
    machine_id: string;
    hostname: string;
    status: string;
}

export default function AdminTelemetryLogs() {
    const [logs, setLogs] = useState<TelemetryLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/admin/telemetry/logs');
            if (res.ok) {
                const data = await res.json();
                setLogs(data.logs || []);
            }
        } catch (error) {
            console.error('Failed to fetch logs', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const filteredLogs = logs.filter(log => 
        log.hostname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.feature_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.machine_id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <Card className="border-stone-800 bg-stone-900/40">
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <CardTitle className="text-xl flex items-center gap-2">
                            <Terminal className="h-5 w-5 text-blue-500" />
                            Logs de Telemetria (Últimos 100)
                        </CardTitle>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-500" />
                                <input
                                    type="text"
                                    placeholder="Filtrar logs..."
                                    className="pl-9 pr-4 py-2 bg-stone-950/50 border border-stone-800 rounded-lg text-sm text-stone-200 focus:outline-none focus:border-stone-600 transition-colors w-64"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <button
                                onClick={fetchLogs}
                                className="p-2 bg-stone-800 hover:bg-stone-700 rounded-lg text-stone-400 transition-colors"
                                title="Recarregar"
                            >
                                <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                            </button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border border-stone-800 overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-stone-800 bg-stone-950/50">
                                    <TableHead className="w-[180px]">Dispositivo</TableHead>
                                    <TableHead>Evento</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Duração</TableHead>
                                    <TableHead className="text-right">Horário</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">
                                            <div className="flex items-center justify-center gap-2 text-stone-500">
                                                <RefreshCcw className="h-4 w-4 animate-spin" />
                                                Carregando logs...
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : filteredLogs.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center text-stone-500">
                                            Nenhum log encontrado.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredLogs.map((log) => (
                                        <TableRow key={log.id} className="border-stone-800 hover:bg-stone-900/30 group">
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-stone-300 group-hover:text-white transition-colors">
                                                        {log.hostname}
                                                    </span>
                                                    <code className="text-[10px] text-stone-500 font-mono">
                                                        {log.machine_id.substring(0, 8)}...
                                                    </code>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                                                        {log.feature_name}
                                                    </span>
                                                    <span className="text-sm text-stone-300">
                                                        {log.action_name}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {log.success ? (
                                                    <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 flex w-fit items-center gap-1">
                                                        <CheckCircle2 className="h-3 w-3" />
                                                        Sucesso
                                                    </Badge>
                                                ) : (
                                                    <Badge className="bg-red-500/10 text-red-500 border-red-500/20 flex w-fit items-center gap-1">
                                                        <XCircle className="h-3 w-3" />
                                                        Erro {log.error_code && `(${log.error_code})`}
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-stone-500 text-xs">
                                                    <Clock className="h-3 w-3" />
                                                    {log.duration_ms}ms
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex flex-col items-end">
                                                    <span className="text-xs text-stone-400">
                                                        {new Date(log.timestamp).toLocaleDateString()}
                                                    </span>
                                                    <span className="text-[11px] text-stone-500 font-mono">
                                                        {new Date(log.timestamp).toLocaleTimeString()}
                                                    </span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
