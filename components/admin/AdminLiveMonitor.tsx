'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
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
import {
    Activity,
    Users,
    Clock,
    Building2,
    MonitorSmartphone
} from 'lucide-react';
import { AdminSession, AdminDashboardStats } from '@/types/admin-session';

export default function AdminLiveMonitor() {
    const [sessions, setSessions] = useState<AdminSession[]>([]);
    const [stats, setStats] = useState<AdminDashboardStats>({
        active_now: 0,
        idle_now: 0,
        peak_concurrent_24h: 0,
        total_sessions_today: 0,
        active_companies: 0
    });
    const [loading, setLoading] = useState(true);

    const supabase = createClient();

    // Poll every 5 seconds for live data (simple & robust for admin dash)
    // Also use Realtime subscription for instant updates
    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000);
        
        // Subscribe to realtime changes on sessions table
        const channel = supabase
            .channel('admin-sessions')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'sessions'
                },
                () => {
                    // Refetch data when sessions change
                    fetchData();
                }
            )
            .subscribe();
        
        return () => {
            clearInterval(interval);
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch('/api/admin/sessions/live');
            if (!res.ok) return;
            const data = await res.json();

            // LÓGICA DE AGRUPAMENTO PROFISSIONAL:
            // Se houver múltiplas sessões para o mesmo machine_id (computador), 
            // mostramos apenas a mais recente para evitar poluição no dashboard.
            const uniqueSessionsMap = new Map<string, AdminSession>();

            (data.sessions || []).forEach((session: AdminSession) => {
                const mid = session.device?.machine_id;
                if (!mid) return;

                const existing = uniqueSessionsMap.get(mid);
                if (!existing || new Date(session.last_heartbeat_at) > new Date(existing.last_heartbeat_at)) {
                    uniqueSessionsMap.set(mid, session);
                }
            });

            setSessions(Array.from(uniqueSessionsMap.values()));
            setStats(data.stats);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch live stats', error);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'idle': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
            default: return 'bg-gray-500/10 text-gray-500';
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Usuários Online</CardTitle>
                        <Users className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.active_now}</div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                            Tempo Real
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ociosos (AFK)</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.idle_now}</div>
                        <p className="text-xs text-muted-foreground">
                            Sem atividade há +5min
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Empresas Ativas</CardTitle>
                        <Building2 className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.active_companies}</div>
                        <p className="text-xs text-muted-foreground">
                            Usando o sistema agora
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Sessões Hoje</CardTitle>
                        <Activity className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total_sessions_today}</div>
                        <p className="text-xs text-muted-foreground">
                            Total de aberturas do app
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Live Session Table */}
            <Card className="col-span-1 border-stone-800 bg-stone-950/50">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-xl flex items-center gap-2">
                            <Activity className="h-5 w-5 text-indigo-500" />
                            Monitoramento em Tempo Real
                        </CardTitle>
                        <Badge variant="outline" className="text-xs font-mono">
                            UPDATED: {new Date().toLocaleTimeString()}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border border-stone-800">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-stone-800">
                                    <TableHead>Dispositivo</TableHead>
                                    <TableHead>Atividade Recente</TableHead>
                                    <TableHead>Cliente / Plano</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Hardware (CPU / GPU / RAM)</TableHead>
                                    <TableHead>Versão</TableHead>
                                    <TableHead className="text-right">Último Sinal</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sessions.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                            Nenhuma sessão ativa encontrada.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    sessions.map((session) => {
                                        const dev = session.device || {
                                            machine_id: '',
                                            hostname: '',
                                            os_version: '',
                                            company: null,
                                            profile: null
                                        };
                                        // @ts-ignore - profile vem no join do supabase
                                        const profile = dev.profile?.[0] || dev.profile || {};

                                        return (
                                            <TableRow key={session.id} className="border-stone-800 hover:bg-stone-900/50">
                                                <TableCell className="font-medium">
                                                    <div className="flex flex-col max-w-[180px]">
                                                        <span className="flex items-center gap-2 truncate font-semibold text-stone-200" title={dev.hostname}>
                                                            <MonitorSmartphone className="h-3 w-3 text-stone-400 shrink-0" />
                                                            {dev.hostname || 'Desconhecido'}
                                                        </span>
                                                        <code className="text-[10px] text-stone-500 font-mono mt-1 break-all select-all hover:text-stone-300 transition-colors cursor-text">
                                                            {dev.machine_id}
                                                        </code>
                                                    </div>
                                                </TableCell>

                                                <TableCell>
                                                    {session.last_activity ? (
                                                        <div className="flex flex-col text-xs">
                                                            <span className="font-medium text-stone-300 truncate max-w-[150px]" title={session.last_activity.name}>
                                                                {session.last_activity.name}
                                                            </span>
                                                            <span className="text-[10px] text-stone-500 flex items-center gap-1">
                                                                <Clock className="w-3 h-3" />
                                                                {new Date(session.last_activity.time).toLocaleTimeString('pt-BR')}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-[10px] text-stone-600 italic">
                                                            Aguardando ação...
                                                        </span>
                                                    )}
                                                </TableCell>

                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-xs text-stone-300">
                                                            {dev.company?.name || 'Usuário Grátis'}
                                                        </span>
                                                        <span className="text-[10px] text-stone-500 capitalize">
                                                            {dev.company?.plan_type || 'Personal'}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col gap-1">
                                                        <Badge variant="outline" className={getStatusColor(session.status)}>
                                                            {session.status === 'active' ? 'ATIVO' : 
                                                             session.status === 'idle' ? 'INATIVO' : 
                                                             'DESCONECTADO'}
                                                        </Badge>
                                                        {session.health_score != null && (
                                                            <Badge
                                                                variant="secondary"
                                                                className={`text-[9px] border-none ${session.health_score >= 80 ? 'bg-emerald-500/10 text-emerald-500' :
                                                                    session.health_score >= 50 ? 'bg-yellow-500/10 text-yellow-500' :
                                                                        'bg-red-500/10 text-red-500'
                                                                    }`}
                                                            >
                                                                SAÚDE: {session.health_score}%
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </TableCell>

                                                {/* HARDWARE PROFILE */}
                                                <TableCell>
                                                    {profile.cpu_model ? (
                                                        <div className="flex flex-col text-[10px] max-w-[250px]">
                                                            <span className="font-semibold truncate text-stone-300" title={profile.cpu_model}>
                                                                {profile.cpu_model.replace("Intel(R) Core(TM) ", "").replace("AMD Ryzen ", "Ryzen ")}
                                                            </span>
                                                            <span className="truncate text-stone-500" title={profile.gpu_model}>
                                                                {profile.gpu_model}
                                                            </span>
                                                            <div className="flex gap-2 mt-0.5 text-stone-400">
                                                                <span className="bg-stone-800 px-1.5 py-0.5 rounded flex items-center gap-1 border border-stone-700/50">
                                                                    Ram: {profile.ram_total_gb ? Math.round(profile.ram_total_gb) : '?'}GB
                                                                </span>
                                                                <span className="bg-stone-800 px-1.5 py-0.5 rounded border border-stone-700/50" title={profile.windows_build}>
                                                                    {profile.os_version || 'Win'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-[10px] text-muted-foreground italic flex items-center gap-1">
                                                            <span className="animate-spin h-2 w-2 border-2 border-stone-600 border-t-stone-400 rounded-full"></span>
                                                            Coletando...
                                                        </span>
                                                    )}
                                                </TableCell>

                                                <TableCell>
                                                    <Badge variant="secondary" className="font-mono text-[10px] bg-stone-800 text-stone-400 hover:bg-stone-700">
                                                        v{session.app_version || '1.0'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right font-mono text-xs text-stone-500">
                                                    {new Date(session.last_heartbeat_at).toLocaleTimeString()}
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
