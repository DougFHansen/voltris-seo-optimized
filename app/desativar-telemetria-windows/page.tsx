import React from 'react';
import { GuideTemplateClient } from '@/components/GuideTemplateClient';
import { title, description, keywords } from './metadata';

export default function DesativarTelemetriaWindows() {
    const summaryTable = [
        { label: "O que é Telemetria", value: "Coleta de Dados de Uso" },
        { label: "Impacto no PC", value: "Uso de CPU e Rede" },
        { label: "Privacidade", value: "Muito Baixa (Original)" },
        { label: "Solução", value: "Voltris Zero-Telemetry" }
    ];

    const contentSections = [
        {
            title: "O Windows monitora cada digitação sua?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O Windows 10 e 11 vêm com sistemas integrados de monitoramento: Telemetria Funcional, Cortana, Relatórios de Erros, Histórico de Digitação e até anúncios personalizados no menu Iniciar. **Cada clique seu gera um dado que é enviado para a Microsoft.**
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed">
            Além da questão ética de privacidade, o grande problema é o impacto no desempenho: os processos `DiagTrack` e `Compatibility Appraiser` podem consumir até 15% de CPU aleatoriamente em momentos cruciais.
        </p>
      `
        },
        {
            title: "Desativando a Telemetria via GPO",
            content: `
        <p class="mb-4 text-gray-300">
            Usuários da versão Pro podem desativar a telemetria via Editor de Política de Grupo Local (`gpedit.msc`).
            <br/>Navegue em: <code>Configurações do Computador > Modelos Administrativos > Componentes do Windows > Coleta de Dados e Compilações de Visualização</code>. 
            <br/>Defina **Permitir Telemetria** como **Desabilitado**.
        </p>
      `
        },
        {
            title: "Como a Voltris Maximiza sua Privacidade",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
            No **Voltris Optimizer**, fomos além. Desenvolvemos o sistema **Zero-Telemetry** que age no kernel e nas chaves de registro ocultas que a Microsoft não mostra no menu padrão.
        </p>
        <ul class="space-y-4 text-slate-300">
            <li class="flex items-start gap-3"><div class="w-2 h-2 rounded-full bg-[#31A8FF] mt-1.5 shrink-0"></div> **Disable Keyloggers:** Bloqueia a coleta de padrões de escrita e voz.</li>
            <li class="flex items-start gap-3"><div class="w-2 h-2 rounded-full bg-[#31A8FF] mt-1.5 shrink-0"></div> **Block Hosts:** Impede o PC de se conectar aos servidores de análise e anúncios da Microsoft via arquivo de Hosts editado.</li>
            <li class="flex items-start gap-3"><div class="w-2 h-2 rounded-full bg-[#31A8FF] mt-1.5 shrink-0"></div> **App Integrity:** Melhora a segurança sem precisar monitorar seu comportamento.</li>
        </ul>
      `
        }
    ];

    const faqItems = [
        {
            question: "Desativar telemetria estraga o Windows Update?",
            answer: "Se feito da forma errada, sim. Se você simplesmente deletar serviços críticos, o Update para de funcionar. O Voltris Optimizer desativa apenas os componentes de espionagem, mantendo o sistema de atualizações de segurança intacto."
        },
        {
            question: "A Voltris coleta meus dados?",
            answer: "De forma alguma. Ao contrário do Windows, o Voltris Optimizer é uma ferramenta local. Não temos servidores para onde seus dados de uso são enviados; nosso lucro vem do suporte especializado e da versão Enterprise do software."
        }
    ];

    const relatedGuides = [
        { href: "/guias/privacidade-windows-telemetria", title: "Guia Clássico", description: "O guia antigo de privacidade manual." },
        { href: "/remover-bloatware-windows-11", title: "Remover Bloatware", description: "Complemente a limpeza do seu sistema." }
    ];

    return (
        <GuideTemplateClient
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="15 min"
            difficultyLevel="Técnico"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
            faqItems={faqItems}
            showVoltrisOptimizerCTA={true}
            keyPoints={[
                "A realidade oculta dos relatórios de uso do Windows",
                "O que é GPO e como usar no Windows 10/11",
                "Riscos de privacidade em versões home do Windows",
                "O impacto real da telemetria no FPS (Picos de CPU)",
                "Otimização via Hosts para bloqueio total de anúncios"
            ]}
        />
    );
}
