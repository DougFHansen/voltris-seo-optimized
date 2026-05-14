"use client";

import { motion } from "framer-motion";
import { 
  Zap, 
  Shield, 
  Cpu, 
  MousePointer2, 
  Briefcase, 
  Monitor, 
  MessageCircle, 
  Check,
  Star,
  Trophy,
  Activity,
  ArrowRight
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";

// --- Configurações de Branding & Preços ---
const WHATSAPP_LINK = "https://wa.me/5511996716235?text=Olá! Gostaria de saber mais sobre os serviços de otimização da Voltris.";

const GAMER_PLANS = [
  {
    name: "Gamer PRO",
    price: "197",
    description: "Ideal para quem busca estabilidade e fim dos stutters.",
    features: [
      "Otimização de Processos Windows",
      "Limpeza de Telemetria e Bloatware",
      "Configuração de Drivers Estáveis",
      "Redução de Input Lag Básico",
      "Suporte Remoto via AnyDesk/RustDesk"
    ],
    popular: false,
    icon: <MousePointer2 className="w-6 h-6" />
  },
  {
    name: "Gamer ELITE",
    price: "297",
    description: "O melhor custo-benefício para jogadores competitivos.",
    features: [
      "Tudo do plano Gamer PRO",
      "Tuning de Registro (Regedit) Avançado",
      "Otimização de Rede e DNS Gamer",
      "Ajuste de BIOS/XMP Orientado",
      "Debloat Profundo de Kernel",
      "Configuração de Game Booster Privado"
    ],
    popular: true,
    icon: <Zap className="w-6 h-6" />
  },
  {
    name: "Gamer ULTIMATE",
    price: "497",
    description: "Otimização extrema para Pro-Players e Streamers.",
    features: [
      "Tudo do plano Gamer ELITE",
      "Otimização Total para Stream (OBS/TikTok)",
      "Consultoria de Hardware e Overclock Seguro",
      "Ajuste Fino de Periféricos (Polling Rate/DPI)",
      "Prioridade Máxima no Suporte",
      "Garantia de Performance de 30 dias"
    ],
    popular: false,
    icon: <Trophy className="w-6 h-6" />
  }
];

const CORPORATE_PLANS = [
  {
    name: "Formatação Básica",
    price: "100",
    description: "Essencial para um sistema limpo e funcional.",
    features: [
      "Instalação do Windows",
      "Atualização do Windows Update",
      "Instalação de Drivers Originais",
      "Configuração Inicial de Segurança"
    ],
    icon: <Monitor className="w-6 h-6" />
  },
  {
    name: "Formatação Média",
    price: "150",
    description: "Proteção e performance para o seu dia a dia.",
    features: [
      "Tudo do plano Básico",
      "Antivírus Premium (3 Meses)",
      "Otimização de Inicialização",
      "Limpeza de Arquivos Temporários",
      "Melhoria na Resposta do Sistema"
    ],
    icon: <Shield className="w-6 h-6" />
  },
  {
    name: "Formatação Avançada",
    price: "200",
    description: "O PC sempre estável com scripts de correção.",
    features: [
      "Tudo do plano Médio",
      "Otimização Avançada de Sistema",
      "Scripts de Correção Exclusivos",
      "Prevenção contra Erros Comuns",
      "Monitoramento de Saúde do Disco"
    ],
    popular: true,
    icon: <Cpu className="w-6 h-6" />
  },
  {
    name: "Combo Office 365",
    price: "350",
    description: "A solução completa para produtividade profissional.",
    features: [
      "Tudo do plano Avançado",
      "Pacote Office Completo",
      "Licença Permanente (1 PC)",
      "Suporte Prioritário na Instalação",
      "Configuração de E-mail Profissional"
    ],
    icon: <Briefcase className="w-6 h-6" />
  }
];

export default function ServicesPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"gamer" | "business">("gamer");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const handleAnchorScroll = () => {
      const hash = window.location.hash;
      if (hash) {
        const element = document.querySelector(hash);
        if (element) {
          const headerHeight = 80;
          const elementPosition = (element as HTMLElement).offsetTop - headerHeight;
          window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
          });
        }
      }
    };

    handleAnchorScroll();
    window.addEventListener('hashchange', handleAnchorScroll);
    return () => window.removeEventListener('hashchange', handleAnchorScroll);
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#020205] text-white font-sans selection:bg-blue-500/30">
      <Header />

      {/* --- Hero Section --- */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent -z-10"></div>
        
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-blue-400 text-sm font-medium mb-6">
              <Activity className="w-4 h-4" />
              Serviços de Performance de Elite
            </span>
            <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tight">
              Acelere seu PC com <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text">
                Especialistas Reais.
              </span>
            </h1>
            <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Chega de sofrer com FPS baixo e travamentos. Escolha o plano ideal para o seu perfil e sinta a diferença em minutos. Atendimento 100% remoto e seguro.
            </p>
          </motion.div>

          {/* --- Tab Switcher --- */}
          <div className="flex justify-center mb-16">
            <div className="bg-white/5 p-1 rounded-2xl border border-white/10 flex gap-1">
              <button
                onClick={() => setActiveTab("gamer")}
                className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all ${
                  activeTab === "gamer" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-gray-400 hover:text-white"
                }`}
              >
                <Zap className="w-5 h-5" />
                Nicho Gamer
              </button>
              <button
                onClick={() => setActiveTab("business")}
                className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all ${
                  activeTab === "business" ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20" : "text-gray-400 hover:text-white"
                }`}
              >
                <Briefcase className="w-5 h-5" />
                Corporativo / Home
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- Plans Grid --- */}
      <section className="pb-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 ${
            activeTab === "gamer" ? "lg:grid-cols-3" : "lg:grid-cols-2 xl:grid-cols-4"
          }`}>
            {(activeTab === "gamer" ? GAMER_PLANS : CORPORATE_PLANS).map((plan, idx) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`relative group p-8 rounded-3xl border transition-all duration-500 ${
                  plan.popular 
                    ? "bg-gradient-to-b from-blue-900/20 to-transparent border-blue-500/50 shadow-[0_0_50px_rgba(37,99,235,0.1)]" 
                    : "bg-white/5 border-white/10 hover:border-white/20"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-600 text-white text-xs font-black rounded-full uppercase tracking-widest shadow-lg">
                    Mais Procurado
                  </div>
                )}

                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
                  plan.popular ? "bg-blue-600 text-white" : "bg-white/5 text-blue-400"
                }`}>
                  {plan.icon}
                </div>

                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-gray-400 text-sm mb-6 min-h-[40px]">{plan.description}</p>
                
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-gray-400 text-sm">R$</span>
                  <span className="text-5xl font-black tracking-tight">{plan.price}</span>
                  <span className="text-gray-500 text-sm">/único</span>
                </div>

                <div className="space-y-4 mb-10">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3 text-sm text-gray-300">
                      <Check className="w-5 h-5 text-blue-500 shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all ${
                    plan.popular 
                      ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30" 
                      : "bg-white/10 hover:bg-white/20 text-white"
                  }`}
                >
                  Contratar Agora
                  <ArrowRight className="w-4 h-4" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Trust Badges --- */}
      <section className="py-20 bg-white/5 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            <div className="text-center">
              <div className="text-3xl font-black mb-2 text-blue-400">+1.500</div>
              <div className="text-gray-500 text-sm uppercase tracking-widest font-bold">PCs Otimizados</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black mb-2 text-purple-400">4.9/5</div>
              <div className="text-gray-500 text-sm uppercase tracking-widest font-bold">Avaliação Média</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black mb-2 text-pink-400">100%</div>
              <div className="text-gray-500 text-sm uppercase tracking-widest font-bold">Remoto e Seguro</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black mb-2 text-blue-400">24h</div>
              <div className="text-gray-500 text-sm uppercase tracking-widest font-bold">Suporte Ativo</div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FAQ / Proof CTA --- */}
      <section className="py-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-10 tracking-tight">
            Ainda tem dúvidas? <br />
            <span className="text-gray-500">Fale com um especialista.</span>
          </h2>
          <p className="text-gray-400 text-lg mb-12">
            Nós entendemos que cada computador é único. Clique no botão abaixo para tirar suas dúvidas pelo WhatsApp e receber uma recomendação personalizada.
          </p>
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-4 px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl font-bold text-xl hover:scale-105 transition-transform shadow-[0_0_50px_rgba(37,99,235,0.3)]"
          >
            <MessageCircle className="w-6 h-6" />
            Chamar no WhatsApp
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
