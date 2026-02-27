import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'otimizacao-performance',
  title: "Otimização de Performance: Como deixar seu PC voando em 2026",
  description: "Seu Windows está lento? Aprenda as melhores técnicas de otimização de sistema para reduzir o uso de RAM e CPU e ter a máxima performance em jogos e tr...",
  category: 'otimizacao',
  difficulty: 'Iniciante',
  time: '15 min'
};

const title = "Otimização de Performance: Como deixar seu PC voando em 2026";
const description = "Seu Windows está lento? Aprenda as melhores técnicas de otimização de sistema para reduzir o uso de RAM e CPU e ter a máxima performance em jogos e trabalho.";
const keywords = [
  'como otimizar windows 11 para performance 2026',
  'melhorar desempenho pc lento windows 10 tutorial',
  'otimização de sistema para ganhar fps 2026',
  'limpeza e aceleração de windows profissional',
  'deixar windows 11 mais rápido guia definitivo'
];

export const metadata: Metadata = createGuideMetadata('otimizacao-performance', title, description, keywords);

export default function PerformanceOptimizationGuide() {
  const summaryTable = [
    { label: "Check #1", value: "Desativar Apps em Segundo Plano" },
    { label: "Check #2", value: "Ajustar Efeitos Visuais (Melhor Desempenho)" },
    { label: "Check #3", value: "Plano de Energia (Alta Performance)" },
    { label: "Dificuldade", value: "Fácil" }
  ];

  const contentSections = [
    {
      title: "O que realmente funciona na Otimização?",
      content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Muitos programas prometem "acelerar o PC com um clique", mas a maioria é apenas publicidade. A verdadeira otimização consiste em remover o que não é usado e garantir que o Windows não limite o poder do seu hardware. Em 2026, com o Windows 11 mais pesado, esses ajustes manuais são a diferença entre um PC que "engasga" e um que responde instantaneamente.
        </p>
      `
    },
    {
      title: "1. Efeitos Visuais: Menos Estética, Mais Velocidade",
      content: `
        <p class="mb-4 text-gray-300">As transparências e animações do Windows consomem ciclos da sua GPU. Vamos desativá-las:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Pesquise por <strong>'Ajustar a aparência e o desempenho do Windows'</strong>.</li>
            <li>Selecione 'Ajustar para obter o melhor desempenho'.</li>
            <li>Marque apenas: <i>'Usar sombras subjacentes em rótulos de ícones'</i> e <i>'Mostrar sombras sob janelas'</i> para não ficar feio demais.</li>
            <li>Clique em Aplicar. As janelas abrirão muito mais rápido agora.</li>
        </ol>
      `
    },
    {
      title: "2. Gerenciamento de Inicialização",
      content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Truque da RAM:</h4>
            <p class="text-sm text-gray-300">
                Aperte <code>Ctrl + Shift + Esc</code> e vá na aba <strong>Aplicativos de Inicialização</strong>. Desative TUDO o que você não precisa que ligue com o Windows (Spotify, Steam, Cortana, etc). Isso reduz o tempo de boot e libera RAM preciosa para seus jogos.
            </p>
        </div>
      `
    },
    {
      title: "3. O Plano de Energia Oculto",
      content: `
        <p class="mb-4 text-gray-300">
            O Windows costuma vir no modo 'Equilibrado' para economizar luz. Se quiser potência total:
            <br/>Vá em Painel de Controle > Hardware e Sons > Opções de Energia. Escolha <strong>'Alto Desempenho'</strong>. Se você tiver um processador Ryzen ou Core de 13ª/14ª geração, procure pelo modo 'Desempenho Máximo' (Ultimate Performance).
        </p>
      `
    }
  ];

  const additionalContentSections = [
    {
      title: "4. Otimização Avançada de Disco e Armazenamento",
      content: `
        <h4 class="text-white font-bold mb-3">🧠 Inteligência Artificial do Windows</h4>
        <p class="text-gray-300 mb-4">
          O Windows 11 usa IA para prever o que você vai usar e pré-carrega em segundo plano. Isso consome RAM e CPU:
        </p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
          <li>Abra o <strong>Registro do Windows</strong> (digite 'regedit' no menu Iniciar).</li>
          <li>Navegue até: <code>HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\System</code></li>
          <li>Crie um novo valor DWORD chamado <code>EnableActivityFeed</code> e defina como 0.</li>
          <li>Procure por <code>HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced</code></li>
          <li>Crie um novo valor DWORD chamado <code>EnableCdp</code> e defina como 0.</li>
        </ol>
        
        <h4 class="text-white font-bold mb-3 mt-6">🧹 Limpeza Profunda de Disco</h4>
        <p class="text-gray-300 mb-4">
          O Windows acumula lixo com o tempo. Use o Disco de Limpeza e comandos avançados:
        </p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
          <li>Abra <strong>Disk Cleanup</strong> como administrador e marque todas as opções, incluindo 'Arquivos de entrega otimizados'.</li>
          <li>Abra o Prompt de Comando como administrador e execute:
            <div class="bg-black/30 p-3 rounded mt-2 font-mono text-xs">
              <p><code>dism /online /cleanup-image /spsuperseded</code></p>
              <p><code>sfc /scannow</code></p>
              <p><code>chkdsk C: /f /r</code></p>
            </div>
          </li>
          <li>Para SSDs: Desative a desfragmentação e ative o TRIM:
            <ul class="list-disc ml-6 mt-2 space-y-1">
              <li>Abra 'Otimização e desfragmentação de unidades'</li>
              <li>Clique em 'Configurações' e desmarque 'Executar automaticamente no agendamento recomendado'</li>
              <li>Verifique que o TRIM está ativado para SSDs</li>
            </ul>
          </li>
        </ol>
      `
    },
    {
      title: "5. Configurações de Memória Virtual e Superfetch",
      content: `
        <h4 class="text-white font-bold mb-3">🧠 Gerenciamento de Memória RAM</h4>
        <p class="text-gray-300 mb-4">
          A memória virtual (arquivo de paginação) ajuda quando a RAM física está cheia. Configure para desempenho ideal:
        </p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
          <li>Pressione Win + R, digite <code>sysdm.cpl</code> e pressione Enter.</li>
          <li>Vá na aba 'Avançado' → 'Desempenho' → 'Configurações'.</li>
          <li>Na aba 'Avançado', clique em 'Memória Virtual' → 'Alterar'.</li>
          <li>Desmarque 'Gerenciar automaticamente o tamanho do arquivo de paginação para todas as unidades'.</li>
          <li>Selecione a unidade do sistema (geralmente C:) e escolha 'Tamanho personalizado'.</li>
          <li>Defina o tamanho inicial como 1,5x a RAM instalada e o tamanho máximo como 3x a RAM.</li>
          <li>Clique em 'Definir' e 'OK'. Reinicie o computador.</li>
        </ol>
        
        <h4 class="text-white font-bold mb-3 mt-6">⚡ Superfetch e Prefetch</h4>
        <p class="text-gray-300 mb-4">
          O Superfetch (Serviço SysMain) pré-carrega aplicativos comuns na RAM. Em SSDs modernos, isso pode ser desnecessário:
        </p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
          <li>Pressione Win + R, digite <code>services.msc</code> e pressione Enter.</li>
          <li>Procure pelo serviço <strong>SysMain</strong> (Superfetch).</li>
          <li>Clique com botão direito → Propriedades.</li>
          <li>Altere o 'Tipo de inicialização' para 'Desabilitado'.</li>
          <li>Clique em 'Parar' e depois 'OK'.</li>
          <li>Alternativamente, para SSDs NVMe, o Superfetch pode ser mantido pois é eficiente.</li>
        </ol>
      `
    },
    {
      title: "6. Otimizações Específicas para Jogos",
      content: `
        <h4 class="text-white font-bold mb-3">🎮 Modo de Jogo do Windows</h4>
        <p class="text-gray-300 mb-4">
          O Windows 11 tem um Modo de Jogo que prioriza recursos para jogos:
        </p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
          <li>Pressione Win + G para abrir o Game Bar.</li>
          <li>Clique no ícone de Configurações (engrenagem).</li>
          <li>Ative 'Modo de Jogo' se ainda não estiver ativado.</li>
          <li>Em 'Atividade de Captura', desative 'Gravar automaticamente quando estou jogando'.</li>
          <li>Isso aloca mais recursos da CPU e GPU para o jogo ativo.</li>
        </ol>
        
        <h4 class="text-white font-bold mb-3 mt-6">🔧 Configurações da GPU para Máximo Desempenho</h4>
        <p class="text-gray-300 mb-4">
          Configure sua placa de vídeo para desempenho máximo:
        </p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
          <li><strong>NVIDIA:</strong> Abra GeForce Experience → Configurações do Painel → Gerenciar configurações 3D.
            <ul class="list-disc ml-6 mt-2 space-y-1">
              <li>Defina 'Modo de Gerenciamento de Energia' para 'Preferir Máximo Desempenho'</li>
              <li>Desative 'Otimização de Imagens Inteligente'</li>
              <li>Desative 'Redução de Latência' e defina 'Modo de Redução de Latência' para 'Ultra'</li>
            </ul>
          </li>
          <li><strong>AMD:</strong> Abra Radeon Software → Configurações do Sistema → Gerenciamento de Energia.
            <ul class="list-disc ml-6 mt-2 space-y-1">
              <li>Defina o Perfil de Energia para 'Alto Desempenho'</li>
              <li>Desative 'Economia de Energia Automática' e 'Economia de Energia Adaptável'</li>
            </ul>
          </li>
        </ol>
      `
    },
    {
      title: "7. Ajustes de Segurança que Afetam Performance",
      content: `
        <h4 class="text-white font-bold mb-3">🛡️ Windows Defender e Real-Time Protection</h4>
        <p class="text-gray-300 mb-4">
          O antivírus embutido do Windows pode impactar performance, especialmente durante jogos:
        </p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
          <li>Abra Configurações → Atualização e Segurança → Segurança do Windows.</li>
          <li>Clique em 'Proteção contra vírus e ameaças' → 'Configurações de proteção em tempo real'.</li>
          <li>Desative temporariamente a 'Proteção em tempo real' durante jogos intensos.</li>
          <li>Adicione exceções para pastas de jogos em 'Exceções de proteção em tempo real'.</li>
          <li>Para desenvolvedores/testadores: Adicione exceções para ferramentas de desenvolvimento.</li>
        </ol>
        
        <h4 class="text-white font-bold mb-3 mt-6">🔒 Outras Configurações de Segurança</h4>
        <p class="text-gray-300 mb-4">
          Alguns recursos de segurança podem ser ajustados para melhor desempenho:
        </p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
          <li>Desative o 'Controle de Conta de Usuário' para menos interrupções (menos seguro).</li>
          <li>No UAC, defina para o segundo nível mais baixo ('Não notificar, mas bloquear aplicativos que tentarem alterar o computador').</li>
          <li>Desative o 'Windows Search' se você não usa a busca do Windows frequentemente.</li>
        </ol>
      `
    },
    {
      title: "8. Benchmarks e Medição de Performance",
      content: `
        <h4 class="text-white font-bold mb-3">📊 Ferramentas de Benchmark</h4>
        <p class="text-gray-300 mb-4">
          Após as otimizações, é importante medir o impacto real:
        </p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
          <li><strong>CrystalDiskMark:</strong> Testa velocidade de leitura/gravação do disco.</li>
          <li><strong>UserBenchmark:</strong> Avaliação geral de todos os componentes.</li>
          <li><strong>3DMark:</strong> Benchmark focado em desempenho gráfico para jogos.</li>
          <li><strong>PCMark 10:</strong> Benchmark completo de desempenho geral do sistema.</li>
        </ol>
        
        <h4 class="text-white font-bold mb-3 mt-6">📈 Métricas Importantes</h4>
        <p class="text-gray-300 mb-4">
          Ao comparar antes e depois das otimizações, observe estas métricas:
        </p>
        <div class="overflow-x-auto">
          <table class="w-full border-collapse border border-gray-700">
            <thead>
              <tr class="bg-gray-800">
                <th class="border border-gray-700 px-4 py-2 text-left">Métrica</th>
                <th class="border border-gray-700 px-4 py-2 text-left">Antes</th>
                <th class="border border-gray-700 px-4 py-2 text-left">Depois</th>
                <th class="border border-gray-700 px-4 py-2 text-left">Melhoria Esperada</th>
              </tr>
            </thead>
            <tbody>
              <tr class="hover:bg-gray-800/50">
                <td class="border border-gray-700 px-4 py-2">Tempo de Boot</td>
                <td class="border border-gray-700 px-4 py-2">45-90s</td>
                <td class="border border-gray-700 px-4 py-2">20-40s</td>
                <td class="border border-gray-700 px-4 py-2">30-50% mais rápido</td>
              </tr>
              <tr class="hover:bg-gray-800/50">
                <td class="border border-gray-700 px-4 py-2">Uso de RAM em Repouso</td>
                <td class="border border-gray-700 px-4 py-2">3-4GB</td>
                <td class="border border-gray-700 px-4 py-2">1.5-2.5GB</td>
                <td class="border border-gray-700 px-4 py-2">40-50% menos uso</td>
              </tr>
              <tr class="hover:bg-gray-800/50">
                <td class="border border-gray-700 px-4 py-2">FPS em Jogos</td>
                <td class="border border-gray-700 px-4 py-2">Depende do jogo</td>
                <td class="border border-gray-700 px-4 py-2">+5-15% tipicamente</td>
                <td class="border border-gray-700 px-4 py-2">Melhoria variável</td>
              </tr>
            </tbody>
          </table>
        </div>
      `
    }
  ];

  const faqItems = [
    {
      question: "Essas otimizações são seguras? Posso perder dados?",
      answer: "<strong>As otimizações descritas aqui são seguras</strong> e não envolvem exclusão de dados críticos. Elas apenas modificam configurações do sistema e desativam recursos desnecessários. <strong>É recomendado criar um ponto de restauração do sistema</strong> antes de fazer mudanças significativas. Os ajustes focam em desativar serviços e recursos que consomem recursos sem benefícios reais para a maioria dos usuários."
    },
    {
      question: "Preciso formatar o Windows para aplicar essas otimizações?",
      answer: "<strong>Não é necessário formatar</strong> para aplicar a maioria das otimizações. Elas podem ser feitas em um sistema Windows já instalado. Porém, <strong>uma instalação limpa do Windows 11</strong> (como mostrado em nosso guia de formatação) <strong>proporciona os melhores resultados</strong>, pois evita softwares indesejados pré-instalados e configurações padrão que limitam performance."
    },
    {
      question: "Quantos FPS posso ganhar com essas otimizações?",
      answer: "O ganho de FPS varia bastante dependendo do hardware e do jogo. Em média, você pode esperar <strong>um aumento de 5-15%</strong> em FPS após aplicar todas as otimizações. Jogos mais pesados ou com configurações gráficas altas tendem a ter maiores ganhos. A otimização também melhora a estabilidade dos frames, reduzindo micro-stutters."
    },
    {
      question: "Essas otimizações funcionam em Windows 10 também?",
      answer: "<strong>A maioria das otimizações funcionam tanto no Windows 10 quanto no 11</strong>, com pequenas diferenças na interface. Alguns recursos específicos do Windows 11 (como o Game Mode avançado) não estarão disponíveis no Windows 10, mas os ajustes fundamentais de desempenho são aplicáveis a ambos. O Windows 11 tem mais opções de otimização nativas."
    },
    {
      question: "Preciso de SSD para aplicar essas otimizações?",
      answer: "As otimizações são benéficas tanto para SSDs quanto para HDs tradicionais, mas <strong>o impacto é muito maior em SSDs</strong>. Se você ainda usa HD, considere fazer o upgrade para um SSD NVMe, pois isso sozinho pode dobrar a velocidade de inicialização e carregamento de aplicativos."
    },
    {
      question: "Como posso voltar as configurações se algo der errado?",
      answer: "Se algo der errado, você pode usar o <strong>Ponto de Restauração do Sistema</strong> criado antes das mudanças. Também é possível reverter configurações específicas manualmente (reativando serviços, reativando efeitos visuais, etc.). Para configurações do registro, utilize o histórico de versões do editor de registro ou o sistema de restauração."
    }
  ];

  const externalReferences = [
    { name: "Microsoft Docs - Performance Tuning", url: "https://docs.microsoft.com/en-us/windows/client-management/performance-tuning" },
    { name: "TechPowerUp - Hardware Database", url: "https://www.techpowerup.com/" },
    { name: "PassMark - Performance Test", url: "https://www.passmark.com/products/performancetest/" }
  ];

  const relatedGuides = [
    {
      href: "/guias/debloating-windows-11",
      title: "Debloat Windows",
      description: "Aprofunde a limpeza com scripts."
    },
    {
      href: "/guias/aceleracao-hardware-gpu-agendamento",
      title: "Agendamento de GPU",
      description: "Dica vital para Windows 11 e placas modernas."
    },
    {
      href: "/guias/manutencao-preventiva-computador",
      title: "Manutenção Preventiva",
      description: "Como manter o PC sempre rápido."
    },
    {
      href: "/guias/otimizacao-jogos-pc",
      title: "Otimização Extrema para Jogos",
      description: "Técnicas avançadas para maximizar FPS e desempenho em jogos."
    },
    {
      href: "/guias/otimizacao-ssd-windows-11",
      title: "Otimização de SSD no Windows 11",
      description: "Aprenda a configurar TRIM, desativar indexação e extrair cada MB/s do seu NVMe."
    },
    {
      href: "/guias/formatacao-windows",
      title: "Como Formatar o Windows 11",
      description: "Guia completo de instalação limpa para máxima performance."
    }
  ];

  // Combinar seções de conteúdo principais com as adicionais
  const allContentSections = [
    ...contentSections,
    ...additionalContentSections
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="35 min"
      difficultyLevel="Intermediário"
      author="Equipe Técnica Voltris"
      lastUpdated="Janeiro 2026"
      contentSections={allContentSections}
      summaryTable={summaryTable}
      relatedGuides={relatedGuides}
      faqItems={faqItems}
      externalReferences={externalReferences}
      showVoltrisOptimizerCTA={true}
    />
  );
}
