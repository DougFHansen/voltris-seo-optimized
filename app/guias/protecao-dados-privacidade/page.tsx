import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Privacidade Digital: Como proteger seus dados em 2026";
const description = "Você está sendo rastreado? Saiba como proteger sua privacidade online, configurar redes sociais e evitar vazamentos de dados pessoais em 2026.";
const keywords = [
    'privacidade digital como proteger dados 2026 guia',
    'como evitar rastreamento online tutorial 2026',
    'configurações de privacidade google instagram 2026',
    'melhores navegadores para privacidade guia 2026',
    'evitar vazamento de dados pessoais tutorial 2026'
];

export const metadata: Metadata = createGuideMetadata('protecao-dados-privacidade', title, description, keywords);

export default function PrivacyProtectionGuide() {
    const summaryTable = [
        { label: "Ferramenta nº 1", value: "Autenticação de Dois Fatores (2FA)" },
        { label: "Navegador", value: "Brave / Tor (Para anonimato)" },
        { label: "Busca", value: "DuckDuckGo / Brave Search" },
        { label: "Dificuldade", value: "Fácil" }
    ];

    const contentSections = [
        {
            title: "O valor dos seus dados em 2026",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Em 2026, seus dados pessoais (hábitos de compra, localização, histórico de busca) são o combustível da economia digital. Grandes empresas usam essas informações para treinar IAs e criar perfis psicológicos precisos para anúncios. Proteger sua privacidade não é apenas "esconder segredos", mas sim retomar o controle sobre a sua própria identidade digital e evitar que suas informações sejam vendidas no mercado negro.
        </p>
      `
        },
        {
            title: "1. O Navegador é a sua primeira defesa",
            content: `
        <p class="mb-4 text-gray-300">Pare de facilitar o trabalho dos rastreadores:</p>
        <ul class="list-disc list-inside text-gray-300 space-y-3">
            <li><strong>Bloqueadores de Script:</strong> Use o <i>uBlock Origin</i>. Ele impede que sites carreguem rastreadores invisíveis que seguem você de site em site.</li>
            <li><strong>Navegadores de Privacidade:</strong> O <i>Brave</i> bloqueia tudo nativamente. Se você busca anonimato total, use o <i>Tor Browser</i>, que mascara o seu IP através de várias camadas de conexão.</li>
            <li><strong>Busca Privada:</strong> O Google armazena tudo o que você pesquisa. Tente usar o <i>DuckDuckGo</i> ou o <i>Brave Search</i>, que não registram seu histórico de busca.</li>
        </ul >
      `
        },
        {
            title: "2. Redes Sociais e a "Bolha" Digital",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Checklist de Configuração:</h4>
            <p class="text-sm text-gray-300">
                1. <strong>Meta (Instagram/WhatsApp):</strong> Vá em 'Centro de Contas' e desative o rastreamento fora das plataformas. <br/>
                2. <strong>Google:</strong> Acesse 'Minha Conta' > Dados e Privacidade e ative a **Exclusão Automática** do histórico de localização e atividades na web a cada 3 meses. <br/>
                3. <strong>Vazamentos:</strong> Verifique se seu e-mail já foi vazado no site <i>haveibeenpwned.com</i>. Se sim, troque sua senha imediatamente.
            </p>
        </div>
      `
        },
        {
            title: "3. O Mito do "Modo Incógnito"",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>Cuidado:</strong> 
            <br/><br/>O Modo Incógnito (Janela Anônima) apenas não salva o histórico no seu **computador físico**. A sua operadora de internet (ISP), o seu patrão (em redes corporativas) e os sites que você visita ainda sabem exatamente quem você é e o que está fazendo. Para uma proteção real de conexão, o uso de uma **VPN confiável** ou do roteamento **Tor** é indispensável em 2026.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/seguranca-senhas-gerenciadores",
            title: "Gerenciar Senhas",
            description: "A base da proteção de contas."
        },
        {
            href: "/guias/autenticacao-dois-fatores",
            title: "Guia de 2FA",
            description: "Como usar o Google Authenticator."
        },
        {
            href: "/guias/vpn-vale-a-pena-jogos",
            title: "VPN e Privacidade",
            description: "Proteja sua conexão contra bisbilhoteiros."
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
