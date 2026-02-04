import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Como usar o DDU (Display Driver Uninstaller) com Segurança";
const description = "Problemas com drivers de vídeo? Aprenda como usar o DDU para fazer uma limpeza profunda e remover drivers da NVIDIA e AMD em 2026.";
const keywords = [
    'como usar ddu display driver uninstaller 2026',
    'remover driver nvidia e amd completamente guia',
    'ddu tutorial passo a passo windows 11 2026',
    'corrigir erro de driver de vídeo com ddu tutorial',
    'instalação limpa de drivers de video guia profissional'
];

export const metadata: Metadata = createGuideMetadata('como-usar-ddu-driver-uninstaller', title, description, keywords);

export default function DDUGuide() {
    const summaryTable = [
        { label: "O que faz", value: "Apaga rastros de drivers no registro e pastas" },
        { label: "Quando usar", value: "Mudança de GPU ou Crashes constantes" },
        { label: "Duração", value: "15 min" },
        { label: "Dificuldade", value: "Avançado" }
    ];

    const contentSections = [
        {
            title: "O que é o DDU e por que ele é especial?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O **DDU (Display Driver Uninstaller)** é a ferramenta "nuclear" para correção de drivers de vídeo. Diferente da desinstalação comum do Windows, o DDU remove chaves de registro, sobras de arquivos e drivers de monitor que o Windows geralmente deixa para trás. Em 2026, ele é essencial para resolver problemas de performance em jogos ou para preparar o PC para uma placa de vídeo nova sem precisar formatar.
        </p>
      `
        },
        {
            title: "1. Preparação Crítica: Modo de Segurança",
            content: `
        <p class="mb-4 text-gray-300">Nunca use o DDU com o Windows em execução normal!</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Baixe o DDU apenas do site oficial (Guru3D ou Wagnardsoft).</li>
            <li>Entre no <strong>Modo de Segurança</strong> do Windows 11.</li>
            <li>Desconecte o seu cabo de rede ou desligue o Wi-Fi. (Isso impede que o Windows tente instalar um driver velho assim que você limpar).</li>
            <li>Execute o DDU como administrador.</li>
        </ol>
      `
        },
        {
            title: "2. Executando a Limpeza",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Configuração Recomendada:</h4>
            <p class="text-sm text-gray-300">
                - À direita, selecione o tipo de dispositivo: <strong>GPU</strong>. <br/>
                - Escolha a marca da sua placa antiga (NVIDIA, AMD ou Intel). <br/>
                - Clique no botão <strong>'Limpar e Reiniciar'</strong>. <br/><br/>
                O DDU fará todo o trabalho, criará um ponto de restauração e reiniciará o PC no modo normal com o driver básico de vídeo do Windows.
            </p>
        </div>
      `
        },
        {
            title: "3. Instalando o Driver Novo",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>Check final em 2026:</strong> 
            <br/><br/>Com o PC de volta ao modo normal (ainda sem internet), instale o driver que você baixou previamente. Só reconecte a internet após a instalação terminar com sucesso. Esse método garante que não existam restos de drivers antigos conflitando com os shaders e configurações do novo software, garantindo o máximo de FPS e estabilidade nos seus jogos.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/atualizacao-drivers-video",
            title: "Baixar Drivers",
            description: "Links oficiais das fabricantes."
        },
        {
            href: "/guias/como-resolver-tela-azul",
            title: "Fix Tela Azul",
            description: "O que fazer se o erro persistir."
        },
        {
            href: "/guias/aceleracao-hardware-gpu-agendamento",
            title: "Otimizar Placa",
            description: "Ajuste fino pós-instalação."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="20 min"
            difficultyLevel="Avançado"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
