'use client';

import Link from 'next/link';
import { Phone, MapPin, CheckCircle2, Star, Clock, Shield, CreditCard, MessageCircle, Zap, Wrench, Monitor, ChevronRight } from 'lucide-react';
import Header from '@/components/Header';
import DOMPurify from 'isomorphic-dompurify';
import dynamic from 'next/dynamic';

const Footer = dynamic(() => import('@/components/Footer'), { ssr: false });

export default function FormatarWindowsClient() {
    const faqItems = [
        {
            question: "Quanto tempo leva a formatação?",
            answer: "Normalmente entre 2 a 4 horas, dependendo do tamanho do HD/SSD e da quantidade de drivers a serem instalados."
        },
        {
            question: "Perco meus arquivos durante a formatação?",
            answer: "Sim, a formatação apaga todos os dados do disco. Por isso, fazemos cópia de segurança antes do processo."
        },
        {
            question: "Vocês reinstalam meus programas?",
            answer: "Instalamos os programas essenciais. Lista completa de programas pode ser combinada previamente."
        },
        {
            question: "Oferecem garantia do serviço?",
            answer: "Sim, oferecemos 30 dias de garantia contra problemas relacionados à formatação."
        }
    ];

    const pricingPlans = [
        {
            name: "Formatação Básica",
            price: "R$ 120",
            features: [
                "Instalação limpa do Windows",
                "Atualizações essenciais",
                "Principais drivers",
                "Antivirus básico"
            ]
        },
        {
            name: "Formatação Premium",
            price: "R$ 180",
            features: [
                "Tudo da básica +",
                "Todos os drivers atualizados",
                "Otimização de sistema",
                "Programas solicitados",
                "Configurações personalizadas"
            ],
            popular: true
        },
        {
            name: "Formatação Gamer",
            price: "R$ 250",
            features: [
                "Tudo da premium +",
                "Drivers para jogos",
                "Otimização para gaming",
                "Programas de streaming",
                "Configurações para FPS"
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <Header />
            {/* Hero Section */}
            <section className="relative py-20 md:py-32 px-4">
                {/* Background Ambience */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 brightness-100 contrast-150 mix-blend-overlay pointer-events-none z-0"></div>
                <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full bg-purple-200/30 blur-[120px] mix-blend-screen" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-200/30 blur-[100px] mix-blend-screen" />

                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 border border-blue-300 backdrop-blur-md mb-4">
                                <span className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                                <span className="text-xs sm:text-sm font-medium bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text tracking-wide">Formatação Profissional de Windows</span>
                            </div>

                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight tracking-tight font-sans mb-6">
                                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text">Formatação de Windows</span> <br className="hidden lg:block" />
                                <span className="block mt-2 text-2xl sm:text-3xl lg:text-4xl text-gray-700">Profissional e Otimizada em Todo Brasil</span>
                            </h1>

                            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                Instalação limpa, drivers atualizados e configurações otimizadas. Seu PC como novo em folha em poucas horas com nosso serviço especializado de formatação Windows.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                                <Link
                                    href="/todos-os-servicos/formatacao-windows"
                                    className="group relative inline-flex items-center justify-center px-8 py-4 font-semibold text-gray-900 transition-all duration-200 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 backdrop-blur-sm overflow-hidden"
                                >
                                    <span className="mr-2">Solicitar Orçamento</span>
                                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                                <Link
                                    href="https://wa.me/5511996716235"
                                    className="inline-flex items-center justify-center px-8 py-4 font-semibold text-gray-900 transition-all duration-200 bg-emerald-500 rounded-lg hover:bg-emerald-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                                >
                                    <MessageCircle className="mr-2" size={20} />
                                    Falar no WhatsApp
                                </Link>
                            </div>

                            <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="text-emerald-600" size={20} />
                                    <span>Garantia de 30 dias</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="text-emerald-600" size={20} />
                                    <span>Sem surpresas</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="text-emerald-600" size={20} />
                                    <span>Orçamento em minutos</span>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 border border-gray-200 shadow-lg">
                                <div className="bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg h-64 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
                                            <Wrench className="w-8 h-8 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">Processo de Formatação</h3>
                                        <p className="text-gray-600 text-sm">Instalação limpa e configuração otimizada do Windows</p>
                                    </div>
                                </div>
                                <div className="mt-6 grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3">
                                        <Clock className="text-blue-600" size={24} />
                                        <div>
                                            <p className="font-bold text-gray-900">Tempo Médio</p>
                                            <p className="text-sm text-gray-500">2-4 horas</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Shield className="text-emerald-600" size={24} />
                                        <div>
                                            <p className="font-bold text-gray-900">Garantia</p>
                                            <p className="text-sm text-gray-500">30 dias</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Indicators */}
            <section className="py-16 bg-gray-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 brightness-100 contrast-150 mix-blend-overlay pointer-events-none z-0"></div>
                <div className="max-w-6xl mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text">500+</div>
                            <p className="text-gray-600">Computadores Formatados</p>
                        </div>
                        <div>
                            <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 text-transparent bg-clip-text">98%</div>
                            <p className="text-gray-600">Satisfação</p>
                        </div>
                        <div>
                            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-pink-600 to-purple-600 text-transparent bg-clip-text">7+</div>
                            <p className="text-gray-600">Anos de Experiência</p>
                        </div>
                        <div>
                            <div className="text-3xl font-bold bg-gradient-to-r from-pink-600 via-blue-600 to-purple-600 text-transparent bg-clip-text">24/7</div>
                            <p className="text-gray-600">Suporte</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="py-20 px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 brightness-100 contrast-150 mix-blur-overlay pointer-events-none z-0"></div>
                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 border border-blue-200 mb-6">
                            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                            <span className="text-xs font-bold text-blue-600 tracking-widest uppercase">Planos de Formatação</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
                            Escolha o plano ideal para sua <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">Formatação Windows</span>
                        </h2>
                        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            Planos personalizados para diferentes necessidades e perfis de uso
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
                        {pricingPlans.map((plan, index) => (
                            <div
                                key={index}
                                className={`group relative bg-white border ${plan.popular ? 'border-blue-300' : 'border-gray-200'
                                    } hover:border-blue-300 rounded-3xl p-1 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-lg`}
                            >
                                <div className="absolute inset-0 bg-gradient-to-b from-gray-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                                <div className="relative h-full bg-white rounded-[20px] p-8 flex flex-col items-start overflow-hidden">
                                    {plan.popular && (
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 border border-blue-300 mb-6">
                                            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                                            <span className="text-xs font-bold text-blue-600 tracking-widest uppercase">Mais Popular</span>
                                        </div>
                                    )}

                                    <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">{plan.name}</h3>

                                    <div className="text-4xl font-bold mb-6">
                                        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text">{plan.price}</span>
                                    </div>

                                    <ul className="space-y-3 mb-8 flex-1">
                                        {plan.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-start gap-3">
                                                <CheckCircle2 className="text-emerald-600 mt-0.5 flex-shrink-0" size={20} />
                                                <span className="text-gray-600">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <Link
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            const message = `Olá, gostaria de contratar o plano ${encodeURIComponent(plan.name)} de formatação de Windows`;
                                            window.open(`https://wa.me/5511996716235?text=${message}`, '_blank');
                                        }}
                                        className="w-full py-3 px-6 rounded-lg text-center font-bold transition-all bg-gray-100 hover:bg-gray-200 border border-gray-200 hover:border-blue-300 text-gray-900"
                                    >
                                        Contratar Agora
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section className="py-20 bg-gray-100 px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 brightness-100 contrast-150 mix-blend-overlay pointer-events-none z-0"></div>
                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 tracking-tight">
                            Nosso <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">Processo de Formatação</span>
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Um processo claro e transparente para sua tranquilidade
                        </p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            {
                                step: 1,
                                title: "Análise Inicial",
                                description: "Diagnosticamos seu PC para identificar necessidades específicas"
                            },
                            {
                                step: 2,
                                title: "Backup",
                                description: "Salvamos seus arquivos importantes antes da formatação"
                            },
                            {
                                step: 3,
                                title: "Formatação",
                                description: "Instalamos o Windows limpo com drivers atualizados"
                            },
                            {
                                step: 4,
                                title: "Finalização",
                                description: "Testamos o sistema e entregamos seu PC como novo"
                            }
                        ].map((item, index) => (
                            <div key={index} className="text-center group">
                                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-2xl font-bold mx-auto mb-4 text-white group-hover:scale-110 transition-transform duration-300">
                                    {item.step}
                                </div>
                                <h3 className="text-xl font-bold mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:via-purple-600 group-hover:to-pink-600 transition-all">{item.title}</h3>
                                <p className="text-gray-600">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 brightness-100 contrast-150 mix-blend-overlay pointer-events-none z-0"></div>
                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 tracking-tight">
                            O Que Nossos Clientes <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">Dizem</span>
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Histórias reais de satisfação e confiança
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
                        {[
                            {
                                name: "Carlos Silva",
                                text: "Meu notebook estava horrível, com vírus e lento. Depois da formatação, voltou a ser como novo!",
                                rating: 5,
                                color: "from-pink-500 to-pink-400"
                            },
                            {
                                name: "Ana Costa",
                                text: "Serviço rápido e profissional. Meu computador agora voa, recomendo demais!",
                                rating: 5,
                                color: "from-purple-500 to-purple-400"
                            },
                            {
                                name: "Pedro Oliveira",
                                text: "Excelente trabalho, atendimento impecável. Valeu cada centavo investido.",
                                rating: 5,
                                color: "from-blue-500 to-blue-400"
                            }
                        ].map((testimonial, index) => (
                            <div key={index} className="group relative bg-white/90 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 hover:border-gray-300 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent group-hover:via-gray-300 transition-all"></div>

                                <div className="flex items-center gap-1 mb-6 text-yellow-500">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-current" />
                                    ))}
                                </div>

                                <p className="text-gray-600 mb-8 relative z-10 italic">"{testimonial.text}"</p>

                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                                        {testimonial.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900 text-sm">{testimonial.name}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-20 bg-gray-100 px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 brightness-100 contrast-150 mix-blend-overlay pointer-events-none z-0"></div>
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Pronto para formatar seu Windows?</h2>
                    <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                        Entre em contato agora e receba um orçamento personalizado em minutos
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/todos-os-servicos/formatacao-windows"
                            className="group relative inline-flex items-center justify-center px-8 py-4 font-semibold text-gray-900 transition-all duration-200 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 backdrop-blur-sm overflow-hidden"
                        >
                            <span className="mr-2">Solicitar Orçamento</span>
                            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                        <Link
                            href="tel:+5511996716235"
                            className="inline-flex items-center justify-center px-8 py-4 font-semibold text-gray-900 transition-all duration-200 bg-emerald-500 rounded-lg hover:bg-emerald-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                        >
                            <Phone className="mr-2" size={20} />
                            (11) 99671-6235
                        </Link>
                    </div>
                </div>
            </section>

            {/* Related Services */}
            <section className="py-20 bg-gray-100 px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 brightness-100 contrast-150 mix-blend-overlay pointer-events-none z-0"></div>
                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 tracking-tight">
                            Serviços <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">Relacionados</span>
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Combine com outros serviços para resultados ainda melhores
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
                        <Link href="/otimizacao-pc" className="group relative bg-white border border-gray-200 hover:border-blue-300 rounded-3xl p-1 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
                            <div className="absolute inset-0 bg-gradient-to-b from-gray-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                            <div className="relative h-full bg-white rounded-[20px] p-8 flex flex-col items-start overflow-hidden">
                                <div className="w-16 h-16 rounded-2xl bg-gray-100 backdrop-blur-sm border border-gray-200 flex items-center justify-center mb-8 group-hover:bg-blue-100 group-hover:border-blue-200 transition-all duration-300 shadow-md">
                                    <div className="transform transition-transform duration-300 group-hover:scale-110 text-emerald-600">
                                        <Zap className="w-8 h-8" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">Otimização de PC</h3>
                                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                                    Aumente FPS em jogos e velocidade do sistema
                                </p>
                                <div className="mt-auto w-full pt-6 border-t border-gray-200 flex items-center justify-between">
                                    <span className="text-blue-600 text-sm font-medium">Saiba mais</span>
                                    <div className="w-12 h-12 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-900 group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white transition-all duration-300 shadow-md">
                                        <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                                    </div>
                                </div>
                            </div>
                        </Link>

                        <Link href="/assistencia-tecnica" className="group relative bg-white border border-gray-200 hover:border-purple-300 rounded-3xl p-1 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
                            <div className="absolute inset-0 bg-gradient-to-b from-gray-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                            <div className="relative h-full bg-white rounded-[20px] p-8 flex flex-col items-start overflow-hidden">
                                <div className="w-16 h-16 rounded-2xl bg-gray-100 backdrop-blur-sm border border-gray-200 flex items-center justify-center mb-8 group-hover:bg-purple-100 group-hover:border-purple-200 transition-all duration-300 shadow-md">
                                    <div className="transform transition-transform duration-300 group-hover:scale-110 text-purple-600">
                                        <Wrench className="w-8 h-8" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">Assistência Técnica</h3>
                                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                                    Reparo de hardware e manutenção preventiva
                                </p>
                                <div className="mt-auto w-full pt-6 border-t border-gray-200 flex items-center justify-between">
                                    <span className="text-purple-600 text-sm font-medium">Saiba mais</span>
                                    <div className="w-12 h-12 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-900 group-hover:bg-purple-600 group-hover:border-purple-600 group-hover:text-white transition-all duration-300 shadow-md">
                                        <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                                    </div>
                                </div>
                            </div>
                        </Link>

                        <Link href="/voltris-optimizer" className="group relative bg-white border border-gray-200 hover:border-blue-300 rounded-3xl p-1 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
                            <div className="absolute inset-0 bg-gradient-to-b from-gray-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                            <div className="relative h-full bg-white rounded-[20px] p-8 flex flex-col items-start overflow-hidden">
                                <div className="w-16 h-16 rounded-2xl bg-gray-100 backdrop-blur-sm border border-gray-200 flex items-center justify-center mb-8 group-hover:bg-blue-100 group-hover:border-blue-200 transition-all duration-300 shadow-md">
                                    <div className="transform transition-transform duration-300 group-hover:scale-110 text-blue-600">
                                        <Monitor className="w-8 h-8" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">Voltris Optimizer</h3>
                                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                                    Software de otimização contínua
                                </p>
                                <div className="mt-auto w-full pt-6 border-t border-gray-200 flex items-center justify-between">
                                    <span className="text-blue-600 text-sm font-medium">Saiba mais</span>
                                    <div className="w-12 h-12 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-900 group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white transition-all duration-300 shadow-md">
                                        <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 brightness-100 contrast-150 mix-blend-overlay pointer-events-none z-0"></div>
                <div className="max-w-4xl mx-auto relative z-10">
                    <div className="space-y-6">
                        {faqItems.map((faq, index) => (
                            <div key={index} className="bg-white/50 backdrop-blur-sm border border-gray-200 rounded-2xl p-6">
                                <h3 className="font-bold text-lg text-gray-900 mb-3">{faq.question}</h3>
                                <p className="text-gray-600" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(faq.answer) }} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}
