'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';



const services = [
  // ... (cole aqui o array de serviços do todos-os-servicos/page.tsx) ...
];

export default function FAQPage() {
  const faqData = [
    {
      question: 'Como funciona o processo de compra?',
      answer: 'Nosso processo de compra é simples e intuitivo. Primeiro, navegue pelos nossos produtos e adicione os itens desejados ao carrinho. Em seguida, vá para o checkout, preencha seus dados de entrega e pagamento. Após a confirmação do pagamento, seu pedido será processado e enviado.'
    },
    {
      question: 'Quais são as formas de pagamento aceitas?',
      answer: 'Aceitamos diversas formas de pagamento, incluindo cartões de crédito (Visa, MasterCard, Elo, Amex), boleto bancário e PIX. Você poderá escolher a opção que preferir na finalização da compra.'
    },
    {
      question: 'Como funcionará o serviço?',
      answer: 'O processo é simples e eficiente: primeiro, você escolhe o serviço desejado e realiza a compra. Em seguida, receberá o contrato do serviço por email. Após fazer login em sua conta, você poderá visualizar sua solicitação no painel e escolher entre atendimento imediato ou agendado. Para realizar o serviço, utilizaremos ferramentas de acesso remoto como AnyDesk ou TeamViewer, que permitem que nossos técnicos acessem seu computador de forma segura para executar o serviço solicitado.'
    },
    {
      question: 'Quanto tempo leva para realizar um serviço?',
      answer: 'O tempo de execução varia de acordo com o serviço solicitado. Uma formatação básica pode levar em torno de 1-2 horas, enquanto serviços mais complexos como recuperação de dados podem levar mais tempo. Durante o atendimento, nosso técnico fornecerá uma estimativa mais precisa.'
    },
    {
      question: 'O serviço é seguro? Como posso confiar no acesso remoto?',
      answer: 'Sim, nosso serviço é totalmente seguro. Utilizamos ferramentas reconhecidas mundialmente como AnyDesk e TeamViewer, que possuem criptografia de ponta a ponta. Além disso, você mantém total controle sobre o acesso ao seu computador e pode encerrar a sessão a qualquer momento.'
    },
    {
      question: 'E se eu perder meus arquivos durante o serviço?',
      answer: 'Antes de qualquer serviço que possa afetar seus arquivos (como formatação), realizamos um backup completo dos dados importantes que você indicar. Além disso, nossos técnicos são treinados para trabalhar com máximo cuidado e segurança.'
    },
    {
      question: 'Vocês oferecem garantia dos serviços?',
      answer: 'Sim, oferecemos garantia em todos os nossos serviços. O período de garantia varia de acordo com o tipo de serviço realizado, mas geralmente é de 30 dias para problemas relacionados diretamente ao serviço prestado.'
    },
    {
      question: 'Como funciona o suporte pós-atendimento?',
      answer: 'Após a conclusão do serviço, você tem acesso ao nosso suporte por 7 dias para tirar dúvidas ou resolver pequenos ajustes relacionados ao serviço realizado. Para problemas diferentes ou após esse período, será necessário um novo atendimento.'
    },
    {
      question: 'Posso agendar o serviço para um horário específico?',
      answer: 'Sim! Oferecemos tanto atendimento imediato quanto agendado. Você pode escolher o melhor horário para você dentro de nossa disponibilidade, incluindo horários noturnos e fins de semana.'
    },
    {
      question: 'O que acontece se o serviço não puder ser concluído remotamente?',
      answer: 'Se identificarmos que o problema não pode ser resolvido remotamente (por exemplo, em caso de problemas físicos no hardware), orientaremos você sobre as melhores opções e, se necessário, indicaremos profissionais confiáveis em sua região.'
    },
    {
      question: 'Vocês atendem a empresas também?',
      answer: 'Sim! Temos planos especiais para empresas, com prioridade no atendimento e possibilidade de contrato de suporte contínuo. Entre em contato conosco para conhecer nossas soluções corporativas.'
    },
    {
      question: 'Como é feito o pagamento dos serviços?',
      answer: 'O pagamento é realizado antes do início do serviço através das opções disponíveis (cartão de crédito, PIX ou boleto). Para empresas com contrato, podem ser estabelecidas condições especiais de pagamento.'
    },
    {
      question: 'Qual a diferença entre formatação e otimização?',
      answer: 'A formatação é um processo mais completo que remove todos os arquivos e programas do computador e reinstala o Windows do zero, enquanto a otimização melhora a performance do sistema sem remover seus dados. A formatação é recomendada quando o computador está com problemas graves, muito lento, ou infectado com vírus. A otimização é ideal para computadores que estão funcionando mas mais lentos do que deveriam.'
    },
    {
      question: 'Como garantir que meus dados estão seguros durante o acesso remoto?',
      answer: 'Utilizamos ferramentas de acesso remoto reconhecidas mundialmente (AnyDesk e TeamViewer) com criptografia de ponta a ponta. Você mantém controle total durante toda a sessão e pode encerrar o acesso a qualquer momento. Não armazenamos suas senhas ou informações pessoais, e todo o processo é monitorado. Além disso, fazemos backup completo de seus dados importantes antes de qualquer alteração no sistema.'
    },
    {
      question: 'Vocês trabalham com computadores Mac ou apenas Windows?',
      answer: 'Atualmente, nosso foco principal é em sistemas Windows. No entanto, oferecemos alguns serviços para Mac, como instalação de programas e suporte básico. Para serviços específicos de Mac, recomendamos entrar em contato conosco para verificar a disponibilidade e detalhes.'
    },
    {
      question: 'O que acontece se o serviço não resolver meu problema?',
      answer: 'Se após a execução completa do serviço o problema persistir, investigamos mais profundamente a causa. Se identificarmos que o problema é diferente do que foi inicialmente relatado ou requer uma abordagem diferente, discutimos as opções com você. Em alguns casos, pode ser necessário um serviço adicional ou uma abordagem diferente, mas sempre mantendo transparência sobre o que será necessário.'
    },
    {
      question: 'Vocês oferecem suporte para empresas?',
      answer: 'Sim! Oferecemos planos especiais para empresas de todos os portes. Nossos serviços empresariais incluem suporte prioritário, contratos mensais ou anuais, atendimento dedicado, relatórios de manutenção preventiva, e suporte em horário estendido ou 24/7 dependendo do plano. Entre em contato conosco para conhecer nossas soluções corporativas personalizadas.'
    },
    {
      question: 'Quanto tempo leva para começar o atendimento após a compra?',
      answer: 'Para atendimento imediato, geralmente começamos em até 30 minutos após a confirmação do pagamento. Se você escolher agendamento, o atendimento ocorrerá no horário combinado. Em horários de pico, pode haver um tempo de espera um pouco maior, mas sempre mantemos você informado sobre o status do seu atendimento.'
    },
    {
      question: 'Vocês podem ajudar com problemas de impressora?',
      answer: 'Sim! Oferecemos serviços completos para impressora, incluindo instalação de drivers, configuração de rede, resolução de problemas de impressão, e conexão de impressoras Wi-Fi. Se o problema for físico no hardware da impressora, orientamos sobre as melhores opções e podemos indicar profissionais especializados em sua região se necessário.'
    },
    {
      question: 'Como funciona o serviço de criação de sites?',
      answer: 'Nosso serviço de criação de sites inclui consulta inicial para entender suas necessidades, proposta personalizada com design e funcionalidades, desenvolvimento do site, testes e ajustes, lançamento, e suporte pós-lançamento. Trabalhamos com tecnologias modernas para criar sites responsivos, rápidos, otimizados para mecanismos de busca, e integrados com ferramentas de marketing digital. O processo geralmente leva de 2 a 4 semanas dependendo da complexidade do projeto.'
    },
    {
      question: 'O serviço é realmente remoto? Preciso enviar meu computador?',
      answer: 'Sim, nosso serviço é 100% remoto! Não é necessário enviar seu computador ou se deslocar. Trabalhamos diretamente no seu computador através de conexão remota segura, de qualquer lugar do Brasil. Você apenas precisa ter internet estável e o computador ligado. Todo o processo é feito online, do diagnóstico à conclusão do serviço.'
    }
  ];

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <>
      {/* Schema.org structured data for FAQ page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqData.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          })
        }}
      />

      <Header />
      <div className="min-h-screen bg-[#171313] pt-24">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-center mb-12">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF]">
              Dúvidas Frequentes
            </span>
          </h1>

          <div className="max-w-3xl mx-auto">
            {faqData.map((faq, index) => (
              <div key={index} className="mb-6">
                <button
                  className={`w-full text-left p-4 rounded-lg transition-all duration-300 ease-in-out flex justify-between items-center ${activeIndex === index
                    ? 'bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-white'
                    : 'bg-[#1c1c1e] text-white hover:bg-[#2a2a2e]'
                    }`}
                  onClick={() => toggleFAQ(index)}
                >
                  <span className="text-lg font-medium">{faq.question}</span>
                  <span
                    className={`transform transition-transform duration-300 ${activeIndex === index ? 'rotate-180' : ''
                      }`}
                  >
                    ▼
                  </span>
                </button>
                <div
                  className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${activeIndex === index ? 'max-h-96' : 'max-h-0'
                    }`}
                >
                  <div className="p-4 bg-[#1c1c1e] text-[#e2e8f0] rounded-b-lg">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* AdSense removido - Política AdSense: Apenas páginas /guias */}
      <Footer />
    </>
  );
} 
