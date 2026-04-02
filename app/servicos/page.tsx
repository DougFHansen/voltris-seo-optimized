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
import { motion } from 'framer-motion';
import {
  FiMonitor, FiSettings, FiClock, FiBarChart2, FiDatabase,
  FiPrinter, FiShield, FiGlobe, FiTrendingUp, FiUsers,
  FiPhone, FiMail, FiMapPin, FiCreditCard, FiCloud,
  FiCheckCircle, FiCpu, FiTool, FiLock, FiShoppingCart
} from 'react-icons/fi';
import AnimatedSection from '@/components/AnimatedSection';
import { useAuth } from '@/app/hooks/useAuth';
import { toast } from 'react-hot-toast';


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
  const { user, loading: authLoading } = useAuth();
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
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

  useEffect(() => {
    const checkAuthAndRestoreForm = async () => {
      if (authLoading) return;
      setIsAuthenticated(!!user);

      const savedFormData = sessionStorage.getItem('serviceFormData');
      if (savedFormData && user) {
          try {
            const formData = JSON.parse(savedFormData);
            
            // Se o usuário acabou de logar e tem um serviço selecionado pronto para checkout
            if (formData.readyForCheckout && formData.selectedServices?.[0]) {
               sessionStorage.removeItem('serviceFormData'); // Limpa para evitar loop
               processCheckout(formData.selectedServices[0]);
            } else {
              // Apenas restaura os dados se não for checkout imediato
              setSelectedServices(formData.selectedServices || []);
              setSchedulingType(formData.schedulingType || null);
              setAppointmentDateTime(formData.appointmentDateTime || '');
              setAdditionalInfo(formData.additionalInfo || '');
              setFormattingAnswers(formData.formattingAnswers || {});
            }
          } catch (error) {
            console.error('Error restoring form data:', error);
          }
      }
    };
    checkAuthAndRestoreForm();
  }, [user, authLoading]);

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
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 transform hover:scale-105 relative ${formattingAnswers.bootNormally === true
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
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 transform hover:scale-105 relative ${formattingAnswers.bootNormally === false
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
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 transform hover:scale-105 relative ${formattingAnswers.showsLogo === true
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
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 transform hover:scale-105 relative ${formattingAnswers.showsLogo === false
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
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 transform hover:scale-105 relative ${formattingAnswers.hasWindows === true && formattingAnswers.hasInternet === true
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
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 transform hover:scale-105 relative ${formattingAnswers.hasWindows === false || formattingAnswers.hasInternet === false
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
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 transform hover:scale-105 relative ${formattingAnswers.hasPendrive === true && formattingAnswers.hasOtherComputer === true
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
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 transform hover:scale-105 relative ${formattingAnswers.hasPendrive === false || formattingAnswers.hasOtherComputer === false
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
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 transform hover:scale-105 relative ${formattingAnswers.hasPendrive === true && formattingAnswers.hasOtherComputer === false
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

  const processCheckout = async (service: ServiceOption) => {
    if (!user) {
        // Salva o estado para processar após o login
        const formData = {
            selectedServices: [service],
            schedulingType,
            appointmentDateTime,
            additionalInfo,
            formattingAnswers,
            readyForCheckout: true
        };
        sessionStorage.setItem('serviceFormData', JSON.stringify(formData));
        toast.error("Para prosseguir com a aquisição, realize o login ou cadastre-se.");
        router.push(`/login?redirect=/servicos`);
        return;
    }

    setIsProcessingCheckout(true);
    toast.loading(`Iniciando checkout seguro para ${service.title}...`);

    try {
        const response = await fetch('/api/stripe/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                license_type: service.id,
                user_id: user.id,
                customer_email: user.email,
                customer_name: user.user_metadata?.full_name || 'Cliente Voltris',
            }),
        });

        const data = await response.json();
        if (data.url) {
            window.location.href = data.url;
        } else {
            throw new Error(data.error || 'Erro ao gerar sessão de pagamento');
        }
    } catch (error: any) {
        toast.error(`Falha no checkout: ${error.message}`);
        console.error('Checkout error:', error);
    } finally {
        setIsProcessingCheckout(false);
        toast.dismiss();
    }
  };

  const handleSubmitService = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validateForm()) return;

    const mainService = selectedServices[0];
    if (!mainService) {
        toast.error("Selecione um serviço para continuar.");
        return;
    }

    processCheckout(mainService);
  };

  const totalPrice = 0;

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
      <AnimatedSection>
        <div className="py-20 relative">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-y-1/2 hidden md:block"></div>

          <div className="text-center mb-16 relative z-10">
            <span className="text-[#31A8FF] font-bold tracking-widest uppercase text-xs sm:text-sm mb-2 block">Workflow</span>
            <h2 className="text-3xl md:text-5xl font-black text-white">
              Como <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#31A8FF] to-[#8B31FF]">Funciona?</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
            {[
              { icon: FiClock, title: "Agendamento", step: "01", desc: "Escolha o melhor horário na agenda." },
              { icon: FiShield, title: "Segurança", step: "02", desc: "Contrato de serviço e garantias." },
              { icon: FiMonitor, title: "Execução", step: "03", desc: "Acesso remoto seguro e monitorado." },
              { icon: FiCheckCircle, title: "Conclusão", step: "04", desc: "Testes finais e aprovação." }
            ].map((item, i) => (
              <div key={i} className="group relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-2xl bg-[#0A0A0F] border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-[#31A8FF]/50 transition-all duration-300 shadow-lg relative z-10">
                    <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#31A8FF] text-black font-bold flex items-center justify-center text-xs shadow-lg">
                      {item.step}
                    </div>
                    <item.icon className="w-8 h-8 text-white group-hover:text-[#31A8FF] transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-slate-400 text-sm max-w-[200px] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>
    );
  };

  const CompanyInfo = () => {
    return (
      <AnimatedSection>
        <div className="py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8B31FF]/10 border border-[#8B31FF]/20 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#8B31FF] animate-pulse"></span>
              <span className="text-xs font-bold text-[#8B31FF] tracking-widest uppercase">Por que VOLTRIS?</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              <span className="text-[#e2e8f0]">Tecnologia que</span> <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#31A8FF] to-[#8B31FF]">Impulsiona Resultados.</span>
            </h2>
            <p className="text-lg text-slate-400 leading-relaxed mb-8">
              Diferente de assistências comuns, aplicamos engenharia de software para extrair o máximo do seu equipamento. Cada bit otimizado para sua máxima performance.
            </p>
            <Link href="/sobre" className="inline-flex items-center gap-2 text-white border-b border-[#31A8FF] hover:text-[#31A8FF] transition-colors pb-1 font-medium group">
              Conheça nossa história
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: FiShield, title: "Garantia Total", desc: "Suporte pós-serviço incluso.", color: "text-[#8B31FF]", bg: "bg-[#8B31FF]/10", border: "border-[#8B31FF]/20" },
              { icon: FiUsers, title: "Experts Reais", desc: "Equipe certificada e sênior.", color: "text-[#31A8FF]", bg: "bg-[#31A8FF]/10", border: "border-[#31A8FF]/20" },
              { icon: FiTrendingUp, title: "Performance", desc: "Foco em FPS e velocidade.", color: "text-[#00FF94]", bg: "bg-[#00FF94]/10", border: "border-[#00FF94]/20" },
              { icon: FiLock, title: "Segurança", desc: "Acesso criptografado e seguro.", color: "text-[#FF4B6B]", bg: "bg-[#FF4B6B]/10", border: "border-[#FF4B6B]/20" }
            ].map((item, i) => (
              <div key={i} className={`bg-[#0A0A0F] border border-white/5 p-6 rounded-2xl hover:border-white/20 transition-all duration-300 group`}>
                <div className={`w-12 h-12 rounded-xl ${item.bg} border ${item.border} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <item.icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <h3 className="text-white font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>
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
      <div className="bg-[#050510] min-h-screen relative overflow-x-hidden font-sans selection:bg-[#31A8FF]/30 text-white">
        {/* Background Effects (from FAQ) */}
        <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none z-50"></div>
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#31A8FF]/10 blur-[150px] rounded-full mix-blend-screen pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-[#8B31FF]/10 blur-[150px] rounded-full mix-blend-screen pointer-events-none"></div>
        <Header />

        <AnimatedSection>
          <section className="relative w-full h-[100dvh] flex items-center justify-center overflow-hidden bg-transparent">

            <div className="container mx-auto px-4 relative z-10 text-center flex flex-col items-center justify-center h-full">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex flex-col items-center"
              >
                <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl mb-8 hover:bg-white/10 transition-colors cursor-default">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF94] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00FF94]"></span>
                  </span>
                  <span className="text-sm font-bold text-white tracking-widest uppercase">Atendimento Imediato</span>
                </div>

                <h1 className="text-5xl sm:text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-[1] text-center">
                  Atendimento e Otimização <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B]">
                    Remota em Qualquer Lugar do Mundo
                  </span>
                </h1>

                <p className="text-lg md:text-2xl text-slate-400 max-w-3xl leading-relaxed mb-12 font-light tracking-wide">
                  A evolução da assistência técnica. Formatação, segurança e otimização de alta performance, 100% remota e segura.
                </p>


              </motion.div>
            </div>


            {/* Scroll Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-white/30"
            >
              <span className="text-[10px] uppercase tracking-[0.2em] font-medium">Scroll</span>
              <div className="w-[1px] h-16 bg-gradient-to-b from-white/0 via-white/50 to-white/0"></div>
            </motion.div>
          </section>
        </AnimatedSection>

        <main className="px-4 pb-20 relative z-10">
          <div className="max-w-7xl mx-auto">

            <ServiceProcess />

            <div id="catalogo" className="grid lg:grid-cols-3 gap-8 mb-20 relative scroll-mt-32">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-[#0A0A0F]/80 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold flex items-center gap-3 text-white">
                      <span className="p-2 bg-gradient-to-r from-[#8B31FF]/20 to-[#31A8FF]/20 rounded-xl border border-white/5 text-[#8B31FF]"><FiSettings className="w-6 h-6" /></span>
                      Catálogo de Serviços
                    </h2>
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-widest hidden sm:block">Selecione uma categoria</span>
                  </div>

                  <div className="space-y-4">
                    {serviceCategories.map((category) => (
                      <div key={category.id} className="rounded-2xl overflow-hidden bg-white/[0.02] border border-white/5 transition-all duration-300 hover:border-white/10 group">
                        <button
                          id={category.id}
                          onClick={() => toggleCategory(category.id)}
                          className="w-full flex justify-between items-center px-4 sm:px-6 py-5 focus:outline-none transition-all duration-300"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl transition-all duration-500 relative ${selectedCategory?.id === category.id
                              ? 'bg-gradient-to-r from-[#FF4B6B] to-[#8B31FF] shadow-[0_0_20px_rgba(139,49,255,0.3)] text-white'
                              : 'bg-white/5 text-slate-400 group-hover:text-white group-hover:bg-white/10'
                              }`}>
                              {category.id === 'formatacao' && <FiMonitor className="w-6 h-6" />}
                              {category.id === 'otimizacao' && <FiTrendingUp className="w-6 h-6" />}
                              {category.id === 'correcao_windows' && <FiTool className="w-6 h-6" />}
                              {category.id === 'instalacao_impressora' && <FiPrinter className="w-6 h-6" />}
                              {category.id === 'remocao_virus' && <FiShield className="w-6 h-6" />}
                              {category.id === 'recuperacao' && <FiDatabase className="w-6 h-6" />}
                              {category.id === 'instalacao_programas' && <FiSettings className="w-6 h-6" />}
                              {category.id === 'suporte_windows' && <FiCloud className="w-6 h-6" />}
                              {category.id === 'criacao_sites' && <FiGlobe className="w-6 h-6" />}
                            </div>
                            <div className="text-left">
                              <h3 className={`text-lg font-bold transition-colors duration-300 ${selectedCategory?.id === category.id ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                                {category.title}
                              </h3>
                              {/* Subtitle logic could go here if needed */}
                            </div>
                          </div>

                          <div className={`w-8 h-8 rounded-full border border-white/10 flex items-center justify-center transition-all duration-300 ${selectedCategory?.id === category.id ? 'bg-white text-black rotate-180' : 'bg-transparent text-slate-500 group-hover:border-white/30 group-hover:text-white'}`}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </button>

                        <div
                          className={`transition-all duration-500 ease-in-out overflow-hidden ${openCategory === category.id
                            ? 'max-h-[2000px] opacity-100'
                            : 'max-h-0 opacity-0'
                            }`}
                        >
                          <div className="bg-[#05050A]/50 border-t border-white/5 p-4 sm:p-6 space-y-3">
                            {category.options.map((option) => (
                              <div key={option.id}>
                                <div
                                  onClick={() => handleServiceSelect(option)}
                                  className={`p-4 rounded-xl cursor-pointer transition-all duration-300 border ${option.redirectTo
                                    ? 'bg-[#31A8FF]/10 border-[#31A8FF]/30 hover:border-[#31A8FF]'
                                    : selectedServices.some(service => service.id === option.id)
                                      ? 'bg-[#8B31FF]/20 border-[#8B31FF]/50 shadow-[0_0_15px_rgba(139,49,255,0.1)]'
                                      : 'bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/[0.04]'
                                    }`}
                                >
                                  <div className="flex justify-between items-start gap-4">
                                    <div className="flex-1">
                                      <h4 className={`text-base font-bold flex items-center gap-2 ${selectedServices.some(service => service.id === option.id) ? 'text-white' : 'text-slate-200'}`}>
                                        {option.title}
                                        {selectedServices.some(service => service.id === option.id) && !option.redirectTo && (
                                          <FiCheckCircle className="w-4 h-4 text-[#00FF94]" />
                                        )}
                                        {option.redirectTo && <FiGlobe className="w-4 h-4 text-[#31A8FF]" />}
                                      </h4>
                                      <p className="text-xs sm:text-sm mt-1.5 text-slate-400 font-light leading-relaxed">
                                        {option.description}
                                      </p>
                                    </div>
                                    {!option.redirectTo && (
                                      <span className={`text-sm sm:text-base font-bold whitespace-nowrap ${selectedServices.some(service => service.id === option.id)
                                        ? 'text-[#00FF94]'
                                        : 'text-slate-400'
                                        }`}>
                                        R$ {option.price.toFixed(2).replace('.', ',')}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                {/* Diagnóstico Inline */}
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

              {/* Form Column Sticky */}
              <div className="lg:col-span-1">
                <div ref={formRef} className="sticky top-32">
                  <div className="bg-[#0A0A0F]/80 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
                    {/* Decorative Gradient */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-b from-[#31A8FF]/20 to-transparent blur-3xl rounded-full pointer-events-none"></div>

                    <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-white relative z-10">
                      <span className="p-2 bg-gradient-to-r from-[#31A8FF]/20 to-[#8B31FF]/20 rounded-xl border border-white/5 text-[#31A8FF]"><FiShoppingCart className="w-5 h-5" /></span>
                      Finalizar Pedido
                    </h2>

                    <div className="space-y-6 relative z-10">

                      {/* Seletor de Agendamento */}
                      <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">
                          Tipo de Atendimento
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => setSchedulingType('now')}
                            className={`px-3 py-4 rounded-xl text-sm font-bold transition-all duration-300 flex flex-col items-center justify-center gap-2 border ${schedulingType === 'now'
                              ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                              : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10 hover:text-white'
                              }`}
                          >
                            <FiClock className="w-5 h-5" />
                            <span>Imediato</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setSchedulingType('schedule')}
                            className={`px-3 py-4 rounded-xl text-sm font-bold transition-all duration-300 flex flex-col items-center justify-center gap-2 border ${schedulingType === 'schedule'
                              ? 'bg-gradient-to-r from-[#8B31FF] to-[#31A8FF] text-white border-transparent shadow-[0_0_15px_rgba(139,49,255,0.3)]'
                              : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10 hover:text-white'
                              }`}
                          >
                            <FiBarChart2 className="w-5 h-5" />
                            <span>Agendar</span>
                          </button>
                        </div>
                        {formErrors.scheduling && <p className="text-xs text-red-400 pl-1">{formErrors.scheduling}</p>}
                      </div>

                      {/* Input Data */}
                      {schedulingType === 'schedule' && (
                        <div className="space-y-2 animate-fadeIn">
                          <label htmlFor="datetime" className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">
                            Data e Hora
                          </label>
                          <input
                            type="datetime-local"
                            id="datetime"
                            value={appointmentDateTime}
                            onChange={(e) => setAppointmentDateTime(e.target.value)}
                            className={`w-full px-4 py-3 bg-[#121218] border ${formErrors.appointment ? 'border-red-500/50' : 'border-white/10'} rounded-xl focus:outline-none focus:border-[#8B31FF] focus:bg-[#1A1A23] text-white text-sm transition-colors`}
                          />
                          {formErrors.appointment && <p className="text-xs text-red-400 pl-1">{formErrors.appointment}</p>}
                        </div>
                      )}

                      {/* Textarea */}
                      <div className="space-y-2">
                        <label htmlFor="additionalInfo" className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">
                          Observações
                        </label>
                        <textarea
                          id="additionalInfo"
                          value={additionalInfo}
                          onChange={(e) => setAdditionalInfo(e.target.value)}
                          rows={3}
                          className="w-full px-4 py-3 bg-[#121218] border border-white/10 rounded-xl focus:outline-none focus:border-[#31A8FF] focus:bg-[#1A1A23] text-white text-sm resize-none transition-colors"
                          placeholder="Detalhes adicionais..."
                        />
                      </div>

                      {/* Total Box Removed, replaced with simple CTA */}
                      <div className="pt-4 border-t border-white/10 space-y-4">
                        <button
                          onClick={handleSubmitService}
                          disabled={isProcessingCheckout}
                          className="group w-full py-4 text-center font-bold text-white bg-white rounded-xl hover:bg-[#F3F4F6] transition-all shadow-[0_20px_50px_rgba(255,255,255,0.1)] relative overflow-hidden disabled:opacity-50"
                        >
                          <span className="relative z-10 flex items-center justify-center gap-2 text-[#050510]">
                            {isProcessingCheckout ? 'PROCESSANDO...' : 'CONCLUIR ADQUISIÇÃO'} <FiShoppingCart className="w-5 h-5" />
                          </span>
                        </button>
                      </div>
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