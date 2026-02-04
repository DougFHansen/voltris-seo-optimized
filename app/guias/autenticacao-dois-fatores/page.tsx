import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Autenticação de Dois Fatores (2FA): O Guia Definitivo (2026)";
const description = "Sua senha não é mais suficiente! Aprenda como usar o 2FA para proteger suas contas do Insta, Google e Discord contra hackers em 2026.";
const keywords = [
  'como ativar autenticação de dois fatores guia 2026',
  'melhores apps de 2fa google authenticator vs authy',
  'proteger conta instagram e facebook 2FA tutorial',
  'por que usar autenticação em duas etapas guia 2026',
  'recuperar conta com 2FA ativado tutorial completo'
];

export const metadata: Metadata = createGuideMetadata('autenticacao-dois-fatores', title, description, keywords);

export default function TwoFactorGuide() {
  const summaryTable = [
    { label: "O que é", value: "Uma segunda chave além da senha" },
    { label: "Canais", value: "Apps (Melhor), SMS (Inseguro), E-mail (Médio)" },
    { label: "Apps Sugeridos", value: "Authy / Aegis / Microsoft Authenticator" },
    { label: "Dificuldade", value: "Fácil" }
  ];

  const contentSections = [
    {
      title: "Senha sozinha é perigoso",
      content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Em 2026, com o aumento massivo de vazamentos de dados, as chances da sua senha principal já estar em alguma lista de criminosos é alta. A **Autenticação de Dois Fatores (2FA)** adiciona uma camada extra: mesmo que o hacker tenha a sua senha, ele não conseguirá entrar porque não possui o seu celular físico para ver o código que muda a cada 30 segundos.
        </p>
      `
    },
    {
      title: "1. Por que evitar o SMS em 2026?",
      content: `
        <p class="mb-4 text-gray-300">Evite códigos via mensagem de texto (SMS) sempre que possível:</p>
        <p class="text-sm text-gray-300">
            Hackers usam uma técnica chamada **SIM Swap** (clonagem de chip) para receber os seus códigos de SMS no celular deles. Em 2026, a forma mais segura de 2FA são os **Aplicativos Autenticadores** ou chaves físicas (YubiKey). Os apps geram os códigos localmente, sem depender da rede da operadora, tornando a invasão quase impossível via internet.
        </p>
      `
    },
    {
      title: "2. Como configurar o 2FA nas Redes Sociais",
      content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Checklist de Proteção:</h4>
            <p class="text-sm text-gray-300">
                - <strong>Instagram/Facebook:</strong> Vá em Central de Contas > Senha e Segurança > Autenticação de dois fatores. <br/>
                - <strong>Google:</strong> Acesse 'Segurança' na sua conta e ative a Verificação em duas etapas. <br/>
                - <strong>WhatsApp:</strong> Ative a 'Confirmação em duas etapas' nas configurações de conta. <br/><br/>
                Sempre escolha a opção 'App de Autenticação' em vez de SMS.
            </p>
        </div>
      `
    },
    {
      title: "3. O Erro Fatal: Perder o celular com 2FA",
      content: `
        <p class="mb-4 text-gray-300">
            <strong>Backup é Vital:</strong> 
            <br/><br/>Se você formatar seu celular ou perdê-lo e não tiver os **Códigos de Reserva**, você pode ficar trancado fora da sua própria conta para sempre. Ao ativar o 2FA, o site mostrará uma lista de códigos (Backup Codes). **Salve-os em um papel físico ou em um local seguro fora do celular.** Aplicativos como o <i>Authy</i> ou <i>Microsoft Authenticator</i> permitem backup na nuvem, o que facilita a vida se você trocar de dispositivo.
        </p>
      `
    }
  ];

  const relatedGuides = [
    {
      href: "/guias/seguranca-senhas-gerenciadores",
      title: "Gerenciar Senhas",
      description: "A primeira camada de proteção."
    },
    {
      href: "/guias/identificacao-phishing",
      title: "Cuidado com Golpes",
      description: "Como hackers tentam burlar o seu 2FA."
    },
    {
      href: "/guias/protecao-dados-privacidade",
      title: "Privacidade Digital",
      description: "Mais dicas para se proteger online em 2026."
    }
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="15 min"
      difficultyLevel="Iniciante"
      contentSections={contentSections}
      summaryTable={summaryTable}
      relatedGuides={relatedGuides}
    />
  );
}