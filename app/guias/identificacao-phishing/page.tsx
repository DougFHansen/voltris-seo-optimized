import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'identificacao-phishing',
  title: "Phishing: Como identificar sites e e-mails falsos (2026)",
  description: "Recebeu uma mensagem estranha do banco ou do Discord? Aprenda a identificar as técnicas de Phishing mais comuns de 2026 e proteja seus dados de hacker...",
  category: 'rede-seguranca',
  difficulty: 'Iniciante',
  time: '30 min'
};

const title = "Phishing: Como identificar sites e e-mails falsos (2026)";
const description = "Recebeu uma mensagem estranha do banco ou do Discord? Aprenda a identificar as técnicas de Phishing mais comuns de 2026 e proteja seus dados de hackers.";
const keywords = [
  'como identificar phishing e-mail falso 2026',
  'como saber se um site é seguro para por senha',
  'golpe do discord nitro gratis como identificar',
  'prevenir sequestro de conta steam phishing tutorial',
  'verificar link suspeito antes de clicar guia 2026'
];

export const metadata: Metadata = createGuideMetadata('identificacao-phishing', title, description, keywords);

export default function PhishingGuide() {
  const summaryTable = [
    { label: "O que é", value: "Engenharia social para roubar senhas" },
    { label: "Sinal de Alerta #1", value: "Urgência ou ameaça de bloquear conta" },
    { label: "Sinal de Alerta #2", value: "Links com erros de escrita (ex: g00gle.com)" },
    { label: "Dificuldade", value: "Fácil" }
  ];

  const contentSections = [
    {
      title: "O Golpe mais lucrativo de 2026",
      content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Diferente dos vírus que tentam quebrar o código do seu computador, o **Phishing** tenta quebrar a sua desconfiança. É muito mais caro criar um malware ultra moderno do que simplesmente criar uma página de login do Instagram idêntica à original e convencer você a digitar sua senha. Em 2026, com o uso de IA para criar textos perfeitos, identificar esses golpes exige atenção aos detalhes técnicos.
        </p>
        <div class="bg-red-900/20 p-4 rounded-lg border-l-4 border-red-500 my-6">
          <p class="text-red-200 font-semibold">Dados Alarmantes:</p>
          <p class="text-gray-300 mt-2">Segundo o relatório anual da Anti-Phishing Working Group (APWG), mais de 1.2 milhões de ataques de phishing foram relatados em 2026, representando um aumento de 35% em relação ao ano anterior. Apenas 3% dos funcionários identificam com sucesso e-mails de phishing sofisticados em testes simulados.</p>
        </div>
        <p class="mb-4 text-gray-300 leading-relaxed">
          O phishing evoluiu de mensagens com erros ortográficos óbvios para campanhas altamente sofisticadas que utilizam inteligência artificial para personalizar conteúdo e direcionar vítimas específicas. Os criminosos agora empregam técnicas como deepfakes, perfis sociais falsos e documentos oficiais falsificados para aumentar a credibilidade de seus golpes.
        </p>
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20 mb-6">
          <h4 class="text-white font-bold mb-3 flex items-center">
            <span className="mr-2">⚠️</span> Técnicas de Engenharia Social em 2026
          </h4>
          <ul class="text-sm text-gray-300 space-y-2">
            <li class="flex items-start">
              <span class="text-blue-400 mr-2">•</span>
              <span><strong>AI-Powered Content:</strong> Mensagens personalizadas com base em dados públicos</span>
            </li>
            <li class="flex items-start">
              <span class="text-blue-400 mr-2">•</span>
              <span><strong>CEO Fraud:</strong> Impersonificação de executivos para solicitar transferências</span>
            </li>
            <li class="flex items-start">
              <span class="text-blue-400 mr-2">•</span>
              <span><strong>Whaling:</strong> Ataques direcionados a executivos e personalidades</span>
            </li>
            <li class="flex items-start">
              <span class="text-blue-400 mr-2">•</span>
              <span><strong>Smishing/Vishing:</strong> Phishing por SMS e ligações fraudulentas</span>
            </li>
          </ul>
        </div>
      `
    },
    {
      title: "1. O Teste do Cursor (Hover Test)",
      content: `
        <p class="mb-4 text-gray-300">Nunca confie no texto azul de um link. Confie para onde ele aponta:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Antes de clicar, passe o mouse em cima do link (sem clicar!).</li>
            <li>Olhe no canto inferior esquerdo do seu navegador. O endereço real aparecerá ali.</li>
            <li>Se o e-mail diz ser do "PayPal", mas o endereço que aparece é <code>bit.ly/seus-reais-agora</code> ou <code>pay-pal-security-update.xyz</code>, é um golpe.</li>
        </ol>
        <div class="bg-yellow-900/20 p-4 rounded-lg border-l-4 border-yellow-500 my-6">
          <p class="text-yellow-200 font-semibold">Limitações do Hover Test:</p>
          <p class="text-gray-300 mt-2">Em dispositivos móveis, o teste do cursor não é aplicável. Além disso, alguns links podem redirecionar para URLs diferentes após múltiplos saltos. Em 2026, criminosos utilizam URLs encurtadas e redirecionamentos complexos para ocultar o destino final do link.</p>
        </div>
        <h3 class="text-xl font-bold text-white mt-6 mb-4">Análise Avançada de URLs</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h4 class="font-bold text-blue-400 mb-2">URL Legítima</h4>
            <p class="text-sm text-gray-300 mb-2"><code>https://www.paypal.com/login</code></p>
            <ul class="text-sm text-gray-300 space-y-1">
              <li>• Protocolo HTTPS (criptografia)</li>
              <li>• Domínio principal correto (paypal.com)</li>
              <li>• Caminho esperado (/login)</li>
              <li>• Certificado válido</li>
            </ul>
          </div>
          <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h4 class="font-bold text-red-400 mb-2">URL Fraudulenta</h4>
            <p class="text-sm text-gray-300 mb-2"><code>https://www.pay-pal-security-update.xyz/login</code></p>
            <ul class="text-sm text-gray-300 space-y-1">
              <li>• Domínio falso (pay-pal-security-update.xyz)</li>
              <li>• Caminho enganoso</li>
              <li>• Possível certificado inválido</li>
              <li>• Tentativa de parecer legítimo</li>
            </ul>
          </div>
        </div>
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20 mb-6">
          <h4 class="text-white font-bold mb-3 flex items-center">
            <span className="mr-2">💡</span> Dicas para Verificação de URLs
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
                <td class="py-2 px-4 text-sm text-gray-300 font-medium">Hover Test</td>
                <td class="py-2 px-4 text-sm text-gray-300">Passar mouse sobre o link para ver URL real</td>
                <td class="py-2 px-4 text-sm text-green-400">Alta (Desktop)</td>
              </tr>
              <tr>
                <td class="py-2 px-4 text-sm text-gray-300 font-medium">URL Decoder</td>
                <td class="py-2 px-4 text-sm text-gray-300">Ferramentas para decodificar URLs encurtadas</td>
                <td class="py-2 px-4 text-sm text-green-400">Alta</td>
              </tr>
              <tr>
                <td class="py-2 px-4 text-sm text-gray-300 font-medium">Certificado SSL</td>
                <td class="py-2 px-4 text-sm text-gray-300">Verificar se o site tem certificado válido</td>
                <td class="py-2 px-4 text-sm text-yellow-400">Média (Pode ser falso)</td>
              </tr>
              <td class="py-2 px-4 text-sm text-gray-300 font-medium">WHOIS Lookup</td>
                <td class="py-2 px-4 text-sm text-gray-300">Verificar informações de registro do domínio</td>
                <td class="py-2 px-4 text-sm text-green-400">Alta</td>
              </tr>
            </tbody>
          </table>
        </div>
      `
    },
    {
      title: "2. Phishing via QR Code (Quishing)",
      content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">A Nova Ameaça de 2026:</h4>
            <p class="text-sm text-gray-300">
                Os criminosos agora enviam QR Codes por e-mail ou Discord. O objetivo é tirar o link do seu PC (onde você tem antivírus e proteções de navegador) e levá-lo para o celular, onde é muito mais difícil conferir a URL real. <strong>Nunca escaneie QR Codes de origens não solicitadas</strong>, mesmo que pareçam um brinde de jogo ou aviso de segurança.
            </p>
        </div>
        <h3 class="text-xl font-bold text-white mt-6 mb-4">Técnicas de Quishing em 2026</h3>
        <div class="space-y-6">
          <div class="border-l-4 border-green-500 pl-4 py-1">
            <h4 class="text-lg font-semibold text-white mb-2">QR Codes em E-mails e Mensagens</h4>
            <p class="text-gray-300 text-sm mb-2">Criminosos enviam QR Codes em e-mails fraudulentos ou mensagens de texto que direcionam para sites de phishing.</p>
            <ol class="list-decimal list-inside text-gray-300 space-y-1 text-sm">
              <li>E-mails que parecem de instituições legítimas com QR Codes para "verificação de conta"</li>
              <li>Mensagens de "entrega pendente" com QR Codes para rastreamento</li>
              <li>Anúncios de promoções com QR Codes para "resgatar prêmios"</li>
              <li>Documentos que exigem validação via QR Code</li>
            </ol>
          </div>
          <div class="border-l-4 border-purple-500 pl-4 py-1">
            <h4 class="text-lg font-semibold text-white mb-2">QR Codes em Locais Públicos</h4>
            <p class="text-gray-300 text-sm mb-2">QR Codes colados ilegalmente em locais públicos, como pontos de ônibus ou outdoors falsos.</p>
            <ol class="list-decimal list-inside text-gray-300 space-y-1 text-sm">
              <li>QR Codes em panfletos ou cartazes suspeitos</li>
              <li>Substituição de QR Codes legítimos em estabelecimentos</li>
              <li>QR Codes promocionais em eventos públicos fraudulentos</li>
              <li>Códigos em embalagens falsas ou produtos duvidosos</li>
            </ol>
          </div>
          <div class="border-l-4 border-indigo-500 pl-4 py-1">
            <h4 class="text-lg font-semibold text-white mb-2">QR Codes em Redes Sociais</h4>
            <p class="text-gray-300 text-sm mb-2">Posts ou stories com QR Codes que direcionam para páginas fraudulentas.</p>
            <ol class="list-decimal list-inside text-gray-300 space-y-1 text-sm">
              <li>Perfis falsos compartilhando QR Codes "promocionais"</li>
              <li>Stories com QR Codes para "desbloquear" conteúdo premium</li>
              <li>Comentários com QR Codes em posts populares</li>
              <li>QR Codes em lives ou vídeos suspeitos</li>
            </ol>
          </div>
        </div>
      `
    },
    {
      title: "3. URLs com caracteres especiais (Punycode)",
      content: `
        <p class="mb-4 text-gray-300">
            Hackers usam letras de outros alfabetos que são idênticas às nossas. 
            <br/><br/>Por exemplo, o "а" (cirílico) parece igual ao nosso "a". Um site pode ser <code>аpple.com</code> e você não perceberia a diferença visualmente. 
            <br/><strong>Dica:</strong> Sempre que for fazer login em sites importantes (Banco, Steam, Google), nunca clique em links. Digite o endereço manualmente na barra do navegador.
        </p>
        <div class="bg-red-900/20 p-4 rounded-lg border-l-4 border-red-500 my-6">
          <p class="text-red-200 font-semibold">Técnicas de Homograph Attack:</p>
          <p class="text-gray-300 mt-2">Essas técnicas utilizam caracteres Unicode que parecem idênticos aos caracteres ASCII normais, mas são diferentes. Isso é conhecido como homograph attack ou IDN (Internationalized Domain Names) spoofing.</p>
        </div>
        <h3 class="text-xl font-bold text-white mt-6 mb-4">Exemplos de Domínios Fraudulentos</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h4 class="font-bold text-green-400 mb-2">Legítimo</h4>
            <ul class="text-sm text-gray-300 space-y-2">
              <li><code>https://www.apple.com</code></li>
              <li><code>https://www.facebook.com</code></li>
              <li><code>https://www.paypal.com</code></li>
              <li><code>https://www.netflix.com</code></li>
            </ul>
          </div>
          <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h4 class="font-bold text-red-400 mb-2">Fraudulento (Homograph)</h4>
            <ul class="text-sm text-gray-300 space-y-2">
              <li><code>https://www.аррӏе.com</code> (cirílico)</li>
              <li><code>https://www.faceЬоок.com</code> (mistura de alfabetos)</li>
              <li><code>https://www.pаypаl.com</code> (letras cirílicas)</li>
              <li><code>https://www.nеtflix.com</code> ("е" cirílico)</li>
            </ul>
          </div>
        </div>
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20 mb-6">
          <h4 class="text-white font-bold mb-3 flex items-center">
            <span className="mr-2">📋</span> Como Prevenir Ataques de Homograph
          </h4>
          <ul class="text-sm text-gray-300 space-y-2">
            <li class="flex items-start">
              <span class="text-blue-400 mr-2">✓</span>
              <span>Desative o suporte a IDN em seu navegador (opcional)</span>
            </li>
            <li class="flex items-start">
              <span class="text-blue-400 mr-2">✓</span>
              <span>Digite manualmente os URLs de sites importantes</span>
            </li>
            <li class="flex items-start">
              <span class="text-blue-400 mr-2">✓</span>
              <span>Verifique o certificado SSL para ver os domínios válidos</span>
            </li>
            <li class="flex items-start">
              <span class="text-blue-400 mr-2">✓</span>
              <span>Use bookmarks para sites importantes em vez de links</span>
            </li>
            <li class="flex items-start">
              <span class="text-blue-400 mr-2">✓</span>
              <span>Instale extensões que destaquem domínios suspeitos</span>
            </li>
          </ul>
        </div>
      `
    },
    {
      title: "4. Análise de Cabeçalhos de E-mail e Rastreamento de Origem",
      content: `
        <p class="mb-4 text-gray-300">
          Para e-mails que chegam à sua caixa de entrada, é possível examinar os cabeçalhos para determinar a origem real da mensagem. Em 2026, mesmo e-mails que parecem vir de contas legítimas podem ter sido falsificados através de técnicas de spoofing.
        </p>
        <h3 class="text-xl font-bold text-white mt-6 mb-4">Campos Importantes nos Cabeçalhos de E-mail</h3>
        <div class="space-y-4 mb-6">
          <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h4 class="font-bold text-blue-400 mb-2 flex items-center">
              <span class="mr-2">📧</span> Return-Path e From
            </h4>
            <p class="text-gray-300 text-sm mb-2">Verifique se o remetente declarado coincide com o endereço real.</p>
            <ul class="text-sm text-gray-300 ml-5 space-y-1 list-disc">
              <li>O campo From pode ser facilmente falsificado</li>
              <li>O Return-Path mostra para onde respostas serão enviadas</li>
              <li>Verifique se o domínio é exatamente igual ao esperado</li>
            </ul>
          </div>
          <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h4 class="font-bold text-blue-400 mb-2 flex items-center">
              <span class="mr-2">🌐</span> Received Headers
            </h4>
            <p class="text-gray-300 text-sm mb-2">Mostra o caminho que o e-mail percorreu até chegar a você.</p>
            <ul class="text-sm text-gray-300 ml-5 space-y-1 list-disc">
              <li>Analise os IPs dos servidores por onde o e-mail passou</li>
              <li>Verifique se os servidores fazem sentido para o remetente alegado</li>
              <li>Identifique servidores suspeitos ou não autorizados</li>
            </ul>
          </div>
          <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h4 class="font-bold text-blue-400 mb-2 flex items-center">
              <span class="mr-2">🔒</span> SPF, DKIM e DMARC
            </h4>
            <p class="text-gray-300 text-sm mb-2">Protocolos de autenticação de e-mail que ajudam a validar a origem.</p>
            <ul class="text-sm text-gray-300 ml-5 space-y-1 list-disc">
              <li>SPF verifica se o servidor de envio está autorizado</li>
              <li>DKIM adiciona assinatura digital ao e-mail</li>
              <li>DMARC define políticas para tratamento de e-mails não autenticados</li>
            </ul>
          </div>
        </div>
        <div class="bg-green-900/20 p-4 rounded-lg border-l-4 border-green-500 my-6">
          <p class="text-green-200 font-semibold">Ferramentas de Análise de E-mail:</p>
          <p class="text-gray-300 mt-2">Existem ferramentas online que analisam os cabeçalhos de e-mail e verificam a autenticidade, como o MXToolbox, Mail-Tester e E-Mail Header Analyzer. Essas ferramentas podem ajudar a identificar e-mails fraudulentos.</p>
        </div>
      `
    },
    {
      title: "5. Técnicas de Análise Visual de Websites",
      content: `
        <p class="mb-4 text-gray-300">
          Sites de phishing muitas vezes tentam copiar fielmente sites legítimos, mas sempre apresentam diferenças sutis que podem ser identificadas com atenção. Em 2026, essas cópias estão cada vez mais convincentes graças ao uso de inteligência artificial.
        </p>
        <h3 class="text-xl font-bold text-white mt-6 mb-4">Elementos a Serem Verificados em Websites</h3>
        <div class="overflow-x-auto mb-6">
          <table class="min-w-full bg-gray-800/50 rounded-lg overflow-hidden">
            <thead class="bg-gray-700">
              <tr>
                <th class="py-2 px-4 text-left text-sm font-semibold text-gray-300">Elemento</th>
                <th class="py-2 px-4 text-left text-sm font-semibold text-gray-300">Característica Legítima</th>
                <th class="py-2 px-4 text-left text-sm font-semibold text-gray-300">Característica Fraudulenta</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-700">
              <tr>
                <td class="py-2 px-4 text-sm text-gray-300 font-medium">Layout e Design</td>
                <td class="py-2 px-4 text-sm text-gray-300">Consistente em todas as páginas</td>
                <td class="py-2 px-4 text-sm text-gray-300">Pequenas inconsistências ou qualidade inferior</td>
              </tr>
              <tr>
                <td class="py-2 px-4 text-sm text-gray-300 font-medium">Ícones e Logotipos</td>
                <td class="py-2 px-4 text-sm text-gray-300">Imagens de alta resolução e alinhamento perfeito</td>
                <td class="py-2 px-4 text-sm text-gray-300">Imagens pixeladas ou levemente distorcidas</td>
              </tr>
              <tr>
                <td class="py-2 px-4 text-sm text-gray-300 font-medium">Campos de Login</td>
                <td class="py-2 px-4 text-sm text-gray-300">Campos bem posicionados e funcionais</td>
                <td class="py-2 px-4 text-sm text-gray-300">Campos mal posicionados ou campos extras</td>
              </tr>
              <tr>
                <td class="py-2 px-4 text-sm text-gray-300 font-medium">Rodapé e Links</td>
                <td class="py-2 px-4 text-sm text-gray-300">Links para políticas, termos e contatos</td>
                <td class="py-2 px-4 text-sm text-gray-300">Links ausentes ou direcionando para domínios diferentes</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20 mb-6">
          <h4 class="text-white font-bold mb-3 flex items-center">
            <span className="mr-2">🔍</span> Dicas para Análise Visual
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
              <h5 class="font-bold text-white mb-2">Verificação de Segurança</h5>
              <p class="text-gray-300 text-sm">Sempre verifique o cadeado na barra de endereços e o nome da organização no certificado SSL.</p>
            </div>
            <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
              <h5 class="font-bold text-white mb-2">Comportamento da Página</h5>
              <p class="text-gray-300 text-sm">Sites legítimos não redirecionam automaticamente após digitar credenciais.</p>
            </div>
          </div>
        </div>
      `
    },
    {
      title: "6. Técnicas de Phishing em Plataformas Específicas",
      content: `
        <p class="mb-4 text-gray-300">
          Em 2026, os criminosos adaptaram suas técnicas de phishing para explorar especificamente as funcionalidades e confiança dos usuários em plataformas populares como redes sociais, serviços de e-mail e plataformas de jogos.
        </p>
        <h3 class="text-xl font-bold text-white mt-6 mb-4">Phishing em Plataformas Populares</h3>
        <div class="space-y-4 mb-6">
          <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h4 class="font-bold text-blue-400 mb-2 flex items-center">
              <span class="mr-2">💬</span> Discord e Plataformas de Jogos
            </h4>
            <p class="text-gray-300 text-sm mb-2">Técnicas específicas usadas nestas plataformas.</p>
            <ul class="text-sm text-gray-300 ml-5 space-y-1 list-disc">
              <li>Golpes do "Nitro grátis" com links para "resgate" de benefícios</li>
              <li>Convites para servidores falsos que simulam concursos ou promoções</li>
              <li>DMs de "moderadores" solicitando verificação de conta</li>
              <li>Links para "skins grátis" que redirecionam para páginas de login falsas</li>
            </ul>
          </div>
          <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h4 class="font-bold text-blue-400 mb-2 flex items-center">
              <span class="mr-2">📧</span> Serviços de E-mail (Gmail, Outlook, etc.)
            </h4>
            <p class="text-gray-300 text-sm mb-2">Táticas usadas para contornar filtros de spam.</p>
            <ul class="text-sm text-gray-300 ml-5 space-y-1 list-disc">
              <li>Uso de modelos HTML que imitam layouts de e-mails legítimos</li>
              <li>Assuntos que simulam notificações de sistemas conhecidos</li>
              <li>Imagens embebidas para evitar detecção por filtros de texto</li>
              <li>Domínios free usados como intermediários para contornar segurança</li>
            </ul>
          </div>
          <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h4 class="font-bold text-blue-400 mb-2 flex items-center">
              <span class="mr-2">🏦</span> Bancos e Instituições Financeiras
            </h4>
            <p class="text-gray-300 text-sm mb-2">Estratégias para explorar a urgência e o medo do cliente.</p>
            <ul class="text-sm text-gray-300 ml-5 space-y-1 list-disc">
              <li>E-mails de "bloqueio de conta" com prazo limitado para ação</li>
              <li>Notificações de "transações suspeitas" com links para "desbloqueio"</li>
              <li>Chamadas de "atualização de segurança" com solicitação de dados</li>
              <li>Alertas de "fraude detectada" com solicitação de confirmação imediata</li>
            </ul>
          </div>
        </div>
        <div class="bg-yellow-900/20 p-4 rounded-lg border-l-4 border-yellow-500 my-6">
          <p class="text-yellow-200 font-semibold">Prevenção por Plataforma:</p>
          <p class="text-gray-300 mt-2">Cada plataforma tem recursos de segurança específicos. Por exemplo, no Discord, verifique se o servidor tem verificação adequada e membros reais. Nos serviços de e-mail, habilite autenticação de dois fatores e verifique regularmente dispositivos conectados.</p>
        </div>
      `
    },
    {
      title: "7. Recursos e Ferramentas de Verificação",
      content: `
        <p class="mb-4 text-gray-300">
          Em 2026, existem diversas ferramentas e recursos que podem auxiliar na identificação de e-mails e sites fraudulentos. Utilizar essas ferramentas é uma prática recomendada para aumentar sua segurança digital.
        </p>
        <h3 class="text-xl font-bold text-white mt-6 mb-4">Ferramentas de Verificação Disponíveis</h3>
        <div class="space-y-4 mb-6">
          <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h4 class="font-bold text-blue-400 mb-2 flex items-center">
              <span class="mr-2">🔍</span> Verificadores de URL
            </h4>
            <p class="text-gray-300 text-sm mb-2">Ferramentas para analisar a segurança de URLs.</p>
            <ul class="text-sm text-gray-300 ml-5 space-y-1 list-disc">
              <li><strong>VirusTotal:</strong> Analisa URLs e arquivos em busca de ameaças</li>
              <li><strong>URLVoid:</strong> Verifica domínios em múltiplos motores de segurança</li>
              <li><strong>IsItPhishing:</strong> Ferramenta especializada em detecção de phishing</li>
              <li><strong>Google Safe Browsing:</strong> Consulta a base de sites maliciosos do Google</li>
            </ul>
          </div>
          <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h4 class="font-bold text-blue-400 mb-2 flex items-center">
              <span class="mr-2">🛡️</span> Extensões de Navegador
            </h4>
            <p class="text-gray-300 text-sm mb-2">Extensões que ajudam a identificar e bloquear tentativas de phishing.</p>
            <ul class="text-sm text-gray-300 ml-5 space-y-1 list-disc">
              <li><strong>Netcraft Extension:</strong> Identifica sites fraudulentos</li>
              <li><strong>McAfee WebAdvisor:</strong> Avaliação de segurança de sites</li>
              <li><strong>WOT (Web of Trust):</strong> Avaliação comunitária de sites</li>
              <li><strong>uBlock Origin:</strong> Bloqueia trackers e domínios maliciosos</li>
            </ul>
          </div>
          <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h4 class="font-bold text-blue-400 mb-2 flex items-center">
              <span class="mr-2">📱</span> Aplicativos Móveis
            </h4>
            <p class="text-gray-300 text-sm mb-2">Aplicativos que ajudam a verificar a segurança de links e sites.</p>
            <ul class="text-sm text-gray-300 ml-5 space-y-1 list-disc">
              <li><strong>Avast SecureLine VPN:</strong> Proteção contra sites maliciosos</li>
              <li><strong>Lookout Security:</strong> Identifica aplicativos e sites perigosos</li>
              <li><strong>PhishAlarm:</strong> Denúncia e verificação de e-mails de phishing</li>
              <li><strong>QR & Barcode Scanner:</strong> Scanners com verificação de segurança</li>
            </ul>
          </div>
        </div>
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20 mb-6">
          <h4 class="text-white font-bold mb-3 flex items-center">
            <span className="mr-2">✅</span> Melhores Práticas de Verificação
          </h4>
          <ul class="text-sm text-gray-300 space-y-2">
            <li class="flex items-start">
              <span class="text-blue-400 mr-2">•</span>
              <span>Verifique URLs antes de clicar, especialmente em e-mails</span>
            </li>
            <li class="flex items-start">
              <span class="text-blue-400 mr-2">•</span>
              <span>Use múltiplas ferramentas para verificação de segurança</span>
            </li>
            <li class="flex items-start">
              <span class="text-blue-400 mr-2">•</span>
              <span>Mantenha seu navegador e extensões atualizados</span>
            </li>
            <li class="flex items-start">
              <span class="text-blue-400 mr-2">•</span>
              <span>Desconfie de links em mensagens de contatos não verificados</span>
            </li>
            <li class="flex items-start">
              <span class="text-blue-400 mr-2">•</span>
              <span>Configure alertas de segurança para suas contas importantes</span>
            </li>
          </ul>
        </div>
      `
    }
  ];

  const faqItems = [
    {
      question: "O que é phishing e como ele funciona?",
      answer: `
        <p class="text-gray-300 mb-2">Phishing é uma técnica de fraude cibernética que visa obter informações pessoais e financeiras de usuários por meio de mensagens fraudulentas que simulam instituições legítimas. Os criminosos criam e-mails, sites ou mensagens que parecem confiáveis para induzir as vítimas a fornecer dados sensíveis como senhas, números de cartão de crédito e informações pessoais.</p>
        <p class="text-gray-300">Em 2026, os ataques de phishing utilizam inteligência artificial para criar mensagens altamente personalizadas e convincentes, tornando-os mais difíceis de identificar.</p>
      `
    },
    {
      question: "Como posso identificar um e-mail de phishing?",
      answer: `
        <p class="text-gray-300 mb-2">Sinais comuns de e-mails de phishing incluem:</p>
        <ul class="list-disc list-inside text-gray-300 space-y-1 mb-2">
          <li>Solicitações urgentes de informações pessoais ou financeiras</li>
          <li>Erros de ortografia ou gramática (menos comum em 2026)</li>
          <li>Links que não correspondem ao texto exibido</li>
          <li>Remetente desconhecido ou que parece falso</li>
          <li>Assuntos alarmantes como "conta bloqueada" ou "atividade suspeita"</li>
        </ul>
        <p class="text-gray-300">Em 2026, os e-mails de phishing são mais sofisticados, por isso é importante verificar cuidadosamente os cabeçalhos e os domínios dos links.</p>
      `
    },
    {
      question: "O que é quishing e como me proteger?",
      answer: `
        <p class="text-gray-300 mb-2">Quishing é phishing realizado por meio de QR Codes (Quick Response). Em 2026, os criminosos enviam QR Codes por e-mail ou mensagens que direcionam para sites de phishing. O objetivo é levar você do seu PC (com proteções) para o celular (onde é mais difícil verificar a segurança).</p>
        <p class="text-gray-300">Para se proteger, nunca escaneie QR Codes de origens não solicitadas, mesmo que pareçam promessas de brindes ou avisos de segurança. Use scanners de QR Code que mostrem a URL antes de abrir.</p>
      `
    },
    {
      question: "Como posso verificar se um site é seguro antes de inserir minhas credenciais?",
      answer: `
        <p class="text-gray-300 mb-2">Para verificar a segurança de um site:</p>
        <ul class="list-disc list-inside text-gray-300 space-y-1 mb-2">
          <li>Verifique se o URL começa com HTTPS e há um cadeado na barra de endereços</li>
          <li>Confirme se o nome do domínio está correto (sem caracteres semelhantes)</li>
          <li>Analise o layout e design - cópias de sites costumam ter pequenas inconsistências</li>
          <li>Use ferramentas de verificação de segurança como VirusTotal ou URLVoid</li>
        </ul>
        <p class="text-gray-300">O melhor método é digitar o URL manualmente em vez de clicar em links de origem duvidosa.</p>
      `
    },
    {
      question: "O que é um ataque de homograph e como evitá-lo?",
      answer: `
        <p class="text-gray-300 mb-2">Um ataque de homograph (ou IDN spoofing) utiliza caracteres Unicode que parecem idênticos aos caracteres ASCII normais, mas são diferentes. Por exemplo, a letra cirílica "а" parece idêntica ao nosso "a", mas são caracteres diferentes.</p>
        <p class="text-gray-300">Para evitar, digite manualmente os URLs de sites importantes, use bookmarks confiáveis e instale extensões que destaquem domínios suspeitos. Verifique o certificado SSL para ver os domínios válidos.</p>
      `
    },
    {
      question: "Como analisar os cabeçalhos de um e-mail para identificar phishing?",
      answer: `
        <p class="text-gray-300 mb-2">Para analisar cabeçalhos de e-mail:</p>
        <ul class="list-disc list-inside text-gray-300 space-y-1 mb-2">
          <li>Verifique os campos Return-Path e From para ver se coincidem</li>
          <li>Analise os Received Headers para ver o caminho do e-mail</li>
          <li>Verifique os protocolos SPF, DKIM e DMARC</li>
          <li>Use ferramentas online como MXToolbox ou E-Mail Header Analyzer</li>
        </ul>
        <p class="text-gray-300">Esses campos podem revelar se o e-mail foi enviado de um servidor não autorizado ou se foi falsificado.</p>
      `
    },
    {
      question: "Quais são as técnicas de phishing em plataformas específicas como Discord ou redes sociais?",
      answer: `
        <p class="text-gray-300 mb-2">Em plataformas como Discord, os criminosos usam:</p>
        <ul class="list-disc list-inside text-gray-300 space-y-1 mb-2">
          <li>Golpes do "Nitro grátis" com links para "resgate" de benefícios</li>
          <li>Convites para servidores falsos que simulam concursos ou promoções</li>
          <li>DMs de "moderadores" solicitando verificação de conta</li>
          <li>Links para "skins grátis" que redirecionam para páginas de login falsas</li>
        </ul>
        <p class="text-gray-300">Nas redes sociais, há perfis falsos compartilhando links fraudulentos e anúncios enganosos. Sempre verifique a autenticidade de contas e links antes de interagir.</p>
      `
    },
    {
      question: "Quais ferramentas posso usar para verificar a segurança de um link ou site?",
      answer: `
        <p class="text-gray-300 mb-2">Ferramentas úteis para verificação de segurança incluem:</p>
        <ul class="list-disc list-inside text-gray-300 space-y-1 mb-2">
          <li>VirusTotal - analisa URLs e arquivos em busca de ameaças</li>
          <li>URLVoid - verifica domínios em múltiplos motores de segurança</li>
          <li>IsItPhishing - ferramenta especializada em detecção de phishing</li>
          <li>Extensões de navegador como Netcraft e McAfee WebAdvisor</li>
        </ul>
        <p class="text-gray-300">Essas ferramentas ajudam a identificar sites maliciosos antes de visitá-los.</p>
      `
    },
    {
      question: "O que devo fazer se clicar acidentalmente em um link de phishing?",
      answer: `
        <p class="text-gray-300 mb-2">Se clicar acidentalmente em um link de phishing:</p>
        <ul class="list-disc list-inside text-gray-300 space-y-1 mb-2">
          <li>NÃO digite nenhuma informação pessoal ou credenciais no site</li>
          <li>Feche a janela ou aba imediatamente</li>
          <li>Execute uma varredura completa do sistema com antivírus atualizado</li>
          <li>Verifique se há atividade suspeita em suas contas</li>
          <li>Altere senhas de contas importantes, especialmente se inseriu alguma credencial</li>
        </ul>
        <p class="text-gray-300">Mesmo que não tenha inserido informações, é prudente monitorar suas contas por alguns dias após o incidente.</p>
      `
    },
    {
      question: "Como posso proteger meus familiares e amigos contra phishing?",
      answer: `
        <p class="text-gray-300 mb-2">Para proteger seus familiares e amigos:</p>
        <ul class="list-disc list-inside text-gray-300 space-y-1 mb-2">
          <li>Eduque-os sobre os sinais de phishing e como identificar e-mails suspeitos</li>
          <li>Ensine-os a nunca clicar em links de origens desconhecidas</li>
          <li>Mostre como verificar URLs e certificados de segurança</li>
          <li>Ajude-os a configurar autenticação de dois fatores em todas as contas</li>
          <li>Instale extensões de segurança em seus navegadores</li>
        </ul>
        <p class="text-gray-300">A educação e conscientização são as melhores defesas contra o phishing.</p>
      `
    },
    {
      question: "Quais são as consequências de cair em um golpe de phishing?",
      answer: `
        <p class="text-gray-300 mb-2">As consequências de cair em um golpe de phishing podem incluir:</p>
        <ul class="list-disc list-inside text-gray-300 space-y-1 mb-2">
          <li>Roubo de identidade e acesso a contas pessoais</li>
          <li>Perda financeira por fraude em contas bancárias</li>
          <li>Exposição de informações pessoais e profissionais</li>
          <li>Instalação de malware no dispositivo</li>
          <li>Comprometimento de contas de redes sociais e e-mail</li>
        </ul>
        <p class="text-gray-300">Em casos empresariais, pode resultar em vazamento de dados de clientes e perdas financeiras significativas.</p>
      `
    },
    {
      question: "Como as empresas podem prevenir ataques de phishing internos?",
      answer: `
        <p class="text-gray-300 mb-2">As empresas podem prevenir ataques de phishing internos:</p>
        <ul class="list-disc list-inside text-gray-300 space-y-1 mb-2">
          <li>Realizando treinamentos regulares de conscientização em segurança</li>
          <li>Implementando autenticação multifatorial em todos os sistemas</li>
          <li>Utilizando soluções de filtragem de e-mail avançadas</li>
          <li>Realizando simulações de phishing para testar a preparação dos funcionários</li>
          <li>Estabelecendo políticas claras sobre compartilhamento de informações</li>
        </ul>
        <p class="text-gray-300">A combinação de tecnologia e educação é essencial para uma defesa eficaz contra phishing corporativo.</p>
      `
    }
  ];

  const externalReferences = [
    {
      name: "Anti-Phishing Working Group (APWG)",
      url: "https://apwg.org/"
    },
    {
      name: "Federal Trade Commission - Phishing Protection",
      url: "https://www.ftc.gov/news-events/topics/scams/phishing"
    },
    {
      name: "CISA - How to Identify and Protect Yourself from Phishing",
      url: "https://www.cisa.gov/phishing"
    },
    {
      name: "Mozilla - Security Tips - Avoiding Phishing Scams",
      url: "https://www.mozilla.org/en-US/firefox/security-tips/"
    }
  ];

  const relatedGuides = [
    {
      href: "/guias/autenticacao-dois-fatores",
      title: "Ativar 2FA",
      description: "A sua barreira final contra o phishing."
    },
    {
      href: "/guias/seguranca-senhas-gerenciadores",
      title: "Gerenciar Senhas",
      description: "Use ferramentas que preenchem apenas sites reais."
    },
    {
      href: "/guias/remocao-virus-malware",
      title: "Limpeza de Vírus",
      description: "O que fazer se você clicou no link falso."
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
      summaryTable={summaryTable}
      faqItems={faqItems}
      externalReferences={externalReferences}
      relatedGuides={relatedGuides}
    />
  );
}
