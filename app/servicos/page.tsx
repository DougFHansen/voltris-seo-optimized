"use client";
import { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import Link from "next/link";
import NewsletterForm from '@/components/NewsletterForm';
import Ticket from '@/components/tickets/TicketList';
import type { Ticket as TicketType } from '@/types/ticket';

type ServiceOption = {
  id: string;
  title: string;
  price: number;
  description: string;
  categoryName: string;
  serviceName: string;
  redirectTo?: string;
};

type ServiceCategory = {
  id: string;
  title: string;
  options: ServiceOption[];
};

type SchedulingType = 'now' | 'schedule' | 'later' | null;

type FormattingQuestions = {
  bootNormally: boolean | null;
  showsLogo: boolean | null;
  hasRequirements: boolean | null;
  hasWindows: boolean | null;
  hasInternet: boolean | null;
  hasPendrive: boolean | null;
  hasOtherComputer: boolean | null;
};

// Add this at the top of the file after the imports
const SuccessModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full transform transition-all duration-300 scale-100 opacity-100 animate-modal-appear">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] p-[2px]">
            <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center">
              <svg className="w-8 h-8 text-[#8B31FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-transparent bg-clip-text">
            Progresso Salvo!
          </h3>
          <p className="text-gray-300 mb-6">
            Quando você voltar, continuará exatamente de onde parou.
          </p>
          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] rounded-lg text-white font-medium hover:opacity-90 transition-all duration-300 transform hover:scale-[1.02]"
          >
            Ok, vou providenciar e volto
          </button>
        </div>
      </div>
    </div>
  );
};

