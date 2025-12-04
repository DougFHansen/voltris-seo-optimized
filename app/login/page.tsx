'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import Header from "@/components/Header";
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiLoader } from 'react-icons/fi';
import { useAuth } from '@/app/hooks/useAuth';
import { FaWhatsapp } from 'react-icons/fa';
import AdSenseBanner from '../components/AdSenseBanner';
import Footer from '@/components/Footer';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import GoogleLoginButton from '@/components/GoogleLoginButton';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, setLogin] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [state, setState] = useState('');
  const [cep, setCep] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isLoginView, setIsLoginView] = useState(true);
  const [isRecoveryView, setIsRecoveryView] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminChecked, setAdminChecked] = useState(false);
  const [showWhatsAppBtn, setShowWhatsAppBtn] = useState(false);
  const [redirectText, setRedirectText] = useState('Redirecionando para o dashboard...');
  const [redirectUrl, setRedirectUrl] = useState('');
  const [pendingOrder, setPendingOrder] = useState(false);
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();
  const supabase = createClient();
  const pathname = usePathname();
  const hideFooter = pathname === '/login';

  useEffect(() => {
    if (success) {
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            return 100;
          }
          return prev + 2;
        });
      }, 30);

      return () => clearInterval(timer);
    }
  }, [success]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('cadastro') === '1') {
        setIsLoginView(false);
        setIsRecoveryView(false);
      }
      const hasPendingOrder = !!sessionStorage.getItem('pendingOrderData');
      if (params.get('pendingOrder') === 'true' || hasPendingOrder) {
        setShowWhatsAppBtn(true);
        setPendingOrder(true);
      }
      
      // Atualizar texto de redirecionamento baseado nos parâmetros da URL
      const redirect = params.get('redirect');
      setRedirectUrl(redirect || '');
      setRedirectText(redirect ? 'Redirecionando...' : 'Redirecionando para o dashboard...');
    }
  }, []);

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (authLoading) return;
    if (user) {
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
      // Se já está na página de completar perfil, não redireciona!
      if (currentPath.startsWith('/profile')) return;

      if (profile) {
        const missingFields = !profile.phone || !profile.address || !profile.city || !profile.state || !profile.cep;
        if (missingFields) {
          window.location.href = '/profile?completar=1&google=1';
          return;
        }
      }
      window.location.href = '/dashboard';
    }
  }, [user, authLoading, profile]);

  useEffect(() => {
    if (success && adminChecked && user) {
      console.log('[Login] Redirecionando após login. isAdmin:', isAdmin);
      setTimeout(() => {
        if (pendingOrder) {
          console.log('[Login] Redirecionando para /dashboard?pendingOrder=true');
          window.location.href = '/dashboard?pendingOrder=true';
        } else if (redirectUrl) {
          if (redirectUrl === '/restricted-area-admin' || redirectUrl === '%2Frestricted-area-admin') {
            if (isAdmin) {
              console.log('[Login] Redirecionando para /restricted-area-admin');
              window.location.href = '/restricted-area-admin';
            } else {
              console.log('[Login] Redirecionando para /dashboard');
              window.location.href = '/dashboard';
            }
          } else {
            console.log('[Login] Redirecionando para', redirectUrl);
            window.location.href = redirectUrl;
          }
        } else if (isAdmin) {
          console.log('[Login] Redirecionando para /restricted-area-admin');
          window.location.href = '/restricted-area-admin';
        } else {
          console.log('[Login] Redirecionando para /dashboard');
          window.location.href = '/dashboard';
        }
      }, 500);
    }
  }, [success, isAdmin, adminChecked, user, redirectUrl, pendingOrder]);

  // Não renderiza tela em branco, deixa o useEffect redirecionar

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setAdminChecked(false);
    console.log('[Login] Tentando login para', email);

    try {
      const { data: signInData, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !signInData.user) {
        setError(error?.message || 'Usuário ou senha inválidos');
        setLoading(false);
        console.error('[Login] Erro:', error);
        return;
      }

      // Check if user is admin
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', signInData.user.id)
        .single();

      const admin = (profile && profile.is_admin) || signInData.user.user_metadata?.is_admin === true;
      setIsAdmin(admin);
      setAdminChecked(true);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('auth-changed'));
      }
      setSuccess(true);
      console.log('[Login] Login bem-sucedido. isAdmin:', admin);

      // Redirecionamento imediato
      if (typeof window !== 'undefined') {
        if (admin) {
          window.location.href = '/restricted-area-admin';
        } else {
          window.location.href = '/dashboard';
        }
      }
    } catch (err) {
      console.error('[Login] Erro inesperado:', err);
      setError('Ocorreu um erro inesperado ao tentar logar.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validate required fields
      if (!email || !password || !fullName || !phone) {
        throw new Error('Por favor, preencha todos os campos obrigatórios');
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Por favor, insira um email válido');
      }

      // Validate password strength (at least 6 characters)
      if (password.length < 6) {
        throw new Error('A senha deve ter pelo menos 6 caracteres');
      }

      // Validate phone format
      const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
      if (!phoneRegex.test(phone)) {
        throw new Error('Por favor, insira um telefone válido no formato (00) 00000-0000');
      }

      // Validate CEP format
      const cepRegex = /^\d{5}-\d{3}$/;
      if (cep && !cepRegex.test(cep)) {
        throw new Error('Por favor, insira um CEP válido no formato 00000-000');
      }

      // Validate state format (2 characters)
      if (state && state.length !== 2) {
        throw new Error('Por favor, insira um estado válido (2 caracteres)');
      }

      const { data: signUpData, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone,
            city: city,
            neighborhood: neighborhood,
            state: state,
            cep: cep,
            login: login,
          },
        },
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      if (signUpData.user) {
        setSuccess(true);
        console.log('[SignUp] Cadastro bem-sucedido');
      }
    } catch (err: any) {
      console.error('[SignUp] Erro:', err);
      setError(err.message || 'Ocorreu um erro inesperado ao criar a conta.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordRecovery = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setError(error.message);
      } else {
        setError(null);
        alert('Link de recuperação enviado para seu email!');
        setIsRecoveryView(false);
        setIsLoginView(true);
      }
    } catch (err) {
      console.error('[Recovery] Erro:', err);
      setError('Ocorreu um erro inesperado ao enviar o link de recuperação.');
    } finally {
      setLoading(false);
    }
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');
    }
    return value;
  };

  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 8) {
      return numbers.replace(/(\d{5})(\d{3})/, '$1-$2');
    }
    return value;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value));
  };

  const handleCEPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCep(formatCEP(e.target.value));
  };

  function handleFinalizarPedidoWhatsApp() {
    const pedido = JSON.parse(sessionStorage.getItem('pendingOrderData') || '{}');
    if (pedido.planName) {
      // Novo formato de pedido
      let message = '*NOVO PEDIDO DE SERVIÇO*\n\n';
      message += `*Cliente:* ${pedido.customerName || 'Não informado'}\n`;
      message += `*Email:* ${pedido.customerEmail || 'Não informado'}\n`;
      message += `*Telefone:* ${pedido.customerPhone || 'Não informado'}\n`;
      message += `*Plano:* ${pedido.planName}\n`;
      if (pedido.planDescription) message += `*Descrição:* ${pedido.planDescription}\n`;
      if (pedido.planFeatures && pedido.planFeatures.length > 0) {
        message += '*Recursos inclusos:*\n';
        pedido.planFeatures.forEach((feature: string) => {
          message += `- ${feature}\n`;
        });
      }
      if (pedido.planPrice) message += `*Valor:* R$ ${Number(pedido.planPrice).toFixed(2).replace('.', ',')}\n`;
      if (pedido.planType) message += `*Tipo de Plano:* ${pedido.planType}\n`;
      if (pedido.additionalInfo) message += `\n*Informações Adicionais:*\n${pedido.additionalInfo}\n`;
      window.open(`https://wa.me/5511996716235?text=${encodeURIComponent(message)}`, '_blank');
      return;
    }
    // Fallback para pedidos antigos
    const { selectedServices = [], schedulingType, appointmentDateTime, additionalInfo, formattingAnswers = {}, totalPrice } = pedido;
    let message = '*NOVO PEDIDO DE SERVIÇO*\n\n';
    if (selectedServices.length > 0) {
      message += '*Serviços Selecionados:*\n';
      selectedServices.forEach((service: any, idx: number) => {
        message += `- ${service.categoryName} - ${service.serviceName}: R$ ${service.price?.toFixed(2).replace('.', ',')} `;
        if (service.description) message += `\n  Descrição: ${service.description}`;
        message += '\n';
      });
    }
    if (schedulingType) {
      message += `\n*Tipo de Atendimento:* ${schedulingType === 'schedule' ? 'Agendado' : schedulingType === 'now' ? 'Agora' : 'Outro'}\n`;
      if (schedulingType === 'schedule' && appointmentDateTime) {
        message += `*Data/Hora Agendada:* ${appointmentDateTime}\n`;
      }
    }
    if (formattingAnswers && Object.keys(formattingAnswers).length > 0) {
      message += `\n*Status do Computador:*\n`;
      if (formattingAnswers.bootNormally !== undefined) message += `- Liga normalmente: ${formattingAnswers.bootNormally ? 'Sim' : 'Não'}\n`;
      if (formattingAnswers.showsLogo !== undefined) message += `- Mostra logo: ${formattingAnswers.showsLogo ? 'Sim' : 'Não'}\n`;
      if (formattingAnswers.hasRequirements !== undefined) message += `- Tem todos os requisitos: ${formattingAnswers.hasRequirements ? 'Sim' : 'Não'}\n`;
      if (formattingAnswers.hasWindows !== undefined) message += `- Tem Windows: ${formattingAnswers.hasWindows ? 'Sim' : 'Não'}\n`;
      if (formattingAnswers.hasInternet !== undefined) message += `- Tem Internet: ${formattingAnswers.hasInternet ? 'Sim' : 'Não'}\n`;
      if (formattingAnswers.hasPendrive !== undefined) message += `- Tem Pen Drive: ${formattingAnswers.hasPendrive ? 'Sim' : 'Não'}\n`;
      if (formattingAnswers.hasOtherComputer !== undefined) message += `- Tem outro computador: ${formattingAnswers.hasOtherComputer ? 'Sim' : 'Não'}\n`;
    }
    if (additionalInfo) {
      message += `\n*Informações Adicionais:*\n${additionalInfo}\n`;
    }
    if (totalPrice) {
      message += `\n*Total:* R$ ${Number(totalPrice).toFixed(2).replace('.', ',')}`;
    }
    window.open(`https://wa.me/5511996716235?text=${encodeURIComponent(message)}`, '_blank');
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#171313] px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <main className="w-full flex flex-col items-center justify-center max-w-md mx-auto my-6 sm:my-10">
        {/* Botão Voltar ao Site centralizado */}
        <div className="w-full flex justify-center">
          <Link 
            href="/" 
            className="mb-3 sm:mb-6 text-xs sm:text-sm px-6 sm:px-8 py-2 rounded-full bg-gradient-to-r from-[#FF4B6B] to-[#8B31FF] text-white font-semibold shadow hover:opacity-90 transition-all duration-200 flex justify-center items-center text-center"
          >
            VOLTAR AO SITE
          </Link>
        </div>
        
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl">
          {isLoginView && (
            <h1 className="text-lg sm:text-xl font-normal text-center mb-2 sm:mb-4 w-full">
              <span className="text-white">Bem-vindo(a) à </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF]">VOLTRIS</span>
            </h1>
          )}
          
          <div className="w-full bg-gradient-to-br from-[#1c1c1e]/60 to-[#2a2a2e]/60 backdrop-blur-sm p-3 sm:p-6 md:p-8 lg:p-10 rounded-lg shadow-lg border border-[#8B31FF]/10 relative overflow-hidden">
            {/* Reflexos coloridos */}
            <div className="absolute top-0 left-1/4 w-32 sm:w-40 h-32 sm:h-40 bg-[#FF4B6B] opacity-20 rounded-full filter blur-[60px] sm:blur-[80px] pointer-events-none z-0"></div>
            <div className="absolute bottom-0 right-1/4 w-32 sm:w-40 h-32 sm:h-40 bg-[#8B31FF] opacity-20 rounded-full filter blur-[60px] sm:blur-[80px] pointer-events-none z-0"></div>
            <div className="absolute bottom-0 left-1/3 w-32 sm:w-40 h-32 sm:h-40 bg-[#31A8FF] opacity-20 rounded-full filter blur-[60px] sm:blur-[80px] pointer-events-none z-0"></div>
            {/* Overlay escuro */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 pointer-events-none z-0"></div>
            
            <div className="relative z-10">
              <AnimatePresence mode="wait">
                {success ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center py-6 sm:py-8"
                  >
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] opacity-20"
                      />
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
                        className="absolute inset-2 rounded-full bg-[#171313] flex items-center justify-center"
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.4 }}
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] flex items-center justify-center"
                        >
                          <motion.div
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                            className="w-5 h-5 sm:w-6 sm:h-6"
                          >
                            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                              <motion.path
                                d="M20 6L9 17L4 12"
                                stroke="white"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 0.5, delay: 0.6 }}
                              />
                            </svg>
                          </motion.div>
                        </motion.div>
                      </motion.div>
                    </div>
                    <motion.h2
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] mb-3 sm:mb-4"
                    >
                      {isLoginView ? 'Login realizado com sucesso!' : 'Cadastro realizado com sucesso!'}
                    </motion.h2>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                      className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base"
                    >
                      {redirectText}
                    </motion.p>
                    <div className="w-full h-2 bg-[#2a2a2e] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] rounded-full"
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    {!isRecoveryView && !isLoginView && (
                      <div className="mb-4 sm:mb-8 md:mb-10 text-center relative inline-block w-full">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] mb-3 sm:mb-4">
                          Criar Conta
                        </h2>
                        <div className="mx-auto w-16 sm:w-20 md:w-24 h-1 bg-gradient-to-r from-[#FF4B6B] to-[#31A8FF]"></div>
                      </div>
                    )}
                    
                    <form onSubmit={isRecoveryView ? handlePasswordRecovery : (isLoginView ? handleLogin : handleSignUp)} className="space-y-2 sm:space-y-4">
                      {!isLoginView && !isRecoveryView && (
                        <>
                          <div>
                            <label htmlFor="login" className="block text-white text-sm font-bold mb-2">Login:</label>
                            <input
                              type="text"
                              id="login"
                              className="w-full px-3 sm:px-4 py-3 sm:py-3 rounded-lg bg-[#171313] text-white border border-gray-800/50 focus:border-[#FF4B6B] focus:outline-none text-base"
                              value={login}
                              onChange={(e) => setLogin(e.target.value)}
                              required
                            />
                          </div>
                          <div>
                            <label htmlFor="fullName" className="block text-white text-sm font-bold mb-2">Nome Completo:</label>
                            <input
                              type="text"
                              id="fullName"
                              className="w-full px-3 sm:px-4 py-3 sm:py-3 rounded-lg bg-[#171313] text-white border border-gray-800/50 focus:border-[#FF4B6B] focus:outline-none text-base"
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              required
                            />
                          </div>
                          <div>
                            <label htmlFor="phone" className="block text-white text-sm font-bold mb-2">Telefone:</label>
                            <input
                              type="tel"
                              id="phone"
                              className="w-full px-3 sm:px-4 py-3 sm:py-3 rounded-lg bg-[#171313] text-white border border-gray-800/50 focus:border-[#FF4B6B] focus:outline-none text-base"
                              value={phone}
                              onChange={handlePhoneChange}
                              placeholder="(00) 00000-0000"
                              required
                            />
                          </div>
                          
                          {/* Grid responsivo para campos de endereço */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <div>
                              <label htmlFor="city" className="block text-white text-sm font-bold mb-2">Cidade:</label>
                              <input
                                type="text"
                                id="city"
                                className="w-full px-3 sm:px-4 py-3 sm:py-3 rounded-lg bg-[#171313] text-white border border-gray-800/50 focus:border-[#FF4B6B] focus:outline-none text-base"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                required
                              />
                            </div>
                            <div>
                              <label htmlFor="neighborhood" className="block text-white text-sm font-bold mb-2">Bairro:</label>
                              <input
                                type="text"
                                id="neighborhood"
                                className="w-full px-3 sm:px-4 py-3 sm:py-3 rounded-lg bg-[#171313] text-white border border-gray-800/50 focus:border-[#FF4B6B] focus:outline-none text-base"
                                value={neighborhood}
                                onChange={(e) => setNeighborhood(e.target.value)}
                                required
                              />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <div>
                              <label htmlFor="state" className="block text-white text-sm font-bold mb-2">Estado:</label>
                              <input
                                type="text"
                                id="state"
                                className="w-full px-3 sm:px-4 py-3 sm:py-3 rounded-lg bg-[#171313] text-white border border-gray-800/50 focus:border-[#FF4B6B] focus:outline-none text-base"
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                                maxLength={2}
                                placeholder="SP"
                                required
                              />
                            </div>
                            <div>
                              <label htmlFor="cep" className="block text-white text-sm font-bold mb-2">CEP:</label>
                              <input
                                type="text"
                                id="cep"
                                className="w-full px-3 sm:px-4 py-3 sm:py-3 rounded-lg bg-[#171313] text-white border border-gray-800/50 focus:border-[#FF4B6B] focus:outline-none text-base"
                                value={cep}
                                onChange={handleCEPChange}
                                placeholder="00000-000"
                                required
                              />
                            </div>
                          </div>
                        </>
                      )}
                      
                      <div>
                        <label htmlFor="login-email" className="block text-white text-sm font-bold mb-2">E-mail:</label>
                        <input
                          type="email"
                          id="login-email"
                          name="email"
                          autoComplete="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Seu melhor e-mail"
                          className="w-full px-3 sm:px-4 py-3 sm:py-3 rounded-lg bg-[#171313] text-white border border-gray-800/50 focus:border-[#FF4B6B] focus:outline-none text-base"
                          required
                        />
                      </div>
                      
                      {!isRecoveryView && (
                        <div>
                          <label htmlFor="login-password" className="block text-white text-sm font-bold mb-2">Senha:</label>
                          <input
                            type="password"
                            id="login-password"
                            name="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Senha"
                            className="w-full px-3 sm:px-4 py-3 sm:py-3 rounded-lg bg-[#171313] text-white border border-gray-800/50 focus:border-[#FF4B6B] focus:outline-none text-base"
                            required
                          />
                        </div>
                      )}
                      
                      {error && (
                        <p className="text-[#FF4B6B] text-sm italic text-center">{error}</p>
                      )}
                      
                      <div className="flex flex-col items-center justify-center pt-3 sm:pt-6">
                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full py-3 sm:py-4 px-4 sm:px-6 rounded-lg bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-white font-semibold hover:shadow-[0_0_20px_rgba(139,49,255,0.3)] transition-all duration-300 ease-out hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base sm:text-lg min-h-[44px] sm:min-h-[48px]"
                        >
                          {loading ? (
                            <>
                              <FiLoader className="w-5 h-5 animate-spin" />
                              <span className="text-sm sm:text-base">
                                {isRecoveryView ? 'Enviando...' : (isLoginView ? 'Entrando...' : 'Criando conta...')}
                              </span>
                            </>
                          ) : (
                            <span className="text-sm sm:text-base">
                              {isRecoveryView ? 'Enviar Link de Recuperação' : (isLoginView ? 'Entrar' : 'Criar Conta')}
                            </span>
                          )}
                        </button>
                        
                        {isLoginView && !isRecoveryView && (
                          <button
                            type="button"
                            onClick={() => setIsRecoveryView(true)}
                            className="mt-2 sm:mt-4 text-sm text-transparent bg-clip-text bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] hover:opacity-80 transition-all duration-300 min-h-[44px] flex items-center justify-center"
                          >
                            Esqueceu sua senha?
                          </button>
                        )}

                        {isLoginView && !isRecoveryView && (
                          <div className="w-full flex flex-col items-center mt-6">
                            <div className="relative w-full">
                              <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-600/30"></div>
                              </div>
                              <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-gradient-to-br from-[#1c1c1e]/60 to-[#2a2a2e]/60 text-gray-400">ou</span>
                              </div>
                            </div>
                            <div className="mt-4 w-full flex flex-col items-center">
                              <GoogleLoginButton
                                onSuccess={() => {
                                  console.log('Login com Google iniciado');
                                }}
                                onError={(error) => {
                                  setError(error);
                                }}
                                disabled={loading}
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setIsLoginView(false);
                                  setIsRecoveryView(false);
                                }}
                                className="mt-4 font-bold text-sm text-transparent bg-clip-text bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] hover:opacity-80 transition-all duration-300 min-h-[44px] flex items-center justify-center"
                              >
                                Não tem uma conta? Cadastre-se
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Botão Google e link de alternância para cadastro */}
                        {!isRecoveryView && !isLoginView && (
                          <>
                            <div className="w-full flex flex-col items-center mt-6">
                              <div className="relative w-full">
                                <div className="absolute inset-0 flex items-center">
                                  <div className="w-full border-t border-gray-600/30"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                  <span className="px-2 bg-gradient-to-br from-[#1c1c1e]/60 to-[#2a2a2e]/60 text-gray-400">ou</span>
                                </div>
                              </div>
                              <div className="mt-4 w-full flex flex-col items-center">
                                <GoogleLoginButton
                                  onSuccess={() => {
                                    console.log('Cadastro com Google iniciado');
                                  }}
                                  onError={(error) => {
                                    setError(error);
                                  }}
                                  disabled={loading}
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    setIsLoginView(true);
                                    setIsRecoveryView(false);
                                  }}
                                  className="mt-4 font-bold text-sm text-transparent bg-clip-text bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] hover:opacity-80 transition-all duration-300 min-h-[44px] flex items-center justify-center"
                                >
                                  Já tem uma conta? Faça login
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
                    {/* Botão WhatsApp para finalizar pedido */}
          {showWhatsAppBtn && (
            <div className="flex flex-col items-center mt-6 sm:mt-8 w-full max-w-sm sm:max-w-md">
              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 py-3 sm:py-4 px-4 sm:px-6 rounded-xl text-base sm:text-lg font-bold text-white shadow-lg min-h-[44px] sm:min-h-[48px]"
                style={{ background: '#25D366', boxShadow: '0 4px 16px #25d36644' }}
                onClick={handleFinalizarPedidoWhatsApp}
              >
                <FaWhatsapp className="text-xl sm:text-2xl" />
                <span className="text-sm sm:text-base">Finalizar Pedido Pelo WhatsApp</span>
              </button>
                <span className="text-xs text-gray-400 mt-2 text-center">
                  Para quem deseja mais agilidade e rapidez no atendimento.
                </span>
            </div>
          )}
        </div>
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
} 