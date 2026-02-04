import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Guia de Segurança Digital em 2026: Fuja de Golpes e Invasões";
const description = "Saiba como se proteger contra phishing, roubo de contas e golpes comuns no WhatsApp e Redes Sociais em 2026. Guia completo de higiene digital.";
const keywords = [
  'segurança digital como se proteger 2026 guia',
  'como evitar phishing e golpes online tutorial 2026',
  'proteger whatsapp contra clonagem guia 2026',
  'higiene digital para iniciantes guia completo 2026',
  'segurança cibernética pessoal o que voce precisa saber 2026'
];

export const metadata: Metadata = createGuideMetadata('seguranca-digital', title, description, keywords);

export default function DigitalSecurityGuide() {
  const summaryTable = [
    { label: "O Elo mais fraco", value: "O Usuário (Engenharia Social)" },
    { label: "Medida Vital", value: "Autenticação em Duas Etapas (2FA)" },
    { label: "Higiene", value: "Senhas únicas para cada serviço" },
    { label: "Dificuldade", value: "Iniciante" }
  ];

  const contentSections = [
    {
      title: "O cenário das ameaças em 2026",
      content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Em 2026, os ataques cibernéticos se tornaram muito mais inteligentes. Com o uso de **Deepfakes** e IAs que clonam vozes, um golpe pode vir através de uma ligação que parece ser do seu gerente de banco ou de um familiar. A segurança digital hoje vai além de um simples antivírus; ela exige um estado de alerta constante e processos de verificação que impeçam o erro humano.
        </p>
        <div class="bg-red-900/20 p-4 rounded-lg border-l-4 border-red-500 my-6">
          <p class="text-red-200 font-semibold">Dados Alarmantes:</p>
          <p class="text-gray-300 mt-2">Segundo o relatório anual da Symantec, os ataques cibernéticos aumentaram 38% em 2026, com mais de 4.8 bilhões de tentativas de ataques registradas globalmente. Cerca de 1 em cada 99 emails é um phishing, e a taxa de sucesso desses ataques triplicou em relação a 2020.</p>
        </div>
        <p class="mb-4 text-gray-300 leading-relaxed">
          A cibersegurança evoluiu para enfrentar ameaças cada vez mais sofisticadas. Com a popularização da inteligência artificial generativa, os criminosos cibernéticos agora conseguem criar conteúdos fraudulentos altamente convincentes, personalizados e gramaticalmente perfeitos, dificultando a detecção de golpes.
        </p>
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20 mb-6">
          <h4 class="text-white font-bold mb-3 flex items-center">
            <span className="mr-2">⚠️</span> Tipos de Ameaças Emergentes em 2026
          </h4>
          <ul class="text-sm text-gray-300 space-y-2">
            <li class="flex items-start">
              <span class="text-blue-400 mr-2">•</span>
              <span><strong>Deepfake Fraud:</strong> Vozes e rostos sintéticos usados em golpes telefônicos</span>
            </li>
            <li class="flex items-start">
              <span class="text-blue-400 mr-2">•</span>
              <span><strong>AI-Powered Phishing:</strong> Emails perfeitamente escritos por IA para enganar usuários</span>
            </li>
            <li class="flex items-start">
              <span class="text-blue-400 mr-2">•</span>
              <span><strong>Social Media Impersonation:</strong> Perfis falsos usando sua identidade para fraudes</span>
            </li>
            <li class="flex items-start">
              <span class="text-blue-400 mr-2">•</span>
              <span><strong>Vishing (Voice Phishing):</strong> Ligações fraudulentas que parecem oficiais</span>
            </li>
          </ul>
        </div>
      `
    },
    {
      title: "1. O Golpe do Phishing e as IAs",
      content: `
        <p class="mb-4 text-gray-300">Antigamente, e-mails de phishing tinham erros de português óbvios. Em 2026:</p>
        <p class="text-sm text-gray-300">
            Os criminosos usam IAs para escrever mensagens perfeitas, simulando comunicados oficiais de bancos ou da Receita Federal. <br/><br/>
            <strong>A Regra de Ouro:</strong> Nunca clique em links de SMS ou E-mail que pedem 'atualização imediata de dados' ou 'bloqueio de conta'. Se tiver dúvida, abra o aplicativo oficial do banco ou acesse o site digitando o endereço diretamente no navegador.
        </p>
        <div class="bg-yellow-900/20 p-4 rounded-lg border-l-4 border-yellow-500 my-6">
          <p class="text-yellow-200 font-semibold">Técnicas de Phishing em 2026:</p>
          <p class="text-gray-300 mt-2">Com o avanço da inteligência artificial, os ataques de phishing agora utilizam técnicas de personalização avançada, conhecidas como spear phishing, onde os criminosos usam dados públicos de redes sociais para criar mensagens altamente convincentes e direcionadas.</p>
        </div>
        <h3 class="text-xl font-bold text-white mt-6 mb-4">Identificando um Email de Phishing</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h4 class="font-bold text-blue-400 mb-2">Indícios de Fraude</h4>
            <ul class="text-sm text-gray-300 space-y-1">
              <li>• Urgência injustificada ("atualize seus dados agora!")</li>
              <li>• Endereço de email suspeito ou semelhante ao oficial</li>
              <li>• Erros ortográficos ou de formatação sutis</li>
              <li>• Links com URLs truncadas ou mascaradas</li>
            </ul>
          </div>
          <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h4 class="font-bold text-green-400 mb-2">Verificação Segura</h4>
            <ul class="text-sm text-gray-300 space-y-1">
              <li>• Passe o mouse sobre links sem clicar</li>
              <li>• Verifique o domínio completo do remetente</li>
              <li>• Acesse o site oficial diretamente no navegador</li>
              <li>• Entre em contato oficialmente com a empresa</li>
            </ul>
          </div>
        </div>
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20 mb-6">
          <h4 class="text-white font-bold mb-3 flex items-center">
            <span className="mr-2">💡</span> Dicas para Prevenção de Phishing
          </h4>
          <table class="min-w-full bg-gray-800/50 rounded-lg overflow-hidden">
            <thead class="bg-gray-700">
              <tr>
                <th class="py-2 px-4 text-left text-sm font-semibold text-gray-300">Método</th>
                <th class="py-2 px-4 text-left text-sm font-semibold text-gray-300">Descrição</th>
                <th class="py-2 px-4 text-left text-sm font-semibold text-gray-300">Efetividade</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-700">
              <tr>
                <td class="py-2 px-4 text-sm text-gray-300 font-medium">Verificação de URL</td>
                <td class="py-2 px-4 text-sm text-gray-300">Passar o mouse sobre links para revelar URL real</td>
                <td class="py-2 px-4 text-sm text-green-400">Alta</td>
              </tr>
              <tr>
                <td class="py-2 px-4 text-sm text-gray-300 font-medium">2FA</td>
                <td class="py-2 px-4 text-sm text-gray-300">Autenticação em duas etapas para todas as contas</td>
                <td class="py-2 px-4 text-sm text-green-400">Muito Alta</td>
              </tr>
              <tr>
                <td class="py-2 px-4 text-sm text-gray-300 font-medium">Email Secundário</td>
                <td class="py-2 px-4 text-sm text-gray-300">Usar email diferente para contas sensíveis</td>
                <td class="py-2 px-4 text-sm text-yellow-400">Média</td>
              </tr>
              <tr>
                <td class="py-2 px-4 text-sm text-gray-300 font-medium">Antiphishing</td>
                <td class="py-2 px-4 text-sm text-gray-300">Extensões e filtros de email antiphishing</td>
                <td class="py-2 px-4 text-sm text-green-400">Alta</td>
              </tr>
            </tbody>
          </table>
        </div>
      `
    },
    {
      title: "2. Blindando o WhatsApp e Redes Sociais",
      content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Pare a Clonagem:</h4>
            <p class="text-sm text-gray-300">
                1. No WhatsApp, vá em Configurações > Conta > <strong>Confirmação em duas etapas</strong>. Crie um PIN. <br/>
                2. Nunca entregue códigos que chegarem por SMS sob nenhum pretexto. <br/>
                3. Oculte sua foto de perfil para quem não está nos seus contatos; isso impede que golpistas usem sua imagem para criar um perfil falso e pedir dinheiro para seus parentes.
            </p>
        </div>
        <h3 class="text-xl font-bold text-white mt-6 mb-4">Configurações de Privacidade do WhatsApp</h3>
        <div class="space-y-6">
          <div class="border-l-4 border-green-500 pl-4 py-1">
            <h4 class="text-lg font-semibold text-white mb-2">Confirmação em duas etapas</h4>
            <p class="text-gray-300 text-sm mb-2">Adicione uma camada extra de segurança exigindo um código PIN ao vincular seu número a outro dispositivo.</p>
            <ol class="list-decimal list-inside text-gray-300 space-y-1 text-sm">
              <li>Abra o WhatsApp e vá em Configurações > Conta > Confirmação em duas etapas</li>
              <li>Ative a opção e crie um PIN de 6 dígitos</li>
              <li>Adicione um e-mail de recuperação opcional</li>
              <li>Guarde seu PIN em local seguro</li>
            </ol>
          </div>
          <div class="border-l-4 border-purple-500 pl-4 py-1">
            <h4 class="text-lg font-semibold text-white mb-2">Visibilidade de informações</h4>
            <p class="text-gray-300 text-sm mb-2">Controle quem pode ver sua foto de perfil, status e último visto.</p>
            <ol class="list-decimal list-inside text-gray-300 space-y-1 text-sm">
              <li>Vá em Configurações > Conta > Privacidade</li>
              <li>Configure foto de perfil, status e último visto para "Meus contatos" ou "Ninguém"</li>
              <li>Restrinja quem pode adicioná-lo aos grupos</li>
            </ol>
          </div>
          <div class="border-l-4 border-indigo-500 pl-4 py-1">
            <h4 class="text-lg font-semibold text-white mb-2">Verificação de segurança</h4>
            <p class="text-gray-300 text-sm mb-2">Verifique se seus chats estão criptografados com contatos desconhecidos.</p>
            <ol class="list-decimal list-inside text-gray-300 space-y-1 text-sm">
              <li>Toque no nome de um contato > Informações > Verificação de segurança</li>
              <li>Compare os códigos de verificação ou escaneie o QR Code</li>
              <li>Se os códigos forem diferentes, a conversa pode não ser segura</li>
            </ol>
          </div>
        </div>
      `
    },
    {
      title: "3. Redes Wi-Fi Públicas",
      content: `
        <p class="mb-4 text-gray-300">
            <strong>O Perigo do Wi-Fi Grátis:</strong> 
            <br/><br/>Ao usar o Wi-Fi de aeroportos ou cafeterias, lembre-se que qualquer pessoa na mesma rede pode (tecnicamente) monitorar o tráfego não criptografado. Evite acessar contas bancárias nesses locais. Se precisar trabalhar em redes públicas, o uso de uma **VPN** é obrigatório para criar um túnel seguro de dados entre o seu computador e a internet.
        </p>
        <div class="bg-red-900/20 p-4 rounded-lg border-l-4 border-red-500 my-6">
          <p class="text-red-200 font-semibold">Riscos de Redes Públicas:</p>
          <p class="text-gray-300 mt-2">Em redes Wi-Fi públicas, você está vulnerável a ataques como Man-in-the-Middle (MitM), onde um invasor intercepta a comunicação entre seu dispositivo e a internet. Isso permite roubar senhas, dados bancários e outras informações sensíveis.</p>
        </div>
        <h3 class="text-xl font-bold text-white mt-6 mb-4">Segurança em Redes Públicas</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h4 class="font-bold text-blue-400 mb-2">Uso de VPN</h4>
            <p class="text-gray-300 text-sm">Criptografa todo o tráfego de internet, protegendo seus dados</p>
          </div>
          <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h4 class="font-bold text-blue-400 mb-2">HTTPS Only</h4>
            <p class="text-gray-300 text-sm">Certifique-se de que os sites usam conexão segura (cadeado verde)</p>
          </div>
          <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h4 class="font-bold text-blue-400 mb-2">Desativar Compartilhamento</h4>
            <p class="text-gray-300 text-sm">Desative compartilhamento de arquivos e impressoras em redes públicas</p>
          </div>
        </div>
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20 mb-6">
          <h4 class="text-white font-bold mb-3 flex items-center">
            <span className="mr-2">📋</span> Checklist de Segurança em Wi-Fi Público
          </h4>
          <ul class="text-sm text-gray-300 space-y-2">
            <li class="flex items-start">
              <span class="text-blue-400 mr-2">✓</span>
              <span>Ative sua VPN antes de se conectar à rede pública</span>
            </li>
            <li class="flex items-start">
              <span class="text-blue-400 mr-2">✓</span>
              <span>Evite acessar contas sensíveis (bancos, e-mails pessoais)</span>
            </li>
            <li class="flex items-start">
              <span class="text-blue-400 mr-2">✓</span>
              <span>Verifique se o site usa HTTPS (ícone de cadeado)</span>
            </li>
            <li class="flex items-start">
              <span class="text-blue-400 mr-2">✓</span>
              <span>Desative descoberta de rede e compartilhamento de arquivos</span>
            </li>
            <li class="flex items-start">
              <span class="text-blue-400 mr-2">✓</span>
              <span>Desconecte-se após terminar sua sessão</span>
            </li>
          </ul>
        </div>
      `
    },
    {
      title: "4. Engenharia Social e Manipulação Psicológica",
      content: `
        <p class="mb-4 text-gray-300">
          A engenharia social é a arte de manipular pessoas para obter informações confidenciais. Em 2026, os golpistas utilizam técnicas psicológicas avançadas, combinadas com inteligência artificial, para criar situações de pressão emocional e tirar proveito de emoções humanas como medo, urgência e confiança.
        </p>
        <h3 class="text-xl font-bold text-white mt-6 mb-4">Técnicas Comuns de Engenharia Social</h3>
        <div class="space-y-4 mb-6">
          <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h4 class="font-bold text-blue-400 mb-2 flex items-center">
              <span class="mr-2">📞</span> Vishing (Voice Phishing)
            </h4>
            <p class="text-gray-300 text-sm mb-2">Ligações fraudulentas que simulam instituições confiáveis para obter informações pessoais.</p>
            <ul class="text-sm text-gray-300 ml-5 space-y-1 list-disc">
              <li>Criminosos fingem ser do banco, governo ou empresa conhecida</li>
              <li>Podem usar deepfakes para simular vozes conhecidas</li>
              <li>Exploram sentimentos de medo e urgência para agir rapidamente</li>
            </ul>
          </div>
          <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h4 class="font-bold text-blue-400 mb-2 flex items-center">
              <span class="mr-2">✉️</span> Spear Phishing
            </h4>
            <p class="text-gray-300 text-sm mb-2">Emails direcionados que usam informações pessoais para parecerem legítimos.</p>
            <ul class="text-sm text-gray-300 ml-5 space-y-1 list-disc">
              <li>Personalizados com nomes, cargos e informações específicas</li>
              <li>Usam dados públicos de redes sociais e vazamentos anteriores</li>
              <li>Frequentemente simulam colegas de trabalho ou contatos conhecidos</li>
            </ul>
          </div>
          <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h4 class="font-bold text-blue-400 mb-2 flex items-center">
              <span class="mr-2">👤</span> Pretexting
            </h4>
            <p class="text-gray-300 text-sm mb-2">Criação de uma história (pretexto) para ganhar confiança e obter informações.</p>
            <ul class="text-sm text-gray-300 ml-5 space-y-1 list-disc">
              <li>Pode envolver representação de identidade (suporte técnico, auditor, etc.)</li>
              <li>Desenvolve um cenário convincente para justificar solicitações</li>
              <li>Explora o desejo das pessoas de ajudar ou cooperar</li>
            </ul>
          </div>
        </div>
        <div class="bg-green-900/20 p-4 rounded-lg border-l-4 border-green-500 my-6">
          <p class="text-green-200 font-semibold">Prevenção:</p>
          <p class="text-gray-300 mt-2">A melhor defesa contra engenharia social é o treinamento e conscientização. Desconfie de solicitações urgentes, verifique a identidade de quem está contactando você e nunca forneça informações sensíveis por telefone ou email sem confirmação prévia.</p>
        </div>
      `
    },
    {
      title: "5. Identificação e Prevenção de Deepfakes",
      content: `
        <p class="mb-4 text-gray-300">
          Deepfakes são vídeos, áudios ou imagens sintéticas criadas com inteligência artificial para simular pessoas reais. Em 2026, essas tecnologias se tornaram mais acessíveis e convincentes, sendo usadas em golpes de todos os tipos, desde fraudes financeiras até campanhas de desinformação.
        </p>
        <h3 class="text-xl font-bold text-white mt-6 mb-4">Como Detectar Deepfakes</h3>
        <div class="overflow-x-auto mb-6">
          <table class="min-w-full bg-gray-800/50 rounded-lg overflow-hidden">
            <thead class="bg-gray-700">
              <tr>
                <th class="py-2 px-4 text-left text-sm font-semibold text-gray-300">Elemento</th>
                <th class="py-2 px-4 text-left text-sm font-semibold text-gray-300">Características Suspeitas</th>
                <th class="py-2 px-4 text-left text-sm font-semibold text-gray-300">Ferramentas de Detecção</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-700">
              <tr>
                <td class="py-2 px-4 text-sm text-gray-300 font-medium">Áudio</td>
                <td class="py-2 px-4 text-sm text-gray-300">Voz que não combina perfeitamente com os movimentos labiais</td>
                <td class="py-2 px-4 text-sm text-gray-300">Software especializado em análise de áudio</td>
              </tr>
              <tr>
                <td class="py-2 px-4 text-sm text-gray-300 font-medium">Vídeo</td>
                <td class="py-2 px-4 text-sm text-gray-300">Blinking irregular, sombras inconsistentes, bordas artificiais</td>
                <td class="py-2 px-4 text-sm text-gray-300">Deepfake detection APIs</td>
              </tr>
              <tr>
                <td class="py-2 px-4 text-sm text-gray-300 font-medium">Comportamento</td>
                <td class="py-2 px-4 text-sm text-gray-300">Fala ou gestos atípicos para a pessoa retratada</td>
                <td class="py-2 px-4 text-sm text-gray-300">Análise de padrões de comportamento</td>
              </tr>
              <tr>
                <td class="py-2 px-4 text-sm text-gray-300 font-medium">Contexto</td>
                <td class="py-2 px-4 text-sm text-gray-300">Situações improváveis ou fora do contexto habitual</td>
                <td class="py-2 px-4 text-sm text-gray-300">Verificação cruzada com fontes oficiais</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20 mb-6">
          <h4 class="text-white font-bold mb-3 flex items-center">
            <span className="mr-2">💡</span> Medidas Preventivas Contra Deepfakes
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
              <h5 class="font-bold text-white mb-2">Verificação de Identidade</h5>
              <p class="text-gray-300 text-sm">Use canais oficiais para confirmar a identidade de alguém em situações duvidosas.</p>
            </div>
            <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
              <h5 class="font-bold text-white mb-2">Conscientização</h5>
              <p class="text-gray-300 text-sm">Eduque-se e eduque outros sobre os riscos e sinais de deepfakes.</p>
            </div>
          </div>
        </div>
      `
    },
    {
      title: "6. Segurança em Redes Sociais e Perfil Digital",
      content: `
        <p class="mb-4 text-gray-300">
          Suas redes sociais contêm uma quantidade impressionante de informações pessoais que podem ser usadas para ataques direcionados. Em 2026, a proteção do perfil digital envolve cuidados com o que você compartilha, quem pode ver e interagir com seu conteúdo, e como você se apresenta online.
        </p>
        <h3 class="text-xl font-bold text-white mt-6 mb-4">Configurações de Segurança em Redes Sociais</h3>
        <div class="space-y-4 mb-6">
          <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h4 class="font-bold text-blue-400 mb-2 flex items-center">
              <span class="mr-2">🔒</span> Privacidade de Perfil
            </h4>
            <p class="text-gray-300 text-sm mb-2">Controle quem pode ver suas informações pessoais e interagir com você.</p>
            <ul class="text-sm text-gray-300 ml-5 space-y-1 list-disc">
              <li>Limite o público de suas postagens (público, amigos, somente você)</li>
              <li>Revise regularmente quem pode enviar mensagens ou comentários</li>
              <li>Restrinja o acesso a informações sensíveis (localização, telefone, etc.)</li>
            </ul>
          </div>
          <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h4 class="font-bold text-blue-400 mb-2 flex items-center">
              <span class="mr-2">🛡️</span> Verificação de Identidade
            </h4>
            <p class="text-gray-300 text-sm mb-2">Ative autenticação em duas etapas e verificação de login.</p>
            <ul class="text-sm text-gray-300 ml-5 space-y-1 list-disc">
              <li>Use autenticadores em vez de SMS para 2FA</li>
              <li>Monitore sessões ativas e dispositivos conectados</li>
              <li>Ative alertas de login de novos dispositivos</li>
            </ul>
          </div>
          <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h4 class="font-bold text-blue-400 mb-2 flex items-center">
              <span class="mr-2">🔍</span> Informações Públicas
            </h4>
            <p class="text-gray-300 text-sm mb-2">Minimize dados visíveis para estranhos e motores de busca.</p>
            <ul class="text-sm text-gray-300 ml-5 space-y-1 list-disc">
              <li>Evite compartilhar datas de nascimento completas</li>
              <li>Não publique fotos com geolocalização sensível</li>
              <li>Evite revelar rotinas ou hábitos pessoais</li>
            </ul>
          </div>
        </div>
        <div class="bg-yellow-900/20 p-4 rounded-lg border-l-4 border-yellow-500 my-6">
          <p class="text-yellow-200 font-semibold">Dicas de Segurança:</p>
          <p class="text-gray-300 mt-2">Configure notificações para quando alguém tentar acessar sua conta, reveja regularmente suas conexões e amigos, e leia periodicamente os termos de uso e políticas de privacidade das plataformas que você utiliza.</p>
        </div>
      `
    },
    {
      title: "7. Segurança de Dados e Backups",
      content: `
        <p class="mb-4 text-gray-300">
          A segurança digital não se limita à proteção contra acessos não autorizados; também envolve garantir que seus dados estejam disponíveis e intactos em caso de incidentes como ransomware, falhas de hardware ou desastres naturais. Em 2026, a estratégia de backup deve ser robusta e testada regularmente.
        </p>
        <h3 class="text-xl font-bold text-white mt-6 mb-4">Estratégias de Backup em 2026</h3>
        <div class="space-y-4 mb-6">
          <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h4 class="font-bold text-blue-400 mb-2 flex items-center">
              <span class="mr-2">🔄</span> Regras 3-2-1
            </h4>
            <p class="text-gray-300 text-sm mb-2">Mantenha 3 cópias dos dados, em 2 tipos de mídia diferentes, com 1 cópia offsite.</p>
            <ul class="text-sm text-gray-300 ml-5 space-y-1 list-disc">
              <li>3 cópias: Original + 2 backups</li>
              <li>2 tipos diferentes: HDD, SSD, nuvem, etc.</li>
              <li>1 offsite: Local remoto ou nuvem criptografada</li>
            </ul>
          </div>
          <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h4 class="font-bold text-blue-400 mb-2 flex items-center">
              <span class="mr-2">🛡️</span> Backups Imutáveis
            </h4>
            <p class="text-gray-300 text-sm mb-2">Backups que não podem ser alterados ou excluídos por atacantes.</p>
            <ul class="text-sm text-gray-300 ml-5 space-y-1 list-disc">
              <li>Objetos WORM (Write Once, Read Many)</li>
              <li>Backups em mídia offline ou com proteção contra gravação</li>
              <li>Soluções que impedem criptografia por ransomware</li>
            </ul>
          </div>
          <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h4 class="font-bold text-blue-400 mb-2 flex items-center">
              <span class="mr-2">🔍</span> Testes Regulares
            </h4>
            <p class="text-gray-300 text-sm mb-2">Verifique periodicamente se seus backups podem ser restaurados.</p>
            <ul class="text-sm text-gray-300 ml-5 space-y-1 list-disc">
              <li>Teste de restauração de arquivos críticos</li>
              <li>Verifique integridade dos dados</li>
              <li>Documente o processo de recuperação</li>
            </ul>
          </div>
        </div>
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20 mb-6">
          <h4 class="text-white font-bold mb-3 flex items-center">
            <span className="mr-2">⚠️</span> Armadilhas Comuns em Backups
          </h4>
          <ul class="text-sm text-gray-300 space-y-2">
            <li class="flex items-start">
              <span class="text-blue-400 mr-2">•</span>
              <span>Armazenar backups no mesmo dispositivo dos dados originais</span>
            </li>
            <li class="flex items-start">
              <span class="text-blue-400 mr-2">•</span>
              <span>Não testar regularmente se os backups funcionam</span>
            </li>
            <li class="flex items-start">
              <span class="text-blue-400 mr-2">•</span>
              <span>Usar apenas soluções de backup locais (sem cópia offsite)</span>
            </li>
            <li class="flex items-start">
              <span class="text-blue-400 mr-2">•</span>
              <span>Depender exclusivamente de provedores de nuvem sem backup secundário</span>
            </li>
            <li class="flex items-start">
              <span class="text-blue-400 mr-2">•</span>
              <span>Não criptografar backups contendo dados sensíveis</span>
            </li>
          </ul>
        </div>
      `
    },
    {
      title: "8. Monitoramento e Detecção de Atividades Suspeitas",
      content: `
        <p class="mb-4 text-gray-300">
          Em 2026, a segurança digital também envolve monitorar constantemente suas contas e dispositivos por atividades anormais. Isso inclui o acompanhamento de logins em novos dispositivos, mudanças inesperadas em configurações e padrões de uso que fogem do normal.
        </p>
        <h3 class="text-xl font-bold text-white mt-6 mb-4">Ferramentas e Práticas de Monitoramento</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h4 class="font-bold text-blue-400 mb-2">Alertas de Segurança</h4>
            <ul class="text-sm text-gray-300 space-y-1 list-disc pl-5">
              <li>Notificações de login em novos dispositivos</li>
              <li>Alterações de senha ou dados pessoais</li>
              <li>Atividades incomuns em contas (localização diferente)</li>
              <li>Atualizações de segurança de aplicativos</li>
            </ul>
          </div>
          <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h4 class="font-bold text-blue-400 mb-2">Monitoramento de Dispositivos</h4>
            <ul class="text-sm text-gray-300 space-y-1 list-disc pl-5">
              <li>Firewalls e antivírus atualizados</li>
              <li>Análise de tráfego de rede suspeito</li>
              <li>Processos em execução não autorizados</li>
              <li>Modificações em arquivos críticos</li>
            </ul>
          </div>
        </div>
        <h3 class="text-xl font-bold text-white mt-6 mb-4">Indicadores de Comprometimento (IoCs)</h3>
        <div class="space-y-4 mb-6">
          <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h4 class="font-bold text-blue-400 mb-2 flex items-center">
              <span class="mr-2">🔓</span> Comportamento de Conta
            </h4>
            <p class="text-gray-300 text-sm mb-2">Sinais que sua conta pode ter sido comprometida.</p>
            <ul class="text-sm text-gray-300 ml-5 space-y-1 list-disc">
              <li>Login de localização geográfica improvável</li>
              <li>Tentativas repetidas de acesso com falha</li>
              <li>Mudanças nas configurações da conta</li>
              <li>Atividades que você não reconhece</li>
            </ul>
          </div>
          <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h4 class="font-bold text-blue-400 mb-2 flex items-center">
              <span class="mr-2">💻</span> Comportamento do Dispositivo
            </h4>
            <p class="text-gray-300 text-sm mb-2">Sinais que seu dispositivo pode ter sido comprometido.</p>
            <ul class="text-sm text-gray-300 ml-5 space-y-1 list-disc">
              <li>Desempenho inesperadamente lento</li>
              <li>Pop-ups ou anúncios indesejados</li>
              <li>Programas iniciando automaticamente</li>
              <li>Tráfego de rede anormal</li>
            </ul>
          </div>
        </div>
        <div class="bg-yellow-900/20 p-4 rounded-lg border-l-4 border-yellow-500 my-6">
          <p class="text-yellow-200 font-semibold">Ações Imediatas:</p>
          <p class="text-gray-300 mt-2">Se você notar atividades suspeitas, altere suas senhas imediatamente, verifique se o 2FA ainda está ativo e rode varreduras de segurança no seu dispositivo. Em casos graves, entre em contato com o suporte da plataforma afetada.</p>
        </div>
      `
    }
  ];

  // Additional advanced content sections
  const advancedContentSections = [
    {
      title: "12. Criptografia e Segurança de Dados em 2026",
      content: `
        <h4 class="text-white font-bold mb-3">🔐 Técnicas Avançadas de Criptografia</h4>
        <p class="mb-4 text-gray-300">
          Em 2026, a criptografia evoluiu para enfrentar ameaças cada vez mais sofisticadas, incluindo computação quântica e técnicas avançadas de quebra de algoritmos:
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h5 class="text-blue-400 font-bold mb-3">Criptografia Assimétrica Avançada</h5>
            <ul class="text-sm text-gray-300 space-y-2">
              <li>• RSA-4096 e curvas elípticas P-384</li>
              <li>• Criptografia pós-quântica (CRYSTALS-Kyber)</li>
              <li>• Troca de chaves Diffie-Hellman estendida</li>
              <li>• Protocolos de negociação de chaves seguras</li>
              <li>• Forward secrecy (secreção perfeita encaminhada)</li>
            </ul>
          </div>
          <div class="bg-purple-900/10 p-5 rounded-xl border border-purple-500/20">
            <h5 class="text-purple-400 font-bold mb-3">Criptografia Simétrica Moderna</h5>
            <ul class="text-sm text-gray-300 space-y-2">
              <li>• AES-256 com modos GCM e XTS</li>
              <li>• ChaCha20-Poly1305 para ambientes móveis</li>
              <li>• Criptografia homomórfica para processamento seguro</li>
              <li>• Algoritmos de criptografia de disco (BitLocker, FileVault)</li>
              <li>• Criptografia em tempo de execução (RTE)</li>
            </ul>
          </div>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">🛡️ Implementações Práticas de Segurança</h4>
        <p class="mb-4 text-gray-300">
          Técnicas avançadas para proteger dados em diferentes cenários:
        </p>
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-gray-300 border border-gray-700 rounded-lg">
            <thead class="bg-gray-800">
              <tr>
                <th class="p-3 text-left">Cenário</th>
                <th class="p-3 text-left">Técnica</th>
                <th class="p-3 text-left">Implementação</th>
                <th class="p-3 text-left">Nível de Segurança</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-t border-gray-700">
                <td class="p-3">Comunicação em trânsito</td>
                <td class="p-3">TLS 1.3 + Perfect Forward Secrecy</td>
                <td class="p-3">AES-256-GCM + ECDHE</td>
                <td class="p-3 text-green-400">Muito Alto</td>
              </tr>
              <tr class="border-t border-gray-700 bg-gray-800/30">
                <td class="p-3">Armazenamento local</td>
                <td class="p-3">Criptografia de disco completo</td>
                <td class="p-3">BitLocker/XOR/XTS-AES</td>
                <td class="p-3 text-green-400">Alto</td>
              </tr>
              <tr class="border-t border-gray-700">
                <td class="p-3">Dados em nuvem</td>
                <td class="p-3">Cliente-side encryption</td>
                <td class="p-3">AES-256 + chaves gerenciadas pelo cliente</td>
                <td class="p-3 text-green-400">Muito Alto</td>
              </tr>
              <tr class="border-t border-gray-700 bg-gray-800/30">
                <td class="p-3">Mensagens instantâneas</td>
                <td class="p-3">Criptografia de ponta a ponta</td>
                <td class="p-3">Signal Protocol (Curve25519 + AES-256)</td>
                <td class="p-3 text-green-400">Muito Alto</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="bg-amber-900/10 p-5 rounded-xl border border-amber-500/20 mt-6">
          <h4 class="text-amber-400 font-bold mb-2">💡 Dica Pro: Criptografia em Camadas</h4>
          <p class="text-sm text-gray-300">
            Em 2026, a melhor prática é implementar criptografia em múltiplas camadas: criptografia de aplicação, criptografia de transporte e criptografia de armazenamento, cada uma com algoritmos diferentes para proteção máxima.
          </p>
        </div>
      `
    },
    {
      title: "13. Análise de Vulnerabilidades e Penetration Testing",
      content: `
        <h4 class="text-white font-bold mb-3">🔍 Metodologias de Análise de Segurança</h4>
        <p class="mb-4 text-gray-300">
          Em 2026, a segurança proativa envolve técnicas avançadas de análise de vulnerabilidades e testes de penetração:
        </p>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 my-6">
          <div class="bg-green-900/10 p-5 rounded-xl border border-green-500/20">
            <h5 class="text-green-400 font-bold mb-3">Análise de Vulnerabilidades</h5>
            <ul class="text-sm text-gray-300 space-y-2">
              <li>• Scanning com OWASP ZAP e Nessus</li>
              <li>• Avaliação de dependências (Snyk, Dependabot)</li>
              <li>• Análise estática de código (SAST)</li>
              <li>• Análise dinâmica de código (DAST)</li>
              <li>• Avaliação de segurança de containers</li>
            </ul>
          </div>
          <div class="bg-cyan-900/10 p-5 rounded-xl border border-cyan-500/20">
            <h5 class="text-cyan-400 font-bold mb-3">Penetration Testing</h5>
            <ul class="text-sm text-gray-300 space-y-2">
              <li>• Metodologia PTES (Penetration Testing Execution Standard)</li>
              <li>• Framework Metasploit para exploração</li>
              <li>• Testes de rede, web e aplicações móveis</li>
              <li>• Testes de engenharia social</li>
              <li>• Avaliação de resposta a incidentes</li>
            </ul>
          </div>
          <div class="bg-indigo-900/10 p-5 rounded-xl border border-indigo-500/20">
            <h5 class="text-indigo-400 font-bold mb-3">Análise de Riscos</h5>
            <ul class="text-sm text-gray-300 space-y-2">
              <li>• Matrizes de probabilidade e impacto</li>
              <li>• Análise quantitativa e qualitativa</li>
              <li>• Modelo NIST Cybersecurity Framework</li>
              <li>• Avaliação de maturidade de segurança</li>
              <li>• Quantificação de riscos financeiros</li>
            </ul>
          </div>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">🛡️ Técnicas de Identificação de Ameaças</h4>
        <p class="mb-4 text-gray-300">
          Metodologias para identificar e classificar ameaças cibernéticas:
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-gray-800 p-4 rounded-lg">
            <h5 class="text-cyan-400 font-bold mb-2">STRIDE</h5>
            <ul class="text-sm text-gray-300 space-y-2">
              <li>• Spoofing: Falsificação de identidade</li>
              <li>• Tampering: Alteração não autorizada de dados</li>
              <li>• Repudiation: Negativa de ações realizadas</li>
              <li>• Information Disclosure: Exposição de informações</li>
              <li>• Denial of Service: Negação de serviço</li>
              <li>• Elevation of Privilege: Elevação indevida de privilégios</li>
            </ul>
          </div>
          <div class="bg-gray-800 p-4 rounded-lg">
            <h5 class="text-purple-400 font-bold mb-2">DREAD</h5>
            <ul class="text-sm text-gray-300 space-y-2">
              <li>• Damage: Potencial de dano</li>
              <li>• Reproducibility: Facilidade de reprodução</li>
              <li>• Exploitability: Facilidade de exploração</li>
              <li>• Affected Users: Número de usuários afetados</li>
              <li>• Discoverability: Facilidade de descoberta</li>
            </ul>
          </div>
        </div>
      `
    },
    {
      title: "14. Inteligência de Ameaças e Resposta a Incidentes",
      content: `
        <h4 class="text-white font-bold mb-3">🚨 Inteligência de Ameaças em 2026</h4>
        <p class="mb-4 text-gray-300">
          A inteligência de ameaças evoluiu para fornecer insights preditivos e reativos sobre ataques cibernéticos:
        </p>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 my-6">
          <div class="bg-orange-900/10 p-5 rounded-xl border border-orange-500/20">
            <h5 class="text-orange-400 font-bold mb-3">Tipos de Inteligência</h5>
            <ul class="text-sm text-gray-300 space-y-2">
              <li>• Strategic: Visão de alto nível para tomada de decisão</li>
              <li>• Tactical: Informações sobre TTPs (Táticas, Técnicas e Procedimentos)</li>
              <li>• Operational: Dados sobre campanhas específicas</li>
              <li>• Technical: Indicators of Compromise (IoCs) e IOAs</li>
              <li>• Threat Actor Profiling: Perfil de grupos de ataque</li>
            </ul>
          </div>
          <div class="bg-red-900/10 p-5 rounded-xl border border-red-500/20">
            <h5 class="text-red-400 font-bold mb-3">Resposta a Incidentes</h5>
            <ul class="text-sm text-gray-300 space-y-2">
              <li>• Preparação e planejamento</li>
              <li>• Identificação e análise</li>
              <li>• Contenção, erradicação e recuperação</li>
              <li>• Lições aprendidas e melhoria contínua</li>
              <li>• Coordenação com órgãos reguladores</li>
            </ul>
          </div>
          <div class="bg-pink-900/10 p-5 rounded-xl border border-pink-500/20">
            <h5 class="text-pink-400 font-bold mb-3">Ferramentas de TIP</h5>
            <ul class="text-sm text-gray-300 space-y-2">
              <li>• MISP (Malware Information Sharing Platform)</li>
              <li>• ThreatConnect</li>
              <li>• IBM X-Force Exchange</li>
              <li>• Recorded Future</li>
              <li>• AlienVault OTX</li>
            </ul>
          </div>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">📊 Frameworks de Resposta a Incidentes</h4>
        <p class="mb-4 text-gray-300">
          Estruturas padronizadas para resposta eficaz a incidentes de segurança:
        </p>
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-gray-300 border border-gray-700 rounded-lg">
            <thead class="bg-gray-800">
              <tr>
                <th class="p-3 text-left">Framework</th>
                <th class="p-3 text-left">Fases</th>
                <th class="p-3 text-left">Foco Principal</th>
                <th class="p-3 text-left">Aplicabilidade</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-t border-gray-700">
                <td class="p-3">NIST SP 800-61</td>
                <td class="p-3">Preparação, Detecção, Resposta, Recuperação</td>
                <td class="p-3">Organizações governamentais e comerciais</td>
                <td class="p-3 text-green-400">Alta</td>
              </tr>
              <tr class="border-t border-gray-700 bg-gray-800/30">
                <td class="p-3">SANS Incident Handler</td>
                <td class="p-3">Preparação, Contenção, Erradicação, Recuperação</td>
                <td class="p-3">Equipes de resposta a incidentes</td>
                <td class="p-3 text-green-400">Alta</td>
              </tr>
              <tr class="border-t border-gray-700">
                <td class="p-3">CERT Responder</td>
                <td class="p-3">Classificação, Contenção, Aprendizado</td>
                <td class="p-3">Centros de resposta a incidentes</td>
                <td class="p-3 text-green-400">Alta</td>
              </tr>
              <tr class="border-t border-gray-700 bg-gray-800/30">
                <td class="p-3">ISO 27035</td>
                <td class="p-3">Planejamento, Detecção, Avaliação, Resposta</td>
                <td class="p-3">Conformidade e governança</td>
                <td class="p-3 text-yellow-400">Média</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">🔬 Análise Forense Digital</h4>
        <p class="mb-4 text-gray-300">
          Técnicas avançadas para investigação de incidentes cibernéticos:
        </p>
        <ul class="list-disc list-inside text-gray-300 space-y-3 ml-4">
          <li><strong>Coleta de Evidências:</strong> Imagens forenses de discos, memória RAM e redes</li>
          <li><strong>Análise de Artifacts:</strong> Arquivos temporários, logs, histórico de navegação</li>
          <li><strong>Timeline Analysis:</strong> Reconstrução de sequência de eventos</li>
          <li><strong>Network Forensics:</strong> Análise de pacotes de rede e tráfego</li>
          <li><strong>Mobile Forensics:</strong> Extração e análise de dispositivos móveis</li>
        </ul>
      `
    }
  ];

  const additionalContentSections = [
    {
      title: "9. Segurança em Ambientes Corporativos",
      content: `
        <h4 class="text-white font-bold mb-3">🏢 Segurança Corporativa em 2026</h4>
        <p class="mb-4 text-gray-300">
          Em ambientes corporativos, a segurança digital envolve políticas, tecnologias e procedimentos coordenados:
        </p>
        <div class="space-y-6">
          <div class="border-l-4 border-green-500 pl-4 py-2 bg-green-900/10">
            <h5 class="text-green-400 font-bold mb-2">Zero Trust Architecture</h5>
            <p class="text-gray-300 text-sm">
              Modelo de segurança que presume desconfiança em todos os acessos:
            </p>
            <ul class="text-sm text-gray-300 space-y-1 mt-2">
              <li>• Verificação contínua de identidade e dispositivos</li>
              <li>• Acesso mínimo necessário (least privilege)</li>
              <li>• Segmentação de rede micro e macro</li>
              <li>• Monitoramento contínuo de atividades</li>
              <li>• Criptografia em todos os níveis</li>
            </ul>
          </div>
          <div class="border-l-4 border-blue-500 pl-4 py-2 bg-blue-900/10">
            <h5 class="text-blue-400 font-bold mb-2">Governança de Segurança</h5>
            <p class="text-gray-300 text-sm">
              Estrutura de políticas e processos para gerenciar riscos:
            </p>
            <ul class="text-sm text-gray-300 space-y-1 mt-2">
              <li>• Política de segurança da informação</li>
              <li>• Comitê de segurança e comitê de risco</li>
              <li>• Avaliação contínua de riscos</li>
              <li>• Treinamento e conscientização</li>
              <li>• Auditorias de segurança regulares</li>
            </ul>
          </div>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">🛡️ Controles de Segurança Corporativa</h4>
        <p class="mb-4 text-gray-300">
          Implementações práticas de segurança em ambientes empresariais:
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-gray-800 p-4 rounded-lg">
            <h5 class="text-cyan-400 font-bold mb-2">Controles Técnicos</h5>
            <ul class="text-sm text-gray-300 space-y-2">
              <li>• Firewalls e NGFW (Next Generation Firewall)</li>
              <li>• SIEM/SOAR para detecção e resposta</li>
              <li>• EDR (Endpoint Detection and Response)</li>
              <li>• DLP (Data Loss Prevention)</li>
              <li>• IAM (Identity and Access Management)</li>
            </ul>
          </div>
          <div class="bg-gray-800 p-4 rounded-lg">
            <h5 class="text-purple-400 font-bold mb-2">Controles Administrativos</h5>
            <li>• Políticas de uso aceitável</li>
            <li>• Procedimentos de resposta a incidentes</li>
            <li>• Treinamento de conscientização</li>
            <li>• Gerenciamento de mudanças de segurança</li>
            <li>• Auditorias regulares de conformidade</li>
            </ul>
          </div>
        </div>
      `
    },
    {
      title: "10. Segurança em Nuvem e Infraestrutura como Código",
      content: `
        <h4 class="text-white font-bold mb-3">☁️ Segurança em Ambientes Cloud</h4>
        <p class="mb-4 text-gray-300">
          A migração para a nuvem introduziu novos desafios e paradigmas de segurança:
        </p>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
          <div class="bg-indigo-900/10 p-5 rounded-xl border border-indigo-500/20">
            <h5 class="text-indigo-400 font-bold mb-3">Modelos de Responsabilidade</h5>
            <ul class="text-sm text-gray-300 space-y-2">
              <li>• Shared Responsibility Model (AWS, Azure, GCP)</li>
              <li>• CSPM (Cloud Security Posture Management)</li>
              <li>• CWPP (Cloud Workload Protection Platforms)</li>
              <li>• Segurança em containers e serverless</li>
              <li>• Compliance em ambientes híbridos</li>
            </ul>
          </div>
          <div class="bg-cyan-900/10 p-5 rounded-xl border border-cyan-500/20">
            <h5 class="text-cyan-400 font-bold mb-3">Infraestrutura como Código (IaC)</h5>
            <ul class="text-sm text-gray-300 space-y-2">
              <li>• Terraform, Ansible, CloudFormation</li>
              <li>• Infra as Code Security (IaC SAST)</li>
              <li>• Policy as Code (PaC) com Open Policy Agent</li>
              <li>• GitOps e segurança em pipelines CI/CD</li>
              <li>• Segurança de secrets e gerenciamento de chaves</li>
            </ul>
          </div>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">🔐 Práticas de Segurança Cloud-Native</h4>
        <p class="mb-4 text-gray-300">
          Implementações específicas para ambientes nativos da nuvem:
        </p>
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-gray-300 border border-gray-700 rounded-lg">
            <thead class="bg-gray-800">
              <tr>
                <th class="p-3 text-left">Área</th>
                <th class="p-3 text-left">Técnica</th>
                <th class="p-3 text-left">Implementação</th>
                <th class="p-3 text-left">Benefício</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-t border-gray-700">
                <td class="p-3">Containers</td>
                <td class="p-3">Runtime security</td>
                <td class="p-3">Falco, Sysdig Secure</td>
                <td class="p-3">Detecção de anomalias em tempo de execução</td>
              </tr>
              <tr class="border-t border-gray-700 bg-gray-800/30">
                <td class="p-3">Kubernetes</td>
                <td class="p-3">Policy enforcement</td>
                <td class="p-3">OPA Gatekeeper, Kyverno</td>
                <td class="p-3">Aplicação de políticas de segurança</td>
              </tr>
              <tr class="border-t border-gray-700">
                <td class="p-3">Rede</td>
                <td class="p-3">Microsegmentação</td>
                <td class="p-3">NSX-T, Calico, Cilium</td>
                <td class="p-3">Isolamento de tráfego entre workloads</td>
              </tr>
              <tr class="border-t border-gray-700 bg-gray-800/30">
                <td class="p-3">Dados</td>
                <td class="p-3">Encryption at rest/transit</td>
                <td class="p-3">KMS, envelope encryption</td>
                <td class="p-3">Proteção de dados sensíveis</td>
              </tr>
            </tbody>
          </table>
        </div>
      `
    },
    {
      title: "11. Privacidade de Dados e Conformidade Regulatória",
      content: `
        <h4 class="text-white font-bold mb-3">📋 Regulamentações de Privacidade em 2026</h4>
        <p class="mb-4 text-gray-300">
          Em 2026, as leis de proteção de dados se tornaram mais rigorosas e abrangentes:
        </p>
        <div class="space-y-6">
          <div class="border-l-4 border-green-500 pl-4 py-2 bg-green-900/10">
            <h5 class="text-green-400 font-bold mb-2">LGPD e GDPR</h5>
            <p class="text-gray-300 text-sm">
              Lei Geral de Proteção de Dados (Brasil) e Regulamento Geral sobre a Proteção de Dados (EU):
            </p>
            <ul class="text-sm text-gray-300 space-y-1 mt-2">
              <li>• Consentimento explícito e informado</li>
              <li>• Direito ao esquecimento</li>
              <li>• Notificação de violação de dados em 72h</li>
              <li>• Encarregado de proteção de dados (DPO)</li>
              <li>• Impact Assessment (DPIA)</li>
            </ul>
          </div>
          <div class="border-l-4 border-blue-500 pl-4 py-2 bg-blue-900/10">
            <h5 class="text-blue-400 font-bold mb-2">Outras Regulamentações</h5>
            <p class="text-gray-300 text-sm">
              Outras leis importantes para conformidade:
            </p>
            <ul class="text-sm text-gray-300 space-y-1 mt-2">
              <li>• CCPA/CPRA (California Consumer Privacy Act)</li>
              <li>• HIPAA (Health Insurance Portability and Accountability Act)</li>
              <li>• PCI DSS (Payment Card Industry Data Security Standard)</li>
              <li>• SOX (Sarbanes-Oxley Act)</li>
              <li>• ISO 27001/27002</li>
            </ul>
          </div>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">🛡️ Implementações de Privacidade em Aplicações</h4>
        <p class="mb-4 text-gray-300">
          Técnicas para garantir a privacidade de dados em desenvolvimento de software:
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-gray-800 p-4 rounded-lg">
            <h5 class="text-cyan-400 font-bold mb-2">Técnicas de Proteção</h5>
            <ul class="text-sm text-gray-300 space-y-2">
              <li>• Anonimização e pseudonimização de dados</li>
              <li>• Privacy by Design em desenvolvimento</li>
              <li>• Criptografia de dados sensíveis</li>
              <li>• Minimização de dados coletados</li>
              <li>• Consentimento granular e revogável</li>
            </ul>
          </div>
          <div class="bg-gray-800 p-4 rounded-lg">
            <h5 class="text-purple-400 font-bold mb-2">Ferramentas de Conformidade</h5>
            <li>• Data Loss Prevention (DLP)</li>
            <li>• Privacy Management Platforms (PMP)</li>
            <li>• Data Discovery and Classification Tools</li>
            <li>• Audit Logs e Reporting Systems</li>
            <li>• Automated Compliance Monitoring</li>
            </ul>
          </div>
        </div>
      `
    }
  ];

  const faqItems = [
    {
      question: "O que é segurança digital e por que é importante em 2026?",
      answer: `
        <p class="text-gray-300 mb-2">A segurança digital é o conjunto de práticas e ferramentas utilizadas para proteger dados, dispositivos e identidades online. Em 2026, é particularmente importante devido ao aumento de ameaças cibernéticas sofisticadas, como deepfakes, phishing alimentado por IA e ataques direcionados que utilizam informações públicas coletadas de redes sociais.</p>
        <p class="text-gray-300">A proteção digital agora envolve não apenas antivírus, mas também comportamentos conscientes, autenticação em múltiplas etapas e proteção da privacidade pessoal.</p>
      `
    },
    {
      question: "Como posso identificar um email de phishing?",
      answer: `
        <p class="text-gray-300 mb-2">Emails de phishing frequentemente contêm:</p>
        <ul class="list-disc list-inside text-gray-300 space-y-1 mb-2">
          <li>Urgência injustificada ("atualize seus dados agora!")</li>
          <li>Erros ortográficos ou de formatação</li>
          <li>Links com URLs truncadas ou mascaradas</li>
          <li>Endereço de email do remetente suspeito ou semelhante ao oficial</li>
        </ul>
        <p class="text-gray-300">Para verificar, passe o mouse sobre os links sem clicar para ver a URL real, e sempre acesse sites importantes digitando o endereço diretamente no navegador.</p>
      `
    },
    {
      question: "O que é engenharia social e como me proteger dela?",
      answer: `
        <p class="text-gray-300 mb-2">Engenharia social é a manipulação psicológica de pessoas para obter informações confidenciais. Golpistas usam técnicas como vishing (ligações fraudulentas), spear phishing (emails direcionados) e pretexting (histórias inventadas) para explorar emoções como medo e urgência.</p>
        <p class="text-gray-300">Para se proteger, desconfie de solicitações urgentes de informação, verifique a identidade de quem está contactando você e nunca forneça dados sensíveis sem confirmação prévia por meio de canais oficiais.</p>
      `
    },
    {
      question: "Como funciona a confirmação em duas etapas no WhatsApp?",
      answer: `
        <p class="text-gray-300 mb-2">A confirmação em duas etapas do WhatsApp adiciona uma camada extra de segurança exigindo um código PIN ao vincular seu número a outro dispositivo. Para ativar, vá em Configurações > Conta > Confirmação em duas etapas e crie um PIN de 6 dígitos.</p>
        <p class="text-gray-300">Você também pode adicionar um e-mail de recuperação opcional para ajudar na recuperação da conta caso esqueça seu PIN.</p>
      `
    },
    {
      question: "Quais são os riscos de usar redes Wi-Fi públicas?",
      answer: `
        <p class="text-gray-300 mb-2">Redes Wi-Fi públicas são vulneráveis a ataques como Man-in-the-Middle (MitM), onde um invasor intercepta a comunicação entre seu dispositivo e a internet. Isso permite roubar senhas, dados bancários e outras informações sensíveis.</p>
        <p class="text-gray-300">Para se proteger, evite acessar contas sensíveis, use uma VPN para criptografar seu tráfego e certifique-se de que os sites usam conexão segura (HTTPS).</p>
      `
    },
    {
      question: "O que são deepfakes e como detectá-los?",
      answer: `
        <p class="text-gray-300 mb-2">Deepfakes são vídeos, áudios ou imagens sintéticas criadas com inteligência artificial para simular pessoas reais. Em 2026, são usados em golpes e campanhas de desinformação.</p>
        <p class="text-gray-300">Para detectar, observe blinkings irregulares, sombras inconsistentes, bordas artificiais, voz não combinando com movimentos labiais e comportamentos atípicos para a pessoa retratada. Sempre verifique informações com fontes oficiais.</p>
      `
    },
    {
      question: "Como proteger minhas redes sociais contra invasores?",
      answer: `
        <p class="text-gray-300 mb-2">Para proteger suas redes sociais:</p>
        <ul class="list-disc list-inside text-gray-300 space-y-1 mb-2">
          <li>Ative autenticação em duas etapas</li>
          <li>Limite o público de suas postagens</li>
          <li>Revise regularmente quem pode enviar mensagens ou comentários</li>
          <li>Restrinja o acesso a informações sensíveis</li>
          <li>Monitore sessões ativas e dispositivos conectados</li>
        </ul>
        <p class="text-gray-300">Além disso, evite compartilhar datas de nascimento completas e fotos com geolocalização sensível.</p>
      `
    },
    {
      question: "Qual a importância de ter backups regulares?",
      answer: `
        <p class="text-gray-300 mb-2">Backups regulares são essenciais para proteger seus dados contra ransomware, falhas de hardware, erros humanos e desastres naturais. Seguindo a regra 3-2-1 (3 cópias, 2 tipos de mídia diferentes, 1 cópia offsite), você garante que seus dados estejam seguros e recuperáveis.</p>
        <p class="text-gray-300">É crucial testar regularmente seus backups para garantir que possam ser restaurados quando necessário.</p>
      `
    },
    {
      question: "O que são Indicadores de Comprometimento (IoCs)?",
      answer: `
        <p class="text-gray-300 mb-2">Indicadores de Comprometimento (IoCs) são evidências observáveis de atividades maliciosas em sistemas ou redes. Exemplos incluem logins de localizações geográficas improváveis, tentativas repetidas de acesso com falha, mudanças não autorizadas nas configurações da conta e atividades que você não reconhece.</p>
        <p class="text-gray-300">Monitorar esses indicadores ajuda a detectar e responder a incidentes de segurança rapidamente, minimizando danos.</p>
      `
    },
    {
      question: "Como posso monitorar minhas contas por atividades suspeitas?",
      answer: `
        <p class="text-gray-300 mb-2">Você pode monitorar suas contas ativando alertas de segurança que notificam sobre logins em novos dispositivos, alterações de senha ou dados pessoais e atividades incomuns. Revise regularmente as sessões ativas e dispositivos conectados nas configurações de segurança de cada plataforma.</p>
        <p class="text-gray-300">Também é útil verificar extratos bancários e atividades de contas periodicamente para detectar movimentações não autorizadas.</p>
      `
    },
    {
      question: "O que devo fazer se suspeitar que minha conta foi invadida?",
      answer: `
        <p class="text-gray-300 mb-2">Se suspeitar que sua conta foi invadida, altere sua senha imediatamente, verifique se o 2FA ainda está ativo e revise as configurações da conta por alterações não autorizadas. Execute uma varredura de segurança no seu dispositivo e revise as sessões ativas.</p>
        <p class="text-gray-300">Entre em contato com o suporte da plataforma afetada e, se necessário, notifique instituições financeiras caso dados sensíveis tenham sido comprometidos.</p>
      `
    },
    {
      question: "Como posso me proteger contra golpes de vishing (ligações fraudulentas)?",
      answer: `
        <p class="text-gray-300 mb-2">Para se proteger contra vishing:</p>
        <ul class="list-disc list-inside text-gray-300 space-y-1 mb-2">
          <li>Nunca forneça informações pessoais por telefone se você não iniciou a ligação</li>
          <li>Desligue e ligue novamente para instituições confiáveis para confirmar qualquer solicitação</li>
          <li>Desconfie de ligações urgentes que criam pânico ou pressa</li>
          <li>Verifique se o número é oficial antes de retornar ligações</li>
        </ul>
        <p class="text-gray-300">Lembre-se que instituições legítimas raramente pedem dados sensíveis por telefone.</p>
      `
    }
  ];

  const externalReferences = [
    {
      name: "CERT.br - Boletins de Segurança",
      url: "https://www.cert.br/boletins/"
    },
    {
      name: "Cybersecurity and Infrastructure Security Agency (CISA)",
      url: "https://www.cisa.gov/cybersecurity"
    },
    {
      name: "OWASP - Projeto de Segurança de Aplicações Web",
      url: "https://owasp.org/"
    },
    {
      name: "Symantec Internet Security Threat Report",
      url: "https://symantec-enterprise-blogs.security.com/"
    }
  ];

  const relatedGuides = [
    {
      href: "/guias/seguranca-senhas-gerenciadores",
      title: "Gerenciar Senhas",
      description: "A base da proteção de contas em 2026."
    },
    {
      href: "/guias/autenticacao-dois-fatores",
      title: "Guia de 2FA",
      description: "Aprenda a usar autenticadores de app."
    },
    {
      href: "/guias/identificacao-phishing",
      title: "Detalhes de Phishing",
      description: "Como analisar a URL de um site suspeito."
    }
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="30 min"
      difficultyLevel="Intermediário"
      author="Equipe de Segurança Voltris"
      lastUpdated="2026-01-20"
      contentSections={contentSections}
      advancedContentSections={advancedContentSections}
      additionalContentSections={additionalContentSections}
      summaryTable={summaryTable}
      faqItems={faqItems}
      externalReferences={externalReferences}
      relatedGuides={[
        ...relatedGuides,
        ...additionalContentSections.map((section, index) => ({
          href: `#additional-section-${index}`,
          title: section.title,
          description: section.content.substring(0, 100) + '...'
        }))
      ]}
    />
  );
}
