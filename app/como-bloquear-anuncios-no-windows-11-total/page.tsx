import React from 'react';
import { GuideTemplateClient } from '@/components/GuideTemplateClient';

export default function BloquearAnuncios() {
    const title = 'Como Bloquear Todos os Anúncios do Windows 11 | Guia Definitivo 2026';
    const description = 'O Windows 11 está cheio de propagandas? Aprenda a remover anúncios do Menu Iniciar, do Explorador de Arquivos e da Tela de Bloqueio de forma permanente e gratuita.';
    const keywords = ['bloquear anúncios windows 11 menu iniciar', 'tirar propagandas windows 11 definitivo', 'desativar anúncios explorer windows 11', 'voltris optimizer adblocker', 'limpar windows 11 anúncios', 'como remover sugestões de apps microsoft'];

    const summaryTable = [
        { label: "O Que é Anúncio no Windows", value: "Sugestões de Apps e Dicas de Uso" },
        { label: "Maior Benefício", value: "Menu Iniciar Limpo e Desktop Ágil" },
        { label: "Técnica Chave", value: "Cloud Content & Tailored Experience" },
        { label: "Resultado Esperado", value: "Fim das Distrações Comerciais" }
    ];

    const contentSections = [
        {
            title: "O Windows 11 virou um Outdoor Digital?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Por padrão, a Microsoft injeta 'sugestões de aplicativos' no seu **Menu Iniciar**, 'dicas de uso' no seu **Explorador de Arquivos** e até anúncios na sua **Tela de Bloqueio**. Isso não apenas polui a interface, como consome rede e processamento para baixar as novas propagandas.
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed">
            Se você pagou pelo Windows, ele deve ser uma ferramenta de trabalho, e não uma vitrine. Nosso objetivo é purificar o Windows 11 de volta ao seu estado profissional e minimalista.
        </p>
        
        <div class="bg-indigo-500/10 border border-indigo-500/30 p-6 rounded-2xl my-6">
            <h4 class="text-indigo-400 font-black mb-2 flex items-center gap-2">Removendo a 'Experiência Personalizada'</h4>
            <p class="text-gray-300 text-sm">
                A Microsoft usa o recurso de <b>Tailored Experiences</b> para rastrear seus cliques e sugerir compras na Microsoft Store. Desativar isso em <b>Configurações > Privacidade e Segurança > Geral</b> é o primeiro passo para o silêncio comercial.
            </p>
        </div>
      `
        },
        {
            title: "Ocultando Anúncios no Explorador de Arquivos",
            content: `
        <p class="mb-4 text-gray-300">
            Muitas vezes, ao abrir o Explorador de Arquivos, aparece um banner sugerindo o uso do OneDrive ou Office 365.
            <br/><br/>
            Caminho: <b>Explorador de Arquivos > Três Pontinhos (...) > Opções > Exibir > Desmarcar 'Mostrar notificações do provedor de sincronização'</b>.
            <br/><br/>
            Isso limpará a interface de banners intrusivos de forma nativa e profissional.
        </p>
      `
        },
        {
            title: "Proteção Total com o Voltris Optimizer: Privacy Shield",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
            O **Voltris Optimizer** lida com os anúncios sistêmicos através da ferramenta de <code>Privacy Shield</code>.
        </p>
        <ul class="space-y-4 text-slate-300">
            <li class="flex items-start gap-3"><div class="w-2 h-2 rounded-full bg-[#31A8FF] mt-1.5 shrink-0"></div> **Universal AdBlocker:** Um clique para desativar todos os pontos de injeção de publicidade do sistema.</li>
            <li class="flex items-start gap-3"><div class="w-2 h-2 rounded-full bg-[#31A8FF] mt-1.5 shrink-0"></div> **Cloud Consumer Off:** Bloqueia a rede de conteúdo da Microsoft que envia sugestões de apps silenciosos.</li>
            <li class="flex items-start gap-3"><div class="w-2 h-2 rounded-full bg-[#31A8FF] mt-1.5 shrink-0"></div> **Spotlight Filter:** Mantém os papéis de parede bonitos, mas desativa os links clicáveis que aparecem na Tela de Bloqueio.</li>
        </ul>
      `
        }
    ];

    const faqItems = [
        {
            question: "Ao bloquear os anúncios, os apps nativos param de funcionar?",
            answer: "Não. Sua calculadora, calendário e e-mail continuam perfeitos. Apenas a camada comercial de sugestão de 'novos apps' é desativada."
        },
        {
            question: "É seguro desativar o Cloud Consumer Content?",
            answer: "Certamente. Esse recurso apenas controla a injeção de tiles de publicidade. Desativa-lo deixa o seu Menu Iniciar mais leve e responsivo."
        }
    ];

    const relatedGuides = [
        { href: "/guia-definitivo-privacidade-windows-2026", title: "Privacidade", description: "Combine com o bloqueio de telemetria total." },
        { href: "/remover-bloatware-windows-11", title: "Debloat", description: "Remova os apps recomendados de verdade." }
    ];

    return (
        <GuideTemplateClient
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="10 min"
            difficultyLevel="Iniciante"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
            faqItems={faqItems}
            showVoltrisOptimizerCTA={true}
            keyPoints={[
                "Remover anúncios permanentes do Menu Iniciar",
                "Desativar banners de publicidade no Explorador de Arquivos",
                "Gestão profissional de 'Cloud Content' via Registro",
                "Configuração profissional de Tela de Bloqueio minimalista",
                "Bloqueio de solicitações de telemetria baseada em anúncio"
            ]}
        />
    );
}
