import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Como Bloquear a Telemetria e Espionagem do Windows";
const description = "O Windows coleta muitos dados por padrão. Aprenda a configurar a privacidade, desativar a telemetria e usar ferramentas como O&O ShutUp10.";
const keywords = ["privacidade windows","telemetria","bloquear rastreamento","o&o shutup10","cortana desativar"];

export const metadata: Metadata = createGuideMetadata(title, description, keywords);

export default function GuidePage() {
  const contentSections = [

    {
      title: "O que o Windows sabe sobre você?",
      content: `
        <p class="mb-4 text-gray-300">Por padrão, o Windows envia dados de diagnóstico, histórico de pesquisa e até amostras de escrita para a Microsoft. Embora visem 'melhorar o serviço', muitos usuários preferem privacidade total.</p>
      `,
      subsections: []
    },

    {
      title: "Passos Manuais (Configurações)",
      content: `
        <ol class="list-decimal list-inside space-y-2 text-gray-300 text-sm">
            <li>Vá em <strong>Configurações > Privacidade e segurança</strong>.</li>
            <li>Em <strong>Geral</strong>, desative todas as 4 opções (ID de publicidade, etc).</li>
            <li>Em <strong>Diagnóstico e comentários</strong>, desative "Enviar dados de diagnóstico opcionais".</li>
            <li>Em <strong>Histórico de atividades</strong>, desative "Armazenar meu histórico de atividades neste dispositivo".</li>
          </ol>
      `,
      subsections: []
    },

    {
      title: "Ferramentas Automáticas (Avançado)",
      content: `
        <div class="bg-red-900/20 p-4 border border-red-500/30 rounded-lg">
            <h4 class="text-white font-bold mb-2">O&O ShutUp10++</h4>
            <p class="text-gray-400 text-sm mb-2">Esta é a ferramenta padrão-ouro gratuita para privacidade. Ela lista centenas de configurações ocultas.</p>
            <ul class="list-disc list-inside text-gray-300 text-xs">
              <li>Baixe e execute (não precisa instalar).</li>
              <li>Use a opção <strong>"Apply only recommended settings"</strong> (Apenas recomendados).</li>
              <li>⚠ Cuidado com as opções vermelhas/avançadas, elas podem quebrar o Windows Update ou a Loja.</li>
            </ul>
          </div>
      `,
      subsections: []
    }
  ];

  const relatedGuides = [
    {
      href: "/guias/otimizacao-performance",
      title: "Otimização de Performance",
      description: "Dicas para deixar seu PC mais rápido."
    },
    {
      href: "/guias/rede-domestica",
      title: "Redes Domésticas",
      description: "Melhore sua conexão WiFi."
    },
    {
      href: "/guias/manutencao-preventiva",
      title: "Manutenção Preventiva",
      description: "Cuidados essenciais com o hardware."
    }
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="10-15 min"
      difficultyLevel="Iniciante"
      contentSections={contentSections}
      relatedGuides={relatedGuides}
    />
  );
}
