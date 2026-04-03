import React from 'react';
import { GuideTemplateClient } from '@/components/GuideTemplateClient';

export default function PhotoshopPerformance() {
    const title = 'Como Otimizar o Windows 11 para Photoshop e Lightroom (2026)';
    const description = 'Seu Photoshop está lento? Aprenda a configurar o disco de scratch, a GPU e a RAM para acelerar a edição de fotos no Windows 11 com o Adobe Photoshop e Lightroom Classic.';
    const keywords = ['otimizar windows 11 photoshop', 'acelerar lightroom classic windows', 'configurar scratch disk photoshop', 'voltris optimizer adobe photoshop', 'ram gpu photoshop windows 11', 'photoshop lento travando fix'];

    const summaryTable = [
        { label: "Maior Gargalo", value: "Scratch Disk Lotado e RAM Insuficiente" },
        { label: "Maior Benefício", value: "Filtros e Smart Objects Instantâneos" },
        { label: "Técnica Chave", value: "Scratch Disk SSD & RAM Allocation" },
        { label: "Resultado Esperado", value: "Exportação RAW 3x Mais Rápida" }
    ];

    const contentSections = [
        {
            title: "Por que o Photoshop trava no Windows 11?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O Adobe Photoshop utiliza um <b>Scratch Disk</b> — um disco temporário para armazenar operações de histórico que não cabem na RAM. Se esse disco for o mesmo do sistema operacional (C:) e estiver quase cheio, o Photoshop irá congelar constantemente.
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed">
            O Windows 11 também pode limitar a quantidade de RAM que o Photoshop usa, especialmente se houver processos de fundo competindo pelos recursos. Para fotógrafos e designers, o ajuste correto de memória é a diferença entre esperar 10 segundos ou 1 segundo por filtro.
        </p>
        <div class="bg-blue-500/10 border border-blue-500/30 p-6 rounded-2xl my-6">
            <h4 class="text-[#31A8FF] font-black mb-2">Configuração Ouro: Scratch Disk no SSD Separado</h4>
            <p class="text-gray-300 text-sm">
                Em <b>Editar {`>`} Preferências {`>`} Scratch Disks</b>, defina o Scratch para um SSD diferente do sistema operacional. Isso evita que o Windows e o Photoshop disputem o mesmo canal de I/O, acelerando imensamente as operações de histórico e transformações pesadas.
            </p>
        </div>
      `
        },
        {
            title: "Configurando a GPU no Photoshop",
            content: `
        <p class="mb-4 text-gray-300">
            O Photoshop pode usar a GPU para renderização de Canvas. Em <b>Preferências {`>`} Desempenho {`>`} Configurações de GPU</b>, ative o modo Avançado para que filtros como Camera Raw e Liquify usem a placa de vídeo ao máximo.
            <br/><br/>
            Para isso funcionar, o Voltris deve ter garantido que o Windows não está limitando a entrega de VRAM para processos criativos.
        </p>
      `
        },
        {
            title: "Otimização com Voltris: Creative DNA",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
            O <b>Voltris Optimizer</b> prepara o Windows 11 para o fluxo criativo profissional.
        </p>
        <ul class="space-y-4 text-slate-300">
            <li class="flex items-start gap-3"><div class="w-2 h-2 rounded-full bg-[#10b981] mt-1.5 shrink-0"></div> <b>RAM Priority:</b> Garante que o Photoshop acesse RAM suficiente sem concorrer com o Chrome.</li>
            <li class="flex items-start gap-3"><div class="w-2 h-2 rounded-full bg-[#10b981] mt-1.5 shrink-0"></div> <b>Temp Cleanup:</b> Limpa os temporários do Photoshop que ficam no C: após crashes.</li>
            <li class="flex items-start gap-3"><div class="w-2 h-2 rounded-full bg-[#10b981] mt-1.5 shrink-0"></div> <b>Defender Exclusion:</b> Adiciona os diretórios de projeto às exclusões para parar o scanning de arquivos RAW.</li>
        </ul>
      `
        }
    ];

    const faqItems = [
        { question: "Instalar mais RAM melhora o Lightroom?", answer: "Sim, mas apenas se o Windows estiver livre para entregá-la. Com o Voltris eliminando processos de fundo, você aproveita 100% da RAM física instalada." },
        { question: "O Voltris melhora a exportação no Lightroom?", answer: "Certamente. Ao priorizar I/O de disco e desativar telemetria, a velocidade de exportação em lote de RAW pode aumentar até 40%." }
    ];

    const relatedGuides = [
        { href: "/otimizar-windows-para-edicao-de-video", title: "Edição de Vídeo", description: "Otimize também para o Premiere e DaVinci." },
        { href: "/como-limpar-cache-nvidia-windows-11", title: "Cache GPU", description: "Limpe os shaders para filtros mais estáveis." }
    ];

    return (
        <GuideTemplateClient
            title={title} description={description} keywords={keywords}
            estimatedTime="15 min" difficultyLevel="Intermediário"
            contentSections={contentSections} summaryTable={summaryTable}
            relatedGuides={relatedGuides} faqItems={faqItems}
            showVoltrisOptimizerCTA={true}
            keyPoints={[
                "Configurar Scratch Disk em SSD dedicado",
                "Alocar RAM máxima para processos Adobe",
                "Ativar renderização GPU avançada no Photoshop",
                "Adicionar pastas de projeto às exclusões do Defender",
                "Limpeza de temporários após crashes do Adobe"
            ]}
        />
    );
}
