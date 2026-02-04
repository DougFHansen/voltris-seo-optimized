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
        <div class="bg-red-900/20 p-4 rounded-lg border-l-4 border-red-500 my-6">
          <p class="text-red-200 font-semibold">Estatísticas Impactantes:</p>
          <p class="text-gray-300 mt-2">De acordo com a Microsoft, contas com 2FA ativado têm <strong>99,9% menos chances de serem comprometidas</strong> em relação às contas com apenas senha. Isso demonstra a eficácia impressionante dessa camada extra de segurança.</p>
        </div>
        <p class="mb-4 text-gray-300 leading-relaxed">
          Com a proliferação de ataques cibernéticos e a crescente sofisticação dos hackers, a segurança tradicional baseada apenas em senhas tornou-se insuficiente. O 2FA funciona como uma barreira adicional, exigindo algo que você <em>sabe</em> (senha) e algo que você <em>possui</em> (dispositivo ou chave física).
        </p>
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20 mb-6">
          <h4 class="text-white font-bold mb-3 flex items-center">
            <span className="mr-2">⚠️</span> Riscos da Segurança Baseada Apenas em Senhas
          </h4>
          <ul class="text-sm text-gray-300 space-y-2">
            <li class="flex items-start">
              <span class="text-blue-400 mr-2">•</span>
              <span><strong>Vazamentos de dados:</strong> Milhões de senhas são expostas anualmente em brechas de segurança</span>
            </li>
            <li class="flex items-start">
              <span class="text-blue-400 mr-2">•</span>
              <span><strong>Ataques de força bruta:</strong> Ferramentas automatizadas testam milhares de combinações por segundo</span>
            </li>
            <li class="flex items-start">
              <span class="text-blue-400 mr-2">•</span>
              <span><strong>Reutilização de senhas:</strong> Usuários repetem a mesma senha em múltiplas contas</span>
            </li>
            <li class="flex items-start">
              <span class="text-blue-400 mr-2">•</span>
              <span><strong>Phishing:</strong> Sites falsos capturam credenciais legítimas dos usuários</span>
            </li>
          </ul>
        </div>
      `
    },
    {
      title: "1. Por que evitar o SMS em 2026?",
      content: `
        <p class="mb-4 text-gray-300">Evite códigos via mensagem de texto (SMS) sempre que possível:</p>
        <p class="text-sm text-gray-300">
            Hackers usam uma técnica chamada **SIM Swap** (clonagem de chip) para receber os seus códigos de SMS no celular deles. Em 2026, a forma mais segura de 2FA são os **Aplicativos Autenticadores** ou chaves físicas (YubiKey). Os apps geram os códigos localmente, sem depender da rede da operadora, tornando a invasão quase impossível via internet.
        </p>
        <div class="bg-yellow-900/20 p-4 rounded-lg border-l-4 border-yellow-500 my-6">
          <p class="text-yellow-200 font-semibold">SIM Swapping em 2026:</p>
          <p class="text-gray-300 mt-2">Este é um dos métodos mais utilizados por criminosos para contornar o 2FA baseado em SMS. Eles fingem ser você junto à operadora, alegando perda do chip ou necessidade de substituição, e redirecionam suas mensagens para um novo número sob seu controle.</p>
        </div>
        <h3 class="text-xl font-bold text-white mt-6 mb-4">Tipos de Ataques ao 2FA por SMS</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h4 class="font-bold text-blue-400 mb-2">SIM Swapping</h4>
            <p class="text-gray-300 text-sm">Clonagem do chip telefônico para interceptar códigos SMS</p>
          </div>
          <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h4 class="font-bold text-blue-400 mb-2">Roaming Fraud</h4>
            <p class="text-gray-300 text-sm">Explora vulnerabilidades em sistemas de roaming internacional</p>
          </div>
          <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h4 class="font-bold text-blue-400 mb-2">SS7 Attacks</h4>
            <p class="text-gray-300 text-sm">Explora falhas no sistema de sinalização entre operadoras</p>
          </div>
          <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h4 class="font-bold text-blue-400 mb-2">Social Engineering</h4>
            <p class="text-gray-300 text-sm">Manipulação psicológica para obter acesso ao número</p>
          </div>
        </div>
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20 mb-6">
          <h4 class="text-white font-bold mb-3 flex items-center">
            <span className="mr-2">💡</span> Alternativas Seguras ao SMS para 2FA
          </h4>
          <table class="min-w-full bg-gray-800/50 rounded-lg overflow-hidden">
            <thead class="bg-gray-700">
              <tr>
                <th class="py-2 px-4 text-left text-sm font-semibold text-gray-300">Método</th>
                <th class="py-2 px-4 text-left text-sm font-semibold text-gray-300">Nível de Segurança</th>
                <th class="py-2 px-4 text-left text-sm font-semibold text-gray-300">Vulnerabilidades</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-700">
              <tr>
                <td class="py-2 px-4 text-sm text-gray-300">SMS</td>
                <td class="py-2 px-4 text-sm text-gray-300">Baixo</td>
                <td class="py-2 px-4 text-sm text-gray-300">SIM Swapping, SS7, Intercepção</td>
              </tr>
              <tr>
                <td class="py-2 px-4 text-sm text-gray-300">Email</td>
                <td class="py-2 px-4 text-sm text-gray-300">Médio</td>
                <td class="py-2 px-4 text-sm text-gray-300">Conta comprometida, Recuperação de senha</td>
              </tr>
              <tr>
                <td class="py-2 px-4 text-sm text-gray-300">Aplicativo Autenticador</td>
                <td class="py-2 px-4 text-sm text-gray-300">Alto</td>
                <td class="py-2 px-4 text-sm text-gray-300">Perda do dispositivo, Malware</td>
              </tr>
              <tr>
                <td class="py-2 px-4 text-sm text-gray-300">Chave de Segurança Física</td>
                <td class="py-2 px-4 text-sm text-gray-300">Muito Alto</td>
                <td class="py-2 px-4 text-sm text-gray-300">Perda física, Falha no hardware</td>
              </tr>
            </tbody>
          </table>
        </div>
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
        <h3 class="text-xl font-bold text-white mt-6 mb-4">Configuração Detalhada por Plataforma</h3>
        <div class="space-y-6">
          <div class="border-l-4 border-green-500 pl-4 py-1">
            <h4 class="text-lg font-semibold text-white mb-2">Instagram & Facebook</h4>
            <ol class="list-decimal list-inside text-gray-300 space-y-1 text-sm">
              <li>Acesse Configurações > Segurança > Autenticação de dois fatores</li>
              <li>Escolha "Autenticador" em vez de "SMS"</li>
              <li>Escaneie o QR Code com seu app de autenticação</li>
              <li>Salve os códigos de backup em local seguro</li>
              <li>Teste o login com 2FA antes de sair</li>
            </ol>
          </div>
          <div class="border-l-4 border-purple-500 pl-4 py-1">
            <h4 class="text-lg font-semibold text-white mb-2">Google Accounts</h4>
            <ol class="list-decimal list-inside text-gray-300 space-y-1 text-sm">
              <li>Acesse myaccount.google.com > Segurança > Verificação em duas etapas</li>
              <li>Ative a verificação em duas etapas</li>
              <li>Adicione um método de autenticação (app autenticador)</li>
              <li>Configure backup codes e mantenha-os seguros</li>
              <li>Habilite a recuperação por telefone alternativo</li>
            </ol>
          </div>
          <div class="border-l-4 border-indigo-500 pl-4 py-1">
            <h4 class="text-lg font-semibold text-white mb-2">Discord</h4>
            <ol class="list-decimal list-inside text-gray-300 space-y-1 text-sm">
              <li>Acesse User Settings > My Account > Two-Factor Authentication</li>
              <li>Clique em "Enable Two-Factor Authentication"</li>
              <li>Escaneie o QR Code com seu app autenticador</li>
              <li>Guarde os códigos de recuperação</li>
              <li>Confirme a ativação com um código do app</li>
            </ol>
          </div>
          <div class="border-l-4 border-red-500 pl-4 py-1">
            <h4 class="text-lg font-semibold text-white mb-2">Twitter/X</h4>
            <ol class="list-decimal list-inside text-gray-300 space-y-1 text-sm">
              <li>Acesse Settings and privacy > Security and account access > Two-factor authentication</li>
              <li>Ative a autenticação em dois fatores</li>
              <li>Escolha "Authentication app" como método preferido</li>
              <li>Siga as instruções para escanear o QR Code</li>
              <li>Armazene os códigos de backup com segurança</li>
            </ol>
          </div>
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
        <div class="bg-red-900/20 p-4 rounded-lg border-l-4 border-red-500 my-6">
          <p class="text-red-200 font-semibold">Consequências de Não Ter Backup:</p>
          <p class="text-gray-300 mt-2">Sem códigos de backup ou métodos alternativos de recuperação, você pode perder permanentemente o acesso à sua conta. Isso é especialmente crítico para contas de trabalho, financeiras ou que contenham informações valiosas.</p>
        </div>
        <h3 class="text-xl font-bold text-white mt-6 mb-4">Estratégias de Backup e Recuperação</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h4 class="font-bold text-blue-400 mb-2">Códigos Físicos</h4>
            <p class="text-gray-300 text-sm">Impressos em papel ou gravados em metal para durabilidade</p>
          </div>
          <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h4 class="font-bold text-blue-400 mb-2">Armazenamento em Nuvem</h4>
            <p class="text-gray-300 text-sm">Sincronizado com serviços seguros como Authy ou Bitwarden</p>
          </div>
          <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h4 class="font-bold text-blue-400 mb-2">Chave de Recuperação</h4>
            <p class="text-gray-300 text-sm">Mantida em cofre ou com pessoa de confiança</p>
          </div>
        </div>
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20 mb-6">
          <h4 class="text-white font-bold mb-3 flex items-center">
            <span className="mr-2">📋</span> Checklist de Prevenção para Perda de Dispositivo
          </h4>
          <ul class="text-sm text-gray-300 space-y-2">
            <li class="flex items-start">
              <span class="text-blue-400 mr-2">✓</span>
              <span>Armazene códigos de backup em local físico seguro</span>
            </li>
            <li class="flex items-start">
              <span class="text-blue-400 mr-2">✓</span>
              <span>Configure autenticação em múltiplos dispositivos (Authy)</span>
            </li>
            <li class="flex items-start">
              <span class="text-blue-400 mr-2">✓</span>
              <span>Adicione métodos de recuperação alternativos (telefone secundário)</span>
            </li>
            <li class="flex items-start">
              <span class="text-blue-400 mr-2">✓</span>
              <span>Documente o processo de recuperação de cada serviço importante</span>
            </li>
            <li class="flex items-start">
              <span class="text-blue-400 mr-2">✓</span>
              <span>Revise regularmente seus métodos de segurança e backup</span>
            </li>
          </ul>
        </div>
      `
    },
    {
      title: "4. Tipos Avançados de 2FA e Tendências em 2026",
      content: `
        <p class="mb-4 text-gray-300">
          Além dos métodos tradicionais, novas formas de autenticação estão surgindo para aumentar ainda mais a segurança digital. Em 2026, espera-se que tecnologias mais avançadas sejam amplamente adotadas tanto por empresas quanto por indivíduos.
        </p>
        <h3 class="text-xl font-bold text-white mt-6 mb-4">Métodos de 2FA Mais Seguros</h3>
        <div class="space-y-4 mb-6">
          <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h4 class="font-bold text-blue-400 mb-2 flex items-center">
              <span class="mr-2">🔑</span> Chaves de Segurança Físicas (YubiKey)
            </h4>
            <p class="text-gray-300 text-sm mb-2">Dispositivos USB/Bluetooth que geram credenciais únicas para cada login. São praticamente invulneráveis a phishing remoto.</p>
            <ul class="text-sm text-gray-300 ml-5 space-y-1 list-disc">
              <li>Suporte para múltiplos protocolos (FIDO2, U2F, OTP)</li>
              <li>Nenhuma exposição de credenciais à internet</li>
              <li>Proteção contra ataques de engenharia social</li>
            </ul>
          </div>
          <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h4 class="font-bold text-blue-400 mb-2 flex items-center">
              <span class="mr-2">📱</span> Notificações Push Inteligentes
            </h4>
            <p class="text-gray-300 text-sm mb-2">Sistemas como o Microsoft Authenticator enviam alertas para aprovação, permitindo aceitar/recusar com um toque.</p>
            <ul class="text-sm text-gray-300 ml-5 space-y-1 list-disc">
              <li>Detecção de localização suspeita</li>
              <li>Análise de padrões de acesso</li>
              <li>Verificação biométrica integrada</li>
            </ul>
          </div>
          <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h4 class="font-bold text-blue-400 mb-2 flex items-center">
              <span class="mr-2">👁️</span> Autenticação Biométrica
            </h4>
            <p class="text-gray-300 text-sm mb-2">Integração de impressão digital, reconhecimento facial ou íris como segundo fator.</p>
            <ul class="text-sm text-gray-300 ml-5 space-y-1 list-disc">
              <li>Alta precisão e conveniência</li>
              <li>Difícil de replicar ou falsificar</li>
              <li>Requer hardware específico</li>
            </ul>
          </div>
        </div>
        <div class="bg-green-900/20 p-4 rounded-lg border-l-4 border-green-500 my-6">
          <p class="text-green-200 font-semibold">Tendências em 2026:</p>
          <p class="text-gray-300 mt-2">A autenticação baseada em comportamento (behavioral biometrics) e a autenticação contínua estão ganhando tração. Essas tecnologias monitoram padrões de digitação, movimento do mouse e hábitos de navegação para verificar continuamente a identidade do usuário.</p>
        </div>
      `
    },
    {
      title: "5. Aplicativos Autenticadores: Comparação Técnica",
      content: `
        <p class="mb-4 text-gray-300">
          Existem diversos aplicativos autenticadores disponíveis, cada um com características específicas. A escolha do aplicativo certo pode afetar significativamente sua experiência de segurança e conveniência.
        </p>
        <h3 class="text-xl font-bold text-white mt-6 mb-4">Comparação de Aplicativos Autenticadores</h3>
        <div class="overflow-x-auto mb-6">
          <table class="min-w-full bg-gray-800/50 rounded-lg overflow-hidden">
            <thead class="bg-gray-700">
              <tr>
                <th class="py-2 px-4 text-left text-sm font-semibold text-gray-300">Característica</th>
                <th class="py-2 px-4 text-left text-sm font-semibold text-gray-300">Authy</th>
                <th class="py-2 px-4 text-left text-sm font-semibold text-gray-300">Aegis</th>
                <th class="py-2 px-4 text-left text-sm font-semibold text-gray-300">Microsoft Authenticator</th>
                <th class="py-2 px-4 text-left text-sm font-semibold text-gray-300">Google Authenticator</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-700">
              <tr>
                <td class="py-2 px-4 text-sm text-gray-300 font-medium">Sincronização entre dispositivos</td>
                <td class="py-2 px-4 text-sm text-green-400">Sim (com senha)</td>
                <td class="py-2 px-4 text-sm text-green-400">Sim (criptografada)</td>
                <td class="py-2 px-4 text-sm text-green-400">Sim</td>
                <td class="py-2 px-4 text-sm text-red-400">Não</td>
              </tr>
              <tr>
                <td class="py-2 px-4 text-sm text-gray-300 font-medium">Código-fonte aberto</td>
                <td class="py-2 px-4 text-sm text-red-400">Não</td>
                <td class="py-2 px-4 text-sm text-green-400">Sim</td>
                <td class="py-2 px-4 text-sm text-red-400">Não</td>
                <td class="py-2 px-4 text-sm text-red-400">Não</td>
              </tr>
              <tr>
                <td class="py-2 px-4 text-sm text-gray-300 font-medium">Suporte a biometria</td>
                <td class="py-2 px-4 text-sm text-green-400">Sim</td>
                <td class="py-2 px-4 text-sm text-green-400">Sim</td>
                <td class="py-2 px-4 text-sm text-green-400">Sim</td>
                <td class="py-2 px-4 text-sm text-red-400">Não</td>
              </tr>
              <tr>
                <td class="py-2 px-4 text-sm text-gray-300 font-medium">Recuperação de contas</td>
                <td class="py-2 px-4 text-sm text-green-400">Sim</td>
                <td class="py-2 px-4 text-sm text-green-400">Sim (manual)</td>
                <td class="py-2 px-4 text-sm text-green-400">Sim</td>
                <td class="py-2 px-4 text-sm text-red-400">Não</td>
              </tr>
              <tr>
                <td class="py-2 px-4 text-sm text-gray-300 font-medium">Interface amigável</td>
                <td class="py-2 px-4 text-sm text-green-400">Excelente</td>
                <td class="py-2 px-4 text-sm text-yellow-400">Boa</td>
                <td class="py-2 px-4 text-sm text-green-400">Excelente</td>
                <td class="py-2 px-4 text-sm text-yellow-400">Básica</td>
              </tr>
              <tr>
                <td class="py-2 px-4 text-sm text-gray-300 font-medium">Segurança geral</td>
                <td class="py-2 px-4 text-sm text-green-400">Muito Alta</td>
                <td class="py-2 px-4 text-sm text-green-400">Muito Alta</td>
                <td class="py-2 px-4 text-sm text-green-400">Alta</td>
                <td class="py-2 px-4 text-sm text-yellow-400">Média</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20 mb-6">
          <h4 class="text-white font-bold mb-3 flex items-center">
            <span className="mr-2">💡</span> Recomendações por Tipo de Usuário
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
              <h5 class="font-bold text-white mb-2">Usuários Comuns</h5>
              <p class="text-gray-300 text-sm">Microsoft Authenticator ou Google Authenticator oferecem simplicidade e confiabilidade para uso diário.</p>
            </div>
            <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
              <h5 class="font-bold text-white mb-2">Usuários Avançados</h5>
              <p class="text-gray-300 text-sm">Aegis (Android) ou Authy (multi-plataforma) oferecem mais recursos e segurança para usuários exigentes.</p>
            </div>
          </div>
        </div>
      `
    },
    {
      title: "6. Segurança Corporativa e 2FA Empresarial",
      content: `
        <p class="mb-4 text-gray-300">
          A implementação de 2FA em ambientes corporativos requer considerações especiais, incluindo conformidade regulatória, gerenciamento em larga escala e integração com infraestrutura existente.
        </p>
        <h3 class="text-xl font-bold text-white mt-6 mb-4">Implementação de 2FA em Ambientes Corporativos</h3>
        <div class="space-y-4 mb-6">
          <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h4 class="font-bold text-blue-400 mb-2 flex items-center">
              <span class="mr-2">🏢</span> Integração com Active Directory
            </h4>
            <p class="text-gray-300 text-sm mb-2">O 2FA pode ser integrado ao Active Directory para proteger logins corporativos. Soluções como Azure MFA fornecem essa funcionalidade com políticas centralizadas.</p>
            <ul class="text-sm text-gray-300 ml-5 space-y-1 list-disc">
              <li>Políticas de acesso baseadas em grupo</li>
              <li>Exigência de 2FA para acessos remotos</li>
              <li>Registros detalhados de tentativas de login</li>
            </ul>
          </div>
          <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h4 class="font-bold text-blue-400 mb-2 flex items-center">
              <span class="mr-2">🔐</span> VPN e Acesso Remoto
            </h4>
            <p class="text-gray-300 text-sm mb-2">O 2FA é essencial para conexões VPN, garantindo que apenas funcionários autorizados possam acessar redes internas remotamente.</p>
            <ul class="text-sm text-gray-300 ml-5 space-y-1 list-disc">
              <li>Autenticação em dois fatores para gateways VPN</li>
              <li>Políticas de acesso condicional</li>
              <li>Monitoramento de tentativas de acesso não autorizadas</li>
            </ul>
          </div>
          <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h4 class="font-bold text-blue-400 mb-2 flex items-center">
              <span class="mr-2">📊</span> Conformidade e Auditoria
            </h4>
            <p class="text-gray-300 text-sm mb-2">O 2FA ajuda a cumprir requisitos regulatórios como SOX, HIPAA e PCI DSS, além de fornecer logs detalhados para auditorias.</p>
            <ul class="text-sm text-gray-300 ml-5 space-y-1 list-disc">
              <li>Relatórios de conformidade automáticos</li>
              <li>Rastreamento de acesso detalhado</li>
              <li>Políticas de revogação de acesso</li>
            </ul>
          </div>
        </div>
        <div class="bg-yellow-900/20 p-4 rounded-lg border-l-4 border-yellow-500 my-6">
          <p class="text-yellow-200 font-semibold">Considerações de Implementação:</p>
          <p class="text-gray-300 mt-2">Ao implementar 2FA corporativo, é importante planejar a transição gradual, treinar colaboradores e ter um plano de contingência para recuperação de contas. A resistência inicial é comum, mas a segurança adicional compensa amplamente o esforço de adaptação.</p>
        </div>
      `
    },
    {
      title: "7. Mitos e Verdades sobre o 2FA",
      content: `
        <p class="mb-4 text-gray-300">
          Existem muitos mitos e conceitos errados sobre a autenticação de dois fatores. Separar o que é verdade do que é mito é essencial para uma implementação eficaz e segura.
        </p>
        <h3 class="text-xl font-bold text-white mt-6 mb-4">Mitos Comuns sobre o 2FA</h3>
        <div class="space-y-4 mb-6">
          <div class="border-l-4 border-red-500 pl-4 py-2 bg-red-900/10 rounded-r-lg">
            <h4 class="font-bold text-red-400 mb-2">Mito: O 2FA é 100% seguro</h4>
            <p class="text-gray-300 text-sm">Verdade: Embora extremamente eficaz, o 2FA pode ser contornado por técnicas avançadas como phishing sofisticado, malware ou ataques SIM Swapping.</p>
          </div>
          <div class="border-l-4 border-green-500 pl-4 py-2 bg-green-900/10 rounded-r-lg">
            <h4 class="font-bold text-green-400 mb-2">Verdade: O 2FA reduz drasticamente o risco de comprometimento de contas</h4>
            <p class="text-gray-300 text-sm">Comprovação: Estudos mostram que o 2FA bloqueia cerca de 99,9% dos ataques automatizados, tornando-o uma medida de segurança altamente eficaz.</p>
          </div>
          <div class="border-l-4 border-red-500 pl-4 py-2 bg-red-900/10 rounded-r-lg">
            <h4 class="font-bold text-red-400 mb-2">Mito: O 2FA é muito complicado para usuários comuns</h4>
            <p class="text-gray-300 text-sm">Verdade: Com aplicativos intuitivos e processos simplificados, o 2FA é acessível para maioria dos usuários após uma breve curva de aprendizado.</p>
          </div>
          <div class="border-l-4 border-green-500 pl-4 py-2 bg-green-900/10 rounded-r-lg">
            <h4 class="font-bold text-green-400 mb-2">Verdade: O 2FA pode ser configurado com backup e recuperação adequados</h4>
            <p class="text-gray-300 text-sm">Planejamento: Com códigos de backup, sincronização entre dispositivos e métodos alternativos, o 2FA pode ser robusto sem sacrificar a acessibilidade.</p>
          </div>
          <div class="border-l-4 border-red-500 pl-4 py-2 bg-red-900/10 rounded-r-lg">
            <h4 class="font-bold text-red-400 mb-2">Mito: O 2FA só é necessário para contas sensíveis</h4>
            <p class="text-gray-300 text-sm">Realidade: Qualquer conta pode ser alvo de ataque, e o 2FA protege informações pessoais, comunicações e identidade digital em geral.</p>
          </div>
        </div>
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20 mb-6">
          <h4 class="text-white font-bold mb-3 flex items-center">
            <span className="mr-2">⚠️</span> Armadilhas Comuns na Implementação do 2FA
          </h4>
          <ul class="text-sm text-gray-300 space-y-2">
            <li class="flex items-start">
              <span class="text-blue-400 mr-2">•</span>
              <span>Depender exclusivamente de SMS como segundo fator</span>
            </li>
            <li class="flex items-start">
              <span class="text-blue-400 mr-2">•</span>
              <span>Não armazenar códigos de backup em local seguro</span>
            </li>
            <li class="flex items-start">
              <span class="text-blue-400 mr-2">•</span>
              <span>Usar o mesmo dispositivo para ambos os fatores</span>
            </li>
            <li class="flex items-start">
              <span class="text-blue-400 mr-2">•</span>
              <span>Não revisar regularmente os dispositivos conectados</span>
            </li>
            <li class="flex items-start">
              <span class="text-blue-400 mr-2">•</span>
              <span>Ignorar atualizações de segurança dos aplicativos autenticadores</span>
            </li>
          </ul>
        </div>
      `
    },
    {
      title: "8. Segurança em Viagens e Ambientes Inseguros",
      content: `
        <p class="mb-4 text-gray-300">
          Viajar ou utilizar redes públicas apresenta riscos adicionais para contas protegidas com 2FA. É importante adotar precauções específicas nessas situações para manter a segurança.
        </p>
        <h3 class="text-xl font-bold text-white mt-6 mb-4">Proteção durante Viagens Internacionais</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h4 class="font-bold text-blue-400 mb-2">Antes da Viagem</h4>
            <ul class="text-sm text-gray-300 space-y-1 list-disc pl-5">
              <li>Verifique se seu app autenticador funciona offline</li>
              <li>Armazene cópias de códigos de backup em locais seguros</li>
              <li>Configure métodos alternativos de recuperação</li>
              <li>Atualize aplicativos e sistemas antes de viajar</li>
            </ul>
          </div>
          <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h4 class="font-bold text-blue-400 mb-2">Durante a Viagem</h4>
            <ul class="text-sm text-gray-300 space-y-1 list-disc pl-5">
              <li>Evite redes Wi-Fi públicas para acessos sensíveis</li>
              <li>Use VPN confiável para criptografar conexões</li>
              <li>Monitore atividades de conta incomuns</li>
              <li>Mantenha seu dispositivo fisicamente seguro</li>
            </ul>
          </div>
        </div>
        <h3 class="text-xl font-bold text-white mt-6 mb-4">Riscos em Ambientes Públicos</h3>
        <div class="space-y-4 mb-6">
          <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h4 class="font-bold text-blue-400 mb-2 flex items-center">
              <span class="mr-2">🔓</span> Redes Wi-Fi Públicas
            </h4>
            <p class="text-gray-300 text-sm mb-2">Redes públicas podem ser manipuladas por atacantes para interceptar tráfego, embora o 2FA adicione proteção, ainda há riscos de phishing ou malware.</p>
            <ul class="text-sm text-gray-300 ml-5 space-y-1 list-disc">
              <li>Evite acessar contas sensíveis em redes públicas</li>
              <li>Utilize sempre conexão VPN criptografada</li>
              <li>Verifique certificados SSL/TLS antes de inserir credenciais</li>
            </ul>
          </div>
          <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h4 class="font-bold text-blue-400 mb-2 flex items-center">
              <span class="mr-2">💻</span> Computadores Públicos
            </h4>
            <p class="text-gray-300 text-sm mb-2">Nunca faça login em contas importantes em computadores públicos, mesmo com 2FA, pois keyloggers e malware podem capturar credenciais.</p>
            <ul class="text-sm text-gray-300 ml-5 space-y-1 list-disc">
              <li>Evite computadores compartilhados para acessos sensíveis</li>
              <li>Se necessário, use apenas para recuperação de conta</li>
              <li>Limpe cookies e histórico após uso</li>
            </ul>
          </div>
        </div>
        <div class="bg-yellow-900/20 p-4 rounded-lg border-l-4 border-yellow-500 my-6">
          <p class="text-yellow-200 font-semibold">Dicas para Ambientes de Risco:</p>
          <p class="text-gray-300 mt-2">Considere usar um dispositivo secundário dedicado para viagens, com aplicativos autenticadores separados e limitados. Isso isola seu dispositivo principal de potenciais ameaças enquanto viaja.</p>
        </div>
      `
    }
  ];

  const faqItems = [
    {
      question: "O que é autenticação de dois fatores (2FA)?",
      answer: `
        <p class="text-gray-300 mb-2">A autenticação de dois fatores (2FA) é um método de segurança que exige duas formas diferentes de verificação antes de conceder acesso a uma conta. Normalmente, isso combina algo que você sabe (senha) com algo que você tem (dispositivo ou chave física).</p>
        <p class="text-gray-300">O 2FA adiciona uma camada crítica de proteção, tornando muito mais difícil para invasores acessarem sua conta, mesmo que tenham sua senha.</p>
      `
    },
    {
      question: "Por que o SMS não é recomendado para 2FA?",
      answer: `
        <p class="text-gray-300 mb-2">O SMS é vulnerável a ataques como SIM Swapping, onde criminosos clonam seu chip telefônico e recebem seus códigos de autenticação. Hackers também podem explorar falhas em sistemas de sinalização entre operadoras (SS7) para interceptar mensagens.</p>
        <p class="text-gray-300">Em 2026, as alternativas mais seguras incluem aplicativos autenticadores (como Authy ou Aegis) e chaves de segurança físicas (como YubiKey).</p>
      `
    },
    {
      question: "Quais são os melhores aplicativos autenticadores?",
      answer: `
        <p class="text-gray-300 mb-2">Os principais aplicativos autenticadores em 2026 incluem:</p>
        <ul class="list-disc list-inside text-gray-300 space-y-1 mb-2">
          <li><strong>Authy:</strong> Sincronização entre dispositivos com criptografia</li>
          <li><strong>Aegis:</strong> Código-fonte aberto e focado em privacidade (Android)</li>
          <li><strong>Microsoft Authenticator:</strong> Integração com contas Microsoft e suporte a notificações push</li>
          <li><strong>Google Authenticator:</strong> Simples e confiável, mas sem sincronização entre dispositivos</li>
        </ul>
        <p class="text-gray-300">A escolha depende de suas necessidades de segurança, plataforma e recursos desejados.</p>
      `
    },
    {
      question: "Como faço para recuperar minha conta se perder meu dispositivo com 2FA?",
      answer: `
        <p class="text-gray-300 mb-2">É crucial salvar os códigos de backup fornecidos ao configurar o 2FA. Esses códigos permitem o acesso à sua conta caso você perca seu dispositivo principal.</p>
        <p class="text-gray-300">Além disso, configure métodos alternativos de recuperação, como um número de telefone secundário ou email de recuperação. Alguns aplicativos como Authy oferecem sincronização entre dispositivos, facilitando a transição.</p>
      `
    },
    {
      question: "O 2FA é realmente eficaz contra hackers?",
      answer: `
        <p class="text-gray-300 mb-2">Sim, o 2FA é extremamente eficaz. Segundo a Microsoft, contas com 2FA ativado têm 99,9% menos chances de serem comprometidas em relação a contas com apenas senha.</p>
        <p class="text-gray-300">Embora não seja 100% à prova de invasão, o 2FA bloqueia a maioria dos ataques automatizados e força atacantes a métodos mais sofisticados e demorados.</p>
      `
    },
    {
      question: "Chaves de segurança físicas são mais seguras que aplicativos?",
      answer: `
        <p class="text-gray-300 mb-2">Sim, chaves de segurança físicas (como YubiKey) oferecem o mais alto nível de segurança para 2FA. Elas são imunes a phishing remoto e não dependem de redes ou sistemas operacionais.</p>
        <p class="text-gray-300">No entanto, exigem hardware adicional e podem ser perdidas. São ideais para contas altamente sensíveis e usuários avançados.</p>
      `
    },
    {
      question: "Posso usar o mesmo aplicativo autenticador para várias contas?",
      answer: `
        <p class="text-gray-300 mb-2">Sim, aplicativos autenticadores modernos suportam múltiplas contas. Você simplesmente adiciona cada serviço escaneando um QRCode ou inserindo manualmente uma chave secreta.</p>
        <p class="text-gray-300">Essa é uma prática recomendada, pois permite gerenciar todas as autenticações em um único lugar, desde que você mantenha o dispositivo seguro.</p>
      `
    },
    {
      question: "O 2FA pode ser contornado por phishing?",
      answer: `
        <p class="text-gray-300 mb-2">Aplicativos autenticadores tradicionais (TOTP) podem ser contornados por phishing sofisticado, onde sites falsos coletam tanto a senha quanto o código do 2FA em tempo real.</p>
        <p class="text-gray-300">No entanto, chaves de segurança físicas (FIDO2/U2F) são imunes a esse tipo de ataque, pois estão associadas ao domínio do site legítimo e não funcionam com imitações.</p>
      `
    },
    {
      question: "Como o 2FA afeta a produtividade no ambiente de trabalho?",
      answer: `
        <p class="text-gray-300 mb-2">Inicialmente, o 2FA pode parecer um obstáculo à produtividade, mas na prática, os benefícios de segurança superam amplamente o pequeno tempo adicional de autenticação.</p>
        <p class="text-gray-300">Com integrações adequadas ao Active Directory e políticas bem definidas, o 2FA pode ser transparente para usuários finais e ainda assim fornecer proteção corporativa robusta.</p>
      `
    },
    {
      question: "Existe algum custo para implementar 2FA?",
      answer: `
        <p class="text-gray-300 mb-2">A maioria dos aplicativos autenticadores é gratuita para uso pessoal. Chaves de segurança físicas têm custo (de R$ 100 a R$ 400), mas são um investimento único com segurança superior.</p>
        <p class="text-gray-300">Para empresas, existem soluções pagas com gerenciamento centralizado, mas o custo é geralmente baixo em comparação com os riscos mitigados.</p>
      `
    },
    {
      question: "O 2FA é obrigatório por lei em algum lugar?",
      answer: `
        <p class="text-gray-300 mb-2">Sim, em certos setores e jurisdições, o 2FA ou controles de acesso semelhantes são exigidos por regulamentações como GDPR (UE), HIPAA (saúde nos EUA) e PCI DSS (pagamentos).</p>
        <p class="text-gray-300">Empresas que lidam com dados sensíveis devem implementar medidas de autenticação multifatorial como parte de sua conformidade regulatória.</p>
      `
    },
    {
      question: "O que é autenticação multifatorial (MFA) e como difere do 2FA?",
      answer: `
        <p class="text-gray-300 mb-2">A autenticação multifatorial (MFA) é um termo mais amplo que inclui qualquer sistema que exija múltiplas formas de verificação. O 2FA é um tipo específico de MFA que exige exatamente dois fatores.</p>
        <p class="text-gray-300">Enquanto o 2FA é comumente usado de forma intercambiável com MFA, o MFA pode incluir três ou mais fatores de autenticação para níveis ainda maiores de segurança.</p>
      `
    }
  ];
  
  const externalReferences = [
    {
      name: "NIST - Guia de Autenticação Multifatorial",
      url: "https://csrc.nist.gov/publications/detail/sp/800-63b/final"
    },
    {
      name: "FIDO Alliance - Padrões de Autenticação Sem Senha",
      url: "https://fidoalliance.org/"
    },
    {
      name: "OWASP - Melhores Práticas de Autenticação",
      url: "https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html"
    },
    {
      name: "Microsoft - Estatísticas sobre Efetividade do 2FA",
      url: "https://www.microsoft.com/en-us/security/blog/2021/08/12/every-second-counts-why-immediate-protection-matters/"
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
      estimatedTime="25 min"
      difficultyLevel="Intermediário"
      author="Equipe de Segurança Voltris"
      lastUpdated="2026-01-20"
      contentSections={contentSections}
      summaryTable={summaryTable}
      faqItems={faqItems}
      externalReferences={externalReferences}
      relatedGuides={relatedGuides}
    />
  );
}