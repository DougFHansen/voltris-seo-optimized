import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'gta-v-err-gfx-d3d-init-crash',
  title: "GTA V: Erro ERR_GFX_D3D_INIT (Como Resolver em 2026)",
  description: "Seu GTA V trava com a mensagem 'ERR_GFX_D3D_INIT'? Aprenda a corrigir este erro clássico resetando o DirectX e limpando os arquivos do jogo.",
  category: 'games-fix',
  difficulty: 'Iniciante',
  time: '15 min'
};

const title = "GTA V: Erro ERR_GFX_D3D_INIT (Como Resolver em 2026)";
const description = "Seu GTA V trava com a mensagem 'ERR_GFX_D3D_INIT'? Aprenda a corrigir este erro clássico resetando o DirectX e limpando os arquivos do jogo.";
const keywords = [
    'como resolver err_gfx_d3d_init gta v 2026',
    'gta v fechando sozinho erro directx fix',
    'crash gta v epic games steam err_gfx_d3d_init',
    'resetar configurações graficas gta v comando',
    'erro de inicialização gpu gta v windows 11'
];

export const metadata: Metadata = createGuideMetadata('gta-v-err-gfx-d3d-init-crash', title, description, keywords);

export default function GTAVCrashGuide() {
    const summaryTable = [
        { label: "O que é", value: "Falha na comunicação com a API DirectX" },
        { label: "Solução #1", value: "Mudar DirectX para 10 ou 10.1 no Menu" },
        { label: "Solução #2", value: "Resetar arquivo settings.xml" },
        { label: "Check Vital", value: "Reinstalar DirectX Web Installer" },
        { label: "Dificuldade", value: "Fácil" }
    ];

    const contentSections = [
        {
            title: "Por que esse erro acontece?",
            content: `
        <p class="mb-6 text-gray-700 leading-relaxed text-lg">
          O erro **ERR_GFX_D3D_INIT** ocorre quando a placa de vídeo para de responder ao jogo por um milissegundo. Isso pode ser causado por um overclock instável, drivers corrompidos ou, mais comumente, uma falha na transição de shaders do DirectX 11. Em 2026, com placas ultra rápidas, o GTA V às vezes "se perde" ao tentar inicializar certas rotinas gráficas.
        </p>
      `
        },
        {
            title: "1. Mudando a Versão do DirectX",
            content: `
        <p class="mb-4 text-gray-700">Se você consegue abrir o jogo até o menu principal:</p>
        <ol class="list-decimal list-inside text-gray-700 space-y-3">
            <li>Vá em Configurações > Gráficos.</li>
            <li>Procure pela opção <strong>'Versão do DirectX'</strong>.</li>
            <li>Se estiver em 11, mude para <strong>10.1 ou 10</strong>.</li>
            <li>Reinicie o jogo. Isso resolve o problema para 80% dos jogadores, perdendo quase nada de qualidade visual.</li>
        </ol>
      `
        },
        {
            title: "2. Resetando as Configurações Externamente",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h class="text-gray-900 font-bold mb-2">Se o jogo nem abre:</h4>
            <p class="text-sm text-gray-700">
                1. Vá na pasta <code>Documentos / Rockstar Games / GTA V</code>. <br/>
                2. Delete o arquivo <strong>settings.xml</strong>. <br/>
                3. Ao abrir o jogo novamente, ele criará um novo arquivo com as configurações padrão. <br/>
                <strong>Dica:</strong> Se o problema persistir, abra o arquivo settings.xml com o bloco de notas e altere o valor de <code>DX_Version value="2"</code> para <code>value="0"</code>.
            </p>
        </div>
      `
        },
        {
            title: "3. O Problema do Underclock",
            content: `
        <p class="mb-4 text-gray-700">
            Em alguns casos raros de 2026, placas de vídeo modernas vêm com um "overclock de fábrica" agressivo demais para o motor do GTA V. 
            <br/><br/>Tente usar o <strong>MSI Afterburner</strong> para reduzir o clock do núcleo (Core Clock) em <strong>-50 MHz</strong>. Surpreendentemente, essa pequena redução de velocidade pode estabilizar a comunicação D3D e impedir que o erro ocorra.
        </p>
      `
        }
    ];

    const faqItems = [
        {
            question: "Mudar DirectX para 10.1 resolve?",
            answer: "Sim. Se consegue abrir menu, vá em Configurações > Gráficos > Versão do DirectX. Mude de 11 para 10.1 ou 10. Isso corrige falha na comunicação D3D."
        },
        {
            question: "Deletar settings.xml funciona?",
            answer: "Sim. Vá em Documentos / Rockstar Games / GTA V e delete settings.xml. Jogo criará novo com padrões. Se persistir, abra arquivo e altere DX_Version value='2' para value='0'."
        },
        {
            question: "Underclock da GPU ajuda?",
            answer: "Sim. Em casos raros, overclock de fábrica agressivo demais causa erro. Use MSI Afterburner para reduzir Core Clock em -50 MHz. Isso estabiliza comunicação D3D."
        }
    ];

    const externalReferences = [
        { name: "Rockstar Games Support", url: "https://support.rockstargames.com/" },
        { name: "DirectX Web Installer", url: "https://www.microsoft.com/en-us/download/details.aspx?id=35" }
    ];

    const relatedGuides = [
        {
            href: "/guias/gta-v-otimizar-fps-pc-fraco",
            title: "Otimização GTA V",
            description: "Ganhe mais performance no jogo."
        },
        {
            href: "/guias/atualizacao-drivers-video",
            title: "Drivers de Vídeo",
            description: "Corrija falhas de driver NVidia/AMD."
        },
        {
            href: "/guias/como-resolver-tela-azul",
            title: "Tela Azul",
            description: "Resolva problemas graves de sistema."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="15 min"
            difficultyLevel="Iniciante"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
            faqItems={faqItems}
            externalReferences={externalReferences}
        />
    );
}
