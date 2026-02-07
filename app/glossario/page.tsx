'use client';

import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import { BookOpen } from 'lucide-react';
import AdSenseBanner from '@/components/AdSenseBanner';

export default function GlossarioPage() {

    // Conteúdo original que estava duplicado via template, agora centralizado.
    // Isso é High Value para uma página dedicada, mas Low Value se repetido em 200 páginas.
    const terms = [
        {
            title: "BIOS / UEFI",
            color: "text-[#31A8FF]",
            desc: "O sistema básico que roda antes do Windows. É lá que configuramos a ordem de boot (para formatar) e ajustes de hardware como XMP para memória RAM."
        },
        {
            title: "Drivers",
            color: "text-[#31A8FF]",
            desc: "Programas que ensinam o Windows a conversar com seu hardware (placa de vídeo, som, wi-fi). Drivers desatualizados são a causa nº 1 de telas azuis e lentidão."
        },
        {
            title: "Malware vs Vírus",
            color: "text-[#FF4B6B]",
            desc: "Malware é qualquer software malicioso. Vírus é um tipo específico que se replica. Hoje, o maior perigo é o Ransomware, que sequestra seus dados e pede resgate."
        },
        {
            title: "SSD (Solid State Drive)",
            color: "text-[#31FF8B]",
            desc: "Armazenamento moderno, 10x mais rápido que os HDs antigos. Se seu PC demora mais de 1 minuto para ligar, a culpa provavelmente é da falta de um SSD."
        },
        {
            title: "FPS / Hz",
            color: "text-[#E11D48]",
            desc: "FPS é quantos quadros seu PC gera por segundo. Hz é quantos quadros seu monitor consegue mostrar. Para jogos competitivos, quanto maior, melhor."
        },
        {
            title: "Bloatware",
            color: "text-[#FFB800]",
            desc: "Programas inúteis que já vêm pré-instalados no PC (fábrica) ou que instalamos sem querer junto com outros sofwares. Eles consomem RAM e processamento à toa."
        },
        {
            title: "Thermal Throttling",
            color: "text-[#FF4B6B]",
            desc: "Quando o processador ou placa de vídeo esquenta demais (geralmente acima de 90°C) e diminui a velocidade propositalmente para não queimar. Causa travamentos bruscos em jogos."
        },
        {
            title: "XMP / DOCP",
            color: "text-[#31A8FF]",
            desc: "Perfil de overclock automático da memória RAM. Se você comprou uma memória de 3200Mhz mas não ativou o XMP na BIOS, ela provavelmente está rodando a 2133Mhz (muito mais lenta)."
        },
        {
            title: "Ping / Latência",
            color: "text-[#E11D48]",
            desc: "O tempo que seu PC demora para enviar um dado para o servidor do jogo e receber a resposta. Medido em milissegundos (ms). Ping alto causa 'teletransporte' e atraso nos comandos."
        },
        {
            title: "Overclock",
            color: "text-[#8B31FF]",
            desc: "A prática de forçar um componente (CPU/GPU) a rodar numa velocidade maior que a de fábrica. Aumenta o desempenho (FPS), mas também aumenta o calor e o consumo de energia."
        },
        {
            title: "Gargalo (Bottleneck)",
            color: "text-[#FFB800]",
            desc: "Quando uma peça limita a outra. Exemplo: Ter uma placa de vídeo super potente (RTX 4090) com um processador fraco (i3 antigo). A placa fica ociosa esperando o processador trabalhar."
        }
    ];

    return (
        <div className="min-h-screen bg-[#050510] font-sans selection:bg-[#31A8FF]/30">
            <Header />

            <main className="pt-24 px-4 pb-20">
                <div className="max-w-4xl mx-auto">
                    <Breadcrumbs
                        items={[
                            { label: 'Glossário Técnico', href: '/glossario' }
                        ]}
                    />

                    <div className="text-center mb-16 mt-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6">
                            <BookOpen className="w-4 h-4 text-[#31A8FF]" />
                            <span className="text-xs font-bold text-slate-300 tracking-widest uppercase">Dicionário Tech</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Glossário <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B]">Fundamental</span>
                        </h1>
                        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                            Entenda os termos técnicos que usamos em nossos guias de otimização e manutenção.
                            Conhecimento é o primeiro passo para extrair o máximo do seu hardware.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {terms.map((term, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                viewport={{ once: true }}
                                className="bg-[#0A0A0F] border border-white/5 rounded-2xl p-8 hover:border-[#31A8FF]/30 transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                <h2 className={`${term.color} font-bold text-lg uppercase tracking-wider mb-4 group-hover:scale-105 transition-transform flex items-center gap-2`}>
                                    <span className="w-1.5 h-6 bg-current rounded-full opacity-50"></span>
                                    {term.title}
                                </h2>
                                <p className="text-slate-400 leading-relaxed text-sm">
                                    {term.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-16 text-center">
                        <p className="text-slate-500 mb-8">
                            Não encontrou o termo que procurava?
                        </p>
                        <a
                            href="https://wa.me/5511996716235"
                            target="_blank"
                            className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white font-bold transition-all"
                        >
                            Perguntar a um Especialista
                        </a>
                    </div>

                    <div className="mt-16">
                        <AdSenseBanner />
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
