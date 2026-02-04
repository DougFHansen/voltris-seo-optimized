import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Criptografia de Dados: Como Proteger seus Arquivos em 2026";
const description = "Quer manter seus documentos privados a salvo de olhares curiosos? Aprenda as melhores ferramentas de criptografia para Windows 11 em 2026.";
const keywords = [
  'como criptografar arquivos e pastas windows 11 2026',
  'melhores programas de criptografia gratuita tutorial',
  'veracrypt tutorial passo a passo 2026 guia',
  'criptografar pendrive com senha tutorial completo',
  'proteger documentos sensiveis no pc guia 2026'
];

export const metadata: Metadata = createGuideMetadata('criptografia-dados', title, description, keywords);

export default function EncryptionGuide() {
  const summaryTable = [
    { label: "Nível Básico", value: "Criptografia Diferencial do Windows (EFS)" },
    { label: "Nível Médio", value: "BitLocker (Versões Pro do Windows)" },
    { label: "Nível Avançado", value: "VeraCrypt (Open Source / Máxima Segurança)" },
    { label: "Dificuldade", value: "Médio" }
  ];

  const contentSections = [
    {
      title: "Privacidade na Era Digital de 2026",
      content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Em 2026, salvar seus arquivos sem proteção é um risco enorme. Se o seu notebook for roubado, quem estiver com ele poderá acessar suas fotos, senhas salvas em navegadores e documentos bancários bastando apenas conectar o seu HD em outro computador. A **criptografia** transforma seus dados em um código ilegível que só pode ser decifrado por quem tiver a senha mestra.
        </p>
      `
    },
    {
      title: "1. VeraCrypt: O sucessor do TrueCrypt",
      content: `
        <p class="mb-4 text-gray-300">A ferramenta preferida de especialistas em 2026:</p>
        <p class="text-sm text-gray-300">
            O <strong>VeraCrypt</strong> é um software de código aberto que permite criar "contêineres" criptografados. Imagine um arquivo que, quando aberto com o VeraCrypt e a senha correta, aparece no Windows como um novo disco (ex: Disco Z:). <br/><br/>
            - <strong>Vantagem:</strong> É imune a acessos até de agências de inteligência se a senha for forte. <br/>
            - <strong>Uso no Pendrive:</strong> Você pode criptografar um pendrive inteiro, garantindo que se ele for perdido, ninguém verá o conteúdo.
        </p>
      `
    },
    {
      title: "2. Criptografia Nativa do Windows (EFS)",
      content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Proteção Rápida de Pastas:</h4>
            <p class="text-sm text-gray-300">
                1. Clique com o botão direito numa pasta e vá em **Propriedades**. <br/>
                2. Clique em **Avançados**. <br/>
                3. Marque a caixa <strong>'Criptografar o conteúdo para proteger os dados'</strong>. <br/><br/>
                Diferente do BitLocker, isso protege apenas os arquivos selecionados. **Cuidado:** Se você formatar o Windows e não tiver feito backup da sua chave de segurança do EFS, você nunca mais conseguirá abrir esses arquivos.
            </p>
        </div>
      `
    },
    {
      title: "3. Boas Práticas de Senhas em 2026",
      content: `
        <p class="mb-4 text-gray-300">
            <strong>O elo mais fraco:</strong> 
            <br/><br/>A criptografia mais forte do mundo não serve de nada se a sua senha for "123456". Em 2026, com o uso de IA para quebrar senhas (brute force), use frases longas no lugar de palavras curtas. <br/><br/>
            Exemplo: <i>"Meu_Gato_Preto_Comeu_2_Peixes_Em_2026"</i> é infinitamente mais difícil de quebrar do que uma senha complexa curta como <i>"G@to2026!"</i>.
        </p>
      `
    },
    {
      title: "4. BitLocker: Criptografia de Disco Inteiro do Windows",
      content: `
        <p class="mb-4 text-gray-300">
          O <strong>BitLocker</strong> é a solução de criptografia de disco completo do Windows, disponível nas versões Pro, Enterprise e Education. Ele criptografa o disco inteiro (ou volumes individuais) e oferece proteção contra acesso físico não autorizado.
        </p>
        
        <h4 class="text-white font-bold mb-3 mt-6">⚙️ Como Ativar o BitLocker no Windows 11</h4>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4">
          <li>Acesse <strong>Painel de Controle > Sistema e Segurança > BitLocker</strong> ou procure por "BitLocker" no menu Iniciar.</li>
          <li>Selecione o disco que deseja criptografar (normalmente C: para o disco do sistema).</li>
          <li>Escolha como deseja desbloquear o disco: senha ou smart card.</li>
          <li>O Windows solicitará que você faça backup da chave de recuperação. <strong>Essa etapa é crucial!</strong> Armazene em local seguro (impresso, nuvem criptografada ou pendrive).</li>
          <li>Escolha o modo de criptografia (recomendado: XTS-AES 256-bit).</li>
          <li>Clique em "Criptografar disco" e aguarde o processo (pode levar horas em discos grandes).</li>
        </ol>
        
        <div class="bg-amber-900/10 p-5 rounded-xl border border-amber-500/20 mt-6">
          <h4 class="text-amber-400 font-bold mb-2">⚠️ Cuidados Importantes com o BitLocker</h4>
          <ul class="list-disc list-inside text-sm text-gray-300 space-y-1">
            <li>Sempre mantenha sua chave de recuperação em local seguro e acessível</li>
            <li>Não formate o Windows sem ter acesso à chave de recuperação</li>
            <li>Verifique se o TPM (Trusted Platform Module) está ativado na BIOS para melhor segurança</li>
            <li>Desative o BitLocker antes de trocar placas-mãe ou fazer upgrades que possam afetar a inicialização</li>
          </ul>
        </div>
      `
    },
    {
      title: "5. Criptografia em Nuvem: Protegendo Dados Online",
      content: `
        <p class="mb-4 text-gray-300">
          Com o aumento do armazenamento em nuvem, a criptografia de dados antes de enviar para serviços como Google Drive, OneDrive ou Dropbox se tornou essencial. A criptografia de ponta a ponta (E2E) garante que nem mesmo os provedores de nuvem possam acessar seus dados.
        </p>
        
        <h4 class="text-white font-bold mb-3 mt-6">🔐 Soluções de Criptografia para Nuvem</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div class="bg-gray-800/50 p-5 rounded-xl border border-gray-600">
            <h5 class="text-white font-bold mb-3">Cryptomator</h5>
            <p class="text-gray-300 text-sm mb-3">
              Ferramenta gratuita e open-source que cria "vaults" criptografados em qualquer serviço de nuvem. Funciona como uma pasta virtual criptografada que você monta quando precisa acessar seus arquivos.
            </p>
            <ul class="list-disc list-inside text-sm text-gray-300 space-y-1">
              <li>Compatível com Google Drive, OneDrive, Dropbox, etc.</li>
              <li>Sem armazenamento adicional necessário</li>
              <li>Chave de criptografia local (serviços não têm acesso)</li>
            </ul>
          </div>
          
          <div class="bg-gray-800/50 p-5 rounded-xl border border-gray-600">
            <h5 class="text-white font-bold mb-3">Boxcryptor</h5>
            <p class="text-gray-300 text-sm mb-3">
              Solução comercial com interface mais amigável, suporte a mais serviços e funcionalidades avançadas de compartilhamento.
            </p>
            <ul class="list-disc list-inside text-sm text-gray-300 space-y-1">
              <li>Interface intuitiva</li>
              <li>Suporte a mais serviços de nuvem</li>
              <li>Compartilhamento seguro de arquivos criptografados</li>
            </ul>
          </div>
        </div>
      `
    },
    {
      title: "6. Criptografia de Disco em SSDs e NVMe",
      content: `
        <p class="mb-4 text-gray-300">
          Muitos SSDs modernos possuem criptografia de hardware nativa, que é mais rápida e eficiente do que a criptografia por software. Esta funcionalidade, chamada de Self-Encrypting Drive (SED), utiliza o padrão IEEE 1667 ou Opal para proteger os dados.
        </p>
        
        <h4 class="text-white font-bold mb-3 mt-6">🔒 Vantagens da Criptografia de Hardware</h4>
        <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4">
          <li><strong>Performance:</strong> Não afeta o desempenho do SSD (criptografia ocorre no hardware)</li>
          <li><strong>Segurança:</strong> Chave criptográfica armazenada no próprio chip do SSD</li>
          <li><strong>Transparência:</strong> Sistema operacional não precisa saber que os dados estão criptografados</li>
          <li><strong>Reset seguro:</strong> Pode apagar a chave criptográfica rapidamente, tornando todos os dados inacessíveis</li>
        </ul>
        
        <h4 class="text-white font-bold mb-3 mt-6">🔧 Ativação em SSDs Suportados</h4>
        <p class="mb-4 text-gray-300">
          A ativação varia conforme o fabricante e modelo do SSD. Geralmente é feita através de ferramentas específicas como:
        </p>
        <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4">
          <li><strong>Intel SSD Toolbox</strong> para SSDs Intel</li>
          <li><strong>Samsung Magician</strong> para SSDs Samsung</li>
          <li><strong>Tools específicos</strong> de outros fabricantes (Crucial, Western Digital, etc.)</li>
        </ul>
      `
    },
    {
      title: "7. Criptografia para Ambientes Corporativos",
      content: `
        <p class="mb-4 text-gray-300">
          Em ambientes empresariais, a criptografia de dados deve ser gerenciada centralmente para garantir conformidade com regulamentações como LGPD, GDPR e SOX. Soluções corporativas oferecem deploy em larga escala, políticas centralizadas e auditoria de segurança.
        </p>
        
        <h4 class="text-white font-bold mb-3 mt-6">🏢 Soluções Corporativas de Criptografia</h4>
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-gray-300 border border-gray-700 rounded-lg overflow-hidden">
            <thead class="bg-gray-800">
              <tr>
                <th class="p-3 text-left">Solução</th>
                <th class="p-3 text-left">Tipo</th>
                <th class="p-3 text-left">Benefícios</th>
                <th class="p-3 text-left">Considerações</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-t border-gray-700">
                <td class="p-3"><strong>Microsoft BitLocker MDE</strong></td>
                <td class="p-3">Disco inteiro</td>
                <td class="p-3">Integração com Microsoft 365, políticas centralizadas</td>
                <td class="p-3">Requer licença Enterprise</td>
              </tr>
              <tr class="border-t border-gray-700 bg-gray-800/30">
                <td class="p-3"><strong>McAfee Endpoint Encryption</strong></td>
                <td class="p-3">Disco inteiro + arquivos</td>
                <td class="p-3">Multiplataforma, gestão centralizada</td>
                <td class="p-3">Custo elevado</td>
              </tr>
              <tr class="border-t border-gray-700">
                <td class="p-3"><strong>Symantec Endpoint Encryption</strong></td>
                <td class="p-3">Disco inteiro + arquivos</td>
                <td class="p-3">Alta segurança, conformidade regulatória</td>
                <td class="p-3">Curva de aprendizado</td>
              </tr>
              <tr class="border-t border-gray-700 bg-gray-800/30">
                <td class="p-3"><strong>IBM Security Guardium</strong></td>
                <td class="p-3">Dados em repouso e em trânsito</td>
                <td class="p-3">Proteção de dados sensíveis, auditoria</td>
                <td class="p-3">Mais complexo para pequenas organizações</td>
              </tr>
            </tbody>
          </table>
        </div>
      `
    },
    {
      title: "8. Criptografia e Desempenho: O Trade-off",
      content: `
        <p class="mb-4 text-gray-300">
          A criptografia adiciona uma camada de processamento que pode afetar o desempenho do sistema. No entanto, com os hardwares modernos, o impacto é geralmente mínimo graças a instruções criptográficas nativas nas CPUs.
        </p>
        
        <h4 class="text-white font-bold mb-3 mt-6">⚡ Impacto no Desempenho por Tipo de Criptografia</h4>
        <div class="space-y-4 mt-4">
          <div class="bg-green-900/10 p-5 rounded-xl border border-green-500/20">
            <h5 class="text-green-400 font-bold mb-2">Criptografia de Hardware (SEDs):</h5>
            <p class="text-gray-300 text-sm">
              <strong>Impacto:</strong> Praticamente nulo. A criptografia ocorre no controller do SSD, sem uso da CPU.
            </p>
          </div>
          
          <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h5 class="text-blue-400 font-bold mb-2">Criptografia de Software com AES-NI:</h5>
            <p class="text-gray-300 text-sm">
              <strong>Impacto:</strong> 2-5% em desempenho de disco. CPUs modernas (Intel/AMD pós-2015) têm instruções AES-NI que aceleram a criptografia.
            </p>
          </div>
          
          <div class="bg-amber-900/10 p-5 rounded-xl border border-amber-500/20">
            <h5 class="text-amber-400 font-bold mb-2">Criptografia de Software sem AES-NI:</h5>
            <p class="text-gray-300 text-sm">
              <strong>Impacto:</strong> 10-20% em desempenho de disco. CPUs antigas dependem da CPU para processamento criptográfico.
            </p>
          </div>
        </div>
        
        <div class="bg-purple-900/10 p-5 rounded-xl border border-purple-500/20 mt-6">
          <h4 class="text-purple-400 font-bold mb-2">🎮 Impacto em Jogos e Aplicações Intensivas</h4>
          <p class="text-sm text-gray-300">
            Para jogos e aplicações intensivas em I/O, a criptografia pode causar micro-stutters em sistemas com hardware mais antigo. Em SSDs modernos com criptografia de hardware (SEDs), o impacto é imperceptível na maioria dos casos.
          </p>
        </div>
      `
    }
  ];

  const advancedContentSections = [
    {
      title: "Criptografia e Protocolos de Segurança: Fundamentos Matemáticos",
      content: `
        <p class="mb-4 text-gray-300">
          A criptografia moderna baseia-se em princípios matemáticos complexos que garantem a segurança dos dados. Em 2026, os algoritmos utilizados são baseados em problemas matemáticos difíceis de resolver, como a fatoração de números primos grandes ou o problema do logaritmo discreto.
        </p>
        
        <h4 class="text-white font-bold mb-3 mt-6">🔐 Tipos de Criptografia e Suas Características</h4>
        <div class="overflow-x-auto mb-6">
          <table class="w-full text-sm text-gray-300 border-collapse">
            <thead>
              <tr class="bg-white/5 border-b border-white/10">
                <th class="px-4 py-3 text-left text-white font-bold">Tipo</th>
                <th class="px-4 py-3 text-left text-white font-bold">Características</th>
                <th class="px-4 py-3 text-left text-white font-bold">Vantagens</th>
                <th class="px-4 py-3 text-left text-white font-bold">Desvantagens</th>
                <th class="px-4 py-3 text-left text-white font-bold">Aplicações</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-white/5 hover:bg-white/5">
                <td class="px-4 py-3"><strong class="text-[#31A8FF]">Simétrica (AES)</strong></td>
                <td class="px-4 py-3">Mesma chave para criptografar/descriptografar</td>
                <td class="px-4 py-3 text-emerald-400">Rápida, eficiente, amplamente adotada</td>
                <td class="px-4 py-3 text-amber-400">Problema de distribuição de chaves</td>
                <td class="px-4 py-3">Criptografia de disco, arquivos</td>
              </tr>
              <tr class="border-b border-white/5 hover:bg-white/5">
                <td class="px-4 py-3"><strong class="text-[#31A8FF]">Assimétrica (RSA/ECC)</strong></td>
                <td class="px-4 py-3">Chaves pública e privada diferentes</td>
                <td class="px-4 py-3 text-emerald-400">Solução para distribuição de chaves</td>
                <td class="px-4 py-3 text-amber-400">Mais lenta, maior consumo de recursos</td>
                <td class="px-4 py-3">Troca de chaves, assinaturas digitais</td>
              </tr>
              <tr class="border-b border-white/5 hover:bg-white/5">
                <td class="px-4 py-3"><strong class="text-[#31A8FF]">Híbrida (TLS)</strong></td>
                <td class="px-4 py-3">Combina simétrica e assimétrica</td>
                <td class="px-4 py-3 text-emerald-400">O melhor dos dois mundos</td>
                <td class="px-4 py-3 text-amber-400">Complexidade de implementação</td>
                <td class="px-4 py-3">Conexões seguras (HTTPS, VPN)</td>
              </tr>
              <tr class="hover:bg-white/5">
                <td class="px-4 py-3"><strong class="text-[#31A8FF]">Pós-Quântica</strong></td>
                <td class="px-4 py-3">Resistente a computação quântica</td>
                <td class="px-4 py-3 text-emerald-400">Preparação para ameaça quântica</td>
                <td class="px-4 py-3 text-amber-400">Novos algoritmos em padronização</td>
                <td class="px-4 py-3">Futuro da criptografia</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">🧠 Fundamentos Matemáticos</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h5 class="text-blue-400 font-bold mb-3">Teoria dos Números</h5>
            <p class="text-gray-300 text-sm">
              Base para algoritmos como RSA, baseados na dificuldade de fatorar números compostos grandes em seus fatores primos.
            </p>
            <ul class="list-disc list-inside text-gray-300 text-sm mt-2 space-y-1">
              <li>Função totiente de Euler</li>
              <li>Teorema de Fermat</li>
              <li>Testes de primalidade</li>
              <li>Curvas elípticas</li>
            </ul>
          </div>
          
          <div class="bg-purple-900/10 p-5 rounded-xl border border-purple-500/20">
            <h5 class="text-purple-400 font-bold mb-3">Álgebra Linear e Campos Finitos</h5>
            <p class="text-gray-300 text-sm">
              Utilizados em algoritmos como AES, que opera em campos finitos GF(2^8).
            </p>
            <ul class="list-disc list-inside text-gray-300 text-sm mt-2 space-y-1">
              <li>Operações em GF(2^8)</li>
              <li>Substituição não-linear</li>
              <li>Transformações lineares</li>
              <li>MixColumns e ShiftRows</li>
            </ul>
          </div>
        </div>
      `
    },
    {
      title: "Implementações Avançadas de Criptografia em Sistemas Operacionais",
      content: `
        <p class="mb-4 text-gray-300">
          Os sistemas operacionais modernos implementam camadas complexas de criptografia integradas ao kernel, drivers e serviços de sistema. Em 2026, a criptografia não é mais uma funcionalidade adicional, mas sim um componente fundamental da arquitetura de segurança.
        </p>
        
        <h4 class="text-white font-bold mb-3 mt-6">🛡️ Arquitetura de Criptografia no Windows 11</h4>
        <div class="space-y-6">
          <div class="bg-[#0A0A0F] border border-white/10 rounded-xl p-6">
            <h5 class="text-[#31A8FF] font-bold mb-3">Kernel CryptoServices</h5>
            <p class="text-gray-300 text-sm mb-3">
              Camada de abstração que fornece primitivas criptográficas para componentes do sistema:
            </p>
            <ul class="list-disc list-inside text-gray-300 text-sm space-y-2 ml-4">
              <li><strong>CNG (Cryptography Next Generation):</strong> API moderna para operações criptográficas</li>
              <li><strong>BCrypt:</strong> Interface para algoritmos de criptografia, hashing e geração de chaves</li>
              <li><strong>NCrypt:</strong> Interface para provedores de chaves de hardware (TPM, smart cards)</li>
              <li><strong>WinTrust:</strong> Validação de assinaturas digitais e políticas de confiança</li>
            </ul>
          </div>
          
          <div class="bg-[#0A0A0F] border border-white/10 rounded-xl p-6">
            <h5 class="text-[#31A8FF] font-bold mb-3">Driver de Sistema de Arquivos Criptografado (EFS)</h5>
            <p class="text-gray-300 text-sm mb-3">
              Componente do NTFS que criptografa arquivos individualmente:
            </p>
            <ul class="list-disc list-inside text-gray-300 text-sm space-y-2 ml-4">
              <li>Utiliza criptografia híbrida (RSA para chave de sessão, DESX para dados)</li>
              <li>Chaves armazenadas no repositório de chaves do usuário</li>
              <li>Recuperação de chaves possível via agente de recuperação</li>
              <li>Integração com Active Directory para políticas de empresa</li>
            </ul>
          </div>
          
          <div class="bg-[#0A0A0F] border border-white/10 rounded-xl p-6">
            <h5 class="text-[#31A8FF] font-bold mb-3">BitLocker e TPM Integration</h5>
            <p class="text-gray-300 text-sm mb-3">
              Sistema de criptografia de disco com integração ao Trusted Platform Module:
            </p>
            <ul class="list-disc list-inside text-gray-300 text-sm space-y-2 ml-4">
              <li>Proteção de inicialização com validação de estado do sistema</li>
              <li>Armazenamento seguro de chaves no TPM</li>
              <li>Proteção contra ataques de inicialização fria</li>
              <li>Proteção de runtime (VBS, Hypervisor-protected code integrity)</li>
            </ul>
          </div>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">🔧 Implementações em Outros Sistemas</h4>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <div class="bg-gray-800/50 p-5 rounded-xl border border-gray-600">
            <h5 class="text-white font-bold mb-3">Linux (LUKS)</h5>
            <p class="text-gray-300 text-sm">
              <strong>Linux Unified Key Setup</strong> é o padrão para criptografia de disco no Linux.
            </p>
          </div>
          
          <div class="bg-gray-800/50 p-5 rounded-xl border border-gray-600">
            <h5 class="text-white font-bold mb-3">macOS (FileVault)</h5>
            <p class="text-gray-300 text-sm">
              Criptografia de disco baseada em XTS-AES 128 com chaves protegidas pelo Secure Enclave.
            </p>
          </div>
          
          <div class="bg-gray-800/50 p-5 rounded-xl border border-gray-600">
            <h5 class="text-white font-bold mb-3">Android/iOS</h5>
            <p class="text-gray-300 text-sm">
              Criptografia baseada em hardware com chaves armazenadas em TEE (Trusted Execution Environment).
            </p>
          </div>
        </div>
      `
    },
    {
      title: "Tendências Futuras em Criptografia e Segurança de Dados",
      content: `
        <p class="mb-4 text-gray-300">
          Com o avanço da computação quântica e novas ameaças cibernéticas, a criptografia está em constante evolução. Em 2026, novas abordagens estão sendo desenvolvidas para enfrentar desafios emergentes e garantir a proteção dos dados no futuro.
        </p>
        
        <h4 class="text-white font-bold mb-3 mt-6">⚛️ Criptografia Pós-Quântica</h4>
        <div class="space-y-6">
          <div class="bg-amber-900/10 p-5 rounded-xl border border-amber-500/20">
            <h5 class="text-amber-400 font-bold mb-3">Ameaça Quântica</h5>
            <p class="text-gray-300 text-sm mb-3">
              Computadores quânticos suficientemente poderosos poderão quebrar algoritmos clássicos como RSA e ECC usando o algoritmo de Shor:
            </p>
            <ul class="list-disc list-inside text-gray-300 text-sm space-y-1 ml-4">
              <li><strong>Estimativa:</strong> 2030-2040 para computadores quânticos capazes de quebrar RSA-2048</li>
              <li><strong>Impacto:</strong> Toda a infraestrutura criptográfica baseada em RSA/ECC seria comprometida</li>
              <li><strong>Preparação:</strong> Transição para algoritmos resistentes a quânticos é essencial</li>
            </ul>
          </div>
          
          <div class="bg-emerald-900/10 p-5 rounded-xl border border-emerald-500/20">
            <h5 class="text-emerald-400 font-bold mb-3">Algoritmos Pós-Quânticos em 2026</h5>
            <p class="text-gray-300 text-sm mb-3">
              O NIST já padronizou os primeiros algoritmos pós-quânticos para substituir RSA e ECC:
            </p>
            <ul class="list-disc list-inside text-gray-300 text-sm space-y-1 ml-4">
              <li><strong>Kyber:</strong> Para estabelecimento de chaves (alternativa ao Diffie-Hellman)</li>
              <li><strong>Dilithium:</strong> Para assinaturas digitais (alternativa ao RSA/ECDSA)</li>
              <li><strong>FALCON:</strong> Alternativa mais leve para assinaturas digitais</li>
              <li><strong>SPHINCS+:</strong> Assinatura baseada em hashes, como fallback</li>
            </ul>
          </div>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">🔍 Tendências Avançadas em 2026</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h5 class="text-blue-400 font-bold mb-3">Homomorphic Encryption</h5>
            <p class="text-gray-300 text-sm">
              Permite computação em dados criptografados sem descriptografá-los. Aplicações em nuvem segura e privacidade de dados.
            </p>
          </div>
          
          <div class="bg-purple-900/10 p-5 rounded-xl border border-purple-500/20">
            <h5 class="text-purple-400 font-bold mb-3">Zero-Knowledge Proofs</h5>
            <p class="text-gray-300 text-sm">
              Técnicas que permitem provar a veracidade de uma afirmação sem revelar informações adicionais. Usadas em blockchain e privacidade.
            </p>
          </div>
          
          <div class="bg-rose-900/10 p-5 rounded-xl border border-rose-500/20">
            <h5 class="text-rose-400 font-bold mb-3">Secure Multi-Party Computation</h5>
            <p class="text-gray-300 text-sm">
              Permite que múltiplas partes computem uma função conjunta sem revelar suas entradas privadas.
            </p>
          </div>
          
          <div class="bg-cyan-900/10 p-5 rounded-xl border border-cyan-500/20">
            <h5 class="text-cyan-400 font-bold mb-3">Attribute-Based Encryption</h5>
            <p class="text-gray-300 text-sm">
              Forma avançada de criptografia que permite controles de acesso baseados em atributos.
            </p>
          </div>
        </div>
        
        <div class="bg-[#0A0A0F] border border-[#FF4B6B]/20 rounded-xl p-6 mt-6">
          <h4 class="text-[#FF4B6B] font-bold mb-2">💡 Considerações para Implementação</h4>
          <p class="text-sm text-gray-300">
            A transição para criptografia pós-quântica é um processo gradual que exige planejamento cuidadoso. Organizações devem começar a preparar sua infraestrutura para suportar novos algoritmos enquanto mantêm compatibilidade com sistemas legados. A criptografia híbrida (clássica + pós-quântica) será uma abordagem comum durante a transição.
          </p>
        </div>
      `
    }
  ];

  const faqItems = [
    {
      question: "Qual é a diferença entre criptografia e compressão de arquivos?",
      answer: "<strong>Criptografia</strong> transforma dados em um formato ilegível para proteger a privacidade, enquanto <strong>compressão</strong> reduz o tamanho dos arquivos para economizar espaço. É possível ter ambos: arquivos criptografados e comprimidos (ex: um arquivo .zip criptografado). A criptografia protege contra acesso não autorizado, enquanto a compressão economiza espaço em disco."
    },
    {
      question: "O BitLocker é mais seguro que o VeraCrypt?",
      answer: "Ambos são seguros, mas têm finalidades diferentes: <strong>BitLocker</strong> criptografa o disco inteiro e se integra ao Windows com suporte a TPM (Trusted Platform Module), sendo mais conveniente para uso diário. <strong>VeraCrypt</strong> oferece mais flexibilidade (volumes ocultos, senhas plausíveis), é open-source e pode ser usado em qualquer sistema. Para segurança máxima, VeraCrypt tem mais opções avançadas, mas BitLocker é mais prático para uso corporativo."
    },
    {
      question: "Posso usar criptografia em pendrives USB?",
      answer: "Sim, e é altamente recomendado! Você pode usar <strong>VeraCrypt</strong> para criptografar um pendrive inteiro ou criar volumes criptografados dentro dele. Também é possível usar <strong>BitLocker To Go</strong> (nas versões Pro do Windows) para criptografar pendrives. Isso protege seus dados caso o pendrive seja perdido ou roubado."
    },
    {
      question: "O que acontece se eu esquecer a senha de um volume criptografado?",
      answer: "Infelizmente, <strong>não há como recuperar os dados</strong> se você esquecer a senha de um volume criptografado com algoritmos fortes como AES. A criptografia é projetada para ser irrecuperável sem a chave correta. Por isso, é essencial manter sua senha em local seguro e usar técnicas de memorização confiáveis ou gerenciadores de senhas."
    },
    {
      question: "Criptografia protege contra vírus e malware?",
      answer: "<strong>Não diretamente.</strong> A criptografia protege contra acesso físico não autorizado (alguém que pegue seu disco), mas não protege contra malware que já está no sistema e tem permissão para acessar os arquivos. Um vírus pode criptografar seus arquivos com uma senha diferente (ransomware) ou simplesmente apagar os dados. Criptografia e antivírus são complementares, não substitutos."
    },
    {
      question: "Como criar uma senha forte para criptografia?",
      answer: "Use frases longas em vez de palavras curtas: <em>\"Minha_Familia_Tem_5_Membros_E_Nascemos_em_2026\"</em> é mais seguro que <em>\"P@ssw0rd123\"</em>. Inclua números, símbolos e variações de maiúsculas/minúsculas. Use um gerenciador de senhas para gerar e armazenar senhas únicas e fortes. Quanto mais longa a frase, mais tempo levará para ser quebrada por força bruta."
    },
    {
      question: "Existe alguma maneira de acelerar a criptografia de disco?",
      answer: "A velocidade de criptografia depende principalmente da velocidade do disco e da CPU. Discos mais rápidos (SSDs NVMe) criptografam mais rapidamente que HDs tradicionais. CPUs com instruções AES-NI aceleram o processamento criptográfico. Algumas ferramentas permitem ajustar o uso de CPU durante a criptografia para não interferir em outras tarefas. A criptografia de hardware (SEDs) é a mais rápida, pois ocorre no controller do disco."
    },
    {
      question: "Posso criptografar um disco que já contém dados?",
      answer: "Sim, tanto o <strong>BitLocker</strong> quanto o <strong>VeraCrypt</strong> podem criptografar discos com dados existentes. O processo pode levar bastante tempo (horas ou dias para discos grandes), mas os dados permanecem acessíveis durante a criptografia. O Windows permite continuar usando o computador normalmente, embora o desempenho possa ser afetado durante o processo."
    },
    {
      question: "Criptografia de disco afeta o desempenho do SSD?",
      answer: "Em SSDs modernos com suporte a criptografia de hardware (SEDs), o impacto é praticamente nulo. Em SSDs sem criptografia de hardware, o impacto é pequeno (2-5%) se a CPU tiver instruções AES-NI. Em CPUs mais antigas, o impacto pode ser maior (10-20%). Para jogos e aplicações intensivas, a criptografia de hardware é a melhor opção."
    },
    {
      question: "Como verificar se meu disco está criptografado?",
      answer: "No Windows, vá ao <strong>Explorador de Arquivos</strong> e clique com botão direito no disco > <strong>Propriedades</strong>. Se o BitLocker estiver ativado, aparecerá uma opção para desativar. No caso de VeraCrypt, o volume criptografado aparece como uma unidade separada quando montado. Você também pode usar o PowerShell com o comando <em>Get-BitLockerVolume</em> para verificar o status de criptografia de todos os volumes."
    },
    {
      question: "Criptografia protege contra roubo de identidade?",
      answer: "A criptografia protege contra acesso físico aos dados no dispositivo roubado, impedindo que ladrões acessem suas informações pessoais, senhas e documentos. No entanto, se suas contas online já estiverem comprometidas (senhas vazadas, etc.), a criptografia do disco não protege contra roubo de identidade digital. É importante usar autenticação multifator (2FA) e gerenciadores de senhas para proteção completa."
    },
    {
      question: "Qual algoritmo de criptografia é mais seguro em 2026?",
      answer: "Em 2026, o <strong>AES (Advanced Encryption Standard)</strong> com chave de 256 bits é considerado o padrão ouro para criptografia simétrica. Tanto o VeraCrypt quanto o BitLocker usam AES-256. Outras opções seguras incluem Serpent e Twofish. Para criptografia assimétrica (chaves públicas/privadas), RSA-4096 e algoritmos pós-quânticos como CRYSTALS-Kyber estão ganhando adoção. O AES-256 é considerado seguro contra computação quântica no curto prazo."
    }
  ];

  const externalReferences = [
    { name: "VeraCrypt - Site Oficial", url: "https://www.veracrypt.fr/en/Home.html" },
    { name: "Microsoft BitLocker - Documentação", url: "https://docs.microsoft.com/en-us/windows/security/information-protection/bitlocker/bitlocker-overview" },
    { name: "NIST Guidelines on Cryptography", url: "https://csrc.nist.gov/publications/detail/sp/800-175b/final" },
    { name: "AES Encryption Explained", url: "https://csrc.nist.gov/pubs/fips/197/final" },
    { name: "Cryptomator - Criptografia para Nuvem", url: "https://cryptomator.org/" },
    { name: "IEEE 1667 Standard for SEDs", url: "https://standards.ieee.org/ieee/1667/6291/" },
    { name: "TPM Security Best Practices", url: "https://trustedcomputinggroup.org/resource/tpm-library-specification/" },
    { name: "LGPD - Lei Geral de Proteção de Dados", url: "https://www.gov.br/mds/pt-br/lgpd" },
    { name: "GDPR Compliance and Encryption", url: "https://gdpr-info.eu/art-32-gdpr/" },
    { name: "Quantum Computing and Cryptography", url: "https://csrc.nist.gov/projects/post-quantum-cryptography" }
  ];

  const relatedGuides = [
    {
      href: "/guias/seguranca-senhas-gerenciadores",
      title: "Gerenciar Senhas",
      description: "Armazene suas chaves de criptografia com segurança."
    },
    {
      href: "/guias/bitlocker-desempenho-jogos-ssd",
      title: "Impacto do BitLocker",
      description: "Entenda o custo de performance da criptografia."
    },
    {
      href: "/guias/autenticacao-dois-fatores",
      title: "Proteção 2FA",
      description: "Adicione mais camadas às suas contas."
    }
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="40 min"
      difficultyLevel="Intermediário"
      author="Equipe de Segurança Voltris"
      lastUpdated="2026-01-20"
      contentSections={contentSections}
      advancedContentSections={advancedContentSections}
      summaryTable={summaryTable}
      faqItems={faqItems}
      externalReferences={externalReferences}
      relatedGuides={[
        {
          href: "/guias/seguranca-senhas-gerenciadores",
          title: "Gerenciar Senhas",
          description: "Armazene suas chaves de criptografia com segurança."
        },
        {
          href: "/guias/bitlocker-desempenho-jogos-ssd",
          title: "Impacto do BitLocker",
          description: "Entenda o custo de performance da criptografia."
        },
        {
          href: "/guias/autenticacao-dois-fatores",
          title: "Proteção 2FA",
          description: "Adicione mais camadas às suas contas."
        },
        {
          href: "/guias/backup-dados",
          title: "Backup de Dados",
          description: "Aprenda a proteger cópias de segurança com criptografia."
        },
        {
          href: "/guias/protecao-ransomware",
          title: "Proteção contra Ransomware",
          description: "Como a criptografia ajuda a proteger contra criptovírus."
        },
        {
          href: "/guias/privacidade-windows-telemetria",
          title: "Privacidade no Windows",
          description: "Proteja sua privacidade além da criptografia."
        },
        {
          href: "/guias/firewall-configuracao",
          title: "Configuração de Firewall",
          description: "Adicione proteção de rede aos seus dados criptografados."
        }
      ]}
    />
  );
}