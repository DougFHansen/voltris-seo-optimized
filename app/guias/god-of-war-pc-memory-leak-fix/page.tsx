import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "God of War PC: Corrigindo Memory Leak e Quedas de FPS (2026)";
const description = "God of War começa liso e começa a travar depois de 1 hora? Isso é 'Vazamento de Memória'. Veja como configurar as texturas para evitar estourar a VRAM.";
const keywords = ['god of war pc travando', 'god of war memory leak fix', 'god of war pc consome muita ram', 'otimizar god of war pc fraco', 'dlss god of war', 'configuracao original ps4 god of war'];

export const metadata: Metadata = createGuideMetadata('god-of-war-pc-memory-leak-fix', title, description, keywords);

export default function GOWGuide() {
    const summaryTable = [
        { label: "Problema", value: "Memory Leak" },
        { label: "Sintoma", value: "FPS cai com o tempo" },
        { label: "Solução 1", value: "Reiniciar Jogo" },
        { label: "Solução 2", value: "Texturas: Original" }
    ];

    const contentSections = [
        {
            title: "O Problema do Vazamento de Memória (Memory Leak)",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
          O port de God of War para PC tem um bug conhecido: ele não "limpa" a memória da placa de vídeo (VRAM) corretamente quando você muda de área. Depois de 1 ou 2 horas jogando, sua VRAM enche (mesmo se você tiver 12GB) e o jogo começa a usar a RAM do sistema, causando travadas bruscas (stuttering).
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed font-bold text-yellow-500">
            A única solução definitiva é reiniciar o jogo a cada 2 horas.
        </p>
      `,
            subsections: []
        },
        {
            title: "Configurando para Evitar o Estouro",
            content: `
        <p class="mb-4 text-gray-300">
            Se você tem uma placa com 4GB ou 6GB de VRAM (GTX 1650, RTX 2060, RX 580), você PRECISA baixar a qualidade das texturas.
        </p>
        <div class="space-y-4">
            <div class="bg-gray-800 p-4 rounded border-l-4 border-blue-500">
                <strong class="text-white block">Qualidade das Texturas (Texture Quality)</strong>
                <p class="text-gray-300 text-sm">
                    Coloque em <strong>Original</strong> (Equivalente ao PS4).
                    <br/>- "Ultra" e "High" exigem mais de 8GB de VRAM. Se você usar isso em placa de 6GB, vai travar em 10 minutos.
                </p>
            </div>
            <div class="bg-gray-800 p-4 rounded border-l-4 border-green-500">
                <strong class="text-white block">DLSS / FSR</strong>
                <p class="text-gray-300 text-sm">
                    Ative no modo <strong>Qualidade</strong>. Isso renderiza o jogo em 720p/900p e faz upscale. Alivia muito a carga da VRAM.
                </p>
            </div>
        </div>
      `,
            subsections: []
        },
        {
            title: "Dica de Ouro: Reflexos",
            content: `
        <p class="text-gray-300 mb-4">
            Em "Configurações Gráficas Avançadas", procure por <strong>Reflexos</strong>.
        </p>
        <p class="text-gray-300">
            Coloque em <strong>Original</strong> ou Baixo. Kratos não precisa se ver no poça d'água em 4K. Os reflexos do jogo são pesadíssimos.
        </p>
      `
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="10 min"
            difficultyLevel="Iniciante"
            contentSections={contentSections}
            summaryTable={summaryTable}
        />
    );
}
