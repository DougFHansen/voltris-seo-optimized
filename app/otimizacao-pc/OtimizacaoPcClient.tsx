'use client';

import Link from 'next/link';
import {
    Zap,
    Shield,
    TrendingUp,
    Wrench,
    Clock,
    Star,
    CheckCircle2,
    Monitor,
    Cpu,
    Database,
    Gamepad2,
    Download,
    ArrowRight,
    ChevronRight
} from 'lucide-react';
import Header from '@/components/Header';
import dynamic from 'next/dynamic';

const Footer = dynamic(() => import('@/components/Footer'), { ssr: false });

export default function OtimizacaoPcClient() {
    const benefits = [
        {
            icon: <Zap className="w-8 h-8 text-blue-500" />,
            title: "Aumento de Velocidade",
            description: "Seu PC vai iniciar e abrir programas até 3x mais rápido"
        },
        {
            icon: <TrendingUp className="w-8 h-8 text-green-500" />,
            title: "Mais FPS em Jogos",
            description: "Aumente seu FPS em até 40% com otimizações específicas"
        },
        {
            icon: <Shield className="w-8 h-8 text-purple-500" />,
            title: "Sistema Mais Seguro",
            description: "Remoção de ameaças e configurações de segurança otimizadas"
        },
        {
            icon: <Clock className="w-8 h-8 text-cyan-500" />,
            title: "Mais Produtividade",
            description: "Tarefas diárias executadas mais rapidamente, economizando tempo"
        }
    ];

    const services = [
        {
            icon: <Gamepad2 className="w-8 h-8 text-blue-500" />,
            title: "Otimização para Jogos",
            description: "Aumente FPS, reduza input lag e melhore a experiência de gaming",
            includes: ["Ajustes de GPU", "Configurações de rede", "Otimização de RAM", "Redução de stutter"]
        },
        {
            icon: <Monitor className="w-8 h-8 text-green-500" />,
            title: "Otimização de Sistema",
            description: "Acelere inicialização, abertura de programas e navegação",
            includes: ["Limpeza de sistema", "Desfragmentação", "Remoção de bloatware", "Configurações de energia"]
        },
        {
            icon: <Cpu className="w-8 h-8 text-purple-500" />,
            title: "Otimização Profissional",
            description: "Para empresas e usuários avançados com necessidades específicas",
            includes: ["Configurações avançadas", "Otimização de rede", "Personalização", "Suporte técnico"]
        },
        {
            icon: <Database className="w-8 h-8 text-cyan-500" />,
            title: "Otimização de Banco de Dados",
            description: "Para estações de trabalho com softwares pesados",
            includes: ["Ajustes de I/O", "Otimização de cache", "Configurações de memória", "Desempenho de disco"]
        }
    ];

    const testimonials = [
        {
            name: "João Silva",
            role: "Designer Gráfico",
            text: "Meu PC estava horrível, com programas travando. Depois da otimização, tudo roda perfeitamente!",
            rating: 5,
            color: "from-[#FF4B6B] to-[#FF8F6B]"
        },
        {
            name: "Patrícia Costa",
            role: "Streammer",
            text: "Minha transmissão melhorou absurdamente. Agora tenho mais FPS e menos problemas de conexão.",
            rating: 5,
            color: "from-[#8B31FF] to-[#B96BFF]"
        },
        {
            name: "Roberto Oliveira",
            role: "Empresário",
            text: "Contratei para otimizar os PCs da empresa. A produtividade aumentou consideravelmente.",
            rating: 5,
            color: "from-[#31A8FF] to-[#6BA8FF]"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <Header />
            {/* Hero Section */}
            <section className="relative py-20 md:py-32 px-4">
                {/* Background Ambience */}
                <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full bg-purple-100/50 blur-[120px] pointer-events-none" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-100/50 blur-[100px] pointer-events-none" />

                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 border border-blue-200 backdrop-blur-md mb-4">
                                <span className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                                <span className="text-xs sm:text-sm font-medium bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text tracking-wide">Otimização Profissional de PC</span>
                            </div>

                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight tracking-tight font-sans mb-6">
                                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text">Otimização de PC Windows</span> <br className="hidden lg:block" />
                                <span className="block mt-2 text-2xl sm:text-3xl lg:text-4xl text-gray-700">Máxima Performance para Jogos, Trabalho e Empresas</span>
                            </h1>

                            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                Serviço profissional de otimização de sistema Windows. Aumentamos o FPS em jogos,
                                reduzimos o input lag e aceleramos o desempenho geral para profissionais e empresas em todo o Brasil.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                                <Link
                                    href="/otimizacao-pc"
                                    className="group relative inline-flex items-center justify-center px-8 py-4 font-semibold text-white transition-all duration-200 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-lg hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg hover:shadow-xl"
                                >
                                    <span className="mr-2">Solicitar Otimização</span>
                                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                                <Link
                                    href="https://wa.me/5511996716235?text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20a%20otimiza%C3%A7%C3%A3o%20de%20computador"
                                    className="inline-flex items-center justify-center px-8 py-4 font-semibold text-[#050510] transition-all duration-200 bg-[#00FF94] rounded-lg hover:bg-[#00CC76] hover:shadow-[0_0_20px_rgba(0,255,148,0.4)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00FF94]"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24" className="mr-2">
                                        <path d="M17.472 14.387c-.3-.1-1.7-.8-1.9-1.4-.3-.5-.1-.8.2-1.1.3-.3.6-.7.9-1.1.3-.4.4-.5.6-.5.2 0 .4-.1.5-.4.1-.3 0-.8-.4-1.5-.5-.8-1.4-2.1-2.6-2.1-1.3 0-2.1.8-2.9 1.6-.8.8-1.3 1.3-2.5 1.3-.8 0-1.4-.4-1.9-.9-.5-.5-.7-.7-1.2-1.1 0 0-.4-.3-.6-.8-.2-.5-.6-1.5-.6-2.9 0-1.4.9-2.7 2.1-3.7 1.1-1 2.5-1.6 4.1-1.6 1.7 0 3.1.6 4.2 1.6 1 .9 1.6 2.1 1.6 3.5 0 1.4-.6 2.6-1.6 3.4zm-6.5-3.2c.2 1.1.8 2 1.6 2.6.9.6 2.1.9 3.2.9 1.1 0 2.3-.3 3.2-.9.8-.6 1.4-1.5 1.6-2.6.2-1.1-.1-2.3-.7-3.2-.6-.8-1.5-1.4-2.6-1.6-1.1-.2-2.3.1-3.2.7-.8.6-1.4 1.5-1.6 2.6z" />
                                    </svg>
                                    Falar com Especialista
                                </Link>
                            </div>

                            <div className="flex flex-wrap gap-6 text-sm text-gray-500">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="text-emerald-600" size={20} />
                                    <span>Técnicos Certificados</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="text-emerald-600" size={20} />
                                    <span>Garantia de 30 dias</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="text-emerald-600" size={20} />
                                    <span>Resultados Comprovados</span>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-gray-200 shadow-2xl">
                                <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg h-64 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
                                            <Zap className="w-8 h-8 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">Otimização de PC</h3>
                                        <p className="text-gray-600 text-sm">Aumente velocidade e desempenho do seu computador</p>
                                    </div>
                                </div>
                                <div className="mt-6 grid grid-cols-3 gap-4">
                                    <div className="flex flex-col items-center text-center">
                                        <TrendingUp className="text-emerald-600 mb-2" size={24} />
                                        <p className="font-bold text-gray-900">+3x</p>
                                        <p className="text-xs text-gray-500">Velocidade</p>
                                    </div>
                                    <div className="flex flex-col items-center text-center">
                                        <Zap className="text-yellow-500 mb-2" size={24} />
                                        <p className="font-bold text-gray-900">+40%</p>
                                        <p className="text-xs text-gray-500">FPS</p>
                                    </div>
                                    <div className="flex flex-col items-center text-center">
                                        <Clock className="text-blue-600 mb-2" size={24} />
                                        <p className="font-bold text-gray-900">-60%</p>
                                        <p className="text-xs text-gray-500">Tempo de inicialização</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-white relative overflow-hidden">
                <div className="max-w-6xl mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text">500+</div>
                            <p className="text-gray-500">PCs Otimizados</p>
                        </div>
                        <div>
                            <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 text-transparent bg-clip-text">98%</div>
                            <p className="text-gray-500">Satisfação</p>
                        </div>
                        <div>
                            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-pink-600 to-purple-600 text-transparent bg-clip-text">7+</div>
                            <p className="text-gray-500">Anos de Experiência</p>
                        </div>
                        <div>
                            <div className="text-3xl font-bold bg-gradient-to-r from-pink-600 via-blue-600 to-purple-600 text-transparent bg-clip-text">24/7</div>
                            <p className="text-gray-500">Suporte</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-20 px-4 relative overflow-hidden bg-gray-50">
                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 border border-blue-200 mb-6">
                            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                            <span className="text-xs font-bold text-blue-600 tracking-widest uppercase">Benefícios da Otimização</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 tracking-tight">
                            Transforme seu PC com nossa <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">Otimização Profissional</span>
                        </h2>
                        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            Resultados comprovados para diferentes necessidades
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                        {benefits.map((benefit, index) => (
                            <div key={index} className="group relative bg-white border border-gray-200 rounded-3xl p-8 hover:border-gray-300 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                                <div className="relative z-10 text-center">
                                    <div className="mx-auto mb-6">
                                        <div className="w-16 h-16 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center mx-auto group-hover:bg-blue-100 group-hover:border-blue-200 transition-all duration-300 shadow-sm">
                                            <div className="transform transition-transform duration-300 group-hover:scale-110 text-blue-600">
                                                {benefit.icon}
                                            </div>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:via-purple-600 group-hover:to-pink-600 transition-all">{benefit.title}</h3>
                                    <p className="text-gray-600">{benefit.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-20 bg-white px-4 relative overflow-hidden">
                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 tracking-tight">
                            Tipos de <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">Otimização</span>
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Serviços específicos para diferentes necessidades
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
                        {services.map((service, index) => (
                            <div key={index} className="group relative bg-white border border-gray-200 hover:border-purple-300 rounded-3xl p-1 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
                                <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                                <div className="relative h-full bg-gray-50 rounded-[20px] p-8 flex flex-col items-start overflow-hidden">
                                    <div className="flex items-start gap-4">
                                        <div className="mt-1">
                                            <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center group-hover:bg-blue-100 group-hover:border-blue-200 transition-all duration-300 shadow-sm">
                                                <div className="transform transition-transform duration-300 group-hover:scale-110 text-blue-600">
                                                    {service.icon}
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:via-purple-600 group-hover:to-pink-600 transition-all">{service.title}</h3>
                                            <p className="text-gray-600 mb-4">{service.description}</p>

                                            <ul className="space-y-2">
                                                {service.includes.map((item, idx) => (
                                                    <li key={idx} className="flex items-center gap-2">
                                                        <CheckCircle2 className="text-emerald-600" size={16} />
                                                        <span className="text-sm text-gray-700">{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section className="py-20 px-4 relative overflow-hidden bg-gray-50">
                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 tracking-tight">
                            Nosso <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">Processo</span>
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Um processo claro e eficiente para otimizar seu PC
                        </p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            {
                                step: 1,
                                title: "Análise Inicial",
                                description: "Diagnosticamos seu PC para identificar gargalos e problemas"
                            },
                            {
                                step: 2,
                                title: "Planejamento",
                                description: "Elaboramos um plano personalizado de otimização"
                            },
                            {
                                step: 3,
                                title: "Execução",
                                description: "Aplicamos as otimizações de forma segura e eficiente"
                            },
                            {
                                step: 4,
                                title: "Testes",
                                description: "Validamos os resultados e garantimos a qualidade"
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
            <section className="py-20 bg-white px-4 relative overflow-hidden">
                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 tracking-tight">
                            O Que Nossos Clientes <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">Dizem</span>
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Resultados reais de quem já otimizou seu PC conosco
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="group relative bg-white border border-gray-200 rounded-3xl p-8 hover:border-gray-300 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
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
                                        <div className="text-xs text-gray-500 uppercase tracking-wider font-medium">{testimonial.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Related Services */}
            <section className="py-20 bg-gray-50 px-4 relative overflow-hidden">
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
                        <Link href="/formatar-windows" className="group relative bg-white border border-gray-200 hover:border-purple-300 rounded-3xl p-1 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
                            <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                            <div className="relative h-full bg-gray-50 rounded-[20px] p-8 flex flex-col items-start overflow-hidden">
                                <div className="w-16 h-16 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center mb-8 group-hover:bg-blue-100 group-hover:border-blue-200 transition-all duration-300 shadow-sm">
                                    <div className="transform transition-transform duration-300 group-hover:scale-110 text-blue-600">
                                        <Download className="w-8 h-8" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:via-purple-600 group-hover:to-pink-600 transition-all">Formatação de Windows</h3>
                                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                                    Instalação limpa e configurações otimizadas
                                </p>
                                <div className="mt-auto w-full pt-6 border-t border-gray-200 flex items-center justify-between">
                                    <span className="text-blue-600 text-sm font-medium">Saiba mais</span>
                                    <div className="w-12 h-12 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-700 group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
                                        <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                                    </div>
                                </div>
                            </div>
                        </Link>

                        <Link href="/formatar-windows" className="group relative bg-white border border-gray-200 hover:border-purple-300 rounded-3xl p-1 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
                            <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                            <div className="relative h-full bg-gray-50 rounded-[20px] p-8 flex flex-col items-start overflow-hidden">
                                <div className="w-16 h-16 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center mb-8 group-hover:bg-purple-100 group-hover:border-purple-200 transition-all duration-300 shadow-sm">
                                    <div className="transform transition-transform duration-300 group-hover:scale-110 text-purple-600">
                                        <Wrench className="w-8 h-8" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:via-purple-600 group-hover:to-pink-600 transition-all">Suporte Técnico Remoto</h3>
                                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                                    Resolução de problemas online de forma rápida e segura
                                </p>
                                <div className="mt-auto w-full pt-6 border-t border-gray-200 flex items-center justify-between">
                                    <span className="text-purple-600 text-sm font-medium">Saiba mais</span>
                                    <div className="w-12 h-12 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-700 group-hover:bg-purple-600 group-hover:border-purple-600 group-hover:text-white transition-all duration-300 shadow-sm">
                                        <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                                    </div>
                                </div>
                            </div>
                        </Link>

                        <Link href="/voltris-optimizer" className="group relative bg-white border border-gray-200 hover:border-purple-300 rounded-3xl p-1 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
                            <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                            <div className="relative h-full bg-gray-50 rounded-[20px] p-8 flex flex-col items-start overflow-hidden">
                                <div className="w-16 h-16 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center mb-8 group-hover:bg-blue-100 group-hover:border-blue-200 transition-all duration-300 shadow-sm">
                                    <div className="transform transition-transform duration-300 group-hover:scale-110 text-blue-600">
                                        <Monitor className="w-8 h-8" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:via-purple-600 group-hover:to-pink-600 transition-all">Voltris Optimizer</h3>
                                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                                    Software de otimização contínua
                                </p>
                                <div className="mt-auto w-full pt-6 border-t border-gray-200 flex items-center justify-between">
                                    <span className="text-blue-600 text-sm font-medium">Saiba mais</span>
                                    <div className="w-12 h-12 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-700 group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
                                        <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 relative overflow-hidden bg-white">
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Pronto para otimizar seu PC?</h2>
                    <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                        Receba um orçamento personalizado em minutos
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/otimizacao-pc"
                            className="group relative inline-flex items-center justify-center px-8 py-4 font-semibold text-white transition-all duration-200 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-lg hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg hover:shadow-xl"
                        >
                            <span className="mr-2">Solicitar Otimização</span>
                            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                        <Link
                            href="https://wa.me/5511996716235?text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20a%20otimiza%C3%A7%C3%A3o%20de%20computador"
                            className="inline-flex items-center justify-center px-8 py-4 font-semibold text-[#050510] transition-all duration-200 bg-[#00FF94] rounded-lg hover:bg-[#00CC76] hover:shadow-[0_0_20px_rgba(0,255,148,0.4)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00FF94]"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24" className="mr-2">
                                <path d="M17.472 14.387c-.3-.1-1.7-.8-1.9-1.4-.3-.5-.1-.8.2-1.1.3-.3.6-.7.9-1.1.3-.4.4-.5.6-.5.2 0 .4-.1.5-.4.1-.3 0-.8-.4-1.5-.5-.8-1.4-2.1-2.6-2.1-1.3 0-2.1.8-2.9 1.6-.8.8-1.3 1.3-2.5 1.3-.8 0-1.4-.4-1.9-.9-.5-.5-.7-.7-1.2-1.1 0 0-.4-.3-.6-.8-.2-.5-.6-1.5-.6-2.9 0-1.4.9-2.7 2.1-3.7 1.1-1 2.5-1.6 4.1-1.6 1.7 0 3.1.6 4.2 1.6 1 .9 1.6 2.1 1.6 3.5 0 1.4-.6 2.6-1.6 3.4zm-6.5-3.2c.2 1.1.8 2 1.6 2.6.9.6 2.1.9 3.2.9 1.1 0 2.3-.3 3.2-.9.8-.6 1.4-1.5 1.6-2.6.2-1.1-.1-2.3-.7-3.2-.6-.8-1.5-1.4-2.6-1.6-1.1-.2-2.3.1-3.2.7-.8.6-1.4 1.5-1.6 2.6z" />
                            </svg>
                            Falar com Especialista
                        </Link>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}
