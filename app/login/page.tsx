'use client';

import { useState, useEffect, Suspense, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
// Header/Footer not imported to ensure clean full screen
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/app/hooks/useAuth';
import GoogleLoginButton from '@/components/GoogleLoginButton';

// Icons
import { FaWhatsapp } from 'react-icons/fa';
import { Mail, Lock, User, Phone as PhoneIcon, MapPin, ArrowLeft, Loader2, CheckCircle, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050510]" />}>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // --- STATES ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, setLogin] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [state, setState] = useState('');
  const [cep, setCep] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [isCepLoading, setIsCepLoading] = useState(false);
  const [isCepValid, setIsCepValid] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isLoginView, setIsLoginView] = useState(true);
  const [isRecoveryView, setIsRecoveryView] = useState(false);
  const [signupStep, setSignupStep] = useState(1); // 1, 2, 3

  const [isAdmin, setIsAdmin] = useState(false);
  const [showWhatsAppBtn, setShowWhatsAppBtn] = useState(false);
  const [redirectText, setRedirectText] = useState('Redirecionando...');
  
  const redirectUrl = searchParams.get('redirect') || '';
  const pendingOrder = searchParams.get('pendingOrder') === 'true';
  const installationId = searchParams.get('installation_id');

  const { user, profile, loading: authLoading, isAdmin: authIsAdmin } = useAuth();
  const supabase = useMemo(() => createClient(), []);
  // --- EFFECTS ---
  useEffect(() => {
    if (searchParams.get('cadastro') === '1' || searchParams.get('signup') === 'true') {
      setIsLoginView(false);
      setIsRecoveryView(false);
    }

    const urlError = searchParams.get('error');
    if (urlError) {
      setError(decodeURIComponent(urlError));
    }
  }, [searchParams]);

  const linkInstallation = async (userId: string) => {
    if (!installationId) return;
    try {
      await fetch('/api/v1/install/link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ installation_id: installationId, user_id: userId })
      });
      console.log('Dispositivo vinculado com sucesso!');
    } catch (err) {
      console.error('Erro ao vincular dispositivo:', err);
    }
  };

  const getFinalRedirect = useCallback(() => {
    // Se houver redirectUrl válido (ex: /adquirir-licenca?plan=pro), tem prioridade máxima
    if (redirectUrl && redirectUrl !== '/' && !redirectUrl.includes('/login')) {
      if (redirectUrl.includes('restricted') && !authIsAdmin) return '/dashboard';
      return redirectUrl;
    }
    if (pendingOrder) return '/dashboard?pendingOrder=true';
    return authIsAdmin ? '/restricted-area-admin' : '/dashboard';
  }, [redirectUrl, pendingOrder, authIsAdmin]);

  // Se o usuário já está logado ao chegar na página de login, redirecionar imediatamente
  useEffect(() => {
    if (authLoading || success) return;

    if (user) {
      const dest = getFinalRedirect();
      if (installationId) {
        linkInstallation(user.id).then(() => {
          window.location.href = dest;
        });
      } else {
        window.location.href = dest;
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading]);

  // --- HELPERS ---
  const translateError = (err: string) => {
    const msg = err.toLowerCase();
    if (msg.includes('unable to validate email address') || msg.includes('invalid format')) return 'Formato de e-mail inválido.';
    if (msg.includes('invalid login credentials')) return 'E-mail/Usuário ou senha incorretos.';
    if (msg.includes('email not confirmed')) return 'E-mail não confirmado. Verifique sua caixa de entrada.';
    if (msg.includes('user not found') || msg.includes('usuário não encontrado')) return 'Este usuário não foi encontrado.';
    if (msg.includes('password should be at least')) return 'A senha deve ter pelo menos 6 caracteres.';
    if (msg.includes('user already registered')) return 'Este usuário/e-mail já está cadastrado.';
    if (msg.includes('network error')) return 'Erro de conexão. Verifique sua internet.';
    return 'Ocorreu um erro técnico. Tente novamente.';
  };

  const validateEmail = (emailStr: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);
  };

  // --- HANDLERS ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      let loginEmail = email.trim();
      const isEmail = validateEmail(loginEmail);

      // Se não for e-mail, tenta buscar por username
      if (!isEmail) {
        try {
          const res = await fetch('/api/v1/auth/get-email-by-username', {
            method: 'POST',
            body: JSON.stringify({ username: loginEmail }),
          });
          const data = await res.json();
          if (data.email) {
            loginEmail = data.email;
          } else {
            throw new Error('Usuário não encontrado');
          }
        } catch (err) {
          throw new Error('Usuário não encontrado ou erro de conexão.');
        }
      }

      console.log('🔄 Iniciando login para:', loginEmail);
      const { data: signInData, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password
      });

      if (error || !signInData.user) throw new Error(error?.message || 'Credenciais inválidas');
      console.log('✅ Login bem-sucedido:', signInData.user.id);

      // Busca admin de forma fail-safe
      let admin = signInData.user.user_metadata?.is_admin === true;
      try {
        const profilePromise = supabase.from('profiles').select('is_admin').eq('id', signInData.user.id).single();
        const timeoutPromise = new Promise((_, r) => setTimeout(() => r(new Error('TIMEOUT')), 2500));
        const { data: profileData } = await Promise.race([profilePromise, timeoutPromise]) as any;
        if (profileData) admin = profileData.is_admin || admin;
      } catch (err) {
        console.warn('⚠️ [AUTH] Erro ou timeout ao buscar admin no login, prosseguindo com metadados.');
      }

      // Link de instalação em background para não travar o login
      if (installationId) {
        linkInstallation(signInData.user.id).catch(err => console.error('Erro linkInstallation:', err));
      }

      setSuccess(true);
      if (typeof window !== 'undefined') window.dispatchEvent(new Event('auth-changed'));

      // Redirecionar diretamente após login bem-sucedido
      const dest = (redirectUrl && redirectUrl !== '/' && !redirectUrl.includes('/login'))
        ? (redirectUrl.includes('restricted') && !admin ? '/dashboard' : redirectUrl)
        : (pendingOrder ? '/dashboard?pendingOrder=true' : (admin ? '/restricted-area-admin' : '/dashboard'));

      console.log('🚀 Redirecionando para:', dest);

      // Reduzir delay do timeout para feedback mais rápido
      setTimeout(() => {
        window.location.href = dest;
      }, 400);
    } catch (err: any) {
      console.error('❌ Erro no handleLogin:', err);
      setError(translateError(err.message));
      setLoading(false); // Garantir que desativa o loading em caso de erro
    } finally {
      // O loading só deve ficar true se success for false e não houver erro
      // Mas se o redirect demorar, o botão pode mostrar o spinner ainda.
    }
  };

  const handleNextStep = async () => {
    if (signupStep === 1) {
      if (!login) return setError("Preencha o Usuário.");
      if (!email) return setError("Preencha o E-mail.");
      if (!validateEmail(email)) return setError("Formato de e-mail inválido.");
      if (!password || password.length < 6) return setError("A senha precisa ter pelo menos 6 dígitos.");
      
      // Validação Profissional de Existência e Descartáveis
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/v1/auth/validate-email', {
          method: 'POST',
          body: JSON.stringify({ email: email.trim() }),
        });
        const data = await response.json();
        if (!data.valid) {
          setError(data.error || "Este e-mail é inválido.");
          setLoading(false);
          return;
        }
      } catch (err) {
        setError("Erro crítico de validação de e-mail. Tente novamente.");
        setLoading(false);
        return;
      } finally {
        setLoading(false);
      }
    }
    
    if (signupStep === 2) {
      if (!fullName) return setError("Preencha o Nome Completo.");
      if (!phone) return setError("Preencha o WhatsApp.");
      if (!validateBrazilianPhone(phone)) {
        return setError("Número de WhatsApp inválido ou DDD inexistente.");
      }
    }
    setError(null);
    setSignupStep(prev => prev + 1);
  };

  const handleSignUp = async () => {
    if (!cep || !state || !city || !street || !number) {
      return setError("Por favor, preencha o endereço completo.");
    }
    if (!isCepValid) {
      return setError("O CEP informado é inválido. Por favor, utilize um CEP real.");
    }
    setError(null);
    setLoading(true);

    try {
      // 1. Bloqueio Profissional de WhatsApp Duplicado
      const cleanPhone = phone.replace(/\D/g, '');
      const { data: directCheck } = await supabase
        .from('profiles')
        .select('id')
        .or(`phone.eq.${phone},phone.ilike.%${cleanPhone}%`)
        .maybeSingle();

      if (directCheck) {
        setLoading(false);
        return setError("Este WhatsApp já está em uma conta. Use outro número.");
      }

      const { data: signUpData, error } = await supabase.auth.signUp({
        email, password,
        options: { 
          data: { 
            full_name: fullName, 
            phone, 
            city, 
            neighborhood, 
            state, 
            cep, 
            address: `${street}, ${number}`,
            login 
          } 
        },
      });
      if (error) throw error;

      if (signUpData.user) {
        // Verifica se sessão foi criada (login automático)
        let session = signUpData.session;

        // Se não houver sessão, tenta login forçado (caso conf. email esteja desligada mas não logo)
        if (!session) {
          const { data: signInData } = await supabase.auth.signInWithPassword({ email, password });
          session = signInData.session;
        }

        if (session) {
          setSuccess(true);
          if (typeof window !== 'undefined') window.dispatchEvent(new Event('auth-changed'));

          // Redirecionar diretamente após cadastro
          const dest = (redirectUrl && redirectUrl !== '/' && !redirectUrl.includes('/login'))
            ? redirectUrl
            : '/dashboard';

          setTimeout(() => {
            window.location.href = dest;
          }, 800);
        } else {
          // Requer confirmação de email
          setRedirectText("Cadastro realizado! Verifique seu e-mail para confirmar.");
          setSuccess(true);
          // Redireciona para tela de login após delay
          setTimeout(() => {
            setSuccess(false);
            setIsLoginView(true);
            setSignupStep(1);
            setRedirectText("Redirecionando...");
          }, 5000);
        }
      }
    } catch (err: any) {
      setError(translateError(err.message));
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordRecovery = async () => {
    setError(null); setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
      if (error) throw error;
      alert("Email enviado!"); setIsRecoveryView(false); setIsLoginView(true);
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  };

  // Formatters
  const formatPhone = (v: string) => { const n = v.replace(/\D/g, ''); return n.length <= 11 ? n.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3') : v; };
  const formatCEP = (v: string) => { const n = v.replace(/\D/g, ''); return n.length <= 8 ? n.replace(/(\d{5})(\d{3})/, '$1-$2') : v; };

  const validateBrazilianPhone = (v: string) => {
    const n = v.replace(/\D/g, '');
    // Verifica tamanho 11 (DDD + 9 + 8 dígitos)
    if (n.length !== 11) return false;
    // O nono dígito (pos 2) deve ser obrigatoriamente 9 para celulares
    if (n[2] !== '9') return false;
    // Lista de DDDs válidos no Brasil
    const validDDDs = [
      '11','12','13','14','15','16','17','18','19',
      '21','22','24','27','28','31','32','33','34','35','37','38',
      '41','42','43','44','45','46','47','48','49',
      '51','53','54','55','61','62','63','64','65','66','67','68','69',
      '71','73','74','75','77','79','81','82','83','84','85','86','87','88','89',
      '91','92','93','94','95','96','97','98','99'
    ];
    if (!validDDDs.includes(n.substring(0, 2))) return false;
    return true;
  };

  const handleCepChange = async (v: string) => {
    const formattedCep = formatCEP(v);
    setCep(formattedCep);

    const cleanCep = formattedCep.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      setIsCepLoading(true);
      setIsCepValid(false);
      setError(null);
      
      try {
        console.log('🔍 Validando CEP via Servidor:', cleanCep);
        const response = await fetch('/api/v1/auth/validate-cep', {
          method: 'POST',
          body: JSON.stringify({ cep: cleanCep }),
          headers: { 'Content-Type': 'application/json' }
        });
        
        const resData = await response.json();
        console.log('✅ Resposta do Servidor:', resData);
        
        if (!resData.valid) {
          setError(resData.error || "Este CEP não existe. Digite um CEP real.");
          setCity(''); setNeighborhood(''); setState(''); setStreet('');
          setIsCepValid(false);
        } else {
          // Extrair dados da resposta do servidor
          const { street, neighborhood, city, state } = resData.data;
          
          setCity(city || '');
          setNeighborhood(neighborhood || '');
          setState(state || '');
          setStreet(street || '');
          setError(null);
          setIsCepValid(true);
          console.log('🎯 Endereço preenchido com sucesso!');
        }
      } catch (err) {
        console.error('❌ Erro na validação de CEP:', err);
        setError("Erro de rede ao validar CEP. Tente novamente.");
        setIsCepValid(false);
      } finally {
        setIsCepLoading(false);
      }
    } else {
      setIsCepValid(false);
    }
  };

  return (
    <div className="h-[100dvh] w-full bg-[#050510] relative overflow-hidden flex items-center justify-center font-sans selection:bg-[#31A8FF]/30">

      {/* Backgrounds */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#31A8FF]/10 blur-[120px] rounded-full"></div>

      {/* Back Button */}
      <Link href="/" className="absolute top-8 left-8 z-50 flex items-center gap-2 text-slate-400 hover:text-white transition-colors group px-4 py-2 rounded-full hover:bg-white/5">
        {/* Arrow Colored by Brand - Primary Pink */}
        <ArrowLeft className="w-4 h-4 text-[#FF4B6B] group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Voltar</span>
      </Link>

      {/* Card */}
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-[400px] mx-4 relative z-10">
        <div className="bg-[#0A0A0F]/90 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden relative">
          {/* Gradient Border Top */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF]"></div>

          <div className="p-8">
            {/* Header Centered Flex */}
            <div className="flex flex-col items-center justify-center mb-6 w-full text-center">
              {/* Titulo Reduzido - text-sm */}
              <h1 className="text-sm font-bold text-white tracking-tight mb-1 whitespace-nowrap">
                {isRecoveryView ? 'Recuperação' : (isLoginView ? 'Bem-vindo' : 'Criar Conta')}
              </h1>
              {/* Subtitulo Micro - text-[10px] */}
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                {isRecoveryView ? 'Redefinir Senha' : (isLoginView ? 'Acesse o Painel' : `Etapa ${signupStep} de 3`)}
              </p>
            </div>

            <AnimatePresence mode="wait">
              {success ? (
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-10 flex flex-col items-center relative">
                  <div className="absolute inset-0 bg-emerald-500/20 blur-[50px] rounded-full pointer-events-none"></div>
                  <div className="relative z-10 w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                    <CheckCircle className="w-10 h-10 text-emerald-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Sucesso!</h2>
                  <p className="text-emerald-400/80 text-sm max-w-[250px] font-medium animate-pulse">{redirectText}</p>
                </motion.div>
              ) : (
                <motion.div key={isLoginView ? 'login' : 'signup'} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">

                  {/* --- LOGIN FORM --- */}
                  {isLoginView && !isRecoveryView && (
                    <form 
                      onSubmit={handleLogin} 
                      className="space-y-4 p-0 m-0 w-full"
                    >
                      <div className="space-y-4">
                        <div className="bg-[#121218] border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3 focus-within:border-[#31A8FF] transition-all group/input">
                          <Mail className="w-4 h-4 text-slate-500 group-focus-within/input:text-[#31A8FF] transition-colors" />
                          <input
                            type="text"
                            placeholder="E-mail ou Usuário"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="bg-transparent w-full text-white text-sm outline-none placeholder:text-slate-600 appearance-none"
                            autoComplete="username"
                            required
                          />
                        </div>
                        <div className="bg-[#121218] border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3 focus-within:border-[#31A8FF] transition-all group/input">
                          <Lock className="w-4 h-4 text-slate-500 group-focus-within/input:text-[#31A8FF] transition-colors" />
                          <input 
                            type="password" 
                            placeholder="Sua Senha" 
                            value={password} 
                            onChange={e => setPassword(e.target.value)} 
                            className="bg-transparent w-full text-white text-sm outline-none placeholder:text-slate-600 appearance-none" 
                            autoComplete="current-password"
                            required
                          />
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button type="button" onClick={() => setIsRecoveryView(true)} className="text-xs text-slate-500 hover:text-[#31A8FF] transition-colors font-medium">Esqueci a senha</button>
                      </div>

                      {error && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                          <p className="text-red-400 text-xs text-center font-bold tracking-tight">{error}</p>
                        </motion.div>
                      )}

                      <button 
                        type="submit" 
                        disabled={loading} 
                        className="w-full py-3 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] hover:brightness-110 active:scale-[0.98] text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-[#8B31FF]/20 flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Entrando...</span>
                          </>
                        ) : (
                          <>
                            <span>Entrar no Painel</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>

                      <div className="py-2 flex items-center gap-4">
                        <div className="h-px flex-1 bg-white/5"></div>
                        <span className="text-[10px] font-bold text-white/10 uppercase tracking-widest">OU</span>
                        <div className="h-px flex-1 bg-white/5"></div>
                      </div>

                      <div className="w-full flex justify-center">
                        <GoogleLoginButton 
                          onSuccess={() => {}} 
                          onError={(err) => setError(translateError(err))} 
                          disabled={loading} 
                          redirect={redirectUrl} 
                        />
                      </div>
                    </form>
                  )}

                  {/* --- SIGNUP WIZARD --- */}
                  {!isLoginView && !isRecoveryView && (
                    <div className="space-y-4">
                      {signupStep === 1 && (
                        <div className="space-y-3">
                          <div className="bg-[#121218] border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3"><User className="w-4 h-4 text-slate-500" /><input type="text" placeholder="Usuário (Login)" value={login} onChange={e => setLogin(e.target.value)} className="bg-transparent w-full text-white text-sm outline-none" /></div>
                          <div className="bg-[#121218] border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3"><Mail className="w-4 h-4 text-slate-500" /><input type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} className="bg-transparent w-full text-white text-sm outline-none" /></div>
                          <div className="bg-[#121218] border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3"><Lock className="w-4 h-4 text-slate-500" /><input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} className="bg-transparent w-full text-white text-sm outline-none" /></div>
                        </div>
                      )}
                      {signupStep === 2 && (
                        <div className="space-y-3">
                          <div className="bg-[#121218] border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3"><User className="w-4 h-4 text-slate-500" /><input type="text" placeholder="Nome Completo" value={fullName} onChange={e => setFullName(e.target.value)} className="bg-transparent w-full text-white text-sm outline-none" /></div>
                          <div className="bg-[#121218] border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3"><PhoneIcon className="w-4 h-4 text-slate-500" /><input type="tel" placeholder="WhatsApp" value={phone} onChange={e => setPhone(formatPhone(e.target.value))} className="bg-transparent w-full text-white text-sm outline-none" /></div>
                        </div>
                      )}
                      {signupStep === 3 && (
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-[#121218] border border-white/10 rounded-xl px-4 py-3 flex items-center gap-2 focus-within:border-[#31A8FF] transition-all">
                              <input 
                                type="text" 
                                placeholder="CEP" 
                                value={cep} 
                                onChange={e => handleCepChange(e.target.value)} 
                                className="bg-transparent w-full text-white text-sm outline-none" 
                              />
                              {isCepLoading && <Loader2 className="w-4 h-4 text-[#31A8FF] animate-spin" />}
                            </div>
                            <div className="bg-[#121218] border border-white/10 rounded-xl px-4 py-3">
                              <input 
                                type="text" 
                                placeholder="UF" 
                                maxLength={2} 
                                readOnly={isCepValid}
                                value={state} 
                                onChange={e => !isCepValid && setState(e.target.value.toUpperCase())} 
                                className={`bg-transparent w-full text-white text-sm outline-none transition-all ${isCepValid ? 'opacity-30 cursor-not-allowed select-none' : ''}`} 
                              />
                            </div>
                          </div>
                          <div className="bg-[#121218] border border-white/10 rounded-xl px-4 py-3">
                            <input 
                              type="text" 
                              placeholder="Rua / Logradouro" 
                              readOnly={isCepValid}
                              value={street} 
                              onChange={e => !isCepValid && setStreet(e.target.value)} 
                              className={`bg-transparent w-full text-white text-sm outline-none transition-all ${isCepValid ? 'opacity-30 cursor-not-allowed select-none' : ''}`} 
                            />
                          </div>
                          <div className="grid grid-cols-3 gap-3">
                            <div className="col-span-2 bg-[#121218] border border-white/10 rounded-xl px-4 py-3">
                              <input 
                                type="text" 
                                placeholder="Bairro" 
                                readOnly={isCepValid}
                                value={neighborhood} 
                                onChange={e => !isCepValid && setNeighborhood(e.target.value)} 
                                className={`bg-transparent w-full text-white text-sm outline-none transition-all ${isCepValid ? 'opacity-30 cursor-not-allowed select-none' : ''}`} 
                              />
                            </div>
                            <div className="bg-[#121218] border border-[#31A8FF]/30 rounded-xl px-4 py-3 focus-within:border-[#31A8FF] transition-all bg-gradient-to-br from-[#31A8FF]/5 to-transparent">
                              <input 
                                type="text" 
                                placeholder="Nº" 
                                value={number} 
                                onChange={e => setNumber(e.target.value)} 
                                className="bg-transparent w-full text-white text-sm outline-none placeholder:text-[#31A8FF]/40 font-bold" 
                              />
                            </div>
                          </div>
                          <div className="bg-[#121218] border border-white/10 rounded-xl px-4 py-3">
                            <input 
                              type="text" 
                              placeholder="Cidade" 
                              readOnly={isCepValid}
                              value={city} 
                              onChange={e => !isCepValid && setCity(e.target.value)} 
                              className={`bg-transparent w-full text-white text-sm outline-none transition-all ${isCepValid ? 'opacity-30 cursor-not-allowed select-none' : ''}`} 
                            />
                          </div>
                          {isCepValid && (
                            <button 
                              type="button"
                              onClick={() => { setCep(''); setIsCepValid(false); setStreet(''); setNeighborhood(''); setCity(''); setState(''); }}
                              className="text-[10px] text-[#FF4B6B] font-bold uppercase tracking-widest hover:underline text-center w-full mt-1"
                            >
                              Corrigir CEP / Digitar Manualmente
                            </button>
                          )}
                        </div>
                      )}

                      {error && <p className="text-red-400 text-xs text-center">{error}</p>}

                      <div className="flex gap-3 pt-2">
                        {signupStep > 1 && <button onClick={() => setSignupStep(prev => prev - 1)} className="px-4 py-3 rounded-xl border border-white/10 text-slate-400 hover:text-white text-sm">Voltar</button>}
                        <button onClick={signupStep < 3 ? handleNextStep : handleSignUp} disabled={loading} className="flex-1 py-3 bg-gradient-to-r from-[#FF4B6B] to-[#8B31FF] text-white font-bold rounded-xl text-sm shadow-lg hover:brightness-110">
                          {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : (signupStep < 3 ? 'Próximo' : 'Concluir')}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* --- RECOVERY --- */}
                  {isRecoveryView && (
                    <div className="space-y-4">
                      <p className="text-slate-400 text-sm text-center">Digite seu email para receber o link.</p>
                      <div className="bg-[#121218] border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3"><Mail className="w-4 h-4 text-slate-500" /><input type="email" placeholder="E-mail cadastrado" value={email} onChange={e => setEmail(e.target.value)} className="bg-transparent w-full text-white text-sm outline-none" /></div>
                      <button onClick={handlePasswordRecovery} disabled={loading} className="w-full py-3 bg-[#31A8FF] text-white font-bold rounded-xl text-sm">Enviar Link</button>
                      <button onClick={() => setIsRecoveryView(false)} className="w-full text-center text-xs text-slate-500">Voltar</button>
                    </div>
                  )}

                  <div className="pt-4 border-t border-white/5 text-center">
                    {!isRecoveryView && (
                      <div className="space-y-3">
                        <button onClick={() => { setIsLoginView(!isLoginView); setSignupStep(1); setError(null); }} className="text-sm text-slate-400">
                          {isLoginView ? 'Não tem conta? ' : 'Já tem conta? '}

                          <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] hover:opacity-80 transition-opacity">
                            {isLoginView ? 'Cadastre-se' : 'Faça Login'}
                          </span>

                        </button>
                      </div>
                    )}
                    {isLoginView && !isRecoveryView && (
                      <div className="mt-4 flex justify-center w-full relative">
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
