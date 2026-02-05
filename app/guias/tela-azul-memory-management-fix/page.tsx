import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'tela-azul-memory-management-fix',
  title: "Tela Azul MEMORY_MANAGEMENT: Como resolver (2026)",
  description: "Seu Windows 11 trava com o erro MEMORY MANAGEMENT? Aprenda a testar sua RAM e corrigir erros de sistema para acabar com esse BSOD em 2026.",
  category: 'games-fix',
  difficulty: 'Intermediário',
  time: '35 min'
};

const title = "Tela Azul MEMORY_MANAGEMENT: Como resolver (2026)";
const description = "Seu Windows 11 trava com o erro MEMORY MANAGEMENT? Aprenda a testar sua RAM e corrigir erros de sistema para acabar com esse BSOD em 2026.";
const keywords = [
    'como resolver tela azul memory management 2026 tutorial',
    'erro memory management windows 11 fix guia',
    'testar memoria ram com problema windows 11 tutorial',
    'tela azul constante ao jogar como resolver 2026',
    'diagnosticar memoria ram defeituosa windows 11 guia'
];

export const metadata: Metadata = createGuideMetadata('tela-azul-memory-management-fix', title, description, keywords);

export default function MemoryManagementFixGuide() {
    const summaryTable = [
        { label: "Causa #1", value: "Pente de Memória RAM com defeito físico" },
        { label: "Causa #2", value: "Arquivos de sistema corrompidos" },
        { label: "Ferramenta Interna", value: "Diagnóstico de Memória do Windows" },
        { label: "Ferramenta Externa", value: "MemTest86 (Para testes profundos)" }
    ];

    const contentSections = [
        {
            title: "O que significa o erro MEMORY_MANAGEMENT?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          A tela azul (BSOD) com o erro **MEMORY_MANAGEMENT** indica que o Windows 11 detectou uma falha grave na forma como os dados estão sendo lidos ou gravados na sua memória RAM ou no arquivo de paginação (VRAM). Em 2026, isso pode ser causado por um overclock instável, drivers de chipset antigos ou, na pior das hipóteses, um dos seus pentes de memória está fisicamente morrendo e precisa ser trocado.
        </p>
      `
        },
        {
            title: "1. O Teste de Memória Nativo",
            content: `
        <p class="mb-4 text-gray-300">Deixe o Windows procurar por erros físicos:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Pressione <strong>Win + R</strong>, digite <code>mdsched.exe</code> e dê Enter.</li>
            <li>Escolha 'Reiniciar agora e verificar se há problemas'.</li>
            <li>O PC reiniciará em uma tela azul (mas de teste) e fará uma varredura.</li>
            <li>Se aparecer qualquer mensagem em vermelho dizendo 'Hardware problems detected', você já tem o culpado: sua RAM precisa ser substituída ou limpa.</li>
        </ol>
      `
        },
        {
            title: "2. Corrigindo o Sistema (SFC e DISM)",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Reparo de Arquivos:</h4>
            <p class="text-sm text-gray-300">
                Se o teste de memória deu 'OK', o problema são arquivos do Windows corrompidos tentando acessar a RAM de forma errada. <br/><br/>
                Abra o CMD como Administrador e rode estes comandos em ordem: <br/>
                1. <code>sfc /scannow</code> <br/>
                2. <code>dism /online /cleanup-image /restorehealth</code> <br/>
                Esses comandos de 2026 baixam cópias originais dos arquivos do Windows e substituem as versões bugadas.
            </p>
        </div>
      `
        },
        {
            title: "3. O Perigo do Overclock / XMP",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>Dica de 2026:</strong> Se você ativou o perfil <strong>XMP (Intel)</strong> ou <strong>EXPO (AMD)</strong> na BIOS para sua memória DDR5 rodar mais rápido, a voltagem pode estar instável. 
            <br/><br/>Muitas telas azuis de Memory Management são resolvidas apenas desativando o XMP ou aumentando levemente a voltagem da memória (DRAM Voltage) na BIOS. Tente voltar a memória para a velocidade padrão (ex: 4800MHz) e veja se o erro para. Se parar, o problema é a estabilidade do seu overclock.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/como-resolver-tela-azul",
            title: "Guia Geral BSOD",
            description: "Resolva outros tipos de erro de sistema."
        },
        {
            href: "/guias/upgrade-memoria-ram",
            title: "Upgrade de RAM",
            description: "Como escolher memorias compatíveis."
        },
        {
            href: "/guias/limpar-memoria-ram-windows",
            title: "Limpar RAM",
            description: "Truques para liberar memória sem travar."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="35 min"
            difficultyLevel="Intermediário"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
