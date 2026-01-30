import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = 'Segurança Digital: O Que Instalar para Proteger seu PC (2026)';
const description = 'Lista prática do que instalar para proteger seu computador contra vírus, golpes e roubo de senhas. Guia simplificado para todos os usuários.';
const keywords = [
  'segurança digital',
  'melhor antivirus gratuito 2026 windows',
  'antivírus',
  'firewall',
  'senhas seguras',
  'proteção contra ransomware',
  'segurança computador'
];

export const metadata: Metadata = createGuideMetadata('seguranca-digital', title, description, keywords);

export default function SegurancaDigitalGuide() {
  const summaryTable = [
    { label: "Dificuldade", value: "Básico" },
    { label: "Custo", value: "Grátis / Pago" },
    { label: "Ferramentas", value: "Antivírus + 2FA" }
  ];

  const faqItems = [
    {
      question: "Qual o melhor antivírus gratuito para 2026?",
      answer: "Para a grande maioria dos usuários, o <strong>Windows Defender</strong> (que já vem no Windows 10 e 11) é excelente. Ele é leve, não tem anúncios chatos e protege bem. Se quiser uma segunda opinião, o <strong>Bitdefender Free</strong> é uma ótima alternativa."
    },
    {
      question: "Preciso pagar por um antivírus?",
      answer: "Não necessariamente. Antivírus pagos (como Kaspersky ou Norton) oferecem recursos extras como VPN, gerenciador de senhas e proteção para celular. Se você faz muitas transações bancárias de alto valor ou tem crianças usando o PC, pode valer a pena. Para uso geral, o gratuito resolve."
    },
    {
      question: "Como saber se um site é seguro?",
      answer: "Verifique sempre se há um cadeado ao lado do endereço (HTTPS). Mas atenção: golpistas também usam HTTPS! A regra de ouro é: se recebeu o link por SMS ou WhatsApp prometendo prêmios ou desconto absurdo, é golpe. Digite o endereço da loja direto no navegador."
    }
  ];

  const contentSections = [
    {
      title: "O Básico: O Que Instalar Agora",
      content: `
        <p class="mb-4">Esqueça os termos técnicos complicados. Se você quer proteger seu computador hoje, aqui está sua lista de compras (gratuita):</p>
        
        <div class="bg-[#1c1c1e] p-6 rounded-lg border border-[#31A8FF] shadow-lg my-6">
          <h3 class="text-white font-bold text-xl mb-4">🛡️ Kit de Proteção Essencial</h3>
          <ul class="space-y-4 text-gray-300">
            <li class="flex items-start">
              <span class="text-green-500 mr-2 font-bold">1.</span>
              <div>
                <strong class="text-white">Antivírus:</strong> Windows Defender (Já vem instalado).
                <p class="text-sm text-gray-400">Não instale "cleaners" ou "boosters" cheios de propaganda. Mantenha o Defender atualizado.</p>
              </div>
            </li>
            <li class="flex items-start">
              <span class="text-green-500 mr-2 font-bold">2.</span>
              <div>
                <strong class="text-white">Navegador:</strong> Google Chrome ou Edge com <strong>uBlock Origin</strong>.
                <p class="text-sm text-gray-400">Instale a extensão "uBlock Origin" para bloquear propagandas maliciosas que tentam te enganar.</p>
              </div>
            </li>
            <li class="flex items-start">
              <span class="text-green-500 mr-2 font-bold">3.</span>
              <div>
                <strong class="text-white">Gerenciador de Senhas:</strong> Bitwarden (Grátis).
                <p class="text-sm text-gray-400">Pare de anotar senhas no caderno. O Bitwarden guarda tudo com segurança.</p>
              </div>
            </li>
          </ul>
        </div>

        <div class="bg-[#1c1c1e] border-l-4 border-[#FF4B6B] p-4 my-6 rounded-r-lg">
          <p class="text-[#FF4B6B] font-bold text-sm mb-1 uppercase tracking-wider">Nota do Especialista</p>
          <p class="text-gray-300 italic">"O maior erro que vejo não é falta de antivírus, é senha fraca. Se sua senha do e-mail é '123456' ou data de aniversário, não adianta ter o melhor antivírus do mundo. Ative a autenticação de dois fatores (2FA) no seu WhatsApp e Instagram HOJE."</p>
          <p class="text-gray-400 text-xs mt-2">- Douglas Hansen, Especialista Microsoft</p>
        </div>
      `,
      subsections: [
        {
          subtitle: "Antivírus: Pago vs Gratuito",
          content: `
            <p class="mb-4">Muitos clientes perguntam: "Vale a pena pagar o McAfee ou Norton?".</p>
            <p class="mb-4 text-gray-300">A verdade é que para 95% das pessoas, <strong>NÃO</strong>. O Windows Defender hoje é tão bom quanto os pagos nos testes de laboratório. Economize seu dinheiro. Só pague se você quiser controles parentais (para controlar o que seus filhos acessam) ou suporte técnico incluso.</p>
          `
        }
      ]
    },
    {
      title: "O Golpe do Momento: Como Identificar",
      content: `
        <p class="mb-4">Os vírus modernos não deixam mais a tela cheia de caveiras. Eles são silenciosos. Eles querem roubar seu acesso ao banco ou clonar seu WhatsApp.</p>
      `,
      subsections: [
        {
          subtitle: "Sinais de que seu PC pode estar infectado",
          content: `
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4">
              <li>O mouse mexe sozinho (raro, mas acontece em acessos remotos).</li>
              <li>Aventanas de "Prompt de Comando" (telas pretas rápidas) aparecem e somem ao ligar o PC.</li>
              <li>Sua página inicial do navegador mudou para um site de busca estranho.</li>
              <li>O computador ficou lento de repente e a ventoinha não para de girar (pode ser mineração de criptomoeda escondida).</li>
            </ul>
            
            <div class="bg-[#1c1c1e] p-6 rounded-lg border border-[#FF4B6B] mt-6">
               <h4 class="text-white font-bold mb-2">Acha que foi hackeado?</h4>
               <p class="text-gray-300 text-sm mb-4">Se você notou comportamentos estranhos ou acessos indevidos na sua conta bancária, desligue o PC da internet imediatamente.</p>
               <a href="/todos-os-servicos" class="inline-block px-4 py-2 bg-[#FF4B6B] text-white font-bold rounded hover:bg-[#ff3355] transition text-sm text-center">Solicitar Remoção de Vírus Profissional</a>
            </div>
          `
        },
        {
          subtitle: "A Regra dos 2 Segundos (Para não cair em Phishing)",
          content: `
            <p class="mb-4 text-gray-300">Antes de clicar em qualquer link (mesmo que venha do seu chefe ou mãe), pare por 2 segundos e olhe o remetente.</p>
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4">
              <li>O email do banco termina em @gmail.com? <strong>GOLPE.</strong></li>
              <li>O site diz "Magalu" mas o endereço é "ofertas-magalu-promocao.com"? <strong>GOLPE.</strong></li>
              <li>A mensagem diz "URGENTE: SEU NOME ESTÁ NO SERASA"? <strong>GOLPE.</strong> O objetivo é te deixar em pânico para clicar sem pensar.</li>
            </ul>
          `
        }
      ]
    },
    {
      title: "Senhas: O Cofre Digital",
      content: `
        <p class="mb-4">Ter a mesma senha para tudo é como ter a mesma chave para sua casa, carro e escritório. Se perder uma, perde tudo.</p>
      `,
      subsections: [
        {
          subtitle: "O que fazer (Solução Realista)",
          content: `
            <p class="mb-4 text-gray-300">Ninguém decora 50 senhas difíceis. A solução é usar um <strong>Gerenciador de Senhas</strong>.</p>
            <ol class="space-y-2 text-gray-300 list-decimal list-inside ml-4">
              <li>Baixe o <strong>Bitwarden</strong> (é grátis e código aberto).</li>
              <li>Crie uma "Senha Mestra" longa (frase: "Eu gosto de comer pizza de calabresa 2026").</li>
              <li>Jogue todas as suas outras senhas lá dentro.</li>
              <li>Agora você só precisa decorar a frase da pizza. O programa preenche o resto para você.</li>
            </ol>
          `
        }
      ]
    }
  ];

  const relatedGuides = [
    {
      href: "/guias/backup-dados",
      title: "Como Fazer Backup (Antes que seja tarde)",
      description: "A única proteção 100% garantida contra Ransomware."
    },
    {
      href: "/guias/formatacao-windows",
      title: "Formatação Limpa",
      description: "A solução definitiva se o PC já estiver infestado."
    }
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="15 minutos"
      difficultyLevel="Básico"
      contentSections={contentSections}
      relatedGuides={relatedGuides}
      summaryTable={summaryTable}
      faqItems={faqItems}
    />
  );
}

