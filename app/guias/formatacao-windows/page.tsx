import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Como Formatar Windows (Passo a Passo 2026) - Voltris";
const description = "Aprenda passo a passo como formatar seu computador Windows 10 ou 11 de forma segura. Guia definitivo com backup, instalação limpa e drivers.";
const keywords = ['formatacao windows', 'formatar windows', 'formatar windows 11 sem pen drive', 'instalacao limpa windows', 'backup dados', 'configuracao inicial'];

export const metadata: Metadata = createGuideMetadata(title, description, keywords);

export default function FormatacaoWindowsGuide() {
  const summaryTable = [
    { label: "Dificuldade", value: "Intermediário" },
    { label: "Tempo Médio", value: "60 - 120 min" },
    { label: "Ferramentas", value: "Pen Drive 8GB+" }
  ];

  const faqItems = [
    {
      question: "Formatar o Windows apaga minhas fotos e arquivos?",
      answer: "Sim, a formatação limpa apaga tudo que está na unidade selecionada (geralmente C:). Por isso, o passo de <strong>Backup</strong> é o mais crítico de todo o processo. Recomendamos salvar seus arquivos em um HD externo ou na nuvem (Google Drive/OneDrive) antes de começar."
    },
    {
      question: "Quanto tempo demora para formatar o PC?",
      answer: "Em computadores modernos com SSD, a instalação do Windows leva entre 15 a 30 minutos. Porém, reservamos <strong>1 a 2 horas</strong> para o processo completo, que inclui backup, criação do pendrive, instalação de drivers e configuração dos programas essenciais."
    },
    {
      question: "O BitLocker atrapalha a formatação?",
      answer: "Sim, se o disco estiver criptografado com BitLocker, você precisará da chave de recuperação ou deverá desativá-lo antes. Caso contrário, o instalador pode não conseguir acessar o disco para formatá-lo."
    },
    {
      question: "É possível formatar o Windows 11 sem Pen Drive?",
      answer: "Sim! O Windows 11 possui a função 'Restaurar o PC' (Reset This PC), que permite reinstalar o sistema baixando uma nova cópia da nuvem, sem precisar de mídia externa. Explicamos isso na seção de métodos alternativos."
    }
  ];

  const contentSections = [
    {
      title: "Introdução e Conceitos Fundamentais",
      content: `
        <p class="mb-4">A formatação do Windows é o processo de reinstalação limpa do sistema operacional, eliminando todos os dados, programas e configurações do disco rígido e instalando uma cópia nova ("fresh") do sistema.</p>
        
        <div class="bg-[#1c1c1e] border-l-4 border-[#FF4B6B] p-4 my-6 rounded-r-lg">
          <p class="text-[#FF4B6B] font-bold text-sm mb-1 uppercase tracking-wider">Nota do Especialista</p>
          <p class="text-gray-300 italic">"Em nossos atendimentos na Voltris, vemos que 80% dos PCs lentos ou com 'tela azul' são resolvidos com uma formatação limpa bem feita. Muitas vezes, o usuário tenta apenas 'limpar' o sistema, mas restos de drivers antigos e registros corrompidos continuam causando problemas. A formatação é a única forma de garantir 100% de estabilidade."</p>
          <p class="text-gray-400 text-xs mt-2">- Douglas Hansen, Especialista Microsoft</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <div class="bg-[#171313] p-4 rounded-lg border border-[#31A8FF]/30">
            <h3 class="text-white font-semibold mb-2">Por que fazer isso hoje?</h3>
            <ul class="text-gray-300 text-sm space-y-2">
              <li class="flex items-start"><span class="mr-2 text-[#31A8FF]">✓</span> Eliminação completa de vírus e malware persistentes</li>
              <li class="flex items-start"><span class="mr-2 text-[#31A8FF]">✓</span> Fim dos erros de DLL e telas azuis</li>
              <li class="flex items-start"><span class="mr-2 text-[#31A8FF]">✓</span> O computador volta a ter a velocidade de quando era novo</li>
            </ul>
          </div>
          <div class="bg-[#171313] p-4 rounded-lg border border-[#FF4B6B]/30">
             <h3 class="text-white font-semibold mb-2">O que você precisa</h3>
            <ul class="text-gray-300 text-sm space-y-2">
              <li class="flex items-start"><span class="mr-2">💾</span> <strong>Pen Drive de 8GB</strong> ou superior (vazio)</li>
              <li class="flex items-start"><span class="mr-2">☁️</span> Local para <strong>Backup</strong> (HD Externo ou Nuvem)</li>
              <li class="flex items-start"><span class="mr-2">☕</span> Cerca de <strong>1 a 2 horas</strong> livres</li>
            </ul>
          </div>
        </div>
        
        <p class="mb-4">Se você está inseguro sobre mexer na BIOS ou tem medo de perder dados, saiba que essa é a parte que mais assusta, mas seguindo o guia visual abaixo, o risco é mínimo.</p>
      `,
      subsections: [
        {
          subtitle: "Quando é a hora de formatar?",
          content: `
            <ul class="space-y-4 text-gray-300 ml-4">
              <li class="list-disc pl-2"><strong>Lentidão extrema:</strong> Quando o PC demora minutos para abrir o navegador.</li>
              <li class="list-disc pl-2"><strong>Vírus:</strong> Se pegou um ransomware ou malware que o antivírus não remove.</li>
              <li class="list-disc pl-2"><strong>Troca de Hardware:</strong> Trocou placa-mãe ou processador? Formate para evitar conflitos de drivers.</li>
              <li class="list-disc pl-2"><strong>Venda:</strong> Vai vender o PC? A formatação garante que seus dados não vão junto.</li>
            </ul>
          `
        }
      ]
    },
    {
      title: "Passo a Passo: A Formatação Segura",
      content: `
        <p class="mb-4">Vamos dividir o processo em 3 etapas claras: Preparação (Backup), Criação do Pen Drive e Instalação. Não pule nenhuma etapa.</p>
      `,
      subsections: [
        {
          subtitle: "Etapa 1: O Backup (Sagrado)",
          content: `
            <p class="mb-4"><strong>Pare tudo!</strong> Se formatar agora, seus arquivos vão sumir para sempre. Copie tudo que importa:</p>
            <ol class="space-y-3 text-gray-300 list-decimal list-inside ml-4 mb-6">
              <li>Conecte seu HD Externo ou acesse seu Google Drive/OneDrive.</li>
              <li>Copie as pastas: <strong>Documentos, Imagens, Área de Trabalho e Downloads</strong>.</li>
              <li>Não esqueça de verificar se há arquivos soltos na unidade C:.</li>
              <li>Anote suas senhas e, se possível, as chaves de licença (Office, Windows).</li>
            </ol>
            
            <div class="bg-[#1c1c1e] p-6 rounded-lg border border-[#31A8FF] shadow-lg my-8">
              <div class="flex flex-col md:flex-row items-center gap-6">
                <div class="flex-1">
                  <h4 class="text-xl font-bold text-white mb-2">Medo de perder dados? Nós fazemos para você!</h4>
                  <p class="text-gray-300 text-sm mb-4">Se você não se sente seguro para fazer o backup ou mexer na BIOS, nossa equipe pode acessar seu PC remotamente e fazer todo o processo de formatação e otimização por você, com garantia de segurança dos dados.</p>
                  <div class="flex gap-3">
                     <a href="/todos-os-servicos" class="px-4 py-2 bg-[#31A8FF] text-white font-bold rounded hover:bg-[#2b93df] transition text-sm">Ver Serviço de Formatação</a>
                     <a href="https://wa.me/5511996716235?text=Olá,%20tenho%20medo%20de%20formatar%20sozinho." target="_blank" class="px-4 py-2 border border-[#31A8FF] text-[#31A8FF] font-bold rounded hover:bg-[#31A8FF]/10 transition text-sm">Falar no WhatsApp</a>
                  </div>
                </div>
              </div>
            </div>
          `
        },
        {
          subtitle: "Etapa 2: Criando o Pen Drive Bootável",
          content: `
            <p class="mb-4">Você precisa transformar um pen drive comum em uma ferramenta de instalação do Windows. A Microsoft fornece uma ferramenta gratuita para isso.</p>
            <ol class="space-y-4 text-gray-300 list-decimal list-inside ml-4">
              <li>Acesse o site oficial da Microsoft e baixe a "Media Creation Tool" (Ferramenta de Criação de Mídia) do Windows 10 ou 11.</li>
              <li>Conecte o Pen Drive (Atenção: tudo no pen drive será apagado!).</li>
              <li>Execute a ferramenta baixada. Aceite os termos.</li>
              <li>Escolha a opção: <strong>"Criar mídia de instalação (pen drive, DVD ou arquivo ISO)"</strong>.</li>
              <li>Selecione o Pen Drive na lista e aguarde. O download do Windows (aprox. 5GB) será feito e gravado no pen drive.</li>
            </ol>
            <p class="text-sm text-gray-400 mt-2"><em>Dica: Esse processo depende da sua internet, pode levar de 20 a 40 minutos.</em></p>
          `
        },
        {
          subtitle: "Etapa 3: A Instalação Limpa (O 'Pulo do Gato')",
          content: `
            <p class="mb-4">Agora vem a parte técnica. Precisamos fazer o computador ligar pelo Pen Drive, e não pelo HD.</p>
            <ul class="space-y-4 text-gray-300 list-disc list-inside ml-4">
              <li>Deixe o Pen Drive conectado e reinicie o PC.</li>
              <li>Assim que o computador ligar (antes de aparecer o logo do Windows), pressione repetidamente a tecla de <strong>BOOT MENU</strong>.
                <ul class="font-mono text-sm text-[#31A8FF] ml-6 mt-2 mb-2 bg-[#121218] p-2 rounded w-fit">
                  <li>Dell: F12</li>
                  <li>HP: F9 ou Esc</li>
                  <li>Lenovo: F12 ou Botão Novo</li>
                  <li>Asus: F8</li>
                  <li>Acer: F12</li>
                </ul>
              </li>
              <li>No menu que aparecer, selecione o seu Pen Drive (geralmente tem "UEFI" no nome).</li>
              <li>O instalador do Windows vai carregar. Selecione idioma ABNT2 e clique em "Instalar Agora".</li>
              <li><strong>Importante:</strong> Escolha a opção "Personalizada: Instalar apenas o Windows (avançado)".</li>
              <li>Na tela de discos, exclua todas as partições do HD principal até sobrar apenas "Espaço não alocado". Selecione esse espaço e clique em Avançar.</li>
            </ul>
            <div class="bg-yellow-900/20 border-l-4 border-yellow-500 p-4 my-4">
              <p class="text-yellow-400 font-bold text-sm">⚠️ Atenção</p>
              <p class="text-gray-300 text-sm">Ao excluir as partições, os dados são apagados. Tenha certeza que o backup foi feito!</p>
            </div>
          `
        },
        {
          subtitle: "Método Alternativo: Formatar Windows 11 sem Pen Drive",
          content: `
            <p class="mb-4">Se você já está no Windows 11 e ele ainda inicia, você pode usar a função nativa de restauração:</p>
            <ol class="space-y-2 text-gray-300 list-decimal list-inside ml-4">
              <li>Vá em <strong>Configurações > Sistema > Recuperação</strong>.</li>
              <li>Em "Restaurar este PC", clique em <strong>Restaurar o PC</strong>.</li>
              <li>Escolha "Remover tudo" para uma formatação limpa.</li>
              <li>Escolha "Download da Nuvem" para baixar uma versão nova e atualizada do Windows.</li>
              <li>Siga as instruções e aguarde o processo terminar.</li>
            </ol>
            <p class="text-gray-400 text-sm mt-2">Este método é mais fácil, mas menos eficaz se o Windows já estiver com vírus profundos. Para casos graves, use o método do Pen Drive.</p>
          `
        }
      ]
    },
    {
      title: "Pós-Instalação: O Que Instalar Primeiro?",
      content: `
        <p class="mb-4">O Windows está instalado. E agora? Aqui está a ordem correta para deixar a máquina voando:</p>
      `,
      subsections: [
        {
          subtitle: "1. Drivers",
          content: `
            <p class="text-gray-300 mb-2">Não instale jogos ou programas ainda. O Windows Update vai instalar a maioria dos drivers automaticamente. Vá em Configurações > Windows Update e clique em "Verificar se há atualizações". Repita até não ter mais nada.</p>
          `
        },
        {
          subtitle: "2. Ninite (O Segredo dos Técnicos)",
          content: `
            <p class="text-gray-300 mb-2">Não perca tempo baixando Chrome, WinRAR, Zoom um por um. Acesse <strong>Ninite.com</strong>, marque tudo que você usa e baixe um único instalador que instala tudo sozinho, sem "next, next" e sem barras de ferramentas indesejadas.</p>
          `
        }
      ]
    }
  ];

  const relatedGuides = [
    {
      href: "/guias/seguranca-digital",
      title: "Segurança Digital Pós-Formatação",
      description: "O que instalar para não pegar vírus novamente."
    },
    {
      href: "/guias/otimizacao-performance",
      title: "Otimização de Performance",
      description: "Ajustes finos para deixar o Windows recém-instalado ainda mais rápido."
    }
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="90 minutos"
      difficultyLevel="Intermediário"
      contentSections={contentSections}
      relatedGuides={relatedGuides}
      summaryTable={summaryTable}
      faqItems={faqItems}
    />
  );
}

