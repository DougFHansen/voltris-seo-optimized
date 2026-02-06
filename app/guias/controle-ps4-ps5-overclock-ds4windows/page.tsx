import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'controle-ps4-ps5-overclock-ds4windows',
    title: "DualSense no PC (2026): DS4Windows e Overclock 1000Hz",
    description: "Use seu controle de PS4/PS5 no PC com todas as funções. Guia de DS4Windows, redução de input lag (Overclock) e configuração de giroscópio.",
    category: 'hardware',
    difficulty: 'Intermediário',
    time: '15 min'
};

const title = "DualSense Overclock: Mínimo Input Lag";
const description = "O controle de PS5 tem 4ms de delay nativo no Bluetooth. Com Overclock, baixamos para 1ms. Além disso, aprenda a emular um controle de Xbox para compatibilidade total.";

const keywords = [
    'ds4windows hidhide setup guide',
    'overclock dualsense 1000hz 8000hz',
    'input lag ps5 controller pc bluetooth',
    'gatilhos adaptativos pc jogos compativeis',
    'touchpad mouse ds4windows config',
    'dualsensex vs ds4windows ryochan7',
    'voltris optimizer controller',
    'gyro aiming pc'
];

export const metadata: Metadata = createGuideMetadata('controle-ps4-ps5-overclock-ds4windows', title, description, keywords);

