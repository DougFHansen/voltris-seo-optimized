import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Guia de Backup de Dados: A Regra 3-2-1 (2026)";
const description = "Saiba como fazer backup profissional dos seus dados. Aprenda a regra 3-2-1 e evite perder suas fotos e documentos em 2026.";
const keywords = [
  'guia completo backup de dados pc 2026',
  'o que é regra de backup 3-2-1 tutorial 2026',
  'como fazer backup de arquivos windows 11 guia',
  'backup em hd externo vs nuvem comparativo 2026',
  'melhores softwares de backup gratuito windows 11'
];

export const metadata: Metadata = createGuideMetadata('backup-dados', title, description, keywords);

export default function DataBackupGuide() {
  const summaryTable = [
    { label: "Hardware Recomendado", value: "HD Externo (Cold Store) / SSD (Fast Store)" },
    { label: "Software Sugerido", value: "Macrium Reflect / Veeam Free" },
    { label: "Frequência", value: "Semanal ou quinzenal" },
    { label: "Dificuldade", value: "Médio" }
  ];

  const contentSections = [
    {
      title: "Quem tem um, não tem nenhum",
      content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          No mundo da tecnologia em 2026, existem dois tipos de pessoas: as que já perderam dados e as que ainda vão perder. Um SSD pode queimar por um pico de energia, um notebook pode ser molhado ou um vírus pode criptografar tudo. Ter uma estratégia de backup não é opcional para quem trabalha ou guarda memórias digitais importantes no PC.
        </p>
      `
    },
    {
      title: "1. A Regra de Ouro: Backup 3-2-1",
      content: `
        <p class="mb-4 text-gray-300">Este é o padrão profissional de segurança em 2026:</p>
        <ul class="list-disc list-inside text-gray-300 space-y-3">
            <li><strong>3 Cópias de cada arquivo:</strong> A original e mais duas cópias de segurança.</li>
            <li><strong>2 Mídias Diferentes:</strong> Por exemplo, uma no seu PC e outra em um HD Externo.</li>
            <li><strong>1 Cópia Offline (Fora de casa):</strong> Geralmente, esta é a cópia na <strong>Nuvem</strong>.</li>
        </ul >
      `
    },
    {
      title: "2. Backup de Imagem do Sistema",
      content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Clone do seu Windows:</h4>
            <p class="text-sm text-gray-300">
                Backup de dados (copiar fotos e docs) é diferente de **Backup de Imagem**. <br/><br/>
                Ao criar uma imagem do sistema com ferramentas como o <strong>Macrium Reflect</strong>, você salva exatamente como o Windows está agora (programas, configurações e drivers). Se o seu Windows corromper completamente, em 15 minutos você restaura a imagem e volta a trabalhar como se nada tivesse acontecido.
            </p>
        </div>
      `
    },
    {
      title: "3. O "Backup Frio" (Cold Backup)",
      content: `
        <p class="mb-4 text-gray-300">
            <strong>Proteção contra Ransomware:</strong> 
            <br/><br/>Um backup que está sempre conectado ao PC (como um HD Externo plugado 24h) pode ser infectado junto com o computador. Em 2026, a prática do **Cold Backup** é vital: conecte seu drive de backup uma vez por semana, faça a cópia e **remova o cabo fisicamente**. O que não está conectado não pode ser apagado por hackers.
        </p>
      `
    }
  ];

  const relatedGuides = [
    {
      href: "/guias/backup-automatico-nuvem",
      title: "Backup na Nuvem",
      description: "A terceira camada da regra 3-2-1."
    },
    {
      href: "/guias/protecao-ransomware",
      title: "Evitar Sequestro",
      description: "Como os backups salvam você de vírus."
    },
    {
      href: "/guias/verificar-saude-hd-ssd-crystaldiskinfo",
      title: "Saúde do Disco",
      description: "Veja se o seu drive de backup está morrendo."
    }
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="30 min"
      difficultyLevel="Médio"
      contentSections={contentSections}
      summaryTable={summaryTable}
      relatedGuides={relatedGuides}
    />
  );
}
