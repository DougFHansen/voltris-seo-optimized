import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'calibrar-bateria-notebook',
  title: "Como Calibrar a Bateria do Notebook em 2026 (Fix Porcentagem)",
  description: "Seu notebook desliga do nada mesmo marcando 20%? Aprenda a calibrar a bateria para ter uma leitura precisa de quanto tempo de carga você ainda tem.",
  category: 'windows-geral',
  difficulty: 'Intermediário',
  time: '6 horas'
};

const title = "Como Calibrar a Bateria do Notebook em 2026 (Fix Porcentagem)";
const description = "Seu notebook desliga do nada mesmo marcando 20%? Aprenda a calibrar a bateria para ter uma leitura precisa de quanto tempo de carga você ainda tem.";
const keywords = [
    'como calibrar bateria notebook windows 11 2026',
    'notebook desliga sozinho com carga como resolver',
    'calibração de bateria passo a passo tutorial',
    'bateria notebook viciada ou descalibrada guia 2026',
    'resetar contador de bateria windows 11 tutorial'
];

export const metadata: Metadata = createGuideMetadata('calibrar-bateria-notebook', title, description, keywords);

export default function BatteryCalibrationGuide() {
    const summaryTable = [
        { label: "Sintoma", value: "Desligamento súbito em 10% ou 20%" },
        { label: "O que faz", value: "Sincroniza o sensor de carga com a química real" },
        { label: "Frequência", value: "Uma vez a cada 3 meses" },
        { label: "Dificuldade", value: "Médio" }
    ];

    const contentSections = [
        {
            title: "Por que a bateria \"mente\"?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Com o passar do tempo em 2026, o sensor digital que mede a carga da bateria (Fuel Gauge) pode perder o sincronismo com a capacidade química real das células. Isso faz com que o Windows ache que você ainda tem 15% de bateria, quando na verdade ela já está no fim, causando o desligamento repentino do notebook. A **calibração** não recupera uma bateria morta, mas faz com que a porcentagem mostrada seja real.
        </p>
      `
        },
        {
            title: "1. Passo a Passo do Ciclo Completo",
            content: `
        <p class="mb-4 text-gray-300">Siga este procedimento para resetar o sensor:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Carregue o notebook até <strong>100%</strong> e deixe-o ligado na tomada por mais 2 horas para garantir a carga total.</li>
            <li>Desconecte o carregador e use o aparelho até que ele descarregue completamente e desligue sozinho.</li>
            <li><strong>Importante:</strong> Deixe o notebook desligado e sem carga por cerca de 3 a 5 horas.</li>
            <li>Conecte o carregador e deixe-o carregar ininterruptamente até 100% novamente.</li>
            <li>Agora o Windows terá os novos pontos de referência (0% e 100%) sincronizados.</li>
        </ol>
      `
        },
        {
            title: "2. Preparando o Windows para a Calibração",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Ajuste de Energia:</h4>
            <p class="text-sm text-gray-300">
                Para que o notebook não hiberne antes da hora no passo 2, vá em Opções de Energia > Alterar configurações do plano. <br/><br/>
                Certifique-se de que a opção de 'Hibernar' em bateria esteja marcada como **'Nunca'**. Isso permite que as células de íon-lítio descarreguem até o limite seguro configurado pelo hardware, e não pelo software do Windows.
            </p>
        </div>
      `
        },
        {
            title: "3. Quando a calibração não resolve?",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>Dica de 2026:</strong> 
            <br/><br/>Se mesmo após calibrar, o seu notebook continua durando apenas 30 minutos, o problema é o desgaste físico das células (degradação). Use o nosso guia de 'Verificar Saúde da Bateria' para ver o nível de desgaste. Se a capacidade de carga total for menor que 50% da original, a calibração não ajudará mais: você precisará substituir a bateria fisicamente.
        </p>
      `
        }
    ];

    const advancedContentSections = [
    {
      title: "Ciência das Baterias de Íon-Lítio: Química e Degradacão",
      content: `
        <h4 class="text-white font-bold mb-3">🔋 Química das Baterias de Íon-Lítio</h4>
        <p class="mb-4 text-gray-300">
          As baterias de íon-lítio utilizadas em notebooks são compostas por células eletroquímicas que armazenam energia através do movimento de íons de lítio entre o cátodo e o ânodo. A compreensão dos princípios químicos subjacentes é essencial para entender o processo de calibração e degradação:
        </p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div class="bg-blue-900/10 p-4 rounded-lg border border-blue-500/20">
            <h5 class="text-blue-400 font-bold mb-2">Componentes Químicos</h5>
            <ul class="text-sm text-gray-300 space-y-2">
              <li>• Cátodo: Óxido de cobalto, níquel ou manganês</li>
              <li>• Ânodo: Grafite ou silicone</li>
              <li>• Eletrólito: Solução de sais de lítio em solvente orgânico</li>
              <li>• Separador: Polietileno ou polipropileno microporoso</li>
              <li>• Coletor de corrente: Cobre (ânodo) e alumínio (cátodo)</li>
              <li>• Circuito de proteção: Controla carga/descarga segura</li>
            </ul>
          </div>
          <div class="bg-purple-900/10 p-4 rounded-lg border border-purple-500/20">
            <h5 class="text-purple-400 font-bold mb-2">Reações Eletroquímicas</h5>
            <ul class="text-sm text-gray-300 space-y-2">
              <li>• Durante a carga: Li⁺ move-se do cátodo para o ânodo</li>
              <li>• Durante a descarga: Li⁺ move-se do ânodo para o cátodo</li>
              <li>• Capacidade nominal: Medida em mAh (miliampere-hora)</li>
              <li>• Tensão nominal: 3.7V por célula</li>
              <li>• Tensão de corte: 4.2V (carga completa) e 2.5V (descarga completa)</li>
              <li>• Densidade energética: 150-250 Wh/kg</li>
            </ul>
          </div>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">📊 Processos de Degradação</h4>
        <p class="mb-4 text-gray-300">
          A degradação das baterias de íon-lítio ocorre por meio de múltiplos mecanismos químicos e físicos:
        </p>
        
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-gray-300 border border-gray-700 rounded-lg">
            <thead class="bg-gray-800">
              <tr>
                <th class="p-3 text-left">Mecanismo</th>
                <th class="p-3 text-left">Descrição</th>
                <th class="p-3 text-left">Taxa de Perda</th>
                <th class="p-3 text-left">Fator de Aceleração</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-t border-gray-700">
                <td class="p-3">SEI Formation</td>
                <td class="p-3">Formação de película passiva no ânodo</td>
                <td class="p-3">2-5% p/ano</td>
                <td class="p-3">Alta temperatura</td>
              </tr>
              <tr class="border-t border-gray-700 bg-gray-800/30">
                <td class="p-3">Lithium Plating</td>
                <td class="p-3">Depósito metálico de lítio</td>
                <td class="p-3">5-15% p/ano</td>
                <td class="p-3">Cargas rápidas</td>
              </tr>
              <tr class="border-t border-gray-700">
                <td class="p-3">Electrolyte Decomposition</td>
                <td class="p-3">Decomposição do eletrólito</td>
                <td class="p-3">1-3% p/ano</td>
                <td class="p-3">Alta tensão</td>
              </tr>
              <tr class="border-t border-gray-700 bg-gray-800/30">
                <td class="p-3">Active Material Loss</td>
                <td class="p-3">Perda de material ativo</td>
                <td class="p-3">2-8% p/ano</td>
                <td class="p-3">Ciclos profundos</td>
              </tr>
              <tr class="border-t border-gray-700">
                <td class="p-3">Separator Degradation</td>
                <td class="p-3">Degradação do separador</td>
                <td class="p-3">1-4% p/ano</td>
                <td class="p-3">Ciclagem térmica</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="bg-amber-900/10 p-5 rounded-xl border border-amber-500/20 mt-6">
          <h4 class="text-amber-400 font-bold mb-2">🔍 Fato Técnico Importante</h4>
          <p class="text-sm text-gray-300">
            O processo de degradação não é linear e acelera significativamente após atingir cerca de 80% da capacidade original. A calibração não reverte esta degradação química, apenas recalibra o sistema de medição para refletir com precisão a capacidade restante.
          </p>
        </div>
      `
    },
    {
      title: "Sistemas de Gerenciamento de Bateria e Firmware",
      content: `
        <h4 class="text-white font-bold mb-3">⚡ Unidades de Gerenciamento de Bateria (BMU)</h4>
        <p class="mb-4 text-gray-300">
          O sistema de gerenciamento de bateria (Battery Management System - BMS) é responsável por monitorar e controlar com precisão o estado de carga e saúde da bateria. Este sistema inclui sensores, circuitos e firmware especializados:
        </p>
        
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-gray-300 border border-gray-700 rounded-lg">
            <thead class="bg-gray-800">
              <tr>
                <th class="p-3 text-left">Componente</th>
                <th class="p-3 text-left">Função</th>
                <th class="p-3 text-left">Precisão</th>
                <th class="p-3 text-left">Atualização</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-t border-gray-700">
                <td class="p-3">Coulomb Counter</td>
                <td class="p-3">Medição de carga/descarga</td>
                <td class="p-3">±1-2%</td>
                <td class="p-3">Firmware</td>
              </tr>
              <tr class="border-t border-gray-700 bg-gray-800/30">
                <td class="p-3">Voltage Monitor</td>
                <td class="p-3">Monitoramento de tensão</td>
                <td class="p-3">±0.5%</td>
                <td class="p-3">Hardware</td>
              </tr>
              <tr class="border-t border-gray-700">
                <td class="p-3">Temperature Sensor</td>
                <td class="p-3">Monitoramento térmico</td>
                <td class="p-3">±1°C</td>
                <td class="p-3">Hardware</td>
              </tr>
              <tr class="border-t border-gray-700 bg-gray-800/30">
                <td class="p-3">Current Sensor</td>
                <td class="p-3">Medição de corrente</td>
                <td class="p-3">±0.5%</td>
                <td class="p-3">Hardware</td>
              </tr>
              <tr class="border-t border-gray-700">
                <td class="p-3">Fuel Gauge IC</td>
                <td class="p-3">Algoritmo de estimativa de carga</td>
                <td class="p-3">±3-5%</td>
                <td class="p-3">Firmware</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">🔧 Processo de Calibração Técnica</h4>
        <p class="mb-4 text-gray-300">
          A calibração envolve uma série de medições e cálculos precisos para redefinir os pontos de referência do sistema:
        </p>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div class="bg-green-900/10 p-4 rounded-lg border border-green-500/20">
            <h5 class="text-green-400 font-bold mb-2">Reset de Coulomb Counter</h5>
            <ul class="text-sm text-gray-300 space-y-1">
              <li>Descarga completa controlada</li>
              <li>Medição de carga total</li>
              <li>Estabelecimento de ponto zero</li>
              <li>Verificação de integridade</li>
            </ul>
          </div>
          
          <div class="bg-cyan-900/10 p-4 rounded-lg border border-cyan-500/20">
            <h5 class="text-cyan-400 font-bold mb-2">Atualização de Curva de Descarga</h5>
            <li>Mapeamento de tensão vs. carga</li>
            <li>Compensação de temperatura</li>
            <li>Adaptação a degradação</li>
            <li>Refinamento de estimativas</li>
            </ul>
          </div>
          
          <div class="bg-indigo-900/10 p-4 rounded-lg border border-indigo-500/20">
            <h5 class="text-indigo-400 font-bold mb-2">Reconfiguração de Limites</h5>
            <ul class="text-sm text-gray-300 space-y-1">
              <li>Tensão de corte seguro</li>
              <li>Limites de temperatura</li>
              <li>Proteções contra sobrecarga</li>
              <li>Algoritmos de equalização</li>
            </ul>
          </div>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">🛠️ Comandos e Ferramentas de Calibração</h4>
        <p class="mb-4 text-gray-300">
          Ferramentas e comandos para diagnosticar e calibrar o sistema de bateria:
        </p>
        
        <ul class="list-disc list-inside text-gray-300 space-y-2 mb-6">
          <li><strong>Relatório de bateria:</strong> powercfg /batteryreport (gera relatório completo)</li>
          <li><strong>Gráfico de uso:</strong> powercfg /sleepstudy (análise de consumo)</li>
          <li><strong>Configuração de energia:</strong> powercfg /setactive (alterar plano de energia)</li>
          <li><strong>Monitoramento em tempo real:</strong> powercfg /energy (relatório de eficiência)</li>
          <li><strong>Reset de calibração:</strong> Utilização de ferramentas OEM específicas</li>
          <li><strong>Firmware updates:</strong> Atualizações do sistema de gerenciamento de energia</li>
        </ul>
      `
    },
    {
      title: "Tecnologias Emergentes em Armazenamento de Energia e Gestão de Carga",
      content: `
        <h4 class="text-white font-bold mb-3">🚀 Tecnologias de Bateria de Próxima Geração</h4>
        <p class="mb-4 text-gray-300">
          A próxima geração de baterias para notebooks está explorando tecnologias avançadas que prometem maior densidade energética, ciclos de vida mais longos e tempos de carga mais rápidos:
        </p>
        
        <h4 class="text-white font-bold mb-3">Baterias Sólidas e Semi-Sólidas</h4>
        <p class="mb-4 text-gray-300">
          Novas tecnologias de bateria que estão sendo implementadas:
        </p>
        
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-gray-300 border border-gray-700 rounded-lg">
            <thead class="bg-gray-800">
              <tr>
                <th class="p-3 text-left">Tecnologia</th>
                <th class="p-3 text-left">Densidade Energética</th>
                <th class="p-3 text-left">Ciclos de Vida</th>
                <th class="p-3 text-left">Tempo de Carga</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-t border-gray-700">
                <td class="p-3">Íon-Lítio Convencional</td>
                <td class="p-3">150-250 Wh/L</td>
                <td class="p-3">500-1000 ciclos</td>
                <td class="p-3">1-3 horas</td>
              </tr>
              <tr class="border-t border-gray-700 bg-gray-800/30">
                <td class="p-3">Silicone-Ânodo</td>
                <td class="p-3">300-400 Wh/L</td>
                <td class="p-3">1000-2000 ciclos</td>
                <td class="p-3">30-60 min</td>
              </tr>
              <tr class="border-t border-gray-700">
                <td class="p-3">Estado Sólido</td>
                <td class="p-3">400-500 Wh/L</td>
                <td class="p-3">2000-5000 ciclos</td>
                <td class="p-3">10-20 min</td>
              </tr>
              <tr class="border-t border-gray-700 bg-gray-800/30">
                <td class="p-3">Lítio-Metal</td>
                <td class="p-3">500-600 Wh/L</td>
                <td class="p-3">1500-3000 ciclos</td>
                <td class="p-3">15-30 min</td>
              </tr>
              <tr class="border-t border-gray-700">
                <td class="p-3">Fluxo Orgânico</td>
                <td class="p-3">200-300 Wh/L</td>
                <td class="p-3">5000+ ciclos</td>
                <td class="p-3">5-15 min</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">🤖 Inteligência Artificial em Gestão de Energia</h4>
        <p class="mb-4 text-gray-300">
          A IA está começando a desempenhar um papel crucial na otimização de sistemas de bateria:
        </p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div class="bg-purple-900/10 p-4 rounded-lg border border-purple-500/20">
            <h5 class="text-purple-400 font-bold mb-2">Predição de Vida Útil</h5>
            <ul class="text-sm text-gray-300 space-y-2">
              <li>Análise preditiva de degradação</li>
              <li>Modelagem de ciclos de vida</li>
              <li>Alertas de substituição preventiva</li>
              <li>Otimização de ciclos de carga</li>
              <li>Personalização de uso</li>
              <li>Manutenção preditiva</li>
            </ul>
          </div>
          
          <div class="bg-amber-900/10 p-4 rounded-lg border border-amber-500/20">
            <h5 class="text-amber-400 font-bold mb-2">Gestão de Carga Inteligente</h5>
            <ul class="text-sm text-gray-300 space-y-2">
              <li>Carregamento adaptativo</li>
              <li>Controle térmico preditivo</li>
              <li>Equilíbrio de células em tempo real</li>
              <li>Otimização de eficiência</li>
              <li>Gerenciamento de pico de demanda</li>
              <li>Integração com fontes de energia</li>
            </ul>
          </div>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">🔬 Pesquisas em Andamento</h4>
        <p class="mb-4 text-gray-300">
          Universidades e empresas de tecnologia estão investindo pesadamente em pesquisa de armazenamento de energia de próxima geração:
        </p>
        
        <div class="space-y-4">
          <div class="flex items-start space-x-3">
            <div class="bg-blue-500 rounded-full p-2 mt-1 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h5 class="text-blue-400 font-bold">Solid-State Batteries</h5>
              <p class="text-sm text-gray-300">Empresas como QuantumScape e Solid Power estão desenvolvendo baterias de estado sólido que substituem o eletrólito líquido por um material sólido cerâmico. Essas baterias prometem maior segurança, maior densidade energética e ciclos de vida extremamente longos. Implementações iniciais em notebooks estão previstas para 2026-2028, com adoção generalizada esperada para 2028-2030.</p>
            </div>
          </div>
          
          <div class="flex items-start space-x-3">
            <div class="bg-green-500 rounded-full p-2 mt-1 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h5 class="text-green-400 font-bold">Silicon-Anode Technology</h5>
              <p class="text-sm text-gray-300">Universidades como Stanford e MIT estão desenvolvendo baterias com ânodos de silicone que podem armazenar até 10 vezes mais energia que os ânodos de grafite convencionais. A empresa Sila Nanotechnologies já está fornecendo materiais de silicone para fabricantes de baterias, com aplicações em notebooks previstas para 2026-2027.</p>
            </div>
          </div>
          
          <div class="flex items-start space-x-3">
            <div class="bg-purple-500 rounded-full p-2 mt-1 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h5 class="text-purple-400 font-bold">AI-Powered Battery Management</h5>
              <p class="text-sm text-gray-300">Empresas como Tesla e Apple estão desenvolvendo sistemas de gerenciamento de bateria baseados em IA que podem prever e adaptar os padrões de carga com base no uso do usuário. Esses sistemas aprendem com os hábitos de carregamento e descarga para otimizar a vida útil da bateria. Implementações avançadas estão sendo testadas para inclusão em notebooks a partir de 2026-2027.</p>
            </div>
          </div>
        </div>
        
        <div class="bg-red-900/10 p-5 rounded-xl border border-red-500/20 mt-6">
          <h4 class="text-red-400 font-bold mb-2">⚠️ Considerações Futuras</h4>
          <p class="text-sm text-gray-300">
            Com o avanço das tecnologias de bateria e a crescente demanda por dispositivos mais eficientes energeticamente, a calibração manual de baterias tornar-se-á cada vez menos necessária. Sistemas inteligentes baseados em IA e novos materiais de bateria com maior estabilidade química resultarão em baterias que se auto-calibram e mantêm sua precisão ao longo de toda a vida útil, reduzindo significativamente a necessidade de intervenção manual por parte do usuário.
          </p>
        </div>
      `
    }
  ];

    const relatedGuides = [
        {
            href: "/guias/saude-bateria-notebook",
            title: "Verificar Saúde",
            description: "Gere o relatório de bateria do Windows."
        },
        {
            href: "/guias/otimizacoes-para-notebook-gamer",
            title: "Otimizar Notebook",
            description: "Dicas para a bateria durar mais no dia a dia."
        },
        {
            href: "/guias/hibernacao-vs-suspensao-qual-o-melhor",
            title: "Hibernação vs Suspensão",
            description: "Entenda como economizar carga."
        }
    ];

    const allContentSections = [...contentSections, ...advancedContentSections];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="6 horas"
            difficultyLevel="Médio"
            contentSections={allContentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
