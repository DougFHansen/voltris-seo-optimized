'use client';

import { useState, useEffect } from 'react';
import { Gamepad2, Zap, ZapOff, Activity, Cpu, Gauge } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'react-hot-toast';

export default function GamerPage() {
    const [loading, setLoading] = useState(false);
    const [gamerModeActive, setGamerModeActive] = useState(false);
    const [machineId, setMachineId] = useState<string | null>(null);
    const supabase = createClient();

    useEffect(() => {
        loadGamerModeStatus();
    }, []);

    const loadGamerModeStatus = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Buscar instalação vinculada
            const { data: installation } = await supabase
                .from('installations')
                .select('machine_id, gamer_mode_active')
                .eq('user_id', user.id)
                .single();

            if (installation) {
                setMachineId(installation.machine_id);
                setGamerModeActive(installation.gamer_mode_active || false);
            }
        } catch (error) {
            console.error('Erro ao carregar status do Gamer Mode:', error);
        }
    };

    const toggleGamerMode = async () => {
        if (!machineId) {
            toast.error('Nenhuma instalação encontrada');
            return;
        }

        setLoading(true);
        try {
            const newStatus = !gamerModeActive;

            const { error } = await supabase
                .from('installations')
                .update({ gamer_mode_active: newStatus })
                .eq('machine_id', machineId);

            if (error) throw error;

            setGamerModeActive(newStatus);
            toast.success(newStatus ? 'Gamer Mode ativado!' : 'Gamer Mode desativado!');
        } catch (error) {
            console.error('Erro ao alternar Gamer Mode:', error);
            toast.error('Erro ao alternar Gamer Mode');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Gamer Mode</h1>
                <p className="text-muted-foreground mt-2">
                    Otimize seu PC para máximo desempenho em jogos
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Gamepad2 className="h-5 w-5" />
                            Status do Gamer Mode
                        </div>
                        <Badge variant={gamerModeActive ? "default" : "secondary"}>
                            {gamerModeActive ? 'Ativo' : 'Inativo'}
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-sm font-medium">
                                {gamerModeActive ? 'Modo Gamer Ativado' : 'Modo Gamer Desativado'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {gamerModeActive
                                    ? 'Seu PC está otimizado para jogos'
                                    : 'Ative para otimizar o desempenho'}
                            </p>
                        </div>
                        <Button
                            onClick={toggleGamerMode}
                            disabled={loading || !machineId}
                            size="lg"
                            variant={gamerModeActive ? "destructive" : "default"}
                        >
                            {gamerModeActive ? (
                                <>
                                    <ZapOff className="mr-2 h-4 w-4" />
                                    Desativar
                                </>
                            ) : (
                                <>
                                    <Zap className="mr-2 h-4 w-4" />
                                    Ativar
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Otimização de CPU
                        </CardTitle>
                        <Cpu className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {gamerModeActive ? 'Ativa' : 'Desativada'}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Prioridade máxima para jogos
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Performance
                        </CardTitle>
                        <Gauge className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {gamerModeActive ? 'Máxima' : 'Normal'}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Modo de energia otimizado
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Processos em Segundo Plano
                        </CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {gamerModeActive ? 'Minimizados' : 'Normal'}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Recursos liberados para jogos
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}