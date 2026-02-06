import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'valorant-van-9003-secure-boot-tpm-fix',
    title: "Valorant Erro VAN 9003 / VAN 1067: Solução Definitiva (TPM 2.0 e Secure Boot) (2026)",
    description: "Não consegue abrir o Valorant no Windows 11? O Vanguard exige TPM 2.0 e Secure Boot. Aprenda a ativar na BIOS (Gigabyte, Asus, MSI) e converter seu disco de MBR para GPT sem formatar.",
    category: 'games-fix',
    difficulty: 'Avançado',
    time: '30 min'
};

const title = "Como Corrigir Erro VAN 9003 e VAN 1067 no Valorant: Guia BIOS e TPM 2.0";
const description = "O Windows 11 exige segurança máxima para rodar Valorant. Descubra como ativar o Secure Boot, resolver o erro de 'BIOS Legacy' e converter MBR para GPT.";

const keywords = [
    'valorant van 9003 fix windows 11',
    'erro van 1067 valorant secure boot',
    'como ativar secure boot bios gigabyte asus msi',
    'ativar tpm 2.0 para valorant',
    'converter mbr para gpt sem formatar mbr2gpt',
    'vanguard requires secure boot enabled',
    'pc health check valorant',
    'bios uefi mode valorant'
];

export const metadata: Metadata = createGuideMetadata('valorant-van-9003-secure-boot-tpm-fix', title, description, keywords);

