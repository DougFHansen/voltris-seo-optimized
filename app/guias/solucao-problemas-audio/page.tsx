import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Windows Sem Som? Guia Completo de Reparo de Áudio";
const description = "Diagnóstico passo a passo para resolver problemas de som no Windows 10/11. Drivers Realtek, configurações de saída e serviços de áudio.";
const keywords = ["windows sem som","driver realtek","solução problemas audio","microfone não funciona","audio services"];

export const metadata: Metadata = createGuideMetadata(title, description, keywords);

export default function GuidePage() {
  const contentSections = [

    {
      title: "O Básico Primeiro",
      content: `
        <ul class="list-decimal list-inside space-y-2 text-gray-300">
            <li><strong>Dispositivo de Saída Correto:</strong> Clique no ícone de som na barra de tarefas. Você está enviando áudio para a caixa de som ou para o monitor HDMI (que talvez não tenha som)?</li>
            <li><strong>Volume Físico:</strong> Verifique se a caixa de som está ligada e com volume alto.</li>
            <li><strong>Cabo P2:</strong> Verifique se está conectado na porta VERDE (saída) e não na azul ou rosa.</li>
          </ul>
      `,
      subsections: []
    },

    {
      title: "Reiniciando os Serviços de Áudio",
      content: `
        <p class="mb-4 text-gray-300">Às vezes o driver trava. Reiniciar o serviço resolve:</p>
          <div class="bg-[#1E1E22] p-4 rounded border border-gray-700 font-mono text-sm text-gray-300">
            1. Pressione Win + R, digite "services.msc" e Enter.<br>
            2. Procure por "Áudio do Windows".<br>
            3. Clique com botão direito -> Reiniciar.
          </div>
      `,
      subsections: []
    },

    {
      title: "Melhorias de Áudio (Desativar)",
      content: `
        <p class="text-gray-300">Configurações de som > Mais configurações > Propriedades do dispositivo > Aba <strong>Aperfeiçoamentos</strong>. Marque "Desativar todos os efeitos sonoros". Drivers antigos às vezes bugam com esses efeitos.</p>
      `,
      subsections: []
    }
  ];

  const relatedGuides = [
    {
      href: "/guias/otimizacao-performance",
      title: "Otimização de Performance",
      description: "Dicas para deixar seu PC mais rápido."
    },
    {
      href: "/guias/rede-domestica",
      title: "Redes Domésticas",
      description: "Melhore sua conexão WiFi."
    },
    {
      href: "/guias/manutencao-preventiva",
      title: "Manutenção Preventiva",
      description: "Cuidados essenciais com o hardware."
    }
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="10-15 min"
      difficultyLevel="Iniciante"
      contentSections={contentSections}
      relatedGuides={relatedGuides}
    />
  );
}
