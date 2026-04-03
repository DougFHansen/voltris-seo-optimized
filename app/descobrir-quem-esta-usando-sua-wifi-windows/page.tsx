import React from 'react';
import { GuideTemplateClient } from '@/components/GuideTemplateClient';

export default function WifiSecurity() {
    const title = 'Como Descobrir Quem Está Usando sua Wi-Fi pelo Windows 11 (2026)';
    const description = 'Sua internet está lenta? Aprenda a identificar dispositivos conectados na sua rede Wi-Fi usando o Windows. Guia completo sobre segurança de rede, comandos de rede e proteção DNS.';
    const keywords = ['descobrir quem está usando wifi', 'ver dispositivos conectados na rede windows', 'internet lenta wifi invasor', 'voltris network security', 'segurança rede wifi windows 11', 'como expulsar vizinho da wifi'];

    const summaryTable = [
        { label: "Sintoma Invasão", value: "Ping Alto e Quedas de Velocidade" },
        { label: "Maior Benefício", value: "Proteção de Dados e Link estável" },
        { label: "Técnica Chave", value: "ARP Scan & Network Discovery" },
        { label: "Resultado Esperado", value: "Rede Blindada e Limpa" }
    ];

    const contentSections = [
        {
            title: "Por que estranhos na sua Wi-Fi deixam o PC Lento?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Muitas vezes você otimiza o Windows 11 inteiro, mas o seu ping em jogos ou a velocidade de download continuam oscilando. O motivo pode estar no seu roteador: dispositivos desconhecidos (celulares de vizinhos, TVs inteligentes de terceiros) consumindo sua largura de banda.
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed">
            Esse tráfego 'parasita' gera o <b>Bufferbloat</b>, que é quando a sua rede fica congestionada de pedidos de pacotes, forçando sua placa de rede e o Windows a trabalharem em dobro para gerenciar as rotas. Identificar e banir esses dispositivos é vital para a sua performance global.
        </p>
        
        <div class="bg-blue-500/10 border border-blue-500/30 p-6 rounded-2xl my-6">
            <h4 class="text-[#31A8FF] font-black mb-2 flex items-center gap-2">Comando de Ouro: ARP -A</h4>
            <p class="text-gray-300 text-sm">
                Abra o CMD (Prompt de Comando) e digite <code>arp -a</code>. O Windows listará todos os endereços IP e MAC que estão interagindo com a sua rede local agora. Se houver mais dispositivos do que você tem em casa, você tem um intruso.
            </p>
        </div>
      `
        },
        {
            title: "Segurança de Rede Nativa do Windows 11",
            content: `
        <p class="mb-4 text-gray-300">
            O Windows 11 possui um recurso de 'Descoberta de Rede' que permite ver os dispositivos conectados. No entanto, é necessário que o seu perfil de rede esteja em <b>Privado</b> para que o sistema consiga escanear o ambiente sem que o Firewall bloqueie a visão.
            <br/><br/>
            Caminho: <b>Central de Rede e Compartilhamento > Configurações de compartilhamento avançadas > Descoberta de rede</b>.
        </p>
      `
        },
        {
            title: "Proteção de Rede com Voltris Optimizer",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
            O **Voltris Optimizer** blinda a sua conexão através do <code>Network Shield e DNS Protection</code>.
        </p>
        <ul class="space-y-4 text-slate-300">
            <li class="flex items-start gap-3"><div class="w-2 h-2 rounded-full bg-[#10b981] mt-1.5 shrink-0"></div> **Net Tweak:** Otimiza os pacotes da sua placa wireless para evitar interferência de redes vizinhas.</li>
            <li class="flex items-start gap-3"><div class="w-2 h-2 rounded-full bg-[#10b981] mt-1.5 shrink-0"></div> **DNS Protection:** Impede que sites maliciosos acessem a configuração do seu roteador via ataques de DNS.</li>
            <li class="flex items-start gap-3"><div class="w-2 h-2 rounded-full bg-[#10b981] mt-1.5 shrink-0"></div> **Background Sync Killer:** Desativa os processos do Windows que 'compartilham' dados de rede com outros usuários na web de forma automática.</li>
        </ul>
      `
        }
    ];

    const faqItems = [
        {
            question: "Mudar a senha da Wi-Fi é o suficiente?",
            answer: "Normalmente sim, mas se o invasor tiver acesso ao seu PC via rede local (lan), ele pode recapturar a senha. Use o Voltris para blindar o compartilhamento de pastas do Windows e prevenir esse acesso."
        },
        {
            question: "O Voltris expulsa o vizinho da minha Wi-Fi?",
            answer: "Não diretamente do roteador, mas ele corta o acesso deles às pastas e arquivos do seu computador, e otimiza a sua placa de rede para que você tenha prioridade na banda sobre qualquer outro dispositivo."
        }
    ];

    const relatedGuides = [
        { href: "/como-escolher-melhor-dns-windows-11", title: "Navegação Rápida", description: "Melhore sua rede após proteger sua Wi-Fi." },
        { href: "/guia-definitivo-privacidade-windows-2026", title: "Privacidade", description: "Proteja seus dados contra rastreadores de rede." }
    ];

    return (
        <GuideTemplateClient
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="12 min"
            difficultyLevel="Intermediário"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
            faqItems={faqItems}
            showVoltrisOptimizerCTA={true}
            keyPoints={[
                "Identificar invasores via CMD (ARP Scan)",
                "Troca de nomenclatura e segurança WPA3 recomendada",
                "Gestão de perfis de rede (Privada vs Pública)",
                "Otimização de protocolos de rede sem fio",
                "Bloqueio de vulnerabilidades de roteamento DNS"
            ]}
        />
    );
}
