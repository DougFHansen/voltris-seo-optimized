import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Guia Completo de Formatação do Windows";
const description = "Aprenda passo a passo como formatar seu computador Windows de forma segura, incluindo backup de dados, instalação limpa e configuração inicial.";
const keywords = ['formatacao windows', 'formatar windows', 'instalacao limpa windows', 'backup dados', 'configuracao inicial'];

export const metadata: Metadata = createGuideMetadata(title, description, keywords);

export default function FormatacaoWindowsGuide() {
  const contentSections = [
    {
      title: "Introdução e Conceitos Fundamentais",
      content: `
        <p class="mb-4">A formatação do Windows é o processo de reinstalação limpa do sistema operacional, eliminando todos os dados, programas e configurações do disco rígido e instalando uma cópia fresh do sistema operacional.</p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <div class="bg-[#171313] p-4 rounded-lg border border-[#31A8FF]/30">
            <h3 class="text-white font-semibold mb-2">Benefícios Principais</h3>
            <ul class="text-gray-300 text-sm space-y-1">
              <li>✓ Eliminação completa de vírus e malware</li>
              <li>✓ Remoção de arquivos temporários e lixo do sistema</li>
              <li>✓ Resolução de problemas de desempenho crônicos</li>
              <li>✓ Retorno à performance original do sistema</li>
            </ul>
          </div>
          <div class="bg-[#171313] p-4 rounded-lg border border-[#FF4B6B]/30">
            <h3 class="text-white font-semibold mb-2">Requisitos Mínimos</h3>
            <ul class="text-gray-300 text-sm space-y-1">
              <li>💾 Mídia de instalação do Windows (USB ou DVD)</li>
              <li>☁️ Backup de todos os dados importantes</li>
              <li>⏱️ Tempo estimado: 60-120 minutos</li>
              <li>📥 Chaves de produto/licenças dos softwares principais</li>
            </ul>
          </div>
        </div>
        
        <div class="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 my-6">
          <h3 class="text-yellow-400 font-semibold mb-2">⚠️ Aviso Importante</h3>
          <p class="text-gray-300 text-sm">A formatação apaga todos os dados do disco onde o Windows está instalado. Faça backup de todos os arquivos importantes antes de prosseguir.</p>
        </div>
      `,
      subsections: [
        {
          subtitle: "Quando Aplicar Esta Técnica",
          content: `
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4">
              <li>Quando o sistema operacional está muito lento ou instável</li>
              <li>Para eliminar vírus ou malware persistentes</li>
              <li>Durante a reinstalação limpa após problemas graves</li>
              <li>Antes de vender ou transferir o computador para outra pessoa</li>
            </ul>
          `
        }
      ]
    },
    {
      title: "Configuração Passo a Passo",
      content: `
        <p class="mb-4">Siga estas etapas para formatar e reinstalar o Windows.</p>
      `,
      subsections: [
        {
          subtitle: "Preparação para Formatação",
          content: `
            <ol class="space-y-2 text-gray-300 list-decimal list-inside ml-4">
              <li>Faça backup completo de todos os dados importantes</li>
              <li>Anote chaves de licença de softwares e do Windows</li>
              <li>Baixe a ferramenta de criação de mídia do Windows da Microsoft</li>
              <li>Crie uma mídia de instalação (USB ou DVD) com o instalador</li>
              <li>Desative o BitLocker e outros criptogramas se estiverem ativos</li>
            </ol>
          `
        },
        {
          subtitle: "Instalação Limpa",
          content: `
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4">
              <li>Inicie o computador pela mídia de instalação criada</li>
              <li>Siga o assistente de instalação do Windows</li>
              <li>Selecione a opção de formatação personalizada</li>
              <li>Formate o disco onde estava instalado o Windows anterior</li>
              <li>Após a instalação, configure as configurações básicas</li>
            </ul>
          `
        }
      ]
    },
    {
      title: "Ferramentas e Recursos Recomendados",
      content: `
        <p class="mb-4">Ferramentas especializadas para formatação e reinstalação do Windows.</p>
      `,
      subsections: [
        {
          subtitle: "Software Especializado",
          content: `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-[#171313] p-3 rounded border border-[#31A8FF]/20">
                <h4 class="text-white font-semibold mb-2">Ferramentas Gratuitas</h4>
                <ul class="text-gray-300 text-xs space-y-1">
                  <li>Criador de mídia do Windows - para criar USB de instalação</li>
                  <li>Recuperação do Windows - para ferramentas de recuperação</li>
                  <li>Driver Easy Free - para backup de drivers</li>
                </ul>
              </div>
              <div class="bg-[#171313] p-3 rounded border border-[#FF4B6B]/20">
                <h4 class="text-white font-semibold mb-2">Soluções Pagas</h4>
                <ul class="text-gray-300 text-xs space-y-1">
                  <li>Norton Ghost - para cópias de imagem do sistema</li>
                  <li>Acronis True Image - para backup e restauração completos</li>
                  <li>WinRAR ou 7-Zip Pro - para manipulação de arquivos</li>
                </ul>
              </div>
            </div>
          `
        },
        {
          subtitle: "Práticas de Segurança",
          content: `
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4">
              <li>Verifique a autenticidade da mídia de instalação para evitar malware</li>
              <li>Armazene chaves de licença em local seguro antes da formatação</li>
              <li>Evite reinstalar softwares de fontes não confiáveis após formatação</li>
              <li>Configure firewall e antivírus imediatamente após a reinstalação</li>
            </ul>
          `
        }
      ]
    },
    {
      title: "Troubleshooting e Solução de Problemas",
      content: `
        <p class="mb-4">Soluções para problemas comuns durante a formatação e reinstalação do Windows.</p>
      `,
      subsections: [
        {
          subtitle: "Erros Frequentes e Soluções",
          content: `
            <div class="bg-[#171313] p-4 rounded-lg border border-[#8B31FF]/30">
              <h4 class="text-white font-semibold mb-2">Problema: Computador não inicia pela mídia de instalação</h4>
              <p class="text-gray-300 text-sm mb-2">Solução: Verifique configurações de boot na BIOS/UEFI</p>
              <ul class="text-gray-300 text-xs space-y-1 ml-4">
                <li>Acesse a BIOS/UEFI durante a inicialização (normalmente com F2, F12 ou Del)</li>
                <li>Altere a ordem de boot para iniciar pelo dispositivo USB/CD/DVD primeiro</li>
                <li>Desative o Secure Boot temporariamente se necessário</li>
              </ul>
            </div>
            <div class="bg-[#171313] p-4 rounded-lg border border-[#8B31FF]/30 mt-4">
              <h4 class="text-white font-semibold mb-2">Problema: Drivers não funcionam corretamente após reinstalação</h4>
              <p class="text-gray-300 text-sm mb-2">Solução: Instale os drivers corretos para seu hardware</p>
              <ul class="text-gray-300 text-xs space-y-1 ml-4">
                <li>Visite o site do fabricante do seu computador/hardware</li>
                <li>Baixe os drivers específicos para seu modelo e versão do Windows</li>
                <li>Instale os drivers de chipset, vídeo e rede primeiro</li>
              </ul>
            </div>
          `
        },
        {
          subtitle: "Prevenção de Problemas Futuros",
          content: `
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4">
              <li>Crie uma imagem de sistema após uma instalação limpa e configuração completa</li>
              <li>Mantenha uma lista de softwares essenciais para reinstalação rápida</li>
              <li>Configure backups automáticos regulares após a reinstalação</li>
              <li>Documente as configurações personalizadas para fácil reimplementação</li>
            </ul>
          `
        }
      ]
    }
  ];

  const relatedGuides = [
    {
      href: "/guias/seguranca-digital",
      title: "Segurança Digital Completa",
      description: "Proteção abrangente contra ameaças cibernéticas"
    },
    {
      href: "/guias/otimizacao-performance",
      title: "Otimização de Performance",
      description: "Maximize o desempenho do seu sistema"
    },
    {
      href: "/guias/manutencao-preventiva",
      title: "Manutenção Preventiva",
      description: "Estratégias completas de cuidados com o sistema"
    }
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="45 minutos"
      difficultyLevel="Intermediário"
      contentSections={contentSections}
      relatedGuides={relatedGuides}
    />
  );
}

