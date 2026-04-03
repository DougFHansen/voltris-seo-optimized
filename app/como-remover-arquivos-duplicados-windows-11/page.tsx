import React from 'react';
import { GuideTemplateClient } from '@/components/GuideTemplateClient';

export default function RemoverDuplicados() {
    const title = 'Como Remover Arquivos Duplicados no Windows 11 (Guia 2026)';
    const description = 'Seu HD está cheio de arquivos repetidos? Aprenda a localizar e apagar fotos, vídeos e documentos duplicados de forma segura e automática no Windows 11.';
    const keywords = ['como remover arquivos duplicados windows 11', 'ferramenta para achar fotos repetidas pc', 'limpar disco removendo duplicatas', 'voltris ultra cleaner duplicados', 'apagar arquivos repetidos automático', 'como liberar espaço hd duplicados'];

    const summaryTable = [
        { label: "Onde Estão os Duplicados", value: "Pastas Downloads, Photos e Cloud Sync" },
        { label: "Maior Benefício", value: "Recuperação massiva de Gigabytes" },
        { label: "Técnica Chave", value: "MD5/SHA Hash Comparison" },
        { label: "Resultado Esperado", value: "Disco Mais Livre e Organizado" }
    ];

    const contentSections = [
        {
            title: "Por que você tem tantos arquivos duplicados no Windows 11?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O Windows 11 facilita muito a cópia de arquivos, mas dificulta a organização. Cargas de trabalho com **Google Drive**, **OneDrive** ou **Dropbox** costumam criar cópias locais indevidas. Além disso, downloads repetidos e backups manuais geram um lixo digital que 'sufoca' o armazenamento.
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed">
            Arquivos duplicados não apenas ocupam espaço; eles confundem o Windows Search, tornam a indexação do antivírus mais lenta e fazem o seu backup demorar o dobro do tempo necessário.
        </p>
        
        <div class="bg-blue-500/10 border border-blue-500/30 p-6 rounded-2xl my-6">
            <h4 class="text-[#31A8FF] font-black mb-2 flex items-center gap-2">O Perigo do Nome de Arquivos</h4>
            <p class="text-gray-300 text-sm">
                Confiar apenas no nome do arquivo é um erro. Dois arquivos chamados <code>foto1.jpg</code> podem ser diferentes, enquanto <code>IMG_2024.jpg</code> e <code>Copiar_de_FOTO.jpg</code> podem ser identicos. O segredo está na **Assinatura Digital (Hash)** do conteúdo.
            </p>
        </div>
      `
        },
        {
            title: "A Diferença entre MD5 e SHA para Limpeza",
            content: `
        <p class="mb-4 text-gray-300">
            Ferramentas profissionais de limpeza como a Voltris geram uma <b>'impressão digital'</b> de cada arquivo. Isso garante 100% de precisão: se a assinatura for a mesma, o arquivo é exatamente o mesmo bit a bit, mesmo que o nome e a data de criação sejam diferentes.
            <br/><br/>
            Remover duplicatas bit-a-bit é a única forma de garantir que você não apagará por engano um arquivo importante.
        </p>
      `
        },
        {
            title: "Otimizando o Espaço com o Voltris Ultra Cleaner",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
            O **Voltris Ultra Cleaner** possui uma ferramenta inteligente de <code>Duplicate Finder & Merger</code>.
        </p>
        <ul class="space-y-4 text-slate-300">
            <li class="flex items-start gap-3"><div class="w-2 h-2 rounded-full bg-[#10b981] mt-1.5 shrink-0"></div> **Smart Selection:** Marca automaticamente apenas as cópias menores ou mais recentes, preservando o original.</li>
            <li class="flex items-start gap-3"><div class="w-2 h-2 rounded-full bg-[#10b981] mt-1.5 shrink-0"></div> **Deep Content Scan:** Identifica duplicatas baseadas no conteúdo real da imagem ou vídeo.</li>
            <li class="flex items-start gap-3"><div class="w-2 h-2 rounded-full bg-[#10b981] mt-1.5 shrink-0"></div> **Preview Mode:** Veja o que será apagado antes de confirmar a exclusão definitiva.</li>
        </ul>
      `
        }
    ];

    const faqItems = [
        {
            question: "O Voltris apaga duplicados de pastas do sistema?",
            answer: "Não. Por segurança, o Voltris protege arquivos do Windows. A ferramenta de duplicatas foca nas pastas do usuário, como Documentos, Imagens, Vídeos e Downloads, onde você realmente tem o controle."
        },
        {
            question: "Posso remover vídeos duplicados que são muito pesados?",
            answer: "Sim! Essa é uma das funções mais pedidas. O Voltris escaneia arquivos de até 100GB com velocidade de barramento de SSD para encontrar cópias de filmes ou projetos de vídeo antigos."
        }
    ];

    const relatedGuides = [
        { href: "/como-limpar-arquivos-temporarios-automaticamente", title: "Limpeza Periódica", description: "Combine com a remoção de temporários inuteis." },
        { href: "/otimizar-windows-para-edicao-de-video", title: "Para Editores", description: "Mantenha sua linha do tempo organizada sem duplicatas." }
    ];

    return (
        <GuideTemplateClient
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="15 min"
            difficultyLevel="Médio"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
            faqItems={faqItems}
            showVoltrisOptimizerCTA={true}
            keyPoints={[
                "Utilizar assinaturas digitais (Hash) para 100% de precisão",
                "Gestão profissional de cópias em serviços de Nuvem",
                "Limpeza automática de pastas de Downloads e Fotos repetidas",
                "Prévia visual antes da exclusão de vídeos e imagens",
                "Otimização de tempo de indexação global do Windows"
            ]}
        />
    );
}
