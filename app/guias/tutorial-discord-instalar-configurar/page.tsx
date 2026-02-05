import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'tutorial-discord-instalar-configurar',
  title: "Discord: Guia Completo de Instalação e Configuração (2026)",
  description: "Quer começar no Discord mas não sabe como configurar? Aprenda a criar servidores, ajustar o áudio para não vazar eco e proteger sua conta com seguranç...",
  category: 'software',
  difficulty: 'Iniciante',
  time: '20 min'
};

const title = "Discord: Guia Completo de Instalação e Configuração (2026)";
const description = "Quer começar no Discord mas não sabe como configurar? Aprenda a criar servidores, ajustar o áudio para não vazar eco e proteger sua conta com segurança.";
const keywords = [
    'como instalar discord no pc tutorial 2026',
    'configurar audio discord sem eco e ruido',
    'como criar servidor de discord profissional 2026',
    'avisos de segurança discord autenticação dois fatores',
    'melhorar qualidade da stream no discord gratis'
];

export const metadata: Metadata = createGuideMetadata('tutorial-discord-instalar-configurar', title, description, keywords);

export default function DiscordGuide() {
    const summaryTable = [
        { label: "Check #1", value: "Ativar Krisp (Supressão de Ruído)" },
        { label: "Check #2", value: "Configurar Tecla de Atalho (Push-to-Talk)" },
        { label: "Segurança", value: "2FA (Autenticação de Dois Fatores)" },
        { label: "Dificuldade", value: "Fácil" }
    ];

    const contentSections = [
        {
            title: "Por que o Discord é essencial para gamers?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Em 2026, o **Discord** é muito mais que um chat de voz. É onde comunidades se reúnem, onde você streama seus jogos para amigos e onde as guilhas se organizam. No entanto, uma configuração mal feita pode resultar em um áudio chiado, invasões de conta ou lag no seu jogo.
        </p>
      `
        },
        {
            title: "1. O Segredo do Áudio Perfeito",
            content: `
        <p class="mb-4 text-gray-300">Não deixe seus amigos ouvirem o barulho do seu ventilador:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Vá em Configurações do Usuário > Voz e Vídeo.</li>
            <li>Em <strong>Supressão de Ruído</strong>, selecione <strong>Krisp</strong>. É a melhor tecnologia de IA para remover barulhos de fundo e cliques de teclado.</li>
            <li>Certifique-se de que o 'Cancelamento de Eco' está ativado se você não estiver usando fone de ouvido.</li>
            <li><strong>Dica:</strong> Use o modo 'Sensibilidade de Entrada Automática' apenas se o seu quarto for silencioso. Caso contrário, use 'Apertar para Falar'.</li>
        </ol>
      `
        },
        {
            title: "2. Protegendo sua Conta (Segurança Máxima)",
            content: `
        <div class="bg-red-900/10 p-5 rounded-xl border border-red-500/30">
            <h4 class="text-red-400 font-bold mb-2">Cuidado com Links:</h4>
            <p class="text-sm text-gray-300">
                O Discord é alvo constante de hackers. <strong>Ative a Autenticação de Dois Fatores (2FA)</strong> em Configurações > Minha Conta. Nunca clique em links que prometem "Discord Nitro Grátis" vindos de desconhecidos; eles roubam sua sessão (Token) e você perde a conta em segundos.
            </p>
        </div>
      `
        },
        {
            title: "3. Otimização para Games (Overlay)",
            content: `
        <p class="mb-4 text-gray-300">
            O **Overlay do Discord** (aquela interface que mostra quem está falando por cima do jogo) pode causar quedas de FPS em PCs fracos. 
            <br/>Se você sentir que o jogo está "pesado" quando está em call, vá em Configurações > Sobreposição de Jogo e desative a opção 'Ativar sobreposição no jogo'.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/discord-otimizar-para-jogos",
            title: "Otimizar Discord",
            description: "Dicas avançadas de performance para FPS."
        },
        {
            href: "/guias/autenticacao-dois-fatores",
            title: "Guia 2FA",
            description: "Entenda por que proteger suas contas."
        },
        {
            href: "/guias/aumentar-volume-microfone-windows",
            title: "Microfone Windows",
            description: "Ajuste o volume do sistema para o Discord."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="20 min"
            difficultyLevel="Iniciante"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
