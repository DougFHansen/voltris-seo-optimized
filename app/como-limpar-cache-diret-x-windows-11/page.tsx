import React from 'react';
import { GuideTemplateClient } from '@/components/GuideTemplateClient';

export default function LimparDirectX() {
    const title = 'Como Limpar o Cache do DirectX no Windows 11 (2026)';
    const description = 'Seus jogos estão travando sem motivo? Aprenda a limpar o cache de shaders do DirectX (DX11/DX12) no Windows 11 para eliminar o stuttering e melhorar a estabilidade gráfica.';
    const keywords = ['como limpar cache diret x windows 11', 'limpar shaders directx 12 windows', 'corrigir stuttering jogos windows 11', 'voltris ultra cleaner directx', 'apagar cache de gráficos windows', 'resetar directx shader cache'];

    const summaryTable = [
        { label: "O Inimigo", value: "Cache de Shaders Corrompido" },
        { label: "Maior Benefício", value: "Fim dos Engasgos em Novos Jogos" },
        { label: "Técnica Chave", value: "Disk Cleanup Legacy Shaders" },
        { label: "Resultado Esperado", value: "Gráficos Puros e Sem Stuttering" }
    ];

    const contentSections = [
        {
            title: "Por que limpar o cache do DirectX?",
          content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O DirectX (DX11, DX12) é o canal de comunicação entre o seu jogo e a sua placa de vídeo. Para acelerar o carregamento, o Windows cria um 'banco de dados' de shaders pré-processados. Quando você atualiza o driver ou o jogo, esse banco de dados antigo torna-se inútil e começa a causar conflitos, gerando o famoso <b>Stuttering</b>.
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed">
            Muitos jogadores atribuem o travamento ao hardware fraco, mas, na verdade, o culpado é o Windows 11 'lendo' shaders zumbis que não batem mais com a versão atual da API do jogo.
        </p>
        
        <div class="bg-blue-500/10 border border-blue-500/30 p-6 rounded-2xl my-6">
            <h4 class="text-[#31A8FF] font-black mb-2 flex items-center gap-2">Limpeza via Limpeza de Disco Nativa</h4>
            <p class="text-gray-300 text-sm">
                O Windows 11 possui uma opção escondida na ferramenta 'Limpeza de Disco' chamada <b>Cache do Sombreador do DirectX</b>. Ativá-la periodicamente garante que o driver gráfico reconstrua apenas o que é estritamente necessário para o seu hardware atual.
            </p>
        </div>
      `
        },
        {
            title: "A Diferença entre DX11 e DX12 no Cache",
            content: `
        <p class="mb-4 text-gray-300">
            A API DirectX 12 é muito mais agressiva no uso de shaders. Ao limpar o cache, você forçará uma pequena re-compilação na próxima vez que abrir o jogo. Isso garantirá que o seu processador não tente carregar arquivos corrompidos que levam a <b>Crashes de driver (TDR Errors)</b> no meio da partida.
        </p>
      `
        },
        {
            title: "Otimização Avançada com o Voltris Ultra Cleaner",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
            O **Voltris Optimizer** lida com os shaders através da ferramenta <code>Ultra Hardware Diagnostics & Cleanup</code>.
        </p>
        <ul class="space-y-4 text-slate-300">
            <li class="flex items-start gap-3"><div class="w-2 h-2 rounded-full bg-[#10b981] mt-1.5 shrink-0"></div> **Deep Graphics Reset:** Um clique para resetar os pipelines de vídeo sem precisar reinstalar drivers.</li>
            <li class="flex items-start gap-3"><div class="w-2 h-2 rounded-full bg-[#10b981] mt-1.5 shrink-0"></div> **VRAM Management:** Limpa os registros de vídeo residuais que ocupam espaço desnecessário no seu chip gráfico.</li>
            <li class="flex items-start gap-3"><div class="w-2 h-2 rounded-full bg-[#10b981] mt-1.5 shrink-0"></div> **Shader Affinity:** Calibra a entrega de CPU para a compilação inicial de shaders, tornando o primeiro boot do jogo muito mais rápido.</li>
        </ul>
      `
        }
    ];

    const faqItems = [
        {
            question: "Limpando o cache, eu perco qualidade de imagem?",
            answer: "Absolutamente não! A qualidade de imagem é definida pelas configurações do jogo. A limpeza do cache apenas garante que o motor gráfico use os arquivos mais puros para renderizar as texturas."
        },
        {
            question: "O Voltris limpa o cache de jogos da Steam também?",
            answer: "Sim, nossa ferramenta de limpeza é universal e detecta as pastas de cache de shaders de todos os principais sistemas de distribuição de jogos e drivers gráficos do mercado."
        }
    ];

    const relatedGuides = [
        { href: "/como-limpar-cache-nvidia-windows-11", title: "Cache NVIDIA", description: "Otimizações exclusivas para usuários NVIDIA." },
        { href: "/melhores-tweaks-performance-windows-11", title: "Tweaks Gerais", description: "Outros ajustes técnicos para turbinar seu sistema." }
    ];

    return (
        <GuideTemplateClient
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="10 min"
            difficultyLevel="Intermediário"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
            faqItems={faqItems}
            showVoltrisOptimizerCTA={true}
            keyPoints={[
                "Diferenciar compilação de shader e carregamento de textura",
                "Gestão profissional de cache DirectX (DX11/DX12)",
                "Limpeza absoluta de registros de gráficos e logs de drivers",
                "Otimização de agendamento de GPU para compilação rápida",
                "Fim dos micro-travamentos gerados por shaders antigos"
            ]}
        />
    );
}
