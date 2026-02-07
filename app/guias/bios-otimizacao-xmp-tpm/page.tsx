import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'bios-otimizacao-xmp-tpm',
    title: "O Guia Definitivo da BIOS (UEFI) 2026: XMP, PBO e Re-Size BAR",
    description: "Seu PC Gamer está rodando com o freio de mão puxado. Aprenda a entrar na BIOS e ativar o XMP da RAM, Re-Size BAR para GPU e configurar TPM 2.0 para Valorant.",
    category: 'hardware',
    difficulty: 'Avançado',
    time: '45 min'
};

const title = "O Guia Definitivo da BIOS (UEFI) 2026: Desbloqueie a Performance Oculta";
const description = "Muitos usuários compram Memória RAM de 3200MHz, mas ela roda a 2133MHz porque esqueceram de configurar a BIOS. Este guia ensina passo-a-passo como otimizar sua placa-mãe ASUS, Gigabyte, MSI ou ASRock.";

const keywords = [
    'como ativar xmp bios asus gigabyte msi 2026',
    'o que é resize bar nvidia amd ativar',
    'precision boost overdrive pbo ryzen tutorial',
    'como entrar na bios windows 11 uefi',
    'tpm 2.0 secure boot valorant erro van9003',
    'virtualizacao svm vt-x emulador android',
    'fan curve bios silencioso'
];

export const metadata: Metadata = createGuideMetadata('bios-otimizacao-xmp-tpm', title, description, keywords);

