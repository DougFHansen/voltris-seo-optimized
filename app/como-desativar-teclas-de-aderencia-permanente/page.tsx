import React from 'react';
import { GuideTemplateClient } from '@/components/GuideTemplateClient';

export default function StickyKeys() {
    const title = 'Como Desativar as Teclas de Aderência no Windows 11 (Permanentemente)';
    const description = 'O popup de Teclas de Aderência aparece toda vez que você usa Shift? Aprenda a desativar permanentemente essa função de acessibilidade e nunca mais ser interrompido durante os seus jogos.';
    const keywords = ['como desativar teclas de aderência windows 11', 'teclas de aderência aparecendo no jogo', 'desativar sticky keys windows definitivo', 'voltris optimizer gaming tweaks', 'suprimir teclas de aderência windows 11', 'como tirar aviso shift windows jogos'];

    const summaryTable = [
        { label: "O Problema", value: "Popup no meio de partidas ao pressionar Shift" },
        { label: "Maior Benefício", value: "Zero Interrupções em Jogos Competitivos" },
        { label: "Técnica Chave", value: "Registry Accessibility Flags" },
        { label: "Resultado Esperado", value: "Jogo Fluido Sem Distrações" }
    ];

    const contentSections = [
        {
            title: "Por que as Teclas de Aderência são tão irritantes para gamers?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          As <b>Sticky Keys</b> (Teclas de Aderência) foram criadas como recurso de acessibilidade para usuários que têm dificuldade em pressionar múltiplas teclas ao mesmo tempo. No entanto, para qualquer gamer que usa <b>Shift + habilidade</b>, o popup indesejado pode surgir no pior momento possível — como durante um 1v5 decisivo.
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed">
            O método mais comum é apenas desmarcar a opção nas configurações, mas o Windows 11 pode re-ativá-las após atualizações. A solução definitiva é via Registro.
        </p>
        <div class="bg-amber-500/10 border border-amber-500/30 p-6 rounded-2xl my-6">
            <h4 class="text-amber-400 font-black mb-2">Rota Rápida: Configurações de Acessibilidade</h4>
            <p class="text-gray-300 text-sm">
                Caminho: <b>Configurações {`>`} Acessibilidade {`>`} Teclado {`>`} Teclas de Aderência</b>. Desative o toggle principal e também a opção "Tecla de atalho para teclas de aderência" — essa última é a que dispara o popup no jogo.
            </p>
        </div>
      `
        },
        {
            title: "Desativação Permanente via Registro",
            content: `
        <p class="mb-4 text-gray-300">
            Para garantir que o Windows Update não reverta sua configuração, acesse o Registro:
            <br/><br/>
            Caminho: <code>HKEY_CURRENT_USER\Control Panel\Accessibility\StickyKeys</code>
            <br/><br/>
            Defina o valor <b>Flags</b> para <b>506</b>. Isso desativa permanentemente tanto a tecla de atalho quanto o som de aviso.
        </p>
      `
        },
        {
            title: "Kit Anti-Interrupção do Voltris: Gaming Shield",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
            O <b>Voltris Optimizer</b> inclui um pacote completo de desativação de recursos de acessibilidade que prejudicam a experiência gamer.
        </p>
        <ul class="space-y-4 text-slate-300">
            <li class="flex items-start gap-3"><div class="w-2 h-2 rounded-full bg-[#fcd34d] mt-1.5 shrink-0"></div> <b>Sticky Keys Off:</b> Desativa via Registro para resistir a updates.</li>
            <li class="flex items-start gap-3"><div class="w-2 h-2 rounded-full bg-[#fcd34d] mt-1.5 shrink-0"></div> <b>Filter Keys Off:</b> Elimina o lag de digitação causado pela acessibilidade de teclado.</li>
            <li class="flex items-start gap-3"><div class="w-2 h-2 rounded-full bg-[#fcd34d] mt-1.5 shrink-0"></div> <b>Toggle Keys Off:</b> Remove o bip irritante do Caps Lock e Num Lock.</li>
        </ul>
      `
        }
    ];

    const faqItems = [
        { question: "Ao desativar, usuários com deficiência perdem acesso?", answer: "Este guia é para usuários que não precisam desse recurso. Se houver outro usuário que depende de acessibilidade na mesma máquina, o Voltris permite restaurar tudo em um clique." },
        { question: "Isso funciona no Windows 10 também?", answer: "Sim, o caminho do Registro é idêntico. O Voltris detecta automaticamente a versão do Windows e aplica o tweak correto." }
    ];

    const relatedGuides = [
        { href: "/corrigir-lag-pontual-no-teclado-windows", title: "Lag no Teclado", description: "Outros ajustes de precisão de teclado." },
        { href: "/como-diminuir-input-lag-teclado-mouse", title: "Input Lag Zero", description: "Resposta instantânea em todos os periféricos." }
    ];

    return (
        <GuideTemplateClient
            title={title} description={description} keywords={keywords}
            estimatedTime="5 min" difficultyLevel="Iniciante"
            contentSections={contentSections} summaryTable={summaryTable}
            relatedGuides={relatedGuides} faqItems={faqItems}
            showVoltrisOptimizerCTA={true}
            keyPoints={[
                "Desativar Sticky Keys via Registro (permanente)",
                "Eliminar popup de Shift em jogos competitivos",
                "Remover sons de aviso de teclas especiais",
                "Bloquear re-ativação automática pós Windows Update",
                "Kit completo de Gaming UX com um clique"
            ]}
        />
    );
}
