'use client';

import { useState } from 'react';
// Import Font Awesome icons if using a React library like react-icons
// import { FaChevronDown } from 'react-icons/fa'; 

// Assuming Font Awesome is loaded globally via app/layout.tsx for now

interface FaqItemProps {
  question: string;
  answer: string;
}

function FaqItem({ question, answer }: FaqItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`mb-4 rounded-lg shadow-md overflow-hidden ${isOpen ? 'active' : ''}`}>
      <button className={`w-full border-none p-5 text-lg font-semibold text-white text-left cursor-pointer flex justify-between items-center transition-colors duration-300 ease-in-out ${isOpen ? 'bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e]' : 'bg-[#1c1c1e] hover:bg-[#2a2a2e]'}`} onClick={toggleOpen}>
        <span>{question}</span>
        {/* Replace SVG with react-icons if used */}
        <svg className={`w-6 h-6 transition-transform duration-300 ease-in-out stroke-[#8B31FF] ${isOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
            strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
        {/* Example with react-icons: <FaChevronDown className={`faq-icon ${isOpen ? 'rotate-180' : ''}`} /> */}
      </button>
      {/* The actual height transition will be handled by CSS classes */}
      <div className={`overflow-hidden transition-[max-height] duration-400 ease-out ${isOpen ? 'max-h-[1000px] py-5 px-5' : 'max-h-0 py-0 px-5'}`}
        style={{background: isOpen ? 'linear-gradient(135deg, #1c1c1e 0%, #2a2a2e 100%)' : undefined}}>
        <p className="text-[#E2E8F0] text-base leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

export default function FAQSection() {
  const faqData = [
    {
      question: 'Como funciona o processo de compra?',
      answer: 'Nosso processo de compra é simples e intuitivo. Primeiro, navegue pelos nossos produtos e escolha o serviço desejado. Em seguida, após escolher o serviço, você será redirecionado para o Dashboard (necessário criar conta ou estar logado). Após a confirmação do pagamento via WhatsApp, seu pedido será processado.'
    },
    {
      question: 'Quais são as formas de pagamento aceitas?',
      answer: 'Aceitamos diversas formas de pagamento, incluindo cartões de crédito (Visa, MasterCard, Elo, Amex), boleto bancário e PIX. Você poderá escolher a opção que preferir na finalização da compra.'
    },
    {
      question: 'Como funcionará o serviço?',
      answer: 'O processo é simples e eficiente: primeiro, você escolhe o serviço desejado e realiza a compra. Após fazer login em sua conta, você poderá visualizar sua solicitação no painel e clicar no botão "Atendimento WhatsApp". Para realizar o serviço, utilizaremos ferramentas de acesso remoto como AnyDesk ou TeamViewer, que permitem que nossos técnicos acessem seu computador de forma segura para executar o serviço solicitado.'
    },
    {
      question: 'Qual o prazo de entrega?',
      answer: 'Depende do serviço escolhido, de como se encontra a máquina em si, e da disponibilidade do cliente em realizar o serviço. Não podemos garantir um prazo fixo, mas iremos fazer o possível para realizar o serviço o mais rápido possível.'
    },
    {
      question: 'Posso trocar ou devolver um produto?',
      answer: 'Sim, nossa política de trocas e devoluções segue o Código de Defesa do Consumidor. Você tem até 7 dias corridos após o recebimento para solicitar a devolução por motivos técnicos comprovados da nossa parte.'
    }
  ];

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-16 px-4 text-center" id="doubts">
      <div className="max-w-3xl mx-auto">
        <div className="space-y-6">
          {faqData.map((faq, index) => (
            <div key={index} className="group transition-all duration-300">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full text-left bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-6 rounded-2xl border border-[#FF4B6B]/10 flex items-start gap-4 shadow-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_30px_rgba(139,49,255,0.1)] hover:border-[#FF4B6B]/30 focus:outline-none"
              >
                <i className={`fas ${activeIndex === index ? 'fa-chevron-up' : 'fa-chevron-down'} text-[#31A8FF] text-xl transition-transform duration-300 mt-1`}></i>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:bg-gradient-to-r group-hover:from-[#FF4B6B] group-hover:via-[#8B31FF] group-hover:to-[#31A8FF] group-hover:text-transparent group-hover:bg-clip-text transition-colors duration-300">{faq.question}</h3>
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      activeIndex === index ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <p className="text-[#e2e8f0]">{faq.answer}</p>
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>
        
        <div className="mt-12">
          <a
            href="/faq"
            className="inline-flex items-center px-6 py-2 rounded-lg bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-white font-semibold hover:shadow-[0_0_20px_rgba(139,49,255,0.3)] transition-all duration-300 ease-out hover:scale-105"
          >
            Ver mais dúvidas
          </a>
        </div>
      </div>
    </section>
  );
} 