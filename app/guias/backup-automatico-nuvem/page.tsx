import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'backup-automatico-nuvem',
  title: "Backup na Nuvem Automático: O Guia Definitivo no Windows (2026)",
  description: "Seu HD vai queimar. A questão é quando. Aprenda a configurar Google Drive, OneDrive e iCloud para salvar seus arquivos em tempo real e nunca mais perder nada.",
  category: 'software',
  difficulty: 'Iniciante',
  time: '35 min'
};

const title = "Backup na Nuvem Automático: O Guia Definitivo no Windows (2026)";
const description = "Seu HD vai queimar. A questão é quando. Aprenda a configurar Google Drive, OneDrive e iCloud para salvar seus arquivos em tempo real e nunca mais perder nada.";

const keywords = [
  'backup automatico nuvem windows 11 tutorial 2026',
  'configurar onedrive backup pastas pc guia',
  'google drive para desktop como usar tutorial 2026',
  'icloud no windows como sincronizar fotos',
  'melhor nuvem para backup gratis 2026',
  'arquivos sob demanda onedrive economizar espaco',
  'versao anterior de arquivo recuperar'
];

export const metadata: Metadata = createGuideMetadata('backup-automatico-nuvem', title, description, keywords);

export default function CloudBackupGuide() {
  const summaryTable = [
    { label: "Melhor Integração", value: "OneDrive (Nativo)" },
    { label: "Melhor Preço", value: "Google One (Drive)" },
    { label: "Melhor P/ iPhone", value: "iCloud for Windows" },
    { label: "Segurança", value: "Criptografia em Trânsito" },
    { label: "Recurso Chave", value: "Histórico de Versão (Ctrl+Z na vida)" },
    { label: "Custo-benefício", value: "Microsoft 365 (1TB + Office)" }
  ];

  const contentSections = [
    {
      title: "O Fim do Pen-Drive (E Por Que Você Precisa da Nuvem)",
      content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Em 2026, salvar arquivos localmente é jogar roleta russa. SSDs morrem subitamente. Notebooks são roubados. Ransomwares criptografam tudo. O <strong>Backup em Nuvem em Tempo Real</strong> é a única garantia de que, se seu PC explodir agora, você não perde nem a última frase que digitou.
        </p>
        
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20 mb-6">
          <h4 class="text-blue-400 font-bold mb-2">☁️ Sincronização vs Backup</h4>
          <p class="text-sm text-gray-300">
            Muitos confundem. 
            <br/><strong>Backup (Frio):</strong> Cópia estática guardada na gaveta (HD Externo). Se você apagar o original, a cópia fica lá.
            <br/><strong>Sincronização (Nuvem):</strong> O espelho do seu PC. Se você alterar um arquivo no PC, muda na nuvem. Se apagar no PC, apaga na nuvem (geralmente vai para a lixeira da nuvem).
            <br/>A nuvem é focada em <em>produtividade e continuidade</em>.
          </p>
        </div>
      `
    },
    {
      title: "Opção 1: OneDrive (A Escolha Lógica para Windows)",
      content: `
        <p class="mb-4 text-gray-300">
          O OneDrive já vem embutido no Windows 10/11. É a solução mais "invisível" e eficiente.
        </p>
        
        <h4 class="text-white font-bold mb-3 mt-4">Ativando o "Backup de Pastas do PC"</h4>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4 bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
            <li>Procure o ícone da <strong>nuvem azul/cinza</strong> perto do relógio (ou no Menu Iniciar > OneDrive).</li>
            <li>Entre com sua conta Microsoft (Hotmail/Outlook).</li>
            <li>Clique na engrenagem > Configurações > <strong>Sincronizar e fazer backup</strong>.</li>
            <li>Clique em <strong>Gerenciar backup</strong>.</li>
            <li>Ative as chaves para: <strong>Documentos, Imagens e Área de Trabalho</strong>.</li>
            <li>Clique em Salvar alterações.</li>
        </ol>
        <p class="mt-3 text-sm text-green-400">
            <strong>Mágica Feita:</strong> Agora, tudo que você salvar no Desktop vai automaticamente para a nuvem. Se formatar o PC, basta logar no OneDrive e seus ícones reaparecem.
        </p>

        <h4 class="text-white font-bold mb-3 mt-6">Arquivos Sob Demanda (Files On-Demand)</h4>
        <p class="mb-2 text-gray-300 text-sm">
            Este é o maior trunfo do OneDrive. Ele mostra seus 1TB de arquivos no Explorador, mas <strong>NÃO ocupa espaço no disco</strong>.
        </p>
        <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4">
            <li><strong>Ícone Nuvem ☁️:</strong> O arquivo está apenas online. Se clicar, ele baixa na hora.</li>
            <li><strong>Ícone Verde ✅:</strong> O arquivo foi baixado e ocupa espaço.</li>
            <li><strong>Como liberar espaço:</strong> Clique com botão direito em qualquer pasta > "Liberar espaço". O Windows apaga a cópia local e deixa só na nuvem.</li>
        </ul>
      `
    },
    {
      title: "Opção 2: Google Drive para Desktop",
      content: `
        <p class="mb-4 text-gray-300">
          Se você usa Android ou Gmail, o Google Drive é mais natural. Mas cuidado: ele não se integra tão profundamente quanto o OneDrive.
        </p>
        <div class="space-y-4">
            <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <h5 class="font-bold text-white mb-2">Instalação e Setup</h5>
                <ol class="list-decimal list-inside text-sm text-gray-300 space-y-2">
                    <li>Baixe o "Google Drive para Desktop" (antigo Backup and Sync).</li>
                    <li>Nas preferências, escolha "Meu Computador".</li>
                    <li>Clique em "Adicionar pasta" e selecione Documentos/Imagens manualmente.</li>
                    <li>Escolha "Sincronizar com o Google Drive".</li>
                </ol>
            </div>
            <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <h5 class="font-bold text-white mb-2">Google Fotos</h5>
                <p class="text-sm text-gray-300">
                    Você pode configurar para fazer upload APENAS de fotos/vídeos para o Google Fotos (com compressão ou qualidade original), sem gastar espaço do Drive com documentos.
                </p>
            </div>
        </div>
      `
    }
  ];

  const advancedContentSections = [
    {
      title: "Recurso Salvador: Histórico de Versão (Shadow Copy)",
      content: `
        <h4 class="text-white font-bold mb-3">Salvando o TCC Corrompido</h4>
        <p class="mb-4 text-gray-300">
            Você salvou o arquivo errado? Deletou um parágrafo importante e fechou o Word?
            <br/>A nuvem guarda as últimas 25-100 versões de cada arquivo.
        </p>
        
        <div class="bg-purple-900/10 p-5 rounded-xl border border-purple-500/20">
            <h5 class="text-purple-400 font-bold mb-2">Como Usar (OneDrive/Drive)</h5>
            <ol class="list-decimal list-inside text-sm text-gray-300 space-y-2">
                <li>Vá até a pasta do arquivo no Explorador de Arquivos.</li>
                <li>Clique com botão direito no arquivo > <strong>Histórico de Versão</strong> (OneDrive) ou "Ver versões anteriores" (Drive Web).</li>
                <li>Uma lista com datas e horários aparecerá.</li>
                <li>Selecione uma versão de 1 hora atrás e clique em "Restaurar".</li>
            </ol>
        </div>
      `
    },
    {
      title: "Estratégia Híbrida 3-2-1",
      content: `
        <p class="mb-4 text-gray-300">
          A nuvem é ótima, mas se sua conta for banida ou hackeada, você perde tudo. Não confie apenas nela.
          <br/>Use a nuvem como sua <strong>cópia off-site</strong> (o "1" da regra 3-2-1).
          <br/>Mantenha também um HD Externo em casa com backup semanal (usando Veeam ou Macrium Reflect).
        </p>
      `
    }
  ];

  const additionalContentSections = [
    {
      title: "O Que NÃO Colocar na Nuvem",
      content: `
        <h4 class="text-white font-bold mb-3">Evite Sincronizar:</h4>
        <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4">
            <li><strong>Arquivos Temporários ou Cache:</strong> (Ex: Pasta <code>node_modules</code> de programação, cache do Adobe Premiere). Eles contêm milhares de arquivos pequenos que travam a sincronização.</li>
            <li><strong>Bancos de Dados Abertos:</strong> (Arquivos .PST do Outlook, Máquinas Virtuais ligadas). Eles mudam a cada segundo e a nuvem tenta re-upar o arquivo gigante a cada byte alterado.</li>
            <li><strong>Jogos Instalados:</strong> Steam/Epic já salvam saves na nuvem deles. Não coloque a pasta de instalação (100GB+) no OneDrive.</li>
        </ul>
      `
    }
  ];

  const faqItems = [
    {
      question: "O OneDrive deixa o PC lento?",
      answer: "Geralmente não. Ele pausa a sincronização se você estiver jogando (Modo Jogo) ou em rede limitada. Mas se você colar 50GB de fotos de uma vez, ele vai usar CPU para processar (hash) e banda de upload."
    },
    {
      question: "O Ransomware atinge a nuvem?",
      answer: "Sim! Se o vírus criptografar seu arquivo local, o OneDrive sincroniza a versão criptografada para a nuvem. PORÉM, o OneDrive tem uma função 'Restaurar seu OneDrive' que permite voltar a conta inteira para um estado de ontem, revertendo o ataque."
    },
    {
      question: "5GB Grátis é pouco. Qual o melhor plano?",
      answer: "Microsoft 365 Personal (R$ 20-30/mês) dá 1TB + Office. Google One 100GB (R$ 7/mês) é o mais barato para começar. iCloud+ 50GB (R$ 4/mês) é essencial para quem tem iPhone."
    }
  ];

  const externalReferences = [
    { name: "Download OneDrive", url: "https://www.microsoft.com/en-us/microsoft-365/onedrive/download" },
    { name: "Google Drive para Desktop", url: "https://www.google.com/drive/download/" },
    { name: "iCloud para Windows", url: "https://apps.microsoft.com/store/detail/icloud/9PKTQ5699M62" }
  ];

  const relatedGuides = [
    {
      href: "/guias/backup-dados",
      title: "Guia Completo de Backup",
      description: "Entenda a estratégia 3-2-1 profissional."
    },
    {
      href: "/guias/protecao-ransomware",
      title: "Proteção Ransomware",
      description: "Como evitar o sequestro de dados."
    },
    {
      href: "/guias/recuperacao-dados-hd-corrompido",
      title: "Recuperação de Dados",
      description: "O que fazer se o backup falhar."
    }
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="35 min"
      difficultyLevel="Iniciante"
      author="Equipe de Produtividade Voltris"
      lastUpdated="2026-02-06"
      contentSections={contentSections}
      advancedContentSections={advancedContentSections}
      additionalContentSections={additionalContentSections}
      summaryTable={summaryTable}
      faqItems={faqItems}
      externalReferences={externalReferences}
      relatedGuides={relatedGuides}
    />
  );
}
