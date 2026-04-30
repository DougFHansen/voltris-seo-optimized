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
  FiCheckCircle, FiCpu, FiTool, FiLock, FiShoppingCart,
  FiArrowRight, FiMessageSquare
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl p-6 max-w-md w-full transform transition-all duration-300 scale-100 opacity-100 animate-modal-appear shadow-lg">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 p-[2px]">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 text-transparent bg-clip-text">
            Progresso Salvo!
          </h3>
          <p className="text-gray-600 mb-6">
            Quando você voltar, continuará exatamente de onde parou.
          </p>
          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 rounded-lg text-white font-medium hover:opacity-90 transition-all duration-300 transform hover:scale-[1.02]"
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl p-6 max-w-md w-full transform transition-all duration-300 scale-100 opacity-100 animate-modal-appear shadow-lg">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 p-[2px]">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 text-transparent bg-clip-text">
            Bem-vindo de volta!
          </h3>
          <p className="text-gray-600 mb-6">
            Você conseguiu providenciar o pen drive e acesso a outro computador com internet?
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={onContinue}
              className="w-full py-3 px-4 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 rounded-lg text-white font-medium hover:opacity-90 transition-all duration-300 transform hover:scale-[1.02]"
            >
              Sim, tenho tudo pronto
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 px-4 bg-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-300 transition-all duration-300"
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
  const formRef = useRef<HTMLDivElement>(null); // Reference for the form

  const serviceCategories: ServiceCategory[] = [
    {
      id: 'formatacao',
      title: 'Formatação Completa',
      options: [
        {
          id: 'formatacao_basica',
          title: 'Básica',
          price: 19.90,
          description: 'Backup, formatação, instalação de drivers e atualizações.',
          categoryName: 'Formatação Completa',
          serviceName: 'Formatação Básica'
        },
        {
          id: 'formatacao_media',
          title: 'Padrão',
          price: 29.90,
          description: 'Inclui "Básica" + antivírus e otimização básica.',
          categoryName: 'Formatação Completa',
          serviceName: 'Formatação Padrão'
        },
        {
          id: 'formatacao_avancada',
          title: 'Avançada',
          price: 39.90,
          description: 'Inclui "Padrão" + otimização de performance média.',
          categoryName: 'Formatação Completa',
          serviceName: 'Formatação Avançada'
        },
        {
          id: 'formatacao_corporativa',
          title: 'Corporativa',
          price: 69.90,
          description: 'Inclui "Avançada" + Office Suite (permanente*) e otimização avançada.',
          categoryName: 'Formatação Completa',
          serviceName: 'Formatação Corporativa'
        },
        {
          id: 'formatacao_gamer',
          title: 'Gamer',
          price: 89.90,
          description: 'Inclui "Avançada" + Office Suite (opcional) e otimização gamer extrema (FPS, input lag, etc.).',
          categoryName: 'Formatação Completa',
          serviceName: 'Formatação Gamer'
        }
      ]
    },
    {
      id: 'otimizacao',
      title: 'Otimização de Performance (Sem Formatação)',
      options: [
        {
          id: 'otimizacao_basica',
          title: 'Básica',
          price: 15.90,
          description: 'Drivers, atualizações, correção de erros e otimização básica.',
          categoryName: 'Otimização de Performance',
          serviceName: 'Otimização Básica'
        },
        {
          id: 'otimizacao_media',
          title: 'Padrão',
          price: 19.90,
          description: 'Inclui "Básica" + otimização de performance média.',
          categoryName: 'Otimização de Performance',
          serviceName: 'Otimização Padrão'
        },
        {
          id: 'otimizacao_avancada',
          title: 'Avançada',
          price: 29.90,
          description: 'Inclui "Padrão" + otimização de performance avançada.',
          categoryName: 'Otimização de Performance',
          serviceName: 'Otimização Avançada'
        }
      ]
    },
    {
      id: 'correcao_windows',
      title: 'Correção de Erros do Windows',
      options: [
        {
          id: 'correcao_windows',
          title: 'Correção de Erros do Windows',
          price: 9.90,
          description: 'Solução remota e correção de erros para sistemas Windows. Correção de erros do sistema, reparo de arquivos corrompidos, solução de problemas de inicialização, recuperação do sistema, diagnóstico completo e relatório detalhado.',
          categoryName: 'Correções de Erros do Windows',
          serviceName: 'Correção de Erros do Windows'
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
          price: 9.90,
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
          price: 7.90,
          description: 'Varredura e remoção de vírus comuns, malware e spyware.',
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
          price: 20.00,
          description: 'Recuperação de arquivos excluídos/corrompidos (software padrão).',
          categoryName: 'Recuperação de Dados',
          serviceName: 'Recuperação Básica'
        },
        {
          id: 'recuperacao_media',
          title: 'Padrão',
          price: 30.00,
          description: 'Casos complexos, ferramentas especializadas, análise de setores.',
          categoryName: 'Recuperação de Dados',
          serviceName: 'Recuperação Padrão'
        },
        {
          id: 'recuperacao_avancada',
          title: 'Avançada',
          price: 40.00,
          description: 'Discos com falhas graves, clonagem, tratamento de blocos defeituosos.',
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
            
            // If user logged out and has a service selected ready for checkout
            if (formData.readyForCheckout && formData.selectedServices?.[0]) {
               sessionStorage.removeItem('serviceFormData'); // Clear to avoid loop
               processCheckout(formData.selectedServices[0]);
            } else {
              // Only restore data if not for immediate checkout
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

  // Unique effect to handle service initialization
  useEffect(() => {
    if (!initialRender.current) return;

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const abrirParam = params.get('abrir');
      if (abrirParam) {
        const category = serviceCategories.find(category => category.id === abrirParam);
        if (category) {
          // Schedule scroll for after the accordion opens
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

  // Reset scroll state when changing pages
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
      <div className="mt-4 p-4 bg-gray-100 rounded-lg space-y-4 border border-gray-200">
        <h4 className="text-lg font-bold text-gray-900 mb-4">
          Diagnóstico Inicial do Sistema
        </h4>

        {/* First Question - Does the PC Turn On? */}
        <div className="space-y-2 transition-all duration-300 ease-in-out">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
              1
            </div>
            <p className="text-gray-700 text-lg">O computador está ligando?</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => handleFormattingAnswer('bootNormally', true)}
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 transform hover:scale-105 relative ${formattingAnswers.bootNormally === true
                ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg shadow-green-500/30'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                } before:absolute before:inset-0 before:p-[2px] before:bg-gradient-to-r before:from-pink-600 before:via-purple-600 before:to-blue-600 before:rounded-lg before:-z-10 before:transition-all before:duration-300 hover:before:opacity-100 before:opacity-0`}
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
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                } before:absolute before:inset-0 before:p-[2px] before:bg-gradient-to-r before:from-pink-600 before:via-purple-600 before:to-blue-600 before:rounded-lg before:-z-10 before:transition-all before:duration-300 hover:before:opacity-100 before:opacity-0`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Não liga
            </button>
          </div>
        </div>

        {/* Error Message - PC Doesn't Turn On */}
        {formattingAnswers.bootNormally === false && (
          <div className="mt-6 p-6 bg-red-50 border border-red-200 rounded-xl transition-all duration-300 ease-in-out animate-fadeIn">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-gradient-to-r from-red-600 to-red-500">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h5 className="text-xl font-semibold mb-2 bg-gradient-to-r from-red-600 to-red-500 text-transparent bg-clip-text">
                  Atenção: Diagnóstico Presencial Necessário
                </h5>
                <p className="text-red-600/90 text-base leading-relaxed">
                  Quando o computador não liga, pode indicar vários problemas de hardware como fonte de alimentação, placa-mãe ou outros componentes.
                  Recomendamos que você traga seu equipamento ao nosso laboratório técnico para um diagnóstico presencial detalhado.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Second Question - Shows Logo? */}
        {formattingAnswers.bootNormally === true && (
          <div className="space-y-2 transition-all duration-300 ease-in-out animate-fadeIn">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                2
              </div>
              <p className="text-gray-700 text-lg">A tela de inicialização mostra o logo do fabricante?</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleFormattingAnswer('showsLogo', true)}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 transform hover:scale-105 relative ${formattingAnswers.showsLogo === true
                  ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg shadow-green-500/30'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  } before:absolute before:inset-0 before:p-[2px] before:bg-gradient-to-r before:from-pink-600 before:via-purple-600 before:to-blue-600 before:rounded-lg before:-z-10 before:transition-all before:duration-300 hover:before:opacity-100 before:opacity-0`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Sim, mostra o logo
              </button>
              <button
                onClick={() => handleFormattingAnswer('showsLogo', false)}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 transform hover:scale-105 relative ${formattingAnswers.showsLogo === false
                  ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-500/30'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  } before:absolute before:inset-0 before:p-[2px] before:bg-gradient-to-r before:from-pink-600 before:via-purple-600 before:to-blue-600 before:rounded-lg before:-z-10 before:transition-all before:duration-300 hover:before:opacity-100 before:opacity-0`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Tela preta
              </button>
            </div>
          </div>
        )}

        {/* Error Message - Black Screen */}
        {formattingAnswers.showsLogo === false && (
          <div className="mt-6 p-6 bg-red-50 border border-red-200 rounded-xl transition-all duration-300 ease-in-out animate-fadeIn">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-gradient-to-r from-red-600 to-red-500">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h5 className="text-xl font-semibold mb-2 bg-gradient-to-r from-red-600 to-red-500 text-transparent bg-clip-text">
                  Atenção: Diagnóstico Presencial Necessário
                </h5>
                <p className="text-red-600/90 text-base leading-relaxed">
                  Quando o computador liga mas a tela permanece completamente preta (sem mostrar qualquer logo), isso geralmente indica um problema de hardware 
                  como placa de vídeo, memória RAM ou monitor. Recomendamos que você traga seu equipamento ao nosso laboratório técnico 
                  para um diagnóstico presencial detalhado.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Third Question - Windows and Internet */}
        {formattingAnswers.showsLogo === true && (
          <div className="space-y-2 transition-all duration-300 ease-in-out animate-fadeIn">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-pink-600 flex items-center justify-center text-white font-semibold text-sm">
                3
              </div>
              <p className="text-gray-700 text-lg">Você consegue acessar o Windows e a internet?</p>
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
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  } before:absolute before:inset-0 before:p-[2px] before:bg-gradient-to-r before:from-pink-600 before:via-purple-600 before:to-blue-600 before:rounded-lg before:-z-10 before:transition-all before:duration-300 hover:before:opacity-100 before:opacity-0`}
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
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  } before:absolute before:inset-0 before:p-[2px] before:bg-gradient-to-r before:from-pink-600 before:via-purple-600 before:to-blue-600 before:rounded-lg before:-z-10 before:transition-all before:duration-300 hover:before:opacity-100 before:opacity-0`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
                Não funcionam
              </button>
            </div>
          </div>
        )}

        {/* Success Message - Has Windows and Internet */}
        {formattingAnswers.hasWindows === true && formattingAnswers.hasInternet === true && (
          <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-xl transition-all duration-300 ease-in-out animate-fadeIn">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-gradient-to-r from-green-600 to-green-500">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h5 className="text-xl font-semibold mb-2 bg-gradient-to-r from-green-600 to-green-500 text-transparent bg-clip-text">
                  Sistema Pronto para Formatação
                </h5>
                <div className="text-green-600/90 text-base leading-relaxed">
                  <p>Ótimo! Você tem os requisitos básicos necessários para prosseguir com o serviço de formatação.</p>
                  <p className="mt-2">Para continuar, preencha seus dados no formulário ao lado e nossa equipe técnica
                    entrará em contato para agendar o melhor horário e fornecer instruções detalhadas.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Fourth Question - USB Drive and Other Computer */}
        {formattingAnswers.hasWindows === false && formattingAnswers.hasInternet === false && (
          <div className="space-y-2 transition-all duration-300 ease-in-out animate-fadeIn mt-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                4
              </div>
              <p className="text-gray-700 text-lg">Você tem acesso a um pen drive e outro computador?</p>
            </div>
            <div className="bg-gray-200 p-4 rounded-lg mb-4">
              <h6 className="text-gray-900 font-medium mb-2">Requisitos:</h6>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
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
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  } before:absolute before:inset-0 before:p-[2px] before:bg-gradient-to-r before:from-pink-600 before:via-purple-600 before:to-blue-600 before:rounded-lg before:-z-10 before:transition-all before:duration-300 hover:before:opacity-100 before:opacity-0`}
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
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  } before:absolute before:inset-0 before:p-[2px] before:bg-gradient-to-r before:from-pink-600 before:via-purple-600 before:to-blue-600 before:rounded-lg before:-z-10 before:transition-all before:duration-300 hover:before:opacity-100 before:opacity-0`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
                Não tenho nenhum
              </button>
              <button
                onClick={() => {
                  handleFormattingAnswer('hasPendrive', true);
                  handleFormattingAnswer('hasOtherComputer', false);
                  handleFormattingAnswer('hasRequirements', false);
                }}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 transform hover:scale-105 relative ${formattingAnswers.hasPendrive === true && formattingAnswers.hasOtherComputer === false
                  ? 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-white shadow-lg shadow-yellow-500/30'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  } before:absolute before:inset-0 before:p-[2px] before:bg-gradient-to-r before:from-pink-600 before:via-purple-600 before:to-blue-600 before:rounded-lg before:-z-10 before:transition-all before:duration-300 hover:before:opacity-100 before:opacity-0`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Tenho apenas um deles
              </button>
            </div>
          </div>
        )}

        {/* Success Message - Has USB Drive and Other Computer */}
        {formattingAnswers.hasPendrive === true && formattingAnswers.hasOtherComputer === true && (
          <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-xl transition-all duration-300 ease-in-out animate-fadeIn">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-gradient-to-r from-green-600 to-green-500">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h5 className="text-xl font-semibold mb-2 bg-gradient-to-r from-green-600 to-green-500 text-transparent bg-clip-text">
                  Sistema Pronto para Formatação
                </h5>
                <div className="text-green-600/90 text-base leading-relaxed">
                  <p>Ótimo! Você tem os requisitos necessários para prosseguir com o serviço de formatação.</p>
                  <p className="mt-2">Para continuar, preencha seus dados no formulário ao lado e nossa equipe técnica
                    entrará em contato para agendar o melhor horário e fornecer instruções detalhadas.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Message - Requirements Missing */}
        {(formattingAnswers.hasRequirements === false ||
          (formattingAnswers.hasPendrive === true && formattingAnswers.hasOtherComputer === false) ||
          (formattingAnswers.hasPendrive === false && formattingAnswers.hasOtherComputer === true)) && (
            <div className="mt-6 p-6 bg-yellow-50 border border-yellow-200 rounded-xl transition-all duration-300 ease-in-out animate-fadeIn">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-gradient-to-r from-yellow-600 to-yellow-500">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h5 className="text-xl font-semibold mb-2 bg-gradient-to-r from-yellow-600 to-yellow-500 text-transparent bg-clip-text">
                    Requisitos Necessários
                  </h5>
                  <div className="text-yellow-700/90 text-base leading-relaxed space-y-2">
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
                            Vou providenciar e volto depois
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

      // Check if all necessary questions have been answered
      const isFormattingSelected = selectedServices.some(service => service.categoryName === 'Full Formatting');

      if (isFormattingSelected) {
        // For formatting, check if all questions have been answered
        const allQuestionsAnswered =
          newAnswers.bootNormally !== null &&
          newAnswers.showsLogo !== null &&
          newAnswers.hasRequirements !== null;

        // If all questions are answered and system is ready, scroll
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
        // For other services, scroll immediately
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

    let message = `*NOVA SOLICITAÇÃO DE SERVIÇO*\n\n`;
    message += `\n*Serviços Selecionados:*\n`;

    selectedServicesList.forEach(service => {
      message += `- ${service.categoryName} - ${service.serviceName}: R$ ${service.price.toFixed(2)}\n`;
    });

    // Add questionnaire answers if formatting is selected
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
    message += `*Total:* R$ ${totalPrice.toFixed(2)}`;

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
        // Save state to process after login
        const formData = {
            selectedServices: [service],
            schedulingType,
            appointmentDateTime,
            additionalInfo,
            formattingAnswers,
            readyForCheckout: true
        };
        sessionStorage.setItem('serviceFormData', JSON.stringify(formData));
        toast.error("Para prosseguir com a aquisição, por favor faça login ou cadastre-se.");
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
                customer_name: user.user_metadata?.full_name || 'Voltris Client',
            }),
        });

        const data = await response.json();
        if (data.url) {
            window.location.href = data.url;
        } else {
            throw new Error(data.error || 'Erro ao gerar sessão de pagamento');
        }
    } catch (error: any) {
        toast.error(`Checkout falhou: ${error.message}`);
        console.error('Erro de checkout:', error);
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
        needsToConfirmRequirements: true // Add flag to indicate requirements confirmation is needed
      };
      sessionStorage.setItem('serviceFormData', JSON.stringify(formData));
      setIsModalOpen(true);
    } catch (error) {
      console.error('Erro ao salvar progresso:', error);
      alert('Erro ao salvar progresso. Por favor, tente novamente.');
    } finally {
      setIsSavingProgress(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    router.push('/');
  };

  // Modify function to check needsToConfirmRequirements flag
  useEffect(() => {
    const savedFormData = sessionStorage.getItem('serviceFormData');
    const userIsReady = localStorage.getItem('userIsReady');

    if (savedFormData) {
      try {
        const formData = JSON.parse(savedFormData);
        // Show modal if user isn't ready AND
        // (has false requirements OR needs to confirm requirements)
        if (!userIsReady && (formData.formattingAnswers?.hasRequirements === false || formData.needsToConfirmRequirements)) {
          setIsReturnModalOpen(true);
        }
      } catch (error) {
        console.error('Error checking saved progress:', error);
      }
    }
  }, []);

  // Modify function to remove needsToConfirmRequirements flag when user is ready
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
          needsToConfirmRequirements: false // Remove flag when user confirms they are ready
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
    // Save to localStorage that user is ready
    localStorage.setItem('userIsReady', 'true');
    setIsReturnModalOpen(false);
  };

  // Modify function to keep needsToConfirmRequirements flag when user isn't ready
  const handleReturnModalClose = () => {
    setIsReturnModalOpen(false);
    const savedFormData = sessionStorage.getItem('serviceFormData');
    if (savedFormData) {
      try {
        const formData = JSON.parse(savedFormData);
        const updatedFormData = {
          ...formData,
          needsToConfirmRequirements: true // Keep flag when user is not yet ready
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
        <div className="py-20 relative bg-gray-50">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-300 to-transparent -translate-y-1/2 hidden md:block"></div>

          <div className="text-center mb-16 relative z-10">
            <span className="text-blue-600 font-bold tracking-widest uppercase text-xs sm:text-sm mb-2 block">Fluxo de Trabalho</span>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900">
              Como <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Funciona?</span>
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
                  <div className="w-20 h-20 rounded-2xl bg-white border border-gray-200 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-blue-300 transition-all duration-300 shadow-lg relative z-10">
                    <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs shadow-lg">
                      {item.step}
                    </div>
                    <item.icon className="w-8 h-8 text-gray-600 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm max-w-[200px] leading-relaxed">{item.desc}</p>
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
        <div className="py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-white">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 border border-purple-200 mb-6">
              <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse"></span>
              <span className="text-xs font-bold text-purple-600 tracking-widest uppercase">Por que VOLTRIS?</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
              <span className="text-gray-700">Tecnologia que</span> <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Gera Resultados.</span>
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              Diferente do suporte comum, aplicamos engenharia de software para extrair o máximo do seu equipamento. Cada bit otimizado para performance máxima.
            </p>
            <Link href="/sobre" className="inline-flex items-center gap-2 text-gray-900 border-b border-blue-600 hover:text-blue-600 transition-colors pb-1 font-medium group">
              Conheça nossa história
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: FiShield, title: "Garantia Total", desc: "Suporte pós-serviço incluído.", color: "text-purple-600", bg: "bg-purple-100", border: "border-purple-200" },
              { icon: FiUsers, title: "Especialistas Reais", desc: "Equipe sênior certificada.", color: "text-blue-600", bg: "bg-blue-100", border: "border-blue-200" },
              { icon: FiTrendingUp, title: "Performance", desc: "Foco em FPS e velocidade.", color: "text-emerald-600", bg: "bg-emerald-100", border: "border-emerald-200" },
              { icon: FiLock, title: "Segurança", desc: "Acesso criptografado e seguro.", color: "text-pink-600", bg: "bg-pink-100", border: "border-pink-200" }
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 border border-gray-200 p-6 rounded-2xl hover:border-gray-300 transition-all duration-300 group shadow-sm">
                <div className={`w-12 h-12 rounded-xl ${item.bg} border ${item.border} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <item.icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <h3 className="text-gray-900 font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>
    );
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Voltris - Serviços Técnicos Profissionais",
            "description": "Assistência técnica remota especializada em Windows. Formatação, otimização, remoção de vírus e recuperação de dados com segurança e garantia.",
            "provider": {
              "@type": "Organization",
              "name": "Voltris",
              "url": "https://voltris.com.br"
            },
            "areaServed": {
              "@type": "Country",
              "name": "Brasil"
            },
            "serviceType": ["Formatação", "Otimização", "Remoção de Vírus", "Recuperação de Dados"],
            "offers": serviceCategories.flatMap(cat => cat.options.map(opt => ({
              "@type": "Offer",
              "name": opt.serviceName,
              "price": opt.price,
              "priceCurrency": "BRL",
              "category": opt.categoryName
            })))
          })
        }}
      />
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <Header />
        <main>
          {/* Hero Section */}
          <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-purple-100/50 via-transparent to-transparent"></div>
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-100/50 rounded-full blur-3xl pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="text-center">
                <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 leading-tight">
                  <span className="text-gray-700">Serviços Técnicos</span> <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Profissionais</span>
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-2xl">
                  Assistência técnica remota especializada em Windows. Formatação, otimização, remoção de vírus e recuperação de dados com segurança e garantia.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                  <button
                    onClick={() => {
                      const formSection = document.getElementById('services-form');
                      if (formSection) {
                        const header = document.querySelector('header');
                        const offset = header ? header.offsetHeight + 16 : 16;
                        const top = formSection.getBoundingClientRect().top + window.scrollY - offset;
                        window.scrollTo({ top, behavior: 'smooth' });
                      }
                    }}
                    className="px-8 py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all shadow-lg relative overflow-hidden group"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Começar Agora <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>
                  <Link href="/contato" className="px-8 py-4 border border-gray-300 text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition-all flex items-center justify-center gap-2">
                    <FiMessageSquare className="w-5 h-5" />
                    Entre em Contato
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <ServiceProcess />

          <div id="services-form" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div id="catalogo" className="grid lg:grid-cols-3 gap-8 mb-20 relative scroll-mt-32">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-lg">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold flex items-center gap-3 text-gray-900">
                      <span className="p-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl border border-gray-200 text-purple-600"><FiSettings className="w-6 h-6" /></span>
                      Catálogo de Serviços
                    </h2>
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-widest hidden sm:block">Selecione uma categoria</span>
                  </div>

                  <div className="space-y-4">
                    {serviceCategories.map((category) => (
                      <div key={category.id} className="rounded-2xl overflow-hidden bg-gray-50 border border-gray-200 transition-all duration-300 hover:border-gray-300 group">
                        <button
                          id={category.id}
                          onClick={() => toggleCategory(category.id)}
                          className="w-full flex justify-between items-center px-4 sm:px-6 py-5 focus:outline-none transition-all duration-300"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl transition-all duration-500 relative ${selectedCategory?.id === category.id
                              ? 'bg-gradient-to-r from-pink-600 to-purple-600 shadow-[0_0_20px_rgba(139,49,255,0.3)] text-white'
                              : 'bg-gray-100 text-gray-600 group-hover:text-gray-900 group-hover:bg-gray-200'
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
                              <h3 className={`text-lg font-bold transition-colors duration-300 ${selectedCategory?.id === category.id ? 'text-white' : 'text-gray-700 group-hover:text-gray-900'}`}>
                                {category.title}
                              </h3>
                            </div>
                          </div>

                          <div className={`w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center transition-all duration-300 ${selectedCategory?.id === category.id ? 'bg-white text-gray-900 rotate-180' : 'bg-transparent text-gray-500 group-hover:border-gray-400 group-hover:text-gray-900'}`}>
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
                          <div className="bg-gray-100 border-t border-gray-200 p-4 sm:p-6 space-y-3">
                            {category.options.map((option) => (
                              <div key={option.id}>
                                <div
                                  onClick={() => handleServiceSelect(option)}
                                  className={`p-4 rounded-xl cursor-pointer transition-all duration-300 border ${option.redirectTo
                                    ? 'bg-blue-100 border-blue-200 hover:border-blue-300'
                                    : selectedServices.some(service => service.id === option.id)
                                      ? 'bg-purple-100 border-purple-200 shadow-sm'
                                      : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                  <div className="flex justify-between items-start gap-4">
                                    <div className="flex-1">
                                      <h4 className={`text-base font-bold flex items-center gap-2 ${selectedServices.some(service => service.id === option.id) ? 'text-gray-900' : 'text-gray-700'}`}>
                                        {option.title}
                                        {selectedServices.some(service => service.id === option.id) && !option.redirectTo && (
                                          <FiCheckCircle className="w-4 h-4 text-emerald-600" />
                                        )}
                                        {option.redirectTo && <FiGlobe className="w-4 h-4 text-blue-600" />}
                                      </h4>
                                      <p className="text-xs sm:text-sm mt-1.5 text-gray-600 font-light leading-relaxed">
                                        {option.description}
                                      </p>
                                    </div>
                                    {!option.redirectTo && (
                                      <span className={`text-sm sm:text-base font-bold whitespace-nowrap ${selectedServices.some(service => service.id === option.id)
                                        ? 'text-emerald-600'
                                        : 'text-gray-500'
                                        }`}>
                                        R$ {option.price.toFixed(2)}
                                      </span>
                                    )}
                                  </div>
                                </div>
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
                  <div className="bg-white backdrop-blur-xl p-6 rounded-3xl border border-gray-200 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-b from-blue-100/50 to-transparent blur-3xl rounded-full pointer-events-none"></div>

                    <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-gray-900 relative z-10">
                      <span className="p-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl border border-gray-200 text-blue-600"><FiShoppingCart className="w-5 h-5" /></span>
                      Finalizar Pedido
                    </h2>

                    <div className="space-y-6 relative z-10">
                      <div className="space-y-3">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">
                          Tipo de Serviço
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => setSchedulingType('now')}
                            className={`px-3 py-4 rounded-xl text-sm font-bold transition-all duration-300 flex flex-col items-center justify-center gap-2 border ${schedulingType === 'now'
                              ? 'bg-gray-900 text-white border-gray-900 shadow-md'
                              : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200 hover:text-gray-900'
                              }`}
                          >
                            <FiClock className="w-5 h-5" />
                            <span>Imediato</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setSchedulingType('schedule')}
                            className={`px-3 py-4 rounded-xl text-sm font-bold transition-all duration-300 flex flex-col items-center justify-center gap-2 border ${schedulingType === 'schedule'
                              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white border-transparent shadow-md'
                              : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200 hover:text-gray-900'
                              }`}
                          >
                            <FiBarChart2 className="w-5 h-5" />
                            <span>Agendar</span>
                          </button>
                        </div>
                        {formErrors.scheduling && <p className="text-xs text-red-500 pl-1">{formErrors.scheduling}</p>}
                      </div>

                      {schedulingType === 'schedule' && (
                        <div className="space-y-2 animate-fadeIn">
                          <label htmlFor="datetime" className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">
                            Data e Horário
                          </label>
                          <input
                            type="datetime-local"
                            id="datetime"
                            value={appointmentDateTime}
                            onChange={(e) => setAppointmentDateTime(e.target.value)}
                            className={`w-full px-4 py-3 bg-gray-100 border ${formErrors.appointment ? 'border-red-300' : 'border-gray-300'} rounded-xl focus:outline-none focus:border-purple-600 focus:bg-white text-gray-900 text-sm transition-colors`}
                          />
                          {formErrors.appointment && <p className="text-xs text-red-500 pl-1">{formErrors.appointment}</p>}
                        </div>
                      )}

                      <div className="space-y-2">
                        <label htmlFor="additionalInfo" className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">
                          Observações
                        </label>
                        <textarea
                          id="additionalInfo"
                          value={additionalInfo}
                          onChange={(e) => setAdditionalInfo(e.target.value)}
                          rows={3}
                          className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white text-gray-900 text-sm resize-none transition-colors"
                          placeholder="Detalhes adicionais..."
                        />
                      </div>

                      <div className="pt-4 border-t border-gray-200 space-y-4">
                        <button
                          onClick={handleSubmitService}
                          disabled={isProcessingCheckout}
                          className="group w-full py-4 text-center font-bold text-white bg-gray-900 rounded-xl hover:bg-gray-800 transition-all shadow-lg relative overflow-hidden disabled:opacity-50"
                        >
                          <span className="relative z-10 flex items-center justify-center gap-2">
                            {isProcessingCheckout ? 'PROCESSANDO...' : 'COMPLETAR COMPRA'} <FiShoppingCart className="w-5 h-5" />
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