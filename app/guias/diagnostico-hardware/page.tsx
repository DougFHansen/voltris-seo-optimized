import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Guia Completo de Diagnóstico de Falhas de Hardware";
const description = "Identifique problemas de componentes físicos com ferramentas especializadas. Testes de memória, disco, placa-mãe e fonte.";
const keywords = ["diagnóstico hardware","teste componentes","memtest","crystal disk info","hwinfo"];

export const metadata: Metadata = createGuideMetadata('diagnostico-hardware', title, description, keywords);

export default function DiagnosticohardwareGuide() {
  const contentSections = [
    {
      title: "Introdução e Conceitos Fundamentais",
      content: `
        <p class="mb-4">O diagnóstico de falhas de hardware é o processo sistemático de identificação, teste e solução de problemas relacionados a componentes físicos de um computador, como CPU, GPU, RAM, disco rígido, placa-mãe, fonte de alimentação e outros periféricos.</p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <div class="bg-[#171313] p-4 rounded-lg border border-[#31A8FF]/30">
            <h3 class="text-white font-semibold mb-2">Benefícios Principais</h3>
            <ul class="text-gray-300 text-sm space-y-1">
              <li>✓ Identificação precisa de componentes com falhas</li>
              <li>✓ Prevenção de danos permanentes aos componentes</li>
              <li>✓ Redução de custos com substituições desnecessárias</li>
              <li>✓ Aumento da vida útil do equipamento</li>
            </ul>
          </div>
          <div class="bg-[#171313] p-4 rounded-lg border border-[#FF4B6B]/30">
            <h3 class="text-white font-semibold mb-2">Requisitos Mínimos</h3>
            <ul class="text-gray-300 text-sm space-y-1">
              <li>🔧 Multímetro digital e ferramentas de diagnóstico</li>
              <li>💡 Software de teste de hardware (HWiNFO, CrystalDiskInfo)</li>
              <li>⏱️ Tempo estimado: 60-120 minutos</li>
              <li>⚡ Pulseira antiestática para proteção dos componentes</li>
            </ul>
          </div>
        </div>
        
        <div class="bg-red-900/20 border border-red-500/30 rounded-lg p-4 my-6">
          <h3 class="text-red-400 font-semibold mb-2">💡 Dica Profissional</h3>
          <p class="text-gray-300 text-sm">Comece com testes não invasivos antes de abrir o gabinete para minimizar riscos de danos.</p>
        </div>
      `,
      subsections: [
        {
          subtitle: "Quando Aplicar Esta Técnica",
          content: `
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4">
              <li>Quando o computador apresenta lentidão inexplicável</li>
              <li>Para identificar componentes com falhas físicas</li>
              <li>Durante a preparação para upgrade de hardware</li>
              <li>Ao resolver problemas de instabilidade do sistema</li>
            </ul>
          `
        }
      ]
    },
    {
      title: "Configuração Passo a Passo",
      content: `
        <p class="mb-4">Siga estas etapas para diagnosticar componentes de hardware.</p>
      `,
      subsections: [
        {
          subtitle: "Diagnóstico Inicial",
          content: `
            <ol class="space-y-2 text-gray-300 list-decimal list-inside ml-4">
              <li>Observe sintomas físicos (ruídos, luzes, calor excessivo)</li>
              <li>Verifique erros na inicialização do sistema (BIOS/UEFI)</li>
              <li>Execute testes básicos de hardware integrados ao sistema</li>
              <li>Desconecte periféricos não essenciais</li>
              <li>Verifique conexões internas (cabos, cartões)</li>
            </ol>
          `
        },
        {
          subtitle: "Testes Especializados",
          content: `
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4">
              <li>Execute testes de memória (MemTest86, Windows Memory Diagnostic)</li>
              <li>Teste disco rígido com ferramentas SMART (CrystalDiskInfo)</li>
              <li>Monitore temperatura de CPU e GPU com HWiNFO ou similar</li>
              <li>Verifique fonte de alimentação com multímetro</li>
              <li>Teste componentes individualmente se possível</li>
            </ul>
          `
        }
      ]
    },
    {
      title: "Ferramentas e Recursos Recomendados",
      content: `
        <p class="mb-4">Ferramentas especializadas para diagnóstico de hardware.</p>
      `,
      subsections: [
        {
          subtitle: "Software Especializado",
          content: `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-[#171313] p-3 rounded border border-[#31A8FF]/20">
                <h4 class="text-white font-semibold mb-2">Ferramentas Gratuitas</h4>
                <ul class="text-gray-300 text-xs space-y-1">
                  <li>MemTest86 - para testes de memória RAM</li>
                  <li>CrystalDiskInfo - para leitura de dados SMART de discos</li>
                  <li>HWiNFO - para monitoramento de hardware e sensores</li>
                </ul>
              </div>
              <div class="bg-[#171313] p-3 rounded border border-[#FF4B6B]/20">
                <h4 class="text-white font-semibold mb-2">Soluções Pagas</h4>
                <ul class="text-gray-300 text-xs space-y-1">
                  <li>PC-Doctor - solução profissional para diagnóstico</li>
                  <li>SiSoftware Sandra - para benchmarks e diagnósticos avançados</li>
                  <li>Ferramentas de diagnóstico de fabricantes (Dell, HP, Lenovo)</li>
                </ul>
              </div>
            </div>
          `
        },
        {
          subtitle: "Práticas de Segurança",
          content: `
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4">
              <li>Descarregue eletricidade estática antes de tocar componentes</li>
              <li>Trabalhe em superfícies antiestáticas</li>
              <li>Desconecte o computador da energia antes de abrir</li>
              <li>Evite tocar componentes sensíveis diretamente</li>
            </ul>
          `
        }
      ]
    },
    {
      title: "Troubleshooting e Solução de Problemas",
      content: `
        <p class="mb-4">Soluções para problemas comuns no diagnóstico de hardware.</p>
      `,
      subsections: [
        {
          subtitle: "Erros Frequentes e Soluções",
          content: `
            <div class="bg-[#171313] p-4 rounded-lg border border-[#8B31FF]/30">
              <h4 class="text-white font-semibold mb-2">Problema: Computador não inicializa, LED do painel frontal não acende</h4>
              <p class="text-gray-300 text-sm mb-2">Solução: Verifique fonte de alimentação e conexões principais</p>
              <ul class="text-gray-300 text-xs space-y-1 ml-4">
                <li>Teste a fonte com multímetro ou comprovador de fonte</li>
                <li>Verifique se o cabo de força está funcionando corretamente</li>
                <li>Confirme que o interruptor de 110/220V está na posição correta</li>
              </ul>
            </div>
            <div class="bg-[#171313] p-4 rounded-lg border border-[#8B31FF]/30 mt-4">
              <h4 class="text-white font-semibold mb-2">Problema: Computador inicializa mas não emite beep codes e não inicializa sistema</h4>
              <p class="text-gray-300 text-sm mb-2">Solução: Verifique RAM, CPU e GPU</p>
              <ul class="text-gray-300 text-xs space-y-1 ml-4">
                <li>Remova e reinsira os módulos de RAM</li>
                <li>Verifique se a CPU está corretamente instalada</li>
                <li>Confirme que a GPU está conectada corretamente</li>
              </ul>
            </div>
          `
        },
        {
          subtitle: "Prevenção de Problemas Futuros",
          content: `
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4">
              <li>Realize limpeza regular de poeira dos componentes</li>
              <li>Monitore temperaturas constantemente</li>
              <li>Substitua componentes antigos preventivamente</li>
              <li>Mantenha drivers atualizados para melhor compatibilidade</li>
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
      estimatedTime="85 minutos"
      difficultyLevel="Avançado"
      contentSections={contentSections}
      relatedGuides={relatedGuides}
    />
  );
}