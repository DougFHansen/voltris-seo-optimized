import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';
import JsonLdGuide from '@/components/JsonLdGuide';

export const guideMetadata = {
  id: 'ajustar-configuracoes-audio-windows',
  title: "Ajustar Configurações de Áudio Windows (2026) - Guia Completo",
  description: "Problemas de áudio no Windows? Aprenda a corrigir configurações de saída de áudio, reshadar, latência e problemas de som no Windows 10/11.",
  category: 'windows-geral',
  difficulty: 'Intermediário',
  time: '12 min'
};

const title = "Ajustar Configurações de Áudio Windows (2026) - Guia Completo";
const description = "Problemas de áudio no Windows? Aprenda a corrigir configurações de saída de áudio, reshadar, latência e problemas de som no Windows 10/11.";
const keywords = [
    'ajustar configurações de áudio windows 2026 tutorial',
    'corrigir problemas de som windows 10 11',
    'configurar saída de áudio windows',
    'latência de áudio windows solução',
    'resolução de problemas de áudio pc',
    'como reduzir delay do áudio windows',
    'áudio crackling estático windows',
    'configurações de áudio para jogos windows',
    'audio stuttering windows 11 solução',
    'melhor qualidade de áudio windows',
    'configurar realtek audio manager',
    'windows audio enhancements desativar',
    'ajustar buffer de áudio windows'
];

export const metadata: Metadata = createGuideMetadata('ajustar-configuracoes-audio-windows', title, description, keywords);

