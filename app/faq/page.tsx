'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnimatedSection from '@/components/AnimatedSection';
import TechFloatingElements from '@/components/TechFloatingElements';
import { FiPlus, FiMinus, FiHelpCircle } from 'react-icons/fi';

export default function FAQPage() {
  const faqData = [
    {
      category: "Financeiro & Compra",
      questions: [
        {
          question: 'Como funciona o processo de compra?',
          answer: 'Nosso processo de compra é simples e intuitivo. Primeiro, navegue pelos nossos produtos e adicione os itens desejados ao carrinho. Em seguida, vá para o checkout, preencha seus dados de entrega e pagamento. Após a confirmação do pagamento, seu pedido será processado e enviado.'
        },
        {
          question: 'Quais são as formas de pagamento aceitas?',
          answer: 'Aceitamos diversas formas de pagamento, incluindo cartões de crédito (Visa, MasterCard, Elo, Amex), boleto bancário e PIX. Você poderá escolher a opção que preferir na finalização da compra.'
        },
        {
          question: 'Vocês atendem a empresas também?',
          answer: 'Sim! Temos planos especiais para empresas, com prioridade no atendimento e possibilidade de contrato de suporte contínuo. Entre em contato conosco para conhecer nossas soluções corporativas.'
        },
      ]
    },
    {
      category: "Suporte Técnico",
      questions: [
        {
          question: 'Como funcionará o serviço?',
          answer: 'O processo é simples e eficiente: primeiro, você escolhe o serviço desejado e realiza a compra. Em seguida, receberá o contrato do serviço por email. Após fazer login em sua conta, você poderá visualizar sua solicitação no painel e escolher entre atendimento imediato ou agendado. Para realizar o serviço, utilizaremos ferramentas de acesso remoto como AnyDesk ou TeamViewer, que permitem que nossos técnicos acessem seu computador de forma segura para executar o serviço solicitado.'
        },
        {
          question: 'O serviço é seguro? Como posso confiar no acesso remoto?',
          answer: 'Sim, nosso serviço é totalmente seguro. Utilizamos ferramentas reconhecidas mundialmente como AnyDesk e TeamViewer, que possuem criptografia de ponta a ponta. Além disso, você mantém total controle sobre o acesso ao seu computador e pode encerrar a sessão a qualquer momento.'
        },
        {
          question: 'Quanto tempo leva para realizar um serviço?',
          answer: 'O tempo de execução varia de acordo com o serviço solicitado. Uma formatação básica pode levar em torno de 1-2 horas, enquanto serviços mais complexos como recuperação de dados podem levar mais tempo. Durante o atendimento, nosso técnico fornecerá uma estimativa mais precisa.'
        },
        {
          question: 'E se eu perder meus arquivos durante o serviço?',
          answer: 'Antes de qualquer serviço que possa afetar seus arquivos (como formatação), realizamos um backup completo dos dados importantes que você indicar. Além disso, nossos técnicos são treinados para trabalhar com máximo cuidado e segurança.'
        },
        {
          question: 'Como garantir que meus dados estão seguros durante o acesso remoto?',
          answer: 'Utilizamos ferramentas de acesso remoto reconhecidas mundialmente (AnyDesk e TeamViewer) com criptografia de ponta a ponta. Você mantém controle total durante toda a sessão e pode encerrar o acesso a qualquer momento. Não armazenamos suas senhas ou informações pessoais, e todo o processo é monitorado. Além disso, fazemos backup completo de seus dados importantes antes de qualquer alteração no sistema.'
        },
      ]
    },
    {
      category: "Garantia & Pós-Venda",
      questions: [
        {
          question: 'Vocês oferecem garantia dos serviços?',
          answer: 'Sim, oferecemos garantia em todos os nossos serviços. O período de garantia varia de acordo com o tipo de serviço realizado, mas geralmente é de 30 dias para problemas relacionados diretamente ao serviço prestado.'
        },
        {
          question: 'Como funciona o suporte pós-atendimento?',
          answer: 'Após a conclusão do serviço, você tem acesso ao nosso suporte por 7 dias para tirar dúvidas ou resolver pequenos ajustes relacionados ao serviço realizado. Para problemas diferentes ou após esse período, será necessário um novo atendimento.'
        },
        {
          question: 'O que acontece se o serviço não resolver meu problema?',
          answer: 'Se após a execução completa do serviço o problema persistir, investigamos mais profundamente a causa. Se identificarmos que o problema é diferente do que foi inicialmente relatado ou requer uma abordagem diferente, discutimos as opções com você. Em alguns casos, pode ser necessário um serviço adicional ou uma abordagem diferente, mas sempre mantendo transparência sobre o que será necessário.'
        },
      ]
    }
  ];

  const [activeIndex, setActiveIndex] = useState<string | null>(null);

  const toggleFAQ = (id: string) => {
    setActiveIndex(activeIndex === id ? null : id);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#0A0A0F] text-white overflow-x-hidden selection:bg-purple-500/30 selection:text-white pb-20">

        {/* Hero Section */}
        <div className="relative pt-40 pb-20 px-4 mb-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,49,255,0.1)_0%,transparent_70%)] pointer-events-none"></div>
          <TechFloatingElements />

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md rounded-full px-4 py-2 mb-6 border border-white/10">
                <FiHelpCircle className="text-purple-400" />
                <span className="text-gray-300 text-sm font-medium">Central de Ajuda</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                Como podemos <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] animate-gradient-x">
                  ajudar você hoje?
                </span>
              </h1>

              <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                Encontre respostas rápidas para suas dúvidas sobre nossos serviços, pagamentos e suporte técnico seguro.
              </p>
            </motion.div>
          </div>
        </div>

        {/* FAQ List */}
        <div className="max-w-3xl mx-auto px-4 relative z-10">
          {faqData.map((section, sIdx) => (
            <AnimatedSection key={sIdx} delay={sIdx * 0.1}>
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 pl-4 border-l-4 border-purple-500">
                  {section.category}
                </h2>

                <div className="space-y-4">
                  {section.questions.map((faq, qIdx) => {
                    const id = `${sIdx}-${qIdx}`;
                    const isOpen = activeIndex === id;

                    return (
                      <motion.div
                        key={id}
                        initial={false}
                        animate={{ backgroundColor: isOpen ? "rgba(30, 30, 34, 0.8)" : "rgba(30, 30, 34, 0.4)" }}
                        className="rounded-2xl border border-white/5 overflow-hidden transition-colors hover:border-purple-500/30"
                      >
                        <button
                          onClick={() => toggleFAQ(id)}
                          className="w-full text-left p-6 flex justify-between items-center gap-4 group"
                        >
                          <span className={`text-lg font-medium transition-colors ${isOpen ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                            {faq.question}
                          </span>
                          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${isOpen ? 'bg-gradient-to-r from-[#FF4B6B] to-[#8B31FF] rotate-45' : 'bg-white/10 group-hover:bg-white/20'}`}>
                            <FiPlus className={`w-5 h-5 ${isOpen ? 'text-white' : 'text-gray-400'}`} />
                          </div>
                        </button>

                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <div className="px-6 pb-6 pt-0 text-gray-400 leading-relaxed border-t border-white/5 mt-2">
                                {faq.answer}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

      </div>
      <Footer />
    </>
  );
}
