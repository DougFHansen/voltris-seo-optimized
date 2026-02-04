import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Como Otimizar o Discord para Jogos Online (2026)";
const description = "O Discord está causando lag nos seus jogos? Aprenda a configurar a aceleração de hardware e a sobreposição para ganhar FPS em 2026.";
const keywords = [
    'como otimizar discord para jogos 2026 guia',
    'discord causando queda de fps como resolver tutorial',
    'desativar aceleração de hardware discord 2026',
    'configurar discord para pc fraco guia completo',
    'melhorar qualidade voz discord e reduzir lag 2026'
];

export const metadata: Metadata = createGuideMetadata('discord-otimizar-para-jogos', title, description, keywords);

export default function DiscordOptimizationGuide() {
    const summaryTable = [
        { label: "Grande Vilão", value: "Aceleração de Hardware (GPU)" },
        { label: "Redução de Ruído", value: "Krisp (Pesa no Processador)" },
        { label: "Dica de FPS", value: "Desativar a Sobreposição (Overlay)" },
        { label: "Dificuldade", value: "Fácil" }
    ];

    const contentSections = [
        {
            title: "O Discord e o roubo de performance",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Embora seja a melhor ferramenta de comunicação de 2026, o **Discord** é construído sobre uma plataforma chamada Electron. Isso significa que ele é, na prática, um navegador de internet rodando em segundo plano. Se não for configurado corretamente, ele pode consumir centenas de megabytes de RAM e lutar com o seu jogo pelo uso da sua placa de vídeo.
        </p>
      `
        },
        {
            title: "1. Aceleração de Hardware: O ajuste mestre",
            content: `
        <p class="mb-4 text-gray-300">Este é o ponto que mais afeta o FPS:</p>
        <p class="text-sm text-gray-300">
            Vá em Configurações do Usuário > Avançado > **Aceleração de Hardware**. <br/><br/>
            Se você tem uma placa de vídeo de entrada e joga títulos pesados, **desative** essa opção. Isso fará com que o Windows use o processador para renderizar o Discord, deixando a placa de vídeo 100% livre para o seu jogo. No entanto, se o seu processador for muito fraco e a sua placa for potente, deixe ativado.
        </p>
      `
        },
        {
            title: "2. Overlay e Notificações (Distrações de Performance)",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Ganhe fluidez visual:</h4>
            <p class="text-sm text-gray-300">
                A **Sobreposição de Jogo (Overlay)** é aquela janelinha que mostra quem está falando. Em jogos competitivos como Valorant ou CS2, ela pode causar micro-travamentos (stuttering). <br/><br/>
                Vá em 'Sobreposição de Jogo' e desative-a. Além disso, em 'Notificações', desative todas as animações de entrada e saída. Em 2026, quanto mais limpo o seu Discord estiver rodando, mais suave será o seu gameplay.
            </p>
        </div>
      `
        },
        {
            title: "3. Voz e Áudio em 2026",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>Qualidade sem peso:</strong> 
            <br/><br/>A função **Krisp (Supressão de Ruído)** é mágica, mas usa bastante CPU. Se o seu jogo está sofrendo pra rodar, mude a supressão para 'Padrão' ou desative-a se você mora em um lugar silencioso. Verifique também em 'Voz e Vídeo' se o 'Csubsistema de Áudio' está em Standard; as versões 'Legacy' podem causar conflitos com drivers de áudio modernos no Windows 11.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/aumentar-volume-microfone-windows",
            title: "Ajustar Microfone",
            description: "Melhore sua voz para os amigos ouvirem."
        },
        {
            href: "/guias/limpar-memoria-ram-windows",
            title: "Liberar RAM",
            description: "Reduza o peso do Discord no sistema."
        },
        {
            href: "/guias/reduzir-ping-jogos-online",
            title: "Reduzir Lag",
            description: "Evite robôs na voz e lag nas partidas."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="10 min"
            difficultyLevel="Fácil"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
