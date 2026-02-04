import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Phishing: Como identificar sites e e-mails falsos (2026)";
const description = "Recebeu uma mensagem estranha do banco ou do Discord? Aprenda a identificar as técnicas de Phishing mais comuns de 2026 e proteja seus dados de hackers.";
const keywords = [
  'como identificar phishing e-mail falso 2026',
  'como saber se um site é seguro para por senha',
  'golpe do discord nitro gratis como identificar',
  'prevenir sequestro de conta steam phishing tutorial',
  'verificar link suspeito antes de clicar guia 2026'
];

export const metadata: Metadata = createGuideMetadata('identificacao-phishing', title, description, keywords);

export default function PhishingGuide() {
  const summaryTable = [
    { label: "O que é", value: "Engenharia social para roubar senhas" },
    { label: "Sinal de Alerta #1", value: "Urgência ou ameaça de bloquear conta" },
    { label: "Sinal de Alerta #2", value: "Links com erros de escrita (ex: g00gle.com)" },
    { label: "Dificuldade", value: "Fácil" }
  ];

  const contentSections = [
    {
      title: "O Golpe mais lucrativo de 2026",
      content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Diferente dos vírus que tentam quebrar o código do seu computador, o **Phishing** tenta quebrar a sua desconfiança. É muito mais caro criar um malware ultra moderno do que simplesmente criar uma página de login do Instagram idêntica à original e convencer você a digitar sua senha. Em 2026, com o uso de IA para criar textos perfeitos, identificar esses golpes exige atenção aos detalhes técnicos.
        </p>
      `
    },
    {
      title: "1. O Teste do Cursor (Hover Test)",
      content: `
        <p class="mb-4 text-gray-300">Nunca confie no texto azul de um link. Confie para onde ele aponta:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Antes de clicar, passe o mouse em cima do link (sem clicar!).</li>
            <li>Olhe no canto inferior esquerdo do seu navegador. O endereço real aparecerá ali.</li>
            <li>Se o e-mail diz ser do "PayPal", mas o endereço que aparece é <code>bit.ly/seus-reais-agora</code> ou <code>pay-pal-security-update.xyz</code>, é um golpe.</li>
        </ol>
      `
    },
    {
      title: "2. Phishing via QR Code (Quishing)",
      content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">A Nova Ameaça de 2026:</h4>
            <p class="text-sm text-gray-300">
                Os criminosos agora enviam QR Codes por e-mail ou Discord. O objetivo é tirar o link do seu PC (onde você tem antivírus e proteções de navegador) e levá-lo para o celular, onde é muito mais difícil conferir a URL real. <strong>Nunca escaneie QR Codes de origens não solicitadas</strong>, mesmo que pareçam um brinde de jogo ou aviso de segurança.
            </p>
        </div>
      `
    },
    {
      title: "3. URLs com caracteres especiais (Punycode)",
      content: `
        <p class="mb-4 text-gray-300">
            Hackers usam letras de outros alfabetos que são idênticas às nossas. 
            <br/><br/>Por exemplo, o "а" (cirílico) parece igual ao nosso "a". Um site pode ser <code>аpple.com</code> e você não perceberia a diferença visualmente. 
            <br/><strong>Dica:</strong> Sempre que for fazer login em sites importantes (Banco, Steam, Google), nunca clique em links. Digite o endereço manualmente na barra do navegador.
        </p>
      `
    }
  ];

  const relatedGuides = [
    {
      href: "/guias/autenticacao-dois-fatores",
      title: "Ativar 2FA",
      description: "A sua barreira final contra o phishing."
    },
    {
      href: "/guias/seguranca-senhas-gerenciadores",
      title: "Gerenciar Senhas",
      description: "Use ferramentas que preenchem apenas sites reais."
    },
    {
      href: "/guias/remocao-virus-malware",
      title: "Limpeza de Vírus",
      description: "O que fazer se você clicou no link falso."
    }
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="15 min"
      difficultyLevel="Iniciante"
      contentSections={contentSections}
      summaryTable={summaryTable}
      relatedGuides={relatedGuides}
    />
  );
}
