import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 're-size-bar-ativar-pc-gamer',
  title: "Como ativar o Re-Size BAR para ganhar FPS no PC Gamer (2026)",
  description: "Quer mais performance na sua RTX ou RX? Aprenda como ativar o Resizable BAR na BIOS e no Windows para tirar o gargalo da sua GPU em 2026.",
  category: 'windows-geral',
  difficulty: 'Avançado',
  time: '20 min'
};

const title = "Como ativar o Re-Size BAR para ganhar FPS no PC Gamer (2026)";
const description = "Quer mais performance na sua RTX ou RX? Aprenda como ativar o Resizable BAR na BIOS e no Windows para tirar o gargalo da sua GPU em 2026.";
const keywords = [
    'como ativar re-size bar nvidia amd 2026 tutorial',
    'resizable bar vale a pena para jogos guia',
    'ganhar fps com re-size bar tutorial passo a passo',
    'ativar above 4g decoding bios tutorial 2026',
    'verificar se resizable bar esta ativo windows 11 guide'
];

export const metadata: Metadata = createGuideMetadata('re-size-bar-ativar-pc-gamer', title, description, keywords);

export default function ResizableBarGuide() {
    const summaryTable = [
        { label: "O que faz", value: "Dá à CPU acesso total à memória da GPU (VRAM)" },
        { label: "Ganhos em FPS", value: "5% a 12% (Em jogos modernos)" },
        { label: "Requisito Hardware", value: "RTX 30+ / RX 6000+ / CPUs Ryzen 3000+ ou Intel 10ª+" },
        { label: "Dificuldade", value: "Avançado" }
    ];

    const contentSections = [
        {
            title: "O que é o Resizable BAR?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Tradicionalmente, o seu processador (CPU) só conseguia acessar pequenos blocos (256MB) da memória da sua placa de vídeo por vez. O **Resizable BAR (Re-Size BAR)** quebra esse limite, permitindo que a CPU veja e gerencie toda a VRAM da placa de vídeo simultaneamente. Em 2026, com jogos usando 12GB ou mais de texturas, esse recurso é essencial para evitar stuttering e aumentar as taxas mínimas de quadros.
        </p>
      `
        },
        {
            title: "1. Requisitos para Ativação em 2026",
            content: `
        <p class="mb-4 text-gray-300">Não é todo PC que suporta, você precisa de:</p>
        <ul class="list-disc list-inside text-gray-300 space-y-3">
            <li><strong>GPU:</strong> NVIDIA GeForce RTX 30 Series ou superior / AMD Radeon RX 6000 ou superior.</li>
            <li><strong>Processador:</strong> AMD Ryzen 3000 (Zen 2) ou Intel 10ª Geração ou superior.</li>
            <li><strong>BIOS:</strong> Deve estar em modo **UEFI** (O modo CSM deve estar desativado).</li>
        </ul >
      `
        },
        {
            title: "2. Passo a Passo na BIOS",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Configuração na Placa-mãe:</h4>
            <p class="text-sm text-gray-300">
                1. Reinicie o PC e entre na BIOS (geralmente tecla Del ou F2). <br/>
                2. Vá nas configurações avançadas de PCI ou IO. <br/>
                3. Ative a opção <strong>Above 4G Decoding</strong>. <br/>
                4. Ative a opção <strong>Re-Size BAR Support</strong> (pode aparecer como Smart Access Memory em placas AMD). <br/>
                5. Salve e reinicie. O Windows 11 agora terá acesso total à placa.
            </p>
        </div>
      `
        },
        {
            title: "3. Como verificar se deu certo?",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>Check final no Windows:</strong> 
            <br/><br/>Abra o <strong>Painel de Controle da NVIDIA</strong>, clique em 'Informações do Sistema' no canto inferior esquerdo. Na lista de detalhes, procure por 'Resizable BAR'. Se disser 'Sim', você concluiu o processo com sucesso. Para usuários AMD, o software <strong>Adrenalin</strong> mostrará 'Smart Access Memory: Enabled' na aba de Desempenho.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/atualizacao-drivers-video",
            title: "Drivers de Vídeo",
            description: "Você precisa dos drivers mais recentes para suporte ao BAR."
        },
        {
            href: "/guias/atualizar-bios-seguro",
            title: "Atualizar BIOS",
            description: "Se a opção não aparecer, sua BIOS pode estar velha."
        },
        {
            href: "/guias/aceleracao-hardware-gpu-agendamento",
            title: "Agendamento GPU",
            description: "Combine com o HAGS para performance máxima."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="20 min"
            difficultyLevel="Avançado"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
