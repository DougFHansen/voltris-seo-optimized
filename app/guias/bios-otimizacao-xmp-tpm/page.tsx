import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'bios-otimizacao-xmp-tpm',
    title: "BIOS Otimizada (2026): XMP, Re-Size BAR e PBO",
    description: "Seu PC está rodando com freio de mão puxado? Aprenda a ativar o XMP da RAM, Re-Size BAR para GPU e configurar a BIOS para performance máxima.",
    category: 'hardware',
    difficulty: 'Avançado',
    time: '45 min'
};

const title = "BIOS Tuning (2026): Performance Grátis";
const description = "Muitos compram RAM de 3200MHz mas ela roda a 2133MHz porque esqueceram da BIOS. Este guia desbloqueia o potencial oculto do seu hardware.";

const keywords = [
    'como ativar xmp bios asus gigabyte msi',
    'resize bar ativado ou desativado jogos',
    'precision boost overdrive amd pbo2',
    'desativar c-states bios fps boost',
    'virtualization svm vt-d ativar',
    'tpm 2.0 secure boot valorant',
    'atualizar bios seguro 2026',
    'fan curve bios silencioso',
    'voltris optimizer bios settings',
    'configurar bios para windows 11'
];

export const metadata: Metadata = createGuideMetadata('bios-otimizacao-xmp-tpm', title, description, keywords);

