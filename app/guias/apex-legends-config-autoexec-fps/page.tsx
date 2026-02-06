import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'apex-legends-config-autoexec-fps',
    title: "Apex Legends (2026): Config, Autoexec e Superglide",
    description: "Otimize o Apex Legends para evitar quedas no Jumpmaster. Configuração de videocfg.txt, autoexec para remover sombras e cap de FPS para estabilidade.",
    category: 'jogos',
    difficulty: 'Avançado',
    time: '50 min'
};

const title = "Apex Legends Optimization (2026): Mantendo 144Hz Constante";
const description = "Apex Legends roda na Source Engine modificada. Ele ama CPU e odeia efeitos de partículas. Domine o 'videoconfig.txt' para ganhar performance.";

const keywords = [
    'apex legends autoexec 2026 fps boost',
    'videoconfig.txt apex legends retirar sombras',
    'superglide config fps cap',
    'apex legends dx12 beta vale a pena',
    'nvidia reflex apex legends',
    'texture streaming budget apex none',
    'adaptive resolution fps target',
    'comandos de inicialização apex steam',
    'reduzir input lag apex legends',
    'spot shadow detail disabled'
];

export const metadata: Metadata = createGuideMetadata('apex-legends-config-autoexec-fps', title, description, keywords);

export default function ApexGuide() {
    const summaryTable = [
        { label: "Texture Stream", value: "None/Very Low" },
        { label: "Model Detail", value: "Low" },
        { label: "Spot Shadow", value: "Disabled (Config)" },
        { label: "Volumetric", value: "Disabled" },
        { label: "Launch Option", value: "-dev -preload" },
        { label: "Reflex", value: "On + Boost" },
        { label: "DX12", value: "Beta (Teste)" }
    ];

    const contentSections = [
        {
            title: "Introdução: A Source Engine no limite",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Apex é pesado. Ele renderiza mapas gigantes com a engine do Titanfall 2.Configurações padrões como "Volumetric Lighting" e "Sun Shadows" matam o FPS.
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed">
            Neste guia, vamos modificar o arquivo <code>videoconfig.txt</code> para desativar sombras que o menu do jogo não permite, garantindo visibilidade e frames altos.
        </p>
      `
        },
        {
            title: "Capítulo 1: Configurações In-Game (O Básico)",
            content: `
        <div class="space-y-4">
             <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-red-500 font-bold mb-1">Texture Streaming Budget</h4>
                <p class="text-white font-mono text-sm mb-2">Recomendado: <span class="text-emerald-400">None ou Very Low (2GB)</span></p>
                <p class="text-gray-400 text-xs">
                    Isso reserva VRAM para texturas. Se você colocar High (6GB) e sua GPU tiver 6GB, o jogo vai engasgar quando o Windows precisar de VRAM. Deixe em None/Very Low para garantir que nunca falte VRAM para o frame buffer. A textura fica feia, mas o jogo roda liso.
                </p>
            </div>
             <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-red-500 font-bold mb-1">Volumetric Lighting</h4>
                <p class="text-white font-mono text-sm mb-2">Recomendado: <span class="text-emerald-400">Disabled</span></p>
                <p class="text-gray-400 text-xs">A luz do sol passando pela poeira. Lindo, mas cega você e come 20 FPS. Desligue.</p>
            </div>
             <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-red-500 font-bold mb-1">Model Detail</h4>
                <p class="text-white font-mono text-sm mb-2">Recomendado: <span class="text-emerald-400">Low</span></p>
                <p class="text-gray-400 text-xs">Reduz a complexidade geométrica de objetos distantes. Essencial para estabilidade.</p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: videoconfig.txt (Hack de Sombras)",
            content: `
        <p class="mb-4 text-gray-300">
            O menu não deixa desligar tudo. Vamos editar o arquivo:
            <br/><code>%userprofile%\\Saved Games\\Respawn\\Apex\\local\\videoconfig.txt</code>
        </p>
        <div class="bg-black/50 p-4 rounded font-mono text-xs text-gray-300 overflow-x-auto">
            "setting.csm_enabled"       "0"   // (Desativa sombras do sol - Cascaded Shadow Maps)<br/>
            "setting.csm_coverage"      "0"<br/>
            "setting.csm_cascade_res"   "16"  // (Mínimo possível)<br/>
            "setting.r_lod_switch_scale" "0.6" // (Reduz distância de renderização de objetos pequenos)<br/>
            "setting.bnao_enabled"       "0"   // (Desativa Ambient Occlusion no nível baixo)
        </div>
        <p class="mt-2 text-xs text-red-400">
            <strong>Importante:</strong> Após salvar, clique com botão direito no arquivo > Propriedades > Marque <strong>"Somente Leitura"</strong>. Se não fizer isso, o Apex reseta tudo ao abrir.
        </p>
      `
        },
        {
            title: "Capítulo 3: Autoexec e Launch Options",
            content: `
        <p class="mb-4 text-gray-300">
            Na Steam/EA App > Propriedades do Jogo > Opções de Inicialização:
        </p>
        <code class="block bg-black/50 p-3 rounded text-green-400 font-mono text-sm mb-3">
            -dev -preload -fullscreen -refresh 144 -forcenovsync
        </code>
        <ul class="list-disc list-inside text-gray-400 text-xs space-y-2">
            <li><strong>-dev:</strong> Remove a animação de intro (barulhenta).</li>
            <li><strong>-preload:</strong> Tenta pré-carregar assets na RAM (ajuda em HDs, cuidado em PCs com pouca RAM).</li>
            <li><strong>-refresh 144:</strong> Força os Hz (mude para o seu monitor).</li>
        </ul>
        <p class="mt-4 text-gray-300">
            <strong>Autoexec.cfg:</strong> A Respawn bloqueou a maioria dos comandos cfgs em 2021. Hoje em dia, cfg foca mais em binds (Superglide) do que gráficos.
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: DX12 Beta",
            content: `
        <p class="mb-4 text-gray-300">
            O Apex lançou suporte a DirectX 12 (Beta).
            <br/>Adicione <code>-eac_launcher_settings SettingsDX12.json</code> nas launch options.
            <br/><strong>Veredito 2026:</strong> O DX12 usa melhor múltiplos núcleos da CPU. Se você tem uma GPU AMD ou RTX 4000 e sofre com gargalo de CPU, o DX12 pode aumentar seu FPS mínimo (1% lows) e deixar o jogo mais liso, apesar do FPS máximo mudar pouco. Vale testar.
        </p>
      `
        },
        {
            title: "Capítulo 5: Superglide e FPS Cap",
            content: `
        <p class="mb-4 text-gray-300">
            Superglide é uma mecânica de movimento que depende do FPS. É mais fácil acertar o timing com FPS baixo.
            <br/>Alguns pros travam o FPS em valores específicos (ex: 144 ou 180) via RivaTuner ou comando <code>+fps_max 144</code> para garantir consistência no movimento. Não deixe ilimitado se oscilar muito.
        </p>
      `
        },
        {
            title: "Capítulo 6: Nvidia Reflex",
            content: `
        <p class="mb-4 text-gray-300">
            Como sempre, <strong>On + Boost</strong>.
            <br/>O Apex tem latência de sistema naturalmente alta. O Reflex é mandatório.
            <br/>Se você tiver AMD, ative o <strong>Radeon Anti-Lag</strong> no driver (não tem opção no jogo).
        </p>
      `
        },
        {
            title: "Capítulo 7: FOV e Performance",
            content: `
        <p class="mb-4 text-gray-300">
            Quase todo pro usa FOV 104 ou 110.
            <br/>FOV alto = Mais visão periférica, mas os inimigos ficam menores (mais difícil de mirar) e o FPS cai um pouco (renderiza mais coisas).
            <br/>Se não consegue ver o inimigo, tente abaixar o FOV para 104 ou 100.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 8: Áudio (PC Equalizer)",
            content: `
            <p class="mb-4 text-gray-300">
                O áudio do Apex é famoso por ser "quebrado" (passos silenciosos).
                <br/>Não confie no jogo. Use um equalizador externo (Equalizer APO) para aumentar frequências agudas (4k-8k Hz) onde os passos e recargas acontecem.
            </p>
            `
        },
        {
            title: "Capítulo 9: Adaptive Resolution (FPS Target)",
            content: `
            <p class="mb-4 text-gray-300">
                O Apex tem "Adaptive Resolution FPS Target". Coloque em 0 (Desligado).
                <br/>Se ligar, o jogo vai borrar a tela toda vez que o FPS cair, tornando impossível mirar. É melhor cair FPS com imagem nítida do que manter FPS com imagem pixelada.
            </p>
            `
        },
        {
            title: "Capítulo 10: Limpeza de Arquivos Temporários",
            content: `
            <p class="mb-4 text-gray-300">
                A cada temporada, o Apex acumula lixo.
                <br/>Faça uma "Reparação" do jogo na Steam/EA App a cada update grande para verificar a integridade dos arquivos e remover assets duplicados.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Stretched Resolution no Apex?",
            answer: "Funciona, mas é complexo. As barras pretas aparecem a menos que você crie uma resolução customizada no painel da GPU e coloque 'Autoexec commands' para forçar o aspect ratio. Muitos pros usam 1680x1050 (16:10 stretched) para bonecos mais largos."
        },
        {
            question: "Micrófone ruim no Apex?",
            answer: "O Voice Chat do Apex tem codec de baixa qualidade. Aumente o 'Open Mic Threshold' para não captar seu teclado mecânico, pois o jogo não tem noise suppression bom."
        },
        {
            question: "Crash DXGI_ERROR_DEVICE_HUNG?",
            answer: "Geralmente é overclock instável da GPU ou driver ruim. Remova qualquer overclock, volte o driver para uma versão 'Studio' estável ou use o modo Debug no Painel Nvidia."
        }
    ];

    const externalReferences = [
        { name: "Apex Legends Status (Server Lag)", url: "https://apexlegendsstatus.com/" },
        { name: "ProSettings Apex", url: "https://prosettings.net/apex-legends/" },
        { name: "Respawn Trello (Bug Tracker)", url: "https://trello.com/b/ZVrHV38P/apex-tracker" }
    ];

    const relatedGuides = [
        {
            href: "/guias/nvidia-painel-controle-melhores-configuracoes",
            title: "Nvidia Guide",
            description: "Ajuste o VSync aqui."
        },
        {
            href: "/guias/internet-lenta-jogos-lag",
            title: "Rede",
            description: "O Apex precisa de uma rota limpa."
        },
        {
            href: "/guias/como-escolher-mouse-gamer",
            title: "Mouse",
            description: "Tracking é tudo no Apex."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="50 min"
            difficultyLevel="Avançado"
            contentSections={contentSections}
            advancedContentSections={advancedContentSections}
            additionalContentSections={additionalContentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
            faqItems={faqItems}
            externalReferences={externalReferences}
        />
    );
}
