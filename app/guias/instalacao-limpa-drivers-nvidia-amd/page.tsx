import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'instalacao-limpa-drivers-nvidia-amd',
  title: "Instalação Limpa de Drivers: Como fazer do jeito certo (2026)",
  description: "Seu driver de vídeo está travando ou com performance baixa? Aprenda a fazer uma instalação limpa dos drivers NVIDIA e AMD sem deixar restos no sistema...",
  category: 'windows-geral',
  difficulty: 'Iniciante',
  time: '20 min'
};

const title = "Instalação Limpa de Drivers: Como fazer do jeito certo (2026)";
const description = "Seu driver de vídeo está travando ou com performance baixa? Aprenda a fazer uma instalação limpa dos drivers NVIDIA e AMD sem deixar restos no sistema.";
const keywords = [
    'instalação limpa driver nvidia windows 11 2026',
    'como fazer instalação limpa driver amd adrenalin tutorial',
    'driver de video travando como desinstalar e instalar do zero',
    'erro de instalação de driver nvidia geforce experience fix',
    'performance drivers de video 2026 guia profissional'
];

export const metadata: Metadata = createGuideMetadata('instalacao-limpa-drivers-nvidia-amd', title, description, keywords);

export default function CleanDriverInstallGuide() {
    const summaryTable = [
        { label: "O que é", value: "Remoção total de perfis e arquivos antigos" },
        { label: "Método NVIDIA", value: "checkbox 'Executar instalação limpa'" },
        { label: "Método AMD", value: "AMD Cleanup Utility" },
        { label: "Dificuldade", value: "Iniciante" }
    ];

    const contentSections = [
        {
            title: "Por que 'Atualizar' nem sempre é a melhor opção?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Ao clicar no botão "Atualizar" do GeForce Experience ou do AMD Adrenalin, o instalador tenta sobrepor os arquivos novos em cima dos antigos. Em 2026, com drivers complexos que pesam quase 1GB, restos de perfis de overclock ou configurações de brilho personalizadas de versões anteriores podem causar conflitos, gerando quedas de FPS inexplicáveis e os famosos "crashes para a área de trabalho".
        </p>
      `
        },
        {
            title: "1. Instalação Limpa Nativa (NVIDIA)",
            content: `
        <p class="mb-4 text-gray-300">Se você tem uma placa NVIDIA (RTX ou GTX):</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Baixe o driver manualmente no site da NVIDIA ou use o NVIDIA App.</li>
            <li>Inicie a instalação e escolha <strong>'Instalação Personalizada (Avançada)'</strong>.</li>
            <li>Clique em Avançar. Na parte inferior da lista de componentes, marque a caixa <strong>'Executar uma instalação limpa'</strong>.</li>
            <li>Isso restaurará todas as configurações do painel de controle para o padrão de fábrica, eliminando bugs de versões passadas.</li>
        </ol>
      `
        },
        {
            title: "2. O jeito AMD (Adrenaline)",
            content: `
        <div class="bg-red-900/10 p-5 rounded-xl border border-red-500/30">
            <h4 class="text-white font-bold mb-2">AMD Cleanup Utility:</h4>
            <p class="text-sm text-gray-300">
                A AMD oferece uma ferramenta separada chamada <strong>AMD Cleanup Utility</strong>. Recomendamos baixá-la sempre que você notar que o software Adrenaline não está abrindo ou as cores da tela estão estranhas. Ela limpa o registro do Windows de forma profunda antes de você rodar o novo instalador, sendo muito mais eficaz que o desinstalador padrão.
            </p>
        </div>
      `
        },
        {
            title: "3. Aviso sobre o Windows Update",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>Importante:</strong> Assim que você desinstalar o driver antigo, o Windows Update tentará baixar automaticamente um driver genérico por trás das cortinas. 
            <br/><br/><strong>Dica:</strong> Desconecte a internet ou use o programa <strong>DDU</strong> para desabilitar essa função temporariamente. Caso contrário, você acabará com uma "salada de drivers" (o do Windows Update e o que você baixou), o que gera ainda mais instabilidade.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/como-usar-ddu-driver-uninstaller",
            title: "Guia DDU",
            description: "O método definitivo para remover drivers."
        },
        {
            href: "/guias/atualizacao-drivers-video",
            title: "Drivers Oficiais",
            description: "Onde baixar as versões corretas de 2026."
        },
        {
            href: "/guias/aceleracao-hardware-gpu-agendamento",
            title: "Performance GPU",
            description: "Ajuste após a instalação limpa."
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
