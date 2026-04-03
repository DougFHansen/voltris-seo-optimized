import React from 'react';
import { GuideTemplateClient } from '@/components/GuideTemplateClient';

export default function LimparRecentes() {
    const title = 'Como Limpar a Lista de Arquivos Recentes no Windows 11 (Privacidade 2026)';
    const description = 'Preocupado com quem pode ver seus arquivos recentemente abertos? Aprenda a limpar e desativar o histórico de arquivos recentes no Windows 11 pelo Explorador, Início e Barra de Tarefas.';
    const keywords = ['limpar arquivos recentes windows 11', 'desativar histórico arquivos windows 11', 'remover lista recentes explorador windows', 'voltris privacy shield arquivos', 'como esconder arquivos abertos windows', 'apagar histórico de documentos windows'];

    const summaryTable = [
        { label: "O Que São", value: "Registros de arquivos abertos recentemente" },
        { label: "Maior Benefício", value: "Privacidade Total em PCs Compartilhados" },
        { label: "Técnica Chave", value: "Privacy Settings & Shell Bag Cleanup" },
        { label: "Resultado Esperado", value: "Rastro Zero de Atividade Local" }
    ];

    const contentSections = [
        {
            title: "Por que o Windows guarda um histórico de tudo que você abre?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O Windows 11 mantém registros de todos os arquivos que você abriu recentemente no Explorador de Arquivos, no Menu Iniciar e em apps do Office. Esse recurso foi pensado para conveniência, mas em computadores compartilhados (família, trabalho), expõe seus documentos para qualquer pessoa que usar a máquina.
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed">
            Além da privacidade, o histórico de arquivos recentes cresce com o tempo e lentifica a indexação do Windows Search, já que o sistema tenta manter todos esses arquivos acessíveis rapidamente.
        </p>
        <div class="bg-indigo-500/10 border border-indigo-500/30 p-6 rounded-2xl my-6">
            <h4 class="text-indigo-400 font-black mb-2">Limpeza Rápida pelo Explorador</h4>
            <p class="text-gray-300 text-sm">
                No Explorador de Arquivos, clique no menu reticências (…) {`>`} Opções {`>`} Privacidade {`>`} Limpar. Também desmarque os dois checkboxes de histórico para novos arquivos. Esta é a opção rápida, mas o Voltris garante que os dados do Registro sejam limpos também.
            </p>
        </div>
      `
        },
        {
            title: "Shell Bags: O Histórico Mais Profundo",
            content: `
        <p class="mb-4 text-gray-300">
            Além dos Recentes visíveis, o Windows guarda em <b>Shell Bags</b> (no Registro) a posição de janelas e pastas que você abriu. Isso pode revelar estruturas de pastas privadas para softwares forenses.
            <br/><br/>
            O Voltris Privacy Shield remove os Shell Bags automaticamente, garantindo que mesmo o Windows Search não lembre das suas pastas anteriores.
        </p>
      `
        },
        {
            title: "Privacidade Absoluta com o Voltris Privacy Shield",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
            O <b>Voltris Optimizer</b> oferece limpeza profunda de rastros locais.
        </p>
        <ul class="space-y-4 text-slate-300">
            <li class="flex items-start gap-3"><div class="w-2 h-2 rounded-full bg-[#31A8FF] mt-1.5 shrink-0"></div> <b>Recent Files Wipe:</b> Apaga todos os MRU (Most Recently Used) do Registro.</li>
            <li class="flex items-start gap-3"><div class="w-2 h-2 rounded-full bg-[#31A8FF] mt-1.5 shrink-0"></div> <b>Shell Bag Cleaner:</b> Remove o histórico de posições de janelas e estrutura de pastas.</li>
            <li class="flex items-start gap-3"><div class="w-2 h-2 rounded-full bg-[#31A8FF] mt-1.5 shrink-0"></div> <b>Auto-Clear on Shutdown:</b> Configura o Windows para limpar automaticamente o histórico ao desligar.</li>
        </ul>
      `
        }
    ];

    const faqItems = [
        { question: "Limpar o histórico afeta a velocidade do PC?", answer: "Positivamente! Com menos entradas no banco MRU, o Windows Search indexa de forma mais eficiente e o Explorador responde mais rápido ao digitar na barra de endereços." },
        { question: "O Office também guarda histórico separado?", answer: "Sim. O Voltris limpa também os MRU do Word, Excel e PowerPoint que ficam armazenados separadamente no Registro." }
    ];

    const relatedGuides = [
        { href: "/guia-definitivo-privacidade-windows-2026", title: "Privacidade Total", description: "Combine com o bloqueio completo de telemetria." },
        { href: "/como-bloquear-anuncios-no-windows-11-total", title: "Sem Anúncios", description: "Complete sua experiência limpa do Windows." }
    ];

    return (
        <GuideTemplateClient
            title={title} description={description} keywords={keywords}
            estimatedTime="8 min" difficultyLevel="Iniciante"
            contentSections={contentSections} summaryTable={summaryTable}
            relatedGuides={relatedGuides} faqItems={faqItems}
            showVoltrisOptimizerCTA={true}
            keyPoints={[
                "Limpar o histórico MRU completo do Registro",
                "Remover Shell Bags de posições de janelas",
                "Desativar registro automático de novos arquivos",
                "Limpar histórico do Office separadamente",
                "Configurar limpeza automática ao desligar o PC"
            ]}
        />
    );
}
