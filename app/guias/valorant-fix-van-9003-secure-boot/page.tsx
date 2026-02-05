import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'valorant-fix-van-9003-secure-boot',
  title: "Valorant VAN 9003: Como ativar Secure Boot e TPM (2026)",
  description: "Seu Valorant não abre por causa do erro VAN 9003? Aprenda como ativar o Secure Boot e o TPM 2.0 na BIOS para jogar no Windows 11 em 2026.",
  category: 'games-fix',
  difficulty: 'Intermediário',
  time: '25 min'
};

const title = "Valorant VAN 9003: Como ativar Secure Boot e TPM (2026)";
const description = "Seu Valorant não abre por causa do erro VAN 9003? Aprenda como ativar o Secure Boot e o TPM 2.0 na BIOS para jogar no Windows 11 em 2026.";
const keywords = [
    'valorant erro van 9003 como resolver 2026',
    'ativar secure boot valorant windows 11 tutorial',
    'vanguard van 9003 secure boot fix guia 2026',
    'como entrar na bios para ativar secure boot tutorial',
    'erro van 9003 valorant windows 11 tpm 2.0 guia'
];

export const metadata: Metadata = createGuideMetadata('valorant-fix-van-9003-secure-boot', title, description, keywords);

export default function ValorantSecureBootGuide() {
    const summaryTable = [
        { label: "Erro", value: "VAN 9003 (Requisito do Vanguard no Win 11)" },
        { label: "Requisito #1", value: "Secure Boot: Ativado (Enabled)" },
        { label: "Requisito #2", value: "TPM 2.0 / PTT / fTPM: Ativado" },
        { label: "Modo BIOS", value: "UEFI (CSM deve estar desativado)" }
    ];

    const contentSections = [
        {
            title: "Por que o Erro VAN 9003 acontece?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Em 2026, o sistema anti-cheat da Riot, o **Vanguard**, exige que o Windows 11 esteja rodando com todas as suas camadas de segurança ativas para evitar cheats de nível de hardware. Se a sua BIOS estiver configurada no modo antigo (Legacy) ou se o **Secure Boot** estiver desligado, o Valorant simplesmente se recusa a iniciar. Resolver isso exige uma viagem à BIOS do seu computador, mas é um processo definitivo.
        </p>
      `
        },
        {
            title: "1. Verificando o estado atual no Windows",
            content: `
        <p class="mb-4 text-gray-300">Antes de mexer na BIOS, veja o que está faltando:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Aperte Win+R e digite <code>msinfo32</code>.</li>
            <li>Procure por 'Estado da Inicialização Segura'. Se estiver 'Desativado', você precisa ligar o Secure Boot.</li>
            <li>Procure por 'Modo da BIOS'. Se estiver 'Herdado' (Legacy), você precisará converter seu disco para GPT antes de poder ativar o Secure Boot.</li>
        </ol>
      `
        },
        {
            title: "2. Ativando o Secure Boot na BIOS",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Dentro da BIOS (Passo Geral):</h4>
            <p class="text-sm text-gray-300">
                1. Reinicie o PC e aperte repetidamente a tecla <strong>DEL ou F2</strong>. <br/>
                2. Vá na aba de <strong>Boot</strong> ou <strong>Security</strong>. <br/>
                3. Desative o <strong>CSM Support</strong> (Isso é obrigatório para ativar o Secure Boot). <br/>
                4. Mude 'Secure Boot' para <strong>Enabled</strong>. Se ele disser 'Not Active', mude o modo de 'Standard' para 'Custom' e depois volte para 'Standard' (Isso reseta as chaves de segurança). <br/>
                5. Salve e Reinicie (F10).
            </p>
        </div>
      `
        },
        {
            title: "3. O TPM 2.0 (fTPM / PTT)",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>Não esqueça do TPM:</strong> Além do Secure Boot, o TPM deve estar ativo. 
            <br/><br/>Em 2026, processadores modernos possuem o TPM embutido. Procure na BIOS por <strong>fTPM (AMD)</strong> ou <strong>Intel Platform Trust Technology (PTT)</strong> e certifique-se de que está ativado. Sem isso, mesmo com o Secure Boot ligado, o Vanguard pode apresentar o erro VAN 9001 ou 9003.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/valorant-van-9003-secure-boot-tpm-fix",
            title: "TPM 2.0 Detalhado",
            description: "Mais detalhes sobre ativação de segurança."
        },
        {
            href: "/guias/pos-instalacao-windows-11",
            title: "Windows 11 Setup",
            description: "Garanta que seu sistema esteja otimizado."
        },
        {
            href: "/guias/como-resolver-tela-azul",
            title: "Erro de Inicialização",
            description: "O que fazer se o PC não ligar após o Secure Boot."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="25 min"
            difficultyLevel="Médio"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
