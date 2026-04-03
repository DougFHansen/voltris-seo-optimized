import React from 'react';
import { GuideTemplateClient } from '@/components/GuideTemplateClient';
import { title, description, keywords } from './metadata';

export default function DiagnosticoHardwareTemperatura() {
    const summaryTable = [
        { label: "O que monitorar", value: "CPU, GPU e SSD" },
        { label: "Temperatura Limite", value: "85°C (Recomendado)" },
        { label: "Saúde SSD", value: "S.M.A.R.T Metrics" },
        { label: "Solução", value: "Voltris Live Dashboard" }
    ];

    const contentSections = [
        {
            title: "Como saber se o seu PC está sobrecarregado?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O superaquecimento é a causa número 1 de perda de performance em jogos (Power Throttling). Se a sua CPU atinge 95°C, o Windows reduz o clock para evitar o derretimento do chip. Isso causa travamentos irremediáveis no FPS.
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed">
            Monitorar a saúde dos seus componentes (`S.M.A.R.T` de SSD, voltagem da fonte, ciclos de uso) é essencial para garantir a longevidade do investimento.
        </p>
      `
        },
        {
            title: "Ferramentas Clássicas (HWMonitor, CrystalDiskInfo)",
            content: `
        <p class="mb-4 text-gray-300">
            Você pode instalar várias ferramentas isoladas para monitorar seu hardware. O `CrystalDiskInfo` é o padrão para testar a saúde do seu SSD ou HD. O `HWMonitor` é o mais simples para ver picos de voltagem e temperatura.
        </p>
      `
        },
        {
            title: "O Dashboard da Voltris: Diagnóstico Integrado",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
            No **Voltris Optimizer**, unificamos as ferramentas de diagnóstico em um único Dashboard moderno que não causa impacto visual ou de performance.
        </p>
        <ul class="space-y-4 text-slate-300">
            <li class="flex items-start gap-3"><div class="w-2 h-2 rounded-full bg-[#31A8FF] mt-1.5 shrink-0"></div> **Real-time Monitoring:** Veja uso e temperatura da CPU/GPU sem precisar alternar entre janelas.</li>
            <li class="flex items-start gap-3"><div class="w-2 h-2 rounded-full bg-[#31A8FF] mt-1.5 shrink-0"></div> **Hardware Scan:** Verifica a saúde SMART do seu disco em busca de setores defeituosos que causam lentidão.</li>
            <li class="flex items-start gap-3"><div class="w-2 h-2 rounded-full bg-[#31A8FF] mt-1.5 shrink-0"></div> **Error Logs:** Analisa logs do Visualizador de Eventos para encontrar erros de driver antes que eles causem Tela Azul (BSOD).</li>
        </ul>
      `
        }
    ];

    const faqItems = [
        {
            question: "Qual a temperatura normal da GPU em carga total?",
            answer: "Para GPUs modernas, nada entre 65°C a 80°C é perfeitamente normal. Se ultrapassar 85°C de forma constante, é hora de limpar o PC ou reaplicar pasta térmica."
        },
        {
            question: "O Voltris consegue consertar peças defeituosas?",
            answer: "Não. Nenhum software conserta hardware quebrado fisicamente. O Voltris ajuda você a identificar o problema e a otimizar o software para diminuir o estresse na peça defeituosa até que você possa trocá-la."
        }
    ];

    const relatedGuides = [
        { href: "/guias/monitorar-temperatura-pc", title: "Guia Clássico", description: "O guia antigo de monitoramento manual." },
        { href: "/guias/verificar-saude-hd-ssd-crystaldiskinfo", title: "Saúde SSD", description: "Dicas específicas para armazenamento." }
    ];

    return (
        <GuideTemplateClient
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="15 min"
            difficultyLevel="Estratégico"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
            faqItems={faqItems}
            showVoltrisOptimizerCTA={true}
            keyPoints={[
                "Aprender a ler os dados de temperatura com precisão",
                "O que é Power Throttling e como ele destrói seu FPS",
                "Como monitorar a saúde do seu SSD/NVMe sem programas pesados",
                "Riscos de deixar o PC operando acima de 90°C",
                "Como o Voltris unifica o diagnóstico em uma só tela"
            ]}
        />
    );
}
