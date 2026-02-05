import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'protecao-dados-privacidade',
  title: "Privacidade Digital: Como proteger seus dados em 2026",
  description: "Você está sendo rastreado? Saiba como proteger sua privacidade online, configurar redes sociais e evitar vazamentos de dados pessoais em 2026.",
  category: 'windows-geral',
  difficulty: 'Iniciante',
  time: '35 min'
};

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
            title: "2. Redes Sociais e a \"Bolha\" Digital",
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
            title: "3. O Mito do \"Modo Incógnito\"",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>Cuidado:</strong> 
            <br/><br/>O Modo Incógnito (Janela Anônima) apenas não salva o histórico no seu **computador físico**. A sua operadora de internet (ISP), o seu patrão (em redes corporativas) e os sites que você visita ainda sabem exatamente quem você é e o que está fazendo. Para uma proteção real de conexão, o uso de uma **VPN confiável** ou do roteamento **Tor** é indispensável em 2026.
        </p>
      `
        }
    ];
    
    const faqItems = [
      {
        question: "O que é privacidade digital e por que é importante em 2026?",
        answer: `
          <p class="text-gray-300 mb-2">A privacidade digital refere-se ao controle que você tem sobre suas informações pessoais online. Em 2026, é crucial porque seus dados pessoais, como hábitos de compra, localização e histórico de busca, são o combustível da economia digital. Proteger sua privacidade ajuda a evitar perfis psicológicos invasivos, fraudes e uso indevido de suas informações.</p>
          <p class="text-gray-300">Além disso, a privacidade digital é um direito fundamental garantido por leis como a LGPD no Brasil e o GDPR na Europa.</p>
        `
      },
      {
        question: "Qual a diferença entre navegar no modo incógnito e usar uma VPN?",
        answer: `
          <p class="text-gray-300 mb-2">O modo incógnito apenas evita que o navegador salve histórico, cookies e formulários no seu dispositivo. Ele não oculta sua identidade de websites, ISPs ou governos. Já uma VPN (Virtual Private Network) mascara seu IP e criptografa seu tráfego, oferecendo proteção real contra vigilância e rastreamento.</p>
          <p class="text-gray-300">Portanto, o modo incógnito protege sua privacidade localmente, enquanto a VPN protege sua conexão e identidade na internet.</p>
        `
      },
      {
        question: "Quais são os melhores navegadores para privacidade?",
        answer: `
          <p class="text-gray-300 mb-2">Os melhores navegadores focados em privacidade incluem:</p>
          <ul class="list-disc list-inside text-gray-300 space-y-1 mb-2">
            <li><strong>Brave:</strong> Bloqueia rastreadores e anúncios nativamente</li>
            <li><strong>Tor Browser:</strong> Máximo anonimato, roteia conexão por múltiplas camadas</li>
            <li><strong>Firefox:</strong> Altamente personalizável com extensões de privacidade</li>
            <li><strong>LibreWolf:</strong> Fork do Firefox focado exclusivamente em privacidade</li>
          </ul>
          <p class="text-gray-300">Cada um tem diferentes níveis de anonimato e compatibilidade com sites convencionais.</p>
        `
      },
      {
        question: "Como posso verificar se meus dados já foram vazados?",
        answer: `
          <p class="text-gray-300 mb-2">Você pode verificar se seus dados já foram vazados usando serviços como o <i>Have I Been Pwned</i> (haveibeenpwned.com). Este site permite verificar se seu e-mail ou senha já estiveram em vazamentos de dados públicos.</p>
          <p class="text-gray-300">Se encontrar seu e-mail em um vazamento, é crucial trocar imediatamente as senhas das contas afetadas e habilitar a autenticação de dois fatores (2FA).</p>
        `
      },
      {
        question: "Quais são as configurações de privacidade essenciais nas redes sociais?",
        answer: `
          <p class="text-gray-300 mb-2">Configurações de privacidade essenciais incluem:</p>
          <ul class="list-disc list-inside text-gray-300 space-y-1 mb-2">
            <li>Limitar o público de suas postagens (público, amigos, somente você)</li>
            <li>Desativar o rastreamento de atividades fora da plataforma</li>
            <li>Controlar quem pode encontrar você por e-mail ou número</li>
            <li>Desativar o uso de dados para fins de publicidade personalizada</li>
          </ul>
          <p class="text-gray-300">Revise essas configurações regularmente, pois as plataformas frequentemente alteram padrões automaticamente.</p>
        `
      },
      {
        question: "O que é fingerprinting de navegador e como me proteger dele?",
        answer: `
          <p class="text-gray-300 mb-2">Fingerprinting de navegador é uma técnica que identifica usuários únicos com base em combinações de configurações e características do navegador, como versão, plugins, resolução de tela, idiomas e timezone.</p>
          <p class="text-gray-300">Para se proteger, use navegadores com proteção contra fingerprinting (como Tor Browser), evite instalar plugins desnecessários e utilize extensões como Canvas Blocker para dificultar a identificação única.</p>
        `
      },
      {
        question: "Como proteger meus dados em dispositivos móveis?",
        answer: `
          <p class="text-gray-300 mb-2">Para proteger dados em dispositivos móveis:</p>
          <ul class="list-disc list-inside text-gray-300 space-y-1 mb-2">
            <li>Revise permissões de apps regularmente</li>
            <li>Desative localização para apps que não precisam</li>
            <li>Use autenticação biométrica e senhas fortes</li>
            <li>Evite redes Wi-Fi públicas sem proteção</li>
            <li>Atualize regularmente o sistema operacional e apps</li>
          </ul>
          <p class="text-gray-300">Além disso, considere o uso de VPN em redes públicas e monitore apps com acesso a câmera, microfone e contatos.</p>
        `
      },
      {
        question: "O que são direitos de titular de dados e como exercê-los?",
        answer: `
          <p class="text-gray-300 mb-2">Os direitos de titular de dados, garantidos pela LGPD, incluem acesso, correção, exclusão e portabilidade de dados. Você pode exercê-los entrando em contato com o encarregado de dados da empresa ou usando formulários disponíveis nos sites.</p>
          <p class="text-gray-300">Se seus direitos forem negados, você pode registrar reclamações na ANPD (Agência Nacional de Proteção de Dados) ou buscar assistência jurídica.</p>
        `
      },
      {
        question: "É seguro usar armazenamento em nuvem?",
        answer: `
          <p class="text-gray-300 mb-2">O armazenamento em nuvem pode ser seguro se você tomar precauções adequadas:</p>
          <ul class="list-disc list-inside text-gray-300 space-y-1 mb-2">
            <li>Escolha provedores com criptografia de ponta a ponta</li>
            <li>Criptografe seus arquivos antes de fazer upload</li>
            <li>Use autenticação de dois fatores (2FA)</li>
            <li>Revise regularmente as permissões de acesso</li>
          </ul>
          <p class="text-gray-300">Evite armazenar informações sensíveis sem criptografia e considere soluções auto-hospedadas para maior controle.</p>
        `
      },
      {
        question: "Como posso monitorar minha identidade digital?",
        answer: `
          <p class="text-gray-300 mb-2">Você pode monitorar sua identidade digital pesquisando seu nome em motores de busca anônimos, configurando alertas para menções do seu nome e usando ferramentas de monitoramento de marca pessoal. Revise regularmente o que está publicamente disponível sobre você.</p>
          <p class="text-gray-300">Também é útil verificar periodicamente quais informações pessoais estão expostas em redes sociais e solicitar remoção de informações sensíveis quando possível.</p>
        `
      },
      {
        question: "Quais extensões de navegador são recomendadas para privacidade?",
        answer: `
          <p class="text-gray-300 mb-2">Extensões recomendadas para privacidade incluem:</p>
          <ul class="list-disc list-inside text-gray-300 space-y-1 mb-2">
            <li><strong>uBlock Origin:</strong> Bloqueador eficiente de anúncios e rastreadores</li>
            <li><strong>Privacy Badger:</strong> Bloqueia rastreadores invisíveis automaticamente</li>
            <li><strong>HTTPS Everywhere:</strong> Força conexões seguras (HTTPS)</li>
            <li><strong>Canvas Blocker:</strong> Previne fingerprinting por canvas</li>
          </ul>
          <p class="text-gray-300">Essas extensões ajudam a reduzir o rastreamento e proteger sua privacidade online.</p>
        `
      },
      {
        question: "Como posso proteger minhas contas de rastreamento e anúncios personalizados?",
        answer: `
          <p class="text-gray-300 mb-2">Para proteger suas contas de rastreamento e anúncios personalizados:</p>
          <ul class="list-disc list-inside text-gray-300 space-y-1 mb-2">
            <li>Desative a personalização de anúncios nas configurações de privacidade</li>
            <li>Limite o compartilhamento de dados com parceiros de anúncios</li>
            <li>Desative o uso de dados para fins de publicidade personalizada</li>
            <li>Use IDs de anúncio aleatórios ou reinicie-os periodicamente</li>
          </ul>
          <p class="text-gray-300">Essas configurações variam por plataforma, mas geralmente estão localizadas nas seções de privacidade e segurança das contas.</p>
        `
      }
    ];
    
    const externalReferences = [
      {
        name: "Lei Geral de Proteção de Dados (LGPD) - Brasil",
        url: "https://www.gov.br/mds/pt-br/lgpd"
      },
      {
        name: "General Data Protection Regulation (GDPR) - União Europeia",
        url: "https://gdpr-info.eu/"
      },
      {
        name: "Electronic Frontier Foundation - Privacidade Online",
        url: "https://www.eff.org/issues/privacy"
      },
      {
        name: "PrivacyTools.io - Recursos de Privacidade",
        url: "https://www.privacytools.io/"
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
            estimatedTime="35 min"
            difficultyLevel="Intermediário"
            author="Equipe de Privacidade Voltris"
            lastUpdated="2026-01-20"
            contentSections={contentSections}
            summaryTable={summaryTable}
            faqItems={faqItems}
            externalReferences={externalReferences}
            relatedGuides={relatedGuides}
        />
    );
}
