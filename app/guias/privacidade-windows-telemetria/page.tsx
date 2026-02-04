import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Privacidade no Windows 11: Como desativar a Telemetria (2026)";
const description = "O Windows 11 coleta muitos dados? Aprenda como desativar a telemetria, anúncios e rastreamento da Microsoft para mais privacidade e performance em 2026.";
const keywords = [
  'privacidade windows 11 como desativar telemetria 2026',
  'desativar rastreamento microsoft windows 11 tutorial',
  'melhorar performance desativando telemetria guia 2026',
  'como desativar anuncios menu iniciar windows 11 tutorial',
  'privacidade digital windows 11 guia completo 2026'
];

export const metadata: Metadata = createGuideMetadata('privacidade-windows-telemetria', title, description, keywords);

export default function PrivacyGuide() {
  const summaryTable = [
    { label: "Status Padrão", value: "Monitoramento Ativo (Telemetria)" },
    { label: "Impacto", value: "Uso de CPU e Rede em Background" },
    { label: "Privacidade", value: "Aumenta ao desativar ID de Anúncio" },
    { label: "Dificuldade", value: "Médio" }
  ];

  const contentSections = [
    {
      title: "O que o Windows sabe sobre você?",
      content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          No Windows 11, a Microsoft utiliza a **Telemetria** para coletar dados sobre como você usa o sistema, quais aplicativos abre e até o que você digita (para "melhoria do dicionário"). Embora a empresa afirme que os dados são anônimos, esse processo consome recursos do seu PC. Em 2026, com o aumento das ferramentas de IA integradas, o volume de dados enviados triplicou, tornando a desativação desses recursos essencial para quem busca privacidade.
        </p>
      `
    },
    {
      title: "1. Desativando a Telemetria Básica",
      content: `
        <p class="mb-4 text-gray-300">Ajustes manuais simples para começar:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Vá em Configurações > Privacidade e Segurança > <strong>Diagnóstico e comentários</strong>.</li>
            <li>Desative 'Enviar dados de diagnóstico opcionais'.</li>
            <li>Desative 'Melhorar escrita à mão e digitação'.</li>
            <li>Desative 'Experiências personalizadas'.</li>
        </ol>
      `
    },
    {
      title: "2. Removendo IDs de Anúncios e Rastreamento",
      content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Anúncios no Iniciar:</h4>
            <p class="text-sm text-gray-300">
                Você já reparou em sugestões de apps que nunca instalou? O Windows usa o seu <strong>ID de Anúncio</strong> para isso. <br/><br/>
                Vá em Configurações > Privacidade e Segurança > Geral e <strong>desative todas as quatro chaves</strong> desta tela. Isso impedirá que o Windows tente criar um perfil de consumo baseado no uso dos seus aplicativos.
            </p>
        </div>
      `
    },
    {
      title: "3. O "Poder" do PowerShell",
      content: `
        <p class="mb-4 text-gray-300">
            <strong>Limpeza Profunda em 2026:</strong> 
            <br/><br/>Existem serviços de telemetria que não podem ser desligados pelos menus comuns. Para usuários avançados, recomendamos usar scripts de debloat via PowerShell para desativar serviços como o <i>DiagTrack</i> (Connected User Experiences and Telemetry). Isso não apenas protege seus dados, mas reduz consideravelmente os picos de uso de CPU que causam "travadinhas" em jogos competitivos.
        </p>
      `
    }
  ];

  const relatedGuides = [
    {
      href: "/guias/debloating-windows-11",
      title: "Debloat Completo",
      description: "Scripts para remover o que o Windows não deixa."
    },
    {
      href: "/guias/otimizacao-performance",
      title: "Otimizar Performance",
      description: "Outros ajustes para um sistema ágil."
    },
    {
      href: "/guias/seguranca-senhas-gerenciadores",
      title: "Segurança Digital",
      description: "Proteja seus dados além do Windows."
    }
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="20 min"
      difficultyLevel="Médio"
      contentSections={contentSections}
      summaryTable={summaryTable}
      relatedGuides={relatedGuides}
    />
  );
}
