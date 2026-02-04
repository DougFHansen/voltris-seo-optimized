import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "League of Legends: Como resolver quedas de FPS e Travadas (2026)";
const description = "Seu LoL está travando em lutas de equipe (Teamfights)? Aprenda as melhores configurações para ganhar FPS e remover o lag no League of Legends em 2026.";
const keywords = [
    'league of legends queda de fps 2026 como resolver',
    'lol travando na teamfight pc fraco tutorial',
    'melhores configurações de video lol para fps',
    'como aumentar fps league of legends notebook gamer 2026',
    'corrigir erro de lag de entrada lol windows 11'
];

export const metadata: Metadata = createGuideMetadata('league-of-legends-fps-drop-fix', title, description, keywords);

export default function LoLPerformanceGuide() {
    const summaryTable = [
        { label: "Modo de Janela", value: "Sem Bordas (Borderless) ou Tela Cheia" },
        { label: "Check de Hardware", value: "Desativar Movimento Relativo (In-game)" },
        { label: "Sombras", value: "DESATIVADO (Ganho massivo de FPS)" },
        { label: "Dificuldade", value: "Intermediário" }
    ];

    const contentSections = [
        {
            title: "O Desafio do LoL em 2026",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Mesmo em 2026, o **League of Legends** continua sendo um jogo que depende muito de um único núcleo do processador (Single-Core Performance). É comum ver jogadores com placas de vídeo potentes sofrendo com quedas de FPS para menos de 60 durante lutas com muitos efeitos visuais. O segredo para estabilizar o LoL não é apenas baixar tudo para o mínimo, mas sim configurar o Windows para não interromper o processo do jogo.
        </p>
      `
        },
        {
            title: "1. A Configuração 'Mágica' das Sombras",
            content: `
        <p class="mb-4 text-gray-300">No League of Legends, as sombras são processadas totalmente pela CPU:</p>
        <ul class="list-disc list-inside text-gray-300 space-y-3">
            <li><strong>Sombras:</strong> Coloque em <strong>Desativado</strong>. Sim, o jogo perde um pouco de profundidade visual, mas as quedas de FPS em lutas de equipe serão reduzidas em até 40%.</li>
            <li><strong>Qualidade dos Personagens:</strong> Pode manter no Médio ou Alto, o impacto é baixo.</li>
            <li><strong>Qualidade dos Efeitos:</strong> Se estiver no Ultra, as skills (habilidades) podem causar travadinhas quando são usadas pela primeira vez na partida. Recomendamos o <strong>Médio</strong>.</li>
        </ul >
      `
        },
        {
            title: "2. DirectX 9 de Legado (Dica para PCs Antigos)",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Compatibilidade:</h4>
            <p class="text-sm text-gray-300">
                Se você joga em um PC muito antigo que não suporta bem o DirectX 11, o LoL tem uma opção secreta no cliente (engrenagem) chamada <strong>'Preferir Modo de Legado DX9'</strong>. Isso pode estabilizar o FPS em máquinas de 2015-2018, mas evite usá-lo em PCs modernos de 2026, pois o DX11 é muito mais eficiente em hardware recente.
            </p>
        </div>
      `
        },
        {
            title: "3. Limite de FPS e Input Lag",
            content: `
        <p class="mb-4 text-gray-300">
            Nunca deixe o FPS como "Ilimitado". Se o seu monitor é de 75Hz e seu PC alcança 200 FPS, a CPU está trabalhando dobrado sem necessidade, o que causa calor e eventuais quedas bruscas. 
            <br/><br/><strong>Dica:</strong> Trave o FPS em um valor estável que seu PC consiga manter sempre (ex: 144 FPS). Isso garante um <strong>Frametime</strong> constante, o que é muito mais importante para a sua memória muscular de cliques do que um número alto que oscila.
        </p>
      `
        },
        {
            title: "4. Configurações Avançadas do Sistema Operacional",
            content: `
                <div class="bg-gradient-to-r from-purple-900/20 to-blue-900/20 p-6 rounded-xl border border-purple-500/30 my-6">
                    <h4 class="text-xl font-bold text-purple-300 mb-4">Otimizações do Windows para League of Legends</h4>
                    
                    <h5 class="text-lg font-semibold text-white mt-6 mb-3">Programas em Segundo Plano</h5>
                    <p class="text-gray-300 mb-4">
                        Vários programas em execução em segundo plano podem consumir recursos do sistema e causar quedas de FPS no League of Legends. Aqui estão as principais otimizações:
                    </p>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                            <h6 class="font-bold text-green-400 mb-2">Serviços do Windows</h6>
                            <ul class="text-sm text-gray-300 space-y-1">
                                <li>• Desative o Superfetch (Serviço SysMain)</li>
                                <li>• Desative o Windows Search</li>
                                <li>• Desative o Windows Defender Real-time Protection temporariamente</li>
                                <li>• Verifique serviços desnecessários no Gerenciador de Tarefas</li>
                            </ul>
                        </div>
                        
                        <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                            <h6 class="font-bold text-green-400 mb-2">Aplicativos de Inicialização</h6>
                            <ul class="text-sm text-gray-300 space-y-1">
                                <li>• Desative aplicativos de inicialização não essenciais</li>
                                <li>• Feche softwares de overlay (Discord, Steam, etc.)</li>
                                <li>• Desative softwares de monitoramento de hardware</li>
                                <li>• Verifique aplicativos de sincronização de nuvem</li>
                            </ul>
                        </div>
                    </div>
                    
                    <h5 class="text-lg font-semibold text-white mt-6 mb-3">Configurações de Energia</h5>
                    <p class="text-gray-300 mb-4">
                        A configuração de energia do Windows pode afetar significativamente o desempenho do League of Legends. Siga estas etapas:
                    </p>
                    
                    <div class="bg-yellow-900/20 p-4 rounded-lg border border-yellow-500/30 mb-4">
                        <ul class="text-gray-300 space-y-2">
                            <li>• Abra o Painel de Controle > Hardware e Som > Opções de Energia</li>
                            <li>• Selecione o plano "Alto Desempenho" ou crie um personalizado</li>
                            <li>• Defina o processador para 100% em "Configurações do Processador do Sistema"</li>
                            <li>• Desative o "Gerenciamento de Energia Inteligente de CPU"</li>
                        </ul>
                    </div>
                </div>
            `
        },
        {
            title: "5. Otimizações de Hardware e Drivers",
            content: `
                <div class="bg-gradient-to-r from-indigo-900/20 to-purple-900/20 p-6 rounded-xl border border-indigo-500/30 my-6">
                    <h4 class="text-xl font-bold text-indigo-300 mb-4">Drivers e Hardware para Melhor Performance</h4>
                    
                    <h5 class="text-lg font-semibold text-white mt-6 mb-3">Atualização de Drivers</h5>
                    <p class="text-gray-300 mb-4">
                        Drivers desatualizados são uma causa comum de problemas de desempenho no League of Legends. Aqui estão as melhores práticas:
                    </p>
                    
                    <div class="overflow-x-auto mb-6">
                        <table class="w-full border-collapse border border-gray-700 text-sm">
                            <thead>
                                <tr class="bg-gray-800">
                                    <th class="border border-gray-700 px-4 py-2 text-left">Componente</th>
                                    <th class="border border-gray-700 px-4 py-2 text-left">Frequência de Atualização</th>
                                    <th class="border border-gray-700 px-4 py-2 text-left">Importância</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="bg-gray-800/50">
                                    <td class="border border-gray-700 px-4 py-2">GPU (NVIDIA/AMD)</td>
                                    <td class="border border-gray-700 px-4 py-2">Mensal</td>
                                    <td class="border border-gray-700 px-4 py-2">Crítica</td>
                                </tr>
                                <tr>
                                    <td class="border border-gray-700 px-4 py-2">Chipset da Motherboard</td>
                                    <td class="border border-gray-700 px-4 py-2">Trimestral</td>
                                    <td class="border border-gray-700 px-4 py-2">Alta</td>
                                </tr>
                                <tr class="bg-gray-800/50">
                                    <td class="border border-gray-700 px-4 py-2">Áudio</td>
                                    <td class="border border-gray-700 px-4 py-2">Semestral</td>
                                    <td class="border border-gray-700 px-4 py-2">Média</td>
                                </tr>
                                <tr>
                                    <td class="border border-gray-700 px-4 py-2">Rede</td>
                                    <td class="border border-gray-700 px-4 py-2">Mensal</td>
                                    <td class="border border-gray-700 px-4 py-2">Alta</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    
                    <h5 class="text-lg font-semibold text-white mt-6 mb-3">Configurações Avançadas de GPU</h5>
                    <p class="text-gray-300 mb-4">
                        As configurações da placa de vídeo também impactam diretamente o desempenho no LoL:
                    </p>
                    
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div class="bg-gray-800/30 p-4 rounded-lg border border-gray-700">
                            <h6 class="font-bold text-blue-400 mb-2">Para NVIDIA GeForce Experience:</h6>
                            <ul class="text-sm text-gray-300 space-y-1">
                                <li>• Desative o "Boost de Performance"</li>
                                <li>• Configure o modo de preferência de GPU para "Alta Performance"</li>
                                <li>• Desative o "Ansel" e "Freestyle"</li>
                                <li>• Configure o "Shader Cache Size" para máximo</li>
                            </ul>
                        </div>
                        
                        <div class="bg-gray-800/30 p-4 rounded-lg border border-gray-700">
                            <h6 class="font-bold text-blue-400 mb-2">Para AMD Radeon Software:</h6>
                            <ul class="text-sm text-gray-300 space-y-1">
                                <li>• Desative o "Radeon Anti-Lag"</li>
                                <li>• Configure o "Radeon Boost" para desativado</li>
                                <li>• Desative o "Enhanced Sync"</li>
                                <li>• Configure o "Image Sharpening" para desativado</li>
                            </ul>
                        </div>
                    </div>
                </div>
            `
        },
        {
            title: "6. Monitoramento e Diagnóstico Avançado",
            content: `
                <div class="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 p-6 rounded-xl border border-cyan-500/30 my-6">
                    <h4 class="text-xl font-bold text-cyan-300 mb-4">Diagnóstico Profundo de Quedas de FPS</h4>
                    
                    <h5 class="text-lg font-semibold text-white mt-6 mb-3">Ferramentas de Monitoramento</h5>
                    <p class="text-gray-300 mb-4">
                        Para diagnosticar com precisão as quedas de FPS no League of Legends, utilize estas ferramentas profissionais:
                    </p>
                    
                    <div class="space-y-4 mb-6">
                        <div class="flex items-start space-x-3">
                            <div class="bg-green-500 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">
                                <span class="text-xs font-bold text-white">1</span>
                            </div>
                            <div>
                                <h6 class="font-bold text-green-400">MSI Afterburner com RivaTuner Statistics Server</h6>
                                <p class="text-sm text-gray-300">Monitoramento em tempo real de FPS, temperatura, uso de CPU/GPU com overlay preciso</p>
                            </div>
                        </div>
                        
                        <div class="flex items-start space-x-3">
                            <div class="bg-green-500 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">
                                <span class="text-xs font-bold text-white">2</span>
                            </div>
                            <div>
                                <h6 class="font-bold text-green-400">Intel GPA (Graphics Performance Analyzers)</h6>
                                <p class="text-sm text-gray-300">Ferramenta avançada para análise de performance gráfica e identificação de gargalos</p>
                            </div>
                        </div>
                        
                        <div class="flex items-start space-x-3">
                            <div class="bg-green-500 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">
                                <span class="text-xs font-bold text-white">3</span>
                            </div>
                            <div>
                                <h6 class="font-bold text-green-400">CapFrameX</h6>
                                <p class="text-sm text-gray-300">Software de captura de frame e análise estatística de performance com precisão milimétrica</p>
                            </div>
                        </div>
                    </div>
                    
                    <h5 class="text-lg font-semibold text-white mt-6 mb-3">Identificação de Gargalos</h5>
                    <p class="text-gray-300 mb-4">
                        Entenda como identificar se seu sistema está limitado por CPU ou GPU:
                    </p>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="bg-red-900/20 p-4 rounded-lg border border-red-500/30">
                            <h6 class="font-bold text-red-400 mb-2">Gargalo de CPU</h6>
                            <ul class="text-sm text-gray-300 space-y-1">
                                <li>• FPS cai drasticamente em teamfights</li>
                                <li>• Uso de CPU superior a 90%</li>
                                <li>• Temperatura da CPU elevada</li>
                                <li>• Quedas em áreas com muitos efeitos</li>
                            </ul>
                        </div>
                        
                        <div class="bg-blue-900/20 p-4 rounded-lg border border-blue-500/30">
                            <h6 class="font-bold text-blue-400 mb-2">Gargalo de GPU</h6>
                            <ul class="text-sm text-gray-300 space-y-1">
                                <li>• FPS baixa constantemente</li>
                                <li>• Uso de GPU próximo a 100%</li>
                                <li>• Temperatura da GPU elevada</li>
                                <li>• Baixa resolução melhora significativamente o FPS</li>
                            </ul>
                        </div>
                    </div>
                </div>
            `
        },
        {
            title: "7. Soluções Avançadas e Troubleshooting",
            content: `
                <div class="bg-gradient-to-r from-orange-900/20 to-red-900/20 p-6 rounded-xl border border-orange-500/30 my-6">
                    <h4 class="text-xl font-bold text-orange-300 mb-4">Soluções Profissionais para Quedas Extremas de FPS</h4>
                    
                    <h5 class="text-lg font-semibold text-white mt-6 mb-3">Configurações do Sistema para PCs Antigos</h5>
                    <p class="text-gray-300 mb-4">
                        Se você está jogando em um PC de 2015 ou anterior, estas configurações específicas podem ajudar:
                    </p>
                    
                    <div class="bg-gray-800/50 p-5 rounded-lg border border-gray-700 mb-6">
                        <h6 class="font-bold text-yellow-400 mb-3">Configurações de BIOS/UEFI</h6>
                        <ul class="text-gray-300 space-y-2">
                            <li>• Desative o CSM (Compatibility Support Module)</li>
                            <li>• Configure o XMP Profile para memória RAM</li>
                            <li>• Desative o C-states e P-states (geralmente em Advanced CPU Power Management)</li>
                            <li>• Configure o PCIe Speed para Gen1 se estiver usando placas antigas</li>
                        </ul>
                    </div>
                    
                    <h5 class="text-lg font-semibold text-white mt-6 mb-3">Configurações do Registro do Windows (Regedit)</h5>
                    <p class="text-gray-300 mb-4">
                        Edições no registro do Windows podem melhorar significativamente o desempenho no League of Legends:
                    </p>
                    
                    <div class="bg-purple-900/20 p-4 rounded-lg border border-purple-500/30 mb-4">
                        <p class="text-sm text-gray-300 italic">
                            ⚠️ AVISO: Faça backup do registro antes de fazer alterações
                        </p>
                    </div>
                    
                    <div class="overflow-x-auto">
                        <table class="w-full border-collapse border border-gray-700 text-sm">
                            <thead>
                                <tr class="bg-gray-800">
                                    <th class="border border-gray-700 px-4 py-2 text-left">Chave do Registro</th>
                                    <th class="border border-gray-700 px-4 py-2 text-left">Valor</th>
                                    <th class="border border-gray-700 px-4 py-2 text-left">Descrição</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="bg-gray-800/50">
                                    <td class="border border-gray-700 px-4 py-2">HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Services\\dxgkrnl</td>
                                    <td class="border border-gray-700 px-4 py-2">TdrLevel = 0</td>
                                    <td class="border border-gray-700 px-4 py-2">Desativa o timeout de driver (pode ajudar em quedas de FPS)</td>
                                </tr>
                                <tr>
                                    <td class="border border-gray-700 px-4 py-2">HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games</td>
                                    <td class="border border-gray-700 px-4 py-2">SFIO Priority = High</td>
                                    <td class="border border-gray-700 px-4 py-2">Prioridade de E/S para jogos</td>
                                </tr>
                                <tr class="bg-gray-800/50">
                                    <td class="border border-gray-700 px-4 py-2">HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Control\\PriorityControl</td>
                                    <td class="border border-gray-700 px-4 py-2">Win32PrioritySeparation = 38</td>
                                    <td class="border border-gray-700 px-4 py-2">Prioridade do scheduler de threads</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            `
        },
        {
            title: "8. Prevenção e Manutenção Contínua",
            content: `
                <div class="bg-gradient-to-r from-teal-900/20 to-green-900/20 p-6 rounded-xl border border-teal-500/30 my-6">
                    <h4 class="text-xl font-bold text-teal-300 mb-4">Manutenção Preventiva para Estabilidade de FPS</h4>
                    
                    <h5 class="text-lg font-semibold text-white mt-6 mb-3">Rotina Semanal</h5>
                    <p class="text-gray-300 mb-4">
                        Mantenha seu sistema otimizado com esta rotina semanal:
                    </p>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                            <h6 class="font-bold text-green-400 mb-2">Limpeza do Sistema</h6>
                            <ul class="text-sm text-gray-300 space-y-1">
                                <li>• Execute limpeza de disco (Cleanmgr)</li>
                                <li>• Verifique integridade do disco (CHKDSK)</li>
                                <li>• Reinicie o Windows Update</li>
                                <li>• Verifique espaço em disco disponível</li>
                            </ul>
                        </div>
                        
                        <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                            <h6 class="font-bold text-green-400 mb-2">Verificação de Hardware</h6>
                            <ul class="text-sm text-gray-300 space-y-1">
                                <li>• Monitore temperaturas</li>
                                <li>• Verifique pasta térmica</li>
                                <li>• Limpe poeira do sistema</li>
                                <li>• Teste memória RAM</li>
                            </ul>
                        </div>
                    </div>
                    
                    <h5 class="text-lg font-semibold text-white mt-6 mb-3">Boas Práticas de Jogo</h5>
                    <p class="text-gray-300 mb-4">
                        Adote estas práticas para manter o desempenho constante no League of Legends:
                    </p>
                    
                    <div class="space-y-4">
                        <div class="flex items-start space-x-3">
                            <div class="bg-blue-500 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">
                                <span class="text-xs font-bold text-white">✓</span>
                            </div>
                            <div>
                                <h6 class="font-bold text-blue-400">Antes de jogar</h6>
                                <ul class="text-sm text-gray-300 space-y-1">
                                    <li>• Feche todos os navegadores e aplicativos desnecessários</li>
                                    <li>• Ative o modo de foco do Windows</li>
                                    <li>• Verifique conexão com a internet</li>
                                    <li>• Reinicie o roteador se necessário</li>
                                </ul>
                            </div>
                        </div>
                        
                        <div class="flex items-start space-x-3">
                            <div class="bg-blue-500 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">
                                <span class="text-xs font-bold text-white">✓</span>
                            </div>
                            <div>
                                <h6 class="font-bold text-blue-400">Durante o jogo</h6>
                                <ul class="text-sm text-gray-300 space-y-1">
                                    <li>• Evite alternar entre janelas desnecessariamente</li>
                                    <li>• Não use softwares de overlay durante partidas importantes</li>
                                    <li>• Monitore o desempenho com overlay leve</li>
                                    <li>• Mantenha o jogo em modo de tela cheia</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            `
        }
    ];

    const frequentlyAskedQuestions = [
        {
            question: "Por que o League of Legends fica lento em teamfights?",
            answer: "Durante teamfights, o League of Legends precisa renderizar muitos efeitos visuais simultaneamente (skills, animações, partículas). O jogo depende fortemente de um único núcleo da CPU, então quando há sobrecarga nesse núcleo, ocorrem quedas drásticas de FPS. Desativar as sombras e limitar a qualidade dos efeitos ajuda significativamente."
        },
        {
            question: "Qual é a melhor configuração de vídeo para League of Legends?",
            answer: "A configuração ideal envolve: Sombras em 'Desativado', Qualidade dos Efeitos em 'Médio', Modo de Janela em 'Sem Bordas' ou 'Tela Cheia', e FPS limitado a um valor estável (como 144 ou sua taxa de atualização do monitor). Essas configurações oferecem o melhor equilíbrio entre fluidez e estabilidade."
        },
        {
            question: "Como posso monitorar meu desempenho no LoL?",
            answer: "Use ferramentas como MSI Afterburner com RivaTuner Statistics Server para monitorar FPS, temperatura e uso de CPU/GPU em tempo real. Também utilize o Gerenciador de Tarefas do Windows para verificar uso de recursos e identificar processos que possam estar consumindo recursos do sistema."
        },
        {
            question: "É seguro modificar o registro do Windows para melhorar o LoL?",
            answer: "Modificar o registro do Windows pode melhorar o desempenho, mas deve ser feito com cautela. Sempre faça backup do registro antes de fazer alterações e apenas utilize chaves recomendadas por fontes confiáveis. Erros no registro podem causar instabilidade no sistema."
        },
        {
            question: "Quando devo considerar atualizar meu hardware para jogar LoL?",
            answer: "Considere atualizar seu hardware se você tem um processador com mais de 6 anos e está enfrentando consistentes quedas de FPS abaixo de 30 FPS mesmo com todas as configurações no mínimo. Um upgrade de CPU geralmente é mais benéfico para o LoL do que um upgrade de GPU, devido à dependência do jogo de single-core performance."
        }
    ];

    const externalResources = [
        {
            title: "Fórum Oficial de Suporte da Riot Games",
            url: "https://boards.na.leagueoflegends.com/pt/",
            description: "Comunidade oficial para suporte técnico e discussões sobre o jogo"
        },
        {
            title: "Reddit r/leagueoflegends",
            url: "https://www.reddit.com/r/leagueoflegends/",
            description: "Comunidade internacional com dicas e suporte para jogadores"
        },
        {
            title: "Guia de Hardware para LoL",
            url: "https://www.leagueoflegends.com/en-us/how-to-play/best-pc-specs/",
            description: "Requisitos oficiais e recomendações de hardware da Riot Games"
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/league-of-legends-tela-preta-carregamento",
            title: "Erro de Tela Preta",
            description: "Resolva problemas ao entrar na partida."
        },
        {
            href: "/guias/reduzir-ping-jogos-online",
            title: "Reduzir Ping",
            description: "Dicas de rede para evitar o 'Lag' no LoL."
        },
        {
            href: "/guias/otimizacao-performance",
            title: "Performance Windows",
            description: "Ajuste o Windows para jogos leves."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="20 min"
            difficultyLevel="Intermediário"
            contentSections={contentSections}
            summaryTable={summaryTable}
            faqItems={frequentlyAskedQuestions}
            externalReferences={externalResources.map(resource => ({ name: resource.title, url: resource.url }))}
            relatedGuides={relatedGuides}
        />
    );
}