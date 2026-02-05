import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'firewall-configuracao',
  title: "Guia Completo de Configuração do Firewall do Windows (2026)",
  description: "Quer proteger seu PC contra invasões? Aprenda como configurar o Firewall do Windows 11 corretamente para jogos e segurança em 2026.",
  category: 'rede-seguranca',
  difficulty: 'Intermediário',
  time: '15 min'
};

const title = "Guia Completo de Configuração do Firewall do Windows (2026)";
const description = "Quer proteger seu PC contra invasões? Aprenda como configurar o Firewall do Windows 11 corretamente para jogos e segurança em 2026.";
const keywords = [
  'como configurar firewall windows 11 2026',
  'bloquear programa no firewall windows tutorial completo',
  'regra de entrada e saida firewall windows 11 guia',
  'desativar firewall windows 11 é seguro tutorial',
  'liberar portas para jogos no firewall windows 11 em 2026'
];

export const metadata: Metadata = createGuideMetadata('firewall-configuracao', title, description, keywords);

export default function FirewallConfigGuide() {
  const summaryTable = [
    { label: "Status Recomendado", value: "Sempre Ativado" },
    { label: "Função Principal", value: "Bloquear tráfego não autorizado" },
    { label: "Check Vital", value: "Regras de Entrada (Inbound) vs Saída (Outbound)" },
    { label: "Dificuldade", value: "Médio" }
  ];

  const contentSections = [
    {
      title: "O que é o Firewall e por que ele existe?",
      content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O **Firewall** é como o porteiro do seu computador em 2026. Ele decide o que pode entrar (Inbound) e o que pode sair (Outbound) da sua rede. Sem ele, qualquer computador na internet poderia tentar se conectar diretamente ao seu Windows para roubar arquivos ou instalar vírus. No Windows 11, o firewall nativo é extremamente potente e muitas vezes dispensa o uso de antivírus de terceiros pesados.
        </p>
      `
    },
    {
      title: "1. Permitindo um Aplicativo (O jeito fácil)",
      content: `
        <p class="mb-4 text-gray-300">Se um jogo ou programa não consegue se conectar à internet:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Vá em Configurações > Privacidade e Segurança > Segurança do Windows.</li>
            <li>Clique em 'Firewall e Proteção de Rede' > <strong>Permitir um aplicativo pelo firewall</strong>.</li>
            <li>Clique em 'Alterar configurações' e procure o seu jogo na lista.</li>
            <li>Marque as caixas 'Privada' e 'Pública' para garantir que ele funcione em qualquer rede.</li>
        </ol>
      `
    },
    {
      title: "2. Firewall com Segurança Avançada",
      content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Para Usuários Avançados:</h4>
            <p class="text-sm text-gray-300">
                O painel avançado permite criar regras específicas para **Portas TCP/UDP**. <br/><br/>
                Se você está hospedando um servidor de Minecraft ou um site local em 2026, precisará criar uma 'Nova Regra de Entrada', selecionar 'Porta' e digitar o número da porta que o servidor utiliza. Lembre-se: abrir muitas portas pode fragilizar a segurança do sistema; abra apenas o estritamente necessário.
            </p>
        </div>
      `
    },
    {
      title: "3. Jamais desative o Firewall!",
      content: `
        <p class="mb-4 text-gray-300">
            <strong>Mito de Performance:</strong> 
            <br/><br/>Muitos tutoriais antigos sugerem desativar o firewall para "ganhar FPS" ou "resolver lag". Em 2026, isso é um mito. O consumo de recursos do firewall do Windows 11 é quase nulo. Desativá-lo deixa o seu PC exposto a ataques de força bruta e worms de rede que podem infectar sua máquina em menos de 10 minutos de conexão direta. Se um jogo está bloqueado, mude a regra, mas mantenha a proteção ligada.
        </p>
      `
    }
  ];

  const relatedGuides = [
    {
      href: "/guias/bloquear-internet-firewall-windows",
      title: "Bloquear Software",
      description: "Impeça um app de se conectar à rede."
    },
    {
      href: "/guias/abrir-portas-roteador-nat-aberto",
      title: "Abrir Portas",
      description: "Configurações avançadas de rede."
    },
    {
      href: "/guias/seguranca-digital",
      title: "Segurança 2026",
      description: "Aprenda a se proteger de ameaças modernas."
    }
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="15 min"
      difficultyLevel="Médio"
      contentSections={contentSections}
      summaryTable={summaryTable}
      relatedGuides={relatedGuides}
    />
  );
}
