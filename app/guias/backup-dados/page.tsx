import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Estratégias de Backup de Dados: A Regra 3-2-1";
const description = "Não espere perder tudo para se preocupar. Aprenda a estratégia profissional de backup 3-2-1 e proteja fotos, documentos e arquivos importantes.";
const keywords = ["backup dados","nuvem vs hd externo","segurança dados","onedrive google drive","ransomware"];

export const metadata: Metadata = createGuideMetadata('backup-dados', title, description, keywords);

export default function GuidePage() {
  const contentSections = [

    {
      title: "A Regra de Ouro: 3-2-1",
      content: `
        <p class="mb-4 text-gray-300">Profissionais de TI seguem este mantra para garantir que dados nunca sejam perdidos, mesmo em catástrofes:</p>
          <div class="space-y-3">
            <div class="flex items-center gap-3 bg-[#1E1E22] p-3 rounded">
              <span class="text-3xl font-bold text-[#31A8FF]">3</span>
              <p class="text-gray-300 text-sm">Tenha <strong>TRÊS</strong> cópias dos seus dados (1 original + 2 backups).</p>
            </div>
            <div class="flex items-center gap-3 bg-[#1E1E22] p-3 rounded">
              <span class="text-3xl font-bold text-[#31A8FF]">2</span>
              <p class="text-gray-300 text-sm">Armazene em <strong>DUAS</strong> mídias diferentes (ex: HD Externo e Nuvem).</p>
            </div>
            <div class="flex items-center gap-3 bg-[#1E1E22] p-3 rounded">
              <span class="text-3xl font-bold text-[#31A8FF]">1</span>
              <p class="text-gray-300 text-sm">Mantenha <strong>UMA</strong> cópia fora do local (Offsite/Nuvem) para proteger contra incêndio/roubo.</p>
            </div>
          </div>
      `,
      subsections: []
    },

    {
      title: "Ferramentas Automáticas",
      content: `
        <p class="mb-4 text-gray-300">Backup manual você esquece de fazer. Use automação:</p>
          <ul class="list-disc list-inside text-gray-300 text-sm space-y-2">
            <li><strong>OneDrive/Google Drive:</strong> Configure para sincronizar automaticamente as pastas "Documentos" e "Imagens".</li>
            <li><strong>Veeam Agent Free:</strong> Ferramenta profissional gratuita para fazer imagem completa do PC para um HD Externo.</li>
            <li><strong>Histórico de Arquivos (Windows):</strong> Recurso nativo que faz backup horário para um drive externo.</li>
          </ul>
      `,
      subsections: []
    },

    {
      title: "O Perigo do Ransomware",
      content: `
        <div class="bg-red-900/20 border border-red-500/30 p-4 rounded text-sm text-gray-300">
            Vírus de sequestro de dados (Ransomware) podem criptografar seu HD externo se ele estiver conectado na hora da infecção. Por isso, o backup em nuvem (com versionamento) é sua única salvação real contra hackers.
          </div>
      `,
      subsections: []
    }
  ];

  const relatedGuides = [
    {
      href: "/guias/manutencao-preventiva",
      title: "Manutenção Preventiva",
      description: "Proteja seu hardware."
    },
    {
      href: "/guias/seguranca-digital",
      title: "Segurança Digital",
      description: "Proteja seus dados."
    },
    {
      href: "/guias/otimizacao-performance",
      title: "Performance",
      description: "Deixe seu PC mais rápido."
    }
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="20 min"
      difficultyLevel="Intermediário"
      contentSections={contentSections}
      relatedGuides={relatedGuides}
    />
  );
}
