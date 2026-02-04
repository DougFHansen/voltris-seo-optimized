import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Teclado Desconfigurado: Como mudar para ABNT2 ou ANSI (2026)";
const description = "Seu teclado está trocando o @ pelo \" ou não tem o Ç? Aprenda como configurar o idioma e o layout do teclado no Windows 11 em 2026.";
const keywords = [
    'teclado desconfigurado abnt2 como resolver 2026',
    'mudar teclado para internacional estados unidos tutorial',
    'tutorial layout teclado windows 11 passo a passo',
    'teclado sem ç como configurar windows 11 2026',
    'atalho para mudar idioma teclado windows 11 guia'
];

export const metadata: Metadata = createGuideMetadata('teclado-desconfigurado-abnt2-ansi', title, description, keywords);

export default function KeyboardConfigGuide() {
    const summaryTable = [
        { label: "Layout ABNT2", value: "Possui tecla Ç e AltGr" },
        { label: "Layout ANSI (EUA)", value: "Não tem Ç / @ fica no '2'" },
        { label: "Atalho de Troca", value: "Win + Espaço" },
        { label: "Dificuldade", value: "Iniciante" }
    ];

    const contentSections = [
        {
            title: "O mistério das teclas trocadas",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Em 2026, com a popularização de teclados mecânicos importados, é muito comum comprar um teclado com o layout americano (ANSI) e tentar usá-lo com as configurações brasileiras (ABNT2). Isso faz com que os símbolos não correspondam ao que está impresso na tecla. Resolver isso no Windows 11 leva menos de um minuto, desde que você saiba exatamente qual layout o seu hardware possui.
        </p>
      `
        },
        {
            title: "1. Identificando seu Layout",
            content: `
        <p class="mb-4 text-gray-300">Antes de configurar, olhe para o seu teclado:</p>
        <ul class="list-disc list-inside text-gray-300 space-y-3">
            <li><strong>ABNT2:</strong> Tem a tecla 'Ç' e o 'Enter' tem formato de bota (grande). O '@' costuma ficar na tecla '2'.</li>
            <li><strong>Estados Unidos (Internacional):</strong> Não tem a tecla 'Ç'. O 'Enter' é uma barra horizontal pequena. O '@' fica no '2', mas os acentos funcionam de forma diferente (ex: apertar ' e depois 'c' para fazer 'ç').</li>
        </ul >
      `
        },
        {
            title: "2. Como configurar no Windows 11",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Passo a Passo:</h4>
            <p class="text-sm text-gray-300">
                1. Vá em Configurações > Hora e Idioma > <strong>Idioma e Região</strong>. <br/>
                2. Em 'Português (Brasil)', clique nos três pontos (...) e selecione <strong>Opções de Idioma</strong>. <br/>
                3. Role até 'Teclados' e clique em 'Adicionar um teclado'. <br/>
                4. Escolha 'Português (Brasil ABNT2)' ou 'Estados Unidos (Internacional)'. <br/>
                5. <strong>Dica:</strong> Remova os teclados que você não usa para evitar que o Windows troque sozinho durante o uso.
            </p>
        </div>
      `
        },
        {
            title: "3. O Atalho Mágico",
            content: `
        <p class="mb-4 text-gray-300">
            Se o seu teclado desconfigura "do nada" enquanto você joga ou digita:
            <br/><br/><strong>Atenção:</strong> O atalho <strong>Windows + Espaço</strong> alterna entre os layouts instalados. Em 2026, muitos usuários apertam isso acidentalmente. Se o seu teclado ficar louco, tente esse atalho para voltar ao layout correto imediatamente.
        </p>
      `
        }
    ];

    // Additional advanced content sections
    const advancedContentSections = [
        {
            title: "12. Arquitetura de Layout de Teclados",
            content: `
        <h4 class="text-white font-bold mb-3">🔧 Estrutura Técnica de Layouts de Teclado</h4>
        <p class="mb-4 text-gray-300">
            Em 2026, os layouts de teclados são definidos por padrões internacionais complexos que vão além da simples disposição física das teclas:
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
                <h5 class="text-blue-400 font-bold mb-3">Padrões Internacionais</h5>
                <ul class="text-sm text-gray-300 space-y-2">
                    <li>• ISO 9995: Padrão internacional para layouts de teclado</li>
                    <li>• ANSI INCITS 3-1969: Padrão americano</li>
                    <li>• ABNT NBR 10317: Padrão brasileiro</li>
                    <li>• JIS X 6002: Padrão japonês</li>
                    <li>• ISO/IEC 9995-3: Parte específica para disposição de teclas</li>
                </ul>
            </div>
            <div class="bg-purple-900/10 p-5 rounded-xl border border-purple-500/20">
                <h5 class="text-purple-400 font-bold mb-3">Mapeamento de Scancodes</h5>
                <ul class="text-sm text-gray-300 space-y-2">
                    <li>• Cada tecla tem um código físico único</li>
                    <li>• Os scancodes são interpretados pelo firmware</li>
                    <li>• O sistema operacional converte scancodes em caracteres</li>
                    <li>• Diferentes layouts mapeiam os mesmos scancodes para diferentes caracteres</li>
                    <li>• O mapeamento pode ser personalizado via arquivos .klc</li>
                </ul>
            </div>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">⚙️ Arquitetura de Mapeamento de Teclado</h4>
        <p class="mb-4 text-gray-300">
            O processo de conversão de pressionamento de tecla em caractere visível envolve múltiplas etapas:
        </p>
        <div class="overflow-x-auto">
            <table class="w-full text-sm text-gray-300 border border-gray-700 rounded-lg">
                <thead class="bg-gray-800">
                    <tr>
                        <th class="p-3 text-left">Etapa</th>
                        <th class="p-3 text-left">Descrição</th>
                        <th class="p-3 text-left">Componente</th>
                        <th class="p-3 text-left">Observações</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="border-t border-gray-700">
                        <td class="p-3">1. Hardware</td>
                        <td class="p-3">Scancode físico</td>
                        <td class="p-3">Teclado</td>
                        <td class="p-3">Código único da tecla pressionada</td>
                    </tr>
                    <tr class="border-t border-gray-700 bg-gray-800/30">
                        <td class="p-3">2. Firmware</td>
                        <td class="p-3">Tratamento inicial</td>
                        <td class="p-3">Controlador do teclado</td>
                        <td class="p-3">Processamento de combinações</td>
                    </tr>
                    <tr class="border-t border-gray-700">
                        <td class="p-3">3. Driver</td>
                        <td class="p-3">Tradução para o SO</td>
                        <td class="p-3">Driver HID</td>
                        <td class="p-3">Envio para sistema operacional</td>
                    </tr>
                    <tr class="border-t border-gray-700 bg-gray-800/30">
                        <td class="p-3">4. Sistema</td>
                        <td class="p-3">Mapeamento de layout</td>
                        <td class="p-3">Serviço de entrada</td>
                        <td class="p-3">Aplicação do layout configurado</td>
                    </tr>
                    <tr class="border-t border-gray-700">
                        <td class="p-3">5. Aplicação</td>
                        <td class="p-3">Renderização final</td>
                        <td class="p-3">Aplicativo em uso</td>
                        <td class="p-3">Exibição do caractere apropriado</td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <div class="bg-amber-900/10 p-5 rounded-xl border border-amber-500/20 mt-6">
            <h4 class="text-amber-400 font-bold mb-2">💡 Dica Pro: Debug de Layout</h4>
            <p class="text-sm text-gray-300">
                Ferramentas como o "Keyboard Layout Creator" da Microsoft permitem visualizar exatamente como os scancodes são convertidos em caracteres para cada layout específico, ajudando a diagnosticar problemas complexos de mapeamento.
            </p>
        </div>
      `
        },
        {
            title: "13. Tabelas de Mapeamento e Caracteres Especiais",
            content: `
        <h4 class="text-white font-bold mb-3">🔤 Mapeamento de Caracteres Especiais em 2026</h4>
        <p class="mb-4 text-gray-300">
            Os layouts ABNT2 e ANSI diferem significativamente no tratamento de caracteres especiais e acentuação:
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            <div class="bg-green-900/10 p-5 rounded-xl border border-green-500/20">
                <h5 class="text-green-400 font-bold mb-3">Layout ABNT2 (Português)</h5>
                <div class="overflow-x-auto">
                    <table class="w-full text-sm text-gray-300 border border-gray-700 rounded-lg">
                        <thead class="bg-gray-800">
                            <tr>
                                <th class="p-2 text-left">Tecla</th>
                                <th class="p-2 text-left">Shift</th>
                                <th class="p-2 text-left">AltGr</th>
                                <th class="p-2 text-left">Comportamento</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="border-t border-gray-700">
                                <td class="p-2">Q</td>
                                <td class="p-2">1</td>
                                <td class="p-2">@</td>
                                <td class="p-2">Numérico + Símbolo</td>
                            </tr>
                            <tr class="border-t border-gray-700 bg-gray-800/30">
                                <td class="p-2">W</td>
                                <td class="p-2">2</td>
                                <td class="p-2">"</td>
                                <td class="p-2">Numérico + Símbolo</td>
                            </tr>
                            <tr class="border-t border-gray-700">
                                <td class="p-2">C</td>
                                <td class="p-2">?</td>
                                <td class="p-2">Ç</td>
                                <td class="p-2">Símbolo + Letra Especial</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
                <h5 class="text-blue-400 font-bold mb-3">Layout ANSI (EUA)</h5>
                <div class="overflow-x-auto">
                    <table class="w-full text-sm text-gray-300 border border-gray-700 rounded-lg">
                        <thead class="bg-gray-800">
                            <tr>
                                <th class="p-2 text-left">Tecla</th>
                                <th class="p-2 text-left">Shift</th>
                                <th class="p-2 text-left">AltGr</th>
                                <th class="p-2 text-left">Comportamento</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="border-t border-gray-700">
                                <td class="p-2">Q</td>
                                <td class="p-2">!</td>
                                <td class="p-2">-</td>
                                <td class="p-2">Símbolo + Símbolo</td>
                            </tr>
                            <tr class="border-t border-gray-700 bg-gray-800/30">
                                <td class="p-2">W</td>
                                <td class="p-2">@</td>
                                <td class="p-2">"</td>
                                <td class="p-2">Símbolo + Símbolo</td>
                            </tr>
                            <tr class="border-t border-gray-700">
                                <td class="p-2">C</td>
                                <td class="p-2">(</td>
                                <td class="p-2">©</td>
                                <td class="p-2">Símbolo + Símbolo</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">🔍 Sequências de Combinação para Acentuação</h4>
        <p class="mb-4 text-gray-300">
            Em layouts internacionais, a criação de caracteres acentuados segue regras específicas:
        </p>
        <div class="overflow-x-auto">
            <table class="w-full text-sm text-gray-300 border border-gray-700 rounded-lg">
                <thead class="bg-gray-800">
                    <tr>
                        <th class="p-3 text-left">Caractere</th>
                        <th class="p-3 text-left">Combinação ANSI</th>
                        <th class="p-3 text-left">Combinação ABNT2</th>
                        <th class="p-3 text-left">Descrição</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="border-t border-gray-700">
                        <td class="p-3">ç</td>
                        <td class="p-2">' + c</td>
                        <td class="p-2">AltGr+C</td>
                        <td class="p-3">Cedilha diretamente</td>
                    </tr>
                    <tr class="border-t border-gray-700 bg-gray-800/30">
                        <td class="p-3">á</td>
                        <td class="p-2">' + a</td>
                        <td class="p-2">' + a</td>
                        <td class="p-3">Acento agudo</td>
                    </tr>
                    <tr class="border-t border-gray-700">
                        <td class="p-3">ã</td>
                        <td class="p-2">~ + a</td>
                        <td class="p-2">~ + a</td>
                        <td class="p-3">Til</td>
                    </tr>
                    <tr class="border-t border-gray-700 bg-gray-800/30">
                        <td class="p-3">à</td>
                        <td class="p-2">' + a (depois espaço)</td>
                        <td class="p-2">' + a (depois espaço)</td>
                        <td class="p-3">Acento grave</td>
                    </tr>
                </tbody>
            </table>
        </div>
      `
        },
        {
            title: "14. Tendências e Evolução de Layouts em 2026",
            content: `
        <h4 class="text-white font-bold mb-3">🚀 Inovações em Layouts de Teclado</h4>
        <p class="mb-4 text-gray-300">
            Em 2026, os layouts de teclado estão evoluindo com novas tecnologias e padrões de uso:
        </p>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 my-6">
            <div class="bg-indigo-900/10 p-5 rounded-xl border border-indigo-500/20">
                <h5 class="text-indigo-400 font-bold mb-3">Layouts Adaptativos</h5>
                <ul class="text-sm text-gray-300 space-y-2">
                    <li>• Layouts dinâmicos baseados em software</li>
                    <li>• Teclas reprogramáveis em tempo real</li>
                    <li>• Mudança automática por aplicativo</li>
                    <li>• Aprendizado de padrões de digitação</li>
                    <li>• Personalização por contexto</li>
                </ul>
            </div>
            <div class="bg-cyan-900/10 p-5 rounded-xl border border-cyan-500/20">
                <h5 class="text-cyan-400 font-bold mb-3">Layouts Multilíngues</h5>
                <ul class="text-sm text-gray-300 space-y-2">
                    <li>• Combinação de múltiplos idiomas</li>
                    <li>• Teclas com símbolos duplos</li>
                    <li>• Alternância automática</li>
                    <li>• Reconhecimento de linguagem</li>
                    <li>• Preferências regionais</li>
                </ul>
            </div>
            <div class="bg-green-900/10 p-5 rounded-xl border border-green-500/20">
                <h5 class="text-green-400 font-bold mb-3">Layouts Digitais</h5>
                <ul class="text-sm text-gray-300 space-y-2">
                    <li>• Teclados OLED programáveis</li>
                    <li>• Labels dinâmicos de teclas</li>
                    <li>• Layouts personalizados por perfil</li>
                    <li>• Teclas virtuais e físicas combinadas</li>
                    <li>• Interface híbrida</li>
                </ul>
            </div>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">📊 Estatísticas de Uso de Layouts em 2026</h4>
        <p class="mb-4 text-gray-300">
            Dados sobre a distribuição e uso de layouts em diferentes regiões:
        </p>
        <div class="overflow-x-auto">
            <table class="w-full text-sm text-gray-300 border border-gray-700 rounded-lg">
                <thead class="bg-gray-800">
                    <tr>
                        <th class="p-3 text-left">Região</th>
                        <th class="p-3 text-left">Layout Principal</th>
                        <th class="p-3 text-left">Percentual</th>
                        <th class="p-3 text-left">Tendência</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="border-t border-gray-700">
                        <td class="p-3">Brasil</td>
                        <td class="p-3">ABNT2</td>
                        <td class="p-3">85%</td>
                        <td class="p-3">Estável</td>
                    </tr>
                    <tr class="border-t border-gray-700 bg-gray-800/30">
                        <td class="p-3">Estados Unidos</td>
                        <td class="p-3">ANSI</td>
                        <td class="p-3">95%</td>
                        <td class="p-3">Estável</td>
                    </tr>
                    <tr class="border-t border-gray-700">
                        <td class="p-3">Europa</td>
                        <td class="p-3">ISO</td>
                        <td class="p-3">70%</td>
                        <td class="p-3">Crescente</td>
                    </tr>
                    <tr class="border-t border-gray-700 bg-gray-800/30">
                        <td class="p-3">Misto/Global</td>
                        <td class="p-3">ANSI Internacional</td>
                        <td class="p-3">40%</td>
                        <td class="p-3">Em ascensão</td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">🔬 Pesquisas e Desenvolvimento</h4>
        <p class="mb-4 text-gray-300">
            Empresas e instituições estão investindo em tecnologias de layout avançado:
        </p>
        <ul class="list-disc list-inside text-gray-300 space-y-3 ml-4">
            <li><strong>Layouts inteligentes:</strong> Adaptam-se automaticamente ao idioma do texto sendo digitado</li>
            <li><strong>Teclados híbridos:</strong> Combinam layouts físicos e virtuais em tempo real</li>
            <li><strong>Reconhecimento de contexto:</strong> Alteram layout com base no aplicativo em uso</li>
            <li><strong>Personalização universal:</strong> Layouts armazenados na nuvem e aplicados automaticamente</li>
            <li><strong>Layouts assistidos por IA:</strong> Sugestões de layout baseadas em padrões de digitação</li>
        </ul>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "4. Configurações Regionais Avançadas",
            content: `
        <h4 class="text-white font-bold mb-3">🌍 Configuração Regional Completa</h4>
        <p class="mb-4 text-gray-300">
            A configuração do teclado está intimamente ligada às configurações regionais do sistema:
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
                <h5 class="text-blue-400 font-bold mb-3">Configurações Associadas</h5>
                <ul class="text-sm text-gray-300 space-y-2">
                    <li>• Formato de data e hora</li>
                    <li>• Separadores decimais e de milhar</li>
                    <li>• Formato de moeda</li>
                    <li>• Classificação de strings</li>
                    <li>• Formato de números de telefone</li>
                </ul>
            </div>
            <div class="bg-purple-900/10 p-5 rounded-xl border border-purple-500/20">
                <h5 class="text-purple-400 font-bold mb-3">Localização do Sistema</h5>
                <ul class="text-sm text-gray-300 space-y-2">
                    <li>• Idioma de exibição</li>
                    <li>• Idioma de entrada</li>
                    <li>• Idioma de formatos</li>
                    <li>• Localização geográfica</li>
                    <li>• Fuso horário</li>
                </ul>
            </div>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">🔧 Ferramentas de Configuração Regional</h4>
        <p class="mb-4 text-gray-300">
            Métodos avançados para configurar o layout regional:
        </p>
        <div class="overflow-x-auto">
            <table class="w-full text-sm text-gray-300 border border-gray-700 rounded-lg">
                <thead class="bg-gray-800">
                    <tr>
                        <th class="p-3 text-left">Método</th>
                        <th class="p-3 text-left">Complexidade</th>
                        <th class="p-3 text-left">Benefício</th>
                        <th class="p-3 text-left">Quando Usar</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="border-t border-gray-700">
                        <td class="p-3">GUI do Windows</td>
                        <td class="p-3">Baixa</td>
                        <td class="p-3">Interface visual intuitiva</td>
                        <td class="p-3">Configurações básicas</td>
                    </tr>
                    <tr class="border-t border-gray-700 bg-gray-800/30">
                        <td class="p-3">PowerShell</td>
                        <td class="p-3">Média</td>
                        <td class="p-3">Automatização e script</td>
                        <td class="p-3">Implantação em massa</td>
                    </tr>
                    <tr class="border-t border-gray-700">
                        <td class="p-3">Registro do Windows</td>
                        <td class="p-3">Alta</td>
                        <td class="p-3">Controle granular</td>
                        <td class="p-3">Configurações específicas</td>
                    </tr>
                    <tr class="border-t border-gray-700 bg-gray-800/30">
                        <td class="p-3">Grupo de Política</td>
                        <td class="p-3">Alta</td>
                        <td class="p-3">Controle centralizado</td>
                        <td class="p-3">Ambientes corporativos</td>
                    </tr>
                </tbody>
            </table>
        </div>
      `
        },
        {
            title: "5. Troubleshooting Avançado",
            content: `
        <h4 class="text-white font-bold mb-3">🔍 Diagnóstico de Problemas Complexos</h4>
        <p class="mb-4 text-gray-300">
            Quando o layout parece estar configurado corretamente mas ainda apresenta problemas:
        </p>
        <div class="space-y-6">
            <div class="border-l-4 border-green-500 pl-4 py-2 bg-green-900/10">
                <h5 class="text-green-400 font-bold mb-2">Verificação de Layout Ativo</h5>
                <p class="text-gray-300 text-sm">
                    Confirme qual layout está realmente ativo:
                </p>
                <ul class="text-sm text-gray-300 space-y-1 mt-2">
                    <li>• Use o utilitário "kbdedit.com" para verificar o layout real</li>
                    <li>• Execute "Get-WinUserLanguageList" no PowerShell</li>
                    <li>• Verifique o valor HKLM\SYSTEM\CurrentControlSet\Control\Keyboard Layouts</li>
                    <li>• Use o Visualizador de Eventos para capturar eventos de teclado</li>
                </ul>
            </div>
            <div class="border-l-4 border-blue-500 pl-4 py-2 bg-blue-900/10">
                <h5 class="text-blue-400 font-bold mb-2">Problemas de Aplicativo Específico</h5>
                <p class="text-gray-300 text-sm">
                    Alguns aplicativos podem sobrescrever o layout do sistema:
                </p>
                <ul class="text-sm text-gray-300 space-y-1 mt-2">
                    <li>• Editores de código podem ter mapeamentos próprios</li>
                    <li>• Jogos podem redefinir o layout para compatibilidade</li>
                    <li>• Aplicativos de segurança podem interceptar entradas</li>
                    <li>• Máquinas virtuais podem usar layouts diferentes</li>
                </ul>
            </div>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">🛠️ Soluções de Problemas Comuns</h4>
        <p class="mb-4 text-gray-300">
            Técnicas avançadas para resolver problemas persistentes:
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-gray-800 p-4 rounded-lg">
                <h5 class="text-cyan-400 font-bold mb-2">Soluções de Software</h5>
                <ul class="text-sm text-gray-300 space-y-2">
                    <li>• Reiniciar o serviço de teclado (Input Method Manager)</li>
                    <li>• Limpar cache de layout do usuário</li>
                    <li>• Verificar conflitos com softwares de terceiros</li>
                    <li>• Restaurar configurações de layout padrão</li>
                </ul>
            </div>
            <div class="bg-gray-800 p-4 rounded-lg">
                <h5 class="text-purple-400 font-bold mb-2">Soluções de Sistema</h5>
                <ul class="text-sm text-gray-300 space-y-2">
                    <li>• Atualizar drivers de teclado</li>
                    <li>• Verificar integridade do sistema com SFC /scannow</li>
                    <li>• Reinstalar pacotes de idioma</li>
                    <li>• Criar novo perfil de usuário para teste</li>
                </ul>
            </div>
        </div>
      `
        },
        {
            title: "6. Segurança e Privacidade",
            content: `
        <h4 class="text-white font-bold mb-3">🔒 Considerações de Segurança em Layouts de Teclado</h4>
        <p class="mb-4 text-gray-300">
            A configuração de layout pode impactar a segurança do sistema:
        </p>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
            <div class="bg-indigo-900/10 p-5 rounded-xl border border-indigo-500/20">
                <h5 class="text-indigo-400 font-bold mb-3">Riscos de Segurança</h5>
                <ul class="text-sm text-gray-300 space-y-2">
                    <li>• Keyloggers podem registrar entradas de teclado incorretamente</li>
                    <li>• Diferentes layouts podem comprometer a digitação de senhas</li>
                    <li>• Malware pode alterar layouts para coleta de credenciais</li>
                    <li>• Teclados mal configurados podem registrar senhas de forma errada</li>
                    <li>• Layouts alternativos podem confundir sistemas de segurança</li>
                </ul>
            </div>
            <div class="bg-cyan-900/10 p-5 rounded-xl border border-cyan-500/20">
                <h5 class="text-cyan-400 font-bold mb-3">Boas Práticas de Segurança</h5>
                <ul class="text-sm text-gray-300 space-y-2">
                    <li>• Verificar regularmente o layout de teclado ativo</li>
                    <li>• Usar autenticação multifatorial como proteção adicional</li>
                    <li>• Ser cauteloso ao digitar senhas em layouts desconhecidos</li>
                    <li>• Monitorar mudanças não autorizadas de layout</li>
                    <li>• Documentar configurações de layout padrão</li>
                </ul>
            </div>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">🛡️ Proteção contra Ataques de Engenharia Social</h4>
        <p class="mb-4 text-gray-300">
            Como os layouts de teclado podem ser usados em ataques:
        </p>
        <div class="overflow-x-auto">
            <table class="w-full text-sm text-gray-300 border border-gray-700 rounded-lg">
                <thead class="bg-gray-800">
                    <tr>
                        <th class="p-3 text-left">Tipo de Ataque</th>
                        <th class="p-3 text-left">Descrição</th>
                        <th class="p-3 text-left">Proteção</th>
                        <th class="p-3 text-left">Prevenção</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="border-t border-gray-700">
                        <td class="p-3">Phishing de Senha</td>
                        <td class="p-3">Usuário digita senha em layout errado</td>
                        <td class="p-3">Verificação visual do layout</td>
                        <td class="p-3">Treinamento de conscientização</td>
                    </tr>
                    <tr class="border-t border-gray-700 bg-gray-800/30">
                        <td class="p-3">Keylogger com Layout</td>
                        <td class="p-3">Registra caracteres de acordo com layout errado</td>
                        <td class="p-3">Antivirus e antimalware</td>
                        <td class="p-3">Verificação regular de drivers</td>
                    </tr>
                    <tr class="border-t border-gray-700">
                        <td class="p-3">Malware de Layout</td>
                        <td class="p-3">Altera layout para coletar credenciais</td>
                        <td class="p-3">Controle de integridade do sistema</td>
                        <td class="p-3">Políticas de grupo restritivas</td>
                    </tr>
                </tbody>
            </table>
        </div>
      `
        },
        {
            title: "7. Análise de Performance e Ergonomia",
            content: `
        <h4 class="text-white font-bold mb-3">⚡ Impacto de Layouts na Performance de Digitação</h4>
        <p class="mb-4 text-gray-300">
            Diferentes layouts de teclado têm impactos variados na velocidade e precisão de digitação:
        </p>
        <div class="space-y-6">
            <div class="border-l-4 border-green-500 pl-4 py-2 bg-green-900/10">
                <h5 class="text-green-400 font-bold mb-2">Estatísticas de Digitação</h5>
                <p class="text-gray-300 text-sm">
                    Estudos comparando layouts diferentes:
                </p>
                <ul class="text-sm text-gray-300 space-y-1 mt-2">
                    <li>• Layout ABNT2: Média de 45 WPM (palavras por minuto) para nativos de português</li>
                    <li>• Layout ANSI: 42 WPM para nativos de português (devido à falta do Ç)</li>
                    <li>• Layout Dvorak: 55 WPM em média (mas curva de aprendizado alta)</li>
                    <li>• Layout Colemak: 52 WPM com curva de aprendizado mais suave</li>
                </ul>
            </div>
            <div class="border-l-4 border-blue-500 pl-4 py-2 bg-blue-900/10">
                <h5 class="text-blue-400 font-bold mb-2">Ergonomia e Saúde</h5>
                <p class="text-gray-300 text-sm">
                    O layout adequado pode impactar a saúde e conforto:
                </p>
                <ul class="text-sm text-gray-300 space-y-1 mt-2">
                    <li>• Menor esforço para digitar caracteres nativos</li>
                    <li>• Redução de movimentos repetitivos desnecessários</li>
                    <li>• Menos tensão muscular ao digitar textos longos</li>
                    <li>• Menor probabilidade de lesões por esforço repetitivo</li>
                </ul>
            </div>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">📊 Estudos de Caso em Performance</h4>
        <p class="mb-4 text-gray-300">
            Análise de performance em diferentes cenários:
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-gray-800 p-4 rounded-lg">
                <h5 class="text-cyan-400 font-bold mb-2">Profissionais de TI</h5>
                <ul class="text-sm text-gray-300 space-y-2">
                    <li>• Maior necessidade de caracteres especiais</li>
                    <li>• Benefício do layout ANSI para programação</li>
                    <li>• Importância do AltGr para símbolos especiais</li>
                    <li>• Frequência de mudança entre layouts</li>
                </ul>
            </div>
            <div class="bg-gray-800 p-4 rounded-lg">
                <h5 class="text-purple-400 font-bold mb-2">Escritores e Redatores</h5>
                <li>• Maior uso de acentuação e caracteres nativos</li>
                <li>• Benefício do layout ABNT2 para língua portuguesa</li>
                <li>• Redução de erros de digitação</li>
                <li>• Aumento de produtividade</li>
                </ul>
            </div>
        </div>
      `
        },
        {
            title: "8. Personalização e Scripts Avançados",
            content: `
        <h4 class="text-white font-bold mb-3">🔧 Personalização de Layout com Scripts</h4>
        <p class="mb-4 text-gray-300">
            Para usuários avançados, é possível criar layouts personalizados:
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
                <h5 class="text-blue-400 font-bold mb-3">Ferramentas de Criação</h5>
                <ul class="text-sm text-gray-300 space-y-2">
                    <li>• Microsoft Keyboard Layout Creator (KLCP)</li>
                    <li>• Ukelele (macOS)</li>
                    <li>• xkb (Linux)</li>
                    <li>• SharpKeys (utilitário de terceiros)</li>
                    <li>• AutoHotkey para mapeamentos avançados</li>
                </ul>
            </div>
            <div class="bg-purple-900/10 p-5 rounded-xl border border-purple-500/20">
                <h5 class="text-purple-400 font-bold mb-3">Exemplos de Personalização</h5>
                <ul class="text-sm text-gray-300 space-y-2">
                    <li>• Teclas de atalho personalizadas</li>
                    <li>• Layouts específicos para programação</li>
                    <li>• Atalhos para caracteres Unicode especiais</li>
                    <li>• Remapeamento para teclados não convencionais</li>
                    <li>• Layouts para idiomas específicos</li>
                </ul>
            </div>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">💻 Exemplo de Script PowerShell</h4>
        <p class="mb-4 text-gray-300">
            Script para verificar e configurar layouts de teclado:
        </p>
        <div class="bg-gray-900 p-4 rounded-lg overflow-x-auto">
            <pre class="text-green-400 text-sm"># Verificar layouts instalados
Get-WinUserLanguageList

# Configurar layout padrão para ABNT2
$langList = Get-WinUserLanguageList
$langList[0].InputMethodTips.Clear()
$langList[0].InputMethodTips.Add("0416:{12345678-1234-1234-1234-123456789012}{12345678-1234-1234-1234-123456789012}")
Set-WinUserLanguageList $langList -Force

# Alternar para layout específico
Set-Culture "pt-BR"
Set-WinSystemLocale "pt-BR"</pre>
        </div>
        
        <div class="bg-amber-900/10 p-5 rounded-xl border border-amber-500/20 mt-6">
            <h4 class="text-amber-400 font-bold mb-2">💡 Dica Pro: Layout por Aplicativo</h4>
            <p class="text-sm text-gray-300">
                É possível usar AutoHotkey para configurar layouts diferentes para diferentes aplicativos, ideal para desenvolvedores que trabalham com múltiplas linguagens de programação ou idiomas.
            </p>
        </div>
      `
        },
        {
            title: "9. Compatibilidade com Aplicativos Específicos",
            content: `
        <h4 class="text-white font-bold mb-3">🔄 Compatibilidade com Softwares Especializados</h4>
        <p class="mb-4 text-gray-300">
            Alguns aplicativos podem ter problemas específicos com layouts de teclado:
        </p>
        <div class="space-y-6">
            <div class="border-l-4 border-green-500 pl-4 py-2 bg-green-900/10">
                <h5 class="text-green-400 font-bold mb-2">Editores de Código</h5>
                <p class="text-gray-300 text-sm">
                    IDEs e editores de código podem ter comportamentos específicos:
                </p>
                <ul class="text-sm text-gray-300 space-y-1 mt-2">
                    <li>• Atalhos de teclado específicos podem colidir com layouts</li>
                    <li>• Algumas IDEs ignoram o layout do sistema para atalhos</li>
                    <li>• Teclas especiais podem ter tratamento diferente</li>
                    <li>• Extensões podem modificar o comportamento de entrada</li>
                </ul>
            </div>
            <div class="border-l-4 border-blue-500 pl-4 py-2 bg-blue-900/10">
                <h5 class="text-blue-400 font-bold mb-2">Jogos e Aplicativos Gráficos</h>
                <p class="text-gray-300 text-sm">
                    Aplicações que utilizam inputs intensivos:
                </p>
                <ul class="text-sm text-gray-300 space-y-1 mt-2">
                    <li>• Jogos podem redefinir o layout para compatibilidade</li>
                    <li>• Aplicativos CAD/3D podem ter mapeamentos próprios</li>
                    <li>• Softwares de produtividade podem ignorar o layout</li>
                    <li>• Alguns aplicativos não suportam layouts não latinos</li>
                </ul>
            </div>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">🛡️ Soluções de Compatibilidade</h4>
        <p class="mb-4 text-gray-300">
            Estratégias para resolver problemas de compatibilidade:
        </p>
        <div class="overflow-x-auto">
            <table class="w-full text-sm text-gray-300 border border-gray-700 rounded-lg">
                <thead class="bg-gray-800">
                    <tr>
                        <th class="p-3 text-left">Aplicativo</th>
                        <th class="p-3 text-left">Problema Comum</th>
                        <th class="p-3 text-left">Solução</th>
                        <th class="p-3 text-left">Complexidade</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="border-t border-gray-700">
                        <td class="p-3">Visual Studio</td>
                        <td class="p-3">Atalhos não funcionam com ABNT2</td>
                        <td class="p-3">Reconfigurar atalhos ou usar layout ANSI</td>
                        <td class="p-3">Média</td>
                    </tr>
                    <tr class="border-t border-gray-700 bg-gray-800/30">
                        <td class="p-3">Adobe Photoshop</td>
                        <td class="p-3">Atalhos com símbolos não funcionam</td>
                        <td class="p-3">Reconfigurar atalhos ou usar teclado US</td>
                        <td class="p-3">Média</td>
                    </tr>
                    <tr class="border-t border-gray-700">
                        <td class="p-3">Jogos de Ação</td>
                        <td class="p-3">Teclas de movimento em posições diferentes</td>
                        <td class="p-3">Reconfigurar controles dentro do jogo</td>
                        <td class="p-3">Baixa</td>
                    </tr>
                    <tr class="border-t border-gray-700 bg-gray-800/30">
                        <td class="p-3">Softwares Legados</td>
                        <td class="p-3">Não reconhecem layouts modernos</td>
                        <td class="p-3">Executar em modo de compatibilidade</td>
                        <td class="p-3">Alta</td>
                    </tr>
                </tbody>
            </table>
        </div>
      `
        },
        {
            title: "10. Soluções Corporativas e de TI",
            content: `
        <h4 class="text-white font-bold mb-3">🏢 Implantação em Ambientes Corporativos</h4>
        <p class="mb-4 text-gray-300">
            Em ambientes empresariais, a padronização de layouts de teclado é crítica:
        </p>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
            <div class="bg-indigo-900/10 p-5 rounded-xl border border-indigo-500/20">
                <h5 class="text-indigo-400 font-bold mb-3">Políticas de Grupo</h5>
                <ul class="text-sm text-gray-300 space-y-2">
                    <li>• Configuração centralizada de layouts</li>
                    <li>• Imposição de layouts específicos</li>
                    <li>• Impedimento de alterações por usuários</li>
                    <li>• Distribuição automática de layouts personalizados</li>
                    <li>• Registro de mudanças não autorizadas</li>
                </ul>
            </div>
            <div class="bg-cyan-900/10 p-5 rounded-xl border border-cyan-500/20">
                <h5 class="text-cyan-400 font-bold mb-3">Soluções de Gerenciamento</h5>
                <ul class="text-sm text-gray-300 space-y-2">
                    <li>• Microsoft Endpoint Manager</li>
                    <li>• System Center Configuration Manager</li>
                    <li>• Soluções de terceiros como PDQ Deploy</li>
                    <li>• Scripts de logon personalizados</li>
                    <li>• Soluções baseadas em nuvem</li>
                </ul>
            </div>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">🔧 Scripts de Implantação em Lote</h4>
        <p class="mb-4 text-gray-300">
            Exemplo de script para implantação de layout em múltiplas máquinas:
        </p>
        <div class="bg-gray-900 p-4 rounded-lg overflow-x-auto">
            <pre class="text-green-400 text-sm"># Script de implantação de layout ABNT2 em ambiente corporativo
# Configura layout de teclado padrão para todos os novos usuários

# Define o layout padrão para ABNT2
$registryPath = "HKLM:\SYSTEM\CurrentControlSet\Control\Keyboard Layouts"
$layoutName = "00000416"
$layoutValue = "Brazilian ABNT2"

# Configura o layout como padrão
Set-ItemProperty -Path "$registryPath\Preload" -Name "1" -Value "$layoutName"
Set-ItemProperty -Path "$registryPath\Substitutes" -Name "d0000416" -Value "$layoutName"

# Aplica para o sistema e usuário atual
Set-WinUserLanguageList -LanguageList "pt-BR" -Force

Write-Host "Layout ABNT2 configurado com sucesso para o ambiente corporativo"</pre>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">🛡️ Considerações de Segurança Corporativa</h4>
        <p class="mb-4 text-gray-300">
            Implementação segura de layouts em ambientes corporativos:
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-gray-800 p-4 rounded-lg">
                <h5 class="text-cyan-400 font-bold mb-2">Controles de Segurança</h5>
                <ul class="text-sm text-gray-300 space-y-2">
                    <li>• Auditoria de mudanças de layout</li>
                    <li>• Restrições de alteração por usuários normais</li>
                    <li>• Validação de layouts aprovados</li>
                    <li>• Políticas de conformidade</li>
                </ul>
            </div>
            <div class="bg-gray-800 p-4 rounded-lg">
                <h5 class="text-purple-400 font-bold mb-2">Monitoramento</h5>
                <ul class="text-sm text-gray-300 space-y-2">
                    <li>• Relatórios de layouts em uso</li>
                    <li>• Detecção de layouts não autorizados</li>
                    <li>• Alertas de segurança para mudanças</li>
                    <li>• Integração com SIEM</li>
                </ul>
            </div>
        </div>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/teclado-mecanico-vs-membrana-qual-o-melhor",
            title: "Tipos de Teclado",
            description: "Conheça as tecnologias de switches."
        },
        {
            href: "/guias/teclado-notebook-parou-fix",
            title: "Teclado Falhando",
            description: "Dicas se o teclado parou totalmente."
        },
        {
            href: "/guias/atalhos-produtividade-windows",
            title: "Atalhos Windows",
            description: "Mais combos de teclas para o dia a dia."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="5 min"
            difficultyLevel="Iniciante"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
