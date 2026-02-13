'use client';

import { useState, useEffect } from 'react';
import { Gamepad2, Zap, ZapOff, Activity, Cpu, Gauge } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';

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
           