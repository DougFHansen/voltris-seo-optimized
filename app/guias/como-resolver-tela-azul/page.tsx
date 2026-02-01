import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Tela Azul da Morte (BSOD) em 2026: Guia Definitivo de Solução - Voltris";
const description = "Seu PC deu Tela Azul? Aprenda a identificar o código de erro, analisar arquivos de dump e consertar problemas de driver, memória RAM e disco.";
const keywords = ['tela azul windows', 'bsod fix', 'erro windows parou', 'diagnostico tela azul', 'memory management', 'irql not less or equal'];

export const metadata: Metadata = createGuideMetadata('como-resolver-tela-azul', title, description, keywords);

export default function TelaAzulGuide() {
    const summaryTable = [
        { label: "Dificuldade", value: "Difícil" },
        { label: "Tempo Médio", value: "60 min" },
        { label: "Ferramentas", value: "BlueScreenView" }
    ];

    const faqItems = [
        {
            question: "O que causa a Tela Azul?",
            answer: "A Tela Azul (BSOD) é um mecanismo de defesa. O Windows identifica que algo (hardware ou driver) tentou fazer uma operação ilegal que poderia corromper seus dados, e 'mata' o sistema para proteger o disco. 80% dos casos são drivers ruins, 15% hardware defeituoso (RAM/HD) e 5% bugs do próprio Windows."
        },
        {
            question: "Como ler o código de erro?",
            answer: "O Windows mostra um QR Code e um texto em maiúsculo (ex: <code>MEMORY_MANAGEMENT</code>). Anote esse código."
        }
    ];

    const contentSections = [
        {
            title: "Passo 1: Identificando o Culpado",
            content: `
        <p class="mb-4">O Windows gera um arquivo "minidump" quando trava. Vamos ler esse arquivo.</p>
        <ol class="space-y-3 text-gray-300 list-decimal list-inside ml-4">
          <li>Baixe o programa gratuito <strong>BlueScreenView</strong> (NirSoft).</li>
          <li>Execute-o. Ele vai listar os travamentos recentes.</li>
          <li>Olhe a coluna "Caused By Driver". Se for <code>nvlddmkm.sys</code>, é sua placa NVIDIA. Se for <code>ntoskrnl.exe</code>, geralmente é memória RAM.</li>
        </ol>
      `,
            subsections: []
        },
        {
            title: "Passo 2: Testando a Memória RAM",
            content: `
        <p class="mb-4">Memória RAM defeituosa é a causa silenciosa de telas azuis aleatórias.</p>
        <p class="text-gray-300">1. Pressione Windows + R, digite <code>mdsched.exe</code> e dê Enter.<br>2. Escolha "Reiniciar agora e verificar". O PC vai reiniciar e fazer um teste de 15 minutos.</p>
      `
        }
    ];

    const relatedGuides = [
        { href: "/guias/instalacao-drivers", title: "Como Reinstalar Drivers Limpos", description: "Muitas telas azuis são drivers de vídeo corrompidos." },
        { href: "/guias/formatacao-windows", title: "Formatação Limpa", description: "O último recurso se nada mais funcionar." }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="60 minutos"
            difficultyLevel="Avançado"
            contentSections={contentSections}
            relatedGuides={relatedGuides}
            summaryTable={summaryTable}
            faqItems={faqItems}
        />
    );
}
