'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { CheckCircle, XCircle, Shield, Zap, TrendingUp, Users } from 'lucide-react';

interface Plan {
  code: 'trial' | 'standard' | 'pro' | 'enterprise'; // Alinhado com LicenseModels.cs
  name: string;
  description: string;
  priceMonthly: number;
  priceDisplay: string;
  maxDevices: number;
  durationMonths: number;
  features: string[];
  popular?: boolean;
  highlight?: string;
}

// ⚠️ FONTE DA VERDADE: LicenseModels.cs (Services/License)
// Alinhado com: App.xaml, API /pagamento, LicenseGenerator
const PLANS: Plan[] = [
  {
    code: 'trial',
    name: 'Trial',
    description: 'Teste gratuito por 7 dias',
    priceMonthly: 0.01, // Valor simbólico MP (sem cobrança nos 7 dias)
    priceDisplay: 'Grátis',
    maxDevices: 1,
    durationMonths: 0, // 7 dias de trial
    features: [
      'Todas as funcionalidades básicas',
      '1 dispositivo',
      '7 dias de teste',
      'Suporte por email',
    ],
    highlight: 'Experimente grátis por 7 dias',
  },
  {
    code: 'standard',
    name: 'Standard',
    description: 'Para uso pessoal em um único computador',
    priceMonthly: 1.00, // TESTE: Original 29.90 (PIX requer mínimo R$ 0,50)
    priceDisplay: 'R$ 1,00',
    maxDevices: 1,
    durationMonths: 12, // 1 ano
    features: [
      'Todas as funcionalidades',
      '1 dispositivo',
      'Atualizações por 1 ano',
      'Suporte por email',
      'Modo Gamer básico',
    ],
  },
  {
    code: 'pro',
    name: 'Pro',
    description: 'Para entusiastas com múltiplos dispositivos',
    priceMonthly: 1.00, // TESTE: Original 59.90 (PIX requer mínimo R$ 0,50)
    priceDisplay: 'R$ 1,00',
    maxDevices: 3,
    durationMonths: 12, // 1 ano
    features: [
      'Todas as funcionalidades',
      '3 dispositivos',
      'Atualizações por 1 ano',
      'Suporte prioritário',
      'Modo Gamer avançado',
      'Otimizações de rede',
      'Perfis automáticos por jogo',
    ],
    popular: true,
  },
  {
    code: 'enterprise',
    name: 'Enterprise',
    description: 'Para empresas e gamers profissionais',
    priceMonthly: 1.00, // TESTE: Original 149.90 (PIX requer mínimo R$ 0,50)
    priceDisplay: 'R$ 1,00',
    maxDevices: 9999, // Ilimitado
    durationMonths: 0, // Vitalício (sem expiração)
    features: [
      'Todas as funcionalidades',
      'Dispositivos ILIMITADOS',
      'Atualizações vitalícias',
      'Suporte 24/7',
      'Todas as otimizações',
      'API de integração',
      'Painel de administração',
      'Implantação em lote',
      'Licença única para múltiplos PCs',
    ],
    highlight: 'Melhor custo-benefício',
  },
];