export default function ControllerGuide() {
    const summaryTable = [
        { label: "Software", value: "DS4Windows (Ryochan7)" },
        { label: "Driver", value: "ViGEmBus" },
        { label: "Ocultar", value: "HidHide (Obrigatório)" },
        { label: "Polling Rate", value: "1000Hz (1ms)" },
        { label: "Emulação", value: "Xbox 360 / DualShock 4" },
        { label: "Conexão", value: "Cabo USB-C / BT 5.0" },
        { label: "Gatilhos", value: "Adaptive (Via Mods)" }
    ];

    const contentSections = [
        {
            title: "Introdução: O Problema do 'Duplo Input'",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Quando você conecta um DualSense no PC, o Windows o vê como "Wireless Controller". Se abrir o DS4Windows, ele cria um "Xbox 360 Controller" virtual. Os jogos veem OS DOIS e ficam loucos (botão duplicado). O HidHide resolve isso.
        </p>
      `
        },
        {
            title: "Capítulo 1: Instalação Limpa",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Requisitos</h4>
                <p class="text-gray-400 text-xs text-justify">
                    1. Baixe o <strong>DS4Windows (Ryochan7 build)</strong>.
                    2. Instale o .NET Runtime 6 ou superior.
                    3. Instale o driver <strong>ViGEmBus</strong> (Virtual Gamepad Emulation Bus).
                    4. Instale o <strong>HidHide</strong> (Para esconder o controle real e deixar só o virtual).
                    Reinicie o PC.
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: Overclock (1ms)",
            content: `
        <p class="mb-4 text-gray-300">
            No perfil do DS4Windows:
            <br/>Aba "Other" > BT Poll Rate.
            <br/>Mude para <strong>1000 Hz (1ms)</strong>.
            <br/>Se usar cabo, use o programa "hidusbf" para forçar o overclock na porta USB.
            <br/>Diferença: De 4ms instáveis para 1ms cravado. Essencial para Rocket League e FPS.
        </p>
      `
        },
        {
            title: "Capítulo 3: HidHide (Bug do Duplo Controle)",
            content: `
        <p class="mb-4 text-gray-300">
            Abra o HidHide Configuration Client.
            <br/>Aba "Devices".
            <br/>Marque a caixa do "Sony Interactive Entertainment Wireless Controller".
            <br/>Marque "Enable Device Hiding" lá embaixo.
            <br/>Vá na aba "Applications" e adicione o <code>DS4Windows.exe</code> na lista branca.
            <br/>Agora só o DS4Windows vê o controle físico. Os jogos veem apenas o controle emulado de Xbox. Zero conflito.
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: Touchpad como Mouse",
            content: `
        <p class="mb-4 text-gray-300">
            Muito útil para controlar o PC do sofá.
            <br/>Edite o Perfil > Touchpad.
            <br/>Output Mode: <strong>Mouse</strong>.
            <br/>Agora deslizar no touch move o cursor, clicar é o clique esquerdo.
        </p>
      `
        },
        {
            title: "Capítulo 5: Giroscópio (Gyro Aim)",
            content: `
        <p class="mb-4 text-gray-300">
            Para emuladores (Cemu/Yuzu):
            <br/>Ative o servidor UDP nas configurações do DS4Windows (port 26760).
            <br/>No emulador, aponte para esse IP/Porta.
            <br/>Para jogos de PC (CoD): Mapeie o Gyro para "Mouse" no DS4Windows. Ao girar o controle, ele mexe a mira. Requer treino, mas é quase um Aimbot.
        </p>
      `
        },
        {
            title: "Capítulo 6: Gatilhos Adaptativos (DualSenseX)",
            content: `
        <p class="mb-4 text-gray-300">
            O DS4Windows tem suporte básico. Para suporte avançado, use o app pago <strong>DualSenseX (DSX)</strong> na Steam.
            <br/>Ele permite testar a vibração, mudar a cor do LED de acordo com a bateria e forçar a resistência dos gatilhos em jogos que não suportam nativamente (Modo Audio Haptics).
        </p>
      `
        },
        {
            title: "Capítulo 7: Steam Input (Conflito)",
            content: `
        <p class="mb-4 text-gray-300">
            A Steam também tem drivers de controle.
            <br/>Se usar DS4Windows, <strong>DESATIVE</strong> o "PlayStation Configuration Support" nas configurações de controle da Steam (Big Picture). Deixe a Steam usar o controle de Xbox emulado pelo DS4Windows.
            <br/>Senão vira uma bagunça de 3 drivers brigando.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 8: Macros",
            content: `
            <p class="mb-4 text-gray-300">
                Você pode criar macros (ex: Apertar X repetidamente) e atribuir a um botão (ex: R3).
                <br/>Útil para QTEs (Quick Time Events) chatos.
            </p>
            `
        },
        {
            title: "Capítulo 9: Deadzone (Drift)",
            content: `
            <p class="mb-4 text-gray-300">
                Seu controle está puxando para o lado?
                <br/>Aumente o "Deadzone" (Zona Morta) dos analógicos nas configurações do perfil até parar de mexer sozinho (geralmente 0.05 a 0.10).
            </p>
            `
        },
        {
            title: "Capítulo 10: Xbox Controller?",
            content: `
            <p class="mb-4 text-gray-300">
                Controles de Xbox funcionam nativos, não precisam de DS4Windows.
                <br/>Mas você pode usar o app "Xbox Accessories" para atualizar o firmware e remapear botões traseiros (Elite).
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Bluetooth desconecta?",
            answer: "Compre um adaptador BT 5.0 dedicado (TP-Link UB500). O bluetooth integrado da placa-mãe geralmente é fraco e sofre interferência do WiFi 2.4GHz."
        },
        {
            question: "Bateria acaba rápido?",
            answer: "Desligue o LED (Lightbar) ou coloque no brilho mínimo. O LED gasta muita bateria à toa."
        }
    ];

    const externalReferences = [
        { name: "DS4Windows (Ryochan7) Download", url: "https://github.com/Ryochan7/DS4Windows/releases" },
        { name: "HidHide Driver", url: "https://github.com/ViGEm/HidHide" }
    ];

    const relatedGuides = [
        {
            href: "/guias/cemu-emulador-wii-u-zelda-botw-4k-60fps",
            title: "Cemu",
            description: "Uso do Gyro."
        },
        {
            href: "/guias/yuzu-ryujinx-otimizacao-zelda-mario-60fps-guia",
            title: "Yuzu",
            description: "Sensor de movimento."
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
            advancedContentSections={advancedContentSections}
            additionalContentSections={additionalContentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
            faqItems={faqItems}
            externalReferences={externalReferences}
        />
    );
}