export default function AjustarAudioWindowsGuide() {
    const summaryTable = [
        { label: "Nível de Dificuldade", value: "Intermediário" },
        { label: "Tempo Estimado", value: "12 minutos" },
        { label: "Problemas Resolvidos", value: "5+ problemas comuns" }
    ];

    const steps = [
        { name: "Verificar Hardware e Drivers", text: "Use o Gerenciador de Dispositivos para verificar se sua placa de som está funcionando corretamente." },
        { name: "Abrir Painel de Som", text: "Clique com o botão direito no ícone de som e selecione 'Abrir Mixer de Volume' ou 'Painel de Som'." },
        { name: "Configurar Dispositivos", text: "Selecione seu dispositivo de saída padrão e configure as propriedades avançadas." },
        { name: "Ajustar Configurações Avançadas", text: "Configure formato exclusivo, melhorias de áudio e buffer para otimização." },
        { name: "Testar e Validar", text: "Teste o áudio com diferentes aplicativos e ajuste conforme necessário." }
    ];

    const contentSections = [
        {
            title: "Por Que o Áudio Fica Ruim?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Problemas de áudio no Windows podem <strong>arruinar completamente sua experiência</strong> com jogos, streaming e chamadas. As causas mais comuns incluem drivers desatualizados, configurações incorretas e conflitos de software.
        </p>
        <div class="bg-blue-900/20 rounded-lg p-6 mb-6">
          <h3 class="text-xl font-bold mb-4 text-blue-400">🔊 Principais Causas:</h3>
          <ul class="space-y-2 text-gray-300">
            <li class="flex items-start gap-2">
              <span class="text-red-400">⚠️</span>
              <span>Drivers de áudio desatualizados ou corrompidos</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-red-400">⚠️</span>
              <span>Configurações de áudio incorretas no painel de som</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-red-400">⚠️</span>
              <span>Conflitos com outros softwares de áudio</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-red-400">⚠️</span>
              <span>Problemas de hardware (placa, fones, cabos)</span>
            </li>
          </ul>
        </div>
        `
        },
        {
            title: "Verificando Hardware e Drivers",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Antes de ajustar as configurações, precisamos <strong>identificar a causa raiz</strong> do problema de áudio.
        </p>
        <div class="bg-gray-800 rounded-lg p-6 mb-6">
          <h3 class="text-xl font-bold mb-4 text-green-400">🔧 Ferramentas de Diagnóstico:</h3>
          <div class="grid md:grid-cols-2 gap-4">
            <div class="space-y-4">
              <h4 class="text-lg font-semibold text-white mb-2">Gerenciador de Dispositivos</h4>
              <p class="text-gray-300 text-sm mb-2">Pressione <kbd class="bg-gray-700 px-2 py-1 rounded">Win + X</kbd> para abrir rapidamente.</p>
              <p class="text-gray-300 text-sm">Verifique status de drivers, desative dispositivos desnecessários.</p>
              
              <h4 class="text-lg font-semibold text-white mb-2">Gerenciador de Som</h4>
              <p class="text-gray-300 text-sm mb-2">Clique com o botão direito no ícone de som na barra de tarefas.</p>
              <p class="text-gray-300 text-sm">Acesse propriedades do dispositivo para configurações avançadas.</p>
              
              <h4 class="text-lg font-semibold text-white mb-2">Painel de Som DirectX</h4>
              <p class="text-gray-300 text-sm mb-2">Digite <kbd class="bg-gray-700 px-2 py-1 rounded">dxdiag</kbd> no Executar.</p>
              <p class="text-gray-300 text-sm">Mostra informações detalhadas sobre drivers DirectX e hardware.</p>
            </div>
            
            <div class="space-y-4">
              <h4 class="text-lg font-semibold text-white mb-2">Verificação de Drivers</h4>
              <p class="text-gray-300 text-sm mb-2">Use o Gerenciador de Dispositivos para verificar atualizações.</p>
              <p class="text-gray-300 text-sm mb-2">Visite o site do fabricante da sua placa de som.</p>
              
              <h4 class="text-lg font-semibold text-white mb-2">Teste de Hardware</h4>
              <p class="text-gray-300 text-sm mb-2">Use fones de ouvido diferentes para isolar o problema.</p>
              <p class="text-gray-300 text-sm mb-2">Teste com cabos e portas diferentes.</p>
            </div>
          </div>
        </div>
        `
        },
        {
            title: "Configurações Essenciais do Windows",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Comece com estas configurações básicas do Windows para <strong>resolver 90% dos problemas de áudio</strong>:
        </p>
        <div class="bg-gray-800 rounded-lg p-6 mb-6">
          <h3 class="text-xl font-bold mb-4 text-yellow-400">🎛️ Configurações do Painel de Som:</h3>
          <div class="space-y-4">
            <div class="bg-gray-700 rounded p-4 mb-4">
              <h4 class="text-lg font-semibold text-yellow-400 mb-2">Dispositivos de Reprodução</h4>
              <ul class="space-y-2 text-gray-300">
                <li><strong>Dispositivo Padrão:</strong> Selecione seu headset ou caixas de som</li>
                <li><strong>Comunicações:</strong> Configure como dispositivo padrão</li>
                <li><strong>Propriedades Avançadas:</strong> Clique duplo → Aba "Avançado"</li>
                <li><strong>Formatos Exclusivos:</strong> 24-bit, 96kHz para máxima qualidade</li>
              </ul>
            </div>
            
            <div class="bg-gray-700 rounded p-4 mb-4">
              <h4 class="text-lg font-semibold text-yellow-400 mb-2">Melhorias de Áudio</h4>
              <ul class="space-y-2 text-gray-300">
                <li><strong>Baixas Latências:</strong> Ative "Melhorias de Áudio"</li>
                <li><strong>Ambiente Virtual:</strong> Ative se disponível</li>
                <li><strong>Baixar Frequências:</strong> Ative para fones de ouvido</li>
                <li><strong>Modo de Sala:</strong> Ative para melhor experiência com múltiplos alto-falantes</li>
              </ul>
            </div>
            
            <div class="bg-gray-700 rounded p-4 mb-4">
              <h4 class="text-lg font-semibold text-yellow-400 mb-2">Configurações de Comunicação</h4>
              <ul class="space-y-2 text-gray-300">
                <li><strong>Exclusivo:</strong> Desative compartilhamento do dispositivo</li>
                <li><strong>Volume Automático:</strong> Desative para controle manual preciso</li>
                <li><strong>Notificações:</strong> Configure para não interromper durante jogos</li>
              </ul>
            </div>
          </div>
        </div>
        `
        },
        {
            title: "Ajustes Avançados para Gamers",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Configurações específicas para <strong>eliminar delay de áudio</strong> e melhorar a experiência competitiva:
        </p>
        <div class="bg-purple-900/20 rounded-lg p-6 mb-6">
          <h3 class="text-xl font-bold mb-4 text-purple-400">🎮 Otimizações para Jogos:</h3>
          <div class="grid md:grid-cols-2 gap-4">
            <div class="space-y-4">
              <h4 class="text-lg font-semibold text-purple-400 mb-2">Buffer de Áudio</h4>
              <ul class="space-y-2 text-gray-300">
                <li><strong>Windows:</strong> 64-128ms (padrão)</li>
                <li><strong>Jogos Competitivos:</strong> 32-64ms ou menos</li>
                <li><strong>Streaming:</strong> 16-32ms (para mínimo delay)</li>
                <li><strong>Como ajustar:</strong> Painel de Som → Propriedades → Aba "Avançado"</li>
              </ul>
            </div>
            
            <div class="space-y-4">
              <h4 class="text-lg font-semibold text-purple-400 mb-2">Prioridade de Processamento</h4>
              <ul class="space-y-2 text-gray-300">
                <li><strong>Nível de Prioridade:</strong> Tempo Realtime (mais alto)</li>
                <li><strong>Como configurar:</strong> Gerenciador de Dispositivos → Clique direito → Propriedades → Aba "Avançado"</li>
                <li><strong>Impacto:</strong> Reduz delay em 50-70%</li>
              </ul>
            </div>
            
            <div class="space-y-4">
              <h4 class="text-lg font-semibold text-purple-400 mb-2">Configurações por Jogo</h4>
              <ul class="space-y-2 text-gray-300">
                <li><strong>CS2/Valorant:</strong> Buffer 32ms, Prioridade Alta</li>
                <li><strong>Fortnite/Apex:</strong> Buffer 64ms, Prioridade Média</li>
                <li><strong>Call of Duty:</strong> Buffer 64ms, Prioridade Alta</li>
                <li><strong>Flight Simulator:</strong> Buffer 128ms, Prioridade Normal</li>
              </ul>
            </div>
          </div>
        </div>
        `
        },
        {
            title: "Resolução de Problemas Específicos",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Soluções detalhadas para os problemas de áudio mais <strong>comuns</strong> no Windows:
        </p>
        <div class="space-y-4">
          <div class="bg-red-900/20 border border-red-500/30 rounded-lg p-6 mb-4">
            <h3 class="text-xl font-bold mb-4 text-red-400">🔥 Áudio Estático ou "Crackling"</h3>
            <div class="text-gray-300">
              <p class="mb-2"><strong>Causa:</strong> Geralmente drivers corrompidos ou conflitos de software.</p>
              <p class="mb-2"><strong>Sintomas:</strong> Chiado, estático, distorção, cortes.</p>
              <p class="mb-2"><strong>Solução:</strong></p>
              <ol class="list-decimal list-inside space-y-2 text-gray-300">
                <li>Reinicie o PC em modo seguro</li>
                <li>Desinstale softwares de áudio de terceiros</li>
                <li>Atualize drivers do fabricante</li>
                <li>Use o "Solução de Problemas de Áudio" do Windows</li>
                <li>Reinstale drivers em modo compatibilidade</li>
              </ol>
            </div>
          </div>
          
          <div class="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-6 mb-4">
            <h3 class="text-xl font-bold mb-4 text-yellow-400">⚡ Áudio Fora de Sincronia</h3>
            <div class="text-gray-300">
              <p class="mb-2"><strong>Causa:</strong> Problemas de buffer ou configurações de sincronização.</p>
              <p class="mb-2"><strong>Sintomas:</strong> Áudio e vídeo fora de sincronia, eco.</p>
              <p class="mb-2"><strong>Solução:</strong></p>
              <ol class="list-decimal list-inside space-y-2 text-gray-300">
                <li>Verifique configurações de buffer</li>
                <li>Desative processos desnecessários</li>
                <li>Use cabo HDMI de qualidade</li>
                <li>Atualize drivers de vídeo e áudio</li>
              </ol>
            </div>
          </div>
          
          <div class="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6 mb-4">
            <h3 class="text-xl font-bold mb-4 text-blue-400">🎤️ Microfone Não Funciona</h3>
            <div class="text-gray-300">
              <p class="mb-2"><strong>Causa:</strong> Microfone mudo, não detectado ou com qualidade ruim.</p>
              <p class="mb-2"><strong>Solução:</strong></p>
              <ol class="list-decimal list-inside space-y-2 text-gray-300">
                <li>Verifique se o microfone está selecionado como entrada</li>
                <li>Teste com outro aplicativo (Zoom, Discord)</li>
                <li>Verifique permissões de acesso ao microfone</li>
                <li>Atualize drivers de áudio</li>
                <li>Reinicie o serviço de áudio do Windows</li>
              </ol>
            </div>
          </div>
        </div>
        `
        },
        {
            title: "Dicas Profissionais",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Dicas avançadas para áudio profissional de <strong>streaming</strong> e <strong>gravação</strong>:
        </p>
        <div class="bg-green-900/20 rounded-lg p-6 mb-6">
          <h3 class="text-xl font-bold mb-4 text-green-400">🎯 Equipamento Profissional:</h3>
          <ul class="space-y-2 text-gray-300">
            <li><strong>Interface de Áudio Externa:</strong> Focusrite Scarlett 2i ou similar</li>
            <li><strong>Microfone de Estúdio:</strong> Rode NT1, Shure SM7B ou AT2020</li>
            <li><strong>Processador de Áudio:</strong> Antelope Audio Discrete 8th Gen</li>
            <li><strong>Cabos Balanceados:</strong> XLR ou TRS de qualidade</li>
            <li><strong>Fones de Ouvido:</strong> Beyerdynamic DT 770 Pro ou Sony MDR-7506</li>
          </ul>
        </div>
          
          <div class="bg-gray-800 rounded-lg p-6 mb-6">
            <h3 class="text-xl font-bold mb-4 text-gray-400">🎛️ Software Profissional:</h3>
          <ul class="space-y-2 text-gray-300">
            <li><strong>DAW:</strong> Adobe Audition, Reaper ou Ableton Live</li>
            <li><strong>Processamento:</strong> iZotope RX 10, FabFilter Pro</li>
            <li><strong>VST Plugins:</strong> Waves, Soundtoys, Native Instruments</li>
            <li><strong>Streaming:</strong> OBS Studio, Streamlabs OBS, XSplit</li>
          </ul>
        </div>
        </div>
        `
        }
    ];

    const faqItems = [
        {
            question: "Como reduzir o delay do áudio no Windows?",
            answer: "Use buffer de áudio de 32-64ms para jogos competitivos. Configure prioridade de processamento em Tempo Realtime. Desative processos desnecessários e use drivers atualizados."
        },
        {
            question: "Por que meu áudio fica chiando?",
            answer: "Geralmente é drivers desatualizados, interferência elétrica ou hardware com defeito. Atualize drivers, verifique cabos e teste com outro hardware."
        },
        {
            question: "Como testar se meu microfone está funcionando?",
            answer: "Use o Gravador de Voz do Windows ou teste online. Verifique níveis de entrada no painel de som e desative cancelamento de ruído para microfones."
        },
        {
            question: "Qual o melhor buffer para streaming?",
            answer: "32-64ms para streaming, 64-128ms para gravação. Jogos competitivos precisam de buffer baixo para reduzir input lag."
        },
        {
            question: "Como melhorar a qualidade do áudio?",
            answer: "Use formato 24-bit/96kHz, ative melhorias de áudio, use hardware de qualidade e configure equalização adequada para cada tipo de conteúdo."
        }
    ];

    const externalReferences = [
        { name: "Documentação Microsoft Áudio", url: "https://learn.microsoft.com/windows/audio/" },
        { name: "Drivers de Áudio", url: "https://www.realtek.com/en/downloads" },
        { name: "Guia de Buffer", url: "https://www.reddit.com/r/letsplaymusic/wiki/Guide_to_Low_Latency_Audio/" },
        { name: "Configurações OBS", url: "https://obsproject.com/wiki" }
    ];

    const relatedGuides = [
        {
            href: "/guias/otimizacao-windows-11-para-games",
            title: "Otimização Windows 11",
            description: "Configure o Windows para máximo desempenho"
        },
        {
            href: "/guias/aumentar-fps-pc-gamer",
            title: "Aumentar FPS",
            description: "Técnicas avançadas para mais performance"
        }
    ];

    return (
        <>
            <JsonLdGuide
                title={title}
                description={description}
                url="https://voltris.com.br/guias/ajustar-configuracoes-audio-windows"
                image="https://voltris.com.br/logo.png"
                estimatedTime="12"
                difficulty="Intermediário"
                category="Áudio Windows"
                steps={steps}
                faqItems={faqItems}
            />
            <GuideTemplate
                title={title}
                description={description}
                keywords={keywords}
                estimatedTime="12 min"
                difficultyLevel="Intermediário"
                contentSections={contentSections}
                summaryTable={summaryTable}
                faqItems={faqItems}
                externalReferences={externalReferences}
                relatedGuides={relatedGuides}
            />
        </>
    );
}
