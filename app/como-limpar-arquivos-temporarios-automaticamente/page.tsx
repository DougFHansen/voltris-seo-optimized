import React from 'react';
import { GuideTemplateClient } from '@/components/GuideTemplateClient';

export default function LimpezaAutomatica() {
    const title = 'Como Limpar Arquivos Temporários Automaticamente no Windows 11 (2026)';
    const description = 'Guia passo a passo para manter seu PC sempre limpo. Aprenda a configurar o Sensor de Armazenamento, criar scripts de limpeza via Agendador de Tarefas e usar o Voltris Ultra Cleaner para remoção profunda.';
    const keywords = ['limpar arquivos temporários automaticamente', 'liberar espaço disco windows 11', 'agendar limpeza de disco', 'voltris ultra cleaner', 'apagar pasta temp automática', 'como acelerar pc lento limpeza'];

    const summaryTable = [
        { label: "Onde Fica o Lixo", value: "Pastas %TEMP%, Prefetch e Cache" },
        { label: "Maior Benefício", value: "Recuperação de Espaço e Velocidade" },
        { label: "Técnica Chave", value: "Agendador de Tarefas e Ultra Cleaner" },
        { label: "Frequência Ideal", value: "Semanal ou Diária" }
    ];

    const contentSections = [
        {
            title: "O que são Arquivos Temporários e por que eles pesam no PC?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Toda vez que você instala um app, navega na internet ou descompacta um arquivo, o Windows 11 cria cópias temporárias nessas pastas. Elas deveriam sumir sozinhas, mas o sistema costuma "esquecer" giga-bytes de dados lá.
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed">
            Acúmulo de arquivos temporários causa lentidão no acesso rápido ao disco (SSD/HDD), pode corromper caches de instalação e, em casos extremos, impedir atualizações essenciais por falta de espaço.
        </p>
        
        <div class="bg-[#31A8FF]/10 border border-[#31A8FF]/30 p-6 rounded-2xl my-6">
            <h4 class="text-[#31A8FF] font-black mb-2 flex items-center gap-2">Sensor de Armazenamento (Storage Sense)</h4>
            <p class="text-gray-300 text-sm">
                O recurso nativo do Windows 11 é um bom começo. Vá em <b>Configurações > Sistema > Armazenamento</b> e ative o Sensor. Ele limpa a lixeira e a pasta de downloads após um determinado período.
            </p>
        </div>
      `
        },
        {
            title: "Automatização via Agendador de Tarefas",
            content: `
        <p class="mb-4 text-gray-300">
            Para uma limpeza mais agressiva, você pode criar uma tarefa que roda ao iniciar o Windows:
            <br/><br/>
            Comando Executável: <code>cleanmgr.exe /sagerun:1</code>
            <br/><br/>
            Isso dispara a Limpeza de Disco clássica com suas configurações pré-definidas, sem que você precise abrir nenhuma janela. No entanto, ele ainda ignora caches de navegadores e logs pesados.
        </p>
      `
        },
        {
            title: "A Vantagem do Voltris Ultra Cleaner",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
            O **Voltris Ultra Cleaner** foi desenhado para ir onde o Windows não vai. Ele escaneia mais de 50 áreas críticas do sistema que acumulam lixo.
        </p>
        <ul class="space-y-4 text-slate-300">
            <li class="flex items-start gap-3"><div class="w-2 h-2 rounded-full bg-[#10b981] mt-1.5 shrink-0"></div> **Deep Registry Sanitization:** Remove referências a arquivos que não existem mais.</li>
            <li class="flex items-start gap-3"><div class="w-2 h-2 rounded-full bg-[#10b981] mt-1.5 shrink-0"></div> **Universal Browser Cleaner:** Limpa caches de todos os navegadores instalados de uma vez.</li>
            <li class="flex items-start gap-3"><div class="w-2 h-2 rounded-full bg-[#10b981] mt-1.5 shrink-0"></div> **One-Click Automation:** Configure para limpar o sistema toda vez que o PC atingir um limite de lixo.</li>
        </ul>
      `
        }
    ];

    const faqItems = [
        {
            question: "Posso apagar a pasta Prefetch sem medo?",
            answer: "Sim, os arquivos prefetch são apenas 'mapas' de como os apps carregam. O Windows os recria conforme necessário. Apagá-los resolve inconsistências e lentidão no carregamento de apps que foram corrompidos."
        },
        {
            question: "A limpeza automática apaga minhas senhas?",
            answer: "Não. A limpeza de temporários do Voltris remove apenas caches de imagem e trackers. Suas senhas e dados de preenchimento automático são preservados, a menos que você selecione especificamente para excluí-los."
        }
    ];

    const relatedGuides = [
        { href: "/melhores-programas-otimizar-windows", title: "Top Limpadores", description: "Veja por que a Voltris é o limpador mais profundo do mercado." },
        { href: "/diagnostico-hardware-temperatura-pc", title: "Saúde do SSD", description: "Entenda como a limpeza prolonga a vida do seu SSD." }
    ];

    return (
        <GuideTemplateClient
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="8 min"
            difficultyLevel="Iniciante"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
            faqItems={faqItems}
            showVoltrisOptimizerCTA={true}
            keyPoints={[
                "Configuração do Sensor de Armazenamento nativo",
                "Esvaziamento automático da lixeira e pastas TEMP",
                "Script de automação para o Agendador de Tarefas",
                "Uso do Ultra Cleaner para limpeza profunda de registros",
                "Otimização de tempo de carregamento de apps (Prefetch/Superfetch)"
            ]}
        />
    );
}