export default function BiosGuide() {
    const summaryTable = [
        { label: "RAM Speed", value: "XMP / DOCP / EXPO (Ativar)" },
        { label: "GPU Boost", value: "Re-Size BAR (Ativar)" },
        { label: "CPU Boost", value: "PBO (AMD) / Turbo (Intel)" },
        { label: "Segurança", value: "Secure Boot + TPM 2.0" },
        { label: "Emulação", value: "SVM / VT-x (Ativar)" },
        { label: "Boot Rápido", value: "Fast Boot (Desativar se tiver bugs)" }
    ];

    const contentSections = [
        {
            title: "Passo 0: Entrando na BIOS (O Portal)",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          A BIOS (agora chamada UEFI) é o sistema operacional da sua placa-mãe.
        </p>
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20 mb-6">
          <h4 class="text-blue-400 font-bold mb-2">Como Acessar</h4>
          <ol class="list-decimal list-inside text-gray-300 space-y-2 ml-4">
            <li><strong>Método Clássico:</strong> Reinicie o PC e aperte freneticamente a tecla <code>DEL</code> ou <code>F2</code> assim que a tela ligar.</li>
            <li><strong>Método Moderno (Se o SSD for rápido demais):</strong> No Windows, segure a tecla <code>SHIFT</code> e clique em Reiniciar.
                <br/>Vá em Solução de Problemas > Opções Avançadas > <strong>Configurações de Firmware UEFI</strong> > Reiniciar.</li>
          </ol>
        </div>
      `
        },
        {
            title: "1. XMP / DOCP / EXPO (Memória RAM)",
            content: `
        <p class="mb-4 text-gray-300">
          Esta é a configuração OBRIGATÓRIA #1.
          <br/>Sua memória RAM vem de fábrica rodando no padrão JEDEC lento (ex: 2133MHz ou 4800MHz DDR5). O XMP é o perfil de overclock seguro testado pela fábrica.
        </p>
        <ul class="list-disc list-inside text-gray-300 space-y-3 bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
            <li><strong>Intel:</strong> Procure por "XMP" (Extreme Memory Profile).</li>
            <li><strong>AMD (ASUS):</strong> Chama-se "DOCP".</li>
            <li><strong>AMD (Outros / DDR5):</strong> Chama-se "EXPO".</li>
            <li><strong>Ação:</strong> Mude de "Disabled" para "Profile 1". Salve e reinicie.</li>
            <li><strong>Benefício:</strong> Até 20% mais FPS em jogos CPU-bound (Warzone, Valorant).</li>
        </ul>
      `
        },
        {
            title: "2. Re-Size BAR / SAM (Smart Access Memory)",
            content: `
        <p class="mb-4 text-gray-300">
            Tecnologia de 2020+ que permite ao processador acessar toda a VRAM da placa de vídeo de uma só vez, em vez de pequenos pedaços de 256MB.
        </p>
        <div class="bg-green-900/10 p-5 rounded-xl border border-green-500/20">
            <h4 class="text-green-400 font-bold mb-2">Como Ativar</h4>
            <p class="text-sm text-gray-300">
                Geralmente fica na aba "Advanced" ou "PCI Subsystem Settings".
                <br/>1. Ative "Above 4G Decoding".
                <br/>2. Ative "Re-Size BAR Support" para <strong>Auto</strong> ou <strong>Enabled</strong>.
                <br/>3. Requer: GPU RTX 3000+ ou Radeon RX 6000+.
            </p>
        </div>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "3. Virtualização (SVM / VT-x)",
            content: `
        <h4 class="text-white font-bold mb-3">Para Emuladores e Docker</h4>
        <p class="mb-4 text-gray-300">
            Se você joga Free Fire no Bluestacks/LDPlayer, ou programa usando Docker/WSL2, você PRECISA disso.
            <br/>Sem a virtualização de hardware, emuladores rodam a 10 FPS travando.
        </p>
        <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4">
            <li><strong>AMD:</strong> Procure por "SVM Mode" (Secure Virtual Machine). Fica em CPU Configuration.</li>
            <li><strong>Intel:</strong> Procure por "Intel Virtualization Technology" ou "VT-x/VT-d".</li>
        </ul>
      `
        },
        {
            title: "4. TPM 2.0 e Secure Boot (Valorant)",
            content: `
        <p class="mb-4 text-gray-300">
            O anti-cheat Vanguard do Valorant (e o Windows 11) exigem essas tecnologias de segurança.
        </p>
        <div class="space-y-4">
            <div class="bg-gray-800/50 p-4 rounded-lg border border-red-500/30">
                <h5 class="font-bold text-white mb-2">Secure Boot</h5>
                <p class="text-sm text-gray-300">
                    Deve estar em "Windows UEFI Mode". Se estiver "Other OS", mude.
                    <br/>Nota: Se você mudar isso e o Windows não bootar, é porque seu Windows foi instalado em modo Legacy (antigo). Você precisará converter o disco de MBR para GPT.
                </p>
            </div>
            <div class="bg-gray-800/50 p-4 rounded-lg border border-yellow-500/30">
                <h5 class="font-bold text-white mb-2">fTPM / PTT</h5>
                <p class="text-sm text-gray-300">
                    TPM de Firmware.
                    <br/>AMD: "AMD fTPM switch".
                    <br/>Intel: "Intel PTT" (Platform Trust Technology).
                </p>
            </div>
        </div>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Curva de Fans (Silêncio ou Performance)",
            content: `
        <h4 class="text-white font-bold mb-3">Q-Fan / Smart Fan</h4>
        <p class="mb-4 text-gray-300">
            Todas as BIOS modernas têm uma ferramenta gráfica de ventiladores.
            <br/>Configure seus fans do gabinete (Case Fans) para ficarem desligados ou em 20% até a CPU bater 50°C. Isso torna o PC silencioso navegando na internet.
            <br/>Configure para subir rápido para 100% quando bater 75°C.
        </p>
      `
        }
    ];

    const faqItems = [
        {
            question: "Atualizar a BIOS melhora performance?",
            answer: "Geralmente não melhora FPS diretamente, mas melhora a ESTABILIDADE da memória RAM (permitindo XMP mais alto) e compatibilidade com novas CPUs."
        },
        {
            question: "Resetei a BIOS e o Windows sumiu!",
            answer: "Você provavelmente resetou o modo de boot. Procure por CSM (Compatibility Support Module). Se o Windows foi instalado em Legacy, ative o CSM. Se foi em UEFI, desative o CSM."
        },
        {
            question: "O que é 'Fast Boot'?",
            answer: "O Fast Boot pula verificações de USB e hardware na inicialização para ligar mais rápido. Porém, ele pode impedir que você entre na BIOS (o teclado não liga a tempo) e causar bugs com periféricos USB. Recomendamos deixar desligado em PCs Gamer High-End (SSDs já são rápidos o suficiente)."
        }
    ];

    const externalReferences = [
        { name: "CPU-Z (Verificar XMP)", url: "https://www.cpuid.com/softwares/cpu-z.html" },
        { name: "HWMonitor (Verificar Temps)", url: "https://www.cpuid.com/softwares/hwmonitor.html" },
        { name: "ASUS BIOS Guide", url: "https://www.asus.com/support/FAQ/1013015/" }
    ];

    const relatedGuides = [
        {
            href: "/guias/atualizar-bios-seguro",
            title: "Como Atualizar BIOS",
            description: "O passo a passo seguro para update."
        },
        {
            href: "/guias/como-escolher-memoria-ram",
            title: "Memória RAM",
            description: "Entenda latência e frequência."
        },
        {
            href: "/guias/valorant-van-9003-secure-boot-tpm-fix",
            title: "Erro VAN 9003",
            description: "Resolvendo o erro de TPM no Valorant."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="45 min"
            difficultyLevel="Avançado"
            author="Equipe Hardware Voltris"
            lastUpdated="2026-02-06"
            contentSections={contentSections}
            advancedContentSections={advancedContentSections}
            additionalContentSections={additionalContentSections}
            summaryTable={summaryTable}
            faqItems={faqItems}
            externalReferences={externalReferences}
            relatedGuides={relatedGuides}
        />
    );
}
