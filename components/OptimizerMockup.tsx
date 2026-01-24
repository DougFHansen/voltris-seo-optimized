"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart3, Activity, Cpu, MonitorSmartphone, Check, Zap, Server } from "lucide-react";

const PROCESSES = [
    "chrome.exe",
    "discord.exe",
    "svchost.exe",
    "explorer.exe",
    "steam.exe",
    "valorant.exe",
    "cs2.exe",
    "spotify.exe",
];

const ACTIONS = [
    "Otimizando threads...",
    "Limpando cache...",
    "Ajustando prioridade...",
    "Reduzindo latência...",
    "Alocando memória...",
];

export default function OptimizerMockup() {
    const [fps, setFps] = useState(240);
    const [latency, setLatency] = useState(12);
    const [currentProcess, setCurrentProcess] = useState(PROCESSES[0]);
    const [currentAction, setCurrentAction] = useState(ACTIONS[0]);
    const [scannedCount, setScannedCount] = useState(0);

    // Simulate FPS fluctuation
    useEffect(() => {
        const interval = setInterval(() => {
            setFps(prev => {
                const change = Math.floor(Math.random() * 11) - 5; // -5 to +5
                const newValue = prev + change;
                return Math.min(Math.max(newValue, 220), 300); // Clamp between 220 and 300
            });
        }, 800);
        return () => clearInterval(interval);
    }, []);

    // Simulate Latency fluctuation
    useEffect(() => {
        const interval = setInterval(() => {
            setLatency(prev => {
                const change = Math.floor(Math.random() * 3) - 1; // -1 to +1
                const newValue = prev + change;
                return Math.min(Math.max(newValue, 4), 15); // Clamp between 4ms and 15ms
            });
        }, 1200);
        return () => clearInterval(interval);
    }, []);

    // Simulate Process Scanning
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentProcess(PROCESSES[Math.floor(Math.random() * PROCESSES.length)]);
            setScannedCount(prev => prev + 1);

            if (Math.random() > 0.7) {
                setCurrentAction(ACTIONS[Math.floor(Math.random() * ACTIONS.length)]);
            }
        }, 200);
        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div
            className="w-full relative z-10 glass-panel rounded-2xl p-6 md:p-8 overflow-hidden transform transition-all duration-500 hover:scale-[1.01] border border-white/10 bg-[#0A0A0F]/60 backdrop-blur-xl shadow-2xl"
            initial={{ opacity: 0, y: 50, rotateX: 5 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
        >
            {/* Header of the fake app */}
            <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/5 border border-white/10">
                        <Image
                            src="/logo.png"
                            alt="Voltris Logo"
                            width={40}
                            height={40}
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <div>
                        <div className="font-extrabold text-xl bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-transparent bg-clip-text">Voltris Optimizer</div>
                        <div className="text-xs text-white/40 flex items-center gap-1.5">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            Otimização Ativa • <span className="text-white/30">{scannedCount} items verificados</span>
                        </div>
                    </div>
                </div>
                <a href="/voltrisoptimizer" className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-white text-sm font-bold hover:shadow-[0_0_20px_rgba(139,49,255,0.6)] transition-all shadow-md relative overflow-hidden group">
                    <span className="relative z-10">Download</span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                </a>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Metric 1 - FPS */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/5 hover:bg-white/10 transition-colors group relative overflow-hidden">
                    <div className="absolute inset-0 bg-[#31A8FF]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="flex justify-between items-start mb-2 relative z-10">
                        <div className="p-2 bg-[#31A8FF]/20 rounded-lg text-[#31A8FF]">
                            <BarChart3 className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold text-[#00FF94] bg-[#00FF94]/10 px-2 py-0.5 rounded shadow-[0_0_10px_rgba(0,255,148,0.2)] flex items-center gap-1">
                            <Zap className="w-3 h-3 fill-current" />
                            +42%
                        </span>
                    </div>
                    <motion.div
                        className="text-3xl font-bold text-white mb-1 tracking-tight"
                        key={fps}
                        initial={{ opacity: 0.5, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {fps} <span className="text-base font-normal text-white/40">FPS</span>
                    </motion.div>
                    <div className="text-xs text-white/40">Média em Jogos</div>
                </div>

                {/* Metric 2 - Latency */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/5 hover:bg-white/10 transition-colors group relative overflow-hidden">
                    <div className="absolute inset-0 bg-[#FF4B6B]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="flex justify-between items-start mb-2 relative z-10">
                        <div className="p-2 bg-[#FF4B6B]/20 rounded-lg text-[#FF4B6B]">
                            <Activity className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold text-[#FF4B6B] bg-[#FF4B6B]/10 px-2 py-0.5 rounded animate-pulse">-15ms</span>
                    </div>
                    <motion.div
                        className="text-3xl font-bold text-white mb-1 tracking-tight"
                        key={latency}
                        initial={{ opacity: 0.5, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {latency}ms
                    </motion.div>
                    <div className="text-xs text-white/40">Latência de Sistema</div>
                </div>
            </div>

            {/* System Status List - Dynamic */}
            <div className="space-y-3 relative mb-6">
                {/* Dynamic Activity Item */}
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border-l-2 border-[#8B31FF]/50 relative overflow-hidden">
                    <motion.div
                        className="absolute inset-0 bg-[#8B31FF]/10 z-0"
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />
                    <div className="flex items-center gap-3 relative z-10">
                        <div className="w-8 h-8 rounded bg-[#8B31FF]/20 flex items-center justify-center">
                            <Server className="w-4 h-4 text-[#8B31FF]" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm text-white/90 font-medium">Otimizando Processo</span>
                            <span className="text-xs text-white/40 font-mono">{currentProcess}</span>
                        </div>
                    </div>
                    <span className="text-xs text-[#8B31FF] font-medium relative z-10 animate-pulse">Ativo...</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border-l-2 border-[#31A8FF]">
                    <div className="flex items-center gap-3">
                        <MonitorSmartphone className="w-4 h-4 text-white/60" />
                        <div className="flex flex-col">
                            <span className="text-sm text-white/80">Input Lag Reduction</span>
                            <span className="text-[10px] text-white/30 uppercase tracking-wider">{currentAction}</span>
                        </div>
                    </div>
                    <span className="text-xs text-[#31A8FF] font-medium">Máximo</span>
                </div>
            </div>

            {/* Decorative Graph/Line - More Dynamic */}
            <div className="mt-4 pt-4 border-t border-white/5">
                <div className="flex items-center justify-between text-xs text-white/30 mb-2">
                    <span>Carga do Sistema</span>
                    <span className="text-[#00FF94]">Otimizado em Tempo Real</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden flex gap-0.5">
                    {Array.from({ length: 20 }).map((_, i) => (
                        <motion.div
                            key={i}
                            className="h-full bg-gradient-to-r from-[#8B31FF] to-[#31A8FF] rounded-full"
                            animate={{
                                height: ["20%", "60%", "100%", "40%"],
                                opacity: [0.3, 1, 0.5]
                            }}
                            transition={{
                                duration: Math.random() * 2 + 1,
                                repeat: Infinity,
                                delay: i * 0.05
                            }}
                            style={{ width: '5%' }}
                        />
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
