import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Microfone muito Baixo no Windows 11? Como Resolver (2026)";
const description = "Seu time não te ouve no Discord? Aprenda a aumentar o volume do microfone, configurar o ganho (boost) e remover ruídos de fundo no Windows 11 em 2026.";
const keywords = [
    'aumentar volume microfone windows 11 tutorial 2026',
    'microfone muito baixo discord como resolver guia',
    'ativar aumento de sensibilidade microfone windows 11',
    'melhorar qualidade do audio microfone tutorial 2026',
    'resolver microfone estourado ou com chiado guia'
];

export const metadata: Metadata = createGuideMetadata('aumentar-volume-microfone-windows', title, description, keywords);

export default function MicrophoneBoostGuide() {
    const summaryTable = [
        { label: "Nível Recomendado", value: "80% a 100%" },
        { label: "Ganho (Boost)", value: "+10dB a +20dB (Cuidado com chiado)" },
        { label: "Software Adjunto", value: "Discord / Voicemeeter / SteelSeries Sonar" },
        { label: "Dificuldade", value: "Iniciante" }
    ];

    const contentSections = [
        {
            title: "Por que meu microfone está tão baixo?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Ter um microfone baixo pode ser causado por três motivos principais: drivers genéricos do Windows, configurações de sensibilidade mal ajustadas ou o fato de o Windows 11 estar "gerenciando" o volume para você sem permissão. Em 2026, com o aumento das chamadas de vídeo e trabalho remoto, ter uma voz clara e audível não é apenas para gamers, mas uma necessidade profissional.
        </p>
      `
        },
        {
            title: "1. Aumentando o Ganho (Microphone Boost)",
            content: `
        <p class="mb-4 text-gray-300">Este é o ajuste mais potente no sistema:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Vá em Painel de Controle > Som > Aba Gravação.</li>
            <li>Clique com o botão direito no seu microfone e vá em <strong>Propriedades</strong>.</li>
            <li>Na aba 'Níveis', certifique-se de que o primeiro slider esteja em 100.</li>
            <li>No segundo slider (<strong>Aumento do Microfone</strong>), experimente colocar em +10dB ou +20dB. <br/> <i>Atenção: Aumentar demais pode causar chiados de fundo.</i></li>
        </ol>
      `
        },
        {
            title: "2. Desativando o Controle Exclusivo",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Evite que o Discord mude o seu volume:</h4>
            <p class="text-sm text-gray-300">
                Ainda nas Propriedades do Microfone, vá na aba <strong>Avançado</strong>. Desmarque a opção <strong>"Permitir que aplicativos assumam controle exclusivo deste dispositivo"</strong>. Isso impede que programas como Skype ou Discord diminuam o seu volume sozinhos no meio de uma fala.
            </p>
        </div>
      `
        },
        {
            title: "3. Plugins de Redução de Ruído (IA) em 2026",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>Voz de Estúdio:</strong> 
            <br/><br/>Se você aumentou o ganho e agora ouve o ventilador ou o teclado, use ferramentas de IA como o <strong>NVIDIA Broadcast</strong> ou a redução de ruído integrada do <strong>Discord (Krisp)</strong>. Em 2026, essas ferramentas conseguem isolar a sua voz com perfeição, permitindo que você suba o volume (Boost) sem trazer o barulho da casa junto.
        </p>
      `
        }
    ];

    const advancedContentSections = [
    {
      title: "Arquitetura de Áudio no Windows: Componentes e Pipeline de Processamento",
      content: `
        <h4 class="text-white font-bold mb-3">⚙️ Componentes do Sistema de Áudio do Windows</h4>
        <p class="mb-4 text-gray-300">
          O sistema de áudio do Windows é uma arquitetura complexa que envolve múltiplos componentes trabalhando em conjunto para capturar, processar e reproduzir áudio. Entender esta arquitetura é fundamental para diagnosticar problemas de microfone e otimizar a qualidade do áudio.
        </p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div class="bg-blue-900/10 p-4 rounded-lg border border-blue-500/20">
            <h5 class="text-blue-400 font-bold mb-2">Camadas de Software</h5>
            <ul class="text-sm text-gray-300 space-y-2">
              <li>• Windows Audio Session API (WASAPI)</li>
              <li>• DirectSound</li>
              <li>• Kernel Streaming</li>
              <li>• Audio Processing Object (APO)</li>
              <li>• Realtek HD Audio Manager</li>
              <li>• Driver Universal Audio Architecture (UAA)</li>
            </ul>
          </div>
          <div class="bg-purple-900/10 p-4 rounded-lg border border-purple-500/20">
            <h5 class="text-purple-400 font-bold mb-2">Hardware de Áudio</h5>
            <ul class="text-sm text-gray-300 space-y-2">
              <li>• Codec de Áudio (Realtek, VIA, etc.)</li>
              <li>• Controlador USB de Áudio</li>
              <li>• DSP (Digital Signal Processor)</li>
              <li>• FPGA em microfones premium</li>
              <li>• Conversores ADC/DAC</li>
              <li>• Amplificadores de Ganho</li>
            </ul>
          </div>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">🔗 Pipeline de Captura de Áudio</h4>
        <p class="mb-4 text-gray-300">
          Quando um microfone captura áudio, o sinal passa por um pipeline complexo de processamento:
        </p>
        
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-gray-300 border border-gray-700 rounded-lg">
            <thead class="bg-gray-800">
              <tr>
                <th class="p-3 text-left">Etapa</th>
                <th class="p-3 text-left">Componente</th>
                <th class="p-3 text-left">Função</th>
                <th class="p-3 text-left">Possível Ajuste</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-t border-gray-700">
                <td class="p-3">1</td>
                <td class="p-3">Microfone</td>
                <td class="p-3">Conversão analógica-digital</td>
                <td class="p-3">Sensibilidade física</td>
              </tr>
              <tr class="border-t border-gray-700 bg-gray-800/30">
                <td class="p-3">2</td>
                <td class="p-3">ADC</td>
                <td class="p-3">Digitalização do sinal</td>
                <td class="p-3">Taxa de amostragem</td>
              </tr>
              <tr class="border-t border-gray-700">
                <td class="p-3">3</td>
                <td class="p-3">Driver de Áudio</td>
                <td class="p-3">Interface com o sistema</td>
                <td class="p-3">Ganho e equalização</td>
              </tr>
              <tr class="border-t border-gray-700 bg-gray-800/30">
                <td class="p-3">4</td>
                <td class="p-3">Mixer do Windows</td>
                <td class="p-3">Controle de volume</td>
                <td class="p-3">Volume e boost</td>
              </tr>
              <tr class="border-t border-gray-700">
                <td class="p-3">5</td>
                <td class="p-3">APOs</td>
                <td class="p-3">Processamento de efeitos</td>
                <td class="p-3">Redução de ruído, aprimoramento</td>
              </tr>
              <tr class="border-t border-gray-700 bg-gray-800/30">
                <td class="p-3">6</td>
                <td class="p-3">Aplicativo</td>
                <td class="p-3">Utilização do áudio</td>
                <td class="p-3">Configurações específicas</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="bg-amber-900/10 p-5 rounded-xl border border-amber-500/20 mt-6">
          <h4 class="text-amber-400 font-bold mb-2">🔍 Curiosidade Técnica</h4>
          <p class="text-sm text-gray-300">
            O Windows 11 utiliza uma arquitetura de áudio chamada "Universal Audio Architecture" (UAA) que padroniza o comportamento de drivers de áudio. Esta arquitetura permite taxas de amostragem de até 384kHz em 32-bit, muito superior ao CD Audio (44.1kHz/16-bit), proporcionando margem para processamento de ganho sem degradação perceptível.
          </p>
        </div>
      `
    },
    {
      title: "Técnicas Avançadas de Aumento de Ganho e Processamento de Sinais",
      content: `
        <h4 class="text-white font-bold mb-3">🔊 Técnicas de Aumento de Ganho Profissional</h4>
        <p class="mb-4 text-gray-300">
          Existem várias técnicas avançadas para aumentar o ganho de microfone além do controle básico do Windows. Cada técnica tem implicações diferentes na qualidade do áudio e no ruído de fundo.
        </p>
        
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-gray-300 border border-gray-700 rounded-lg">
            <thead class="bg-gray-800">
              <tr>
                <th class="p-3 text-left">Técnica</th>
                <th class="p-3 text-left">Faixa de Ganho</th>
                <th class="p-3 text-left">Ruído Adicional</th>
                <th class="p-3 text-left">Qualidade de Áudio</th>
                <th class="p-3 text-left">Complexidade</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-t border-gray-700">
                <td class="p-3">Microphone Boost (Hardware)</td>
                <td class="p-3">+10dB a +30dB</td>
                <td class="p-3">Baixo</td>
                <td class="p-3">Alta</td>
                <td class="p-3">Baixa</td>
              </tr>
              <tr class="border-t border-gray-700 bg-gray-800/30">
                <td class="p-3">Software Amplification</td>
                <td class="p-3">+6dB a +40dB</td>
                <td class="p-3">Médio</td>
                <td class="p-3">Média</td>
                <td class="p-3">Baixa</td>
              </tr>
              <tr class="border-t border-gray-700">
                <td class="p-3">Digital Gain Processing</td>
                <td class="p-3">+10dB a +60dB</td>
                <td class="p-3">Alto</td>
                <td class="p-3">Baixa</td>
                <td class="p-3">Média</td>
              </tr>
              <tr class="border-t border-gray-700 bg-gray-800/30">
                <td class="p-3">FPGA Signal Processing</td>
                <td class="p-3">+20dB a +80dB</td>
                <td class="p-3">Muito Baixo</td>
                <td class="p-3">Muito Alta</td>
                <td class="p-3">Muito Alta</td>
              </tr>
              <tr class="border-t border-gray-700">
                <td class="p-3">AI-Enhanced Gain</td>
                <td class="p-3">+15dB a +50dB</td>
                <td class="p-3">Muito Baixo</td>
                <td class="p-3">Muito Alta</td>
                <td class="p-3">Alta</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">🔧 Configurações Avançadas de Processamento de Áudio</h4>
        <p class="mb-4 text-gray-300">
          Para profissionais de áudio e streamers, existem configurações avançadas que podem otimizar o ganho e a qualidade do microfone:
        </p>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div class="bg-green-900/10 p-4 rounded-lg border border-green-500/20">
            <h5 class="text-green-400 font-bold mb-2">Equalização</h5>
            <ul class="text-sm text-gray-300 space-y-1">
              <li>Atenuar frequências baixas (50-200Hz)</li>
              <li>Realçar médias (1-3kHz)</li>
              <li>Controlar agudos (8-12kHz)</li>
              <li>Eliminar realces excessivos</li>
            </ul>
          </div>
          
          <div class="bg-cyan-900/10 p-4 rounded-lg border border-cyan-500/20">
            <h5 class="text-cyan-400 font-bold mb-2">Compressão</h5>
            <ul class="text-sm text-gray-300 space-y-1">
              <li>Ratio 3:1 para voz</li>
              <li>Threshold em -18dB</li>
              <li>Attack rápido (2-5ms)</li>
              <li>Release médio (50-100ms)</li>
            </ul>
          </div>
          
          <div class="bg-indigo-900/10 p-4 rounded-lg border border-indigo-500/20">
            <h5 class="text-indigo-400 font-bold mb-2">Gating</h5>
            <ul class="text-sm text-gray-300 space-y-1">
              <li>Threshold em -35dB</li>
              <li>Attack rápido (1-2ms)</li>
              <li>Hold por 100-200ms</li>
              <li>Reduz ruído de fundo</li>
            </ul>
          </div>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">📊 Métricas de Qualidade de Áudio</h4>
        <p class="mb-4 text-gray-300">
          Profissionais de áudio utilizam métricas específicas para avaliar a qualidade do sinal de áudio:
        </p>
        
        <ul class="list-disc list-inside text-gray-300 space-y-2 mb-6">
          <li><strong>Razão Sinal-Ruído (SNR):</strong> Ideal >60dB para gravação profissional</li>
          <li><strong>Distorsão Harmônica Total (THD):</strong> Ideal <0.1% para microfones de qualidade</li>
          <li><strong>Taxa de Amostragem:</strong> 48kHz é padrão para VoIP, 96kHz para gravação profissional</li>
          <li><strong>Profundidade de Bits:</strong> 24-bit é preferido para maior resolução de volume</li>
          <li><strong>Latência:</strong> <10ms para aplicações em tempo real como streaming</li>
        </ul>
      `
    },
    {
      title: "Tecnologias de Redução de Ruído e Aprimoramento de Voz em 2026",
      content: `
        <h4 class="text-white font-bold mb-3">🤖 Inteligência Artificial em Processamento de Áudio</h4>
        <p class="mb-4 text-gray-300">
          Em 2026, as tecnologias de IA para processamento de áudio alcançaram níveis impressionantes de sofisticação, permitindo o aprimoramento de microfones com ganho elevado sem comprometer a qualidade do áudio. Estas tecnologias utilizam redes neurais profundas para separar a voz humana de ruídos de fundo, permitindo ganhos maiores sem realçar ruídos indesejados.
        </p>
        
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-gray-300 border border-gray-700 rounded-lg">
            <thead class="bg-gray-800">
              <tr>
                <th class="p-3 text-left">Tecnologia</th>
                <th class="p-3 text-left">Fabricante</th>
                <th class="p-3 text-left">Redução de Ruído</th>
                <th class="p-3 text-left">Preservação de Voz</th>
                <th class="p-3 text-left">Latência Média</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-t border-gray-700">
                <td class="p-3">NVIDIA RTX Voice</td>
                <td class="p-3">NVIDIA</td>
                <td class="p-3">Até 95%</td>
                <td class="p-3">Excelente</td>
                <td class="p-3">5-10ms</td>
              </tr>
              <tr class="border-t border-gray-700 bg-gray-800/30">
                <td class="p-3">AMD Noise Suppression</td>
                <td class="p-3">AMD</td>
                <td class="p-3">Até 90%</td>
                <td class="p-3">Muito Boa</td>
                <td class="p-3">8-15ms</td>
              </tr>
              <tr class="border-t border-gray-700">
                <td class="p-3">Intel Gaussian & Lombard</td>
                <td class="p-3">Intel</td>
                <td class="p-3">Até 85%</td>
                <td class="p-3">Boa</td>
                <td class="p-3">10-20ms</td>
              </tr>
              <tr class="border-t border-gray-700 bg-gray-800/30">
                <td class="p-3">Krisp AI Noise Cancellation</td>
                <td class="p-3">Krisp</td>
                <td class="p-3">Até 98%</td>
                <td class="p-3">Excelente</td>
                <td class="p-3">15-25ms</td>
              </tr>
              <tr class="border-t border-gray-700">
                <td class="p-3">Voicemeeter AI Enhancer</td>
                <td class="p-3">VB-Audio</td>
                <td class="p-3">Até 92%</td>
                <td class="p-3">Muito Boa</td>
                <td class="p-3">12-18ms</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">🧠 Arquiteturas de Redes Neurais para Áudio</h4>
        <p class="mb-4 text-gray-300">
          As redes neurais utilizadas para processamento de áudio são especificamente treinadas para distinguir entre voz humana e ruídos de fundo:
        </p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div class="bg-purple-900/10 p-4 rounded-lg border border-purple-500/20">
            <h5 class="text-purple-400 font-bold mb-2">Técnicas de Separação</h5>
            <ul class="text-sm text-gray-300 space-y-2">
              <li>Redes U-Net para segmentação de espectrogramas</li>
              <li>Transformers de áudio para modelagem contextual</li>
              <li>Autoencoders variacionais para compressão de ruído</li>
              <li>GANs (Generative Adversarial Networks) para aprimoramento</li>
              <li>Redes LSTM para modelagem temporal</li>
              <li>Processamento em tempo real com inferência otimizada</li>
            </ul>
          </div>
          
          <div class="bg-amber-900/10 p-4 rounded-lg border border-amber-500/20">
            <h5 class="text-amber-400 font-bold mb-2">Treinamento e Dados</h5>
            <ul class="text-sm text-gray-300 space-y-2">
              <li>Conjuntos de dados com milhões de amostras de voz</li>
              <li>Simulações de ambientes acústicos variados</li>
              <li>Dados de ruído de fundo em diferentes intensidades</li>
              <li>Processamento multilíngue e de diferentes timbres</li>
              <li>Validação com diferentes tipos de microfones</li>
              <li>Otimização para hardware específico (GPU, CPU, DSP)</li>
            </ul>
          </div>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">🔬 Pesquisas em Andamento</h4>
        <p class="mb-4 text-gray-300">
          A pesquisa acadêmica e industrial continua avançando rapidamente no campo de processamento de áudio baseado em IA:
        </p>
        
        <div class="space-y-4">
          <div class="flex items-start space-x-3">
            <div class="bg-blue-500 rounded-full p-2 mt-1 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h5 class="text-blue-400 font-bold">DeepFilterNet</h5>
              <p class="text-sm text-gray-300">Universidade de Tóquio desenvolveu uma rede neural capaz de eliminar ruídos com qualidade superior em latências abaixo de 1ms, com implementação prevista para 2026-2027.</p>
            </div>
          </div>
          
          <div class="flex items-start space-x-3">
            <div class="bg-green-500 rounded-full p-2 mt-1 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h5 class="text-green-400 font-bold">Spatial Audio Isolation</h5>
              <p class="text-sm text-gray-300">Pesquisadores do MIT estão desenvolvendo sistemas capazes de isolar vozes específicas em ambientes com múltiplas pessoas falando simultaneamente, com testes promissores em 2025-2026.</p>
            </div>
          </div>
          
          <div class="flex items-start space-x-3">
            <div class="bg-purple-500 rounded-full p-2 mt-1 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h5 class="text-purple-400 font-bold">Quantum Audio Processing</h5>
              <p class="text-sm text-gray-300">Empresas como IBM e Google estão explorando processamento de áudio quântico para filtragem de ruído com precisão teoricamente impossível com computação clássica, com protótipos esperados em 2027-2029.</p>
            </div>
          </div>
        </div>
        
        <div class="bg-red-900/10 p-5 rounded-xl border border-red-500/20 mt-6">
          <h4 class="text-red-400 font-bold mb-2">⚠️ Considerações de Hardware e Otimização</h4>
          <p class="text-sm text-gray-300">
            A eficácia das tecnologias de IA para processamento de áudio depende fortemente do hardware disponível. GPUs modernas com unidades Tensor (NVIDIA) ou Matrix Units (Apple Silicon) podem processar redes neurais de áudio com latência extremamente baixa. CPUs com instruções AVX-512 e AVX-2 também podem executar estas tarefas, embora com menor eficiência. O uso de DSPs dedicados (como os presentes em processadores Apple M-series ou SoCs Qualcomm) representa a tendência futura para processamento eficiente de áudio em tempo real.
          </p>
        </div>
      `
    }
  ];

    const allContentSections = [...contentSections, ...advancedContentSections];

    const relatedGuides = [
        {
            href: "/guias/solucao-problemas-audio",
            title: "Problemas de Som",
            description: "Resolva erros gerais de áudio no Windows."
        },
        {
            href: "/guias/som-espacial-windows-configurar",
            title: "Som Espacial",
            description: "Melhore o que você ouve também."
        },
        {
            href: "/guias/atualizacao-drivers-video",
            title: "Drivers de Áudio",
            description: "Muitas vezes embutidos no driver da GPU."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="10 min"
            difficultyLevel="Iniciante"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
