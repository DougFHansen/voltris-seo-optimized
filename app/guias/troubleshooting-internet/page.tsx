import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'troubleshooting-internet',
  title: "Internet Lenta ou Caindo? Guia de Troubleshooting 2026",
  description: "Sua internet não está funcionando como deveria? Aprenda o passo a passo para diagnosticar e resolver problemas de conexão no Windows 11 em 2026.",
  category: 'windows-geral',
  difficulty: 'Iniciante',
  time: '20 min'
};

const title = "Internet Lenta ou Caindo? Guia de Troubleshooting 2026";
const description = "Sua internet não está funcionando como deveria? Aprenda o passo a passo para diagnosticar e resolver problemas de conexão no Windows 11 em 2026.";
const keywords = [
  'internet lenta o que fazer 2026 tutorial',
  'como resolver wifi caindo windows 11 guia 2026',
  'passo a passo consertar rede internet pc tutorial',
  'internet conectada mas nao navega como resolver 2026',
  'resetar configurações de rede windows 11 tutorial'
];

export const metadata: Metadata = createGuideMetadata('troubleshooting-internet', title, description, keywords);

export default function InternetTroubleshootingGuide() {
  const summaryTable = [
    { label: "Primeiro Passo", value: "Reiniciar Roteador (30 segundos desligado)" },
    { label: "Check Físico", value: "Cabo Ethernet CAT6 ou Superior" },
    { label: "Solução Pro", value: "Reset de Rede do Windows 11" },
    { label: "Dificuldade", value: "Iniciante" }
  ];

  const contentSections = [
    {
      title: "O diagnóstico de 2026",
      content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Estar desconectado em 2026 é como estar no escuro. Muitas vezes, o problema da sua internet não é a operadora, mas sim um erro de configuração no seu Windows 11 ou uma falha de hardware na sua própria rede doméstica. Antes de ligar para o suporte técnico e esperar horas no telefone, siga este roteiro lógico para identificar e resolver o problema sozinho.
        </p>
      `
    },
    {
      title: "1. A Regra do 'Cabo de Ouro'",
      content: `
        <p class="mb-4 text-gray-300">O problema é no Wi-Fi ou no sinal que chega da rua?</p>
        <p class="text-sm text-gray-300">
            O teste mais importante é conectar um computador via **cabo** diretamente no roteador. Se a internet funcionar perfeitamente no cabo, mas falhar no Wi-Fi, o problema é puramente a sua rede sem fio (interferência ou canal saturado). Se a internet continuar lenta no cabo, o problema pode estar no roteador, no cabo da rua ou nas configurações profundas do seu Windows.
        </p>
      `
    },
    {
      title: "2. Resetando a Rede do Windows 11",
      content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Limpando erros de software:</h4>
            <p class="text-sm text-gray-300">
                Se o seu computador diz 'Conectado, mas sem internet', o Windows pode estar com um registro de rede travado. <br/><br/>
                1. Vá em Configurações > Rede e Internet > Configurações avançadas de rede. <br/>
                2. Clique em <strong>Restauração da rede</strong>. <br/>
                3. Clique em 'Restaurar agora'. O Windows desinstalará e reinstalará todos os adaptadores de rede, apagando qualquer configuração errada que esteja impedindo a navegação.
            </p>
        </div>
      `
    },
    {
      title: "3. O problema das atualizações do Windows",
      content: `
        <p class="mb-4 text-gray-300">
            <strong>Dica de 2026:</strong> O Windows Update às vezes instala drivers "genéricos" que causam instabilidade no Wi-Fi. 
            <br/><br/>Verifique no site do fabricante do seu notebook ou placa-mãe se há um driver de rede (Intel, Realtek ou Killer) mais recente. Instalar o driver oficial muitas vezes resolve quedas de conexão constantes que o reset de rede não conseguiu consertar.
        </p>
      `
    }
  ];

  const relatedGuides = [
    {
      href: "/guias/como-limpar-cache-dns-ip-flushdns",
      title: "Limpar Cache DNS",
      description: "Resolva erros de sites que não abrem."
    },
    {
      href: "/guias/problemas-conexao-wifi-causa-solucao",
      title: "Problemas Wi-Fi",
      description: "Dicas específicas para sinal sem fio."
    },
    {
      href: "/guias/reduzir-ping-jogos-online",
      title: "Reduzir Ping",
      description: "Otimize para uma conexão mais rápida."
    }
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="20 min"
      difficultyLevel="Iniciante"
      contentSections={contentSections}
      summaryTable={summaryTable}
      relatedGuides={relatedGuides}
    />
  );
}