import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "api-ms-win-crt-runtime-l1-1-0.dll faltando? Saiba como fixar";
const description = "O programa não abre e diz que falta o api-ms-win-crt-runtime? Aprenda a resolver este erro instalando o pacote correto do Visual C++ de 2026.";
const keywords = [
    'api-ms-win-crt-runtime-l1-1-0.dll faltando como resolver',
    'erro de sistema o programa nao pode ser iniciado dll',
    'instalar visual c++ redistributable 2015 a 2022',
    'corrigir erro de dll jogos windows 11 2026',
    'atualização universal c runtime windows tutorial'
];

export const metadata: Metadata = createGuideMetadata('api-ms-win-crt-runtime-missing', title, description, keywords);

export default function CRTRuntimeErrorGuide() {
    const summaryTable = [
        { label: "Causa do Erro", value: "Falta do componente Universal C Runtime (CRT)" },
        { label: "Solução Principal", value: "Microsoft Visual C++ Redistributable" },
        { label: "Check Rápido", value: "Windows Update está em dia?" },
        { label: "Dificuldade", value: "Fácil" }
    ];

    const contentSections = [
        {
            title: "O que é essa tal de DLL CRT?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Muitos programas e jogos são escritos em uma linguagem chamada C++. Para rodar, eles precisam de "tradutores" instalados no Windows chamados **Redistributables**. O erro <i>api-ms-win-crt-runtime-l1-1-0.dll</i> acontece quando o programa tenta chamar uma função básica do Windows, mas não encontra o "tradutor" instalado.
        </p>
      `
        },
        {
            title: "1. A Solução Definitiva (Visual C++)",
            content: `
        <p class="mb-4 text-gray-300">Não baixe DLLs em sites aleatórios de "DLL Download". A forma correta é instalar o pacote oficial:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Vá ao site oficial da Microsoft ou use o instalador <strong>Visual C++ All-in-One</strong>.</li>
            <li>Baixe as versões <strong>x86</strong> (para 32 bits) e <strong>x64</strong> (para 64 bits). <strong>Você precisa de AMBAS</strong>, mesmo se o seu Windows for 64 bits.</li>
            <li>Instale, reinicie o PC e tente abrir o programa novamente.</li>
        </ol>
      `
        },
        {
            title: "2. Windows Update e Universal CRT",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Peculiaridade do Windows antigo:</h4>
            <p class="text-sm text-gray-300">
                Se você ainda usa o Windows 7 ou 8.1 em 2026, esse erro acontece porque a atualização <strong>KB2999226</strong> não está instalada. No Windows 10 e 11, rodar o <strong>Windows Update</strong> e instalar todas as atualizações opcionais costuma resolver o problema sem que você precise baixar nada manualmente.
            </p>
        </div>
      `
        },
        {
            title: "3. Aviso: Cuidado com o Malware",
            content: `
        <p class="mb-4 text-gray-300">
            Muitos sites de "Download de DLL" são armadilhas para vírus. Eles te dão a DLL correta, mas injetam um código malicioso junto. Nunca coloque uma DLL manualmente na pasta <code>System32</code> sem saber exatamente o que está fazendo. Sempre prefira rodar o instalador oficial da Microsoft.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/corrigir-dll-faltando-vcredist-directx",
            title: "Guia de Runtimes",
            description: "Checklist completo de componentes base."
        },
        {
            href: "/guias/pos-instalacao-windows-11",
            title: "Pós-Instalação",
            description: "O que instalar para não ter erros de DLL."
        },
        {
            href: "/guias/erro-0xc00007b-aplicativo-nao-inicializou",
            title: "Erro 0xc00007b",
            description: "Outro erro comum ligado a C++."
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
            relatedGuides={relatedGuides}
        />
    );
}
