import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'instalar-impressora-wifi',
  title: "Como instalar Impressora Wi-Fi no PC (Guia Definitivo)",
  description: "Comprou uma impressora Wi-Fi e não consegue conectar? Aprenda a configurar impressoras HP, Epson, Canon e Brother na sua rede sem fio passo a passo.",
  category: 'rede-seguranca',
  difficulty: 'Iniciante',
  time: '20 min'
};

const title = "Como instalar Impressora Wi-Fi no PC (Guia Definitivo)";
const description = "Comprou uma impressora Wi-Fi e não consegue conectar? Aprenda a configurar impressoras HP, Epson, Canon e Brother na sua rede sem fio passo a passo.";
const keywords = [
  'como instalar impressora wifi no windows 11 tutorial',
  'conectar impressora epson wifi pelo computador',
  'instalar impressora hp smart wifi guia 2026',
  'impressora offline no wifi como resolver 2026',
  'procurar impressora pelo ip rede windows'
];

export const metadata: Metadata = createGuideMetadata('instalar-impressora-wifi', title, description, keywords);

export default function WifiPrinterGuide() {
  const summaryTable = [
    { label: "Modos de Conexão", value: "WPS, Painel LCD ou Cabo USB (Setup)" },
    { label: "App Recomendado (HP)", value: "HP Smart" },
    { label: "App Recomendado (Epson)", value: "Epson Connect" },
    { label: "Dificuldade", value: "Fácil" }
  ];

  const contentSections = [
    {
      title: "O segredo da instalação sem fios",
      content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Instalar uma impressora hoje em dia é muito mais fácil, mas ainda existem gargalos: o PC e a Impressora **precisam estar na mesma rede de 2.4GHz**. Muitas impressoras não reconhecem redes de 5GHz. Se o seu roteador mistura as duas frequências (Smart Connect), você pode ter problemas para achar a impressora no Wi-Fi.
        </p>
      `
    },
    {
      title: "1. O Método do 'Primeiro Cabo'",
      content: `
        <p class="mb-4 text-gray-300">Embora seja Wi-Fi, a forma mais garantida de configurar é usar um cabo USB temporário:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Baixe o instalador oficial do site da fabricante (ex: Driver HP ou Epson).</li>
            <li>Conecte o cabo USB entre a impressora e o PC.</li>
            <li>O instalador vai perguntar: "Como deseja conectar?". Escolha <strong>Sem Fio (Wi-Fi)</strong>.</li>
            <li>O instalador vai passar a senha do Wi-Fi do seu Windows para a impressora via cabo.</li>
            <li>Ao final, ele pedirá para remover o cabo. A impressora agora está salva na sua rede para sempre.</li>
        </ol>
      `
    },
    {
      title: "2. Adicionando pelo IP (Se o Windows não achar)",
      content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Método Manual:</h4>
            <p class="text-sm text-gray-300">
                Se a impressora já está no Wi-Fi mas o Windows diz 'Impressora não encontrada': <br/>
                1. Imprima a página de configuração da impressora (veja no menu dela) para descobrir o <strong>Endereço IP</strong> (ex: 192.168.0.15). <br/>
                2. No Windows, vá em Adicionar Impressora > 'A impressora que eu quero não está na lista'. <br/>
                3. Escolha 'Adicionar usando um endereço TCP/IP' e digite o IP descoberto.
            </p>
        </div>
      `
    },
    {
      title: "3. Corrigindo o erro 'Offline'",
      content: `
        <p class="mb-4 text-gray-300">
            Se a impressora fica offline do nada:
            <br/>Vá em Painel de Controle > Dispositivos e Impressoras. Botão direito na sua impressora > Ver o que está sendo impresso. Clique no menu 'Impressora' e desmarque <strong>'Usar impressora offline'</strong>. Isso costuma travar quando ocorre uma queda rápida de sinal.
        </p>
      `
    }
  ];

  const relatedGuides = [
    {
      href: "/guias/compartilhamento-impressoras",
      title: "Compartilhar Rede",
      description: "Use a impressora em vários PCs ao mesmo tempo."
    },
    {
      href: "/guias/configuracao-roteador-wifi",
      title: "Configurar Roteador",
      description: "Diferenças entre canais 2.4GHz e 5GHz."
    },
    {
      href: "/guias/wifi-desconectando-sozinho-windows",
      title: "Estabilizar Wi-Fi",
      description: "Dicas se a conexão cair durante a impressão."
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
