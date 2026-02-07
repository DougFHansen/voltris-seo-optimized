import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'bloquear-internet-firewall-windows',
  title: "Como Bloquear a Internet de um Programa no Windows (2026)",
  description: "Quer jogar offline ou impedir atualizações chatas? Aprenda a usar o Firewall do Windows para bloquear o acesso de qualquer app à internet em 3 minutos.",
  category: 'software',
  difficulty: 'Iniciante',
  time: '15 min'
};

const title = "Como Bloquear a Internet de um Programa: Firewall Definitivo (2026)";
const description = "Você não precisa desconectar o cabo de rede. O Firewall do Windows 11 permite criar regras cirúrgicas para impedir que um jogo, update ou software espião acesse a internet.";

const keywords = [
  'como bloquear internet de um programa windows 11 2026',
  'bloquear acesso a rede de aplicativo firewall tutorial',
  'impedir que programa atualize sozinho no windows 11',
  'criar regra de saida firewall windows 11 passo a passo',
  'simplewall vs tinywall qual melhor firewall leve'
];

export const metadata: Metadata = createGuideMetadata('bloquear-internet-firewall-windows', title, description, keywords);

export default function FirewallBlockGuide() {
  const summaryTable = [
    { label: "Ferramenta", value: "Firewall do Windows (Nativo)" },
    { label: "Ação", value: "Regra de Saída (Outbound Rule)" },
    { label: "Efeito", value: "Bloqueio Total de Internet para o .exe" },
    { label: "Reversível", value: "Sim (Basta deletar a regra)" },
    { label: "Alternativa Fácil", value: "SimpleWall (Open Source)" }
  ];

  const contentSections = [
    {
      title: "Por que fazer isso?",
      content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Muitos programas (como Adobe, Autodesk, Jogos Single Player) tentam se conectar à internet a cada 5 minutos para:
          <br/>1. Baixar atualizações que você não pediu.
          <br/>2. Enviar dados de uso (telemetria) sobre seu PC.
          <br/>3. Verificar licenças online.
          <br/>Bloquear o executável (.exe) no firewall garante que o programa funcione isolado, sem gastar sua banda ou espionar seus dados.
        </p>
      `
    },
    {
      title: "Método 1: Firewall do Windows (Sem Instalar Nada)",
      content: `
        <p class="mb-4 text-gray-300">
          O firewall nativo é poderoso, mas a interface é antiga. Siga com calma:
        </p>
        
        <div class="bg-gray-800/50 p-5 rounded-xl border border-gray-700">
            <h4 class="text-white font-bold mb-3">Passo a Passo Visual</h4>
            <ol class="list-decimal list-inside text-gray-300 space-y-3">
                <li>Abra o Menu Iniciar e digite: <strong>"Firewall do Windows com Segurança Avançada"</strong> (ou <code>wf.msc</code> no Executar).</li>
                <li>No painel esquerdo, clique em <strong>Regras de Saída</strong> (Outbound Rules).
                    <br/><span class="text-xs text-yellow-500 ml-6">Nota: Regras de Saída bloqueiam o programa de SAIR para a internet. Regras de Entrada bloqueiam hackers de entrar.</span>
                </li>
                <li>No painel direito, clique em <strong>Nova Regra...</strong></li>
                <li>Escolha <strong>Programa</strong> e avance.</li>
                <li>Clique em "Este caminho de programa" e <strong>Procurar...</strong>.
                    <br/>Vá até a pasta onde o jogo/programa está instalado e selecione o executável principal (ex: <code>jogo.exe</code>).
                </li>
                <li>Na próxima tela, MARQUE: <strong>Bloquear a conexão</strong>.</li>
                <li>Marque todas as caixas (Domínio, Privado, Público).</li>
                <li>Dê um nome fácil (Ex: "Bloqueio Jogo X") e Concluir.</li>
            </ol>
            <p class="mt-4 text-green-400 font-bold">
                Pronto! Um ícone vermelho de "proibido" aparecerá na lista. O programa está offline para sempre.
            </p>
        </div>
      `
    },
    {
      title: "Método 2: SimpleWall (Para Quem Quer Facilidade)",
      content: `
        <p class="mb-4 text-gray-300">
          Se você achou o método acima complicado, o <strong>SimpleWall</strong> é um programa open-source minúsculo que torna isso visual.
        </p>
        <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4">
            <li>Ao abrir, ele mostra todos os processos que estão tentando usar a internet AGORA.</li>
            <li>Você só precisa desmarcar a caixinha ao lado do nome do programa.</li>
            <li>Se a caixa não estiver marcada, a internet é bloqueada. Simples assim.</li>
        </ul>
      `
    }
  ];

  const advancedContentSections = [
    {
      title: "E se o programa tiver vários executáveis?",
      content: `
        <h4 class="text-white font-bold mb-3">O Truque do Launcher</h4>
        <p class="mb-4 text-gray-300">
            Muitos jogos modernos têm um <code>Launcher.exe</code> e um <code>Game-Win64-Shipping.exe</code> escondido numa subpasta.
            <br/>Se você bloquear só o Launcher, o jogo pode continuar online.
            <br/><strong>Dica Pro:</strong> Abra o Gerenciador de Tarefas enquanto o jogo roda. Clique com o botão direito no processo do jogo > "Abrir local do arquivo". Esse é o executável real que você deve bloquear.
        </p>
      `
    },
    {
      title: "Como Desbloquear depois?",
      content: `
        <p class="mb-4 text-gray-300">
            Arrependeu? Quer baixar o update?
            <br/>1. Abra o Firewall Avançado novamente.
            <br/>2. Vá em Regras de Saída.
            <br/>3. A regra que você criou estará no topo ou em ordem alfabética.
            <br/>4. Selecione e clique em <strong>Excluir</strong> (na direita) ou <strong>Desabilitar Regra</strong> (para pausar temporariamente).
        </p>
      `
    }
  ];

  const additionalContentSections = [
    {
      title: "Regras de Entrada vs Saída",
      content: `
        <h4 class="text-white font-bold mb-3">Entenda a Diferença</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-gray-800/50 p-4 rounded-lg border border-red-500/30">
                <h5 class="font-bold text-white mb-2">Regra de Saída (Outbound)</h5>
                <p class="text-sm text-gray-300">
                    O seu PC tentando falar com o servidor do Google. (O que queremos bloquear).
                </p>
            </div>
            <div class="bg-gray-800/50 p-4 rounded-lg border border-green-500/30">
                <h5 class="font-bold text-white mb-2">Regra de Entrada (Inbound)</h5>
                <p class="text-sm text-gray-300">
                    Um servidor externo tentando iniciar uma conversa com seu PC. (O roteador já bloqueia isso via NAT, mas o Firewall é a segunda barreira).
                </p>
            </div>
        </div>
      `
    }
  ];

  const faqItems = [
    {
      question: "O Firewall bloqueia a rede local (LAN)?",
      answer: "Sim, se você selecionar 'Bloquear a conexão', ele bloqueia tudo. Para permitir LAN mas bloquear Internet, requer configuração avançada de escopo de IP (permitir 192.168.x.x)."
    },
    {
      question: "O Windows Defender atrapalha?",
      answer: "O Windows Defender Firewall É o firewall que estamos configurando. Eles são a mesma coisa. Antivírus de terceiros (Kaspersky, Bitdefender) costumam desativar o firewall do Windows e usar o deles, onde este tutorial não funcionará."
    }
  ];

  const externalReferences = [
    { name: "SimpleWall (GitHub)", url: "https://github.com/henrypp/simplewall" },
    { name: "TinyWall (Alternative)", url: "https://tinywall.pados.hu/" }
  ];

  const relatedGuides = [
    {
      href: "/guias/antivirus-para-jogos-windows-defender-exclusao",
      title: "Windows Defender",
      description: "Como configurar exclusões."
    },
    {
      href: "/guias/privacidade-windows-telemetria",
      title: "Privacidade Windows",
      description: "Pare a espionagem da Microsoft."
    },
    {
      href: "/guias/abrir-portas-roteador-nat-aberto",
      title: "Abrir Portas",
      description: "O oposto de bloquear."
    }
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="15 min"
      difficultyLevel="Iniciante"
      author="Voltris Security"
      lastUpdated="2026-02-06"
      contentSections={contentSections}
      advancedContentSections={advancedContentSections}
      additionalContentSections={additionalContentSections}
      summaryTable={summaryTable}
      faqItems={faqItems}
      externalReferences={externalReferences}
      relatedGuides={relatedGuides}
    />
  );
}
