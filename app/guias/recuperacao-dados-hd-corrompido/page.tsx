import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'recuperacao-dados-hd-corrompido',
  title: "Recuperação de Dados: Como salvar arquivos de um HD Corrompido",
  description: "Seu HD parou de aparecer no Windows ou pede para formatar? Aprenda as técnicas de recuperação de fotos e documentos usando ferramentas profissionais (...",
  category: 'windows-geral',
  difficulty: 'Avançado',
  time: '2 horas'
};

const title = "Recuperação de Dados: Como salvar arquivos de um HD Corrompido";
const description = "Seu HD parou de aparecer no Windows ou pede para formatar? Aprenda as técnicas de recuperação de fotos e documentos usando ferramentas profissionais (sem pagar nada).";
const keywords = [
    'como recuperar arquivos de hd corrompido 2026',
    'hd pedindo para formatar como recuperar arquivos tutorial',
    'melhor programa de recuperação de dados gratis 2026',
    'recuperar fotos de sd card ou pendrive corrompido',
    'recuva vs r-studio qual o melhor para recuperar dados'
];

export const metadata: Metadata = createGuideMetadata('recuperacao-dados-hd-corrompido', title, description, keywords);

export default function DataRecoveryGuide() {
    const summaryTable = [
        { label: "Ferramenta #1", value: "Recuva (Facilidade)" },
        { label: "Ferramenta #2", value: "PhotoRec (Poder / Open Source)" },
        { label: "Atitude Vital", value: "NÃO escreva dados novos no disco" },
        { label: "Dificuldade", value: "Alta" }
    ];

    const contentSections = [
        {
            title: "A regra de ouro da Recuperação",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O maior erro ao tentar recuperar dados é continuar usando o disco. Quando um arquivo é deletado ou o índice corrompe, os bytes físicos ainda estão lá, mas marcados como "vazios". Se você instalar um programa de recuperação <strong>no mesmo disco</strong> que quer salvar, você pode sobrescrever seus próprios dados e perdê-los para sempre.
        </p>
      `
        },
        {
            title: "1. O comando CHKDSK (Primeira Tentativa)",
            content: `
        <p class="mb-4 text-gray-300">Se o disco aparece mas não abre, tente o reparo logico:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Abra o Prompt de Comando (CMD) como Administrador.</li>
            <li>Digite: <code>chkdsk D: /f</code> (substitua D pela letra do seu disco).</li>
            <li>Este comando tenta consertar a "tabela de conteúdo" do HD. Se funcionar, seus arquivos voltarão sem precisar de softwares extras.</li>
            <li><strong>Aviso:</strong> Se o HD estiver fazendo barulhos metálicos (cliques), <strong>NAO</strong> rode este comando; leve imediatamente a um profissional.</li>
        </ol>
      `
        },
        {
            title: "2. PhotoRec: O Escavador Digital",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Poder Bruto:</h4>
            <p class="text-sm text-gray-300">
                O <strong>PhotoRec</strong> ignora o sistema de arquivos completamente e lê os dados brutos. Ele não recupera os nomes dos arquivos (viram códigos como f12345.jpg), mas ele recupera o conteúdo de quase qualquer coisa: pendrives queimados, SD cards de câmeras e HDs que dão erro de E/S. É gratuito e o mais eficaz da categoria.
            </p>
        </div>
      `
        },
        {
            title: "3. Quando desistir e procurar um laboratório?",
            content: `
        <p class="mb-4 text-gray-300">
            Se o disco não gira, não é reconhecido na BIOS ou faz barulhos de arranhado, nenhum software do mundo vai ajudar. O problema é físico (cabeça de leitura ou motor). Nesses casos, abrir o HD em casa significa destruí-lo. O pó do ar no seu quarto é como pedras para os discos magnéticos internos. Use empresas especializadas se os dados valerem o investimento.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/verificar-saude-hd-ssd-crystaldiskinfo",
            title: "Saúde do Disco",
            description: "Saiba se seu HD vai falhar de novo."
        },
        {
            href: "/guias/backup-dados",
            title: "Guia de Backup",
            description: "Nunca mais precise deste guia."
        },
        {
            href: "/guias/hds-vs-ssd-qual-a-diferenca",
            title: "HD vs SSD",
            description: "Entenda a durabilidade de cada tecnologia."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="2 horas"
            difficultyLevel="Avançado"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
