import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Como usar o DDU (Display Driver Uninstaller) Corretamente e Evitar Erros (2026)";
const description = "Vai trocar de placa de vídeo ou o driver crashou? Aprenda a usar o DDU no Modo de Segurança para remover restos de drivers corrompidos da NVIDIA/AMD/Intel.";
const keywords = ['ddu tutorial', 'display driver uninstaller como usar', 'driver nvidia não instala', 'limpar drivers de video', 'modo de segurança windows 11', 'tela preta driver amd'];

export const metadata: Metadata = createGuideMetadata('como-usar-ddu-driver-uninstaller', title, description, keywords);

export default function DDUGuide() {
    const summaryTable = [
        { label: "Ferramenta", value: "DDU (Wagnardsoft)" },
        { label: "Modo", value: "Segurança (Safe Mode)" },
        { label: "Internet", value: "Desligada (Cabo)" },
        { label: "Risco", value: "Médio" }
    ];

    const contentSections = [
        {
            title: "Por que não apenas desinstalar pelo Painel de Controle?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
          O desinstalador padrão do Windows deixa para trás chaves de registro, pastas ocultas e configurações de shader cache. Se você trocar uma placa NVIDIA por AMD (ou vice-versa) sem limpar isso, o Windows tentará carregar instruções da placa antiga, causando tela azul e stuttering.
        </p>
      `,
            subsections: []
        },
        {
            title: "Passo 1: Preparação (Obrigatório)",
            content: `
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4">
            <li>Baixe o <strong>DDU</strong> no site oficial (Wagnardsoft).</li>
            <li>Baixe o driver novo da sua placa (NVIDIA/AMD) e deixe o instalador na Área de Trabalho.</li>
            <li><strong>DESCONECTE O CABO DE INTERNET (OU WI-FI).</strong>
                <p class="text-red-400 text-sm mt-1 ml-6">
                    Isso é vital. Se você reiniciar com internet, o Windows Update vai instalar um driver genérico em 3 segundos antes de você conseguir clicar no seu instalador.
                </p>
            </li>
        </ol>
      `,
            subsections: []
        },
        {
            title: "Passo 2: Entrando no Modo de Segurança",
            content: `
        <p class="mb-4 text-gray-300">
            O DDU funciona melhor quando o Windows está com o mínimo de processos.
        </p>
        <ul class="list-disc list-inside text-gray-300 space-y-2">
            <li>Segure a tecla <strong>SHIFT</strong> e clique em <strong>Reiniciar</strong> no Menu Iniciar.</li>
            <li>Vá em Solução de Problemas > Opções Avançadas > Configurações de Inicialização > Reiniciar.</li>
            <li>No menu azul que aparecer, aperte a tecla <strong>4</strong> (Habilitar Modo de Segurança).</li>
        </ul>
      `
        },
        {
            title: "Passo 3: A Limpeza",
            content: `
        <p class="mb-4 text-gray-300">
            Agora com o PC no Modo de Segurança (resolução baixa):
        </p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4">
            <li>Abra o DDU.exe.</li>
            <li>Selecione o tipo de dispositivo: <strong>GPU</strong>.</li>
            <li>Selecione o dispositivo: <strong>NVIDIA</strong> (ou AMD/Intel).</li>
            <li>Clique no botão: <strong>Limpar e Reiniciar</strong> (Clean and Restart).</li>
        </ol>
        <p class="text-gray-300 mt-4">
            O PC vai reiniciar no modo normal. Agora instale o driver que você baixou. Só conecte a internet depois de instalar.
        </p>
      `
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="15 min"
            difficultyLevel="Avançado"
            contentSections={contentSections}
            summaryTable={summaryTable}
        />
    );
}
