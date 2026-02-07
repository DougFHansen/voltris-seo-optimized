import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'autenticacao-dois-fatores',
  title: "Autenticação em Duas Etapas (2FA): O Guia Definitivo de Segurança (2026)",
  description: "Sua senha já vazou. Aprenda a blindar suas contas do Instagram, Steam, Google e Discord com 2FA. Descubra por que SMS é inseguro e quais apps usar.",
  category: 'seguranca',
  difficulty: 'Iniciante',
  time: '30 min'
};

const title = "Autenticação em Duas Etapas (2FA): O Guia Definitivo de Segurança (2026)";
const description = "Sua senha já vazou. Aprenda a blindar suas contas do Instagram, Steam, Google e Discord com 2FA. Descubra por que SMS é inseguro, quais apps usar (Authy vs Google vs Microsoft) e como não perder acesso se seu celular quebrar.";

const keywords = [
  'como ativar autenticação de dois fatores guia 2026',
  'melhores apps de 2fa google authenticator vs authy',
  'proteger conta instagram e facebook 2FA tutorial',
  'segurança steam guard mobile authenticator',
  'recuperar conta com 2FA perdido códigos de backup',
  'yubikey vale a pena brasil',
  'sim swap golpe sms 2fa perigo'
];

export const metadata: Metadata = createGuideMetadata('autenticacao-dois-fatores', title, description, keywords);

