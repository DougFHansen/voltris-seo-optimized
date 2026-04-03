import React from 'react';
import { GuideTemplateClient } from '@/components/GuideTemplateClient';
import { title, description, keywords } from './metadata';

export default function ConfigurarWindowsDefenderJogos() {
    const summaryTable = [
        { label: "Antivírus Leve", value: "Windows Defender" },
        { label: "Impacto no FPS", value: "Baixo (Otimizado)" },
        { label: "Proteção", value: "Contínua (Antimalware)" },
        { label: "Solução", value: "Voltris Shield Integration" }
    ];

    const contentSections = [
        {
            title: "O Windows Defender é suficiente para Gamers?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Em 2026, softwares como Norton, McAfee e Avast se tornaram extremamente pesados e "bloatware". O Windows Defender já é um dos melhores antivírus do mundo, mas o seu comportamento padrão é agressivo com arquivos de jogos (<code>.exe</code>, <code>.dll</code>), o que causa **micro-travadas (stuttering).**
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed">
            Se você simplesmente desativar o antivírus, seu PC fica vulnerável. A melhor abordagem é a **Otimização Seletiva:** manter a proteção, mas impedir que o scanner leia seus jogos enquanto você joga.
        </p>
      `
        },
        {
            title: "Como criar exclusões manually",
            content: `
        <p class="mb-4 text-gray-300">
            Para evitar que o Defender analise arquivos em tempo real no meio de uma partida:
            <br/>Vá em <code>Configurações > Proteção contra Vírus e Ameaças > Configurações de Proteção > Gerenciar Exclusões</code>.
            <br/>Adicione a pasta do seu jogo (Ex: SteamLibrary, Riot Games).
        </p>
      `
        },
        {
            title: "A Revolução do Voltris Shield (Security Hardened)",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
            No **Voltris Optimizer**, desenvolvemos o **Voltris Shield**. Ele não é um novo antivírus, mas sim uma camada de orquestração sobre o Windows Defender que garante performance máxima e segurança blindada.
        </p>
        <ul class="space-y-4 text-slate-300">
            <li class="flex items-start gap-3"><div class="w-2 h-2 rounded-full bg-[#31A8FF] mt-1.5 shrink-0"></div> **Scan Throttling:** Diminui a prioridade de CPU do processo <code>MsMpEng.exe</code> durante jogos detectados.</li>
            <li class="flex items-start gap-3"><div class="w-2 h-2 rounded-full bg-[#31A8FF] mt-1.5 shrink-0"></div> **Auto-Trust Logic:** Identifica automaticamente os principais lançamentos do mercado e adiciona exclusões seguras.</li>
            <li class="flex items-start gap-3"><div class="w-2 h-2 rounded-full bg-[#31A8FF] mt-1.5 shrink-0"></div> **Malware Guard:** Protege contra ransomware em pastas críticas de documentos e fotos de forma inteligente.</li>
        </ul>
      `
        }
    ];

    const faqItems = [
        {
            question: "Posso desativar o Defender permanentemente?",
            answer: "Não recomendamos. O Windows 10/11 depende de certas integrações de segurança para funcionar corretamente. O Voltris Optimizer permite que você desative temporariamente a proteção em tempo real com um clique para sessões de benchmarking, mas sempre com foco em segurança."
        },
        {
            question: "O Voltris Shield substitui um antivírus?",
            answer: "Ele utiliza o motor do Windows Defender, o que elimina a necessidade de instalar qualquer antivírus de terceiros. Na verdade, ele remove o impacto negativo que programas externos costumam trazer para o PC Gamer."
        }
    ];

    const relatedGuides = [
        { href: "/guias/antivirus-para-jogos-windows-defender-exclusao", title: "Guia Clássico", description: "O guia antigo de exclusões manuais." },
        { href: "/seguranca-digital", title: "Segurança Digital", description: "Dicas de segurança para senhas e navegação." }
    ];

    return (
        <GuideTemplateClient
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="10 min"
            difficultyLevel="Técnico"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
            faqItems={faqItems}
            showVoltrisOptimizerCTA={true}
            keyPoints={[
                "A verdade sobre o 'consumo de CPU' do Windows Defender",
                "Como criar exclusões para evitar que o jogo trave",
                "Riscos de usar antivírus gratuitos e pesados",
                "O que é Proteção contra Ransomware (Acesso Controlado a Pastas)",
                "O diferencial da Voltris: Proteção invisível no Kernel"
            ]}
        />
    );
}
