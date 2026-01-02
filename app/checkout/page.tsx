'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { CheckCircle, XCircle, Shield, Zap, TrendingUp, Users } from 'lucide-react';

interface Plan {
  code: 'trial' | 'pro' | 'premium' | 'enterprise';
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

const PLANS: Plan[] = [
  {
    code: 'trial',
    name: 'Trial',
    description: 'Teste gratuito por 7 dias',
    priceMonthly: 0.01,
    priceDisplay: 'Grátis',
    maxDevices: 1,
    durationMonths: 0,
    features: [
      'Todas as funcionalidades básicas',
      '1 dispositivo',
      '7 dias de teste',
      'Suporte por email',
    ],
    highlight: 'Experimente grátis por 7 dias',
  },
  {
    code: 'pro',
    name: 'Pro',
    description: 'Ideal para uso pessoal',
    priceMonthly: 49.90,
    priceDisplay: 'R$ 49,90',
    maxDevices: 1,
    durationMonths: 1,
    features: [
      'Todas as funcionalidades',
      '1 dispositivo',
      'Renovação mensal',
      'Suporte prioritário',
      'Modo Gamer avançado',
      'Otimizações de rede',
    ],
  },
  {
    code: 'premium',
    name: 'Premium',
    description: 'Para múltiplos dispositivos',
    priceMonthly: 99.90,
    priceDisplay: 'R$ 99,90',
    maxDevices: 3,
    durationMonths: 3,
    features: [
      'Todas as funcionalidades',
      '3 dispositivos',
      'Renovação a cada 3 meses',
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
    description: 'Uso ilimitado para empresas',
    priceMonthly: 149.90,
    priceDisplay: 'R$ 149,90',
    maxDevices: 9999,
    durationMonths: 6,
    features: [
      'Todas as funcionalidades',
      'Dispositivos ILIMITADOS',
      'Renovação a cada 6 meses',
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
        return <Zap className="w-12 h-12 text-blue-500" />;
      case 'pro':
        return <Shield className="w-12 h-12 text-green-500" />;
      case 'premium':
        return <TrendingUp className="w-12 h-12 text-purple-500" />;
      case 'enterprise':
        return <Users className="w-12 h-12 text-orange-500" />;
      default:
        return <Shield className="w-12 h-12 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Escolha o Plano Ideal Para Você
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Otimize seu PC com o Voltris Optimizer. Trial de 7 dias grátis com cartão obrigatório.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {PLANS.map((plan) => (
            <div
              key={plan.code}
              onClick={() => setSelectedPlan(plan)}
              className={`
                relative bg-white rounded-xl shadow-xl p-6 cursor-pointer transition-all duration-300
                ${selectedPlan?.code === plan.code
                  ? 'ring-4 ring-blue-500 transform scale-105'
                  : 'hover:shadow-2xl hover:scale-102'}
                ${plan.popular ? 'border-4 border-yellow-400' : ''}
              `}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-bold">
                  MAIS POPULAR
                </div>
              )}

              <div className="flex flex-col items-center mb-4">
                {getPlanIcon(plan.code)}
                <h3 className="text-2xl font-bold text-gray-900 mt-4">{plan.name}</h3>
                <p className="text-sm text-gray-600 text-center mt-2">{plan.description}</p>
              </div>

              <div className="text-center mb-6">
                <span className="text-4xl font-bold text-gray-900">{plan.priceDisplay}</span>
                {plan.durationMonths > 0 && (
                  <span className="text-sm text-gray-600 block mt-1">
                    a cada {plan.durationMonths === 1 ? 'mês' : `${plan.durationMonths} meses`}
                  </span>
                )}
                {plan.highlight && (
                  <span className="text-xs text-blue-600 font-semibold block mt-2">
                    {plan.highlight}
                  </span>
                )}
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start text-sm">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => setSelectedPlan(plan)}
                className={`
                  w-full py-3 rounded-lg font-semibold transition-colors duration-200
                  ${selectedPlan?.code === plan.code
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-900 hover:bg-gray-300'}
                `}
              >
                {selectedPlan?.code === plan.code ? 'Selecionado' : 'Selecionar'}
              </button>
            </div>
          ))}
        </div>

        {/* Checkout Form */}
        {selectedPlan && (
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Finalizar Compra - {selectedPlan.name}
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="seu@email.com"
                />
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
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
                  w-full py-4 rounded-lg font-bold text-lg transition-colors duration-200
                  ${isLoading
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'}
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
        )}

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mt-16 text-white">
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
    </div>
  );
}
