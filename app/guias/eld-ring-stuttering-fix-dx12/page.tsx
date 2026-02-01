import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Elden Ring Stuttering Fix: Corrigindo as Travadas no PC (DX12) (2026)";
const description = "Elden Ring roda a 60 FPS e trava do nada? O problema é a compilação de shaders e o Easy Anti-Cheat. Veja como jogar offline para ter performance lisa.";
const keywords = ['elden ring stuttering fix', 'elden ring travando pc 2026', 'como desativar easy anti cheat elden ring', 'jogar elden ring offline fps', 'dx12 shader cache elden ring', 'shadow of the erdtree fps fix'];

export const metadata: Metadata = createGuideMetadata('eld-ring-stuttering-fix-dx12', title, description, keywords);

export default function EldenRingGuide() {
    const summaryTable = [
        { label: "Problema", value: "Shader Compilation" },
        { label: "Solução 1", value: "Cache Ilimitado" },
        { label: "Solução 2", value: "Offline (Sem EAC)" },
        { label: "DLC", value: "Shadow of the Erdtree" }
    ];

    const contentSections = [
        {
            title: "Por que Elden Ring trava tanto?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
          A FromSoftware usa uma engine antiga (basicamente a mesma de Dark Souls 3) forçada a rodar em DirectX 12. Isso cria "travadas de compilação de shader". Toda vez que um efeito novo aparece na tela (um dragão cuspindo fogo), o jogo pausa por milissegundos para "aprender" aquele efeito.
        </p>
      `,
            subsections: []
        },
        {
            title: "Solução 1: Shader Cache Ilimitado (NVIDIA)",
            content: `
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4 mb-6">
            <li>Clique com botão direito na Área de Trabalho > <strong>Painel de Controle da NVIDIA</strong>.</li>
            <li>Gerenciar as configurações em 3D.</li>
            <li>Procure por <strong>Tamanho do Cache de Shader (Shader Cache Size)</strong>.</li>
            <li>Mude para <strong>Ilimitado (Unlimited)</strong> ou <strong>10 GB</strong>.</li>
            <li>Isso impede que o Windows apague os shaders que o jogo já aprendeu, evitando que ele trave de novo no mesmo lugar amanhã.</li>
        </ol>
      `,
            subsections: []
        },
        {
            title: "Solução 2: Jogar Offline (Sem Easy Anti-Cheat)",
            content: `
        <p class="mb-4 text-gray-300">
            O Easy Anti-Cheat (EAC) fica escaneando seu PC enquanto você joga, o que causa soluços na CPU. Se você não liga para invadir/ser invadido (PvP) e mensagens no chão, jogue offline.
        </p>
        <div class="bg-gray-800 p-6 rounded-xl border border-red-500 mb-6">
            <h4 class="text-white font-bold mb-2">Como Desativar o EAC (Modo Offline)</h4>
            <ol class="list-decimal list-inside text-gray-300 text-sm ml-4">
                <li>Vá na pasta do jogo (Steam > Gerenciar > Navegar pelos arquivos locais).</li>
                <li>Entre na pasta <strong>Game</strong>.</li>
                <li>Renomeie o arquivo <code>start_protected_game.exe</code> para <code>start_protected_game_original.exe</code>.</li>
                <li>Copie o arquivo <code>eldenring.exe</code> e cole na mesma pasta.</li>
                <li>Renomeie a CÓPIA para <code>start_protected_game.exe</code>.</li>
                <li>Inicie o jogo pela Steam.</li>
            </ol>
            <p class="text-gray-300 text-sm mt-2">
                O jogo vai abrir sem o EAC. O menu dirá "Atividade online inapropriada detectada" e entrará em modo Offline. Sua performance vai melhorar muito.
            </p>
        </div>
      `,
            subsections: []
        },
        {
            title: "Dica para o DLC Shadow of the Erdtree",
            content: `
        <p class="text-gray-300">
            A área do DLC é graficamente mais pesada. Reduza a "Qualidade da Grama" e "Sombras" para Médio se estiver caindo abaixo de 60 FPS lá.
        </p>
      `
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="15 min"
            difficultyLevel="Avançado"
            contentSections={contentSections}
            summaryTable={summaryTable}
        />
    );
}
