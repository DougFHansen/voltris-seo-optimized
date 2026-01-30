import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Driver de Vídeo e Placa de Vídeo - Instalar e Atualizar (NVIDIA/AMD/Intel)";
const description = "Como instalar e atualizar driver de vídeo (driver placa de vídeo) no Windows. Guia NVIDIA, AMD e Intel: instalar drivers, DDU e evitar telas pretas ou FPS baixo.";
const keywords = ["driver de video", "driver placa de vídeo", "atualizar driver video", "instalar driver placa de vídeo", "nvidia geforce experience", "amd adrenalin", "ddu display driver uninstaller", "fps baixo"];

export const metadata: Metadata = createGuideMetadata('atualizacao-drivers-video', title, description, keywords);

export default function GuidePage() {
  const contentSections = [

    {
      title: "Por que atualizar (e quando não atualizar)",
      content: `
        <p class="mb-4 text-gray-300">Drivers de vídeo (GPU) são o software mais complexo do seu PC. Atualizar pode dar 10-20% mais performance em jogos novos.</p>
          <div class="bg-blue-900/20 p-4 border-l-4 border-blue-500 my-4">
            <h4 class="text-blue-400 font-bold mb-2">Regra de Ouro</h4>
            <p class="text-gray-300 text-sm">Se tudo está funcionando bem e você não vai jogar um lançamento AAA de hoje, não precisa atualizar imediatamente. Espere uma semana para ver se a nova versão não tem bugs.</p>
          </div>
      `,
      subsections: []
    },

    {
      title: "O Método 'Limpo' (DDU) - Para Corrigir Problemas",
      content: `
        <p class="mb-4 text-gray-300">Se você trocou de placa (ex: saiu da AMD para NVIDIA) ou está tendo falhas, você PRECISA usar o DDU.</p>
          <ol class="list-decimal list-inside space-y-3 text-gray-300">
            <li>Baixe o <strong>Display Driver Uninstaller (DDU)</strong> do site Guru3D.</li>
            <li>Baixe o instalador do driver novo (NVIDIA/AMD) e deixe salvo na área de trabalho.</li>
            <li><strong>Desconecte a internet</strong> (para o Windows Update não instalar um driver genérico sozinho).</li>
            <li>Reinicie o PC em <strong>Modo de Segurança</strong>.</li>
            <li>Abra o DDU, selecione "GPU" e clique em <strong>"Limpar e Reiniciar"</strong>.</li>
            <li>Ao ligar de volta (ainda sem internet), instale o driver novo que você baixou.</li>
          </ol>
      `,
      subsections: []
    },

    {
      title: "Configurações Pós-Instalação",
      content: `
        <p class="text-gray-300 mb-2">Depois de instalar, verifique:</p>
          <ul class="list-disc list-inside text-gray-400">
            <li><strong>Taxa de Atualização (Hz):</strong> O Windows pode ter resetado seu monitor para 60Hz. Vá em Configurações de Exibição -> Avançado e mude para 144Hz/165Hz.</li>
            <li><strong>G-Sync/FreeSync:</strong> Reative no painel de controle da placa.</li>
          </ul>
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
