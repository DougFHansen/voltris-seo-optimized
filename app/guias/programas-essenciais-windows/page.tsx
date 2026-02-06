import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'programas-essenciais-windows',
  title: "Kit Essencial Pós-Formatação: Os 10 Programas Obrigatórios (2026)",
  description: "Acabou de formatar? Não instale lixo. Baixe o Ninite e instale 7-Zip, VLC, Discord, Steam e PowerToys de uma só vez, livres de vírus.",
  category: 'software',
  difficulty: 'Iniciante',
  time: '15 min'
};

const title = "Softwares Essenciais para Windows 11: Lista Definitiva (2026)";
const description = "Substitua os programas ruins do Windows. Use 7-Zip em vez de WinRAR, VLC em vez de Media Player, e ShareX em vez de Ferramenta de Captura.";

const keywords = [
  'programas essenciais pós formatação 2026',
  'winrar vs 7zip qual melhor',
  'alternativa adobe reader leve',
  'vlc media player codecs',
  'powertoys windows 11 tutorial',
  'ninite installer safe',
  'sharex vs lightshot screenshot',
  'bloco de notas vs notepad++'
];

export const metadata: Metadata = createGuideMetadata('programas-essenciais-windows', title, description, keywords);

export default function SoftwareGuide() {
  const summaryTable = [
    { label: "Instalador", value: "Ninite (Automático)" },
    { label: "Compactador", value: "7-Zip (Open Source)" },
    { label: "Vídeo", value: "VLC ou MPC-BE" },
    { label: "PrintScreen", value: "ShareX (Poderoso)" },
    { label: "Produtividade", value: "MS PowerToys" },
    { label: "Jogos", value: "Steam / Epic / Discord" }
  ];

  const contentSections = [
    {
      title: "A Regra do Ninite",
      content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Nunca baixe programas de sites como "Baixaki" ou "Softonic". Eles embutem instaladores com propaganda. O segredo dos técnicos de TI é o <strong>Ninite.com</strong>.
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed">
          Você entra no site, marca os checkboxes do que quer (Chrome, Discord, VLC, 7-Zip), baixa UM instalador e ele instala tudo sozinho, em silêncio, recusando automaticamente todas as ofertas de "Baidu Antivirus" e Toolbars.
        </p>

        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20 my-8">
            <h4 class="text-[#31A8FF] font-bold mb-3 flex items-center gap-2">
                <span class="text-xl">🛠️</span> Voltris Toolbox
            </h4>
            <p class="text-gray-300 mb-4">
                O Ninite é bom, mas o <strong>Voltris Optimizer</strong> já inclui as runtimes essenciais para jogos (DirectX, Visual C++ 2005-2022, .NET Framework) que o Ninite não instala. Execute o "Game Essentials" do Voltris uma vez após formatar e você nunca terá erro de DLL faltando.
            </p>
            <a href="/voltrisoptimizer" class="group relative inline-flex px-8 py-3 bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-white font-bold text-base rounded-lg overflow-hidden transition-all duration-300 transform hover:scale-[1.03] hover:shadow-[0_0_60px_rgba(139,49,255,0.4)] items-center justify-center gap-2">
                Instalar Runtimes
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
            </a>
        </div>
      `
    },
    {
      title: "1. Compactador: 7-Zip",
      content: `
        <p class="mb-4 text-gray-300">
            Jogue fora o WinRAR. Ele fica pedindo licença toda hora. O <strong>7-Zip</strong> é gratuito, código aberto, mais leve e descompacta arquivos .rar e .zip mais rápido.
        </p>
      `
    },
    {
      title: "2. Player de Vídeo: VLC Media Player",
      content: `
        <p class="mb-4 text-gray-300">
            O "Filmes e TV" do Windows não roda legendas direito, nem formatos mkv estranhos. O VLC roda TUDO. É o canivete suíço dos vídeos. Se quiser algo mais bonitinho, use o <strong>PotPlayer</strong>.
        </p>
      `
    },
    {
      title: "3. Captura de Tela: ShareX",
      content: `
        <p class="mb-4 text-gray-300">
            O melhor software de printscreen do mundo. Gratuito na Steam ou site oficial.
        </p>
        <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4">
            <li>Tira print e já faz upload automático pro Imgur (gera link).</li>
            <li>Grava GIFs da tela ou vídeos MP4 leves.</li>
            <li>Tem editor, seletor de cores, régua e OCR (extrair texto de imagem).</li>
        </ul>
      `
    }
  ];

  const advancedContentSections = [
    {
      title: "Microsoft PowerToys: Superpoderes",
      content: `
            <div class="bg-gray-800/50 p-6 rounded-xl border border-gray-700 mb-8">
                <h4 class="text-white font-bold mb-4 text-xl">Ferramentas Oficiais da MS</h4>
                <p class="text-gray-300 mb-4">
                    Baixe na Microsoft Store. Ele adiciona recursos que deveriam vir no Windows:
                </p>
                <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4 text-sm">
                    <li><strong>FancyZones:</strong> Crie layouts complexos para dividir janelas no monitor ultrawide.</li>
                    <li><strong>Color Picker:</strong> Win+Shift+C para pegar a cor de qualquer pixel da tela.</li>
                    <li><strong>PowerRename:</strong> Renomear 1000 arquivos de uma vez.</li>
                    <li><strong>Image Resizer:</strong> Redimensionar fotos clicando com botão direito.</li>
                </ul>
            </div>
            `
    }
  ];

  const additionalContentSections = [
    {
      title: "Antivírus?",
      content: `
            <p class="mb-4 text-gray-300">
                Você <strong>NÃO</strong> precisa de Avast, AVG ou Norton em 2026.
            </p>
            <p class="text-gray-300 text-sm">
                O <strong>Windows Defender</strong> nativo já é excelente e leve. Antivírus de terceiros hoje em dia agem como bloatware, instalando VPNs e popups de venda. Fique com o Defender e use o bom senso (não baixe executáveis desconhecidos). Se precisar de uma segunda opinião, baixe o <strong>Malwarebytes Free</strong> para um scan manual ocasional.
            </p>
            `
    }
  ];

  const faqItems = [
    {
      question: "PDF Reader?",
      answer: "O próprio navegador (Edge/Chrome) abre PDF muito bem. Se precisar editar ou assinar, o Adobe Reader é pesado. Tente o SumatraPDF (levíssimo) ou Foxit Reader."
    },
    {
      question: "Utorrent ainda vale a pena?",
      answer: "NUNCA. O uTorrent virou um outdoor de anúncios e já teve minerador de bitcoin escondido. Use o <strong>Qbittorrent</strong>. É igualzinho visualmente, mas sem anúncios, open source e mais rápido."
    }
  ];

  const externalReferences = [
    { name: "Ninite", url: "https://ninite.com/" },
    { name: "Microsoft PowerToys GitHub", url: "https://github.com/microsoft/PowerToys" }
  ];

  const relatedGuides = [
    {
      href: "/guias/winrar-vs-7zip-qual-melhor",
      title: "Batalha dos Compactadores",
      description: "Por que 7-Zip vence."
    },
    {
      href: "/guias/vlc-media-player-vs-potplayer",
      title: "Melhores Players",
      description: "Comparativo de codecs."
    },
    {
      href: "/guias/instalacao-windows-11",
      title: "Instalação Limpa",
      description: "O passo anterior a este guia."
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
      advancedContentSections={advancedContentSections}
      additionalContentSections={additionalContentSections}
      summaryTable={summaryTable}
      relatedGuides={relatedGuides}
      faqItems={faqItems}
      externalReferences={externalReferences}
    />
  );
}
