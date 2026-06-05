"use client";

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, Shield, Zap, CreditCard, Clock, MessageCircle } from 'lucide-react';
import Link from 'next/link';

interface FAQItemProps {
    question: string;
    answer: string;
    icon?: React.ReactNode;
    isOpen: boolean;
    onClick: () => void;
    index: number;
}

const FAQItem = ({ question, answer, icon, isOpen, onClick, index }: FAQItemProps) => {
    const getIconClass = () => {
        if (isOpen) {
            return "w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center transition-all duration-500 shadow-sm bg-gradient-to-br from-blue-600 to-purple-600 text-white scale-110 shadow-md";
        }
        return "w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center transition-all duration-500 shadow-sm bg-gray-100 border border-gray-200 text-gray-500 group-hover:border-blue-300 group-hover:text-blue-600";
    };

    const getContainerClass = () => {
        if (isOpen) {
            return "group rounded-xl border transition-all duration-500 overflow-hidden relative bg-white border-blue-300 shadow-sm";
        }
        return "group rounded-xl border transition-all duration-500 overflow-hidden relative bg-white border-gray-200 hover:border-gray-300";
    };

    const getGlowBarClass = () => {
        return isOpen ? "opacity-100" : "opacity-0";
    };

    const getTextClass = () => {
        if (isOpen) {
            return "text-lg sm:text-xl font-medium tracking-tight transition-colors duration-300 text-gray-900";
        }
        return "text-lg sm:text-xl font-medium tracking-tight transition-colors duration-300 text-gray-700 group-hover:text-gray-900";
    };

    const getChevronContainerClass = () => {
        if (isOpen) {
            return "w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 ml-4 shrink-0 border-blue-600 bg-blue-100 rotate-180";
        }
        return "w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 ml-4 shrink-0 border-gray-200 bg-transparent group-hover:border-gray-300";
    };

    const getChevronIconClass = () => {
        if (isOpen) {
            return "w-4 h-4 transition-colors duration-300 text-blue-600";
        }
        return "w-4 h-4 transition-colors duration-300 text-gray-500 group-hover:text-gray-700";
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={getContainerClass()}
        >
            {/* Active Glow Bar on Left */}
            <div className={"absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-600 to-purple-600 transition-opacity duration-300 " + getGlowBarClass()} />

            <button
                onClick={onClick}
                className="w-full p-6 sm:p-8 flex items-center justify-between text-left focus:outline-none relative z-10"
            >
                <div className="flex items-center gap-6">
                    {icon && (
                        <div className={getIconClass()}>
                            <div className="w-5 h-5 sm:w-6 sm:h-6">
                                {icon}
                            </div>
                        </div>
                    )}
                    <span className={getTextClass()}>
                        {question}
                    </span>
                </div>

                <div className={getChevronContainerClass()}>
                    <ChevronDown className={getChevronIconClass()} />
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <div className="px-6 pb-8 pl-[88px] sm:pl-[104px] pr-6 sm:pr-12 text-gray-600 leading-8 text-[1.05rem] relative z-10 border-t border-gray-200 pt-6 mt-2 mx-6 sm:mx-8">
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const faqs = [
        {
            icon: <Zap className="w-5 h-5" />,
            question: "Como funciona o serviço de otimização?",
            answer: "Nosso serviço é realizado remotamente através de softwares seguros como AnyDesk. Um de nossos engenheiros acessa sua máquina e realiza mais de 450 ajustes manuais e sistêmicos, focando no kernel do Windows, processos em segundo plano, latência de rede e priorização de hardware. Não é apenas 'limpar arquivos'; é uma reengenharia do sistema para performance máxima."
        },
        {
            icon: <Shield className="w-5 h-5" />,
            question: "É seguro permitir o acesso remoto?",
            answer: "Absolutamente. Utilizamos ferramentas de nível empresarial (AnyDesk/TeamViewer) com criptografia ponta-a-ponta. Você acompanha todo o processo em tempo real na sua tela. Além disso, antes de qualquer alteração, criamos um Ponto de Restauração (Snapshot) do sistema, garantindo que tudo possa ser revertido se necessário."
        },
        {
            icon: <Clock className="w-5 h-5" />,
            question: "Quanto tempo demora o serviço?",
            answer: "O tempo varia de acordo com o plano escolhido e o estado atual da máquina. Uma otimização completa geralmente leva entre 1 a 2 horas. Durante esse período, recomendamos que você não utilize o computador para garantir que todos os testes de estabilidade sejam precisos."
        },
        {
            icon: <Shield className="w-5 h-5" />,
            question: "Existe garantia se eu não gostar?",
            answer: "Sim! Oferecemos garantia de satisfação de 7 dias. Se você não sentir uma melhora perceptível na performance (FPS, latência ou velocidade geral), nós refazemos o serviço ou devolvemos seu dinheiro. Nosso compromisso é com resultados, não apenas promessas."
        },
        {
            icon: <CreditCard className="w-5 h-5" />,
            question: "Quais as formas de pagamento?",
            answer: "Aceitamos PIX (com aprovação imediata), cartões de crédito em até 12x e boleto bancário. Utilizamos gateways de pagamento seguros e líderes mundiais para garantir a criptografia e segurança total da sua transação."
        },
        {
            icon: <HelpCircle className="w-5 h-5" />,
            question: "A otimização afeta a garantia do meu PC?",
            answer: "Não. Nossa otimização é estritamente a nível de software (Windows, Drivers, BIOS). Não realizamos Overclock físico agressivo (mudança de voltagem perigosa) nem abrimos seu hardware. Portanto, a garantia do fabricante do seu PC/Notebook permanece intacta."
        }
    ];

    return (
        <>
            <Header />
            <main className="bg-gray-50 min-h-screen relative overflow-x-hidden font-sans selection:bg-blue-100">
                {/* Background Effects */}
                <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-blue-100/30 blur-[150px] rounded-full pointer-events-none"></div>
                <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-purple-100/30 blur-[150px] rounded-full pointer-events-none"></div>

                {/* Hero Section */}
                <section className="min-h-[100dvh] flex flex-col items-center justify-center relative z-10">
                    <div className="container mx-auto px-4 text-center flex-grow flex flex-col items-center justify-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="text-sm font-bold tracking-[0.2em] text-blue-600 mb-6 uppercase">
                                Central de Ajuda
                            </h2>
                            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight mb-8">
                                Dúvidas <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text">Frequentes</span>
                            </h1>
                            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                                Tudo o que você precisa saber sobre nossa metodologia de engenharia de performance e suporte premium.
                            </p>
                        </motion.div>
                    </div>


                    {/* Scroll Down Indicator */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1, duration: 1, repeat: Infinity, repeatType: "reverse" }}
                        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer text-gray-400 hover:text-gray-900 transition-colors"
                    >
                        <span className="text-xs uppercase tracking-widest">Scroll</span>
                        <div className="w-[1px] h-12 bg-gradient-to-b from-blue-600 to-transparent"></div>
                    </motion.div>
                </section>

                {/* FAQ List */}
                <section className="pb-32 relative z-10">
                    <div className="container mx-auto px-4 max-w-4xl">
                        <div className="space-y-4">
                            {faqs.map((faq, idx) => (
                                <FAQItem
                                    key={idx}
                                    index={idx}
                                    {...faq}
                                    isOpen={openIndex === idx}
                                    onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                                />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Contact CTA */}
                <section className="pb-32 relative z-10">
                    <div className="container mx-auto px-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="max-w-4xl mx-auto rounded-3xl bg-white border border-gray-200 p-8 md:p-12 text-center relative overflow-hidden group shadow-sm"
                        >
                            {/* Glow Effect */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-gradient-to-r from-blue-100/50 via-purple-100/50 to-pink-100/50 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg relative z-10"
                            >
                                <MessageCircle className="w-10 h-10 text-white" />
                            </motion.div>

                            <h2 className="text-3xl font-bold text-gray-900 mb-4 relative z-10">Ainda tem dúvidas?</h2>
                            <p className="text-gray-500 mb-8 max-w-lg mx-auto relative z-10">
                                Nossa equipe de especialistas está pronta para analisar seu caso específico e recomendar a melhor solução.
                            </p>

                            <Link href="/contato" className="relative z-10 inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md transform hover:scale-105 duration-200">
                                Falar com Especialista
                            </Link>
                        </motion.div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