export default function BiosGuide() {
    const summaryTable = [
        { label: "RAM Speed", value: "XMP / DOCP ON" },
        { label: "GPU Access", value: "Re-Size BAR ON" },
        { label: "Boot", value: "UEFI / Secure Boot" },
        { label: "Virtualization", value: "ON (Jogos Android)" },
        { label: "CPU Power", value: "PBO (AMD) / Turbo (Intel)" },
        { label: "C-States", value: "Disabled (Latência)" },
        { label: "Fans", value: "PWM Mode" }
    ];

    const contentSections = [
        {
            title: "Introdução: A Tela Preta Assustadora",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Entrar na BIOS (Del ou F2 no boot) assusta muita gente, mas é lá que a mágica acontece. Não tenha medo. Se algo der errado, basta "Reset to Default" ou tirar a bateria da placa-mãe.
        </p>
      `
        },
        {
            title: "Capítulo 1: D.O.C.P / X.M.P / EXPO (Memória RAM)",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">O Erro Mais Comum</h4>
                <p class="text-gray-400 text-xs text-justify">
                    Memórias RAM vêm de fábrica em velocidade segura (JEDEC), geralmente 2133MHz ou 2666MHz.
                    <br/>Para usar os 3200MHz, 3600MHz ou 6000MHz (DDR5) que você pagou, você <strong class="text-emerald-400">PRECISA</strong> ativar o perfil XMP (Intel) ou D.O.C.P/EXPO (AMD) na primeira tela da BIOS.
                    <br/>Ganho de FPS: 10% a 30% em jogos competitivos.
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: Re-Size BAR / Smart Access Memory",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>Above 4G Decoding:</strong> Enable.
            <br/><strong>Re-Size BAR Support:</strong> Enable.
            <br/>Isso permite que a CPU acesse toda a VRAM da placa de vídeo de uma vez só, em vez de pequenos blocos de 256MB.
            <br/>Jogos como Assassin's Creed Valhalla, Cyberpunk e CS2 ganham performance grátis (5-10%).
            <br/><em>Requisito:</em> GPU Nvidia RTX 3000+ ou AMD RX 6000+. Partição do disco em estilo GPT (UEFI).
        </p>
      `
        },
        {
            title: "Capítulo 3: Secure Boot e TPM 2.0 (Valorant)",
            content: `
        <p class="mb-4 text-gray-300">
            Para jogar Valorant no Windows 11, é obrigatório:
            <br/>- <strong>TPM 2.0 (fTPM ou PTT):</strong> Enable.
            <br/>- <strong>Secure Boot:</strong> Enable (Mode: Standard).
            <br/>Se você não ativar isso, o Vanguard bloqueia o jogo. Se sua opção "Secure Boot" estiver cinza, desative o "CSM (Compatibility Support Module)" para forçar o modo UEFI puro.
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: PBO e Undervolt (AMD Ryzen)",
            content: `
        <p class="mb-4 text-gray-300">
            Se usa AMD Ryzen:
            <br/>Procure <strong>Precision Boost Overdrive (PBO)</strong>.
            <br/>Configure o <strong>Curve Optimizer</strong> para "Negative" e comece com "-15" ou "-20".
            <br/>Isso faz a CPU usar menos voltagem, esquentar menos e, consequentemente, atingir clocks mais altos (Boost) por mais tempo. É um overclock seguro e frio.
        </p>
      `
        },
        {
            title: "Capítulo 5: Power Limits (Intel)",
            content: `
        <p class="mb-4 text-gray-300">
            Em CPUs Intel (13th/14th Gen), as placas-mãe liberam energia ilimitada (4096W) por padrão, causando superaquecimento e instabilidade.
            <br/>Procure "Long Duration Power Limit" (PL1) e "Short Duration" (PL2).
            <br/>Defina conforme a spec da Intel (ex: 253W para i9, 181W para i7). Isso evita crash em compilação de shaders.
        </p>
      `
        },
        {
            title: "Capítulo 6: Global C-States (Latência)",
            content: `
        <p class="mb-4 text-gray-300">
            C-States são modos de economia de energia onde o núcleo da CPU "dorme" quando não usado.
            <br/>Para jogos competitivos extremos (e evitar gaguejos/stutters): <strong>Desative (Disable)</strong> o "Global C-State Control".
            <br/>Desvantagem: A CPU consome mais energia em idle e não baixa o clock. Use só se souber o que está fazendo.
        </p>
      `
        },
        {
            title: "Capítulo 7: Fan Curves (Curva de Ventoinha)",
            content: `
        <p class="mb-4 text-gray-300">
            Configure suas fans na BIOS (Q-Fan / Smart Fan).
            <br/>Defina o modo como <strong>PWM</strong> (para fans 4 pinos).
            <br/>Crie uma curva agressiva: Se CPU > 70°C, Fan = 100%.
            <br/>Evite o modo "Silent" para jogos. Use "Standard" ou "Turbo".
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 8: Boot Rápido (Fast Boot)",
            content: `
            <p class="mb-4 text-gray-300">
                <strong>Memory Context Restore (AMD):</strong> Enable. (Faz o boot do DDR5 levar 15s em vez de 60s).
                <br/><strong>Fast Boot:</strong> Enable (Pula verificação de USBs na inicialização).
            </p>
            `
        },
        {
            title: "Capítulo 9: Atualização de BIOS (Flash)",
            content: `
            <p class="mb-4 text-gray-300">
                Manter a BIOS atualizada melhora a estabilidade da RAM e segurança.
                <br/>Baixe do site do fabricante, coloque num Pendrive (FAT32), e use a ferramenta "Ez Flash" ou "Q-Flash" dentro da BIOS.
                <br/><strong>NUNCA</strong> desligue o PC durante o update (risco de brickar).
            </p>
            `
        },
        {
            title: "Capítulo 10: Virtualização (Emuladores)",
            content: `
            <p class="mb-4 text-gray-300">
                Se você usa BlueStacks ou Docker:
                <br/>Ative <strong>Intel Virtualization Technology (VT-x)</strong> ou <strong>AMD SVM Mode</strong>.
                <br/>Sem isso, emuladores rodam a 1 FPS.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Perco garantia mudando a BIOS?",
            answer: "Geralmente não. Ativar XMP é um recurso padrão suportado. Fazer overvolting manual (mexer em voltagens de VCore perigosas) pode degradar a CPU."
        },
        {
            question: "PC não liga depois de ativar XMP?",
            answer: "Sua RAM pode estar instável ou a controladora da CPU não aguenta. Tente ativar o XMP e baixar a frequência manualmente um pouco (ex: de 3600 para 3400). Ou resete a BIOS (Clear CMOS) para voltar a ligar."
        },
        {
            question: "O que é CSM?",
            answer: "Compatibility Support Module. É o modo legado para Windows 7. Para Windows 10/11 e Re-Size BAR, o CSM deve estar DESLIGADO (Disabled)."
        }
    ];

    const externalReferences = [
        { name: "Guia Asus BIOS", url: "https://www.asus.com/support/" },
        { name: "AMD Ryzen Master", url: "https://www.amd.com/en/technologies/ryzen-master" }
    ];

    const relatedGuides = [
        {
            href: "/guias/instalacao-windows-11",
            title: "Windows 11",
            description: "Requer TPU e Secure Boot."
        },
        {
            href: "/guias/bluestacks-otimizacao-free-fire-pubg",
            title: "BlueStacks",
            description: "Requer Virtualização."
        },
        {
            href: "/guias/otimizacao-ssd-windows-11",
            title: "SSD",
            description: "Modo AHCI/NVMe na BIOS."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="45 min"
            difficultyLevel="Avançado"
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