export default function CheckoutPage() {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Obter plano da URL
    const params = new URLSearchParams(window.location.search);
    const planCode = params.get('plan') || 'pro';
    
    // Encontrar plano correspondente
    const plan = PLANS.find(p => p.code === planCode);
    if (plan) {
      setSelectedPlan(plan);
    } else {
      // Se plano não encontrado, usar Pro como padrão
      setSelectedPlan(PLANS.find(p => p.code === 'pro') || PLANS[1]);
    }

    // Carregar dados do usuário se autenticado
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email || '');
        // Carregar nome completo do perfil se existir
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, phone')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          setFullName(profile.full_name || '');
          setPhone(profile.phone || '');
        }
      }
    };
    loadUser();
  }, [supabase]);

  const handlePurchase = async () => {
    if (!selectedPlan) {
      setError('Selecione um plano');
      return;
    }

    if (!email || !fullName) {
      setError('Email e nome completo são obrigatórios');
      return;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Email inválido');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      console.log('[CHECKOUT] Iniciando pagamento:', {
        plan: selectedPlan.code,
        email,
        fullName,
        phone: phone || 'não informado',
      });

      const response = await fetch('/api/pagamento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: selectedPlan.code,
          email,
          fullName,
          phone: phone || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('[CHECKOUT] Erro na resposta:', data);
        throw new Error(data.error || 'Erro ao criar preferência de pagamento');
      }

      if (!data.init_point) {
        console.error('[CHECKOUT] init_point ausente:', data);
        throw new Error('URL de pagamento não recebida');
      }

      console.log('[CHECKOUT] Redirecionando para Mercado Pago...');
      window.location.href = data.init_point;
    } catch (err: any) {
      console.error('[CHECKOUT] Erro:', err);
      setError(err.message || 'Erro ao processar pagamento');
      setIsLoading(false);
    }
  };

  const getPlanIcon = (code: string) => {
    switch (code) {
      case 'trial':
        return <Zap className="w-12 h-12 text-[#31A8FF]" />;
      case 'pro':
        return <Shield className="w-12 h-12 text-[#8B31FF]" />;
      case 'premium':
        return <TrendingUp className="w-12 h-12 text-[#FF4B6B]" />;
      case 'enterprise':
        return <Users className="w-12 h-12 text-[#31A8FF]" />;
      default:
        return <Shield className="w-12 h-12 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D0D0D] via-[#1A1A2E] to-[#0D0D0D] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Finalizar Compra
          </h1>
          <p className="text-xl text-gray-300">
            Complete seus dados para prosseguir com o pagamento
          </p>
        </div>

        {selectedPlan ? (
          <div className="space-y-8">
            {/* Resumo do Plano Selecionado */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  {getPlanIcon(selectedPlan.code)}
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedPlan.name}</h2>
                    <p className="text-gray-300">{selectedPlan.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-[#31A8FF]">{selectedPlan.priceDisplay}</p>
                  {selectedPlan.durationMonths > 0 && (
                    <p className="text-sm text-gray-400">
                      a cada {selectedPlan.durationMonths === 1 ? 'mês' : `${selectedPlan.durationMonths} meses`}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 pt-4 border-t border-white/10">
                {selectedPlan.features.slice(0, 4).map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#31A8FF] flex-shrink-0" />
                    <span className="text-sm text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Checkout Form */}
            <div className="bg-white rounded-xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Seus Dados
              </h2>

            <div className="space-y-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B31FF] focus:border-transparent text-gray-900"
                  placeholder="seu@email.com"
                />
                <div className="mt-2 bg-amber-50 border-l-4 border-amber-400 p-3 rounded">
                  <div className="flex items-start gap-2">
                    <div className="text-amber-600 font-bold text-lg mt-0.5">⚠️</div>
                    <div>
                      <p className="text-sm font-semibold text-amber-900">IMPORTANTE: Use um email válido!</p>
                      <p className="text-xs text-amber-800 mt-1">
                        Sua <strong>licença será enviada para este email</strong>. Certifique-se de que é um endereço real e que você tem acesso.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B31FF] focus:border-transparent text-gray-900"
                  placeholder="Seu Nome Completo"
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone <span className="text-gray-400">(opcional)</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B31FF] focus:border-transparent text-gray-900"
                  placeholder="(11) 98765-4321"
                />
              </div>

              {/* Trial Info */}
              {selectedPlan.code === 'trial' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">ℹ️ Como funciona o Trial</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Cartão obrigatório para iniciar</li>
                    <li>• Nenhuma cobrança nos primeiros 7 dias</li>
                    <li>• Após 7 dias, cobrança automática se não cancelar</li>
                    <li>• Cancele a qualquer momento sem custo</li>
                  </ul>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                  <XCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-red-800">{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handlePurchase}
                disabled={isLoading}
                className={`
                  w-full py-4 rounded-lg font-bold text-lg transition-all duration-300 shadow-lg
                  ${isLoading
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#8B31FF] to-[#31A8FF] text-white hover:shadow-2xl hover:shadow-[#8B31FF]/50 hover:scale-105'}
                `}
              >
                {isLoading ? 'Processando...' : `Finalizar Compra - ${selectedPlan.priceDisplay}`}
              </button>

              {/* Security Info */}
              <div className="text-center text-sm text-gray-600">
                <p className="flex items-center justify-center">
                  <Shield className="w-4 h-4 mr-2" />
                  Pagamento seguro via Mercado Pago
                </p>
              </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mt-12 text-white">
              <h2 className="text-3xl font-bold text-center mb-8">Perguntas Frequentes</h2>
              <div className="space-y-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <h3 className="font-bold text-lg mb-2">Como funciona o Trial?</h3>
                  <p className="text-gray-300">
                    Você pode testar TODAS as funcionalidades por 7 dias gratuitamente. É necessário cadastrar um cartão,
                    mas você NÃO será cobrado durante o período de teste. Cancele a qualquer momento.
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <h3 className="font-bold text-lg mb-2">Posso cancelar a qualquer momento?</h3>
                  <p className="text-gray-300">
                    Sim! Você pode cancelar sua assinatura a qualquer momento. Após o cancelamento, você manterá acesso
                    até o final do período já pago.
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <h3 className="font-bold text-lg mb-2">Quantos dispositivos posso usar?</h3>
                  <p className="text-gray-300">
                    Depende do plano: Pro (1 dispositivo), Premium (3 dispositivos), Enterprise (ILIMITADO).
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-white">
            <p className="text-xl">Carregando...</p>
          </div>
        )}
      </div>
    </div>
  );
}