// Add this component after the SuccessModal component
const ReturnModal = ({ isOpen, onClose, onContinue }: { isOpen: boolean; onClose: () => void; onContinue: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full transform transition-all duration-300 scale-100 opacity-100 animate-modal-appear">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] p-[2px]">
            <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center">
              <svg className="w-8 h-8 text-[#8B31FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-transparent bg-clip-text">
            Bem-vindo de volta!
          </h3>
          <p className="text-gray-300 mb-6">
            Você conseguiu providenciar o pen drive e acesso a outro computador com internet?
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={onContinue}
              className="w-full py-3 px-4 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] rounded-lg text-white font-medium hover:opacity-90 transition-all duration-300 transform hover:scale-[1.02]"
            >
              Sim, tenho tudo pronto
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 px-4 bg-gray-700 rounded-lg text-gray-300 font-medium hover:bg-gray-600 transition-all duration-300"
            >
              Ainda não, preciso de mais tempo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ServicesPage() {
  const router = useRouter();
  const supabase = createClient();
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [selectedServices, setSelectedServices] = useState<ServiceOption[]>([]);
  const [schedulingType, setSchedulingType] = useState<SchedulingType>(null);
  const [appointmentDateTime, setAppointmentDateTime] = useState<string>('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [formattingAnswers, setFormattingAnswers] = useState<FormattingQuestions>({
    bootNormally: null,
    showsLogo: null,
    hasRequirements: null,
    hasWindows: null,
    hasInternet: null,
    hasPendrive: null,
    hasOtherComputer: null
  });
  const [isSavingProgress, setIsSavingProgress] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const hasScrolled = useRef(false);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [initialServiceParam, setInitialServiceParam] = useState<string | null>(null);
  const [shouldScroll, setShouldScroll] = useState(true);
  const initialRender = useRef(true);
  const [tickets, setTickets] = useState<Required<TicketType>[]>([]);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const formRef = useRef<HTMLDivElement>(null); // Referência para o formulário

  const serviceCategories: ServiceCategory[] = [
    {
      id: 'formatacao',
      title: 'Formatação Completa',
      options: [
        {
          id: 'formatacao_basica',
          title: 'Básica',
          price: 99.90,
          description: 'Backup, formatação, instalação de drivers e atualizações.',
          categoryName: 'Formatação Completa',
          serviceName: 'Formatação Básica'
        },
        {
          id: 'formatacao_media',
          title: 'Média',
          price: 149.90,
          description: 'Inclui "Básica" + antivírus e otimização básica.',
          categoryName: 'Formatação Completa',
          serviceName: 'Formatação Média'
        },
        {
          id: 'formatacao_avancada',
          title: 'Avançada',
          price: 199.90,
          description: 'Inclui "Média" + otimização média de desempenho.',
          categoryName: 'Formatação Completa',
          serviceName: 'Formatação Avançada'
        },
        {
          id: 'formatacao_corporativa',
          title: 'Corporativa',
          price: 349.90,
          description: 'Inclui "Avançada" + Pacote Office (permanente*) e otimização avançada.',
          categoryName: 'Formatação Completa',
          serviceName: 'Formatação Corporativa'
        },
        {
          id: 'formatacao_gamer',
          title: 'Gamer',
          price: 449.90,
          description: 'Inclui "Avançada" + Pacote Office (opcional) e otimização extrema para jogos (FPS, input lag, etc.).',
          categoryName: 'Formatação Completa',
          serviceName: 'Formatação Gamer'
        }
      ]
    },
    {
      id: 'otimizacao',
      title: 'Otimização de Desempenho (Sem Formatar)',
      options: [
        {
          id: 'otimizacao_basica',
          title: 'Básica',
          price: 79.90,
          description: 'Drivers, atualizações, correção de erros e otimização básica.',
          categoryName: 'Otimização de Desempenho',
          serviceName: 'Otimização Básica'
        },
        {
          id: 'otimizacao_media',
          title: 'Média',
          price: 99.90,
          description: 'Inclui "Básica" + otimização média de performance.',
          categoryName: 'Otimização de Desempenho',
          serviceName: 'Otimização Média'
        },
        {
          id: 'otimizacao_avancada',
          title: 'Avançada',
          price: 149.90,
          description: 'Inclui "Média" + otimização avançada de performance.',
          categoryName: 'Otimização de Desempenho',
          serviceName: 'Otimização Avançada'
        }
      ]
    },
    {
      id: 'correcao_windows',
      title: 'Correção de Erros no Windows',
      options: [
        {
          id: 'correcao_windows',
          title: 'Correção de Erros no Windows',
          price: 49.90,
          description: 'Solução remota de problemas e erros no seu sistema Windows. Correção de erros do sistema, reparo de arquivos corrompidos, solução de problemas de inicialização, recuperação de sistema, diagnóstico completo e relatório detalhado.',
          categoryName: 'Correções de Erros no Windows',
          serviceName: 'Correção de Erros no Windows'
        }
      ]
    },
    {
      id: 'instalacao_impressora',
      title: 'Instalação de Impressora',
      options: [
        {
          id: 'impressora_basica',
          title: 'Instalação de Impressora',
          price: 49.90,
          description: 'Instalação simples, driver e teste de impressão local.',
          categoryName: 'Instalação de Impressora',
          serviceName: 'Instalação de Impressora'
        }
      ]
    },
    {
      id: 'remocao_virus',
      title: 'Remoção de Vírus',
      options: [
        {
          id: 'virus_basica',
          title: 'Remoção de Vírus',
          price: 39.90,
          description: 'Varredura e remoção de vírus simples, malware e spyware.',
          categoryName: 'Remoção de Vírus',
          serviceName: 'Remoção de Vírus'
        }
      ]
    },
    {
      id: 'recuperacao',
      title: 'Recuperação de Dados',
      options: [
        {
          id: 'recuperacao_basica',
          title: 'Básica',
          price: 100,
          description: 'Recuperação de arquivos deletados/corrompidos (softwares padrão).',
          categoryName: 'Recuperação de Dados',
          serviceName: 'Recuperação Básica'
        },
        {
          id: 'recuperacao_media',
          title: 'Média',
          price: 150,
          description: 'Casos complexos, ferramentas especializadas, análise de setores.',
          categoryName: 'Recuperação de Dados',
          serviceName: 'Recuperação Média'
        },
        {
          id: 'recuperacao_avancada',
          title: 'Avançada',
          price: 200,
          description: 'Discos com falhas graves, clonagem, tratamento de bad blocks.',
          categoryName: 'Recuperação de Dados',
          serviceName: 'Recuperação Avançada'
        }
      ]
    },
  ];

  // Check authentication status and restore form data if available
  useEffect(() => {
    const checkAuthAndRestoreForm = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);

      if (session) {
        const savedFormData = sessionStorage.getItem('serviceFormData');
        if (savedFormData) {
          try {
            const formData = JSON.parse(savedFormData);
            setSelectedServices(formData.selectedServices);
            setSchedulingType(formData.schedulingType);
            setAppointmentDateTime(formData.appointmentDateTime);
            setAdditionalInfo(formData.additionalInfo);
            setFormattingAnswers(formData.formattingAnswers);

            if (validateForm()) {
              await handleSubmitService();
            }
          } catch (error) {
            console.error('Error restoring form data:', error);
          }
        }
      }
    };
    checkAuthAndRestoreForm();
  }, [supabase.auth]);

  // Efeito único para lidar com a inicialização do serviço
  useEffect(() => {
    if (!initialRender.current) return;
    
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const abrirParam = params.get('abrir');
      if (abrirParam) {
        const category = serviceCategories.find(category => category.id === abrirParam);
        if (category) {
          setSelectedCategory(category);
          setOpenCategory(abrirParam);
          // Agenda o scroll para depois que o acordeão abrir
          const timer = setTimeout(() => {
            const element = document.getElementById(abrirParam);
            if (element) {
              const header = document.querySelector('header');
              const offset = header ? header.offsetHeight + 20 : 20;
              const elementPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
              window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
              });
            }
          }, 400);
          return () => clearTimeout(timer);
        }
      } else {
        setOpenCategory(null);
        setSelectedCategory(null);
      }
    }
    
    initialRender.current = false;
  }, []);

  // Reset do estado de scroll quando mudar de página
  useEffect(() => {
    const resetScroll = () => {
      hasScrolled.current = false;
    };
    return resetScroll;
  }, []);

  const toggleCategory = (categoryId: string) => {
    if (openCategory === categoryId) {
      setOpenCategory(null);
      setSelectedCategory(null);
    } else {
      setOpenCategory(categoryId);
      const category = serviceCategories.find(cat => cat.id === categoryId);
      if (category) {
        setSelectedCategory(category);
      }
    }
  };

  const handleServiceSelect = (option: ServiceOption) => {
    if (option.redirectTo) {
      router.push(option.redirectTo);
      return;
    }

    setSelectedServices(prev => {
      const isSelected = prev.some(service => service.id === option.id);
      if (isSelected) {
        return prev.filter(service => service.id !== option.id);
      } else {
        const otherServices = prev.filter(service => service.categoryName !== option.categoryName);
        return [...otherServices, option];
      }
    });
  };

  const calculateTotal = () => {
    return selectedServices.reduce((total, service) => total + service.price, 0);
  };

  const FormattingQuestionnaire = () => {
    if (selectedServices.length === 0) return null;

    const allAnswersPositive = 
      formattingAnswers.bootNormally === true && 
      formattingAnswers.showsLogo === true && 
      formattingAnswers.hasRequirements === true;

    return (
      <div className="mt-4 p-4 bg-gray-700 rounded-lg space-y-4">
        <h4 className="text-lg font-bold text-white mb-4">
          Diagnóstico Inicial do Sistema
        </h4>
        
        {/* Primeira Pergunta - O PC Liga? */}
        <div className="space-y-2 transition-all duration-300 ease-in-out">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#FF4B6B] to-[#8B31FF] flex items-center justify-center text-white font-semibold text-sm">
              1
            </div>
            <p className="text-gray-300 text-lg">O computador está ligando?</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => handleFormattingAnswer('bootNormally', true)}
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 transform hover:scale-105 relative ${
                formattingAnswers.bootNormally === true
                  ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg shadow-green-500/30'
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
              } before:absolute before:inset-0 before:p-[2px] before:bg-gradient-to-r before:from-[#FF4B6B] before:via-[#8B31FF] before:to-[#31A8FF] before:rounded-lg before:-z-10 before:transition-all before:duration-300 hover:before:opacity-100 before:opacity-0`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Sim, liga normalmente
            </button>
            <button
              onClick={() => handleFormattingAnswer('bootNormally', false)}
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 transform hover:scale-105 relative ${
                formattingAnswers.bootNormally === false
                  ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-500/30'
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
              } before:absolute before:inset-0 before:p-[2px] before:bg-gradient-to-r before:from-[#FF4B6B] before:via-[#8B31FF] before:to-[#31A8FF] before:rounded-lg before:-z-10 before:transition-all before:duration-300 hover:before:opacity-100 before:opacity-0`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Não liga
            </button>
          </div>
        </div>

        {/* Mensagem de Erro - PC Não Liga */}
        {formattingAnswers.bootNormally === false && (
          <div className="mt-6 p-6 bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500 rounded-xl transition-all duration-300 ease-in-out animate-fadeIn backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-gradient-to-r from-red-600 to-red-500">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h5 className="text-xl font-semibold mb-2 bg-gradient-to-r from-red-500 to-red-400 text-transparent bg-clip-text">
                  Atenção: Diagnóstico Presencial Necessário
                </h5>
                <p className="text-red-400/90 text-base leading-relaxed">
                  Quando o computador não liga, isso pode indicar diversos problemas de hardware como fonte, placa-mãe ou outros componentes.
                  Recomendamos que leve seu equipamento até nossa assistência técnica para um diagnóstico presencial detalhado.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Segunda Pergunta - Mostra Logo? */}
        {formattingAnswers.bootNormally === true && (
          <div className="space-y-2 transition-all duration-300 ease-in-out animate-fadeIn">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#8B31FF] to-[#31A8FF] flex items-center justify-center text-white font-semibold text-sm">
                2
              </div>
              <p className="text-gray-300 text-lg">A tela inicial mostra a logo do fabricante?</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleFormattingAnswer('showsLogo', true)}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 transform hover:scale-105 relative ${
                  formattingAnswers.showsLogo === true
                    ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg shadow-green-500/30'
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                } before:absolute before:inset-0 before:p-[2px] before:bg-gradient-to-r before:from-[#FF4B6B] before:via-[#8B31FF] before:to-[#31A8FF] before:rounded-lg before:-z-10 before:transition-all before:duration-300 hover:before:opacity-100 before:opacity-0`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Sim, mostra a logo
              </button>
              <button
                onClick={() => handleFormattingAnswer('showsLogo', false)}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 transform hover:scale-105 relative ${
                  formattingAnswers.showsLogo === false
                    ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-500/30'
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                } before:absolute before:inset-0 before:p-[2px] before:bg-gradient-to-r before:from-[#FF4B6B] before:via-[#8B31FF] before:to-[#31A8FF] before:rounded-lg before:-z-10 before:transition-all before:duration-300 hover:before:opacity-100 before:opacity-0`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Tela preta
              </button>
            </div>
          </div>
        )}

        {/* Mensagem de Erro - Tela Preta */}
        {formattingAnswers.showsLogo === false && (
          <div className="mt-6 p-6 bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500 rounded-xl transition-all duration-300 ease-in-out animate-fadeIn backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-gradient-to-r from-red-600 to-red-500">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h5 className="text-xl font-semibold mb-2 bg-gradient-to-r from-red-500 to-red-400 text-transparent bg-clip-text">
                  Atenção: Diagnóstico Presencial Necessário
                </h5>
                <p className="text-red-400/90 text-base leading-relaxed">
                  Quando o computador liga mas a tela permanece totalmente preta (sem mostrar nenhuma logo), isso geralmente indica um problema 
                  de hardware como placa de vídeo, memória RAM ou monitor. Recomendamos que leve seu equipamento até nossa assistência técnica 
                  para um diagnóstico presencial detalhado.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Terceira Pergunta - Windows e Internet */}
        {formattingAnswers.showsLogo === true && (
          <div className="space-y-2 transition-all duration-300 ease-in-out animate-fadeIn">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#31A8FF] to-[#FF4B6B] flex items-center justify-center text-white font-semibold text-sm">
                3
              </div>
              <p className="text-gray-300 text-lg">Consegue acessar o Windows e a internet?</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  handleFormattingAnswer('hasWindows', true);
                  handleFormattingAnswer('hasInternet', true);
                  handleFormattingAnswer('hasRequirements', true);
                }}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 transform hover:scale-105 relative ${
                  formattingAnswers.hasWindows === true && formattingAnswers.hasInternet === true
                    ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg shadow-green-500/30'
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                } before:absolute before:inset-0 before:p-[2px] before:bg-gradient-to-r before:from-[#FF4B6B] before:via-[#8B31FF] before:to-[#31A8FF] before:rounded-lg before:-z-10 before:transition-all before:duration-300 hover:before:opacity-100 before:opacity-0`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Sim, ambos funcionam
              </button>
              <button
                onClick={() => {
                  handleFormattingAnswer('hasWindows', false);
                  handleFormattingAnswer('hasInternet', false);
                }}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 transform hover:scale-105 relative ${
                  formattingAnswers.hasWindows === false || formattingAnswers.hasInternet === false
                    ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-500/30'
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                } before:absolute before:inset-0 before:p-[2px] before:bg-gradient-to-r before:from-[#FF4B6B] before:via-[#8B31FF] before:to-[#31A8FF] before:rounded-lg before:-z-10 before:transition-all before:duration-300 hover:before:opacity-100 before:opacity-0`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
                Não funcionam
              </button>
            </div>
          </div>
        )}

        {/* Mensagem de Sucesso - Tem Windows e Internet */}
        {formattingAnswers.hasWindows === true && formattingAnswers.hasInternet === true && (
          <div className="mt-6 p-6 bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500 rounded-xl transition-all duration-300 ease-in-out animate-fadeIn backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-gradient-to-r from-green-600 to-green-500">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h5 className="text-xl font-semibold mb-2 bg-gradient-to-r from-green-500 to-green-400 text-transparent bg-clip-text">
                  Sistema Apto para Formatação
                </h5>
                <div className="text-green-400/90 text-base leading-relaxed">
                  <p>Ótimo! Você possui os requisitos básicos necessários para prosseguir com o serviço de formatação.</p>
                  <p className="mt-2">Para continuar, preencha seus dados no formulário ao lado e nossa equipe técnica
                  entrará em contato para agendar o melhor horário e fornecer as instruções detalhadas.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quarta Pergunta - Pen Drive e Outro Computador */}
        {formattingAnswers.hasWindows === false && formattingAnswers.hasInternet === false && (
          <div className="space-y-2 transition-all duration-300 ease-in-out animate-fadeIn mt-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#FF4B6B] to-[#8B31FF] flex items-center justify-center text-white font-semibold text-sm">
                4
              </div>
              <p className="text-gray-300 text-lg">Tem acesso a pen drive e outro computador?</p>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg mb-4">
              <h6 className="text-white font-medium mb-2">Requisitos:</h6>
              <ul className="list-disc list-inside space-y-1 text-gray-300">
                <li>Pen drive com 8GB ou mais</li>
                <li>Computador com acesso à internet</li>
              </ul>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  handleFormattingAnswer('hasPendrive', true);
                  handleFormattingAnswer('hasOtherComputer', true);
                  handleFormattingAnswer('hasRequirements', true);
                }}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 transform hover:scale-105 relative ${
                  formattingAnswers.hasPendrive === true && formattingAnswers.hasOtherComputer === true
                    ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg shadow-green-500/30'
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                } before:absolute before:inset-0 before:p-[2px] before:bg-gradient-to-r before:from-[#FF4B6B] before:via-[#8B31FF] before:to-[#31A8FF] before:rounded-lg before:-z-10 before:transition-all before:duration-300 hover:before:opacity-100 before:opacity-0`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Sim, tenho ambos
              </button>
              <button
                onClick={() => {
                  handleFormattingAnswer('hasPendrive', false);
                  handleFormattingAnswer('hasOtherComputer', false);
                  handleFormattingAnswer('hasRequirements', false);
                }}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 transform hover:scale-105 relative ${
                  formattingAnswers.hasPendrive === false || formattingAnswers.hasOtherComputer === false
                    ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-500/30'
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                } before:absolute before:inset-0 before:p-[2px] before:bg-gradient-to-r before:from-[#FF4B6B] before:via-[#8B31FF] before:to-[#31A8FF] before:rounded-lg before:-z-10 before:transition-all before:duration-300 hover:before:opacity-100 before:opacity-0`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
                Não tenho nenhum dos dois
              </button>
              <button
                onClick={() => {
                  handleFormattingAnswer('hasPendrive', true);
                  handleFormattingAnswer('hasOtherComputer', false);
                  handleFormattingAnswer('hasRequirements', false);
                }}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 transform hover:scale-105 relative ${
                  formattingAnswers.hasPendrive === true && formattingAnswers.hasOtherComputer === false
                    ? 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-white shadow-lg shadow-yellow-500/30'
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                } before:absolute before:inset-0 before:p-[2px] before:bg-gradient-to-r before:from-[#FF4B6B] before:via-[#8B31FF] before:to-[#31A8FF] before:rounded-lg before:-z-10 before:transition-all before:duration-300 hover:before:opacity-100 before:opacity-0`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Tenho apenas um deles
              </button>
            </div>
          </div>
        )}

        {/* Mensagem de Sucesso - Tem Pen Drive e Outro Computador */}
        {formattingAnswers.hasPendrive === true && formattingAnswers.hasOtherComputer === true && (
          <div className="mt-6 p-6 bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500 rounded-xl transition-all duration-300 ease-in-out animate-fadeIn backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-gradient-to-r from-green-600 to-green-500">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h5 className="text-xl font-semibold mb-2 bg-gradient-to-r from-green-500 to-green-400 text-transparent bg-clip-text">
                  Sistema Apto para Formatação
                </h5>
                <div className="text-green-400/90 text-base leading-relaxed">
                  <p>Ótimo! Você possui os requisitos necessários para prosseguir com o serviço de formatação.</p>
                  <p className="mt-2">Para continuar, preencha seus dados no formulário ao lado e nossa equipe técnica
                  entrará em contato para agendar o melhor horário e fornecer as instruções detalhadas.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mensagem - Faltam Requisitos */}
        {(formattingAnswers.hasRequirements === false || 
          (formattingAnswers.hasPendrive === true && formattingAnswers.hasOtherComputer === false) ||
          (formattingAnswers.hasPendrive === false && formattingAnswers.hasOtherComputer === true)) && (
          <div className="mt-6 p-6 bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border border-yellow-500 rounded-xl transition-all duration-300 ease-in-out animate-fadeIn backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-gradient-to-r from-yellow-600 to-yellow-500">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h5 className="text-xl font-semibold mb-2 bg-gradient-to-r from-yellow-500 to-yellow-400 text-transparent bg-clip-text">
                  Requisitos Necessários
                </h5>
                <div className="text-yellow-400/90 text-base leading-relaxed space-y-2">
                  <p>Para realizar o processo de formatação com segurança, você precisa ter:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Um pen drive com capacidade mínima de 8GB para criar a mídia de instalação do sistema operacional</li>
                    <li>Outro computador funcionando com acesso à internet para baixar os arquivos necessários</li>
                  </ul>
                  <div className="mt-4 flex flex-col gap-4">
                    <p>Por favor, providencie TODOS os itens antes de prosseguir com o serviço.</p>
                    <button
                      onClick={() => handleSaveProgress()}
                      className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-lg text-white font-medium hover:opacity-90 transition-opacity duration-300 flex items-center justify-center gap-2"
                    >
                      {isSavingProgress ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Salvando...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                          </svg>
                          Vou arrumar e volto depois
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const handleFormattingAnswer = (question: keyof FormattingQuestions, value: boolean) => {
    setFormattingAnswers(prev => {
      const newAnswers = {
        ...prev,
        [question]: value
      };
      
      // Verifica se todas as perguntas necessárias foram respondidas
      const isFormattingSelected = selectedServices.some(service => service.categoryName === 'Formatação Completa');
      
      if (isFormattingSelected) {
        // Para formatação, verifica se todas as perguntas foram respondidas
        const allQuestionsAnswered = 
          newAnswers.bootNormally !== null && 
          newAnswers.showsLogo !== null && 
          newAnswers.hasRequirements !== null;
        
        // Se todas as perguntas foram respondidas e o sistema está apto, faz scroll
        if (allQuestionsAnswered && 
            ((newAnswers.bootNormally === true && newAnswers.showsLogo === true && newAnswers.hasRequirements === true) ||
             (newAnswers.hasPendrive === true && newAnswers.hasOtherComputer === true))) {
          setTimeout(() => {
            if (window.innerWidth <= 768 && formRef.current) {
              const header = document.querySelector('header');
              const offset = header ? header.offsetHeight + 16 : 16;
              const top = formRef.current.getBoundingClientRect().top + window.scrollY - offset;
              window.scrollTo({ top, behavior: 'smooth' });
            }
          }, 500);
        }
      } else {
        // Para outros serviços, faz scroll imediatamente
        setTimeout(() => {
          if (window.innerWidth <= 768 && formRef.current) {
            const header = document.querySelector('header');
            const offset = header ? header.offsetHeight + 16 : 16;
            const top = formRef.current.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
          }
        }, 300);
      }
      
      return newAnswers;
    });
  };

  const resetFormattingAnswers = () => {
    setFormattingAnswers({
      bootNormally: null,
      showsLogo: null,
      hasRequirements: null,
      hasWindows: null,
      hasInternet: null,
      hasPendrive: null,
      hasOtherComputer: null
    });
  };

  const generateWhatsAppMessage = (): string => {
    const selectedServicesList = selectedServices;
    
    if (selectedServicesList.length === 0) {
      alert('Por favor, selecione pelo menos um serviço.');
      return '#';
    }

    if (schedulingType === 'schedule' && !appointmentDateTime) {
      alert('Por favor, selecione a data e hora para o agendamento.');
      return '#';
    }

    let message = `*NOVO PEDIDO DE SERVIÇO*\n\n`;
    message += `\n*Serviços Selecionados:*\n`;
    
    selectedServicesList.forEach(service => {
      message += `- ${service.categoryName} - ${service.serviceName}: R$ ${service.price.toFixed(2).replace('.', ',')}\n`;
    });

    // Adiciona as respostas do questionário se houver formatação selecionada
    if (selectedServices.some(service => service.categoryName === 'Formatação Completa')) {
      message += `\n*Status do Computador:*\n`;
      if (formattingAnswers.bootNormally !== null) {
        message += `- Liga normalmente: ${formattingAnswers.bootNormally ? 'Sim' : 'Não'}\n`;
      }
      if (formattingAnswers.showsLogo !== null) {
        message += `- Mostra logo: ${formattingAnswers.showsLogo ? 'Sim' : 'Não'}\n`;
      }
    }

    message += `\n`;
    
    if (additionalInfo) {
      message += `*Informações Adicionais:*\n${additionalInfo}\n\n`;
    }

    const totalPrice = calculateTotal();
    message += `*Total:* R$ ${totalPrice.toFixed(2).replace('.', ',')}`;

    const phoneNumber = '5511996716235';
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  };

  // Input sanitization functions
  const sanitizeText = (text: string): string => {
    return text.replace(/[<>]/g, '').trim();
  };

  const sanitizePhone = (phone: string): string => {
    return phone.replace(/[^0-9+\-()\s]/g, '').trim();
  };

  const validateEmail = (email: string): boolean => {
    if (!email) return true; // Email is optional
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    let isValid = true;

    // Validate services
    const hasSelectedService = selectedServices.length > 0;
    if (!hasSelectedService) {
      errors.services = 'Por favor, selecione pelo menos um serviço.';
      isValid = false;
    }

    // Validate scheduling type
    if (!schedulingType) {
      errors.scheduling = 'Por favor, selecione quando deseja ser atendido.';
      isValid = false;
    } else if (schedulingType === 'schedule' && !appointmentDateTime) {
      errors.appointment = 'Por favor, selecione a data e hora para o agendamento.';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmitService = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validateForm()) return;

    // Verificar autenticação atual
    const { data: { user } } = await supabase.auth.getUser();
    console.log('Usuário autenticado:', user);

    if (!user) {
      // Usuário não está logado - salvar dados do formulário e redirecionar para login
      const formData = {
        selectedServices,
        schedulingType,
        appointmentDateTime,
        additionalInfo,
        formattingAnswers,
        totalPrice: calculateTotal(),
        timestamp: Date.now()
      };
      console.log('Salvando pendingOrderData:', formData);
      sessionStorage.setItem('pendingOrderData', JSON.stringify(formData));
      router.push('/login?redirect=/dashboard&pendingOrder=true');
      return;
    }

    // Usuário está logado - processar pedido
    try {
      const valor = calculateTotal();
      const selected = selectedServices[0];
      const PLAN_TYPES = [
        'basico', 'profissional', 'empresarial', 'gamer', 'corporativa',
        'Formatação Básica', 'Formatação Média', 'Formatação Avançada', 'Formatação Corporativa',
        'Otimização Básica', 'Otimização Média', 'Otimização Avançada', 'Otimização Premium',
        'Office 365', 'Office 2021', 'Office 2019', 'Office Empresarial'
      ];
      // Mapeamento seguro para plan_type
      const PLAN_TYPE_MAP: Record<string, string> = {
        'basico': 'basico',
        'profissional': 'profissional',
        'empresarial': 'empresarial',
        'gamer': 'gamer',
        'corporativa': 'corporativa',
        'Formatação Básica': 'Formatação Básica',
        'Formatação Média': 'Formatação Média',
        'Formatação Avançada': 'Formatação Avançada',
        'Formatação Corporativa': 'Formatação Corporativa',
        'Otimização Básica': 'Otimização Básica',
        'Otimização Média': 'Otimização Média',
        'Otimização Avançada': 'Otimização Avançada',
        'Otimização Premium': 'Otimização Premium',
        'Office 365': 'Office 365',
        'Office 2021': 'Office 2021',
        'Office 2019': 'Office 2019',
        'Office Empresarial': 'Office Empresarial',
      };
      let planType: string | undefined = undefined;
      if (selected?.serviceName && PLAN_TYPE_MAP[selected.serviceName]) {
        planType = PLAN_TYPE_MAP[selected.serviceName];
      }
      const apiOrderData: any = {
        service_id: selected?.id,
        service_name: selected?.serviceName || 'Serviço Personalizado',
        service_description: selected?.description || '',
        final_price: selected?.price || valor || 1,
        total: valor > 0 ? valor : 1,
        items: selectedServices.map(service => ({
          service_name: service.serviceName,
          price: service.price
        })),
        notes: additionalInfo || '',
        scheduling_type: schedulingType === 'schedule' ? 'scheduled' : 'now',
        appointment_datetime: schedulingType === 'schedule' ? appointmentDateTime : null
      };
      if (planType) {
        apiOrderData.plan_type = planType;
      }
      console.log('Pedido enviado para API:', apiOrderData);
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiOrderData),
      });
      console.log('Resposta da API:', response.status);
      if (response.ok) {
        const result = await response.json();
        console.log('Pedido criado:', result);
        sessionStorage.removeItem('pendingOrderData');
        router.push('/dashboard?orderCreated=true');
      } else {
        const errorMsg = await response.text();
        throw new Error('Erro ao criar pedido: ' + errorMsg);
      }
    } catch (error) {
      console.error('Erro ao processar pedido:', error);
      alert('Erro ao processar pedido. Por favor, tente novamente.');
    }
  };

  const totalPrice = calculateTotal();

  const handleSaveProgress = async () => {
    setIsSavingProgress(true);
    try {
      const formData = {
        selectedServices,
        schedulingType,
        appointmentDateTime,
        additionalInfo,
        formattingAnswers,
        needsToConfirmRequirements: true // Adiciona flag para indicar que precisa confirmar requisitos
      };
      sessionStorage.setItem('serviceFormData', JSON.stringify(formData));
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error saving progress:', error);
      alert('Erro ao salvar progresso. Por favor, tente novamente.');
    } finally {
      setIsSavingProgress(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    router.push('/');
  };

  // Modifica a função para verificar a flag needsToConfirmRequirements
  useEffect(() => {
    const savedFormData = sessionStorage.getItem('serviceFormData');
    const userIsReady = localStorage.getItem('userIsReady');
    
    if (savedFormData) {
      try {
        const formData = JSON.parse(savedFormData);
        // Mostra o modal se o usuário não estiver pronto E
        // (tiver requisitos falsos OU precisar confirmar requisitos)
        if (!userIsReady && (formData.formattingAnswers?.hasRequirements === false || formData.needsToConfirmRequirements)) {
          setIsReturnModalOpen(true);
        }
      } catch (error) {
        console.error('Error checking saved progress:', error);
      }
    }
  }, []);

  // Modifica a função para remover a flag needsToConfirmRequirements quando o usuário estiver pronto
  const handleContinueProgress = () => {
    const savedFormData = sessionStorage.getItem('serviceFormData');
    if (savedFormData) {
      try {
        const formData = JSON.parse(savedFormData);
        const updatedFormData = {
          ...formData,
          formattingAnswers: {
            ...formData.formattingAnswers,
            hasRequirements: true,
            hasPendrive: true,
            hasOtherComputer: true
          },
          needsToConfirmRequirements: false // Remove a flag quando o usuário confirma que está pronto
        };
        sessionStorage.setItem('serviceFormData', JSON.stringify(updatedFormData));
        setSelectedServices(formData.selectedServices);
        setSchedulingType(formData.schedulingType);
        setAppointmentDateTime(formData.appointmentDateTime);
        setAdditionalInfo(formData.additionalInfo);
        setFormattingAnswers({
          ...formData.formattingAnswers,
          hasRequirements: true,
          hasPendrive: true,
          hasOtherComputer: true
        });
      } catch (error) {
        console.error('Error restoring form data:', error);
      }
    }
    // Salva no localStorage que o usuário está pronto
    localStorage.setItem('userIsReady', 'true');
    setIsReturnModalOpen(false);
  };

  // Modifica a função para manter a flag needsToConfirmRequirements quando o usuário não está pronto
  const handleReturnModalClose = () => {
    setIsReturnModalOpen(false);
    const savedFormData = sessionStorage.getItem('serviceFormData');
    if (savedFormData) {
      try {
        const formData = JSON.parse(savedFormData);
        const updatedFormData = {
          ...formData,
          needsToConfirmRequirements: true // Mantém a flag quando o usuário ainda não está pronto
        };
        sessionStorage.setItem('serviceFormData', JSON.stringify(updatedFormData));
      } catch (error) {
        console.error('Error updating form data:', error);
      }
    }
  };

  const ServiceProcess = () => {
    return (
      <div className="bg-[#1D1919] rounded-xl p-4 sm:p-8 mb-12">
        <h2 className="text-xl sm:text-2xl font-bold mb-6 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-transparent bg-clip-text">
          Como Realizamos Nossos Serviços
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Link href="/processo/agendamento" className="group h-full">
            <div className="p-4 sm:p-6 rounded-xl bg-gradient-to-br from-[#232027] to-[#1D1919] border border-[#8B31FF]/20 shadow-xl group transition-all duration-300 flex flex-col h-full min-h-[200px] sm:min-h-[260px]">
              <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 sm:w-12 sm:h-12 text-[#FF4B6B]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  <circle cx="12" cy="14" r="2" fill="currentColor" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 12v-2m0 6v2" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 14h2m-8 0h2" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Agendamento</h3>
              <p className="text-sm sm:text-base text-gray-400">Escolha o serviço e agende o melhor horário para você. Nossa equipe confirmará sua solicitação.</p>
            </div>
          </Link>

          <Link href="/processo/contrato" className="group h-full">
            <div className="p-4 sm:p-6 rounded-xl bg-gradient-to-br from-[#232027] to-[#1D1919] border border-[#8B31FF]/20 shadow-xl group transition-all duration-300 flex flex-col h-full min-h-[200px] sm:min-h-[260px]">
              <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 sm:w-12 sm:h-12 text-[#8B31FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 2.5V6a2 2 0 002 2h3.5" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 18v-2m4 2v-2" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10.5v3" fill="currentColor" />
                  <circle cx="12" cy="9" r="1" fill="currentColor" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Contrato</h3>
              <p className="text-sm sm:text-base text-gray-400">Você receberá o contrato de serviço detalhado por e-mail e WhatsApp para sua segurança.</p>
            </div>
          </Link>

          <Link href="/processo/acesso-remoto" className="group h-full">
            <div className="p-4 sm:p-6 rounded-xl bg-gradient-to-br from-[#232027] to-[#1D1919] border border-[#8B31FF]/20 shadow-xl group transition-all duration-300 flex flex-col h-full min-h-[200px] sm:min-h-[260px]">
              <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 sm:w-12 sm:h-12 text-[#31A8FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v4m0-9v2m0 7v2" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.5 7h-2m11 0h-2" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Acesso Remoto</h3>
              <p className="text-sm sm:text-base text-gray-400">O serviço é realizado remotamente via AnyDesk ou TeamViewer, com total segurança e transparência.</p>
            </div>
          </Link>

          <Link href="/processo/conclusao" className="group h-full">
            <div className="p-4 sm:p-6 rounded-xl bg-gradient-to-br from-[#232027] to-[#1D1919] border border-[#8B31FF]/20 shadow-xl group transition-all duration-300 flex flex-col h-full min-h-[200px] sm:min-h-[260px]">
              <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 sm:w-12 sm:h-12 text-[#FF4B6B]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 16v2m-4-6h.01M16 10h.01" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Conclusão</h3>
              <p className="text-sm sm:text-base text-gray-400">Após a conclusão, realizamos testes completos e fornecemos orientações de uso e manutenção.</p>
            </div>
          </Link>
        </div>
      </div>
    );
  };

  const CompanyInfo = () => {
    return (
      <div className="bg-[#1D1919] rounded-xl p-4 sm:p-8 mb-12">
        <h2 className="text-xl sm:text-2xl font-bold mb-6 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-transparent bg-clip-text">
          Por que Escolher Nossa Empresa?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="p-4 sm:p-6 rounded-xl bg-gradient-to-br from-[#232027] to-[#1D1919] border border-[#8B31FF]/20 shadow-xl flex flex-col items-start min-h-[180px] sm:min-h-[220px]">
            <div className="mb-4">
              <svg className="w-10 h-10 sm:w-12 sm:h-12 text-[#FF4B6B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2" />
                <circle cx="12" cy="12" r="10" stroke="#FF4B6B" strokeWidth="2" fill="none" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Experiência</h3>
            <p className="text-gray-400 text-xs sm:text-sm">Anos de experiência no mercado, com profissionais altamente qualificados e certificados.</p>
          </div>
          <div className="p-4 sm:p-6 rounded-xl bg-gradient-to-br from-[#232027] to-[#1D1919] border border-[#8B31FF]/20 shadow-xl flex flex-col items-start min-h-[180px] sm:min-h-[220px]">
            <div className="mb-4">
              <svg className="w-10 h-10 sm:w-12 sm:h-12 text-[#8B31FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <rect x="4" y="4" width="16" height="16" rx="4" stroke="#8B31FF" strokeWidth="2" fill="none" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12l2 2 4-4" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Garantia</h3>
            <p className="text-gray-400 text-xs sm:text-sm">Todos os serviços incluem garantia e suporte pós-atendimento para sua tranquilidade.</p>
          </div>
          <div className="p-4 sm:p-6 rounded-xl bg-gradient-to-br from-[#232027] to-[#1D1919] border border-[#8B31FF]/20 shadow-xl flex flex-col items-start min-h-[180px] sm:min-h-[220px]">
            <div className="mb-4">
              <svg className="w-10 h-10 sm:w-12 sm:h-12 text-[#31A8FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <rect x="4" y="4" width="16" height="16" rx="4" stroke="#31A8FF" strokeWidth="2" fill="none" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h8M8 16h8M8 8h8" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Transparência</h3>
            <p className="text-gray-400 text-xs sm:text-sm">Preços justos e transparentes, sem surpresas ou custos adicionais durante o serviço.</p>
          </div>
        </div>
      </div>
    );
  };

  const WHATSAPP_NUMBER = '5511996716235'; // Substitua pelo número real

  type PedidoWhatsApp = { serviceName: string };
  const gerarMensagemWhatsApp = (pedido: PedidoWhatsApp) => {
    return `Olá! Acabei de solicitar o serviço: ${pedido.serviceName}. Gostaria de concluir o pagamento via PIX.`;
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Serviços de Informática VOLTRIS",
            "description": "Serviços especializados em informática: formatação de computador, otimização de Windows, remoção de vírus, instalação de programas e suporte técnico remoto.",
            "url": "https://voltris.com.br/servicos",
            "provider": {
              "@type": "Organization",
              "name": "VOLTRIS",
              "url": "https://voltris.com.br"
            },
            "serviceType": "Suporte Técnico de Informática",
            "areaServed": {
              "@type": "Country",
              "name": "Brasil"
            },
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Serviços de Informática",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Formatação de Computador",
                    "description": "Formatação completa com backup de dados e instalação de programas"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Otimização de Windows",
                    "description": "Otimização de desempenho e velocidade do sistema"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Remoção de Vírus",
                    "description": "Remoção de vírus e proteção do computador"
                  }
                }
              ]
            }
          })
        }}
      />
      <div className="min-h-screen bg-[#171313] text-white">
      <Header />
      <main className="pt-32 sm:pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-transparent bg-clip-text relative inline-block">
              Serviços Especializados em Informática
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-[#FF4B6B] to-[#31A8FF]"></div>
            </h1>
            <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto mt-8 px-4">
              Soluções profissionais para manutenção e otimização do seu computador, 
              com atendimento personalizado e segurança garantida.
            </p>
          </div>

          <ServiceProcess />

          <div className="grid md:grid-cols-2 gap-4 sm:gap-8 mb-16">
            {/* Services List */}
            <div className="space-y-4">
              <div className="bg-[#1D1919] rounded-xl p-4 sm:p-6 border border-[#8B31FF]/10">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-200 mb-6 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-transparent bg-clip-text">
                  Escolha o Serviço Ideal
                </h2>
                <div className="space-y-4">
                  {serviceCategories.map((category) => (
                    <div key={category.id} className="rounded-xl overflow-hidden backdrop-blur-sm border border-[#8B31FF]/10 hover:border-[#8B31FF]/20 transition-all duration-300 shadow-lg shadow-black/5">
                      <button
                        id={category.id}
                        onClick={() => toggleCategory(category.id)}
                        className="w-full flex justify-between items-center px-4 sm:px-8 py-4 sm:py-5 text-base sm:text-lg font-bold text-white focus:outline-none bg-[#232027] hover:bg-[#232027]/80 transition-all duration-300 group"
                      >
                        <div className="flex items-center gap-2">
                          <div className={`p-3.5 rounded-xl transition-all duration-300 relative ${
                            selectedCategory?.id === category.id
                              ? 'bg-gradient-to-r from-[#FF4B6B] to-[#8B31FF] shadow-lg shadow-[#FF4B6B]/20'
                              : 'bg-[#232027]'
                          } before:absolute before:inset-0 before:rounded-xl before:p-[1px] before:bg-gradient-to-r before:from-[#FF4B6B] before:via-[#8B31FF] before:to-[#31A8FF] before:-z-10 before:transition-opacity before:duration-300 ${
                            selectedCategory?.id === category.id ? 'before:opacity-100' : 'before:opacity-0'
                          }`}>
                            {category.id === 'formatacao' && (
                              <svg className="w-6 h-6 text-[#31A8FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                              </svg>
                            )}
                            {category.id === 'otimizacao' && (
                              <svg className="w-6 h-6 text-[#31A8FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                              </svg>
                            )}
                            {category.id === 'correcao_windows' && (
                              <svg className="w-6 h-6 text-[#31A8FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <circle cx="12" cy="12" r="9" stroke="#31A8FF" strokeWidth="1.5" fill="none" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15L15 9.75" stroke="#31A8FF" strokeWidth="1.5" />
                              </svg>
                            )}
                            {category.id === 'instalacao_impressora' && (
                              <svg className="w-6 h-6 text-[#31A8FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
                              </svg>
                            )}
                            {category.id === 'remocao_virus' && (
                              <svg className="w-6 h-6 text-[#31A8FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                              </svg>
                            )}
                            {category.id === 'recuperacao' && (
                              <svg className="w-6 h-6 text-[#31A8FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                              </svg>
                            )}
                            {category.id === 'instalacao_programas' && (
                              <svg className="w-6 h-6 text-[#31A8FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            )}
                            {category.id === 'suporte_windows' && (
                              <svg className="w-6 h-6 text-[#31A8FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
                              </svg>
                            )}
                            {category.id === 'criacao_sites' && (
                              <svg className="w-6 h-6 text-[#31A8FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                              </svg>
                            )}
                          </div>
                          <h3 className={`text-xl font-semibold transition-all duration-300 ${
                            selectedCategory?.id === category.id
                              ? 'bg-gradient-to-r from-[#FF4B6B] to-[#8B31FF] text-transparent bg-clip-text'
                              : 'text-white'
                          }`}>{category.title}</h3>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3">
                          {!selectedServices.some(service => service.id === category.id) &&
                            !['instalacao_impressora', 'instalacao_programas', 'suporte_windows', 'criacao_sites'].includes(category.id) && (
                              <span className="hidden sm:block text-sm text-gray-400 mr-2 flex items-center">Selecione uma opção</span>
                          )}
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center h-full transition-all duration-300 ${
                            selectedCategory?.id === category.id
                              ? 'bg-gradient-to-r from-[#FF4B6B] to-[#8B31FF] shadow-lg shadow-[#FF4B6B]/20'
                              : 'bg-[#232027]'
                          }`}>
                            <svg
                              className={`w-5 h-5 transform transition-transform duration-300 ${
                                selectedCategory?.id === category.id ? 'rotate-180' : ''
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              strokeWidth="2"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M8 10l4 4 4-4"
                                className="text-white"
                              />
                            </svg>
                          </div>
                        </div>
                      </button>
                      
                      <div
                        className={`transition-all duration-300 ease-in-out relative group ${
                          openCategory === category.id
                            ? 'max-h-[2000px] opacity-100'
                            : 'max-h-0 opacity-0'
                        } overflow-hidden rounded-b-xl`}
                      >
                        <div className={`bg-gradient-to-br from-[#FF4B6B]/5 via-[#8B31FF]/5 to-[#31A8FF]/5 rounded-2xl transition-opacity duration-500 pointer-events-none w-full h-full absolute inset-0 ${openCategory === category.id ? 'opacity-100' : 'opacity-0'}`}></div>
                        <div className="p-4 sm:p-6 pt-4 space-y-4 border-t border-gray-700/50 relative z-10">
                          {category.options.map((option) => (
                            <div key={option.id}>
                              <div
                                onClick={() => handleServiceSelect(option)}
                                className={`p-4 rounded-lg cursor-pointer transition-all duration-300 group ${
                                  option.redirectTo
                                    ? 'bg-gradient-to-r from-[#8B31FF] to-[#31A8FF] hover:opacity-90'
                                    : selectedServices.some(service => service.id === option.id)
                                      ? 'bg-gradient-to-r from-[#8B31FF] to-[#31A8FF] shadow-lg shadow-[#8B31FF]/30'
                                      : 'bg-gray-700/50 hover:bg-gray-700'
                                }`}
                              >
                                <div className="flex justify-between items-start gap-2">
                                  <div className="flex-1 min-w-0">
                                    <h4 className="text-base sm:text-lg font-medium flex items-center gap-2">
                                      {option.title}
                                      {option.redirectTo ? (
                                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                      ) : selectedServices.some(service => service.id === option.id) && (
                                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                      )}
                                    </h4>
                                    <p className="text-xs sm:text-sm mt-1 text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                                      {option.description}
                                    </p>
                                  </div>
                                  {!option.redirectTo && (
                                    <span className={`text-base sm:text-lg font-semibold transition-all duration-300 flex-shrink-0 ${
                                      selectedServices.some(service => service.id === option.id)
                                        ? 'text-white'
                                        : 'text-gray-300 group-hover:text-white'
                                    }`}>
                                      R${option.price.toFixed(2).replace('.', ',')}
                                    </span>
                                  )}
                                </div>
                              </div>
                              {/* Mostra o questionário logo abaixo da opção selecionada */}
                              {category.id === 'formatacao' && 
                               selectedServices.some(service => service.id === option.id) && 
                               <FormattingQuestionnaire />}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Form Section */}
            <div ref={formRef}>
              <div className="bg-[#1D1919] rounded-xl p-4 sm:p-6 h-fit sticky top-24 border border-[#8B31FF]/10">
                <h2 className="text-xl sm:text-2xl font-semibold mb-6 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-transparent bg-clip-text">
                  Solicite seu Orçamento
                </h2>
                
                <div className="space-y-6">
                  {/* Tipo de Agendamento */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Quando deseja ser atendido?*
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <button
                        type="button"
                        onClick={() => setSchedulingType('now')}
                        className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                          schedulingType === 'now'
                            ? 'bg-gradient-to-r from-[#8B31FF] to-[#31A8FF] text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span className="text-xs sm:text-sm">Atendimento Agora</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSchedulingType('schedule')}
                        className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                          schedulingType === 'schedule'
                            ? 'bg-gradient-to-r from-[#8B31FF] to-[#31A8FF] text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-xs sm:text-sm">Agendar Horário</span>
                      </button>
                    </div>
                    {formErrors.scheduling && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.scheduling}</p>
                    )}
                  </div>

                  {/* Data e Hora (se agendamento) */}
                  {schedulingType === 'schedule' && (
                    <div>
                      <label htmlFor="datetime" className="block text-sm font-medium text-gray-300 mb-2">
                        Data e Hora*
                      </label>
                      <input
                        type="datetime-local"
                        id="datetime"
                        value={appointmentDateTime}
                        onChange={(e) => setAppointmentDateTime(e.target.value)}
                        className={`w-full px-4 py-2 bg-gray-700 border ${
                          formErrors.appointment ? 'border-red-500' : 'border-gray-600'
                        } rounded-lg focus:outline-none focus:border-[#8B31FF] text-white`}
                        suppressHydrationWarning
                      />
                      {formErrors.appointment && (
                        <p className="mt-1 text-sm text-red-500">{formErrors.appointment}</p>
                      )}
                    </div>
                  )}

                  {/* Informações Adicionais */}
                  <div>
                    <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-300 mb-2">
                      Informações Adicionais (opcional)
                    </label>
                    <textarea
                      id="additionalInfo"
                      value={additionalInfo}
                      onChange={(e) => setAdditionalInfo(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-[#8B31FF] text-white resize-none"
                      placeholder="Descreva aqui qualquer informação adicional que julgar importante..."
                    />
                  </div>

                  {/* Total e Botão de Envio */}
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-700 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-medium text-gray-300">Total:</span>
                        <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#FF4B6B] to-[#8B31FF] text-transparent bg-clip-text">
                          R$ {totalPrice.toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={handleSubmitService}
                      className="block w-full py-3 px-4 text-center font-medium text-white bg-gradient-to-r from-[#8B31FF] to-[#31A8FF] rounded-lg hover:opacity-90 transition-opacity duration-300"
                    >
                      Finalizar Pedido
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <CompanyInfo />
        </div>
      </main>
      <Footer />
      <SuccessModal isOpen={isModalOpen} onClose={handleModalClose} />
      <ReturnModal 
        isOpen={isReturnModalOpen} 
        onClose={handleReturnModalClose}
        onContinue={handleContinueProgress}
      />
    </div>
    </>
  );
}