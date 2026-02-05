import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'recuperacao-sistema',
  title: "Guia Completo de Recuperação do Sistema Windows",
  description: "Aprenda a recuperar seu sistema Windows após falhas, corrupção ou problemas graves. Restaure seu computador para estado funcional com métodos profissi...",
  category: 'windows-geral',
  difficulty: 'Intermediário',
  time: '90 minutos'
};

const title = "Guia Completo de Recuperação do Sistema Windows";
const description = "Aprenda a recuperar seu sistema Windows após falhas, corrupção ou problemas graves. Restaure seu computador para estado funcional com métodos profissionais.";
const keywords = [
  "recuperação de sistema",
  "restaurar windows",
  "ponto de restauração",
  "recuperação de falhas",
  "sistema corrompido",
  "restauração de imagem"
];

export const metadata: Metadata = createGuideMetadata('recuperacao-sistema', title, description, keywords);

export default function RecuperacaoSistemaGuide() {
  const contentSections = [
    {
      title: "Quando e Por Que Recuperar o Sistema",
      content: `
        <p class="mb-4">A recuperação do sistema é necessária quando seu Windows apresenta falhas graves, 
        corrupção de arquivos, infecções por malware ou após instalações problemáticas 
        que afetam o funcionamento normal do sistema operacional.</p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <div class="bg-[#171313] p-4 rounded-lg border border-[#FF4B6B]/30">
            <h3 class="text-white font-semibold mb-2">Sinais que Indicam Necessidade de Recuperação</h3>
            <ul class="text-gray-300 text-sm space-y-1">
              <li>❌ Sistema trava frequentemente</li>
              <li>❌ Blue Screen of Death (BSOD)</li>
              <li>❌ Programas não abrem ou crasham</li>
              <li>❌ Desempenho extremamente lento</li>
              <li>❌ Erros de arquivos do sistema</li>
            </ul>
          </div>
          <div class="bg-[#171313] p-4 rounded-lg border border-[#31A8FF]/30">
            <h3 class="text-white font-semibold mb-2">Benefícios da Recuperação</h3>
            <ul class="text-gray-300 text-sm space-y-1">
              <li>✓ Retorno a estado estável</li>
              <li>✓ Eliminação de malware</li>
              <li>✓ Correção de erros do sistema</li>
              <li>✓ Preservação de dados pessoais</li>
              <li>✓ Evita reinstalação completa</li>
            </ul>
          </div>
        </div>
      `,
      subsections: []
    },
    {
      title: "Métodos de Recuperação",
      content: "",
      subsections: [
        {
          subtitle: "Pontos de Restauração do Sistema",
          content: `
            <p class="mb-4">A restauração do sistema é um recurso do Windows que reverte as alterações do sistema 
            a um ponto anterior, revertendo alterações recentes no registro e arquivos do sistema.</p>
            <ol class="space-y-2 text-gray-300 list-decimal list-inside ml-4 mb-4">
              <li>Pressione tecla Windows + R e digite "rstrui.exe"</li>
              <li>Selecione "Escolher uma configuração diferente"</li>
              <li>Escolha um ponto de restauração antes do problema ocorrer</li>
              <li>Siga as instruções e reinicie o computador</li>
            </ol>
          `
        },
        {
          subtitle: "Recuperação de Imagem do Sistema",
          content: `
            <p class="mb-4">A recuperação de imagem restaura todo o disco rígido ou volumes específicos 
            usando uma cópia de segurança previamente criada.</p>
            <ol class="space-y-2 text-gray-300 list-decimal list-inside ml-4 mb-4">
              <li>Acesse Painel de Controle > Sistema e Segurança > Backup e Restauração</li>
              <li>Clique em "Recuperar meu computador usando uma imagem do sistema"</li>
              <li>Siga o assistente de recuperação de imagem</li>
              <li>Selecione a imagem de backup desejada</li>
            </ol>
          `
        },
        {
          subtitle: "Reinicialização do Sistema",
          content: `
            <p class="mb-4">A reinicialização do sistema do Windows 10/11 permite manter seus arquivos 
            e aplicativos enquanto reinstala o sistema operacional.</p>
            <ol class="space-y-2 text-gray-300 list-decimal list-inside ml-4 mb-4">
              <li>Vá para Configurações > Atualização e Segurança > Recuperação</li>
              <li>Em "Reiniciar este PC", clique em "Começar"</li>
              <li>Escolha "Manter meus arquivos" ou "Remover tudo"</li>
              <li>Siga as instruções na tela</li>
            </ol>
          `
        },
        {
          subtitle: "Restauração de Fabricante",
          content: `
            <p class="mb-4">Muitos fabricantes incluem ferramentas de recuperação específicas 
            que restauram o sistema para o estado original de fábrica.</p>
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4 mb-4">
              <li>Asus: Ferramenta ASUS Recovery</li>
              <li>HP: HP Recovery Manager</li>
              <li>Dell: Dell Backup and Recovery</li>
              <li>Lenovo: ThinkPad USB 3.0 Recovery Creator</li>
            </ul>
          `
        }
      ]
    },
    {
      title: "Diagnóstico e Prevenção",
      content: "",
      subsections: [
        {
          subtitle: "Identificando Causas de Falhas",
          content: `
            <p class="mb-4">Antes de iniciar a recuperação, é importante entender a causa raiz 
            do problema para evitar reincidência.</p>
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4 mb-4">
              <li>Erros recentes de drivers ou hardware</li>
              <li>Instalações de software problemático</li>
              <li>Infecções por malware ou vírus</li>
              <li>Problemas de hardware físico</li>
            </ul>
          `
        },
        {
          subtitle: "Criação de Pontos de Restauração",
          content: `
            <p class="mb-4">É altamente recomendável criar pontos de restauração 
            antes de grandes mudanças no sistema.</p>
            <ol class="space-y-2 text-gray-300 list-decimal list-inside ml-4 mb-4">
              <li>Abra o Prompt de Comando como Administrador</li>
              <li>Digite: <code class="bg-[#2a2a2e] px-2 py-1 rounded">wusa /r /v</code> para verificar pontos existentes</li>
              <li>Para criar um novo: <code class="bg-[#2a2a2e] px-2 py-1 rounded">wmic /namespace:\\\\root\\default path systemrestore call createrestorepoint "Ponto de Restauração Antes de Mudança", 0, 100</code></li>
              <li>Use também o Painel de Controle > Sistema > Proteção do Sistema</li>
            </ol>
          `
        },
        {
          subtitle: "Estratégias de Backup",
          content: `
            <p class="mb-4">Embora a recuperação do sistema preserve dados pessoais, 
            ter backups é essencial para segurança total.</p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-[#171313] p-4 rounded border border-[#31A8FF]/20">
                <h4 class="text-white font-semibold mb-2">Backups Regulares</h4>
                <ul class="text-gray-300 text-xs space-y-1">
                  <li>Imagens do sistema completas</li>
                  <li>Cópias de arquivos pessoais</li>
                  <li>Exportação de favoritos e configurações</li>
                </ul>
              </div>
              <div class="bg-[#171313] p-4 rounded border border-[#FF4B6B]/20">
                <h4 class="text-white font-semibold mb-2">Armazenamento</h4>
                <ul class="text-gray-300 text-xs space-y-1">
                  <li>HD externo dedicado</li>
                  <li>Serviços em nuvem confiáveis</li>
                  <li>Mídias ópticas para arquivamento</li>
                </ul>
              </div>
            </div>
          `
        }
      ]
    },
    {
      title: "Conclusão",
      content: `<p class="mb-4">A recuperação do sistema é uma habilidade essencial para qualquer usuário avançado 
      de Windows. Com os métodos adequados e uma estratégia de prevenção bem planejada, 
      você pode resolver a maioria dos problemas graves do sistema sem perder dados importantes.</p>
      <p class="mb-4">Lembre-se de que prevenção é sempre melhor que cura. Mantenha backups regulares, 
      crie pontos de restauração antes de grandes mudanças e monitore a saúde do seu 
      sistema continuamente para evitar problemas séries.</p>`,
      subsections: [
        {
          subtitle: "Precisa de Recuperação Profissional?",
          content: `
            <div class="bg-[#171313] p-6 rounded-lg border border-[#31A8FF]/30 mt-6">
              <p class="text-white font-semibold mb-3 text-lg">Precisa de Recuperação Profissional?</p>
              <p class="text-gray-300 leading-relaxed mb-4">
                Nossa equipe especializada pode recuperar seu sistema com técnicas avançadas 
                e garantir que seus dados estejam seguros durante todo o processo.
              </p>
              <div class="flex flex-col sm:flex-row gap-4">
                <a 
                  href="/todos-os-servicos"
                  class="px-6 py-3 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300 text-center inline-block"
                >
                  Ver Serviços de Recuperação
                </a>
                <a 
                  href="https://wa.me/5511996716235?text=Olá!%20Preciso%20de%20ajuda%20com%20recuperação%20de%20sistema."
                  target="_blank"
                  rel="noopener noreferrer"
                  class="px-6 py-3 border-2 border-[#31A8FF] text-[#31A8FF] font-bold rounded-xl hover:bg-[#31A8FF] hover:text-white transition-all duration-300 text-center inline-block"
                >
                  Falar com Especialista
                </a>
              </div>
            </div>
          `
        }
      ]
    }
  ];

  const relatedGuides = [
    {
      href: "/guias/formatacao-windows",
      title: "Formatação do Windows",
      description: "Aprenda a formatar seu sistema corretamente."
    },
    {
      href: "/guias/backup-dados",
      title: "Backup de Dados",
      description: "Proteja seus dados com estratégias eficazes."
    }
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="90 minutos"
      difficultyLevel="Avançado"
      contentSections={contentSections}
      relatedGuides={relatedGuides}
    />
  );
}