export default function TwoFactorGuide() {
  const summaryTable = [
    { label: "Nível de Segurança", value: "Crítico (Obrigatório)" },
    { label: "SMS", value: "Inseguro (Evite)" },
    { label: "Apps Recomendados", value: "Authy, Ente Auth, 2FAS" },
    { label: "Hardware (Pro)", value: "YubiKey (NFC/USB)" },
    { label: "Risco Principal", value: "Perder o celular sem backup" },
    { label: "Solução", value: "Códigos de Recuperação (Imprimir)" }
  ];

  const contentSections = [
    {
      title: "Por que sua Senha NÃO Protege Mais Nada?",
      content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Em 2026, bilhões de senhas vazam anualmente em "Data Breaches". Se você usa a mesma senha em dois lugares, hackers usam scripts automáticos ("Credential Stuffing") para testar seu email/senha em todos os serviços (PSN, Steam, Nubank).
          <br/><br/>
          A <strong>Autenticação de Dois Fatores (2FA)</strong> exige algo que você <em>SABE</em> (senha) e algo que você <em>TEM</em> (celular/chave). Mesmo que o hacker tenha sua senha, ele não entra sem o código.
        </p>
        
        <div class="bg-red-900/10 p-5 rounded-xl border border-red-500/20 mb-6">
          <h4 class="text-red-400 font-bold mb-2">⚠️ O Perigo do SMS (SIM Swap)</h4>
          <p class="text-sm text-gray-300">
            <strong>NUNCA use SMS como 2FA se puder evitar.</strong> Criminosos podem clonar seu chip (SIM Swap) ligando para a operadora e se passando por você. Com isso, eles recebem o SMS de recuperação de senha e roubam seu WhatsApp, Instagram e Banco em minutos. Use sempre <strong>Aplicativos Autenticadores</strong>.
          </p>
        </div>
      `
    },
    {
      title: "Os Melhores Apps de 2FA em 2026",
      content: `
        <p class="mb-4 text-gray-300">Esqueça o Google Authenticator antigo (ele não tinha backup na nuvem por anos, embora agora tenha, muitos migraram). Aqui estão as melhores opções modernas:</p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div class="bg-gray-800/50 p-4 rounded-lg border border-purple-500/30">
                <h5 class="font-bold text-white mb-2">Authy (Twilio)</h5>
                <p class="text-sm text-gray-300">
                    <strong>Prós:</strong> Sincroniza entre múltiplos dispositivos (PC, Tablet, Celular). Se você perder o celular, instala no novo e restaura tudo via senha mestre.
                    <br/><strong>Contras:</strong> Recentemente sofreu vazamento de números de telefone associados (não as chaves, mas os IDs).
                </p>
            </div>
            <div class="bg-gray-800/50 p-4 rounded-lg border border-emerald-500/30">
                <h5 class="font-bold text-white mb-2">2FAS (Open Source)</h5>
                <p class="text-sm text-gray-300">
                    <strong>Prós:</strong> A escolha dos especialistas em privacidade. Código aberto, backup via Google Drive/iCloud (criptografado), interface limpa, extensão de navegador que preenche automático.
                    <br/><strong>Veredito:</strong> O Melhor de 2026.
                </p>
            </div>
            <div class="bg-gray-800/50 p-4 rounded-lg border border-blue-500/30">
                <h5 class="font-bold text-white mb-2">Microsoft Authenticator</h5>
                <p class="text-sm text-gray-300">
                    <strong>Prós:</strong> Obrigatório para empresas e contas Outlook/Xbox. Oferece backup na nuvem e notificações "Push" (apertar Aprovar em vez de digitar código).
                </p>
            </div>
        </div>
      `
    },
    {
      title: "Tutorial Prático: Ativando nas Principais Contas",
      content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-pink-500 font-bold mb-1">Instagram / Facebook</h4>
                <ol class="list-decimal list-inside text-sm text-gray-400">
                    <li>Configurações > Central de Contas (Meta) > Senha e Segurança.</li>
                    <li>Autenticação de Dois Fatores.</li>
                    <li>Escolha "App de Autenticação" (NÃO escolha SMS).</li>
                    <li>Copie o código setup key ou escaneie o QR Code com o <strong>2FAS</strong>.</li>
                    <li><strong>Guarde os Códigos de Reserva (Backup Codes) em lugar seguro!</strong></li>
                </ol>
            </div>
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-indigo-400 font-bold mb-1">Discord</h4>
                <ol class="list-decimal list-inside text-sm text-gray-400">
                    <li>Engrenagem (Configurações) > Minha Conta.</li>
                    <li>Habilitar Autenticação em Duas Etapas.</li>
                    <li>Escaneie o QR Code.</li>
                    <li>Baixe os <code>discord_backup_codes.txt</code>.</li>
                </ol>
            </div>
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-blue-400 font-bold mb-1">Steam (Steam Guard)</h4>
                <p class="text-xs text-gray-400 mb-2">A Steam usa seu próprio app, não aceita Authy/Google Auth nativamente.</p>
                <ol class="list-decimal list-inside text-sm text-gray-400">
                    <li>Baixe o app Steam no celular.</li>
                    <li>Menu > Steam Guard > Adicionar Autenticador.</li>
                    <li>Anote o código de recuperação "Rxxxxx" (Começa com R).</li>
                    <li>Sem esse código R, recuperar a conta é um pesadelo com o suporte.</li>
                </ol>
            </div>
        </div>
      `
    }
  ];

  const advancedContentSections = [
    {
      title: "Nível Hacker: Chaves de Segurança Físicas (YubiKey)",
      content: `
        <h4 class="text-white font-bold mb-3">O que é uma Security Key?</h4>
        <p class="mb-4 text-gray-300">
          É um dispositivo USB que parece um pendrive. Para logar, você insere a chave e toca nela.
          <br/><strong>Vantagem Suprema:</strong> É <strong>imune a Phishing</strong>. Se você entrar num site falso <code>g0ogle.com</code> e tentar logar, a chave sabe que o domínio é errado e se recusa a autenticar. Apps de 2FA não te protegem disso (você digita o código no site falso e o hacker usa).
        </p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div class="bg-green-900/10 p-5 rounded-xl border border-green-500/20">
                <h5 class="text-green-400 font-bold mb-2">Google Titan / YubiKey 5</h5>
                <p class="text-sm text-gray-300">
                    As marcas líderes. Custam entre R$ 300 a R$ 600. Um investimento alto, mas garantem segurança nível NSA para sua conta Google, Cloudflare, Binance e Github.
                </p>
            </div>
            <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
                <h5 class="text-blue-400 font-bold mb-2">Passkeys (O Futuro)</h5>
                <p class="text-sm text-gray-300">
                   O Windows Hello e TouchID agora funcionam como chaves de segurança via padrão FIDO2. Sites modernos (Google, Amazon) permitem criar "Passkeys". Seu rosto/digital vira o 2FA. Extremamente seguro e prático.
                </p>
            </div>
        </div>
      `
    },
    {
      title: "Plano de Desastre: Perdi meu Celular, e agora?",
      content: `
        <p class="mb-4 text-gray-300 text-lg font-bold text-red-400">
            Se você perder o celular e não tiver backup, você perde a conta. O suporte do Google/Meta raramente devolve contas sem 2FA.
        </p>
        <h4 class="text-white font-bold mb-3">Protocolo de Segurança Voltris</h4>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 bg-[#0A0A0F] p-5 rounded-xl border border-gray-700">
            <li><strong>Imprima os Códigos de Backup:</strong> Todo serviço oferece "10 códigos de uso único" ao ativar o 2FA. Imprima ou salve num pendrive offline.</li>
            <li><strong>Ative 2FA em múltiplos dispositivos:</strong> O Authy e 2FAS permitem ter o app no Tablet ou PC antigo. Deixe um dispositivo reserva em casa logado.</li>
            <li><strong>Email de Recuperação:</strong> Garanta que seu email de recuperação tenha uma senha diferente do email principal.</li>
            <li><strong>Chave Física como Backup:</strong> Adicione uma YubiKey como método secundário, guardada no cofre.</li>
        </ol>
      `
    }
  ];

  const additionalContentSections = [
    {
      title: "Phishing de 2FA: O Golpe Novo",
      content: `
        <h4 class="text-white font-bold mb-3">Como Hackers contornam o 2FA?</h4>
        <p class="mb-4 text-gray-300">
            Eles criam telas de login falsas idênticas às originais.
            <br/>1. Você digita login e senha no site falso.
            <br/>2. O site falso pede o código 2FA.
            <br/>3. Você olha no app e digita.
            <br/>4. O site falso envia o código para o site real em tempo real.
            <br/>5. O hacker entra.
            <br/><br/>
            <strong>Defesa:</strong> Verifique SEMPRE a URL (endereço) do site antes de digitar o código 2FA. Se usar YubiKey/Passkey, esse golpe é impossível.
        </p>
      `
    }
  ];

  const faqItems = [
    {
      question: "Posso usar o mesmo app de 2FA para todas as contas?",
      answer: "Sim! Um único app (como 2FAS ou Authy) pode gerenciar códigos para Instagram, Google, Facebook, Amazon, Gov.br, etc. Centralizar é prático e seguro, desde que o acesso ao app seja protegido por biometria."
    },
    {
      question: "O que acontece se eu desinstalar o app de 2FA?",
      answer: "Você perde acesso aos códigos. Se não tiver ativado o backup na nuvem do app antes, perderá acesso às contas. Antes de formatar o celular, certifique-se de que o backup do Authy/2FAS está ativo e você sabe a senha do backup."
    },
    {
      question: "Recebi um código 2FA por SMS sem ter pedido. Fui hackeado?",
      answer: "Alguém tem sua senha e está tentando entrar. O 2FA te salvou! Mude sua senha imediatamente. Não aprove a solicitação de login."
    },
    {
      question: "O Gov.br exige 2FA?",
      answer: "Para níveis Prata e Ouro, é altamente recomendado. O Gov.br suporta apps padrão (OTP). Use para proteger seu CPF, Carteira de Trabalho e Imposto de Renda."
    }
  ];

  const externalReferences = [
    { name: "2FAS Authenticator (Site Oficial)", url: "https://2fas.com/" },
    { name: "Authy Download", url: "https://authy.com/download/" },
    { name: "YubiKey (Hardware Key)", url: "https://www.yubico.com/" },
    { name: "Teste de Força de Senha (Kaspersky)", url: "https://password.kaspersky.com/" },
    { name: "Have I Been Pwned? (Verificar Vazamentos)", url: "https://haveibeenpwned.com/" }
  ];

  const relatedGuides = [
    {
      href: "/guias/seguranca-senhas-gerenciadores",
      title: "Gerenciadores de Senha",
      description: "Bitwarden vs LastPass: Onde guardar suas senhas."
    },
    {
      href: "/guias/identificacao-phishing",
      title: "Identificar Golpes",
      description: "Como não cair em sites falsos que roubam 2FA."
    },
    {
      href: "/guias/recuperacao-dados-hd-corrompido",
      title: "Backups de Dados",
      description: "Proteja seus arquivos além das suas contas."
    }
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="30 min"
      difficultyLevel="Iniciante"
      author="Equipe de Segurança Voltris"
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