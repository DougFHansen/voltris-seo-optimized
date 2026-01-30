import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Guia de Limpeza e Otimização de Navegadores";
const description = "Seu Chrome ou Edge está lento? Aprenda a limpar cache, remover extensões maliciosas e resetar configurações para restaurar a velocidade original.";
const keywords = ["limpar cache chrome","navegador lento","remover extensoes","resetar edge","browser cleanup"];

export const metadata: Metadata = createGuideMetadata('limpeza-navegadores', title, description, keywords);

export default function GuidePage() {
  const contentSections = [

    {
      title: "Por que limpar o navegador?",
      content: `
        <p class="mb-4 text-gray-300">Navegadores acumulam gigabytes de dados temporários, cookies e cache ao longo do tempo. Isso não só usa espaço em disco, como pode deixar a navegação lenta e causar erros em sites bancários ou de login.</p>
      `,
      subsections: []
    },

    {
      title: "Limpeza Profunda no Google Chrome",
      content: `
        <div class="bg-[#1E1E22] p-5 rounded-lg border border-[#31A8FF]/30">
            <h4 class="text-white font-bold mb-3">Passo a Passo</h4>
            <ol class="list-decimal list-inside space-y-2 text-gray-300 text-sm">
              <li>Pressione <strong>Ctrl + Shift + Delete</strong>.</li>
              <li>Na janela que abrir, mude o período para <strong>"Todo o período"</strong>.</li>
              <li>Marque: "Imagens e arquivos armazenados em cache" e "Cookies e outros dados do site".</li>
              <li>Desmarque "Histórico de navegação" se quiser mantê-lo.</li>
              <li>Clique em <strong>Remover dados</strong>.</li>
            </ol>
            <div class="mt-4 p-3 bg-red-900/20 border border-red-500/20 rounded">
              <span class="text-red-400 font-bold text-xs">Atenção:</span> <span class="text-gray-400 text-xs">Isso desconectará você da maioria dos sites. Tenha suas senhas salvas.</span>
            </div>
          </div>
      `,
      subsections: []
    },

    {
      title: "Removendo Extensões e Malwares (Adware)",
      content: `
        <p class="mb-4 text-gray-300">Muitas vezes a lentidão é causada por extensões que você não instalou ou esqueceu.</p>
          <ul class="space-y-3 text-gray-300">
            <li><strong>Verificar:</strong> Digite <code>chrome://extensions</code> na barra de endereço.</li>
            <li><strong>Identificar:</strong> Procure por qualquer coisa como "Coupon Finder", "Search Helper", "PDF Converter" que você não reconheça.</li>
            <li><strong>Ação:</strong> Clique em REMOVER. Desativar não é suficiente.</li>
          </ul>
          <p class="mt-4 text-gray-300">Se a página inicial ou o mecanismo de busca mudaram sozinhos (ex: Yahoo Search aparecendo do nada), você precisa resetar o navegador: Configurações -> Redefinir configurações -> Restaurar configurações.</p>
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
      href: "/guias/seguranca-digital",
      title: "Segurança Digital",
      description: "Proteja seus dados."
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
      estimatedTime="15-20 min"
      difficultyLevel="Iniciante"
      contentSections={contentSections}
      relatedGuides={relatedGuides}
    />
  );
}
