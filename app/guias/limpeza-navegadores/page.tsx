import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'limpeza-navegadores',
  title: "Como Limpar o Cache e Dados dos Navegadores (Chrome, Edge, Firefox)",
  description: "Seu navegador está lento ou os sites não carregam direito? Aprenda a limpar o cache e os cookies sem perder suas senhas salvas.",
  category: 'software',
  difficulty: 'Iniciante',
  time: '5 min'
};

const title = "Como Limpar o Cache e Dados dos Navegadores (Chrome, Edge, Firefox)";
const description = "Seu navegador está lento ou os sites não carregam direito? Aprenda a limpar o cache e os cookies sem perder suas senhas salvas.";
const keywords = [
  'limpar cache chrome 2026',
  'como limpar cookies edge',
  'navegador lento como resolver',
  'limpar historico de navegação pc',
  'limpeza profunda firefox'
];

export const metadata: Metadata = createGuideMetadata('limpeza-navegadores', title, description, keywords);

export default function BrowserCleanGuide() {
  const summaryTable = [
    { label: "Atalho Universal", value: "Ctrl + Shift + Del" },
    { label: "Frequência", value: "Mensal" },
    { label: "Objetivo", value: "Velocidade e Corregir bugs de sites" },
    { label: "Dificuldade", value: "Fácil" }
  ];

  const contentSections = [
    {
      title: "O que é Cache e por que ele envelhece?",
      content: `
        <p class="mb-6 text-gray-700 leading-relaxed text-lg">
          O Cache é a memória local do seu navegador. Ele guarda logos, imagens e códigos de sites que você visita sempre para que eles abram mais rápido na próxima vez. 
        </p>
        <p class="mb-6 text-gray-700 leading-relaxed">
          O problema é que os sites mudam de versão. Se você tem o cache da versão "A" e o site atualizou para a versão "B", o conflito pode travar o navegador ou fazer o site não carregar botões e menus.
        </p>
      `
    },
    {
      title: "O Atalho Mágico (Ctrl + Shift + Del)",
      content: `
        <p class="mb-4 text-gray-700">Este atalho funciona no <strong>Chrome, Edge, Brave e Firefox</strong>.</p>
        <div class="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h class="text-gray-900 font-bold mb-4">O que Marcar:</h4>
            <ul class="space-y-3 text-gray-700">
                <li>✅ <strong>Imagens e arquivos armazenados em cache:</strong> Pode marcar sem medo.</li>
                <li>✅ <strong>Cookies e outros dados do site:</strong> Marque se quiser deslogar de todos os sites (ajuda a resolver erros de login).</li>
                <li>❌ <strong>Senhas e outros dados de preenchimento automático:</strong> <strong>NÃO MARQUE</strong> se você não tiver suas senhas anotadas em outro lugar.</li>
            </ul>
        </div>
      `
    },
    {
      title: "Limpeza de Extensões (Bloatware do Browser)",
      content: `
        <p class="mb-4 text-gray-700">
            Muitas vezes a lentidão não é o cache, mas as 10 extensões que você instalou e nunca mais usou.
        </p>
        <p class="text-gray-700">
            Digite <code>chrome://extensions/</code> na barra de endereços do Chrome ou Edge e remova tudo o que for suspeito ou desnecessário. Extensões de VPN grátis e tradutores costumam ser os maiores causadores de lentidão.
        </p>
      `
    }
  ];

  const faqItems = [
    {
      question: "Atalho Ctrl + Shift + Del funciona em todos navegadores?",
      answer: "Sim. Funciona no Chrome, Edge, Brave e Firefox. Abre janela limpar dados navegação universal."
    },
    {
      question: "Limpar cookies desloga contas?",
      answer: "Sim. Se marcar 'Cookies e outros dados do site', desloga de todos sites. Marque apenas 'Imagens e arquivos em cache' para não deslogar."
    },
    {
      question: "Extensões causam lentidão?",
      answer: "Sim. Muitas vezes lentidão não é cache, mas extensões não usadas. Digite chrome://extensions/ e remova extensões suspeitas ou desnecessárias."
    }
  ];

  const externalReferences = [
    { name: "Chrome Help", url: "https://support.google.com/chrome/" },
    { name: "Firefox Help", url: "https://support.mozilla.org/" }
  ];

  const relatedGuides = [
    {
      href: "/guias/atalhos-navegador-produtividade",
      title: "Atalhos Chrome",
      description: "Navegue como um profissional."
    },
    {
      href: "/guias/extensoes-produtividade-chrome",
      title: "Melhores Extensões",
      description: "Quais extensões realmente valem a pena manter."
    },
    {
      href: "/guias/otimizacao-performance",
      title: "Otimizar PC",
      description: "Melhore o tempo de resposta do Windows para ajudar o browser."
    }
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="5 min"
      difficultyLevel="Iniciante"
      contentSections={contentSections}
      summaryTable={summaryTable}
      relatedGuides={relatedGuides}
      faqItems={faqItems}
      externalReferences={externalReferences}
    />
  );
}