export default function Van9003Guide() {
    const summaryTable = [
        { label: "Erro", value: "VAN 9003 / VAN 1067" },
        { label: "Causa", value: "Secure Boot ou TPM Desativado" },
        { label: "Requisito", value: "Modo BIOS UEFI (não Legacy)" },
        { label: "Disco", value: "Tabela GPT (não MBR)" },
        { label: "Risco", value: "Médio (Alteração de BIOS)" },
        { label: "Solução", value: "Ativar na BIOS" }
    ];

    const contentSections = [
        {
            title: "Por que isso acontece?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O Vanguard (Anti-Cheat da Riot) no Windows 11 exige que o computador provar que é "confiável" através de hardware. Para isso, ele obriga o uso de <strong>TPM 2.0</strong> (Trusted Platform Module) e <strong>Secure Boot</strong>. Se um desses estiver desligado, o jogo não abre.
        </p>

        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20 my-8">
            <h4 class="text-[#31A8FF] font-bold mb-3 flex items-center gap-2">
                <span class="text-xl">🔒</span> Verificador Automático Voltris
            </h4>
            <p class="text-gray-300 mb-4">
                Entrar na BIOS pode ser assustador. O <strong>Voltris Optimizer</strong> tem uma ferramenta de "Valorant Prep" que verifica se seu TPM está ativos, se o disco é GPT e te diz exatamente o que mudar na BIOS antes de você reiniciar o PC.
            </p>
            <a href="/voltrisoptimizer" class="group relative inline-flex px-8 py-3 bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-white font-bold text-base rounded-lg overflow-hidden transition-all duration-300 transform hover:scale-[1.03] hover:shadow-[0_0_60px_rgba(139,49,255,0.4)] items-center justify-center gap-2">
                Verificar Requisitos
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
            </a>
        </div>
      `
        },
        {
            title: "Passo 1: Verifique se seu disco é GPT ou MBR",
            content: `
        <p class="mb-4 text-gray-300">
            Secure Boot SÓ funciona em discos GPT. Se seu Windows foi instalado em modo antigo (MBR), ativar o Secure Boot fará o PC parar de ligar.
        </p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4 bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
            <li>Clique com botão direito no Menu Iniciar > Gerenciamento de Disco.</li>
            <li>Clique com botão direito no "Disco 0" (onde está o Windows) > Propriedades.</li>
            <li>Vá na aba <strong>Volumes</strong>.</li>
            <li>Veja "Estilo de Partição":
                <ul class="ml-6 mt-2 text-sm text-[#31A8FF] list-none space-y-1">
                    <li>Se for <strong>GUID (GPT)</strong>: Ótimo, pule para o Passo 3.</li>
                    <li>Se for <strong>MBR</strong>: PARE. Você precisa converter para GPT.</li>
                </ul>
            </li>
        </ol>
      `
        },
        {
            title: "Passo 2: Converter MBR para GPT (Sem Formatar)",
            content: `
        <p class="mb-4 text-gray-300">
            O Windows 10/11 tem uma ferramenta nativa para isso.
        </p>
        <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4 font-mono text-sm">
            <li>Segure Shift e clique em Reiniciar.</li>
            <li>Vá em Solução de Problemas > Opções Avançadas > Prompt de Comando.</li>
            <li>Faça login na sua conta.</li>
            <li>Digite: <code>mbr2gpt /validate</code> (Deve dar "Validation completed successfully").</li>
            <li>Digite: <code>mbr2gpt /convert</code>.</li>
            <li>Quando terminar, reinicie e entre IMEDIATAMENTE na BIOS.</li>
        </ul>
      `
        },
        {
            title: "Passo 3: Configurando a BIOS (Secure Boot + TPM)",
            content: `
        <p class="mb-4 text-gray-300">
            Cada marca é diferente, mas os nomes são parecidos.
        </p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4">
            <li>Reinicie o PC apertando <strong>Del</strong> ou <strong>F2</strong> para entrar na BIOS.</li>
            <li>Desative o <strong>CSM Support</strong> (Compatibility Support Module). O Secure Boot só aparece se o CSM estiver OFF.</li>
            <li>Procure por <strong>Secure Boot</strong>. Mude para <strong>Enabled</strong>.
                <ul class="ml-6 mt-1 text-sm text-yellow-500">
                    <li>⚠️ Se der erro "System is in Setup Mode", procure por "Key Management" ou "Restore Factory Keys" e execute. O Secure Boot Mode deve ser "User", não "Setup".</li>
                </ul>
            </li>
            <li>Procure por <strong>TPM</strong>:
                <ul class="ml-6 mt-1 text-sm text-gray-400">
                    <li>Intel: Chama-se <strong>IPTT</strong> ou <strong>Intel Platform Trust Technology</strong>.</li>
                    <li>AMD: Chama-se <strong>fTPM</strong> ou <strong>Firmware TPM</strong>.</li>
                </ul>
            </li>
            <li>Ative (Enabled).</li>
            <li>Salve e Saia (F10).</li>
        </ol>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Erro: 'Este build do Vanguard requer conformidade...'",
            content: `
            <div class="bg-gray-800/50 p-6 rounded-xl border border-gray-700 mb-8">
                <h4 class="text-red-400 font-bold mb-4 text-xl">VBS e Isolamento de Núcleo</h4>
                <p class="text-gray-300 mb-4">
                    Às vezes não é a BIOS, é o Windows. O Vanguard precisa que certos serviços de segurança estejam rodando.
                </p>
                <ol class="list-decimal list-inside text-gray-300 space-y-2 ml-4">
                    <li>Pesquise no Windows por <code>msinfo32</code>.</li>
                    <li>Veja "Segurança baseada em virtualização". Deve estar "Em execução".</li>
                    <li>Se não estiver, procure no Windows por "Isolamento de Núcleo" e ative a "Integridade de Memória". (Cuidado: Isso pode diminuir levemente o FPS, mas é exigido pelo Valorant em alguns casos).</li>
                </ol>
            </div>
            `
        }
    ];

    const additionalContentSections = [
        {
            title: "Windows 10 vs Windows 11 no Valorant",
            content: `
            <p class="mb-4 text-gray-300">
                Se nada funcionar, saiba que essa exigência rigorosa de TPM + Secure Boot é exclusiva do <strong>Windows 11</strong>. No Windows 10, o Valorant roda sem TPM e sem Secure Boot (na maioria dos casos). A solução "nuclear" é voltar para o Windows 10.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Meu PC não tem chip TPM, e agora?",
            answer: "Quase todos os processadores modernos (Intel 8ª geração+, AMD Ryzen 2000+) têm TPM embutido no processador (fTPM/PTT). Você não precisa comprar o chip físico, só ativar na BIOS. Se seu PC for muito antigo (ex: Intel 4ª geração), você não pode jogar Valorant no Windows 11, terá que instalar o Windows 10."
        },
        {
            question: "Ativar Secure Boot estraga o PC?",
            answer: "Não. É um recurso de segurança que impede vírus de boot (Rootkits). Ele não deixa o PC mais lento."
        },
        {
            question: "O comando mbr2gpt perdeu meus arquivos?",
            answer: "O comando é seguro e non-destructive, mas fazer backup é sempre recomendado. Se a energia cair durante a conversão, o disco pode corromper."
        }
    ];

    const externalReferences = [
        { name: "Support Riot - VAN9003", url: "https://support-valorant.riotgames.com/hc/en-us/articles/10088435639571-Troubleshooting-the-VAN9001-or-VAN-9003-Error-on-Windows-11" },
        { name: "Microsoft - MBR2GPT Guide", url: "https://learn.microsoft.com/en-us/windows/deployment/mbr-to-gpt" }
    ];

    const relatedGuides = [
        {
            href: "/guias/atualizar-bios-seguro",
            title: "Atualizar BIOS",
            description: "Necessário se a opção Secure Boot não aparecer."
        },
        {
            href: "/guias/instalacao-windows-11",
            title: "Formatar Windows",
            description: "Como instalar já em modo UEFI/GPT."
        },
        {
            href: "/guias/valorant-reduzir-input-lag",
            title: "Otimizar Valorant",
            description: "Depois de abrir o jogo, como ganhar FPS."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="30 min"
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
