import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Tela Azul DPC_WATCHDOG_VIOLATION: Como Resolver no SSD e Drivers (2026)";
const description = "PC travando com DPC_WATCHDOG_VIOLATION? O problema quase sempre é o driver SATA do SSD ou conflito de firmware. Veja como mudar para o driver AHCI padrão.";
const keywords = ['dpc watchdog violation ssd', 'corrigir erro dpc watchdog', 'storahci.sys fix', 'atualizar firmware ssd', 'tela azul ssd windows 10', 'mouse travando tela azul'];

export const metadata: Metadata = createGuideMetadata('dpc-watchdog-violation-como-resolver', title, description, keywords);

export default function DPCGuide() {
    const summaryTable = [
        { label: "Culpado", value: "Driver SATA AHCI" },
        { label: "Arquivo", value: "storahci.sys" },
        { label: "Solução", value: "Trocar Driver" },
        { label: "Nível", value: "Intermediário" }
    ];

    const contentSections = [
        {
            title: "O que significa DPC Watchdog?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
          O "Watchdog" (Cão de Guarda) é um processo do Windows que vigia se algum componente está demorando demais para responder. Se o seu SSD demora mais de 10 segundos para responder a uma leitura, o Watchdog assume que o PC travou e força uma Tela Azul para reiniciar.
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed font-bold text-red-400">
            Isso é 99% das vezes causado pelo driver "iastor.sys" (Intel Rapid Storage) ou incompatibilidade de energia do SSD.
        </p>
      `,
            subsections: []
        },
        {
            title: "Solução Definitiva: Trocando o driver SATA",
            content: `
        <p class="mb-4 text-gray-300">
            Vamos forçar o Windows a usar o driver genérico da Microsoft, que é mais estável que o da Intel/AMD para SSDs baratos.
        </p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4 mb-6">
            <li>Clique com botão direito no Menu Iniciar > <strong>Gerenciador de Dispositivos</strong>.</li>
            <li>Expanda a categoria <strong>Controladores IDE ATA/ATAPI</strong>.</li>
            <li>Você verá algo como "Standard SATA AHCI Controller" ou "Intel(R) Chipset SATA...".</li>
            <li>Clique com botão direito nele > <strong>Atualizar driver</strong>.</li>
            <li>Escolha: <strong>"Procurar drivers no meu computador"</strong>.</li>
            <li>Escolha: <strong>"Permitir que eu escolha em uma lista de drivers disponíveis"</strong>.</li>
            <li>Selecione <strong>Controlador AHCI SATA Padrão</strong> (Standard SATA AHCI Controller).</li>
            <li>Clique em Avançar e Reinicie o PC.</li>
        </ol>
      `,
            subsections: []
        },
        {
            title: "Ajuste de Firmware do SSD",
            content: `
        <p class="mb-4 text-gray-300">
            Se seu SSD for da marca Kingston (A400) ou Crucial (BX500) e tiver firmware antigo, ele trava aleatoriamente.
        </p>
        <ul class="list-disc list-inside text-gray-300 space-y-2">
            <li>Baixe o software da fabricante (Kingston SSD Manager / Crucial Storage Executive).</li>
            <li>Verifique se há "Firmware Update".</li>
            <li>Se houver, faça o update (Faça backup dos dados importantes antes, há risco minúsculo de perda).</li>
        </ul>
      `
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="15 min"
            difficultyLevel="Intermediário"
            contentSections={contentSections}
            summaryTable={summaryTable}
        />
    );
}
